'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Mountain, FlaskConical, Layers, Bug, BarChart3, Trophy } from 'lucide-react';

const SoilCompositionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Mountain,
      narration: "Look down at the ground - soil isn't just dirt! It's a complex mixture that took thousands of years to form. Every handful contains billions of organisms and the key to growing food for Ghana's thirty million people. Today, you'll discover what soil is really made of and why it's so important!",
      visualContent: "What's Beneath Our Feet?",
      highlightWords: ['soil', 'complex mixture', 'thousands of years', 'billions of organisms', 'food'],
      teacherTip: "Bring soil samples from different locations - forest soil, sandy soil, and clay soil look and feel very different!"
    },
    {
      id: 1,
      icon: FlaskConical,
      narration: "Soil has four main components - think of it as a recipe! Mineral matter from broken down rocks makes up forty-five percent. Water fills twenty-five percent of the spaces. Air takes another twenty-five percent. And the magic ingredient - organic matter - is just five percent but makes all the difference for fertility!",
      visualContent: "The Four Ingredients of Soil",
      highlightWords: ['four main components', 'mineral matter', 'forty-five percent', 'water', 'air', 'organic matter'],
      teacherTip: "Do a jar test: mix soil with water, shake, and let settle - you'll see layers of sand, silt, and clay!"
    },
    {
      id: 2,
      icon: Layers,
      narration: "The mineral part of soil comes in three sizes. Sand grains are the largest - you can see them! Silt particles are smaller and feel smooth. Clay is so tiny you need a microscope! The perfect mix is called loam - the best soil for farming. Ghana's forest zones have excellent loamy soils for crops like cocoa and maize.",
      visualContent: "Sand, Silt, and Clay",
      highlightWords: ['sand', 'silt', 'clay', 'loam', 'best soil', 'cocoa', 'maize'],
      teacherTip: "Feel test: rub moist soil between fingers - sand is gritty, silt is smooth, clay is sticky and can form ribbons!"
    },
    {
      id: 3,
      icon: Bug,
      narration: "Soil is ALIVE! In one teaspoon of healthy soil, there are more microorganisms than people on Earth! Bacteria break down dead material. Fungi help plant roots absorb nutrients. Earthworms mix and aerate the soil. These tiny workers are essential for keeping soil fertile and healthy.",
      visualContent: "The Living Soil",
      highlightWords: ['alive', 'microorganisms', 'bacteria', 'fungi', 'earthworms', 'fertile', 'healthy'],
      teacherTip: "Dig up some soil and look for earthworms - a sign of healthy soil! No worms often means poor soil health."
    },
    {
      id: 4,
      icon: BarChart3,
      narration: "If you dig deep, you'll see soil forms layers called horizons. The topsoil or A horizon is dark and rich - most roots grow here. Below is the subsoil or B horizon. Deeper still is the C horizon of weathered rock, then solid bedrock. The topsoil took hundreds of years to form - we must protect it!",
      visualContent: "Soil Layers: The Profile",
      highlightWords: ['horizons', 'topsoil', 'A horizon', 'subsoil', 'B horizon', 'bedrock', 'protect'],
      teacherTip: "Find a road cutting or dig site to show students real soil profiles - the color changes are dramatic!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you understand that soil is much more than dirt! You'll learn about the components that make soil fertile, how different soil types affect farming, the amazing creatures living underground, and why protecting topsoil is critical for Ghana's agriculture. Let's dig into soil science!",
      visualContent: "Ready to Explore Soil Science!",
      highlightWords: ['components', 'fertile', 'soil types', 'creatures', 'protecting topsoil', 'agriculture'],
      teacherTip: "Connect to WASSCE: soil composition and profiles are frequently tested - ensure students can draw and label diagrams!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Soil Composition and Importance"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SoilCompositionIntro;
