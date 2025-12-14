'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { BarChart3, TrendingUp, Calculator, Sigma, Trophy } from 'lucide-react';

const StatisticsMeasuresIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: BarChart3,
      narration: "Mean, median, and mode help us summarize data with single values! Mean is the average - add everything up and divide by how many. It's affected by extreme values. For grouped data, use class midpoints times frequencies, then divide by total frequency!",
      visualContent: "Mean = Sum ÷ Count | Grouped: Σfx ÷ Σf | Affected by extremes",
      highlightWords: ['Mean', 'average', 'divide', 'grouped data', 'midpoints', 'frequencies'],
      teacherTip: "Use relatable examples like test scores or heights to calculate mean."
    },
    {
      id: 1,
      icon: TrendingUp,
      narration: "Median is the middle value when data is arranged in order. For odd numbers of values, it's the exact middle. For even numbers, average the two middle values. For grouped data, use the median class formula: L plus n over 2 minus F, over f, times c!",
      visualContent: "Median: middle value | Grouped: L + ((n/2 - F)/f) × c",
      highlightWords: ['Median', 'middle', 'arranged in order', 'average', 'median class'],
      teacherTip: "Have students line up by height to physically demonstrate finding the median."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "Mode is the most frequent value - the one that appears the most! Some datasets have no mode, one mode, or multiple modes. For grouped data, the modal class is the class with highest frequency. Mode is the only measure that works with non-numerical data too!",
      visualContent: "Mode: most frequent | Modal class = highest f | Works with non-numbers",
      highlightWords: ['Mode', 'most frequent', 'modal class', 'highest frequency'],
      teacherTip: "Survey favorite colors in class - mode is the only valid measure for this data."
    },
    {
      id: 3,
      icon: Sigma,
      narration: "Range measures spread - it's the highest value minus the lowest! Standard deviation tells us how spread out data is from the mean. Small deviation means data is clustered close to mean. Large deviation means data is spread out. Both are important in WASSCE!",
      visualContent: "Range = Max - Min | SD = spread from mean | Small SD = clustered",
      highlightWords: ['Range', 'spread', 'standard deviation', 'clustered', 'spread out'],
      teacherTip: "Compare class test scores with high vs low spread to illustrate deviation."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE frequently tests mean, median, mode from frequency tables! Set up your working table clearly with columns for x, f, fx, and cumulative frequency. Double-check your totals. Choose the right formula for grouped versus ungrouped data. You're ready to ace this!",
      visualContent: "WASSCE: Frequency tables | Columns: x, f, fx, CF | Choose correct formula",
      highlightWords: ['WASSCE', 'frequency tables', 'working table', 'cumulative frequency'],
      teacherTip: "Practice setting up frequency table calculations systematically."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Statistics: Measures of Central Tendency & Spread"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default StatisticsMeasuresIntro;
