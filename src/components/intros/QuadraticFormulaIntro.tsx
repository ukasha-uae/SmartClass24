'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Calculator, Target, Lightbulb, Trophy } from 'lucide-react';

const QuadraticFormulaIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Calculator,
      narration: "Welcome to our lesson on the quadratic formula. This powerful formula can solve any quadratic equation, even when factorization seems impossible. It's your ultimate problem-solving tool.",
      visualContent: "Welcome to the Quadratic Formula",
      highlightWords: ['quadratic formula', 'powerful', 'ultimate tool'],
      teacherTip: "The quadratic formula is the most reliable method for solving quadratic equations."
    },
    {
      id: 1,
      icon: Target,
      narration: "Use the quadratic formula when factorization is difficult, when you need exact decimal answers, or when working with complex coefficients. It works every single time, guaranteed.",
      visualContent: "When to Use It",
      highlightWords: ['difficult', 'exact answers', 'guaranteed'],
      teacherTip: "Teach students to recognize when other methods won't work easily."
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "The formula is x equals negative b, plus or minus, the square root of b squared minus four a c, all divided by two a. Each part has meaning. The discriminant, b squared minus four a c, tells us how many solutions exist.",
      visualContent: "Understanding the Formula",
      highlightWords: ['negative b', 'discriminant', 'solutions'],
      teacherTip: "Help students memorize: negative b, plus or minus, square root, b squared minus four a c, over two a."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll be able to apply the quadratic formula confidently, interpret the discriminant to predict the number of solutions, and solve any quadratic equation that appears in your exams.",
      visualContent: "Your Goal Today",
      highlightWords: ['apply', 'confidently', 'solve', 'exams'],
      teacherTip: "Practice with both simple and complex coefficients for mastery."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="The Quadratic Formula"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default QuadraticFormulaIntro;
