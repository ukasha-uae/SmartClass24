'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import {
  DiscriminantExplorerAnimation,
  FactorizationSolverAnimation,
} from '@/components/QuadraticAnimations';
import { useFirebase } from '@/firebase/provider';
import { useEducationLevels } from '@/hooks/useEducationLevels';
import { getMathBandLabel } from '@/lib/math-lab/taxonomy';
import { trackMathLabMetric } from '@/lib/math-lab/metrics';
import { LabNotes } from '@/components/virtual-labs/LabNotes';
import { normalizeMathText } from '@/lib/text/normalize-math-text';

type EquationCheckpoint = {
  id: string;
  conceptId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  misconceptionHint: string;
};

const checkpoints: EquationCheckpoint[] = [
  {
    id: 'factorization',
    conceptId: 'algebra.quadratic.factorization',
    prompt: 'For x² + 7x + 12 = 0, which pair is used in factorization?',
    options: ['3 and 4', '-3 and -4', '6 and 2', '-6 and -2'],
    correctIndex: 0,
    misconceptionHint: 'Look for two numbers that multiply to +12 and add to +7.',
  },
  {
    id: 'discriminant_positive',
    conceptId: 'algebra.quadratic.discriminant',
    prompt: 'If Δ = b² - 4ac is positive, what can you conclude?',
    options: [
      'No real roots',
      'One repeated real root',
      'Two distinct real roots',
      'No solution at all',
    ],
    correctIndex: 2,
    misconceptionHint: 'A positive discriminant means the parabola intersects the x-axis twice.',
  },
  {
    id: 'linear_isolation',
    conceptId: 'algebra.linear.solve',
    prompt: 'If 3x - 9 = 0, what is x?',
    options: ['-3', '0', '3', '9'],
    correctIndex: 2,
    misconceptionHint: 'Add 9 first, then divide by 3.',
  },
];

export function EquationAnimationLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const [stage, setStage] = useState<'explore' | 'checkpoint' | 'result'>('explore');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [teacherKey, setTeacherKey] = useState(0);
  const [exploreView, setExploreView] = useState<'factorization' | 'discriminant'>('factorization');
  const [exploreNarration, setExploreNarration] = useState(
    `Welcome to Equation Animation Lab for ${getMathBandLabel('high_school', labels)}. Start with factorization, then explore the discriminant to understand root behavior.`
  );

  useEffect(() => {
    trackMathLabMetric({
      type: 'station_started',
      stationSlug: 'maths-equation-animation',
      userId: user?.uid,
      conceptId: 'algebra.quadratic.factorization',
    });
  }, [user?.uid]);

  const highSchoolLabel = getMathBandLabel('high_school', labels);
  const factorizationIntro = `Factorization track: follow each step to split the quadratic into two brackets and solve for x with the zero product rule.`;
  const discriminantIntro = `Discriminant track: compute b squared minus 4ac and use it to predict how many real roots the equation has.`;
  const checkpoint = checkpoints[questionIndex];
  const normalizedPrompt = normalizeMathText(checkpoint.prompt);
  const normalizedOptions = checkpoint.options.map((option) => normalizeMathText(option));
  const normalizedHint = normalizeMathText(checkpoint.misconceptionHint);
  const score = useMemo(
    () => answers.reduce((acc, answer, index) => (answer === checkpoints[index].correctIndex ? acc + 1 : acc), 0),
    [answers]
  );

  useEffect(() => {
    if (stage !== 'explore') return;
    const nextMessage = exploreView === 'factorization' ? factorizationIntro : discriminantIntro;
    setExploreNarration(nextMessage);
    setTeacherKey((value) => value + 1);
  }, [exploreView, stage]);

  const teacherMessage =
    stage === 'explore'
      ? exploreNarration
      : stage === 'checkpoint'
      ? `Checkpoint ${questionIndex + 1}: ${normalizedPrompt}`
      : `Great effort. You scored ${score} out of ${checkpoints.length}. If needed, replay the animations and focus on discriminant logic.`;

  const submitAnswer = (optionIndex: number) => {
    if (stage !== 'checkpoint') return;
    const nextAnswers = [...answers, optionIndex];
    const isCorrect = optionIndex === checkpoint.correctIndex;
    setAnswers(nextAnswers);
    trackMathLabMetric({
      type: 'checkpoint_answered',
      stationSlug: 'maths-equation-animation',
      userId: user?.uid,
      conceptId: checkpoint.conceptId,
      isCorrect,
    });

    if (questionIndex < checkpoints.length - 1) {
      setQuestionIndex((value) => value + 1);
      setShowHint(false);
    } else {
      const percentage = Math.round(
        (nextAnswers.filter((value, index) => value === checkpoints[index].correctIndex).length / checkpoints.length) *
          100
      );
      setStage('result');
      trackMathLabMetric({
        type: 'station_completed',
        stationSlug: 'maths-equation-animation',
        userId: user?.uid,
        score: percentage,
        hintCount,
      });
    }
  };

  const requestHint = () => {
    if (stage !== 'checkpoint') return;
    setShowHint(true);
    setHintCount((value) => value + 1);
    trackMathLabMetric({
      type: 'hint_requested',
      stationSlug: 'maths-equation-animation',
      userId: user?.uid,
      conceptId: checkpoint.conceptId,
      hintCount: hintCount + 1,
    });
  };

  const restart = () => {
    setStage('explore');
    setQuestionIndex(0);
    setAnswers([]);
    setHintCount(0);
    setShowHint(false);
    setTeacherKey((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <TeacherVoice
        message={teacherMessage}
        triggerSpeakKey={teacherKey}
        autoPlay
        theme="math"
        teacherName="Algebra Coach"
        quickActions={[
          {
            label: 'Replay instruction',
            onClick: () => setTeacherKey((value) => value + 1),
          },
        ]}
        onHintRequest={stage === 'checkpoint' ? requestHint : undefined}
      />

      <Card className="border-2 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle>Equation Animation Lab</CardTitle>
            <Badge variant="outline">{highSchoolLabel} ({'SHS/SSS'})</Badge>
          </div>
          <CardDescription>
            Concept IDs: `algebra.linear.solve`, `algebra.quadratic.factorization`, `algebra.quadratic.discriminant`
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {stage === 'explore' && (
            <>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={exploreView === 'factorization' ? 'default' : 'outline'}
                  onClick={() => setExploreView('factorization')}
                >
                  Factorization track
                </Button>
                <Button
                  variant={exploreView === 'discriminant' ? 'default' : 'outline'}
                  onClick={() => setExploreView('discriminant')}
                >
                  Discriminant track
                </Button>
              </div>
              {exploreView === 'factorization' ? (
                <FactorizationSolverAnimation
                  a={1}
                  b={7}
                  c={12}
                  narrationMode="external"
                  onNarrationChange={(text) => setExploreNarration(normalizeMathText(text))}
                />
              ) : (
                <DiscriminantExplorerAnimation
                  a={2}
                  b={5}
                  c={2}
                  narrationMode="external"
                  onNarrationChange={(text) => setExploreNarration(normalizeMathText(text))}
                />
              )}
              <Button onClick={() => setStage('checkpoint')} className="w-full">
                Start Guided Checkpoints
              </Button>
            </>
          )}

          {stage === 'checkpoint' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Checkpoint {questionIndex + 1} of {checkpoints.length}
                </CardTitle>
                <CardDescription>{normalizedPrompt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {normalizedOptions.map((option, optionIndex) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => submitAnswer(optionIndex)}
                  >
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Button>
                ))}
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={requestHint} className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Misconception Hint
                  </Button>
                  <Button variant="ghost" onClick={() => setTeacherKey((value) => value + 1)}>
                    Replay teacher
                  </Button>
                </div>
                {showHint && (
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700">
                    <CardContent className="pt-4 text-sm">{normalizedHint}</CardContent>
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
                  Station Complete
                </CardTitle>
                <CardDescription>
                  Score: {score}/{checkpoints.length} | Hints used: {hintCount}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={restart} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Station
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <LabNotes labId="math-lab-equations" labTitle="Maths Lab - Equation Animation" />
    </div>
  );
}
