'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { FileText, Clock, CheckSquare, Brain, Trophy } from 'lucide-react';

const IntegratedWASSCERevisionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: FileText,
      narration: "WASSCE Mathematics has two papers. Paper 1 has 50 multiple choice questions in 90 minutes - that's about 1 minute 48 seconds each! Paper 2 has theory questions: 5 compulsory in Section A, and you choose 5 from 8 in Section B. Total marks: 150. Let's get you ready!",
      visualContent: "Paper 1: 50 MCQ (90 min) | Paper 2: 10 Theory (150 min)",
      highlightWords: ['Paper 1', 'Paper 2', '50 multiple choice', '90 minutes', 'theory'],
      teacherTip: "Create a mock exam schedule to help students experience real timing pressure."
    },
    {
      id: 1,
      icon: Clock,
      narration: "Time management wins exams! In Paper 1, never spend more than 2 minutes on any question. Mark difficult ones and return later. In Paper 2, spend 12 minutes on Section A questions and 18 minutes on Section B. Always leave 10 minutes to check your work!",
      visualContent: "Paper 1: ≤2 min/question | Paper 2A: 12 min | Paper 2B: 18 min",
      highlightWords: ['2 minutes', 'Mark difficult ones', '12 minutes', '18 minutes', 'check'],
      teacherTip: "Practice with a timer during revision sessions to build time awareness."
    },
    {
      id: 2,
      icon: CheckSquare,
      narration: "Examiners award marks for METHOD, not just answers! Write down the formula - that's usually one mark. Show your substitution - another mark. Each step earns points. Even if your final answer is wrong, you can still get 80% of the marks for correct working!",
      visualContent: "Formula: M1 → Substitution: A1 → Working: M1, A1 → Answer: A1",
      highlightWords: ['METHOD', 'formula', 'substitution', 'working', '80% of the marks'],
      teacherTip: "Show students actual mark schemes so they understand how marks are awarded."
    },
    {
      id: 3,
      icon: Brain,
      narration: "The 7 strands you must master: Number and Numeration, Algebra, Geometry, Trigonometry, Statistics and Probability, Vectors, and Problem Solving. Each paper tests ALL strands! Your weakest topic could cost you, so revise everything systematically.",
      visualContent: "7 Strands: Numbers | Algebra | Geometry | Trig | Stats | Vectors | Problems",
      highlightWords: ['7 strands', 'ALL strands', 'weakest topic', 'systematically'],
      teacherTip: "Help students identify their weak strands and allocate more revision time there."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "Success formula: Never leave a question blank - attempt everything for partial marks! Draw clear diagrams, include units, and always verify your answers make sense. Past WASSCE questions often repeat patterns. Practice them and you'll recognize the format. You've got this!",
      visualContent: "Success = Attempt All + Show Working + Check Answers",
      highlightWords: ['Never leave blank', 'partial marks', 'diagrams', 'units', 'patterns'],
      teacherTip: "Build confidence by celebrating progress and showing how past practice leads to success."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Integrated WASSCE Revision"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default IntegratedWASSCERevisionIntro;
