'use client';

import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Hash, Calculator, Target, Lightbulb, Trophy } from 'lucide-react';

interface TypesOfNumbersIntroProps {
  onComplete?: () => void;
}

export default function TypesOfNumbersIntro({ onComplete }: TypesOfNumbersIntroProps) {
  const scenes = [
    {
      id: 0,
      icon: Hash,
      narration: "Welcome to the fascinating world of numbers! Every day in Ghana, we use numbers - counting oranges at the market, measuring distances, managing money, and calculating prices. But did you know numbers come in different types? Understanding these types is like learning the alphabet before reading - it's the foundation of all mathematics!",
      visualContent: "Welcome to Number Types",
      highlightWords: ['numbers', 'Ghana', 'market', 'foundation', 'mathematics'],
      teacherTip: "Start by asking: How many types of numbers do you think exist? The answer will surprise them!"
    },
    {
      id: 1,
      icon: Calculator,
      narration: "Numbers are classified into different sets based on their properties. Natural numbers are counting numbers starting from one - like counting students in your class. Whole numbers include zero - like having zero cedis in your pocket. Integers include negative numbers too - like temperatures below zero or debts. Rational numbers are fractions and decimals - like half a loaf of bread or two point five cedis. Irrational numbers can't be written as fractions - like pi or the square root of two.",
      visualContent: "Number Classifications",
      highlightWords: ['natural numbers', 'whole numbers', 'integers', 'rational', 'irrational', 'fractions'],
      teacherTip: "Use Ghanaian examples: counting market items (natural), bank balance (whole), temperature (integers), prices (rational)."
    },
    {
      id: 2,
      icon: Target,
      narration: "Why does this matter? In Ghanaian commerce, you need whole numbers to count items, rational numbers for prices like GH₵2.50, and integers for temperatures or elevations. In science and engineering, irrational numbers appear in calculations involving circles, waves, and growth patterns. Understanding number types helps you choose the right number for each situation and solve problems correctly.",
      visualContent: "Why It Matters",
      highlightWords: ['commerce', 'prices', 'science', 'engineering', 'solve problems'],
      teacherTip: "Connect to WASSCE: Many exam questions test your ability to identify and work with different number types!"
    },
    {
      id: 3,
      icon: Lightbulb,
      narration: "In this lesson, you'll learn to identify natural numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers. You'll discover how to represent them on a number line, understand their properties, and apply them to real-world situations in Ghana - from market transactions to scientific calculations.",
      visualContent: "What You'll Learn",
      highlightWords: ['identify', 'number line', 'properties', 'real-world', 'Ghana'],
      teacherTip: "The number line visualization is crucial - it helps students see how number sets relate to each other."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll be able to classify any number into its correct type, understand why certain operations work with some number types but not others, solve problems involving different number sets, and apply this knowledge to everyday situations in Ghana. This foundation is essential for algebra, calculus, and your WASSCE success!",
      visualContent: "Your Goal Today",
      highlightWords: ['classify', 'operations', 'solve problems', 'WASSCE', 'success'],
      teacherTip: "This is a foundational lesson - mastery here makes all future math topics easier to understand!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Types of Numbers"
      subject="Core Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
