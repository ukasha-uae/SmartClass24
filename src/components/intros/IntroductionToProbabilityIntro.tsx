'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Dice1, Target, Calculator, List, Trophy } from 'lucide-react';

const IntroductionToProbabilityIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Dice1,
      narration: "Probability measures how likely an event is to happen! It ranges from 0 (impossible) to 1 (certain). Rolling a 7 on a normal die? Probability is 0 - impossible! Getting heads or tails on a coin? Probability is 1 - certain to get one!",
      visualContent: "P = 0 (impossible) to P = 1 (certain) | 0 ≤ P ≤ 1",
      highlightWords: ['Probability', 'likely', '0', '1', 'impossible', 'certain'],
      teacherTip: "Use familiar examples: winning lottery (very low), sun rising (certain)."
    },
    {
      id: 1,
      icon: Target,
      narration: "The probability formula: P equals favorable outcomes divided by total possible outcomes. Rolling a 3 on a die? 1 favorable outcome out of 6 total, so P equals one-sixth. Rolling an even number? 3 favorable (2, 4, 6) out of 6, so P equals one-half!",
      visualContent: "P(A) = favorable/total | P(3) = 1/6 | P(even) = 3/6 = ½",
      highlightWords: ['favorable', 'total', 'outcomes', 'formula', 'one-sixth'],
      teacherTip: "Practice identifying favorable and total outcomes in various scenarios."
    },
    {
      id: 2,
      icon: Calculator,
      narration: "P of event happening plus P of event NOT happening equals 1! If probability of rain is 0.3, probability of no rain is 0.7. This is the complement rule. P of A-complement equals 1 minus P of A!",
      visualContent: "P(A) + P(A') = 1 | P(not A) = 1 - P(A) | Complement rule",
      highlightWords: ['complement', 'NOT happening', '1 minus', 'P(A)', 'complement rule'],
      teacherTip: "Sometimes it's easier to calculate complement and subtract from 1."
    },
    {
      id: 3,
      icon: List,
      narration: "Sample space is all possible outcomes! For a coin: heads or tails - two outcomes. For a die: 1, 2, 3, 4, 5, 6 - six outcomes. Two coins? HH, HT, TH, TT - four outcomes. List systematically to not miss any!",
      visualContent: "Sample space: all outcomes | Coin: {H, T} | Die: {1,2,3,4,5,6}",
      highlightWords: ['Sample space', 'possible outcomes', 'list', 'systematically'],
      teacherTip: "Use tree diagrams or tables to list sample spaces for combined events."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests basic probability every year! Questions often use dice, coins, balls in bags, or cards. Always simplify your fraction answer. State probability as a fraction, decimal, or percentage as required. Easy marks if you know the basics!",
      visualContent: "WASSCE: Dice, coins, bags, cards | Simplify fractions | Easy marks!",
      highlightWords: ['WASSCE', 'dice', 'coins', 'bags', 'simplify', 'easy marks'],
      teacherTip: "Practice with various objects: colored balls, numbered cards, spinners."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Introduction to Probability"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default IntroductionToProbabilityIntro;
