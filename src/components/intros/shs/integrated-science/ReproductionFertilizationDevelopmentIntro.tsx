'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Heart, Baby, Clock, Stethoscope, Dna } from 'lucide-react';

const ReproductionFertilizationDevelopmentIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Heart,
      narration: "Welcome to the miracle of life! When sperm meets egg, something extraordinary happens - a single cell is created that contains all the information needed to build a complete human being. This moment of fertilization is where every one of us began our journey.",
      visualContent: "Fertilization: Where New Life Begins",
      highlightWords: ['fertilization', 'sperm', 'egg', 'zygote'],
      teacherTip: "Emphasize that fertilization restores the diploid chromosome number: 23 from sperm + 23 from egg = 46 chromosomes."
    },
    {
      id: 1,
      icon: Baby,
      narration: "From that single cell, an incredible transformation begins. Through rapid cell division, the zygote becomes a ball of cells, then implants in the mother's uterus. Over nine months, one cell becomes trillions, forming every organ, tissue, and structure of a new human being.",
      visualContent: "Development: Zygote → Morula → Blastocyst → Fetus",
      highlightWords: ['morula', 'blastocyst', 'implantation', 'fetus'],
      teacherTip: "Use the city building analogy - just as a city is built in stages (foundation, framework, systems), so is the human body developed layer by layer."
    },
    {
      id: 2,
      icon: Stethoscope,
      narration: "The placenta is the lifeline between mother and baby. This remarkable organ delivers oxygen and nutrients, removes waste, produces hormones, and even passes antibodies to protect the newborn. Without it, development would be impossible!",
      visualContent: "The Placenta: Lifeline of the Developing Baby",
      highlightWords: ['placenta', 'umbilical cord', 'nutrients', 'oxygen'],
      teacherTip: "Clarify that maternal and fetal blood never mix directly - exchange happens across thin membranes in the placenta."
    },
    {
      id: 3,
      icon: Clock,
      narration: "Human pregnancy spans nine months divided into three trimesters. The first is most critical as organs form. The second brings rapid growth and movement. The third prepares baby for life outside, with lungs maturing and weight increasing.",
      visualContent: "Pregnancy: Three Trimesters of Growth",
      highlightWords: ['trimester', 'antenatal', 'folic acid', 'development'],
      teacherTip: "Connect to Ghana's free maternal healthcare policy and the importance of antenatal clinic visits for healthy pregnancy outcomes."
    },
    {
      id: 4,
      icon: Dna,
      narration: "Different animals have evolved different strategies. Fish release thousands of eggs into water for external fertilization. Chickens lay eggs with yolk for nourishment. Mammals like us carry developing young inside, connected by a placenta. Each strategy has its advantages!",
      visualContent: "Comparing Development: Oviparous vs Viviparous",
      highlightWords: ['oviparous', 'viviparous', 'external', 'internal'],
      teacherTip: "Use local examples: tilapia farming (external fertilization) vs. cattle rearing (internal fertilization) to show practical applications."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Reproduction: Fertilization and Development"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ReproductionFertilizationDevelopmentIntro;
