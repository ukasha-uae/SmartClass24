'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Compass, Navigation, Map, Ruler, Trophy } from 'lucide-react';

const BearingsScaleDrawingIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Compass,
      narration: "A bearing tells you exactly which direction to go. It's measured in degrees, clockwise from North, and always written as three digits. North is zero-zero-zero, East is zero-nine-zero, South is one-eight-zero, and West is two-seven-zero. Pilots, sailors, and surveyors use bearings every day!",
      visualContent: "Three-Figure Bearings: 000° to 360°",
      highlightWords: ['bearing', 'clockwise from North', 'three digits'],
      teacherTip: "Draw a compass rose and practice calling out bearings for different directions."
    },
    {
      id: 1,
      icon: Navigation,
      narration: "Back bearings are super useful! If someone walks from A to B on bearing 050 degrees, what bearing do they need to return? Simple: add or subtract 180 degrees. So the back bearing is 050 plus 180 equals 230 degrees. If the bearing is 180 or more, subtract instead!",
      visualContent: "Back Bearing = Original ± 180°",
      highlightWords: ['Back bearings', 'add or subtract 180', 'return'],
      teacherTip: "The back bearing rule: if bearing < 180°, add 180°. If bearing ≥ 180°, subtract 180°."
    },
    {
      id: 2,
      icon: Map,
      narration: "Scale drawings represent real distances on paper. A scale of 1 to 50,000 means 1 centimeter on the map equals 50,000 centimeters in real life - that's 500 meters! To find actual distance, multiply map distance by the scale factor.",
      visualContent: "Scale 1:50,000 → 1 cm = 500 m",
      highlightWords: ['Scale', '1 to 50,000', 'multiply', 'scale factor'],
      teacherTip: "Always convert units carefully when working with scale - this is where most errors occur."
    },
    {
      id: 3,
      icon: Ruler,
      narration: "To solve bearing problems, always draw North lines at every point in your diagram. Mark bearings clearly with arrows. Then look for the triangle formed and use trigonometry - often the sine rule or cosine rule from our previous lesson!",
      visualContent: "Draw North Lines → Mark Bearings → Use Trig",
      highlightWords: ['North lines', 'every point', 'triangle', 'sine rule', 'cosine rule'],
      teacherTip: "A clear diagram is half the solution. Take time to draw it accurately."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves bearing problems! You'll calculate distances between towns, find return bearings, convert map distances to real distances, and solve navigation puzzles. Master bearings and scale, and you'll ace these questions!",
      visualContent: "WASSCE Success with Bearings",
      highlightWords: ['WASSCE', 'distances', 'return bearings', 'navigation'],
      teacherTip: "Practice past WASSCE questions - they follow predictable patterns involving two or three locations."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Bearings and Scale Drawing"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default BearingsScaleDrawingIntro;
