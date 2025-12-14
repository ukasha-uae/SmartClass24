'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Binary, Hash, Calculator, ArrowRightLeft, Trophy } from 'lucide-react';

const NumberBasesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Hash,
      narration: "We count in base 10 because we have 10 fingers! But computers use base 2 - just zeros and ones. Other cultures used base 12 (that's why we have 12 hours on a clock) and base 60 (that's why minutes have 60 seconds). Number bases are everywhere!",
      visualContent: "Base 10: 0-9 | Base 2: 0-1 | Base 8: 0-7 | Base 16: 0-F",
      highlightWords: ['base 10', 'base 2', 'zeros and ones', 'number bases'],
      teacherTip: "Start with place value in base 10 before introducing other bases."
    },
    {
      id: 1,
      icon: Binary,
      narration: "Binary is base 2 - the language of computers! Each position represents a power of 2. From right to left: 1, 2, 4, 8, 16, 32... So binary 1011 means 8 plus 0 plus 2 plus 1 equals 11 in decimal. It's like a light switch - on or off!",
      visualContent: "Binary 1011₂ = 8+0+2+1 = 11₁₀",
      highlightWords: ['Binary', 'base 2', 'power of 2', 'light switch'],
      teacherTip: "Use physical objects (coins heads/tails) to demonstrate binary counting."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "To convert from any base to base 10, multiply each digit by its place value and add. To convert FROM base 10, keep dividing by the new base and collect the remainders. The remainders read from bottom to top give your answer!",
      visualContent: "To Base 10: Multiply & Add | From Base 10: Divide & Collect Remainders",
      highlightWords: ['place value', 'dividing', 'remainders', 'bottom to top'],
      teacherTip: "Practice the division method with small numbers first before tackling larger conversions."
    },
    {
      id: 3,
      icon: ArrowRightLeft,
      narration: "You can also do arithmetic in other bases! When adding in base 5, remember that 4 plus 1 equals 10 in base 5, not 5. It's like rolling over at a different number. The key is knowing when to carry based on your base!",
      visualContent: "In Base 5: 4 + 1 = 10₅ (carry at 5, not 10)",
      highlightWords: ['arithmetic', 'base 5', 'rolling over', 'carry'],
      teacherTip: "Compare carrying in different bases to odometer rollover at different mileages."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves number base conversions! You'll convert between bases, do addition and subtraction in different bases, and solve equations involving unknown bases. Master place value and the conversion methods, and these questions become easy marks!",
      visualContent: "WASSCE Skills: Convert | Add/Subtract | Solve Equations",
      highlightWords: ['WASSCE', 'convert between bases', 'addition', 'subtraction', 'equations'],
      teacherTip: "Practice with past WASSCE questions to recognize common problem patterns."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Number Bases"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default NumberBasesIntro;
