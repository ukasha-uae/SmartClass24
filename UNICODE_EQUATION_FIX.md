# Unicode Equation Copy-Paste Fix

## Problem
When users copied equations from ChatGPT (e.g., `x² -7x + 10 = 0`), the pasted text appeared differently (`x2−7x+10=0`) due to Unicode character encoding differences. This caused the system to fail parsing quadratic equations, showing them as linear equations like `-5x + 10 = 0`.

## Root Cause
1. **Superscript conversion**: ChatGPT's superscript `²` (U+00B2) became regular text `2` when pasted
2. **Unicode minus signs**: Various dash characters (en-dash U+2013, em-dash U+2014, minus sign U+2212) were used instead of ASCII hyphen-minus
3. **Parser limitations**: The system only recognized `x²` or `x^2` format, not `x2` as a quadratic term

## Solution
Created a centralized `normalizeEquationInput()` function that handles all Unicode variations:

```typescript
export function normalizeEquationInput(input: string): string {
  return input
    .replace(/\s+/g, '')
    // Normalize all types of minus/dash to regular hyphen-minus
    .replace(/−/g, '-')       // Unicode minus sign (U+2212)
    .replace(/–/g, '-')       // En-dash (U+2013)
    .replace(/—/g, '-')       // Em-dash (U+2014)
    .replace(/‒/g, '-')       // Figure dash (U+2012)
    .replace(/⁃/g, '-')       // Hyphen bullet (U+2043)
    // Normalize Unicode superscripts to caret notation
    .replace(/²/g, '^2')      // Superscript 2 (U+00B2)
    .replace(/³/g, '^3')      // Superscript 3 (U+00B3)
    // Handle cases where superscript becomes regular text: x2 -> x^2
    .replace(/([a-zA-Z])2(?=[\s+\-=<>≤≥]|$)/g, '$1^2')
    .replace(/([a-zA-Z])3(?=[\s+\-=<>≤≥]|$)/g, '$1^3')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .toLowerCase();
}
```

## Updated Functions
Applied normalization to all parsing functions in `equation-engine.ts`:
- ✅ `parseQuadraticEquation()`
- ✅ `parseLinearEquation()`
- ✅ `parseTwoSidedLinearEquation()`
- ✅ `parseInequality()`
- ✅ `parseFractionLinearEquation()`
- ✅ `parseBracketLinearEquation()`
- ✅ `splitEquation()`

## Test Results
All copy-paste formats now work correctly:

| Format | Input | Result |
|--------|-------|--------|
| Unicode superscript | `x² -7x + 10 = 0` | ✓ PASS |
| Regular 2 + Unicode minus | `x2−7x+10=0` | ✓ PASS |
| Regular 2 with spaces | `x2 -7x + 10 = 0` | ✓ PASS |
| Caret notation | `x^2 - 7x + 10 = 0` | ✓ PASS |
| En-dash | `x² – 7x + 10 = 0` | ✓ PASS |
| Em-dash | `x² — 7x + 10 = 0` | ✓ PASS |

## Files Modified
1. `src/lib/math-lab/equation-engine.ts`
   - Added `normalizeEquationInput()` function (lines 251-274)
   - Updated 7 parse functions to use centralized normalization

2. `src/components/virtual-labs/equation-builder-lab-enhanced.tsx`
   - Added debug logging for input normalization (lines 1749-1755)

## User Impact
Users can now copy equations from any source (ChatGPT, websites, documents) and the system will correctly:
- Recognize quadratic equations regardless of formatting
- Handle Unicode characters transparently
- Parse equations consistently across all modes (linear, quadratic, inequality)

## Testing
Run the test files to verify:
```bash
node test-unicode-quadratic.js      # 6/6 tests passed
node test-quadratic-parsing.js       # 5/5 tests passed
```
