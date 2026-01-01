// Unified Challenge Questions System for Primary, JHS & SHS
// Scalable question bank architecture - easily extendable for loading more questions
import { getRandomQuestions as getJHSQuestions, QuestionSubject as JHSSubject, QuestionDifficulty } from './bece-questions';
import { pastQuestions, type PastQuestion } from './past-questions';

export type EducationLevel = 'Primary' | 'JHS' | 'SHS';
export type ClassLevel = 'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3' | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';
// Legacy difficulty type for backward compatibility during migration
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Legacy - will be replaced by classLevel
  classLevel?: ClassLevel; // New field for class-based leveling
  level: EducationLevel;
  explanation?: string;
  topic?: string;
}

/**
 * Convert past questions to ChallengeQuestion format
 * This allows integration of past exam questions into the challenge system
 */
function convertPastQuestionToChallenge(pastQuestion: PastQuestion, level: 'JHS' | 'SHS'): ChallengeQuestion | null {
  // For theory questions, we can create MCQ versions
  // Extract key information from the question
  const questionText = typeof pastQuestion.question === 'string' 
    ? pastQuestion.question 
    : String(pastQuestion.question);
  
  // For now, create a simplified MCQ version
  // In production, you'd have proper MCQ conversions or use theory questions differently
  // This is a placeholder that can be expanded
  return null;
}

/**
 * Get past questions converted to ChallengeQuestion format
 * This function loads past questions and converts them for use in challenges
 */
function getPastQuestionsAsChallengeQuestions(level: 'JHS' | 'SHS', subject?: string, count: number = 10): ChallengeQuestion[] {
  // Filter past questions by level and subject
  let filtered = pastQuestions.filter(pq => {
    // SHS past questions are WASSCE level
    if (level === 'SHS') {
      if (subject && pq.subject !== subject) return false;
      return true; // All past questions in the file are SHS level
    }
    // JHS past questions would be BECE level (if we add them)
    // For now, return empty as past-questions.ts only has SHS questions
    return false;
  });

  // Convert to ChallengeQuestion format
  // Note: This is a simplified conversion - you may want to enhance this
  // to properly handle theory questions or create MCQ versions
  const converted: ChallengeQuestion[] = [];
  
  // For now, we'll skip conversion as past questions are theory-based
  // In production, you'd either:
  // 1. Have MCQ versions of past questions
  // 2. Use theory questions in a different question type
  // 3. Convert theory to MCQ programmatically
  
  return converted.slice(0, count);
}

// Track recently used questions to prevent immediate repeats
const recentlyUsedQuestions: Map<string, Set<string>> = new Map();

/**
 * Mark questions as recently used for a user/session
 */
function markQuestionsUsed(sessionKey: string, questionIds: string[]): void {
  if (!recentlyUsedQuestions.has(sessionKey)) {
    recentlyUsedQuestions.set(sessionKey, new Set());
  }
  const used = recentlyUsedQuestions.get(sessionKey)!;
  questionIds.forEach(id => used.add(id));
  
  // Keep only last 50 questions to prevent memory bloat
  if (used.size > 50) {
    const arr = Array.from(used);
    arr.slice(0, used.size - 50).forEach(id => used.delete(id));
  }
}

/**
 * Get fresh questions that haven't been recently used
 */
function filterFreshQuestions(questions: ChallengeQuestion[], sessionKey: string): ChallengeQuestion[] {
  const used = recentlyUsedQuestions.get(sessionKey);
  if (!used || used.size === 0) return questions;
  
  const fresh = questions.filter(q => !used.has(q.id));
  // If all questions have been used, reset and return all
  if (fresh.length === 0) {
    recentlyUsedQuestions.delete(sessionKey);
    return questions;
  }
  return fresh;
}

// ============================================
// SCALABLE QUESTION BANK ARCHITECTURE
// ============================================
// This structure allows easy loading of questions from:
// - Static arrays (current implementation)
// - External APIs
// - Database queries
// - JSON files
// Simply extend the arrays or add loading functions
//
// TO ADD MORE QUESTIONS:
// 1. For Primary: Add to primaryQuestionBank array
// 2. For JHS: Add to bece-questions.ts or extend here
// 3. For SHS: Add to shsQuestionBank array
// 4. For Past Questions: Add to past-questions.ts and they'll be integrated
//
// FUTURE: Can add async loading functions like:
// - loadQuestionsFromAPI(level, subject)
// - loadQuestionsFromDatabase(level, subject)
// - loadQuestionsFromJSON(level, subject)

// Helper function to assign classLevel based on difficulty and level
function assignClassLevel(level: EducationLevel, difficulty: 'easy' | 'medium' | 'hard', index?: number): ClassLevel {
  if (level === 'Primary') {
    if (difficulty === 'easy') {
      // Distribute easy questions between Primary 1 and 2
      return (index && index % 2 === 0) ? 'Primary 2' : 'Primary 1';
    } else if (difficulty === 'medium') {
      // Distribute medium questions between Primary 3 and 4
      return (index && index % 2 === 0) ? 'Primary 4' : 'Primary 3';
    } else {
      // Distribute hard questions between Primary 5 and 6
      return (index && index % 2 === 0) ? 'Primary 6' : 'Primary 5';
    }
  } else if (level === 'JHS') {
    if (difficulty === 'easy') return 'JHS 1';
    if (difficulty === 'medium') return 'JHS 2';
    return 'JHS 3';
  } else { // SHS
    if (difficulty === 'easy') return 'SHS 1';
    if (difficulty === 'medium') return 'SHS 2';
    return 'SHS 3';
  }
}

// Primary Question Bank (Expandable)
const primaryQuestionBank: ChallengeQuestion[] = [
  // Mathematics - Primary
  {
    id: 'primary-math-001',
    question: 'What is 2 + 3?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'easy',
    classLevel: 'Primary 1',
    level: 'Primary',
    topic: 'Addition',
    explanation: '2 + 3 = 5'
  },
  {
    id: 'primary-math-002',
    question: 'How many sides does a triangle have?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Shapes',
    explanation: 'A triangle has 3 sides'
  },
  {
    id: 'primary-math-003',
    question: 'What is 10 - 4?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Subtraction',
    explanation: '10 - 4 = 6'
  },
  {
    id: 'primary-math-004',
    question: 'Which number comes after 9?',
    options: ['8', '9', '10', '11'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Numbers',
    explanation: 'After 9 comes 10'
  },
  {
    id: 'primary-math-005',
    question: 'What is 5 × 2?',
    options: ['7', '10', '12', '15'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Multiplication',
    explanation: '5 × 2 = 10'
  },
  // English Language - Primary
  {
    id: 'primary-eng-001',
    question: 'Which word starts with the letter "A"?',
    options: ['Ball', 'Apple', 'Cat', 'Dog'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Alphabet',
    explanation: 'Apple starts with the letter A'
  },
  {
    id: 'primary-eng-002',
    question: 'What is the plural of "cat"?',
    options: ['cat', 'cats', 'cates', 'caties'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The plural of cat is cats'
  },
  {
    id: 'primary-eng-003',
    question: 'Which word rhymes with "hat"?',
    options: ['hot', 'bat', 'hit', 'hut'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Phonics',
    explanation: 'Bat rhymes with hat'
  },
  // Science - Primary
  {
    id: 'primary-sci-001',
    question: 'How many legs does a spider have?',
    options: ['4', '6', '8', '10'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'A spider has 8 legs'
  },
  {
    id: 'primary-sci-002',
    question: 'Which animal lives in water?',
    options: ['Dog', 'Fish', 'Bird', 'Cat'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Fish live in water'
  },
  // Mathematics - More Primary questions
  {
    id: 'primary-math-006',
    question: 'What is 8 ÷ 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Division',
    explanation: '8 ÷ 2 = 4'
  },
  {
    id: 'primary-math-007',
    question: 'How many corners does a square have?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Shapes',
    explanation: 'A square has 4 corners'
  },
  {
    id: 'primary-math-008',
    question: 'What is 3 × 4?',
    options: ['7', '10', '12', '15'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Multiplication',
    explanation: '3 × 4 = 12'
  },
  {
    id: 'primary-math-009',
    question: 'Which number is the smallest?',
    options: ['5', '2', '8', '10'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Numbers',
    explanation: '2 is the smallest number'
  },
  {
    id: 'primary-math-010',
    question: 'What is 15 - 7?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Subtraction',
    explanation: '15 - 7 = 8'
  },
  // English Language - More Primary questions
  {
    id: 'primary-eng-004',
    question: 'Which word is a verb?',
    options: ['Happy', 'Run', 'Big', 'Red'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'Run is an action word (verb)'
  },
  {
    id: 'primary-eng-005',
    question: 'What is the opposite of "hot"?',
    options: ['Warm', 'Cold', 'Cool', 'Freezing'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Vocabulary',
    explanation: 'The opposite of hot is cold'
  },
  // Science - More Primary questions
  {
    id: 'primary-sci-003',
    question: 'Which animal can fly?',
    options: ['Fish', 'Bird', 'Dog', 'Cat'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Birds can fly'
  },
  {
    id: 'primary-sci-004',
    question: 'What do plants need to grow?',
    options: ['Water only', 'Sunlight only', 'Water and sunlight', 'Nothing'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Plants',
    explanation: 'Plants need both water and sunlight to grow'
  },
  // Social Studies - Primary
  {
    id: 'primary-soc-001',
    question: 'What is the capital city of Ghana?',
    options: ['Kumasi', 'Accra', 'Tamale', 'Cape Coast'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Accra is the capital city of Ghana'
  },
  {
    id: 'primary-soc-002',
    question: 'How many regions are in Ghana?',
    options: ['14', '15', '16', '17'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Ghana has 16 regions'
  },
  // ============================================
  // MATHEMATICS - 20 Questions Total
  // ============================================
  {
    id: 'primary-math-011',
    question: 'What is 6 + 4?',
    options: ['8', '9', '10', '11'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Addition',
    explanation: '6 + 4 = 10'
  },
  {
    id: 'primary-math-012',
    question: 'What is 12 - 5?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Subtraction',
    explanation: '12 - 5 = 7'
  },
  {
    id: 'primary-math-013',
    question: 'What is 4 × 3?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Multiplication',
    explanation: '4 × 3 = 12'
  },
  {
    id: 'primary-math-014',
    question: 'What is 20 ÷ 4?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Division',
    explanation: '20 ÷ 4 = 5'
  },
  {
    id: 'primary-math-015',
    question: 'How many sides does a rectangle have?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Shapes',
    explanation: 'A rectangle has 4 sides'
  },
  {
    id: 'primary-math-016',
    question: 'What is 9 + 6?',
    options: ['13', '14', '15', '16'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Addition',
    explanation: '9 + 6 = 15'
  },
  {
    id: 'primary-math-017',
    question: 'What is 18 - 9?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Subtraction',
    explanation: '18 - 9 = 9'
  },
  {
    id: 'primary-math-018',
    question: 'What is 5 × 5?',
    options: ['20', '25', '30', '35'],
    correctAnswer: 1,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Multiplication',
    explanation: '5 × 5 = 25'
  },
  {
    id: 'primary-math-019',
    question: 'What is 16 ÷ 2?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Division',
    explanation: '16 ÷ 2 = 8'
  },
  {
    id: 'primary-math-020',
    question: 'Which shape has no corners?',
    options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
    correctAnswer: 2,
    subject: 'Mathematics',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Shapes',
    explanation: 'A circle has no corners'
  },

  // ============================================
  // ENGLISH LANGUAGE - 20 Questions Total
  // ============================================
  {
    id: 'primary-eng-006',
    question: 'Which word starts with the letter "B"?',
    options: ['Apple', 'Ball', 'Cat', 'Dog'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Alphabet',
    explanation: 'Ball starts with the letter B'
  },
  {
    id: 'primary-eng-007',
    question: 'What is the plural of "dog"?',
    options: ['dog', 'dogs', 'doges', 'dogies'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The plural of dog is dogs'
  },
  {
    id: 'primary-eng-008',
    question: 'Which word rhymes with "sun"?',
    options: ['son', 'run', 'fun', 'All of the above'],
    correctAnswer: 3,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Phonics',
    explanation: 'Son, run, and fun all rhyme with sun'
  },
  {
    id: 'primary-eng-009',
    question: 'What is the opposite of "big"?',
    options: ['Large', 'Small', 'Huge', 'Giant'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Vocabulary',
    explanation: 'The opposite of big is small'
  },
  {
    id: 'primary-eng-010',
    question: 'Which sentence is correct?',
    options: ['I am happy.', 'I is happy.', 'I are happy.', 'I be happy.'],
    correctAnswer: 0,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'I am happy is the correct sentence'
  },
  {
    id: 'primary-eng-011',
    question: 'What is the past tense of "go"?',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The past tense of go is went'
  },
  {
    id: 'primary-eng-012',
    question: 'Which word is a noun?',
    options: ['Run', 'Beautiful', 'School', 'Quickly'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'School is a noun (a place)'
  },
  {
    id: 'primary-eng-013',
    question: 'What is the plural of "child"?',
    options: ['childs', 'children', 'childrens', 'childes'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The plural of child is children (irregular plural)'
  },
  {
    id: 'primary-eng-014',
    question: 'Which word means the same as "happy"?',
    options: ['Sad', 'Glad', 'Mad', 'Bad'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Vocabulary',
    explanation: 'Glad means the same as happy'
  },
  {
    id: 'primary-eng-015',
    question: 'Complete the sentence: "The cat is _____ the table."',
    options: ['on', 'in', 'at', 'to'],
    correctAnswer: 0,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The cat is on the table'
  },
  {
    id: 'primary-eng-016',
    question: 'Which word starts with the letter "C"?',
    options: ['Apple', 'Ball', 'Cat', 'Dog'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Alphabet',
    explanation: 'Cat starts with the letter C'
  },
  {
    id: 'primary-eng-017',
    question: 'What is the plural of "book"?',
    options: ['book', 'books', 'bookes', 'bookies'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'The plural of book is books'
  },
  {
    id: 'primary-eng-018',
    question: 'Which word rhymes with "hat"?',
    options: ['hot', 'bat', 'hit', 'hut'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Phonics',
    explanation: 'Bat rhymes with hat'
  },
  {
    id: 'primary-eng-019',
    question: 'What is the opposite of "hot"?',
    options: ['Warm', 'Cold', 'Cool', 'Freezing'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Vocabulary',
    explanation: 'The opposite of hot is cold'
  },
  {
    id: 'primary-eng-020',
    question: 'Which sentence is correct?',
    options: ['She don\'t like apples.', 'She doesn\'t like apples.', 'She didn\'t likes apples.', 'She not like apples.'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Grammar',
    explanation: 'She doesn\'t like apples is the correct sentence'
  },

  // ============================================
  // SCIENCE - 20 Questions Total
  // ============================================
  {
    id: 'primary-sci-005',
    question: 'Which animal lives on land?',
    options: ['Fish', 'Bird', 'Dog', 'Shark'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Dogs live on land'
  },
  {
    id: 'primary-sci-006',
    question: 'What do we use to see?',
    options: ['Ears', 'Eyes', 'Nose', 'Mouth'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Body Parts',
    explanation: 'We use our eyes to see'
  },
  {
    id: 'primary-sci-007',
    question: 'Which season comes after summer?',
    options: ['Spring', 'Autumn', 'Winter', 'Rainy'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Seasons',
    explanation: 'Autumn comes after summer'
  },
  {
    id: 'primary-sci-008',
    question: 'What do plants need to make food?',
    options: ['Water only', 'Sunlight only', 'Water and sunlight', 'Nothing'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Plants',
    explanation: 'Plants need both water and sunlight to make food'
  },
  {
    id: 'primary-sci-009',
    question: 'How many legs does a cat have?',
    options: ['2', '3', '4', '6'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'A cat has 4 legs'
  },
  {
    id: 'primary-sci-010',
    question: 'Which animal can swim?',
    options: ['Dog', 'Fish', 'Bird', 'Cat'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Fish can swim'
  },
  {
    id: 'primary-sci-011',
    question: 'What do we use to hear?',
    options: ['Eyes', 'Ears', 'Nose', 'Mouth'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Body Parts',
    explanation: 'We use our ears to hear'
  },
  {
    id: 'primary-sci-012',
    question: 'Which season is the coldest?',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
    correctAnswer: 3,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Seasons',
    explanation: 'Winter is the coldest season'
  },
  {
    id: 'primary-sci-013',
    question: 'What part of a plant is usually green?',
    options: ['Root', 'Stem', 'Leaf', 'Flower'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Plants',
    explanation: 'Leaves are usually green'
  },
  {
    id: 'primary-sci-014',
    question: 'How many wings does a bird have?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'A bird has 2 wings'
  },
  {
    id: 'primary-sci-015',
    question: 'Which animal lives in water?',
    options: ['Dog', 'Cat', 'Fish', 'Bird'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Fish live in water'
  },
  {
    id: 'primary-sci-016',
    question: 'What do we use to smell?',
    options: ['Eyes', 'Ears', 'Nose', 'Mouth'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Body Parts',
    explanation: 'We use our nose to smell'
  },
  {
    id: 'primary-sci-017',
    question: 'Which season is the hottest?',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Seasons',
    explanation: 'Summer is the hottest season'
  },
  {
    id: 'primary-sci-018',
    question: 'What do plants grow from?',
    options: ['Rocks', 'Seeds', 'Water', 'Air'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Plants',
    explanation: 'Plants grow from seeds'
  },
  {
    id: 'primary-sci-019',
    question: 'How many legs does a dog have?',
    options: ['2', '3', '4', '6'],
    correctAnswer: 2,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'A dog has 4 legs'
  },
  {
    id: 'primary-sci-020',
    question: 'Which animal can fly?',
    options: ['Fish', 'Bird', 'Dog', 'Cat'],
    correctAnswer: 1,
    subject: 'Science',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Animals',
    explanation: 'Birds can fly'
  },

  // ============================================
  // SOCIAL STUDIES - 20 Questions Total
  // ============================================
  {
    id: 'primary-soc-003',
    question: 'What is the name of your country?',
    options: ['Ghana', 'Nigeria', 'Sierra Leone', 'All of the above'],
    correctAnswer: 3,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'All are countries in West Africa'
  },
  {
    id: 'primary-soc-004',
    question: 'What do we call the leader of a country?',
    options: ['Teacher', 'President', 'Doctor', 'Farmer'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Government',
    explanation: 'The leader of a country is called a President'
  },
  {
    id: 'primary-soc-005',
    question: 'What is the capital city of Ghana?',
    options: ['Kumasi', 'Accra', 'Tamale', 'Cape Coast'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Accra is the capital city of Ghana'
  },
  {
    id: 'primary-soc-006',
    question: 'How many days are in a week?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Time',
    explanation: 'There are 7 days in a week'
  },
  {
    id: 'primary-soc-007',
    question: 'What do we call the place where we learn?',
    options: ['Hospital', 'School', 'Market', 'Church'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'We learn at school'
  },
  {
    id: 'primary-soc-008',
    question: 'What is the capital city of Nigeria?',
    options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Abuja is the capital city of Nigeria'
  },
  {
    id: 'primary-soc-009',
    question: 'What do we call people who live in the same area?',
    options: ['Family', 'Community', 'School', 'Country'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'People who live in the same area form a community'
  },
  {
    id: 'primary-soc-010',
    question: 'How many months are in a year?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Time',
    explanation: 'There are 12 months in a year'
  },
  {
    id: 'primary-soc-011',
    question: 'What do we call the place where we buy food?',
    options: ['School', 'Hospital', 'Market', 'Church'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'We buy food at the market'
  },
  {
    id: 'primary-soc-012',
    question: 'What is the capital city of Sierra Leone?',
    options: ['Freetown', 'Bo', 'Kenema', 'Makeni'],
    correctAnswer: 0,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Freetown is the capital city of Sierra Leone'
  },
  {
    id: 'primary-soc-013',
    question: 'What do we call the people in our family?',
    options: ['Friends', 'Relatives', 'Neighbors', 'Teachers'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Family',
    explanation: 'People in our family are called relatives'
  },
  {
    id: 'primary-soc-014',
    question: 'How many days are in a month?',
    options: ['28', '30', '31', 'All of the above'],
    correctAnswer: 3,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'Primary',
    topic: 'Time',
    explanation: 'Months can have 28, 30, or 31 days'
  },
  {
    id: 'primary-soc-015',
    question: 'What do we call the place where sick people go?',
    options: ['School', 'Hospital', 'Market', 'Church'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'Sick people go to the hospital'
  },
  {
    id: 'primary-soc-016',
    question: 'What is the capital city of Liberia?',
    options: ['Monrovia', 'Buchanan', 'Gbarnga', 'Kakata'],
    correctAnswer: 0,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Monrovia is the capital city of Liberia'
  },
  {
    id: 'primary-soc-017',
    question: 'What do we call the place where we worship?',
    options: ['School', 'Hospital', 'Market', 'Church'],
    correctAnswer: 3,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'We worship at a church or mosque'
  },
  {
    id: 'primary-soc-018',
    question: 'How many hours are in a day?',
    options: ['12', '20', '24', '30'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Time',
    explanation: 'There are 24 hours in a day'
  },
  {
    id: 'primary-soc-019',
    question: 'What is the capital city of Gambia?',
    options: ['Banjul', 'Serekunda', 'Brikama', 'Bakau'],
    correctAnswer: 0,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Geography',
    explanation: 'Banjul is the capital city of Gambia'
  },
  {
    id: 'primary-soc-020',
    question: 'What do we call the people who teach us?',
    options: ['Doctors', 'Teachers', 'Farmers', 'Traders'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'Primary',
    topic: 'Community',
    explanation: 'People who teach us are called teachers'
  },

  // Total: 80 Primary questions (20 per subject)
  // TO ADD MORE: Simply add objects to this array following the ChallengeQuestion interface
];

// SHS Question Bank (Expandable) - WASSCE Level
const shsQuestionBank: ChallengeQuestion[] = [
  // Core Mathematics - SHS
  {
    id: 'shs-math-001',
    question: 'Simplify: (x² - 9) / (x - 3)',
    options: ['x + 3', 'x - 3', 'x² + 3', '(x + 3)(x - 3)'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Algebraic Factorization',
    explanation: 'Factor the numerator: x² - 9 = (x + 3)(x - 3). Cancel (x - 3) to get x + 3.'
  },
  {
    id: 'shs-math-002',
    question: 'If 2ˣ = 8, what is the value of x?',
    options: ['2', '3', '4', '6'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Indices and Logarithms',
    explanation: '2³ = 8, therefore x = 3'
  },
  {
    id: 'shs-math-003',
    question: 'What is the slope of a line passing through points (2, 3) and (5, 9)?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Coordinate Geometry',
    explanation: 'Slope = (y₂ - y₁)/(x₂ - x₁) = (9 - 3)/(5 - 2) = 6/3 = 2'
  },
  {
    id: 'shs-math-004',
    question: 'Solve for x: 3x - 5 = 2x + 7',
    options: ['10', '12', '8', '15'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Linear Equations',
    explanation: '3x - 2x = 7 + 5, therefore x = 12'
  },
  {
    id: 'shs-math-005',
    question: 'The quadratic formula is used to solve equations of the form ax² + bx + c = 0. What is the discriminant?',
    options: ['b² - 4ac', 'b² + 4ac', `-b ± ${String.fromCharCode(8730)}(b² - 4ac)`, '2a'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Quadratic Equations',
    explanation: 'The discriminant is b² - 4ac, which determines the nature of roots'
  },

  // Integrated Science - SHS
  {
    id: 'shs-sci-001',
    question: 'Which gas is produced when an acid reacts with a metal?',
    options: ['Oxygen', 'Hydrogen', 'Carbon dioxide', 'Nitrogen'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Chemical Reactions',
    explanation: 'Acids react with metals to produce hydrogen gas and a salt'
  },
  {
    id: 'shs-sci-002',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Forces and Motion',
    explanation: 'The Newton (N) is the SI unit of force, named after Isaac Newton'
  },
  {
    id: 'shs-sci-003',
    question: 'What is the function of chlorophyll in photosynthesis?',
    options: ['Store glucose', 'Absorb light energy', 'Release oxygen', 'Transport water'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Photosynthesis',
    explanation: 'Chlorophyll absorbs light energy (mainly blue and red wavelengths) for photosynthesis'
  },
  {
    id: 'shs-sci-004',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Cell Biology',
    explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for the cell'
  },
  {
    id: 'shs-sci-005',
    question: 'What type of bond forms when atoms share electrons?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Chemical Bonding',
    explanation: 'Covalent bonds form when atoms share pairs of electrons'
  },

  // English Language - SHS
  {
    id: 'shs-eng-001',
    question: 'Which literary device compares two things using "like" or "as"?',
    options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Literary Devices',
    explanation: 'A simile makes a comparison using "like" or "as", e.g., "as brave as a lion"'
  },
  {
    id: 'shs-eng-002',
    question: 'Identify the error: "The team are playing well today."',
    options: ['No error', 'Should be "is playing"', 'Should be "was playing"', 'Should be "were played"'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Subject-Verb Agreement',
    explanation: '"Team" is a collective noun treated as singular, so "is playing" is correct'
  },
  {
    id: 'shs-eng-003',
    question: 'What is the synonym of "abundant"?',
    options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Vocabulary',
    explanation: 'Abundant and plentiful both mean existing in large quantities'
  },

  // Social Studies - SHS
  {
    id: 'shs-soc-001',
    question: 'What is the main function of the judiciary?',
    options: ['Make laws', 'Interpret laws', 'Execute laws', 'Repeal laws'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Government',
    explanation: 'The judiciary interprets laws and administers justice'
  },
  {
    id: 'shs-soc-002',
    question: 'Which resource is renewable?',
    options: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Natural Resources',
    explanation: 'Solar energy is renewable as it can be replenished naturally'
  },

  // Additional Core Mathematics - SHS (WASSCE Level)
  {
    id: 'shs-math-011',
    question: 'Evaluate: log₂(16) + log₂(4)',
    options: ['5', '6', '20', '64'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Logarithms',
    explanation: 'log₂(16) = 4 (since 2⁴=16), log₂(4) = 2 (since 2²=4). Sum = 4 + 2 = 6'
  },
  {
    id: 'shs-math-012',
    question: 'If sin θ = 3/5, find cos θ (θ is acute)',
    options: ['3/5', '4/5', '5/3', '5/4'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Trigonometry',
    explanation: 'Using sin²θ + cos²θ = 1: (3/5)² + cos²θ = 1, cos²θ = 16/25, cos θ = 4/5'
  },
  {
    id: 'shs-math-013',
    question: `Simplify: 2${String.fromCharCode(8730)}18 + 3${String.fromCharCode(8730)}8`,
    options: [
      `5${String.fromCharCode(8730)}26`,
      `12${String.fromCharCode(8730)}2`,
      `6${String.fromCharCode(8730)}3 + 6${String.fromCharCode(8730)}2`,
      `5${String.fromCharCode(8730)}2`
    ],
    correctAnswer: 1, // 12√2 is correct: 2√18 = 2×3√2 = 6√2, 3√8 = 3×2√2 = 6√2, sum = 12√2
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Surds',
    explanation: `2${String.fromCharCode(8730)}18 = 2${String.fromCharCode(8730)}(9×2) = 2×3${String.fromCharCode(8730)}2 = 6${String.fromCharCode(8730)}2. 3${String.fromCharCode(8730)}8 = 3${String.fromCharCode(8730)}(4×2) = 3×2${String.fromCharCode(8730)}2 = 6${String.fromCharCode(8730)}2. Total = 6${String.fromCharCode(8730)}2 + 6${String.fromCharCode(8730)}2 = 12${String.fromCharCode(8730)}2`
  },
  {
    id: 'shs-math-014',
    question: 'Find the nth term of the sequence: 5, 8, 11, 14, ...',
    options: ['3n + 2', 'n + 5', '2n + 3', '5n'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Sequences',
    explanation: 'Common difference = 3. First term = 5. Formula: aₙ = a + (n-1)d = 5 + (n-1)3 = 3n + 2'
  },
  {
    id: 'shs-math-015',
    question: 'Solve: 2^(x+1) = 32',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Indices',
    explanation: '32 = 2⁵, so 2^(x+1) = 2⁵. Therefore x+1 = 5, x = 4'
  },
  {
    id: 'shs-math-016',
    question: 'What is the determinant of matrix [[2, 3], [1, 4]]?',
    options: ['5', '8', '11', '6'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Matrices',
    explanation: 'det = (2×4) - (3×1) = 8 - 3 = 5'
  },
  {
    id: 'shs-math-017',
    question: 'If y varies inversely as x and y = 6 when x = 2, find y when x = 4',
    options: ['3', '12', '8', '1.5'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Variation',
    explanation: 'y = k/x. 6 = k/2, so k = 12. When x = 4: y = 12/4 = 3'
  },
  {
    id: 'shs-math-018',
    question: 'Convert 101₂ to base 10',
    options: ['3', '5', '7', '9'],
    correctAnswer: 1,
    subject: 'Core Mathematics',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Number Bases',
    explanation: '101₂ = 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5'
  },
  {
    id: 'shs-math-019',
    question: 'The angle of elevation of the top of a tower from a point 20m away is 30°. Find the height of the tower (tan 30° = 0.577)',
    options: ['11.54m', '17.32m', '20m', '34.64m'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Trigonometry Applications',
    explanation: 'tan 30° = height/20. Height = 20 × 0.577 = 11.54m'
  },
  {
    id: 'shs-math-020',
    question: 'Factorize completely: x² - 5x + 6',
    options: ['(x-2)(x-3)', '(x-1)(x-6)', '(x+2)(x+3)', '(x-6)(x+1)'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Factorization',
    explanation: 'Find two numbers that multiply to 6 and add to -5: -2 and -3. So (x-2)(x-3)'
  },

  // Additional Integrated Science - SHS
  {
    id: 'shs-sci-011',
    question: 'What is the SI unit of electric current?',
    options: ['Volt', 'Ohm', 'Ampere', 'Watt'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Electricity',
    explanation: 'The ampere (A) is the SI unit for electric current'
  },
  {
    id: 'shs-sci-012',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Cell Biology',
    explanation: 'Mitochondria generate ATP through cellular respiration'
  },
  {
    id: 'shs-sci-013',
    question: 'What is the pH of a neutral solution at 25°C?',
    options: ['0', '7', '14', '1'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Acids and Bases',
    explanation: 'pH 7 is neutral; <7 is acidic, >7 is basic'
  },
  {
    id: 'shs-sci-014',
    question: "Newton's first law states that an object at rest will remain at rest unless acted upon by:",
    options: ['Friction', 'An unbalanced force', 'Gravity', 'Inertia'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Forces and Motion',
    explanation: 'An unbalanced (net) force is required to change an object\'s state of motion'
  },
  {
    id: 'shs-sci-015',
    question: 'Which blood type is the universal donor?',
    options: ['A+', 'B+', 'AB+', 'O-'],
    correctAnswer: 3,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Human Biology',
    explanation: 'O- blood has no A, B, or Rh antigens, making it compatible with all blood types'
  },
  {
    id: 'shs-sci-016',
    question: 'What is the chemical formula for glucose?',
    options: ['C₆H₁₂O₆', 'CO₂', 'H₂O', 'C₁₂H₂₂O₁₁'],
    correctAnswer: 0,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Biochemistry',
    explanation: 'Glucose is a simple sugar with molecular formula C₆H₁₂O₆'
  },
  {
    id: 'shs-sci-017',
    question: 'What type of lens is used to correct myopia (short-sightedness)?',
    options: ['Convex lens', 'Concave lens', 'Bifocal lens', 'Cylindrical lens'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Optics',
    explanation: 'Concave lenses diverge light rays to correct myopia'
  },
  {
    id: 'shs-sci-018',
    question: 'In the periodic table, elements in the same group have the same:',
    options: ['Atomic mass', 'Number of protons', 'Number of valence electrons', 'Number of neutrons'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Periodic Table',
    explanation: 'Elements in the same group have the same number of valence electrons'
  },
  {
    id: 'shs-sci-019',
    question: 'What is the speed of light in vacuum?',
    options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁵ m/s'],
    correctAnswer: 0,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Physics Constants',
    explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s or 300,000 km/s'
  },
  {
    id: 'shs-sci-020',
    question: 'Which process do plants use to convert light energy into chemical energy?',
    options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Plant Biology',
    explanation: 'Photosynthesis converts light energy to glucose (chemical energy) using CO₂ and H₂O'
  },

  // Additional English Language - SHS
  {
    id: 'shs-eng-011',
    question: 'Choose the correct form: "Neither of the students ____ finished the assignment."',
    options: ['have', 'has', 'are', 'were'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Subject-Verb Agreement',
    explanation: '"Neither" takes a singular verb, so "has" is correct'
  },
  {
    id: 'shs-eng-012',
    question: 'What is the antonym of "benevolent"?',
    options: ['Kind', 'Malevolent', 'Generous', 'Helpful'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Vocabulary',
    explanation: 'Benevolent means kind/generous; malevolent means wishing harm to others'
  },
  {
    id: 'shs-eng-013',
    question: 'Identify the figure of speech: "The classroom was a zoo."',
    options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Figures of Speech',
    explanation: 'A metaphor directly states that one thing is another (without using "like" or "as")'
  },
  {
    id: 'shs-eng-014',
    question: 'Which sentence uses the passive voice correctly?',
    options: [
      'The teacher teaches the students.',
      'The students are taught by the teacher.',
      'The teacher is teaching the students.',
      'The students teach the teacher.'
    ],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Voice (Active/Passive)',
    explanation: 'Passive voice: subject receives the action. "The students are taught by the teacher."'
  },
  {
    id: 'shs-eng-015',
    question: 'What does the idiom "break the ice" mean?',
    options: [
      'To damage something',
      'To start a conversation in a social setting',
      'To be very cold',
      'To end a relationship'
    ],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Idioms',
    explanation: '"Break the ice" means to initiate conversation or ease tension in a social situation'
  },

  // Additional Social Studies - SHS
  {
    id: 'shs-soc-011',
    question: 'Who is known as the "Father of Pan-Africanism"?',
    options: ['Kwame Nkrumah', 'W.E.B. Du Bois', 'Marcus Garvey', 'Nelson Mandela'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'African History',
    explanation: 'W.E.B. Du Bois is often credited as the father of Pan-Africanism'
  },
  {
    id: 'shs-soc-012',
    question: 'What is the capital of Ghana?',
    options: ['Kumasi', 'Accra', 'Tamale', 'Cape Coast'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Geography',
    explanation: 'Accra is the capital and largest city of Ghana'
  },
  {
    id: 'shs-soc-013',
    question: 'Which economic system is characterized by private ownership and free markets?',
    options: ['Socialism', 'Capitalism', 'Communism', 'Feudalism'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Economics',
    explanation: 'Capitalism is based on private ownership of means of production and market-driven economy'
  },
  {
    id: 'shs-soc-014',
    question: 'Ghana gained independence in which year?',
    options: ['1945', '1957', '1960', '1963'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Ghanaian History',
    explanation: 'Ghana gained independence on March 6, 1957, becoming the first sub-Saharan African nation to do so'
  },
  {
    id: 'shs-soc-015',
    question: 'What is the primary function of the United Nations?',
    options: [
      'Economic development only',
      'Maintaining international peace and security',
      'Promoting tourism',
      'Regulating trade'
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'International Relations',
    explanation: 'The UN\'s primary purpose is to maintain international peace and security'
  },

  // More Core Mathematics - SHS (Expanding to 40+ questions)
  {
    id: 'shs-math-021',
    question: 'If the sum of the first n natural numbers is 210, find n.',
    options: ['15', '18', '20', '21'],
    correctAnswer: 2,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Sequences and Series',
    explanation: 'Sum = n(n+1)/2 = 210. So n(n+1) = 420. Solving: n = 20'
  },
  {
    id: 'shs-math-022',
    question: 'Express 0.3̅ (0.333...) as a fraction.',
    options: ['1/3', '3/10', '1/30', '3/100'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Recurring Decimals',
    explanation: 'Let x = 0.333... Then 10x = 3.333... So 10x - x = 3, giving x = 1/3'
  },
  {
    id: 'shs-math-023',
    question: 'Find the value of x if log₃(x) = 4',
    options: ['12', '64', '81', '243'],
    correctAnswer: 2,
    subject: 'Core Mathematics',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Logarithms',
    explanation: 'log₃(x) = 4 means 3⁴ = x, so x = 81'
  },
  {
    id: 'shs-math-024',
    question: 'The probability of rolling a sum of 7 with two dice is:',
    options: ['1/6', '1/12', '1/36', '7/36'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Probability',
    explanation: 'Favorable outcomes: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 outcomes. Total = 36. P = 6/36 = 1/6'
  },
  {
    id: 'shs-math-025',
    question: 'Simplify: (x³ - 8) / (x - 2)',
    options: ['x² + 2x + 4', 'x² - 2x + 4', 'x² + 4', 'x² - 4'],
    correctAnswer: 0,
    subject: 'Core Mathematics',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Factorization',
    explanation: 'x³ - 8 = (x - 2)(x² + 2x + 4). Cancel (x - 2) to get x² + 2x + 4'
  },

  // More Integrated Science - SHS
  {
    id: 'shs-sci-021',
    question: "What is Ohm's Law?",
    options: ['V = IR', 'P = VI', 'E = mc²', 'F = ma'],
    correctAnswer: 0,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Electricity',
    explanation: "Ohm's Law states that Voltage = Current × Resistance (V = IR)"
  },
  {
    id: 'shs-sci-022',
    question: 'Which process converts liquid water to water vapor?',
    options: ['Condensation', 'Evaporation', 'Sublimation', 'Precipitation'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'States of Matter',
    explanation: 'Evaporation is the process where liquid changes to gas'
  },
  {
    id: 'shs-sci-023',
    question: 'What type of bond exists between sodium and chlorine in NaCl?',
    options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Chemical Bonding',
    explanation: 'Na⁺ and Cl⁻ form an ionic bond through electron transfer'
  },
  {
    id: 'shs-sci-024',
    question: 'What is the function of red blood cells?',
    options: ['Fight infections', 'Transport oxygen', 'Clot blood', 'Produce antibodies'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Human Biology',
    explanation: 'Red blood cells contain hemoglobin which transports oxygen'
  },
  {
    id: 'shs-sci-025',
    question: 'The SI unit of force is:',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Physics Units',
    explanation: 'Force is measured in Newtons (N), where 1N = 1 kg⋅m/s²'
  },

  // More English Language - SHS
  {
    id: 'shs-eng-016',
    question: 'Choose the correct word: "The effect/affect of the policy was significant."',
    options: ['effect', 'affect', 'both are correct', 'neither is correct'],
    correctAnswer: 0,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Word Choice',
    explanation: '"Effect" is a noun (result), "affect" is a verb (to influence)'
  },
  {
    id: 'shs-eng-017',
    question: 'What is the meaning of the idiom "piece of cake"?',
    options: ['A delicious dessert', 'Very easy', 'Very difficult', 'A celebration'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Idioms',
    explanation: '"Piece of cake" means something is very easy to accomplish'
  },
  {
    id: 'shs-eng-018',
    question: 'Identify the clause type: "Although it was raining"',
    options: ['Independent clause', 'Dependent clause', 'Relative clause', 'Noun clause'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'hard',
    level: 'SHS',
    topic: 'Grammar',
    explanation: 'Begins with subordinating conjunction "although", cannot stand alone'
  },
  {
    id: 'shs-eng-019',
    question: 'What is an oxymoron?',
    options: [
      'A comparison using like or as',
      'Contradictory terms appearing together',
      'Exaggeration for effect',
      'Repetition of consonant sounds'
    ],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Figures of Speech',
    explanation: 'An oxymoron combines contradictory terms, e.g., "deafening silence"'
  },
  {
    id: 'shs-eng-020',
    question: 'Choose the correctly punctuated sentence:',
    options: [
      'I said "hello" to him.',
      'I said, "Hello" to him.',
      'I said "Hello," to him.',
      'I said "hello," to him.'
    ],
    correctAnswer: 0,
    subject: 'English Language',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Punctuation',
    explanation: 'Direct speech after a verb of saying needs quotation marks around the greeting'
  },

  // More Social Studies - SHS
  {
    id: 'shs-soc-016',
    question: 'What type of government does Ghana practice?',
    options: ['Monarchy', 'Democracy', 'Dictatorship', 'Oligarchy'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'Government',
    explanation: 'Ghana practices constitutional democracy with multi-party elections'
  },
  {
    id: 'shs-soc-017',
    question: 'The process of a bill becoming law involves:',
    options: [
      'President signing only',
      'Parliament approval and presidential assent',
      'Supreme Court approval',
      'Referendum only'
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Legislative Process',
    explanation: 'A bill must pass through Parliament and receive presidential assent to become law'
  },
  {
    id: 'shs-soc-018',
    question: 'ECOWAS stands for:',
    options: [
      'East Coast of West African States',
      'Economic Community of West African States',
      'European Council of West African States',
      'Educational Community of Western African States'
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    level: 'SHS',
    topic: 'International Organizations',
    explanation: 'ECOWAS promotes economic integration among 15 West African countries'
  },
  {
    id: 'shs-soc-019',
    question: 'What is inflation?',
    options: [
      'Decrease in money supply',
      'Increase in general price levels',
      'Decrease in unemployment',
      'Increase in exports'
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'Economics',
    explanation: 'Inflation is the sustained increase in the general price level of goods and services'
  },
  {
    id: 'shs-soc-020',
    question: 'The Berlin Conference of 1884-1885 resulted in:',
    options: [
      'African independence',
      'Partition of Africa among European powers',
      'Formation of the African Union',
      'End of slave trade'
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    level: 'SHS',
    topic: 'African History',
    explanation: 'The Berlin Conference formalized the scramble for and partition of Africa'
  },
];

/**
 * Get random questions for challenge based on education level
 * Implements anti-repeat logic to ensure fresh questions each time
 */
/**
 * Get class level from education level and difficulty (for backward compatibility)
 */
function mapDifficultyToClassLevel(level: EducationLevel, difficulty: QuestionDifficulty): ClassLevel | undefined {
  if (level === 'JHS') {
    if (difficulty === 'easy') return 'JHS 1';
    if (difficulty === 'medium') return 'JHS 2';
    if (difficulty === 'hard') return 'JHS 3';
  } else if (level === 'SHS') {
    if (difficulty === 'easy') return 'SHS 1';
    if (difficulty === 'medium') return 'SHS 2';
    if (difficulty === 'hard') return 'SHS 3';
  } else if (level === 'Primary') {
    if (difficulty === 'easy') return 'Primary 1';
    if (difficulty === 'medium') return 'Primary 3';
    if (difficulty === 'hard') return 'Primary 5';
  }
  return undefined;
}

/**
 * Get challenge questions with STRICT level filtering
 * Primary students ONLY get Primary questions
 * JHS students ONLY get JHS questions  
 * SHS students ONLY get SHS questions
 * 
 * Now supports classLevel parameter for class-based filtering (JHS 1, JHS 2, JHS 3, etc.)
 */
export function getChallengeQuestions(
  level: EducationLevel,
  subject: string,
  difficulty: QuestionDifficulty | ClassLevel,
  count: number = 10,
  userId: string = 'guest'
): ChallengeQuestion[] {
  // Determine if difficulty is actually a classLevel
  const classLevels: ClassLevel[] = ['JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
  const isClassLevel = classLevels.includes(difficulty as ClassLevel);
  const classLevel = isClassLevel ? (difficulty as ClassLevel) : mapDifficultyToClassLevel(level, difficulty as QuestionDifficulty);
  const legacyDifficulty = isClassLevel ? undefined : (difficulty as QuestionDifficulty);
  const sessionKey = `${userId}-${level}`;
  
  // Check premium status for question bank limit
  // Import here to avoid circular dependency
  let isPremium = false;
  let freeBankLimit = 5; // Free users get 5 questions per subject (optimized for conversion)
  if (typeof window !== 'undefined') {
    try {
      const { isPremiumUser } = require('./monetization');
      isPremium = isPremiumUser(userId);
    } catch (e) {
      // If monetization module not available, default to free
      isPremium = false;
    }
  }
  
  // STRICT LEVEL FILTERING - Each level only gets their own questions
  // Primary students can ONLY see Primary questions, JHS only JHS, SHS only SHS
  if (level === 'Primary') {
    // Primary questions only
    let filtered = primaryQuestionBank.filter(q => q.level === 'Primary');
    
    // Filter by subject if specified
    if (subject && subject !== 'Mixed' && subject !== 'general') {
      filtered = filtered.filter(q => q.subject === subject);
    }
    
    // Filter by classLevel or difficulty (prefer classLevel)
    // If classLevel is specified, filter by it. If not, filter by difficulty and assign classLevel
    if (classLevel) {
      filtered = filtered.filter(q => {
        // If question has classLevel, use it; otherwise assign based on difficulty
        const qClassLevel = q.classLevel || assignClassLevel(q.level, q.difficulty);
        return qClassLevel === classLevel;
      });
    } else if (legacyDifficulty && ['easy', 'medium', 'hard'].includes(legacyDifficulty)) {
      filtered = filtered.filter(q => q.difficulty === legacyDifficulty);
      // Assign classLevel to filtered questions
      filtered = filtered.map((q, idx) => ({
        ...q,
        classLevel: q.classLevel || assignClassLevel(q.level, q.difficulty, idx)
      }));
    } else {
      // Assign classLevel to all questions
      filtered = filtered.map((q, idx) => ({
        ...q,
        classLevel: q.classLevel || assignClassLevel(q.level, q.difficulty, idx)
      }));
    }
    
    // Apply question bank limit for free users (freemium model)
    // Free users: Limited question bank (e.g., 10 questions per subject - they see same questions repeating)
    // Premium users: Full question bank (all available questions)
    if (!isPremium && filtered.length > freeBankLimit) {
      // Limit the question bank for free users - they'll see the same questions repeating
      filtered = filtered.slice(0, freeBankLimit);
    }
    
    // Filter out recently used questions
    const fresh = filterFreshQuestions(filtered, sessionKey);
    
    // Shuffle and select
    const shuffled = fresh.sort(() => Math.random() - 0.5);
    const finalQuestions = shuffled.length >= count
      ? shuffled.slice(0, count)
      : [...shuffled, ...filtered.filter(q => !fresh.includes(q)).sort(() => Math.random() - 0.5)].slice(0, count);
    
    markQuestionsUsed(sessionKey, finalQuestions.map(q => q.id));
    return finalQuestions;
    
  } else if (level === 'JHS') {
    // JHS questions only - Use BECE questions + past questions (if available)
    // Map subject names: 'Science' -> 'Integrated Science' for BECE questions
    let mappedSubject = subject;
    if (subject === 'Science') {
      mappedSubject = 'Integrated Science';
    }
    // Map classLevel to difficulty for BECE questions (temporary until bece-questions.ts is updated)
    let beceDifficulty: QuestionDifficulty = 'medium';
    if (classLevel === 'JHS 1') beceDifficulty = 'easy';
    else if (classLevel === 'JHS 2') beceDifficulty = 'medium';
    else if (classLevel === 'JHS 3') beceDifficulty = 'hard';
    else if (legacyDifficulty) beceDifficulty = legacyDifficulty;
    
    const jhsQuestions = getJHSQuestions(count, mappedSubject as JHSSubject, beceDifficulty);
    
    // Convert to ChallengeQuestion format
    // Map 'Integrated Science' back to 'Science' for consistency with getAvailableSubjects
    // Add classLevel based on difficulty mapping
    const converted = jhsQuestions.map(q => {
      let mappedClassLevel: ClassLevel | undefined = undefined;
      if (classLevel) {
        mappedClassLevel = classLevel;
      } else if (q.difficulty === 'easy') {
        mappedClassLevel = 'JHS 1';
      } else if (q.difficulty === 'medium') {
        mappedClassLevel = 'JHS 2';
      } else if (q.difficulty === 'hard') {
        mappedClassLevel = 'JHS 3';
      }
      
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        subject: q.subject === 'Integrated Science' ? 'Science' : q.subject,
        difficulty: q.difficulty,
        classLevel: mappedClassLevel,
        level: 'JHS' as EducationLevel,
        explanation: q.explanation,
        topic: q.topic
      };
    });
    
    // TODO: Integrate JHS past questions (BECE past questions)
    // const pastQuestions = getPastQuestionsAsChallengeQuestions('JHS', subject, Math.floor(count * 0.2));
    // converted.push(...pastQuestions);
    
    // Apply question bank limit for free users (freemium model)
    // Free users: Limited question bank (e.g., 10 questions per subject - they see same questions repeating)
    // Premium users: Full question bank (all available questions)
    let limitedConverted = converted;
    if (!isPremium && converted.length > freeBankLimit) {
      // Limit the question bank for free users - they'll see the same questions repeating
      limitedConverted = converted.slice(0, freeBankLimit);
    }
    
    // Filter out recently used questions
    const fresh = filterFreshQuestions(limitedConverted, sessionKey);
    
    // If we don't have enough fresh questions, supplement with some used ones
    const finalQuestions = fresh.length >= count 
      ? fresh.slice(0, count)
      : [...fresh, ...limitedConverted.filter(q => !fresh.includes(q))].slice(0, count);
    
    // Mark these questions as used
    markQuestionsUsed(sessionKey, finalQuestions.map(q => q.id));
    
    return finalQuestions;
    
  } else if (level === 'SHS') {
    // SHS questions only - Use question bank + past questions
    let filtered = shsQuestionBank.filter(q => q.level === 'SHS');
    
    // Filter by subject if specified
    if (subject && subject !== 'Mixed' && subject !== 'general') {
      filtered = filtered.filter(q => q.subject === subject);
    }
    
    // Filter by classLevel or difficulty (prefer classLevel)
    // If classLevel is specified, filter by it. If not, filter by difficulty and assign classLevel
    if (classLevel) {
      filtered = filtered.filter(q => {
        // If question has classLevel, use it; otherwise assign based on difficulty
        const qClassLevel = q.classLevel || assignClassLevel(q.level, q.difficulty);
        return qClassLevel === classLevel;
      });
    } else if (legacyDifficulty && ['easy', 'medium', 'hard'].includes(legacyDifficulty)) {
      filtered = filtered.filter(q => q.difficulty === legacyDifficulty);
      // Assign classLevel to filtered questions
      filtered = filtered.map((q, idx) => ({
        ...q,
        classLevel: q.classLevel || assignClassLevel(q.level, q.difficulty, idx)
      }));
    } else {
      // Assign classLevel to all questions
      filtered = filtered.map((q, idx) => ({
        ...q,
        classLevel: q.classLevel || assignClassLevel(q.level, q.difficulty, idx)
      }));
    }
    
    // Integrate SHS past questions (WASSCE)
    // Get 20% of questions from past questions if available
    const pastQuestionsCount = Math.floor(count * 0.2);
    const pastQuestions = getPastQuestionsAsChallengeQuestions('SHS', subject, pastQuestionsCount);
    if (pastQuestions.length > 0) {
      filtered = [...filtered, ...pastQuestions];
    }
    
    // Apply question bank limit for free users (freemium model)
    // Free users: Limited question bank (e.g., 10 questions per subject - they see same questions repeating)
    // Premium users: Full question bank (all available questions)
    if (!isPremium && filtered.length > freeBankLimit) {
      // Limit the question bank for free users - they'll see the same questions repeating
      filtered = filtered.slice(0, freeBankLimit);
    }
    
    // Filter out recently used questions
    const fresh = filterFreshQuestions(filtered, sessionKey);
    
    // Shuffle to randomize question order
    const shuffled = fresh.sort(() => Math.random() - 0.5);
    
    // If we don't have enough fresh questions, supplement with used ones
    const finalQuestions = shuffled.length >= count
      ? shuffled.slice(0, count)
      : [...shuffled, ...filtered.filter(q => !fresh.includes(q)).sort(() => Math.random() - 0.5)].slice(0, count);
    
    // Mark these questions as used
    markQuestionsUsed(sessionKey, finalQuestions.map(q => q.id));
    
    return finalQuestions;
  }
  
  // Fallback - should never reach here with strict filtering
  return [];
}

/**
 * Get available subjects for a given education level
 */
export function getAvailableSubjects(level: EducationLevel): string[] {
  if (level === 'Primary') {
    return [
      'Mixed',
      'Mathematics',
      'English Language',
      'Science',
      'Social Studies'
    ];
  } else if (level === 'JHS') {
    return [
      'Mixed',
      'Mathematics',
      'English Language',
      'Science',
      'Social Studies',
      'ICT',
      'Creative Arts',
      'French',
      'Arabic'
    ];
  } else {
    return [
      'Mixed',
      'Core Mathematics',
      'English Language',
      'Integrated Science',
      'Social Studies'
    ];
  }
}

/**
 * Get question counts by level (for stats)
 */
export function getQuestionStats(): { primary: number; jhs: number; shs: number; total: number } {
  const primaryCount = primaryQuestionBank.length;
  const shsCount = shsQuestionBank.length;
  // JHS count from bece-questions (approximate based on file size)
  const jhsCount = 150; // BECE questions in bece-questions.ts
  
  return {
    primary: primaryCount,
    jhs: jhsCount,
    shs: shsCount,
    total: primaryCount + jhsCount + shsCount
  };
}

/**
 * Clear recently used questions for a user (useful for testing)
 */
export function clearRecentQuestions(userId: string = 'guest', level?: EducationLevel): void {
  if (level) {
    const sessionKey = `${userId}-${level}`;
    recentlyUsedQuestions.delete(sessionKey);
  } else {
    // Clear all sessions for this user
    const keys = Array.from(recentlyUsedQuestions.keys()).filter(k => k.startsWith(userId));
    keys.forEach(k => recentlyUsedQuestions.delete(k));
  }
}

/**
 * Validate if enough questions exist for a challenge
 */
export function hasEnoughQuestions(
  level: EducationLevel,
  subject: string,
  difficulty: QuestionDifficulty,
  requiredCount: number
): boolean {
  const available = getChallengeQuestions(level, subject, difficulty, 1000);
  return available.length >= requiredCount;
}

/**
 * SCALABLE LOADING FUNCTIONS
 * These functions can be extended to load questions from external sources
 */

/**
 * Load additional questions from external source (placeholder for future implementation)
 * This allows loading questions from APIs, databases, or JSON files
 */
export async function loadQuestionsFromExternalSource(
  level: EducationLevel,
  subject: string,
  source: 'api' | 'database' | 'json' = 'api'
): Promise<ChallengeQuestion[]> {
  // Placeholder for future implementation
  // Example:
  // if (source === 'api') {
  //   const response = await fetch(`/api/questions?level=${level}&subject=${subject}`);
  //   return response.json();
  // }
  return [];
}

/**
 * Add questions to the question bank dynamically
 * Useful for loading questions at runtime
 */
export function addQuestionsToBank(
  level: EducationLevel,
  questions: ChallengeQuestion[]
): void {
  // Validate all questions are for the correct level
  const validQuestions = questions.filter(q => q.level === level);
  
  // Add to appropriate bank
  if (level === 'Primary') {
    primaryQuestionBank.push(...validQuestions);
  } else if (level === 'SHS') {
    shsQuestionBank.push(...validQuestions);
  }
  // JHS questions are managed in bece-questions.ts
}

/**
 * Get question bank size for a specific level
 * Useful for monitoring and scaling
 */
export function getQuestionBankSize(level: EducationLevel): number {
  if (level === 'Primary') {
    return primaryQuestionBank.length;
  } else if (level === 'JHS') {
    return 150; // Approximate from bece-questions.ts
  } else if (level === 'SHS') {
    return shsQuestionBank.length;
  }
  return 0;
}
