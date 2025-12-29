'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Slice, Calculator, Percent, ArrowLeftRight, Trophy } from 'lucide-react';

const FractionsDecimalsPercentagesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Slice,
      narration: "Welcome to fractions, decimals, and percentages! These three ways of expressing parts are everywhere in Ghana - from sharing a loaf of bread equally among family members, to calculating prices at the market, to understanding discounts and sales. Master these conversions and you'll unlock a powerful tool for everyday life and mathematics!",
      visualContent: "Welcome to Fractions, Decimals & Percentages",
      highlightWords: ['fractions', 'decimals', 'percentages', 'Ghana', 'everyday life'],
      teacherTip: "Start with a real example: If you buy half a loaf of bread, how do you write that as a fraction, decimal, and percentage?"
    },
    {
      id: 1,
      icon: Calculator,
      narration: "Fractions show parts of a whole! When you share a loaf of bread among four people, each person gets one-quarter. The top number is the numerator - what you have. The bottom is the denominator - total equal parts. Decimals are another way to write fractions - one-half equals 0.5, one-quarter equals 0.25. To convert, simply divide the numerator by the denominator!",
      visualContent: "Fractions & Decimals",
      highlightWords: ['fractions', 'numerator', 'denominator', 'decimals', 'divide'],
      teacherTip: "Use Ghanaian examples: sharing kenkey, dividing market produce, splitting mobile money."
    },
    {
      id: 2,
      icon: Percent,
      narration: "Percentages mean 'per hundred' - they show how many out of 100! When a shop in Accra offers 25% discount, that means 25 out of every 100 cedis is saved. To convert decimal to percent, multiply by 100. So 0.75 times 100 equals 75 percent. Percentages are used everywhere - exam scores, discounts, interest rates, and population statistics!",
      visualContent: "Understanding Percentages",
      highlightWords: ['percentages', 'per hundred', 'discount', 'multiply by 100', 'Ghana'],
      teacherTip: "Connect to real Ghanaian scenarios: Black Friday sales, mobile money charges, exam pass rates."
    },
    {
      id: 3,
      icon: ArrowLeftRight,
      narration: "The magic is in converting between all three forms! Fraction to decimal: divide numerator by denominator. Decimal to percent: multiply by 100. Percent to fraction: write over 100 and simplify. For example, 25% equals 25 over 100, which simplifies to one-quarter, which equals 0.25 as a decimal. Master these conversions and you can work with any problem!",
      visualContent: "Mastering Conversions",
      highlightWords: ['conversions', 'divide', 'multiply', 'simplify', 'master'],
      teacherTip: "Create a conversion triangle diagram showing all three forms connected."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently convert between fractions, decimals, and percentages, solve real-world problems involving discounts and percentages, calculate percentage increases and decreases, and apply these skills to everyday situations in Ghana. These skills are essential for WASSCE and for managing money, shopping, and understanding statistics!",
      visualContent: "Your Goal Today",
      highlightWords: ['convert', 'solve problems', 'WASSCE', 'everyday situations', 'Ghana'],
      teacherTip: "This topic appears in almost every WASSCE paper - it's high-value content!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Fractions, Decimals & Percentages"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default FractionsDecimalsPercentagesIntro;
