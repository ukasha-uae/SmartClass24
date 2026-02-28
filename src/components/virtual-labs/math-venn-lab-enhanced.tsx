'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VennDiagram from '@/components/VennDiagram';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { LabNotes } from '@/components/virtual-labs/LabNotes';
import { useFirebase } from '@/firebase/provider';
import { useEducationLevels } from '@/hooks/useEducationLevels';
import { getMathBandLabel } from '@/lib/math-lab/taxonomy';
import { trackMathLabMetric } from '@/lib/math-lab/metrics';
import { normalizeMathText } from '@/lib/text/normalize-math-text';

type VennCheckpoint = {
  id: string;
  conceptId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const checkpoints: VennCheckpoint[] = [
  {
    id: 'union',
    conceptId: 'sets.operations.union',
    prompt: 'Which region represents A ∪ B?',
    options: ['Only overlap', 'Everything in A or B', 'Only A and not B', 'Outside both circles'],
    correctIndex: 1,
    explanation: 'Union means all elements that belong to either set, including the overlap.',
  },
  {
    id: 'intersection',
    conceptId: 'sets.operations.intersection',
    prompt: 'If 18 learners play football, 12 play basketball, and 7 play both, how many are in A ∩ B?',
    options: ['5', '7', '23', '30'],
    correctIndex: 1,
    explanation: 'A ∩ B is the overlap itself, so it is directly 7.',
  },
  {
    id: 'complement',
    conceptId: 'sets.operations.complement',
    prompt: 'In a class of 40 learners, if 25 are in set A, how many are in A′?',
    options: ['15', '25', '40', '65'],
    correctIndex: 0,
    explanation: 'Complement means not in A, so 40 - 25 = 15.',
  },
];

type VennRegion = 'pool' | 'A' | 'AB' | 'B' | 'U';

const DRAG_ITEMS = ['2', '3', '4', '5', '6', '8', '9', '12'] as const;
const EXPECTED_REGION: Record<(typeof DRAG_ITEMS)[number], Exclude<VennRegion, 'pool'>> = {
  '2': 'A',
  '3': 'B',
  '4': 'A',
  '5': 'U',
  '6': 'AB',
  '8': 'A',
  '9': 'B',
  '12': 'AB',
};

export function MathVennLabEnhanced() {
  const { user } = useFirebase();
  const { labels } = useEducationLevels();
  const [stage, setStage] = useState<'explore' | 'checkpoint' | 'results'>('explore');
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [teacherKey, setTeacherKey] = useState(0);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [selectedMobileItem, setSelectedMobileItem] = useState<string | null>(null);
  const [showTouchAssist, setShowTouchAssist] = useState(false);
  const [placements, setPlacements] = useState<Record<string, VennRegion>>(
    Object.fromEntries(DRAG_ITEMS.map((item) => [item, 'pool' satisfies VennRegion]))
  );
  const [exploreCoachMessage, setExploreCoachMessage] = useState(
    `Welcome to Sets and Venn Lab for ${getMathBandLabel('middle_school', labels)}. Rule set: A = even numbers, B = multiples of 3. Drag each number card into A only, A ∩ B, B only, or Outside.`
  );

  // Hide global header/footer while this experiment is active.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.add('immersive-lesson-mode');
    return () => {
      document.body.classList.remove('immersive-lesson-mode');
    };
  }, []);

  useEffect(() => {
    trackMathLabMetric({
      type: 'station_started',
      stationSlug: 'maths-sets-venn',
      userId: user?.uid,
      conceptId: 'sets.operations.union',
    });
  }, [user?.uid]);

  const middleSchoolLabel = getMathBandLabel('middle_school', labels);
  const currentCheckpoint = checkpoints[checkpointIndex];
  const normalizedPrompt = normalizeMathText(currentCheckpoint.prompt);
  const normalizedOptions = currentCheckpoint.options.map((option) => normalizeMathText(option));
  const normalizedExplanation = normalizeMathText(currentCheckpoint.explanation);
  const score = useMemo(
    () =>
      answers.reduce((acc, value, index) => {
        if (value === checkpoints[index].correctIndex) return acc + 1;
        return acc;
      }, 0),
    [answers]
  );

  const teacherMessage =
    stage === 'explore'
      ? exploreCoachMessage
      : stage === 'checkpoint'
      ? `Checkpoint ${checkpointIndex + 1}: ${normalizedPrompt}`
      : `Excellent work. You scored ${score} out of ${checkpoints.length}. Review any missed concept and write your reasoning in notes.`;

  const placedCount = useMemo(
    () => Object.values(placements).filter((region) => region !== 'pool').length,
    [placements]
  );

  const regionItems = (region: VennRegion) =>
    DRAG_ITEMS.filter((item) => placements[item] === region);

  const moveItemTo = (region: VennRegion, draggedItem?: string) => {
    const itemToMove = draggedItem || draggingItem || selectedMobileItem;
    if (!itemToMove) return;
    if (!DRAG_ITEMS.includes(itemToMove as (typeof DRAG_ITEMS)[number])) return;
    const expected = EXPECTED_REGION[itemToMove as (typeof DRAG_ITEMS)[number]];
    setPlacements((prev) => ({ ...prev, [itemToMove]: region }));
    if (region !== 'pool' && region !== expected) {
      setExploreCoachMessage(
        `Try again for ${itemToMove}. Hint: check whether it is even, a multiple of 3, or both before placing it.`
      );
      setTeacherKey((value) => value + 1);
    }
    setDraggingItem(null);
    setSelectedMobileItem(null);
  };

  const checkDragArrangement = () => {
    const unplaced = DRAG_ITEMS.filter((item) => placements[item] === 'pool');
    if (unplaced.length > 0) {
      setExploreCoachMessage(
        `You still have ${unplaced.length} card(s) not placed: ${unplaced.join(', ')}. Place all cards, then check again.`
      );
      setTeacherKey((value) => value + 1);
      return;
    }

    const wrong = DRAG_ITEMS.filter((item) => placements[item] !== EXPECTED_REGION[item]);
    if (wrong.length === 0) {
      setExploreCoachMessage(
        `Excellent sorting. You correctly placed all ${DRAG_ITEMS.length} cards. A only has ${regionItems('A').join(', ')}, A ∩ B has ${regionItems('AB').join(', ')}, B only has ${regionItems('B').join(', ')}, and Outside has ${regionItems('U').join(', ')}.`
      );
      setTeacherKey((value) => value + 1);
      return;
    }

    const sample = wrong.slice(0, 3).map((item) => `${item} → ${EXPECTED_REGION[item]}`).join(', ');
    setExploreCoachMessage(
      `Good attempt. You got ${DRAG_ITEMS.length - wrong.length} out of ${DRAG_ITEMS.length} correct. Recheck these: ${sample}. Remember: even numbers go to A, multiples of 3 go to B, both rules means A ∩ B.`
    );
    setTeacherKey((value) => value + 1);
  };

  const resetDragBoard = () => {
    setPlacements(Object.fromEntries(DRAG_ITEMS.map((item) => [item, 'pool' satisfies VennRegion])));
    setDraggingItem(null);
    setSelectedMobileItem(null);
    setExploreCoachMessage(
      `Board reset. A = even numbers, B = multiples of 3. Drag each number card and ask me for a hint if needed.`
    );
    setTeacherKey((value) => value + 1);
  };

  const submitAnswer = (optionIndex: number) => {
    if (stage !== 'checkpoint') return;
    const nextAnswers = [...answers, optionIndex];
    const isCorrect = optionIndex === currentCheckpoint.correctIndex;
    setAnswers(nextAnswers);
    trackMathLabMetric({
      type: 'checkpoint_answered',
      stationSlug: 'maths-sets-venn',
      userId: user?.uid,
      conceptId: currentCheckpoint.conceptId,
      isCorrect,
    });

    if (checkpointIndex < checkpoints.length - 1) {
      setCheckpointIndex((value) => value + 1);
    } else {
      setStage('results');
      trackMathLabMetric({
        type: 'station_completed',
        stationSlug: 'maths-sets-venn',
        userId: user?.uid,
        score: Math.round((nextAnswers.filter((v, i) => v === checkpoints[i].correctIndex).length / checkpoints.length) * 100),
        hintCount,
      });
    }
  };

  const requestHint = () => {
    setShowHint(true);
    setHintCount((value) => value + 1);
    trackMathLabMetric({
      type: 'hint_requested',
      stationSlug: 'maths-sets-venn',
      userId: user?.uid,
      conceptId: currentCheckpoint?.conceptId,
      hintCount: hintCount + 1,
    });
  };

  const restart = () => {
    setStage('explore');
    setCheckpointIndex(0);
    setAnswers([]);
    setHintCount(0);
    setShowHint(false);
    resetDragBoard();
    setTeacherKey((value) => value + 1);
  };

  return (
    <div className="space-y-4">
      <TeacherVoice
        message={teacherMessage}
        triggerSpeakKey={teacherKey}
        theme="math"
        teacherName="Math Coach"
        quickActions={[
          {
            label: 'Play instruction',
            onClick: () => setTeacherKey((value) => value + 1),
          },
        ]}
        onHintRequest={stage === 'checkpoint' ? requestHint : undefined}
      />

      <Card className="border border-purple-200 dark:border-purple-800">
        <CardHeader className="p-3 sm:p-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Sets and Venn Lab
            </CardTitle>
            <Badge variant="outline">{middleSchoolLabel} ({'JHS/JSS'})</Badge>
          </div>
          <CardDescription>
            Concept IDs: `sets.operations.union`, `sets.operations.intersection`, `sets.operations.complement`
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-3 pt-0 sm:p-5 sm:pt-0">
          {stage === 'explore' && (
            <>
              <Card className="border-indigo-300 dark:border-indigo-700">
                <CardHeader className="p-3 sm:p-5">
                  <CardTitle className="text-base">Interactive Venn Board (Direct-on-Diagram)</CardTitle>
                  <CardDescription>
                    Premium mode: drag number chips directly onto Venn regions. Rule: <strong>A = even numbers</strong>, <strong>B = multiples of 3</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-3 pt-0 sm:p-5 sm:pt-0">
                  <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-start">
                    <div
                      className="lg:col-span-4 lg:sticky lg:top-20 lg:z-30 space-y-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg"
                    >
                      <div
                        className="min-h-16 max-h-28 sm:max-h-32 overflow-y-auto rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-2.5"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          moveItemTo('pool', e.dataTransfer.getData('text/plain') || undefined);
                        }}
                      >
                    <p className="text-xs text-muted-foreground mb-2">
                      Number cards (always available for correction)
                    </p>
                        <div className="flex flex-wrap gap-2">
                      {DRAG_ITEMS.map((item) => {
                        const region = placements[item];
                        const regionLabel = region === 'pool' ? 'unplaced' : region === 'AB' ? 'A∩B' : region;
                        return (
                          <button
                            key={item}
                            draggable
                            onClick={() => setSelectedMobileItem(item)}
                            onDragStart={(e) => {
                              setDraggingItem(item);
                              e.dataTransfer.setData('text/plain', item);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            className={`px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-500 font-semibold shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-700 hover:ring-2 hover:ring-indigo-400 transition ${
                              selectedMobileItem === item ? 'ring-2 ring-indigo-500' : ''
                            }`}
                            title={`Current: ${regionLabel}`}
                          >
                            {item} <span className="opacity-70 text-[10px]">({regionLabel})</span>
                          </button>
                        );
                      })}
                        </div>
                      </div>

                      <div className="lg:hidden">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start text-xs"
                          onClick={() => setShowTouchAssist((v) => !v)}
                        >
                          {showTouchAssist ? 'Hide touch assist' : 'Need help placing without drag?'}
                        </Button>
                        {showTouchAssist && (
                          <div className="mt-2 rounded-lg border border-indigo-300 dark:border-indigo-700 p-2.5 space-y-2">
                            <p className="text-xs font-medium">Touch assist: tap a value, then tap target region</p>
                            <p className="text-xs text-muted-foreground">
                              Selected: <strong>{selectedMobileItem ?? 'none'}</strong>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Button size="sm" variant="outline" onClick={() => moveItemTo('A')}>Put in A</Button>
                              <Button size="sm" variant="outline" onClick={() => moveItemTo('AB')}>Put in A ∩ B</Button>
                              <Button size="sm" variant="outline" onClick={() => moveItemTo('B')}>Put in B</Button>
                              <Button size="sm" variant="outline" onClick={() => moveItemTo('U')}>Put Outside (U)</Button>
                              <Button size="sm" variant="secondary" className="col-span-2" onClick={() => moveItemTo('pool')}>
                                Return to Number Cards
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="lg:col-span-8 mt-3 lg:mt-0 space-y-3">
                      <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/20 dark:to-transparent p-2 sm:p-3 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-start">
                        <div className="lg:col-span-8 w-full max-w-[520px] sm:max-w-[560px] lg:max-w-[640px] mx-auto lg:mx-0">
                          <VennDiagram
                            type="2set"
                            labels={{ A: 'A', B: 'B', U: 'U' }}
                            values={{
                              A: regionItems('A').length || '',
                              AB: regionItems('AB').length || '',
                              B: regionItems('B').length || '',
                              U: regionItems('U').length || '',
                            }}
                            interactive2Set={{
                              onRegionDrop: (region, item) => moveItemTo(region, item),
                              regionItems: {
                                A: regionItems('A'),
                                AB: regionItems('AB'),
                                B: regionItems('B'),
                                U: regionItems('U'),
                              },
                            }}
                          />
                        </div>
                        <div className="lg:col-span-4 rounded-lg border border-slate-300 dark:border-slate-700 p-3 mt-3 lg:mt-0 space-y-3">
                          <div>
                            <p className="text-xs font-medium mb-1">Drop Guide</p>
                            <p className="text-xs text-muted-foreground">
                              Left circle = A, middle overlap = A ∩ B, right circle = B, outside both circles = U.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Workspace Status</p>
                            <p className="text-sm">
                              Placed: <strong>{placedCount}</strong> / {DRAG_ITEMS.length}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              To correct any value, drag it again from Number cards and drop in the right region.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Coach Strategy</p>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>1) Check even for A.</p>
                              <p>2) Check multiple of 3 for B.</p>
                              <p>3) If both, place in A ∩ B.</p>
                              <p>4) Otherwise place in U.</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <strong>A&apos;</strong> means all elements not in set A.
                          </p>
                      </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" onClick={checkDragArrangement}>
                          Check with Coach ({placedCount}/{DRAG_ITEMS.length})
                        </Button>
                        <Button size="sm" variant="outline" onClick={resetDragBoard} className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Reset Board
                        </Button>
                        <Button size="sm" onClick={() => setStage('checkpoint')}>
                          Start Checkpoints
                        </Button>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </>
          )}

          {stage === 'checkpoint' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Checkpoint {checkpointIndex + 1} of {checkpoints.length}
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
                    Hint
                  </Button>
                  <Button variant="ghost" onClick={() => setTeacherKey((value) => value + 1)}>
                    Replay teacher
                  </Button>
                </div>
                {showHint && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700">
                    <CardContent className="pt-4 text-sm">{normalizedExplanation}</CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {stage === 'results' && (
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  Station Complete
                </CardTitle>
                <CardDescription>
                  Score: {score}/{checkpoints.length} | Hints used: {hintCount}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={restart} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Station
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <LabNotes labId="math-lab-venn" labTitle="Maths Lab - Sets and Venn" />
    </div>
  );
}
