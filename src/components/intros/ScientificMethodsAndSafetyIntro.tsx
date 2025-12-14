'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { FlaskConical, Target, Lightbulb, Trophy, ShieldCheck } from 'lucide-react';

const ScientificMethodsAndSafetyIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: FlaskConical,
      narration: "Welcome to the foundation of all scientific investigation! Today, we'll learn the scientific method - the systematic way scientists worldwide, from Ghana to NASA, ask questions, test ideas, and discover new knowledge.",
      visualContent: "Welcome to Scientific Methods",
      highlightWords: ['scientific method', 'systematic way', 'test ideas', 'discover'],
      teacherTip: "The scientific method is used in all sciences. This is a critical foundational skill!"
    },
    {
      id: 1,
      icon: Target,
      narration: "The scientific method gives us a reliable way to answer questions and solve problems through observation, forming hypotheses, conducting experiments, analyzing data, and drawing conclusions. This approach ensures our findings are valid, reproducible, and trustworthy.",
      visualContent: "Why the Scientific Method Matters",
      highlightWords: ['reliable', 'hypotheses', 'experiments', 'data', 'valid', 'reproducible'],
      teacherTip: "Emphasize that science is not guessing - it's systematic testing with evidence!"
    },
    {
      id: 2,
      icon: Lightbulb,
      narration: "We'll master the six steps: observation, questioning, hypothesis formation, experimentation with proper variables, data analysis, and conclusion. You'll learn to identify independent, dependent, and control variables, which is essential for designing fair tests.",
      visualContent: "What You'll Learn",
      highlightWords: ['six steps', 'observation', 'hypothesis', 'variables', 'fair tests'],
      teacherTip: "Use everyday examples: 'Does fertilizer help plants grow?' Students relate better to familiar questions."
    },
    {
      id: 3,
      icon: ShieldCheck,
      narration: "Laboratory safety is absolutely critical! We'll learn essential safety rules, proper use of equipment like beakers, test tubes, and Bunsen burners, understanding hazard symbols, and emergency procedures. Your safety and the safety of others depends on following these rules every time.",
      visualContent: "Safety First - Always!",
      highlightWords: ['safety', 'equipment', 'hazard symbols', 'emergency procedures', 'following rules'],
      teacherTip: "Never compromise on safety! One accident can have lifelong consequences. Demonstrate proper techniques."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "By the end of this lesson, you'll be able to design your own experiments using the scientific method, identify and control variables for fair testing, name and use laboratory equipment correctly, and follow safety protocols to protect yourself and classmates.",
      visualContent: "Your Goal Today",
      highlightWords: ['design experiments', 'control variables', 'laboratory equipment', 'safety protocols'],
      teacherTip: "Hands-on practice is essential. Let students design simple experiments and critique each other's designs."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Scientific Methods and Laboratory Safety"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ScientificMethodsAndSafetyIntro;
