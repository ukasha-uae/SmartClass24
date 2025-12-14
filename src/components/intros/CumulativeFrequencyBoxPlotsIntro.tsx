'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { BarChart3, TrendingUp, Box, Target, Trophy } from 'lucide-react';

const CumulativeFrequencyBoxPlotsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: BarChart3,
      narration: "Cumulative frequency is like keeping a running total! Start with zero, then add each frequency as you go. If 5 students scored 10-19 and 8 scored 20-29, the cumulative frequency at 29 is 5 plus 8 equals 13. This tells us how many values are at or below each point.",
      visualContent: "Running Total: CF = Previous CF + Frequency",
      highlightWords: ['Cumulative frequency', 'running total', 'at or below'],
      teacherTip: "Use a simple example with small numbers first - have students count up together."
    },
    {
      id: 1,
      icon: TrendingUp,
      narration: "An ogive is the graph of cumulative frequency - it makes a beautiful S-shaped curve! Plot your points at upper class boundaries, not midpoints. Start from zero at the lower boundary of your first class, then connect with a smooth curve. The steeper parts show where most data is concentrated!",
      visualContent: "Plot at Upper Class Boundaries → Smooth S-Curve",
      highlightWords: ['ogive', 'S-shaped curve', 'upper class boundaries', 'steeper'],
      teacherTip: "Emphasize that we use upper boundaries because CF means 'up to and including' that value."
    },
    {
      id: 2,
      icon: Target,
      narration: "Finding the median from an ogive is easy! For 100 data values, go to cumulative frequency 50 on the y-axis, draw a horizontal line to your curve, then drop straight down to read the median. For quartiles, use n divided by 4 for Q1 and 3n divided by 4 for Q3!",
      visualContent: "Median at n/2, Q1 at n/4, Q3 at 3n/4",
      highlightWords: ['median', 'n divided by 4', 'Q1', 'Q3', 'quartiles'],
      teacherTip: "Practice this reading technique multiple times - it's the most common exam skill tested."
    },
    {
      id: 3,
      icon: Box,
      narration: "A box plot shows the five-number summary at a glance! Draw a box from Q1 to Q3, put a line at the median, then extend whiskers to the minimum and maximum. The box contains the middle 50 percent of your data. Longer boxes mean more spread!",
      visualContent: "Box: Q1 to Q3 | Line: Median | Whiskers: Min & Max",
      highlightWords: ['five-number summary', 'box', 'Q1 to Q3', 'whiskers', 'middle 50 percent'],
      teacherTip: "Draw the five-number summary first, then construct the box plot step by step."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests you on finding outliers too! Use the 1.5 times IQR rule: any value below Q1 minus 1.5 times IQR or above Q3 plus 1.5 times IQR is an outlier. When comparing box plots, look at their positions, spreads, and whether they're symmetric or skewed!",
      visualContent: "Outliers: Below Q1−1.5×IQR or Above Q3+1.5×IQR",
      highlightWords: ['outliers', '1.5 times IQR', 'comparing', 'skewed'],
      teacherTip: "Show how comparing two box plots quickly reveals which group performed better or is more consistent."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Cumulative Frequency & Box Plots"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CumulativeFrequencyBoxPlotsIntro;
