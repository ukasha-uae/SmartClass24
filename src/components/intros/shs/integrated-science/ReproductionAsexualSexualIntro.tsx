'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Copy, Split, Heart, Sprout, Dna } from 'lucide-react';

const ReproductionAsexualSexualIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Dna,
      narration: "Life has one fundamental goal - to create more life! Reproduction is nature's way of ensuring species don't disappear. Every living thing, from tiny bacteria to giant elephants, must reproduce to survive. Today we explore the two amazing strategies life uses to continue.",
      visualContent: "Reproduction: The Continuation of Life",
      highlightWords: ['reproduction', 'species', 'survive', 'strategies'],
      teacherTip: "Ask students: How do cassava farmers get new plants? How do humans have children? These are different reproduction methods!"
    },
    {
      id: 1,
      icon: Copy,
      narration: "Asexual reproduction needs only ONE parent and creates exact copies called clones. It's like photocopying! Bacteria split in two, yeast forms buds, and farmers plant cassava cuttings - all asexual reproduction. It's fast and efficient, but every offspring is identical.",
      visualContent: "Asexual Reproduction: One Parent, Identical Copies",
      highlightWords: ['asexual', 'one parent', 'clones', 'identical', 'cassava'],
      teacherTip: "Demonstrate with cassava stem - show how each node can produce a new plant"
    },
    {
      id: 2,
      icon: Split,
      narration: "Binary fission, budding, fragmentation, spores, vegetative propagation - nature has many asexual methods! Ghana farmers use these daily: plantain suckers, pineapple crowns, yam tubers. Quick question - why might having all identical plants be risky?",
      visualContent: "Types: Fission, Budding, Fragmentation, Spores, Vegetative",
      highlightWords: ['binary fission', 'budding', 'vegetative propagation', 'suckers'],
      teacherTip: "Discuss the cassava mosaic disease problem - clonal crops are all vulnerable"
    },
    {
      id: 3,
      icon: Heart,
      narration: "Sexual reproduction involves TWO parents combining their genetic material. Sperm meets egg through fertilization, creating offspring that are unique - different from both parents! This mixing creates variation, helping species adapt to changing environments.",
      visualContent: "Sexual Reproduction: Two Parents, Unique Offspring",
      highlightWords: ['sexual', 'two parents', 'fertilization', 'unique', 'variation'],
      teacherTip: "Explain why siblings look different from each other despite having same parents"
    },
    {
      id: 4,
      icon: Sprout,
      narration: "In Ghana, cocoa flowers are pollinated by tiny midges, maize by wind - both sexual reproduction creating seeds. The beauty is that many organisms use BOTH methods! Understanding reproduction helps farmers grow better crops and scientists protect endangered species.",
      visualContent: "Applications: Agriculture, Conservation, Medicine",
      highlightWords: ['pollinated', 'seeds', 'both methods', 'farmers', 'conservation'],
      teacherTip: "Connect to grafting mangoes - using asexual method to preserve sexually-created good varieties"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Reproduction: Asexual and Sexual"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ReproductionAsexualSexualIntro;
