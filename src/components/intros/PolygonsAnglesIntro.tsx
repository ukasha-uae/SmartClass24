'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Pentagon, Target, Lightbulb, Trophy } from 'lucide-react';

const PolygonsAnglesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Pentagon,
      narration: "Welcome to Polygons and Angles! From triangular road signs to hexagonal honeycombs, from square tiles to octagonal stop signs, polygons shape our world. Today you'll master the mathematics behind these fascinating shapes!",
      visualContent: "Polygons Everywhere",
      highlightWords: ['Polygons', 'triangular', 'hexagonal', 'square', 'octagonal', 'shape our world'],
      teacherTip: "Polygons are everywhere - help students see math in their daily environment!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Look at a soccer ball - it uses pentagons and hexagons perfectly fitted together! Bees build hexagonal honeycombs because hexagons tessellate efficiently. Architects design buildings with polygonal floor plans. Engineers use polygon mathematics to create strong structures!",
      visualContent: "Real-World Polygons",
      highlightWords: ['soccer ball', 'hexagonal honeycombs', 'tessellate', 'Architects', 'strong structures'],
      teacherTip: "Connect to nature and sports - show why bees choose hexagons!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "You'll master powerful formulas! The sum of interior angles equals n minus two times one hundred eighty degrees. Each exterior angle in a regular polygon is three hundred sixty divided by n. You'll calculate missing angles, find the number of sides, and understand which polygons tessellate. These formulas unlock all polygon problems!",
      visualContent: "The Polygon Formulas",
      highlightWords: ['interior angles', 'exterior angle', 'three hundred sixty', 'tessellate', 'unlock'],
      teacherTip: "The exterior angle sum of 360° is the most elegant theorem - always true!"
    },
    {
      id: 3,
      icon: Trophy,
      narration: "WASSCE polygon questions are worth good marks! You'll practice finding angle sums, calculating each angle in regular polygons, determining the number of sides from given angles, and solving tessellation problems. Master these skills and boost your geometry scores!",
      visualContent: "Your Polygon Mastery",
      highlightWords: ['WASSCE', 'angle sums', 'regular polygons', 'number of sides', 'boost your scores'],
      teacherTip: "Polygon questions appear in EVERY WASSCE exam - essential skills to master!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Polygons and Angles"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default PolygonsAnglesIntro;
