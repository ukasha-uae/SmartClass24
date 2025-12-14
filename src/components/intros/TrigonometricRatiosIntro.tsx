'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Triangle } from 'lucide-react';

const TrigonometricRatiosIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Triangle,
      narration: "Welcome to Trigonometric Ratios! This is where geometry meets algebra in the most powerful way. You'll learn to connect angles to side lengths using sine, cosine, and tangent - tools that engineers, architects, and scientists use every day!",
      visualContent: "Welcome to Trigonometric Ratios",
      highlightWords: ['Trigonometric Ratios', 'sine', 'cosine', 'tangent', 'angles', 'side lengths'],
      teacherTip: "Emphasize SOHCAHTOA - students remember this memory aid forever!"
    },
    {
      id: 1,
      icon: Triangle,
      narration: "From GPS navigation to video game physics, trigonometry powers our modern world! Ships navigate using angles, buildings stand tall with proper calculations, and even your phone uses trig to track your location. These ratios are everywhere!",
      visualContent: "Real-World Applications",
      highlightWords: ['GPS navigation', 'video game physics', 'Ships navigate', 'buildings', 'phone'],
      teacherTip: "Show how surveyors measure building heights without climbing them!"
    },
    {
      id: 2,
      icon: Triangle,
      narration: "You'll master all six trigonometric ratios: sine, cosine, tangent, and their reciprocals. Learn the special angles - 30, 45, and 60 degrees - with exact values. Discover the ASTC rule for angles in any quadrant!",
      visualContent: "Key Skills You'll Master",
      highlightWords: ['six trigonometric ratios', 'special angles', '30, 45, and 60 degrees', 'ASTC rule'],
      teacherTip: "The special angle values appear in almost every WASSCE paper!"
    },
    {
      id: 3,
      icon: Triangle,
      narration: "Trigonometric ratios are WASSCE favorites! With angle of elevation, angle of depression, and shadow problems, you'll solve real challenges. Master these concepts and trigonometry becomes your scoring advantage. Let's begin!",
      visualContent: "WASSCE Exam Success",
      highlightWords: ['WASSCE favorites', 'angle of elevation', 'angle of depression', 'shadow problems'],
      teacherTip: "Practice drawing diagrams - visualization is key to trig success!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Trigonometric Ratios"
      subject="Core Mathematics SHS3"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TrigonometricRatiosIntro;
