'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Percent, TrendingUp, Calculator, Banknote, Trophy } from 'lucide-react';

const BusinessMathematicsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Percent,
      narration: "Profit and loss are fundamental to business! Profit equals selling price minus cost price. Loss is when selling price is less than cost price. Percentage profit equals profit divided by cost price, times 100!",
      visualContent: "Profit = SP - CP | Loss = CP - SP | %Profit = (Profit/CP) × 100",
      highlightWords: ['Profit', 'loss', 'selling price', 'cost price', 'percentage'],
      teacherTip: "Use real market scenarios: buying oranges wholesale, selling retail."
    },
    {
      id: 1,
      icon: TrendingUp,
      narration: "Simple interest is calculated on the original principal only! Formula: I equals P times R times T divided by 100. P is principal, R is rate per year, T is time in years. Easy to calculate, commonly used for short-term loans!",
      visualContent: "Simple Interest: I = PRT/100 | P = principal, R = rate, T = time",
      highlightWords: ['Simple interest', 'principal', 'rate', 'time', 'original'],
      teacherTip: "Calculate interest on GH₵1000 at 5% for different time periods."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "Compound interest grows on previous interest too! Amount equals P times quantity 1 plus r, raised to power n. Interest earned becomes part of the new principal. Money grows faster with compound interest!",
      visualContent: "Compound: A = P(1 + r)ⁿ | Interest on interest | Grows faster",
      highlightWords: ['Compound interest', 'Amount', 'grows', 'power n', 'faster'],
      teacherTip: "Compare simple vs compound interest over 5 years to show the difference."
    },
    {
      id: 3,
      icon: Banknote,
      narration: "Depreciation is when value decreases over time - like cars! Value equals original times quantity 1 minus rate, raised to power of years. Appreciation is the opposite - property often appreciates. Same formula, different sign!",
      visualContent: "Depreciation: V = P(1 - r)ⁿ | Appreciation: V = P(1 + r)ⁿ",
      highlightWords: ['Depreciation', 'value decreases', 'Appreciation', 'increases', 'rate'],
      teacherTip: "Calculate car depreciation vs land appreciation over 5 years."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves business math word problems! Read carefully to identify what's given and what's asked. Is it simple or compound interest? Profit or loss? Show your substitution into the formula clearly. These are practical skills for real life!",
      visualContent: "WASSCE: Identify formula needed | Show substitution | Real-life skills",
      highlightWords: ['WASSCE', 'word problems', 'formula', 'substitution', 'practical'],
      teacherTip: "Practice translating word problems into mathematical calculations."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Business Mathematics"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default BusinessMathematicsIntro;
