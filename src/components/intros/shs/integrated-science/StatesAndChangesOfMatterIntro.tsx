'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Box, Droplets, Wind, Thermometer, Sparkles } from 'lucide-react';

const StatesAndChangesOfMatterIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Box,
      narration: "Welcome to an exciting journey into the states of matter! Today we'll explore how matter exists in three main states - solid, liquid, and gas - and discover how these states change. From ice blocks melting in the Ghanaian sun to steam rising from boiling water, you'll see these concepts everywhere around you.",
      visualContent: "Welcome to States of Matter",
      highlightWords: ['three states', 'solid', 'liquid', 'gas', 'change'],
      teacherTip: "Use everyday Ghanaian examples - shea butter melting, water boiling for kenkey, clothes drying - to make concepts relatable!"
    },
    {
      id: 1,
      icon: Droplets,
      narration: "Each state of matter has unique properties based on how particles are arranged and move. In solids, particles are packed tightly in fixed positions and only vibrate. In liquids, particles are close but can slide past each other. In gases, particles are very far apart and move freely at high speeds.",
      visualContent: "Particle Arrangement",
      highlightWords: ['particles', 'arranged', 'vibrate', 'slide', 'move freely'],
      teacherTip: "Have students act out particles - standing still for solids, shuffling for liquids, running around for gases!"
    },
    {
      id: 2,
      icon: Thermometer,
      narration: "Matter changes state when energy is added or removed. Heating causes melting (solid to liquid) and evaporation or boiling (liquid to gas). Cooling causes freezing (liquid to solid) and condensation (gas to liquid). We see these changes daily: ice melting, clothes drying, dew forming on grass in the morning.",
      visualContent: "Changes of State",
      highlightWords: ['melting', 'evaporation', 'boiling', 'freezing', 'condensation'],
      teacherTip: "Demonstrate with ice cubes melting or water boiling. Safety first with hot water!"
    },
    {
      id: 3,
      icon: Wind,
      narration: "The water cycle beautifully demonstrates states of matter in action. Water evaporates from the Volta Lake and rivers, rises as gas, condenses to form clouds, falls as rain, and collects back in water bodies. This continuous cycle provides fresh water and supports life across Ghana.",
      visualContent: "The Water Cycle",
      highlightWords: ['water cycle', 'evaporates', 'condenses', 'rain', 'Volta Lake'],
      teacherTip: "Connect to Ghana's rainy seasons and harmattan. Why do clothes dry faster in harmattan?"
    },
    {
      id: 4,
      icon: Sparkles,
      narration: "You'll also learn to distinguish between physical and chemical changes. Physical changes like melting and freezing are reversible - the substance stays the same. Chemical changes like burning wood or cooking fufu create new substances and are usually permanent. This understanding helps in food preservation, cooking, and using materials wisely.",
      visualContent: "Physical vs Chemical Changes",
      highlightWords: ['physical changes', 'chemical changes', 'reversible', 'permanent'],
      teacherTip: "Students often confuse these! Emphasize: same substance = physical, new substance = chemical."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="States and Changes of Matter"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default StatesAndChangesOfMatterIntro;
