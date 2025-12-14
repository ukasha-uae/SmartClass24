'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Puzzle, Target, Lightbulb, Trophy } from 'lucide-react';

const FactorizationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Puzzle,
      narration: "Welcome to our lesson on factorization of quadratic expressions. Today, we'll learn how to break down complex expressions into simpler parts, just like solving a puzzle.",
      visualContent: "Welcome to Factorization",
      highlightWords: ['factorization', 'break down', 'puzzle'],
      teacherTip: "Factorization is a crucial skill for WASSCE. It appears in almost every algebra question!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Factorization helps us solve quadratic equations faster, simplify complex algebraic expressions, and understand the roots of equations. It's a powerful tool in your mathematics toolkit.",
      visualContent: "Why Factorization Matters",
      highlightWords: ['solve', 'simplify', 'roots', 'powerful tool'],
      teacherTip: "Students who master factorization often score higher in algebra sections."
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "We'll explore three main techniques. First, factorizing by taking out common factors. Second, factorizing perfect square trinomials. Third, factorizing general quadratic expressions using the difference of two squares and sum-product methods.",
      visualContent: "What You'll Learn",
      highlightWords: ['three techniques', 'common factors', 'perfect square', 'sum-product'],
      teacherTip: "The sum-product method is the most frequently tested in WASSCE examinations."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll be able to factorize any quadratic expression confidently, identify which method to use instantly, and apply factorization to solve real exam questions.",
      visualContent: "Your Goal Today",
      highlightWords: ['factorize', 'confidently', 'exam questions'],
      teacherTip: "Practice is key. Encourage students to try multiple examples after the lesson."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Factorization of Quadratic Expressions"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default FactorizationIntro;
