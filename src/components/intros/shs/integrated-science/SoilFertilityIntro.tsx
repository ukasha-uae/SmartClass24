'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Globe, FlaskConical, Sprout, Waves, Shield, Trophy } from 'lucide-react';

const SoilFertilityIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Globe,
      narration: "Welcome to the world beneath our feet! Soil is the foundation of all agriculture - without healthy soil, crops cannot grow, and food security is threatened. Across Ghana and Africa, soil degradation is a growing challenge that affects farmers every day. Today, you'll discover the secrets of soil fertility and how to protect this precious resource for future generations.",
      visualContent: "Soil: Ghana's Hidden Treasure!",
      highlightWords: ['soil', 'foundation', 'agriculture', 'food security', 'degradation', 'fertility'],
      teacherTip: "Ask students if their families farm - many will have stories about good and poor harvests related to soil!"
    },
    {
      id: 1,
      icon: FlaskConical,
      narration: "Fertile soil is a perfect recipe! It contains forty-five percent mineral matter for structure, twenty-five percent water to dissolve nutrients, twenty-five percent air for roots to breathe, and just five percent organic matter - but this small amount is crucial! Plants need three primary nutrients: Nitrogen for green leaves, Phosphorus for strong roots, and Potassium for disease resistance.",
      visualContent: "What Makes Soil Fertile?",
      highlightWords: ['fertile', 'mineral matter', 'water', 'air', 'organic matter', 'nitrogen', 'phosphorus', 'potassium'],
      teacherTip: "Remember NPK - the three numbers on fertilizer bags show nitrogen, phosphorus, and potassium percentages!"
    },
    {
      id: 2,
      icon: Sprout,
      narration: "How do we keep soil healthy? Crop rotation prevents nutrient depletion by growing different crops each season. Adding organic matter like compost and manure feeds the soil. Mulching protects the surface and conserves moisture. Green manure - growing legumes and ploughing them in - adds nitrogen naturally. These practices have been used by Ghanaian farmers for generations!",
      visualContent: "Maintaining Soil Fertility",
      highlightWords: ['crop rotation', 'compost', 'manure', 'mulching', 'green manure', 'legumes', 'nitrogen'],
      teacherTip: "Groundnuts and cowpea fix nitrogen - that's why farmers rotate them with maize in Northern Ghana!"
    },
    {
      id: 3,
      icon: Waves,
      narration: "Soil erosion is Ghana's silent crisis! Water erosion starts with splash erosion from raindrops, becomes sheet erosion removing thin layers, forms rills or small channels, and finally creates gullies - deep trenches that destroy farmland. Wind erosion in Northern Ghana during the dry season carries away precious topsoil. Once soil is gone, it takes hundreds of years to form again!",
      visualContent: "The Danger of Soil Erosion",
      highlightWords: ['erosion', 'splash erosion', 'sheet erosion', 'rills', 'gullies', 'wind erosion', 'hundreds of years'],
      teacherTip: "Show photos of gully erosion in Ghana - students are shocked to see how land can be destroyed!"
    },
    {
      id: 4,
      icon: Shield,
      narration: "We can fight back against erosion! Contour farming - ploughing across slopes - slows water runoff. Terracing creates step-like platforms on hillsides. Afforestation plants trees whose roots hold soil firmly. Cover crops protect bare ground. In Northern Ghana, farmers use stone bunds and zai pits. In cocoa regions, agroforestry combines trees with crops. Every method helps save our soil!",
      visualContent: "Conservation Methods",
      highlightWords: ['contour farming', 'terracing', 'afforestation', 'cover crops', 'stone bunds', 'zai pits', 'agroforestry'],
      teacherTip: "Local example: Cocoa farmers in Ashanti plant shade trees - this is agroforestry that prevents erosion!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you understand why soil conservation matters! You'll learn about soil composition and nutrients, factors affecting fertility, methods to maintain and improve soil, causes of erosion and degradation, and conservation techniques used across Ghana. Remember: one centimeter of topsoil takes two hundred to one thousand years to form - let's protect this treasure! Let's begin!",
      visualContent: "Ready to Protect Ghana's Soil!",
      highlightWords: ['conservation', 'nutrients', 'fertility', 'erosion', 'degradation', 'one centimeter', 'two hundred'],
      teacherTip: "This topic connects to SDGs (Sustainable Development Goals) - Ghana's commitment to land degradation neutrality!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Soil Fertility and Conservation"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SoilFertilityIntro;
