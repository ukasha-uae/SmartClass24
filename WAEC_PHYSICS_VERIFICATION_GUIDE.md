# WAEC Physics Question Verification Guide

## Understanding WAEC e-Learning URL Structure

Based on [WAEC Physics e-Learning](https://www.waeconline.org.ng/e-learning/Physics/Phys240mq3.html):

### URL Pattern Analysis
- **Format**: `Phys[YY][Type][Q#].html`
- **Example**: `Phys240mq3.html`
  - `Phys` = Physics
  - `240` = Year code (2024, or possibly 2023)
  - `mq` = Multiple Choice (Paper 1) or could be essay question
  - `3` = Question number

### Page Content Structure
Each page contains:
1. **Question Text**: The actual WASSCE question
2. **Expected Responses**: Model answers
3. **Examiner Observations**: Common mistakes students make
4. **Links to**:
   - General Comments
   - Weakness/Remedies
   - Candidate's Strength

## Verification Workflow

### Step 1: Access WAEC e-Learning
1. Navigate to: https://www.waeconline.org.ng/e-learning
2. Go to: **Sciences** → **Physics**
3. Select year (2023, 2022, 2021, etc.)
4. Choose Paper 1 (Objective) or Paper 2 (Essay)

### Step 2: Match Our Questions

For each question in `src/lib/questions/shs/physics.ts`:

1. **Search for matching question** on WAEC site
2. **Note exact question number** from URL or page
3. **Verify year and paper** match
4. **Extract examiner insights** for explanations

### Step 3: Update Question Data

When verified, update the question:

```typescript
{
  id: 'wassce-2023-phys-001', // Keep our sequential ID
  type: 'mcq',
  question: 'What is the SI unit of force?',
  // ... other fields ...
  year: 2023,
  paper: 1, // Verified from WAEC
  verifiedQuestionNumber: 5, // Actual Q number from WAEC paper
  explanation: 'Enhanced with WAEC examiner insights...'
}
```

## Example from Your Link

From [Phys240mq3.html](https://www.waeconline.org.ng/e-learning/Physics/Phys240mq3.html):

- **Year**: 2023 (from page header)
- **Paper**: 2 (Essay)
- **Question Number**: 3
- **Topic**: Projectile Motion
- **Key Insight**: Many candidates gave wrong vertical component formula

### How to Use This

If we have a projectile motion question that matches this:
1. Verify it's the same question
2. Add `verifiedQuestionNumber: 3`
3. Update explanation: "WAEC examiners note that many candidates incorrectly use [wrong formula] instead of [correct formula]..."

## URL Patterns to Try

For systematic verification, try these patterns:

### Paper 1 (Objective/MCQ)
- `Phys240mq1.html` - Physics 2024, Q1
- `Phys240mq2.html` - Physics 2024, Q2
- `Phys230mq1.html` - Physics 2023, Q1
- `Phys220mq1.html` - Physics 2022, Q1
- `Phys210mq1.html` - Physics 2021, Q1
- `Phys200mq1.html` - Physics 2020, Q1
- `Phys190mq1.html` - Physics 2019, Q1

### Paper 2 (Essay)
- Similar pattern but may use different suffix
- Check the page structure to identify pattern

## Systematic Verification Plan

### Priority Order

1. **2023 Questions** (Most recent, highest priority)
   - Start with Paper 1, Q1-Q20
   - Then Paper 2, Q1-Q10

2. **2022 Questions**
   - Same approach

3. **2021-2019 Questions**
   - Verify remaining questions

### Topics to Prioritize

1. **Mechanics** (Motion, Forces, Energy)
2. **Electricity** (Circuits, Current, Voltage)
3. **Waves** (Sound, Light)
4. **Thermodynamics**

## Creating a Verification Template

For each verified question, document:

```markdown
## Question: [Our ID]
- WAEC Year: 2023
- WAEC Paper: 1
- WAEC Question Number: 5
- Topic: Forces
- WAEC URL: [link]
- Verification Status: ✅ Verified
- Examiner Insight: [key observation]
```

## Next Steps

1. **Start Manual Verification**: Pick 10-20 Physics questions
2. **Use WAEC Site**: Match each to actual WAEC question
3. **Update physics.ts**: Add `verifiedQuestionNumber` field
4. **Test Badge**: Verify it displays correctly
5. **Scale Up**: Repeat for all 120 questions

## Tools to Help

1. **Browser Bookmarks**: Save WAEC Physics pages by year
2. **Spreadsheet**: Track verification progress
3. **Our Code**: Already supports `verifiedQuestionNumber` field

