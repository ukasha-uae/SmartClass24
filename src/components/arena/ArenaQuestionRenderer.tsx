'use client';

import { useState, useEffect } from 'react';
import { GameQuestion } from '@/lib/challenge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ArenaQuestionRendererProps {
  question: GameQuestion;
  onAnswer: (answer: any) => void;
  selectedAnswer?: any;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

export default function ArenaQuestionRenderer({
  question,
  onAnswer,
  selectedAnswer,
  showResult = false,
  isCorrect = false,
  disabled = false,
}: ArenaQuestionRendererProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Reset input states when question changes - ensure clean state on mobile
  useEffect(() => {
    setInputValue('');
    setSelectedOptions([]);
    // Force a small delay to ensure mobile browsers clear any CSS transitions
    // This prevents visual traces of previous selections
  }, [question.id]);
  
  // Additional effect to handle selectedAnswer changes - ensures mobile compatibility
  useEffect(() => {
    // When selectedAnswer becomes null, ensure all visual states are cleared
    if (selectedAnswer === null || selectedAnswer === undefined) {
      setInputValue('');
      setSelectedOptions([]);
    }
  }, [selectedAnswer]);

  // Multiple Choice
  if (question.type === 'mcq' && question.options) {
    return (
      <div className="space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            // Only show as selected if selectedAnswer is explicitly set and matches
            // This prevents showing previous answer when selectedAnswer is null/undefined
            const isSelected = (selectedAnswer !== null && selectedAnswer !== undefined) && 
                              (selectedAnswer === index || selectedAnswer === option);
            const correctAnswerIndex = typeof question.correctAnswer === 'string' 
              ? question.options.indexOf(question.correctAnswer)
              : -1;
            const isCorrectOption = showResult && (
              index === correctAnswerIndex || 
              option === question.correctAnswer
            );
            const isWrongSelected = showResult && isSelected && !isCorrect;

            return (
              <button
                key={`${question.id}-option-${index}`}
                onClick={() => !disabled && onAnswer(index)}
                disabled={disabled}
                className={`p-4 rounded-xl text-left font-semibold transition-colors duration-200 ${
                  isCorrectOption
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : isWrongSelected
                    ? 'bg-red-500 text-white border-2 border-red-600'
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500'
                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                style={{
                  // Explicitly reset any inline styles that might persist on mobile
                  backgroundColor: isSelected ? undefined : (isCorrectOption ? undefined : (isWrongSelected ? undefined : undefined)),
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // True/False
  if (question.type === 'truefalse') {
    const correctAnswer = question.correctAnswer === 'true' || question.correctAnswer === true;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {question.question}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: true, label: 'True', emoji: '✅', color: 'green' },
            { value: false, label: 'False', emoji: '❌', color: 'red' },
          ].map(({ value, label, emoji, color }) => {
            const isSelected = selectedAnswer === value;
            const isCorrectOption = showResult && value === correctAnswer;
            const isWrongSelected = showResult && isSelected && !isCorrect;

            return (
              <button
                key={String(value)}
                onClick={() => !disabled && onAnswer(value)}
                disabled={disabled}
                className={`p-6 rounded-2xl font-bold transition-all ${
                  isCorrectOption
                    ? 'bg-green-500 text-white border-4 border-green-600 scale-105'
                    : isWrongSelected
                    ? 'bg-red-500 text-white border-4 border-red-600'
                    : isSelected
                    ? 'bg-blue-500 text-white border-4 border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-500'
                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
              >
                <div className="text-5xl mb-2">{emoji}</div>
                <div className="text-2xl">{label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Number Input
  if (question.type === 'number_input') {
    const handleSubmit = () => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onAnswer(numValue);
      }
    };

    const correctAnswerNum = typeof question.correctAnswer === 'number' 
      ? question.correctAnswer 
      : parseFloat(String(question.correctAnswer));

    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={disabled}
              placeholder="Type your answer..."
              className="flex-1 px-4 py-3 text-2xl font-bold text-center rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
            {question.unit && (
              <div className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xl font-semibold text-gray-700 dark:text-gray-300">
                {question.unit}
              </div>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={disabled || !inputValue}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Submit Answer
          </Button>
        </div>
        {showResult && (
          <div className={`p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
            isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>Wrong! Correct answer: {correctAnswerNum}{question.unit ? ` ${question.unit}` : ''}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fill in the Blank
  if (question.type === 'fillblank') {
    const handleSubmit = () => {
      if (inputValue.trim()) {
        onAnswer(inputValue.trim().toLowerCase());
      }
    };

    const correctAnswers = [
      String(question.correctAnswer).toLowerCase(),
      ...(question.alternatives || []).map(a => String(a).toLowerCase())
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={disabled}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 text-xl font-semibold text-center rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-700"
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !inputValue.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Submit Answer
          </Button>
        </div>
        {showResult && (
          <div className={`p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
            isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>Wrong! Correct answer: {String(question.correctAnswer)}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Multiple Select
  if (question.type === 'multiple_select' && question.options) {
    const correctAnswers = question.correctAnswers || (Array.isArray(question.correctAnswer) ? question.correctAnswer : []);
    const correctIndices = correctAnswers.map(ans => 
      question.options!.indexOf(String(ans))
    ).filter(idx => idx !== -1);

    const toggleOption = (index: number) => {
      if (disabled) return;
      
      setSelectedOptions(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index].sort();
        }
      });
    };

    const handleSubmit = () => {
      if (selectedOptions.length > 0) {
        onAnswer(selectedOptions);
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {question.question}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          (Select all correct answers)
        </p>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOptions.includes(index);
            const isCorrectOption = showResult && correctIndices.includes(index);
            const isWrongSelected = showResult && isSelected && !correctIndices.includes(index);

            return (
              <button
                key={index}
                onClick={() => toggleOption(index)}
                disabled={disabled}
                className={`p-4 rounded-xl text-left font-semibold transition-all ${
                  isCorrectOption
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : isWrongSelected
                    ? 'bg-red-500 text-white border-2 border-red-600'
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500'
                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {isSelected && <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={disabled || selectedOptions.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all mt-4"
        >
          Submit Answers
        </Button>
        {showResult && (
          <div className={`p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
            isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>Wrong! Check the correct answers</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-center text-red-600 p-4">
      Unsupported question type: {question.type}
    </div>
  );
}


