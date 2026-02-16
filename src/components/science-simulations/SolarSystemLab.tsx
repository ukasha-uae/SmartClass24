'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarSystemScene } from './SolarSystemScene';
import { getPlanetById, getFactForPlanet, SOLAR_SYSTEM_PLANETS } from '@/lib/science-simulations/solar-system-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Globe, Info, Zap, Pause, Play, ExternalLink } from 'lucide-react';

export function SolarSystemLab() {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [timeScale, setTimeScale] = useState(0.3);
  const [isPaused, setIsPaused] = useState(false);

  const planet = selectedPlanetId ? getPlanetById(selectedPlanetId) : null;
  const fact = planet ? getFactForPlanet(planet.id) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] min-h-[500px]">
      {/* 3D Canvas */}
      <div className="flex-1 min-h-[360px] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-900">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
              <div className="text-center">
                <Globe className="h-12 w-12 animate-pulse mx-auto mb-2 text-amber-400" />
                <p>Loading solar system...</p>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 20, 30], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
          >
            <SolarSystemScene
              onSelectPlanet={setSelectedPlanetId}
              timeScale={timeScale}
              selectedPlanetId={selectedPlanetId}
              isPaused={isPaused}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Right panel: controls + info */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Time & speed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={isPaused ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPaused(true)}
                aria-pressed={isPaused}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button
                variant={!isPaused ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPaused(false)}
                aria-pressed={!isPaused}
              >
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
            </div>
            <Slider
              value={[timeScale]}
              onValueChange={([v]) => setTimeScale(v ?? 0.3)}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Speed up or slow down orbital motion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick select</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {SOLAR_SYSTEM_PLANETS.map((p) => (
                <Button
                  key={p.id}
                  variant={selectedPlanetId === p.id ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedPlanetId(p.id)}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0 mr-1"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {planet && fact && (
          <Card className="border-2 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: planet.color }}
                />
                {planet.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {planet.orbitLabel && (
                <p className="text-xs text-muted-foreground">
                  Orbit: {planet.orbitLabel}
                </p>
              )}
              <p className="font-medium text-sm">{fact.headline}</p>
              <p className="text-sm text-muted-foreground">{fact.description}</p>
              {planet.learnMoreUrl && (
                <a
                  href={planet.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                >
                  Learn more at NASA
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedPlanetId && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Info className="h-4 w-4 shrink-0" />
                <p>Click a planet or the Sun in the view, or use Quick select. Drag to rotate, scroll to zoom. Pause to inspect positions.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
