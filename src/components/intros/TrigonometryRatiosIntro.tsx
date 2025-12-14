'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Triangle, Divide, Mountain, Calculator, Trophy } from 'lucide-react';

const TrigonometryRatiosIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Triangle,
      narration: "Trigonometry connects angles and sides in right triangles! SOH-CAH-TOA is your best friend. Sine equals Opposite over Hypotenuse. Cosine equals Adjacent over Hypotenuse. Tangent equals Opposite over Adjacent. Memorize this, and you're halfway there!",
      visualContent: "SOH: sin = O/H | CAH: cos = A/H | TOA: tan = O/A",
      highlightWords: ['SOH-CAH-TOA', 'Sine', 'Cosine', 'Tangent', 'Opposite', 'Adjacent', 'Hypotenuse'],
      teacherTip: "Create memorable mnemonics: 'Some Old Horses Can Always Hear Their Owner Approaching.'"
    },
    {
      id: 1,
      icon: Divide,
      narration: "First, identify your angle. The hypotenuse is always opposite the right angle - it's the longest side. The opposite side faces your angle. The adjacent side is next to your angle (but not the hypotenuse). Label carefully before choosing your ratio!",
      visualContent: "Hypotenuse: Longest, opposite 90° | Opposite: Faces θ | Adjacent: Next to θ",
      highlightWords: ['hypotenuse', 'longest side', 'opposite side', 'adjacent side', 'Label'],
      teacherTip: "Have students physically point to sides as they identify them."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "To find a side: choose the ratio that uses your known side and unknown side. Set up the equation and solve. To find an angle: calculate the ratio, then use inverse functions - sin inverse, cos inverse, or tan inverse on your calculator!",
      visualContent: "Find side: Set up ratio → Solve | Find angle: Calculate ratio → Use sin⁻¹/cos⁻¹/tan⁻¹",
      highlightWords: ['find a side', 'find an angle', 'inverse functions', 'calculator'],
      teacherTip: "Ensure calculators are in DEGREE mode, not radians!"
    },
    {
      id: 3,
      icon: Mountain,
      narration: "Angles of elevation look UP from horizontal. Angles of depression look DOWN from horizontal. A key insight: the angle of depression from A to B equals the angle of elevation from B to A! Draw diagrams and mark these angles carefully.",
      visualContent: "Elevation: Looking UP ↗ | Depression: Looking DOWN ↘ | They're equal (alternate angles)",
      highlightWords: ['elevation', 'UP', 'depression', 'DOWN', 'equal'],
      teacherTip: "Use real scenarios: looking up at a building, looking down from a cliff."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE trigonometry questions appear every year! Calculate heights of buildings, distances across rivers, angles of elevation and depression. Special angles like 30, 45, and 60 degrees have exact values you should memorize. Practice drawing clear diagrams!",
      visualContent: "WASSCE: Heights | Distances | Elevation/Depression | Special angles",
      highlightWords: ['WASSCE', 'heights', 'distances', 'Special angles', '30, 45, 60'],
      teacherTip: "Create a reference card with special angle values for quick revision."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Trigonometry: Ratios and Applications"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TrigonometryRatiosIntro;
