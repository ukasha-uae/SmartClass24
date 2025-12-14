'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Dice1, Dice6, GitMerge, Calculator, Trophy } from 'lucide-react';

const ProbabilityCombinedIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Dice1,
      narration: "Probability measures how likely an event is to happen - from 0 for impossible to 1 for certain. The probability formula is favorable outcomes divided by total outcomes. We also write probabilities as fractions, decimals, or percentages. Always simplify your fractions!",
      visualContent: "P(A) = favorable/total | Range: 0 to 1 | Fraction, decimal, %",
      highlightWords: ['Probability', 'likely', '0', '1', 'favorable', 'total outcomes'],
      teacherTip: "Use dice, coins, and cards to demonstrate probability practically."
    },
    {
      id: 1,
      icon: Dice6,
      narration: "Independent events don't affect each other - like flipping a coin twice. For independent events, multiply the probabilities! P of A and B equals P of A times P of B. Each coin flip has the same chances regardless of previous flips. This is the multiplication rule!",
      visualContent: "Independent: P(A and B) = P(A) × P(B) | No influence between events",
      highlightWords: ['Independent', 'multiply', 'A and B', 'P(A) times P(B)'],
      teacherTip: "Demonstrate with multiple coin tosses that each toss is independent."
    },
    {
      id: 2,
      icon: GitMerge,
      narration: "Mutually exclusive events cannot happen together - like rolling a 3 AND a 5 on one die. For mutually exclusive events, add the probabilities! P of A or B equals P of A plus P of B. If events CAN happen together, we must subtract the overlap to avoid counting twice!",
      visualContent: "Exclusive: P(A or B) = P(A) + P(B) | Not exclusive: subtract overlap",
      highlightWords: ['Mutually exclusive', 'cannot happen together', 'add', 'subtract overlap'],
      teacherTip: "Use Venn diagrams to visualize mutually exclusive vs overlapping events."
    },
    {
      id: 3,
      icon: Calculator,
      narration: "With replacement means putting the item back before picking again - probabilities stay the same. Without replacement means not putting it back - the total decreases and probabilities change! This is crucial for picking balls from bags or cards from decks!",
      visualContent: "With replacement: probabilities constant | Without: total decreases",
      highlightWords: ['With replacement', 'Without replacement', 'putting back', 'total decreases'],
      teacherTip: "Use actual bags with colored balls to show the difference physically."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE probability questions often combine these concepts! Read carefully - is it AND or OR? Is it with or without replacement? Draw a tree diagram for sequential events. List all outcomes if needed. Show your formula and calculations clearly. You've mastered this!",
      visualContent: "WASSCE: AND = multiply | OR = add | Tree diagrams help | Show work",
      highlightWords: ['WASSCE', 'AND', 'OR', 'tree diagram', 'replacement'],
      teacherTip: "Practice tree diagrams systematically - they help organize complex problems."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Probability: Combined Events"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ProbabilityCombinedIntro;
