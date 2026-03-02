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

export type EquationBuilderMission = {
  id: string;
  equation: string;
  conceptId: 'algebra.linear.solve';
  operationExpected: { symbol: '+' | '-'; value: string };
  equationExpected: [string, string, string, string];
  answerExpected: [string, string, string];
  tokenBank: string[];
  hint: string;
};

export type EquationStepValidationReason =
  | 'missing_equals'
  | 'multiple_equals'
  | 'missing_side'
  | 'invalid_expression'
  | 'unexpected_variable'
  | 'not_balanced_target'
  | 'not_isolated_variable';

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
  return term.replace(/\s+/g, '').replace(/\*/g, '');
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
  const normalized = input.replace(/\s+/g, '');
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
  const normalized = input.replace(/\s+/g, '');
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
  const normalized = input.replace(/\s+/g, '');
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
  const normalized = input.replace(/\s+/g, '');
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

  const [coeffRaw, variable, , rhsRaw] = mission.equationExpected;
  const coeff = parseNumericToken(coeffRaw);
  const rhs = parseNumericToken(rhsRaw);
  if (coeff == null || rhs == null) return { ok: false, reason: 'invalid_expression' };
  return validateIntermediateStepEquation(`${split.left}=${split.right}`, coeff, rhs, variable);
}

export function validateLinearResultEquationInput(
  equationInput: string,
  mission: EquationBuilderMission
): EquationStepValidationResult {
  const [coeffRaw, variable, , rhsRaw] = mission.equationExpected;
  const coeff = parseNumericToken(coeffRaw);
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
