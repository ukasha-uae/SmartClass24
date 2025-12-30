'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Slice, Calculator, Percent, ArrowLeftRight, Trophy } from 'lucide-react';

const FractionsDecimalsPercentagesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Slice,
      narration: "Fractions show parts of a whole! Three-quarters means 3 parts out of 4 equal parts. The top number is the numerator - what you have. The bottom is the denominator - total equal parts. Fractions are everywhere - half a loaf, quarter tank of fuel!",
      visualContent: "Fraction = Numerator/Denominator | ¾ = 3 parts of 4",
      highlightWords: ['Fractions', 'numerator', 'denominator', 'parts', 'whole'],
      teacherTip: "Use pizza or bread slices to visualize fractions practically."
    },
    {
      id: 1,
      icon: Calculator,
      narration: "Decimals are another way to write fractions! One-half equals 0.5. One-quarter equals 0.25. To convert, divide the numerator by the denominator. Three-quarters? Divide 3 by 4 to get 0.75!",
      visualContent: "½ = 0.5 | ¼ = 0.25 | ¾ = 0.75 | Divide top by bottom",
      highlightWords: ['Decimals', 'divide', 'numerator', 'denominator', 'convert'],
      teacherTip: "Practice division to convert common fractions to decimals."
    },
    {
      id: 2,
      icon: Percent,
      narration: "Percentages mean 'per hundred'! 50% is 50 out of 100, which equals one-half. To convert decimal to percent, multiply by 100. So 0.75 times 100 equals 75 percent. Easy!",
      visualContent: "% = per 100 | 50% = ½ | 0.75 × 100 = 75%",
      highlightWords: ['Percentages', 'per hundred', 'multiply by 100', '50%', '75%'],
      teacherTip: "Relate to discounts: 25% off means you pay 75% of the price."
    },
    {
      id: 3,
      icon: ArrowLeftRight,
      narration: "Master all conversions! Fraction to decimal: divide. Decimal to percent: multiply by 100. Percent to fraction: write over 100 and simplify. 25% equals 25 over 100, which simplifies to one-quarter!",
      visualContent: "F → D: divide | D → %: ×100 | % → F: over 100, simplify",
      highlightWords: ['conversions', 'divide', 'multiply', 'simplify', 'over 100'],
      teacherTip: "Create a conversion triangle showing all three forms."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests these conversions every year! Calculate percentage increase, find fractions of amounts, convert between forms. Always show your working - write the conversion step by step. These are guaranteed marks!",
      visualContent: "WASSCE: Conversions, % increase/decrease, fractions of amounts",
      highlightWords: ['WASSCE', 'percentage increase', 'conversions', 'guaranteed marks'],
      teacherTip: "Practice real-world problems: discounts, interest, population growth."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Fractions, Decimals & Percentages"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default FractionsDecimalsPercentagesIntro;
