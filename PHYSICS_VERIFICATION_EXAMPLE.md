# Physics Question Verification - Practical Example

## Based on WAEC e-Learning Structure

From the [WAEC Physics page](https://www.waeconline.org.ng/e-learning/Physics/Phys240mq3.html), we can see:

### What We Learned

1. **URL Pattern**: `Phys240mq3.html`
   - `Phys` = Physics
   - `240` = Year code (2024 or 2023)
   - `mq3` = Question 3 (or Multiple Choice Q3)
   - This appears to be **Paper 2, Question 3** (Essay question about projectile motion)

2. **Page Content**:
   - Question text
   - Expected responses
   - Examiner observations (common mistakes)
   - Links to General Comments, Weakness/Remedies

3. **Key Information to Extract**:
   - Exact question number from WAEC paper
   - Year (2023 in this case)
   - Paper type (1 or 2)
   - Examiner insights for better explanations

## How to Verify Our Physics Questions

### Step-by-Step Process

1. **Open WAEC e-Learning**: https://www.waeconline.org.ng/e-learning/Physics/
2. **Navigate to specific year** (2023, 2022, etc.)
3. **Find matching question** from our `physics.ts` file
4. **Note the question number** from WAEC
5. **Update our question** with verified information

### Example Update

**Before** (our current question):
```typescript
{
  id: 'wassce-2023-phys-001',
  type: 'mcq',
  question: 'What is the SI unit of force?',
  options: ['Joule', 'Newton', 'Watt', 'Pascal'],
  correctAnswer: 1,
  year: 2023,
  // No verified question number
}
```

**After** (if verified as Q5 in 2023 Paper 1):
```typescript
{
  id: 'wassce-2023-phys-001', // Keep our ID
  type: 'mcq',
  question: 'What is the SI unit of force?',
  options: ['Joule', 'Newton', 'Watt', 'Pascal'],
  correctAnswer: 1,
  year: 2023,
  paper: 1, // Verified from WAEC
  verifiedQuestionNumber: 5, // Actual Q number from WAEC 2023 Paper 1
  explanation: 'The newton (N) is the SI unit of force. WAEC examiners note that students often confuse this with joule (energy) or watt (power).'
}
```

**Result in App**: Badge shows `WASSCE 2023 • Paper 1 • Q5`

## URL Patterns to Explore

Try these patterns on WAEC e-Learning:

### For 2023 Physics:
- Paper 1 (Objective): Look for MCQ questions
- Paper 2 (Essay): Look for essay questions (like the Q3 you found)

### For Other Years:
- 2022: Similar structure
- 2021: Similar structure
- 2020: Similar structure
- 2019: Similar structure

## Verification Checklist

For each Physics question:

- [ ] Found matching question on WAEC site
- [ ] Verified year matches
- [ ] Verified paper type (1 or 2)
- [ ] Noted actual question number from WAEC
- [ ] Extracted examiner insights
- [ ] Updated `verifiedQuestionNumber` in physics.ts
- [ ] Enhanced `explanation` with WAEC insights
- [ ] Tested badge display in app

## Next Action Items

1. **Start with 2023 questions** (most recent)
2. **Verify 10-20 questions** manually first
3. **Update physics.ts** with verified numbers
4. **Test badge display** to ensure it works
5. **Scale to all 120 questions** systematically

## Important Notes

- Only add `verifiedQuestionNumber` when **100% certain** it matches WAEC
- If unsure, leave it out - badge will still show year and paper
- Use examiner insights to improve explanations
- Keep our sequential IDs (`wassce-2023-phys-001`) for internal tracking
- The `verifiedQuestionNumber` is what shows in the badge

