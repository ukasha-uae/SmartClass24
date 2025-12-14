'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { MapPin } from 'lucide-react';

const CoordinateGeometryIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: MapPin,
      narration: "Welcome to Coordinate Geometry! This powerful branch of mathematics merges algebra with geometry, allowing us to solve geometric problems using coordinates and equations. Every point on a plane can be described with just two numbers!",
      visualContent: "Welcome to Coordinate Geometry",
      highlightWords: ['Coordinate Geometry', 'algebra', 'geometry', 'coordinates', 'equations'],
      teacherTip: "Emphasize that this is where algebra meets geometry - a powerful combination!"
    },
    {
      id: 1,
      icon: MapPin,
      narration: "From GPS navigation to video games, coordinate geometry powers our modern world! Maps use latitude and longitude, which are coordinates. Computer graphics rely on pixel coordinates. Every location you see on Google Maps uses these principles!",
      visualContent: "Real-World Applications",
      highlightWords: ['GPS navigation', 'video games', 'latitude', 'longitude', 'Google Maps'],
      teacherTip: "Show a map app - students already use coordinate systems daily!"
    },
    {
      id: 2,
      icon: MapPin,
      narration: "You'll master five essential skills: calculating distances between points, finding midpoints of segments, determining gradients and slopes, writing equations of lines, and understanding parallel and perpendicular relationships. These formulas become your problem-solving toolkit!",
      visualContent: "Key Skills You'll Master",
      highlightWords: ['distances', 'midpoints', 'gradients', 'equations', 'parallel', 'perpendicular'],
      teacherTip: "The distance formula is based on Pythagorean theorem - connect the concepts!"
    },
    {
      id: 3,
      icon: MapPin,
      narration: "Coordinate geometry appears in almost every WASSCE exam! With authentic past questions and step-by-step solutions, you'll master finding line equations, intersection points, and triangle areas using coordinates. Let's begin your journey to exam success!",
      visualContent: "WASSCE Exam Success",
      highlightWords: ['WASSCE exam', 'line equations', 'intersection points', 'triangle areas', 'exam success'],
      teacherTip: "This topic is a WASSCE favorite - thorough mastery pays off!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Coordinate Geometry"
      subject="Core Mathematics SHS3"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CoordinateGeometryIntro;
