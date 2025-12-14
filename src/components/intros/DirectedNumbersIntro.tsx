'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { ArrowLeftRight, Plus, Minus, Calculator, Trophy } from 'lucide-react';

const DirectedNumbersIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: ArrowLeftRight,
      narration: "Directed numbers have direction - positive or negative! Temperature can be positive 30 degrees or negative 5 degrees. Bank balance can be positive (credit) or negative (debt). Zero is the middle point on the number line!",
      visualContent: "...-3, -2, -1, 0, +1, +2, +3... | Direction matters!",
      highlightWords: ['Directed numbers', 'positive', 'negative', 'Temperature', 'Zero'],
      teacherTip: "Use thermometers and bank accounts as real-world examples."
    },
    {
      id: 1,
      icon: Plus,
      narration: "Adding with same signs: add the numbers, keep the sign! Positive 5 plus positive 3 equals positive 8. Negative 5 plus negative 3 equals negative 8. Adding with different signs: subtract smaller from larger, take sign of larger!",
      visualContent: "(+5) + (+3) = +8 | (-5) + (-3) = -8 | Different: subtract, larger sign",
      highlightWords: ['same signs', 'add', 'keep the sign', 'different signs', 'subtract'],
      teacherTip: "Think of money: debt plus debt equals more debt; credit minus debt depends on which is bigger."
    },
    {
      id: 2,
      icon: Minus,
      narration: "Subtracting is adding the opposite! Change the subtraction to addition and flip the sign of the second number. Positive 5 minus negative 3 becomes positive 5 plus positive 3, which equals 8!",
      visualContent: "(+5) - (-3) = (+5) + (+3) = +8 | KCF: Keep, Change, Flip",
      highlightWords: ['Subtracting', 'adding the opposite', 'flip the sign', 'KCF'],
      teacherTip: "Teach KCF rule: Keep first number, Change minus to plus, Flip sign of second."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Multiplying and dividing: same signs give positive, different signs give negative! Positive times positive is positive. Negative times negative is positive. Positive times negative is negative. Remember: same positive, different negative!",
      visualContent: "(+)(+) = + | (-)(-) = + | (+)(-) = - | (-)(+) = -",
      highlightWords: ['Multiplying', 'dividing', 'same signs', 'positive', 'different signs', 'negative'],
      teacherTip: "Create a sign chart for quick reference during calculations."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests directed number operations frequently! Watch your signs carefully in every step. Use brackets to avoid confusion. Check your answer makes sense - losing money makes balance more negative, not positive!",
      visualContent: "WASSCE: Sign rules, brackets, check logic",
      highlightWords: ['WASSCE', 'signs', 'brackets', 'check', 'logic'],
      teacherTip: "Practice mixed operations with directed numbers from past papers."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Directed Numbers"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default DirectedNumbersIntro;
