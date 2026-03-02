import {
  buildMissionFromFractionLinearEquation,
  buildMissionFromLinearEquation,
  getCurriculumRouteFeedback,
  parseFlexibleLinearEquation,
  isEquivalentLinearAnswerStep,
  isEquivalentLinearResultEquationStep,
  validateEquivalentLinearAnswerStep,
  validateEquivalentLinearResultEquationStep,
  validateFinalAnswerEquation,
  validateIntermediateStepEquation,
} from './equation-engine';

describe('equation-engine symbolic equivalence (linear)', () => {
  const linearMission = buildMissionFromLinearEquation('m1', {
    variable: 'x',
    a: 2,
    b: 8,
    c: 36,
  });

  test('accepts equivalent Step 2 linear forms', () => {
    expect(isEquivalentLinearResultEquationStep(['2x', '=', '28'], linearMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['28', '=', '2x'], linearMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['x+x', '=', '28'], linearMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['4x/2', '=', '28'], linearMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['4x', '=', '56'], linearMission)).toBe(true);
  });

  test('accepts equivalent Step 3 linear forms', () => {
    expect(isEquivalentLinearAnswerStep(['x', '=', '14'], linearMission)).toBe(true);
    expect(isEquivalentLinearAnswerStep(['14', '=', 'x'], linearMission)).toBe(true);
    expect(isEquivalentLinearAnswerStep(['x+0', '=', '14'], linearMission)).toBe(true);
    expect(isEquivalentLinearAnswerStep(['2x/2', '=', '14'], linearMission)).toBe(true);
  });

  test('rejects non-linear and invalid forms', () => {
    expect(isEquivalentLinearResultEquationStep(['x*x', '=', '28'], linearMission)).toBe(false);
    expect(validateEquivalentLinearResultEquationStep(['x*x', '=', '28'], linearMission).reason).toBe(
      'invalid_expression'
    );
    expect(validateEquivalentLinearAnswerStep(['x/x', '=', '14'], linearMission).ok).toBe(false);
  });

  test('labels route strategy for scaled-equivalent and swapped forms', () => {
    const scaled = validateEquivalentLinearResultEquationStep(['4x', '=', '56'], linearMission);
    expect(scaled.ok).toBe(true);
    expect(scaled.strategyTag).toBe('scaled_equivalent');

    const swapped = validateEquivalentLinearResultEquationStep(['28', '=', '2x'], linearMission);
    expect(swapped.ok).toBe(true);
    expect(swapped.strategyTag).toBe('swap_sides');
  });

  test('labels negative-scaling and rearranged-simplify strategies', () => {
    const negativeScaled = validateEquivalentLinearResultEquationStep(['-2x', '=', '-28'], linearMission);
    expect(negativeScaled.ok).toBe(true);
    expect(negativeScaled.strategyTag).toBe('negative_scaled_equivalent');

    const rearranged = validateEquivalentLinearResultEquationStep(['2x+6-6', '=', '28'], linearMission);
    expect(rearranged.ok).toBe(true);
    expect(rearranged.strategyTag).toBe('rearranged_simplify');
  });
});

describe('equation-engine symbolic equivalence (fraction linear)', () => {
  const fractionMission = buildMissionFromFractionLinearEquation('f1', {
    variable: 'x',
    numerator: 1,
    denominator: 3,
    b: 2,
    c: 6,
  });

  test('accepts equivalent Step 2 fraction forms', () => {
    expect(isEquivalentLinearResultEquationStep(['x/3', '=', '4'], fractionMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['4', '=', 'x/3'], fractionMission)).toBe(true);
    expect(isEquivalentLinearResultEquationStep(['(2x)/6', '=', '4'], fractionMission)).toBe(true);
  });

  test('labels clear-denominator-first strategy', () => {
    const cleared = validateEquivalentLinearResultEquationStep(['x', '=', '12'], fractionMission);
    expect(cleared.ok).toBe(true);
    expect(cleared.strategyTag).toBe('clear_denominator_first');
  });

  test('accepts equivalent Step 3 fraction forms', () => {
    expect(isEquivalentLinearAnswerStep(['x', '=', '12'], fractionMission)).toBe(true);
    expect(isEquivalentLinearAnswerStep(['12', '=', 'x'], fractionMission)).toBe(true);
  });
});

describe('equation-engine direct validator coverage', () => {
  test('parses parenthesized rearrangements in intermediate step', () => {
    const result = validateIntermediateStepEquation('2(x+3)-6=10-6', 2, 4, 'x');
    expect(result.ok).toBe(true);
  });

  test('validates isolated variable in final answer', () => {
    expect(validateFinalAnswerEquation('(2x)/2=14', 14, 'x').ok).toBe(true);
    expect(validateFinalAnswerEquation('2x=14', 14, 'x').reason).toBe('not_isolated_variable');
  });
});

describe('equation-engine curriculum route preferences', () => {
  test('returns preferred feedback without forced correction', () => {
    const preferred = getCurriculumRouteFeedback('waec', 'step2', 'clear_denominator_first');
    expect(preferred.encouragement).toContain('Great route');
    expect(preferred.preferenceTip).toBeNull();

    const nonPreferred = getCurriculumRouteFeedback('waec', 'step2', 'expanded_equivalent');
    expect(nonPreferred.encouragement).toContain('Valid route');
    expect(nonPreferred.preferenceTip).toContain('preferred style');
  });
});

describe('equation-engine flexible parser', () => {
  test('parses bracket expansion form into linear equivalent', () => {
    const parsed = parseFlexibleLinearEquation('2(x+3)=10');
    expect(parsed).not.toBeNull();
    expect(parsed?.a).toBe(2);
    expect(parsed?.b).toBe(6);
    expect(parsed?.c).toBe(10);
  });

  test('parses mixed rearranged linear form', () => {
    const parsed = parseFlexibleLinearEquation('3(x-2)+4=19');
    expect(parsed).not.toBeNull();
    expect(parsed?.a).toBe(3);
    expect(parsed?.b).toBe(-2);
    expect(parsed?.c).toBe(19);
  });
});
