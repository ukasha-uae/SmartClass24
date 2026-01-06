# Question Bank Migration Guide

## Overview

The question bank has been refactored into a modular structure with support for multiple question types.

## New Structure

```
questions/
  ├── types.ts                    # Question type definitions
  ├── shs/
  │   ├── chemistry.ts           # Chemistry questions
  │   ├── physics.ts             # Physics questions
  │   ├── biology.ts             # Biology questions
  │   ├── elective-mathematics.ts # Elective Mathematics questions
  │   └── index.ts               # Exports all SHS questions
  ├── jhs/                        # JHS questions (to be added)
  └── primary/                    # Primary questions (to be added)
```

## Question Types Supported

1. **MCQ (Multiple Choice)** - Traditional multiple choice questions
2. **True/False** - Binary choice questions
3. **Fill in the Blank** - Questions with blank spaces to fill
4. **Matching** - Match items from two lists
5. **Short Answer** - Text-based answers with acceptable alternatives
6. **Essay** - Long-form written responses

## Adding Questions

### MCQ Question Example
```typescript
{
  id: 'wassce-2023-chem-001',
  type: 'mcq',
  question: 'What is the atomic number of carbon?',
  options: ['6', '12', '14', '18'],
  correctAnswer: 0, // Index of correct option
  subject: 'Chemistry',
  difficulty: 'easy',
  classLevel: 'SHS 1',
  level: 'SHS',
  topic: 'Atomic Structure',
  explanation: 'Carbon has atomic number 6',
  source: 'actual WASSCE',
  year: 2023
}
```

### True/False Question Example
```typescript
{
  id: 'wassce-2023-chem-tf-001',
  type: 'true-false',
  question: 'Sodium chloride is a covalent compound.',
  correctAnswer: false,
  subject: 'Chemistry',
  difficulty: 'medium',
  classLevel: 'SHS 2',
  level: 'SHS',
  topic: 'Chemical Bonding',
  explanation: 'Sodium chloride is ionic, not covalent.',
  source: 'actual WASSCE',
  year: 2023
}
```

### Fill in the Blank Example
```typescript
{
  id: 'wassce-2023-chem-fb-001',
  type: 'fill-blank',
  questionTemplate: 'The chemical symbol for gold is {{0}}, and it has atomic number {{1}}.',
  blanks: [
    {
      position: 0,
      correctAnswer: 'Au',
      alternatives: ['AU', 'au']
    },
    {
      position: 1,
      correctAnswer: '79',
      alternatives: ['seventy-nine']
    }
  ],
  subject: 'Chemistry',
  difficulty: 'easy',
  classLevel: 'SHS 1',
  level: 'SHS',
  topic: 'Periodic Table',
  explanation: 'Gold has symbol Au and atomic number 79.',
  source: 'actual WASSCE',
  year: 2023
}
```

### Short Answer Example
```typescript
{
  id: 'wassce-2023-chem-sa-001',
  type: 'short-answer',
  question: 'Name the process by which plants convert CO₂ and H₂O into glucose.',
  correctAnswer: 'photosynthesis',
  acceptableAnswers: ['Photosynthesis', 'PHOTOSYNTHESIS'],
  subject: 'Chemistry',
  difficulty: 'medium',
  classLevel: 'SHS 2',
  level: 'SHS',
  topic: 'Biochemistry',
  explanation: 'Photosynthesis converts CO₂ and H₂O into glucose.',
  source: 'actual WASSCE',
  year: 2023,
  maxLength: 50
}
```

## Migration Steps

1. **For each subject file**, gradually migrate questions from `challenge-questions.ts`
2. **Convert old MCQ format** to new format (add `type: 'mcq'`)
3. **Add variety** by converting some questions to True/False, Fill-blank, or Short Answer
4. **Update imports** in `challenge-questions.ts` to use modular files
5. **Test** that all question types render correctly in the UI

## Benefits

- **Scalable**: Each subject in its own file
- **Maintainable**: Easy to find and update questions
- **Varied**: Multiple question types for better assessment
- **Organized**: Clear structure by level and subject
- **Fast**: Smaller files = faster parsing


