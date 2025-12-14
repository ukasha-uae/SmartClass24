'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Equal, Target, Lightbulb, Trophy } from 'lucide-react';

const TrigonometricIdentitiesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Equal,
      narration: "Welcome to Trigonometric Identities! These are powerful equations that are ALWAYS true. They're your secret weapons for simplifying and solving trig problems in WASSCE!",
      visualContent: "Welcome to Trigonometric Identities",
      highlightWords: ['Trigonometric Identities', 'ALWAYS true', 'secret weapons'],
      teacherTip: "Identities are equations that work for ALL values, unlike equations that have specific solutions."
    },
    {
      id: 1,
      icon: Target,
      narration: "The Pythagorean identities are the foundation. Sin squared theta plus cos squared theta equals one. From this single identity, we derive all the others. Memorize this one, and you unlock dozens of problems!",
      visualContent: "Pythagorean Identities",
      highlightWords: ['Pythagorean', 'sin squared', 'cos squared', 'equals one'],
      teacherTip: "sin²θ + cos²θ = 1 comes from the Pythagorean theorem on the unit circle."
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "Compound angle formulas let you find exact values. Sine of A plus B equals sine A cos B plus cos A sine B. Double angle formulas are shortcuts: sine two theta equals two sine theta cos theta!",
      visualContent: "Compound & Double Angles",
      highlightWords: ['Compound angle', 'Double angle', 'exact values'],
      teacherTip: "These formulas are essential for finding values like sin 75° or cos 15° exactly."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "In WASSCE, identity proofs are high-scoring questions. Remember: work on ONE side only, convert everything to sine and cosine, and never cross the equals sign! Let's master these identities together!",
      visualContent: "WASSCE Success Strategy",
      highlightWords: ['WASSCE', 'ONE side', 'sine and cosine', 'never cross'],
      teacherTip: "Show all steps clearly for full marks on identity proofs!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Trigonometric Identities"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TrigonometricIdentitiesIntro;
