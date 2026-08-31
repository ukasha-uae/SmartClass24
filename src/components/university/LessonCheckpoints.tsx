/**
 * Renders lesson checkpoints (quizzes, fill-in-blank challenges, reflections) with instant feedback.
 * Checkpoint results are local to the session — grading for credit happens via the code-editor validation rules.
 */
'use client';

import { useState } from 'react';
import { CheckCircle2, HelpCircle, MessageSquare } from 'lucide-react';
import { Checkpoint, Question } from '@/types/university';

function QuizCheckpoint({ question }: { question: Question }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <p className="font-medium text-gray-900 mb-3">{question.question}</p>
      <div className="space-y-2">
        {question.options?.map(option => {
          const isSelected = selected === option;
          const isCorrect = option === question.correctAnswer;
          const showState = selected !== null && isSelected;
          return (
            <button
              key={option}
              onClick={() => setSelected(option)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                showState
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 hover:border-green-400'
              } disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{question.explanation}</p>
      )}
    </div>
  );
}

function FillInBlankCheckpoint({ question }: { question: Question }) {
  const blankKeys = Object.keys(question.blanks ?? {});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const isBlankCorrect = (key: string) => {
    const blank = question.blanks?.[key];
    if (!blank) return false;
    const given = (answers[key] ?? '').trim().toLowerCase();
    return given === blank.answer.toLowerCase() || (blank.alternatives ?? []).some(alt => alt.toLowerCase() === given);
  };

  const allCorrect = checked && blankKeys.every(isBlankCorrect);

  // Render the code template, substituting each `_n_` placeholder with an input
  const parts = (question.code ?? '').split(/_(\d+)_/g);

  return (
    <div>
      <p className="font-medium text-gray-900 mb-3">{question.instruction}</p>
      <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap">
        {parts.map((part, idx) => {
          if (idx % 2 === 0) return <span key={idx}>{part}</span>;
          const key = part;
          const correct = checked && isBlankCorrect(key);
          const wrong = checked && !isBlankCorrect(key);
          return (
            <input
              key={idx}
              value={answers[key] ?? ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
              className={`inline-block w-20 mx-1 px-1 rounded text-black text-center ${
                correct ? 'bg-green-300' : wrong ? 'bg-red-300' : 'bg-white'
              }`}
            />
          );
        })}
      </div>
      <button
        onClick={() => setChecked(true)}
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
      >
        Check Answer
      </button>
      {checked && (
        <p className={`mt-3 text-sm rounded-lg p-3 ${allCorrect ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          {allCorrect ? question.explanation : 'Not quite — check the hints and try again.'}
        </p>
      )}
    </div>
  );
}

function CodeCompletionCheckpoint({ question }: { question: Question }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const passed = (question.expectedElements ?? []).every(el => value.toLowerCase().includes(el.toLowerCase()));

  return (
    <div>
      <p className="font-medium text-gray-900 mb-3">{question.instruction}</p>
      <pre className="bg-[#1e1e1e] rounded-lg p-4 text-sm text-gray-100 overflow-x-auto mb-3"><code>{question.template}</code></pre>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Type the missing code here…"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
      />
      <button
        onClick={() => setChecked(true)}
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
      >
        Check Answer
      </button>
      {checked && (
        <p className={`mt-3 text-sm rounded-lg p-3 ${passed ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          {passed ? question.explanation : `Keep going — make sure it includes: ${(question.expectedElements ?? []).join(', ')}`}
        </p>
      )}
    </div>
  );
}

function ReflectionCheckpoint({ prompt }: { prompt: string }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <p className="font-medium text-gray-900 mb-3">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        rows={3}
        placeholder="Write a few sentences…"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <button
        onClick={() => setSaved(true)}
        disabled={!value.trim()}
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
      >
        Save Reflection
      </button>
      {saved && <p className="mt-3 text-sm text-green-700">✅ Saved — nice thinking!</p>}
    </div>
  );
}

export default function LessonCheckpoints({ checkpoints }: { checkpoints: Checkpoint[] }) {
  if (!checkpoints || checkpoints.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 space-y-8">
      <div className="flex items-center space-x-3">
        <HelpCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Checkpoints</h2>
      </div>
      {checkpoints.map(checkpoint => (
        <div key={checkpoint.id} className="border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
          <div className="flex items-center space-x-2 mb-3">
            {checkpoint.type === 'reflection' ? (
              <MessageSquare className="w-4 h-4 text-gray-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            )}
            <h3 className="font-bold text-gray-900">{checkpoint.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{checkpoint.description}</p>

          {checkpoint.type === 'reflection' ? (
            <ReflectionCheckpoint prompt={(checkpoint.content as { prompt: string }).prompt} />
          ) : (checkpoint.content as Question).type === 'multiple-choice' ? (
            <QuizCheckpoint question={checkpoint.content as Question} />
          ) : (checkpoint.content as Question).type === 'fill-in-blank' ? (
            <FillInBlankCheckpoint question={checkpoint.content as Question} />
          ) : (checkpoint.content as Question).type === 'code-completion' ? (
            <CodeCompletionCheckpoint question={checkpoint.content as Question} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
