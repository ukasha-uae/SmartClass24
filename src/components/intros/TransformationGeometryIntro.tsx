'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Move, RotateCw, FlipHorizontal, Maximize2, Trophy } from 'lucide-react';

const TransformationGeometryIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Move,
      narration: "Translation is sliding a shape without rotating or flipping it. Every point moves the same distance in the same direction. We use vectors to describe translations. The vector (a, b) means move 'a' units right and 'b' units up. Negative values mean left or down!",
      visualContent: "Translation = Sliding | Vector (a, b) | Every point moves equally",
      highlightWords: ['Translation', 'sliding', 'vectors', 'same distance', 'same direction'],
      teacherTip: "Have students physically slide cutout shapes on a grid to understand translation."
    },
    {
      id: 1,
      icon: RotateCw,
      narration: "Rotation turns a shape around a fixed point called the center of rotation. You need three things: the center, the angle, and the direction - clockwise or counterclockwise. Common rotations are 90, 180, and 270 degrees. The shape size stays exactly the same!",
      visualContent: "Rotation needs: Center + Angle + Direction | 90°, 180°, 270° common",
      highlightWords: ['Rotation', 'center', 'angle', 'clockwise', 'counterclockwise'],
      teacherTip: "Use tracing paper over a grid - pin at center and rotate to see the effect."
    },
    {
      id: 2,
      icon: FlipHorizontal,
      narration: "Reflection flips a shape over a mirror line. Each point's image is the same distance from the mirror line, but on the opposite side. Common mirror lines are the x-axis, y-axis, and the lines y equals x or y equals negative x!",
      visualContent: "Mirror lines: x-axis, y-axis, y = x, y = -x | Equal distance, opposite side",
      highlightWords: ['Reflection', 'flips', 'mirror line', 'opposite side', 'equal distance'],
      teacherTip: "Use actual mirrors on coordinate grids to help students visualize reflections."
    },
    {
      id: 3,
      icon: Maximize2,
      narration: "Enlargement changes the size of a shape using a center and a scale factor. Scale factor 2 doubles distances from center. Scale factor one-half halves them. Scale factor negative 1 creates an image on the opposite side of the center. Position and size both change!",
      visualContent: "Enlargement: Center + Scale Factor | SF 2 = double | SF ½ = half | SF -1 = flip",
      highlightWords: ['Enlargement', 'center', 'scale factor', 'doubles', 'halves'],
      teacherTip: "Draw rays from center through each vertex to locate enlarged images."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves transformation questions! They often ask for image coordinates, or to identify the transformation given original and image. Remember: translation keeps orientation, reflection flips it, rotation turns it. Always plot points carefully and show your working!",
      visualContent: "WASSCE: Find images, identify transformations, describe fully",
      highlightWords: ['WASSCE', 'image coordinates', 'identify', 'orientation', 'working'],
      teacherTip: "Practice describing transformations fully - center, angle, direction for rotations etc."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Transformation Geometry"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default TransformationGeometryIntro;
