'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { GitBranch, Copy, Dna, Sparkles, Target } from 'lucide-react';

const CellDivisionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: GitBranch,
      narration: "Welcome to the amazing world of cell division! Have you ever wondered how you grew from a single fertilized egg into who you are today? Or how a cut on your skin heals? The answer is cell division - the process by which one cell becomes two. Today we'll explore two types: mitosis for growth and repair, and meiosis for sexual reproduction.",
      visualContent: "Welcome to Cell Division",
      highlightWords: ['cell division', 'mitosis', 'meiosis', 'growth', 'reproduction'],
      teacherTip: "Start with the big question: How did you grow from baby to teenager? Answer: Trillions of cell divisions!"
    },
    {
      id: 1,
      icon: Copy,
      narration: "Mitosis produces two identical daughter cells from one parent cell. It's used for growth, repair of damaged tissues, and replacement of old cells. When you grow taller, when your cut heals, when skin cells are replaced - that's mitosis at work! The process has four main stages: prophase, metaphase, anaphase, and telophase.",
      visualContent: "Mitosis: Making Identical Copies",
      highlightWords: ['mitosis', 'identical', 'growth', 'repair', 'four stages'],
      teacherTip: "Acronym for stages: Please Make Another Two (PMAT). Students love memory tricks!"
    },
    {
      id: 2,
      icon: Dna,
      narration: "Meiosis is special - it produces four different daughter cells, each with half the chromosomes of the parent. This happens only in reproductive organs to make sex cells: sperm in males, eggs in females. When sperm and egg combine during fertilization, the full chromosome number is restored. This is why children look similar to but not identical to parents!",
      visualContent: "Meiosis: Creating Variation",
      highlightWords: ['meiosis', 'half chromosomes', 'sex cells', 'variation', 'fertilization'],
      teacherTip: "Explain: You got 23 chromosomes from mom, 23 from dad = 46 total. That's why you're unique!"
    },
    {
      id: 3,
      icon: Sparkles,
      narration: "Meiosis creates genetic variation through two special events: crossing over (chromosomes exchange segments) and independent assortment (chromosomes randomly separate). This is why siblings from the same parents look different! Genetic variation is crucial for evolution and species survival.",
      visualContent: "Genetic Variation",
      highlightWords: ['genetic variation', 'crossing over', 'independent assortment', 'unique'],
      teacherTip: "Use Ghana context: Why do different varieties of cassava exist? Meiosis and variation!"
    },
    {
      id: 4,
      icon: Target,
      narration: "Understanding cell division is essential for many applications. In medicine, cancer occurs when cell division goes wrong and cells divide uncontrollably. In agriculture, farmers use knowledge of meiosis to crossbreed crops for better yields. In Ghana, this helps produce improved varieties of cocoa, cassava, and rice. You'll master both processes and their importance today!",
      visualContent: "Real-World Applications",
      highlightWords: ['cancer', 'agriculture', 'crossbreeding', 'improved varieties'],
      teacherTip: "Career link: Plant breeders at Crops Research Institute use meiosis principles daily!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Cell Division: Mitosis and Meiosis"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CellDivisionIntro;
