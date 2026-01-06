# Verified Question Numbers Guide

## How to Add Verified Question Numbers

When you verify a question against the actual WASSCE paper and confirm its question number, add the `verifiedQuestionNumber` field to the question.

### Example

```typescript
{
  id: 'wassce-2019-phys-005',
  type: 'mcq',
  question: "Newton's second law of motion is expressed as:",
  options: ['F = ma', 'F = mv', 'F = m/v', 'F = m²a'],
  correctAnswer: 0,
  subject: 'Physics',
  difficulty: 'medium',
  classLevel: 'SHS 2',
  level: 'SHS',
  topic: 'Newton\'s Laws',
  explanation: 'F = ma (Force = mass × acceleration) is Newton\'s second law',
  source: 'actual WASSCE',
  year: 2019,
  paper: 1, // Optional but recommended for clarity
  verifiedQuestionNumber: 24, // ✅ Only add when verified against actual paper
}
```

### Badge Display

- **With verified number**: `WASSCE 2019 • Paper 1 • Q24`
- **Without verified number**: `WASSCE 2019 • Paper 1` (no Q number shown)

### Verification Process

1. **Obtain official WASSCE paper** (from WAEC or verified source)
2. **Find the question** in the actual paper
3. **Note the exact question number** from the paper
4. **Add `verifiedQuestionNumber`** field to the question data
5. **Test** to ensure badge displays correctly

### Important Notes

- ✅ **DO** add `verifiedQuestionNumber` only when you've verified it against the actual paper
- ❌ **DON'T** use sequential IDs (001, 002, 003) as question numbers
- ✅ **DO** verify year and paper are correct
- ❌ **DON'T** guess question numbers

### Current Status

- All Physics questions have `year` and inferred `paper: 1` (MCQs)
- No questions have `verifiedQuestionNumber` yet (needs verification)
- Badge shows: `WASSCE YYYY • Paper 1` (year + paper only)

