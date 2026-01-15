// Challenge Arena - Competitive Quiz System
import { getSchoolById } from './schools';
import { QuestionDifficulty } from './bece-questions';
import { getChallengeQuestions, getAvailableSubjects, type EducationLevel } from './challenge-questions-exports';
import { calculateXP, calculateCoins, checkAchievements } from './gamification';
import { getCoinMultiplier, getQuestionLimit } from './monetization';
import { trackQuestionUsage } from './analytics';
import { createUserNotification } from './realtime-notifications';
import { initializeFirebase } from '@/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, onSnapshot, serverTimestamp, runTransaction } from 'firebase/firestore';

export interface Player {
  userId: string;
  userName: string;
  school: string;
  schoolId?: string;
  schoolRegion?: string;
  avatar?: string;
  rating: number; // ELO rating
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winStreak: number;
  highestStreak: number;
  isVerified?: boolean; // Verified student status
  xp: number;
  coins: number; // Wallet/coin balance
  achievements: string[]; // Array of achievement IDs
  level: EducationLevel; // JHS or SHS
}

export interface Challenge {
  id: string;
  type: 'quick' | 'scheduled' | 'school' | 'tournament' | 'practice' | 'boss';
  level: EducationLevel; // JHS or SHS
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3' | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';
  questionCount: number;
  timeLimit: number; // seconds per question
  
  // Creator info
  creatorId: string;
  creatorName: string;
  creatorSchool: string;
  
  // Opponents
  opponents: ChallengeOpponent[];
  maxPlayers: number;
  
  // Scheduling
  scheduledTime?: string;
  expiresAt?: string;
  
  // Status
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'expired';
  
  // Game data
  questions: GameQuestion[];
  
  // Results
  results?: GameResult[];
  winner?: string;
  
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ChallengeOpponent {
  userId: string;
  userName: string;
  school: string;
  status: 'invited' | 'accepted' | 'declined' | 'playing' | 'finished';
  acceptedAt?: string;
  score?: number;
  timeTaken?: number; // milliseconds
}

export interface GameQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fillblank' | 'truefalse' | 'multiple_select' | 'number_input';
  options?: string[];
  correctAnswer: string | string[] | number; // Can be string, array of strings, or number
  correctAnswers?: string[]; // For multiple select
  points: number;
  explanation?: string;
  source: 'bece' | 'wassce' | 'practice';
  year?: number;
  questionNumber?: string; // Question number from WASSCE/SSCE paper (e.g., "001", "15") - DEPRECATED: use verifiedQuestionNumber
  paper?: 1 | 2; // WASSCE paper number: 1 = MCQ/Objective, 2 = Theory/Essay
  verifiedQuestionNumber?: number; // Actual question number from WASSCE paper (only set when verified against official papers)
  unit?: string; // For number input questions
  alternatives?: string[]; // Alternative correct answers for fillblank
}

/**
 * Check if an answer is correct for a given question
 */
export const checkGameQuestionAnswer = (question: GameQuestion, answer: any): boolean => {
  if (question.type === 'mcq') {
    // For MCQ, answer can be index or option string
    if (typeof answer === 'number' && question.options) {
      return question.options[answer] === question.correctAnswer;
    }
    return String(answer).toLowerCase() === String(question.correctAnswer).toLowerCase();
  }

  if (question.type === 'truefalse') {
    const correctAnswer =
      String(question.correctAnswer).toLowerCase().trim() === 'true';
    const userBool =
      typeof answer === 'boolean'
        ? answer
        : String(answer).toLowerCase().trim() === 'true';
    return userBool === correctAnswer;
  }

  if (question.type === 'fillblank') {
    const userAnswer = String(answer).toLowerCase().trim();
    const correctAnswer = String(question.correctAnswer).toLowerCase().trim();
    const alternatives = (question.alternatives || []).map(a => String(a).toLowerCase().trim());
    return userAnswer === correctAnswer || alternatives.includes(userAnswer);
  }

  if (question.type === 'number_input') {
    const userNum = typeof answer === 'number' ? answer : parseFloat(String(answer));
    const correctNum = typeof question.correctAnswer === 'number' 
      ? question.correctAnswer 
      : parseFloat(String(question.correctAnswer));
    
    if (isNaN(userNum) || isNaN(correctNum)) return false;
    
    // Allow small tolerance for floating point numbers (0.01)
    return Math.abs(userNum - correctNum) < 0.01;
  }

  if (question.type === 'multiple_select') {
    if (!Array.isArray(answer)) return false;
    
    const correctAnswers = question.correctAnswers || 
      (Array.isArray(question.correctAnswer) ? question.correctAnswer : []);
    
    // Convert to strings and sort for comparison
    const userAnswers = answer.map(a => String(a).toLowerCase()).sort();
    const correctAnswersLower = correctAnswers.map(a => String(a).toLowerCase()).sort();
    
    // Must have same length and all match
    if (userAnswers.length !== correctAnswersLower.length) return false;
    
    return userAnswers.every((ans, idx) => ans === correctAnswersLower[idx]);
  }

  return false;
};

export interface GameResult {
  userId: string;
  userName: string;
  school: string;
  answers: PlayerAnswer[];
  score: number;
  correctAnswers: number;
  totalTime: number; // milliseconds
  accuracy: number; // percentage
  rank: number;
  ratingChange: number;
  coinsEarned?: number; // Coin rewards
}

export interface PlayerAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number; // milliseconds
  points: number;
}

// ============================================
// Subject Mastery & Auto-Promotion (Local Only)
// ============================================

type SHSClassLevel = 'SHS 1' | 'SHS 2' | 'SHS 3';
type JHSClassLevel = 'JHS 1' | 'JHS 2' | 'JHS 3';
type PrimaryClassLevel =
  | 'Primary 1'
  | 'Primary 2'
  | 'Primary 3'
  | 'Primary 4'
  | 'Primary 5'
  | 'Primary 6';

type ClassLevelForPromotion = SHSClassLevel | JHSClassLevel | PrimaryClassLevel;

interface SubjectMasteryRecord {
  userId: string;
  level: EducationLevel;      // 'SHS', 'JHS', or 'Primary' for auto-promotion
  subject: string;
  classLevel: ClassLevelForPromotion;  // SHS 1/2/3, JHS 1/2/3, or Primary 1-6
  totalQuestions: number;     // total questions answered at this classLevel
  totalCorrect: number;       // number answered correctly
  challengesPlayed: number;   // how many challenges contributed
  recentChallenges?: number[]; // Track recent challenge accuracies for demotion (last 5)
}

export interface PromotionInfo {
  wasPromoted: boolean;
  effectiveLevel: string;
  requestedLevel: string;
  promotionOccurred: boolean;
}

export interface PromotionProgress {
  currentLevel: string;
  nextLevel: string;
  challengesCompleted: number;
  challengesRequired: number;
  currentAccuracy: number;
  accuracyRequired: number;
  progressPercentage: number;
  canPromote: boolean;
}

interface SubjectMasteryState {
  [key: string]: SubjectMasteryRecord;
}

const SUBJECT_MASTERY_STORAGE_KEY = 'africlass24_subject_mastery_v1';

function getSubjectMasteryState(): SubjectMasteryState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SUBJECT_MASTERY_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SubjectMasteryState;
  } catch {
    return {};
  }
}

function saveSubjectMasteryState(state: SubjectMasteryState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBJECT_MASTERY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort only – ignore storage errors
  }
}

function getSubjectMasteryKey(
  userId: string,
  level: EducationLevel,
  subject: string,
  classLevel: ClassLevelForPromotion
): string {
  return `${userId}|${level}|${subject}|${classLevel}`;
}

/**
 * Update local mastery stats after a challenge result.
 * Used for SHS, JHS, and Primary levels to drive auto-promotion between class levels.
 */
function updateSubjectMasteryFromResult(
  challenge: Challenge,
  result: GameResult
): void {
  if (typeof window === 'undefined') return;
  if (challenge.level !== 'SHS' && challenge.level !== 'JHS' && challenge.level !== 'Primary') return;

  // Only auto-promote for real students, not AI bosses
  if (!result.userId || result.userId.startsWith('boss-')) return;

  // Check if difficulty is a valid class level for this education level
  const classLevel = challenge.difficulty as ClassLevelForPromotion;
  const isValidSHS =
    challenge.level === 'SHS' &&
    (classLevel === 'SHS 1' || classLevel === 'SHS 2' || classLevel === 'SHS 3');
  const isValidJHS =
    challenge.level === 'JHS' &&
    (classLevel === 'JHS 1' || classLevel === 'JHS 2' || classLevel === 'JHS 3');
  const isValidPrimary =
    challenge.level === 'Primary' &&
    (classLevel === 'Primary 1' ||
      classLevel === 'Primary 2' ||
      classLevel === 'Primary 3' ||
      classLevel === 'Primary 4' ||
      classLevel === 'Primary 5' ||
      classLevel === 'Primary 6');

  if (!isValidSHS && !isValidJHS && !isValidPrimary) return;

  const questionsAnswered = result.answers?.length || 0;
  if (questionsAnswered === 0) return;

  const correctAnswers = result.answers.filter(a => a.isCorrect).length;

  const state = getSubjectMasteryState();
  const key = getSubjectMasteryKey(result.userId, challenge.level, challenge.subject, classLevel);
  const existing = state[key];

  const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  const recentChallenges = existing?.recentChallenges || [];
  recentChallenges.push(accuracy);
  // Keep only last 5 challenges for demotion logic
  if (recentChallenges.length > 5) {
    recentChallenges.shift();
  }

  const updated: SubjectMasteryRecord = {
    userId: result.userId,
    level: challenge.level,
    subject: challenge.subject,
    classLevel,
    totalQuestions: (existing?.totalQuestions || 0) + questionsAnswered,
    totalCorrect: (existing?.totalCorrect || 0) + correctAnswers,
    challengesPlayed: (existing?.challengesPlayed || 0) + 1,
    recentChallenges,
  };

  state[key] = updated;
  saveSubjectMasteryState(state);
}

/**
 * Decide which SHS class level to actually use when generating questions,
 * based on local mastery. We only ever promote upwards (1 -> 2 -> 3).
 */
function getEffectiveSHSClassLevel(
  userId: string,
  subject: string,
  requestedClassLevel: string
): string {
  if (requestedClassLevel !== 'SHS 1' && requestedClassLevel !== 'SHS 2' && requestedClassLevel !== 'SHS 3') {
    return requestedClassLevel;
  }
  if (typeof window === 'undefined') return requestedClassLevel;

  const state = getSubjectMasteryState();
  const classOrder: SHSClassLevel[] = ['SHS 1', 'SHS 2', 'SHS 3'];
  let currentLevel = requestedClassLevel as SHSClassLevel;

  // Simple promotion rule:
  // - at least 5 challenges played at that classLevel
  // - accuracy (totalCorrect / totalQuestions) >= 80%
  for (let i = 0; i < classOrder.length - 1; i++) {
    const level = classOrder[i];
    if (currentLevel !== level) continue;

    const key = getSubjectMasteryKey(userId, 'SHS', subject, level);
    const record = state[key];
    if (!record) break;

    if (record.challengesPlayed >= 5 && record.totalQuestions > 0) {
      const accuracy = record.totalCorrect / record.totalQuestions;
      if (accuracy >= 0.8) {
        // Promote to next level
        currentLevel = classOrder[i + 1];
        continue;
      }
    }
    break;
  }

  return currentLevel;
}

/**
 * Decide which JHS class level to actually use when generating questions,
 * based on local mastery. We only ever promote upwards (1 -> 2 -> 3).
 */
function getEffectiveJHSClassLevel(
  userId: string,
  subject: string,
  requestedClassLevel: string
): string {
  if (requestedClassLevel !== 'JHS 1' && requestedClassLevel !== 'JHS 2' && requestedClassLevel !== 'JHS 3') {
    return requestedClassLevel;
  }
  if (typeof window === 'undefined') return requestedClassLevel;

  const state = getSubjectMasteryState();
  const classOrder: JHSClassLevel[] = ['JHS 1', 'JHS 2', 'JHS 3'];
  let currentLevel = requestedClassLevel as JHSClassLevel;

  // Simple promotion rule:
  // - at least 5 challenges played at that classLevel
  // - accuracy (totalCorrect / totalQuestions) >= 80%
  for (let i = 0; i < classOrder.length - 1; i++) {
    const level = classOrder[i];
    if (currentLevel !== level) continue;

    const key = getSubjectMasteryKey(userId, 'JHS', subject, level);
    const record = state[key];
    if (!record) break;

    if (record.challengesPlayed >= 5 && record.totalQuestions > 0) {
      const accuracy = record.totalCorrect / record.totalQuestions;
      if (accuracy >= 0.8) {
        // Promote to next level
        currentLevel = classOrder[i + 1];
        continue;
      }
    }
    break;
  }

  return currentLevel;
}

/**
 * Decide which Primary class level to actually use when generating questions,
 * based on local mastery. Supports promotion and demotion.
 */
function getEffectivePrimaryClassLevel(
  userId: string,
  subject: string,
  requestedClassLevel: string
): string {
  const primaryLevels: PrimaryClassLevel[] = [
    'Primary 1',
    'Primary 2',
    'Primary 3',
    'Primary 4',
    'Primary 5',
    'Primary 6',
  ];

  if (!primaryLevels.includes(requestedClassLevel as PrimaryClassLevel)) {
    return requestedClassLevel;
  }
  if (typeof window === 'undefined') return requestedClassLevel;

  const state = getSubjectMasteryState();
  let currentLevel = requestedClassLevel as PrimaryClassLevel;
  const requestedIndex = primaryLevels.indexOf(currentLevel);

  // Check for demotion first (if at a level higher than requested)
  for (let i = requestedIndex + 1; i < primaryLevels.length; i++) {
    const level = primaryLevels[i];
    const key = getSubjectMasteryKey(userId, 'Primary', subject, level);
    const record = state[key];
    
    if (record && record.recentChallenges && record.recentChallenges.length >= 3) {
      const recentAvg = record.recentChallenges.reduce((a, b) => a + b, 0) / record.recentChallenges.length;
      if (recentAvg < 0.6) {
        // Demote: recent performance is poor
        return requestedClassLevel; // Return to requested level
      }
    }
  }

  // Promotion rule:
  // - at least 5 challenges played at that classLevel
  // - accuracy (totalCorrect / totalQuestions) >= 80%
  for (let i = 0; i < primaryLevels.length - 1; i++) {
    const level = primaryLevels[i];
    if (currentLevel !== level) continue;

    const key = getSubjectMasteryKey(userId, 'Primary', subject, level);
    const record = state[key];
    if (!record) break;

    if (record.challengesPlayed >= 5 && record.totalQuestions > 0) {
      const accuracy = record.totalCorrect / record.totalQuestions;
      if (accuracy >= 0.8) {
        // Promote to next level
        currentLevel = primaryLevels[i + 1];
        continue;
      }
    }
    break;
  }

  return currentLevel;
}

/**
 * Get promotion info for Primary level
 */
export function getPrimaryPromotionInfo(
  userId: string,
  subject: string,
  requestedClassLevel: string
): PromotionInfo {
  const effectiveLevel = getEffectivePrimaryClassLevel(userId, subject, requestedClassLevel);
  return {
    wasPromoted: effectiveLevel !== requestedClassLevel,
    effectiveLevel,
    requestedLevel: requestedClassLevel,
    promotionOccurred: effectiveLevel !== requestedClassLevel,
  };
}

/**
 * Get promotion progress for Primary level
 */
export function getPrimaryPromotionProgress(
  userId: string,
  subject: string,
  classLevel: string
): PromotionProgress | null {
  if (typeof window === 'undefined') return null;

  const primaryLevels: PrimaryClassLevel[] = [
    'Primary 1',
    'Primary 2',
    'Primary 3',
    'Primary 4',
    'Primary 5',
    'Primary 6',
  ];

  if (!primaryLevels.includes(classLevel as PrimaryClassLevel)) return null;
  const currentIndex = primaryLevels.indexOf(classLevel as PrimaryClassLevel);
  if (currentIndex === primaryLevels.length - 1) return null; // Already at max level

  const state = getSubjectMasteryState();
  const key = getSubjectMasteryKey(userId, 'Primary', subject, classLevel as PrimaryClassLevel);
  const record = state[key];

  if (!record) {
    return {
      currentLevel: classLevel,
      nextLevel: primaryLevels[currentIndex + 1],
      challengesCompleted: 0,
      challengesRequired: 5,
      currentAccuracy: 0,
      accuracyRequired: 0.8,
      progressPercentage: 0,
      canPromote: false,
    };
  }

  const accuracy = record.totalQuestions > 0 ? record.totalCorrect / record.totalQuestions : 0;
  const challengesProgress = Math.min(record.challengesPlayed / 5, 1);
  const accuracyProgress = Math.min(accuracy / 0.8, 1);
  const progressPercentage = (challengesProgress + accuracyProgress) / 2 * 100;

  return {
    currentLevel: classLevel,
    nextLevel: primaryLevels[currentIndex + 1],
    challengesCompleted: record.challengesPlayed,
    challengesRequired: 5,
    currentAccuracy: accuracy,
    accuracyRequired: 0.8,
    progressPercentage,
    canPromote: record.challengesPlayed >= 5 && accuracy >= 0.8,
  };
}

/**
 * Reset mastery stats for a specific subject and class level
 */
export function resetSubjectMastery(
  userId: string,
  level: EducationLevel,
  subject: string,
  classLevel?: ClassLevelForPromotion
): void {
  if (typeof window === 'undefined') return;
  
  const state = getSubjectMasteryState();
  
  if (classLevel) {
    // Reset specific class level
    const key = getSubjectMasteryKey(userId, level, subject, classLevel);
    delete state[key];
  } else {
    // Reset all class levels for this subject
    const keys = Object.keys(state);
    keys.forEach(key => {
      const [uId, lvl, subj] = key.split('|');
      if (uId === userId && lvl === level && subj === subject) {
        delete state[key];
      }
    });
  }
  
  saveSubjectMasteryState(state);
}

/**
 * Get all mastery records for a user and subject
 */
export function getUserSubjectMastery(
  userId: string,
  level: EducationLevel,
  subject: string
): SubjectMasteryRecord[] {
  if (typeof window === 'undefined') return [];
  
  const state = getSubjectMasteryState();
  const records: SubjectMasteryRecord[] = [];
  
  Object.values(state).forEach(record => {
    if (record.userId === userId && record.level === level && record.subject === subject) {
      records.push(record);
    }
  });
  
  return records;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'single-elimination' | 'round-robin';
  subject: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  participants: TournamentParticipant[];
  brackets?: TournamentBracket[];
  status: 'registration' | 'in-progress' | 'completed';
  prizes: TournamentPrize[];
  createdBy: string;
}

export interface TournamentParticipant {
  userId: string;
  userName: string;
  school: string;
  rating: number;
  registeredAt: string;
  eliminated: boolean;
  finalRank?: number;
}

export interface TournamentBracket {
  round: number;
  matchNumber: number;
  player1: string;
  player2: string;
  winner?: string;
  challengeId?: string;
  scheduledTime?: string;
  completed: boolean;
}

export interface TournamentPrize {
  rank: number;
  reward: string;
  badgeId?: string;
  xpBonus?: number;
}

export interface SchoolRanking {
  school: string;
  schoolId?: string;
  schoolRegion?: string;
  schoolType?: string;
  totalStudents: number;
  totalGames: number;
  totalWins: number;
  averageRating: number;
  points: number;
  rank: number;
}

export interface MatchHistory {
  challengeId: string;
  type: 'quick' | 'scheduled' | 'school' | 'tournament' | 'practice' | 'boss';
  date: string;
  subject: string;
  opponents: string[];
  myScore: number;
  myRank: number;
  result: 'win' | 'loss' | 'draw';
  ratingChange: number;
  timeTaken: number;
}

// Challenge Functions

export const getPlayerProfile = (userId: string): Player | null => {
  if (typeof window === 'undefined') return null;
  const players = localStorage.getItem('challengePlayers');
  if (!players) return null;
  const allPlayers: Player[] = JSON.parse(players);
  return allPlayers.find(p => p.userId === userId) || null;
};

export const createOrUpdatePlayer = (player: Partial<Player> & { userId: string }): Player => {
  const players = getAllPlayers();
  const existingIndex = players.findIndex(p => p.userId === player.userId);
  
  if (existingIndex > -1) {
    players[existingIndex] = { ...players[existingIndex], ...player };
    localStorage.setItem('challengePlayers', JSON.stringify(players));
    return players[existingIndex];
  } else {
    const newPlayer: Player = {
      userId: player.userId,
      userName: player.userName || 'Unknown',
      school: player.school || 'Unknown School',
      avatar: player.avatar,
      rating: 1000, // Starting ELO
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      winStreak: 0,
      highestStreak: 0,
      xp: 0,
      coins: 0, // Starting coins
      achievements: [],
      level: player.level || 'JHS',
    };
    players.push(newPlayer);
    localStorage.setItem('challengePlayers', JSON.stringify(players));
    return newPlayer;
  }
};

export const getAllPlayers = (): Player[] => {
  if (typeof window === 'undefined') return [];
  const players = localStorage.getItem('challengePlayers');
  return players ? JSON.parse(players) : [];
};

/**
 * Update player's userName from Firestore student profile
 * This syncs the challenge arena display name with the registered student name
 */
export const syncPlayerNameFromFirestore = async (userId: string): Promise<string | null> => {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return null;
    
    const { doc, getDoc } = await import('firebase/firestore');
    const profileRef = doc(firestore, `students/${userId}`);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const profileData = profileSnap.data();
      const studentName = profileData?.studentName;
      
      if (studentName) {
        // Update player profile with actual student name
        const player = getPlayerProfile(userId);
        if (player) {
          createOrUpdatePlayer({
            ...player,
            userName: studentName
          });
        }
        return studentName;
      }
    }
    return null;
  } catch (error) {
    console.warn('[Challenge] Failed to sync player name from Firestore:', error);
    return null;
  }
};


export const updatePlayerStats = (
  userId: string,
  result: 'win' | 'loss' | 'draw',
  ratingChange: number,
  xpEarned: number = 0,
  newAchievements: string[] = [],
  coinsEarned: number = 0
): void => {
  const players = getAllPlayers();
  const playerIndex = players.findIndex(p => p.userId === userId);
  
  if (playerIndex === -1) return;
  
  const player = players[playerIndex];
  player.totalGames++;
  player.rating += ratingChange;
  
  if (result === 'win') {
    player.wins++;
    player.winStreak++;
    if (player.winStreak > player.highestStreak) {
      player.highestStreak = player.winStreak;
    }
  } else {
    player.winStreak = 0;
    if (result === 'loss') player.losses++;
    else player.draws++;
  }

  // Update XP
  player.xp = (player.xp || 0) + xpEarned;

  // Update Coins
  player.coins = (player.coins || 0) + coinsEarned;

  // Update Achievements
  if (newAchievements.length > 0) {
    player.achievements = [...new Set([...(player.achievements || []), ...newAchievements])];
  }
  
  players[playerIndex] = player;
  localStorage.setItem('challengePlayers', JSON.stringify(players));
};

// Challenge Management

// Helper function to remove undefined values recursively
function removeUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedValues(item)).filter(item => item !== undefined);
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    });
    return cleaned;
  }
  
  return obj;
}

// Firestore helpers for challenges
async function saveChallengeToFirestore(challenge: Challenge): Promise<void> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return;
    const challengeRef = doc(firestore, 'challenges', challenge.id);
    
    // CRITICAL: For results array, we need to replace the entire array to preserve all results
    // setDoc with merge:true replaces arrays, so we need to ensure we always save the complete results array
    // Remove all undefined values recursively - Firestore doesn't accept undefined
    const challengeData = removeUndefinedValues({
      ...challenge,
      createdAt: challenge.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Use setDoc with merge:true - this replaces arrays, but that's OK because we always pass the complete merged results array
    await setDoc(challengeRef, challengeData, { merge: true });
  } catch (error) {
    console.error('Failed to save challenge to Firestore:', error);
  }
}

async function getChallengeFromFirestore(challengeId: string): Promise<Challenge | undefined> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return undefined;
    const challengeRef = doc(firestore, 'challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    if (challengeSnap.exists()) {
      return challengeSnap.data() as Challenge;
    }
    return undefined;
  } catch (error) {
    console.error('Failed to get challenge from Firestore:', error);
    return undefined;
  }
}

export const getAllChallenges = (): Challenge[] => {
  if (typeof window === 'undefined') return [];
  const challenges = localStorage.getItem('challenges');
  return challenges ? JSON.parse(challenges) : [];
};

export const getChallenge = async (challengeId: string): Promise<Challenge | undefined> => {
  // First check localStorage
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  const localChallenge = challengeIndex > -1 ? challenges[challengeIndex] : undefined;
  
  // Always also load from Firestore to get latest results from all players
  const firestoreChallenge = await getChallengeFromFirestore(challengeId);
  
  if (firestoreChallenge) {
    if (localChallenge) {
      // Merge Firestore results with local challenge (Firestore has latest data from all players)
      if (firestoreChallenge.results && firestoreChallenge.results.length > 0) {
        if (!localChallenge.results) {
          localChallenge.results = [];
        }
        // Merge Firestore results into local results, avoiding duplicates
        firestoreChallenge.results.forEach((firestoreResult: any) => {
          const existingIndex = localChallenge.results!.findIndex(r => r.userId === firestoreResult.userId);
          if (existingIndex > -1) {
            // Update existing result with Firestore data (has latest data)
            localChallenge.results![existingIndex] = firestoreResult;
          } else {
            // Add new result from Firestore
            localChallenge.results!.push(firestoreResult);
          }
        });
      }
      // Update other fields from Firestore (status, completedAt, etc.)
      localChallenge.status = firestoreChallenge.status || localChallenge.status;
      localChallenge.completedAt = firestoreChallenge.completedAt || localChallenge.completedAt;
      localChallenge.winner = firestoreChallenge.winner || localChallenge.winner;
      
      // Save merged challenge back to localStorage
      challenges[challengeIndex] = localChallenge;
      localStorage.setItem('challenges', JSON.stringify(challenges));
      return localChallenge;
    } else {
      // Not in localStorage, cache Firestore challenge
      challenges.push(firestoreChallenge);
      localStorage.setItem('challenges', JSON.stringify(challenges));
      return firestoreChallenge;
    }
  }
  
  // Return local challenge if Firestore fetch failed
  return localChallenge;
};

export const getMyChallenges = (userId: string): Challenge[] => {
  return getAllChallenges().filter(c => 
    c.creatorId === userId || c.opponents.some(o => o.userId === userId)
  );
};

export const createChallenge = (challenge: Omit<Challenge, 'id' | 'createdAt' | 'status' | 'questions'>): Challenge => {
  const challenges = getAllChallenges();
  
  // Generate questions based on education level (Primary, JHS, or SHS) with STRICT level filtering
  // Each level ONLY gets questions from their own level - no cross-level access
  // Question bank limiting is handled inside getChallengeQuestions (freemium model)
  // Free users: Limited question bank (10 questions per subject - they see same questions repeating)
  // Premium users: Full question bank (all available questions)
  const questions = generateGameQuestions(challenge.level, challenge.subject, challenge.difficulty, challenge.questionCount, challenge.creatorId);
  
  // Validate that questions were generated (should never be empty with proper question banks)
  if (questions.length === 0) {
    console.error(`No questions generated for level: ${challenge.level}, subject: ${challenge.subject}`);
    // This should not happen with proper question banks, but handle gracefully
  }
  
  // Auto-matchmaking for quick and school battles
  if ((challenge.type === 'quick' || challenge.type === 'school') && challenge.opponents.length === 0) {
    const allPlayers = getAllPlayers();
    const potentialOpponents = allPlayers.filter(p => 
      p.userId !== challenge.creatorId && 
      (challenge.type === 'school' ? p.school !== challenge.creatorSchool : true)
    );
    
    if (potentialOpponents.length > 0) {
      const randomOpponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
      challenge.opponents.push({
        userId: randomOpponent.userId,
        userName: randomOpponent.userName,
        school: randomOpponent.school,
        status: 'accepted' // Auto-accept for bot/mock players
      });
    }
  }

  const newChallenge: Challenge = {
    ...challenge,
    id: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: challenge.type === 'practice' ? 'in-progress' : (challenge.scheduledTime || (challenge.opponents.length > 0 && challenge.opponents[0].status === 'invited') ? 'pending' : 'accepted'),
    questions,
    createdAt: new Date().toISOString(),
  };
  
  challenges.push(newChallenge);
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  // Save to Firestore so opponent can access it, then send notifications
  if (typeof window !== 'undefined') {
    // Use setTimeout to defer to avoid React state update during render
    setTimeout(async () => {
      // Ensure user is authenticated before proceeding
      const { auth } = initializeFirebase();
      if (!auth?.currentUser) {
        console.error('[Challenge] User not authenticated - cannot create challenge notifications');
        return; // Exit early if no user
      }
      
      // Save to Firestore (don't block on this)
      saveChallengeToFirestore(newChallenge).then(() => {
        console.log('[Challenge] Challenge saved to Firestore:', newChallenge.id);
      }).catch(err => {
        console.error('[Challenge] Failed to save challenge to Firestore:', err);
      });
      
      // Send notifications to opponents (independent of Firestore save)
      console.log('[Challenge] Created challenge:', newChallenge.id, 'Opponents:', newChallenge.opponents);
      const invitedOpponents = newChallenge.opponents.filter(opponent => opponent.status === 'invited');
      
      if (invitedOpponents.length === 0) {
        console.log('[Challenge] No invited opponents to notify');
        return;
      }
      
      // Check authentication again before sending notifications
      if (!auth?.currentUser) {
        console.error('[Challenge] Cannot send notifications: user not authenticated');
        console.log('[Challenge] Notifications will be available when the opponent signs in');
        return;
      }
      
      console.log('[Challenge] User authenticated:', auth.currentUser.uid, auth.currentUser.isAnonymous ? '(anonymous)' : '(email)');
      
      const notificationPromises = invitedOpponents.map(opponent => {
        console.log('[Challenge] Sending notification to opponent:', opponent.userId, opponent.userName, opponent.school);
        return createChallengeNotification(newChallenge, opponent.userId).catch(err => {
          console.error('[Challenge] Failed to send notification to', opponent.userId, err);
          throw err; // Re-throw to catch in Promise.allSettled
        });
      });
      
      const results = await Promise.allSettled(notificationPromises);
      results.forEach((result, index) => {
        const opponent = invitedOpponents[index];
        if (result.status === 'fulfilled') {
          console.log('[Challenge] ✅ Notification sent successfully to', opponent?.userId, opponent?.userName);
        } else {
          console.error('[Challenge] ❌ Notification failed for', opponent?.userId, opponent?.userName, 'Error:', result.reason);
        }
      });
    }, 100); // Small delay to avoid React state update during render
  } else {
    // Server-side: just save to Firestore
    saveChallengeToFirestore(newChallenge).catch(err => {
      console.error('Failed to save challenge to Firestore:', err);
    });
  }
  
  return newChallenge;
};

export const acceptChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  // First try to get from localStorage
  let challenges = getAllChallenges();
  let challengeIndex = challenges.findIndex(c => c.id === challengeId);
  let challenge: Challenge | undefined;
  
  if (challengeIndex === -1) {
    // Not in localStorage, try Firestore
    const firestoreChallenge = await getChallengeFromFirestore(challengeId);
    if (!firestoreChallenge) return false;
    challenge = firestoreChallenge;
    // Add to localStorage
    challenges.push(challenge);
    challengeIndex = challenges.length - 1;
  } else {
    challenge = challenges[challengeIndex];
  }
  
  if (!challenge) return false;
  
  const opponentIndex = challenge.opponents.findIndex(o => o.userId === userId);
  if (opponentIndex === -1) return false;
  
  challenge.opponents[opponentIndex].status = 'accepted';
  challenge.opponents[opponentIndex].acceptedAt = new Date().toISOString();
  
  // Check if all opponents accepted
  if (challenge.opponents.every(o => o.status === 'accepted')) {
    challenge.status = 'accepted';
  }
  
  challenges[challengeIndex] = challenge;
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  // Update Firestore
  saveChallengeToFirestore(challenge).catch(err => {
    console.error('Failed to update challenge in Firestore:', err);
  });
  
  return true;
};

export const declineChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return false;
  
  const challenge = challenges[challengeIndex];
  const opponentIndex = challenge.opponents.findIndex(o => o.userId === userId);
  
  if (opponentIndex === -1) return false;
  
  // Mark opponent as declined
  challenge.opponents[opponentIndex].status = 'declined';
  
  // If any opponent declines, mark the challenge as expired so creator knows immediately
  // This prevents the creator from waiting indefinitely
  challenge.status = 'expired';
  
  challenges[challengeIndex] = challenge;
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  // Sync to Firestore so creator gets updated immediately
  saveChallengeToFirestore(challenge).catch(err => {
    console.error('Failed to update declined challenge in Firestore:', err);
  });
  
  // Notify the creator that their challenge was declined
  try {
    const declinerName = challenge.opponents[opponentIndex].userName;
    await createUserNotification(
      challenge.creatorId,
      {
        type: 'challenge_declined',
        title: 'Challenge Declined',
        message: `${declinerName} declined your challenge in ${challenge.subject}`,
        actionUrl: `/challenge-arena/play/${challengeId}`,
        data: {
          challengeId: challengeId,
          opponentName: declinerName,
          subject: challenge.subject,
        }
      }
    );
  } catch (error) {
    console.error('Failed to send decline notification:', error);
  }
  
  return true;
};

export const startChallenge = (challengeId: string): boolean => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return false;
  
  challenges[challengeIndex].status = 'in-progress';
  challenges[challengeIndex].startedAt = new Date().toISOString();
  
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  // Update Firestore so all clients see the started status
  saveChallengeToFirestore(challenges[challengeIndex]).catch(err => {
    console.error('Failed to update started challenge in Firestore:', err);
  });
  
  return true;
};

// AI Results Generation for School Battles
const generateSchoolAIResults = (challenge: Challenge, aiUserId: string): void => {
  const opponent = challenge.opponents.find(o => o.userId === aiUserId);
  if (!opponent) return;

  // AI difficulty based on challenge difficulty - competitive but fair
  const accuracyRate = challenge.difficulty === 'easy' ? 0.65 : 
                       challenge.difficulty === 'medium' ? 0.75 : 0.80;
  
  const answers: PlayerAnswer[] = challenge.questions.map(q => {
    const isCorrect = Math.random() < accuracyRate;
    let answer: string | number | string[] = q.correctAnswer;
    if (!isCorrect && q.options) {
      const wrongOptions = q.options.filter(o => o !== q.correctAnswer);
      answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || q.correctAnswer;
    }

    return {
      questionId: q.id,
      answer: String(Array.isArray(answer) ? answer.join(',') : answer),
      isCorrect,
      timeSpent: 4000 + Math.random() * 3000, // 4-7 seconds per question
      points: isCorrect ? q.points : 0
    };
  });

  const score = answers.reduce((sum, a) => sum + a.points, 0);
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const correctAnswersCount = answers.filter(a => a.isCorrect).length;
  const accuracy = (correctAnswersCount / answers.length) * 100;

  const resultData: GameResult = {
    userId: aiUserId,
    userName: opponent.userName,
    school: opponent.school,
    answers,
    score,
    correctAnswers: correctAnswersCount,
    totalTime,
    accuracy,
    rank: 0,
    ratingChange: 0
  };

  if (!challenge.results) challenge.results = [];
  challenge.results.push(resultData);
  
  // Mark opponent as finished
  opponent.status = 'finished';
  opponent.score = score;
  opponent.timeTaken = totalTime;
};

export const submitChallengeAnswers = async (
  challengeId: string,
  userId: string,
  answers: PlayerAnswer[],
  totalTimeOverride?: number
): Promise<Challenge | null> => {
  // First try to get from localStorage
  let challenges = getAllChallenges();
  let challengeIndex = challenges.findIndex(c => c.id === challengeId);
  let challenge: Challenge | undefined;
  
  if (challengeIndex === -1) {
    // Not in localStorage, try Firestore
    const firestoreChallenge = await getChallengeFromFirestore(challengeId);
    if (!firestoreChallenge) return null;
    challenge = firestoreChallenge;
    // Add to localStorage
    challenges.push(challenge);
    challengeIndex = challenges.length - 1;
  } else {
    challenge = challenges[challengeIndex];
    // CRITICAL: Also load from Firestore to get latest results from other players
    const firestoreChallenge = await getChallengeFromFirestore(challengeId);
    if (firestoreChallenge && firestoreChallenge.results) {
      // Merge results from Firestore with local results (don't replace, merge by userId)
      if (!challenge.results) {
        challenge.results = [];
      }
      // Merge Firestore results into local results, avoiding duplicates
      firestoreChallenge.results.forEach((firestoreResult: any) => {
        const existingIndex = challenge?.results?.findIndex(r => r.userId === firestoreResult.userId) ?? -1;
        if (challenge && challenge.results && existingIndex > -1) {
          // Update existing result with Firestore data (has latest data)
          challenge.results[existingIndex] = firestoreResult;
        } else if (challenge && challenge.results) {
          // Add new result from Firestore
          challenge.results.push(firestoreResult);
        }
      });
      challenges[challengeIndex] = challenge;
    }
  }
  
  if (!challenge) return null;
  
  const opponentIndex = challenge.opponents.findIndex(o => o.userId === userId);
  
  if (opponentIndex === -1 && challenge.creatorId !== userId) return null;
  
  // Calculate score
  const score = answers.reduce((sum, a) => sum + a.points, 0);
  const totalTime = totalTimeOverride ?? answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const correctAnswersCount = answers.filter(a => a.isCorrect).length;
  const accuracy = (correctAnswersCount / answers.length) * 100;
  
  // Update opponent or creator
  if (opponentIndex > -1) {
    challenge.opponents[opponentIndex].score = score;
    challenge.opponents[opponentIndex].timeTaken = totalTime;
    challenge.opponents[opponentIndex].status = 'finished';
  }
  
  // Initialize results if not exists
  if (!challenge.results) {
    challenge.results = [];
  }
  
  // Get player profile and sync name from Firestore student profile
  const player = getPlayerProfile(userId);
  let displayName = player?.userName || 'Unknown';
  
  // Try to get actual student name from Firestore (non-blocking)
  try {
    const syncedName = await syncPlayerNameFromFirestore(userId);
    if (syncedName) {
      displayName = syncedName;
    }
  } catch (err) {
    console.warn('[Challenge] Could not sync player name from Firestore:', err);
  }
  
  const resultData = {
    userId,
    userName: displayName,
    school: player?.school || 'Unknown',
    answers,
    score,
    correctAnswers: correctAnswersCount,
    totalTime,
    accuracy,
    rank: 0, // Will be calculated later
    ratingChange: 0, // Will be calculated later
  };

  // Check if result already exists and update or push
  const existingResultIndex = challenge.results.findIndex(r => r.userId === userId);
  if (existingResultIndex > -1) {
    console.log('[Submit Answers] Updating existing result for user:', userId, resultData.userName);
    challenge.results[existingResultIndex] = resultData;
  } else {
    console.log('[Submit Answers] Adding new result for user:', userId, resultData.userName, 'Total results now:', challenge.results.length + 1);
    challenge.results.push(resultData);
  }
  console.log('[Submit Answers] Challenge results after submission:', challenge.results.map(r => ({ userId: r.userId, userName: r.userName, score: r.score })));

  // Special handling for Boss Battles: Generate AI results immediately if user is done
  if (challenge.type === 'boss' && userId === challenge.creatorId) {
    const bossId = challenge.opponents[0].userId;
    generateAIResults(challenge, bossId);
  }
  
  // Special handling for School Battles: Generate AI opponent results if opponent is AI
  if (challenge.type === 'school' && userId === challenge.creatorId) {
    const aiOpponent = challenge.opponents.find(o => o.userId.startsWith('ai-'));
    if (aiOpponent && aiOpponent.status === 'accepted') {
      generateSchoolAIResults(challenge, aiOpponent.userId);
    }
  }
  
  // Check if all players finished (for 2-player challenges: creator + 1 opponent)
  if (!challenge) return null;
  
  const creatorFinished = challenge!.results?.some(r => r.userId === challenge!.creatorId) ?? false;
  const allOpponentsFinished = challenge.opponents.length === 0 || challenge.opponents.every(o => o.status === 'finished');
  const allFinished = creatorFinished && allOpponentsFinished;
  
  // CRITICAL: Save challenge to localStorage FIRST before calling completeChallenge
  challenges[challengeIndex] = challenge;
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  // CRITICAL: Save to Firestore using transaction to ensure we merge results correctly
  // This prevents race conditions where one player's result overwrites another's
  if (typeof window !== 'undefined') {
    try {
      const { firestore } = initializeFirebase();
      if (firestore) {
        const challengeRef = doc(firestore, 'challenges', challengeId);
        let mergedResults: any[] = [];
        
        await runTransaction(firestore, async (transaction) => {
          // Fetch the latest challenge data from Firestore
          const challengeDoc = await transaction.get(challengeRef);
          const latestChallenge = challengeDoc.exists() ? challengeDoc.data() as Challenge : null;
          
          // Merge results: combine existing Firestore results with our new result
          mergedResults = latestChallenge?.results ? [...latestChallenge.results] : [];
          
          // Find and update/insert our result
          const existingIndex = mergedResults.findIndex(r => r.userId === userId);
          if (existingIndex > -1) {
            mergedResults[existingIndex] = resultData;
          } else {
            mergedResults.push(resultData);
          }
          
          if (!challenge) return null;
          
          // ASYNC MODEL: Only mark as completed if ALL players have finished
          // Keep status as 'in-progress' until both players submit their results
          let finalStatus = challenge.status;
          if (allFinished && challenge.status !== 'completed') {
            finalStatus = 'completed';
          }
          
          // Update the challenge with merged results
          const challengeData = removeUndefinedValues({
            ...challenge,
            results: mergedResults,
            status: finalStatus,
            // Only set completedAt when all players have finished
            completedAt: allFinished ? (challenge.completedAt || new Date().toISOString()) : challenge.completedAt,
            updatedAt: serverTimestamp(),
          });
          
          transaction.set(challengeRef, challengeData, { merge: true });
        });
        
        // CRITICAL: Update the local challenge object with merged results so it's returned correctly
        challenge.results = mergedResults;
        
        // ASYNC MODEL: Only complete challenge (calculate ranks, ratings) when ALL players have finished
        if (allFinished && challenge.status !== 'completed') {
          completeChallenge(challenge);
          // Refresh from localStorage after completeChallenge updates it
          const freshChallenges = getAllChallenges();
          const updatedChallenge = freshChallenges.find(c => c.id === challengeId);
          if (updatedChallenge) {
            challenge = updatedChallenge;
          }
        }
        
        challenges[challengeIndex] = challenge;
        localStorage.setItem('challenges', JSON.stringify(challenges));
        
        console.log('[Submit Answers] ✅ Results saved to Firestore via transaction. Total results:', mergedResults.length);
        console.log('[Submit Answers] All players finished:', allFinished, 'Status:', challenge.status);
      } else {
        // Fallback to regular save if transaction fails
        await saveChallengeToFirestore(challenge).catch(err => {
          console.error('Failed to save challenge results to Firestore:', err);
        });
      }
    } catch (err) {
      console.error('Transaction failed, falling back to regular save:', err);
      // Fallback to regular save
      await saveChallengeToFirestore(challenge).catch(err => {
        console.error('Failed to save challenge results to Firestore:', err);
      });
    }
  } else {
    // Server-side: Complete challenge immediately if all finished (for AI/automated scenarios)
    if (allFinished && challenge.status !== 'completed') {
      completeChallenge(challenge);
      // Get the freshly saved challenge after completeChallenge
      const freshChallenges = getAllChallenges();
      const updatedChallenge = freshChallenges.find(c => c.id === challengeId);
      if (updatedChallenge) {
        return updatedChallenge;
      }
    }
  }
  
  // Return the updated challenge (may be incomplete if not all players finished)
  return challenges[challengeIndex];
};

export const completeChallenge = (challenge: Challenge): void => {
  if (!challenge.results) return;
  
  // Sort by score (descending), then by time (ascending)
  challenge.results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTime - b.totalTime;
  });
  
  // Assign ranks
  challenge.results.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  // Calculate ELO rating changes and Gamification rewards
  challenge.results.forEach(result => {
    const ratingChange = calculateRatingChange(result, challenge.results!);
    result.ratingChange = ratingChange;
    
    const playerResult = result.rank === 1 ? 'win' : 
      result.rank === challenge.results!.length ? 'loss' : 'draw';
    
    // Gamification Logic
    const player = getPlayerProfile(result.userId);
    let xpEarned = 0;
    let coinsEarned = 0;
    let newAchievements: string[] = [];

    if (player) {
      // Calculate XP
      xpEarned = calculateXP(
        playerResult,
        result.score,
        result.rank,
        challenge.results!.length,
        player.winStreak || 0
      );

      // Calculate Coins
      let coinsEarned = calculateCoins(
        playerResult,
        result.accuracy,
        result.score,
        result.rank,
        challenge.results!.length,
        player.winStreak || 0
      );
      
      // Apply premium multiplier (2x coins for premium users)
      const multiplier = getCoinMultiplier(result.userId);
      coinsEarned = Math.floor(coinsEarned * multiplier);

      // Check Achievements
      // We need to simulate the updated stats for the check
      const updatedStats = {
        ...player,
        wins: playerResult === 'win' ? player.wins + 1 : player.wins,
        totalGames: player.totalGames + 1,
        winStreak: playerResult === 'win' ? (player.winStreak || 0) + 1 : 0,
        xp: (player.xp || 0) + xpEarned
      };

      newAchievements = checkAchievements(updatedStats);
    }

    // Store coins earned in result
    result.coinsEarned = coinsEarned;

    // Update local subject mastery (used for SHS auto-promotion)
    updateSubjectMasteryFromResult(challenge, result);

    updatePlayerStats(result.userId, playerResult, ratingChange, xpEarned, newAchievements, coinsEarned);
  });
  
  challenge.status = 'completed';
  challenge.completedAt = new Date().toISOString();
  challenge.winner = challenge.results[0].userId;
  
  // CRITICAL: Save the updated challenge back to localStorage
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challenge.id);
  if (challengeIndex > -1) {
    challenges[challengeIndex] = challenge;
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }
  
  // Save completed challenge with final results to Firestore so both players can see results
  if (typeof window !== 'undefined') {
    saveChallengeToFirestore(challenge).catch(err => {
      console.error('Failed to save completed challenge to Firestore:', err);
    });
  }
};

const calculateRatingChange = (player: GameResult, allResults: GameResult[]): number => {
  // Simplified ELO calculation
  const K = 32; // K-factor
  const playerRating = getPlayerProfile(player.userId)?.rating || 1000;
  
  let totalChange = 0;
  allResults.forEach(opponent => {
    if (opponent.userId === player.userId) return;
    
    const opponentRating = getPlayerProfile(opponent.userId)?.rating || 1000;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actualScore = player.rank < opponent.rank ? 1 : player.rank > opponent.rank ? 0 : 0.5;
    
    totalChange += K * (actualScore - expectedScore);
  });
  
  return Math.round(totalChange);
};

// AI Boss Logic

export interface AIBoss {
  id: string;
  name: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  avatar: string; // Emoji or path
  accuracy: number; // 0-1
  speedFactor: number; // 0.5 - 1.5 (multiplier for time taken)
  xpReward: number;
}

export const AI_BOSSES: AIBoss[] = [
  {
    id: 'boss-novice',
    name: 'Kwame the Novice',
    title: 'The Beginner',
    description: 'Just starting out. Makes mistakes often.',
    difficulty: 'easy',
    avatar: '👶',
    accuracy: 0.6,
    speedFactor: 1.2, // Slower
    xpReward: 100
  },
  {
    id: 'boss-scholar',
    name: 'Ama the Scholar',
    title: 'Class Prefect',
    description: 'Studious and sharp. A worthy opponent.',
    difficulty: 'medium',
    avatar: '👩‍🏫',
    accuracy: 0.8,
    speedFactor: 1.0,
    xpReward: 250
  },
  {
    id: 'boss-professor',
    name: 'Prof. Mensah',
    title: 'The Master',
    description: 'Decades of experience. Rarely misses.',
    difficulty: 'hard',
    avatar: '👨‍🎓',
    accuracy: 0.95,
    speedFactor: 0.7, // Fast
    xpReward: 500
  },
  {
    id: 'boss-ai',
    name: 'Cyber Mind',
    title: 'The Supercomputer',
    description: 'Calculates answers in nanoseconds.',
    difficulty: 'insane',
    avatar: '🤖',
    accuracy: 0.99,
    speedFactor: 0.3, // Very Fast
    xpReward: 1000
  }
];

export const createBossChallenge = (
  userId: string,
  bossId: string,
  subject: string
): Challenge | null => {
  const player = getPlayerProfile(userId);
  if (!player) return null;

  const boss = AI_BOSSES.find(b => b.id === bossId);
  if (!boss) return null;

  // Question bank limiting is handled inside getChallengeQuestions (freemium model)
  // Free users: Limited question bank (10 questions per subject - they see same questions repeating)
  // Premium users: Full question bank (all available questions)
  const questions = generateGameQuestions(player.level, subject, boss.difficulty === 'easy' ? 'easy' : boss.difficulty === 'medium' ? 'medium' : 'hard', 10, userId);

  const challenge: Challenge = {
    id: `boss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'boss',
    level: player.level,
    subject,
    difficulty: boss.difficulty === 'insane' ? 'hard' : boss.difficulty,
    questionCount: 10,
    timeLimit: 60,
    creatorId: userId,
    creatorName: player.userName,
    creatorSchool: player.school,
    opponents: [{
      userId: boss.id,
      userName: boss.name,
      school: 'AI Academy',
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    }],
    maxPlayers: 2,
    status: 'in-progress', // Starts immediately
    questions,
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    results: []
  };

  const challenges = getAllChallenges();
  challenges.push(challenge);
  localStorage.setItem('challenges', JSON.stringify(challenges));

  return challenge;
};

const generateAIResults = (challenge: Challenge, bossId: string): void => {
  const boss = AI_BOSSES.find(b => b.id === bossId);
  if (!boss) return;

  const answers: PlayerAnswer[] = challenge.questions.map(q => {
    const isCorrect = Math.random() < boss.accuracy;
    // If correct, pick correct answer. If wrong, pick random wrong answer.
    let answer: string | number | string[] = q.correctAnswer;
    if (!isCorrect && q.options) {
      const wrongOptions = q.options.filter(o => o !== q.correctAnswer);
      answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }

    return {
      questionId: q.id,
      answer: String(Array.isArray(answer) ? answer.join(',') : answer),
      isCorrect,
      timeSpent: 5000 * boss.speedFactor, // Simulated time per question
      points: isCorrect ? (q.points || 10) : 0 // Use question's points value or default to 10
    };
  });

  const score = answers.reduce((sum, a) => sum + a.points, 0);
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const correctAnswersCount = answers.filter(a => a.isCorrect).length;
  const accuracy = (correctAnswersCount / answers.length) * 100;

  const resultData: GameResult = {
    userId: boss.id,
    userName: boss.name,
    school: 'AI Academy',
    answers,
    score,
    correctAnswers: correctAnswersCount,
    totalTime,
    accuracy,
    rank: 0,
    ratingChange: 0
  };

  if (!challenge.results) challenge.results = [];
  challenge.results.push(resultData);
  
  // Mark opponent as finished
  const opponent = challenge.opponents.find(o => o.userId === boss.id);
  if (opponent) {
    opponent.status = 'finished';
    opponent.score = score;
    opponent.timeTaken = totalTime;
  }
};

// Question Generation

const generateGameQuestions = (
  level: EducationLevel,
  subject: string,
  difficulty: string,
  count: number,
  userId: string = 'guest'
): GameQuestion[] => {
  // Handle legacy/lowercase subject names to prevent empty question sets
  let mappedSubject = subject;
  if (subject === 'math' || subject === 'Maths') {
    mappedSubject = level === 'Primary' ? 'Mathematics' : 
                    level === 'JHS' ? 'Mathematics' : 
                    'Core Mathematics';
  }
  if (subject === 'english' || subject === 'English') mappedSubject = 'English Language';
  if (subject === 'science' || subject === 'Science') {
    mappedSubject = level === 'Primary' ? 'Science' :
                    level === 'JHS' ? 'Science' : 
                    'Integrated Science';
  }
  if (subject === 'social') mappedSubject = 'Social Studies';

  // For Primary, JHS, and SHS, allow local auto-promotion between class levels based on mastery
  let effectiveDifficulty = difficulty;
  if (level === 'SHS') {
    effectiveDifficulty = getEffectiveSHSClassLevel(userId, mappedSubject, difficulty);
  } else if (level === 'JHS') {
    effectiveDifficulty = getEffectiveJHSClassLevel(userId, mappedSubject, difficulty);
  } else if (level === 'Primary') {
    effectiveDifficulty = getEffectivePrimaryClassLevel(userId, mappedSubject, difficulty);
  }

  // STRICT LEVEL FILTERING - Use the new unified challenge questions system
  // Each level ONLY gets questions from their own level
  // difficulty can now be a classLevel (JHS 1, JHS 2, etc.) or legacy difficulty
  let challengeQuestions = getChallengeQuestions(
    level,
    subject === 'general' ? 'Mixed' : mappedSubject,
    effectiveDifficulty as any, // Can be QuestionDifficulty or ClassLevel
    count,
    userId
  );
  
  // Fallback: If no questions found, try with 'Mixed' subject (SAME LEVEL)
  if (challengeQuestions.length === 0) {
    console.warn(`No questions found for ${level} ${mappedSubject}, falling back to mixed questions`);
    challengeQuestions = getChallengeQuestions(
      level, // Keep same level - STRICT filtering
      'Mixed',
      effectiveDifficulty as any,
      count,
      userId
    );
  }
  
  // Last resort: Try with easier class level or default subject (SAME LEVEL)
  if (challengeQuestions.length === 0) {
    console.warn(`No questions found for ${level}, trying with easier class level`);
    const classLevels: string[] = level === 'Primary' ? ['Primary 1', 'Primary 2', 'Primary 3'] :
                                  level === 'JHS' ? ['JHS 1', 'JHS 2', 'JHS 3'] :
                                  ['SHS 1', 'SHS 2', 'SHS 3'];
    const currentIndex = classLevels.indexOf(effectiveDifficulty);
    const fallbackClassLevel = currentIndex > 0 ? classLevels[currentIndex - 1] : classLevels[0];
    const fallbackSubject = level === 'Primary' ? 'Mathematics' :
                            level === 'JHS' ? 'Mathematics' :
                            'Core Mathematics';
    challengeQuestions = getChallengeQuestions(
      level, // Keep same level - STRICT filtering
      fallbackSubject,
      fallbackClassLevel as any,
      count,
      userId
    );
  }
  
  // Basic subject/topic usage analytics (for prioritising question banks)
  try {
    const topics = Array.from(
      new Set(
        challengeQuestions
          .map(q => q.topic)
          .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      )
    );

    trackQuestionUsage({
      level,
      subject: mappedSubject,
      difficulty: effectiveDifficulty,
      topics,
      questionCount: challengeQuestions.length,
      userId,
      timestamp: Date.now(),
    });
  } catch (e) {
    // Analytics must never break gameplay
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Question Usage Analytics] Failed to track usage', e);
    }
  }

  // Convert to GameQuestion format with variety of question types
  // Pre-calculate question types to ensure proper distribution
  // Reduced fillblank to 0% to avoid poor quality conversions
  // Only use fillblank for questions that naturally work as fill-in-the-blank
  const totalQuestions = challengeQuestions.length;
  const mcqCount = Math.floor(totalQuestions * 0.80);
  const trueFalseCount = Math.floor(totalQuestions * 0.15);
  const fillBlankCount = 0; // Disabled - conversions produce poor quality questions
  const numberInputCount = totalQuestions - mcqCount - trueFalseCount - fillBlankCount;
  
  // Create array of question types with proper distribution
  const questionTypes: Array<'mcq' | 'truefalse' | 'fillblank' | 'number_input'> = [
    ...Array(mcqCount).fill('mcq' as const),
    ...Array(trueFalseCount).fill('truefalse' as const),
    ...Array(fillBlankCount).fill('fillblank' as const),
    ...Array(numberInputCount).fill('number_input' as const)
  ];
  
  // Shuffle the types array to randomize distribution
  for (let i = questionTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionTypes[i], questionTypes[j]] = [questionTypes[j], questionTypes[i]];
  }
  
  return challengeQuestions.map((q, index) => {
    // Calculate points based on classLevel or difficulty
    let points = 5; // Default
    if (difficulty.includes('3') || difficulty === 'hard') points = 15;
    else if (difficulty.includes('2') || difficulty === 'medium') points = 10;
    else if (difficulty.includes('1') || difficulty === 'easy') points = 5;
    
    // Extract year, paper, and question number from ID
    // Formats supported:
    // - 'wassce-2023-phys-001' (Paper 1, inferred from MCQ type)
    // - 'wassce-2023-phys-p1-001' (Paper 1, explicit)
    // - 'wassce-2023-phys-p2-001' (Paper 2, explicit)
    // - 'bece-2022-math-015' (BECE, no paper designation)
    let extractedYear: number | undefined;
    let extractedPaper: 1 | 2 | undefined;
    let questionNumber: string | undefined;
    const idParts = q.id.split('-');
    
    if (idParts.length >= 4) {
      // Year is at index 1
      const yearStr = idParts[1];
      const yearNum = parseInt(yearStr, 10);
      if (!isNaN(yearNum) && yearNum >= 2000 && yearNum <= 2100) {
        extractedYear = yearNum;
      }
      
      // Check for paper designation (p1 or p2) before question number
      const lastPart = idParts[idParts.length - 1];
      const secondLastPart = idParts[idParts.length - 2];
      
      if (secondLastPart === 'p1' || secondLastPart === 'p2') {
        // Format: 'wassce-2023-phys-p1-001'
        extractedPaper = secondLastPart === 'p1' ? 1 : 2;
        questionNumber = lastPart;
      } else {
        // Format: 'wassce-2023-phys-001' (no paper designation)
        questionNumber = lastPart;
      }
    } else if (idParts.length === 3) {
      // Format might be 'wassce-2023-001'
      const yearStr = idParts[1];
      const yearNum = parseInt(yearStr, 10);
      if (!isNaN(yearNum) && yearNum >= 2000 && yearNum <= 2100) {
        extractedYear = yearNum;
      }
      questionNumber = idParts[2];
    }
    
    // Use year from question data first, fallback to extracted from ID
    const finalYear = (q as any).year || extractedYear;
    
    // Determine paper: use explicit paper field, then extracted from ID, then infer from type
    let finalPaper: 1 | 2 | undefined;
    if ((q as any).paper) {
      finalPaper = (q as any).paper;
    } else if (extractedPaper) {
      finalPaper = extractedPaper;
    } else if ((q as any).type === 'mcq' || (q as any).type === 'true-false' || (q as any).type === 'fill-blank') {
      // MCQs, True/False, and Fill-blank are typically Paper 1
      finalPaper = 1;
    } else if ((q as any).type === 'essay' || (q as any).type === 'short-answer') {
      // Essay and Short Answer are typically Paper 2
      finalPaper = 2;
    }
    
    const baseQuestion = {
      id: q.id,
      question: q.question,
      points,
      explanation: q.explanation || '',
      source: level === 'Primary' ? 'practice' : level === 'JHS' ? 'bece' : 'wassce' as 'bece' | 'wassce' | 'practice',
      year: (q as any).year || finalYear || undefined, // Use actual year from question, or extract from ID
      questionNumber: questionNumber || undefined, // Keep for backward compatibility
      paper: finalPaper, // Paper 1 or 2 (inferred from type if not explicit)
      verifiedQuestionNumber: (q as any).verifiedQuestionNumber || undefined, // Only set when verified against actual papers
    };

    // Use pre-calculated question type for this index
    const questionType = questionTypes[index] || 'mcq';
    
    if (questionType === 'mcq') {
      // MCQ (70%)
      return {
        ...baseQuestion,
        type: 'mcq' as const,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
      };
    } else if (questionType === 'truefalse') {
      // True/False (15%) - Convert MCQ to True/False
      const correctOption = q.options[q.correctAnswer];
      // Create a statement based on the question - make it more natural
      const statement = q.question.replace(/\?/g, '').trim();
      // Use index to determine true/false for consistency (alternate)
      const isTrue = index % 2 === 0;
      const wrongOption = q.options.find((opt, idx) => idx !== q.correctAnswer) || 'something else';
      return {
        ...baseQuestion,
        type: 'truefalse' as const,
        question: isTrue 
          ? `True or False: ${statement} The answer is "${correctOption}".` 
          : `True or False: ${statement} The answer is "${wrongOption}".`,
        correctAnswer: isTrue ? 'true' : 'false',
      };
    } else if (questionType === 'fillblank') {
      // Fill Blank - DISABLED: Conversions produce poor quality questions
      // Fallback to MCQ for all fillblank attempts
      // Example of poor conversion: "Which is the smallest number?" -> "The correct answer is: _____"
      return {
        ...baseQuestion,
        type: 'mcq' as const,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
      };
    } else {
      // Number Input (5%) - Only for math questions
      if (q.subject === 'Mathematics' || q.subject === 'Core Mathematics') {
        // Try to extract a number from the correct answer
        const correctOption = q.options[q.correctAnswer];
        const numberMatch = correctOption.match(/-?\d+\.?\d*/);
        if (numberMatch) {
          return {
            ...baseQuestion,
            type: 'number_input' as const,
            question: q.question,
            correctAnswer: parseFloat(numberMatch[0]),
            unit: correctOption.replace(numberMatch[0], '').trim() || undefined,
          };
        }
      }
      // Fallback to MCQ if conversion fails
      return {
        ...baseQuestion,
        type: 'mcq' as const,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
      };
    }
  });
};

// Notifications

const createChallengeNotification = async (challenge: Challenge, recipientId: string): Promise<void> => {
  try {
    console.log('[Challenge Notification] Creating notification for:', recipientId, 'Challenge:', challenge.id);
    console.log('[Challenge Notification] Challenge details:', {
      id: challenge.id,
      creatorName: challenge.creatorName,
      creatorSchool: challenge.creatorSchool,
      subject: challenge.subject
    });
    
    // Build data object, only including scheduledTime if it exists
    const notificationData: any = {
      challengeId: challenge.id,
      creatorId: challenge.creatorId, // Include creatorId to filter out notifications for creators
      from: challenge.creatorName,
      fromSchool: challenge.creatorSchool,
      subject: challenge.subject,
    };
    if (challenge.scheduledTime) {
      notificationData.scheduledTime = challenge.scheduledTime;
    }
    
    const notificationPayload = {
      type: 'challenge_invite' as const,
      title: 'New Challenge Invitation',
      message: `${challenge.creatorName} from ${challenge.creatorSchool} has invited you to a ${challenge.subject} challenge on SmartClass24 (S24).`,
      data: notificationData,
      actionUrl: `/challenge-arena/play/${challenge.id}`
    };
    
    console.log('[Challenge Notification] Calling createUserNotification with payload:', notificationPayload);
    const notificationId = await createUserNotification(recipientId, notificationPayload);
    console.log('[Challenge Notification] ✅ Notification created successfully for:', recipientId, 'Notification ID:', notificationId);
  } catch (err: any) {
    console.error('[Challenge Notification] ❌ Failed to create notification for', recipientId, err);
    console.error('[Challenge Notification] Error details:', {
      code: err?.code,
      message: err?.message,
      stack: err?.stack
    });
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Challenge Notification] Full error object:', err);
    }
    // Don't re-throw - we want to continue even if notification fails
  }
};

export const getChallengeNotifications = (userId: string): any[] => {
  if (typeof window === 'undefined') return [];
  const notifications = JSON.parse(localStorage.getItem('challengeNotifications') || '[]');
  return notifications.filter((n: any) => n.recipientId === userId);
};

// School Rankings

export const getSchoolRankings = (country?: string): SchoolRanking[] => {
  const players = getAllPlayers();
  
  // Filter players by country if provided
  const filteredPlayers = country 
    ? players.filter(p => {
        // Get the player's school and check if it belongs to the specified country
        // This requires the player object to have country information
        // For now, we'll filter based on school names from the country
        return true; // Will be enhanced when Player interface includes country
      })
    : players;
  
  const schoolMap = new Map<string, {
    school: string;
    totalStudents: number;
    totalGames: number;
    totalWins: number;
    points: number;
    ratings: number[]; // Store all ratings to calculate top average
  }>();
  
  filteredPlayers.forEach(player => {
    if (!schoolMap.has(player.school)) {
      schoolMap.set(player.school, {
        school: player.school,
        totalStudents: 0,
        totalGames: 0,
        totalWins: 0,
        points: 0,
        ratings: [],
      });
    }
    
    const school = schoolMap.get(player.school)!;
    school.totalStudents++;
    school.totalGames += player.totalGames;
    school.totalWins += player.wins;
    school.points += player.wins * 3; // 3 points per win
    school.ratings.push(player.rating);
  });
  
  // Convert to array and calculate robust metrics
  const rankings: SchoolRanking[] = Array.from(schoolMap.values()).map(s => {
    // Anti-Sabotage: Only calculate average rating from TOP 5 players
    // This prevents griefers (low rating) from dragging down the school's score
    const topRatings = s.ratings.sort((a, b) => b - a).slice(0, 5);
    const averageRating = topRatings.length > 0 
      ? Math.round(topRatings.reduce((a, b) => a + b, 0) / topRatings.length)
      : 0;

    return {
      school: s.school,
      totalStudents: s.totalStudents,
      totalGames: s.totalGames,
      totalWins: s.totalWins,
      averageRating,
      points: s.points,
      rank: 0,
    };
  });
  
  // Sort by Points first, then Average Rating
  rankings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.averageRating - a.averageRating;
  });
  
  // Assign ranks
  rankings.forEach((school, index) => {
    school.rank = index + 1;
  });
  
  return rankings;
};

// Match History

export const getMatchHistory = (userId: string): MatchHistory[] => {
  const challenges = getAllChallenges().filter(c => 
    c.status === 'completed' && 
    (c.creatorId === userId || c.opponents.some(o => o.userId === userId))
  );
  
  const history = challenges.map(challenge => {
    const myResult = challenge.results?.find(r => r.userId === userId);
    const opponents = challenge.opponents
      .filter(o => o.userId !== userId)
      .map(o => o.userName);
    
    if (challenge.creatorId !== userId) {
      opponents.unshift(challenge.creatorName);
    }
    
    const result: 'win' | 'loss' | 'draw' = myResult?.rank === 1 ? 'win' : 
      myResult?.rank === challenge.results?.length ? 'loss' : 'draw';
    
    return {
      challengeId: challenge.id,
      type: challenge.type,
      date: challenge.completedAt || challenge.createdAt,
      subject: challenge.subject,
      opponents,
      myScore: myResult?.score || 0,
      myRank: myResult?.rank || 0,
      result,
      ratingChange: myResult?.ratingChange || 0,
      timeTaken: myResult?.totalTime || 0,
    };
  });

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
