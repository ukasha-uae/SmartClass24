'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Triangle } from 'lucide-react';

const SimilarityCongruenceIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Triangle,
      narration: 'Welcome to Similarity and Congruence! Today we explore shapes that are twins, and shapes that are different sizes but same shape.',
      visualContent: 'Shapes: Twins and Scaled Versions',
      highlightWords: ['twins', 'different sizes', 'same shape'],
      teacherTip: 'Use physical objects - show identical coins (congruent) and photos at different sizes (similar)!'
    },
    {
      id: 1,
      icon: Triangle,
      narration: 'Maps, photographs, and building models all use similarity. Identical parts in machines use congruence. From scaling photos to quality control, these concepts are everywhere.',
      visualContent: 'Real-World Applications',
      highlightWords: ['Maps', 'photographs', 'building models', 'Identical parts', 'quality control'],
      teacherTip: 'Connect to everyday experience - maps must be similar to real terrain!'
    },
    {
      id: 2,
      icon: Triangle,
      narration: 'Master S S S, S A S, A S A tests for congruence! Learn A A similarity and magical ratios: area ratio equals k squared, volume ratio equals k cubed!',
      visualContent: 'Tests and Magical Ratios',
      highlightWords: ['SSS', 'SAS', 'ASA', 'AA', 'k squared', 'k cubed'],
      teacherTip: 'Area ratio = k², Volume ratio = k³ - one of geometry\'s most elegant patterns!'
    },
    {
      id: 3,
      icon: Triangle,
      narration: 'These concepts appear frequently in WASSCE exams! Shadow problems, map scales, and proving triangles similar. Master them all and score high marks. Let us begin!',
      visualContent: 'WASSCE Success Awaits',
      highlightWords: ['WASSCE', 'Shadow problems', 'map scales', 'proving triangles', 'score high marks'],
      teacherTip: 'Shadow problems are classic WASSCE questions - practice setting up similar triangles!'
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Similarity and Congruence"
      subject="Core Mathematics SHS3"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SimilarityCongruenceIntro;
