'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Compass, PenTool, Circle, Target, Trophy } from 'lucide-react';

const GeometryConstructionsLociIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Compass,
      narration: "Constructions use only a compass and straightedge - no measurements! To bisect a line: draw arcs from both endpoints with the same radius, connect where they intersect. This gives you the exact midpoint and a perpendicular!",
      visualContent: "Tools: compass + straightedge only | Bisect: arcs from both ends",
      highlightWords: ['Constructions', 'compass', 'straightedge', 'bisect', 'perpendicular'],
      teacherTip: "Demonstrate each construction step by step, emphasizing precision."
    },
    {
      id: 1,
      icon: PenTool,
      narration: "To bisect an angle: from the vertex, draw an arc crossing both arms. From those intersection points, draw equal arcs that cross. Connect the vertex to where they meet - that's the angle bisector!",
      visualContent: "Angle bisector: arc from vertex → arcs from crossings → connect",
      highlightWords: ['angle', 'vertex', 'arc', 'angle bisector', 'equal arcs'],
      teacherTip: "Practice on various angle sizes to build confidence with the technique."
    },
    {
      id: 2,
      icon: Circle,
      narration: "A locus is a set of points following a rule! Locus of points equidistant from one point? A circle! Equidistant from two points? The perpendicular bisector! Equidistant from two lines? The angle bisector between them!",
      visualContent: "Locus = path following a rule | Circle, perpendicular bisector, angle bisector",
      highlightWords: ['Locus', 'equidistant', 'circle', 'perpendicular bisector', 'angle bisector'],
      teacherTip: "Have students describe loci in everyday terms before formal definitions."
    },
    {
      id: 3,
      icon: Target,
      narration: "Common loci to know: fixed distance from a line? Two parallel lines! Fixed distance from a point? A circle! Regions satisfying multiple conditions? The intersection of loci! Shade the required region clearly!",
      visualContent: "From line: parallel lines | From point: circle | Multiple: intersection",
      highlightWords: ['fixed distance', 'parallel lines', 'intersection', 'region', 'shade'],
      teacherTip: "Practice combined locus problems that require finding overlapping regions."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves construction questions! Leave all construction arcs visible - don't erase them! Label all points clearly. For locus questions, shade the required region. Use a sharp pencil for accuracy!",
      visualContent: "WASSCE: Keep arcs visible, label points, shade regions, be precise",
      highlightWords: ['WASSCE', 'construction arcs', 'visible', 'label', 'shade', 'precise'],
      teacherTip: "Practice past WASSCE construction questions to understand marking schemes."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Geometry: Constructions & Loci"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default GeometryConstructionsLociIntro;
