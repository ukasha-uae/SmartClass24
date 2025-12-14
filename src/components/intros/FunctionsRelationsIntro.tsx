'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Network, Target, Lightbulb, Trophy } from 'lucide-react';

const FunctionsRelationsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Network,
      narration: "Welcome to Functions and Relations! This is the foundation of all advanced mathematics. Every time you use your calculator, convert currency, or calculate speed, you're using functions. They're the language mathematics uses to describe relationships!",
      visualContent: "Welcome to Functions and Relations",
      highlightWords: ['Functions', 'Relations', 'foundation', 'relationships'],
      teacherTip: "Functions are tested in nearly every WASSCE math paper - this is essential knowledge!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Think of a function like a vending machine. You put money in, press a button, and you get exactly one snack out. That's the key rule: one input gives exactly one output. We'll learn to spot functions, work with function notation like f of x, and master the golden rule.",
      visualContent: "What Makes a Function Special?",
      highlightWords: ['one input', 'one output', 'function notation', 'golden rule'],
      teacherTip: "The vertical line test is your quick check - one intersection means it's a function!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "You'll discover powerful techniques like composite functions where we combine two functions together, and inverse functions that undo what the original function does. Plus, you'll learn domain and range, which tell us what values we can put in and what we get out.",
      visualContent: "What You'll Master",
      highlightWords: ['composite functions', 'inverse functions', 'domain', 'range'],
      teacherTip: "Composite functions work inside-out, like peeling an onion!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "By the end of this lesson, you'll confidently evaluate functions, find inverses, combine functions through composition, and apply these concepts to WASSCE exam questions. Functions open the door to calculus and university mathematics, so let's master them together!",
      visualContent: "Your Goal Today",
      highlightWords: ['evaluate', 'inverses', 'composition', 'WASSCE'],
      teacherTip: "This topic connects to almost every other math topic - it's that important!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Functions and Relations"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default FunctionsRelationsIntro;
