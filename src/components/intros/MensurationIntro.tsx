'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Ruler, Square, Box, Circle, Trophy } from 'lucide-react';

const MensurationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Ruler,
      narration: "Mensuration is the mathematics of measurement - perimeter, area, and volume! Perimeter is the distance around a shape. Area measures the space inside a flat shape. Volume measures space inside a 3D object. These skills are used in construction, engineering, and everyday life!",
      visualContent: "Perimeter: Around | Area: Inside (2D) | Volume: Inside (3D)",
      highlightWords: ['Mensuration', 'measurement', 'Perimeter', 'Area', 'Volume'],
      teacherTip: "Use physical objects to demonstrate the difference between perimeter, area, and volume."
    },
    {
      id: 1,
      icon: Square,
      narration: "For 2D shapes, memorize your formulas! Rectangle: area equals length times width. Triangle: area equals half base times height. Parallelogram: area equals base times height. Trapezium: area equals half times the sum of parallel sides times height!",
      visualContent: "Rectangle: A = lw | Triangle: A = ½bh | Trapezium: A = ½(a+b)h",
      highlightWords: ['Rectangle', 'Triangle', 'Parallelogram', 'Trapezium'],
      teacherTip: "Derive formulas visually - show how a parallelogram becomes a rectangle."
    },
    {
      id: 2,
      icon: Circle,
      narration: "Circles need pi! Circumference equals 2 pi r or pi d. Area equals pi r squared. For sectors, multiply by the fraction theta over 360 degrees. Remember: area has r squared, circumference just has r. Don't mix them up!",
      visualContent: "Circle: C = 2πr, A = πr² | Sector: (θ/360°) × formula",
      highlightWords: ['pi', 'Circumference', '2 pi r', 'pi r squared', 'sectors'],
      teacherTip: "A common error is using r² for circumference - emphasize the distinction."
    },
    {
      id: 3,
      icon: Box,
      narration: "For 3D shapes, volume measures how much space is inside. Cuboid: length times width times height. Cylinder: pi r squared times height. Cone: one-third pi r squared h. Sphere: four-thirds pi r cubed. Surface area is the total area of all faces!",
      visualContent: "Cuboid: V = lwh | Cylinder: V = πr²h | Cone: V = ⅓πr²h | Sphere: V = ⁴⁄₃πr³",
      highlightWords: ['volume', 'Cuboid', 'Cylinder', 'Cone', 'Sphere', 'Surface area'],
      teacherTip: "Use actual objects - cans (cylinders), balls (spheres), ice cream cones."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE mensuration questions are guaranteed! You'll calculate areas, volumes, and surface areas. Watch for composite shapes - break them into simpler parts. Always check your units: area in square units, volume in cubic units. Show all working for full marks!",
      visualContent: "WASSCE: Formulas + Composite shapes + Correct units",
      highlightWords: ['WASSCE', 'composite shapes', 'simpler parts', 'units', 'full marks'],
      teacherTip: "Practice composite shapes and unit conversions - common exam challenges."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Mensuration"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default MensurationIntro;
