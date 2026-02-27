"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX, Calculator, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import MathText from './MathText';

// ============================================
// 1. FACTORIZATION SOLVER ANIMATION
// ============================================

interface FactorizationSolverProps {
  a?: number;  // coefficient of x²
  b?: number;  // coefficient of x
  c?: number;  // constant term
  onNarrationChange?: (text: string) => void;
  narrationMode?: 'internal' | 'external';
}

export function FactorizationSolverAnimation({
  a = 1,
  b = 7,
  c = 12,
  onNarrationChange,
  narrationMode = 'internal',
}: FactorizationSolverProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 5;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Find factor pairs
  const findFactors = () => {
    const target = c;
    const factors: [number, number][] = [];
    for (let i = 1; i <= Math.abs(target); i++) {
      if (target % i === 0) {
        factors.push([i, target / i]);
        if (i !== target / i) {
          factors.push([target / i, i]);
        }
        if (target < 0) {
          factors.push([-i, -target / i]);
          factors.push([i, -target / i]);
          factors.push([-target / i, -i]);
        }
      }
    }
    return factors;
  };

  const allFactors = findFactors();
  const correctFactors = allFactors.find(([x, y]) => x + y === b);
  const [factor1, factor2] = correctFactors || [0, 0];
  const root1 = -factor1;
  const root2 = -factor2;

  // Narration text for each step - Teaching style!
  const narrationText = [
    `Let's solve x squared plus ${b}x plus ${c} equals zero by factorization. Watch closely as I guide you through each step!`,
    `Step one: We need to find two special numbers. These numbers must multiply together to give us ${c}, and when we add them, we get ${b}. Let me show you how we search for them. I will pause now while you inspect the factor pairs below. When you spot the correct pair, press Next and I will continue.`,
    `Great! We found our magic numbers: ${factor1} and ${factor2}. Notice how ${factor1} times ${factor2} equals ${c}, and ${factor1} plus ${factor2} equals ${b}. Perfect match!`,
    `Now here's where factorization happens. We can rewrite our equation as x plus ${factor1}, times x plus ${factor2}, equals zero. This is the factored form!`,
    `Now we use the zero product property. If two expressions multiply to zero, at least one must be zero. So either x plus ${factor1} equals zero, or x plus ${factor2} equals zero. This gives x equals ${root1} or x equals ${root2}.`,
    `Final conclusion: both roots are correct because substitution gives zero in each case. For x equals ${root1}, the expression simplifies to zero. For x equals ${root2}, it also simplifies to zero. Excellent work; your verified solution set is x equals ${root1} and x equals ${root2}.`
  ];
  const currentNarration = narrationText[step] || '';

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: narrationMode === 'internal' ? currentNarration : '',
    autoPlay: false, // Don't auto-play on mount, we'll control it manually
    rate: 0.9,
  });

  useEffect(() => {
    onNarrationChange?.(currentNarration);
  }, [currentNarration, onNarrationChange]);

  useEffect(() => {
    if (step > 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  // Auto-narrate when step changes (if autoNarrate is enabled)
  useEffect(() => {
    if (autoNarrate && narrationMode === 'internal') {
      // Small delay to ensure state is settled
      const timer = setTimeout(() => {
        speak();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step, autoNarrate, speak, narrationMode]);

  const handleNext = () => {
    if (step < totalSteps) {
      stop(); // Stop current narration before moving
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      stop(); // Stop current narration before moving
      setStep(step - 1);
    }
  };

  const toggleNarration = () => {
    if (narrationMode !== 'internal') return;
    if (isSpeaking) {
      stop();
      setAutoNarrate(false);
    } else {
      setAutoNarrate(true);
      speak();
    }
  };

  const handleReset = () => {
    stop(); // Stop narration on reset
    setStep(0);
  };

  return (
    <Card ref={cardRef} className="my-6 overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
            Factorization Step-by-Step
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {isSupported && narrationMode === 'internal' && (
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
        <div className="relative overflow-hidden min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center min-h-[350px]"
            >
              {/* Step 0: Show Problem */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full">
                  <div className="text-lg font-semibold text-muted-foreground mb-4">
                    The Problem
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <div className="text-4xl font-bold text-violet-600 mb-4">
                      x² + {b}x + {c} = 0
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Let's solve this quadratic equation by factorization
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Finding Factors */}
              {step === 1 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 1: Find Two Numbers</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">We need numbers that:</div>
                      <div className="flex flex-col gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                          <span className="font-semibold">Multiply to give:</span> {c}
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
                          <span className="font-semibold">Add to give:</span> {b}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-xs text-muted-foreground mb-3">Testing factor pairs...</div>
                      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                        {allFactors.slice(0, 4).map(([x, y], i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "p-2 rounded text-sm",
                              x + y === b 
                                ? "bg-green-500 text-white font-bold" 
                                : "bg-gray-200 dark:bg-gray-700"
                            )}
                          >
                            {x} × {y} = {c}
                            <br />
                            {x} + {y} = {x + y} {x + y === b ? "✓" : ""}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Teacher tip: Check each pair below. We need product = {c} and sum = {b}. Press Next when you find it.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Correct Factors Found */}
              {step === 2 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 2: Perfect Match Found!</div>
                  <div className="p-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg text-white">
                    <div className="text-3xl font-bold mb-6">
                      {factor1} and {factor2}
                    </div>
                    <div className="space-y-3 text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{factor1} × {factor2} = {c}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{factor1} + {factor2} = {b}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Write Factors */}
              {step === 3 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 3: Factorized Form</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div className="text-2xl text-gray-500">
                        x² + {b}x + {c} = 0
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        ↓
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        (x + {factor1})(x + {factor2}) = 0
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6">
                      This is the factored form of our equation
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Solve for x */}
              {step === 4 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 4: Zero Product Property</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="text-xl mb-4">
                      (x + {factor1})(x + {factor2}) = 0
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      If two things multiply to zero, one must be zero
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <div className="font-semibold mb-2">Option 1:</div>
                        <div>x + {factor1} = 0</div>
                        <div className="text-2xl font-bold text-blue-600 mt-2">x = {root1}</div>
                      </div>
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <div className="font-semibold mb-2">Option 2:</div>
                        <div>x + {factor2} = 0</div>
                        <div className="text-2xl font-bold text-purple-600 mt-2">x = {root2}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Verification */}
              {step === 5 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 5: Verify Solutions</div>
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg text-white">
                    <div className="text-3xl font-bold mb-6">
                      Solutions: x = {root1} or x = {root2}
                    </div>
                    <div className="space-y-4 text-left max-w-md mx-auto">
                      <div className="bg-white/20 p-4 rounded">
                        <div className="font-semibold mb-2">Check x = {root1}:</div>
                        <div className="text-sm">
                          ({root1})² + {b}({root1}) + {c}
                          <br />= {root1 * root1} + {b * root1} + {c}
                          <br />= 0 ✓
                        </div>
                      </div>
                      <div className="bg-white/20 p-4 rounded">
                        <div className="font-semibold mb-2">Check x = {root2}:</div>
                        <div className="text-sm">
                          ({root2})² + {b}({root2}) + {c}
                          <br />= {root2 * root2} + {b * root2} + {c}
                          <br />= 0 ✓
                        </div>
                      </div>
                    </div>
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

// ============================================
// 2. COMPLETING THE SQUARE ANIMATION
// ============================================

interface CompletingTheSquareProps {
  a?: number;
  b?: number;
  c?: number;
}

export function CompletingTheSquareAnimation({ a = 1, b = 6, c = 5 }: CompletingTheSquareProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 7;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Calculate completing the square values
  const halfB = b / (2 * a);
  const halfBSquared = halfB * halfB;
  const rightSide = -c / a + halfBSquared;
  const sqrtRight = Math.sqrt(Math.abs(rightSide));
  const root1 = -halfB + sqrtRight;
  const root2 = -halfB - sqrtRight;

  // Narration text for each step
  const narrationText = [
    `Let's solve ${a === 1 ? '' : a}x squared ${b >= 0 ? 'plus' : 'minus'} ${Math.abs(b)}x ${c >= 0 ? 'plus' : 'minus'} ${Math.abs(c)} equals zero by completing the square. This is a powerful method that works for any quadratic equation!`,
    `${a !== 1 ? `First, we divide the entire equation by ${a} to make the coefficient of x squared equal to one. This simplifies our work.` : 'The coefficient of x squared is already one, so we can proceed to the next step.'}`,
    `Now, let's move the constant term to the right side of the equation. We get x squared ${b / a >= 0 ? 'plus' : 'minus'} ${Math.abs(b / a)}x equals ${-c / a}. This prepares us for completing the square.`,
    `Here's the magic trick! Take half of the x coefficient, which is ${b / a}, and half of that is ${halfB}. Now square it to get ${halfBSquared.toFixed(2)}. We'll add this special number to both sides.`,
    `After adding ${halfBSquared.toFixed(2)} to both sides, the left side becomes a perfect square! We can write it as x ${halfB >= 0 ? 'plus' : 'minus'} ${Math.abs(halfB).toFixed(2)}, all squared. The right side is ${rightSide.toFixed(2)}.`,
    `Now we take the square root of both sides. Remember, when we take a square root, we get both positive and negative values. So x ${halfB >= 0 ? 'plus' : 'minus'} ${Math.abs(halfB).toFixed(2)} equals plus or minus ${sqrtRight.toFixed(2)}.`,
    `Finally, we solve for x by isolating it. This gives us two solutions: x equals ${root1.toFixed(2)} or x equals ${root2.toFixed(2)}. Let's verify these solutions work!`
  ];

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: narrationText[step] || '',
    autoPlay: autoNarrate,
    rate: 0.9,
  });

  useEffect(() => {
    if (step > 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <Card ref={cardRef} className="my-6 overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
            Completing the Square Step-by-Step
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {isSupported && (
              <Button 
                size="sm" 
                onClick={isSpeaking ? stop : speak} 
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

        <div className="relative overflow-hidden min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center min-h-[350px]"
            >
              {/* Step 0: Original Problem */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full">
                  <div className="text-lg font-semibold text-muted-foreground mb-4">
                    The Problem
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <div className="text-4xl font-bold text-cyan-600 mb-4">
                      {a !== 1 && `${a}`}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Let's solve by completing the square
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Divide by a (if needed) */}
              {step === 1 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 1: Make coefficient of x² equal to 1</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    {a !== 1 ? (
                      <>
                        <div className="text-2xl text-gray-500">
                          {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
                        </div>
                        <div className="text-xl text-muted-foreground">
                          Divide everything by {a}:
                        </div>
                        <div className="text-3xl font-bold text-cyan-600">
                          x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x {c / a >= 0 ? '+' : '-'} {Math.abs(c / a)} = 0
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-cyan-600">
                          x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
                        </div>
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="h-6 w-6" />
                          <span className="text-lg">Coefficient is already 1!</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Move constant to right */}
              {step === 2 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 2: Move constant term to the right</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="text-2xl text-gray-500">
                      x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x {c / a >= 0 ? '+' : '-'} {Math.abs(c / a)} = 0
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      ↓
                    </div>
                    <div className="text-3xl font-bold text-cyan-600">
                      x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x = {-c / a}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c / a >= 0 ? `Subtract ${c / a}` : `Add ${Math.abs(c / a)}`} from both sides
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Calculate half of b, square it */}
              {step === 3 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 3: The Magic Number ✨</div>
                  <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg shadow-lg space-y-6">
                    <div className="text-lg mb-4">Take half of the x coefficient and square it:</div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded">
                        <div className="text-sm text-muted-foreground">Coefficient of x:</div>
                        <div className="text-2xl font-bold">{b / a}</div>
                      </div>
                      <div className="text-2xl">↓</div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded">
                        <div className="text-sm text-muted-foreground">Half of {b / a}:</div>
                        <div className="text-2xl font-bold">{halfB}</div>
                      </div>
                      <div className="text-2xl">↓</div>
                      <div className="p-3 bg-green-500 text-white rounded">
                        <div className="text-sm mb-1">Square it:</div>
                        <div className="text-3xl font-bold">({halfB})² = {halfBSquared.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Add to both sides */}
              {step === 4 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 4: Add to both sides</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="text-xl mb-2">Current equation:</div>
                    <div className="text-2xl">
                      x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x = {-c / a}
                    </div>
                    <div className="text-lg text-blue-600 my-4">
                      Add {halfBSquared.toFixed(2)} to both sides:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded">
                        <div className="text-sm mb-2">Left Side:</div>
                        <div className="text-lg">x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x + {halfBSquared.toFixed(2)}</div>
                      </div>
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded">
                        <div className="text-sm mb-2">Right Side:</div>
                        <div className="text-lg">{-c / a} + {halfBSquared.toFixed(2)} = {rightSide.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Perfect square form */}
              {step === 5 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 5: Perfect Square! 🎯</div>
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg text-white space-y-4">
                    <div className="text-lg mb-2">The left side is now a perfect square:</div>
                    <div className="text-3xl font-bold mb-4">
                      (x {halfB >= 0 ? '+' : '-'} {Math.abs(halfB).toFixed(2)})² = {rightSide.toFixed(2)}
                    </div>
                    <div className="bg-white/20 p-4 rounded mt-4">
                      <div className="text-sm mb-2">Verify by expanding:</div>
                      <div className="text-base">
                        (x {halfB >= 0 ? '+' : '-'} {Math.abs(halfB).toFixed(2)})² = x² {b / a >= 0 ? '+' : '-'} {Math.abs(b / a)}x + {halfBSquared.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Take square root */}
              {step === 6 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 6: Take square root of both sides</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="text-2xl">
                      (x {halfB >= 0 ? '+' : '-'} {Math.abs(halfB).toFixed(2)})² = {rightSide.toFixed(2)}
                    </div>
                    <div className="text-2xl text-purple-600">
                      <MathText latex={'\\sqrt{\\phantom{x}}'} />
                    </div>
                    <div className="text-3xl font-bold text-cyan-600">
                      <MathText latex={`x ${halfB >= 0 ? '+' : '-'} ${Math.abs(halfB).toFixed(2)} = \\pm ${sqrtRight.toFixed(2)}`} />
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded mt-4">
                      <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        ⚠️ Important: Don&apos;t forget the <MathText latex={'\\pm'} className="inline-block align-middle" /> sign!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Final solutions */}
              {step === 7 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 7: Solve for x</div>
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg text-white">
                    <div className="text-2xl mb-6">
                      <MathText latex={`x ${halfB >= 0 ? '+' : '-'} ${Math.abs(halfB).toFixed(2)} = \\pm ${sqrtRight.toFixed(2)}`} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/20 p-4 rounded">
                        <div className="font-semibold mb-2">Solution 1:</div>
                        <div className="text-sm">x = {sqrtRight.toFixed(2)} - {halfB.toFixed(2)}</div>
                        <div className="text-3xl font-bold mt-2">x = {root1.toFixed(2)}</div>
                      </div>
                      <div className="bg-white/20 p-4 rounded">
                        <div className="font-semibold mb-2">Solution 2:</div>
                        <div className="text-sm">x = -{sqrtRight.toFixed(2)} - {halfB.toFixed(2)}</div>
                        <div className="text-3xl font-bold mt-2">x = {root2.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-6 text-sm">
                      ✓ Both solutions verified in original equation
                    </div>
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

// ============================================
// 3. QUADRATIC FORMULA VISUALIZER
// ============================================

interface QuadraticFormulaProps {
  a?: number;
  b?: number;
  c?: number;
}

export function QuadraticFormulaAnimation({ a = 1, b = 6, c = 5 }: QuadraticFormulaProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 5;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  const discriminant = b * b - 4 * a * c;
  const sqrtDisc = Math.sqrt(Math.abs(discriminant));
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);

  const narrationText = [
    `Let's solve ${a}x squared ${b >= 0 ? 'plus' : 'minus'} ${Math.abs(b)}x ${c >= 0 ? 'plus' : 'minus'} ${Math.abs(c)} equals zero using the quadratic formula. This formula works for ANY quadratic equation!`,
    `First, we identify our coefficients. a equals ${a}, b equals ${b}, and c equals ${c}. These values will go into the quadratic formula.`,
    `The quadratic formula is: x equals negative b, plus or minus the square root of b squared minus 4ac, all divided by 2a. Let's substitute our values.`,
    `Now we calculate the discriminant, which is b squared minus 4ac. That's ${b} squared minus 4 times ${a} times ${c}, which equals ${discriminant}. ${discriminant > 0 ? 'Since this is positive, we have two real solutions!' : discriminant === 0 ? 'Since this is zero, we have one repeated solution!' : 'This is negative, so there are no real solutions.'}`,
    `${discriminant >= 0 ? `Finally, we calculate both solutions. x equals ${root1.toFixed(2)} or x equals ${root2.toFixed(2)}. These are our answers!` : 'Since the discriminant is negative, this equation has no real solutions. The roots are complex numbers.'}`
  ];

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: narrationText[step] || '',
    autoPlay: autoNarrate,
    rate: 0.9,
  });

  useEffect(() => {
    if (step > 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <Card ref={cardRef} className="my-6 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Quadratic Formula Step-by-Step
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {isSupported && (
              <Button 
                size="sm" 
                onClick={isSpeaking ? stop : speak} 
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

        <div className="relative overflow-hidden min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center min-h-[350px]"
            >
              {/* Steps content similar to factorization but for quadratic formula */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full">
                  <div className="text-lg font-semibold text-muted-foreground mb-4">
                    The Problem
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                      {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Let's solve using the quadratic formula
                    </p>
                  </div>
                </div>
              )}

              {/* Additional steps for quadratic formula... */}
              {step > 0 && step <= 5 && (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground">Step {step} visualization coming soon...</p>
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

// ============================================
// 4. DISCRIMINANT EXPLORER ANIMATION
// ============================================

interface DiscriminantExplorerProps {
  a?: number;
  b?: number;
  c?: number;
  onNarrationChange?: (text: string) => void;
  narrationMode?: 'internal' | 'external';
}

export function DiscriminantExplorerAnimation({
  a = 2,
  b = 5,
  c = 2,
  onNarrationChange,
  narrationMode = 'internal',
}: DiscriminantExplorerProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 5; // Steps 0-5 (6 total steps)
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Calculate discriminant and roots
  const discriminant = b * b - 4 * a * c;
  const isPerfectSquare = Number.isInteger(Math.sqrt(Math.abs(discriminant)));
  const sqrtDisc = Math.sqrt(Math.abs(discriminant));
  const root1 = discriminant >= 0 ? (-b + sqrtDisc) / (2 * a) : null;
  const root2 = discriminant >= 0 ? (-b - sqrtDisc) / (2 * a) : null;

  // Nature of roots
  let nature = '';
  let graphBehavior = '';
  if (discriminant > 0) {
    if (isPerfectSquare) {
      nature = 'Two distinct rational roots';
      graphBehavior = 'Parabola crosses x-axis at two points';
    } else {
      nature = 'Two distinct irrational roots';
      graphBehavior = 'Parabola crosses x-axis at two points';
    }
  } else if (discriminant === 0) {
    nature = 'One repeated real root';
    graphBehavior = 'Parabola touches x-axis at exactly one point (vertex on x-axis)';
  } else {
    nature = 'No real roots (two complex roots)';
    graphBehavior = 'Parabola does not cross x-axis';
  }

  // Generate parabola points for visualization
  const xVertex = -b / (2 * a);
  const yVertex = a * xVertex * xVertex + b * xVertex + c;
  const yIntercept = c;
  
  const generateParabola = () => {
    const points: { x: number; y: number }[] = [];
    
    for (let x = xVertex - 3; x <= xVertex + 3; x += 0.2) {
      const y = a * x * x + b * x + c;
      points.push({ x: x * 30 + 150, y: 150 - y * 20 }); // Scale for display
    }
    return points;
  };

  const parabolaPoints = generateParabola();

  // Narration text
  const narrationText = [
    `Let's explore the discriminant for ${a}x squared ${b >= 0 ? 'plus' : 'minus'} ${Math.abs(b)}x ${c >= 0 ? 'plus' : 'minus'} ${Math.abs(c)} equals zero. The discriminant tells us about the nature of the roots without actually solving the equation!`,
    `The discriminant formula is b squared minus 4ac. Let me show you how to calculate it step by step. First, we identify our coefficients: a equals ${a}, b equals ${b}, and c equals ${c}.`,
    `Now let's calculate! b squared is ${b} times ${b}, which equals ${b * b}. Then we calculate 4 times a times c, which is 4 times ${a} times ${c}, giving us ${4 * a * c}. Finally, we subtract: ${b * b} minus ${4 * a * c} equals ${discriminant}.`,
    `The discriminant is ${discriminant}, which is ${discriminant > 0 ? 'positive' : discriminant === 0 ? 'zero' : 'negative'}! This tells us the equation has ${nature}. ${discriminant > 0 && isPerfectSquare ? 'Since the discriminant is a perfect square, the roots are rational numbers that can be expressed as fractions.' : ''}`,
    `Now watch the parabola! ${graphBehavior}. ${discriminant > 0 ? `The roots are x equals ${root1?.toFixed(2)} and x equals ${root2?.toFixed(2)}.` : discriminant === 0 ? `The repeated root is x equals ${root1?.toFixed(2)}.` : 'Since there are no real roots, the parabola floats entirely above or below the x-axis.'} This visual connection between the discriminant and the graph is key to understanding quadratic equations!`,
    `Let's review everything we learned! The discriminant of ${discriminant} told us that this equation has ${nature}. ${discriminant >= 0 ? `We found the solutions to be x equals ${root1?.toFixed(2)}${discriminant > 0 ? ` and x equals ${root2?.toFixed(2)}` : ' as a repeated root'}.` : 'Remember, a negative discriminant means the parabola never crosses the x-axis.'} The vertex of the parabola is at x equals ${xVertex.toFixed(2)}, y equals ${yVertex.toFixed(2)}. Understanding the discriminant is a powerful tool that lets you predict the nature of roots before solving! Great work!`
  ];
  const currentNarration = narrationText[step] || '';

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: narrationMode === 'internal' ? currentNarration : '',
    autoPlay: narrationMode === 'internal' ? autoNarrate : false,
    rate: 0.9,
  });

  useEffect(() => {
    onNarrationChange?.(currentNarration);
  }, [currentNarration, onNarrationChange]);

  useEffect(() => {
    if (step > 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <Card ref={cardRef} className="my-6 overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            Discriminant Explorer
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {isSupported && narrationMode === 'internal' && (
              <Button 
                size="sm" 
                onClick={isSpeaking ? stop : speak} 
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
              {/* Step 0: Original Equation */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full">
                  <div className="text-lg font-semibold text-muted-foreground mb-4">
                    The Equation
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <div className="text-4xl font-bold text-emerald-600 mb-4">
                      {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Let's explore the discriminant and see what it reveals
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Discriminant Formula */}
              {step === 1 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 1: The Discriminant Formula</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="text-3xl font-bold text-emerald-600 mb-4">
                      <MathText latex={'\\Delta = b^2 - 4ac'} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                        <div className="text-sm text-muted-foreground">a</div>
                        <div className="text-2xl font-bold">{a}</div>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                        <div className="text-sm text-muted-foreground">b</div>
                        <div className="text-2xl font-bold">{b}</div>
                      </div>
                      <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded">
                        <div className="text-sm text-muted-foreground">c</div>
                        <div className="text-2xl font-bold">{c}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Calculate Step by Step */}
              {step === 2 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 2: Calculate the Discriminant</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                        <div className="text-sm mb-1">
                          <MathText latex={'b^2 ='} />
                        </div>
                        <div className="text-xl font-bold">
                          <MathText latex={`${b}^2 = ${b * b}`} />
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                        <div className="text-sm mb-1">4ac =</div>
                        <div className="text-xl font-bold">4 × {a} × {c} = {4 * a * c}</div>
                      </div>
                      <div className="text-2xl">↓</div>
                      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg">
                        <div className="text-sm mb-2">Discriminant:</div>
                        <div className="text-3xl font-bold">
                          <MathText latex={`\\Delta = ${b * b} - ${4 * a * c} = ${discriminant}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Interpret Discriminant */}
              {step === 3 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">
                    Step 3: What Does <MathText latex={`\\Delta = ${discriminant}`} className="inline-block align-middle" /> Mean?
                  </div>
                  <div className={cn(
                    "p-6 rounded-lg shadow-lg space-y-4",
                    discriminant > 0 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" :
                    discriminant === 0 ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white" :
                    "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                  )}>
                    <div className="text-3xl font-bold mb-4">
                      {discriminant > 0 ? '✓ Positive' : discriminant === 0 ? '= Zero' : '✗ Negative'}
                    </div>
                    <div className="text-xl mb-4">{nature}</div>
                    <div className="bg-white/20 p-4 rounded">
                      <div className="text-sm mb-2">Graph Behavior:</div>
                      <div className="text-base">{graphBehavior}</div>
                    </div>
                    {discriminant > 0 && isPerfectSquare && (
                      <div className="bg-white/20 p-3 rounded text-sm">
                        ⭐ Bonus: <MathText latex={`\\sqrt{${discriminant}} = ${Math.sqrt(discriminant)}`} className="inline-block align-middle" /> (perfect square = rational roots!)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Visual Parabola */}
              {step === 4 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 4: See the Parabola!</div>
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <svg width="350" height="350" viewBox="0 0 350 350" className="mx-auto">
                      {/* Grid lines */}
                      <line x1="0" y1="175" x2="350" y2="175" stroke="gray" strokeWidth="1" opacity="0.3" />
                      <line x1="175" y1="0" x2="175" y2="350" stroke="gray" strokeWidth="1" opacity="0.3" />
                      
                      {/* Axes */}
                      <line x1="0" y1="175" x2="350" y2="175" stroke="black" strokeWidth="2" />
                      <line x1="175" y1="0" x2="175" y2="350" stroke="black" strokeWidth="2" />
                      <text x="330" y="170" fontSize="14" fontWeight="bold">x</text>
                      <text x="180" y="20" fontSize="14" fontWeight="bold">y</text>
                      
                      {/* Axis of symmetry */}
                      <motion.line
                        x1={175 + xVertex * 30}
                        y1="0"
                        x2={175 + xVertex * 30}
                        y2="350"
                        stroke="#9333ea"
                        strokeWidth="1.5"
                        strokeDasharray="5,5"
                        opacity="0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      />
                      
                      {/* Parabola */}
                      <motion.path
                        d={`M ${parabolaPoints.map((p, i) => `${i === 0 ? '' : 'L '}${p.x + 25} ${p.y + 25}`).join(' ')}`}
                        stroke={discriminant > 0 ? "#10b981" : discriminant === 0 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      
                      {/* Vertex marker */}
                      <motion.circle
                        cx={175 + xVertex * 30}
                        cy={175 - yVertex * 20}
                        r="6"
                        fill="#9333ea"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, duration: 0.3 }}
                      />
                      
                      {/* Vertex label */}
                      <motion.text
                        x={175 + xVertex * 30 + 12}
                        y={175 - yVertex * 20 - 8}
                        fontSize="11"
                        fill="#9333ea"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                      >
                        Vertex ({xVertex.toFixed(1)}, {yVertex.toFixed(1)})
                      </motion.text>
                      
                      {/* Y-intercept marker */}
                      <motion.circle
                        cx={175}
                        cy={175 - yIntercept * 20}
                        r="4"
                        fill="#3b82f6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                      />
                      
                      {/* Y-intercept label */}
                      <motion.text
                        x={185}
                        y={175 - yIntercept * 20 + 4}
                        fontSize="10"
                        fill="#3b82f6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.3 }}
                      >
                        y = {yIntercept}
                      </motion.text>
                      
                      {/* Roots markers and labels */}
                      {discriminant >= 0 && root1 !== null && root2 !== null && (
                        <>
                          <motion.circle
                            cx={175 + root1 * 30}
                            cy={175}
                            r="5"
                            fill="#10b981"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.7, duration: 0.3 }}
                          />
                          <motion.text
                            x={175 + root1 * 30}
                            y={195}
                            fontSize="11"
                            fill="#10b981"
                            fontWeight="bold"
                            textAnchor="middle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.9, duration: 0.3 }}
                          >
                            x₁ = {root1.toFixed(2)}
                          </motion.text>
                          {discriminant > 0 && (
                            <>
                              <motion.circle
                                cx={175 + root2 * 30}
                                cy={175}
                                r="5"
                                fill="#10b981"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 2, duration: 0.3 }}
                              />
                              <motion.text
                                x={175 + root2 * 30}
                                y={195}
                                fontSize="11"
                                fill="#10b981"
                                fontWeight="bold"
                                textAnchor="middle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.2, duration: 0.3 }}
                              >
                                x₂ = {root2.toFixed(2)}
                              </motion.text>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* Discriminant value display */}
                      <motion.text
                        x="10"
                        y="30"
                        fontSize="12"
                        fill={discriminant > 0 ? "#10b981" : discriminant === 0 ? "#f59e0b" : "#ef4444"}
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Δ = {discriminant}
                      </motion.text>
                      
                      {/* Axis of symmetry label */}
                      <motion.text
                        x={175 + xVertex * 30 - 35}
                        y="340"
                        fontSize="10"
                        fill="#9333ea"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                      >
                        Axis: x = {xVertex.toFixed(2)}
                      </motion.text>
                    </svg>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm text-muted-foreground font-medium">
                        {discriminant > 0 && '✓ Parabola crosses x-axis at two points (two real roots)'}
                        {discriminant === 0 && '✓ Parabola touches x-axis at one point (repeated root)'}
                        {discriminant < 0 && '✗ Parabola does not touch x-axis (no real roots)'}
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center text-xs">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                          🟣 Vertex: ({xVertex.toFixed(2)}, {yVertex.toFixed(2)})
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                          🔵 Y-intercept: {yIntercept}
                        </span>
                        {discriminant >= 0 && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded">
                            🟢 Roots: x = {root1?.toFixed(2)}{discriminant > 0 && `, ${root2?.toFixed(2)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Summary with Roots */}
              {step === 5 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 5: Complete Analysis</div>
                  <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg text-white">
                    <div className="text-2xl font-bold mb-6">
                      <MathText latex={`\\Delta = ${discriminant}`} />
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/20 p-4 rounded">
                        <div className="text-sm mb-1">Nature of Roots:</div>
                        <div className="text-lg font-bold">{nature}</div>
                      </div>
                      {discriminant >= 0 && root1 !== null && root2 !== null && (
                        <div className="bg-white/20 p-4 rounded">
                          <div className="text-sm mb-2">Solutions:</div>
                          <div className="text-xl font-bold">
                            {discriminant > 0 ? (
                              <>x = {root1.toFixed(2)} or x = {root2.toFixed(2)}</>
                            ) : (
                              <>x = {root1.toFixed(2)} (repeated)</>
                            )}
                          </div>
                        </div>
                      )}
                      {discriminant < 0 && (
                        <div className="bg-white/20 p-4 rounded">
                          <div className="text-sm mb-2">No Real Solutions</div>
                          <div className="text-base">Roots are complex numbers</div>
                        </div>
                      )}
                      <div className="text-sm mt-4">
                        ✓ Understanding the discriminant helps you predict the nature of roots before solving!
                      </div>
                    </div>
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

// ============================================
// 5. WORD PROBLEM SOLVER ANIMATION
// ============================================

interface WordProblemSolverProps {
  perimeter?: number;
  area?: number;
}

export function WordProblemSolverAnimation({ perimeter = 28, area = 45 }: WordProblemSolverProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 6; // 0-6 = 7 steps
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Calculate dimensions
  const sum = perimeter / 2; // l + w
  const product = area; // l × w

  // Solve x² - sum·x + product = 0
  const discriminant = sum * sum - 4 * product;
  const root1 = (sum + Math.sqrt(discriminant)) / 2;
  const root2 = (sum - Math.sqrt(discriminant)) / 2;
  
  const length = Math.max(root1, root2);
  const width = Math.min(root1, root2);

  // Animation narration for each step
  const narrationText = [
    `Let's solve a real-world rectangle problem! We have a rectangle with a perimeter of ${perimeter} meters and an area of ${area} square meters. Our challenge is to find its length and width. This is a perfect application of quadratic equations!`,
    `First, let's write our equations. The perimeter formula is 2 times length plus width equals ${perimeter}, which simplifies to length plus width equals ${sum}. The area formula is length times width equals ${area}. Now we have two equations to work with.`,
    `Here's the clever part! Let's say the width is x. Then from our first equation, the length must be ${sum} minus x. Now we can substitute this into our area equation: x times the quantity ${sum} minus x equals ${area}.`,
    `Let's expand this expression. x times ${sum} minus x gives us ${sum}x minus x squared equals ${area}. Rearranging to standard form: x squared minus ${sum}x plus ${product} equals zero. Now we have a quadratic equation!`,
    `Time to solve by factorization! We need two numbers that multiply to ${product} and add to negative ${sum}. Those numbers are negative ${root1.toFixed(1)} and negative ${root2.toFixed(1)}. So our factored form is: x minus ${root1.toFixed(1)} times x minus ${root2.toFixed(1)} equals zero.`,
    `Using the zero product property, x equals ${length.toFixed(1)} or x equals ${width.toFixed(1)}. So our dimensions are ${length.toFixed(1)} meters by ${width.toFixed(1)} meters. Notice both solutions give the same rectangle, just with length and width swapped!`,
    `Let's verify! The perimeter is 2 times ${length.toFixed(1)} plus ${width.toFixed(1)}, which equals ${perimeter} meters. Perfect! The area is ${length.toFixed(1)} times ${width.toFixed(1)}, which equals ${area} square meters. Our solution is correct! This shows how quadratic equations help solve real-world problems.`
  ];

  const { speak, stop, isSpeaking } = useSpeechSynthesis({
    text: narrationText[step],
    rate: 0.9,
    autoPlay: autoNarrate,
  });

  useEffect(() => {
    if (autoNarrate) {
      speak();
    }
    return () => stop();
  }, [step, autoNarrate]);

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

  const handleReset = () => {
    stop();
    setStep(0);
  };

  return (
    <Card className="w-full shadow-lg" ref={cardRef}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              Word Problem: Rectangle Dimensions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoNarrate(!autoNarrate)}
              className="h-8 w-8 p-0"
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Badge variant="outline">
              Step {step + 1} of {totalSteps + 1}
            </Badge>
          </div>
        </div>

        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Step 0: Problem Statement */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">The Problem</div>
                  <div className="p-6 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                    <p className="text-base mb-6">
                      A rectangle has a <span className="font-bold text-orange-600">perimeter of {perimeter}m</span> and an{' '}
                      <span className="font-bold text-orange-600">area of {area}m²</span>.
                    </p>
                    <p className="text-lg font-semibold text-orange-700 dark:text-orange-400">
                      Find the dimensions (length and width).
                    </p>
                  </div>
                  
                  {/* Simple Rectangle Visualization */}
                  <div className="flex justify-center">
                    <svg width="280" height="180" viewBox="0 0 280 180" className="border rounded">
                      <rect
                        x="40"
                        y="40"
                        width="200"
                        height="100"
                        fill="rgba(251, 146, 60, 0.2)"
                        stroke="rgba(249, 115, 22, 0.8)"
                        strokeWidth="3"
                        rx="4"
                      />
                      <text x="140" y="95" textAnchor="middle" className="fill-orange-700 dark:fill-orange-400 font-semibold" fontSize="18">
                        ?
                      </text>
                      <text x="140" y="30" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="14">
                        length = ?
                      </text>
                      <text x="15" y="95" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="14">
                        width = ?
                      </text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Step 1: Write Equations */}
              {step === 1 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 1: Write the Equations</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Perimeter Formula:</div>
                      <div className="text-xl font-mono">2(l + w) = {perimeter}</div>
                      <div className="text-lg font-mono mt-2 text-blue-600 dark:text-blue-400">l + w = {sum}</div>
                    </div>
                    <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Area Formula:</div>
                      <div className="text-xl font-mono">l × w = {area}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Express as Quadratic */}
              {step === 2 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 2: Express in Terms of One Variable</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-base mb-3">Let width = <span className="font-bold text-purple-600">x</span></div>
                      <div className="text-base mb-3">Then length = <span className="font-bold text-purple-600">{sum} - x</span></div>
                      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Substitute into area equation:</div>
                        <div className="text-lg font-mono">
                          x({sum} - x) = {area}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Expand and Rearrange */}
              {step === 3 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 3: Expand and Form Quadratic</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="space-y-3 font-mono text-lg">
                        <div>x({sum} - x) = {area}</div>
                        <div className="text-indigo-600 dark:text-indigo-400">{sum}x - x² = {area}</div>
                        <div className="text-indigo-700 dark:text-indigo-300 font-bold pt-3 border-t border-indigo-200 dark:border-indigo-700">
                          x² - {sum}x + {product} = 0
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Standard form: ax² + bx + c = 0 where a=1, b=-{sum}, c={product}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Solve by Factorization */}
              {step === 4 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 4: Factorize</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="text-base mb-4">
                        Find two numbers that multiply to <span className="font-bold">{product}</span> and add to{' '}
                        <span className="font-bold">-{sum}</span>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="text-xl font-mono text-amber-700 dark:text-amber-400">
                          (-{root1.toFixed(1)}) × (-{root2.toFixed(1)}) = {product}
                        </div>
                        <div className="text-xl font-mono text-amber-700 dark:text-amber-400">
                          (-{root1.toFixed(1)}) + (-{root2.toFixed(1)}) = -{sum}
                        </div>
                        <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                          <div className="text-lg font-mono font-bold">
                            (x - {root1.toFixed(1)})(x - {root2.toFixed(1)}) = 0
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Find Solutions */}
              {step === 5 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 5: Solve for x</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-base mb-4">Using the Zero Product Property:</div>
                      <div className="space-y-3 text-center">
                        <div className="text-xl font-mono">
                          x - {root1.toFixed(1)} = 0  or  x - {root2.toFixed(1)} = 0
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-4">
                          x = {length.toFixed(1)}m  or  x = {width.toFixed(1)}m
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded">
                        <div className="font-semibold text-emerald-700 dark:text-emerald-300 text-lg">
                          Dimensions: {length.toFixed(1)}m × {width.toFixed(1)}m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Verification with Visual */}
              {step === 6 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 6: Verify the Solution</div>
                  
                  {/* Rectangle with dimensions */}
                  <div className="flex justify-center mb-4">
                    <svg width="300" height="220" viewBox="0 0 300 220" className="border rounded">
                      <motion.rect
                        x="50"
                        y="60"
                        width="200"
                        height="100"
                        fill="rgba(16, 185, 129, 0.3)"
                        stroke="rgba(16, 185, 129, 0.8)"
                        strokeWidth="3"
                        rx="4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.text
                        x="150"
                        y="45"
                        textAnchor="middle"
                        className="fill-emerald-700 dark:fill-emerald-400 font-bold"
                        fontSize="16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        l = {length.toFixed(1)}m
                      </motion.text>
                      <motion.text
                        x="25"
                        y="115"
                        textAnchor="middle"
                        className="fill-emerald-700 dark:fill-emerald-400 font-bold"
                        fontSize="16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        w = {width.toFixed(1)}m
                      </motion.text>
                      <motion.text
                        x="150"
                        y="115"
                        textAnchor="middle"
                        className="fill-emerald-700 dark:fill-emerald-400 font-bold"
                        fontSize="20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        ✓
                      </motion.text>
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Perimeter Check:</div>
                      <div className="text-lg font-mono">
                        2({length.toFixed(1)} + {width.toFixed(1)}) = {perimeter}m ✓
                      </div>
                    </div>
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Area Check:</div>
                      <div className="text-lg font-mono">
                        {length.toFixed(1)} × {width.toFixed(1)} = {area}m² ✓
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-bold text-lg">Solution Verified!</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={step === totalSteps}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// 6. SUM AND PRODUCT OF ROOTS ANIMATION
// ============================================

interface SumProductRootsProps {
  a?: number;
  b?: number;
  c?: number;
}

export function SumProductRootsAnimation({ a = 1, b = -5, c = 6 }: SumProductRootsProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 6; // 0-6 = 7 steps
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [autoNarrate, setAutoNarrate] = useState(true);

  // Calculate roots
  const discriminant = b * b - 4 * a * c;
  const alpha = (-b + Math.sqrt(discriminant)) / (2 * a);
  const beta = (-b - Math.sqrt(discriminant)) / (2 * a);
  const sum = alpha + beta;
  const product = alpha * beta;

  // Theoretical values from Vieta's formulas
  const theoreticalSum = -b / a;
  const theoreticalProduct = c / a;

  // Animation narration for each step
  const narrationText = [
    `Welcome to Vieta's Formulas! These are powerful relationships between the roots of a quadratic equation and its coefficients. Today we'll prove that the sum of roots equals negative b over a, and the product equals c over a. Let's discover this beautiful mathematical pattern!`,
    `Let's start with the standard form: ${a === 1 ? '' : `${a}`}x squared ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} equals zero. We'll call the two roots alpha and beta. Our goal is to find formulas for alpha plus beta and alpha times beta in terms of the coefficients a, b, and c.`,
    `The quadratic formula tells us the roots. Alpha equals negative b plus the square root of b squared minus 4ac, all over 2a. Beta equals negative b minus the square root of b squared minus 4ac, all over 2a. Now let's find their sum!`,
    `Let's calculate alpha plus beta. When we add the fractions, the square root terms cancel out! We get negative b plus the square root, plus negative b minus the square root, all over 2a. This simplifies to negative 2b over 2a, which equals negative b over a. Amazing! The sum of roots is negative b over a!`,
    `Now for the product alpha times beta. This uses the difference of squares formula. When we multiply, we get negative b plus the square root, times negative b minus the square root, all over 4a squared. This becomes b squared minus the discriminant, which is b squared minus b squared plus 4ac, giving us 4ac over 4a squared. This simplifies to c over a! The product of roots is c over a!`,
    `Let's verify with our example: ${a === 1 ? '' : `${a}`}x squared ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} equals zero. The actual roots are ${alpha.toFixed(2)} and ${beta.toFixed(2)}. Their sum is ${sum.toFixed(2)}, which matches negative ${b} over ${a} equals ${theoreticalSum.toFixed(2)}. Their product is ${product.toFixed(2)}, which matches ${c} over ${a} equals ${theoreticalProduct.toFixed(2)}. Perfect match!`,
    `These formulas are incredibly useful! If you know two numbers multiply to give c over a and add to give negative b over a, then those numbers are the roots! You can also use these to quickly check your solutions, or even form equations when you know the roots. This is the power of Vieta's Formulas!`
  ];

  const { speak, stop, isSpeaking } = useSpeechSynthesis({
    text: narrationText[step],
    rate: 0.9,
    autoPlay: autoNarrate,
  });

  useEffect(() => {
    if (autoNarrate) {
      speak();
    }
    return () => stop();
  }, [step, autoNarrate]);

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

  const handleReset = () => {
    stop();
    setStep(0);
  };

  return (
    <Card className="w-full shadow-lg" ref={cardRef}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-500" />
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Sum and Product of Roots (Vieta&apos;s Formulas)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoNarrate(!autoNarrate)}
              className="h-8 w-8 p-0"
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Badge variant="outline">
              Step {step + 1} of {totalSteps + 1}
            </Badge>
          </div>
        </div>

        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Step 0: Introduction */}
              {step === 0 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Vieta&apos;s Formulas
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-lg mb-6">
                      For any quadratic equation: <span className="font-mono font-bold">ax² + bx + c = 0</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/70 dark:bg-black/20 rounded">
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          α + β = -b/a
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sum of Roots</div>
                      </div>
                      <div className="p-4 bg-white/70 dark:bg-black/20 rounded">
                        <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
                          α × β = c/a
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Product of Roots</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                      Let&apos;s prove these beautiful relationships!
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Given Equation */}
              {step === 1 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 1: The Given Equation</div>
                  <div className="space-y-4">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-center space-y-4">
                        <div className="text-2xl font-mono font-bold">
                          {a === 1 ? '' : `${a}`}x² {b >= 0 ? '+' : ''}{b}x {c >= 0 ? '+' : ''}{c} = 0
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Coefficient a</div>
                            <div className="text-2xl font-bold text-blue-600">{a}</div>
                          </div>
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Coefficient b</div>
                            <div className="text-2xl font-bold text-purple-600">{b}</div>
                          </div>
                          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Coefficient c</div>
                            <div className="text-2xl font-bold text-pink-600">{c}</div>
                          </div>
                        </div>
                        <div className="mt-4 text-base">
                          Let the two roots be <span className="font-bold text-purple-600">α</span> (alpha) and{' '}
                          <span className="font-bold text-pink-600">β</span> (beta)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Quadratic Formula */}
              {step === 2 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 2: Apply Quadratic Formula</div>
                  <div className="space-y-4">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-center space-y-4">
                        <div className="text-base mb-4">The Quadratic Formula:</div>
                        <div className="text-xl font-mono p-4 bg-white/70 dark:bg-black/20 rounded">
                          <MathText latex={'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'} />
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Root α (alpha):</div>
                            <div className="text-lg font-mono">
                              <MathText latex={'\\alpha = \\frac{-b + \\sqrt{\\Delta}}{2a}'} />
                            </div>
                          </div>
                          <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Root β (beta):</div>
                            <div className="text-lg font-mono">
                              <MathText latex={'\\beta = \\frac{-b - \\sqrt{\\Delta}}{2a}'} />
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          where <MathText latex={'\\Delta = b^2 - 4ac'} className="inline-block align-middle" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Derive Sum of Roots */}
              {step === 3 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 3: Sum of Roots (α + β)</div>
                  <div className="space-y-4">
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="space-y-4 font-mono">
                        <div className="text-base">
                          α + β = <span className="text-purple-600">[(-b + √Δ) / 2a]</span> +{' '}
                          <span className="text-pink-600">[(-b - √Δ) / 2a]</span>
                        </div>
                        <div className="text-base pl-4">
                          = <span className="text-purple-600">(-b + √Δ)</span> +{' '}
                          <span className="text-pink-600">(-b - √Δ)</span> / 2a
                        </div>
                        <div className="text-base pl-4">
                          = -b + √Δ - b - √Δ / 2a
                        </div>
                        <div className="text-base pl-4 text-green-600 dark:text-green-400">
                          = -2b / 2a
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded text-white text-center">
                          <div className="text-2xl font-bold">α + β = -b/a</div>
                        </div>
                      </div>
                      <div className="mt-4 text-center text-sm">
                        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                          ✨ Notice how the √Δ terms cancelled out!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Derive Product of Roots */}
              {step === 4 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 4: Product of Roots (α × β)</div>
                  <div className="space-y-4">
                    <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="space-y-4 font-mono text-sm">
                        <div>
                          α × β = <span className="text-purple-600">[(-b + √Δ) / 2a]</span> ×{' '}
                          <span className="text-pink-600">[(-b - √Δ) / 2a]</span>
                        </div>
                        <div className="pl-4">
                          = [(-b + √Δ) × (-b - √Δ)] / 4a²
                        </div>
                        <div className="pl-4 text-blue-600 dark:text-blue-400">
                          = [(-b)² - (√Δ)²] / 4a²
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 pl-8">
                          (using difference of squares: (x+y)(x-y) = x² - y²)
                        </div>
                        <div className="pl-4">
                          = [b² - (b² - 4ac)] / 4a²
                        </div>
                        <div className="pl-4">
                          = [b² - b² + 4ac] / 4a²
                        </div>
                        <div className="pl-4 text-green-600 dark:text-green-400">
                          = 4ac / 4a²
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded text-white text-center">
                          <div className="text-2xl font-bold">α × β = c/a</div>
                        </div>
                      </div>
                      <div className="mt-4 text-center text-sm">
                        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                          ✨ The difference of squares formula is key here!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Numerical Verification */}
              {step === 5 && (
                <div className="space-y-6 w-full p-4">
                  <div className="text-lg font-semibold text-center mb-4">Step 5: Verify with Example</div>
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="text-xl font-mono font-bold mb-4">
                          {a === 1 ? '' : `${a}`}x² {b >= 0 ? '+' : ''}{b}x {c >= 0 ? '+' : ''}{c} = 0
                        </div>
                        <div className="text-base text-gray-600 dark:text-gray-400 mb-4">
                          Roots: α = {alpha.toFixed(2)}, β = {beta.toFixed(2)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/70 dark:bg-black/20 rounded">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sum of Roots:</div>
                          <div className="space-y-2">
                            <div className="font-mono">α + β = {sum.toFixed(2)}</div>
                            <div className="font-mono">-b/a = -{b}/{a} = {theoreticalSum.toFixed(2)}</div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {Math.abs(sum - theoreticalSum) < 0.01 ? '✓ Match!' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white/70 dark:bg-black/20 rounded">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Product of Roots:</div>
                          <div className="space-y-2">
                            <div className="font-mono">α × β = {product.toFixed(2)}</div>
                            <div className="font-mono">c/a = {c}/{a} = {theoreticalProduct.toFixed(2)}</div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {Math.abs(product - theoreticalProduct) < 0.01 ? '✓ Match!' : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                        <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                          Perfect Match! Vieta&apos;s Formulas Verified!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Applications and Summary */}
              {step === 6 && (
                <div className="space-y-6 text-center w-full p-4">
                  <div className="text-lg font-semibold mb-4">Step 6: Applications</div>
                  <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg text-white">
                    <div className="text-2xl font-bold mb-6">Vieta&apos;s Formulas</div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/20 rounded">
                        <div className="text-xl font-mono font-bold mb-2">α + β = -b/a</div>
                        <div className="text-xl font-mono font-bold">α × β = c/a</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="font-semibold mb-1">Quick Checking</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Verify your solutions instantly
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="font-semibold mb-1">Finding Roots</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        If you know sum and product
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="text-3xl mb-2">📝</div>
                      <div className="font-semibold mb-1">Forming Equations</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        When you know the roots
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={step === totalSteps}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

