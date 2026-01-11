// SHS Questions Index
// Imports all SHS subject question banks
import type { ChallengeQuestion } from '../types';
import { chemistryQuestions } from './chemistry';
import { physicsQuestions } from './physics';
import { biologyQuestions } from './biology';
import { electiveMathematicsQuestions } from './elective-mathematics';
import { economicsQuestions } from './economics';
import { governmentQuestions } from './government';
import { geographyQuestions } from './geography';
import { historyQuestions } from './history';
import { accountingQuestions } from './accounting';
import { literatureQuestions } from './literature';

// Combine all SHS questions
export const shsQuestionBank: ChallengeQuestion[] = [
  ...chemistryQuestions,
  ...physicsQuestions,
  ...biologyQuestions,
  ...electiveMathematicsQuestions,
  ...economicsQuestions,
  ...governmentQuestions,
  ...geographyQuestions,
  ...historyQuestions,
  ...accountingQuestions,
  ...literatureQuestions,
];

// Export individual question banks for selective loading
export { chemistryQuestions } from './chemistry';
export { physicsQuestions } from './physics';
export { biologyQuestions } from './biology';
export { electiveMathematicsQuestions } from './elective-mathematics';
export { economicsQuestions } from './economics';
export { governmentQuestions } from './government';
export { geographyQuestions } from './geography';
export { historyQuestions } from './history';
export { accountingQuestions } from './accounting';
export { literatureQuestions } from './literature';

// Helper function to get questions by subject
export function getSHSQuestionsBySubject(subject: string): ChallengeQuestion[] {
  return shsQuestionBank.filter(q => q.subject === subject);
}

// Helper function to get questions by type
export function getSHSQuestionsByType(type: ChallengeQuestion['type']): ChallengeQuestion[] {
  return shsQuestionBank.filter(q => q.type === type);
}
