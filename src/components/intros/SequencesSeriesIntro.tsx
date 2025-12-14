'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { TrendingUp, Target, Lightbulb, Trophy } from 'lucide-react';

const SequencesSeriesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: TrendingUp,
      narration: "Welcome to Sequences and Series! This is one of the most practical topics in mathematics. From calculating loan repayments to predicting population growth, sequences and series are everywhere in real life!",
      visualContent: "Welcome to Sequences and Series",
      highlightWords: ['Sequences', 'Series', 'practical', 'real life'],
      teacherTip: "Sequences and series appear in 10-15% of WASSCE questions - master this and boost your score!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Think about your bank account growing with interest, or a business projecting sales growth. These all use sequences! We'll explore two main types: arithmetic sequences with constant differences, and geometric sequences with constant ratios.",
      visualContent: "Real-World Applications",
      highlightWords: ['bank account', 'interest', 'arithmetic', 'geometric'],
      teacherTip: "Help students see that arithmetic is about adding, geometric is about multiplying."
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "Here's what makes this topic special. You'll learn powerful formulas to find any term in a sequence without listing all previous terms, and calculate sums of hundreds of numbers in seconds. It's like having a mathematical superpower!",
      visualContent: "What You'll Learn",
      highlightWords: ['formulas', 'any term', 'calculate sums', 'superpower'],
      teacherTip: "Emphasize the efficiency - no need to write out all terms manually!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently solve WASSCE questions on sequences and series, apply the formulas to real-world problems like loans and investments, and understand the difference between arithmetic and geometric patterns. Let's unlock these patterns together!",
      visualContent: "Your Goal Today",
      highlightWords: ['WASSCE', 'formulas', 'real-world', 'patterns'],
      teacherTip: "This topic builds foundation for calculus and financial mathematics in university!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Sequences and Series"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SequencesSeriesIntro;
