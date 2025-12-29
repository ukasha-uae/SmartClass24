'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Variable, Plus, Brackets, Calculator, Trophy } from 'lucide-react';

const AlgebraicExpressionsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Variable,
      narration: "Welcome to the world of algebra! Algebra uses letters like x and y to represent unknown numbers - it's like a secret code for mathematics! In Ghana, algebra helps us solve real problems: if one orange costs x cedis, then three oranges cost 3x cedis. Understanding algebraic expressions is the key to unlocking advanced mathematics and solving complex problems!",
      visualContent: "Welcome to Algebraic Expressions",
      highlightWords: ['algebra', 'letters', 'unknown numbers', 'Ghana', 'solve problems'],
      teacherTip: "Start with a real example: If one phone card costs x cedis, how much do 5 cards cost? Answer: 5x cedis."
    },
    {
      id: 1,
      icon: Plus,
      narration: "An algebraic expression has parts: variables (letters like x), coefficients (numbers multiplying variables), constants (numbers alone), and terms (parts separated by plus or minus). Like terms have the same variable and power - you can combine them! 3x plus 5x equals 8x, just like 3 oranges plus 5 oranges equals 8 oranges!",
      visualContent: "Understanding Expressions",
      highlightWords: ['variables', 'coefficients', 'constants', 'like terms', 'combine'],
      teacherTip: "Use Ghanaian examples: 3x could be 3 loaves of bread, 5x could be 5 loaves - together they're 8x loaves."
    },
    {
      id: 2,
      icon: Brackets,
      narration: "Expanding means removing brackets by multiplying! When you see 2 times the quantity x plus 3, you multiply 2 by both x and 3 to get 2x plus 6. For two brackets, use FOIL method: First, Outer, Inner, Last. This skill is essential for solving equations and simplifying complex expressions!",
      visualContent: "Expanding Brackets",
      highlightWords: ['expanding', 'brackets', 'multiplying', 'FOIL', 'essential'],
      teacherTip: "Draw visual diagrams showing how each term multiplies when expanding brackets."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Factorizing is the reverse process - putting brackets back! Find the highest common factor of all terms, then factor it out. For 6x plus 9, the HCF is 3, so we write 3 times the quantity 2x plus 3. Always check your answer by expanding - you should get back the original expression!",
      visualContent: "Factorizing Expressions",
      highlightWords: ['factorizing', 'reverse', 'highest common factor', 'check', 'expanding'],
      teacherTip: "Factorizing is like reverse engineering - practice makes it intuitive!"
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently identify parts of algebraic expressions, combine like terms, expand brackets using distributive law and FOIL, factorize expressions by finding HCF, and apply these skills to solve real-world problems in Ghana. Master this and you're ready for equations, quadratic expressions, and advanced algebra!",
      visualContent: "Your Goal Today",
      highlightWords: ['identify', 'combine', 'expand', 'factorize', 'real-world', 'Ghana'],
      teacherTip: "This is foundational for all algebra - mastery here makes everything else easier!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Algebraic Expressions"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default AlgebraicExpressionsIntro;
