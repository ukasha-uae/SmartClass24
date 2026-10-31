import type { EducationLevel } from './challenge-subjects';

export interface Player {
  userId: string;
  userName: string;
  name?: string;
  email?: string;
  school: string;
  schoolId?: string;
  schoolRegion?: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winStreak: number;
  highestStreak: number;
  isVerified?: boolean;
  xp: number;
  coins: number;
  achievements: string[];
  level: EducationLevel;
}

export interface Challenge {
  id: string;
  type: 'quick' | 'scheduled' | 'school' | 'tournament' | 'practice' | 'boss';
  level: EducationLevel;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3' | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';
  questionCount: number;
  timeLimit: number;
  creatorId: string;
  creatorName: string;
  creatorSchool: string;
  opponents: ChallengeOpponent[];
  maxPlayers: number;
  scheduledTime?: string;
  expiresAt?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'expired';
  questions: GameQuestion[];
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
  timeTaken?: number;
}

export interface GameQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fillblank' | 'truefalse' | 'multiple_select' | 'number_input';
  options?: string[];
  correctAnswer: string | string[] | number;
  correctAnswers?: string[];
  points: number;
  explanation?: string;
  source: 'bece' | 'wassce' | 'practice';
  year?: number;
  questionNumber?: string;
  paper?: 1 | 2;
  verifiedQuestionNumber?: number;
  unit?: string;
  alternatives?: string[];
  conceptId?: string;
  subjectArea?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  misconceptionTags?: {
    tag: string;
    triggerCondition: (studentAnswer: string | number, correctAnswer: string | number) => boolean;
  }[];
}

export interface GameResult {
  userId: string;
  userName: string;
  school: string;
  answers: PlayerAnswer[];
  score: number;
  correctAnswers: number;
  totalTime: number;
  accuracy: number;
  rank: number;
  ratingChange: number;
  coinsEarned?: number;
}

export interface PlayerAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  conceptId?: string;
  misconceptionTag?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  subjectArea?: string;
}

export function checkGameQuestionAnswer(question: GameQuestion, answer: unknown): boolean {
  if (question.type === 'mcq') {
    if (typeof answer === 'number' && question.options) {
      return question.options[answer] === question.correctAnswer;
    }
    return String(answer).toLowerCase() === String(question.correctAnswer).toLowerCase();
  }

  if (question.type === 'truefalse') {
    const correctAnswer = String(question.correctAnswer).toLowerCase().trim() === 'true';
    const userBool = typeof answer === 'boolean'
      ? answer
      : String(answer).toLowerCase().trim() === 'true';
    return userBool === correctAnswer;
  }

  if (question.type === 'fillblank') {
    const userAnswer = String(answer).toLowerCase().trim();
    const correctAnswer = String(question.correctAnswer).toLowerCase().trim();
    const alternatives = (question.alternatives || []).map(value => value.toLowerCase().trim());
    return userAnswer === correctAnswer || alternatives.includes(userAnswer);
  }

  if (question.type === 'number_input') {
    const userNum = typeof answer === 'number' ? answer : parseFloat(String(answer));
    const correctNum = typeof question.correctAnswer === 'number'
      ? question.correctAnswer
      : parseFloat(String(question.correctAnswer));
    return !Number.isNaN(userNum) && !Number.isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.01;
  }

  if (question.type === 'multiple_select') {
    if (!Array.isArray(answer)) return false;

    const correctAnswers = question.correctAnswers ||
      (Array.isArray(question.correctAnswer) ? question.correctAnswer : []);
    const userAnswers = answer.map(value => String(value).toLowerCase()).sort();
    const expectedAnswers = correctAnswers.map(value => String(value).toLowerCase()).sort();

    return userAnswers.length === expectedAnswers.length &&
      userAnswers.every((value, index) => value === expectedAnswers[index]);
  }

  return false;
}