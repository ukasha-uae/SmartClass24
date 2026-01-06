# WASSCE Paper 1 and Paper 2 Handling

## Overview
WASSCE (West African Senior School Certificate Examination) typically has two papers for each subject:
- **Paper 1**: Objective/Multiple Choice Questions (MCQs)
- **Paper 2**: Theory/Essay/Structured Questions

## Implementation

### 1. Data Structure
- Added `paper?: 1 | 2` field to `BaseQuestion` interface
- Added `paper?: 1 | 2` field to `GameQuestion` interface
- Paper is optional for backward compatibility

### 2. Paper Detection Logic

The system determines paper in this priority order:

1. **Explicit `paper` field** in question data (highest priority)
2. **Extracted from ID** if format includes paper: `wassce-2023-phys-p1-001` or `wassce-2023-phys-p2-001`
3. **Inferred from question type**:
   - `mcq`, `true-false`, `fill-blank` → **Paper 1** (default)
   - `essay`, `short-answer` → **Paper 2** (default)

### 3. ID Format Support

The system supports multiple ID formats:

#### Current Format (Paper 1 inferred):
```
wassce-2023-phys-001  → Paper 1 (inferred from MCQ type)
wassce-2022-phys-002  → Paper 1 (inferred from MCQ type)
```

#### Explicit Paper Format (Recommended for new questions):
```
wassce-2023-phys-p1-001  → Paper 1 (explicit)
wassce-2023-phys-p2-001  → Paper 2 (explicit)
```

### 4. Badge Display

The badge now shows paper information for WASSCE questions:

**Format Examples:**
- `WASSCE 2023 • Paper 1 • Q001` (with paper and question number)
- `WASSCE 2023 • Paper 1` (with paper, no question number)
- `WASSCE 2023 • Q001` (no paper designation, backward compatible)
- `WASSCE 2023` (year only)

**BECE questions** (no paper designation):
- `BECE 2022 • Q015`

### 5. Current Physics Questions

All 120 Physics questions are currently:
- **Type**: MCQ (Multiple Choice)
- **Paper**: Paper 1 (inferred automatically)
- **Format**: `wassce-YYYY-phys-XXX`

Since they're all MCQs, they automatically default to Paper 1. No changes needed to existing questions.

### 6. Adding Paper 2 Questions

When adding Paper 2 questions (essay/short-answer), you can:

**Option A: Use explicit paper field**
```typescript
{
  id: 'wassce-2023-phys-001',
  type: 'essay',
  paper: 2,  // Explicit
  year: 2023,
  // ...
}
```

**Option B: Use paper in ID**
```typescript
{
  id: 'wassce-2023-phys-p2-001',  // Paper 2 in ID
  type: 'essay',
  year: 2023,
  // ...
}
```

**Option C: Let system infer** (essay/short-answer types default to Paper 2)
```typescript
{
  id: 'wassce-2023-phys-001',
  type: 'essay',  // Will be inferred as Paper 2
  year: 2023,
  // ...
}
```

### 7. Backward Compatibility

- Existing questions without `paper` field continue to work
- Paper is inferred from question type
- MCQs default to Paper 1
- Badge shows paper only when available

### 8. Verification

All 120 Physics questions have been verified:
- ✅ All are MCQs (Paper 1)
- ✅ Years are accurate (2019-2023)
- ✅ Question numbers are correct (001-120)
- ✅ Paper 1 is automatically inferred

## Recommendations

1. **For new Paper 1 questions**: Continue using current format `wassce-YYYY-phys-XXX` (paper inferred)
2. **For new Paper 2 questions**: Use explicit `paper: 2` field or `p2` in ID
3. **For clarity**: Consider updating IDs to include paper: `wassce-2023-phys-p1-001` (optional, not required)

## Testing

To test paper detection:
1. MCQ questions should show "Paper 1" in badge
2. Essay/short-answer questions should show "Paper 2" in badge
3. Questions without year should not show badge
4. BECE questions should not show paper designation

