'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Circle, Slice, Ruler, Calculator, Trophy } from 'lucide-react';

const CircleGeometryIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Circle,
      narration: "Circles are everywhere - wheels, clocks, coins, pizzas! The radius goes from center to edge. The diameter crosses through the center - it's twice the radius. The circumference is the distance around. Pi connects them all: circumference equals pi times diameter!",
      visualContent: "Radius: center to edge | Diameter: d = 2r | Circumference: C = πd = 2πr",
      highlightWords: ['radius', 'diameter', 'circumference', 'Pi', 'twice the radius'],
      teacherTip: "Bring circular objects to class for students to measure and verify formulas."
    },
    {
      id: 1,
      icon: Slice,
      narration: "A sector is like a pizza slice - bounded by two radii and an arc. The arc length and sector area depend on the central angle. Use the fraction theta over 360 degrees to find what portion of the circle you have. That fraction times the full formula gives you the answer!",
      visualContent: "Sector = (θ/360°) × full circle | Arc = (θ/360°) × 2πr | Area = (θ/360°) × πr²",
      highlightWords: ['sector', 'pizza slice', 'arc', 'central angle', 'theta over 360'],
      teacherTip: "Use actual pizza or pie to demonstrate sectors visually."
    },
    {
      id: 2,
      icon: Ruler,
      narration: "A chord is a line connecting two points on the circle. A segment is the region between a chord and its arc. To find segment area: calculate the sector area, then subtract the triangle area. The perpendicular from center to chord always bisects it!",
      visualContent: "Chord: connects 2 points | Segment = Sector - Triangle",
      highlightWords: ['chord', 'segment', 'sector', 'subtract', 'bisects'],
      teacherTip: "Draw clear diagrams showing the difference between sectors and segments."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Important circle theorems! Angle in a semicircle is always 90 degrees. A tangent meets the radius at 90 degrees at the point of contact. Equal chords are equidistant from the center. These theorems help you find unknown angles and lengths!",
      visualContent: "Semicircle angle = 90° | Tangent ⊥ Radius | Equal chords = Equal distance",
      highlightWords: ['semicircle', '90 degrees', 'tangent', 'equidistant', 'theorems'],
      teacherTip: "Have students discover theorems through construction activities."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE circle questions are guaranteed marks! Calculate circumference, area, arc length, sector area, and segment area. Watch which pi value they specify - usually 22/7 or 3.14. Show all working and include units. You've got this!",
      visualContent: "WASSCE: C, A, Arc, Sector, Segment | Use given π | Show working",
      highlightWords: ['WASSCE', 'circumference', 'area', 'arc', 'sector', 'segment', 'pi value'],
      teacherTip: "Practice with both π = 22/7 and π = 3.14 as WASSCE specifies which to use."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Circle Geometry"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CircleGeometryIntro;
