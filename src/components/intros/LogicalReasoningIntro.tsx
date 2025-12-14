'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Lightbulb, ArrowRight, GitBranch, CheckCircle, Trophy } from 'lucide-react';

const LogicalReasoningIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Lightbulb,
      narration: "Logic is the foundation of mathematical reasoning! A statement is either true or false, never both. 'It is raining' is a statement. 'Is it raining?' is NOT a statement - it's a question! Logic helps us determine truth from given information.",
      visualContent: "Statement: true OR false | Questions are NOT statements",
      highlightWords: ['Logic', 'statement', 'true', 'false', 'reasoning'],
      teacherTip: "Have students identify whether given sentences are statements."
    },
    {
      id: 1,
      icon: ArrowRight,
      narration: "Implication: If P then Q! Written as P implies Q. If it rains, then the ground is wet. P is the hypothesis, Q is the conclusion. Important: P implies Q does NOT mean Q implies P! Wet ground doesn't mean it rained - could be a hose!",
      visualContent: "P → Q (If P then Q) | Hypothesis → Conclusion | Not reversible!",
      highlightWords: ['Implication', 'If P then Q', 'hypothesis', 'conclusion', 'implies'],
      teacherTip: "Use everyday examples: 'If you study, you pass' doesn't mean passing proves studying."
    },
    {
      id: 2,
      icon: GitBranch,
      narration: "Converse swaps P and Q: If Q then P. Inverse negates both: If not P then not Q. Contrapositive negates and swaps: If not Q then not P. Here's the key: original and contrapositive have the same truth value!",
      visualContent: "Converse: Q→P | Inverse: ~P→~Q | Contrapositive: ~Q→~P (same as original!)",
      highlightWords: ['Converse', 'Inverse', 'Contrapositive', 'negates', 'same truth value'],
      teacherTip: "Create a table showing all four forms for a given statement."
    },
    {
      id: 3,
      icon: CheckCircle,
      narration: "Valid arguments follow correct logic! Modus ponens: If P then Q is true, and P is true, then Q must be true. Modus tollens: If P then Q is true, and Q is false, then P must be false. These are the foundations of proof!",
      visualContent: "Modus Ponens: P→Q, P ∴ Q | Modus Tollens: P→Q, ~Q ∴ ~P",
      highlightWords: ['Valid arguments', 'Modus ponens', 'Modus tollens', 'proof'],
      teacherTip: "Practice identifying valid and invalid argument forms."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests logical statements and their variations! Given a statement, find its converse, inverse, and contrapositive. Determine truth values. Use logic in proofs. Clear logical thinking scores high marks!",
      visualContent: "WASSCE: Converse, Inverse, Contrapositive | Truth values | Proofs",
      highlightWords: ['WASSCE', 'logical statements', 'truth values', 'proofs'],
      teacherTip: "Practice with mathematical statements: 'If n is even, then n² is even.'"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Logical Reasoning"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LogicalReasoningIntro;
