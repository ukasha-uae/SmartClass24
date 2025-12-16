
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useHasMounted } from '@/hooks/use-has-mounted';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, ThumbsUp, XCircle, Loader2, RefreshCw } from "lucide-react";
import { markLessonAsComplete, isLessonCompleted } from "@/lib/user-progress";
import { addQuizScore } from '@/lib/user-progress-quiz';
import { saveLocalQuizAttempt } from '@/lib/local-quiz-attempts';
import { useToast } from "@/hooks/use-toast";
import { useCollection, useDoc, useFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Quiz, McqQuiz, TrueFalseQuiz, MultipleSelectQuiz, FillBlankQuiz, MatchingQuiz, OrderingQuiz, ShortAnswerQuiz, ImageMcqQuiz, QuizStyle } from "@/lib/types";
import MultipleSelect from '@/components/quiz/MultipleSelect';
import Matching from '@/components/quiz/Matching';
import Ordering from '@/components/quiz/Ordering';
import { Progress } from '@/components/ui/progress';
import QuizStyleSelect from '@/components/quiz/QuizStyleSelect';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type LessonCompleteQuizProps = {
  lessonId: string;
  topicSlug: string;
  subjectSlug: string;
  lessonSlug: string;
  localQuizzes?: Quiz[];
};

// Sub-component for Multiple Choice Questions
const McqQuizComponent = ({ quiz, userAnswer, onAnswerChange, style }: { quiz: McqQuiz, userAnswer: string, onAnswerChange: (answer: string) => void, style?: QuizStyle }) => {
  return (
    <RadioGroup value={userAnswer} onValueChange={onAnswerChange}>
      {quiz.options.map((option, index) => (
        <div key={index} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted ${style === 'card' ? 'border border-border p-3 shadow-sm hover:shadow-md' : ''} ${style === 'compact' ? 'p-1 text-sm' : ''}`}>
          <RadioGroupItem value={option} id={`q-option-${index}`} />
          <Label htmlFor={`q-option-${index}`} className="flex-1 cursor-pointer">
            <MarkdownRenderer content={option} />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

// Sub-component for True/False Questions
const TrueFalseQuizComponent = ({ quiz, userAnswer, onAnswerChange, style }: { quiz: TrueFalseQuiz, userAnswer: string, onAnswerChange: (answer: string) => void, style?: QuizStyle }) => {
    return (
        <RadioGroup value={userAnswer} onValueChange={onAnswerChange}>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="true" id="q-option-true" />
                <Label htmlFor="q-option-true" className="flex-1 cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="false" id="q-option-false" />
                <Label htmlFor="q-option-false" className="flex-1 cursor-pointer">False</Label>
            </div>
        </RadioGroup>
    );
};


export default function LessonCompleteQuiz({ lessonId, topicSlug, subjectSlug, lessonSlug, localQuizzes }: LessonCompleteQuizProps) {
  const { firestore, user } = useFirebase();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const isActivityQuiz = lessonId.includes('-activities');
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testReport, setTestReport] = useState<any[] | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<QuizStyle>('classic');
  const hasMounted = useHasMounted();
  const timerRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const handleSubmitQuizRef = useRef<(() => Promise<void>) | null>(null);

  const { toast } = useToast();

  // Memoize default quizzes to prevent infinite loops
  const defaultQuizzes: Quiz[] = useMemo(() => [
    { type: 'mcq', question: 'Which word is a noun?', options: ['run', 'happy', 'table', 'blue'], answer: 'table', explanation: 'Table is a thing — a noun.' },
    { type: 'truefalse', statement: 'A noun can be a person, place, or thing.', answer: 'true' },
    { type: 'fillblank', sentence: 'A ___ is a naming word.', answer: 'noun' }
  ], []);

  const quizzesQuery = useMemo(
    () => (firestore ? collection(firestore, `subjects/${subjectSlug}/topics/${topicSlug}/lessons/${lessonSlug}/quizzes`) : null),
    [firestore, subjectSlug, topicSlug, lessonSlug]
  );
  const { data: quizzes, isLoading: isLoadingQuizzes } = useCollection<Quiz>(quizzesQuery);
  const lessonDocRef = useMemo(() => (firestore ? doc(firestore, `subjects/${subjectSlug}/topics/${topicSlug}/lessons/${lessonSlug}`) : null), [firestore, subjectSlug, topicSlug, lessonSlug]);
  const { data: lessonDoc } = useDoc<any>(lessonDocRef as any);
  
  // Calculate displayed quizzes early so it can be used in effects and handlers
  const displayedQuizzes = useMemo(
    () => (localQuizzes && localQuizzes.length > 0) ? localQuizzes : (quizzes && quizzes.length > 0) ? quizzes : defaultQuizzes,
    [localQuizzes, quizzes, defaultQuizzes]
  );
  
  useEffect(() => {
    setIsCompleted(isLessonCompleted(lessonId));
  }, [lessonId]);

  // Use ref to track if we've set the default style (won't trigger re-renders)
  const hasSetDefaultStyleRef = useRef(false);
  useEffect(() => {
    // If lesson has a defaultQuizStyle, set it as selected style (only once)
    if (lessonDoc && lessonDoc.defaultQuizStyle && !hasSetDefaultStyleRef.current) {
      setSelectedStyle(lessonDoc.defaultQuizStyle as QuizStyle);
      hasSetDefaultStyleRef.current = true;
    }
  }, [lessonDoc]);

  // Track if we've initialized answers to prevent re-initialization loops
  const hasInitializedAnswers = useRef(false);
  
  useEffect(() => {
    // Only initialize if we haven't done so, or if quiz was reset (submitted is false and userAnswers is empty)
    const shouldInitialize = !hasInitializedAnswers.current || (userAnswers.length === 0 && !submitted);
    
    if (displayedQuizzes && shouldInitialize) {
      // Initialize default answers depending on quiz type
      setUserAnswers(displayedQuizzes.map(quiz => {
        switch (quiz.type) {
          case 'mcq':
            return '';
          case 'truefalse':
            return '';
          case 'multiple_select':
            return [] as string[];
          case 'fillblank':
            return '';
          case 'matching':
            return {} as { [key: number]: number };
          case 'ordering':
            return (quiz as OrderingQuiz).items.map((_, i) => i);
          case 'shortanswer':
            return '';
          default:
            return '';
        }
      }));
      hasInitializedAnswers.current = true;
    }
  }, [displayedQuizzes, userAnswers.length, submitted]);

  // Define handlers before they're used in effects
  const handleSubmitQuiz = useCallback(async () => {
    if (!displayedQuizzes) return;
    const report: any[] = [];
    const correctAnswers = displayedQuizzes.reduce((count, quiz, index) => {
      const userAnswer = userAnswers[index];
      let isCorrect = false;
      if (quiz.type === 'mcq') {
        isCorrect = userAnswer?.toString().toLowerCase() === quiz.answer?.toString().toLowerCase();
      } else if (quiz.type === 'truefalse') {
        isCorrect = userAnswer?.toString().toLowerCase() === quiz.answer?.toString().toLowerCase();
      } else if (quiz.type === 'multiple_select' || quiz.type === 'multiselect') {
        // arrays - ignore order
        const userArr = (userAnswer || []) as string[];
        const quizData = quiz as any;
        const correctArr = quizData.correctAnswers || quizData.answers || [];
        isCorrect = userArr.length === correctArr.length && userArr.every(a => correctArr.map((x: string) => x.toLowerCase()).includes(a.toLowerCase()));
      } else if (quiz.type === 'fillblank') {
        const expected = (quiz as FillBlankQuiz).answer;
        isCorrect = (userAnswer || '').toString().trim().toLowerCase() === expected.toString().trim().toLowerCase();
      } else if (quiz.type === 'matching') {
        const correctPairs = (quiz as MatchingQuiz).pairs;
        const userPairs = userAnswer || {};
        // userPairs leftIndex: rightIndex mapping
        isCorrect = correctPairs.every((p, leftIndex) => {
          const rightIndex = userPairs[leftIndex];
          if (rightIndex === undefined) return false;
          return p.right.toLowerCase() === correctPairs[rightIndex].right.toLowerCase() || p.right.toLowerCase() === (correctPairs[rightIndex].right || '').toLowerCase();
        });
      } else if (quiz.type === 'ordering') {
        const order = userAnswer || [] as number[];
        const correctOrder = (quiz as OrderingQuiz).correctOrder || [];
        isCorrect = JSON.stringify(order) === JSON.stringify(correctOrder);
      } else if (quiz.type === 'shortanswer') {
        const expected = (quiz as ShortAnswerQuiz).answer;
        isCorrect = (userAnswer || '').toString().trim().toLowerCase() === expected.toString().trim().toLowerCase();
      }
      // Determine displayable correct answer
      let correctValue: any = '';
      if (quiz.type === 'mcq') correctValue = (quiz as McqQuiz).answer;
      else if (quiz.type === 'truefalse') correctValue = (quiz as TrueFalseQuiz).answer;
      else if (quiz.type === 'multiple_select' || quiz.type === 'multiselect') {
        const quizData = quiz as any;
        correctValue = quizData.correctAnswers || quizData.answers;
      }
      else if (quiz.type === 'fillblank') correctValue = (quiz as FillBlankQuiz).answer;
      else if (quiz.type === 'matching') correctValue = (quiz as MatchingQuiz).pairs.map(p => `${p.left} → ${p.right}`);
      else if (quiz.type === 'ordering') correctValue = (quiz as OrderingQuiz).correctOrder.map(i => (quiz as OrderingQuiz).items[i]);
      else if (quiz.type === 'shortanswer') correctValue = (quiz as ShortAnswerQuiz).answer;

      report.push({
        index,
        type: quiz.type,
        question: ('question' in quiz) ? (quiz as any).question || (quiz as any).statement || (quiz as any).sentence || '' : '',
        userAnswer: userAnswer || null,
        correctAnswer: correctValue,
        isCorrect,
        explanation: (quiz as any).explanation || (quiz as any).reason || null,
      });

      return count + (isCorrect ? 1 : 0);
    }, 0);
    
    setScore(correctAnswers);
    setSubmitted(true);
    setTestReport(report);
    const percentage = Math.round((correctAnswers / (displayedQuizzes.length || 1)) * 100);
    addQuizScore(percentage);
    // Always save a local copy - useful for offline scenarios or migration
    saveLocalQuizAttempt({
      lessonId,
      subjectSlug,
      topicSlug,
      lessonSlug,
      createdAt: new Date().toISOString(),
      scorePercent: percentage,
      rawScore: correctAnswers,
      total: displayedQuizzes.length,
      report,
    });
    if (!user) {
      toast({ title: 'Not signed in', description: 'This attempt is saved locally. Sign in to save to your profile.' });
    }

    // Save attempt to Firestore for authenticated users
    if (firestore && user) {
      try {
        const attemptsRef = collection(firestore, `users/${user.uid}/quizAttempts`);
        await addDoc(attemptsRef, {
          lessonId,
          subjectSlug,
          topicSlug,
          lessonSlug,
          createdAt: serverTimestamp(),
          scorePercent: percentage,
          rawScore: correctAnswers,
          total: displayedQuizzes.length,
          report,
        });
        toast({ title: 'Saved', description: 'Your quiz attempt was saved to your profile.' });
        // If Firestore write succeeded, remove local attempt(s) that match by createdAt & rawScore
        // This is a simple approach - we try to remove entries with same score & total
        // to avoid duplicate entries when migrating later.
        // Note: We use the helper to remove by id if present in attempts (migration will clear them when appropriate).
      } catch (err) {
        console.error('Failed to save quiz attempt to Firestore', err);
        toast({ title: 'Save failed', description: 'Could not save your attempt to the server. Your score will be kept locally.' });
      }
    }

    const passThreshold = Math.ceil(displayedQuizzes.length * 0.6);

    if (correctAnswers >= passThreshold) {
        markLessonAsComplete(lessonId);
        setIsCompleted(true);
        toast({
          title: "Lesson Completed!",
                description: `You passed with ${correctAnswers}/${displayedQuizzes.length} and earned 10 points. Great job!`,
        });
    } else {
       toast({
          title: "Keep Trying!",
          description: `You scored ${correctAnswers}/${displayedQuizzes.length}. Review the lesson and try again.`,
          variant: "destructive",
        });
    }
  }, [displayedQuizzes, userAnswers, lessonId, user, firestore, subjectSlug, topicSlug, lessonSlug, toast]);

  // Store the latest version of handleSubmitQuiz in a ref
  useEffect(() => {
    handleSubmitQuizRef.current = handleSubmitQuiz;
  }, [handleSubmitQuiz]);

  const handleNextQuestion = useCallback(() => {
    if (displayedQuizzes && currentQuestionIndex < displayedQuizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  }, [displayedQuizzes, currentQuestionIndex, handleSubmitQuiz]);
  
  const handleAnswerChange = useCallback((value: any) => {
    if (submitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  }, [submitted, userAnswers, currentQuestionIndex]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    hasInitializedAnswers.current = false; // Reset the flag so answers can be re-initialized
    if(displayedQuizzes) {
      setUserAnswers(new Array(displayedQuizzes.length).fill(""));
    }
    setSubmitted(false);
    setScore(0);
    setShowQuiz(true);
  }

  // Timer effect - don't include handleNextQuestion in deps to avoid infinite loops
  useEffect(() => {
    const currentQuiz = displayedQuizzes?.[currentQuestionIndex];
    if (!currentQuiz || !showQuiz || submitted) return;
    // Resolve visual/rapid to base behaviors
    const resolvedSelectedStyle = selectedStyle === 'visual' ? 'image-first' : selectedStyle;
    // Default per-question time based on style: rapid => 10s, timed => 20s, compact => 35s, classic => 45s
    const perQuestionTime = selectedStyle === 'rapid' ? 10 : resolvedSelectedStyle === 'timed' ? 20 : resolvedSelectedStyle === 'compact' ? 35 : 45;
    if (resolvedSelectedStyle === 'timed' || selectedStyle === 'rapid') {
      setTimeLeft(perQuestionTime);
      if (timerRef.current) { window.clearInterval(timerRef.current); }
      timerRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // Move to next question automatically if not submitted
            (timerRef.current) && window.clearInterval(timerRef.current);
            // Use state update to trigger next question without calling handleNextQuestion
            setCurrentQuestionIndex((prev) => {
              if (displayedQuizzes && prev < displayedQuizzes.length - 1) {
                return prev + 1;
              } else {
                // Last question - submit using ref
                if (handleSubmitQuizRef.current) {
                  handleSubmitQuizRef.current();
                }
                return prev;
              }
            });
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) { window.clearInterval(timerRef.current); }
    };
  }, [selectedStyle, currentQuestionIndex, displayedQuizzes, showQuiz, submitted]);

  const renderQuizComponent = (quiz: Quiz, index: number, style?: QuizStyle) => {
    const commonProps = {
        userAnswer: userAnswers[index],
        onAnswerChange: handleAnswerChange,
    };
    switch (quiz.type) {
      case 'mcq':
        return <McqQuizComponent quiz={quiz} {...commonProps} style={style} />;
      case 'image_mcq':
        const imgQuiz = quiz as ImageMcqQuiz;
        return (
          <div className={`space-y-3 ${style === 'card' ? 'border border-border p-3 rounded-md shadow-sm' : ''}`}>
            {style === 'image-first' && (
              <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded">
                <img src={imgQuiz.imageUrl} alt={imgQuiz.question} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="font-medium text-sm mb-1">{imgQuiz.question}</div>
            <McqQuizComponent quiz={imgQuiz as any} {...commonProps} style={style} />
          </div>
        );
      case 'truefalse':
        return <TrueFalseQuizComponent quiz={quiz} {...commonProps} style={style} />;
      case 'multiselect':
      case 'multiple_select':
        return <MultipleSelect quiz={quiz as MultipleSelectQuiz} userAnswer={userAnswers[index] || []} onAnswerChange={(v) => handleAnswerChange(v)} style={style} />;
      case 'fillblank':
        return (
          <div className={`${style === 'card' ? 'border border-border p-3 rounded-md shadow-sm' : ''}`}>
            <div className="block text-sm mb-2 prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={(quiz as FillBlankQuiz).sentence} />
            </div>
            <input value={userAnswers[index] || ''} onChange={(e) => handleAnswerChange(e.target.value)} className={`w-full rounded border border-border ${style === 'compact' ? 'p-1 text-sm' : 'p-2'}`} />
          </div>
        );
      case 'matching':
        return <Matching quiz={quiz as MatchingQuiz} userAnswer={userAnswers[index] || {}} onAnswerChange={(v) => handleAnswerChange(v)} style={style} />;
      case 'ordering':
        return <Ordering quiz={quiz as OrderingQuiz} userAnswer={userAnswers[index] || []} onAnswerChange={(v) => handleAnswerChange(v)} style={style} />;
      case 'shortanswer':
        return (
          <div className={`${style === 'card' ? 'border border-border p-3 rounded-md shadow-sm' : ''}`}>
            <div className="block text-sm mb-2 prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={(quiz as ShortAnswerQuiz).question} />
            </div>
            <textarea value={userAnswers[index] || ''} onChange={(e) => handleAnswerChange(e.target.value)} className={`w-full rounded border border-border ${style === 'compact' ? 'p-1 text-sm' : 'p-2'}`} rows={3} />
          </div>
        );
      default:
        return <p>Unsupported quiz type.</p>;
    }
  };

  // Subcomponents for matching and ordering
  // Matching, Ordering, Multiple-select are now extracted to separate components

  if (isLoadingQuizzes && !localQuizzes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Quiz...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  if (isCompleted && !showQuiz) {
     return (
       <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-2">
                 <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-green-700 dark:text-green-300">Lesson Completed!</CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">You have already mastered this topic. Well done!</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
             <Button onClick={resetQuiz} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Review Lesson & Quiz
            </Button>
        </CardFooter>
       </Card>
    );
  }


  if (!showQuiz) {
    return (
      <div>
        <div className="mb-2">
          <QuizStyleSelect value={selectedStyle} onChange={(v) => setSelectedStyle(v)} />
        </div>
        <Button onClick={() => setShowQuiz(true)} className="w-full" disabled={!hasMounted}>
        <CheckCircle className="mr-2 h-5 w-5" />
        {isActivityQuiz ? 'Start Practice Questions' : 'Test Your Knowledge to Complete'}
        </Button>
      </div>
    )
  }

  if (submitted) {
    const passThreshold = Math.ceil(displayedQuizzes.length * 0.6);
     const passed = score >= passThreshold;
     return (
        <Card>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center mb-2">
                    {passed ? <ThumbsUp className="h-12 w-12 text-green-500" /> : <XCircle className="h-12 w-12 text-destructive" />}
                </div>
                <CardTitle>{passed ? 'Congratulations!' : 'Nice Try!'}</CardTitle>
                <CardDescription>You scored {score} out of {displayedQuizzes.length}.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4">You scored {score} out of {displayedQuizzes.length}.</p>
                {testReport && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Review</h3>
                    {testReport.map((r, i) => (
                      <div key={i} className={`p-3 rounded border ${r.isCorrect ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-destructive bg-red-50 dark:border-red-800 dark:bg-red-950'}`}>
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Q{i+1}: <MarkdownRenderer content={r.question} /></div>
                          <span className="text-sm text-muted-foreground">{r.isCorrect ? 'Correct' : 'Incorrect'}</span>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="dark:text-gray-200"><strong>Your answer:</strong> <MarkdownRenderer content={Array.isArray(r.userAnswer) ? r.userAnswer.join(', ') : String(r.userAnswer)} /></div>
                          <div className="dark:text-gray-200"><strong>Correct answer:</strong> <MarkdownRenderer content={Array.isArray(r.correctAnswer) ? r.correctAnswer.join(', ') : String(r.correctAnswer)} /></div>
                          {r.explanation && <div className="mt-2 text-sm text-muted-foreground dark:text-gray-300"><strong>Why:</strong> <MarkdownRenderer content={r.explanation} /></div>}
                        </div>
                        {!r.isCorrect && (
                          <div className="mt-2 flex gap-2">
                             <Button variant="ghost" onClick={() => { setShowQuiz(true); setSubmitted(false); setCurrentQuestionIndex(i); }}>
                                Try this question again
                             </Button>
                             <Button variant="outline" onClick={() => { window?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                Review Lesson
                             </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={resetQuiz} className="w-full">{passed ? 'Review Lesson & Quiz' : 'Try Again'}</Button>
            </CardFooter>
        </Card>
     )
  }

  const currentQuiz = displayedQuizzes[currentQuestionIndex];
  const currentStyle = (currentQuiz as any).style || selectedStyle;
  const resolvedCurrentStyle = currentStyle === 'visual' ? 'image-first' : currentStyle;
  let questionText = '';
  if (currentQuiz.type === 'mcq') questionText = currentQuiz.question;
  if (currentQuiz.type === 'truefalse') questionText = currentQuiz.statement;
  
  return (
    <Card>
        <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <span>Question {currentQuestionIndex + 1} of {displayedQuizzes.length}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{Math.round(((currentQuestionIndex+1) / displayedQuizzes.length) * 100)}%</span>
              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{String(resolvedCurrentStyle)}</span>
            </div>
          </div>
        </CardTitle>
        <div className="mt-2 w-full">
          <Progress value={Math.round(((currentQuestionIndex+1) / displayedQuizzes.length) * 100)} />
        </div>
        <CardDescription className="text-lg pt-2">
          <MarkdownRenderer content={questionText} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(resolvedCurrentStyle === 'timed' || selectedStyle === 'rapid') && (
          <div className="mb-2 text-center text-sm text-muted-foreground">Time left: {timeLeft}s</div>
        )}
        {renderQuizComponent(currentQuiz, currentQuestionIndex, resolvedCurrentStyle)}
      </CardContent>
      <CardFooter>
          <Button onClick={handleNextQuestion} disabled={!isQuestionAnswered(currentQuiz, userAnswers[currentQuestionIndex])}>
            {currentQuestionIndex === displayedQuizzes.length - 1 ? "Submit" : "Next Question"}
          </Button>
      </CardFooter>
    </Card>
  );
}

function isQuestionAnswered(quiz: Quiz, answer: any) {
  if (!quiz) return false;
  switch (quiz.type) {
    case 'mcq':
    case 'truefalse':
    case 'fillblank':
    case 'shortanswer':
      return !!(answer && answer.toString().trim().length > 0);
    case 'multiselect':
    case 'multiple_select':
      return (answer || []).length > 0;
    case 'matching':
      return Object.keys(answer || {}).length === (quiz as MatchingQuiz).pairs.length;
    case 'ordering':
      return (answer || []).length > 0;
    default:
      return false;
  }
}
