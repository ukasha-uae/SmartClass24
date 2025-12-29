'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Equal, Scale, TrendingUp, Calculator, Trophy } from 'lucide-react';

const LinearEquationsInequalitiesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Equal,
      narration: "Welcome to equations and inequalities - the tools that help us solve real problems! In Ghana, equations are everywhere: if 5 oranges cost GH₵20, what's the price per orange? If a taxi charges GH₵5 base plus GH₵2 per kilometer, how far can you go with GH₵25? Equations help us find unknown values, and inequalities help us set limits and boundaries!",
      visualContent: "Welcome to Equations & Inequalities",
      highlightWords: ['equations', 'inequalities', 'Ghana', 'solve problems', 'unknown values'],
      teacherTip: "Start with a real Ghanaian example: If 3 phone cards cost GH₵15, find the cost of one card."
    },
    {
      id: 1,
      icon: Scale,
      narration: "An equation says two expressions are equal! To solve, think of a balance scale - whatever you do to one side, you must do to the other to keep it balanced. If 2x plus 3 equals 11, subtract 3 from both sides to get 2x equals 8, then divide both sides by 2 to find x equals 4. Always check your answer by substituting back into the original equation!",
      visualContent: "Solving Equations",
      highlightWords: ['equation', 'balance', 'both sides', 'subtract', 'divide', 'check'],
      teacherTip: "The balance scale analogy is powerful - use it to explain why we do the same to both sides."
    },
    {
      id: 2,
      icon: TrendingUp,
      narration: "Inequalities show relationships where one side is greater or less than the other! They use symbols: less than, greater than, less than or equal, greater than or equal. Solve them like equations, BUT remember: when you multiply or divide by a negative number, you must flip the inequality sign! This is crucial for correct solutions.",
      visualContent: "Understanding Inequalities",
      highlightWords: ['inequalities', 'greater', 'less than', 'flip sign', 'negative', 'crucial'],
      teacherTip: "The sign flip rule is the most common mistake - emphasize it with multiple examples!"
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Inequalities can be represented on a number line! Use an open circle for strict inequalities (less than or greater than) and a closed circle for inclusive inequalities (less than or equal, greater than or equal). Then shade the solution region. This visual representation helps you understand the range of possible values!",
      visualContent: "Graphing Inequalities",
      highlightWords: ['number line', 'open circle', 'closed circle', 'shade', 'solution region'],
      teacherTip: "Drawing number lines for every inequality helps students visualize and understand solutions."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently solve linear equations using inverse operations, solve linear inequalities and represent solutions on number lines, translate word problems into equations and inequalities, and apply these skills to real-world situations in Ghana - from shopping to budgeting to planning. These skills are essential for WASSCE and everyday problem-solving!",
      visualContent: "Your Goal Today",
      highlightWords: ['solve equations', 'solve inequalities', 'word problems', 'WASSCE', 'Ghana'],
      teacherTip: "This topic appears frequently in WASSCE - mastery here guarantees marks!"
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
