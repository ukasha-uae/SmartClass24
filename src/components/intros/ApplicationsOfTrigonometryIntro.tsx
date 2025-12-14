'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Compass, Ruler, Mountain, Trophy } from 'lucide-react';

const ApplicationsOfTrigonometryIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Compass,
      narration: "Welcome to Applications of Trigonometry! This is where everything comes together. Surveyors, navigators, engineers, and architects all use these techniques daily. Today you'll learn real-world problem solving!",
      visualContent: "Welcome to Applications",
      highlightWords: ['Applications', 'Surveyors', 'navigators', 'engineers', 'architects'],
      teacherTip: "This topic integrates all previous trigonometry knowledge!"
    },
    {
      id: 1,
      icon: Ruler,
      narration: "The Sine Rule and Cosine Rule are your two power tools. Sine rule when you have angles, cosine rule when you have sides and the included angle. Know when to use each one and you'll solve any triangle!",
      visualContent: "Sine & Cosine Rules",
      highlightWords: ['Sine Rule', 'Cosine Rule', 'power tools', 'solve any triangle'],
      teacherTip: "SAS or SSS → Cosine Rule. AAS or ASA → Sine Rule."
    },
    {
      id: 2,
      icon: Mountain,
      narration: "Heights and distances use angles of elevation and depression. Looking UP gives angle of elevation, looking DOWN gives angle of depression. Combined with bearings, you can navigate anywhere!",
      visualContent: "Heights & Bearings",
      highlightWords: ['elevation', 'depression', 'bearings', 'navigate'],
      teacherTip: "Remember: Bearings are always three figures, measured clockwise from North!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "WASSCE application problems are worth ten to twelve marks! Always draw a clear diagram, label everything, show your formula, substitute clearly, and check your answer makes sense. Let's master these applications!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'ten to twelve marks', 'clear diagram', 'check your answer'],
      teacherTip: "Application problems reward systematic working and clear presentation!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Applications of Trigonometry"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ApplicationsOfTrigonometryIntro;
