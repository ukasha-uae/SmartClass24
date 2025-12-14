'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { ArrowUpRight, ArrowDownRight, Combine, Scale, Trophy } from 'lucide-react';

const VariationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: ArrowUpRight,
      narration: "In direct variation, when one quantity increases, the other increases too! If y varies directly as x, then y equals k times x, where k is the constant of variation. Double x, and y doubles too. Speed and distance traveled in fixed time - that's direct variation!",
      visualContent: "Direct: y = kx | Double x → Double y | y ∝ x",
      highlightWords: ['direct variation', 'increases', 'constant of variation', 'Double'],
      teacherTip: "Use real examples: more workers, more work done; more hours, more wages."
    },
    {
      id: 1,
      icon: ArrowDownRight,
      narration: "Inverse variation is the opposite - when one goes up, the other goes down! If y varies inversely as x, then y equals k divided by x. Double x, and y becomes half. Speed and time for a fixed distance - faster speed means less time!",
      visualContent: "Inverse: y = k/x | Double x → Halve y | y ∝ 1/x",
      highlightWords: ['Inverse variation', 'goes up', 'goes down', 'k divided by x', 'half'],
      teacherTip: "The classic example: more workers on a job means less time to complete it."
    },
    {
      id: 2,
      icon: Combine,
      narration: "Joint variation combines multiple variables. If z varies jointly as x and y, then z equals k times x times y. Area of a rectangle varies jointly as length and width! Partial variation adds a constant: y equals kx plus c.",
      visualContent: "Joint: z = kxy | Partial: y = kx + c",
      highlightWords: ['Joint variation', 'multiple variables', 'x times y', 'Partial variation', 'adds a constant'],
      teacherTip: "Joint variation is like combining direct variations multiplicatively."
    },
    {
      id: 3,
      icon: Scale,
      narration: "To solve variation problems: First, write the equation with k. Second, use given values to find k. Third, use k to find the unknown. Always find k first! It's the key that unlocks everything else.",
      visualContent: "Steps: 1. Write equation with k → 2. Find k → 3. Find unknown",
      highlightWords: ['find k', 'given values', 'find the unknown', 'key'],
      teacherTip: "Emphasize the systematic approach: equation → find k → solve."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests all types of variation! You'll see direct, inverse, joint, and partial. Sometimes variation involves squares or square roots - y varies as x squared, or y varies as the square root of x. Read carefully and set up your equation correctly!",
      visualContent: "WASSCE: Direct | Inverse | Joint | Partial | With powers/roots",
      highlightWords: ['WASSCE', 'direct', 'inverse', 'joint', 'squares', 'square roots'],
      teacherTip: "Practice identifying variation type from word problems before solving."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Variation"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default VariationIntro;
