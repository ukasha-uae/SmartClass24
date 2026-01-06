# Upgrade Physics Questions Using WAEC e-Learning

## Quick Start Guide

### Step 1: Access WAEC e-Learning
Go to: https://www.waeconline.org.ng/e-learning/Physics/

### Step 2: Find Questions by Year
- Navigate to specific year (2023, 2022, 2021, 2020, 2019)
- Access Paper 1 (Objective) or Paper 2 (Essay) questions
- Note the **exact question number** from each page

### Step 3: Match to Our Questions
In `src/lib/questions/shs/physics.ts`, find matching questions and update:

## Update Template

**Before**:
```typescript
{
  id: 'wassce-2023-phys-001',
  type: 'mcq',
  question: 'What is the SI unit of force?',
  options: ['Joule', 'Newton', 'Watt', 'Pascal'],
  correctAnswer: 1,
  subject: 'Physics',
  year: 2023
}
```

**After** (when verified):
```typescript
{
  id: 'wassce-2023-phys-001', // Keep our ID
  type: 'mcq',
  question: 'What is the SI unit of force?',
  options: ['Joule', 'Newton', 'Watt', 'Pascal'],
  correctAnswer: 1,
  subject: 'Physics',
  year: 2023,
  paper: 1, // From WAEC
  verifiedQuestionNumber: 5, // Actual Q number from WAEC 2023 Paper 1
  explanation: 'The newton (N) is the SI unit of force. WAEC examiners note that students often confuse this with joule (energy) or watt (power).'
}
```

## What to Extract from WAEC Pages

1. **Question Number**: From URL or page header (e.g., Q3, Q5, Q24)
2. **Year**: From page (2023, 2022, etc.)
3. **Paper**: Paper 1 (Objective) or Paper 2 (Essay)
4. **Examiner Insights**: Common mistakes mentioned
5. **Expected Response**: Model answer format

## Verification Priority

1. **Start with 2023** (most recent)
2. **Focus on Paper 1** (MCQ questions we have)
3. **Verify 10-20 questions** first as a test
4. **Then scale** to all 120 questions

## Badge Display

- **With verified number**: `WASSCE 2023 • Paper 1 • Q5`
- **Without verified number**: `WASSCE 2023 • Paper 1`

Only verified numbers will show in the badge!

