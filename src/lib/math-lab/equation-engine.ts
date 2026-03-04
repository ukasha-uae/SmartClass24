export type EquationCurriculumProfile = 'global-k12' | 'american' | 'british' | 'ib' | 'waec';

export type LinearEquationParsed = {
  variable: string;
  a: number;
  b: number;
  c: number;
};

export type FractionLinearEquationParsed = {
  variable: string;
  numerator: number;
  denominator: number;
  b: number;
  c: number;
};

export type BracketLinearParsed = {
  variable: string;
  multiplier: number;
  innerConstant: number;
  outerConstant: number;
  rhs: number;
};

export type BracketLinearScaffold = {
  originalDisplay: string;
  expandedDisplay: string;
  simplifiedDisplay: string;
  simplifiedParsed: LinearEquationParsed;
};

/**
 * Variable on Both Sides Equation Type
 * Examples: 3x + 7 = x + 15, 5x - 2 = 2x + 10, 4x + 3 = x
 */
export type TwoSidedLinearEquationParsed = {
  variable: string;
  leftA: number;   // coefficient on left side (e.g., 3 in 3x + 7)
  leftB: number;   // constant on left side (e.g., 7 in 3x + 7)
  rightA: number;  // coefficient on right side (e.g., 1 in x + 15)
  rightB: number;  // constant on right side (e.g., 15 in x + 15)
};

/**
 * Inequality Type
 * Examples: 3x + 5 > 20, 2x - 7 ≤ 15, -x + 10 < 25
 */
export type InequalityOperator = '<' | '>' | '≤' | '≥';

export type InequalityParsed = {
  variable: string;
  a: number; // coefficient (e.g., 3 in 3x + 5)
  b: number; // constant on left (e.g., 5 in 3x + 5)
  c: number; // constant on right (e.g., 20 in 3x + 5 > 20)
  operator: InequalityOperator;
  signFlips: number; // Count of sign flips needed (when dividing by negative)
};

export type InequalitySolution = {
  value: number; // The boundary value
  operator: InequalityOperator; // Operator for the solution (x > 5, x ≤ -2, etc.)
  display: string; // Human-readable format "x > 5"
  rangeDisplay: string; // Alternative format "(5, ∞)" or "(-∞, -2]"
};

export type InequalityBuilderMission = {
  id: string;
  inequality: string; // Original inequality string
  conceptId: 'algebra.inequality.solve';
  operationExpected: { symbol: '+' | '-'; value: string };
  inequalityExpected: [string, InequalityOperator, string, string]; // [coeff, operator, var, constant]
  answerExpected: InequalitySolution;
  tokenBank: string[];
  hint: string;
  signFlipWarning?: string; // Warn when about to divide by negative
  skipStep1?: boolean; // Skip step 1 if no constant term (b = 0)
};

export type EquationBuilderMission = {
  id: string;
  equation: string;
  conceptId: 'algebra.linear.solve';
  operationExpected: { symbol: '+' | '-'; value: string };
  equationExpected: [string, string, string, string];
  answerExpected: [string, string, string];
  tokenBank: string[];
  hint: string;
  steps?: number; // Optional: for variable-both-sides (4 steps) vs regular (3 steps)
  intermediateAnswer?: { coeff: number; rhs: number; display: string }; // For flexible step 3 validation
};

export type EquationStepValidationReason =
  | 'missing_equals'
  | 'multiple_equals'
  | 'missing_side'
  | 'invalid_expression'
  | 'unexpected_variable'
  | 'not_balanced_target'
  | 'not_isolated_variable'
  | 'sign_not_flipped';

export type EquationStepValidationResult = {
  ok: boolean;
  reason: EquationStepValidationReason | null;
  strategyTag?: EquationStepStrategyTag;
};

export type EquationStepStrategyTag =
  | 'direct'
  | 'swap_sides'
  | 'scaled_equivalent'
  | 'negative_scaled_equivalent'
  | 'clear_denominator_first'
  | 'rearranged_simplify'
  | 'expanded_equivalent'
  | 'fraction_equivalent';

const CURRICULUM_STRATEGY_PREFERENCES: Record<
  EquationCurriculumProfile,
  {
    preferredStep2: EquationStepStrategyTag[];
    preferredStep3: EquationStepStrategyTag[];
    coachingStyle: string;
  }
> = {
  'global-k12': {
    preferredStep2: ['direct', 'swap_sides', 'clear_denominator_first'],
    preferredStep3: ['direct', 'swap_sides'],
    coachingStyle: 'Use the clearest balanced form before final isolation.',
  },
  american: {
    preferredStep2: ['direct', 'clear_denominator_first', 'rearranged_simplify'],
    preferredStep3: ['direct'],
    coachingStyle: 'Show clean balancing steps and simplify before isolating.',
  },
  british: {
    preferredStep2: ['direct', 'swap_sides', 'expanded_equivalent'],
    preferredStep3: ['direct', 'swap_sides'],
    coachingStyle: 'Keep formal balance and tidy equation layout.',
  },
  ib: {
    preferredStep2: ['direct', 'rearranged_simplify', 'clear_denominator_first'],
    preferredStep3: ['direct', 'swap_sides'],
    coachingStyle: 'Preserve equivalence with explicit, justifiable transformations.',
  },
  waec: {
    preferredStep2: ['direct', 'clear_denominator_first', 'swap_sides'],
    preferredStep3: ['direct'],
    coachingStyle: 'Prioritize exam-ready, easy-to-mark line-by-line working.',
  },
};

export function getCurriculumPreferredStrategies(curriculum: EquationCurriculumProfile) {
  return CURRICULUM_STRATEGY_PREFERENCES[curriculum] ?? CURRICULUM_STRATEGY_PREFERENCES['global-k12'];
}

export function getCurriculumRouteFeedback(
  curriculum: EquationCurriculumProfile,
  step: 'step2' | 'step3',
  strategyTag?: EquationStepStrategyTag
): { encouragement: string; preferenceTip: string | null } {
  if (!strategyTag) {
    return { encouragement: 'Correct route.', preferenceTip: null };
  }
  const preference = getCurriculumPreferredStrategies(curriculum);
  const preferredList = step === 'step2' ? preference.preferredStep2 : preference.preferredStep3;
  const isPreferred = preferredList.includes(strategyTag);
  const encouragement = isPreferred
    ? 'Great route for this curriculum.'
    : 'Valid route. Nice mathematical flexibility.';

  if (isPreferred) {
    return { encouragement, preferenceTip: null };
  }
  return {
    encouragement,
    preferenceTip: `In this curriculum, a common preferred style is: ${preference.coachingStyle}`,
  };
}

type ParsedLinearExpression = {
  coefficient: number;
  constant: number;
  variable: string;
};

const EPSILON = 1e-9;

function almostEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPSILON;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseNumericToken(raw: string): number | null {
  const normalized = raw.trim();
  if (!normalized) return null;
  const fraction = normalized.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  if (fraction) {
    const numerator = Number.parseInt(fraction[1], 10);
    const denominator = Number.parseInt(fraction[2], 10);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
    return numerator / denominator;
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function parseEquationNumericToken(raw: string): number | null {
  return parseNumericToken(raw);
}

export function areEquationNumericTokensEquivalent(
  leftRaw: string,
  rightRaw: string,
  epsilon = EPSILON
): boolean {
  const left = parseNumericToken(leftRaw);
  const right = parseNumericToken(rightRaw);
  if (left == null || right == null) return false;
  return Math.abs(left - right) <= epsilon;
}

function normalizeTerm(term: string): string {
  return term
    .replace(/\s+/g, '') // Remove all whitespace
    .replace(/\*/g, '') // Remove multiplication symbols
    .replace(/−/g, '-') // Convert Unicode minus (U+2212) to ASCII minus
    .replace(/×/g, '*') // Convert Unicode multiplication (U+00D7) to ASCII
    .replace(/÷/g, '/'); // Convert Unicode division (U+00F7) to ASCII
}

function parseSignedInt(input: string): number | null {
  if (!/^[+-]?\d+$/.test(input)) return null;
  const parsed = Number.parseInt(input, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseCoefficient(raw: string): number | null {
  if (raw === '' || raw === '+') return 1;
  if (raw === '-') return -1;
  return parseSignedInt(raw);
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

/**
 * Parse equations in the form ax + b = c, ax - b = c, x + b = c, -x + b = c.
 * Examples: 4x+8=36, 2x - 7 = 9, -x+5=2, x-3=7
 */
export function parseLinearEquation(input: string): LinearEquationParsed | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  const match = normalized.match(/^([+-]?\d*)([a-zA-Z])([+-]\d+)?=([+-]?\d+)$/);
  if (!match) return null;

  const [, rawCoeff, variable, rawB = '', rawC] = match;
  const a = parseCoefficient(rawCoeff);
  const b = rawB ? parseSignedInt(rawB) : 0;
  const c = parseSignedInt(rawC);

  if (a == null || b == null || c == null || a === 0) return null;
  return { variable, a, b, c };
}

/**
 * Parse broader linear forms by symbolic reduction, e.g. 2(x+3)=10, x+5=13, 3(x-2)+4=19.
 * Returns an equivalent ax + b = c representation for mission building.
 */
export function parseFlexibleLinearEquation(input: string): LinearEquationParsed | null {
  const split = splitEquation(input);
  if (!split) return null;
  const [leftRaw, rightRaw] = split;
  const left = parseLinearExpression(leftRaw);
  const right = parseLinearExpression(rightRaw);
  if (!left || !right) return null;
  if (left.variable !== right.variable) return null;

  // Normalize to ax + b = c, keeping a right-hand constant when possible.
  const a = left.coefficient - right.coefficient;
  const b = left.constant;
  const c = right.constant;
  if (almostEqual(a, 0)) return null;
  return {
    variable: left.variable || 'x',
    a,
    b,
    c,
  };
}

export function hasIntegerSolution(parsed: LinearEquationParsed): boolean {
  const numerator = parsed.c - parsed.b;
  const solution = numerator / parsed.a;
  return Number.isInteger(solution);
}

export function parseFractionLinearEquation(input: string): FractionLinearEquationParsed | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  const match = normalized.match(/^([+-]?)([a-zA-Z])\/(\d+)([+-]\d+)?=([+-]?\d+)$/);
  if (!match) return null;

  const [, signRaw, variable, denominatorRaw, rawB = '', rawC] = match;
  const denominator = Number.parseInt(denominatorRaw, 10);
  if (!Number.isFinite(denominator) || denominator === 0) return null;
  const sign = signRaw === '-' ? -1 : 1;
  const b = rawB ? parseSignedInt(rawB) : 0;
  const c = parseSignedInt(rawC);
  if (b == null || c == null) return null;

  return {
    variable,
    numerator: sign,
    denominator: Math.abs(denominator),
    b,
    c,
  };
}

export function parseBracketLinearEquation(input: string): BracketLinearParsed | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  const match = normalized.match(/^([+-]?\d+)\(([a-zA-Z])([+-]\d+)\)([+-]\d+)?=([+-]?\d+)$/);
  if (!match) return null;

  const [, rawMultiplier, variable, rawInnerConstant, rawOuterConstant = '+0', rawRhs] = match;
  const multiplier = parseSignedInt(rawMultiplier);
  const innerConstant = parseSignedInt(rawInnerConstant);
  const outerConstant = parseSignedInt(rawOuterConstant);
  const rhs = parseSignedInt(rawRhs);
  if (multiplier == null || innerConstant == null || outerConstant == null || rhs == null || multiplier === 0) {
    return null;
  }
  return { variable, multiplier, innerConstant, outerConstant, rhs };
}

function formatLinearDisplay(a: number, variable: string, b: number, c: number): string {
  const leftCoeff = a === 1 ? variable : a === -1 ? `-${variable}` : `${a}${variable}`;
  const left =
    b > 0 ? `${leftCoeff} + ${Math.abs(b)}` : b < 0 ? `${leftCoeff} - ${Math.abs(b)}` : `${leftCoeff}`;
  return `${left} = ${c}`;
}

export function buildBracketLinearScaffold(parsed: BracketLinearParsed): BracketLinearScaffold {
  const { variable, multiplier, innerConstant, outerConstant, rhs } = parsed;
  const distributedConstant = multiplier * innerConstant;
  const simplifiedConstant = distributedConstant + outerConstant;

  const originalDisplay = `${multiplier}(${variable}${innerConstant >= 0 ? '+' : ''}${innerConstant})${
    outerConstant >= 0 ? '+' : ''
  }${outerConstant}=${rhs}`;
  const expandedDisplay = `${multiplier}${variable}${distributedConstant >= 0 ? '+' : ''}${distributedConstant}${
    outerConstant >= 0 ? '+' : ''
  }${outerConstant}=${rhs}`;
  const simplifiedDisplay = formatLinearDisplay(multiplier, variable, simplifiedConstant, rhs);

  return {
    originalDisplay,
    expandedDisplay,
    simplifiedDisplay,
    simplifiedParsed: {
      variable,
      a: multiplier,
      b: simplifiedConstant,
      c: rhs,
    },
  };
}

export function hasIntegerSolutionForFraction(parsed: FractionLinearEquationParsed): boolean {
  const solution = ((parsed.c - parsed.b) * parsed.denominator) / parsed.numerator;
  return Number.isInteger(solution);
}

export function buildMissionFromLinearEquation(
  id: string,
  parsed: LinearEquationParsed,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission {
  const { variable, a, b, c } = parsed;
  const xValue = (c - b) / a;
  const rhsAfterInverse = c - b;
  const inverseSymbol: '+' | '-' = b >= 0 ? '-' : '+';
  const inverseValue = String(Math.abs(b));
  const equationDisplay =
    b > 0
      ? `${a}${variable} + ${Math.abs(b)} = ${c}`
      : b < 0
      ? `${a}${variable} - ${Math.abs(b)} = ${c}`
      : `${a}${variable} = ${c}`;

  const hint =
    curriculum === 'ib'
      ? `Preserve equivalence: apply ${inverseSymbol}${Math.abs(b)} to both sides, then divide by ${a}.`
      : `Undo the constant first (${inverseSymbol}${Math.abs(b)}), then divide both sides by ${a}.`;

  const distractors = [String(c + 1), String(c - 1), String(xValue + 1), String(a + 1)];
  const tokenBank = uniqueValues([
    variable,
    '=',
    '+',
    '-',
    String(a),
    String(Math.abs(b)),
    String(c),
    String(rhsAfterInverse),
    String(xValue),
    ...distractors,
  ]);

  return {
    id,
    equation: equationDisplay,
    conceptId: 'algebra.linear.solve',
    operationExpected: { symbol: inverseSymbol, value: inverseValue },
    equationExpected: [String(a), variable, '=', String(rhsAfterInverse)],
    answerExpected: [variable, '=', String(xValue)],
    tokenBank,
    hint,
  };
}

export function generateLinearMissions(
  count: number,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission[] {
  const coeffs = [2, 3, 4, 5];
  const constants = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9];
  const solutions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const missions: EquationBuilderMission[] = [];
  const seen = new Set<string>();

  let attempts = 0;
  while (missions.length < count && attempts < 120) {
    attempts += 1;
    const a = coeffs[Math.floor(Math.random() * coeffs.length)];
    const b = constants[Math.floor(Math.random() * constants.length)];
    const x = solutions[Math.floor(Math.random() * solutions.length)];
    const c = a * x + b;
    if (Math.abs(c) > 50) continue;
    const key = `${a}|${b}|${c}`;
    if (seen.has(key)) continue;
    seen.add(key);
    missions.push(
      buildMissionFromLinearEquation(`m${missions.length + 1}`, { variable: 'x', a, b, c }, curriculum)
    );
  }

  if (missions.length < count) {
    const fallbackInputs: LinearEquationParsed[] = [
      { variable: 'x', a: 2, b: 3, c: 11 },
      { variable: 'x', a: 3, b: -5, c: 16 },
      { variable: 'x', a: 4, b: 8, c: 36 },
      { variable: 'x', a: 5, b: -7, c: 13 },
    ];
    for (const fallback of fallbackInputs) {
      if (missions.length >= count) break;
      missions.push(buildMissionFromLinearEquation(`fallback-${missions.length + 1}`, fallback, curriculum));
    }
  }

  return missions.slice(0, count);
}

export function generateFractionLinearMissions(
  count: number,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission[] {
  const denominators = [2, 3, 4, 5];
  const constants = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
  const rhsValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const missions: EquationBuilderMission[] = [];
  const seen = new Set<string>();

  let attempts = 0;
  while (missions.length < count && attempts < 120) {
    attempts += 1;
    const d = denominators[Math.floor(Math.random() * denominators.length)];
    const b = constants[Math.floor(Math.random() * constants.length)];
    const rhsAfterInverse = rhsValues[Math.floor(Math.random() * rhsValues.length)];
    const c = rhsAfterInverse + b;
    const xValue = rhsAfterInverse * d;
    if (Math.abs(c) > 30 || Math.abs(xValue) > 50) continue;
    const key = `${d}|${b}|${c}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const inverseSymbol: '+' | '-' = b >= 0 ? '-' : '+';
    const inverseValue = String(Math.abs(b));
    const equationDisplay =
      b > 0 ? `x/${d} + ${Math.abs(b)} = ${c}` : b < 0 ? `x/${d} - ${Math.abs(b)} = ${c}` : `x/${d} = ${c}`;
    const hint =
      curriculum === 'ib'
        ? `Apply ${inverseSymbol}${Math.abs(b)} to both sides, then multiply both sides by ${d}.`
        : `Undo the constant first (${inverseSymbol}${Math.abs(b)}), then multiply both sides by ${d}.`;

    missions.push({
      id: `f${missions.length + 1}`,
      equation: equationDisplay,
      conceptId: 'algebra.linear.solve',
      operationExpected: { symbol: inverseSymbol, value: inverseValue },
      equationExpected: [`1/${d}`, 'x', '=', String(rhsAfterInverse)],
      answerExpected: ['x', '=', String(xValue)],
      tokenBank: uniqueValues([
        'x',
        '=',
        '+',
        '-',
        `1/${d}`,
        `x/${d}`,
        String(Math.abs(b)),
        String(c),
        String(rhsAfterInverse),
        String(xValue),
      ]),
      hint,
    });
  }

  return missions.slice(0, count);
}

export function buildMissionFromFractionLinearEquation(
  id: string,
  parsed: FractionLinearEquationParsed,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission {
  const { variable, numerator, denominator, b, c } = parsed;
  const coeffFraction = `${numerator}/${denominator}`;
  const rhsAfterInverse = c - b;
  const xValue = (rhsAfterInverse * denominator) / numerator;
  const inverseSymbol: '+' | '-' = b >= 0 ? '-' : '+';
  const inverseValue = String(Math.abs(b));
  const leftTerm = numerator === 1 ? `${variable}/${denominator}` : numerator === -1 ? `-${variable}/${denominator}` : `${coeffFraction}${variable}`;
  const equationDisplay =
    b > 0 ? `${leftTerm} + ${Math.abs(b)} = ${c}` : b < 0 ? `${leftTerm} - ${Math.abs(b)} = ${c}` : `${leftTerm} = ${c}`;

  const hint =
    curriculum === 'ib'
      ? `Apply ${inverseSymbol}${Math.abs(b)} to both sides, then multiply both sides by ${denominator}.`
      : `Undo the constant first (${inverseSymbol}${Math.abs(b)}), then multiply both sides by ${denominator}.`;

  return {
    id,
    equation: equationDisplay,
    conceptId: 'algebra.linear.solve',
    operationExpected: { symbol: inverseSymbol, value: inverseValue },
    equationExpected: [coeffFraction, variable, '=', String(rhsAfterInverse)],
    answerExpected: [variable, '=', String(xValue)],
    tokenBank: uniqueValues([
      variable,
      '=',
      '+',
      '-',
      coeffFraction,
      leftTerm,
      String(Math.abs(b)),
      String(c),
      String(rhsAfterInverse),
      String(xValue),
    ]),
    hint,
  };
}

function parseLinearExpression(input: string): ParsedLinearExpression | null {
  type Token = { type: 'num' | 'var' | 'op' | 'lparen' | 'rparen'; value: string };
  type LinearForm = { a: number; b: number; variable: string | null };

  const normalized = normalizeTerm(input);
  if (!normalized) return null;

  const rawTokens: Token[] = [];
  let i = 0;
  while (i < normalized.length) {
    const ch = normalized[i];
    if (/\d|\./.test(ch)) {
      let j = i + 1;
      while (j < normalized.length && /[\d.]/.test(normalized[j])) j += 1;
      rawTokens.push({ type: 'num', value: normalized.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      rawTokens.push({ type: 'var', value: ch });
      i += 1;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      rawTokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    if (ch === '(') {
      rawTokens.push({ type: 'lparen', value: ch });
      i += 1;
      continue;
    }
    if (ch === ')') {
      rawTokens.push({ type: 'rparen', value: ch });
      i += 1;
      continue;
    }
    return null;
  }

  const tokens: Token[] = [];
  for (let idx = 0; idx < rawTokens.length; idx += 1) {
    const current = rawTokens[idx];
    const next = rawTokens[idx + 1];
    tokens.push(current);
    if (!next) continue;
    const leftCanMultiply = current.type === 'num' || current.type === 'var' || current.type === 'rparen';
    const rightCanMultiply = next.type === 'num' || next.type === 'var' || next.type === 'lparen';
    if (leftCanMultiply && rightCanMultiply) {
      tokens.push({ type: 'op', value: '*' });
    }
  }

  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const mergeVariable = (left: string | null, right: string | null): string | null => {
    if (!left) return right;
    if (!right) return left;
    if (left !== right) return null;
    return left;
  };

  const addForms = (x: LinearForm, y: LinearForm): LinearForm | null => {
    const variable = mergeVariable(x.variable, y.variable);
    if (x.variable && y.variable && !variable) return null;
    return { a: x.a + y.a, b: x.b + y.b, variable };
  };

  const subForms = (x: LinearForm, y: LinearForm): LinearForm | null => {
    const variable = mergeVariable(x.variable, y.variable);
    if (x.variable && y.variable && !variable) return null;
    return { a: x.a - y.a, b: x.b - y.b, variable };
  };

  const mulForms = (x: LinearForm, y: LinearForm): LinearForm | null => {
    // Linear-only guard: variable * variable is non-linear.
    if (Math.abs(x.a) > EPSILON && Math.abs(y.a) > EPSILON) return null;
    if (Math.abs(x.a) > EPSILON) {
      if (Math.abs(y.b) <= EPSILON && Math.abs(y.a) <= EPSILON) return null;
      return { a: x.a * y.b, b: x.b * y.b, variable: x.variable };
    }
    if (Math.abs(y.a) > EPSILON) {
      if (Math.abs(x.b) <= EPSILON && Math.abs(x.a) <= EPSILON) return null;
      return { a: y.a * x.b, b: y.b * x.b, variable: y.variable };
    }
    return { a: 0, b: x.b * y.b, variable: x.variable ?? y.variable };
  };

  const divForms = (x: LinearForm, y: LinearForm): LinearForm | null => {
    // Division by a variable expression is non-linear/unsupported here.
    if (Math.abs(y.a) > EPSILON) return null;
    if (almostEqual(y.b, 0)) return null;
    return { a: x.a / y.b, b: x.b / y.b, variable: x.variable };
  };

  const parsePrimary = (): LinearForm | null => {
    const token = peek();
    if (!token) return null;
    if (token.type === 'num') {
      consume();
      const n = parseNumericToken(token.value);
      if (n == null) return null;
      return { a: 0, b: n, variable: null };
    }
    if (token.type === 'var') {
      consume();
      return { a: 1, b: 0, variable: token.value };
    }
    if (token.type === 'lparen') {
      consume();
      const inner = parseExpression();
      if (!inner) return null;
      const close = peek();
      if (!close || close.type !== 'rparen') return null;
      consume();
      return inner;
    }
    return null;
  };

  const parseUnary = (): LinearForm | null => {
    const token = peek();
    if (!token) return null;
    if (token.type === 'op' && token.value === '+') {
      consume();
      return parseUnary();
    }
    if (token.type === 'op' && token.value === '-') {
      consume();
      const next = parseUnary();
      if (!next) return null;
      return { a: -next.a, b: -next.b, variable: next.variable };
    }
    return parsePrimary();
  };

  const parseTerm = (): LinearForm | null => {
    let left = parseUnary();
    if (!left) return null;
    while (true) {
      const token = peek();
      if (!token || token.type !== 'op' || (token.value !== '*' && token.value !== '/')) break;
      consume();
      const right = parseUnary();
      if (!right) return null;
      left = token.value === '*' ? mulForms(left, right) : divForms(left, right);
      if (!left) return null;
    }
    return left;
  };

  const parseExpression = (): LinearForm | null => {
    let left = parseTerm();
    if (!left) return null;
    while (true) {
      const token = peek();
      if (!token || token.type !== 'op' || (token.value !== '+' && token.value !== '-')) break;
      consume();
      const right = parseTerm();
      if (!right) return null;
      left = token.value === '+' ? addForms(left, right) : subForms(left, right);
      if (!left) return null;
    }
    return left;
  };

  const parsed = parseExpression();
  if (!parsed || pos !== tokens.length) return null;
  return {
    coefficient: parsed.a,
    constant: parsed.b,
    variable: parsed.variable ?? 'x',
  };
}

function splitEquation(input: string): [string, string] | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  const parts = normalized.split('=');
  if (parts.length !== 2) return null;
  if (!parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

function detectStrategyTag(
  equationInput: string,
  opts: {
    swapped: boolean;
    scaled: boolean;
    negativeScaled: boolean;
    expectedA?: number;
    appliedScaleFactor?: number;
  }
): EquationStepStrategyTag {
  const normalized = normalizeTerm(equationInput);
  const hasParens = normalized.includes('(') || normalized.includes(')');
  const hasFraction = /[a-zA-Z]\/\d+|\d+\/\d+[a-zA-Z]/.test(normalized);
  const containsInternalAddOrSub = /[a-zA-Z0-9)][+-][a-zA-Z0-9(]/.test(normalized);
  if (opts.negativeScaled) return 'negative_scaled_equivalent';
  if (
    opts.scaled &&
    typeof opts.expectedA === 'number' &&
    Math.abs(opts.expectedA) < 1 &&
    typeof opts.appliedScaleFactor === 'number' &&
    Math.abs(opts.appliedScaleFactor) > 1
  ) {
    return 'clear_denominator_first';
  }
  if (opts.scaled) return 'scaled_equivalent';
  if (opts.swapped) return 'swap_sides';
  if (hasParens) return 'expanded_equivalent';
  if (containsInternalAddOrSub) return 'rearranged_simplify';
  if (hasFraction) return 'fraction_equivalent';
  return 'direct';
}

function isSameLinearTarget(
  leftCoeff: number,
  leftConst: number,
  rightCoeff: number,
  rightConst: number,
  expectedA: number,
  expectedRhs: number
): { matched: boolean; scaled: boolean; negativeScaled: boolean; scaleFactor: number } {
  if (!almostEqual(leftConst, 0) || !almostEqual(rightCoeff, 0)) {
    return { matched: false, scaled: false, negativeScaled: false, scaleFactor: 0 };
  }
  if (almostEqual(expectedA, 0)) {
    return { matched: false, scaled: false, negativeScaled: false, scaleFactor: 0 };
  }
  const kFromCoeff = leftCoeff / expectedA;
  if (!Number.isFinite(kFromCoeff) || almostEqual(kFromCoeff, 0)) {
    return { matched: false, scaled: false, negativeScaled: false, scaleFactor: 0 };
  }
  const expectedScaledRhs = expectedRhs * kFromCoeff;
  if (!almostEqual(rightConst, expectedScaledRhs)) {
    return { matched: false, scaled: false, negativeScaled: false, scaleFactor: 0 };
  }
  const scaled = !almostEqual(kFromCoeff, 1);
  const negativeScaled = scaled && kFromCoeff < 0;
  return { matched: true, scaled, negativeScaled, scaleFactor: kFromCoeff };
}

function getEquationInputIssue(input: string): EquationStepValidationReason | null {
  const normalized = input.replace(/\s+/g, '');
  const eqCount = (normalized.match(/=/g) ?? []).length;
  if (eqCount === 0) return 'missing_equals';
  if (eqCount > 1) return 'multiple_equals';
  const split = splitEquation(normalized);
  if (!split) return 'missing_side';
  return null;
}

export function validateIntermediateStepEquation(
  equationInput: string,
  expectedA: number,
  expectedRhs: number,
  variable = 'x'
): EquationStepValidationResult {
  const inputIssue = getEquationInputIssue(equationInput);
  if (inputIssue) return { ok: false, reason: inputIssue };

  const split = splitEquation(equationInput);
  if (!split) return { ok: false, reason: 'missing_side' };
  const [leftRaw, rightRaw] = split;
  const left = parseLinearExpression(leftRaw);
  const right = parseLinearExpression(rightRaw);
  if (!left || !right) return { ok: false, reason: 'invalid_expression' };
  if (left.variable !== right.variable || left.variable !== variable) {
    return { ok: false, reason: 'unexpected_variable' };
  }

  const forward = isSameLinearTarget(
    left.coefficient,
    left.constant,
    right.coefficient,
    right.constant,
    expectedA,
    expectedRhs
  );
  const swapped = isSameLinearTarget(
    right.coefficient,
    right.constant,
    left.coefficient,
    left.constant,
    expectedA,
    expectedRhs
  );

  if (!forward.matched && !swapped.matched) {
    return { ok: false, reason: 'not_balanced_target' };
  }

  return {
    ok: true,
    reason: null,
    strategyTag: detectStrategyTag(equationInput, {
      swapped: swapped.matched && !forward.matched,
      scaled: forward.scaled || swapped.scaled,
      negativeScaled: forward.negativeScaled || swapped.negativeScaled,
      expectedA,
      appliedScaleFactor: forward.matched ? forward.scaleFactor : swapped.scaleFactor,
    }),
  };
}

export function isValidIntermediateStepEquation(
  equationInput: string,
  expectedA: number,
  expectedRhs: number,
  variable = 'x'
): boolean {
  return validateIntermediateStepEquation(equationInput, expectedA, expectedRhs, variable).ok;
}

export function validateFinalAnswerEquation(
  equationInput: string,
  expectedX: number,
  variable = 'x'
): EquationStepValidationResult {
  const inputIssue = getEquationInputIssue(equationInput);
  if (inputIssue) return { ok: false, reason: inputIssue };

  const split = splitEquation(equationInput);
  if (!split) return { ok: false, reason: 'missing_side' };
  const [leftRaw, rightRaw] = split;
  const left = parseLinearExpression(leftRaw);
  const right = parseLinearExpression(rightRaw);
  if (!left || !right) return { ok: false, reason: 'invalid_expression' };
  if (left.variable !== right.variable || left.variable !== variable) {
    return { ok: false, reason: 'unexpected_variable' };
  }

  const forward =
    almostEqual(left.coefficient, 1) &&
    almostEqual(left.constant, 0) &&
    almostEqual(right.coefficient, 0) &&
    almostEqual(right.constant, expectedX);
  const swapped =
    almostEqual(right.coefficient, 1) &&
    almostEqual(right.constant, 0) &&
    almostEqual(left.coefficient, 0) &&
    almostEqual(left.constant, expectedX);
  if (!forward && !swapped) {
    return { ok: false, reason: 'not_isolated_variable' };
  }
  return {
    ok: true,
    reason: null,
    strategyTag: detectStrategyTag(equationInput, {
      swapped,
      scaled: false,
      negativeScaled: false,
    }),
  };
}

export function isValidFinalAnswerEquation(
  equationInput: string,
  expectedX: number,
  variable = 'x'
): boolean {
  return validateFinalAnswerEquation(equationInput, expectedX, variable).ok;
}

function splitEquationTokens(slots: Array<string | null>): { left: string; right: string } | null {
  const tokens = slots.map((slot) => (slot ?? '').trim()).filter(Boolean);
  const eqPositions = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token === '=')
    .map(({ index }) => index);

  if (eqPositions.length !== 1) return null;
  const eqIndex = eqPositions[0];
  const left = tokens.slice(0, eqIndex).join('');
  const right = tokens.slice(eqIndex + 1).join('');
  if (!left || !right) return null;
  return { left, right };
}

export function isEquivalentLinearResultEquationStep(
  slots: Array<string | null>,
  mission: EquationBuilderMission
): boolean {
  return validateEquivalentLinearResultEquationStep(slots, mission).ok;
}

export function validateEquivalentLinearResultEquationStep(
  slots: Array<string | null>,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const split = splitEquationTokens(slots);
  if (!split) {
    const raw = slots.map((slot) => (slot ?? '').trim()).join('');
    return { ok: false, reason: getEquationInputIssue(raw) ?? 'missing_side' };
  }

  const [coeffRaw, secondElement, , rhsRaw] = mission.equationExpected;
  
  // Check if this is a variable-both-sides mission with full expression
  if (coeffRaw.includes('+') || coeffRaw.includes('-')) {
    // Parse the expected expression
    const variable = secondElement;
    const expected = parseLinearExpression(coeffRaw);
    if (!expected || expected.variable !== variable) {
      return { ok: false, reason: 'invalid_expression' };
    }
    
    const rhsNum = parseNumericToken(rhsRaw);
    if (rhsNum == null) return { ok: false, reason: 'invalid_expression' };
    
    // Parse user input
    const left = parseLinearExpression(split.left);
    const right = parseLinearExpression(split.right);
    if (!left || !right) return { ok: false, reason: 'invalid_expression' };
    
    // Check if it matches
    const leftMatch = almostEqual(left.coefficient, expected.coefficient) &&
                      almostEqual(left.constant, expected.constant) &&
                      almostEqual(right.coefficient, 0) &&
                      almostEqual(right.constant, rhsNum);
    const rightMatch = almostEqual(right.coefficient, expected.coefficient) &&
                       almostEqual(right.constant, expected.constant) &&
                       almostEqual(left.coefficient, 0) &&
                       almostEqual(left.constant, rhsNum);
    
    if (!leftMatch && !rightMatch) {
      return { ok: false, reason: 'not_balanced_target' };
    }
    
    return {
      ok: true,
      reason: null,
      strategyTag: rightMatch ? 'swap_sides' : 'direct',
    };
  }
  
  // Standard linear equation validation
  const coeff = parseNumericToken(coeffRaw);
  const variable = secondElement;
  const rhs = parseNumericToken(rhsRaw);
  if (coeff == null || rhs == null) return { ok: false, reason: 'invalid_expression' };
  return validateIntermediateStepEquation(`${split.left}=${split.right}`, coeff, rhs, variable);
}

export function validateLinearResultEquationInput(
  equationInput: string,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const [coeffRaw, secondElement, , rhsRaw] = mission.equationExpected;
  
  // Check if this is a variable-both-sides mission where the full expression is in coeffRaw
  if (coeffRaw.includes('+') || coeffRaw.includes('-')) {
    // This is a full expression like "2x+6" or "2x-3"
    // Build the expected equation string and parse it
    const variable = secondElement; // The variable letter
    const expectedEquation = `${coeffRaw}=${rhsRaw}`;
    const expected = parseLinearExpression(coeffRaw);
    if (!expected || expected.variable !== variable) {
      return { ok: false, reason: 'invalid_expression' };
    }
    
    // Parse the user's input
    const inputIssue = getEquationInputIssue(equationInput);
    if (inputIssue) return { ok: false, reason: inputIssue };
    
    const split = splitEquation(equationInput);
    if (!split) return { ok: false, reason: 'missing_side' };
    const [leftRaw, rightRaw] = split;
    const left = parseLinearExpression(leftRaw);
    const right = parseLinearExpression(rightRaw);
    if (!left || !right) return { ok: false, reason: 'invalid_expression' };
    
    const rhsNum = parseNumericToken(rhsRaw);
    if (rhsNum == null) return { ok: false, reason: 'invalid_expression' };
    
    // Check if it matches: left side should have coefficient=expected.coefficient, constant=expected.constant
    // Right side should be the rhs value
    const leftMatch = almostEqual(left.coefficient, expected.coefficient) && 
                      almostEqual(left.constant, expected.constant) &&
                      almostEqual(right.coefficient, 0) &&
                      almostEqual(right.constant, rhsNum);
    const rightMatch = almostEqual(right.coefficient, expected.coefficient) &&
                       almostEqual(right.constant, expected.constant) &&
                       almostEqual(left.coefficient, 0) &&
                       almostEqual(left.constant, rhsNum);
    
    if (!leftMatch && !rightMatch) {
      return { ok: false, reason: 'not_balanced_target' };
    }
    
    return {
      ok: true,
      reason: null,
      strategyTag: rightMatch ? 'swap_sides' : 'direct',
    };
  }
  
  // Standard linear equation validation
  const coeff = parseNumericToken(coeffRaw);
  const variable = secondElement;
  const rhs = parseNumericToken(rhsRaw);
  if (coeff == null || rhs == null) return { ok: false, reason: 'invalid_expression' };
  return validateIntermediateStepEquation(equationInput, coeff, rhs, variable);
}

export function isEquivalentLinearAnswerStep(
  slots: Array<string | null>,
  mission: EquationBuilderMission
): boolean {
  return validateEquivalentLinearAnswerStep(slots, mission).ok;
}

export function validateEquivalentLinearAnswerStep(
  slots: Array<string | null>,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const split = splitEquationTokens(slots);
  if (!split) {
    const raw = slots.map((slot) => (slot ?? '').trim()).join('');
    return { ok: false, reason: getEquationInputIssue(raw) ?? 'missing_side' };
  }

  const [variable, , xValueRaw] = mission.answerExpected;
  const xValue = parseNumericToken(xValueRaw);
  if (xValue == null) return { ok: false, reason: 'invalid_expression' };
  return validateFinalAnswerEquation(`${split.left}=${split.right}`, xValue, variable);
}

export function validateLinearAnswerEquationInput(
  equationInput: string,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const [variable, , xValueRaw] = mission.answerExpected;
  const xValue = parseNumericToken(xValueRaw);
  if (xValue == null) return { ok: false, reason: 'invalid_expression' };
  return validateFinalAnswerEquation(equationInput, xValue, variable);
}

// ============================================================================
// VARIABLE ON BOTH SIDES EQUATIONS
// ============================================================================

/**
 * Parse equations with variables on both sides: ax + b = cx + d
 * Examples: 3x + 7 = x + 15, 5x - 2 = 2x + 10, 4x + 3 = x
 */
export function parseTwoSidedLinearEquation(input: string): TwoSidedLinearEquationParsed | null {
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  
  // Match pattern: ax + b = cx + d (handles all sign combinations)
  // Left side: coefficient*variable +/- constant
  // Right side: coefficient*variable +/- constant
  const match = normalized.match(/^([+-]?\d*)([a-zA-Z])([+-]\d+)?=([+-]?\d*)([a-zA-Z])([+-]\d+)?$/);
  
  if (!match) return null;
  
  const [, leftCoeffRaw, leftVar, leftConstRaw = '+0', rightCoeffRaw, rightVar, rightConstRaw = '+0'] = match;
  
  // Variables must match
  if (leftVar !== rightVar) return null;
  
  const leftA = parseCoefficient(leftCoeffRaw);
  const leftB = parseSignedInt(leftConstRaw);
  const rightA = parseCoefficient(rightCoeffRaw);
  const rightB = parseSignedInt(rightConstRaw);
  
  if (leftA == null || leftB == null || rightA == null || rightB == null) return null;
  
  // At least one side must have a variable term
  if (leftA === 0 && rightA === 0) return null;
  
  return {
    variable: leftVar,
    leftA,
    leftB,
    rightA,
    rightB,
  };
}

/**
 * Check if a two-sided equation has an integer solution
 */
export function hasIntegerSolutionTwoSided(parsed: TwoSidedLinearEquationParsed): boolean {
  const coeffDiff = parsed.leftA - parsed.rightA;
  if (Math.abs(coeffDiff) < EPSILON) return false; // No solution or infinite solutions
  
  const constantDiff = parsed.rightB - parsed.leftB;
  const solution = constantDiff / coeffDiff;
  
  return Number.isInteger(solution) && Math.abs(solution) <= 20; // Keep solutions reasonable
}

/**
 * Generate missions for variable-on-both-sides equations
 */
export function generateTwoSidedLinearMissions(
  count: number,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission[] {
  const leftCoeffs = [2, 3, 4, 5, 6];
  const rightCoeffs = [1, 2, 3]; // Right side typically has smaller coefficient
  const constants = [-8, -6, -4, -3, -2, 2, 3, 4, 6, 8, 10, 12];
  
  const missions: EquationBuilderMission[] = [];
  const seen = new Set<string>();
  
  let attempts = 0;
  while (missions.length < count && attempts < 150) {
    attempts += 1;
    
    const leftA = leftCoeffs[Math.floor(Math.random() * leftCoeffs.length)];
    const rightA = rightCoeffs[Math.floor(Math.random() * rightCoeffs.length)];
    
    // Ensure left coefficient > right coefficient for clearer solving
    if (leftA <= rightA) continue;
    
    const leftB = constants[Math.floor(Math.random() * constants.length)];
    const rightB = constants[Math.floor(Math.random() * constants.length)];
    
    const parsed: TwoSidedLinearEquationParsed = {
      variable: 'x',
      leftA,
      leftB,
      rightA,
      rightB,
    };
    
    if (!hasIntegerSolutionTwoSided(parsed)) continue;
    
    const key = `${leftA}|${leftB}|${rightA}|${rightB}`;
    if (seen.has(key)) continue;
    seen.add(key);
    
    missions.push(buildMissionFromTwoSidedLinearEquation(`ts${missions.length + 1}`, parsed, curriculum));
  }
  
  // Add fallback missions if needed
  if (missions.length < count) {
    const fallbacks: TwoSidedLinearEquationParsed[] = [
      { variable: 'x', leftA: 3, leftB: 7, rightA: 1, rightB: 15 },  // 3x + 7 = x + 15 → x = 4
      { variable: 'x', leftA: 5, leftB: -2, rightA: 2, rightB: 10 }, // 5x - 2 = 2x + 10 → x = 4
      { variable: 'x', leftA: 4, leftB: 3, rightA: 1, rightB: 0 },   // 4x + 3 = x → x = -1
      { variable: 'x', leftA: 6, leftB: -5, rightA: 2, rightB: 7 },  // 6x - 5 = 2x + 7 → x = 3
    ];
    
    for (const fallback of fallbacks) {
      if (missions.length >= count) break;
      missions.push(buildMissionFromTwoSidedLinearEquation(`fallback-ts${missions.length + 1}`, fallback, curriculum));
    }
  }
  
  return missions.slice(0, count);
}

/**
 * Build a mission from a parsed two-sided equation
 * This creates a 4-step solving process:
 * Step 1: Subtract variable term from both sides
 * Step 2: Subtract constant from both sides
 * Step 3: Simplify to ax = c form
 * Step 4: Divide to get x = d
 */
export function buildMissionFromTwoSidedLinearEquation(
  id: string,
  parsed: TwoSidedLinearEquationParsed,
  curriculum: EquationCurriculumProfile = 'global-k12'
): EquationBuilderMission {
  const { variable, leftA, leftB, rightA, rightB } = parsed;
  
  // Calculate the solution
  const coeffDiff = leftA - rightA;
  const constantDiff = rightB - leftB;
  const solution = constantDiff / coeffDiff;
  
  // Build display equation: 3x + 7 = x + 15
  const leftTerm = leftA === 1 ? variable : leftA === -1 ? `-${variable}` : `${leftA}${variable}`;
  const leftDisplay = leftB > 0 ? `${leftTerm} + ${Math.abs(leftB)}` : 
                      leftB < 0 ? `${leftTerm} - ${Math.abs(leftB)}` : 
                      leftTerm;
  
  const rightTerm = rightA === 1 ? variable : rightA === -1 ? `-${variable}` : `${rightA}${variable}`;
  const rightDisplay = rightB > 0 ? `${rightTerm} + ${Math.abs(rightB)}` : 
                       rightB < 0 ? `${rightTerm} - ${Math.abs(rightB)}` : 
                       rightTerm;
  
  const equationDisplay = `${leftDisplay} = ${rightDisplay}`;
  
  // Step 1: Subtract the smaller variable term (typically rightA*x)
  const variableToSubtract = Math.min(Math.abs(leftA), Math.abs(rightA));
  const variableSymbol: '+' | '-' = rightA >= 0 ? '-' : '+';
  const variableValue = `${variableToSubtract}${variable}`;
  
  // After step 1: (leftA - rightA)x + leftB = rightB
  const step1CoeffDisplay = coeffDiff === 1 ? variable : coeffDiff === -1 ? `-${variable}` : `${coeffDiff}${variable}`;
  const step1Left = leftB > 0 ? `${step1CoeffDisplay}+${Math.abs(leftB)}` :
                    leftB < 0 ? `${step1CoeffDisplay}-${Math.abs(leftB)}` :
                    step1CoeffDisplay;
  const step1Expected = `${step1Left} = ${rightB}`;
  
  // Build equationExpected array for validation
  // Format: [leftExpression, variable, '=', rhsValue]
  // For "2x+6=10": ["2x+6", "x", "=", "10"]
  const equationExpectedArray: [string, string, string, string] = [step1Left, variable, '=', String(rightB)];
  
  // Step 2 calculation for reference (used in hint)
  const constantSymbol: '+' | '-' = leftB >= 0 ? '-' : '+';
  const constantValue = String(Math.abs(leftB));
  const step2RHS = rightB - leftB;
  
  // Intermediate answer form (after removing constant): coeffDiff*x = step2RHS
  // Example: 2x = 4 (before final division to get x = 2)
  const intermediateDisplay = `${coeffDiff}${variable} = ${step2RHS}`;
  
  // Hint based on curriculum
  const hint = curriculum === 'ib' 
    ? `Collect variable terms on one side, then constants on the other. Apply ${variableSymbol}${variableValue} to both sides first.`
    : `Move all ${variable} terms to the left (${variableSymbol}${variableValue}), then move constants to the right (${constantSymbol}${constantValue}).`;
  
  // Token bank includes all components
  const tokenBank = uniqueValues([
    variable,
    '=',
    '+',
    '-',
    `${leftA}${variable}`,
    `${rightA}${variable}`,
    `${coeffDiff}${variable}`,
    variableValue,
    String(Math.abs(leftB)),
    String(Math.abs(rightB)),
    String(Math.abs(step2RHS)),
    String(Math.abs(solution)),
    leftTerm,
    rightTerm,
    step1CoeffDisplay,
  ]);
  
  return {
    id,
    equation: equationDisplay,
    conceptId: 'algebra.linear.solve',
    operationExpected: { symbol: variableSymbol, value: variableValue },
    equationExpected: equationExpectedArray, // Now correctly expects step1 result (with constant)
    answerExpected: [variable, '=', String(solution)],
    tokenBank,
    hint,
    steps: 4, // Indicates this is a 4-step problem
    intermediateAnswer: { coeff: coeffDiff, rhs: step2RHS, display: intermediateDisplay }, // For flexible Step 3
  };
}

/**
 * Validate if user input matches the intermediate answer form (before final division)
 * Example: For mission that goes 2x+6=10, intermediate is 2x=4, final is x=2
 * This allows flexible Step 3 where students can show intermediate work or skip to final
 */
export function validateIntermediateAnswer(
  equationInput: string,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  if (!mission.intermediateAnswer) {
    return { ok: false, reason: 'invalid_expression' };
  }
  
  const { coeff, rhs } = mission.intermediateAnswer;
  const [variable] = mission.answerExpected;
  
  return validateIntermediateStepEquation(equationInput, coeff, rhs, variable);
}

/**
 * Validates Step 1 operation by checking algebraic equivalence rather than exact operation match.
 * Supports global curricula (UK, US, IB, WAEC, CBSE) which accept multiple valid solution paths.
 * 
 * Example: For 4x + 4 = x - 8, these are ALL valid Step 1 operations:
 * - Subtract x: 3x + 4 = -8
 * - Subtract 4: 4x = x - 12
 * - Add -x: 3x + 4 = -8
 * - Add -4: 4x = x - 12
 * 
 * Validation logic:
 * 1. Parse original equation to extract coefficients
 * 2. Apply user's operation to both sides
 * 3. Check if result is algebraically valid
 * 4. Check if it progresses toward solution (reduces complexity)
 */
export function validateStep1OperationByEquivalence(
  operation: { symbol: string; value: string },
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const { equation } = mission;
  const [variable] = mission.answerExpected;
  
  // Parse original equation
  const split = splitEquation(equation);
  if (!split) return { ok: false, reason: 'missing_side' };
  
  const [leftStr, rightStr] = split;
  const leftExpr = parseLinearExpression(leftStr);
  const rightExpr = parseLinearExpression(rightStr);
  
  if (!leftExpr || !rightExpr) return { ok: false, reason: 'invalid_expression' };
  if (leftExpr.variable !== rightExpr.variable || leftExpr.variable !== variable) {
    return { ok: false, reason: 'unexpected_variable' };
  }
  
  // Parse user's operation
  const { symbol, value } = operation;
  const opValue = parseLinearExpression(value);
  
  // Determine numeric value to add/subtract
  let deltaCoeff = 0;
  let deltaConst = 0;
  
  if (opValue) {
    // Variable term operation (e.g., "-x" or "-2x")
    deltaCoeff = opValue.coefficient;
    deltaConst = opValue.constant;
  } else {
    // Constant operation (e.g., "-4")
    const numValue = parseNumericToken(value);
    if (numValue == null) return { ok: false, reason: 'invalid_expression' };
    deltaConst = numValue;
  }
  
  // Apply operation to both sides
  if (symbol === '-') {
    deltaCoeff = -deltaCoeff;
    deltaConst = -deltaConst;
  } else if (symbol !== '+') {
    return { ok: false, reason: 'invalid_operation' };
  }
  
  const newLeft = {
    coefficient: leftExpr.coefficient + deltaCoeff,
    constant: leftExpr.constant + deltaConst,
    variable: leftExpr.variable
  };
  
  const newRight = {
    coefficient: rightExpr.coefficient + deltaCoeff,
    constant: rightExpr.constant + deltaConst,
    variable: rightExpr.variable
  };
  
  // Check validity: operation should progress toward solution
  // Valid if it reduces variable terms on one side OR reduces constants
  const varTermsReduced = Math.abs(newLeft.coefficient - newRight.coefficient) < 
                         Math.abs(leftExpr.coefficient - rightExpr.coefficient);
  const constantsReduced = (newLeft.coefficient !== 0 && Math.abs(newLeft.constant) < Math.abs(leftExpr.constant)) ||
                          (newRight.coefficient !== 0 && Math.abs(newRight.constant) < Math.abs(rightExpr.constant));
  
  // Also valid if it eliminates a term completely
  const termEliminated = newLeft.coefficient === 0 || newRight.coefficient === 0 ||
                        newLeft.constant === 0 || newRight.constant === 0;
  
  if (!varTermsReduced && !constantsReduced && !termEliminated) {
    return { ok: false, reason: 'operation_not_simplifying' };
  }
  
  // Valid operation!
  return { ok: true, reason: null };
}

// ============================================================================
// INEQUALITY FUNCTIONS
// ============================================================================

/**
 * Parse inequality string into structured format
 * Examples: "3x + 5 > 20" → { variable: 'x', a: 3, b: 5, c: 20, operator: '>' }
 */
export function parseInequality(inequality: string): InequalityParsed | null {
  const normalized = inequality
    .replace(/\s/g, '')
    .replace(/−/g, '-') // Convert Unicode minus to ASCII
    .replace(/×/g, '*') // Convert Unicode multiplication to ASCII
    .replace(/÷/g, '/') // Convert Unicode division to ASCII
    .toLowerCase();
  
  // Find operator position
  const match = normalized.match(/([<>≤≥])/);
  if (!match || !match.index) return null;
  
  const operator = match[0] as InequalityOperator;
  const left = normalized.substring(0, match.index);
  const right = normalized.substring(match.index + match[0].length);
  
  // Parse left side (ax + b)
  const leftExpr = parseLinearExpression(left);
  if (!leftExpr) return null;
  
  // Parse right side (should be constant)
  const c = parseNumericToken(right);
  if (c == null) return null;
  
  return {
    variable: leftExpr.variable || 'x',
    a: leftExpr.coefficient,
    b: leftExpr.constant,
    c,
    operator,
    signFlips: 0, // Will be calculated during solving
  };
}

/**
 * Solve inequality and return solution
 * Handles sign flipping when dividing by negative coefficient
 */
export function solveInequality(parsed: InequalityParsed): InequalitySolution {
  const { a, b, c, operator } = parsed;
  
  // Steps: ax + b [op] c → ax [op] c - b → x [op] (c - b) / a
  const numerator = c - b;
  let solutionValue = numerator / a;
  let solutionOperator = operator;
  
  // CRITICAL: Flip sign when dividing by negative coefficient
  if (a < 0) {
    solutionOperator = flipInequalityOperator(operator);
  }
  
  // Round to 2 decimal places for display
  solutionValue = Math.round(solutionValue * 100) / 100;
  
  const display = `x ${solutionOperator} ${solutionValue}`;
  const rangeDisplay = formatInequalityRange(solutionValue, solutionOperator);
  
  return {
    value: solutionValue,
    operator: solutionOperator,
    display,
    rangeDisplay,
  };
}

/**
 * Flip inequality operator (when multiplying/dividing by negative)
 */
function flipInequalityOperator(operator: InequalityOperator): InequalityOperator {
  const flips: Record<InequalityOperator, InequalityOperator> = {
    '<': '>',
    '>': '<',
    '≤': '≥',
    '≥': '≤',
  };
  return flips[operator];
}

/**
 * Format inequality solution as interval notation
 */
function formatInequalityRange(value: number, operator: InequalityOperator): string {
  switch (operator) {
    case '>': return `(${value}, ∞)`;
    case '≥': return `[${value}, ∞)`;
    case '<': return `(-∞, ${value})`;
    case '≤': return `(-∞, ${value}]`;
  }
}

/**
 * Validate inequality step 1: Check if operation was applied correctly
 */
export function validateInequalityStep1(
  operation: { symbol: string; value: string },
  mission: InequalityBuilderMission
): EquationStepValidationResult {
  const { symbol, value } = operation;
  
  // Parse the inequality from the mission
  const parsed = parseInequality(mission.inequality);
  if (!parsed) {
    return { ok: false, reason: 'invalid_expression' };
  }
  
  // For inequalities, step 1 is same as equations (isolate variable term)
  // Just need to subtract the constant b
  const expectedValue = Math.abs(parsed.b);
  const expectedSymbol = parsed.b >= 0 ? '-' : '+';
  
  if (symbol === expectedSymbol && value === String(expectedValue)) {
    return { ok: true, reason: null };
  }
  
  return { ok: false, reason: 'not_balanced_target' };
}

/**
 * Validate inequality step 2: Check if simplified correctly
 */
export function validateInequalityStep2(
  userInequality: string,
  mission: InequalityBuilderMission
): EquationStepValidationResult {
  const normalized = userInequality.replace(/\s/g, '').toLowerCase();
  
  // Parse the inequality from the mission
  const parsed = parseInequality(mission.inequality);
  if (!parsed) {
    return { ok: false, reason: 'invalid_expression' };
  }
  
  // Expected: ax [operator] (c - b)
  const expectedRight = parsed.c - parsed.b;
  const expectedPattern = `${parsed.a}${parsed.variable}${parsed.operator}${expectedRight}`;
  
  if (normalized === expectedPattern || normalized === `${parsed.a}x${parsed.operator}${expectedRight}`) {
    return { ok: true, reason: null };
  }
  
  return { ok: false, reason: 'invalid_expression' };
}

/**
 * Validate inequality step 3: Check final answer
 * CRITICAL: Must verify operator is flipped if dividing by negative
 */
export function validateInequalityStep3(
  userAnswer: string,
  mission: InequalityBuilderMission
): EquationStepValidationResult {
  const normalized = userAnswer.replace(/\s/g, '').toLowerCase();
  
  // Parse the inequality from the mission
  const parsed = parseInequality(mission.inequality);
  if (!parsed) {
    return { ok: false, reason: 'invalid_expression' };
  }
  
  // Solve to get the correct answer
  const solution = solveInequality(parsed);
  
  const expectedPattern = `${parsed.variable}${solution.operator}${solution.value}`;
  
  // Check if answer matches
  if (normalized === expectedPattern || normalized === `x${solution.operator}${solution.value}`) {
    return { ok: true, reason: null };
  }
  
  // Common mistake: Forgot to flip sign
  const wrongOperator = flipInequalityOperator(solution.operator);
  const wrongPattern = `${parsed.variable}${wrongOperator}${solution.value}`;
  if (normalized === wrongPattern || normalized === `x${wrongOperator}${solution.value}`) {
    return { ok: false, reason: 'sign_not_flipped' };
  }
  
  return { ok: false, reason: 'not_isolated_variable' };
}

/**
 * Build a custom inequality mission from user input
 */
export function buildMissionFromInequality(
  id: string,
  parsed: InequalityParsed,
  inequalityString: string
): InequalityBuilderMission {
  const solution = solveInequality(parsed);
  
  // Expected steps
  const step1Value = Math.abs(parsed.b);
  const step1Symbol = parsed.b >= 0 ? '-' : '+';
  const step2Right = parsed.c - parsed.b;
  
  return {
    id,
    inequality: inequalityString,
    conceptId: 'algebra.inequality.solve',
    operationExpected: { symbol: step1Symbol as '+' | '-', value: String(step1Value) },
    inequalityExpected: [`${parsed.a}x`, parsed.operator, `${step2Right}`, ''],
    answerExpected: solution,
    tokenBank: [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '×', '÷', 'x', '=', '<', '>', '≤', '≥',
    ],
    hint: parsed.a < 0 
      ? `Remember: When you divide by a negative number, the inequality sign flips! ${parsed.operator} becomes ${flipInequalityOperator(parsed.operator)}`
      : `Isolate the variable term first, then divide both sides by the coefficient.`,
    signFlipWarning: parsed.a < 0 
      ? `⚠️ You're about to divide by a negative number. The inequality sign will flip!`
      : undefined,
    skipStep1: parsed.b === 0, // Skip step 1 if no constant term
  };
}

/**
 * Generate inequality practice missions
 */
export function generateInequalityMissions(count: number): InequalityBuilderMission[] {
  const missions: InequalityBuilderMission[] = [];
  const operators: InequalityOperator[] = ['>', '<', '≥', '≤'];
  
  for (let i = 0; i < count; i++) {
    // Generate coefficients ensuring variety
    const a = i % 2 === 0 
      ? Math.floor(Math.random() * 5) + 2  // Positive coefficient (2-6)
      : -(Math.floor(Math.random() * 3) + 2); // Negative coefficient (-2 to -4)
    
    const b = Math.floor(Math.random() * 20) - 10; // -10 to 10
    const c = Math.floor(Math.random() * 30) + 10; // 10 to 40
    const operator = operators[i % operators.length];
    
    // Build inequality string
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const inequality = `${a}x ${bStr} ${operator} ${c}`;
    
    // Parse and solve
    const parsed: InequalityParsed = {
      variable: 'x',
      a,
      b,
      c,
      operator,
      signFlips: a < 0 ? 1 : 0,
    };
    
    const solution = solveInequality(parsed);
    
    // Expected steps
    const step1Value = Math.abs(b);
    const step1Symbol = b >= 0 ? '-' : '+';
    const step2Right = c - b;
    
    missions.push({
      id: `inequality-${i + 1}`,
      inequality,
      conceptId: 'algebra.inequality.solve',
      operationExpected: { symbol: step1Symbol as '+' | '-', value: String(step1Value) },
      inequalityExpected: [`${a}x`, operator, `${step2Right}`, ''],
      answerExpected: solution,
      tokenBank: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '×', '÷', 'x', '=', '<', '>', '≤', '≥',
      ],
      hint: a < 0 
        ? `Remember: When you divide by a negative number, the inequality sign flips! ${operator} becomes ${flipInequalityOperator(operator)}`
        : `Isolate the variable term first, then divide both sides by the coefficient.`,
      signFlipWarning: a < 0 
        ? `⚠️ You're about to divide by a negative number. The inequality sign will flip!`
        : undefined,
    });
  }
  
  return missions;
}

/**
 * Get hint for inequality based on current step
 */
export function getInequalityHint(
  step: 'operation' | 'inequality' | 'answer',
  mission: InequalityBuilderMission,
  parsed: InequalityParsed
): string {
  switch (step) {
    case 'operation':
      return `First, eliminate the constant term (${parsed.b}) by ${parsed.b >= 0 ? 'subtracting' : 'adding'} ${Math.abs(parsed.b)} from both sides.`;
    
    case 'inequality':
      return `After applying the operation, you should have ${parsed.a}x ${parsed.operator} ${parsed.c - parsed.b}. Simplify the inequality.`;
    
    case 'answer':
      if (parsed.a < 0) {
        return `Divide both sides by ${parsed.a}. REMEMBER: When dividing by a negative, flip the inequality sign! ${parsed.operator} becomes ${flipInequalityOperator(parsed.operator)}.`;
      }
      return `Divide both sides by ${parsed.a} to isolate x.`;
    
    default:
      return mission.hint;
  }
}
