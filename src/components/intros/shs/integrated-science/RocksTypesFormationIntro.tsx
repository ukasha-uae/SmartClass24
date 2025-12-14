'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Mountain, Flame, Layers, Hammer, Gem } from 'lucide-react';

const RocksTypesFormationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Mountain,
      narration: "Welcome to the fascinating world of rocks and minerals! Look around Ghana - from the rocks beneath Kwame Nkrumah Mausoleum to the granite in our buildings, from gold in Obuasi to diamonds in Akwatia. Today you'll discover how rocks form, the three main types, and why understanding rocks is crucial for Ghana's mining industry and economy.",
      visualContent: "Welcome to Rocks and Minerals",
      highlightWords: ['rocks', 'minerals', 'three types', 'mining', 'Ghana'],
      teacherTip: "Bring real rock samples to class! Students learn best by touching and observing."
    },
    {
      id: 1,
      icon: Flame,
      narration: "Igneous rocks form when molten rock cools and solidifies. If magma cools slowly underground, large crystals form creating rocks like granite. If lava cools quickly on the surface, small crystals form creating rocks like basalt. These are the 'fire-born' rocks, the original rocks of Earth. Ghana has beautiful granite formations used in construction!",
      visualContent: "Igneous Rocks: Born from Fire",
      highlightWords: ['igneous', 'molten rock', 'granite', 'basalt', 'crystals'],
      teacherTip: "Show photos of Kwame Nkrumah Memorial granite. Ask: Why are some rocks speckled (large crystals)?"
    },
    {
      id: 2,
      icon: Layers,
      narration: "Sedimentary rocks form from layers of sediment that pile up, compact, and cement together over millions of years. Sand becomes sandstone. Mud becomes shale. Dead sea creatures become limestone. These rocks often contain fossils and form in layers. Look for them near rivers and coasts! Ghana's offshore oil deposits are in sedimentary rocks.",
      visualContent: "Sedimentary Rocks: Layer by Layer",
      highlightWords: ['sedimentary', 'layers', 'sandstone', 'limestone', 'fossils'],
      teacherTip: "Demo: Press clay or sand layers together. That's how sedimentary rocks form, but over millions of years!"
    },
    {
      id: 3,
      icon: Hammer,
      narration: "Metamorphic rocks form when existing rocks are changed by intense heat and pressure deep underground, but without melting. Limestone transforms into marble. Shale becomes slate. These rocks often have bands or layers and are very hard. Much of Ghana's gold is found in metamorphic rocks! The heat and pressure that formed them also helped concentrate the gold.",
      visualContent: "Metamorphic Rocks: Transformed by Pressure",
      highlightWords: ['metamorphic', 'heat and pressure', 'marble', 'slate', 'gold'],
      teacherTip: "Ghana gold mines (Obuasi, Tarkwa) extract gold from metamorphic rocks. Economic importance!"
    },
    {
      id: 4,
      icon: Gem,
      narration: "The rock cycle shows how rocks continuously transform from one type to another over millions of years. Igneous rocks weather into sediments, sedimentary rocks get buried and metamorphose, metamorphic rocks melt to form igneous - it's an endless cycle! Understanding this helps geologists find valuable minerals and oil. Today you'll master all three rock types and the amazing rock cycle!",
      visualContent: "The Rock Cycle",
      highlightWords: ['rock cycle', 'transform', 'continuous', 'geologists', 'minerals'],
      teacherTip: "Career connection: Geologists at Ghana's Minerals Commission use this knowledge to find resources!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Types and Formation of Rocks"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default RocksTypesFormationIntro;
