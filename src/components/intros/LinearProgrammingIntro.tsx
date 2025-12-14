'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { BarChart3, Target, Lightbulb, Trophy } from 'lucide-react';

const LinearProgrammingIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: BarChart3,
      narration: "Welcome to Linear Programming! This is where mathematics meets real-world decision making. Every successful business uses optimization - whether it's maximizing profits or minimizing costs. Today, you'll learn how to make the best decisions with limited resources!",
      visualContent: "Welcome to Linear Programming",
      highlightWords: ['Linear Programming', 'decision making', 'optimization', 'limited resources'],
      teacherTip: "Linear programming is used daily by businesses, farmers, and manufacturers to save money and increase profits!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Think about a factory deciding how many products to make, or a farmer choosing which crops to plant. They have constraints like limited labor hours, limited machines, or limited land. Linear programming gives us a scientific method to find the optimal solution that maximizes profit or minimizes cost!",
      visualContent: "Real-World Optimization",
      highlightWords: ['factory', 'farmer', 'constraints', 'optimal solution'],
      teacherTip: "Show students that math solves real problems - this isn't just theory!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "Here's the beautiful part. We'll learn to convert word problems into mathematical models with decision variables, objective functions, and constraints. Then we'll graph inequalities to find the feasible region, and use the corner point method to locate the optimal solution. It's like solving a puzzle!",
      visualContent: "The Method",
      highlightWords: ['mathematical models', 'graph inequalities', 'corner point method', 'optimal solution'],
      teacherTip: "The corner point theorem guarantees we only check a few points - very efficient!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll be able to formulate linear programming problems from real-world scenarios, graph feasible regions accurately, apply the corner point method systematically, and interpret your results in business context. These skills appear in WASSCE and are valuable in economics and business studies!",
      visualContent: "Your Goal Today",
      highlightWords: ['formulate', 'graph', 'corner point method', 'WASSCE'],
      teacherTip: "This topic connects math to business, agriculture, and economics - perfect for practical applications!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Linear Programming"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LinearProgrammingIntro;
