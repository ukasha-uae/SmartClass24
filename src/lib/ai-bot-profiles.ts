/**
 * AI Bot Profiles for SmartClass24
 * Sarah - Your always-available study partner
 */

export interface BotProfile {
  id: string;
  displayName: string;
  firstName: string;
  level: string;
  xp: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'adaptive';
  avatar: string;
  isBot: true;
  alwaysOnline: true;
  bio: string;
  subjects: string[];
  responseTimeRange: [number, number]; // min, max in milliseconds
  accuracy: number; // 0-1 probability of correct answer
  personality: string;
}

/**
 * Sarah - The AI study companion
 * Adapts difficulty based on student performance
 */
export const SARAH_BOT: BotProfile = {
  id: 'bot-sarah-001',
  displayName: 'Sarah (AI Study Partner) 🤖',
  firstName: 'Sarah',
  level: 'Adaptive AI', // Adapts to opponent's level
  xp: 2500,
  difficultyLevel: 'adaptive',
  avatar: '👩‍🎓',
  isBot: true,
  alwaysOnline: true,
  bio: "Hi! I'm Sarah, your AI study partner. I'm here to help you practice anytime, day or night. I'll adjust my difficulty to match your level and help you improve! 📚✨",
  subjects: [
    'Mathematics',
    'English',
    'Science',
    'Integrated Science',
    'Social Studies',
    'French',
    'ICT',
    'RME',
    'Ghanaian Language',
    'Creative Arts'
  ],
  responseTimeRange: [2000, 4000], // 2-4 seconds to simulate human thinking
  accuracy: 0.70, // Base 70% accuracy, adjusts based on opponent performance
  personality: 'Friendly and encouraging, celebrates your wins and motivates you after losses'
};

/**
 * Get all available bots
 */
export function getAllBots(): BotProfile[] {
  return [SARAH_BOT];
}

/**
 * Get bot by ID
 */
export function getBotById(botId: string): BotProfile | undefined {
  return getAllBots().find(bot => bot.id === botId);
}

/**
 * Check if a user ID belongs to a bot
 */
export function isBot(userId: string): boolean {
  return userId.startsWith('bot-');
}

/**
 * Get Sarah (default bot)
 */
export function getSarahBot(): BotProfile {
  return SARAH_BOT;
}

/**
 * Adjust Sarah's difficulty based on opponent's level and recent performance
 */
export function getSarahAdaptedDifficulty(
  opponentLevel: string,
  opponentXP: number,
  recentWinRate?: number
): { accuracy: number; responseTime: [number, number] } {
  // Base difficulty on opponent's level
  let accuracy = 0.70; // Default
  let responseTime: [number, number] = [2000, 4000];

  // Adjust for level
  if (opponentLevel.includes('JHS 1')) {
    accuracy = 0.60; // Easier for beginners
    responseTime = [3000, 5000];
  } else if (opponentLevel.includes('JHS 2')) {
    accuracy = 0.65;
    responseTime = [2500, 4500];
  } else if (opponentLevel.includes('JHS 3')) {
    accuracy = 0.70;
    responseTime = [2000, 4000];
  } else if (opponentLevel.includes('SHS')) {
    accuracy = 0.75; // Harder for SHS students
    responseTime = [1500, 3500];
  }

  // Further adjust based on opponent's XP
  if (opponentXP < 500) {
    accuracy -= 0.05; // Easier for low XP
  } else if (opponentXP > 3000) {
    accuracy += 0.05; // Harder for high XP
  }

  // Adjust based on recent win rate (if student is losing, make Sarah easier)
  if (recentWinRate !== undefined) {
    if (recentWinRate < 0.3) {
      accuracy -= 0.10; // Student struggling, make Sarah easier
    } else if (recentWinRate > 0.7) {
      accuracy += 0.10; // Student doing well, make Sarah harder
    }
  }

  // Cap accuracy between 0.5 and 0.9
  accuracy = Math.max(0.5, Math.min(0.9, accuracy));

  return { accuracy, responseTime };
}
