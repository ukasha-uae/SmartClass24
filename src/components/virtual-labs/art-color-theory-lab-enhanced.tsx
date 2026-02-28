'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Lightbulb, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { LabNotes } from '@/components/virtual-labs/LabNotes';

type Pigment = 'red' | 'yellow' | 'blue';
type Stage = 'explore' | 'checkpoint' | 'result';
type PosterToken = 'headline' | 'subhead' | 'cta';
type PosterZone = 'top' | 'middle' | 'bottom';

type ArtCheckpoint = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const checkpoints: ArtCheckpoint[] = [
  {
    id: 'complementary',
    prompt: 'Which pair is complementary on the color wheel?',
    options: ['Red and Green', 'Blue and Purple', 'Yellow and Orange', 'Red and Orange'],
    correctIndex: 0,
    explanation: 'Complementary colors are opposite each other on the color wheel and create strong contrast.',
  },
  {
    id: 'warm-cool',
    prompt: 'Which palette is mostly cool colors?',
    options: ['Red, Orange, Yellow', 'Blue, Green, Violet', 'Red, Violet, Orange', 'Yellow, Green, Orange'],
    correctIndex: 1,
    explanation: 'Cool palettes are dominated by blue/green/violet and often communicate calm or distance.',
  },
  {
    id: 'value',
    prompt: 'If you want text to be easier to read on a poster, what should you prioritize?',
    options: ['Low value contrast', 'High value contrast', 'Only warm colors', 'Only pastel colors'],
    correctIndex: 1,
    explanation: 'High light-dark (value) contrast improves readability and visual hierarchy.',
  },
];

const pigmentMeta: Record<Pigment, { label: string; swatch: string; chipClass: string }> = {
  red: {
    label: 'Red',
    swatch: 'hsl(0 78% 54%)',
    chipClass: 'border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200',
  },
  yellow: {
    label: 'Yellow',
    swatch: 'hsl(50 94% 58%)',
    chipClass:
      'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100',
  },
  blue: {
    label: 'Blue',
    swatch: 'hsl(220 78% 54%)',
    chipClass: 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-200',
  },
};

const mixMissions = [
  { target: 'Orange', purpose: 'sunset poster headline', expectedPair: 'red-yellow' },
  { target: 'Green', purpose: 'eco-awareness infographic', expectedPair: 'blue-yellow' },
  { target: 'Violet', purpose: 'drama club announcement', expectedPair: 'blue-red' },
] as const;

const posterTokenLabels: Record<PosterToken, string> = {
  headline: 'Headline',
  subhead: 'Supporting Detail',
  cta: 'Call To Action',
};

function normalizePair(a: Pigment | null, b: Pigment | null): string | null {
  if (!a || !b) return null;
  return [a, b].sort().join('-');
}

function mixPrimary(a: Pigment | null, b: Pigment | null): string {
  if (!a || !b) return 'Pick two primary pigments to mix.';
  if (a === b) return `Single hue study: ${a.toUpperCase()} + ${b.toUpperCase()} keeps the same hue family.`;
  const pair = [a, b].sort().join('-');
  if (pair === 'blue-yellow') return 'Result: GREEN (secondary color)';
  if (pair === 'blue-red') return 'Result: PURPLE/VIOLET (secondary color)';
  if (pair === 'red-yellow') return 'Result: ORANGE (secondary color)';
  return 'Result: Neutral/brown tendency (depends on pigment strength)';
}

function getSwatch(first: Pigment | null, second: Pigment | null, value: number, saturation: number): string {
  const lightness = Math.max(15, Math.min(85, value));
  const sat = Math.max(25, Math.min(95, saturation));
  if (!first || !second) return `hsl(260 20% ${lightness}%)`;
  const pair = [first, second].sort().join('-');
  if (pair === 'blue-yellow') return `hsl(135 ${sat}% ${lightness}%)`;
  if (pair === 'blue-red') return `hsl(275 ${sat}% ${lightness}%)`;
  if (pair === 'red-yellow') return `hsl(28 ${sat}% ${lightness}%)`;
  const single = first === 'red' ? 0 : first === 'yellow' ? 52 : 220;
  return `hsl(${single} ${sat}% ${lightness}%)`;
}

export function ArtColorTheoryLabEnhanced() {
  const [stage, setStage] = useState<Stage>('explore');
  const [firstPigment, setFirstPigment] = useState<Pigment | null>(null);
  const [secondPigment, setSecondPigment] = useState<Pigment | null>(null);
  const [draggingPigment, setDraggingPigment] = useState<Pigment | null>(null);
  const [selectedTapPigment, setSelectedTapPigment] = useState<Pigment | null>(null);
  const [value, setValue] = useState(55);
  const [saturation, setSaturation] = useState(70);
  const [teacherKey, setTeacherKey] = useState(0);
  const [exploreCoachMessage, setExploreCoachMessage] = useState(
    'Welcome to Art Lab: Color Theory Studio. Drag pigment chips into the blending tray and evaluate your mix like a designer.'
  );
  const [missionIndex, setMissionIndex] = useState(0);
  const [studioPoints, setStudioPoints] = useState(0);
  const [missionFeedback, setMissionFeedback] = useState('');
  const [draggingPosterToken, setDraggingPosterToken] = useState<PosterToken | null>(null);
  const [selectedPosterToken, setSelectedPosterToken] = useState<PosterToken | null>(null);
  const [posterPlacements, setPosterPlacements] = useState<Record<PosterToken, PosterZone | null>>({
    headline: null,
    subhead: null,
    cta: null,
  });
  const [posterFeedback, setPosterFeedback] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  const checkpoint = checkpoints[questionIndex];
  const score = useMemo(
    () => answers.reduce((acc, answer, idx) => (answer === checkpoints[idx].correctIndex ? acc + 1 : acc), 0),
    [answers]
  );

  const mixResult = mixPrimary(firstPigment, secondPigment);
  const swatch = getSwatch(firstPigment, secondPigment, value, saturation);
  const currentMission = mixMissions[missionIndex];
  const currentPair = normalizePair(firstPigment, secondPigment);
  const contrastStrong = value <= 35 || value >= 65;
  const hierarchyAchieved =
    posterPlacements.headline === 'top' &&
    posterPlacements.subhead === 'middle' &&
    posterPlacements.cta === 'bottom';
  const saturationBalanced = saturation >= 40 && saturation <= 85;
  const rubricScore = [hierarchyAchieved, contrastStrong, saturationBalanced].filter(Boolean).length;
  const studioReadiness =
    studioPoints >= 3 && rubricScore >= 2 && score >= 2 ? 'Studio Ready' : 'Needs More Practice';

  const teacherMessage =
    stage === 'explore'
      ? exploreCoachMessage
      : stage === 'checkpoint'
      ? `Checkpoint ${questionIndex + 1}: ${checkpoint.prompt}`
      : `Excellent studio work. You scored ${score} out of ${checkpoints.length}. In design, color decisions should always support communication, not just decoration.`;

  const setSlotPigment = (slot: 'first' | 'second', pigment: Pigment) => {
    if (slot === 'first') setFirstPigment(pigment);
    if (slot === 'second') setSecondPigment(pigment);
  };

  const checkMission = () => {
    if (!currentPair) {
      setMissionFeedback('Drop two pigments into the blending tray first.');
      setExploreCoachMessage('Add two pigments, then click Check Mission to evaluate your color choice.');
      setTeacherKey((v) => v + 1);
      return;
    }

    if (currentPair === currentMission.expectedPair) {
      setStudioPoints((prev) => prev + 1);
      setMissionFeedback(`Great studio decision! You matched ${currentMission.target}.`);
      setExploreCoachMessage(
        `Excellent. You produced ${currentMission.target} for a ${currentMission.purpose}. This is how artists align color with communication goals.`
      );
      setMissionIndex((prev) => (prev + 1) % mixMissions.length);
      setFirstPigment(null);
      setSecondPigment(null);
      setSelectedTapPigment(null);
      setTeacherKey((v) => v + 1);
      return;
    }

    setMissionFeedback(`Not yet. Recheck your pair for ${currentMission.target}.`);
    setExploreCoachMessage(
      `Close attempt. For ${currentMission.target}, revisit primary-to-secondary mixing and try a new pair.`
    );
    setTeacherKey((v) => v + 1);
  };

  const placePosterToken = (token: PosterToken, zone: PosterZone) => {
    setPosterPlacements((prev) => ({ ...prev, [token]: zone }));
  };

  const evaluatePoster = () => {
    const hierarchyOk =
      posterPlacements.headline === 'top' &&
      posterPlacements.subhead === 'middle' &&
      posterPlacements.cta === 'bottom';
    const saturationBalanced = saturation >= 40 && saturation <= 85;
    const score = [hierarchyOk, contrastStrong, saturationBalanced].filter(Boolean).length;

    if (score === 3) {
      setPosterFeedback('Excellent composition: clear hierarchy, strong readability, and balanced intensity.');
      setExploreCoachMessage(
        'Brilliant design choices. Your poster hierarchy is clear, contrast is strong, and color intensity supports learning focus.'
      );
      setStudioPoints((prev) => prev + 2);
      setTeacherKey((v) => v + 1);
      return;
    }

    if (!hierarchyOk) {
      setPosterFeedback('Improve hierarchy: place Headline top, Supporting Detail middle, and Call To Action bottom.');
      setExploreCoachMessage(
        'Check layout hierarchy first. In academic visuals, students should scan from top headline to middle explanation, then final action.'
      );
      setTeacherKey((v) => v + 1);
      return;
    }

    if (!contrastStrong) {
      setPosterFeedback('Increase value contrast. Move value slider toward darker or lighter background.');
      setExploreCoachMessage(
        'Your layout is good, but readability can improve. Increase value contrast so text stands out at classroom viewing distance.'
      );
      setTeacherKey((v) => v + 1);
      return;
    }

    setPosterFeedback('Saturation is too weak/strong. Keep intensity balanced for educational clarity.');
    setExploreCoachMessage(
      'Good structure and contrast. Now tune saturation to avoid eye strain while keeping visual energy.'
    );
    setTeacherKey((v) => v + 1);
  };

  const submitAnswer = (optionIndex: number) => {
    if (stage !== 'checkpoint') return;
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);
    setShowHint(false);
    if (questionIndex < checkpoints.length - 1) {
      setQuestionIndex((v) => v + 1);
      setTeacherKey((v) => v + 1);
      return;
    }
    setStage('result');
    setTeacherKey((v) => v + 1);
  };

  const requestHint = () => {
    if (stage !== 'checkpoint') return;
    setShowHint(true);
    setHintCount((v) => v + 1);
  };

  const restart = () => {
    setStage('explore');
    setFirstPigment(null);
    setSecondPigment(null);
    setDraggingPigment(null);
    setSelectedTapPigment(null);
    setValue(55);
    setSaturation(70);
    setExploreCoachMessage(
      'Welcome back. Drag pigments, evaluate the mission, and then move to checkpoints.'
    );
    setMissionIndex(0);
    setStudioPoints(0);
    setMissionFeedback('');
    setDraggingPosterToken(null);
    setSelectedPosterToken(null);
    setPosterPlacements({ headline: null, subhead: null, cta: null });
    setPosterFeedback('');
    setQuestionIndex(0);
    setAnswers([]);
    setHintCount(0);
    setShowHint(false);
    setTeacherKey((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TeacherVoice
        message={teacherMessage}
        triggerSpeakKey={teacherKey}
        autoPlay
        requireExplicitStart
        showStartOverlay={false}
        teacherName="Art Coach"
        theme="default"
        quickActions={[
          {
            label: 'Replay instruction',
            onClick: () => setTeacherKey((v) => v + 1),
          },
        ]}
        onHintRequest={stage === 'checkpoint' ? requestHint : undefined}
      />

      <Card className="border border-rose-200 dark:border-rose-800">
        <CardHeader className="p-3 sm:p-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-rose-600" />
              Art Lab - Color Theory Studio
            </CardTitle>
            <Badge variant="outline">Middle & High School</Badge>
          </div>
          <CardDescription>
            Learn foundational visual literacy: hue mixing, value contrast, saturation control, and composition clarity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-3 pt-0 sm:p-5 sm:pt-0">
          {stage === 'explore' && (
            <>
              <Card className="border-rose-300/70 dark:border-rose-700">
                <CardHeader>
                  <CardTitle className="text-base">Studio Task 1: Mix Primary Pigments</CardTitle>
                  <CardDescription>Drag pigment chips into the blending tray and observe the secondary color result.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Pigment Rack (drag from here)</p>
                    <div className="flex flex-wrap gap-2">
                      {(['red', 'yellow', 'blue'] as Pigment[]).map((pigment) => (
                        <button
                          key={`rack-${pigment}`}
                          draggable
                          onDragStart={(event) => {
                            setDraggingPigment(pigment);
                            event.dataTransfer.setData('text/plain', pigment);
                            event.dataTransfer.effectAllowed = 'move';
                          }}
                          onClick={() => setSelectedTapPigment(pigment)}
                          className={`px-3 py-2 rounded-md border text-sm font-semibold cursor-grab active:cursor-grabbing ${pigmentMeta[pigment].chipClass} ${
                            selectedTapPigment === pigment ? 'ring-2 ring-violet-500' : ''
                          }`}
                        >
                          {pigmentMeta[pigment].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {(['first', 'second'] as const).map((slot) => {
                      const selected = slot === 'first' ? firstPigment : secondPigment;
                      return (
                        <div
                          key={slot}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            const dropped = (event.dataTransfer.getData('text/plain') || draggingPigment) as Pigment | null;
                            if (!dropped) return;
                            setSlotPigment(slot, dropped);
                            setDraggingPigment(null);
                          }}
                          className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-3 min-h-[84px] bg-muted/20"
                        >
                          <p className="text-xs text-muted-foreground mb-2">
                            {slot === 'first' ? 'Blend Tray - Layer 1' : 'Blend Tray - Layer 2'}
                          </p>
                          {selected ? (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-600"
                                  style={{ backgroundColor: pigmentMeta[selected].swatch }}
                                />
                                <span className="text-sm font-medium">{pigmentMeta[selected].label}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => (slot === 'first' ? setFirstPigment(null) : setSecondPigment(null))}
                              >
                                Clear
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Drop a pigment chip here</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedTapPigment && (
                    <div className="rounded-lg border border-violet-300 dark:border-violet-700 p-2.5">
                      <p className="text-xs text-muted-foreground mb-2">
                        Mobile assist: place <strong>{pigmentMeta[selectedTapPigment].label}</strong> into tray:
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSlotPigment('first', selectedTapPigment)}>
                          Set Layer 1
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSlotPigment('second', selectedTapPigment)}>
                          Set Layer 2
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border p-3 bg-muted/30">
                    <p className="text-sm font-medium mb-2">Mix Result</p>
                    <p className="text-sm text-muted-foreground">{mixResult}</p>
                  </div>

                  <Card className="border-rose-200 dark:border-rose-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Creative Mission</CardTitle>
                      <CardDescription>
                        Target: <strong>{currentMission.target}</strong> for a <strong>{currentMission.purpose}</strong>.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Studio points</span>
                        <span className="font-semibold">{studioPoints}</span>
                      </div>
                      <Button size="sm" onClick={checkMission}>
                        Check Mission
                      </Button>
                      {missionFeedback && <p className="text-xs text-muted-foreground">{missionFeedback}</p>}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Studio Task 2: Value & Saturation</CardTitle>
                  <CardDescription>Adjust readability and mood for classroom poster design.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">
                        Value (light-dark): <span className="font-bold">{value}</span>
                      </label>
                      <input
                        type="range"
                        min={15}
                        max={85}
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="w-full"
                      />
                      <label className="block text-sm font-medium">
                        Saturation (intensity): <span className="font-bold">{saturation}</span>
                      </label>
                      <input
                        type="range"
                        min={25}
                        max={95}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Preview swatch</p>
                      <div className="h-28 rounded-xl border-2 border-slate-300 dark:border-slate-700" style={{ backgroundColor: swatch }} />
                      <p className="text-xs text-muted-foreground">
                        Educational note: high value contrast helps titles and key concepts stand out for learners.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Studio Task 3: Poster Composition Challenge</CardTitle>
                  <CardDescription>
                    Drag communication blocks into the poster zones and optimize readability for classroom display.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Communication Blocks</p>
                    <div className="flex flex-wrap gap-2">
                      {(['headline', 'subhead', 'cta'] as PosterToken[]).map((token) => (
                        <button
                          key={token}
                          draggable
                          onDragStart={(event) => {
                            setDraggingPosterToken(token);
                            event.dataTransfer.setData('text/plain', token);
                            event.dataTransfer.effectAllowed = 'move';
                          }}
                          onClick={() => setSelectedPosterToken(token)}
                          className={`px-3 py-1.5 rounded-md border text-sm font-medium bg-white dark:bg-slate-900 ${
                            selectedPosterToken === token ? 'ring-2 ring-violet-500' : ''
                          }`}
                        >
                          {posterTokenLabels[token]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPosterToken && (
                    <div className="rounded-lg border border-violet-300 dark:border-violet-700 p-2.5">
                      <p className="text-xs text-muted-foreground mb-2">
                        Mobile assist: place <strong>{posterTokenLabels[selectedPosterToken]}</strong> into:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => placePosterToken(selectedPosterToken, 'top')}>
                          Top
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => placePosterToken(selectedPosterToken, 'middle')}>
                          Middle
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => placePosterToken(selectedPosterToken, 'bottom')}>
                          Bottom
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      {(['top', 'middle', 'bottom'] as PosterZone[]).map((zone) => {
                        const tokenInZone =
                          (Object.entries(posterPlacements).find(([, placedZone]) => placedZone === zone)?.[0] as PosterToken | undefined) ??
                          null;
                        return (
                          <div
                            key={zone}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault();
                              const dropped = (event.dataTransfer.getData('text/plain') || draggingPosterToken) as PosterToken | null;
                              if (!dropped) return;
                              placePosterToken(dropped, zone);
                              setDraggingPosterToken(null);
                            }}
                            className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-3 min-h-[72px] bg-muted/20"
                          >
                            <p className="text-xs text-muted-foreground mb-1 uppercase">{zone} zone</p>
                            <p className="text-sm font-medium">{tokenInZone ? posterTokenLabels[tokenInZone] : 'Drop a block here'}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Poster Preview</p>
                      <div className="rounded-xl border-2 border-slate-300 dark:border-slate-700 p-3 space-y-2" style={{ backgroundColor: swatch }}>
                        <div className="rounded-md p-2 bg-black/10 text-sm font-bold" style={{ color: value < 50 ? '#fff' : '#111' }}>
                          {posterPlacements.headline ? posterTokenLabels.headline : 'Headline goes here'}
                        </div>
                        <div className="rounded-md p-2 bg-black/10 text-sm" style={{ color: value < 50 ? '#fff' : '#111' }}>
                          {posterPlacements.subhead ? posterTokenLabels.subhead : 'Supporting detail goes here'}
                        </div>
                        <div className="rounded-md p-2 bg-black/10 text-sm font-semibold" style={{ color: value < 50 ? '#fff' : '#111' }}>
                          {posterPlacements.cta ? posterTokenLabels.cta : 'Call to action goes here'}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Readability check: {contrastStrong ? 'Strong value contrast' : 'Low value contrast (adjust slider)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={evaluatePoster}>
                      Evaluate Poster
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPosterPlacements({ headline: null, subhead: null, cta: null });
                        setPosterFeedback('');
                      }}
                    >
                      Reset Layout
                    </Button>
                  </div>
                  {posterFeedback && <p className="text-sm text-muted-foreground">{posterFeedback}</p>}
                </CardContent>
              </Card>

              <Button className="w-full" onClick={() => setStage('checkpoint')}>
                Start Art Checkpoints
              </Button>
            </>
          )}

          {stage === 'checkpoint' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Checkpoint {questionIndex + 1} of {checkpoints.length}
                </CardTitle>
                <CardDescription>{checkpoint.prompt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkpoint.options.map((option, optionIndex) => (
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
                  <Button variant="ghost" onClick={() => setTeacherKey((v) => v + 1)}>
                    Replay coach
                  </Button>
                </div>
                {showHint && (
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700">
                    <CardContent className="pt-4 text-sm">{checkpoint.explanation}</CardContent>
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
                  Art Lab Complete
                </CardTitle>
                <CardDescription>
                  Score: {score}/{checkpoints.length} | Hints used: {hintCount}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Final Studio Report</CardTitle>
                    <CardDescription>Academic design rubric for this attempt.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Color missions: {studioPoints} pts</Badge>
                      <Badge variant="outline">Poster rubric: {rubricScore}/3</Badge>
                      <Badge variant={studioReadiness === 'Studio Ready' ? 'default' : 'secondary'}>
                        {studioReadiness}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground mb-2">Poster hierarchy summary</p>
                        <p className="text-sm">Top: {posterPlacements.headline ? posterTokenLabels.headline : 'Not placed'}</p>
                        <p className="text-sm">Middle: {posterPlacements.subhead ? posterTokenLabels.subhead : 'Not placed'}</p>
                        <p className="text-sm">Bottom: {posterPlacements.cta ? posterTokenLabels.cta : 'Not placed'}</p>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground mb-2">Readability summary</p>
                        <p className="text-sm">Value contrast: {contrastStrong ? 'Strong' : 'Weak'}</p>
                        <p className="text-sm">Saturation balance: {saturationBalanced ? 'Balanced' : 'Too low/high'}</p>
                        <div className="mt-2 h-10 rounded border" style={{ backgroundColor: swatch }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button variant="outline" onClick={restart} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Studio
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <LabNotes labId="art-lab-color-theory" labTitle="Art Lab - Color Theory Studio" />
    </div>
  );
}

