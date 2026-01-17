import { BookCopy, BrainCircuit, Star, Flame, Trophy, Target, Zap, Award, Crown, Medal, Gem } from 'lucide-react';

// This is a mock implementation. In a real app, this would come from a database.
// We'll use localStorage to persist some data for this simulation.

const getStoredProgress = () => {
  if (typeof window === 'undefined') {
    return { 
      completedLessons: [], 
      quizScores: [],
      lastActivityDate: null,
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0
    };
  }
  const saved = localStorage.getItem('userProgress');
  return saved ? JSON.parse(saved) : { 
    completedLessons: [], 
    quizScores: [],
    lastActivityDate: null,
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0
  };
};

const updateStreak = () => {
  if (typeof window === 'undefined') return;
  
  const progress = getStoredProgress();
  const today = new Date().toDateString();
  
  if (progress.lastActivityDate !== today) {
    const lastDate = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
      // Streak continues
      progress.currentStreak += 1;
    } else if (!lastDate || lastDate.toDateString() !== today) {
      // New streak or broken streak
      progress.currentStreak = 1;
    }
    
    progress.longestStreak = Math.max(progress.longestStreak || 0, progress.currentStreak);
    progress.lastActivityDate = today;
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }
};

export const getUserProgress = () => {
  updateStreak();
  const progress = getStoredProgress();
  const lessonsCompleted = progress.completedLessons.length;
  const quizzesTaken = progress.quizScores.length;
  const totalScore = progress.quizScores.reduce((sum: number, score: number) => sum + score, 0);
  const averageQuizScore = quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;
  
  // XP calculation: 10 XP per lesson + quiz score as XP
  const totalXP = progress.totalXP || (lessonsCompleted * 10 + totalScore);
  const level = Math.floor(totalXP / 100) + 1; // Level up every 100 XP
  const xpForNextLevel = level * 100;
  const xpProgress = totalXP % 100;
  
  const points = lessonsCompleted * 10;

  return {
    lessonsCompleted,
    quizzesTaken,
    averageQuizScore,
    points,
    currentStreak: progress.currentStreak || 0,
    longestStreak: progress.longestStreak || 0,
    totalXP,
    level,
    xpForNextLevel,
    xpProgress,
  };
};

export const addXP = (amount: number) => {
  if (typeof window === 'undefined') return;
  const progress = getStoredProgress();
  progress.totalXP = (progress.totalXP || 0) + amount;
  localStorage.setItem('userProgress', JSON.stringify(progress));
};

export const markLessonAsComplete = (lessonId: string) => {
    if (typeof window === 'undefined') return;
    const progress = getStoredProgress();
    if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.totalXP = (progress.totalXP || 0) + 10; // 10 XP per lesson
        localStorage.setItem('userProgress', JSON.stringify(progress));
        updateStreak();
    }
};

export const isLessonCompleted = (lessonId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const progress = getStoredProgress();
    return progress.completedLessons.includes(lessonId);
};


export const getAchievements = () => {
  const progress = getUserProgress();

  const allAchievements = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first lesson.',
      icon: Star,
      unlocked: progress.lessonsCompleted >= 1,
      xpReward: 10,
    },
    {
      id: 'bookworm',
      name: 'Bookworm',
      description: 'Complete 5 lessons.',
      icon: BookCopy,
      unlocked: progress.lessonsCompleted >= 5,
      xpReward: 25,
    },
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'Complete 10 lessons.',
      icon: Award,
      unlocked: progress.lessonsCompleted >= 10,
      xpReward: 50,
    },
    {
      id: 'master-learner',
      name: 'Master Learner',
      description: 'Complete 25 lessons.',
      icon: Crown,
      unlocked: progress.lessonsCompleted >= 25,
      xpReward: 100,
    },
    {
      id: 'quiz-whiz',
      name: 'Quiz Whiz',
      description: 'Complete your first quiz.',
      icon: BrainCircuit,
      unlocked: progress.quizzesTaken >= 1,
      xpReward: 15,
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Complete 10 quizzes.',
      icon: Trophy,
      unlocked: progress.quizzesTaken >= 10,
      xpReward: 50,
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 100% on a quiz.',
      icon: Target,
      unlocked: (progress as any).quizScores?.some((score: number) => score === 100) || false,
      xpReward: 50,
    },
    {
      id: 'streak-starter',
      name: 'Streak Starter',
      description: 'Maintain a 3-day study streak.',
      icon: Flame,
      unlocked: progress.currentStreak >= 3,
      xpReward: 30,
    },
    {
      id: 'committed',
      name: 'Committed',
      description: 'Maintain a 7-day study streak.',
      icon: Flame,
      unlocked: progress.currentStreak >= 7,
      xpReward: 75,
    },
    {
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Maintain a 30-day study streak.',
      icon: Flame,
      unlocked: progress.currentStreak >= 30,
      xpReward: 200,
    },
    {
      id: 'level-5',
      name: 'Rising Star',
      description: 'Reach level 5.',
      icon: Zap,
      unlocked: progress.level >= 5,
      xpReward: 100,
    },
    {
      id: 'level-10',
      name: 'Elite Student',
      description: 'Reach level 10.',
      icon: Medal,
      unlocked: progress.level >= 10,
      xpReward: 250,
    },
    {
      id: 'level-20',
      name: 'Legendary',
      description: 'Reach level 20.',
      icon: Gem,
      unlocked: progress.level >= 20,
      xpReward: 500,
    },
  ];

  return allAchievements;
};

// Sarah the Robot - AI competitor to motivate students
export const SARAH_THE_ROBOT = {
  userId: 'bot-sarah',
  name: '🤖 Sarah the Robot',
  displayName: 'Sarah',
  isBot: true,
  xp: 3500, // High score but beatable
  level: 18,
  streak: 42,
  school: 'SmartClass AI Academy',
  totalLessons: 250,
  averageQuizScore: 92,
};

/**
 * Check if a user is a test/fake account
 */
const isTestUser = (userName: string, email: string = '', userId: string = ''): boolean => {
  const testPatterns = [
    /test/i,
    /demo/i,
    /sample/i,
    /fake/i,
    /anon-/i, // Anonymous users
    /Sarah K\./i,
    /Michael A\./i,
    /Emma T\./i,
    /David L\./i,
    /Olivia M\./i,
    /James P\./i,
  ];
  
  return testPatterns.some(pattern => 
    pattern.test(userName) || 
    pattern.test(email) || 
    pattern.test(userId)
  );
};

/**
 * Get leaderboard from real Firestore data
 * @param firestore - Firestore instance (optional, if not provided returns local-only)
 * @param currentUserId - Current user's ID to highlight them
 * @param limit - Number of top users to fetch (will fetch more and filter)
 */
export const getLeaderboard = async (firestore?: any, currentUserId?: string, limit: number = 20) => {
  try {
    if (!firestore) {
      // Fallback to local data only (for non-authenticated users)
      const currentUserProgress = getUserProgress();
      return [
        { ...SARAH_THE_ROBOT, rank: 1 },
        { rank: 2, name: 'You', userId: 'local', level: currentUserProgress.level, xp: currentUserProgress.totalXP, streak: currentUserProgress.currentStreak, isCurrentUser: true },
      ];
    }

    // Import Firestore functions dynamically
    const { collection, query, orderBy, limit: firestoreLimit, getDocs } = await import('firebase/firestore');
    
    // Fetch more users than needed to account for filtering out test accounts
    const studentsRef = collection(firestore, 'students');
    const leaderboardQuery = query(
      studentsRef,
      orderBy('totalXP', 'desc'),
      firestoreLimit(limit * 3) // Fetch 3x to ensure we get enough real users after filtering
    );
    
    const snapshot = await getDocs(leaderboardQuery);
    const users: any[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const userName = data.studentName || data.userName || 'Anonymous';
      const email = data.email || '';
      const userId = doc.id;
      
      // Filter out test/fake accounts from leaderboard
      if (!isTestUser(userName, email, userId)) {
        users.push({
          userId: doc.id,
          name: userName,
          level: Math.floor((data.totalXP || 0) / 100),
          xp: data.totalXP || 0,
          streak: data.currentStreak || 0,
          school: data.school || 'Unknown',
          isCurrentUser: doc.id === currentUserId,
        });
      }
    });
    
    // Limit to requested number of real users
    const realUsers = users.slice(0, limit);
    
    // Insert Sarah the Robot into the rankings
    realUsers.push(SARAH_THE_ROBOT);
    
    // Sort by XP (highest first)
    realUsers.sort((a, b) => b.xp - a.xp);
    
    // Assign ranks
    const rankedUsers = realUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
    
    return rankedUsers;
    
  } catch (error) {
    console.error('[Leaderboard] Error fetching leaderboard:', error);
    
    // Fallback to local data
    const currentUserProgress = getUserProgress();
    return [
      { ...SARAH_THE_ROBOT, rank: 1 },
      { rank: 2, name: 'You', userId: 'local', level: currentUserProgress.level, xp: currentUserProgress.totalXP, streak: currentUserProgress.currentStreak, isCurrentUser: true },
    ];
  }
};
