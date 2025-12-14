"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX, Atom, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

// ============================================
// PARTICLE ARRANGEMENT IN THREE STATES
// ============================================

export function ParticleArrangementAnimation() {
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Intelligent teacher narration for each step
  const narrationText = [
    "Welcome! Today we'll explore what matter looks like at the particle level. Everything around you - water, air, rocks, even your own body - is made of tiny particles. But these particles behave very differently depending on whether matter is solid, liquid, or gas. Let's discover how!",
    
    "Let's start with solids. Imagine an ice block melting in the Accra sun, or shea butter during harmattan. In a solid, particles are packed very tightly together, like students standing shoulder to shoulder in assembly. They vibrate in place but cannot move around. This is why solids have a fixed shape and volume. The strong forces between particles keep them locked in position.",
    
    "Now for liquids. Think of palm oil flowing from a bottle, or water in the Volta River. In liquids, particles are still close together, but they can slide past each other. It's like students in a crowded market - close together but able to move. This is why liquids can flow and take the shape of their container, but still have a fixed volume.",
    
    "Finally, gases. Picture steam rising from a pot of boiling kenkey, or the air you breathe. In gases, particles are very far apart and move randomly at high speed in all directions. It's like birds flying freely in the sky - lots of space between them. This is why gases fill any container completely and can be compressed.",
    
    "Let's compare all three states side by side. Notice the key differences: solids have particles tightly packed in fixed positions, liquids have particles close but mobile, and gases have particles far apart and moving freely. Temperature and pressure can change matter from one state to another by adding or removing energy!"
  ];

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: narrationText[step] || '',
    autoPlay: false,
    rate: 0.9,
  });

  useEffect(() => {
    if (step > 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  // Auto-narrate when step changes (if autoNarrate is enabled)
  useEffect(() => {
    if (autoNarrate) {
      const timer = setTimeout(() => {
        speak();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step, autoNarrate, speak]);

  const handleNext = () => {
    if (step < totalSteps) {
      stop();
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      stop();
      setStep(step - 1);
    }
  };

  const toggleNarration = () => {
    if (isSpeaking) {
      stop();
      setAutoNarrate(false);
    } else {
      setAutoNarrate(true);
      speak();
    }
  };

  const handleReset = () => {
    stop();
    setStep(0);
  };

  // Particle component for animations
  const Particle = ({ delay = 0, type = 'solid' }: { delay?: number; type?: 'solid' | 'liquid' | 'gas' }) => {
    const solidAnimation = {
      x: [0, 2, 0, -2, 0],
      y: [0, 2, 0, -2, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: delay,
      }
    };

    const liquidAnimation = {
      x: [0, 10, -10, 5, 0],
      y: [0, -5, 5, -3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: delay,
      }
    };

    const gasAnimation = {
      x: [0, 40, -40, 30, -20, 0],
      y: [0, -30, 30, -40, 20, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        delay: delay,
      }
    };

    const getAnimation = () => {
      if (type === 'solid') return solidAnimation;
      if (type === 'liquid') return liquidAnimation;
      return gasAnimation;
    };

    return (
      <motion.div
        animate={getAnimation()}
        className={cn(
          "rounded-full",
          type === 'solid' && "w-3 h-3 bg-blue-500",
          type === 'liquid' && "w-3 h-3 bg-cyan-500",
          type === 'gas' && "w-2.5 h-2.5 bg-purple-400"
        )}
      />
    );
  };

  return (
    <Card ref={cardRef} className="my-6 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Atom className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Particle Arrangement in Three States
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {isSupported && (
              <Button 
                size="sm" 
                onClick={toggleNarration} 
                variant={isSpeaking ? "default" : "outline"}
                className="flex-1 sm:flex-none"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Button size="sm" onClick={handlePrevious} disabled={step === 0} className="flex-1 sm:flex-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleReset} variant="outline" className="flex-1 sm:flex-none">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleNext} disabled={step === totalSteps} className="flex-1 sm:flex-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-4">
          <Badge variant="secondary" className="text-xs">
            Step {step} of {totalSteps}
          </Badge>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center min-h-[400px]"
            >
              {/* Step 0: Introduction */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-xl font-semibold text-blue-700 mb-4">
                    What Does Matter Look Like Inside?
                  </div>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <Atom className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="font-semibold text-sm">SOLID</div>
                      <div className="text-xs text-muted-foreground mt-1">Ice blocks, shea butter</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <Droplet className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                      <div className="font-semibold text-sm">LIQUID</div>
                      <div className="text-xs text-muted-foreground mt-1">Water, palm oil</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <Wind className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="font-semibold text-sm">GAS</div>
                      <div className="text-xs text-muted-foreground mt-1">Steam, air</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-6">
                    Let's zoom in to the particle level and see how matter behaves in each state
                  </p>
                </div>
              )}

              {/* Step 1: SOLID STATE */}
              {step === 1 && (
                <div className="space-y-6 w-full p-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Atom className="h-6 w-6 text-blue-600" />
                    <div className="text-lg font-semibold">SOLID STATE</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Visual */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <div className="text-sm font-semibold mb-4 text-center">Particle Arrangement</div>
                      <div className="border-4 border-blue-300 rounded-lg p-8 bg-blue-50 dark:bg-blue-900/20 min-h-[200px] flex items-center justify-center">
                        <div className="grid grid-cols-5 gap-3">
                          {[...Array(25)].map((_, i) => (
                            <Particle key={i} delay={i * 0.1} type="solid" />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-3 text-muted-foreground">
                        Particles vibrate but stay in fixed positions
                      </div>
                    </div>

                    {/* Properties */}
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <div className="font-semibold text-sm mb-2">Properties:</div>
                        <ul className="text-xs space-y-1">
                          <li>✓ Fixed shape and volume</li>
                          <li>✓ Cannot be compressed</li>
                          <li>✓ Particles very close together</li>
                          <li>✓ Strong forces between particles</li>
                          <li>✓ Particles only vibrate</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                        <div className="font-semibold text-sm mb-2">Ghana Examples:</div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>🧊 Ice blocks in freezer</li>
                          <li>🥜 Shea butter (harmattan)</li>
                          <li>⛰️ Rocks, metals, wood</li>
                          <li>🧂 Salt, sugar crystals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: LIQUID STATE */}
              {step === 2 && (
                <div className="space-y-6 w-full p-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Droplet className="h-6 w-6 text-cyan-600" />
                    <div className="text-lg font-semibold">LIQUID STATE</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Visual */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <div className="text-sm font-semibold mb-4 text-center">Particle Arrangement</div>
                      <div className="border-4 border-cyan-300 rounded-lg p-8 bg-cyan-50 dark:bg-cyan-900/20 min-h-[200px] flex items-center justify-center">
                        <div className="relative w-full h-[200px]">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute"
                              style={{
                                left: `${(i % 5) * 20}%`,
                                top: `${Math.floor(i / 5) * 25}%`,
                              }}
                            >
                              <Particle delay={i * 0.15} type="liquid" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-3 text-muted-foreground">
                        Particles can slide past each other
                      </div>
                    </div>

                    {/* Properties */}
                    <div className="space-y-3">
                      <div className="p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                        <div className="font-semibold text-sm mb-2">Properties:</div>
                        <ul className="text-xs space-y-1">
                          <li>✓ Takes shape of container</li>
                          <li>✓ Fixed volume</li>
                          <li>✓ Cannot be compressed</li>
                          <li>✓ Particles close but can move</li>
                          <li>✓ Can flow freely</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                        <div className="font-semibold text-sm mb-2">Ghana Examples:</div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>💧 Water, Volta River</li>
                          <li>🌴 Palm oil, palm wine</li>
                          <li>🥛 Milk, beverages</li>
                          <li>⛽ Petrol, kerosene</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: GAS STATE */}
              {step === 3 && (
                <div className="space-y-6 w-full p-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Wind className="h-6 w-6 text-purple-600" />
                    <div className="text-lg font-semibold">GAS STATE</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Visual */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                      <div className="text-sm font-semibold mb-4 text-center">Particle Arrangement</div>
                      <div className="border-4 border-purple-300 rounded-lg p-8 bg-purple-50 dark:bg-purple-900/20 min-h-[200px] flex items-center justify-center">
                        <div className="relative w-full h-[200px]">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute"
                              style={{
                                left: `${Math.random() * 80}%`,
                                top: `${Math.random() * 80}%`,
                              }}
                            >
                              <Particle delay={i * 0.2} type="gas" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-3 text-muted-foreground">
                        Particles move freely and randomly at high speed
                      </div>
                    </div>

                    {/* Properties */}
                    <div className="space-y-3">
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <div className="font-semibold text-sm mb-2">Properties:</div>
                        <ul className="text-xs space-y-1">
                          <li>✓ No fixed shape or volume</li>
                          <li>✓ Fills entire container</li>
                          <li>✓ Can be compressed easily</li>
                          <li>✓ Particles very far apart</li>
                          <li>✓ Move randomly at high speed</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                        <div className="font-semibold text-sm mb-2">Ghana Examples:</div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>💨 Air (oxygen, nitrogen)</li>
                          <li>🔥 LPG cooking gas</li>
                          <li>♨️ Steam from kenkey pot</li>
                          <li>💨 Smoke from charcoal fire</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: COMPARISON */}
              {step === 4 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Comparing All Three States</div>
                  
                  {/* Visual Comparison */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300">
                      <Atom className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm text-center mb-2">SOLID</div>
                      <div className="h-20 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1">
                          {[...Array(9)].map((_, i) => (
                            <Particle key={i} delay={i * 0.1} type="solid" />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-2 text-muted-foreground">Tightly packed</div>
                    </div>

                    <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-2 border-cyan-300">
                      <Droplet className="h-5 w-5 text-cyan-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm text-center mb-2">LIQUID</div>
                      <div className="h-20 flex items-center justify-center relative">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${(i % 3) * 30}%`,
                              top: `${Math.floor(i / 3) * 30}%`,
                            }}
                          >
                            <Particle delay={i * 0.15} type="liquid" />
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-center mt-2 text-muted-foreground">Close but mobile</div>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-300">
                      <Wind className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm text-center mb-2">GAS</div>
                      <div className="h-20 flex items-center justify-center relative">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${Math.random() * 70}%`,
                              top: `${Math.random() * 70}%`,
                            }}
                          >
                            <Particle delay={i * 0.2} type="gas" />
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-center mt-2 text-muted-foreground">Very far apart</div>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="border p-2 text-left">Property</th>
                          <th className="border p-2 bg-blue-50 dark:bg-blue-900/20">Solid</th>
                          <th className="border p-2 bg-cyan-50 dark:bg-cyan-900/20">Liquid</th>
                          <th className="border p-2 bg-purple-50 dark:bg-purple-900/20">Gas</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2 font-semibold">Shape</td>
                          <td className="border p-2">Fixed</td>
                          <td className="border p-2">Takes container</td>
                          <td className="border p-2">Fills container</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-semibold">Volume</td>
                          <td className="border p-2">Fixed</td>
                          <td className="border p-2">Fixed</td>
                          <td className="border p-2">Expands</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-semibold">Compressible</td>
                          <td className="border p-2">No</td>
                          <td className="border p-2">No</td>
                          <td className="border p-2">Yes</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-semibold">Particle spacing</td>
                          <td className="border p-2">Very close</td>
                          <td className="border p-2">Close</td>
                          <td className="border p-2">Very far</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-semibold">Movement</td>
                          <td className="border p-2">Vibrate only</td>
                          <td className="border p-2">Slide past</td>
                          <td className="border p-2">Random, fast</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <div className="text-sm font-semibold mb-2">💡 Key Insight:</div>
                    <p className="text-xs text-muted-foreground">
                      Adding heat energy makes particles move faster and spread apart. 
                      Removing heat energy makes them slow down and come closer together. 
                      This is how matter changes from one state to another!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
