'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Compass, Triangle, Scale, HelpCircle, Trophy } from 'lucide-react';

const SineCosineRulesIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Compass,
      narration: "You've mastered SOHCAHTOA for right-angled triangles. But what about all those triangles that don't have a right angle? Ships navigating the ocean, surveyors measuring land, engineers designing bridges - they all face triangles without right angles. Today, we unlock the tools to solve ANY triangle.",
      visualContent: "The Limitation of SOHCAHTOA",
      highlightWords: ['SOHCAHTOA', 'right-angled', 'ANY triangle'],
      teacherTip: "The sine and cosine rules extend our toolkit beyond right triangles to solve real-world problems."
    },
    {
      id: 1,
      icon: Triangle,
      narration: "The Sine Rule is elegant and powerful. It says: the ratio of each side to the sine of its opposite angle is the same for all three sides. a over sine A equals b over sine B equals c over sine C. If you know one complete angle-side pair, you can find any other side or angle.",
      visualContent: "The Sine Rule: a/sin A = b/sin B = c/sin C",
      highlightWords: ['Sine Rule', 'opposite angle', 'angle-side pair'],
      teacherTip: "Use the Sine Rule when you have two angles and one side (AAS), or two sides and an opposite angle (SSA)."
    },
    {
      id: 2,
      icon: Scale,
      narration: "The Cosine Rule is a generalization of Pythagoras that works for ALL triangles. a squared equals b squared plus c squared minus two b c cosine A. When you know two sides and the included angle, or all three sides, the Cosine Rule is your tool!",
      visualContent: "The Cosine Rule: a² = b² + c² - 2bc cos A",
      highlightWords: ['Cosine Rule', 'Pythagoras', 'included angle', 'all three sides'],
      teacherTip: "The Cosine Rule is used for SAS (two sides + included angle) or SSS (three sides) configurations."
    },
    {
      id: 3,
      icon: HelpCircle,
      narration: "Here's your decision guide: If you have a complete angle-side pair - meaning an angle and the side opposite it - use the Sine Rule. If you don't have such a pair, use the Cosine Rule. SAS and SSS? Cosine Rule. AAS and ASA? Sine Rule.",
      visualContent: "Choosing the Right Rule",
      highlightWords: ['angle-side pair', 'SAS', 'SSS', 'AAS', 'ASA'],
      teacherTip: "Most exam mistakes come from choosing the wrong rule. Always identify what information you have first."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "These rules appear in almost every WASSCE paper! You'll solve navigation problems with bearings, calculate areas of plots, find distances in surveying problems, and more. Master these rules, and you're ready for any triangle problem the exam throws at you!",
      visualContent: "WASSCE Applications",
      highlightWords: ['WASSCE', 'bearings', 'areas', 'surveying'],
      teacherTip: "Practice drawing clear diagrams and labeling them correctly - this is crucial for exam success."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Sine and Cosine Rules"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SineCosineRulesIntro;
