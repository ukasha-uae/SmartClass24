'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Atom, Sparkles, Droplets, FlaskConical, Filter, Trophy } from 'lucide-react';

const ElementsCompoundsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Atom,
      narration: "Look around you - the air you breathe, the water you drink, the gold in jewelry, even your own body! Everything is made of matter. But what is matter made of? Today, you'll discover elements, compounds, and mixtures - the building blocks of our entire universe!",
      visualContent: "The Building Blocks of Everything!",
      highlightWords: ['matter', 'elements', 'compounds', 'mixtures', 'building blocks'],
      teacherTip: "Start with familiar objects - ask students what gold rings, water, and air have in common. They're all matter!"
    },
    {
      id: 1,
      icon: Sparkles,
      narration: "Elements are pure substances made of only ONE type of atom. They cannot be broken down further by chemical means. There are one hundred eighteen known elements! Gold, oxygen, carbon, iron - each has unique properties. Some are metals that conduct electricity, others are gases we breathe!",
      visualContent: "Elements: The Simplest Substances",
      highlightWords: ['elements', 'one type of atom', 'one hundred eighteen', 'gold', 'oxygen', 'carbon', 'iron'],
      teacherTip: "Ghana is rich in gold (Au) and bauxite (Al ore) - connect elements to local mining industry!"
    },
    {
      id: 2,
      icon: Droplets,
      narration: "When elements chemically bond together, they form compounds with completely NEW properties! Water is hydrogen and oxygen combined - two gases become a life-giving liquid! Table salt combines explosive sodium with poisonous chlorine to make something we eat every day. Chemistry is amazing!",
      visualContent: "Compounds: Elements Combined",
      highlightWords: ['compounds', 'chemically bond', 'new properties', 'water', 'hydrogen', 'oxygen', 'salt'],
      teacherTip: "Demonstrate with water (H2O) - students know hydrogen burns and oxygen supports fire, yet water puts out fires!"
    },
    {
      id: 3,
      icon: FlaskConical,
      narration: "Mixtures are different - substances are physically combined, not chemically bonded. Air is a mixture of nitrogen, oxygen, and other gases. Salt water is salt dissolved in water. The components keep their properties and can be separated by physical methods like filtering or evaporating!",
      visualContent: "Mixtures: Physical Combinations",
      highlightWords: ['mixtures', 'physically combined', 'keep their properties', 'separated', 'filtering', 'evaporating'],
      teacherTip: "Make sobolo (hibiscus tea) in class - it's a mixture! The flavor and color can be extracted from the flowers."
    },
    {
      id: 4,
      icon: Filter,
      narration: "We can separate mixtures using physical methods! Filter sand from water. Evaporate water to get salt crystals. Use a magnet to pull iron from sand. Distill sea water to get pure water. These techniques are used every day - from water treatment plants to gold mining in Ghana!",
      visualContent: "Separating Mixtures",
      highlightWords: ['filter', 'evaporate', 'magnet', 'distill', 'water treatment', 'gold mining'],
      teacherTip: "Plan a practical: separate a mixture of sand, salt, and iron filings using different methods!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you're ready to explore the building blocks of matter! You'll learn to identify elements by their symbols, understand how compounds form, distinguish mixtures from compounds, and master separation techniques. This knowledge is fundamental to all of chemistry. Let's begin!",
      visualContent: "Ready to Classify Matter!",
      highlightWords: ['symbols', 'compounds form', 'distinguish', 'separation techniques', 'fundamental'],
      teacherTip: "WASSCE loves classification questions - practice with everyday substances like sugar, air, bronze, and salt!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Elements, Compounds and Mixtures"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ElementsCompoundsIntro;
