'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Shapes, Target, Lightbulb, Trophy } from 'lucide-react';

const CircleTheorems2Intro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Shapes,
      narration: "Welcome to Circle Theorems Two - Advanced Properties! Now that you've mastered the basics, we're diving into the truly elegant theorems. Cyclic quadrilaterals, alternate segments, and intersecting chords reveal the deeper beauty of circle geometry!",
      visualContent: "Advanced Circle Theorems",
      highlightWords: ['Circle Theorems Two', 'Cyclic quadrilaterals', 'alternate segments', 'intersecting chords', 'deeper beauty'],
      teacherTip: "These advanced theorems are where circle geometry becomes really powerful and elegant!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Imagine Gothic cathedral windows with their beautiful circular patterns, or gear systems in complex machines. Engineers use cyclic quadrilaterals and alternate segment theorems to design precision instruments. Architects create stunning circular rose windows using these exact mathematical principles!",
      visualContent: "Advanced Applications",
      highlightWords: ['Gothic cathedral', 'gear systems', 'cyclic quadrilaterals', 'precision instruments', 'rose windows'],
      teacherTip: "Connect to architecture and engineering - these aren't just abstract theorems!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "You'll master four advanced theorems. First, opposite angles in cyclic quadrilaterals sum to one hundred eighty degrees. Second, the exterior angle equals the opposite interior angle. Third, the alternate segment theorem connects tangents and chords beautifully. And fourth, intersecting chords have equal products. These theorems combine to solve complex problems!",
      visualContent: "The Advanced Toolkit",
      highlightWords: ['opposite angles', 'exterior angle', 'alternate segment', 'intersecting chords', 'equal products'],
      teacherTip: "These theorems work together - students need to learn when to apply each one!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "WASSCE loves these advanced theorems! You'll practice recognizing cyclic quadrilaterals, applying the alternate segment theorem confidently, using the intersecting chord formula, and combining multiple theorems in challenging problems. Master these, and you'll handle the toughest circle questions with ease!",
      visualContent: "Your Advanced Geometry Goal",
      highlightWords: ['WASSCE', 'cyclic quadrilaterals', 'alternate segment', 'intersecting chord', 'combining theorems'],
      teacherTip: "These advanced theorems separate top performers from average students in WASSCE!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Circle Theorems II"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CircleTheorems2Intro;
