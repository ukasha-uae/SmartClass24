'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Circle, Layers, Combine, Calculator, Trophy } from 'lucide-react';

const SetsVennDiagramsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Circle,
      narration: "A set is a collection of distinct objects! We use curly braces: A equals the set containing 1, 2, 3, 4, 5. Elements are the items inside. The universal set U contains everything we're considering. The empty set has no elements at all!",
      visualContent: "A = {1, 2, 3, 4, 5} | ∈ means 'is in' | ∅ = empty set",
      highlightWords: ['set', 'collection', 'elements', 'universal set', 'empty set'],
      teacherTip: "Use real examples: set of students, set of subjects, set of even numbers."
    },
    {
      id: 1,
      icon: Layers,
      narration: "Union combines all elements from both sets - use the symbol cup. A union B includes everything in A or B or both. Intersection finds common elements - use the symbol cap. A intersection B includes only what's in BOTH sets!",
      visualContent: "A ∪ B = all elements | A ∩ B = common elements",
      highlightWords: ['Union', 'cup', 'Intersection', 'cap', 'common', 'both'],
      teacherTip: "Think: Union = 'or' (everything), Intersection = 'and' (overlap)."
    },
    {
      id: 2,
      icon: Combine,
      narration: "Venn diagrams make sets visual! Each circle represents a set. Overlapping regions show intersection. The area outside all circles but inside the rectangle is neither set. Label every region clearly!",
      visualContent: "Circles = sets | Overlap = intersection | Rectangle = universal set",
      highlightWords: ['Venn diagrams', 'circles', 'overlapping', 'intersection', 'regions'],
      teacherTip: "Draw Venn diagrams step by step, labeling each region with its meaning."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "The formula for two sets: n of A union B equals n of A plus n of B minus n of A intersection B. For three sets, add back the triple intersection! Always start from the intersection when filling Venn diagrams!",
      visualContent: "n(A∪B) = n(A) + n(B) - n(A∩B) | Start from center",
      highlightWords: ['formula', 'n(A)', 'n(B)', 'minus', 'intersection', 'center'],
      teacherTip: "Use the formula to find unknown values when given partial information."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves Venn diagram problems! They give you totals and ask for specific regions. Draw the diagram, fill from the center outward, use the formula to check. Show your Venn diagram clearly for full marks!",
      visualContent: "WASSCE: Draw diagram, fill center first, use formula, label all",
      highlightWords: ['WASSCE', 'totals', 'center outward', 'formula', 'full marks'],
      teacherTip: "Practice 2-set and 3-set problems from past WASSCE papers."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Sets and Venn Diagrams"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default SetsVennDiagramsIntro;
