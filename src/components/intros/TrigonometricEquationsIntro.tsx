'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Calculator, Target, Lightbulb, Trophy } from 'lucide-react';

const TrigonometricEquationsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Calculator,
      narration: "Welcome to Trigonometric Equations! Unlike identities which are always true, these equations have specific solutions. Today you'll learn to find ALL the angles that make an equation true.",
      visualContent: "Welcome to Trigonometric Equations",
      highlightWords: ['Trigonometric Equations', 'specific solutions', 'all the angles'],
      teacherTip: "Remember: An equation is true for specific values, an identity is true for ALL values."
    },
    {
      id: 1,
      icon: Target,
      narration: "The ASTC rule is your compass. All trig functions positive in quadrant one, Sine in quadrant two, Tangent in quadrant three, Cosine in quadrant four. This tells you which quadrants to look for solutions!",
      visualContent: "The ASTC Rule",
      highlightWords: ['ASTC', 'All', 'Sine', 'Tangent', 'Cosine', 'quadrants'],
      teacherTip: "ASTC = All Students Take Calculus - a popular memory aid!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "For general solutions, we use the periodicity of trig functions. Sine and cosine repeat every three sixty degrees, but tangent repeats every one eighty degrees. Add n times the period to capture ALL solutions!",
      visualContent: "General Solutions",
      highlightWords: ['general solutions', 'periodicity', 'repeat', 'ALL solutions'],
      teacherTip: "Always include 'where n is an integer' when writing general solutions."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "In WASSCE, you'll solve equations in specific domains and find general solutions. Remember to check your answers by substituting back. Let's master these equation-solving techniques together!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'domains', 'general solutions', 'check your answers'],
      teacherTip: "Show all working and verify each solution for full marks!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Trigonometric Equations"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TrigonometricEquationsIntro;
