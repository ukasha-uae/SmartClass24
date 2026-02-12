import type { LucideIcon } from "lucide-react";

// Quiz Types
export interface McqQuiz {
  id?: string;
  type: 'mcq';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface TrueFalseQuiz {
  id?: string;
  type: 'truefalse';
  statement: string;
  answer: 'true' | 'false';
  reason?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface FillBlankQuiz {
  id?: string;
  type: 'fillblank';
  sentence: string; // "The capital of Ghana is ___." 
  answer: string;
  alternatives?: string[];
  explanation?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}export interface MatchingQuiz {
  id?: string;
  type: 'matching';
  question?: string;
  pairs: { left: string; right: string }[];
  explanation?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface OrderingQuiz {
  id?: string;
  type: 'ordering';
  items: string[];
  correctOrder: number[]; // Array of indexes
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface MultipleSelectQuiz {
  id?: string;
  type: 'multiple_select' | 'multiselect';
  question: string;
  options: string[];
  correctAnswers?: string[]; // multiple correct
  answers?: string[]; // Alias for correctAnswers for backward compatibility
  explanation?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface FlashcardQuiz {
  id?: string;
  type: 'flashcard';
  front: string;
  back: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface ImageMcqQuiz {
    id?: string;
    type: 'image_mcq';
    imageUrl: string;
    question: string;
    options: string[];
    answer: string;
  explanation?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

export interface ShortAnswerQuiz {
    id?: string;
    type: 'shortanswer';
    question: string;
    answer: string;
    alternatives?: string[];
    explanation?: string;
  style?: QuizStyle;
  // Curriculum metadata (v2.0+)
  curriculumId?: string;
  region?: string[];
  examAlignment?: string[];
}

// Quiz UI style sets—authors can choose how quizzes should be rendered
export type QuizStyle = 'classic' | 'card' | 'compact' | 'timed' | 'image-first' | 'visual' | 'rapid';


// Union type for any quiz
export type Quiz = McqQuiz | TrueFalseQuiz | FillBlankQuiz | MatchingQuiz | OrderingQuiz | FlashcardQuiz | ImageMcqQuiz | ShortAnswerQuiz | MultipleSelectQuiz;

// Re-defining EndOfLessonQuizQuestion for backward compatibility in jhs-data, but we'll use the Quiz union type moving forward
export interface EndOfLessonQuizQuestion {
  type: 'mcq' | 'truefalse'; // Can be expanded
  question?: string;
  options?: string[];
  correctAnswer?: string | boolean;
  statement?: string;
  answer?: string | boolean;
  explanation?: string;
  reason?: string;
}

// Media support for lessons
export interface Media {
  type: 'image' | 'video' | 'youtube' | 'file';
  url: string;
  caption?: string;
  fileName?: string;
}

export interface ContentAvailability {
  applicableCountries?: string[];
  excludedCountries?: string[];
  isCountrySpecific?: boolean;
  countrySpecificTo?: string;
  examBoards?: string[];
  examRelevance?: 'all' | 'country-specific' | 'optional';
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  // Multi-curriculum metadata (v2.0+)
  curriculumId?: string;          // 'west-african' | 'us-common-core' | 'uk-national' | 'ib'
  region?: string[];              // Geographic applicability: ['ghana', 'nigeria'] or ['us', 'uk']
  examAlignment?: string[];       // Exam systems covered: ['BECE', 'WASSCE'] or ['SAT', 'ACT']
  standardsAlignment?: {          // Educational standards mapping
    standard: string;             // e.g., 'Common Core Math 8.G.A.1'
    description: string;
  }[];
  // Core content
  objectives: string[];
  introduction: string;
  introductionMedia?: Media;
  keyConcepts: { 
    title: string; 
    content: string;
    media?: Media;
  }[];
  activities: { type: string; questions: any[] } | { title: string; instruction: string; content: string; }[] | { type: string; exercises: any[] };
  pastQuestions: { 
    question: string; 
    solution?: string; 
    year?: string;
    options?: string[];
    answer?: string;
    explanation?: string;
  }[];
  summary: string;
  summaryMedia?: Media;
  endOfLessonQuiz?: Quiz[];
  defaultQuizStyle?: QuizStyle;
  availability?: ContentAvailability;
  // Content management (v2.0+)
  versionId?: string;             // Content version tracking
  approvalStatus?: 'draft' | 'review' | 'approved' | 'archived';
  lastModified?: string;          // ISO timestamp
  author?: string;                // Content creator ID
}

export interface QuizAttempt {
  id?: string;
  lessonId?: string | null;
  subjectSlug?: string | null;
  topicSlug?: string | null;
  lessonSlug?: string | null;
  createdAt?: string; // ISO timestamp from client
  scorePercent: number;
  rawScore: number;
  total: number;
  report?: any[];
  migrated?: boolean; // Flag to indicate migrated from local cache
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  // Multi-curriculum metadata (v2.0+)
  curriculumId?: string;          // Curriculum system this topic belongs to
  gradeLevel?: string;            // 'JHS 1', 'Grade 8', 'Year 9', etc.
  sequenceOrder?: number;         // Order within curriculum
  // Content
  lessons: Lesson[];
}

export interface YearGroup {
  level: string; // "JHS 1", "JHS 2", "JHS 3"
  topics: Topic[];
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  // Multi-curriculum support (v2.0+)
  curriculumId?: string;          // Which curriculum system this subject belongs to
  standardName?: string;          // Universal name: 'Mathematics', 'Science'
  localizedNames?: {              // Curriculum-specific names
    [curriculumId: string]: string; // e.g., 'west-african': 'Integrated Science'
  };
  ageRange?: {                    // Target age groups
    min: number;
    max: number;
  };
  // Legacy structure (to be migrated)
  curriculum: YearGroup[];
}
