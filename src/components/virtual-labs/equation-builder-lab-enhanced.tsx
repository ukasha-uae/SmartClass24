'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { useFirebase } from '@/firebase/provider';
import { useEducationLevels } from '@/hooks/useEducationLevels';
import { useLabSoundProfile } from '@/hooks/use-lab-sound-profile';
import { trackMathLabMetric } from '@/lib/math-lab/metrics';
import { getMathBandLabel } from '@/lib/math-lab/taxonomy';
import {
  areEquationNumericTokensEquivalent,
  buildBracketLinearScaffold,
  buildMissionFromFractionLinearEquation,
  buildMissionFromLinearEquation,
  generateFractionLinearMissions,
  generateLinearMissions,
  getCurriculumRouteFeedback,
  hasIntegerSolutionForFraction,
  hasIntegerSolution,
  parseBracketLinearEquation,
  parseFractionLinearEquation,
  parseFlexibleLinearEquation,
  parseEquationNumericToken,
  isEquivalentLinearAnswerStep,
  isEquivalentLinearResultEquationStep,
  parseLinearEquation,
  validateLinearAnswerEquationInput,
  validateLinearResultEquationInput,
  validateEquivalentLinearAnswerStep,
  validateEquivalentLinearResultEquationStep,
  type EquationStepValidationReason,
  type EquationCurriculumProfile,
  type EquationStepStrategyTag,
  type EquationBuilderMission,
} from '@/lib/math-lab/equation-engine';
import { normalizeMathText } from '@/lib/text/normalize-math-text';

type StepKey = 'operation' | 'equation' | 'answer';
type PracticeMode = 'linear' | 'fraction';
const EQUATION_SLOT_COUNT = 6;
const ANSWER_SLOT_COUNT = 4;
const createEquationSlots = () => Array<string | null>(EQUATION_SLOT_COUNT).fill(null);
const createAnswerSlots = () => Array<string | null>(ANSWER_SLOT_COUNT).fill(null);
const EQUATION_BUILDER_LAST_MODE_KEY = 'equation_builder_last_mode_v1';
const EQUATION_BUILDER_FIRST_VISIT_KEY = 'equation_builder_first_visit_done_v1';
const EQUATION_BUILDER_MODE_STATS_KEY = 'equation_builder_mode_stats_v1';

type ModeStats = { attempts: number; avgScore: number; avgHints: number };
type ModeStatsRecord = Record<PracticeMode, ModeStats>;

const DEFAULT_MODE_STATS: ModeStatsRecord = {
  linear: { attempts: 0, avgScore: 0, avgHints: 0 },
  fraction: { attempts: 0, avgScore: 0, avgHints: 0 },
};

type Checkpoint = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

type WorkingHistory = {
  step0a: string | null;
  step0b: string | null;
  step1: string | null;
  step2: string | null;
  step3: string | null;
};

const MISCONCEPTION_TAGS: Record<StepKey, string> = {
  operation: 'algebra.inverse-operation',
  equation: 'algebra.balance-after-operation',
  answer: 'algebra.final-isolation',
};

const INTERVENTION_MESSAGES: Record<StepKey, string> = {
  operation:
    'Intervention: choose the inverse of the constant term first. If the equation has +b, use -b. If it has -b, use +b.',
  equation:
    'Intervention: after applying the operation to both sides, rebuild the equation carefully. Keep the variable term balanced.',
  answer:
    'Intervention: isolate x using the inverse of its coefficient. For example, if x/3 = 4, multiply both sides by 3.',
};

const checkpoints: Checkpoint[] = [
  {
    id: 'cp1',
    prompt: 'To solve 5x + 9 = 29, what is the first inverse operation?',
    options: ['Subtract 9', 'Add 9', 'Divide by 5', 'Multiply by 5'],
    correctIndex: 0,
    hint: 'Always undo addition/subtraction before coefficient division.',
  },
  {
    id: 'cp2',
    prompt: 'After subtracting 4 from both sides in 2x + 4 = 18, what is next?',
    options: ['2x = 22', '2x = 14', 'x = 14', 'x = 7'],
    correctIndex: 1,
    hint: '18 - 4 = 14, so the equation becomes 2x = 14.',
  },
  {
    id: 'cp3',
    prompt: 'If 3x = -12, then x = ?',
    options: ['-4', '4', '-9', '9'],
    correctIndex: 0,
    hint: 'Divide both sides by +3. Negative divided by positive is negative.',
  },
];

export function EquationBuilderLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const { playLabSound } = useLabSoundProfile('maths-equation-builder');
  const curriculumProfile: EquationCurriculumProfile = 'global-k12';
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('linear');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [lastMode, setLastMode] = useState<PracticeMode>('linear');
  const [modeStats, setModeStats] = useState<ModeStatsRecord>(DEFAULT_MODE_STATS);
  const buildPracticeMissions = (mode: PracticeMode) =>
    mode === 'linear' ? generateLinearMissions(4) : generateFractionLinearMissions(4);
  const [missions, setMissions] = useState<EquationBuilderMission[]>(() => buildPracticeMissions('linear'));

  const [stage, setStage] = useState<'build' | 'checkpoint' | 'result'>('build');
  const [missionIndex, setMissionIndex] = useState(0);
  const [step, setStep] = useState<StepKey>('operation');
  const [customFlow, setCustomFlow] = useState({ active: false, awaitingChoice: false });
  const [customEquationInput, setCustomEquationInput] = useState('4x + 8 = 36');
  const [customEquationError, setCustomEquationError] = useState<string | null>(null);
  const [bracketFlow, setBracketFlow] = useState<{
    active: boolean;
    phase: 'expand' | 'simplify' | 'done';
    expandedExpected: string;
    simplifiedExpected: string;
    expandedInput: string;
    simplifiedInput: string;
  }>({
    active: false,
    phase: 'done',
    expandedExpected: '',
    simplifiedExpected: '',
    expandedInput: '',
    simplifiedInput: '',
  });
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [stepSuccessMessage, setStepSuccessMessage] = useState<string | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [lastWrongCoachKey, setLastWrongCoachKey] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [teacherKey, setTeacherKey] = useState(0);
  const [interventionMessage, setInterventionMessage] = useState<string | null>(null);
  const [mistakeCounts, setMistakeCounts] = useState<Record<StepKey, number>>({
    operation: 0,
    equation: 0,
    answer: 0,
  });
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [checkpointAnswers, setCheckpointAnswers] = useState<number[]>([]);
  const [operationSlots, setOperationSlots] = useState<{ symbol: string | null; value: string | null }>({
    symbol: null,
    value: null,
  });
  const [equationSlots, setEquationSlots] = useState<Array<string | null>>(createEquationSlots);
  const [answerSlots, setAnswerSlots] = useState<Array<string | null>>(createAnswerSlots);
  const [equationDirectInput, setEquationDirectInput] = useState('');
  const [answerDirectInput, setAnswerDirectInput] = useState('');
  const [workingHistory, setWorkingHistory] = useState<WorkingHistory>({
    step0a: null,
    step0b: null,
    step1: null,
    step2: null,
    step3: null,
  });
  const operationSymbolRef = useRef<HTMLInputElement | null>(null);
  const operationValueRef = useRef<HTMLInputElement | null>(null);
  const bracketFlowRef = useRef<HTMLInputElement | null>(null);
  const equationDirectRef = useRef<HTMLInputElement | null>(null);
  const answerDirectRef = useRef<HTMLInputElement | null>(null);
  const equationInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const answerInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const mission = missions[missionIndex];
  const checkpoint = checkpoints[checkpointIndex];
  const isStep2Locked = step === 'operation';
  const isStep3Locked = step !== 'answer';
  const hasWorkingHistory = Object.values(workingHistory).some((value) => Boolean(value));
  const middleSchoolLabel = getMathBandLabel('middle_school', labels);
  const solvedMissions = missionIndex + (stage === 'build' && step === 'operation' ? 0 : 1) + (stage !== 'build' ? 1 : 0);
  const isCustomMissionActive = customFlow.active && missionIndex === 0;
  const checkpointScore = useMemo(
    () =>
      checkpointAnswers.reduce((acc, answer, index) => {
        if (answer === checkpoints[index].correctIndex) return acc + 1;
        return acc;
      }, 0),
    [checkpointAnswers]
  );
  const recommendedMode: PracticeMode = useMemo(() => {
    if (isFirstVisit) return 'linear';
    const linear = modeStats.linear;
    const fraction = modeStats.fraction;

    if (fraction.attempts > 0 && (fraction.avgScore < 60 || fraction.avgHints > 3)) {
      return 'linear';
    }
    if (linear.attempts > 0 && linear.avgScore >= 80 && linear.avgHints <= 2 && fraction.attempts === 0) {
      return 'fraction';
    }
    return lastMode;
  }, [isFirstVisit, modeStats, lastMode]);
  const recommendedLabel = recommendedMode === 'linear' ? 'Linear' : 'Fraction Linear';
  const recommendedReason = useMemo(() => {
    if (isFirstVisit) return 'Good starting point for confidence.';
    if (recommendedMode === 'fraction' && modeStats.fraction.attempts === 0) {
      return 'You are doing well in Linear. Ready to try Fraction Linear?';
    }
    if (recommendedMode === 'linear' && modeStats.fraction.attempts > 0) {
      return 'A quick Linear round can rebuild confidence before Fraction Linear.';
    }
    return 'Based on your recent practice.';
  }, [isFirstVisit, recommendedMode, modeStats]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const firstVisitDone = window.localStorage.getItem(EQUATION_BUILDER_FIRST_VISIT_KEY) === 'true';
      const storedMode = window.localStorage.getItem(EQUATION_BUILDER_LAST_MODE_KEY);
      const rawStats = window.localStorage.getItem(EQUATION_BUILDER_MODE_STATS_KEY);
      const parsedStats = rawStats ? (JSON.parse(rawStats) as Partial<ModeStatsRecord>) : null;
      const resolvedMode: PracticeMode = storedMode === 'fraction' ? 'fraction' : 'linear';
      setIsFirstVisit(!firstVisitDone);
      setLastMode(resolvedMode);
      setModeStats({
        linear: {
          attempts: parsedStats?.linear?.attempts ?? 0,
          avgScore: parsedStats?.linear?.avgScore ?? 0,
          avgHints: parsedStats?.linear?.avgHints ?? 0,
        },
        fraction: {
          attempts: parsedStats?.fraction?.attempts ?? 0,
          avgScore: parsedStats?.fraction?.avgScore ?? 0,
          avgHints: parsedStats?.fraction?.avgHints ?? 0,
        },
      });
      setPracticeMode(resolvedMode);
      setMissions(buildPracticeMissions(resolvedMode));
    } catch {
      // Ignore storage access issues to keep lab usable.
    }
  }, []);

  useEffect(() => {
    trackMathLabMetric({
      type: 'station_started',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: 'algebra.linear.solve',
    });
  }, [user?.uid]);

  useEffect(() => {
    if (stage !== 'build') return;
    if (bracketFlow.active && bracketFlow.phase !== 'done') {
      const bracketInput = bracketFlow.phase === 'expand' ? bracketFlow.expandedInput.trim() : bracketFlow.simplifiedInput.trim();
      if (bracketInput) {
        setStepSuccessMessage(
          bracketFlow.phase === 'expand'
            ? 'Step 0A input detected. System will auto-advance when correct.'
            : 'Step 0B input detected. System will auto-advance when correct.'
        );
      } else {
        setStepSuccessMessage(null);
      }
      return;
    }
    if (step === 'operation') {
      if (operationSlots.symbol && operationSlots.value) {
        setStepSuccessMessage('Step 1 ready. System will auto-advance when correct.');
      } else {
        setStepSuccessMessage(null);
      }
      return;
    }
    if (step === 'equation') {
      if (equationDirectInput.trim()) {
        setStepSuccessMessage('Step 2 full equation detected. System will auto-advance when correct.');
        return;
      }
      const filled = equationSlots.filter(Boolean).length;
      const hasEquals = equationSlots.some((slot) => (slot ?? '').trim() === '=');
      if (filled >= 3 && hasEquals) {
        setStepSuccessMessage('Step 2 ready. System will auto-advance when correct.');
      } else {
        setStepSuccessMessage(null);
      }
      return;
    }
    if (answerDirectInput.trim()) {
      setStepSuccessMessage('Step 3 full answer detected. System will auto-complete when correct.');
      return;
    }
    const filled = answerSlots.filter(Boolean).length;
    const hasEquals = answerSlots.some((slot) => (slot ?? '').trim() === '=');
    if (filled >= 2 && hasEquals) {
      setStepSuccessMessage('Step 3 ready. System will auto-complete this mission when correct.');
    } else {
      setStepSuccessMessage(null);
    }
  }, [stage, step, operationSlots, equationSlots, answerSlots, equationDirectInput, answerDirectInput, bracketFlow]);

  useEffect(() => {
    if (stage !== 'build') return;
    const timer = setTimeout(() => {
      if (bracketFlow.active && bracketFlow.phase !== 'done') {
        bracketFlowRef.current?.focus();
        return;
      }
      if (step === 'operation') operationSymbolRef.current?.focus();
      if (step === 'equation') equationDirectRef.current?.focus();
      if (step === 'answer') answerDirectRef.current?.focus();
    }, 20);
    return () => clearTimeout(timer);
  }, [stage, step, missionIndex, bracketFlow.active, bracketFlow.phase]);

  useEffect(() => {
    if (stage !== 'build' || customFlow.awaitingChoice || isAutoAdvancing) return;
    const bracketActive = bracketFlow.active && bracketFlow.phase !== 'done';
    if (bracketActive) {
      const bracketOk =
        bracketFlow.phase === 'expand'
          ? normalizeEquationInput(bracketFlow.expandedInput) === normalizeEquationInput(bracketFlow.expandedExpected)
          : normalizeEquationInput(bracketFlow.simplifiedInput) ===
            normalizeEquationInput(bracketFlow.simplifiedExpected);
      if (!bracketOk) return;
    } else if (!isCurrentStepCorrect()) {
      return;
    }

    setIsAutoAdvancing(true);
    setStepFeedback(null);
    setStepSuccessMessage('Correct detected. Advancing automatically...');

    const timer = setTimeout(() => {
      checkStep();
      setIsAutoAdvancing(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [
    stage,
    step,
    operationSlots,
    equationSlots,
    answerSlots,
    equationDirectInput,
    answerDirectInput,
    customFlow.awaitingChoice,
    bracketFlow.active,
    bracketFlow.phase,
    bracketFlow.expandedInput,
    bracketFlow.simplifiedInput,
    bracketFlow.expandedExpected,
    bracketFlow.simplifiedExpected,
  ]);

  useEffect(() => {
    if (stage !== 'build' || customFlow.awaitingChoice || isAutoAdvancing || (bracketFlow.active && bracketFlow.phase !== 'done')) return;

    const stepSlots =
      step === 'operation'
        ? [operationSlots.symbol, operationSlots.value]
        : step === 'equation'
        ? equationDirectInput.trim()
          ? [equationDirectInput]
          : equationSlots
        : answerDirectInput.trim()
        ? [answerDirectInput]
        : answerSlots;
    const isFilled =
      step === 'operation'
        ? Boolean(operationSlots.symbol && operationSlots.value)
        : step === 'equation'
        ? equationDirectInput.trim()
          ? equationDirectInput.includes('=')
          : equationSlots.filter(Boolean).length >= 3 && equationSlots.some((slot) => (slot ?? '').trim() === '=')
        : answerDirectInput.trim()
        ? answerDirectInput.includes('=')
        : answerSlots.filter(Boolean).length >= 2 && answerSlots.some((slot) => (slot ?? '').trim() === '=');
    if (!isFilled || isCurrentStepCorrect()) return;

    const wrongKey = `${step}:${stepSlots.map((slot) => slot ?? '').join('|')}`;
    if (wrongKey === lastWrongCoachKey) return;

    setLastWrongCoachKey(wrongKey);
    setStepSuccessMessage(null);
    setStepFeedback(getValidationFeedback(step));
    setInterventionMessage(
      step === 'operation'
        ? 'Try inverse thinking: if the equation has +b, use -b; if it has -b, use +b.'
        : step === 'equation'
        ? 'For Step 2, apply the same operation to both sides, then rebuild the new balanced equation.'
        : 'For Step 3, divide both sides by the coefficient of x to isolate x.'
    );
    setTeacherKey((k) => k + 1);
  }, [
    stage,
    step,
    operationSlots,
    equationSlots,
    answerSlots,
    equationDirectInput,
    answerDirectInput,
    customFlow.awaitingChoice,
    bracketFlow.active,
    bracketFlow.phase,
    isAutoAdvancing,
    lastWrongCoachKey,
  ]);

  const teacherMessage =
    stage === 'build'
      ? interventionMessage
        ? interventionMessage
        : bracketFlow.active && bracketFlow.phase === 'expand'
        ? `First, remove the bracket correctly. Type the expanded equation without solving further.`
        : bracketFlow.active && bracketFlow.phase === 'simplify'
        ? `Great expansion. Now combine like constants to form the simplified linear equation.`
        : customFlow.awaitingChoice
        ? 'Excellent work solving your custom equation. Next, you can continue with generated practice missions, jump to checkpoints, or load another custom equation.'
        : !customFlow.active && missionIndex === 0 && step === 'operation'
        ? `Welcome to Equation Builder Lab. You have two paths: (1) load your own custom equation, or (2) start guided practice with ${mission.equation}. Choose any path, then I will coach you step-by-step.`
        : step === 'operation'
        ? `${
            customFlow.active && missionIndex === 0
              ? 'Custom equation'
              : `Practice mission number ${missionIndex + 1}`
          }. Equation is ${mission.equation}. Enter the inverse operation to apply on both sides.`
        : step === 'equation'
        ? `Great. Now enter the resulting equation after that operation.`
        : `Final step: enter the solved value of x.`
      : stage === 'checkpoint'
      ? `Checkpoint ${checkpointIndex + 1}: ${normalizeMathText(checkpoint.prompt)}`
      : `Excellent work. You solved ${missions.length} equation missions and scored ${checkpointScore}/${checkpoints.length} in checkpoints.`;

  const cleanToken = (token: string) => token.trim();
  const normalizeEquationInput = (value: string) => value.replace(/\s+/g, '').toLowerCase();
  const serializeSlots = (slots: Array<string | null>) => slots.map((s) => s ?? '').join('');
  const getReasonMessage = (
    reason: EquationStepValidationReason | null,
    stepKey: 'equation' | 'answer'
  ): string => {
    if (!reason) {
      return stepKey === 'equation'
        ? 'Step 2 is close, but not correct yet. Recheck both sides after your operation.'
        : 'Step 3 is not correct yet. Isolate x and check the sign/value.';
    }
    if (reason === 'missing_equals') return `Step ${stepKey === 'equation' ? '2' : '3'}: include one "=" sign.`;
    if (reason === 'multiple_equals') return `Step ${stepKey === 'equation' ? '2' : '3'}: use only one "=" sign.`;
    if (reason === 'missing_side') return `Step ${stepKey === 'equation' ? '2' : '3'}: both left and right sides must have values.`;
    if (reason === 'invalid_expression')
      return `Step ${stepKey === 'equation' ? '2' : '3'}: use valid terms like 2x, x, -4, and symbols only.`;
    if (reason === 'unexpected_variable')
      return `Use the same variable as the mission (usually x).`;
    if (reason === 'not_balanced_target')
      return 'Step 2 target is a balanced form like ax = n (or n = ax) after your inverse operation.';
    if (reason === 'not_isolated_variable')
      return 'Step 3 target is x = value (or value = x). x must be isolated.';
    return stepKey === 'equation'
      ? 'Step 2 is close, but not correct yet. Recheck both sides after your operation.'
      : 'Step 3 is not correct yet. Isolate x and check the sign/value.';
  };

  const getValidationFeedback = (stepKey: StepKey): string => {
    if (stepKey === 'operation') {
      if (!['+', '-'].includes(cleanToken(operationSlots.symbol ?? ''))) {
        return 'Step 1: left slot must be + or -.';
      }
      if (parseEquationNumericToken(cleanToken(operationSlots.value ?? '')) == null) {
        return 'Step 1: right slot must be a valid number (whole, decimal, or fraction).';
      }
      return 'Step 1 is not correct yet. Use the inverse of the constant term.';
    }

    if (stepKey === 'equation') {
      const validation = equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission)
        : validateEquivalentLinearResultEquationStep(equationSlots, mission);
      return getReasonMessage(validation.reason, 'equation');
    }

    const validation = answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission)
      : validateEquivalentLinearAnswerStep(answerSlots, mission);
    return getReasonMessage(validation.reason, 'answer');
  };

  const getRouteMessage = (strategyTag: EquationStepStrategyTag | undefined, stepTag: 'step2' | 'step3'): string => {
    const { encouragement, preferenceTip } = getCurriculumRouteFeedback(curriculumProfile, stepTag, strategyTag);
    const strategySpecific =
      strategyTag === 'swap_sides'
        ? 'Swapping sides is valid algebra.'
        : strategyTag === 'scaled_equivalent'
        ? 'Your scaled equation is equivalent and correct.'
        : strategyTag === 'negative_scaled_equivalent'
        ? 'Multiplying both sides by a negative value is valid when done on both sides.'
        : strategyTag === 'clear_denominator_first'
        ? 'Clearing the denominator first is a strong strategy.'
        : strategyTag === 'rearranged_simplify'
        ? 'Rearranging and simplifying before isolating x is valid.'
        : strategyTag === 'expanded_equivalent'
        ? 'Your expanded/rearranged form is equivalent.'
        : strategyTag === 'fraction_equivalent'
        ? 'Your fraction form is equivalent.'
        : 'Correct route.';

    return preferenceTip ? `${encouragement} ${strategySpecific} ${preferenceTip}` : `${encouragement} ${strategySpecific}`;
  };

  const isCurrentStepCorrect = () => {
    if (step === 'operation') {
      return (
        cleanToken(operationSlots.symbol ?? '') === mission.operationExpected.symbol &&
        areEquationNumericTokensEquivalent(cleanToken(operationSlots.value ?? ''), mission.operationExpected.value)
      );
    }
    if (step === 'equation') {
      return equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission).ok
        : isEquivalentLinearResultEquationStep(equationSlots, mission);
    }
    return answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission).ok
      : isEquivalentLinearAnswerStep(answerSlots, mission);
  };

  const setTypedToken = (raw: string) => cleanToken(raw);

  const updateTypedSlot = (
    target: 'operation-symbol' | 'operation-value' | 'equation' | 'answer',
    value: string,
    index?: number
  ) => {
    const token = setTypedToken(value);
    setStepFeedback(null);
    setStepSuccessMessage(null);
    if (target === 'operation-symbol') {
      if (token && !['+', '-'].includes(token)) {
        setStepFeedback('Step 1 left slot accepts only + or -.');
      }
      setOperationSlots((prev) => ({ ...prev, symbol: token || null }));
      if (token) operationValueRef.current?.focus();
      return;
    }
    if (target === 'operation-value') {
      if (token && parseEquationNumericToken(token) == null) {
        setStepFeedback('Step 1 right slot accepts numbers (for example 3, 0.5, or 1/2).');
      }
      setOperationSlots((prev) => ({ ...prev, value: token || null }));
      return;
    }
    if (target === 'equation' && index !== undefined) {
      setEquationDirectInput('');
      setEquationSlots((prev) => prev.map((slot, i) => (i === index ? (token || null) : slot)));
      if (token && index < equationInputRefs.current.length - 1) {
        equationInputRefs.current[index + 1]?.focus();
      }
      return;
    }
    if (target === 'answer' && index !== undefined) {
      setAnswerDirectInput('');
      setAnswerSlots((prev) => prev.map((slot, i) => (i === index ? (token || null) : slot)));
      if (token && index < answerInputRefs.current.length - 1) {
        answerInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const resetStep = () => {
    if (bracketFlow.active && bracketFlow.phase !== 'done') {
      setBracketFlow((prev) =>
        prev.phase === 'expand' ? { ...prev, expandedInput: '' } : { ...prev, simplifiedInput: '' }
      );
      setStepFeedback(null);
      setStepSuccessMessage(null);
      return;
    }
    if (step === 'operation') setOperationSlots({ symbol: null, value: null });
    if (step === 'equation') {
      setEquationSlots(createEquationSlots());
      setEquationDirectInput('');
    }
    if (step === 'answer') {
      setAnswerSlots(createAnswerSlots());
      setAnswerDirectInput('');
    }
    setStepFeedback(null);
    setStepSuccessMessage(null);
  };

  const handleWrongStep = (stepKey: StepKey) => {
    const nextCount = mistakeCounts[stepKey] + 1;
    setMistakeCounts((prev) => ({ ...prev, [stepKey]: nextCount }));
    setShowHint(true);
    const baseNudge =
      stepKey === 'operation'
        ? 'Not yet. In Step 1, choose the inverse operation for the constant term.'
        : stepKey === 'equation'
        ? 'Not yet. Rebuild Step 2 carefully after applying the operation to both sides.'
        : 'Not yet. In Step 3, isolate x using the equation you already built.';
    setInterventionMessage(nextCount >= 2 ? INTERVENTION_MESSAGES[stepKey] : baseNudge);
    setTeacherKey((k) => k + 1);
    trackMathLabMetric({
      type: 'misconception_detected',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission.conceptId,
      misconceptionTag: MISCONCEPTION_TAGS[stepKey],
    });
    if (nextCount < 2) return;
    trackMathLabMetric({
      type: 'intervention_triggered',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission.conceptId,
      misconceptionTag: MISCONCEPTION_TAGS[stepKey],
    });
  };

  const clearInterventionForStep = (stepKey: StepKey) => {
    setMistakeCounts((prev) => ({ ...prev, [stepKey]: 0 }));
    setInterventionMessage(null);
    setLastWrongCoachKey(null);
  };

  const checkStep = () => {
    if (bracketFlow.active && bracketFlow.phase !== 'done') {
      if (bracketFlow.phase === 'expand') {
        const ok =
          normalizeEquationInput(bracketFlow.expandedInput) === normalizeEquationInput(bracketFlow.expandedExpected);
        playLabSound(ok ? 'step-correct' : 'step-wrong');
        if (!ok) {
          setStepFeedback('Expand only first (distribute the bracket), then keep the equation balanced.');
          return;
        }
        setWorkingHistory((prev) => ({ ...prev, step0a: bracketFlow.expandedInput.trim() }));
        setBracketFlow((prev) => ({ ...prev, phase: 'simplify' }));
        setStepSuccessMessage('Expansion correct. Next: simplify constants to get the linear form.');
        setTeacherKey((k) => k + 1);
        return;
      }
      const ok =
        normalizeEquationInput(bracketFlow.simplifiedInput) === normalizeEquationInput(bracketFlow.simplifiedExpected);
      playLabSound(ok ? 'step-correct' : 'step-wrong');
      if (!ok) {
        setStepFeedback('Now simplify constants only to get the correct linear equation.');
        return;
      }
      setWorkingHistory((prev) => ({ ...prev, step0b: bracketFlow.simplifiedInput.trim() }));
      setBracketFlow((prev) => ({ ...prev, phase: 'done' }));
      setStepSuccessMessage('Simplification correct. Continue with Step 1 inverse operation.');
      setTeacherKey((k) => k + 1);
      return;
    }

    if (step === 'operation') {
      const ok =
        operationSlots.symbol === mission.operationExpected.symbol &&
        areEquationNumericTokensEquivalent(operationSlots.value ?? '', mission.operationExpected.value);
      playLabSound(ok ? 'step-correct' : 'step-wrong');
      if (!ok) {
        handleWrongStep('operation');
        return;
      }
      clearInterventionForStep('operation');
      setStepSuccessMessage('Correct. Step 1 confirmed. Continue with Step 2.');
      trackMathLabMetric({
        type: 'interaction_completed',
        stationSlug: 'maths-equation-builder',
        userId: user?.uid,
        conceptId: mission.conceptId,
      });
      setWorkingHistory((prev) => ({
        ...prev,
        step1: `${operationSlots.symbol}${operationSlots.value ?? ''}`,
      }));
      setStep('equation');
      setStepFeedback(null);
      setTeacherKey((k) => k + 1);
      return;
    }

    if (step === 'equation') {
      const validation = equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission)
        : validateEquivalentLinearResultEquationStep(equationSlots, mission);
      playLabSound(validation.ok ? 'step-correct' : 'step-wrong');
      if (!validation.ok) {
        setStepFeedback(getValidationFeedback('equation'));
        handleWrongStep('equation');
        return;
      }
      clearInterventionForStep('equation');
      setStepSuccessMessage(
        `${getRouteMessage(validation.strategyTag, 'step2')} Step 2 confirmed. Step 3 ready: type the final value equation (for example x=14).`
      );
      trackMathLabMetric({
        type: 'interaction_completed',
        stationSlug: 'maths-equation-builder',
        userId: user?.uid,
        conceptId: mission.conceptId,
        strategyTag: validation.strategyTag,
      });
      setWorkingHistory((prev) => ({
        ...prev,
        step2: equationDirectInput.trim() ? equationDirectInput.trim() : serializeSlots(equationSlots),
      }));
      setStep('answer');
      setStepFeedback(null);
      setTeacherKey((k) => k + 1);
      return;
    }

    const validation = answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission)
      : validateEquivalentLinearAnswerStep(answerSlots, mission);
    playLabSound(validation.ok ? 'step-correct' : 'step-wrong');
    if (!validation.ok) {
      setStepFeedback(getValidationFeedback('answer'));
      handleWrongStep('answer');
      return;
    }
    clearInterventionForStep('answer');
    setStepSuccessMessage(`Excellent. Mission solved correctly. ${getRouteMessage(validation.strategyTag, 'step3')}`);
    trackMathLabMetric({
      type: 'interaction_completed',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission.conceptId,
      strategyTag: validation.strategyTag,
    });
    setWorkingHistory((prev) => ({
      ...prev,
      step3: answerDirectInput.trim() ? answerDirectInput.trim() : serializeSlots(answerSlots),
    }));

    if (missionIndex < missions.length - 1) {
      if (customFlow.active && missionIndex === 0) {
        setCustomFlow({ active: true, awaitingChoice: true });
        setStepSuccessMessage('Custom equation solved successfully. Choose what to do next.');
        setInterventionMessage(
          'Great job! Next: continue with practice mission 1, go to checkpoints, or load another custom equation.'
        );
        setTeacherKey((k) => k + 1);
        return;
      }
      setMissionIndex((i) => i + 1);
      setStep('operation');
      setOperationSlots({ symbol: null, value: null });
      setEquationSlots(createEquationSlots());
      setAnswerSlots(createAnswerSlots());
      setEquationDirectInput('');
      setAnswerDirectInput('');
      setStepFeedback(null);
      setStepSuccessMessage(null);
      setLastWrongCoachKey(null);
      setShowHint(false);
      setInterventionMessage(null);
      setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
      setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
      setCustomFlow((prev) => ({ ...prev, awaitingChoice: false }));
      setTeacherKey((k) => k + 1);
    } else {
      playLabSound('checkpoint-start');
      setStage('checkpoint');
      setTeacherKey((k) => k + 1);
    }
  };

  const requestHint = () => {
    playLabSound('hint');
    setShowHint(true);
    const nextHint = hintCount + 1;
    setHintCount(nextHint);
    trackMathLabMetric({
      type: 'hint_requested',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission?.conceptId,
      hintCount: nextHint,
    });
  };

  const loadCustomEquation = () => {
    const normalizedInput = customEquationInput.replace(/\s+/g, '');
    const parsedBracket = parseBracketLinearEquation(customEquationInput);
    const bracketScaffold = parsedBracket ? buildBracketLinearScaffold(parsedBracket) : null;
    const parsedLinear = parseLinearEquation(customEquationInput);
    const parsedFraction = parsedLinear ? null : parseFractionLinearEquation(customEquationInput);
    const parsedFlexible =
      !parsedLinear && !parsedFraction && !parsedBracket ? parseFlexibleLinearEquation(customEquationInput) : null;

    const classifyUnsupportedEquation = (): string | null => {
      if (!normalizedInput.includes('=')) {
        return 'Add an equals sign (=). Example: 4x+8=36';
      }
      if (/[a-zA-Z]\^2|[a-zA-Z]\^/.test(normalizedInput) || /[a-zA-Z].*[a-zA-Z]/.test(normalizedInput.replace(/[+\-=/()]/g, ''))) {
        return 'Quadratic/custom power equations are not in this builder yet. Use linear/fraction linear for now (quadratic builder coming next).';
      }
      if (/\/0(?!\d)/.test(normalizedInput)) {
        return 'Invalid equation: denominator cannot be zero.';
      }
      if (!/[a-zA-Z]/.test(normalizedInput)) {
        return 'Include a variable (for example x).';
      }
      return 'This format is not supported yet. Try a linear form that reduces to ax+b=c (including bracket expansion forms like 2(x+3)=10).';
    };

    if (!parsedLinear && !parsedFraction && !parsedFlexible && !parsedBracket) {
      setCustomEquationError(
        classifyUnsupportedEquation() ??
          'Use format like 4x + 8 = 36, 3x - 5 = 16, or x/3 + 2 = 6.'
      );
      return;
    }

    if (parsedLinear && !hasIntegerSolution(parsedLinear)) {
      setCustomEquationError('This linear equation gives a non-integer answer. Try one with integer solution first.');
      return;
    }

    if (parsedFraction && !hasIntegerSolutionForFraction(parsedFraction)) {
      setCustomEquationError('This fraction equation gives a non-integer answer. Try one with integer solution first.');
      return;
    }

    if (parsedFlexible && !hasIntegerSolution(parsedFlexible)) {
      setCustomEquationError('This equation gives a non-integer answer. Try one with integer solution first.');
      return;
    }

    const customMission = parsedBracket && bracketScaffold
      ? buildMissionFromLinearEquation('custom-1', bracketScaffold.simplifiedParsed)
      : parsedLinear
      ? buildMissionFromLinearEquation('custom-1', parsedLinear)
      : parsedFraction
      ? buildMissionFromFractionLinearEquation('custom-1', parsedFraction)
      : buildMissionFromLinearEquation('custom-1', parsedFlexible!);
    if (parsedBracket && bracketScaffold) {
      customMission.equation = bracketScaffold.originalDisplay;
    }
    const generated = buildPracticeMissions(practiceMode).slice(0, 3);
    setMissions([customMission, ...generated]);
    setCustomEquationError(null);
    setCustomFlow({ active: true, awaitingChoice: false });
    setStage('build');
    setMissionIndex(0);
    setStep('operation');
    setOperationSlots({ symbol: null, value: null });
    setEquationSlots(createEquationSlots());
    setAnswerSlots(createAnswerSlots());
    setEquationDirectInput('');
    setAnswerDirectInput('');
    setStepFeedback(null);
    setStepSuccessMessage(
      parsedBracket && bracketScaffold
        ? 'Custom bracket equation loaded. Start with Step 0A: expand the bracket.'
        : 'Custom equation loaded. Start with Step 1.'
    );
    setBracketFlow(
      parsedBracket && bracketScaffold
        ? {
            active: true,
            phase: 'expand',
            expandedExpected: bracketScaffold.expandedDisplay,
            simplifiedExpected: bracketScaffold.simplifiedDisplay,
            expandedInput: '',
            simplifiedInput: '',
          }
        : {
            active: false,
            phase: 'done',
            expandedExpected: '',
            simplifiedExpected: '',
            expandedInput: '',
            simplifiedInput: '',
          }
    );
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
  };

  const submitCheckpointAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === checkpoint.correctIndex;
    playLabSound(isCorrect ? 'answer-correct' : 'answer-wrong');
    const next = [...checkpointAnswers, optionIndex];
    setCheckpointAnswers(next);
    trackMathLabMetric({
      type: 'checkpoint_answered',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: 'algebra.linear.solve',
      isCorrect,
    });

    if (checkpointIndex < checkpoints.length - 1) {
      setCheckpointIndex((i) => i + 1);
      setShowHint(false);
      return;
    }

    playLabSound('complete');
    const scorePercent = Math.round((next.filter((a, i) => a === checkpoints[i].correctIndex).length / checkpoints.length) * 100);
    const nextStats: ModeStatsRecord = {
      ...modeStats,
      [practiceMode]: {
        attempts: modeStats[practiceMode].attempts + 1,
        avgScore:
          (modeStats[practiceMode].avgScore * modeStats[practiceMode].attempts + scorePercent) /
          (modeStats[practiceMode].attempts + 1),
        avgHints:
          (modeStats[practiceMode].avgHints * modeStats[practiceMode].attempts + hintCount) /
          (modeStats[practiceMode].attempts + 1),
      },
    };
    setModeStats(nextStats);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(EQUATION_BUILDER_MODE_STATS_KEY, JSON.stringify(nextStats));
      } catch {
        // Ignore storage access issues to keep lab usable.
      }
    }
    setStage('result');
    trackMathLabMetric({
      type: 'station_completed',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      score: scorePercent,
      hintCount,
    });
  };

  const restart = () => {
    playLabSound('restart');
    setStage('build');
    setMissionIndex(0);
    setStep('operation');
    setOperationSlots({ symbol: null, value: null });
    setEquationSlots(createEquationSlots());
    setAnswerSlots(createAnswerSlots());
    setEquationDirectInput('');
    setAnswerDirectInput('');
    setStepFeedback(null);
    setStepSuccessMessage(null);
    setLastWrongCoachKey(null);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
    setCustomFlow({ active: false, awaitingChoice: false });
    setHintCount(0);
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
  };

  const startPracticeMode = (mode: PracticeMode) => {
    setPracticeMode(mode);
    setMissions(buildPracticeMissions(mode));
    setStage('build');
    setMissionIndex(0);
    setStep('operation');
    setOperationSlots({ symbol: null, value: null });
    setEquationSlots(createEquationSlots());
    setAnswerSlots(createAnswerSlots());
    setEquationDirectInput('');
    setAnswerDirectInput('');
    setStepFeedback(null);
    setStepSuccessMessage(
      mode === 'linear'
        ? 'Linear practice loaded. Start with Step 1.'
        : 'Fraction Linear practice loaded. Start with Step 1.'
    );
    setLastWrongCoachKey(null);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
    setCustomFlow({ active: false, awaitingChoice: false });
    setHintCount(0);
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(EQUATION_BUILDER_LAST_MODE_KEY, mode);
        window.localStorage.setItem(EQUATION_BUILDER_FIRST_VISIT_KEY, 'true');
      } catch {
        // Ignore storage access issues to keep lab usable.
      }
    }
    setIsFirstVisit(false);
    setLastMode(mode);
  };

  return (
    <div className="space-y-3">
      <TeacherVoice
        message={teacherMessage}
        triggerSpeakKey={teacherKey}
        autoPlay
        requireExplicitStart
        showStartOverlay={false}
        theme="math"
        teacherName="Equation Coach"
        quickActions={[{ label: 'Replay instruction', onClick: () => setTeacherKey((k) => k + 1) }]}
        onHintRequest={stage !== 'result' ? requestHint : undefined}
      />

      <Card className="border border-cyan-200 dark:border-cyan-800">
        <CardContent className="space-y-3 p-3 sm:p-4">
          {stage === 'build' && (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                <Card className="border-sky-200 dark:border-sky-800">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-muted-foreground">Practice path</span>
                      <Badge variant="outline" className="text-[10px] h-5 px-2">
                        Suggested: {recommendedLabel}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={practiceMode === 'linear' ? 'default' : 'outline'}
                      className="h-8 px-3 text-xs"
                      onClick={() => startPracticeMode('linear')}
                    >
                      Linear
                    </Button>
                    <Button
                      size="sm"
                      variant={practiceMode === 'fraction' ? 'default' : 'outline'}
                      className="h-8 px-3 text-xs"
                      onClick={() => startPracticeMode('fraction')}
                    >
                      Fraction
                    </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-sky-200 dark:border-sky-800">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="text-sm">Custom equation</CardTitle>
                    <CardDescription className="text-xs">
                      Forms: <code>ax+b=c</code>, <code>x/d+b=c</code>, <code>k(x+m)=n</code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex gap-2">
                      <input
                        className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                        value={customEquationInput}
                        onChange={(e) => setCustomEquationInput(e.target.value)}
                        placeholder="4x+8=36 or x/3+2=6"
                      />
                      <Button size="sm" onClick={loadCustomEquation}>Load</Button>
                    </div>
                    {customEquationError && (
                      <p className="text-xs text-rose-600 dark:text-rose-400">{customEquationError}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border border-cyan-200 dark:border-cyan-800 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">Mission {missionIndex + 1}/{missions.length}</p>
                  <Badge variant="secondary" className="w-fit">
                    {practiceMode === 'linear' ? 'Linear' : 'Fraction'}
                  </Badge>
                </div>
                <p className="font-semibold text-base">{mission.equation}</p>
                <p className="text-[11px] text-muted-foreground">Solved: {solvedMissions}/{missions.length}</p>
              </div>

              {customFlow.awaitingChoice && (
                <Card className="border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Custom equation solved</CardTitle>
                    <CardDescription>Excellent work. What should happen next?</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        setCustomFlow({ active: true, awaitingChoice: false });
                        setMissionIndex(1);
                        setStep('operation');
                        setOperationSlots({ symbol: null, value: null });
                        setEquationSlots(createEquationSlots());
                        setAnswerSlots(createAnswerSlots());
                        setStepFeedback(null);
                        setStepSuccessMessage('Great. Continue with generated Mission 2.');
                        setLastWrongCoachKey(null);
                        setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
                        setTeacherKey((k) => k + 1);
                      }}
                    >
                      Continue to Mission 2
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCustomFlow({ active: false, awaitingChoice: false });
                        setStage('checkpoint');
                        setStepSuccessMessage(null);
                        setTeacherKey((k) => k + 1);
                      }}
                    >
                      Go to checkpoints now
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setCustomFlow({ active: false, awaitingChoice: false });
                        setMissionIndex(0);
                        setStep('operation');
                        setOperationSlots({ symbol: null, value: null });
                        setEquationSlots(createEquationSlots());
                        setAnswerSlots(createAnswerSlots());
                        setStepFeedback(null);
                        setStepSuccessMessage('Load another custom equation when ready.');
                        setLastWrongCoachKey(null);
                        setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null });
                        setTeacherKey((k) => k + 1);
                      }}
                    >
                      Load another custom equation
                    </Button>
                  </CardContent>
                </Card>
              )}

              <p className="text-[11px] text-muted-foreground">
                Type equations directly and press Enter to check. Spaces are optional.
              </p>

              {hasWorkingHistory && (
                <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30">
                  <CardContent className="space-y-2 pt-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Confirmed working
                    </p>
                    {workingHistory.step0a && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Step 0A:</span> {workingHistory.step0a}
                      </p>
                    )}
                    {workingHistory.step0b && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Step 0B:</span> {workingHistory.step0b}
                      </p>
                    )}
                    {workingHistory.step1 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Step 1:</span> {workingHistory.step1}
                      </p>
                    )}
                    {workingHistory.step2 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Step 2:</span> {workingHistory.step2}
                      </p>
                    )}
                    {workingHistory.step3 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Step 3:</span> {workingHistory.step3}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {bracketFlow.active && bracketFlow.phase !== 'done' ? (
                <Card className="border-cyan-400 dark:border-cyan-700">
                  <CardContent className="space-y-2 pt-3">
                    <p className="text-sm font-medium">
                      {bracketFlow.phase === 'expand'
                        ? 'Step 0A: Expand bracket'
                        : 'Step 0B: Simplify constants'}
                    </p>
                    <input
                      ref={bracketFlowRef}
                      className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                      placeholder={
                        bracketFlow.phase === 'expand'
                          ? 'Type expanded equation (e.g. 3x-6+4=19)'
                          : 'Type simplified equation (e.g. 3x-2=19)'
                      }
                      value={bracketFlow.phase === 'expand' ? bracketFlow.expandedInput : bracketFlow.simplifiedInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (bracketFlow.phase === 'expand') {
                          setBracketFlow((prev) => ({ ...prev, expandedInput: value }));
                        } else {
                          setBracketFlow((prev) => ({ ...prev, simplifiedInput: value }));
                        }
                        setStepFeedback(null);
                        setStepSuccessMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          checkStep();
                        }
                      }}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {bracketFlow.phase === 'expand'
                        ? 'Distribute first; do not solve for x yet.'
                        : 'Combine constants only, then continue to Step 1.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
              <Card className={step === 'operation' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardContent className="space-y-2 pt-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={operationSymbolRef}
                      className="min-w-16 h-9 rounded-md border bg-background px-3 text-sm"
                      placeholder={step === 'operation' ? 'Step 1: sign (+/-)' : 'Step 1 complete'}
                      disabled={step !== 'operation'}
                      value={operationSlots.symbol ?? ''}
                      onChange={(e) => updateTypedSlot('operation-symbol', e.target.value)}
                    />
                    <input
                      ref={operationValueRef}
                      className="min-w-20 h-9 rounded-md border bg-background px-3 text-sm"
                      placeholder={step === 'operation' ? 'Step 1: value (e.g. 5 or 1/2)' : 'Step 1 complete'}
                      disabled={step !== 'operation'}
                      value={operationSlots.value ?? ''}
                      onChange={(e) => updateTypedSlot('operation-value', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              )}

              {(!bracketFlow.active || bracketFlow.phase === 'done') && (
              <Card className={step === 'equation' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardContent className="space-y-2 pt-3">
                  <input
                    ref={equationDirectRef}
                    className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                    placeholder={
                      isStep2Locked
                        ? 'Step 2: Result equation (complete Step 1 first)'
                        : 'Step 2: Result equation (e.g. x/4=8 or 8=2x)'
                    }
                    disabled={step !== 'equation'}
                    value={equationDirectInput}
                    onChange={(e) => setEquationDirectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && step === 'equation') {
                        e.preventDefault();
                        checkStep();
                      }
                    }}
                  />
                </CardContent>
              </Card>
              )}

              {(!bracketFlow.active || bracketFlow.phase === 'done') && (
              <Card className={step === 'answer' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardContent className="space-y-2 pt-3">
                  <input
                    ref={answerDirectRef}
                    className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                    placeholder={
                      isStep3Locked
                        ? 'Step 3: Final answer (complete Step 2 first)'
                        : 'Step 3: Final answer (e.g. x=14 or 14=x)'
                    }
                    disabled={step !== 'answer'}
                    value={answerDirectInput}
                    onChange={(e) => setAnswerDirectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && step === 'answer') {
                        e.preventDefault();
                        checkStep();
                      }
                    }}
                  />
                </CardContent>
              </Card>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={checkStep} disabled={isAutoAdvancing}>
                  {isAutoAdvancing ? 'Advancing...' : 'Check Step'}
                </Button>
                <Button variant="outline" onClick={resetStep}>Clear Step</Button>
                <Button variant="ghost" onClick={requestHint} className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </Button>
              </div>

              {stepFeedback && (
                <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700">
                  <CardContent className="pt-4 text-sm">{stepFeedback}</CardContent>
                </Card>
              )}

              {stepSuccessMessage && (
                <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700">
                  <CardContent className="pt-4 text-sm">{stepSuccessMessage}</CardContent>
                </Card>
              )}

              {showHint && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700">
                  <CardContent className="pt-4 text-sm">{mission.hint}</CardContent>
                </Card>
              )}

              {interventionMessage && (
                <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700">
                  <CardContent className="pt-4 text-sm">{interventionMessage}</CardContent>
                </Card>
              )}
            </>
          )}

          {stage === 'checkpoint' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Checkpoint {checkpointIndex + 1} of {checkpoints.length}</CardTitle>
                <CardDescription>{normalizeMathText(checkpoint.prompt)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkpoint.options.map((option, optionIndex) => (
                  <Button key={option} variant="outline" className="w-full justify-start" onClick={() => submitCheckpointAnswer(optionIndex)}>
                    {String.fromCharCode(65 + optionIndex)}. {normalizeMathText(option)}
                  </Button>
                ))}
                {showHint && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700">
                    <CardContent className="pt-4 text-sm">{normalizeMathText(checkpoint.hint)}</CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {stage === 'result' && (
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                  Equation Builder Complete
                </CardTitle>
                <CardDescription>
                  Checkpoint score: {checkpointScore}/{checkpoints.length} | Hints used: {hintCount}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={restart} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Lab
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
