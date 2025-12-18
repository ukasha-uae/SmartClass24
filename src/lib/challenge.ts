// Challenge Arena - Competitive Quiz System
import { getSchoolById } from './schools';
import { QuestionDifficulty } from './bece-questions';
import { getChallengeQuestions, getAvailableSubjects, type EducationLevel } from './challenge-questions';
import { createInAppNotification } from './in-app-notifications';
import { calculateXP, checkAchievements } from './gamification';

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
  achievements: string[]; // Array of achievement IDs
  level: EducationLevel; // JHS or SHS
}

export interface Challenge {
  id: string;
  type: 'quick' | 'scheduled' | 'school' | 'tournament' | 'practice' | 'boss';
  level: EducationLevel; // JHS or SHS
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  type: 'mcq' | 'fillblank' | 'truefalse';
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  source: 'bece' | 'practice';
  year?: number;
}

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
}

export interface PlayerAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number; // milliseconds
  points: number;
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

export const updatePlayerStats = (
  userId: string,
  result: 'win' | 'loss' | 'draw',
  ratingChange: number,
  xpEarned: number = 0,
  newAchievements: string[] = []
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

  // Update Achievements
  if (newAchievements.length > 0) {
    player.achievements = [...new Set([...(player.achievements || []), ...newAchievements])];
  }
  
  players[playerIndex] = player;
  localStorage.setItem('challengePlayers', JSON.stringify(players));
};

// Challenge Management

export const getAllChallenges = (): Challenge[] => {
  if (typeof window === 'undefined') return [];
  const challenges = localStorage.getItem('challenges');
  return challenges ? JSON.parse(challenges) : [];
};

export const getChallenge = (challengeId: string): Challenge | undefined => {
  const challenges = getAllChallenges();
  return challenges.find(c => c.id === challengeId);
};

export const getMyChallenges = (userId: string): Challenge[] => {
  return getAllChallenges().filter(c => 
    c.creatorId === userId || c.opponents.some(o => o.userId === userId)
  );
};

export const createChallenge = (challenge: Omit<Challenge, 'id' | 'createdAt' | 'status' | 'questions'>): Challenge => {
  const challenges = getAllChallenges();
  
  // Generate questions based on education level (JHS or SHS) with anti-repeat logic
  const questions = generateGameQuestions(challenge.level, challenge.subject, challenge.difficulty, challenge.questionCount, challenge.creatorId);
  
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
  
  // Send notifications to opponents (deferred to avoid React state update during render)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      challenge.opponents.forEach(opponent => {
        if (opponent.status === 'invited') {
          createChallengeNotification(newChallenge, opponent.userId);
        }
      });
    }, 0);
  }
  
  return newChallenge;
};

export const acceptChallenge = (challengeId: string, userId: string): boolean => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return false;
  
  const challenge = challenges[challengeIndex];
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
  return true;
};

export const declineChallenge = (challengeId: string, userId: string): boolean => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return false;
  
  const challenge = challenges[challengeIndex];
  const opponentIndex = challenge.opponents.findIndex(o => o.userId === userId);
  
  if (opponentIndex === -1) return false;
  
  challenge.opponents[opponentIndex].status = 'declined';
  
  challenges[challengeIndex] = challenge;
  localStorage.setItem('challenges', JSON.stringify(challenges));
  return true;
};

export const startChallenge = (challengeId: string): boolean => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return false;
  
  challenges[challengeIndex].status = 'in-progress';
  challenges[challengeIndex].startedAt = new Date().toISOString();
  
  localStorage.setItem('challenges', JSON.stringify(challenges));
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
    let answer = q.correctAnswer;
    if (!isCorrect && q.options) {
      const wrongOptions = q.options.filter(o => o !== q.correctAnswer);
      answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || q.correctAnswer;
    }

    return {
      questionId: q.id,
      answer,
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

export const submitChallengeAnswers = (
  challengeId: string,
  userId: string,
  answers: PlayerAnswer[],
  totalTimeOverride?: number
): Challenge | null => {
  const challenges = getAllChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === challengeId);
  
  if (challengeIndex === -1) return null;
  
  const challenge = challenges[challengeIndex];
  
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
  
  const player = getPlayerProfile(userId);
  const resultData = {
    userId,
    userName: player?.userName || 'Unknown',
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
    challenge.results[existingResultIndex] = resultData;
  } else {
    challenge.results.push(resultData);
  }

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
  
  // Check if all players finished
  const creatorFinished = challenge.results.some(r => r.userId === challenge.creatorId);
  const allOpponentsFinished = challenge.opponents.length === 0 || challenge.opponents.every(o => o.status === 'finished');
  const allFinished = creatorFinished && allOpponentsFinished;
  
  // CRITICAL: Save challenge to localStorage FIRST before calling completeChallenge
  challenges[challengeIndex] = challenge;
  localStorage.setItem('challenges', JSON.stringify(challenges));
  
  if (allFinished && challenge.status !== 'completed') {
    completeChallenge(challenge);
    // Get the freshly saved challenge after completeChallenge
    const freshChallenges = getAllChallenges();
    return freshChallenges.find(c => c.id === challengeId) || challenge;
  }
  
  // Return the updated challenge
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

    updatePlayerStats(result.userId, playerResult, ratingChange, xpEarned, newAchievements);
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
    let answer = q.correctAnswer;
    if (!isCorrect && q.options) {
      const wrongOptions = q.options.filter(o => o !== q.correctAnswer);
      answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }

    return {
      questionId: q.id,
      answer,
      isCorrect,
      timeSpent: 5000 * boss.speedFactor, // Simulated time per question
      points: isCorrect ? q.points : 0
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
  if (subject === 'math') mappedSubject = level === 'JHS' ? 'Mathematics' : 'Core Mathematics';
  if (subject === 'english') mappedSubject = 'English Language';
  if (subject === 'science') mappedSubject = level === 'JHS' ? 'Science' : 'Integrated Science';
  if (subject === 'social') mappedSubject = 'Social Studies';

  // Use the new unified challenge questions system with anti-repeat logic
  const challengeQuestions = getChallengeQuestions(
    level,
    subject === 'general' ? 'Mixed' : mappedSubject,
    difficulty as QuestionDifficulty,
    count,
    userId
  );
  
  return challengeQuestions.map(q => ({
    id: q.id,
    question: q.question,
    type: 'mcq' as const,
    options: q.options,
    correctAnswer: q.options[q.correctAnswer],
    points: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5,
    explanation: q.explanation || '',
    source: level === 'JHS' ? 'bece' : 'wassce' as 'bece' | 'practice',
    year: 2024,
  }));
};

// Notifications

const createChallengeNotification = (challenge: Challenge, recipientId: string): void => {
  createInAppNotification({
    userId: recipientId,
    type: 'challenge_invite',
    title: 'New Challenge Invitation',
    message: `${challenge.creatorName} from ${challenge.creatorSchool} has challenged you to a ${challenge.subject} duel!`,
    data: {
      challengeId: challenge.id,
      from: challenge.creatorName,
      fromSchool: challenge.creatorSchool,
      subject: challenge.subject,
      scheduledTime: challenge.scheduledTime,
    },
    actionUrl: `/challenge-arena/play/${challenge.id}`
  });
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

// Initialize Sample Data

export const initializeChallengeData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Create sample players
  if (!localStorage.getItem('challengePlayers')) {
    const samplePlayers: Player[] = [
      {
        userId: 'user-1',
        userName: 'Kwame Asante',
        school: 'Accra Community School',
        rating: 1200,
        wins: 15,
        losses: 5,
        draws: 2,
        totalGames: 22,
        winStreak: 3,
        highestStreak: 8,
        xp: 2500,
        achievements: ['first_blood', 'warrior', 'rising_star'],
        level: 'JHS'
      },
      {
        userId: 'user-2',
        userName: 'Ama Osei',
        school: 'Kumasi High School',
        rating: 1150,
        wins: 12,
        losses: 8,
        draws: 1,
        totalGames: 21,
        winStreak: 0,
        highestStreak: 5,
        xp: 1800,
        achievements: ['first_blood', 'warrior'],
        level: 'JHS'
      },
      {
        userId: 'user-3',
        userName: 'Kofi Mensah',
        school: 'Achimota School',
        rating: 1350,
        wins: 25,
        losses: 2,
        draws: 3,
        totalGames: 30,
        winStreak: 8,
        highestStreak: 12,
        xp: 4500,
        achievements: ['first_blood', 'warrior', 'rising_star', 'on_fire', 'unstoppable'],
        level: 'SHS'
      },
      {
        userId: 'user-4',
        userName: 'Abena Darko',
        school: 'Wesley Girls High School',
        rating: 1280,
        wins: 18,
        losses: 4,
        draws: 0,
        totalGames: 22,
        winStreak: 2,
        highestStreak: 6,
        xp: 3200,
        achievements: ['first_blood', 'warrior', 'rising_star'],
        level: 'SHS'
      },
      {
        userId: 'user-5',
        userName: 'Yaw Boateng',
        school: 'Prempeh College',
        rating: 1310,
        wins: 20,
        losses: 5,
        draws: 1,
        totalGames: 26,
        winStreak: 4,
        highestStreak: 9,
        xp: 3800,
        achievements: ['first_blood', 'warrior', 'rising_star', 'on_fire'],
        level: 'JHS'
      },
      {
        userId: 'user-6',
        userName: 'Esi Aidoo',
        school: 'Holy Child School',
        rating: 1180,
        wins: 10,
        losses: 8,
        draws: 2,
        totalGames: 20,
        winStreak: 1,
        highestStreak: 4,
        xp: 1500,
        achievements: ['first_blood', 'warrior'],
        level: 'SHS'
      },
      {
        userId: 'user-7',
        userName: 'Kojo Antwi',
        school: 'Mfantsipim School',
        rating: 1220,
        wins: 14,
        losses: 6,
        draws: 0,
        totalGames: 20,
        winStreak: 2,
        highestStreak: 5,
        xp: 2100,
        achievements: ['first_blood', 'warrior', 'rising_star'],
        level: 'JHS'
      },
      {
        userId: 'user-8',
        userName: 'Akosua Serwaa',
        school: 'Yaa Asantewaa Girls',
        rating: 1190,
        wins: 11,
        losses: 7,
        draws: 2,
        totalGames: 20,
        winStreak: 0,
        highestStreak: 3,
        xp: 1600,
        achievements: ['first_blood', 'warrior'],
        level: 'JHS'
      }
    ];
    localStorage.setItem('challengePlayers', JSON.stringify(samplePlayers));
  }
};
