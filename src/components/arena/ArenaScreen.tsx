'use client';

/**
 * Arena Screen – main large-screen UI
 * Wires ArenaEngine + CityRenderer + ScoreOverlay + question display + input.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArenaEngine, ArenaRegistry, MOCK_QUESTIONS } from '@/lib/arena';
import type { ArenaState, ArenaQuestion, AnswerPayload, TeamId } from '@/lib/arena/core/types';
import { CityRenderer3D } from './CityRenderer3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface ArenaScreenProps {
  arenaId?: string;
  questions?: ArenaQuestion[];
  autoPlay?: boolean;
  leftColor?: string;
  rightColor?: string;
  className?: string;
}

export function ArenaScreen({
  arenaId = 'light-your-city',
  questions = MOCK_QUESTIONS,
  autoPlay = false,
  leftColor = '#f59e0b',
  rightColor = '#3b82f6',
  className,
}: ArenaScreenProps) {
  const [state, setState] = useState<ArenaState | null>(null);
  const [visualState, setVisualState] = useState<Record<string, number>>({ powerLeft: 0, powerRight: 0 });
  const engineRef = useRef<ArenaEngine | null>(null);

  const arenaModule = ArenaRegistry.get(arenaId);
  if (!arenaModule) {
    return (
      <div className="p-8 text-center text-red-500">
        Arena &quot;{arenaId}&quot; not found. Available: {ArenaRegistry.list().join(', ')}
      </div>
    );
  }

  useEffect(() => {
    const engine = new ArenaEngine({
      questions,
      arenaModule,
      onStateChange: (s) => {
        setState(s);
        setVisualState(arenaModule.getVisualState(s));
      },
    });
    engineRef.current = engine;
    setState(engine.getState());
    setVisualState(arenaModule.getVisualState(engine.getState()));
    return () => {
      engineRef.current = null;
    };
  }, [arenaId, arenaModule, questions]);

  const handleAnswer = useCallback(
    (teamId: TeamId, answer: string | number | boolean, timeTakenMs: number) => {
      engineRef.current?.submitAnswer({ teamId, answer, timeTakenMs });
    },
    []
  );

  const handleRestart = useCallback(() => {
    engineRef.current?.start();
  }, []);

  if (!state) return <div className="p-8 animate-pulse text-center">Loading Arena…</div>;

  const isQuestionPhase = state.phase === 'question';
  const isWin = state.phase === 'win' || state.winner;
  const question = state.currentQuestion;

  return (
    <div className={className ?? 'min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'}>
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Compact header */}
        <div className="text-center py-1">
          <h1 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            {arenaModule.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Q{state.currentQuestionIndex + 1}/{state.totalQuestions}</p>
        </div>

        {/* Arena – city/experience + compact score overlay (no separate row) */}
        <Card className="overflow-hidden relative">
          <CardContent className="p-0 relative">
            <CityRenderer3D
              powerLeft={visualState.powerLeft ?? 0}
              powerRight={visualState.powerRight ?? 0}
              leftColor={leftColor}
              rightColor={rightColor}
              showPowerFlicker={state.phase === 'scoring'}
            />
            {/* Compact score – top corners, minimal space for wider arena */}
            <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm" style={{ color: leftColor }}>
                {state.teams.left.score} · {state.teams.left.advantage}%
                {state.teams.left.streak >= 2 && <span className="ml-1">🔥{state.teams.left.streak}</span>}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm" style={{ color: rightColor }}>
                {state.teams.right.score} · {state.teams.right.advantage}%
                {state.teams.right.streak >= 2 && <span className="ml-1">🔥{state.teams.right.streak}</span>}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Question & Input – split so left students stay left, right students stay right */}
        {isWin ? (
          <Card className="border-2 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {state.winner === 'left' ? '🏆 Team Left' : '🏆 Team Right'} Wins!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={handleRestart} size="lg">Play Again</Button>
            </CardContent>
          </Card>
        ) : question && isQuestionPhase ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left side – students on left stand here, only their answers */}
            <Card className="border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  ← TEAM LEFT (stand on this side)
                </CardTitle>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{question.question}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.type === 'mcq' && question.options && (
                  <div className="flex flex-col gap-2">
                    {question.options.map((opt, i) => (
                      <Button key={i} variant="outline" size="lg" className="w-full border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', opt, 3000)}>{opt}</Button>
                    ))}
                  </div>
                )}
                {question.type === 'truefalse' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1 border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', true, 2000)}>True</Button>
                    <Button variant="outline" size="lg" className="flex-1 border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', false, 2000)}>False</Button>
                  </div>
                )}
                {question.type === 'number_input' && (
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="lg" className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', question.correctAnswer, 2000)}>{String(question.correctAnswer)}</Button>
                    <Button variant="outline" size="sm" className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', Number(question.correctAnswer) + 1, 2000)}>{Number(question.correctAnswer) + 1}</Button>
                    <Button variant="outline" size="sm" className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50" onClick={() => handleAnswer('left', Number(question.correctAnswer) - 1, 2000)}>{Number(question.correctAnswer) - 1}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Right side – students on right stand here, only their answers */}
            <Card className="border-2 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  TEAM RIGHT (stand on this side) →
                </CardTitle>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{question.question}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.type === 'mcq' && question.options && (
                  <div className="flex flex-col gap-2">
                    {question.options.map((opt, i) => (
                      <Button key={i} variant="outline" size="lg" className="w-full border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', opt, 3000)}>{opt}</Button>
                    ))}
                  </div>
                )}
                {question.type === 'truefalse' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1 border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', true, 2000)}>True</Button>
                    <Button variant="outline" size="lg" className="flex-1 border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', false, 2000)}>False</Button>
                  </div>
                )}
                {question.type === 'number_input' && (
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="lg" className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', question.correctAnswer, 2000)}>{String(question.correctAnswer)}</Button>
                    <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', Number(question.correctAnswer) + 1, 2000)}>{Number(question.correctAnswer) + 1}</Button>
                    <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50" onClick={() => handleAnswer('right', Number(question.correctAnswer) - 1, 2000)}>{Number(question.correctAnswer) - 1}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : state.phase === 'end' ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg mb-4">Game Over. {state.winner ? `Winner: Team ${state.winner}` : 'Draw.'}</p>
              <Button onClick={handleRestart}>Play Again</Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
