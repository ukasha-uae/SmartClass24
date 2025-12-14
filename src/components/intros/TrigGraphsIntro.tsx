'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Activity, Waves, SlidersHorizontal, Trophy } from 'lucide-react';

const TrigGraphsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Waves,
      narration: "Welcome to Trigonometric Graphs! These beautiful wave-like curves describe everything from sound waves to tides, from heartbeats to electrical signals. Let's visualize trigonometry!",
      visualContent: "Welcome to Trig Graphs",
      highlightWords: ['Trigonometric Graphs', 'wave-like', 'sound waves', 'tides'],
      teacherTip: "Trig graphs show how sine and cosine values change as the angle increases."
    },
    {
      id: 1,
      icon: Activity,
      narration: "Sine and cosine are smooth waves oscillating between negative one and positive one. Sine starts at zero, cosine starts at its maximum. Both have a period of three hundred sixty degrees and repeat forever!",
      visualContent: "Sine and Cosine Waves",
      highlightWords: ['Sine', 'cosine', 'oscillating', 'period', 'three hundred sixty'],
      teacherTip: "Key difference: sin(0°) = 0 but cos(0°) = 1."
    },
    {
      id: 2,
      icon: SlidersHorizontal,
      narration: "By changing amplitude, period, phase shift, and vertical shift, we can model any periodic phenomenon. Y equals A sine of BX plus C plus D... each letter controls a different transformation!",
      visualContent: "Transformations",
      highlightWords: ['amplitude', 'period', 'phase shift', 'vertical shift', 'transformation'],
      teacherTip: "A = amplitude, B affects period, C = phase shift, D = vertical shift."
    },
    {
      id: 3,
      icon: Trophy,
      narration: "In WASSCE, you'll sketch graphs, identify transformations, and find equations from graphs. Always mark key points: maximum, minimum, and where the curve crosses the axis. Let's master these waves!",
      visualContent: "WASSCE Skills",
      highlightWords: ['WASSCE', 'sketch', 'transformations', 'maximum', 'minimum'],
      teacherTip: "Label amplitude and period clearly on your sketches for full marks!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Graphs of Trigonometric Functions"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TrigGraphsIntro;
