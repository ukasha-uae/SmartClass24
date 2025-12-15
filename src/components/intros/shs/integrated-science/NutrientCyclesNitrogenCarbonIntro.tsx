'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Recycle, Wind, TreePine, Factory, Sprout } from 'lucide-react';

const NutrientCyclesNitrogenCarbonIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Recycle,
      narration: "Everything in nature is RECYCLED! The nitrogen in your DNA and the carbon in your body have been cycling through Earth for billions of years. Today you'll discover how these essential nutrients move continuously through air, soil, water, plants, and animals in amazing cycles that make life possible!",
      visualContent: "Nature's Recycling System: Nutrient Cycles",
      highlightWords: ['recycled', 'nitrogen', 'carbon', 'cycling', 'nutrient cycles'],
      teacherTip: "Start by asking students where the atoms in their bodies came from - they've been recycled through countless organisms!"
    },
    {
      id: 1,
      icon: Wind,
      narration: "The NITROGEN CYCLE is essential for life! Seventy-eight percent of air is nitrogen, but plants can't use it directly. Special NITROGEN-FIXING BACTERIA in soil and in root nodules of legumes like cowpea and groundnuts convert atmospheric nitrogen into forms plants can absorb. This is why Ghanaian farmers plant legumes - they naturally enrich the soil with nitrogen!",
      visualContent: "The Nitrogen Cycle: From Air to Life",
      highlightWords: ['nitrogen cycle', 'seventy-eight percent', 'nitrogen-fixing bacteria', 'legumes', 'enrich soil'],
      teacherTip: "Show legume root nodules if possible. Discuss how crop rotation with legumes reduces fertilizer needs in Ghana."
    },
    {
      id: 2,
      icon: TreePine,
      narration: "The CARBON CYCLE connects all living things! Plants absorb carbon dioxide from air during PHOTOSYNTHESIS, storing it as food. When you eat plants or animals, you're consuming carbon. When organisms respire or decompose, carbon returns to the atmosphere as CO-TWO. It's a perfect cycle - oxygen for us, carbon dioxide for plants!",
      visualContent: "The Carbon Cycle: Life's Building Block",
      highlightWords: ['carbon cycle', 'carbon dioxide', 'photosynthesis', 'respire', 'decompose'],
      teacherTip: "Emphasize that carbon cycles quickly (days to years) while some gets locked in fossil fuels for millions of years."
    },
    {
      id: 3,
      icon: Factory,
      narration: "Humans are DISRUPTING these natural cycles! Burning fossil fuels releases carbon that was stored for millions of years, faster than plants can absorb it. This causes CLIMATE CHANGE - in Ghana, we see unpredictable rains, droughts, and floods. Excess fertilizers pollute water. Understanding these cycles helps us find solutions for a sustainable future!",
      visualContent: "Human Impact: Unbalancing the Cycles",
      highlightWords: ['disrupting', 'burning fossil fuels', 'climate change', 'unpredictable rains', 'sustainable'],
      teacherTip: "Connect to local observations - changing rainfall patterns, temperature increases students have noticed in their communities."
    },
    {
      id: 4,
      icon: Sprout,
      narration: "YOU can help restore balance! Plant trees to absorb CO-TWO. Support farmers who rotate crops with legumes instead of using excessive fertilizers. Reduce waste and energy use. Understanding nutrient cycles isn't just science - it's the key to FOOD SECURITY, clean water, and a healthy climate for Ghana's future. The cycles are nature's wisdom - we must work with them, not against them!",
      visualContent: "Solutions: Working with Nature's Cycles",
      highlightWords: ['restore balance', 'plant trees', 'rotate crops', 'food security', 'nature\'s wisdom'],
      teacherTip: "Have students identify local actions: school gardens with legumes, tree planting, composting. Make it actionable!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Nutrient Cycles: Nitrogen and Carbon"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default NutrientCyclesNitrogenCarbonIntro;
