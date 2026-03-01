'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { normalizeMathText } from '@/lib/text/normalize-math-text';

type StepKey = 'operation' | 'equation' | 'answer';

type Mission = {
  id: string;
  equation: string;
  conceptId: 'algebra.linear.solve';
  operationExpected: { symbol: '+' | '-'; value: string };
  equationExpected: [string, string, string, string];
  answerExpected: [string, string, string];
  tokenBank: string[];
  hint: string;
};

type Checkpoint = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
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
    'Intervention: once ax = n, divide both sides by a. Check the sign of the final answer before confirming.',
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

const WALKTHROUGH_STEPS = [
  {
    title: 'Step 1 (Inverse operation)',
    line: '2x + 3 = 11  ->  subtract 3 on both sides',
    result: '2x = 8',
  },
  {
    title: 'Step 2 (Isolate variable)',
    line: '2x = 8  ->  divide both sides by 2',
    result: 'x = 4',
  },
  {
    title: 'Step 3 (Verify quickly)',
    line: 'Substitute x = 4 into 2x + 3',
    result: '2(4) + 3 = 11  so solution is correct',
  },
] as const;

function uniqueList(values: string[]) {
  return Array.from(new Set(values));
}

function randFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildMission(id: string, a: number, b: number, x: number): Mission {
  const c = a * x + b;
  const operationSymbol: '+' | '-' = b >= 0 ? '-' : '+';
  const operationValue = String(Math.abs(b));
  const rhs = String(a * x);
  const xString = String(x);
  const equation =
    b >= 0 ? `${a}x + ${Math.abs(b)} = ${c}` : `${a}x - ${Math.abs(b)} = ${c}`;

  const distractors = [String(c + 1), String(c - 1), String(x + 1), String(a + 1)];
  const tokenBank = uniqueList([
    'x',
    '=',
    '+',
    '-',
    String(a),
    String(Math.abs(b)),
    String(c),
    rhs,
    xString,
    ...distractors,
  ]);

  return {
    id,
    equation,
    conceptId: 'algebra.linear.solve',
    operationExpected: { symbol: operationSymbol, value: operationValue },
    equationExpected: [String(a), 'x', '=', rhs],
    answerExpected: ['x', '=', xString],
    tokenBank,
    hint:
      b >= 0
        ? `Undo +${Math.abs(b)} first by subtracting ${Math.abs(b)} from both sides, then divide by ${a}.`
        : `Undo -${Math.abs(b)} first by adding ${Math.abs(b)} to both sides, then divide by ${a}.`,
  };
}

function generateMissionVariants(count = 4): Mission[] {
  const as = [2, 3, 4, 5];
  const bs = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9];
  const xs = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const generated: Mission[] = [];
  const seen = new Set<string>();

  let attempts = 0;
  while (generated.length < count && attempts < 80) {
    attempts += 1;
    const a = randFrom(as);
    const b = randFrom(bs);
    const x = randFrom(xs);
    const c = a * x + b;
    if (Math.abs(c) > 40) continue;
    const key = `${a}|${b}|${x}`;
    if (seen.has(key)) continue;
    seen.add(key);
    generated.push(buildMission(`m${generated.length + 1}`, a, b, x));
  }

  if (generated.length < count) {
    const fallback = [
      buildMission('fallback-1', 2, 3, 4),
      buildMission('fallback-2', 3, -5, 7),
      buildMission('fallback-3', 4, 6, -1),
      buildMission('fallback-4', 5, -8, 3),
    ];
    for (const mission of fallback) {
      if (generated.length >= count) break;
      generated.push(mission);
    }
  }

  return generated;
}

export function EquationBuilderLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const { playLabSound } = useLabSoundProfile('maths-equation-builder');
  const [missions] = useState<Mission[]>(() => generateMissionVariants(4));

  const [stage, setStage] = useState<'build' | 'checkpoint' | 'result'>('build');
  const [missionIndex, setMissionIndex] = useState(0);
  const [step, setStep] = useState<StepKey>('operation');
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughIndex, setWalkthroughIndex] = useState(0);
  const [useTypedInput, setUseTypedInput] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [stepSuccessMessage, setStepSuccessMessage] = useState<string | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
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
  const [equationSlots, setEquationSlots] = useState<Array<string | null>>([null, null, null, null]);
  const [answerSlots, setAnswerSlots] = useState<Array<string | null>>([null, null, null]);

  const mission = missions[missionIndex];
  const checkpoint = checkpoints[checkpointIndex];
  const middleSchoolLabel = getMathBandLabel('middle_school', labels);
  const solvedMissions = missionIndex + (stage === 'build' && step === 'operation' ? 0 : 1) + (stage !== 'build' ? 1 : 0);
  const checkpointScore = useMemo(
    () =>
      checkpointAnswers.reduce((acc, answer, index) => {
        if (answer === checkpoints[index].correctIndex) return acc + 1;
        return acc;
      }, 0),
    [checkpointAnswers]
  );
  const walkthroughStep = WALKTHROUGH_STEPS[walkthroughIndex];

  useEffect(() => {
    trackMathLabMetric({
      type: 'station_started',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: 'algebra.linear.solve',
    });
  }, [user?.uid]);

  useEffect(() => {
    if (stage !== 'build' || !showWalkthrough) return;
    const timer = setInterval(() => {
      setWalkthroughIndex((value) => (value + 1) % WALKTHROUGH_STEPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [stage, showWalkthrough]);

  useEffect(() => {
    if (stage !== 'build') return;
    if (step === 'operation') {
      if (operationSlots.symbol && operationSlots.value) {
        setStepSuccessMessage('Step 1 ready. Tap "Check Step" to confirm and move to Step 2.');
      } else {
        setStepSuccessMessage(null);
      }
      return;
    }
    if (step === 'equation') {
      const filled = equationSlots.filter(Boolean).length;
      if (filled === equationSlots.length) {
        setStepSuccessMessage('Step 2 ready. Tap "Check Step" to confirm and move to Step 3.');
      } else {
        setStepSuccessMessage(null);
      }
      return;
    }
    const filled = answerSlots.filter(Boolean).length;
    if (filled === answerSlots.length) {
      setStepSuccessMessage('Step 3 ready. Tap "Check Step" to finish this mission.');
    } else {
      setStepSuccessMessage(null);
    }
  }, [stage, step, operationSlots, equationSlots, answerSlots]);

  useEffect(() => {
    if (stage !== 'build') return;
    if (!isCurrentStepCorrect()) return;

    setStepFeedback(null);
    setStepSuccessMessage('Correct detected. Advancing automatically...');

    const timer = setTimeout(() => {
      checkStep();
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, step, operationSlots, equationSlots, answerSlots, isAutoAdvancing]);

  const teacherMessage =
    stage === 'build'
      ? interventionMessage
        ? interventionMessage
        : step === 'operation'
        ? `Mission ${missionIndex + 1}: ${mission.equation}. Drag the inverse operation to apply on both sides.`
        : step === 'equation'
        ? `Great. Now drag tokens to build the resulting equation after that operation.`
        : `Final step: drag tokens to show the solved value of x.`
      : stage === 'checkpoint'
      ? `Checkpoint ${checkpointIndex + 1}: ${normalizeMathText(checkpoint.prompt)}`
      : `Excellent work. You solved ${missions.length} equation missions and scored ${checkpointScore}/${checkpoints.length} in checkpoints.`;

  const takeTokenFromOtherSlots = (token: string) => {
    setOperationSlots((prev) => ({
      symbol: prev.symbol === token ? null : prev.symbol,
      value: prev.value === token ? null : prev.value,
    }));
    setEquationSlots((prev) => prev.map((slot) => (slot === token ? null : slot)));
    setAnswerSlots((prev) => prev.map((slot) => (slot === token ? null : slot)));
  };

  const isNumericToken = (token: string) => /^-?\d+$/.test(token);
  const cleanToken = (token: string) => token.trim();

  const isCurrentStepCorrect = () => {
    if (step === 'operation') {
      return (
        cleanToken(operationSlots.symbol ?? '') === mission.operationExpected.symbol &&
        cleanToken(operationSlots.value ?? '') === mission.operationExpected.value
      );
    }
    if (step === 'equation') {
      return equationSlots.every((slot, i) => cleanToken(slot ?? '') === mission.equationExpected[i]);
    }
    return answerSlots.every((slot, i) => cleanToken(slot ?? '') === mission.answerExpected[i]);
  };

  const placeToken = (
    target: 'operation-symbol' | 'operation-value' | 'equation' | 'answer',
    index?: number,
    incomingToken?: string
  ) => {
    const token = incomingToken ?? selectedToken;
    if (!token) return;
    const normalizedToken = cleanToken(token);

    // Step-1 guardrails: keep first-time flow clear and prevent confusing placements.
    if (step === 'operation' && target === 'operation-symbol' && !['+', '-'].includes(normalizedToken)) {
      setStepFeedback('Step 1 left slot accepts only + or -.');
      setStepSuccessMessage(null);
      playLabSound('step-wrong');
      return;
    }
    if (step === 'operation' && target === 'operation-value' && !isNumericToken(normalizedToken)) {
      setStepFeedback('Step 1 right slot accepts numbers only (for example 3, 5, 8).');
      setStepSuccessMessage(null);
      playLabSound('step-wrong');
      return;
    }

    setStepFeedback(null);
    setSelectedToken(normalizedToken);
    takeTokenFromOtherSlots(normalizedToken);
    playLabSound('tile-place');

    if (target === 'operation-symbol') {
      setOperationSlots((prev) => ({ ...prev, symbol: normalizedToken }));
      return;
    }
    if (target === 'operation-value') {
      setOperationSlots((prev) => ({ ...prev, value: normalizedToken }));
      return;
    }
    if (target === 'equation' && index !== undefined) {
      setEquationSlots((prev) => prev.map((slot, i) => (i === index ? normalizedToken : slot)));
      return;
    }
    if (target === 'answer' && index !== undefined) {
      setAnswerSlots((prev) => prev.map((slot, i) => (i === index ? normalizedToken : slot)));
    }
  };

  const handleTokenDragStart = (token: string) => (e: React.DragEvent<HTMLButtonElement>) => {
    setSelectedToken(token);
    e.dataTransfer.setData('text/plain', token);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSlotDrop =
    (target: 'operation-symbol' | 'operation-value' | 'equation' | 'answer', index?: number) =>
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      const droppedToken = e.dataTransfer.getData('text/plain') || selectedToken;
      if (!droppedToken) return;
      placeToken(target, index, droppedToken);
    };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => e.preventDefault();

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
      setOperationSlots((prev) => ({ ...prev, symbol: token || null }));
      return;
    }
    if (target === 'operation-value') {
      setOperationSlots((prev) => ({ ...prev, value: token || null }));
      return;
    }
    if (target === 'equation' && index !== undefined) {
      setEquationSlots((prev) => prev.map((slot, i) => (i === index ? (token || null) : slot)));
      return;
    }
    if (target === 'answer' && index !== undefined) {
      setAnswerSlots((prev) => prev.map((slot, i) => (i === index ? (token || null) : slot)));
    }
  };

  const resetStep = () => {
    if (step === 'operation') setOperationSlots({ symbol: null, value: null });
    if (step === 'equation') setEquationSlots([null, null, null, null]);
    if (step === 'answer') setAnswerSlots([null, null, null]);
    setSelectedToken(null);
    setStepFeedback(null);
    setStepSuccessMessage(null);
  };

  const handleWrongStep = (stepKey: StepKey) => {
    const nextCount = mistakeCounts[stepKey] + 1;
    setMistakeCounts((prev) => ({ ...prev, [stepKey]: nextCount }));
    setShowHint(true);
    trackMathLabMetric({
      type: 'misconception_detected',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission.conceptId,
      misconceptionTag: MISCONCEPTION_TAGS[stepKey],
    });

    if (nextCount >= 2) {
      setInterventionMessage(INTERVENTION_MESSAGES[stepKey]);
      setTeacherKey((k) => k + 1);
      trackMathLabMetric({
        type: 'intervention_triggered',
        stationSlug: 'maths-equation-builder',
        userId: user?.uid,
        conceptId: mission.conceptId,
        misconceptionTag: MISCONCEPTION_TAGS[stepKey],
      });
    }
  };

  const clearInterventionForStep = (stepKey: StepKey) => {
    setMistakeCounts((prev) => ({ ...prev, [stepKey]: 0 }));
    setInterventionMessage(null);
  };

  const checkStep = () => {
    if (step === 'operation') {
      const ok =
        operationSlots.symbol === mission.operationExpected.symbol && operationSlots.value === mission.operationExpected.value;
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
      setStep('equation');
      setStepFeedback(null);
      setTeacherKey((k) => k + 1);
      return;
    }

    if (step === 'equation') {
      const ok = equationSlots.every((slot, i) => slot === mission.equationExpected[i]);
      playLabSound(ok ? 'step-correct' : 'step-wrong');
      if (!ok) {
        handleWrongStep('equation');
        return;
      }
      clearInterventionForStep('equation');
      setStepSuccessMessage('Correct. Step 2 confirmed. Continue with Step 3.');
      trackMathLabMetric({
        type: 'interaction_completed',
        stationSlug: 'maths-equation-builder',
        userId: user?.uid,
        conceptId: mission.conceptId,
      });
      setStep('answer');
      setStepFeedback(null);
      setTeacherKey((k) => k + 1);
      return;
    }

    const ok = answerSlots.every((slot, i) => slot === mission.answerExpected[i]);
    playLabSound(ok ? 'step-correct' : 'step-wrong');
    if (!ok) {
      handleWrongStep('answer');
      return;
    }
    clearInterventionForStep('answer');
    setStepSuccessMessage('Excellent. Mission solved correctly.');
    trackMathLabMetric({
      type: 'interaction_completed',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      conceptId: mission.conceptId,
    });

    if (missionIndex < missions.length - 1) {
      setMissionIndex((i) => i + 1);
      setStep('operation');
      setOperationSlots({ symbol: null, value: null });
      setEquationSlots([null, null, null, null]);
      setAnswerSlots([null, null, null]);
      setSelectedToken(null);
      setStepFeedback(null);
      setStepSuccessMessage(null);
      setShowHint(false);
      setInterventionMessage(null);
      setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
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
    setStage('result');
    trackMathLabMetric({
      type: 'station_completed',
      stationSlug: 'maths-equation-builder',
      userId: user?.uid,
      score: Math.round((next.filter((a, i) => a === checkpoints[i].correctIndex).length / checkpoints.length) * 100),
      hintCount,
    });
  };

  const restart = () => {
    playLabSound('restart');
    setStage('build');
    setMissionIndex(0);
    setStep('operation');
    setOperationSlots({ symbol: null, value: null });
    setEquationSlots([null, null, null, null]);
    setAnswerSlots([null, null, null]);
    setSelectedToken(null);
    setStepFeedback(null);
    setStepSuccessMessage(null);
    setShowHint(false);
    setInterventionMessage(null);
    setMistakeCounts({ operation: 0, equation: 0, answer: 0 });
    setHintCount(0);
    setCheckpointIndex(0);
    setCheckpointAnswers([]);
    setTeacherKey((k) => k + 1);
  };

  return (
    <div className="space-y-4">
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
        <CardHeader className="p-3 sm:p-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle>Equation Builder Lab</CardTitle>
            <Badge variant="outline">{middleSchoolLabel} ({'JHS/JSS'})</Badge>
          </div>
          <CardDescription>
            Drag numbers and symbols to perform inverse operations and solve linear equations step-by-step.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-3 pt-0 sm:p-5 sm:pt-0">
          {stage === 'build' && (
            <>
              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base">How to solve (animated example)</CardTitle>
                    <Badge variant="secondary">First-timer helper</Badge>
                  </div>
                  <CardDescription>
                    Watch this mini walkthrough, then solve your mission with drag-and-drop.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showWalkthrough ? (
                    <>
                      <div className="rounded-md border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 p-3">
                        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                          {walkthroughStep.title}
                        </p>
                        <p className="text-sm mt-1">{walkthroughStep.line}</p>
                        <p className="text-sm font-semibold mt-1">{walkthroughStep.result}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {WALKTHROUGH_STEPS.map((stepItem, index) => (
                          <div
                            key={stepItem.title}
                            className={`rounded-md border p-2 transition ${
                              walkthroughIndex === index
                                ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {stepItem.title}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Walkthrough hidden. You can show it again any time.</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowWalkthrough(true);
                        setWalkthroughIndex(0);
                      }}
                    >
                      Replay walkthrough
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWalkthrough((value) => !value)}
                    >
                      {showWalkthrough ? 'Hide walkthrough' : 'Show walkthrough'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-cyan-200 dark:border-cyan-800 p-3 space-y-2">
                <p className="text-xs text-muted-foreground">Mission {missionIndex + 1} of {missions.length}</p>
                <p className="font-semibold text-lg">{mission.equation}</p>
                <p className="text-xs text-muted-foreground">Solved missions: {solvedMissions}/{missions.length}</p>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base">Input Mode</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={!useTypedInput ? 'default' : 'outline'}
                        onClick={() => setUseTypedInput(false)}
                      >
                        Drag & drop
                      </Button>
                      <Button
                        size="sm"
                        variant={useTypedInput ? 'default' : 'outline'}
                        onClick={() => setUseTypedInput(true)}
                      >
                        Type values
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {useTypedInput
                      ? 'Type directly in each slot for faster solving.'
                      : 'Drag token to slot, or tap token then tap slot.'}
                  </CardDescription>
                </CardHeader>
                {!useTypedInput && (
                  <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {mission.tokenBank.map((token) => (
                        <Button
                          key={token}
                          variant={selectedToken === token ? 'default' : 'outline'}
                          className="h-10 text-sm"
                          onClick={() => setSelectedToken(token)}
                          draggable
                          onDragStart={handleTokenDragStart(token)}
                        >
                          {token}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={step === 'operation' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 1: Choose inverse operation</CardTitle>
                  <CardDescription>
                    Apply this operation on both sides of the equation. Left slot = `+` or `-`, right slot = number.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                      {useTypedInput ? (
                        <>
                          <input
                            className="min-w-20 h-10 rounded-md border bg-background px-3 text-sm"
                            placeholder="+ or -"
                            disabled={step !== 'operation'}
                            value={operationSlots.symbol ?? ''}
                            onChange={(e) => updateTypedSlot('operation-symbol', e.target.value)}
                          />
                          <input
                            className="min-w-20 h-10 rounded-md border bg-background px-3 text-sm"
                            placeholder="number"
                            disabled={step !== 'operation'}
                            value={operationSlots.value ?? ''}
                            onChange={(e) => updateTypedSlot('operation-value', e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            className="min-w-20"
                            disabled={step !== 'operation'}
                            onClick={() => placeToken('operation-symbol')}
                            onDragOver={step === 'operation' ? onDragOver : undefined}
                            onDrop={step === 'operation' ? handleSlotDrop('operation-symbol') : undefined}
                          >
                            {operationSlots.symbol ?? 'symbol'}
                          </Button>
                          <Button
                            variant="secondary"
                            className="min-w-20"
                            disabled={step !== 'operation'}
                            onClick={() => placeToken('operation-value')}
                            onDragOver={step === 'operation' ? onDragOver : undefined}
                            onDrop={step === 'operation' ? handleSlotDrop('operation-value') : undefined}
                          >
                            {operationSlots.value ?? 'value'}
                          </Button>
                        </>
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card className={step === 'equation' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 2: Build the resulting equation</CardTitle>
                  <CardDescription>
                    Drag tokens into the correct order.
                    {step === 'operation' ? ' (Unlocks after Step 1 is correct)' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {equationSlots.map((slot, index) => (
                      useTypedInput ? (
                        <input
                          key={index}
                          className="h-12 rounded-md border bg-background px-2 text-center text-sm"
                          placeholder="..."
                          disabled={step !== 'equation'}
                          value={slot ?? ''}
                          onChange={(e) => updateTypedSlot('equation', e.target.value, index)}
                        />
                      ) : (
                        <Button
                          key={index}
                          variant="secondary"
                          className="h-12"
                          disabled={step !== 'equation'}
                          onClick={() => placeToken('equation', index)}
                          onDragOver={step === 'equation' ? onDragOver : undefined}
                          onDrop={step === 'equation' ? handleSlotDrop('equation', index) : undefined}
                        >
                          {slot ?? '...'}
                        </Button>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={step === 'answer' ? 'border-cyan-400 dark:border-cyan-700' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 3: Build final answer</CardTitle>
                  <CardDescription>
                    Show the solved value for x.
                    {step !== 'answer' ? ' (Unlocks after Step 2 is correct)' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {answerSlots.map((slot, index) => (
                      useTypedInput ? (
                        <input
                          key={index}
                          className="h-12 rounded-md border bg-background px-2 text-center text-sm"
                          placeholder="..."
                          disabled={step !== 'answer'}
                          value={slot ?? ''}
                          onChange={(e) => updateTypedSlot('answer', e.target.value, index)}
                        />
                      ) : (
                        <Button
                          key={index}
                          variant="secondary"
                          className="h-12"
                          disabled={step !== 'answer'}
                          onClick={() => placeToken('answer', index)}
                          onDragOver={step === 'answer' ? onDragOver : undefined}
                          onDrop={step === 'answer' ? handleSlotDrop('answer', index) : undefined}
                        >
                          {slot ?? '...'}
                        </Button>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>

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
