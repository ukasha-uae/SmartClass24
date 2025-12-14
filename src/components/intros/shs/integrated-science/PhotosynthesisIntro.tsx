'use client';

import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Sun, Droplets, Wind, Leaf, Lightbulb, TreeDeciduous } from 'lucide-react';

interface PhotosynthesisIntroProps {
  onComplete?: () => void;
}

export default function PhotosynthesisIntro({ onComplete }: PhotosynthesisIntroProps) {
  const scenes = [
    {
      id: 1,
      icon: Sun,
      title: "The Sun's Gift to Earth",
      narration: "Every single day, the sun showers our beautiful planet with energy! But here's something amazing - only green plants have the incredible power to capture this light and transform it into food! From the tallest odum tree to the smallest blade of grass, plants are performing a miracle right before your eyes. They're taking something you can't eat - sunlight - and turning it into food that powers all life on Earth!",
      visualContent: "☀️ Sun → Light Energy → 🌿 Plants → 🍎 Food for all life!",
      highlightWords: ['sun', 'energy', 'green plants', 'capture', 'light', 'food', 'miracle'],
      teacherTip: "Ask students: What did you eat today? Trace it back to plants and photosynthesis!"
    },
    {
      id: 2,
      icon: Leaf,
      title: "Ghana's Green Factories",
      narration: "From the cocoa trees of Ashanti Region that give us chocolate to export, to the cassava farms of Volta Region feeding our families, to the great mahogany forests of the Western Region - every green plant in Ghana is a tiny factory! Inside every leaf are millions of chloroplasts containing chlorophyll - the green pigment that makes this magic possible. Ghana's agriculture, our economy, our food - it all depends on photosynthesis!",
      visualContent: "🇬🇭 Cocoa, Cassava, Oil Palm, Maize - all powered by photosynthesis! | 🔬 Chloroplasts = tiny factories",
      highlightWords: ['cocoa', 'cassava', 'mahogany', 'chloroplasts', 'chlorophyll', 'green pigment', 'factory'],
      teacherTip: "Bring different leaves to class - all green due to chlorophyll!"
    },
    {
      id: 3,
      icon: Droplets,
      title: "Simple Ingredients, Amazing Results!",
      narration: "What do plants need for photosynthesis? Just three simple things! Water absorbed from the soil through roots - H2O. Carbon dioxide from the air through tiny pores called stomata - CO2. And sunlight energy from above. That's it! From these simple ingredients, plants make glucose - sugar - which is their food! The chemical equation: six CO2 plus six H2O, with light and chlorophyll, makes one glucose and six oxygen molecules!",
      visualContent: "💧 6H₂O + 🌫️ 6CO₂ → ☀️🌿 → 🍬 C₆H₁₂O₆ + 💨 6O₂",
      highlightWords: ['water', 'carbon dioxide', 'sunlight', 'stomata', 'glucose', 'six', 'equation'],
      teacherTip: "Write the equation on board. Students should memorize: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Two Stages of Photosynthesis",
      narration: "Photosynthesis happens in two amazing stages! First, the light-dependent reactions in the thylakoid membranes - chlorophyll absorbs light energy, splits water molecules, and releases oxygen. This produces ATP and NADPH - energy carriers. Second, the light-independent reactions or Calvin cycle in the stroma - using the ATP and NADPH to combine CO2 into glucose! It's like a two-step recipe for making plant food!",
      visualContent: "Stage 1: Thylakoids → Light + H₂O → O₂ + ATP + NADPH | Stage 2: Stroma → CO₂ + ATP → Glucose",
      highlightWords: ['light-dependent', 'thylakoid', 'light-independent', 'Calvin cycle', 'stroma', 'ATP', 'NADPH'],
      teacherTip: "Draw a chloroplast diagram showing where each stage occurs"
    },
    {
      id: 5,
      icon: Wind,
      title: "Oxygen - The Gift of Life!",
      narration: "Here's something incredible - every breath you take exists because of photosynthesis! When plants split water molecules during the light reactions, oxygen is released as a byproduct. Before photosynthesis evolved billions of years ago, Earth had almost no oxygen! Now, thanks to plants, algae, and cyanobacteria, our atmosphere is twenty-one percent oxygen. One large tree produces enough oxygen for four people daily. Forests are our lungs!",
      visualContent: "🌳 Trees → 💨 O₂ for humans | 🌍 21% oxygen in air - all from photosynthesis! | 1 tree = O₂ for 4 people",
      highlightWords: ['oxygen', 'breath', 'byproduct', 'twenty-one percent', 'forests', 'lungs', 'four people'],
      teacherTip: "Calculate: How many trees needed for your school? Great math integration!"
    },
    {
      id: 6,
      icon: TreeDeciduous,
      title: "Why Photosynthesis Matters",
      narration: "All the food you eat - your jollof rice, fufu, grilled tilapia, kontomire stew - ALL of it traces back to photosynthesis! Plants make glucose, then convert it to starch stored in cassava roots, oils in palm fruits, proteins in beans. Animals eat plants, then we eat animals. Even fossil fuels like petrol came from ancient photosynthesis! Plus, photosynthesis removes CO2 from the atmosphere, helping fight climate change. Let's master this amazing process!",
      visualContent: "🍚 All food → from plants → from photosynthesis! | 🌍 Removes CO₂ → fights climate change",
      highlightWords: ['all food', 'jollof', 'fufu', 'starch', 'proteins', 'fossil fuels', 'climate change', 'CO2'],
      teacherTip: "Draw a food chain showing how photosynthesis is at the base of everything!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Photosynthesis: Making Food from Sunlight"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
