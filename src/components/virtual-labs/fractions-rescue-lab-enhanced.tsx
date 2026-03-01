'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, Target } from 'lucide-react';
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

type FractionsStage = 'explore' | 'checkpoint' | 'intervention' | 'result';
type MisconceptionTag = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

type FractionCheckpoint = {
  id: string;
  conceptId:
    | 'numbers.fractions.part_whole'
    | 'numbers.fractions.equivalence'
    | 'numbers.fractions.compare_unlike'
    | 'numbers.fractions.number_line'
    | 'numbers.fractions.add_subtract_foundation'
    | 'numbers.fractions.percent_decimal_bridge';
  misconceptionTag: MisconceptionTag;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
};

const checkpoints: FractionCheckpoint[] = [
  {
    id: 'part-whole',
    conceptId: 'numbers.fractions.part_whole',
    misconceptionTag: 'M3',
    prompt: 'If 3 out of 8 equal parts are shaded, what fraction is shown?',
    options: ['3/8', '8/3', '5/8', '3/5'],
    correctIndex: 0,
    hint: 'Numerator = shaded parts, denominator = total equal parts.',
    explanation: '3 shaded out of 8 equal parts is exactly 3/8.',
  },
  {
    id: 'equivalent-half',
    conceptId: 'numbers.fractions.equivalence',
    misconceptionTag: 'M4',
    prompt: 'Which fraction is equivalent to 1/2?',
    options: ['2/3', '2/4', '3/4', '1/4'],
    correctIndex: 1,
    hint: 'Multiply top and bottom by the same number.',
    explanation: '1/2 x 2/2 = 2/4, so they represent the same value.',
  },
  {
    id: 'compare-unlike',
    conceptId: 'numbers.fractions.compare_unlike',
    misconceptionTag: 'M1',
    prompt: 'Which is greater: 1/4 or 1/8?',
    options: ['1/8', '1/4', 'They are equal', 'Cannot compare'],
    correctIndex: 1,
    hint: 'Imagine one whole split into 4 parts vs 8 parts.',
    explanation: 'Quarters are larger pieces than eighths, so 1/4 > 1/8.',
  },
  {
    id: 'number-line',
    conceptId: 'numbers.fractions.number_line',
    misconceptionTag: 'M5',
    prompt: 'Where is 5/4 on a number line?',
    options: ['0.25', '0.75', '1.25', '1.75'],
    correctIndex: 2,
    hint: '5/4 = 1 + 1/4.',
    explanation: '5/4 is one whole and one quarter, which is 1.25.',
  },
  {
    id: 'add-foundation',
    conceptId: 'numbers.fractions.add_subtract_foundation',
    misconceptionTag: 'M2',
    prompt: 'What is 1/2 + 1/2?',
    options: ['1', '2/4', '1/4', '2'],
    correctIndex: 0,
    hint: 'Two halves make one whole.',
    explanation: '1/2 + 1/2 = 1 whole.',
  },
  {
    id: 'percent-bridge',
    conceptId: 'numbers.fractions.percent_decimal_bridge',
    misconceptionTag: 'M4',
    prompt: '0.5 is equivalent to which fraction?',
    options: ['1/5', '1/2', '5/2', '2/5'],
    correctIndex: 1,
    hint: '0.5 means five tenths, then simplify.',
    explanation: '0.5 = 5/10 = 1/2.',
  },
];

const interventionMessages: Record<MisconceptionTag, string> = {
  M1: 'Comparison tip: with unit fractions, a bigger denominator means smaller pieces.',
  M2: 'Addition tip: use common denominators first, then add numerators.',
  M3: 'Part-whole tip: denominator is the total equal parts in the whole.',
  M4: 'Equivalent tip: multiply or divide numerator and denominator by the same number.',
  M5: 'Number line tip: convert improper fractions to mixed numbers first.',
};

function getMasteryBand(scorePercent: number): 'needs_support' | 'developing' | 'secure' | 'advanced' {
  if (scorePercent < 50) return 'needs_support';
  if (scorePercent < 70) return 'developing';
  if (scorePercent < 85) return 'secure';
  return 'advanced';
}

export function FractionsRescueLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const { playLabSound } = useLabSoundProfile('maths-fractions-rescue');

  const [stage, setStage] = useState<FractionsStage>('explore');
  const [teacherKey, setTeacherKey] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [misconceptionCounts, setMisconceptionCounts] = useState<Record<MisconceptionTag, number>>({
    M1: 0,
    M2: 0,
    M3: 0,
    M4: 0,
    M5: 0,
  });
  const [interventionTag, setInterventionTag] = useState<MisconceptionTag | null>(null);

  // Explore tools
  const [partsTotal, setPartsTotal] = useState(8);
  const [partsShaded, setPartsShaded] = useState(3);
  const [baseFraction, setBaseFraction] = useState({ numerator: 1, denominator: 2 });
  const [multiplier, setMultiplier] = useState(2);
  const [lineGuess, setLineGuess] = useState(1.2);
  const [lineTarget] = useState(1.25);

  const currentCheckpoint = checkpoints[checkpointIndex];
  const normalizedPrompt = normalizeMathText(currentCheckpoint.prompt);
  const score = useMemo(
    () => answers.reduce((acc, answer, index) => (answer === checkpoints[index].correctIndex ? acc + 1 : acc), 0),
    [answers]
  );
  const scorePercent = Math.round((score / checkpoints.length) * 100);
  const masteryBand = getMasteryBand(scorePercent);
  const middleSchoolLabel = getMathBandLabel('middle_school', labels);

  useEffect(() => {
    trackMathLabMetric({
      type: 'station_started',
      stationSlug: 'maths-fractions-rescue',
      userId: user?.uid,
      conceptId: 'numbers.fractions.part_whole',
    });
  }, [user?.uid]);

  const teacherMessage =
    stage === 'explore'
      ? `Welcome to Fractions Rescue Lab for ${middleSchoolLabel}. Build part-whole intuition, test equivalent fractions, and place values on the number line before checkpoints.`
      : stage === 'checkpoint'
      ? `Checkpoint ${checkpointIndex + 1}: ${normalizedPrompt}`
      : stage === 'intervention' && interventionTag
      ? interventionMessages[interventionTag]
      : `Session complete. You scored ${score} out of ${checkpoints.length}. Mastery band: ${masteryBand.replace('_', ' ')}.`;

  const bumpTeacher = () => setTeacherKey((value) => value + 1);

  const triggerInteractionMetric = (conceptId: FractionCheckpoint['conceptId']) => {
    trackMathLabMetric({
      type: 'interaction_completed',
      stationSlug: 'maths-fractions-rescue',
      userId: user?.uid,
      conceptId,
    });
  };

  const startCheckpoints = () => {
    playLabSound('checkpoint-start');
    setStage('checkpoint');
    setShowHint(false);
    bumpTeacher();
  };

  const requestHint = () => {
    playLabSound('hint');
    setShowHint(true);
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    trackMathLabMetric({
      type: 'hint_requested',
      stationSlug: 'maths-fractions-rescue',
      userId: user?.uid,
      conceptId: currentCheckpoint.conceptId,
      hintCount: nextHintCount,
    });
  };

  const submitAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === currentCheckpoint.correctIndex;
    playLabSound(isCorrect ? 'answer-correct' : 'answer-wrong');

    setAnswers((prev) => [...prev, optionIndex]);
    trackMathLabMetric({
      type: 'checkpoint_answered',
      stationSlug: 'maths-fractions-rescue',
      userId: user?.uid,
      conceptId: currentCheckpoint.conceptId,
      isCorrect,
      misconceptionTag: isCorrect ? undefined : currentCheckpoint.misconceptionTag,
    });

    if (!isCorrect) {
      const tag = currentCheckpoint.misconceptionTag;
      const nextCount = (misconceptionCounts[tag] ?? 0) + 1;
      setMisconceptionCounts((prev) => ({ ...prev, [tag]: nextCount }));
      trackMathLabMetric({
        type: 'misconception_detected',
        stationSlug: 'maths-fractions-rescue',
        userId: user?.uid,
        conceptId: currentCheckpoint.conceptId,
        misconceptionTag: tag,
      });

      if (nextCount >= 2) {
        setInterventionTag(tag);
        setStage('intervention');
        trackMathLabMetric({
          type: 'intervention_triggered',
          stationSlug: 'maths-fractions-rescue',
          userId: user?.uid,
          conceptId: currentCheckpoint.conceptId,
          misconceptionTag: tag,
        });
        bumpTeacher();
        return;
      }
    }

    if (checkpointIndex < checkpoints.length - 1) {
      setCheckpointIndex((prev) => prev + 1);
      setShowHint(false);
      return;
    }

    const finalScore = Math.round(
      ((answers.filter((v, i) => v === checkpoints[i].correctIndex).length + (isCorrect ? 1 : 0)) / checkpoints.length) * 100
    );
    const finalBand = getMasteryBand(finalScore);
    setStage('result');
    playLabSound('complete');
    trackMathLabMetric({
      type: 'station_completed',
      stationSlug: 'maths-fractions-rescue',
      userId: user?.uid,
      score: finalScore,
      hintCount,
      masteryBand: finalBand,
    });
  };

  const resumeAfterIntervention = () => {
    playLabSound('resume');
    setStage('checkpoint');
    setShowHint(true);
    bumpTeacher();
  };

  const restart = () => {
    playLabSound('restart');
    setStage('explore');
    setTeacherKey((value) => value + 1);
    setShowHint(false);
    setHintCount(0);
    setCheckpointIndex(0);
    setAnswers([]);
    setInterventionTag(null);
    setMisconceptionCounts({ M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 });
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
        teacherName="Fractions Coach"
        quickActions={[{ label: 'Replay instruction', onClick: bumpTeacher }]}
        onHintRequest={stage === 'checkpoint' ? requestHint : undefined}
      />

      <Card className="border border-fuchsia-200 dark:border-fuchsia-800">
        <CardHeader className="p-3 sm:p-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle>Fractions Rescue Lab</CardTitle>
            <Badge variant="outline">{middleSchoolLabel} ({'JHS/JSS'})</Badge>
          </div>
          <CardDescription>
            Build confidence with fractions through visual experiments and guided checkpoints.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-3 pt-0 sm:p-5 sm:pt-0">
          {stage === 'explore' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Explore 1: Part-Whole Builder</CardTitle>
                  <CardDescription>
                    Adjust shaded parts and observe the fraction representation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total parts</p>
                      <input
                        type="range"
                        min={2}
                        max={12}
                        value={partsTotal}
                        onChange={(e) => {
                          const nextTotal = Number(e.target.value);
                          setPartsTotal(nextTotal);
                          setPartsShaded((prev) => Math.min(prev, nextTotal));
                          triggerInteractionMetric('numbers.fractions.part_whole');
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Shaded parts</p>
                      <input
                        type="range"
                        min={0}
                        max={partsTotal}
                        value={partsShaded}
                        onChange={(e) => {
                          setPartsShaded(Number(e.target.value));
                          triggerInteractionMetric('numbers.fractions.part_whole');
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    Fraction: {partsShaded}/{partsTotal}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: partsTotal }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-5 rounded ${index < partsShaded ? 'bg-fuchsia-500' : 'bg-fuchsia-100 dark:bg-fuchsia-900/30'}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Explore 2: Equivalent Fraction Machine</CardTitle>
                  <CardDescription>Multiply numerator and denominator by the same factor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { numerator: 1, denominator: 2 },
                      { numerator: 2, denominator: 3 },
                      { numerator: 3, denominator: 4 },
                    ].map((seed) => (
                      <Button
                        key={`${seed.numerator}/${seed.denominator}`}
                        variant={
                          baseFraction.numerator === seed.numerator && baseFraction.denominator === seed.denominator
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          setBaseFraction(seed);
                          triggerInteractionMetric('numbers.fractions.equivalence');
                        }}
                      >
                        {seed.numerator}/{seed.denominator}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Multiplier: x{multiplier}</p>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={multiplier}
                      onChange={(e) => {
                        setMultiplier(Number(e.target.value));
                        triggerInteractionMetric('numbers.fractions.equivalence');
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm font-semibold">
                    {baseFraction.numerator}/{baseFraction.denominator} ={' '}
                    {baseFraction.numerator * multiplier}/{baseFraction.denominator * multiplier}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Explore 3: Number Line Placement</CardTitle>
                  <CardDescription>Try placing 5/4 on a number line from 0 to 2.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lineGuess}
                    onChange={(e) => {
                      setLineGuess(Number(e.target.value));
                      triggerInteractionMetric('numbers.fractions.number_line');
                    }}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                  </div>
                  <div className="text-sm">
                    Your guess: <span className="font-semibold">{lineGuess.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const closeEnough = Math.abs(lineGuess - lineTarget) <= 0.1;
                      playLabSound(closeEnough ? 'answer-correct' : 'answer-wrong');
                      setTeacherKey((value) => value + 1);
                    }}
                  >
                    Check placement
                  </Button>
                </CardContent>
              </Card>

              <Button onClick={startCheckpoints} className="w-full">
                Start Guided Checkpoints
              </Button>
            </div>
          )}

          {stage === 'checkpoint' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Checkpoint {checkpointIndex + 1} of {checkpoints.length}
                </CardTitle>
                <CardDescription>{normalizeMathText(currentCheckpoint.prompt)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentCheckpoint.options.map((option, index) => (
                  <Button key={option} variant="outline" className="w-full justify-start" onClick={() => submitAnswer(index)}>
                    {String.fromCharCode(65 + index)}. {normalizeMathText(option)}
                  </Button>
                ))}
                {showHint && (
                  <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" /> Hint
                    </p>
                    <p className="text-amber-900 dark:text-amber-200 mt-1">{normalizeMathText(currentCheckpoint.hint)}</p>
                  </div>
                )}
                <Button variant="ghost" className="w-full" onClick={requestHint}>
                  Need a hint
                </Button>
              </CardContent>
            </Card>
          )}

          {stage === 'intervention' && interventionTag && (
            <Card className="border-orange-300 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  Intervention Mode
                </CardTitle>
                <CardDescription>
                  We noticed a repeated pattern. Let&apos;s repair this concept quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-orange-300 bg-orange-50 p-3 text-sm dark:border-orange-800 dark:bg-orange-950/30">
                  {interventionMessages[interventionTag]}
                </div>
                <div className="text-sm text-muted-foreground">
                  Coach note: {normalizeMathText(currentCheckpoint.explanation)}
                </div>
                <Button onClick={resumeAfterIntervention} className="w-full">
                  Retry checkpoint with support
                </Button>
              </CardContent>
            </Card>
          )}

          {stage === 'result' && (
            <Card className="border-emerald-300 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Fractions Lab Result
                </CardTitle>
                <CardDescription>Mastery summary and next action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-semibold">{score}/{checkpoints.length}</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Percent</p>
                    <p className="font-semibold">{scorePercent}%</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Band</p>
                    <p className="font-semibold capitalize">{masteryBand.replace('_', ' ')}</p>
                  </div>
                </div>
                <Button onClick={restart} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart Lab
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
