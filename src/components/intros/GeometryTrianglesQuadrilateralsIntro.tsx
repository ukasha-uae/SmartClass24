'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Triangle, Square, Ruler, Calculator, Trophy } from 'lucide-react';

const GeometryTrianglesQuadrilateralsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Triangle,
      narration: "Triangle angles always sum to 180 degrees! Equilateral triangles have all sides and angles equal - each angle is 60 degrees. Isosceles triangles have two equal sides and two equal base angles. Scalene triangles have no equal sides!",
      visualContent: "Triangle sum = 180° | Equilateral: 60°, 60°, 60° | Isosceles: 2 equal sides/angles",
      highlightWords: ['180 degrees', 'Equilateral', 'Isosceles', 'Scalene', 'base angles'],
      teacherTip: "Cut out a triangle, tear off corners, and arrange them to show they form a straight line."
    },
    {
      id: 1,
      icon: Square,
      narration: "Quadrilaterals have four sides and angles summing to 360 degrees! Squares have all sides equal and all angles 90 degrees. Rectangles have opposite sides equal and all angles 90. Parallelograms have opposite sides equal and parallel!",
      visualContent: "Quadrilateral sum = 360° | Square: all equal, 90° | Rectangle: opposite equal, 90°",
      highlightWords: ['Quadrilaterals', '360 degrees', 'Squares', 'Rectangles', 'Parallelograms'],
      teacherTip: "Use the hierarchy: square → rectangle → parallelogram → quadrilateral."
    },
    {
      id: 2,
      icon: Ruler,
      narration: "More special quadrilaterals! Rhombus has all sides equal but angles not 90. Trapezium has one pair of parallel sides. Kite has two pairs of adjacent equal sides. Know their properties - diagonals, angles, symmetry!",
      visualContent: "Rhombus: equal sides | Trapezium: 1 parallel pair | Kite: adjacent equal",
      highlightWords: ['Rhombus', 'Trapezium', 'Kite', 'diagonals', 'symmetry'],
      teacherTip: "Create a chart comparing properties of all quadrilaterals."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "Exterior angles of any polygon sum to 360 degrees! For regular polygons, each exterior angle equals 360 divided by number of sides. Interior plus exterior equals 180. Sum of interior angles: n minus 2 times 180!",
      visualContent: "Exterior sum = 360° | Interior + Exterior = 180° | Interior sum = (n-2)×180°",
      highlightWords: ['Exterior angles', '360 degrees', 'regular polygons', 'Interior', 'formula'],
      teacherTip: "Walk around a polygon to demonstrate exterior angles summing to 360°."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests angle calculations in polygons! Use the angle sum formula. Find missing angles by subtracting known angles from the sum. Remember properties: isosceles triangles have equal base angles. Show clear working!",
      visualContent: "WASSCE: Angle sums, properties, show working",
      highlightWords: ['WASSCE', 'angle sum', 'missing angles', 'properties', 'working'],
      teacherTip: "Practice finding missing angles in complex diagrams step by step."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Geometry: Triangles & Quadrilaterals"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default GeometryTrianglesQuadrilateralsIntro;
