'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Compass } from 'lucide-react';

const GeometricConstructionsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Compass,
      narration: "Welcome to Geometric Constructions! In this lesson, you'll master the ancient art of creating precise geometric figures using only a compass and straightedge - the same techniques mathematicians have used for over 2000 years!",
      visualContent: "Welcome to Geometric Constructions",
      highlightWords: ['Geometric Constructions', 'compass', 'straightedge', '2000 years'],
      teacherTip: "Connect to history - these methods date back to ancient Greece!"
    },
    {
      id: 1,
      icon: Compass,
      narration: "Geometric constructions aren't just mathematical exercises. These techniques are the foundation of architecture, engineering blueprints, technical drawing, and design. From building layouts to artwork, construction skills create precision in the real world!",
      visualContent: "Real-World Applications",
      highlightWords: ['architecture', 'engineering', 'technical drawing', 'design', 'precision'],
      teacherTip: "Show examples of technical drawings and architectural blueprints!"
    },
    {
      id: 2,
      icon: Compass,
      narration: "You'll learn five essential construction techniques: bisecting angles and line segments, constructing perpendiculars and parallel lines, creating triangles from various conditions, building regular polygons like hexagons and squares, and dividing segments into equal parts. Each construction follows logical steps that guarantee exact results!",
      visualContent: "Key Construction Techniques",
      highlightWords: ['bisecting', 'perpendiculars', 'triangles', 'regular polygons', 'exact results'],
      teacherTip: "Emphasize the logical, step-by-step nature of constructions!"
    },
    {
      id: 3,
      icon: Compass,
      narration: "This lesson includes authentic WASSCE construction problems with complete step-by-step solutions. You'll practice triangles, squares, hexagons, and advanced constructions. Master these techniques and construction questions will become your strength in the WASSCE exam. Let's begin your journey to construction mastery!",
      visualContent: "WASSCE Exam Success",
      highlightWords: ['WASSCE', 'step-by-step', 'triangles', 'squares', 'hexagons', 'construction mastery'],
      teacherTip: "Construction questions are scoring opportunities - master the techniques!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Geometric Constructions"
      subject="Core Mathematics SHS3"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default GeometricConstructionsIntro;
