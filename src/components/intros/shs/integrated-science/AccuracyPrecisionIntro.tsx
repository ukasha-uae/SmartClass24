'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Target, Crosshair, RefreshCw, Zap, AlertTriangle, Trophy } from 'lucide-react';

const AccuracyPrecisionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Target,
      narration: "Imagine you're measuring the length of a pencil. You try three times and get fifteen centimeters, fifteen point one centimeters, and fourteen point nine centimeters. Are these good measurements? How close are they to the TRUE length? Today, you'll learn the difference between ACCURACY and PRECISION - two concepts every scientist must master!",
      visualContent: "The Quest for Perfect Measurements!",
      highlightWords: ['accuracy', 'precision', 'true length', 'scientist'],
      teacherTip: "Use the archery target analogy throughout - students find it very intuitive for understanding these concepts!"
    },
    {
      id: 1,
      icon: Crosshair,
      narration: "ACCURACY tells us how close a measurement is to the TRUE or ACCEPTED value. Think of archery - accuracy means hitting the bullseye! If a thermometer shows ninety-nine degrees Celsius for boiling water, it's accurate because boiling water is actually one hundred degrees. The closer to the true value, the more accurate!",
      visualContent: "Accuracy: Hitting the Bullseye",
      highlightWords: ['accuracy', 'true value', 'accepted value', 'bullseye', 'accurate'],
      teacherTip: "In Ghana, relate to market scales - an accurate scale shows the true weight of your tomatoes or yam!"
    },
    {
      id: 2,
      icon: RefreshCw,
      narration: "PRECISION tells us how close multiple measurements are TO EACH OTHER. Precise measurements are consistent and reproducible, even if they're not accurate! In archery, precision means all arrows landing close together - they might miss the bullseye, but they're grouped tightly. Precision shows the reliability of your technique!",
      visualContent: "Precision: Consistency Matters",
      highlightWords: ['precision', 'consistent', 'reproducible', 'grouped tightly', 'reliability'],
      teacherTip: "A tailor in Makola market who always measures cloth the same way is precise - even if their ruler is wrong!"
    },
    {
      id: 3,
      icon: Zap,
      narration: "Measurements can be: accurate AND precise - the best! Accurate but not precise - hit the bullseye sometimes. Precise but not accurate - consistent but wrong. Neither accurate nor precise - scattered everywhere! The goal of science is to achieve BOTH high accuracy AND high precision through proper technique and calibrated instruments!",
      visualContent: "The Four Combinations",
      highlightWords: ['accurate AND precise', 'calibrated instruments', 'proper technique'],
      teacherTip: "Draw four archery targets on the board showing each combination - this visual stays with students!"
    },
    {
      id: 4,
      icon: AlertTriangle,
      narration: "Errors affect our measurements! Systematic errors consistently push measurements in one direction - like a ruler that starts at one instead of zero. Random errors vary unpredictably - like shaky hands while measuring. Zero errors occur when instruments don't start at zero. Parallax error happens when you read a scale from an angle instead of eye level!",
      visualContent: "Sources of Error",
      highlightWords: ['systematic errors', 'random errors', 'zero errors', 'parallax error'],
      teacherTip: "Let students experience parallax error by reading a thermometer from different angles - they'll never forget it!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you understand the foundations of quality measurement! You'll learn to distinguish accuracy from precision, identify and minimize errors, report measurements with appropriate significant figures, and evaluate the reliability of experimental data. These skills are essential for every scientist. Let's master measurement!",
      visualContent: "Ready to Measure with Confidence!",
      highlightWords: ['significant figures', 'reliability', 'experimental data', 'master measurement'],
      teacherTip: "Emphasize that WASSCE practical exams test these concepts - students must record measurements properly!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Accuracy and Precision in Measurement"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default AccuracyPrecisionIntro;
