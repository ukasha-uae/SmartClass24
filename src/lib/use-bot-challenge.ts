/**
 * Bot Challenge Hook - Simulates Sarah answering challenge questions
 * Runs in parallel with player's gameplay
 */

import { useEffect, useRef } from 'react';
import { createBotAI } from './bot-ai-engine';
import { getSarahBot, getSarahAdaptedDifficulty, isBot } from './ai-bot-profiles';
import type { Challenge, PlayerAnswer, GameQuestion } from './challenge';
import { submitChallengeAnswers, checkGameQuestionAnswer } from './challenge';

export function useBotChallenge(
  challenge: Challenge | null,
  userStartedPlaying: boolean,
  opponentUserId?: string
) {
  const botAnsweringRef = useRef(false);
  const botAnswersSubmittedRef = useRef(false);

  useEffect(() => {
    // Only run if opponent is Sarah bot and user has started playing
    if (!challenge || !opponentUserId || !isBot(opponentUserId) || !userStartedPlaying) {
      return;
    }

    // Prevent multiple simultaneous bot answer sessions
    if (botAnsweringRef.current || botAnswersSubmittedRef.current) {
      return;
    }

    // Get player info to adapt Sarah's difficulty
    const creatorLevel = challenge.level || 'JHS';
    const creatorXP = 0; // XP not stored in challenge, use base difficulty

    // Adapt Sarah's difficulty
    const difficulty = getSarahAdaptedDifficulty(creatorLevel, creatorXP, undefined);
    const sarah = getSarahBot();
    const sarahAI = createBotAI(sarah, difficulty.accuracy);

    // Mark that bot is answering
    botAnsweringRef.current = true;

    // Simulate Sarah answering all questions
    const simulateSarahAnswers = async () => {
      const botAnswers: PlayerAnswer[] = [];
      const startTime = Date.now();

      for (const question of challenge.questions) {
        // Sarah answers the question
        // For MCQ questions, find the correct answer index
        const correctIndex = question.type === 'mcq' && question.options 
          ? question.options.indexOf(question.correctAnswer as string)
          : 0;
        
        const result = await sarahAI.answerQuestion(
          question.question,
          question.options || [],
          correctIndex
        );

        // Convert answer index to the actual option text for MCQ questions
        let answerValue: string;
        if (question.type === 'mcq' && question.options && result.selectedIndex < question.options.length) {
          answerValue = question.options[result.selectedIndex];
        } else {
          answerValue = String(result.selectedIndex);
        }

        botAnswers.push({
          questionId: question.id,
          answer: answerValue,
          isCorrect: result.isCorrect,
          timeSpent: result.timeSpent,
          points: result.isCorrect ? question.points : 0
        });
      }

      const totalTimeTaken = Date.now() - startTime;

      // Submit Sarah's answers to Firestore
      try {
        await submitChallengeAnswers(
          challenge.id,
          opponentUserId,
          botAnswers,
          totalTimeTaken
        );
        botAnswersSubmittedRef.current = true;
        console.log('[Sarah Bot] Successfully submitted answers');
      } catch (error) {
        console.error('[Sarah Bot] Failed to submit answers:', error);
        botAnsweringRef.current = false; // Allow retry
      }
    };

    // Start Sarah's answer simulation with a small delay
    const delay = 1000; // 1 second delay before Sarah starts
    const timer = setTimeout(() => {
      simulateSarahAnswers();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [challenge, userStartedPlaying, opponentUserId]);

  return {
    isBotAnswering: botAnsweringRef.current && !botAnswersSubmittedRef.current,
    botAnswersSubmitted: botAnswersSubmittedRef.current
  };
}
