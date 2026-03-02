'use client';

import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Calculator, Delete, Link2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AngleMode = 'DEG' | 'RAD';

const ROWS: string[][] = [
  ['C', 'DEL', '(', ')', '/'],
  ['7', '8', '9', '*', 'sqrt('],
  ['4', '5', '6', '-', '^'],
  ['1', '2', '3', '+', '%'],
  ['0', '.', 'pi', 'e', 'ans'],
  ['sin(', 'cos(', 'tan(', 'log(', 'ln('],
];

function evaluateExpression(input: string, ans: number, mode: AngleMode): number {
  let expr = input.trim().replace(/×/g, '*').replace(/÷/g, '/');
  expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
  expr = expr.replace(/\^/g, '**');
  expr = expr.replace(/\bans\b/gi, 'ans');
  expr = expr.replace(/\bpi\b/gi, 'pi');
  expr = expr.replace(/\be\b/gi, 'e');
  expr = expr.replace(/\bsqrt\(/gi, 'sqrt(');
  expr = expr.replace(/\bln\(/gi, 'ln(');
  expr = expr.replace(/\blog\(/gi, 'log10(');
  expr = expr.replace(/\bsin\(/gi, 'sin(');
  expr = expr.replace(/\bcos\(/gi, 'cos(');
  expr = expr.replace(/\btan\(/gi, 'tan(');

  // Block unexpected characters before running expression.
  if (!/^[0-9a-zA-Z+\-*/().,\s_%*]+$/.test(expr)) {
    throw new Error('Invalid expression');
  }

  const sin = (x: number) => (mode === 'DEG' ? Math.sin((x * Math.PI) / 180) : Math.sin(x));
  const cos = (x: number) => (mode === 'DEG' ? Math.cos((x * Math.PI) / 180) : Math.cos(x));
  const tan = (x: number) => (mode === 'DEG' ? Math.tan((x * Math.PI) / 180) : Math.tan(x));
  const ln = (x: number) => Math.log(x);
  const log10 = (x: number) => Math.log10(x);
  const sqrt = (x: number) => Math.sqrt(x);
  const pi = Math.PI;
  const e = Math.E;

  const value = Function(
    'sin',
    'cos',
    'tan',
    'ln',
    'log10',
    'sqrt',
    'pi',
    'e',
    'ans',
    `"use strict"; return (${expr});`
  )(sin, cos, tan, ln, log10, sqrt, pi, e, ans);

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Math error');
  }
  return value;
}

export function LabScientificCalculator() {
  const [attachToCoach] = useState(true);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('');
  const [ans, setAns] = useState(0);
  const [mode, setMode] = useState<AngleMode>('DEG');
  const [error, setError] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null);
  const [launcherPosition, setLauncherPosition] = useState<{ x: number; y: number } | null>(null);
  const [panelCoachOffset, setPanelCoachOffset] = useState({ x: 8, y: -512 });
  const [launcherCoachOffset, setLauncherCoachOffset] = useState({ x: 8, y: -60 });
  const [dragTarget, setDragTarget] = useState<'panel' | 'launcher' | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const PANEL_WIDTH = 320;
  const PANEL_HEIGHT = 500;
  const LAUNCHER_WIDTH = 176;
  const LAUNCHER_HEIGHT = 48;
  const MARGIN = 12;

  const displayText = useMemo(() => (display.length ? display : '0'), [display]);
  const getCoachRect = () =>
    document.querySelector('[data-teacher-voice-anchor="true"]')?.getBoundingClientRect() ?? null;

  const clampPosition = (x: number, y: number, width: number, height: number) => {
    const maxX = Math.max(MARGIN, window.innerWidth - width - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - height - MARGIN);
    return {
      x: Math.min(Math.max(MARGIN, x), maxX),
      y: Math.min(Math.max(MARGIN, y), maxY),
    };
  };

  useEffect(() => {
    if (launcherPosition) return;
    const initial = clampPosition(
      window.innerWidth - LAUNCHER_WIDTH - 16,
      window.innerHeight - LAUNCHER_HEIGHT - 16,
      LAUNCHER_WIDTH,
      LAUNCHER_HEIGHT
    );
    setLauncherPosition(initial);
  }, [launcherPosition]);

  useEffect(() => {
    if (!open || panelPosition) return;
    const initial = clampPosition(
      window.innerWidth - PANEL_WIDTH - 16,
      window.innerHeight - PANEL_HEIGHT - 16,
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
    setPanelPosition(initial);
  }, [open, panelPosition]);

  useEffect(() => {
    if (!attachToCoach) return;
    let rafId = 0;
    const syncToCoach = () => {
      if (dragTarget) {
        rafId = window.requestAnimationFrame(syncToCoach);
        return;
      }
      const coachRect = getCoachRect();
      if (coachRect) {
        const launcherTarget = clampPosition(
          coachRect.left + launcherCoachOffset.x,
          coachRect.top + launcherCoachOffset.y,
          LAUNCHER_WIDTH,
          LAUNCHER_HEIGHT
        );
        setLauncherPosition((prev) =>
          prev && prev.x === launcherTarget.x && prev.y === launcherTarget.y ? prev : launcherTarget
        );

        if (open) {
          const panelTarget = clampPosition(
            coachRect.left + panelCoachOffset.x,
            coachRect.top + panelCoachOffset.y,
            PANEL_WIDTH,
            PANEL_HEIGHT
          );
          setPanelPosition((prev) =>
            prev && prev.x === panelTarget.x && prev.y === panelTarget.y ? prev : panelTarget
          );
        }
      }
      rafId = window.requestAnimationFrame(syncToCoach);
    };
    rafId = window.requestAnimationFrame(syncToCoach);
    return () => window.cancelAnimationFrame(rafId);
  }, [attachToCoach, dragTarget, launcherCoachOffset, panelCoachOffset, open]);

  useEffect(() => {
    if (!panelPosition && !launcherPosition) return;
    const onResize = () => {
      setPanelPosition((prev) => {
        if (!prev) return prev;
        return clampPosition(prev.x, prev.y, PANEL_WIDTH, PANEL_HEIGHT);
      });
      setLauncherPosition((prev) => {
        if (!prev) return prev;
        return clampPosition(prev.x, prev.y, LAUNCHER_WIDTH, LAUNCHER_HEIGHT);
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [panelPosition, launcherPosition]);

  useEffect(() => {
    if (!dragTarget) return;
    const onPointerMove = (event: globalThis.PointerEvent) => {
      dragMovedRef.current = true;
      if (dragTarget === 'panel') {
        const coachRect = attachToCoach ? getCoachRect() : null;
        setPanelPosition((prev) => {
          const current = prev ?? { x: MARGIN, y: MARGIN };
          const nextX = event.clientX - dragOffsetRef.current.x;
          const nextY = event.clientY - dragOffsetRef.current.y;
          const next = clampPosition(nextX, nextY, PANEL_WIDTH, PANEL_HEIGHT);
          if (coachRect) {
            setPanelCoachOffset({
              x: next.x - coachRect.left,
              y: next.y - coachRect.top,
            });
          }
          if (next.x === current.x && next.y === current.y) return current;
          return next;
        });
      } else {
        const coachRect = attachToCoach ? getCoachRect() : null;
        setLauncherPosition((prev) => {
          const current = prev ?? { x: MARGIN, y: MARGIN };
          const nextX = event.clientX - dragOffsetRef.current.x;
          const nextY = event.clientY - dragOffsetRef.current.y;
          const next = clampPosition(nextX, nextY, LAUNCHER_WIDTH, LAUNCHER_HEIGHT);
          if (coachRect) {
            setLauncherCoachOffset({
              x: next.x - coachRect.left,
              y: next.y - coachRect.top,
            });
          }
          if (next.x === current.x && next.y === current.y) return current;
          return next;
        });
      }
    };
    const onPointerUp = () => setDragTarget(null);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragTarget]);

  const append = (value: string) => {
    setError(null);
    setDisplay((prev) => prev + value);
  };

  const clear = () => {
    setError(null);
    setDisplay('');
  };

  const backspace = () => {
    setError(null);
    setDisplay((prev) => prev.slice(0, -1));
  };

  const compute = () => {
    try {
      const value = evaluateExpression(display, ans, mode);
      const rounded = Number.parseFloat(value.toFixed(10));
      setAns(rounded);
      setDisplay(String(rounded));
      setError(null);
    } catch {
      setError('Invalid expression');
    }
  };

  const handlePanelDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    const coachRect = attachToCoach ? getCoachRect() : null;
    const activePanelPosition =
      attachToCoach && coachRect
        ? clampPosition(
            coachRect.left + panelCoachOffset.x,
            coachRect.top + panelCoachOffset.y,
            PANEL_WIDTH,
            PANEL_HEIGHT
          )
        : panelPosition;
    if (!activePanelPosition) return;
    dragMovedRef.current = false;
    setDragTarget('panel');
    dragOffsetRef.current = {
      x: event.clientX - activePanelPosition.x,
      y: event.clientY - activePanelPosition.y,
    };
  };

  const handleLauncherDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const coachRect = attachToCoach ? getCoachRect() : null;
    const activeLauncherPosition =
      attachToCoach && coachRect
        ? clampPosition(
            coachRect.left + launcherCoachOffset.x,
            coachRect.top + launcherCoachOffset.y,
            LAUNCHER_WIDTH,
            LAUNCHER_HEIGHT
          )
        : launcherPosition;
    if (!activeLauncherPosition) return;
    dragMovedRef.current = false;
    setDragTarget('launcher');
    dragOffsetRef.current = {
      x: event.clientX - activeLauncherPosition.x,
      y: event.clientY - activeLauncherPosition.y,
    };
  };

  const handleLauncherClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    setOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {!open && launcherPosition && (
        <Button
          onClick={handleLauncherClick}
          onPointerDown={handleLauncherDragStart}
          className={`pointer-events-auto shadow-xl rounded-full h-12 px-4 gap-2 border border-white/40 bg-white/20 hover:bg-white/30 text-slate-900 dark:text-white backdrop-blur-md ${dragTarget === 'launcher' ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ position: 'fixed', left: launcherPosition.x, top: launcherPosition.y }}
        >
          <Calculator className="h-4 w-4" />
          Student Calculator
          {attachToCoach && <Link2 className="h-3.5 w-3.5 opacity-80" />}
        </Button>
      )}

      {open && panelPosition && (
        <Card
          className="pointer-events-auto w-[320px] max-w-[calc(100vw-2rem)] border border-white/30 bg-white/25 dark:bg-slate-900/35 backdrop-blur-xl shadow-2xl fixed z-[60]"
          style={{ left: panelPosition.x, top: panelPosition.y }}
        >
          <CardHeader className="pb-2">
            <div
              className={`flex items-center justify-between select-none ${dragTarget === 'panel' ? 'cursor-grabbing' : 'cursor-grab'}`}
              onPointerDown={handlePanelDragStart}
            >
              <CardTitle className="text-sm flex items-center gap-1.5">
                Student Calculator
                {attachToCoach && <Link2 className="h-3.5 w-3.5 opacity-70" aria-label="Linked to coach" />}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} onPointerDown={(e) => e.stopPropagation()}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-[11px] text-muted-foreground mb-1">Ans: {ans}</div>
              <div className="text-right text-lg font-mono break-all min-h-7">{displayText}</div>
              {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
            </div>

            <div className="flex gap-2">
              <Button
                variant={mode === 'DEG' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMode('DEG')}
              >
                DEG
              </Button>
              <Button
                variant={mode === 'RAD' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMode('RAD')}
              >
                RAD
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {ROWS.flat().map((key) => {
                if (key === 'C') {
                  return (
                    <Button key={key} variant="secondary" onClick={clear} className="h-9 text-xs">
                      C
                    </Button>
                  );
                }
                if (key === 'DEL') {
                  return (
                    <Button key={key} variant="secondary" onClick={backspace} className="h-9 text-xs">
                      <Delete className="h-3 w-3 mr-1" />
                      DEL
                    </Button>
                  );
                }
                return (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => append(key)}
                    className="h-9 text-xs font-mono"
                  >
                    {key}
                  </Button>
                );
              })}
            </div>

            <Button onClick={compute} className="w-full">
              =
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
