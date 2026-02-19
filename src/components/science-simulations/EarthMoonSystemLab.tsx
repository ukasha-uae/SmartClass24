'use client';

import { Suspense, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EarthMoonSystemScene } from './EarthMoonSystemScene';
import {
  EARTH_MOON_CONFIG,
  EARTH_MOON_FACTS,
} from '@/lib/science-simulations/earth-moon-system-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Globe, Info, Moon, SunMedium, Zap, Play, Pause, Sparkles } from 'lucide-react';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';

type BodyId = 'sun' | 'earth' | 'moon';

// Varied lead-ins so the teacher doesn't repeat "We're now at..." every phase.
const PHASE_LEAD_INS: string[] = [
  "We're now at %s.",
  "This is the %s phase.",
  "Here we have %s.",
  "The cycle shows %s.",
  "Notice: %s.",
  "That's %s.",
];

function buildTeacherMessage(body: BodyId | null, day: number) {
  const phaseIndex = Math.round((day / EARTH_MOON_CONFIG.lunarMonthDays) * 8) % 8;
  const phaseNames = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ];
  const phaseName = phaseNames[phaseIndex];
  const leadIn = PHASE_LEAD_INS[phaseIndex % PHASE_LEAD_INS.length].replace('%s', phaseName);

  if (!body || body === 'sun') {
    return `${leadIn} The Moon orbits Earth and we see different phases as the sunlit side faces us.`;
  }
  if (body === 'earth') {
    return `${leadIn} From Earth we're looking at a different part of the Moon's sunlit half.`;
  }
  return `${leadIn} The Moon's position around Earth changes which part we see lit by the Sun.`;
}

export function EarthMoonSystemLab() {
  const [day, setDay] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedBody, setSelectedBody] = useState<BodyId | null>(null);
  const [teacherMessage, setTeacherMessage] = useState<string>(() =>
    buildTeacherMessage(null, 0),
  );
  const [triggerSpeakKey, setTriggerSpeakKey] = useState(0);
  const autoPlayRef = useRef(false);

  const phaseIndex = useMemo(
    () => Math.round((day / EARTH_MOON_CONFIG.lunarMonthDays) * 8) % 8,
    [day],
  );

  const phaseName = useMemo(() => {
    const names = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ];
    return names[phaseIndex];
  }, [phaseIndex]);

  const handleSelectBody = (id: BodyId) => {
    setSelectedBody(id);
    setTeacherMessage(buildTeacherMessage(id, day));
  };

  const handleDayChange = (value: number) => {
    setDay(value);
    setTeacherMessage(buildTeacherMessage(selectedBody, value));
  };

  autoPlayRef.current = autoPlay;

  // When teacher finishes speaking during auto-play, advance to the next phase. Use ref so stop is immediate.
  const handleTeacherComplete = useCallback(() => {
    if (!autoPlayRef.current) return;
    setDay((currentDay) => {
      const currentPhaseIndex = Math.round((currentDay / EARTH_MOON_CONFIG.lunarMonthDays) * 8) % 8;
      const nextPhaseIndex = (currentPhaseIndex + 1) % 8;
      const nextCenterDay = ((nextPhaseIndex + 0.5) / 8) * EARTH_MOON_CONFIG.lunarMonthDays;
      setTeacherMessage(buildTeacherMessage(selectedBody, nextCenterDay));
      return nextCenterDay;
    });
  }, [selectedBody]);

  // When user turns on auto-play, set message for current phase (trigger speak is done in click handler).
  useEffect(() => {
    if (autoPlay) {
      setTeacherMessage(buildTeacherMessage(selectedBody, day));
    }
  }, [autoPlay]);

  const handleAutoPlayToggle = useCallback(() => {
    if (autoPlay) {
      setAutoPlay(false);
      setTeacherMessage('');
      setTimeout(() => setTeacherMessage(buildTeacherMessage(selectedBody, day)), 0);
    } else {
      setAutoPlay(true);
      setTeacherMessage(buildTeacherMessage(selectedBody, day));
      setTriggerSpeakKey((k) => k + 1);
    }
  }, [autoPlay, selectedBody, day]);

  const currentFact = EARTH_MOON_FACTS[phaseIndex % EARTH_MOON_FACTS.length];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] min-h-[520px]">
      {/* 3D Canvas */}
      <div className="flex-1 min-h-[360px] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-900">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
              <div className="text-center">
                <Moon className="h-12 w-12 animate-pulse mx-auto mb-2 text-sky-300" />
                <p>Loading Earth–Moon system...</p>
              </div>
            </div>
          }
        >
          <Canvas camera={{ position: [0, 12, 26], fov: 45 }} gl={{ antialias: true, alpha: false }}>
            <EarthMoonSystemScene
              day={day}
              onSelectBody={handleSelectBody}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        {/* Time controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-500" />
              Lunar day & auto play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={autoPlay ? 'default' : 'outline'}
                size="sm"
                onClick={handleAutoPlayToggle}
              >
                {autoPlay ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Stop auto play
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Auto play cycle
                  </>
                )}
              </Button>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Day in lunar month</span>
                <span className="font-medium">{day.toFixed(1)} / 29.5</span>
              </div>
              <Slider
                value={[day]}
                onValueChange={([v]) => handleDayChange(v ?? 0)}
                min={0}
                max={EARTH_MOON_CONFIG.lunarMonthDays}
                step={0.5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick phase jump */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Jump to phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'New', value: 0 },
                { label: '1st Quarter', value: EARTH_MOON_CONFIG.lunarMonthDays * 0.25 },
                { label: 'Full', value: EARTH_MOON_CONFIG.lunarMonthDays * 0.5 },
                { label: 'Last Quarter', value: EARTH_MOON_CONFIG.lunarMonthDays * 0.75 },
              ].map((phase) => (
                <Button
                  key={phase.label}
                  size="sm"
                  variant="outline"
                  className="text-[11px]"
                  onClick={() => handleDayChange(phase.value)}
                >
                  {phase.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick select bodies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={selectedBody === 'sun' ? 'default' : 'outline'}
                className="text-xs"
                onClick={() => handleSelectBody('sun')}
              >
                <SunMedium className="h-3 w-3 mr-1" />
                Sun
              </Button>
              <Button
                size="sm"
                variant={selectedBody === 'earth' ? 'default' : 'outline'}
                className="text-xs"
                onClick={() => handleSelectBody('earth')}
              >
                <Globe className="h-3 w-3 mr-1" />
                Earth
              </Button>
              <Button
                size="sm"
                variant={selectedBody === 'moon' ? 'default' : 'outline'}
                className="text-xs"
                onClick={() => handleSelectBody('moon')}
              >
                <Moon className="h-3 w-3 mr-1" />
                Moon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Phase + fact */}
        <Card className="border-2 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
              Current phase: {phaseName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-sm">{currentFact.title}</p>
            <p className="text-sm text-muted-foreground">{currentFact.description}</p>
          </CardContent>
        </Card>

        {!selectedBody && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Info className="h-4 w-4 shrink-0" />
                <p>
                  Drag to orbit around the system, scroll to zoom. Move the day slider or use Auto
                  play, then tap the Moon to see how its position matches the phase name.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI teacher guide */}
        <Card className="mt-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-500" />
              AI Teacher Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Tap the Sun, Earth or Moon to hear an explanation of what is happening in the cycle
              right now.
            </p>
          </CardContent>
        </Card>

        <TeacherVoice
          message={teacherMessage}
          autoPlay={true}
          onComplete={handleTeacherComplete}
          triggerSpeakKey={triggerSpeakKey}
          theme="science"
          teacherName="Dr. Galaxy Guide"
          emotion="explaining"
          progressiveReveal={true}
          linesPerChunk={2}
        />
      </div>
    </div>
  );
}

