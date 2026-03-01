'use client';

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarSystemScene } from './SolarSystemScene';
import { getPlanetById, getFactForPlanet, SOLAR_SYSTEM_PLANETS } from '@/lib/science-simulations/solar-system-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Globe, Zap, Pause, Play, ExternalLink, Sparkles } from 'lucide-react';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { useLabSoundProfile } from '@/hooks/use-lab-sound-profile';

function buildTeacherMessage(planetId: string | null) {
  if (!planetId) {
    return "Hi explorer! Click on the Sun or any planet to hear me explain what makes it special. You can also use the Play All button to go on a guided tour of the whole solar system.";
  }
  const planet = getPlanetById(planetId);
  if (!planet) {
    return "Click on a planet to learn more about it.";
  }
  const fact = getFactForPlanet(planet.id);
  const orbitInfo = planet.orbitLabel
    ? planet.id === 'sun'
      ? ''
      : ` It takes about ${planet.orbitLabel} to go once around the Sun.`
    : '';
  if (!fact) {
    return `This is ${planet.name}. Click the other planets to compare their sizes and distances from the Sun.${orbitInfo}`;
  }
  return `${planet.name}: ${fact.headline}. ${fact.description}${orbitInfo}`;
}

export function SolarSystemLab() {
  const { playLabSound } = useLabSoundProfile('solar-system');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [timeScale, setTimeScale] = useState(0.3);
  const [isPaused, setIsPaused] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState<string>(() => buildTeacherMessage(null));
  const [isPlayAllMode, setIsPlayAllMode] = useState(false);
  const [playAllIndex, setPlayAllIndex] = useState<number | null>(null);
  const [triggerSpeakKey, setTriggerSpeakKey] = useState(0);

  const tourOrder = useMemo(
    () => SOLAR_SYSTEM_PLANETS.map((p) => p.id),
    []
  );

  const planet = selectedPlanetId ? getPlanetById(selectedPlanetId) : null;
  const fact = planet ? getFactForPlanet(planet.id) : null;

  const handleSelectPlanet = (id: string) => {
    playLabSound('planet-select');
    setIsPlayAllMode(false);
    setPlayAllIndex(null);
    setSelectedPlanetId(id);
    setTeacherMessage(buildTeacherMessage(id));
  };

  const handleStartPlayAll = () => {
    if (!tourOrder.length) return;
    playLabSound('play-all-start');
    setIsPlayAllMode(true);
    setPlayAllIndex(0);
    const firstId = tourOrder[0];
    setSelectedPlanetId(firstId);
    setTeacherMessage(buildTeacherMessage(firstId));
  };

  const handleStopPlayAll = () => {
    playLabSound('play-all-stop');
    setIsPlayAllMode(false);
    setPlayAllIndex(null);
  };

  const handleTogglePlayback = () => {
    playLabSound('playback-toggle');
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:gap-4 lg:flex-row">
      {/* 3D Canvas */}
      <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-0 lg:flex-1 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-900">
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
              onSelectPlanet={handleSelectPlanet}
              timeScale={timeScale}
              selectedPlanetId={selectedPlanetId}
              isPaused={isPaused}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Right panel: controls + info */}
      <div className="w-full lg:w-80 flex-1 min-h-0 flex flex-col gap-3 shrink-0 overflow-y-auto lg:pr-1">
        <Card className="mt-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Explore Modes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleStopPlayAll();
                  setTeacherMessage(
                    'Manual explore mode: click any planet or the Sun, then drag to rotate and scroll to zoom. Use Pause to inspect orbital positions.'
                  );
                  setTriggerSpeakKey((value) => value + 1);
                }}
              >
                Manual explore
              </Button>
              <Button
                variant={isPlayAllMode ? 'outline' : 'default'}
                size="sm"
                onClick={isPlayAllMode ? handleStopPlayAll : handleStartPlayAll}
              >
                {isPlayAllMode ? 'Stop Play All' : 'Play all planets'}
              </Button>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-xs text-muted-foreground">
              {selectedPlanetId ? (
                <p>
                  Focus: <span className="font-semibold text-foreground">{planet?.name}</span>. Use controls below or start guided tour.
                </p>
              ) : (
                <p>Choose a planet to explore manually, or start guided tour for automatic narration.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile compact controls */}
        <div className="md:hidden">
          <Card>
            <CardContent className="pt-3">
              <Accordion type="multiple" defaultValue={['controls', 'planets']}>
                <AccordionItem value="controls">
                  <AccordionTrigger className="py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      Time & speed
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-2">
                    <div className="flex gap-2">
                      <Button
                        variant={isPaused ? 'outline' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={handleTogglePlayback}
                        aria-pressed={!isPaused}
                      >
                        {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                        {isPaused ? 'Play' : 'Pause'}
                      </Button>
                    </div>
                    <Slider
                      value={[timeScale]}
                      onValueChange={([v]) => {
                        setTimeScale(v ?? 0.3);
                      }}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Speed up or slow down orbital motion</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planets">
                  <AccordionTrigger className="py-2 text-sm">Quick select</AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {SOLAR_SYSTEM_PLANETS.map((p) => (
                        <Button
                          key={p.id}
                          variant={selectedPlanetId === p.id ? 'default' : 'outline'}
                          size="sm"
                          className={`h-8 px-2 text-[10px] sm:text-[11px] rounded-md justify-start ${
                            selectedPlanetId === p.id ? 'shadow-sm' : ''
                          }`}
                          onClick={() => handleSelectPlanet(p.id)}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0 mr-1"
                            style={{ backgroundColor: p.color }}
                          />
                          {p.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {planet && fact && (
                  <AccordionItem value="planet-info">
                    <AccordionTrigger className="py-2 text-sm">Planet info: {planet.name}</AccordionTrigger>
                    <AccordionContent className="space-y-2 pb-2">
                      {planet.orbitLabel && (
                        <p className="text-xs text-muted-foreground">Orbit: {planet.orbitLabel}</p>
                      )}
                      <p className="font-medium text-sm">{fact.headline}</p>
                      <p className="text-sm text-muted-foreground">{fact.description}</p>
                      {planet.learnMoreUrl && (
                        <a
                          href={planet.learnMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                        >
                          Learn more at NASA
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Desktop/tablet expanded controls */}
        <div className="hidden md:flex md:flex-col md:gap-4">
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
                  variant={isPaused ? 'outline' : 'default'}
                  size="sm"
                  onClick={handleTogglePlayback}
                  aria-pressed={!isPaused}
                >
                  {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                  {isPaused ? 'Play' : 'Pause'}
                </Button>
              </div>
              <Slider
                value={[timeScale]}
                onValueChange={([v]) => {
                  setTimeScale(v ?? 0.3);
                }}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Speed up or slow down orbital motion</p>
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
                    onClick={() => handleSelectPlanet(p.id)}
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
        </div>

        <TeacherVoice
          message={teacherMessage}
          triggerSpeakKey={triggerSpeakKey}
          autoPlay={true}
          theme="science"
          teacherName="Dr. Galaxy Guide"
          emotion="explaining"
          progressiveReveal={true}
          linesPerChunk={2}
          quickActions={[
            {
              label: 'Replay explanation',
              onClick: () => setTriggerSpeakKey((value) => value + 1),
            },
            {
              label: isPlayAllMode ? 'Stop guided tour' : 'Start guided tour',
              onClick: isPlayAllMode ? handleStopPlayAll : handleStartPlayAll,
            },
          ]}
          onComplete={() => {
            if (!isPlayAllMode || playAllIndex === null) return;
            const nextIndex = playAllIndex + 1;
            if (nextIndex >= tourOrder.length) {
              setIsPlayAllMode(false);
              setPlayAllIndex(null);
              playLabSound('tour-complete');
              return;
            }
            const nextId = tourOrder[nextIndex];
            playLabSound('tour-advance');
            setPlayAllIndex(nextIndex);
            setSelectedPlanetId(nextId);
            setTeacherMessage(buildTeacherMessage(nextId));
          }}
        />
      </div>
    </div>
  );
}
