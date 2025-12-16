'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { FlaskConical, Atom, BarChart3, Zap, Palette, Trophy } from 'lucide-react';

const PHScaleIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: FlaskConical,
      narration: "Have you ever bitten into a sour lemon or touched slippery soap? That sour taste and slippery feel tell you something important about chemistry - acids and bases! Today we explore the pH scale, a powerful tool that measures exactly how acidic or basic any substance is. From your stomach acid to the water you drink, pH affects everything in life!",
      visualContent: "The pH Scale: Measuring Acids and Bases!",
      highlightWords: ['sour', 'slippery', 'acids', 'bases', 'pH scale', 'acidic', 'basic'],
      teacherTip: "Bring safe samples: lemon juice (acid), baking soda solution (base) - let students observe the differences!"
    },
    {
      id: 1,
      icon: Atom,
      narration: "What makes acids acidic? Hydrogen ions, written as H plus! Acids release hydrogen ions when dissolved in water. The more hydrogen ions, the stronger the acid. Bases do the opposite - they release hydroxide ions, OH minus, which combine with hydrogen ions. When acids and bases mix completely, they neutralize each other to form water and a salt!",
      visualContent: "The Chemistry of H+ and OH-",
      highlightWords: ['hydrogen ions', 'H plus', 'hydroxide ions', 'OH minus', 'neutralize', 'water', 'salt'],
      teacherTip: "Write the neutralization equation: HCl + NaOH -> NaCl + H2O. Table salt comes from acid-base reactions!"
    },
    {
      id: 2,
      icon: BarChart3,
      narration: "The pH scale runs from zero to fourteen! Zero to six point nine is acidic - battery acid is zero, lemon juice is about two. Exactly seven is neutral - pure water! Seven point one to fourteen is basic or alkaline - soap is about nine, bleach is about thirteen. Here is the amazing part: the scale is logarithmic! Each number is TEN times different from the next.",
      visualContent: "The 0-14 pH Scale",
      highlightWords: ['zero to fourteen', 'acidic', 'neutral', 'seven', 'basic', 'alkaline', 'logarithmic', 'ten times'],
      teacherTip: "Draw a pH scale on the board. pH 4 is 10x more acidic than pH 5, and 100x more acidic than pH 6!"
    },
    {
      id: 3,
      icon: Zap,
      narration: "Why does pH matter? Your blood must stay between seven point three five and seven point four five - even small changes can be fatal! Farmers check soil pH because crops need specific levels - cocoa likes slightly acidic soil. Swimming pools need pH around seven point four. Fish die if pond pH shifts too much. Industries monitor pH constantly!",
      visualContent: "pH in Real Life",
      highlightWords: ['blood', 'seven point three five', 'soil pH', 'cocoa', 'swimming pools', 'fish', 'industries'],
      teacherTip: "Blood pH 7.35-7.45 is tightly regulated. Acidosis and alkalosis are serious medical conditions!"
    },
    {
      id: 4,
      icon: Palette,
      narration: "How do we measure pH? Indicators change color! Litmus paper turns red in acid and blue in base. Universal indicator shows a rainbow of colors across the whole pH range. For precise measurements, we use pH meters with electrodes that detect hydrogen ion concentration electrically. Scientists and engineers rely on accurate pH readings daily!",
      visualContent: "Measuring pH: Indicators and Meters",
      highlightWords: ['indicators', 'litmus paper', 'red', 'blue', 'universal indicator', 'pH meters', 'electrodes'],
      teacherTip: "Test common household items with pH paper: vinegar, soap, soft drinks, antacid tablets!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "Now you are ready to master the pH scale! You will learn to identify acids and bases by their properties, explain how hydrogen ion concentration determines pH, use indicators to test unknown solutions, and understand why pH balance matters in biology, agriculture, and industry. Let us dive into the colorful world of acids and bases!",
      visualContent: "Ready to Master pH!",
      highlightWords: ['identify', 'properties', 'hydrogen ion concentration', 'indicators', 'pH balance', 'biology', 'agriculture'],
      teacherTip: "pH careers: water treatment, food science, medicine, environmental monitoring, chemical engineering!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="The pH Scale"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default PHScaleIntro;
