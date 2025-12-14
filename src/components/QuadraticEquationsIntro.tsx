'use client';

import { IntelligentLessonIntro } from './IntelligentLessonIntro';
import { 
  Rocket, 
  Target, 
  Zap, 
  TrendingUp 
} from 'lucide-react';

export function QuadraticEquationsIntro({ onComplete }: { onComplete?: () => void }) {
  const scenes = [
    {
      id: 0,
      icon: Rocket,
      narration: "Welcome to Quadratic Equations! This is one of the most powerful topics in SHS mathematics, and I'm excited to guide you through it. Quadratic equations aren't just math formulas - they're everywhere in the real world!",
      visualContent: "Welcome to Quadratic Equations",
      highlightWords: ['Quadratic Equations', 'powerful', 'real world'],
      teacherTip: "This topic is HUGE for WASSCE - master it and you'll ace those exam questions!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Think about a football player kicking a ball, or an engineer designing a bridge. Both use quadratic equations! When you throw a ball in the air, it follows a curved path called a parabola. That's a quadratic equation in action!",
      visualContent: "Real-World Applications",
      highlightWords: ['football', 'bridge', 'parabola', 'action'],
      teacherTip: "Parabolas are U-shaped curves - you see them in sports, architecture, and even satellite dishes!"
    },
    {
      id: 2,
      icon: Zap,
      narration: "Here's what makes quadratics special: while a linear equation like 2x plus 3 equals 7 has just one solution, a quadratic equation can have two solutions, one repeated solution, or even no real solutions at all! Isn't that fascinating?",
      visualContent: "What Makes Quadratics Special?",
      highlightWords: ['two solutions', 'one', 'no real solutions', 'fascinating'],
      teacherTip: "The number of solutions depends on something called the discriminant - we'll learn that soon!"
    },
    {
      id: 3,
      icon: TrendingUp,
      narration: "In this lesson, you'll learn THREE powerful methods to solve quadratics: factorization for quick solutions, the quadratic formula that works for any equation, and completing the square which helps you understand the structure. By the end, you'll be a quadratic equations master!",
      visualContent: "Three Powerful Methods Await",
      highlightWords: ['THREE', 'factorization', 'quadratic formula', 'completing the square', 'master'],
      teacherTip: "Each method has its strengths - knowing when to use which one is the secret to WASSCE success!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Quadratic Equations"
      subject="Core Mathematics SHS3"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
