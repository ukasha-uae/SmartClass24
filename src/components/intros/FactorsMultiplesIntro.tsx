'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Grid3X3, Divide, Combine, Calculator, Trophy } from 'lucide-react';

const FactorsMultiplesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Grid3X3,
      narration: "Factors divide evenly into a number with no remainder! Factors of 12 are 1, 2, 3, 4, 6, and 12. Multiples are the times table: multiples of 3 are 3, 6, 9, 12, 15, and so on forever. Factors are finite, multiples are infinite!",
      visualContent: "Factors of 12: 1, 2, 3, 4, 6, 12 | Multiples of 3: 3, 6, 9, 12...",
      highlightWords: ['Factors', 'divide evenly', 'no remainder', 'Multiples', 'times table'],
      teacherTip: "Factors come in pairs: 1×12, 2×6, 3×4 for the number 12."
    },
    {
      id: 1,
      icon: Divide,
      narration: "Prime numbers have exactly two factors: 1 and themselves! 2, 3, 5, 7, 11, 13 are prime. 1 is NOT prime - it only has one factor. 4, 6, 8, 9 are composite - they have more than two factors!",
      visualContent: "Prime: exactly 2 factors | 2, 3, 5, 7, 11... | 1 is NOT prime",
      highlightWords: ['Prime numbers', 'two factors', 'NOT prime', 'composite', 'more than two'],
      teacherTip: "2 is the only even prime number - a useful fact to remember!"
    },
    {
      id: 2,
      icon: Combine,
      narration: "Prime factorization breaks numbers into prime factors! Use factor trees: 60 equals 2 times 30, then 2 times 2 times 15, then 2 times 2 times 3 times 5. Write as 2-squared times 3 times 5. This is unique for every number!",
      visualContent: "60 = 2² × 3 × 5 | Use factor tree | Keep dividing by primes",
      highlightWords: ['Prime factorization', 'factor trees', 'prime factors', 'unique'],
      teacherTip: "Start dividing by the smallest prime (2), then 3, then 5, and so on."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "HCF is the Highest Common Factor - the biggest number that divides both! LCM is the Lowest Common Multiple - the smallest number both divide into! For HCF, use common primes with lowest powers. For LCM, use ALL primes with highest powers!",
      visualContent: "HCF: common primes, lowest powers | LCM: all primes, highest powers",
      highlightWords: ['HCF', 'Highest Common Factor', 'LCM', 'Lowest Common Multiple', 'powers'],
      teacherTip: "HCF × LCM = product of the two numbers - useful for checking!"
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves HCF and LCM problems! Word problems ask: when will two events coincide again? That's LCM! What's the largest piece for equal cutting? That's HCF! Show your prime factorization for full marks!",
      visualContent: "WASSCE: LCM for 'when again' | HCF for 'largest equal piece'",
      highlightWords: ['WASSCE', 'coincide', 'LCM', 'largest', 'equal', 'HCF'],
      teacherTip: "Practice real-world HCF/LCM problems: buses, bells, tile cutting."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Factors & Multiples"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default FactorsMultiplesIntro;
