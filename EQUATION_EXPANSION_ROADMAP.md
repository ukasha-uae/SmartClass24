# Equation Builder Expansion Roadmap

**Last Updated:** March 3, 2026  
**Current Version:** v2.0 (Variable-Both-Sides + Global Curricula Support)

---

## 🎯 Current Capabilities

### ✅ Fully Implemented (Production Ready)

| Equation Type | Example | Steps | Difficulty |
|--------------|---------|-------|-----------|
| **Linear Equations** | `3x + 5 = 20` | 2 | Beginner |
| **Fraction Linear** | `x/3 + 2 = 8` | 2-3 | Intermediate |
| **Variable Both Sides** | `3x + 7 = x + 15` | 3-4 | Intermediate+ |

**Features:**
- ✅ Equivalence-based validation (accepts multiple solution paths)
- ✅ Global curriculum support (UK, US, IB, WAEC, CBSE, BECE)
- ✅ Real-time feedback with teacher voice
- ✅ Exam-style working display
- ✅ Flexible intermediate step handling
- ✅ Pedagogical tutorial system
- ✅ Adaptive difficulty progression

---

## 🚫 Current Limitations (Cannot Solve)

### 1. **Quadratic Equations** 🔴 HIGH PRIORITY
**Examples:**
- Standard form: `x² + 5x + 6 = 0`
- Factored form: `(x + 2)(x + 3) = 0`
- Complete square: `x² + 6x + 9 = 0`
- Quadratic formula: `2x² - 3x - 5 = 0`

**Required Steps:**
1. Rearrange to standard form (ax² + bx + c = 0)
2. Choose method: Factoring, Completing Square, or Quadratic Formula
3. Solve for x (may have 2 solutions, 1 solution, or no real solutions)
4. Check solutions

**Target Audience:** SHS Form 1-2 (Ages 14-16)

---

### 2. **Simultaneous Equations (Systems)** 🔴 HIGH PRIORITY
**Examples:**
- `2x + y = 5` and `x - y = 1`
- `3x + 2y = 12` and `5x - y = 11`

**Methods:**
1. **Elimination Method** (add/subtract equations)
2. **Substitution Method** (solve one, plug into other)
3. **Graphical Method** (intersection point)

**Required Steps:**
1. Identify method
2. Apply operations to eliminate one variable
3. Solve for first variable
4. Substitute back to find second variable
5. Check solution in both original equations

**Target Audience:** SHS Form 2-3 (Ages 15-17)

---

### 3. **Radical Equations (Square Root)** 🟡 MEDIUM PRIORITY
**Examples:**
- `√x + 3 = 7`
- `√(2x - 5) = 3`
- `√x + √(x + 7) = 7`

**Required Steps:**
1. Isolate the radical
2. Square both sides
3. Solve resulting equation
4. Check for extraneous solutions (critical!)

**Target Audience:** SHS Form 2 (Ages 15-16)

---

### 4. **Exponential Equations** 🟡 MEDIUM PRIORITY
**Examples:**
- `2^x = 8` (same base)
- `3^(x+1) = 27`
- `2^x = 5` (different base, needs logs)

**Methods:**
1. **Same Base:** Equate exponents
2. **Logarithms:** Take log of both sides

**Required Steps:**
1. Identify if bases can be made equal
2. Apply logarithm rules if needed
3. Solve for variable
4. Verify solution

**Target Audience:** SHS Form 3 (Ages 16-17)

---

### 5. **Logarithmic Equations** 🟡 MEDIUM PRIORITY
**Examples:**
- `log(x) = 2` → x = 10²
- `log₂(x) = 3` → x = 2³
- `log(x) + log(x + 1) = log(12)`

**Required Steps:**
1. Apply log properties (product, quotient, power)
2. Convert to exponential form
3. Solve resulting equation
4. Check domain restrictions (x > 0)

**Target Audience:** SHS Form 3 (Ages 16-17)

---

### 6. **Rational Equations (Fractions with Variables)** 🟡 MEDIUM PRIORITY
**Examples:**
- `1/x + 2 = 5`
- `(x + 3)/(x - 2) = 4`
- `1/x + 1/(x + 2) = 1/3`

**Required Steps:**
1. Find LCD (Least Common Denominator)
2. Multiply both sides by LCD
3. Solve resulting polynomial
4. Check for excluded values (denominator ≠ 0!)

**Target Audience:** SHS Form 2 (Ages 15-16)

---

### 7. **Absolute Value Equations** 🟢 LOW PRIORITY
**Examples:**
- `|x - 3| = 5` → x = 8 or x = -2
- `|2x + 1| = 7`

**Required Steps:**
1. Set up two cases: positive and negative
2. Solve both equations
3. Check both solutions

**Target Audience:** SHS Form 2 (Ages 15-16)

---

### 8. **Polynomial Equations (Degree 3+)** 🟢 LOW PRIORITY
**Examples:**
- Cubic: `x³ - 6x² + 11x - 6 = 0`
- Quartic: `x⁴ - 5x² + 4 = 0`

**Methods:**
1. Factoring by grouping
2. Rational root theorem
3. Synthetic division
4. Numerical methods (Newton-Raphson)

**Target Audience:** SHS Form 3+ / University

---

### 9. **Trigonometric Equations** 🟢 LOW PRIORITY
**Examples:**
- `sin(x) = 0.5` → x = 30°, 150°, 390°...
- `2cos(x) - 1 = 0`
- `tan²(x) = 1`

**Required Steps:**
1. Isolate trig function
2. Find principal value
3. Add all solutions in range (0° to 360° or 0 to 2π)
4. Consider periodicity

**Target Audience:** SHS Form 3+ (Ages 16-17)

---

### 10. **Chemical Equations** 🔴 HIGH PRIORITY (Different Domain!)
**Examples:**
- **Balancing:** `H₂ + O₂ → H₂O` → `2H₂ + O₂ → 2H₂O`
- **Stoichiometry:** Calculate moles, mass, volume
- **Limiting reagent:** Which reactant runs out first?

**Required Steps (Balancing):**
1. Count atoms on each side
2. Add coefficients to balance each element
3. Verify total balance
4. Simplify to lowest whole numbers

**Teaching Approach:**
- **Interactive molecule builder** (visual representation)
- **Atom counter** (real-time feedback)
- **Step-by-step balancing** (guided mode)
- **Practice sets** (combustion, synthesis, decomposition)

**Target Audience:** SHS Form 1-3 (Chemistry curriculum)

---

### 11. **Inequalities** 🟡 MEDIUM PRIORITY
**Examples:**
- `3x + 5 > 20`
- `2x - 7 ≤ 15`
- `-2 < 3x + 1 ≤ 10` (compound)

**Key Difference from Equations:**
- Flip inequality sign when multiplying/dividing by negative
- Solution is a **range**, not a single value
- Visual representation on number line

**Target Audience:** JHS3 / SHS Form 1 (Ages 14-15)

---

## 📋 Implementation Priority Matrix

| Priority | Equation Type | User Demand | Curriculum Fit | Technical Complexity | Timeline |
|----------|--------------|-------------|----------------|---------------------|----------|
| 🔴 P0 | **Quadratic** | Very High | Core SHS | Medium | 2-3 weeks |
| 🔴 P0 | **Chemical Balancing** | High | Core SHS Chemistry | Medium-High | 3-4 weeks |
| 🔴 P0 | **Simultaneous (2 equations)** | High | Core SHS | Medium | 2-3 weeks |
| 🟡 P1 | **Inequalities** | Medium | JHS3/SHS1 | Low | 1-2 weeks |
| 🟡 P1 | **Radical Equations** | Medium | SHS Form 2 | Medium | 2 weeks |
| 🟡 P1 | **Rational Equations** | Medium | SHS Form 2 | Medium | 2 weeks |
| 🟡 P2 | **Exponential** | Medium | SHS Form 3 | Medium-High | 2-3 weeks |
| 🟡 P2 | **Logarithmic** | Medium | SHS Form 3 | Medium-High | 2-3 weeks |
| 🟢 P3 | **Absolute Value** | Low | SHS Form 2 | Low | 1 week |
| 🟢 P3 | **Polynomial (degree 3+)** | Low | Advanced | High | 4+ weeks |
| 🟢 P3 | **Trigonometric** | Low | SHS Form 3 | Medium | 3 weeks |

---

## 🏗️ Technical Architecture for Expansion

### Phase 1: Quadratic Equations (P0)

**File Structure:**
```
src/lib/math-lab/
├── equation-engine.ts (extend existing)
├── quadratic-engine.ts (new)
└── quadratic-validators.ts (new)

src/components/virtual-labs/
├── quadratic-builder-lab.tsx (new)
└── equation-method-selector.tsx (new - factoring, completing square, formula)
```

**New Types:**
```typescript
export type QuadraticEquationParsed = {
  variable: string;
  a: number; // coefficient of x²
  b: number; // coefficient of x
  c: number; // constant
  discriminant: number; // b² - 4ac
  solutionCount: 0 | 1 | 2;
};

export type QuadraticSolutionMethod = 
  | 'factoring' 
  | 'completing-square' 
  | 'quadratic-formula'
  | 'graphing';

export type QuadraticMission = {
  id: string;
  equation: string;
  standardForm: string; // ax² + bx + c = 0
  parsed: QuadraticEquationParsed;
  recommendedMethod: QuadraticSolutionMethod;
  factorable: boolean; // Can it be factored with integers?
  solutions: number[]; // May be empty [], [x], or [x1, x2]
};
```

**Key Functions:**
```typescript
// Parser
export function parseQuadraticEquation(equation: string): QuadraticEquationParsed;

// Validators
export function validateFactoringStep(userInput: string, mission: QuadraticMission): boolean;
export function validateQuadraticFormula(userValues: {a: string, b: string, c: string}, mission: QuadraticMission): boolean;
export function validateSolution(x: number, mission: QuadraticMission): boolean;

// Generators
export function generateQuadraticMissions(count: number, options?: {
  allowNonFactorable?: boolean;
  maxCoefficient?: number;
  requireRealSolutions?: boolean;
}): QuadraticMission[];
```

**Teaching Flow:**
1. Present equation
2. Student chooses method (or system recommends)
3. **Factoring Path:**
   - Identify ac (product) and b (sum)
   - Find factor pairs
   - Set up factored form: (x + p)(x + q) = 0
   - Solve each factor = 0
4. **Completing Square Path:**
   - Move c to right side
   - Add (b/2)² to both sides
   - Factor left side as perfect square
   - Take square root
   - Solve for x
5. **Quadratic Formula Path:**
   - Identify a, b, c
   - Calculate discriminant
   - Apply formula: x = (-b ± √(b²-4ac)) / 2a
   - Simplify

---

### Phase 2: Chemical Equations (P0)

**File Structure:**
```
src/lib/chemistry-lab/
├── chemical-equation-engine.ts (new)
├── element-data.ts (periodic table data)
└── molecule-parser.ts (parse H₂O, CO₂, etc.)

src/components/virtual-labs/
├── chemical-equation-balancer.tsx (new)
├── molecule-builder.tsx (visual builder)
└── atom-counter.tsx (live atom count display)
```

**New Types:**
```typescript
export type Element = {
  symbol: string; // H, O, C, etc.
  name: string;
  atomicNumber: number;
  mass: number;
};

export type Molecule = {
  formula: string; // H₂O
  elements: { symbol: string; count: number }[]; // [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }]
  coefficient: number; // 2 in "2H₂O"
};

export type ChemicalEquation = {
  id: string;
  reactants: Molecule[];
  products: Molecule[];
  balanced: boolean;
  equationType: 'synthesis' | 'decomposition' | 'single-replacement' | 'double-replacement' | 'combustion';
};

export type ChemicalMission = {
  id: string;
  unbalancedEquation: string; // "H₂ + O₂ → H₂O"
  balancedEquation: string;   // "2H₂ + O₂ → 2H₂O"
  balancedCoefficients: number[]; // [2, 1, 2]
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};
```

**Key Functions:**
```typescript
// Parser
export function parseChemicalEquation(equation: string): ChemicalEquation;
export function parseMolecule(formula: string): Molecule;

// Validators
export function isEquationBalanced(equation: ChemicalEquation): boolean;
export function countAtoms(molecules: Molecule[], element: string): number;
export function validateCoefficients(userCoefficients: number[], mission: ChemicalMission): boolean;

// Generators
export function generateChemicalMissions(count: number, options?: {
  equationType?: ChemicalEquation['equationType'];
  maxElements?: number;
  difficulty?: ChemicalMission['difficulty'];
}): ChemicalMission[];

// Visual Helpers
export function getMoleculeDisplay(molecule: Molecule): string; // Convert H2O to H₂O with subscripts
export function getAtomCountDisplay(equation: ChemicalEquation): Record<string, {left: number, right: number}>;
```

**Teaching Flow:**
1. Present unbalanced equation
2. Display atom counter (left vs right side)
3. Student adjusts coefficients (sliders or input)
4. Real-time feedback on atom balance
5. Check final balance
6. Show molecular visualization

**Visual Features:**
- **Molecule Models:** Ball-and-stick or space-filling representations
- **Atom Counter Table:**
  ```
  Element | Reactants | Products | Balanced?
  H       |     2     |    2     |    ✅
  O       |     2     |    1     |    ❌
  ```
- **Interactive Sliders:** Adjust coefficients visually
- **Animation:** Show molecules combining/breaking apart

---

### Phase 3: Simultaneous Equations (P0)

**File Structure:**
```
src/lib/math-lab/
├── simultaneous-engine.ts (new)
└── matrix-helpers.ts (optional, for advanced methods)

src/components/virtual-labs/
├── simultaneous-equation-lab.tsx (new)
└── equation-system-visualizer.tsx (graph both lines)
```

**New Types:**
```typescript
export type SimultaneousEquation = {
  equation1: string; // "2x + y = 5"
  equation2: string; // "x - y = 1"
  parsed1: LinearEquationParsed; // ax + by = c
  parsed2: LinearEquationParsed;
  solution: { x: number; y: number } | null; // null if no solution or infinite solutions
  solutionType: 'unique' | 'none' | 'infinite';
};

export type SimultaneousMethod = 'elimination' | 'substitution' | 'graphing';

export type SimultaneousMission = {
  id: string;
  system: SimultaneousEquation;
  recommendedMethod: SimultaneousMethod;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};
```

**Key Functions:**
```typescript
export function parseSimultaneousEquations(eq1: string, eq2: string): SimultaneousEquation;
export function solveByElimination(system: SimultaneousEquation): { x: number; y: number };
export function solveBySubstitution(system: SimultaneousEquation): { x: number; y: number };
export function validateEliminationStep(userEquation: string, step: number, mission: SimultaneousMission): boolean;
export function generateSimultaneousMissions(count: number): SimultaneousMission[];
```

**Teaching Flow (Elimination Method):**
1. Present two equations
2. Student identifies which variable to eliminate
3. Student determines multiplication factors (if needed)
4. Multiply equations
5. Add or subtract equations
6. Solve for first variable
7. Substitute back to find second variable
8. Check in both original equations

---

## 📊 Feature Comparison: Current vs. Target State

| Feature | Current (v2.0) | After P0 Expansion | Ultimate Goal |
|---------|---------------|-------------------|---------------|
| **Equation Types** | 3 | 6 | 15+ |
| **Subject Coverage** | Algebra | Algebra + Chemistry | Algebra, Chemistry, Physics |
| **Grade Levels** | JHS2-SHS2 | JHS2-SHS3 | JHS1-SHS3 + University |
| **Solution Methods** | 1 per type | 2-3 per type | All standard methods |
| **Visual Aids** | Text-based | Text + Graphs | Text + Graphs + Animations |
| **Curriculum Support** | Global K-12 | Global K-12 + WAEC Chemistry | All West African curricula |

---

## 🎯 Recommended Next Steps

### Immediate (Next Sprint - Week 1-2):
1. **User Research:** Survey students/teachers on most-needed equation types
2. **Curriculum Audit:** Review WAEC/BECE past questions to identify frequency
3. **Design Mockups:** Create UI designs for quadratic solver and chemical balancer
4. **Technical Spike:** Prototype quadratic factoring validator

### Short-term (Month 1-2):
1. ✅ **Implement Quadratic Equations** (all 3 methods)
2. ✅ **Implement Chemical Equation Balancing** (visual + interactive)
3. ✅ **Implement Simultaneous Equations** (elimination + substitution)
4. ✅ **Add Inequalities** (simpler extension of linear equations)

### Medium-term (Month 3-6):
1. Radical equations
2. Rational equations
3. Exponential equations
4. Logarithmic equations
5. Graph visualizer for all equation types

### Long-term (Year 1):
1. Physics equations (kinematics, energy, momentum)
2. Advanced polynomial solving
3. Trigonometric equations
4. Differential equations (calculus level)
5. AI-powered hint system (analyze student mistakes, suggest personalized interventions)

---

## 💡 Strategic Considerations

### 1. **Curriculum Alignment**
- WAEC requires quadratic equations (Form 2-3)
- BECE includes linear + simultaneous (JHS3)
- Chemistry balancing is critical skill (Form 1+)
- **Priority: Focus on exam-critical topics first**

### 2. **Student Progression**
- Current system already has adaptive difficulty
- New equation types should integrate into progression system
- Recommend: Complete linear mastery → quadratics → simultaneous
- Chemical balancing can be parallel track (different subject)

### 3. **Mobile Experience**
- Complex equation input is challenging on mobile
- **Solution:** Implement smart input keyboards per equation type
- Example: Quadratic keyboard includes x² button, ± button
- Chemical keyboard includes subscript numbers, arrow, element symbols

### 4. **Internationalization**
- Chemical element names vary by language
- Some countries use different notation (e.g., comma vs. decimal point)
- **Solution:** Extend localization system to handle scientific notation

### 5. **Assessment Integration**
- All new equation types should feed into student profile/progress tracking
- Generate personalized practice based on weak areas
- Export reports for teachers

---

## 🔧 Implementation Code Snippets

### Quadratic Parser (Example)
```typescript
export function parseQuadraticEquation(equation: string): QuadraticEquationParsed {
  // Remove spaces, convert to lowercase
  const normalized = equation.replace(/\s/g, '').toLowerCase();
  
  // Extract coefficients using regex
  const quadraticPattern = /([+-]?\d*\.?\d*)x\^2([+-]?\d*\.?\d*)x([+-]?\d*\.?\d*)=0/;
  const match = normalized.match(quadraticPattern);
  
  if (!match) throw new Error('Invalid quadratic equation format');
  
  const a = parseFloat(match[1] || '1');
  const b = parseFloat(match[2] || '0');
  const c = parseFloat(match[3] || '0');
  const discriminant = b * b - 4 * a * c;
  
  let solutionCount: 0 | 1 | 2 = 0;
  if (discriminant > 0) solutionCount = 2;
  else if (discriminant === 0) solutionCount = 1;
  
  return {
    variable: 'x',
    a,
    b,
    c,
    discriminant,
    solutionCount,
  };
}
```

### Chemical Equation Balancer (Example)
```typescript
export function isEquationBalanced(equation: ChemicalEquation): boolean {
  const elements = new Set<string>();
  
  // Collect all unique elements
  [...equation.reactants, ...equation.products].forEach(molecule => {
    molecule.elements.forEach(el => elements.add(el.symbol));
  });
  
  // Check each element is balanced
  for (const element of elements) {
    const leftCount = countAtoms(equation.reactants, element);
    const rightCount = countAtoms(equation.products, element);
    if (leftCount !== rightCount) return false;
  }
  
  return true;
}

function countAtoms(molecules: Molecule[], element: string): number {
  return molecules.reduce((total, molecule) => {
    const elementData = molecule.elements.find(el => el.symbol === element);
    return total + (elementData ? elementData.count * molecule.coefficient : 0);
  }, 0);
}
```

---

## 📚 Resources for Implementation

### Technical References:
1. **Quadratic Equations:** Khan Academy algorithm library
2. **Chemical Balancing:** PubChem API for molecule data
3. **Graph Visualization:** D3.js or Recharts for plotting
4. **Symbolic Math:** Consider Math.js or Algebrite for advanced parsing

### Educational Standards:
1. **WAEC Syllabus:** Mathematics & Chemistry (latest edition)
2. **BECE Syllabus:** JHS Mathematics
3. **Cambridge IGCSE:** Additional reference for international standards
4. **IB Mathematics:** Advanced equation types

### UX Inspiration:
1. **Photomath:** Step-by-step explanations
2. **Brilliant.org:** Interactive problem exploration
3. **ChemCollective:** Virtual chemistry lab interface
4. **Wolfram Alpha:** Comprehensive equation solver (but too complex for our target age)

---

## ✅ Success Metrics

### Per Equation Type:
- **Completion Rate:** % of students who finish 5+ practice problems
- **Accuracy:** Average correctness on first attempt
- **Time to Mastery:** Average time to reach 80% accuracy
- **Hint Usage:** Average hints needed per problem

### Overall System:
- **Engagement:** Daily active users in equation builder labs
- **Retention:** % of students returning within 7 days
- **Exam Performance:** Correlation with WAEC/BECE math scores
- **Teacher Satisfaction:** NPS score from educators

---

## 🚀 Conclusion

The equation builder is already a powerful tool. By systematically expanding to cover:
1. **Quadratic equations** (algebraic foundation)
2. **Chemical balancing** (cross-curricular application)
3. **Simultaneous equations** (problem-solving skills)

We'll create a comprehensive equation-solving system that covers 90%+ of JHS-SHS curriculum needs.

**Estimated Development Time:** 8-12 weeks for P0 features
**Expected Impact:** 3x increase in equation builder engagement

---

**Next Action:** Schedule planning meeting to prioritize P0 features and allocate development resources.
