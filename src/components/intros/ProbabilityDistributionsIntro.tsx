'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { BarChart, Calculator, Target, Binary, Trophy } from 'lucide-react';

const ProbabilityDistributionsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: BarChart,
      narration: "Welcome to Probability Distributions! A distribution shows all possible outcomes and their probabilities. From coin tosses to manufacturing quality control, distributions help us predict and understand random phenomena!",
      visualContent: "Distributions",
      highlightWords: ['Probability Distributions', 'outcomes', 'probabilities', 'predict'],
      teacherTip: "Show a simple distribution table and explain that probabilities must sum to 1."
    },
    {
      id: 1,
      icon: Calculator,
      narration: "Expected value is the long-run average! Multiply each outcome by its probability and sum them up. It tells you what to expect on average - essential for games, gambling, and business decisions!",
      visualContent: "Expected Value",
      highlightWords: ['Expected value', 'long-run average', 'games', 'decisions'],
      teacherTip: "Use a simple game example to show why expected value matters for decision-making."
    },
    {
      id: 2,
      icon: Target,
      narration: "Variance measures spread in distributions! Use E of X squared minus E of X quantity squared. Standard deviation is just the square root. These tell you how variable your outcomes might be!",
      visualContent: "Variance",
      highlightWords: ['Variance', 'spread', 'Standard deviation', 'variable'],
      teacherTip: "Compare two distributions with the same mean but different variances."
    },
    {
      id: 3,
      icon: Binary,
      narration: "The binomial distribution is a WASSCE favorite! Use it when you have n trials, two outcomes (success or failure), constant probability, and count successes. The formula uses nCr times p to the r times q to the n minus r!",
      visualContent: "Binomial",
      highlightWords: ['binomial', 'WASSCE', 'n trials', 'two outcomes', 'nCr'],
      teacherTip: "Remember: μ = np and σ² = npq save lots of calculation time!"
    },
    {
      id: 4,
      icon: Trophy,
      narration: "For WASSCE success: verify probabilities sum to one, set up tables for variance calculations, use complement rule for 'at least' problems, and memorize binomial mean and variance formulas. Let's master distributions!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'sum to one', 'complement rule', 'binomial'],
      teacherTip: "Practice WASSCE past questions - they follow predictable patterns!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Probability Distributions"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ProbabilityDistributionsIntro;
