'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Variable, Plus, Brackets, Calculator, Trophy } from 'lucide-react';

const AlgebraicExpressionsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Variable,
      narration: "Algebra uses letters to represent unknown numbers! In 3x plus 5, x is the variable, 3 is the coefficient (the number multiplying x), and 5 is the constant. Terms are separated by plus or minus signs. This expression has two terms!",
      visualContent: "3x + 5 | Variable: x | Coefficient: 3 | Constant: 5",
      highlightWords: ['variable', 'coefficient', 'constant', 'terms', 'expression'],
      teacherTip: "Use real scenarios: if x is price of one item, 3x is price of three items."
    },
    {
      id: 1,
      icon: Plus,
      narration: "Like terms have the same variable raised to the same power! 3x and 5x are like terms - both have x to power 1. But 3x and 3x-squared are unlike terms. Only combine like terms: 3x plus 5x equals 8x!",
      visualContent: "Like: 3x + 5x = 8x | Unlike: 3x and 3x² (different powers)",
      highlightWords: ['like terms', 'unlike terms', 'same variable', 'same power', 'combine'],
      teacherTip: "Think of like terms as same 'type' - apples with apples, not apples with oranges."
    },
    {
      id: 2,
      icon: Brackets,
      narration: "Expanding means removing brackets using the distributive law! 2 times the quantity x plus 3 equals 2x plus 6. Multiply everything inside by what's outside. For two brackets, use FOIL: First, Outer, Inner, Last!",
      visualContent: "2(x + 3) = 2x + 6 | FOIL: (a+b)(c+d) = ac + ad + bc + bd",
      highlightWords: ['Expanding', 'distributive law', 'brackets', 'FOIL', 'multiply'],
      teacherTip: "Draw arrows showing what multiplies with what when expanding."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Factorizing is the reverse - putting brackets back! Find the highest common factor. For 6x plus 9, HCF is 3, so we get 3 times the quantity 2x plus 3. Check by expanding - you should get back the original!",
      visualContent: "6x + 9 = 3(2x + 3) | Find HCF, put outside bracket",
      highlightWords: ['Factorizing', 'reverse', 'highest common factor', 'HCF', 'check'],
      teacherTip: "Always check by expanding your factorized answer."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests simplifying, expanding, and factorizing! Show every step clearly. Combine like terms carefully. Watch your signs - negative times negative is positive! Practice makes perfect with algebra!",
      visualContent: "WASSCE: Simplify, Expand, Factorize | Show all working",
      highlightWords: ['WASSCE', 'simplifying', 'expanding', 'factorizing', 'signs'],
      teacherTip: "Practice with increasingly complex expressions from past papers."
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
