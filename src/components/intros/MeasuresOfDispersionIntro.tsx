'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Maximize2, Calculator, TrendingUp, Percent, Trophy } from 'lucide-react';

const MeasuresOfDispersionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Maximize2,
      narration: "Welcome to Measures of Dispersion! While central tendency tells us the typical value, dispersion tells us how spread out the data is. Two classes can have the same average but very different spreads!",
      visualContent: "Dispersion",
      highlightWords: ['Dispersion', 'spread out', 'typical value', 'different spreads'],
      teacherTip: "Show two datasets with the same mean but different spreads to illustrate the concept."
    },
    {
      id: 1,
      icon: Calculator,
      narration: "The range is the simplest measure - just maximum minus minimum. But it only uses two values! Variance and standard deviation use ALL your data to measure how far values typically spread from the mean.",
      visualContent: "Range & Variance",
      highlightWords: ['range', 'maximum', 'minimum', 'variance', 'standard deviation'],
      teacherTip: "Demonstrate how one outlier can dramatically change the range but less so the standard deviation."
    },
    {
      id: 2,
      icon: TrendingUp,
      narration: "Standard deviation sigma equals the square root of variance. Small sigma means data is clustered near the mean. Large sigma means data is spread out. This is one of the most important measures in all of statistics!",
      visualContent: "Standard Deviation",
      highlightWords: ['sigma', 'square root', 'clustered', 'important'],
      teacherTip: "About 68% of normally distributed data falls within one standard deviation of the mean."
    },
    {
      id: 3,
      icon: Percent,
      narration: "The coefficient of variation lets you compare variability between different datasets! It's the standard deviation as a percentage of the mean. Lower CV means more consistency - very useful for real comparisons!",
      visualContent: "Coefficient of Variation",
      highlightWords: ['coefficient of variation', 'compare', 'percentage', 'consistency'],
      teacherTip: "CV is perfect for comparing variability in heights vs weights, or marks in different subjects."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves these calculations! Set up your table with f, x, fx, x-squared, and fx-squared columns. Show the variance formula, then take the square root for standard deviation. Let's master this!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'table', 'variance formula', 'square root'],
      teacherTip: "The computational formula σ² = Σfx²/Σf - x̄² is usually faster than the definition formula."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Measures of Dispersion"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default MeasuresOfDispersionIntro;
