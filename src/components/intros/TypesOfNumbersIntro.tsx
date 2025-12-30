'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Hash, Infinity, Divide, Calculator, Trophy } from 'lucide-react';

const TypesOfNumbersIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Hash,
      narration: "Numbers are everywhere! Natural numbers are for counting - 1, 2, 3, 4, 5. Whole numbers add zero to the mix. Integers include negatives too - like negative 5, negative 2, 0, 3, 7. Each type has its purpose in mathematics and real life!",
      visualContent: "Natural: 1, 2, 3... | Whole: 0, 1, 2... | Integers: ...-2, -1, 0, 1, 2...",
      highlightWords: ['Natural numbers', 'Whole numbers', 'Integers', 'counting', 'negatives'],
      teacherTip: "Use real examples: counting money (natural), empty wallet (whole), temperature below zero (integers)."
    },
    {
      id: 1,
      icon: Divide,
      narration: "Rational numbers can be written as fractions - like one-half, three-quarters, or even 0.75. Any terminating or repeating decimal is rational. If you can write it as p over q where q is not zero, it's rational!",
      visualContent: "Rational = p/q | Examples: ½, ¾, 0.5, 0.333..., -2/3",
      highlightWords: ['Rational', 'fractions', 'terminating', 'repeating', 'p over q'],
      teacherTip: "Show how common decimals like 0.5 and 0.25 convert to fractions."
    },
    {
      id: 2,
      icon: Infinity,
      narration: "Irrational numbers cannot be written as simple fractions! Pi equals 3.14159... and goes on forever without repeating. Square root of 2 is about 1.41421... These decimals never end and never repeat!",
      visualContent: "Irrational: π = 3.14159..., √2 = 1.41421..., √3, √5",
      highlightWords: ['Irrational', 'Pi', 'Square root', 'forever', 'never repeat'],
      teacherTip: "Have students try dividing to see that √2 produces a non-repeating decimal."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Real numbers include everything on the number line - rationals and irrationals together! From negative infinity to positive infinity, every point is a real number. The number line is complete with real numbers!",
      visualContent: "Real = Rational ∪ Irrational | Complete number line",
      highlightWords: ['Real numbers', 'number line', 'rationals', 'irrationals', 'complete'],
      teacherTip: "Draw a number line showing where different types of numbers belong."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves asking you to classify numbers! Is 0.333... rational? Yes - it equals one-third! Is root 9 irrational? No - it equals 3, a rational! Know your number types and you'll score easy marks!",
      visualContent: "WASSCE: Classify numbers | Rational vs Irrational | Show reasoning",
      highlightWords: ['WASSCE', 'classify', 'rational', 'irrational', 'reasoning'],
      teacherTip: "Practice identifying tricky numbers like √4 (rational) vs √5 (irrational)."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Types of Numbers"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TypesOfNumbersIntro;
