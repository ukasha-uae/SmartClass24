'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Circle, Target, Lightbulb, Trophy } from 'lucide-react';

const CircleTheorems1Intro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Circle,
      narration: "Welcome to Circle Theorems! Circles are everywhere - from the wheels on your bicycle to the orbits of planets around the sun. Today, you'll discover the beautiful mathematical relationships hidden within circles that have been known for over two thousand years!",
      visualContent: "Welcome to Circle Theorems",
      highlightWords: ['Circle Theorems', 'wheels', 'orbits', 'mathematical relationships', 'two thousand years'],
      teacherTip: "Circles are one of the most perfect shapes in mathematics - every point equally distant from the center!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Think about a pizza slice, a clock face, or a Ferris wheel. Engineers use circle theorems to design gears and wheels. Architects use them to create beautiful domes and arches. Even GPS navigation relies on circular geometry to pinpoint your exact location!",
      visualContent: "Real-World Applications",
      highlightWords: ['pizza slice', 'clock face', 'Ferris wheel', 'gears', 'GPS navigation'],
      teacherTip: "Show students that circle theorems solve real engineering and design problems!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "We'll master five fundamental theorems. First, the angle at the center is twice the angle at the circumference. Second, angles in the same segment are equal. Third, the angle in a semicircle is always ninety degrees. Fourth, tangents are perpendicular to the radius. And fifth, tangents from an external point are equal in length. These elegant rules unlock all circle problems!",
      visualContent: "The Five Key Theorems",
      highlightWords: ['twice', 'equal', 'ninety degrees', 'perpendicular', 'equal in length'],
      teacherTip: "Help students memorize these five theorems - they're the foundation of all circle geometry!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently identify which theorem to use, calculate unknown angles quickly, apply tangent properties to find lengths, and solve complex WASSCE circle problems. These theorems appear in every WASSCE exam - master them and score high marks!",
      visualContent: "Your Circle Mastery Goal",
      highlightWords: ['identify', 'calculate angles', 'tangent properties', 'WASSCE', 'master them'],
      teacherTip: "Circle theorem questions are high-value in WASSCE - worth investing time to master!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Circle Theorems I"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CircleTheorems1Intro;
