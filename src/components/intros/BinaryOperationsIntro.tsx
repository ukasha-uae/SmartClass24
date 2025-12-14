'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Asterisk, Plus, Table, CheckCircle, Trophy } from 'lucide-react';

const BinaryOperationsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Asterisk,
      narration: "A binary operation combines two elements to produce a third. Addition, subtraction, multiplication - these are all binary operations you already know! But we can define NEW operations with symbols like star or circle. The operation table tells us the rules!",
      visualContent: "Binary Operation: a ∗ b = result (combines two elements)",
      highlightWords: ['binary operation', 'combines two elements', 'NEW operations', 'operation table'],
      teacherTip: "Emphasize that 'binary' here means 'two inputs', not base-2 numbers."
    },
    {
      id: 1,
      icon: Table,
      narration: "Operation tables are like multiplication tables but for custom operations. To find a star b, find a in the row header and b in the column header - where they meet is your answer! These tables can define any operation we want.",
      visualContent: "Find a∗b: Row a, Column b → Answer at intersection",
      highlightWords: ['Operation tables', 'row header', 'column header', 'intersection'],
      teacherTip: "Practice reading operation tables before asking students to verify properties."
    },
    {
      id: 2,
      icon: Plus,
      narration: "Operations can have special properties! CLOSURE means the result stays in the set. COMMUTATIVITY means order doesn't matter: a star b equals b star a. ASSOCIATIVITY means grouping doesn't matter: brackets can move around.",
      visualContent: "Closure: result ∈ set | Commutative: a∗b = b∗a | Associative: (a∗b)∗c = a∗(b∗c)",
      highlightWords: ['CLOSURE', 'COMMUTATIVITY', 'ASSOCIATIVITY', 'order', 'grouping'],
      teacherTip: "Use concrete examples: addition is commutative, but subtraction is not."
    },
    {
      id: 3,
      icon: CheckCircle,
      narration: "The IDENTITY element leaves other elements unchanged: a star e equals a. The INVERSE of an element brings you back to identity: a star a-inverse equals e. For addition, identity is 0 and inverse is the negative. For multiplication, identity is 1 and inverse is the reciprocal!",
      visualContent: "Identity: a∗e = a | Inverse: a∗a⁻¹ = e",
      highlightWords: ['IDENTITY', 'unchanged', 'INVERSE', 'back to identity'],
      teacherTip: "Connect to familiar examples: 5 + 0 = 5 (identity), 5 + (-5) = 0 (inverse)."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests you on reading operation tables, finding identity and inverse elements, and checking properties. Sometimes you'll solve equations like a star x equals b. Use the table or the operation definition to find x. These are guaranteed marks!",
      visualContent: "WASSCE: Read tables | Find identity/inverse | Check properties | Solve equations",
      highlightWords: ['WASSCE', 'operation tables', 'identity', 'inverse', 'solve equations'],
      teacherTip: "Drill students on quickly reading operation tables - it's a time-saver in exams."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Binary Operations"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default BinaryOperationsIntro;
