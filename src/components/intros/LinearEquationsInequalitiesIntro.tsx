'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Equal, Scale, TrendingUp, Calculator, Trophy } from 'lucide-react';

const LinearEquationsInequalitiesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Equal,
      narration: "An equation says two things are equal! In 2x plus 3 equals 11, we need to find what x makes this true. The goal: get x alone on one side. Do the same operation to both sides to keep the balance!",
      visualContent: "2x + 3 = 11 | Goal: isolate x | Same operation both sides",
      highlightWords: ['equation', 'equal', 'isolate x', 'balance', 'both sides'],
      teacherTip: "Use a balance scale analogy - whatever you do to one side, do to the other."
    },
    {
      id: 1,
      icon: Scale,
      narration: "Solve step by step! First, remove the constant: subtract 3 from both sides gives 2x equals 8. Then divide both sides by 2 to get x equals 4. Always check: 2 times 4 plus 3 equals 11. Correct!",
      visualContent: "2x + 3 = 11 → 2x = 8 → x = 4 | Check: 2(4) + 3 = 11 ✓",
      highlightWords: ['subtract', 'divide', 'both sides', 'check', 'correct'],
      teacherTip: "Always verify your answer by substituting back into the original equation."
    },
    {
      id: 2,
      icon: TrendingUp,
      narration: "Inequalities use less than, greater than, less than or equal, greater than or equal. Solve like equations BUT - when you multiply or divide by a negative, flip the sign! Negative 2x less than 6 becomes x greater than negative 3!",
      visualContent: "< > ≤ ≥ | Flip sign when ÷ or × by negative!",
      highlightWords: ['Inequalities', 'less than', 'greater than', 'flip', 'negative'],
      teacherTip: "Emphasize the sign flip rule - it's the most common mistake!"
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Graph inequalities on a number line! Open circle for strict inequality (less than, greater than). Closed circle for or-equal (less than or equal, greater than or equal). Shade the solution region!",
      visualContent: "○ = strict (< >) | ● = inclusive (≤ ≥) | Shade solution",
      highlightWords: ['number line', 'Open circle', 'Closed circle', 'Shade', 'solution'],
      teacherTip: "Draw number lines for every inequality to visualize the solution set."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves word problems that become equations! 'Three times a number plus 5 equals 20' becomes 3x plus 5 equals 20. Translate words to algebra, solve, and state your answer clearly. Show all steps!",
      visualContent: "WASSCE: Word problems → Equations | Solve | State answer",
      highlightWords: ['WASSCE', 'word problems', 'translate', 'solve', 'state answer'],
      teacherTip: "Practice translating common phrases: 'sum of', 'product of', 'less than'."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Linear Equations & Inequalities"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LinearEquationsInequalitiesIntro;
