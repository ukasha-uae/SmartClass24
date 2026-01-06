# Question Number Verification Issue & Solution

## Critical Issue Identified

**Problem**: Our question IDs use sequential numbers (001, 002, 003...) that do NOT match the actual question numbers from WASSCE papers.

**Example**:
- Our ID: `wassce-2019-phys-005` → Shows "WASSCE 2019 • Q5"
- Actual WASSCE 2019 Paper 1 Question 5: "Which instrument can be used to compare the magnitudes of charges on two given bodies?" (Gold-leaf electroscope)
- Our Question 005: "Newton's second law of motion is expressed as:" (F=ma)

**Impact**: This creates a **credibility crisis** - students seeing "WASSCE 2019 • Q5" expect it to be the actual Question 5 from that paper, but it's not.

## Solution Implemented

### Immediate Fix (Applied)
- **Removed question numbers from badge display**
- Badge now shows: `WASSCE 2019 • Paper 1` (year + paper only)
- Only verified information is displayed
- Prevents misleading students about question order

### Current Badge Format
- ✅ `WASSCE 2023 • Paper 1` (verified: year and paper)
- ❌ ~~`WASSCE 2023 • Paper 1 • Q001`~~ (removed: question number not verified)

## Why This Happened

Our question IDs were created with sequential numbering for internal organization:
- `wassce-2019-phys-001` = First question in our 2019 Physics collection
- `wassce-2019-phys-002` = Second question in our 2019 Physics collection
- etc.

However, these sequential numbers don't correspond to the actual question numbers in the WASSCE papers, which are organized differently.

## Future Solution: Proper Verification

To properly display question numbers, we need to:

### Option 1: Verify Against Actual Papers
1. Obtain official WASSCE papers (2019-2023)
2. Match each question to its actual paper question number
3. Update IDs or add `actualQuestionNumber` field
4. Only display question numbers that are verified

### Option 2: Use Different Identifier
Instead of claiming paper question numbers, use:
- `WASSCE 2019 • Paper 1 • #001` (our reference number)
- Or: `WASSCE 2019 • Paper 1` (no number claim)

### Option 3: Add Verification Field
Add a `verifiedQuestionNumber?: number` field that's only populated when verified:
```typescript
{
  id: 'wassce-2019-phys-005',
  year: 2019,
  paper: 1,
  verifiedQuestionNumber: 24, // Only if we've verified this is actually Q24
  // ...
}
```

Then only show question number if `verifiedQuestionNumber` exists.

## Current Status

✅ **Fixed**: Badge no longer shows unverified question numbers
✅ **Safe**: Only verified information (year, paper) is displayed
✅ **Credible**: No risk of misleading students

## Recommendations

1. **Short-term**: Keep current solution (no question numbers in badge)
2. **Medium-term**: Verify question numbers against actual papers for key questions
3. **Long-term**: Implement verification system for all questions before displaying numbers

## Questions to Address

1. Do we have access to official WASSCE papers to verify question order?
2. Should we invest time in verifying all 120 Physics questions?
3. Would students prefer seeing "WASSCE 2019 • Paper 1" or "WASSCE 2019 • Paper 1 • #001" (our reference)?

## Action Items

- [x] Remove question numbers from badge display
- [ ] Decide on verification strategy
- [ ] If verifying: Create process to match questions to actual paper numbers
- [ ] Update question data structure if needed
- [ ] Re-enable question numbers only for verified questions

