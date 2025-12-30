'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { BarChart3, Calculator, Target, ListOrdered, Trophy, Scale, Lightbulb, Globe } from 'lucide-react';

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
      icon: Scale,
      narration: "Weighted mean is used when values have different importance! Like calculating your GPA - math might have 4 credits while history has 2. Multiply each value by its weight, sum them up, then divide by total weight. Weighted mean equals sum of w times x divided by sum of w!",
      visualContent: "Weighted Mean = Σ(wx) ÷ Σw | Different importance | Like GPA",
      highlightWords: ['Weighted mean', 'different importance', 'weight', 'GPA', 'credits'],
      teacherTip: "Use GPA example: courses with different credit hours show why weights matter."
    },
    {
      id: 5,
      icon: Calculator,
      narration: "The assumed mean method simplifies calculations for large numbers! Pick a convenient middle value as your assumed mean, calculate deviations from it, then adjust. Mean equals assumed mean plus sum of f times d divided by sum of f, where d is the deviation. This saves time with big datasets!",
      visualContent: "Assumed Mean Method | Mean = A + (Σfd ÷ Σf) | Saves time",
      highlightWords: ['assumed mean', 'convenient', 'deviations', 'adjust', 'saves time'],
      teacherTip: "Show how this method reduces calculation errors with large numbers."
    },
    {
      id: 6,
      icon: Lightbulb,
      narration: "Choosing the right measure matters! Use mean for symmetric data with no outliers. Use median when data is skewed or has extreme values - like income or house prices. Use mode for categorical data or finding the most popular choice. Each measure tells a different story!",
      visualContent: "Mean: symmetric data | Median: skewed/outliers | Mode: categorical",
      highlightWords: ['choosing', 'symmetric', 'skewed', 'outliers', 'categorical'],
      teacherTip: "Compare mean vs median for income data to show why median is better with outliers."
    },
    {
      id: 7,
      icon: Globe,
      narration: "These measures are everywhere in Ghana! Farmers use mean to track crop yields across seasons. Businesses analyze median sales to understand typical performance. Market researchers find the mode to identify popular products. From Accra to Tamale, statistics helps make better decisions!",
      visualContent: "Real-World: Crop yields | Sales analysis | Market research | Ghana",
      highlightWords: ['Ghana', 'crop yields', 'sales', 'market research', 'decisions'],
      teacherTip: "Connect to local examples: cocoa production, market prices, student performance."
    },
    {
      id: 8,
      icon: Trophy,
      narration: "WASSCE loves these calculations! Always complete your frequency table, show the formula before substituting, use class boundaries for grouped data, and explain your choice of measure. Practice weighted mean and assumed mean methods too - they appear frequently! Let's master statistics!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'frequency table', 'class boundaries', 'explain', 'weighted mean', 'assumed mean'],
      teacherTip: "Practice setting up calculation tables with f, x, fx, d, fd, and cumulative frequency columns."
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
