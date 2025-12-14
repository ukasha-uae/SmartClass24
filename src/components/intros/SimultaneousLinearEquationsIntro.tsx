'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { GitBranch, Replace, Calculator, CheckSquare, Trophy } from 'lucide-react';

const SimultaneousLinearEquationsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: GitBranch,
      narration: "What if you have two unknowns? You need two equations! Simultaneous equations are like a puzzle - find values of x and y that make BOTH equations true at the same time. Where two lines cross on a graph, that's your solution!",
      visualContent: "2 unknowns need 2 equations → Find x and y for BOTH",
      highlightWords: ['two unknowns', 'two equations', 'BOTH equations', 'lines cross'],
      teacherTip: "Show graphically that the solution is where two lines intersect."
    },
    {
      id: 1,
      icon: Replace,
      narration: "The substitution method: solve one equation for x or y, then substitute into the other. From x plus y equals 10, we get x equals 10 minus y. Plug this into the second equation - now you have just one variable to solve!",
      visualContent: "Substitution: Solve for x → Substitute → Solve for y → Back-substitute",
      highlightWords: ['substitution method', 'solve one equation', 'substitute', 'one variable'],
      teacherTip: "Choose the equation that's easiest to rearrange - usually where a variable has coefficient 1."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "The elimination method: make coefficients match, then add or subtract equations to eliminate a variable. If you have 2x plus 3y and 2x minus y, subtracting eliminates x! Multiply equations first if coefficients don't match.",
      visualContent: "Elimination: Match coefficients → Add/Subtract → One variable gone!",
      highlightWords: ['elimination method', 'coefficients match', 'add or subtract', 'eliminate'],
      teacherTip: "Students often forget to multiply ALL terms - emphasize this common error."
    },
    {
      id: 3,
      icon: CheckSquare,
      narration: "Always verify your answer! Substitute both x and y back into BOTH original equations. If both equations are satisfied, you've got the right answer. This check takes 30 seconds but catches mistakes that cost marks!",
      visualContent: "Verify: Substitute into BOTH equations → Both satisfied? ✓",
      highlightWords: ['verify', 'Substitute', 'BOTH original equations', 'catches mistakes'],
      teacherTip: "Make verification a habit - it's worth the time investment in exams."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves simultaneous equations! Word problems give you two conditions that become two equations. Cost problems, age problems, mixture problems - set up your equations carefully, solve systematically, and verify. Easy marks!",
      visualContent: "WASSCE: Word problem → Two equations → Solve → Verify",
      highlightWords: ['WASSCE', 'Word problems', 'two conditions', 'two equations', 'verify'],
      teacherTip: "Practice translating word problems into equations - this is where most errors occur."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Simultaneous Linear Equations"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SimultaneousLinearEquationsIntro;
