// Shared types for question banks
export type EducationLevel = 'Primary' | 'JHS' | 'SHS';
export type ClassLevel = 'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3' | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'matching' | 'short-answer' | 'essay';

// Base question interface
interface BaseQuestion {
  id: string;
  question: string;
  subject: string;
  difficulty: QuestionDifficulty;
  classLevel?: ClassLevel;
  level: EducationLevel;
  explanation?: string;
  topic?: string;
  source?: string; // e.g., 'actual WASSCE', 'generated', etc.
  year?: number; // Year of exam if from past papers
  paper?: 1 | 2; // WASSCE paper number: 1 = MCQ/Objective, 2 = Theory/Essay (defaults to 1 for MCQs)
  verifiedQuestionNumber?: number; // Actual question number from WASSCE paper (only set when verified against official papers)
}

// Multiple Choice Question
export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctAnswer: number; // Index of correct option
}

// True/False Question
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

// Fill in the Blank Question
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: Array<{
    position: number; // Position in question text (use {{0}}, {{1}}, etc.)
    correctAnswer: string;
    alternatives?: string[]; // Acceptable alternative answers
  }>;
  questionTemplate: string; // Question with {{0}}, {{1}} placeholders
}

// Matching Question
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: string[];
  rightItems: string[];
  correctMatches: Array<{ leftIndex: number; rightIndex: number }>;
}

// Short Answer Question
export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  correctAnswer: string;
  acceptableAnswers?: string[]; // Alternative acceptable answers
  maxLength?: number; // Maximum characters allowed
}

// Essay Question
export interface EssayQuestion extends BaseQuestion {
  type: 'essay';
  rubric?: string; // Grading rubric
  minLength?: number; // Minimum words/characters
  maxLength?: number; // Maximum words/characters
}

// Union type for all question types
export type ChallengeQuestion = 
  | MCQQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | MatchingQuestion 
  | ShortAnswerQuestion 
  | EssayQuestion;
