'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Atom, Target, Lightbulb, Trophy, FlaskConical } from 'lucide-react';

const NatureAndScopeOfChemistryIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Atom,
      narration: "Welcome to the exciting world of chemistry! Today, we'll discover what chemistry is all about, how it connects to our daily lives in Ghana, and why it's called the 'central science' that bridges all other sciences.",
      visualContent: "Welcome to Chemistry",
      highlightWords: ['chemistry', 'daily lives', 'central science'],
      teacherTip: "Chemistry is everywhere - from cooking kenkey to mining gold. Help students see real-world connections!"
    },
    {
      id: 1,
      icon: Target,
      narration: "Chemistry is the study of matter, its properties, and changes. Understanding chemistry helps us develop new medicines, improve agriculture, process minerals like gold and bauxite, and create solutions to environmental challenges facing Ghana and the world.",
      visualContent: "Why Chemistry Matters",
      highlightWords: ['matter', 'medicines', 'agriculture', 'gold', 'environmental'],
      teacherTip: "Highlight Ghanaian industries: gold mining, cocoa processing, pharmaceuticals - all need chemistry!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "We'll explore the five main branches of chemistry: organic chemistry studying carbon compounds, inorganic chemistry for non-carbon elements, physical chemistry examining energy and reactions, analytical chemistry for testing substances, and biochemistry connecting chemistry to life.",
      visualContent: "What You'll Learn",
      highlightWords: ['five branches', 'organic', 'inorganic', 'physical', 'analytical', 'biochemistry'],
      teacherTip: "Each branch has career opportunities in Ghana - pharmacists, lab technicians, industrial chemists!"
    },
    {
      id: 3,
      icon: FlaskConical,
      narration: "You'll discover how chemistry applies to Ghanaian industries like gold refining, cocoa processing, soap manufacturing, and pharmaceuticals. You'll also learn about famous chemists whose discoveries changed the world, from Lavoisier to Marie Curie.",
      visualContent: "Real-World Applications",
      highlightWords: ['gold refining', 'cocoa processing', 'soap', 'pharmaceuticals', 'famous chemists'],
      teacherTip: "Encourage students to interview local chemists or visit industries to see chemistry in action."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll understand what chemistry is, identify its branches and applications, recognize career opportunities in chemistry, and appreciate how chemistry impacts Ghana's development and your daily life.",
      visualContent: "Your Goal Today",
      highlightWords: ['understand', 'identify', 'career opportunities', 'Ghana', 'daily life'],
      teacherTip: "This foundational lesson sets excitement for the entire Integrated Science course!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Nature and Scope of Chemistry"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default NatureAndScopeOfChemistryIntro;
