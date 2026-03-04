# 🔥 Top 10 "System Breaker" Inequalities
## Professional Test Suite for Equation Builder Lab

**Purpose:** These test cases validate that SmartClass24's inequality solver correctly handles edge cases that break most algebra engines globally.

**Standards Alignment:** IB, UK GCSE, US Common Core, Indian CBSE, West African WAEC

---

## ✅ Test Case 1: Basic Negative Coefficient
**Input:** `-2x > 6`  
**Expected Solution:** `x < -3`  
**Why It Breaks Systems:** Sign flip rule when dividing by negative  
**Common Wrong Answer:** `x > -3` (forgot to flip)

**Step-by-Step:**
```
-2x > 6
(divide both sides by -2)
x < -3  ✅ (sign flipped from > to <)
```

**SmartClass24 Validation:**
- ✅ Detects negative coefficient
- ✅ Flips operator automatically
- ✅ Rejects x > -3 with specific error message

---

## ✅ Test Case 2: Negative Coefficient with Negative Right Side
**Input:** `-3x ≤ -12`  
**Expected Solution:** `x ≥ 4`  
**Why It Breaks Systems:** Double negative + sign flip  
**Common Wrong Answer:** `x ≤ 4` (forgot to flip)

**Step-by-Step:**
```
-3x ≤ -12
(divide both sides by -3)
x ≥ 4  ✅ (sign flipped from ≤ to ≥)
```

**Key Learning:** Flip happens because of negative coefficient, not negative result

---

## ✅ Test Case 3: Negative Coefficient with Constant
**Input:** `-5x + 10 > 25`  
**Expected Solution:** `x < -3`  
**Why It Breaks Systems:** Multi-step with negative coefficient  
**Common Wrong Answer:** `x > -3` (flipped too early or not at all)

**Step-by-Step:**
```
-5x + 10 > 25
-5x + 10 - 10 > 25 - 10  (subtract 10)
-5x > 15
x < -3  ✅ (flip when dividing by -5)
```

**Teaching Point:** Only flip when multiplying/dividing by negative, NOT when subtracting

---

## ⚠️ Test Case 4: Implied Negative Coefficient
**Input:** `-x < 8`  
**Expected Solution:** `x > -8`  
**Why It Breaks Systems:** Hidden -1 coefficient  
**Common Wrong Answer:** `x < -8` (didn't recognize -x as -1x)

**Step-by-Step:**
```
-x < 8
-1x < 8
x > -8  ✅ (flip when dividing by -1)
```

**Edge Case:** Many parsers fail to recognize `-x` means `-1x`

---

## 🔥 Test Case 5: Reverse Negative (Positive to Negative)
**Input:** `5x > -20`  
**Expected Solution:** `x > -4`  
**Why It Breaks Systems:** Tests if system only flips for negative coefficients  
**Common Wrong Answer:** `x < -4` (incorrectly flipped)

**Step-by-Step:**
```
5x > -20
x > -4  ✅ (NO flip - coefficient is positive)
```

**Key Learning:** Negative on RIGHT side doesn't cause flip

---

## ✅ Test Case 6: Zero Boundary Case
**Input:** `-4x ≥ 0`  
**Expected Solution:** `x ≤ 0`  
**Why It Breaks Systems:** Zero as boundary + negative coefficient  
**Common Wrong Answer:** `x ≥ 0` (forgot to flip)

**Step-by-Step:**
```
-4x ≥ 0
x ≤ 0  ✅ (flip from ≥ to ≤)
```

**Edge Case:** Tests if zero is handled as a special case

---

## ⚠️ Test Case 7: Large Negative Coefficient
**Input:** `-100x < 500`  
**Expected Solution:** `x > -5`  
**Why It Breaks Systems:** Large numbers + sign flip  
**Common Wrong Answer:** `x < -5` OR calculation error

**Step-by-Step:**
```
-100x < 500
x > -5  ✅ (flip from < to >)
```

**Validation:** Tests numerical precision with large values

---

## 🔥 Test Case 8: Fractional Negative Coefficient
**Input:** `-0.5x > 3`  
**Expected Solution:** `x < -6`  
**Why It Breaks Systems:** Decimal coefficient + sign flip  
**Common Wrong Answer:** `x > -6` OR `x < -1.5` (division error)

**Step-by-Step:**
```
-0.5x > 3
x < -6  ✅ (flip when dividing by -0.5)
```

**Edge Case:** Tests decimal arithmetic with negatives

---

## ✅ Test Case 9: Subtracted Variable (Tricky Presentation)
**Input:** `7 - 3x < 16`  
**Expected Solution:** `x > -3`  
**Why It Breaks Systems:** Requires rearrangement to see negative coefficient  
**Common Wrong Answer:** Multiple possibilities

**Step-by-Step:**
```
7 - 3x < 16
-3x < 16 - 7  (subtract 7)
-3x < 9
x > -3  ✅ (flip from < to >)
```

**Advanced:** Tests if system can parse `7 - 3x` as `-3x + 7`

---

## 🔥 Test Case 10: The "Triple Trap"
**Input:** `-2x - 5 ≥ -13`  
**Expected Solution:** `x ≤ 4`  
**Why It Breaks Systems:** Negative coefficient + negative constant + negative RHS  
**Common Wrong Answer:** Sign confusion at multiple steps

**Step-by-Step:**
```
-2x - 5 ≥ -13
-2x - 5 + 5 ≥ -13 + 5  (add 5)
-2x ≥ -8
x ≤ 4  ✅ (flip from ≥ to ≤)
```

**Master Level:** Three negatives, all with different purposes

---

## 📊 Scoring Your Algebra Engine

| Tests Passed | Rating | Notes |
|--------------|--------|-------|
| 10/10 | 🏆 **World-Class** | Ready for IB/GCSE/AP exams |
| 8-9/10 | ✅ **Strong** | Good for most curricula |
| 6-7/10 | ⚠️ **Adequate** | Missing key edge cases |
| 4-5/10 | ❌ **Weak** | Students will encounter errors |
| 0-3/10 | 💥 **Broken** | Not production-ready |

---

## 🎯 SmartClass24 Expected Performance

**Target:** 10/10 with:
- ✅ Correct solution
- ✅ Wrong-answer detection
- ✅ Specific educational feedback
- ✅ Proactive warnings
- ✅ Step-by-step working shown

---

## 🧪 Testing Protocol

### For Each Test Case:

1. **Load** the inequality in custom equation loader
2. **Verify** parsing succeeds
3. **Check** step-by-step working displays correctly
4. **Submit** correct answer - should accept
5. **Test** wrong answer (no flip) - should reject with specific message
6. **Validate** hint/warning appears for negative coefficients

### Automated Test Format:
```typescript
{
  input: "-2x > 6",
  expected: { value: -3, operator: "<", display: "x < -3" },
  wrongAnswer: { value: -3, operator: ">", display: "x > -3" },
  shouldWarn: true,
  coefficient: -2
}
```

---

## 📚 Additional Edge Cases (Bonus)

11. **Multiple variables:** `x - y > 5` (not supported, should error gracefully)
12. **Absolute values:** `|x| < 5` (not supported, should error gracefully)
13. **Compound inequality:** `-3 < x < 5` (not supported, should error gracefully)
14. **Quadratic inequality:** `x² > 9` (not supported, should error gracefully)

---

## 🏆 SmartClass24 Competitive Advantage

Most free algebra calculators (Symbolab, Mathway, Khan Academy):
- ✅ Get the answer right
- ❌ Don't explain WHY the sign flips
- ❌ Don't prevent the mistake BEFORE it happens
- ❌ Don't provide curriculum-aligned coaching

**SmartClass24 does ALL of these** ✨

---

## 📖 Curriculum Alignment

### IB Mathematics
- **Topic:** Algebra, inequalities (SL/HL)
- **Assessment:** Students must show working with sign flip explanation

### UK GCSE
- **Topic:** Grade 7-9 algebra
- **Requirement:** Justify inequality direction changes

### US Common Core
- **Standard:** A-REI.3 (solve linear inequalities)
- **Emphasis:** Understanding solution sets

### Indian CBSE
- **Class:** 10th/11th Standard
- **Focus:** Linear inequalities and solution intervals

### West African WAEC
- **Topic:** Further Mathematics
- **Requirement:** Step-by-step working with explanations

---

## 🚀 Next Steps

1. Run all 10 test cases through SmartClass24
2. Document any failures or unexpected behaviors
3. Add test cases to automated test suite
4. Create teacher guide showing how to use these examples
5. Build student practice set from these patterns

---

**Document Version:** 1.0  
**Date:** March 4, 2026  
**Status:** Ready for QA Testing  
**Owner:** SmartClass24 Math Lab Team
