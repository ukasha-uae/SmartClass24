'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { BarChart3, Calculator, Target, ListOrdered, Trophy } from 'lucide-react';

const MeasuresOfCentralTendencyIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: BarChart3,
      narration: "Welcome to Measures of Central Tendency! What's the average age in your class? What's the typical test score? These powerful statistical tools help us summarize data with single representative values.",
      visualContent: "Central Tendency",
      highlightWords: ['average', 'typical', 'statistical tools', 'summarize'],
      teacherTip: "Ask students where they've heard 'average' used in real life."
    },
    {
      id: 1,
      icon: Calculator,
      narration: "The mean, or average, is the sum of all values divided by the count. It's the balance point of your data. For grouped data, multiply each midpoint by its frequency, then divide by total frequency!",
      visualContent: "Mean Formula",
      highlightWords: ['mean', 'average', 'sum', 'balance point', 'grouped data'],
      teacherTip: "Show the mean as a balance point on a number line visualization."
    },
    {
      id: 2,
      icon: Target,
      narration: "The median is the middle value when data is arranged in order. It splits your data in half - fifty percent above, fifty percent below. Unlike the mean, extreme outliers don't affect it!",
      visualContent: "Median",
      highlightWords: ['median', 'middle value', 'order', 'outliers'],
      teacherTip: "Have students line up by height to physically find the median person!"
    },
    {
      id: 3,
      icon: ListOrdered,
      narration: "The mode is simply the most common value - the one that appears most often. A dataset can have no mode, one mode called unimodal, or multiple modes called bimodal or multimodal!",
      visualContent: "Mode",
      highlightWords: ['mode', 'most common', 'unimodal', 'bimodal'],
      teacherTip: "Ask: What's the most popular color in this room? That's finding the mode!"
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves these calculations! Always complete your frequency table, show the formula before substituting, use class boundaries for grouped data, and explain your choice of measure. Let's master statistics!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'frequency table', 'class boundaries', 'explain'],
      teacherTip: "Practice setting up calculation tables with f, x, fx, and cumulative frequency columns."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Measures of Central Tendency"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default MeasuresOfCentralTendencyIntro;
