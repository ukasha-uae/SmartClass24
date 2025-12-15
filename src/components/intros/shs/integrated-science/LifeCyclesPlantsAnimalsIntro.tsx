'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Sprout, Bug, Droplets, Leaf, Repeat } from 'lucide-react';

const LifeCyclesPlantsAnimalsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Repeat,
      narration: "Life cycles are EVERYWHERE around you! Every living thing on Earth - from the tiniest seed to the largest elephant - goes through a series of changes from birth to death. Today, you'll discover the amazing patterns of life cycles in plants and animals, and learn how this knowledge helps Ghanaian farmers grow better crops and control pests more effectively!",
      visualContent: "The Circle of Life: Understanding Life Cycles",
      highlightWords: ['life cycles', 'birth to death', 'patterns', 'farmers'],
      teacherTip: "Start with local examples students can observe - maize plants, butterflies in the garden, tadpoles in ponds. Connect abstract concepts to concrete observations."
    },
    {
      id: 1,
      icon: Sprout,
      narration: "Let's start with PLANT LIFE CYCLES! A maize seed planted in Ghanaian soil doesn't just grow into a plant overnight. It goes through specific stages: germination when the seed sprouts, growth as roots spread and leaves unfold, flowering when the plant is mature, pollination by wind or insects, and finally seed formation. The new seeds can start the cycle all over again. Understanding this helps farmers know exactly when to plant, water, fertilize, and harvest!",
      visualContent: "Plant Life Cycles: From Seed to Seed",
      highlightWords: ['germination', 'growth', 'flowering', 'pollination', 'seed formation'],
      teacherTip: "Use maize, cassava, or cocoa as familiar examples. Have students track the growth stages of a fast-growing plant like beans over a few weeks."
    },
    {
      id: 2,
      icon: Bug,
      narration: "Now for the AMAZING world of insect life cycles! Some insects undergo COMPLETE METAMORPHOSIS with four totally different stages. Think of a butterfly: it starts as an EGG on a leaf, hatches into a hungry CATERPILLAR that eats constantly, transforms into a PUPA or chrysalis where magic happens inside, and finally emerges as a beautiful ADULT BUTTERFLY! Each stage looks completely different and serves a unique purpose. This is why farmers can target pests at their most vulnerable stage!",
      visualContent: "Complete Metamorphosis: Four Stages of Transformation",
      highlightWords: ['complete metamorphosis', 'egg', 'caterpillar', 'pupa', 'butterfly'],
      teacherTip: "Show images or videos of butterfly metamorphosis. Discuss how this differs from incomplete metamorphosis in grasshoppers where nymphs look like small adults."
    },
    {
      id: 3,
      icon: Droplets,
      narration: "FROGS have one of the most fascinating life cycles! They're AMPHIBIANS, meaning they live both in water and on land. A frog starts as a jellylike EGG in a pond, hatches into a fish-like TADPOLE with a tail and gills, then undergoes METAMORPHOSIS where legs grow, the tail disappears, lungs develop, and it becomes an ADULT FROG that hops on land! This double life helps frogs take advantage of both aquatic and terrestrial environments. In Ghana, frogs are important pest controllers, eating mosquitoes and other insects!",
      visualContent: "Amphibian Life Cycles: From Water to Land",
      highlightWords: ['amphibians', 'egg', 'tadpole', 'metamorphosis', 'adult frog'],
      teacherTip: "Discuss how Ghana's rainy season triggers frog breeding. Connect to ecosystem services - frogs control mosquitoes and indicate environmental health."
    },
    {
      id: 4,
      icon: Leaf,
      narration: "Why should YOU care about life cycles? In AGRICULTURE, knowing when crops flower helps farmers time fertilizer application. Understanding pest life cycles helps target control at the most effective stage - kill mosquito larvae before they become biting adults! In CONSERVATION, protecting endangered animals means protecting their breeding habitats and timing. Even TRADITIONAL GHANAIAN FARMING practices like crop rotation and planting by moon phases are based on understanding life cycle timing. This knowledge is POWER for food security and sustainable development!",
      visualContent: "Life Cycles in Action: Agriculture and Conservation",
      highlightWords: ['agriculture', 'pest control', 'conservation', 'traditional farming', 'food security'],
      teacherTip: "Discuss integrated pest management (IPM) strategies used in Ghana. Have students interview local farmers about their timing practices and connect to life cycle knowledge."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Life Cycles: Plants and Animals"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LifeCyclesPlantsAnimalsIntro;
