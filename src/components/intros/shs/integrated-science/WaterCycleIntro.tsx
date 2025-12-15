'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Droplets, Cloud, CloudRain, Waves, Recycle } from 'lucide-react';

const WaterCycleIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Droplets,
      narration: "Water is life! Every living thing on Earth depends on water. But have you ever wondered how water moves around our planet? The water cycle is nature's incredible recycling system - the same water that dinosaurs drank millions of years ago is the water we drink today!",
      visualContent: "The Water Cycle: Earth's Life Support System",
      highlightWords: ['water cycle', 'recycling', 'life'],
      teacherTip: "Ask students to trace where their drinking water comes from - river, well, or reservoir?"
    },
    {
      id: 1,
      icon: Cloud,
      narration: "The cycle begins with evaporation. When the sun heats water in oceans, lakes, and rivers, water transforms into invisible vapor that rises into the sky. Plants also release water vapor through transpiration - a single large tree can release 200 liters of water daily!",
      visualContent: "Evaporation & Transpiration: Water Rising to the Sky",
      highlightWords: ['evaporation', 'transpiration', 'vapor', 'sun'],
      teacherTip: "Demonstrate evaporation by showing how a wet cloth dries in the sun"
    },
    {
      id: 2,
      icon: CloudRain,
      narration: "As water vapor rises and cools, it condenses into tiny droplets that form clouds. When droplets combine and become heavy, they fall as precipitation - rain in Ghana, or snow in cold countries. The timing of rainfall shapes Ghana's farming seasons!",
      visualContent: "Condensation & Precipitation: Clouds and Rain",
      highlightWords: ['condenses', 'clouds', 'precipitation', 'rain'],
      teacherTip: "Discuss how Ghana's rainy seasons (ITCZ movement) affect farming"
    },
    {
      id: 3,
      icon: Waves,
      narration: "When rain reaches the ground, some water infiltrates into soil to recharge groundwater - the source for wells and boreholes. Some flows as runoff into streams and rivers, eventually returning to the ocean. Ghana's Volta River carries water from across the country to the sea.",
      visualContent: "Infiltration & Runoff: Water Returning to Earth",
      highlightWords: ['infiltrates', 'groundwater', 'runoff', 'rivers', 'Volta'],
      teacherTip: "Explain why boreholes are deeper in dry season - water table drops"
    },
    {
      id: 4,
      icon: Recycle,
      narration: "Human activities are disrupting this ancient cycle. Deforestation reduces rainfall, urbanization causes flooding, and pollution contaminates our water. Understanding the water cycle helps us protect Ghana's water resources for future generations. Let's explore how we can make a difference!",
      visualContent: "Protecting the Water Cycle for Ghana's Future",
      highlightWords: ['deforestation', 'urbanization', 'pollution', 'protect'],
      teacherTip: "Discuss local water issues - flooding in Accra, dry season shortages in the north"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Nutrient Cycles: Water Cycle"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default WaterCycleIntro;
