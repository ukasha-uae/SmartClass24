'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Target, Ruler, Sigma, Calculator, Trophy } from 'lucide-react';

const ApproximationEstimationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Target,
      narration: "Approximation gives us simpler numbers that are close enough! We round numbers to make calculations easier. Round 47 to the nearest ten? It's 50! Round 3.847 to 2 decimal places? Look at the third decimal - 7 is 5 or more, so round up to 3.85!",
      visualContent: "47 → 50 (nearest 10) | 3.847 → 3.85 (2 d.p.) | 5+ rounds up",
      highlightWords: ['Approximation', 'round', 'nearest ten', 'decimal places', 'round up'],
      teacherTip: "Use the rhyme: '5 or more, raise the score; 4 or less, let it rest.'"
    },
    {
      id: 1,
      icon: Ruler,
      narration: "Significant figures count meaningful digits! In 0.00347, there are 3 significant figures: 3, 4, 7. Leading zeros don't count! 4500 to 2 significant figures is 4500 or 4.5 times 10 to power 3. Trailing zeros can be tricky!",
      visualContent: "0.00347 = 3 s.f. | 4500 = 2 s.f. as 4.5×10³ | Leading zeros don't count",
      highlightWords: ['Significant figures', 'meaningful digits', 'Leading zeros', 'trailing zeros'],
      teacherTip: "Practice identifying significant figures with various numbers."
    },
    {
      id: 2,
      icon: Sigma,
      narration: "Standard form writes numbers as A times 10 to power n, where A is between 1 and 10. Big numbers: 45000 equals 4.5 times 10 to power 4. Small numbers: 0.0003 equals 3 times 10 to power negative 4. Move the decimal!",
      visualContent: "A × 10ⁿ (1 ≤ A < 10) | 45000 = 4.5×10⁴ | 0.0003 = 3×10⁻⁴",
      highlightWords: ['Standard form', '10 to power n', 'Big numbers', 'Small numbers', 'decimal'],
      teacherTip: "Count how many places the decimal moves to find the power."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Estimation checks if your answer makes sense! Round each number to 1 significant figure first. Estimate 48.7 times 21.3: round to 50 times 20 equals 1000. The actual answer should be close to 1000!",
      visualContent: "48.7 × 21.3 ≈ 50 × 20 = 1000 | Round to 1 s.f. first",
      highlightWords: ['Estimation', 'makes sense', '1 significant figure', 'actual answer', 'close'],
      teacherTip: "Always estimate before calculating to catch errors."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests rounding, significant figures, and standard form every year! Read carefully: decimal places or significant figures? Give the degree of accuracy requested. Use estimation to verify your calculated answers!",
      visualContent: "WASSCE: d.p. vs s.f. | Standard form | Estimation checks",
      highlightWords: ['WASSCE', 'decimal places', 'significant figures', 'standard form', 'verify'],
      teacherTip: "Practice converting between different forms of approximation."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Approximation & Estimation"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ApproximationEstimationIntro;
