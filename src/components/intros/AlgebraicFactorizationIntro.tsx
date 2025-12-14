'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Scissors, Grid3X3, Package, Sparkles, Trophy } from 'lucide-react';

const AlgebraicFactorizationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Scissors,
      narration: "Factorization is like reverse multiplication - breaking expressions into pieces that multiply together! Just like 12 equals 3 times 4, we can write x squared plus 5x plus 6 as x plus 2 times x plus 3. Finding these factors is a powerful skill!",
      visualContent: "12 = 3 × 4 | x² + 5x + 6 = (x + 2)(x + 3)",
      highlightWords: ['Factorization', 'reverse multiplication', 'factors', 'multiply together'],
      teacherTip: "Start with numerical factorization before moving to algebraic expressions."
    },
    {
      id: 1,
      icon: Grid3X3,
      narration: "For common factors, look for what every term shares. In 6x squared plus 9x, both terms have 3x in common. Factor it out: 3x times 2x plus 3. Always check by expanding - you should get back your original expression!",
      visualContent: "6x² + 9x = 3x(2x + 3) | Check: 3x × 2x + 3x × 3 = 6x² + 9x ✓",
      highlightWords: ['common factors', 'Factor it out', 'check by expanding'],
      teacherTip: "Teach students to always verify their factorization by expanding."
    },
    {
      id: 2,
      icon: Package,
      narration: "For quadratics like x squared plus bx plus c, find two numbers that multiply to c and add to b. For x squared plus 7x plus 12, we need numbers multiplying to 12 and adding to 7. That's 3 and 4! So it factors as x plus 3 times x plus 4.",
      visualContent: "x² + 7x + 12: Find numbers → ×12, +7 → 3,4 → (x+3)(x+4)",
      highlightWords: ['multiply to c', 'add to b', '3 and 4', 'factors'],
      teacherTip: "Practice finding factor pairs systematically until the method becomes automatic."
    },
    {
      id: 3,
      icon: Sparkles,
      narration: "Special patterns make factoring faster! Difference of squares: a squared minus b squared equals a plus b times a minus b. Perfect square trinomials: a squared plus 2ab plus b squared equals a plus b all squared. Memorize these patterns!",
      visualContent: "a² - b² = (a+b)(a-b) | a² + 2ab + b² = (a+b)²",
      highlightWords: ['Difference of squares', 'Perfect square trinomials', 'patterns'],
      teacherTip: "Use geometric representations (area models) to help visualize these identities."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE uses factorization everywhere! You'll factor expressions, solve quadratic equations, simplify algebraic fractions, and more. When you see a quadratic equal to zero, factor it and set each factor to zero. Factorization is your key to unlocking these marks!",
      visualContent: "WASSCE: Factor → Solve equations → Simplify fractions",
      highlightWords: ['WASSCE', 'solve quadratic equations', 'simplify', 'set each factor to zero'],
      teacherTip: "Connect factorization to solving equations - this is the main application in exams."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Algebraic Factorization"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default AlgebraicFactorizationIntro;
