# WAEC e-Learning Verification Workflow for Physics

## Understanding WAEC e-Learning Structure

Based on the [WAEC Physics e-Learning page](https://www.waeconline.org.ng/e-learning/Physics/Phys240mq3.html), here's what we found:

### Page Structure
- **URL Pattern**: `Phys240mq3.html` where:
  - `Phys240` = Physics 2024 (year code)
  - `mq3` = Multiple Choice Question 3 (or could be Paper 2 Question 3)
- **Content Includes**:
  - Question text
  - Expected responses/model answers
  - Examiner observations (common mistakes)
  - Links to: General Comments, Weakness/Remedies, Candidate's Strength

### What We Can Extract

1. **Question Numbers**: Direct from the page (Q3 in this case)
2. **Year**: From URL or page header (2023/2024)
3. **Paper Type**: Paper 1 (Objective) or Paper 2 (Essay)
4. **Examiner Insights**: Common mistakes, expected responses
5. **Marking Scheme**: What WAEC expects for full marks

## Verification Process

### Step 1: Navigate WAEC e-Learning

1. Go to: https://www.waeconline.org.ng/e-learning
2. Click: **Sciences** → **Physics**
3. Select year (e.g., 2023, 2022, 2021, etc.)
4. Choose Paper 1 (Objective) or Paper 2 (Essay)

### Step 2: Match Our Questions

For each question in `src/lib/questions/shs/physics.ts`:

1. **Find matching question** on WAEC site
2. **Note the exact question number** from WAEC
3. **Verify year and paper** match
4. **Extract examiner comments** for better explanations

### Step 3: Update Question Data

Add verified information:

```typescript
{
  id: 'wassce-2023-phys-XXX', // Keep our ID
  // ... existing fields ...
  year: 2023,
  paper: 2, // From WAEC page
  verifiedQuestionNumber: 3, // From WAEC page (Q3)
  explanation: "Enhanced with WAEC examiner insights..."
}
```

## Example: Question 3 from 2023 Paper 2

From the page you shared:
- **Year**: 2023
- **Paper**: 2 (Essay)
- **Question Number**: 3
- **Topic**: Projectile Motion
- **Key Insight**: Many candidates gave wrong vertical component formula

### How to Add This to Our Bank

If we have a similar projectile motion question, we can:
1. Verify it matches Q3 from 2023 Paper 2
2. Add `verifiedQuestionNumber: 3`
3. Update explanation with WAEC's observation about common mistakes

## URL Patterns to Explore

Based on the structure, try these patterns:
- `Phys240mq1.html` - Physics 2024, MCQ Question 1
- `Phys240mq2.html` - Physics 2024, MCQ Question 2
- `Phys230mq1.html` - Physics 2023, MCQ Question 1
- `Phys220mq1.html` - Physics 2022, MCQ Question 1

For Paper 2 (Essay):
- Similar pattern but different suffix

## Systematic Verification Plan

### Phase 1: High-Priority Questions
1. Start with **2023 Paper 1** (most recent)
2. Verify top 20 questions (most commonly tested topics)
3. Focus on: Mechanics, Electricity, Waves

### Phase 2: Historical Verification
1. Verify 2022, 2021, 2020, 2019 questions
2. Prioritize questions we already have marked as "actual WASSCE"

### Phase 3: Paper 2 Questions
1. Add verified Paper 2 (Essay) questions
2. Include marking schemes from WAEC
3. Add examiner comments to explanations

## Tools Needed

1. **Browser** to access WAEC e-Learning
2. **Our physics.ts file** open for editing
3. **Spreadsheet** (optional) to track:
   - Our Question ID
   - WAEC Year
   - WAEC Paper
   - WAEC Question Number
   - Verification Status

## Next Steps

1. **Manual Verification**: Start with 10-20 Physics questions
2. **Update Data**: Add `verifiedQuestionNumber` to verified questions
3. **Test Badge**: Verify badge shows correctly in app
4. **Scale**: Repeat for remaining questions

