'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Wheat, Sprout, Tractor, PawPrint, Recycle, Trophy } from 'lucide-react';

const CropAnimalProductionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Wheat,
      narration: "Welcome to the world of agriculture! Did you know that over fifty percent of Ghanaians work in farming? From the cocoa that makes Ghana world-famous to the maize that becomes your banku, agriculture feeds our nation and earns foreign exchange. Today, you'll discover how crops and animals are produced - knowledge that could change your future!",
      visualContent: "Agriculture: The Backbone of Ghana!",
      highlightWords: ['agriculture', 'fifty percent', 'cocoa', 'maize', 'banku', 'foreign exchange'],
      teacherTip: "Ask students what they ate for breakfast - trace each food back to farming. Everything comes from agriculture!"
    },
    {
      id: 1,
      icon: Sprout,
      narration: "Crops are classified by their uses! Cereals like maize, rice, and millet give us energy. Legumes like groundnuts and cowpea provide protein and fix nitrogen in the soil. Root crops like cassava and yam store carbohydrates underground. Cash crops like cocoa earn billions in exports - Ghana is the world's second-largest cocoa producer! Each crop has its role in feeding Ghana.",
      visualContent: "Types of Crops We Grow",
      highlightWords: ['cereals', 'maize', 'legumes', 'groundnuts', 'root crops', 'cassava', 'cash crops', 'cocoa'],
      teacherTip: "Draw a concept map connecting crop types to popular Ghanaian dishes - fufu needs cassava, jollof needs rice!"
    },
    {
      id: 2,
      icon: Tractor,
      narration: "How do we farm? Subsistence farmers grow food for their families on small plots using cutlass and hoe. Commercial farmers use tractors and machines on large plantations for profit - think of Ghana's cocoa and pineapple estates! Mixed farming combines crops and animals - the animals eat crop waste and their manure fertilizes the crops. Smart farming!",
      visualContent: "Farming Systems in Ghana",
      highlightWords: ['subsistence farmers', 'commercial farmers', 'tractors', 'plantations', 'mixed farming', 'manure'],
      teacherTip: "Compare Nsawam pineapple farms (commercial) with village maize plots (subsistence) - different scales, same goal!"
    },
    {
      id: 3,
      icon: PawPrint,
      narration: "Farm animals are grouped by their stomachs! Ruminants like cattle, goats, and sheep have FOUR stomach compartments. They chew cud and can digest grass and hay. Non-ruminants like pigs and chickens have simple stomachs like us. Animals give us meat, milk, eggs, hides for leather, and manure for fertilizer. Even their bones become animal feed!",
      visualContent: "Our Farm Animals",
      highlightWords: ['ruminants', 'cattle', 'goats', 'four stomach', 'non-ruminants', 'pigs', 'chickens', 'manure'],
      teacherTip: "Students love this: cows technically vomit their food and chew it again - that's 'chewing cud' or rumination!"
    },
    {
      id: 4,
      icon: Recycle,
      narration: "What makes farming successful? Climate and rainfall must be right. Soil needs proper nutrients and pH. Pests and diseases must be controlled. Farmers need capital, market access, and government support. Sustainable agriculture protects our future through crop rotation, composting, and agroforestry - growing trees with crops. We must farm wisely for generations to come!",
      visualContent: "Success Factors and Sustainability",
      highlightWords: ['climate', 'rainfall', 'nutrients', 'pests', 'capital', 'sustainable', 'crop rotation', 'agroforestry'],
      teacherTip: "Discuss Planting for Food and Jobs program - government support for Ghanaian farmers is a current topic!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you understand why agriculture matters to Ghana! You'll learn to classify crops and animals, compare farming systems, master cultural practices from planting to harvesting, and appreciate sustainable farming. Whether you become a farmer, scientist, or entrepreneur - this knowledge will serve you. Let's explore the amazing world of crop and animal production!",
      visualContent: "Ready to Become an Agriculture Expert!",
      highlightWords: ['classify', 'farming systems', 'cultural practices', 'sustainable farming', 'entrepreneur'],
      teacherTip: "Agriculture careers are expanding: agribusiness, food science, veterinary medicine, agricultural engineering!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Crop and Animal Production"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CropAnimalProductionIntro;
