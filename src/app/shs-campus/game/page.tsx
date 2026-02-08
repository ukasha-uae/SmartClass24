
"use client";
import { useState } from "react";
import MultipleSelect from '@/components/quiz/MultipleSelect';
import Ordering from '@/components/quiz/Ordering';
import Matching from '@/components/quiz/Matching';
import { SHSQuestions } from '@/lib/shs-questions';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSGamePage() {
  const addTenantParam = useTenantLink();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = SHSQuestions[current];

  function handleAnswer(answer: any) {
    setSelected(answer);
    let correct = false;
    if (question.type === 'multiple_select') {
      correct = Array.isArray(answer) && Array.isArray(question.answers) && answer.sort().join(',') === question.answers.sort().join(',');
    } else if (question.type === 'ordering') {
      correct = Array.isArray(answer) && Array.isArray(question.correctOrder) && answer.join(',') === question.correctOrder.join(',');
    } else if (question.type === 'matching') {
      correct = true; // For demo, always true
    } else if (question.type === 'mcq') {
      correct = answer === question.answer;
    }
    if (correct) setScore(score + 1);
    setTimeout(() => {
      if (current < SHSQuestions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 800);
  }

  // Type guards
  type MultipleSelectQuizType = { type: "multiple_select"; options: string[]; answers: string[] };
  type OrderingQuizType = { type: "ordering"; items: string[]; correctOrder: number[] };
  type MatchingQuizType = { type: "matching"; pairs: { left: string; right: string }[] };
  type MCQQuizType = { type: "mcq"; options: string[]; answer: string };

  function isMultipleSelect(q: any): q is MultipleSelectQuizType {
    return q.type === "multiple_select" && Array.isArray(q.options) && Array.isArray(q.answers);
  }
  function isOrdering(q: any): q is OrderingQuizType {
    return q.type === "ordering" && Array.isArray(q.items) && Array.isArray(q.correctOrder);
  }
  function isMatching(q: any): q is MatchingQuizType {
    return q.type === "matching" && Array.isArray(q.pairs);
  }
  function isMCQ(q: any): q is MCQQuizType {
    return q.type === "mcq" && Array.isArray(q.options) && typeof q.answer === "string";
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">SHS Game</h2>
      {!finished ? (
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          {isMultipleSelect(question) && (
            <MultipleSelect quiz={question} userAnswer={selected || []} onAnswerChange={handleAnswer} />
          )}
          {isOrdering(question) && (
            <Ordering quiz={question} userAnswer={selected || []} onAnswerChange={handleAnswer} />
          )}
          {isMatching(question) && (
            <Matching quiz={question} userAnswer={selected || {}} onAnswerChange={handleAnswer} />
          )}
          {isMCQ(question) && (
            <div>
              <p className="mb-4 text-lg font-semibold">{question.question}</p>
              <div className="grid gap-3 mb-4">
                {question.options.map((opt: string) => (
                  <button
                    key={opt}
                    className={`px-4 py-2 rounded border font-medium transition ${selected === opt ? (opt === question.answer ? "bg-green-200" : "bg-red-200") : "bg-muted"}`}
                    disabled={!!selected}
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-muted-foreground">Question {current + 1} of {SHSQuestions.length}</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
          <p className="mb-4">Your score: <span className="font-bold">{score} / {SHSQuestions.length}</span></p>
          <a href={addTenantParam('/shs-campus')} className="text-primary underline">Back to SHS Campus</a>
        </div>
      )}
    </div>
  );
}
