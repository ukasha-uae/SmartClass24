/**
 * Power-Up System for Challenge Arena
 * Provides in-game assistance that can be purchased with coins
 */

export type PowerUpType = 
  | 'hint'           // Reveals one incorrect option
  | 'extra_time'     // Adds 30 seconds to timer
  | 'skip_question'  // Skip current question (no points)
  | 'fifty_fifty'    // Removes 2 incorrect options (MCQ only)
  | 'streak_shield'; // Protects current win streak from one loss

export interface PowerUp {
  id: PowerUpType;
  name: string;
  description: string;
  icon: string;
  cost: number; // coins
  cooldown?: number; // seconds between uses
  maxUses?: number; // max uses per challenge
}

export const POWER_UPS: Record<PowerUpType, PowerUp> = {
  hint: {
    id: 'hint',
    name: 'Hint',
    description: 'Reveals one incorrect option',
    icon: '💡',
    cost: 50,
    cooldown: 10,
    maxUses: 3,
  },
  extra_time: {
    id: 'extra_time',
    name: 'Extra Time',
    description: 'Adds 30 seconds to timer',
    icon: '⏰',
    cost: 100,
    cooldown: 30,
    maxUses: 2,
  },
  skip_question: {
    id: 'skip_question',
    name: 'Skip Question',
    description: 'Skip current question (no points awarded)',
    icon: '⏭️',
    cost: 150,
    cooldown: 0,
    maxUses: 2,
  },
  fifty_fifty: {
    id: 'fifty_fifty',
    name: '50/50',
    description: 'Removes 2 incorrect options (MCQ only)',
    icon: '🎯',
    cost: 75,
    cooldown: 15,
    maxUses: 2,
  },
  streak_shield: {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protects current win streak from one loss',
    icon: '🛡️',
    cost: 200,
    cooldown: 0,
    maxUses: 1,
  },
};

export interface PowerUpUsage {
  powerUpId: PowerUpType;
  questionId: string;
  timestamp: number;
  challengeId: string;
}

/**
 * Check if user can afford a power-up
 */
export function canAffordPowerUp(userId: string, powerUpId: PowerUpType): boolean {
  // This would check user's coin balance
  // For now, return true (will be implemented with actual coin check)
  return true;
}

/**
 * Use a power-up
 */
export function usePowerUp(
  userId: string,
  powerUpId: PowerUpType,
  questionId: string,
  challengeId: string
): PowerUpUsage | null {
  const powerUp = POWER_UPS[powerUpId];
  if (!powerUp) return null;
  
  // Check if user can afford it
  if (!canAffordPowerUp(userId, powerUpId)) {
    return null;
  }
  
  // Deduct coins (would be implemented with actual coin system)
  // deductCoins(userId, powerUp.cost);
  
  return {
    powerUpId,
    questionId,
    timestamp: Date.now(),
    challengeId,
  };
}

/**
 * Get available power-ups for a question type
 */
export function getAvailablePowerUps(questionType: string): PowerUp[] {
  const allPowerUps = Object.values(POWER_UPS);
  
  // Filter based on question type
  if (questionType !== 'mcq') {
    // Remove fifty_fifty for non-MCQ questions
    return allPowerUps.filter(p => p.id !== 'fifty_fifty');
  }
  
  return allPowerUps;
}

/**
 * Apply power-up effect to question
 */
export function applyPowerUpEffect(
  powerUpId: PowerUpType,
  question: any,
  options?: string[]
): any {
  switch (powerUpId) {
    case 'fifty_fifty':
      if (question.type === 'mcq' && options) {
        // Remove 2 incorrect options
        const correctIndex = typeof question.correctAnswer === 'string'
          ? options.indexOf(question.correctAnswer)
          : question.correctAnswer;
        
        const incorrectIndices = options
          .map((_, idx) => idx)
          .filter(idx => idx !== correctIndex);
        
        // Randomly select 2 incorrect options to remove
        const toRemove = incorrectIndices
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        
        return {
          ...question,
          filteredOptions: options.filter((_, idx) => !toRemove.includes(idx)),
          removedIndices: toRemove,
        };
      }
      break;
      
    case 'hint':
      if (question.type === 'mcq' && options) {
        // Reveal one incorrect option
        const correctIndex = typeof question.correctAnswer === 'string'
          ? options.indexOf(question.correctAnswer)
          : question.correctAnswer;
        
        const incorrectIndices = options
          .map((_, idx) => idx)
          .filter(idx => idx !== correctIndex);
        
        const revealedIndex = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
        
        return {
          ...question,
          revealedIncorrect: revealedIndex,
        };
      }
      break;
      
    case 'extra_time':
      // This would be handled in the timer component
      return {
        ...question,
        extraTime: 30,
      };
      
    default:
      return question;
  }
  
  return question;
}


