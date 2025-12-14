'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Search, Lightbulb, Cog, CheckCircle, Trophy } from 'lucide-react';

const StructuredProblemSolvingIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Search,
      narration: "The biggest mistake in problem solving? Jumping straight to calculations! Polya's first step is to UNDERSTAND the problem. Read it twice. Ask yourself: What is given? What am I finding? What are the conditions? A clear understanding is half the solution!",
      visualContent: "Step 1: UNDERSTAND → Read twice, identify given & asked",
      highlightWords: ['UNDERSTAND', 'What is given', 'What am I finding'],
      teacherTip: "Have students highlight given information in one color and what's asked in another."
    },
    {
      id: 1,
      icon: Lightbulb,
      narration: "Step two is DEVISE A PLAN. Choose your strategy! Draw a diagram for geometry. Make a table to find patterns. Work backwards when you know the end result. Use equations for algebra problems. The right strategy makes hard problems easy!",
      visualContent: "Step 2: DEVISE A PLAN → Choose your strategy wisely",
      highlightWords: ['DEVISE A PLAN', 'Draw a diagram', 'Work backwards', 'Use equations'],
      teacherTip: "Create a 'strategy menu' poster that students can reference during problem solving."
    },
    {
      id: 2,
      icon: Cog,
      narration: "Step three is CARRY OUT THE PLAN. Now execute your strategy carefully! Write every step clearly - WASSCE examiners award marks for working. Keep track of units. Stay organized. If you get stuck, don't panic - go back to step one and re-read the problem!",
      visualContent: "Step 3: CARRY OUT → Show all working, include units",
      highlightWords: ['CARRY OUT', 'every step clearly', 'award marks', 'units'],
      teacherTip: "Model the importance of neat, organized work that earns method marks."
    },
    {
      id: 3,
      icon: CheckCircle,
      narration: "The secret weapon that many students skip: LOOK BACK! Does your answer make sense? Check it against the original conditions. Did you answer what was asked? A quick two-minute check catches errors that cost marks. Excellent students always verify!",
      visualContent: "Step 4: LOOK BACK → Verify your answer makes sense",
      highlightWords: ['LOOK BACK', 'make sense', 'original conditions', 'verify'],
      teacherTip: "Make verification a habit - not optional. It's where top students earn extra marks."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves word problems! You'll see age problems, work rate problems, mixture problems, and profit-loss calculations. With Polya's four steps, you have a foolproof system. Understand, Plan, Execute, Verify - and watch your scores improve!",
      visualContent: "WASSCE Success: Understand → Plan → Execute → Verify",
      highlightWords: ['WASSCE', 'age problems', 'work rate', 'profit-loss', 'four steps'],
      teacherTip: "Practice with past WASSCE questions to recognize common problem patterns."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Structured Problem-Solving"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default StructuredProblemSolvingIntro;
