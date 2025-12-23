/**
 * Helper utilities for TeacherVoice - Context-aware message generation
 */

export interface StudentContext {
    quizScore?: number;
    attempts?: number;
    correctStreak?: number;
    incorrectStreak?: number;
    lastError?: string;
}

export type EmotionType = 'happy' | 'explaining' | 'concerned' | 'celebrating' | 'thinking';

/**
 * Generate context-aware encouragement message based on student performance
 */
export function generateEncouragementMessage(context: StudentContext, subject?: string): string {
    const { quizScore, attempts, correctStreak, incorrectStreak } = context;
    
    // Celebrating excellent performance
    if (quizScore !== undefined && quizScore >= 90) {
        return `Excellent work! You scored ${quizScore}%! You've really mastered this topic. Keep up the outstanding effort!`;
    }
    
    // Happy with good performance
    if (quizScore !== undefined && quizScore >= 70) {
        return `Great job! You scored ${quizScore}%. You're doing well. Let's keep building on this success!`;
    }
    
    // Concerned about low score
    if (quizScore !== undefined && quizScore < 50) {
        return `I see you scored ${quizScore}%. Don't worry, learning takes practice! Let's review the concepts together and try again.`;
    }
    
    // Encouraging correct streak
    if (correctStreak !== undefined && correctStreak >= 3) {
        return `Fantastic! You've answered ${correctStreak} questions correctly in a row! You're on fire! 🔥`;
    }
    
    // Addressing struggle streak
    if (incorrectStreak !== undefined && incorrectStreak >= 3) {
        return `I notice you're finding this challenging. That's okay! Let's slow down and break this into smaller steps.`;
    }
    
    // Multiple attempts encouragement
    if (attempts !== undefined && attempts > 2) {
        return `I see you're persistent - that's the spirit! Remember, every attempt helps you learn. Let's approach this differently.`;
    }
    
    return subject 
        ? `Let's explore ${subject} together. I'm here to help you every step of the way!`
        : `I'm here to guide you through this lesson. Let's get started!`;
}

/**
 * Detect appropriate emotion based on context
 */
export function detectEmotion(context: StudentContext): EmotionType {
    const { quizScore, correctStreak, incorrectStreak } = context;
    
    // Celebrating exceptional performance
    if (quizScore !== undefined && quizScore >= 90) return 'celebrating';
    if (correctStreak !== undefined && correctStreak >= 5) return 'celebrating';
    
    // Happy with good performance
    if (quizScore !== undefined && quizScore >= 70) return 'happy';
    if (correctStreak !== undefined && correctStreak >= 3) return 'happy';
    
    // Concerned about struggles
    if (quizScore !== undefined && quizScore < 50) return 'concerned';
    if (incorrectStreak !== undefined && incorrectStreak >= 3) return 'concerned';
    
    // Default to explaining
    return 'explaining';
}

/**
 * Generate hint message based on difficulty level
 */
export function generateHintMessage(difficulty: 'subtle' | 'moderate' | 'direct', topic?: string): string {
    switch (difficulty) {
        case 'subtle':
            return topic 
                ? `Let's think about the key principles of ${topic}. What patterns do you notice?`
                : `Think about what you already know. What connections can you make?`;
        
        case 'moderate':
            return topic
                ? `Here's a tip for ${topic}: Focus on the main concept and how it relates to what you've learned before.`
                : `Consider breaking the problem into smaller parts. What's the first step you should take?`;
        
        case 'direct':
            return topic
                ? `Let me guide you through ${topic}: Here's exactly what you need to focus on...`
                : `Here's a direct hint: Look at this specific part and apply the formula we discussed earlier.`;
        
        default:
            return `Need help? I'm here to guide you!`;
    }
}

/**
 * Quick action presets for common scenarios
 */
export const quickActionPresets = {
    understanding: [
        { label: 'I understand', icon: '✓' },
        { label: 'Tell me more', icon: '📖' },
        { label: 'Show example', icon: '👁️' },
    ],
    quiz: [
        { label: 'Next question', icon: '→' },
        { label: 'Explain answer', icon: '💡' },
        { label: 'Try again', icon: '🔄' },
    ],
    lab: [
        { label: 'What is next?', icon: '❓' },
        { label: 'Safety check', icon: '🛡️' },
        { label: 'Start over', icon: '↺' },
    ],
};
