'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Square, Target, Lightbulb, Trophy } from 'lucide-react';

const CompletingSquareIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Square,
      narration: "Welcome to our lesson on completing the square. This elegant method transforms quadratic expressions into perfect square form, revealing important properties about equations and graphs.",
      visualContent: "Welcome to Completing the Square",
      highlightWords: ['completing the square', 'elegant', 'perfect square'],
      teacherTip: "Completing the square is essential for understanding parabolas and their turning points."
    },
    {
      id: 1,
      icon: Target,
      narration: "This method is used in engineering to find maximum and minimum values, in physics to analyze projectile motion, and in economics to optimize profit and cost functions.",
      visualContent: "Real-World Applications",
      highlightWords: ['engineering', 'physics', 'economics', 'optimize'],
      teacherTip: "Connect to real scenarios like finding the highest point of a ball's trajectory."
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "We'll learn how to transform expressions like x squared plus six x plus five into the form, x plus three, all squared, minus four. This reveals the vertex of a parabola and makes solving equations easier.",
      visualContent: "The Process",
      highlightWords: ['transform', 'vertex', 'parabola', 'easier'],
      teacherTip: "Emphasize the pattern: half the coefficient of x, then square it."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end, you'll be able to complete the square for any quadratic expression, use it to solve quadratic equations, and find the turning point of parabolas with confidence.",
      visualContent: "Your Goal Today",
      highlightWords: ['complete the square', 'solve', 'turning point', 'confidence'],
      teacherTip: "This method appears frequently in WASSCE Section B questions."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Completing the Square"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CompletingSquareIntro;
