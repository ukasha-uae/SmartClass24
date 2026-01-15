/**
 * Bot AI Engine - Simulates realistic quiz answering behavior
 * Powers Sarah and future AI opponents
 */

import type { BotProfile } from './ai-bot-profiles';

export class BotAI {
  private accuracy: number;
  private responseTimeRange: [number, number];
  private botProfile: BotProfile;

  constructor(botProfile: BotProfile, customAccuracy?: number) {
    this.botProfile = botProfile;
    this.accuracy = customAccuracy ?? botProfile.accuracy;
    this.responseTimeRange = botProfile.responseTimeRange;
  }

  /**
   * Bot decides on an answer with realistic timing
   */
  async answerQuestion(
    question: string,
    options: string[],
    correctAnswerIndex: number
  ): Promise<{
    selectedIndex: number;
    timeSpent: number;
    isCorrect: boolean;
  }> {
    // Simulate thinking time
    const thinkTime = this.randomBetween(...this.responseTimeRange);
    await this.delay(thinkTime);

    // Determine if bot gets it right based on accuracy
    const getsItRight = Math.random() < this.accuracy;

    let selectedIndex: number;

    if (getsItRight) {
      selectedIndex = correctAnswerIndex;
    } else {
      // Bot picks a wrong answer
      selectedIndex = this.selectWrongAnswer(options.length, correctAnswerIndex);
    }

    return {
      selectedIndex,
      timeSpent: thinkTime,
      isCorrect: selectedIndex === correctAnswerIndex
    };
  }

  /**
   * Select a random wrong answer (avoiding correct answer)
   */
  private selectWrongAnswer(totalOptions: number, correctIndex: number): number {
    const wrongOptions = Array.from({ length: totalOptions }, (_, i) => i)
      .filter(i => i !== correctIndex);
    
    return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  }

  /**
   * Generate random number between min and max (inclusive)
   */
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update bot's accuracy dynamically (for adaptive difficulty)
   */
  setAccuracy(newAccuracy: number): void {
    this.accuracy = Math.max(0.3, Math.min(0.95, newAccuracy));
  }

  /**
   * Get current bot stats
   */
  getStats(): {
    name: string;
    accuracy: number;
    avgResponseTime: number;
  } {
    const avgTime = (this.responseTimeRange[0] + this.responseTimeRange[1]) / 2;
    return {
      name: this.botProfile.displayName,
      accuracy: this.accuracy,
      avgResponseTime: avgTime
    };
  }
}

/**
 * Create a bot AI instance from profile
 */
export function createBotAI(botProfile: BotProfile, customAccuracy?: number): BotAI {
  return new BotAI(botProfile, customAccuracy);
}
