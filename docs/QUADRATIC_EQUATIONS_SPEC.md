# Quadratic Equations - Technical Specification

**Version:** 3.0 Phase 1  
**Sprint Start:** March 2026  
**Estimated Completion:** 3-4 weeks  
**Status:** 🟡 In Planning  

---

## 📋 Executive Summary

Extend the Equation Builder Lab to support quadratic equations (ax² + bx + c = 0), enabling students to solve using three methods: **Factoring**, **Completing the Square**, and **Quadratic Formula**. This adds support for GCSE Grade 7-9, Algebra 2, and IB MYP Year 5 curriculum standards.

---

## 🎯 Learning Objectives

Students will be able to:
1. ✅ Recognize quadratic equations in standard form (ax² + bx + c = 0)
2. ✅ Determine the most appropriate solution method
3. ✅ Factor simple quadratics (e.g., x² + 5x + 6 = 0)
4. ✅ Apply the quadratic formula to any quadratic equation
5. ✅ Complete the square to solve quadratics
6. ✅ Interpret solutions in context (two roots, one root, no real roots)
7. ✅ Verify solutions by substitution

---

## 🔢 Supported Equation Types

### Type 1: Simple Quadratics (Factorable)
**Format:** `x² + bx + c = 0`  
**Examples:**
- `x² + 5x + 6 = 0` → `(x + 2)(x + 3) = 0` → x = -2 or x = -3
- `x² - 7x + 12 = 0` → `(x - 3)(x - 4) = 0` → x = 3 or x = 4
- `x² - 4 = 0` → `(x - 2)(x + 2) = 0` → x = 2 or x = -2 (difference of squares)

**Difficulty:** Beginner  
**Solution Method:** Factoring (primary)

---

### Type 2: Scaled Quadratics (Factorable)
**Format:** `ax² + bx + c = 0` where a ≠ 1  
**Examples:**
- `2x² + 7x + 3 = 0` → `(2x + 1)(x + 3) = 0` → x = -1/2 or x = -3
- `3x² - 11x - 4 = 0` → `(3x + 1)(x - 4) = 0` → x = -1/3 or x = 4

**Difficulty:** Intermediate  
**Solution Method:** Factoring or Quadratic Formula

---

### Type 3: Perfect Square Trinomials
**Format:** `x² + 2kx + k² = 0`  
**Examples:**
- `x² + 6x + 9 = 0` → `(x + 3)² = 0` → x = -3 (double root)
- `4x² - 12x + 9 = 0` → `(2x - 3)² = 0` → x = 3/2 (double root)

**Difficulty:** Intermediate  
**Solution Method:** Completing the Square or Factoring

---

### Type 4: Non-Factorable (Requires Formula)
**Format:** `ax² + bx + c = 0` with non-integer roots  
**Examples:**
- `x² + 3x + 1 = 0` → x = (-3 ± √5) / 2
- `2x² - 4x - 1 = 0` → x = (4 ± √24) / 4 = (2 ± √6) / 2

**Difficulty:** Advanced  
**Solution Method:** Quadratic Formula (required)

---

### Type 5: No Real Solutions
**Format:** `ax² + bx + c = 0` where b² - 4ac < 0  
**Examples:**
- `x² + 2x + 5 = 0` → No real solutions (discriminant = 4 - 20 = -16)
- `2x² + x + 3 = 0` → No real solutions (discriminant = 1 - 24 = -23)

**Difficulty:** Advanced  
**Solution Method:** Quadratic Formula (shows discriminant is negative)  
**Educational Goal:** Understanding that not all quadratics have real solutions

---

## 🏗️ Architecture Changes

### 1. Extend Type System

**File:** `src/lib/math-lab/equation-engine.ts`

```typescript
// New types to add

export type QuadraticSolutionMethod = 'factoring' | 'formula' | 'completing-square';

export interface QuadraticEquationParsed {
  variable: string; // Usually 'x'
  a: number;        // Coefficient of x²
  b: number;        // Coefficient of x
  c: number;        // Constant term
  isStandardForm: boolean; // true if already in ax² + bx + c = 0 form
}

export interface QuadraticSolution {
  method: QuadraticSolutionMethod;
  discriminant: number; // b² - 4ac
  roots: number[]; // Empty if discriminant < 0, 1 root if = 0, 2 roots if > 0
  rootsExact?: string[]; // For irrational roots: "(-3 + √5) / 2"
  factored?: string; // If factorable: "(x + 2)(x + 3) = 0"
  steps: QuadraticStep[];
}

export interface QuadraticStep {
  stepNumber: number;
  description: string;
  equation: string; // LaTeX or plain text
  explanation?: string;
}

export interface QuadraticBuilderMission extends BaseMission {
  type: 'quadratic';
  equation: string; // e.g., "x² + 5x + 6 = 0"
  parsed: QuadraticEquationParsed;
  recommendedMethod: QuadraticSolutionMethod;
  allowedMethods: QuadraticSolutionMethod[]; // Some equations can be solved multiple ways
  solution: QuadraticSolution;
  curriculum: EquationCurriculumProfile;
}
```

---

### 2. Parsing Functions

**File:** `src/lib/math-lab/equation-engine.ts`

```typescript
/**
 * Parse quadratic equation in standard or expanded form
 * Supports:
 * - x² + 5x + 6 = 0
 * - 2x² - 3x - 5 = 0
 * - x² - 9 = 0 (missing b term)
 * - x² + 4x = 5 (not in standard form)
 */
export function parseQuadraticEquation(input: string): QuadraticEquationParsed | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .toLowerCase(); // Case-insensitive variables
  
  // Check if it contains = sign
  if (!normalized.includes('=')) return null;
  
  const [leftStr, rightStr] = normalized.split('=');
  
  // Parse both sides as quadratic expressions
  const left = parseQuadraticExpression(leftStr);
  const right = parseQuadraticExpression(rightStr);
  
  if (!left || !right) return null;
  
  // Move everything to left side (standard form: ax² + bx + c = 0)
  const a = left.a - right.a;
  const b = left.b - right.b;
  const c = left.c - right.c;
  
  // Must have x² term (a ≠ 0) to be quadratic
  if (Math.abs(a) < EPSILON) return null;
  
  // Variables must match
  if (left.variable !== right.variable) return null;
  
  return {
    variable: left.variable || 'x',
    a,
    b,
    c,
    isStandardForm: right.a === 0 && right.b === 0 && right.c === 0
  };
}

/**
 * Parse a single quadratic expression (one side of equation)
 * Handles: 2x² + 3x - 5, x², -3x + 7, etc.
 */
function parseQuadraticExpression(input: string): {
  variable: string | null;
  a: number; // coefficient of x²
  b: number; // coefficient of x
  c: number; // constant
} | null {
  // Implementation similar to parseLinearExpression but tracking x² terms
  // Uses token-based parsing to handle:
  // - Implicit multiplication (2x² means 2 * x²)
  // - Missing coefficients (x² means 1x²)
  // - Mixed terms (2x² + 3x - 5)
  
  // ... token parsing logic ...
  
  return { variable: 'x', a, b, c };
}
```

---

### 3. Solution Functions

**File:** `src/lib/math-lab/equation-engine.ts`

```typescript
/**
 * Solve quadratic equation using specified method
 */
export function solveQuadratic(
  parsed: QuadraticEquationParsed,
  method: QuadraticSolutionMethod
): QuadraticSolution {
  const { a, b, c, variable } = parsed;
  const discriminant = b * b - 4 * a * c;
  
  switch (method) {
    case 'factoring':
      return solveByFactoring(parsed);
    case 'formula':
      return solveByFormula(parsed);
    case 'completing-square':
      return solveByCompletingSquare(parsed);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

/**
 * Attempt to factor quadratic (works only for integer factor pairs)
 */
function solveByFactoring(parsed: QuadraticEquationParsed): QuadraticSolution {
  const { a, b, c, variable } = parsed;
  
  // For ax² + bx + c, find factors of a*c that sum to b
  const product = a * c;
  const factors = findFactorPairs(product);
  
  for (const [p, q] of factors) {
    if (p + q === b) {
      // Found valid factorization
      // ax² + px + qx + c = 0
      // ax(x + p/a) + c/q * q(x + p/a) = 0
      // ... factoring logic ...
      
      const root1 = ... // Calculate from factors
      const root2 = ... // Calculate from factors
      
      return {
        method: 'factoring',
        discriminant: b * b - 4 * a * c,
        roots: [root1, root2].sort((x, y) => x - y),
        factored: formatFactored(parsed, root1, root2),
        steps: generateFactoringSteps(parsed, p, q, root1, root2)
      };
    }
  }
  
  // Cannot factor with integers
  return {
    method: 'factoring',
    discriminant: b * b - 4 * a * c,
    roots: [],
    steps: [{
      stepNumber: 1,
      description: 'Cannot factor',
      equation: `${formatQuadratic(a, b, c, variable)} = 0`,
      explanation: 'This quadratic cannot be factored using integers. Try the quadratic formula instead.'
    }]
  };
}

/**
 * Solve using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
 */
function solveByFormula(parsed: QuadraticEquationParsed): QuadraticSolution {
  const { a, b, c, variable } = parsed;
  const discriminant = b * b - 4 * a * c;
  
  const steps: QuadraticStep[] = [
    {
      stepNumber: 1,
      description: 'Identify coefficients',
      equation: `a = ${a}, b = ${b}, c = ${c}`,
      explanation: `In ${formatQuadratic(a, b, c, variable)} = 0`
    },
    {
      stepNumber: 2,
      description: 'Calculate discriminant',
      equation: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
      explanation: 'The discriminant tells us how many real solutions exist.'
    }
  ];
  
  if (discriminant < 0) {
    steps.push({
      stepNumber: 3,
      description: 'No real solutions',
      equation: `Δ < 0`,
      explanation: 'Since the discriminant is negative, this equation has no real solutions (only complex solutions).'
    });
    
    return {
      method: 'formula',
      discriminant,
      roots: [],
      steps
    };
  }
  
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDiscriminant) / (2 * a);
  const root2 = (-b - sqrtDiscriminant) / (2 * a);
  
  steps.push({
    stepNumber: 3,
    description: 'Apply quadratic formula',
    equation: `${variable} = (-b ± √Δ) / 2a = (${-b} ± √${discriminant}) / ${2 * a}`,
    explanation: `Substitute values into x = (-b ± √(b² - 4ac)) / 2a`
  });
  
  if (Number.isInteger(sqrtDiscriminant)) {
    // Exact integer or rational roots
    steps.push({
      stepNumber: 4,
      description: 'Calculate roots',
      equation: `${variable} = ${root1} or ${variable} = ${root2}`,
      explanation: discriminant === 0 ? 'One repeated root (perfect square)' : 'Two distinct rational roots'
    });
    
    return {
      method: 'formula',
      discriminant,
      roots: discriminant === 0 ? [root1] : [root1, root2].sort((x, y) => x - y),
      steps
    };
  } else {
    // Irrational roots
    const rootsExact = [
      `(${-b} + √${discriminant}) / ${2 * a}`,
      `(${-b} - √${discriminant}) / ${2 * a}`
    ];
    
    steps.push({
      stepNumber: 4,
      description: 'Simplify roots',
      equation: `${variable} ≈ ${root1.toFixed(3)} or ${variable} ≈ ${root2.toFixed(3)}`,
      explanation: `Exact form: ${variable} = ${rootsExact[0]} or ${variable} = ${rootsExact[1]}`
    });
    
    return {
      method: 'formula',
      discriminant,
      roots: [root1, root2].sort((x, y) => x - y),
      rootsExact,
      steps
    };
  }
}

/**
 * Solve by completing the square
 * ax² + bx + c = 0
 * → x² + (b/a)x = -c/a
 * → (x + b/2a)² = (b/2a)² - c/a
 * → x = -b/2a ± √((b/2a)² - c/a)
 */
function solveByCompletingSquare(parsed: QuadraticEquationParsed): QuadraticSolution {
  const { a, b, c, variable } = parsed;
  
  // Steps similar to formula method but showing completing the square process
  // ... implementation ...
  
  return { method: 'completing-square', discriminant, roots, steps };
}
```

---

### 4. Helper Functions

```typescript
/**
 * Find all factor pairs of a number
 */
function findFactorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  const absN = Math.abs(n);
  
  for (let i = 1; i <= Math.sqrt(absN); i++) {
    if (absN % i === 0) {
      const j = absN / i;
      // Consider all sign combinations
      pairs.push([i, j], [-i, -j], [i, -j], [-i, j]);
    }
  }
  
  return pairs;
}

/**
 * Format quadratic in standard form
 */
function formatQuadratic(a: number, b: number, c: number, variable: string): string {
  let result = '';
  
  // x² term
  if (a === 1) result = `${variable}²`;
  else if (a === -1) result = `-${variable}²`;
  else result = `${a}${variable}²`;
  
  // x term
  if (b > 0) result += ` + ${b === 1 ? '' : b}${variable}`;
  else if (b < 0) result += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}${variable}`;
  
  // constant term
  if (c > 0) result += ` + ${c}`;
  else if (c < 0) result += ` - ${Math.abs(c)}`;
  
  return result;
}

/**
 * Determine if quadratic can be factored with integers
 */
export function isFactorable(parsed: QuadraticEquationParsed): boolean {
  const { a, b, c } = parsed;
  const discriminant = b * b - 4 * a * c;
  
  // Must have perfect square discriminant
  if (discriminant < 0) return false;
  
  const sqrtDisc = Math.sqrt(discriminant);
  if (!Number.isInteger(sqrtDisc)) return false;
  
  // Roots must be rational
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);
  
  return isRationalNumber(root1) && isRationalNumber(root2);
}

function isRationalNumber(n: number): boolean {
  // Check if number can be expressed as p/q where p, q are small integers
  // (Simplified check for practical factoring)
  const threshold = 20; // Denominator limit
  
  for (let q = 1; q <= threshold; q++) {
    if (Math.abs(n * q - Math.round(n * q)) < EPSILON) {
      return true;
    }
  }
  
  return false;
}

/**
 * Recommend best solution method based on equation properties
 */
export function recommendQuadraticMethod(parsed: QuadraticEquationParsed): QuadraticSolutionMethod {
  const { a, b, c } = parsed;
  
  // Perfect square trinomial? Use completing square
  const discriminant = b * b - 4 * a * c;
  if (discriminant === 0) return 'completing-square';
  
  // Can factor? Use factoring (most intuitive)
  if (isFactorable(parsed)) return 'factoring';
  
  // Otherwise, use formula (most general)
  return 'formula';
}
```

---

## 🎨 UI/UX Components

### 1. Method Selection Screen

**File:** `src/components/virtual-labs/QuadraticMethodSelector.tsx`

```tsx
interface QuadraticMethodSelectorProps {
  equation: string;
  recommendedMethod: QuadraticSolutionMethod;
  allowedMethods: QuadraticSolutionMethod[];
  onSelectMethod: (method: QuadraticSolutionMethod) => void;
}

export function QuadraticMethodSelector({
  equation,
  recommendedMethod,
  allowedMethods,
  onSelectMethod
}: QuadraticMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">How would you like to solve this?</h3>
      <p className="text-muted-foreground">Equation: {equation}</p>
      
      <div className="grid gap-3">
        {allowedMethods.map((method) => (
          <button
            key={method}
            onClick={() => onSelectMethod(method)}
            className={cn(
              "p-4 border-2 rounded-lg text-left hover:bg-accent transition",
              method === recommendedMethod && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-start gap-3">
              {method === recommendedMethod && (
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium">
                  {getMethodDisplayName(method)}
                  {method === recommendedMethod && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {getMethodDescription(method)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getMethodDisplayName(method: QuadraticSolutionMethod): string {
  switch (method) {
    case 'factoring': return 'Factoring';
    case 'formula': return 'Quadratic Formula';
    case 'completing-square': return 'Completing the Square';
  }
}

function getMethodDescription(method: QuadraticSolutionMethod): string {
  switch (method) {
    case 'factoring':
      return 'Break down the equation into simpler factors. Best for equations with integer roots.';
    case 'formula':
      return 'Use x = (-b ± √(b² - 4ac)) / 2a. Works for any quadratic equation.';
    case 'completing-square':
      return 'Rewrite as a perfect square. Useful for understanding and deriving the formula.';
  }
}
```

---

### 2. Discriminant Visualizer

**File:** `src/components/virtual-labs/DiscriminantVisualizer.tsx`

```tsx
interface DiscriminantVisualizerProps {
  a: number;
  b: number;
  c: number;
  discriminant: number;
}

export function DiscriminantVisualizer({ a, b, c, discriminant }: DiscriminantVisualizerProps) {
  const rootCount = discriminant < 0 ? 0 : discriminant === 0 ? 1 : 2;
  
  return (
    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <Calculator className="w-4 h-4" />
        Discriminant Analysis
      </h4>
      
      <div className="space-y-2 text-sm">
        <p>
          Δ = b² - 4ac = ({b})² - 4({a})({c}) = <strong>{discriminant}</strong>
        </p>
        
        <div className={cn(
          "p-3 rounded-md",
          discriminant < 0 && "bg-red-100 dark:bg-red-950/30",
          discriminant === 0 && "bg-yellow-100 dark:bg-yellow-950/30",
          discriminant > 0 && "bg-green-100 dark:bg-green-950/30"
        )}>
          {discriminant < 0 && (
            <p className="text-red-700 dark:text-red-300">
              🚫 <strong>No real solutions</strong> (Δ &lt; 0)<br />
              The parabola doesn't cross the x-axis.
            </p>
          )}
          {discriminant === 0 && (
            <p className="text-yellow-700 dark:text-yellow-300">
              ⚠️ <strong>One repeated root</strong> (Δ = 0)<br />
              The parabola touches the x-axis at exactly one point.
            </p>
          )}
          {discriminant > 0 && (
            <p className="text-green-700 dark:text-green-300">
              ✅ <strong>Two distinct roots</strong> (Δ &gt; 0)<br />
              The parabola crosses the x-axis at two points.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Parabola Graph Visualizer

**File:** `src/components/virtual-labs/ParabolaGraph.tsx`

```tsx
interface ParabolaGraphProps {
  a: number;
  b: number;
  c: number;
  roots: number[];
  width?: number;
  height?: number;
}

export function ParabolaGraph({ a, b, c, roots, width = 400, height = 400 }: ParabolaGraphProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate viewing window based on roots and vertex
    const vertex_x = -b / (2 * a);
    const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;
    
    const xMin = Math.min(...roots, vertex_x) - 5;
    const xMax = Math.max(...roots, vertex_x) + 5;
    const yMin = Math.min(vertex_y, 0) - 5;
    const yMax = Math.max(vertex_y, 0) + 5;
    
    // Transform functions
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    
    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    
    // X-axis
    const y0 = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(width, y0);
    ctx.stroke();
    
    // Y-axis
    const x0 = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, height);
    ctx.stroke();
    
    // Draw parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let px = 0; px <= width; px++) {
      const x = xMin + (px / width) * (xMax - xMin);
      const y = a * x * x + b * x + c;
      const py = toCanvasY(y);
      
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // Draw roots
    ctx.fillStyle = '#ef4444';
    roots.forEach(root => {
      const px = toCanvasX(root);
      const py = toCanvasY(0);
      
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Label
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.fillText(`x = ${root.toFixed(2)}`, px + 8, py - 8);
      ctx.fillStyle = '#ef4444';
    });
    
    // Draw vertex
    const vx = toCanvasX(vertex_x);
    const vy = toCanvasY(vertex_y);
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(vx, vy, 5, 0, 2 * Math.PI);
    ctx.fill();
    
  }, [a, b, c, roots, width, height]);
  
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Graph Visualization
      </h4>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded"
      />
      <div className="mt-2 text-xs text-muted-foreground flex gap-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          Parabola
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          Roots
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          Vertex
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Step-by-Step Solution Display

**File:** `src/components/virtual-labs/QuadraticSolutionSteps.tsx`

```tsx
interface QuadraticSolutionStepsProps {
  steps: QuadraticStep[];
  currentStep: number;
  onStepComplete: () => void;
}

export function QuadraticSolutionSteps({
  steps,
  currentStep,
  onStepComplete
}: QuadraticSolutionStepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={step.stepNumber}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: currentStep >= index ? 1 : 0.3, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "p-4 border rounded-lg",
            currentStep === index && "border-primary bg-primary/5",
            currentStep > index && "border-green-500 bg-green-50 dark:bg-green-950/20"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
              currentStep > index && "bg-green-500 text-white",
              currentStep === index && "bg-primary text-primary-foreground",
              currentStep < index && "bg-gray-200 text-gray-500"
            )}>
              {currentStep > index ? <Check className="w-4 h-4" /> : step.stepNumber}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium">{step.description}</h4>
              <div className="mt-2 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {step.equation}
              </div>
              {step.explanation && (
                <p className="mt-2 text-sm text-muted-foreground">{step.explanation}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      {currentStep < steps.length && (
        <Button onClick={onStepComplete} className="w-full">
          Next Step →
        </Button>
      )}
    </div>
  );
}
```

---

## 🎮 User Flow

### Flow 1: Guided Practice Mode

```
1. Lab presents quadratic equation: "x² + 5x + 6 = 0"
2. System shows Method Selector with recommendation
3. Student selects "Factoring" (recommended)
4. Tutorial dialog appears (first time only):
   "Let's learn to factor! We need to find two numbers that multiply to 6 and add to 5."
5. System asks: "What two numbers multiply to 6 and add to 5?"
   Student inputs: "2, 3"
6. System validates: ✅ Correct! We can write (x + 2)(x + 3) = 0
7. System shows factored form, asks: "If (x + 2)(x + 3) = 0, what is x?"
8. Student inputs first root: "x = -2"
9. System: ✅ Good! What's the other root?
10. Student inputs: "x = -3"
11. System: 🎉 Perfect! Shows graph with both roots marked
12. Checkpoint question to verify understanding
13. Next mission (slightly harder)
```

---

### Flow 2: Custom Equation Mode

```
1. Student clicks "Solve My Equation"
2. Input field appears: "Enter a quadratic equation"
3. Student types: "2x² - 8 = 0"
4. System parses and validates:
   ✅ Valid quadratic equation (a=2, b=0, c=-8)
5. System analyzes equation:
   - Discriminant: 64 (positive)
   - Factorable: Yes
   - Recommended method: Factoring
6. Shows method selector with "Factoring" highlighted
7. Student chooses method
8. Enters guided solution flow
```

---

### Flow 3: Error Handling

```
Student input: "2x² + 5x + 3 = 0"
Student selects: Factoring

Step 1: "Find two factors of 6 that add to 5"
Student input: "2, 3"

System: ❌ Not quite! 2 × 3 = 6 ✅ but 2 + 3 = 5 ❌
Check: We need factors of a×c = 2×3 = 6, not just c

Hint shown: "For 2x² + 5x + 3, we need factors of (2×3=6) that add to 5"

Student retries: "2, 3" again
System: Let's use the quadratic formula instead - this one doesn't factor nicely!
Automatically switches to formula method
```

---

## 🧪 Test Cases

### Unit Tests

**File:** `src/lib/math-lab/equation-engine.test.ts`

```typescript
describe('parseQuadraticEquation', () => {
  it('should parse standard form', () => {
    const result = parseQuadraticEquation('x² + 5x + 6 = 0');
    expect(result).toEqual({
      variable: 'x',
      a: 1,
      b: 5,
      c: 6,
      isStandardForm: true
    });
  });
  
  it('should handle missing middle term', () => {
    const result = parseQuadraticEquation('x² - 9 = 0');
    expect(result).toEqual({
      variable: 'x',
      a: 1,
      b: 0,
      c: -9,
      isStandardForm: true
    });
  });
  
  it('should normalize to standard form', () => {
    const result = parseQuadraticEquation('x² + 4x = 5');
    expect(result).toEqual({
      variable: 'x',
      a: 1,
      b: 4,
      c: -5,
      isStandardForm: false
    });
  });
  
  it('should handle case-insensitive variables', () => {
    const result = parseQuadraticEquation('2X² + 3X - 5 = 0');
    expect(result?.variable).toBe('x');
  });
  
  it('should reject non-quadratic equations', () => {
    expect(parseQuadraticEquation('2x + 5 = 0')).toBeNull(); // Linear
    expect(parseQuadraticEquation('x³ + 2x² + 1 = 0')).toBeNull(); // Cubic
  });
});

describe('solveByFactoring', () => {
  it('should factor simple quadratic', () => {
    const parsed = parseQuadraticEquation('x² + 5x + 6 = 0')!;
    const solution = solveByFactoring(parsed);
    
    expect(solution.roots).toEqual([-3, -2]);
    expect(solution.factored).toContain('(x + 2)(x + 3)');
  });
  
  it('should handle difference of squares', () => {
    const parsed = parseQuadraticEquation('x² - 16 = 0')!;
    const solution = solveByFactoring(parsed);
    
    expect(solution.roots).toEqual([-4, 4]);
    expect(solution.factored).toContain('(x - 4)(x + 4)');
  });
  
  it('should detect non-factorable quadratics', () => {
    const parsed = parseQuadraticEquation('x² + 3x + 1 = 0')!;
    const solution = solveByFactoring(parsed);
    
    expect(solution.roots).toEqual([]);
    expect(solution.steps[0].description).toContain('Cannot factor');
  });
});

describe('solveByFormula', () => {
  it('should solve with two real roots', () => {
    const parsed = parseQuadraticEquation('x² + 5x + 6 = 0')!;
    const solution = solveByFormula(parsed);
    
    expect(solution.roots).toEqual([-3, -2]);
    expect(solution.discriminant).toBe(1);
  });
  
  it('should handle one repeated root', () => {
    const parsed = parseQuadraticEquation('x² + 6x + 9 = 0')!;
    const solution = solveByFormula(parsed);
    
    expect(solution.roots).toEqual([-3]);
    expect(solution.discriminant).toBe(0);
  });
  
  it('should detect no real solutions', () => {
    const parsed = parseQuadraticEquation('x² + 2x + 5 = 0')!;
    const solution = solveByFormula(parsed);
    
    expect(solution.roots).toEqual([]);
    expect(solution.discriminant).toBeLessThan(0);
  });
  
  it('should provide exact irrational roots', () => {
    const parsed = parseQuadraticEquation('x² + 3x + 1 = 0')!;
    const solution = solveByFormula(parsed);
    
    expect(solution.rootsExact).toBeDefined();
    expect(solution.rootsExact![0]).toContain('√');
  });
});

describe('isFactorable', () => {
  it('should detect factorable quadratics', () => {
    expect(isFactorable(parseQuadraticEquation('x² + 5x + 6 = 0')!)).toBe(true);
    expect(isFactorable(parseQuadraticEquation('2x² + 7x + 3 = 0')!)).toBe(true);
  });
  
  it('should detect non-factorable quadratics', () => {
    expect(isFactorable(parseQuadraticEquation('x² + 3x + 1 = 0')!)).toBe(false);
    expect(isFactorable(parseQuadraticEquation('x² + 2x + 5 = 0')!)).toBe(false); // No real roots
  });
});
```

---

### Integration Tests

```typescript
describe('Quadratic Builder Mission Flow', () => {
  it('should generate diverse missions', () => {
    const missions = generateQuadraticMissions(10, 'global-k12');
    
    expect(missions).toHaveLength(10);
    expect(missions.every(m => m.type === 'quadratic')).toBe(true);
    
    // Should have mix of methods
    const methods = missions.map(m => m.recommendedMethod);
    expect(methods).toContain('factoring');
    expect(methods).toContain('formula');
  });
  
  it('should validate student factoring input', () => {
    const mission = buildQuadraticMission('x² + 5x + 6 = 0', 'factoring');
    
    // Correct factors
    const result1 = validateFactoringStep(mission, { factor1: 2, factor2: 3 });
    expect(result1.ok).toBe(true);
    
    // Incorrect factors
    const result2 = validateFactoringStep(mission, { factor1: 1, factor2: 6 });
    expect(result2.ok).toBe(false);
    expect(result2.reason).toContain('sum');
  });
});
```

---

## 📚 Curriculum Alignment

### UK - GCSE Maths

| Grade | Content |
|-------|---------|
| 5-6 | Solve quadratics by factoring (simple cases) |
| 7-8 | Quadratic formula, discriminant interpretation |
| 9 | Completing the square, proof of quadratic formula |

### US - Common Core

| Grade Level | Standard |
|-------------|----------|
| Algebra 1 (9th) | A-SSE.3.a: Factor quadratics with a=1 |
| Algebra 1 (9th) | A-REI.4.b: Solve using quadratic formula |
| Algebra 2 (10th) | A-REI.4.a: Complete the square |

### IB MYP

| Year | Topic |
|------|-------|
| 4 | Solving quadratics by factoring |
| 5 | Quadratic formula, nature of roots |

### WAEC - WASSCE

**Core Mathematics:** Factoring simple quadratics  
**Elective Mathematics:** Quadratic formula, completing square, discriminant

---

## 🚀 Implementation Milestones

### Week 1: Core Parsing & Solving
- ✅ Implement `parseQuadraticEquation`
- ✅ Implement `parseQuadraticExpression`
- ✅ Implement `solveByFactoring`
- ✅ Implement `solveByFormula`
- ✅ Write unit tests for parsing and solving
- ✅ Test case-insensitive variable handling

**Deliverable:** Core equation engine functions with 90%+ test coverage

---

### Week 2: UI Components
- ✅ Build `QuadraticMethodSelector`
- ✅ Build `DiscriminantVisualizer`
- ✅ Build `ParabolaGraph` with canvas rendering
- ✅ Build `QuadraticSolutionSteps`
- ✅ Integrate with existing `TeacherVoice` component

**Deliverable:** All UI components with Storybook stories

---

### Week 3: Mission System & Validation
- ✅ Implement `generateQuadraticMissions`
- ✅ Add quadratic equation type to mission builder
- ✅ Implement step validation for factoring
- ✅ Implement step validation for formula application
- ✅ Add checkpoint questions for quadratics
- ✅ Write integration tests

**Deliverable:** End-to-end quadratic mission flow working

---

### Week 4: Polish & Testing
- ✅ Add educational hints and error messages
- ✅ Implement tutorial dialog (first-time users)
- ✅ Add graph animations
- ✅ Performance optimization (mobile)
- ✅ User acceptance testing (5-10 students)
- ✅ Bug fixes and refinements
- ✅ Documentation updates

**Deliverable:** Production-ready quadratic equation feature

---

## 🎯 Success Metrics

### Quantitative
- **User Engagement:** 70%+ completion rate on quadratic missions
- **Learning Outcomes:** 25%+ improvement in post-test scores
- **Performance:** < 100ms parse time, < 2s graph render
- **Accuracy:** 95%+ correct validation decisions

### Qualitative
- Teacher feedback: "Students understand discriminant concept better"
- Student feedback: "Graph visualization makes it click"
- Support tickets: < 5 bugs reported in first month

---

## 🔄 Future Enhancements (Post-v3.0)

### Medium Priority
- Interactive factoring (drag-and-drop factor pairs)
- 3D parabola rotation (for y = ax² + bx + c visualization)
- Solving by graphing method
- Word problems leading to quadratics

### Low Priority
- Complex number solutions (a + bi form)
- Quadratic inequalities (ax² + bx + c > 0)
- System of quadratic equations
- Optimization problems using quadratics

---

## 📞 Questions for Review

### For Product Team:
1. Should we support complex number solutions in v3.0 or defer to v3.1?
2. Is graph visualization required for all devices or desktop-only?
3. Priority: Factoring tutorial depth vs. completing-square method?

### For Educators:
1. Which factoring technique should we teach first (ac method vs. trial-and-error)?
2. Should we show discriminant calculation by default or hide for beginners?
3. How much emphasis on graph interpretation vs. algebraic solving?

### For Developers:
1. Canvas vs. SVG for parabola graphing (performance trade-offs)?
2. Integration with existing `buildMissionFromEquation` or separate system?
3. TypeScript types: Extend `EquationBuilderMission` or new `QuadraticBuilderMission`?

---

## 📎 Related Documents

- [EQUATION_BUILDER_NEXT_UPGRADE.md](EQUATION_BUILDER_NEXT_UPGRADE.md) - Overall v3.0 roadmap
- [CAROUSEL_LESSONS_GUIDE.md](docs/CAROUSEL_LESSONS_GUIDE.md) - Lesson structure patterns
- [FLEXIBLE_VALIDATION_IMPLEMENTATION.md](docs/FLEXIBLE_VALIDATION_IMPLEMENTATION.md) - Validation system
- [INEQUALITY_TEST_SUITE.md](INEQUALITY_TEST_SUITE.md) - Testing patterns

---

**Spec Author:** Development Team  
**Reviewers:** Product, Education, UX  
**Status:** 🟡 Ready for Sprint Planning  
**Est. Story Points:** 21 (3-4 week sprint)
