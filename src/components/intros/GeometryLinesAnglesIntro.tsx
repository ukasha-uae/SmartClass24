'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Minus, RotateCw, Scissors, Calculator, Trophy } from 'lucide-react';

const GeometryLinesAnglesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Minus,
      narration: "Lines go on forever in both directions! A ray has one endpoint and goes on forever one way. A line segment has two endpoints. Parallel lines never meet - like railway tracks. Perpendicular lines meet at 90 degrees!",
      visualContent: "Line ↔ | Ray → | Segment — | Parallel ∥ | Perpendicular ⊥",
      highlightWords: ['Lines', 'ray', 'line segment', 'Parallel', 'Perpendicular', '90 degrees'],
      teacherTip: "Find examples in the classroom: edges of board (parallel), corner of room (perpendicular)."
    },
    {
      id: 1,
      icon: RotateCw,
      narration: "Angles measure rotation between two rays! Acute angles are less than 90 degrees. Right angles are exactly 90 degrees. Obtuse angles are between 90 and 180 degrees. Straight angles are 180 degrees. Reflex angles are more than 180!",
      visualContent: "Acute < 90° | Right = 90° | Obtuse 90°-180° | Reflex > 180°",
      highlightWords: ['Angles', 'Acute', 'Right', 'Obtuse', 'Straight', 'Reflex'],
      teacherTip: "Have students identify different angle types around the classroom."
    },
    {
      id: 2,
      icon: Scissors,
      narration: "Special angle pairs! Complementary angles add to 90 degrees. Supplementary angles add to 180 degrees. Vertically opposite angles are equal. Angles on a straight line sum to 180 degrees!",
      visualContent: "Complementary: a + b = 90° | Supplementary: a + b = 180° | Vertically opposite: equal",
      highlightWords: ['Complementary', 'Supplementary', 'Vertically opposite', 'straight line', 'sum'],
      teacherTip: "Remember: C comes before S, and 90 comes before 180!"
    },
    {
      id: 3,
      icon: Calculator,
      narration: "When a transversal crosses parallel lines, special angles form! Corresponding angles are equal - same position. Alternate angles are equal - opposite sides, like a Z. Co-interior angles sum to 180 - same side!",
      visualContent: "Corresponding F = equal | Alternate Z = equal | Co-interior C = 180°",
      highlightWords: ['transversal', 'Corresponding', 'Alternate', 'Co-interior', 'parallel'],
      teacherTip: "Use F, Z, and C shapes to identify angle types on parallel lines."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE always has angle problems! State which angle property you're using: vertically opposite, angles on straight line, corresponding angles. Show your reasoning clearly for each step. Practice with diagrams!",
      visualContent: "WASSCE: State reason for each step | Use correct angle names",
      highlightWords: ['WASSCE', 'property', 'reasoning', 'diagrams', 'angle names'],
      teacherTip: "Practice writing angle solutions with reasons in a clear format."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Geometry: Lines & Angles"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default GeometryLinesAnglesIntro;
