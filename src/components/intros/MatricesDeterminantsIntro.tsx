'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Grid3x3, Target, Lightbulb, Trophy } from 'lucide-react';

const MatricesDeterminantsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Grid3x3,
      narration: "Welcome to Matrices and Determinants! Imagine organizing data in a neat table, or rotating a 3D game character. That's the power of matrices at work! Matrices organize numbers in rows and columns - they're like super-powered tables that can solve complex problems!",
      visualContent: "Welcome to Matrices",
      highlightWords: ['Matrices', 'Determinants', 'organizing data', 'rotating', '3D game'],
      teacherTip: "Matrices are everywhere - from Google's algorithms to computer graphics in movies!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Matrices appear everywhere - from computer graphics creating stunning visuals in video games and movies, to Google's search algorithms ranking millions of websites, to economists modeling entire economies! They're used in GPS navigation, social networks, and even secret code encryption!",
      visualContent: "Real-World Applications",
      highlightWords: ['computer graphics', 'search algorithms', 'economists', 'GPS', 'encryption'],
      teacherTip: "Connect matrices to students' interests - gaming, social media, and technology!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "You'll master matrix operations - addition, subtraction, and multiplication - plus learn to calculate determinants for both 2 by 2 and 3 by 3 matrices, and find inverse matrices. These powerful skills let you solve systems of equations lightning-fast, much faster than traditional methods!",
      visualContent: "The Skills You'll Master",
      highlightWords: ['operations', 'determinants', 'inverse matrices', 'solve systems', 'lightning-fast'],
      teacherTip: "Emphasize that matrices make solving multiple equations easier - show the efficiency!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "WASSCE exam questions love testing matrices! You'll practice calculating determinants accurately, finding inverse matrices confidently, and solving simultaneous equations using matrix methods. By the end, you'll handle any matrix question with ease. Let's unlock the matrix!",
      visualContent: "Your Matrix Mission",
      highlightWords: ['WASSCE', 'determinants', 'inverse matrices', 'simultaneous equations', 'unlock the matrix'],
      teacherTip: "Matrix questions are worth good marks in WASSCE - master them for exam success!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Matrices and Determinants"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default MatricesDeterminantsIntro;
