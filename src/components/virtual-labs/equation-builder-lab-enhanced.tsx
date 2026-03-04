'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, Calculator, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { LabScientificCalculator } from '@/components/virtual-labs/LabScientificCalculator';
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
  buildMissionFromTwoSidedLinearEquation,
  generateFractionLinearMissions,
  generateLinearMissions,
  generateTwoSidedLinearMissions,
  getCurriculumRouteFeedback,
  hasIntegerSolutionForFraction,
  hasIntegerSolution,
  hasIntegerSolutionTwoSided,
  parseBracketLinearEquation,
  parseFractionLinearEquation,
  parseFlexibleLinearEquation,
  parseTwoSidedLinearEquation,
  parseEquationNumericToken,
  isEquivalentLinearAnswerStep,
  isEquivalentLinearResultEquationStep,
  parseLinearEquation,
  validateLinearAnswerEquationInput,
  validateLinearResultEquationInput,
  validateEquivalentLinearAnswerStep,
  validateEquivalentLinearResultEquationStep,
  validateIntermediateAnswer,
  validateStep1OperationByEquivalence,
  type EquationStepValidationReason,
  type EquationCurriculumProfile,
  type EquationStepStrategyTag,
  type EquationBuilderMission,
  type TwoSidedLinearEquationParsed,
  type InequalityBuilderMission,
  type InequalityParsed,
  type InequalitySolution,
  parseInequality,
  solveInequality,
  buildMissionFromInequality,
  validateInequalityStep1,
  validateInequalityStep2,
  validateInequalityStep3,
  generateInequalityMissions,
  getInequalityHint,
} from '@/lib/math-lab/equation-engine';
import { normalizeMathText } from '@/lib/text/normalize-math-text';

type StepKey = 'operation' | 'equation' | 'answer';
type PracticeMode = 'linear' | 'fraction' | 'variable-both-sides' | 'inequality';
const EQUATION_SLOT_COUNT = 6;
const ANSWER_SLOT_COUNT = 4;
const createEquationSlots = () => Array<string | null>(EQUATION_SLOT_COUNT).fill(null);
const createAnswerSlots = () => Array<string | null>(ANSWER_SLOT_COUNT).fill(null);
const EQUATION_BUILDER_LAST_MODE_KEY = 'equation_builder_last_mode_v1';
const EQUATION_BUILDER_FIRST_VISIT_KEY = 'equation_builder_first_visit_done_v1';
const EQUATION_BUILDER_MODE_STATS_KEY = 'equation_builder_mode_stats_v1';
const EQUATION_BUILDER_VBS_TUTORIAL_KEY = 'equation_builder_vbs_tutorial_seen_v1';

type ModeStats = { attempts: number; avgScore: number; avgHints: number };
type ModeStatsRecord = Record<PracticeMode, ModeStats>;

const DEFAULT_MODE_STATS: ModeStatsRecord = {
  linear: { attempts: 0, avgScore: 0, avgHints: 0 },
  fraction: { attempts: 0, avgScore: 0, avgHints: 0 },
  'variable-both-sides': { attempts: 0, avgScore: 0, avgHints: 0 },
  inequality: { attempts: 0, avgScore: 0, avgHints: 0 },
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
  step3intermediate: string | null; // For showing 2x=4 even if student skipped it
};

type WorkingStep = {
  label: string;
  description?: string;
  equation: string;
};

const MISCONCEPTION_TAGS: Record<StepKey, string> = {
  operation: 'algebra.inverse-operation',
  equation: 'algebra.balance-after-operation',
  answer: 'algebra.final-isolation',
};

const INTERVENTION_MESSAGES: Record<StepKey, string> = {
  operation:
    'Intervention: choose any valid operation that simplifies the equation. Common approaches: subtract a variable term (like -x) or subtract a constant (like -4). Both are accepted!',
  equation:
    'Intervention: after applying the operation to both sides, rebuild the equation carefully. Keep the variable term balanced.',
  answer:
    'Intervention: isolate x using the inverse of its coefficient. For example, if x/3 = 4, multiply both sides by 3.',
};

const equationCheckpoints: Checkpoint[] = [
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

const inequalityCheckpoints: Checkpoint[] = [
  {
    id: 'ineq-cp1',
    prompt: 'To solve 3x + 5 > 20, what is the first inverse operation?',
    options: ['Subtract 5', 'Add 5', 'Divide by 3', 'Flip the sign'],
    correctIndex: 0,
    hint: 'Isolate the variable term first by subtracting the constant.',
  },
  {
    id: 'ineq-cp2',
    prompt: 'When solving -2x < 10, what happens to the inequality sign?',
    options: ['It stays the same', 'It flips to >', 'It becomes =', 'It disappears'],
    correctIndex: 1,
    hint: 'When dividing by a NEGATIVE number, the inequality sign FLIPS!',
  },
  {
    id: 'ineq-cp3',
    prompt: 'If 4x > 16, then x > ?',
    options: ['4', '12', '20', '64'],
    correctIndex: 0,
    hint: 'Divide both sides by 4 (positive, so sign stays the same).',
  },
];

// Helper function to get equation/inequality string from mission
function getMissionEquationString(mission: EquationBuilderMission | InequalityBuilderMission): string {
  if ('inequality' in mission && mission.inequality) {
    return mission.inequality;
  }
  if ('equation' in mission && mission.equation) {
    return mission.equation;
  }
  return '';
}

// Helper function to detect the actual equation type from a mission
function detectMissionType(mission: EquationBuilderMission | InequalityBuilderMission): PracticeMode {
  // Check if it's an inequality mission
  if ('inequality' in mission && mission.inequality) {
    return 'inequality';
  }
  
  // Check equation string for inequality operators
  const equation = getMissionEquationString(mission);
  if (equation.includes('<') || equation.includes('>') || equation.includes('≤') || equation.includes('≥')) {
    return 'inequality';
  }
  
  // Check for variable-both-sides (4 steps or has intermediateAnswer)
  if ('steps' in mission && mission.steps === 4) {
    return 'variable-both-sides';
  }
  if ('intermediateAnswer' in mission && mission.intermediateAnswer) {
    return 'variable-both-sides';
  }
  
  // Check for fraction equations (contains division operators)
  if (equation.includes('/')) {
    return 'fraction';
  }
  
  // Default to linear
  return 'linear';
}

// Helper function to auto-correct mode based on actual mission types
function autoCorrectMode(
  missions: (EquationBuilderMission | InequalityBuilderMission)[],
  selectedMode: PracticeMode
): PracticeMode {
  if (missions.length === 0) return selectedMode;
  
  // Detect the type of the first mission
  const detectedType = detectMissionType(missions[0]);
  
  // If detected type differs from selected, return detected type
  if (detectedType !== selectedMode) {
    console.log(`🔄 Auto-corrected mode from "${selectedMode}" to "${detectedType}" based on mission content`);
    return detectedType;
  }
  
  return selectedMode;
}

// Helper function to build practice missions (moved outside component to avoid re-creation)
function buildPracticeMissions(mode: PracticeMode): (EquationBuilderMission | InequalityBuilderMission)[] {
  if (mode === 'linear') return generateLinearMissions(4);
  if (mode === 'fraction') return generateFractionLinearMissions(4);
  if (mode === 'inequality') return generateInequalityMissions(4);
  return generateTwoSidedLinearMissions(4); // variable-both-sides
}

export function EquationBuilderLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const { playLabSound } = useLabSoundProfile('maths-equation-builder');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const curriculumProfile: EquationCurriculumProfile = 'global-k12';
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('linear');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [lastMode, setLastMode] = useState<PracticeMode>('linear');
  const [modeStats, setModeStats] = useState<ModeStatsRecord>(DEFAULT_MODE_STATS);
  const [missions, setMissions] = useState<(EquationBuilderMission | InequalityBuilderMission)[]>(() => buildPracticeMissions('linear'));

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
  const [showVbsTutorial, setShowVbsTutorial] = useState(false);
  const [workingCopied, setWorkingCopied] = useState(false);
  const [intermediateEquation, setIntermediateEquation] = useState<string | null>(null);
  const [intermediateAnswerGiven, setIntermediateAnswerGiven] = useState(false);
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
    step3intermediate: null,
  });
  const operationSymbolRef = useRef<HTMLInputElement | null>(null);
  const operationValueRef = useRef<HTMLInputElement | null>(null);
  const bracketFlowRef = useRef<HTMLInputElement | null>(null);
  const equationDirectRef = useRef<HTMLInputElement | null>(null);
  const answerDirectRef = useRef<HTMLInputElement | null>(null);
  const equationInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const answerInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const mission = missions[missionIndex];
  
  // Select checkpoint set based on practice mode
  const checkpoints = practiceMode === 'inequality' ? inequalityCheckpoints : equationCheckpoints;
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
    [checkpointAnswers, checkpoints]
  );
  const recommendedMode: PracticeMode = useMemo(() => {
    if (isFirstVisit) return 'linear';
    
    const linear = modeStats.linear || { attempts: 0, avgScore: 0, avgHints: 0 };
    const fraction = modeStats.fraction || { attempts: 0, avgScore: 0, avgHints: 0 };
    const varBothSides = modeStats['variable-both-sides'] || { attempts: 0, avgScore: 0, avgHints: 0 };
    const inequality = modeStats.inequality || { attempts: 0, avgScore: 0, avgHints: 0 };

    // If struggling with any advanced mode, go back to linear
    if (fraction.attempts > 0 && (fraction.avgScore < 60 || fraction.avgHints > 3)) {
      return 'linear';
    }
    if (varBothSides.attempts > 0 && (varBothSides.avgScore < 60 || varBothSides.avgHints > 3)) {
      return 'linear';
    }
    if (inequality.attempts > 0 && (inequality.avgScore < 60 || inequality.avgHints > 3)) {
      return 'linear';
    }
    
    // Progression path: Linear → Inequality → Variable Both Sides → Fraction Linear
    // Ready for inequality if linear mastery achieved
    if (linear.attempts > 0 && linear.avgScore >= 75 && linear.avgHints <= 2 && inequality.attempts === 0) {
      return 'inequality';
    }
    
    // Ready for variable-both-sides if linear and inequality mastered
    if (linear.avgScore >= 75 && inequality.avgScore >= 70 && varBothSides.attempts === 0) {
      return 'variable-both-sides';
    }
    
    // Ready for fraction if linear, inequality, and variable-both-sides mastered
    if (linear.avgScore >= 75 && inequality.avgScore >= 70 && varBothSides.avgScore >= 70 && fraction.attempts === 0) {
      return 'fraction';
    }
    
    return lastMode;
  }, [isFirstVisit, modeStats, lastMode]);
  
  const recommendedLabel = 
    recommendedMode === 'linear' ? 'Linear' : 
    recommendedMode === 'fraction' ? 'Fraction Linear' : 
    recommendedMode === 'inequality' ? 'Inequality' :
    'Variable Both Sides';
    
  const recommendedReason = useMemo(() => {
    if (isFirstVisit) return 'Good starting point for confidence.';
    
    if (recommendedMode === 'inequality' && (modeStats.inequality?.attempts ?? 0) === 0) {
      return 'You are ready for inequalities! Learn about ranges and sign flipping.';
    }
    
    if (recommendedMode === 'variable-both-sides' && (modeStats['variable-both-sides']?.attempts ?? 0) === 0) {
      return 'You are ready for variables on both sides! Next level challenge.';
    }
    
    if (recommendedMode === 'fraction' && (modeStats.fraction?.attempts ?? 0) === 0) {
      return 'Great work! Time to tackle fraction equations.';
    }
    
    if (recommendedMode === 'linear' && ((modeStats.fraction?.attempts ?? 0) > 0 || (modeStats['variable-both-sides']?.attempts ?? 0) > 0 || (modeStats.inequality?.attempts ?? 0) > 0)) {
      return 'A quick Linear round can rebuild confidence.';
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
      const resolvedMode: PracticeMode = 
        storedMode === 'fraction' ? 'fraction' : 
        storedMode === 'variable-both-sides' ? 'variable-both-sides' : 
        storedMode === 'inequality' ? 'inequality' :
        'linear';
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
        'variable-both-sides': {
          attempts: parsedStats?.['variable-both-sides']?.attempts ?? 0,
          avgScore: parsedStats?.['variable-both-sides']?.avgScore ?? 0,
          avgHints: parsedStats?.['variable-both-sides']?.avgHints ?? 0,
        },
        inequality: {
          attempts: parsedStats?.inequality?.attempts ?? 0,
          avgScore: parsedStats?.inequality?.avgScore ?? 0,
          avgHints: parsedStats?.inequality?.avgHints ?? 0,
        },
      });
      
      // Auto-correct mode if missions don't match selected type
      const initialMissions = buildPracticeMissions(resolvedMode);
      const correctedMode = autoCorrectMode(initialMissions, resolvedMode);
      const finalMissions = correctedMode !== resolvedMode ? buildPracticeMissions(correctedMode) : initialMissions;
      
      setPracticeMode(correctedMode);
      setMissions(finalMissions);
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
      try {
        checkStep();
      } catch (error) {
        console.error('Error in checkStep:', error);
        setStepFeedback('An error occurred. Please try again.');
      } finally {
        setIsAutoAdvancing(false);
      }
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
        ? practiceMode === 'variable-both-sides'
          ? `Let's solve ${getMissionEquationString(mission)}. First step: eliminate the variable from one side. Enter the operation below (example: subtract x means symbol '-' and value 'x').`
          : `Welcome to Equation Builder Lab. You have two paths: (1) load your own custom equation, or (2) start guided practice with ${getMissionEquationString(mission)}. Choose any path, then I will coach you step-by-step.`
        : step === 'operation'
        ? practiceMode === 'variable-both-sides' && missionIndex < 2
          ? `Mission ${missionIndex + 1}: ${getMissionEquationString(mission)}. Enter the operation to eliminate the variable from the right side. Use the boxes below labeled 'symbol' and 'value'.`
          : `${
            customFlow.active && missionIndex === 0
              ? 'Custom equation'
              : `Practice mission number ${missionIndex + 1}`
          }. Equation is ${getMissionEquationString(mission)}. Enter the inverse operation to apply on both sides.`
        : step === 'equation'
        ? `Great. Now enter the resulting equation after that operation.`
        : step === 'answer' && (mission as InequalityBuilderMission).skipStep1
        ? `This inequality is already simplified (no constant to subtract). Enter the operation to isolate x.`
        : `Final step: enter the solved value of x.`
      : stage === 'checkpoint'
      ? `Checkpoint ${checkpointIndex + 1}: ${normalizeMathText(checkpoint.prompt)}`
      : `Excellent work. You solved ${missions.length} equation missions and scored ${checkpointScore}/${checkpoints.length} in checkpoints.`;

  const cleanToken = (token: string) => token.trim();
  const normalizeEquationInput = (value: string) => value.replace(/\s+/g, '').toLowerCase();
  const serializeSlots = (slots: Array<string | null>) => slots.map((s) => s ?? '').join('');
  
  /**
   * Generate the unsimplified equation/inequality after applying the operation to both sides
   * Example: "4x + 8 = 3x - 3" with operation "-3x" becomes "4x + 8 - 3x = 3x - 3 - 3x"
   * Also handles inequalities: "3x + 5 > 20" with operation "-5" becomes "3x + 5 - 5 > 20 - 5"
   */
  const generateIntermediateEquation = (originalEq: string, operation: { symbol: string; value: string }): string => {
    // Find the operator (=, <, >, ≤, ≥)
    const operatorMatch = originalEq.match(/(=|<|>|≤|≥)/);
    if (!operatorMatch) return originalEq;
    
    const operator = operatorMatch[0];
    const parts = originalEq.split(operator);
    if (parts.length !== 2) return originalEq;
    const [leftSide, rightSide] = parts.map(s => s.trim());
    const opString = ` ${operation.symbol} ${operation.value}`;
    return `${leftSide}${opString} ${operator} ${rightSide}${opString}`;
  };
  
  /**
   * Generate exam-style formatted working steps for display
   * Shows complete solution with descriptions that examiners expect globally
   */
  const getFormattedWorking = (): WorkingStep[] => {
    const steps: WorkingStep[] = [];
    
    // Original equation
    steps.push({
      label: 'Original',
      description: practiceMode === 'inequality' ? 'Given inequality' : 'Given equation',
      equation: getMissionEquationString(mission),
    });
    
    // Bracket expansion steps (if applicable)
    if (workingHistory.step0a) {
      steps.push({
        label: 'Expand',
        description: 'Expand brackets',
        equation: workingHistory.step0a,
      });
    }
    if (workingHistory.step0b) {
      steps.push({
        label: 'Simplify',
        description: 'Simplify constants',
        equation: workingHistory.step0b,
      });
    }
    
    // Step 1: Operation applied (with description)
    if (workingHistory.step1 && workingHistory.step1 !== 'skipped') {
      // Parse the actual operation the student performed
      const studentOp = workingHistory.step1; // e.g., "-x" or "-4"
      const opSymbol = studentOp.startsWith('-') ? '-' : '+';
      const opValue = studentOp.replace(/^[+-]/, ''); // Remove leading +/-
      const opVerb = opSymbol === '+' ? 'Add' : 'Subtract';
      steps.push({
        label: 'Step 1',
        description: `${opVerb} ${opValue} from both sides`,
        equation: intermediateEquation || getMissionEquationString(mission),
      });
    }
    
    // Step 2: Simplified equation (after operation) - skip if already simplified
    if (workingHistory.step2 && workingHistory.step1 !== 'skipped') {
      steps.push({
        label: 'Step 2',
        description: 'Simplify by combining like terms',
        equation: workingHistory.step2,
      });
    }
    
    // Step 3 intermediate (if exists): Shows 2x=4 step
    if (workingHistory.step3intermediate) {
      const constant = mission.intermediateAnswer;
      if (constant) {
        const match = workingHistory.step2.match(/([+-]?\d+)/g);
        if (match && match.length > 1) {
          const constantValue = match[match.length - 1];
          const sign = parseInt(constantValue) >= 0 ? 'Subtract' : 'Add';
          steps.push({
            label: 'Step 3',
            description: `${sign} ${Math.abs(parseInt(constantValue))} from both sides`,
            equation: workingHistory.step3intermediate,
          });
        }
      }
    }
    
    // Step 3/4: Final answer (adjust label if steps were skipped)
    if (workingHistory.step3) {
      const wasSkipped = workingHistory.step1 === 'skipped';
      const coeff = workingHistory.step3intermediate 
        ? workingHistory.step3intermediate.match(/^([+-]?\d+)/)?.[1]
        : (workingHistory.step2 && workingHistory.step2 !== 'skipped' 
            ? workingHistory.step2.match(/^([+-]?\d+)/)?.[1]
            : getMissionEquationString(mission).match(/^([+-]?\d+)/)?.[1]);
      
      const label = wasSkipped 
        ? 'Step 1' 
        : (workingHistory.step3intermediate ? 'Step 4' : 'Step 3');
      const description = coeff && Math.abs(parseInt(coeff)) > 1
        ? `Divide both sides by ${Math.abs(parseInt(coeff))}`
        : 'Isolate variable';
      
      steps.push({
        label,
        description,
        equation: workingHistory.step3,
      });
    }
    
    return steps;
  };
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
    if (reason === 'sign_not_flipped')
      return '⚠️ Critical error: When dividing/multiplying by a NEGATIVE number, the inequality sign must FLIP. Check your answer again!';
    return stepKey === 'equation'
      ? 'Step 2 is close, but not correct yet. Recheck both sides after your operation.'
      : 'Step 3 is not correct yet. Isolate x and check the sign/value.';
  };

  const getValidationFeedback = (stepKey: StepKey): string => {
    const isInequalityMission = 'inequality' in mission && mission.inequality;
    
    if (stepKey === 'operation') {
      if (!['+', '-'].includes(cleanToken(operationSlots.symbol ?? ''))) {
        return 'Step 1: left slot must be + or -.';
      }
      if (parseEquationNumericToken(cleanToken(operationSlots.value ?? '')) == null) {
        return 'Step 1: right slot must be a valid number (whole, decimal, or fraction).';
      }
      return 'Step 1 is not correct yet. Use the inverse of the constant term.';
    }

    if (isInequalityMission) {
      // Inequality-specific validation
      if (stepKey === 'equation') {
        const userInput = equationDirectInput.trim() || serializeSlots(equationSlots);
        const validation = validateInequalityStep2(userInput, mission as InequalityBuilderMission);
        return getReasonMessage(validation.reason, 'equation');
      }
      const userInput = answerDirectInput.trim() || serializeSlots(answerSlots);
      const validation = validateInequalityStep3(userInput, mission as InequalityBuilderMission);
      return getReasonMessage(validation.reason, 'answer');
    }

    if (stepKey === 'equation') {
      const validation = equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission as EquationBuilderMission)
        : validateEquivalentLinearResultEquationStep(equationSlots, mission as EquationBuilderMission);
      return getReasonMessage(validation.reason, 'equation');
    }

    const validation = answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission as EquationBuilderMission)
      : validateEquivalentLinearAnswerStep(answerSlots, mission as EquationBuilderMission);
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
    // Type guard: Check if this is an inequality mission
    const isInequalityMission = 'inequality' in mission && mission.inequality;
    
    if (isInequalityMission) {
      // Use inequality-specific validation
      if (step === 'operation') {
        if (!operationSlots.symbol || !operationSlots.value) return false;
        const validation = validateInequalityStep1(
          { symbol: operationSlots.symbol, value: cleanToken(operationSlots.value) },
          mission as InequalityBuilderMission
        );
        return validation.ok;
      }
      if (step === 'equation') {
        const userInput = equationDirectInput.trim() || serializeSlots(equationSlots);
        return validateInequalityStep2(userInput, mission as InequalityBuilderMission).ok;
      }
      // Step 3: Answer validation for inequality
      const userInput = answerDirectInput.trim() || serializeSlots(answerSlots);
      return validateInequalityStep3(userInput, mission as InequalityBuilderMission).ok;
    }
    
    // Original equation validation logic
    if (step === 'operation') {
      // Use equivalence-based validation (supports multiple valid paths)
      if (!operationSlots.symbol || !operationSlots.value) return false;
      const validation = validateStep1OperationByEquivalence(
        { symbol: operationSlots.symbol, value: cleanToken(operationSlots.value) },
        mission as EquationBuilderMission
      );
      return validation.ok;
    }
    if (step === 'equation') {
      return equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission as EquationBuilderMission).ok
        : isEquivalentLinearResultEquationStep(equationSlots, mission as EquationBuilderMission);
    }
    // Step 3: Answer validation
    const userInput = answerDirectInput.trim() || serializeSlots(answerSlots);
    
    // For variable-both-sides, check BOTH intermediate and final answer
    if (practiceMode === 'variable-both-sides' && 'intermediateAnswer' in mission && mission.intermediateAnswer && !intermediateAnswerGiven) {
      // Accept either intermediate (2x=4) OR final answer (x=2)
      const intermediateValid = validateIntermediateAnswer(userInput, mission as EquationBuilderMission).ok;
      const finalValid = answerDirectInput.trim()
        ? validateLinearAnswerEquationInput(answerDirectInput, mission as EquationBuilderMission).ok
        : isEquivalentLinearAnswerStep(answerSlots, mission as EquationBuilderMission);
      return intermediateValid || finalValid;
    }
    
    // Normal final answer validation
    return answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission as EquationBuilderMission).ok
      : isEquivalentLinearAnswerStep(answerSlots, mission as EquationBuilderMission);
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
        ? 'Not yet. In Step 1, try an operation that simplifies the equation (subtract a variable term or a constant).'
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
      const isInequalityMission = 'inequality' in mission && mission.inequality;
      const cleanedValue = cleanToken(operationSlots.value ?? '');
      
      // Use appropriate validation based on mission type
      const validation = isInequalityMission
        ? validateInequalityStep1(
            { symbol: operationSlots.symbol!, value: cleanedValue },
            mission as InequalityBuilderMission
          )
        : validateStep1OperationByEquivalence(
            { symbol: operationSlots.symbol!, value: cleanedValue },
            mission as EquationBuilderMission
          );
      
      playLabSound(validation.ok ? 'step-correct' : 'step-wrong');
      if (!validation.ok) {
        handleWrongStep('operation');
        return;
      }
      clearInterventionForStep('operation');
      
      // Generate and display the intermediate unsimplified equation/inequality
      const equationString = isInequalityMission 
        ? (mission as InequalityBuilderMission).inequality 
        : (mission as EquationBuilderMission).equation;
      const intermediate = generateIntermediateEquation(
        equationString,
        { symbol: operationSlots.symbol!, value: operationSlots.value! }
      );
      setIntermediateEquation(intermediate);
      
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
      const isInequalityMission = 'inequality' in mission && mission.inequality;
      
      const validation = isInequalityMission
        ? validateInequalityStep2(
            equationDirectInput.trim() || serializeSlots(equationSlots),
            mission as InequalityBuilderMission
          )
        : equationDirectInput.trim()
        ? validateLinearResultEquationInput(equationDirectInput, mission as EquationBuilderMission)
        : validateEquivalentLinearResultEquationStep(equationSlots, mission as EquationBuilderMission);
      
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

    // Step 3: Answer validation with flexible path for variable-both-sides
    const userInput = answerDirectInput.trim() || serializeSlots(answerSlots);
    const isInequalityMission = 'inequality' in mission && mission.inequality;
    
    // For inequality missions, use inequality validation
    if (isInequalityMission) {
      const validation = validateInequalityStep3(userInput, mission as InequalityBuilderMission);
      playLabSound(validation.ok ? 'step-correct' : 'step-wrong');
      if (!validation.ok) {
        setStepFeedback(getValidationFeedback('answer'));
        handleWrongStep('answer');
        return;
      }
      clearInterventionForStep('answer');
      setStepSuccessMessage('Excellent. Inequality solved correctly!');
      trackMathLabMetric({
        type: 'interaction_completed',
        stationSlug: 'maths-equation-builder',
        userId: user?.uid,
        conceptId: mission.conceptId,
      });
      setWorkingHistory((prev) => ({
        ...prev,
        step3: userInput,
      }));
      
      // Handle mission advancement (same logic as regular equations)
      if (missionIndex < missions.length - 1) {
        if (customFlow.active && missionIndex === 0) {
          setCustomFlow({ active: true, awaitingChoice: true });
          setStepSuccessMessage('Custom inequality solved successfully. Choose what to do next.');
          setInterventionMessage(
            'Great job! Next: continue with practice mission 2, go to checkpoints, or load another custom inequality.'
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
        setIntermediateEquation(null);
        setIntermediateAnswerGiven(false);
        setStepFeedback(null);
        setStepSuccessMessage(null);
        setLastWrongCoachKey(null);
        setShowHint(false);
        setInterventionMessage(null);
        setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
        setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
        setCustomFlow((prev) => ({ ...prev, awaitingChoice: false }));
        setTeacherKey((k) => k + 1);
      } else {
        playLabSound('checkpoint-start');
        setStage('checkpoint');
        setTeacherKey((k) => k + 1);
      }
      return;
    }
    
    // For variable-both-sides missions, allow intermediate step (2x=4) before final answer (x=2)
    if (practiceMode === 'variable-both-sides' && 'intermediateAnswer' in mission && mission.intermediateAnswer && !intermediateAnswerGiven) {
      // First check if they entered the intermediate form
      const intermediateValidation = validateIntermediateAnswer(userInput, mission as EquationBuilderMission);
      
      if (intermediateValidation.ok) {
        // They provided intermediate form! Praise and prompt for final answer
        playLabSound('step-correct');
        clearInterventionForStep('answer');
        setIntermediateAnswerGiven(true);
        setStepSuccessMessage(`Perfect! You simplified to ${mission.intermediateAnswer.display}. Now solve for x by dividing both sides.`);
        setWorkingHistory((prev) => ({
          ...prev,
          step3: userInput,
        }));
        setAnswerDirectInput(''); // Clear for final answer input
        setAnswerSlots(createAnswerSlots());
        setTeacherKey((k) => k + 1);
        trackMathLabMetric({
          type: 'interaction_completed',
          stationSlug: 'maths-equation-builder',
          userId: user?.uid,
          conceptId: mission.conceptId,
          strategyTag: 'intermediate_shown',
        });
        return;
      }
    }
    
    // Validate final answer (either skipped intermediate or already gave intermediate)
    const validation = answerDirectInput.trim()
      ? validateLinearAnswerEquationInput(answerDirectInput, mission as EquationBuilderMission)
      : validateEquivalentLinearAnswerStep(answerSlots, mission as EquationBuilderMission);
    playLabSound(validation.ok ? 'step-correct' : 'step-wrong');
    if (!validation.ok) {
      setStepFeedback(getValidationFeedback('answer'));
      handleWrongStep('answer');
      return;
    }
    clearInterventionForStep('answer');
    
    // Success message varies based on path taken
    const successMsg = practiceMode === 'variable-both-sides' && !intermediateAnswerGiven
      ? `Excellent! You solved it directly (advanced move). ${getRouteMessage(validation.strategyTag, 'step3')}`
      : `Excellent. Mission solved correctly. ${getRouteMessage(validation.strategyTag, 'step3')}`;
    
    setStepSuccessMessage(successMsg);
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
      // Store intermediate step for complete exam-style working (even if student skipped it)
      step3intermediate: mission.intermediateAnswer && !intermediateAnswerGiven 
        ? mission.intermediateAnswer.display 
        : prev.step3intermediate,
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
      setIntermediateEquation(null);
      setIntermediateAnswerGiven(false);
      setStepFeedback(null);
      setStepSuccessMessage(null);
      setLastWrongCoachKey(null);
      setShowHint(false);
      setInterventionMessage(null);
      setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
      setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
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
    
    // Check for inequality first
    const hasInequalityOperator = normalizedInput.includes('<') || normalizedInput.includes('>') || 
                                   normalizedInput.includes('≤') || normalizedInput.includes('≥');
    if (hasInequalityOperator) {
      // Check for rational inequality (variable in denominator)
      const hasVariableInDenominator = /\/[^0-9+\-*/()]*[a-zA-Z]/.test(normalizedInput);
      if (hasVariableInDenominator) {
        setCustomEquationError('Rational inequalities (variable in denominator like 4/x) are not supported. Try linear inequalities: ax+b > c');
        return;
      }
      
      const parsedInequality = parseInequality(customEquationInput);
      if (parsedInequality) {
        // Auto-switch to inequality mode
        console.log(`🔄 Auto-corrected mode from "${practiceMode}" to "inequality" for custom input`);
        setPracticeMode('inequality');
        
        // Build custom inequality mission + generate 3 more
        const customMission = buildMissionFromInequality('custom-1', parsedInequality, customEquationInput);
        const generatedMissions = generateInequalityMissions(3);
        setMissions([customMission, ...generatedMissions]);
        setCustomEquationError(null);
        setCustomFlow({ active: true, awaitingChoice: false });
        setStage('build');
        setMissionIndex(0);
        
        // Skip to answer step if no constant term (b = 0)
        const skipSimplification = parsedInequality.b === 0;
        setStep(skipSimplification ? 'answer' : 'operation');
        
        setOperationSlots({ symbol: null, value: null });
        setEquationSlots(createEquationSlots());
        setAnswerSlots(createAnswerSlots());
        setEquationDirectInput('');
        setAnswerDirectInput('');
        setIntermediateEquation(null);
        setIntermediateAnswerGiven(false);
        setStepFeedback(null);
        setStepSuccessMessage(
          skipSimplification 
            ? `Custom inequality loaded: ${customEquationInput}. Already simplified - solve directly by dividing both sides by ${parsedInequality.a}.`
            : `Custom inequality loaded: ${customEquationInput}. Start with Step 1.`
        );
        setCheckpointIndex(0);
        setCheckpointAnswers([]);
        setHintCount(0);
        setShowHint(false);
        setInterventionMessage(null);
        setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
        setWorkingHistory({ 
          step0a: null, 
          step0b: null, 
          step1: skipSimplification ? 'skipped' : null, 
          step2: skipSimplification ? customEquationInput : null, 
          step3: null, 
          step3intermediate: null 
        });
        setLastWrongCoachKey(null);
        return;
      } else {
        setCustomEquationError('This inequality format is not supported yet. Try format like: 3x + 5 > 20');
        return;
      }
    }
    
    const parsedBracket = parseBracketLinearEquation(customEquationInput);
    const bracketScaffold = parsedBracket ? buildBracketLinearScaffold(parsedBracket) : null;
    const parsedLinear = parseLinearEquation(customEquationInput);
    const parsedTwoSided = parsedLinear ? null : parseTwoSidedLinearEquation(customEquationInput);
    const parsedFraction = parsedLinear || parsedTwoSided ? null : parseFractionLinearEquation(customEquationInput);
    const parsedFlexible =
      !parsedLinear && !parsedTwoSided && !parsedFraction && !parsedBracket ? parseFlexibleLinearEquation(customEquationInput) : null;

    const classifyUnsupportedEquation = (): string | null => {
      if (!normalizedInput.includes('=') && !normalizedInput.includes('<') && !normalizedInput.includes('>') && 
          !normalizedInput.includes('≤') && !normalizedInput.includes('≥')) {
        return 'Add an equals sign (=) or inequality operator (<, >, ≤, ≥). Example: 4x+8=36 or 3x+5>20';
      }
      // Check for rational equations/inequalities (variable in denominator)
      if (/\/[^0-9+\-*/()]*[a-zA-Z]/.test(normalizedInput)) {
        return 'Rational equations (variable in denominator like 4/x) are not supported. Try x/4+3=8 instead (x in numerator).';
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

    if (!parsedLinear && !parsedTwoSided && !parsedFraction && !parsedFlexible && !parsedBracket) {
      setCustomEquationError(
        classifyUnsupportedEquation() ??
          'Use format like 4x + 8 = 36, 3x + 7 = x + 15, or x/3 + 2 = 6.'
      );
      return;
    }

    if (parsedLinear && !hasIntegerSolution(parsedLinear)) {
      setCustomEquationError('This linear equation gives a non-integer answer. Try one with integer solution first.');
      return;
    }

    if (parsedTwoSided && !hasIntegerSolutionTwoSided(parsedTwoSided)) {
      setCustomEquationError('This equation gives a non-integer answer. Try one with integer solution first.');
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
      : parsedTwoSided
      ? buildMissionFromTwoSidedLinearEquation('custom-1', parsedTwoSided)
      : parsedFraction
      ? buildMissionFromFractionLinearEquation('custom-1', parsedFraction)
      : buildMissionFromLinearEquation('custom-1', parsedFlexible!);
    if (parsedBracket && bracketScaffold) {
      customMission.equation = bracketScaffold.originalDisplay;
    }
    
    // Auto-detect the correct practice mode based on equation type
    const detectedMode: PracticeMode = parsedFraction 
      ? 'fraction' 
      : parsedTwoSided 
      ? 'variable-both-sides' 
      : 'linear';
    
    // Auto-correct practice mode if needed
    if (detectedMode !== practiceMode) {
      console.log(`🔄 Auto-corrected mode from "${practiceMode}" to "${detectedMode}" for custom equation`);
      setPracticeMode(detectedMode);
    }
    
    // Generate additional missions matching the detected type
    const generated = buildPracticeMissions(detectedMode).slice(0, 3);
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
    setIntermediateEquation(null);
    setIntermediateAnswerGiven(false);
    setStepFeedback(null);
    setStepSuccessMessage(
      parsedBracket && bracketScaffold
        ? 'Custom bracket equation loaded. Start with Step 0A: expand the bracket.'
        : detectedMode === 'linear'
        ? 'Linear equation loaded. Start with Step 1.'
        : detectedMode === 'variable-both-sides'
        ? 'Variable-Both-Sides equation loaded. Start with Step 1.'
        : 'Fraction equation loaded. Start with Step 1.'
    );
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setHintCount(0);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
    setLastWrongCoachKey(null);
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
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
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
    setIntermediateEquation(null);
    setIntermediateAnswerGiven(false);
    setStepFeedback(null);
    setStepSuccessMessage(null);
    setLastWrongCoachKey(null);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
    setCustomFlow({ active: false, awaitingChoice: false });
    setHintCount(0);
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
  };

  const startPracticeMode = (mode: PracticeMode) => {
    // Build missions and auto-correct mode if needed
    const initialMissions = buildPracticeMissions(mode);
    const correctedMode = autoCorrectMode(initialMissions, mode);
    const finalMissions = correctedMode !== mode ? buildPracticeMissions(correctedMode) : initialMissions;
    
    setPracticeMode(correctedMode);
    setMissions(finalMissions);
    setStage('build');
    setMissionIndex(0);
    setStep('operation');
    setOperationSlots({ symbol: null, value: null });
    setEquationSlots(createEquationSlots());
    setAnswerSlots(createAnswerSlots());
    setEquationDirectInput('');
    setAnswerDirectInput('');
    setIntermediateEquation(null);
    setIntermediateAnswerGiven(false);
    setStepFeedback(null);
    setStepSuccessMessage(
      correctedMode === 'linear'
        ? 'Linear practice loaded. Start with Step 1.'
        : correctedMode === 'variable-both-sides'
        ? 'Variable on Both Sides practice loaded. Start with Step 1.'
        : correctedMode === 'inequality'
        ? 'Inequality practice loaded. Start with Step 1.'
        : 'Fraction Linear practice loaded. Start with Step 1.'
    );
    setLastWrongCoachKey(null);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
    setCustomFlow({ active: false, awaitingChoice: false });
    setHintCount(0);
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(EQUATION_BUILDER_LAST_MODE_KEY, mode);
        window.localStorage.setItem(EQUATION_BUILDER_FIRST_VISIT_KEY, 'true');
        
        // Show tutorial for variable-both-sides mode on first use
        if (mode === 'variable-both-sides') {
          const tutorialSeen = window.localStorage.getItem(EQUATION_BUILDER_VBS_TUTORIAL_KEY) === 'true';
          if (!tutorialSeen) {
            setShowVbsTutorial(true);
          }
        }
      } catch {
        // Ignore storage access issues to keep lab usable.
      }
    }
    setIsFirstVisit(false);
    setLastMode(mode);
  };

  const handleCloseTutorial = () => {
    setShowVbsTutorial(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(EQUATION_BUILDER_VBS_TUTORIAL_KEY, 'true');
      } catch {
        // Ignore storage access issues
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Variable-Both-Sides Tutorial Dialog */}
      <Dialog open={showVbsTutorial} onOpenChange={handleCloseTutorial}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              New Challenge: Variables on Both Sides!
            </DialogTitle>
            <DialogDescription className="text-base">
              You've mastered basic linear equations. Now let's tackle equations where the variable appears on both sides.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Concept Explanation */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>💡</span>
                What's Different?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Before, you solved equations like <strong>3x + 7 = 22</strong> where x is only on one side.
              </p>
              <p className="text-sm text-muted-foreground">
                Now, you'll solve equations like <strong className="text-blue-600 dark:text-blue-400">3x + 7 = x + 15</strong> where x appears on <em>both</em> sides.
              </p>
            </div>

            {/* The Strategy */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>🎯</span>
                The Strategy: Get All x's Together
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Move all the x terms to one side, then solve like before!
              </p>
            </div>

            {/* Worked Example */}
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>📝</span>
                Example: How the Lab Works for <strong className="text-purple-600 dark:text-purple-400">3x + 7 = x + 15</strong>
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-900 rounded p-3 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Step 1: Tell the system what operation to do</p>
                  <p className="text-sm mb-2">You'll enter the operation to eliminate x from the right side:</p>
                  <p className="font-mono text-base bg-purple-100 dark:bg-purple-900/50 p-2 rounded">Symbol: <strong>-</strong>  &nbsp;  Value: <strong>x</strong></p>
                  <p className="text-xs text-muted-foreground mt-1">💭 This means "subtract x from both sides"</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded p-3 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Step 2: Enter the simplified equation</p>
                  <p className="text-sm mb-2">After subtracting x and combining x terms:</p>
                  <p className="font-mono text-base font-bold bg-purple-100 dark:bg-purple-900/50 p-2 rounded">2x + 7 = 15</p>
                  <p className="text-xs text-muted-foreground mt-1">⚠️ Important: Keep the constant (+7) at this step. You'll handle it in Step 3.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded p-3 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Step 3: Flexible final solving</p>
                  <p className="text-sm mb-2">You have options! Either show your work:</p>
                  <p className="font-mono text-sm bg-purple-100 dark:bg-purple-900/50 p-2 rounded mb-2">First: <strong>2x = 8</strong> (subtract 7 from both sides)</p>
                  <p className="font-mono text-sm bg-purple-100 dark:bg-purple-900/50 p-2 rounded mb-2">Then: <strong>x = 4</strong> (divide by 2)</p>
                  <p className="text-sm mb-2">OR skip directly to the answer:</p>
                  <p className="font-mono text-base font-bold text-green-600 dark:text-green-400 bg-purple-100 dark:bg-purple-900/50 p-2 rounded">x = 4</p>
                  <p className="text-xs text-muted-foreground mt-1">✓ Both paths accepted! Choose your learning style.</p>
                </div>
              </div>

              <div className="mt-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded p-2">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> The lab expects you to do the mental math for combining terms. You only type the key steps!
                </p>
              </div>
            </div>

            {/* Key Tips */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>💪</span>
                Pro Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li><strong>Step 1:</strong> Choose the operation to eliminate x from one side (usually subtract the smaller x term)</li>
                <li><strong>Step 2:</strong> Combine like terms. Keep the constant at this step (e.g., "2x + 7 = 15")</li>
                <li><strong>Step 3 (Flexible):</strong> Show intermediate work (2x = 8) OR skip to final answer (x = 4) - your choice!</li>
                <li><strong>Watch your signs:</strong> Subtracting x means "-" symbol and "x" value</li>
                <li><strong>Type carefully:</strong> Use "2x" not "2*x", and make sure to include the "=" sign</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCloseTutorial} className="w-full sm:w-auto">
              Got it! Let's practice 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        calculatorSlot={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1.5 hover:bg-white/20"
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span className="text-xs">Calculator</span>
          </Button>
        }
      />

      <LabScientificCalculator 
        isOpen={isCalculatorOpen}
        onOpenChange={setIsCalculatorOpen}
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
                      variant={practiceMode === 'inequality' ? 'default' : 'outline'}
                      className="h-8 px-2.5 text-xs"
                      onClick={() => startPracticeMode('inequality')}
                    >
                      Inequality
                    </Button>
                    <Button
                      size="sm"
                      variant={practiceMode === 'variable-both-sides' ? 'default' : 'outline'}
                      className="h-8 px-2.5 text-xs"
                      onClick={() => startPracticeMode('variable-both-sides')}
                    >
                      Both Sides
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
                    <CardTitle className="text-sm">Custom equation/inequality</CardTitle>
                    <CardDescription className="text-xs">
                      Equations: <code>ax+b=c</code>, <code>ax+b=cx+d</code>, <code>x/d+b=c</code>, <code>k(x+m)=n</code><br/>
                      Inequalities: <code>ax+b&lt;c</code>, <code>ax+b&gt;c</code>, <code>ax+b≤c</code>, <code>ax+b≥c</code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex gap-2">
                      <input
                        className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                        value={customEquationInput}
                        onChange={(e) => setCustomEquationInput(e.target.value)}
                        placeholder="4x+8=36 or 3x+5>20"
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
                    {practiceMode === 'linear' 
                      ? 'Linear' 
                      : practiceMode === 'variable-both-sides' 
                      ? 'Both Sides' 
                      : practiceMode === 'inequality'
                      ? 'Inequality'
                      : 'Fraction'}
                  </Badge>
                </div>
                <p className="font-semibold text-base">{getMissionEquationString(mission)}</p>
                <p className="text-[11px] text-muted-foreground">Solved: {solvedMissions}/{missions.length}</p>
              </div>

              {customFlow.awaitingChoice && (
                <Card className="border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {practiceMode === 'inequality' ? 'Custom inequality solved' : 'Custom equation solved'}
                    </CardTitle>
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
                        setStepSuccessMessage('Great. Continue with Mission 2.');
                        setLastWrongCoachKey(null);
                        setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
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
                        setStepSuccessMessage(
                          practiceMode === 'inequality' 
                            ? 'Load another custom inequality when ready.' 
                            : 'Load another custom equation when ready.'
                        );
                        setLastWrongCoachKey(null);
                        setWorkingHistory({ step0a: null, step0b: null, step1: null, step2: null, step3: null, step3intermediate: null });
                        setTeacherKey((k) => k + 1);
                      }}
                    >
                      {practiceMode === 'inequality' ? 'Load another inequality' : 'Load another equation'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <p className="text-[11px] text-muted-foreground">
                Type equations directly and press Enter to check. Spaces are optional.
              </p>

              {hasWorkingHistory && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30">
                  <CardContent className="space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Confirmed Working (Exam Format)
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs gap-1.5"
                        onClick={() => {
                          const working = getFormattedWorking();
                          const text = working.map(step => {
                            const label = step.label;
                            const desc = step.description ? `\n${step.description}` : '';
                            return `${label}${desc}\n\n${step.equation}\n`;
                          }).join('\n');
                          
                          navigator.clipboard.writeText(text).then(() => {
                            setWorkingCopied(true);
                            playLabSound('step-correct');
                            setTimeout(() => setWorkingCopied(false), 2000);
                          }).catch(err => {
                            console.error('Failed to copy:', err);
                          });
                        }}
                      >
                        {workingCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    {getFormattedWorking().map((step, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <span className="bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">{step.label}</span>
                          {step.description && (
                            <span className="text-muted-foreground font-normal italic">{step.description}</span>
                          )}
                        </p>
                        <p className="font-mono text-sm font-medium pl-4 text-slate-900 dark:text-slate-100">
                          {step.equation}
                        </p>
                      </div>
                    ))}
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
                  {practiceMode === 'variable-both-sides' && missionIndex === 0 && step === 'operation' && (
                    <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-700 rounded-md p-2 mb-2">
                      <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                        <span className="text-base">👉</span> START HERE: Enter the operation to eliminate x from the right side
                      </p>
                      <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">
                        Example: To subtract x, type "-" in first box and "x" in second box
                      </p>
                    </div>
                  )}
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
                      placeholder={step === 'operation' ? 'Step 1: value (e.g. 5 or x)' : 'Step 1 complete'}
                      disabled={step !== 'operation'}
                      value={operationSlots.value ?? ''}
                      onChange={(e) => updateTypedSlot('operation-value', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Intermediate Equation Display - Shows unsimplified equation after Step 1 */}
              {intermediateEquation && step === 'equation' && (!bracketFlow.active || bracketFlow.phase === 'done') && (
                <Card className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
                  <CardContent className="pt-3 pb-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                        ✅ After applying the operation to both sides:
                      </p>
                      <div className="bg-white dark:bg-slate-900 rounded-md p-3 border border-amber-200 dark:border-amber-700">
                        <p className="font-mono text-lg font-bold text-center text-slate-900 dark:text-slate-100">
                          {intermediateEquation}
                        </p>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        👇 Now combine the x terms (keep any constants for now)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!bracketFlow.active || bracketFlow.phase === 'done') && (
              <Card className={step === 'equation' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardContent className="space-y-2 pt-3">
                  {practiceMode === 'variable-both-sides' && missionIndex < 2 && step === 'equation' && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 rounded-md p-2 mb-2">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        💡 Tip: Combine like terms but keep the constant. For example, "3x + 6 - x = 10" becomes "2x + 6 = 10" (not "2x = 4")
                      </p>
                    </div>
                  )}
                  <input
                    ref={equationDirectRef}
                    className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                    placeholder={
                      isStep2Locked
                        ? 'Step 2: Result equation (complete Step 1 first)'
                        : practiceMode === 'variable-both-sides'
                        ? 'Step 2: Simplified equation (e.g. 2x=8)'
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
                  {practiceMode === 'variable-both-sides' && intermediateAnswerGiven && (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 rounded-md p-2 mb-2">
                      <p className="text-xs font-medium text-green-700 dark:text-green-300">
                        ✅ Good work on the intermediate step! Now finish by solving for x.
                      </p>
                    </div>
                  )}
                  {practiceMode === 'variable-both-sides' && !intermediateAnswerGiven && step === 'answer' && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 rounded-md p-2 mb-2">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        💡 Flexible: Enter either the intermediate form (e.g., "2x = 4") OR skip directly to the final answer (e.g., "x = 2")
                      </p>
                    </div>
                  )}
                  <input
                    ref={answerDirectRef}
                    className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                    placeholder={
                      isStep3Locked
                        ? 'Step 3: Final answer (complete Step 2 first)'
                        : practiceMode === 'variable-both-sides' && !intermediateAnswerGiven
                        ? 'Step 3: Enter 2x=4 OR x=2 (both accepted)'
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
