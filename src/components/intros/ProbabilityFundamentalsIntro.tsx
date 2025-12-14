'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Dice6, Plus, X, GitBranch, Trophy } from 'lucide-react';

const ProbabilityFundamentalsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Dice6,
      narration: "Welcome to Probability! What are the chances of rolling a six? Getting heads twice in a row? Probability helps us quantify uncertainty - from games to weather forecasts to medical decisions!",
      visualContent: "Probability",
      highlightWords: ['Probability', 'chances', 'quantify uncertainty', 'decisions'],
      teacherTip: "Start with familiar examples like coin tosses, dice rolls, or card draws."
    },
    {
      id: 1,
      icon: Plus,
      narration: "The addition rule tells us P of A or B. For mutually exclusive events, just add them. If they can overlap, subtract the intersection to avoid double counting!",
      visualContent: "Addition Rule",
      highlightWords: ['addition rule', 'A or B', 'mutually exclusive', 'intersection'],
      teacherTip: "Draw Venn diagrams to show why we subtract P(A∩B) for overlapping events."
    },
    {
      id: 2,
      icon: X,
      narration: "The multiplication rule tells us P of A and B. For independent events, just multiply the probabilities. If events are dependent, we need conditional probability - P of B given A!",
      visualContent: "Multiplication Rule",
      highlightWords: ['multiplication rule', 'A and B', 'independent', 'conditional'],
      teacherTip: "Compare drawing WITH replacement (independent) vs WITHOUT replacement (dependent)."
    },
    {
      id: 3,
      icon: GitBranch,
      narration: "Tree diagrams are your best friend! They organize sequential events visually. Multiply along branches for 'and', add across branches for 'or'. Master these and complex problems become simple!",
      visualContent: "Tree Diagrams",
      highlightWords: ['Tree diagrams', 'sequential events', 'multiply', 'add'],
      teacherTip: "Always label branches with probabilities and calculate the final outcomes."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE loves permutations and combinations! Remember: order matters means permutation, order doesn't matter means combination. nPr for arrangements, nCr for selections. Let's master probability!",
      visualContent: "WASSCE Success",
      highlightWords: ['WASSCE', 'permutations', 'combinations', 'order matters'],
      teacherTip: "Use memory trick: Permutation = Position matters, Combination = Committee selection."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Probability Fundamentals"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default ProbabilityFundamentalsIntro;
