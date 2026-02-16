'use client';

import { Suspense, useMemo, useState } from 'react';
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

  if (!body || body === 'sun') {
    return `Welcome to the Earth–Moon–Sun system! Here you can see how the Moon orbits Earth and how that creates different phases like New Moon and Full Moon. Drag the day slider or use Auto play to watch the cycle.`;
  }
  if (body === 'earth') {
    return `This is Earth, our home. As the Moon orbits Earth, we see different parts of its sunlit half. Right now the Moon is at a position that gives us the ${phaseName} phase.`;
  }
  // moon
  return `You have selected the Moon. The Moon always keeps the same side facing Earth, but we see different phases because our viewing angle changes. Today in the cycle it appears as a ${phaseName}. Notice how its position around Earth changes that phase.`;
}

export function EarthMoonSystemLab() {
  const [day, setDay] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedBody, setSelectedBody] = useState<BodyId | null>(null);
  const [teacherMessage, setTeacherMessage] = useState<string>(() =>
    buildTeacherMessage(null, 0),
  );

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
              autoPlay={autoPlay}
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
                onClick={() => setAutoPlay((v) => !v)}
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

