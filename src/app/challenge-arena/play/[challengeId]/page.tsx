'use client';
// Enhanced after-game experience for all Arena modes

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock, Trophy, Target, Zap, CheckCircle2, 
  XCircle, Award, TrendingUp, TrendingDown,
  ChevronRight, Home, RotateCcw, BrainCircuit, Users,
  Volume2, VolumeX, Flame, Star, Sparkles, Medal,
  BookOpen, Lightbulb, TrendingDownIcon, BarChart3,
  Share2, Download, Camera, Globe
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import {
  getChallenge,
  getPlayerProfile,
  submitChallengeAnswers,
  completeChallenge,
  Challenge,
  GameQuestion,
  Player,
  PlayerAnswer,
} from '@/lib/challenge';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { useFullscreen } from '@/contexts/FullscreenContext';

export default function QuizBattlePage() {
  const params = useParams();
  const router = useRouter();
  const { playSound, isMuted, toggleMute } = useSoundEffects();
  const { user } = useFirebase();
  const { toast } = useToast();
  const { setFullscreen } = useFullscreen();
  const challengeId = params.challengeId as string;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [gamePhase, setGamePhase] = useState<'loading' | 'waiting' | 'playing' | 'results'>('loading');
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Enhanced timing tracking for anti-cheat
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
  const [suspiciousActivity, setSuspiciousActivity] = useState<string[]>([]);

  // Enable fullscreen mode when gameplay starts
  useEffect(() => {
    if (gamePhase === 'playing') {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
    
    // Cleanup: disable fullscreen when component unmounts
    return () => {
      setFullscreen(false);
    };
  }, [gamePhase, setFullscreen]);

  useEffect(() => {
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    const challengeData = getChallenge(challengeId);
    if (!challengeData) {
      router.push('/challenge-arena');
      return;
    }
    setChallenge(challengeData);
    setPlayer(getPlayerProfile(userId));
    
    if (challengeData.status === 'pending') {
      setGamePhase('waiting');
    } else {
      setGamePhase('playing');
      // Track start time for first question
      if (challengeData.questions.length > 0) {
        setQuestionStartTimes({ [challengeData.questions[0].id]: Date.now() });
      }
    }
  }, [challengeId, user, router]);

  // Enhanced timer countdown with color coding and sound effects
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // Play warning sound when time is low
        if (prev === 10) {
          playSound('warning');
        }
        if (prev === 5) {
          playSound('warning');
        }
        
        if (prev <= 1) {
          handleNextQuestion();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, currentQuestionIndex, playSound]);

  const handleAnswerSelect = (answerId: string) => {
    if (!challenge || selectedAnswer) return; // Prevent changing answer once selected
    
    const currentQuestion = challenge.questions[currentQuestionIndex];
    const questionStartTime = questionStartTimes[currentQuestion.id] || Date.now();
    const timeSpent = Date.now() - questionStartTime;
    
    // Anti-cheat: Validate minimum time (1000ms = 1 second)
    const MINIMUM_TIME = 1000;
    if (timeSpent < MINIMUM_TIME) {
      setSuspiciousActivity(prev => [...prev, `Question ${currentQuestionIndex + 1}: Answered too quickly (${timeSpent}ms)`]);
      // Still allow the answer but log suspicious activity
    }
    
    // Track time spent on this question
    setQuestionTimeSpent(prev => ({
      ...prev,
      [currentQuestion.id]: timeSpent
    }));
    
    setSelectedAnswer(answerId);

    const isCorrect = currentQuestion.correctAnswer === answerId;
    
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      handleNextQuestion(answerId);
    }, 1000); // Increased delay slightly to let sound play
  };

  const handleNextQuestion = (answerToSubmit?: string) => {
    const answer = answerToSubmit || selectedAnswer;
    if (!challenge || !answer) return;

    const currentQuestion = challenge.questions[currentQuestionIndex];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    if (currentQuestionIndex < challenge.questions.length - 1) {
      // Track start time for next question
      const nextQuestion = challenge.questions[currentQuestionIndex + 1];
      setQuestionStartTimes(prev => ({
        ...prev,
        [nextQuestion.id]: Date.now()
      }));
      
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(120);
    } else {
      // Last question - add a small delay before showing results
      setTimeout(() => {
        finishChallenge({
          ...userAnswers,
          [currentQuestion.id]: answer
        });
      }, 1500); // Give time to see the last answer feedback
    }
  };

  const finishChallenge = (answersMap: Record<string, string>) => {
    if (!challenge || gamePhase === 'results') return;

    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';

    // Convert to PlayerAnswer[] with proper timing tracking
    const playerAnswers: PlayerAnswer[] = challenge.questions.map(q => {
      const answer = answersMap[q.id];
      const isCorrect = answer === q.correctAnswer;
      const timeSpent = questionTimeSpent[q.id] || (Date.now() - (questionStartTimes[q.id] || startTime));
      
      return {
        questionId: q.id,
        answer,
        isCorrect,
        timeSpent, // Now properly tracked per question
        points: isCorrect ? q.points : 0
      };
    });
    
    // Anti-cheat: Detect suspicious patterns
    const averageTime = playerAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / playerAnswers.length;
    const correctCount = playerAnswers.filter(a => a.isCorrect).length;
    
    // Flag if average time is suspiciously low (< 2 seconds)
    if (averageTime < 2000) {
      setSuspiciousActivity(prev => [...prev, `Average time per question: ${Math.round(averageTime)}ms (suspiciously fast)`]);
    }
    
    // Flag if perfect score with minimal time (< 3 seconds average)
    if (correctCount === playerAnswers.length && averageTime < 3000) {
      setSuspiciousActivity(prev => [...prev, `Perfect score with very fast average time: ${Math.round(averageTime)}ms`]);
    }

    // Calculate total time taken
    const totalTimeTaken = Date.now() - startTime;

    // Submit answers and get updated challenge directly
    const updatedChallenge = submitChallengeAnswers(challengeId, userId, playerAnswers, totalTimeTaken);
    
    if (updatedChallenge && updatedChallenge.results) {
      setResults(updatedChallenge.results);
      
      // Check for win and trigger confetti
      const myResult = updatedChallenge.results.find(r => r.userId === userId);
      if (myResult?.rank === 1) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
    
    setGamePhase('results');
    playSound('complete');
  };

  const handleShare = async () => {
    if (!challenge || !results || isCapturing) return;

    setIsCapturing(true);
    toast({ title: 'Preparing image...', description: 'Please wait' });

    try {
      // Find the results card element
      const resultsCard = document.getElementById('results-card');
      if (!resultsCard) {
        throw new Error('Results card not found');
      }

      // Capture the element as canvas
      const canvas = await html2canvas(resultsCard, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });

      const file = new File([blob], 'smartc24-results.png', { type: 'image/png' });

      // Try Web Share API (mobile native share)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'SmartC24 Challenge Results',
            text: '🎯 Check out my results on SmartC24!',
            files: [file],
          });
          toast({ title: 'Shared successfully!', description: 'Thanks for spreading the word!' });
          return;
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            return; // User cancelled
          }
          console.log('Share API failed, trying download:', error);
        }
      }

      // Fallback: Download the image
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smartc24-results-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ 
        title: 'Image downloaded!', 
        description: 'Share the image from your downloads folder.' 
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({ 
        title: 'Could not create image', 
        description: 'Please try again or screenshot your results.',
        variant: 'destructive'
      });
    } finally {
      setIsCapturing(false);
    }
  };

  if (gamePhase === 'loading' || !challenge || !player) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative bg-background rounded-full p-6 border-4 border-primary">
            <Clock className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Waiting for Opponent</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          We've sent the challenge invitation. The game will start as soon as your opponent accepts.
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8 w-full max-w-md">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-primary mb-3">
              <AvatarFallback>{player.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="font-bold">{player.userName}</p>
            <Badge variant="outline" className="mt-1">Ready</Badge>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center mb-3 bg-muted/30">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-bold text-muted-foreground">Opponent</p>
            <Badge variant="secondary" className="mt-1 animate-pulse">Waiting...</Badge>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/challenge-arena')}>
            Cancel Challenge
          </Button>
          <Button onClick={() => {
            // For demo purposes, simulate opponent accepting
            setGamePhase('playing');
          }}>
            Start Anyway (Demo)
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = challenge.questions[currentQuestionIndex];

  // Safety check for missing questions
  if (!currentQuestion && gamePhase === 'playing') {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Question</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't load the question data. This might happen if the selected subject doesn't have enough questions available yet.
        </p>
        <Button onClick={() => router.push('/challenge-arena')}>
          Return to Arena
        </Button>
      </div>
    );
  }

  const progress = challenge.questions.length > 0 
    ? ((currentQuestionIndex + 1) / challenge.questions.length) * 100 
    : 0;
  const timeProgress = (timeLeft / 120) * 100;

  if (gamePhase === 'results' && results) {
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    
    // Deduplicate results to prevent key collisions from legacy data
    const uniqueResults = results.reduce((acc: any[], current: any) => {
      if (!acc.find(item => item.userId === current.userId)) {
        acc.push(current);
      }
      return acc;
    }, []);

    const myResult = uniqueResults.find((r: any) => r.userId === userId);
    const ratingChange = myResult?.ratingChange || 0;
    const isWin = myResult?.rank === 1;
    const isPodium = myResult?.rank <= 3;
    const isPractice = challenge.type === 'practice';
    const isBossBattle = challenge.type === 'boss';
    const isSchoolBattle = challenge.type === 'school';
    const isQuickMatch = challenge.type === 'quick';
    const isTournament = challenge.type === 'tournament';

    // Calculate performance metrics with fallback values
    const correctAnswers = myResult?.correctAnswers || 0;
    const totalQuestions = challenge.questions.length || 1; // Prevent division by zero
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100) || 0;
    const totalTimeSeconds = myResult?.totalTime ? Math.round(myResult.totalTime / 1000) : 0;
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSeconds / totalQuestions) : 0;
    
    // Generate motivational message and performance grade based on challenge type
    const getPerformanceInsight = () => {
      const baseInsight = {
        grade: '',
        color: '',
        textColor: '',
        message: '',
        emoji: '',
        tip: ''
      };

      // Determine grade based on accuracy
      if (accuracy >= 90) {
        baseInsight.grade = 'S';
        baseInsight.color = 'from-yellow-400 to-orange-500';
        baseInsight.textColor = 'text-yellow-500';
        baseInsight.emoji = "🏆";
      } else if (accuracy >= 80) {
        baseInsight.grade = 'A';
        baseInsight.color = 'from-green-400 to-emerald-500';
        baseInsight.textColor = 'text-green-500';
        baseInsight.emoji = "⭐";
      } else if (accuracy >= 70) {
        baseInsight.grade = 'B';
        baseInsight.color = 'from-blue-400 to-cyan-500';
        baseInsight.textColor = 'text-blue-500';
        baseInsight.emoji = "👍";
      } else if (accuracy >= 60) {
        baseInsight.grade = 'C';
        baseInsight.color = 'from-purple-400 to-pink-500';
        baseInsight.textColor = 'text-purple-500';
        baseInsight.emoji = "💡";
      } else {
        baseInsight.grade = 'D';
        baseInsight.color = 'from-gray-400 to-gray-500';
        baseInsight.textColor = 'text-gray-500';
        baseInsight.emoji = "🎯";
      }

      // Customize message and tip based on challenge type
      if (isBossBattle) {
        if (isWin) {
          baseInsight.message = accuracy >= 90 ? "Flawless victory! The boss didn't stand a chance! 👑" : "Victory! You've defeated the AI boss! 🎮";
          baseInsight.tip = "Try a harder boss to test your limits!";
        } else {
          baseInsight.message = accuracy >= 70 ? "Close fight! The boss was tough but you held your ground! 💪" : "The boss proved challenging. Study and return stronger! 🔥";
          baseInsight.tip = "Review the answers and challenge this boss again!";
        }
      } else if (isSchoolBattle) {
        if (isWin) {
          baseInsight.message = `Your school reigns supreme! ${player?.school} pride! 🏫`;
          baseInsight.tip = "Keep defending your school's honor in more battles!";
        } else {
          baseInsight.message = accuracy >= 70 ? "Honorable performance for your school! 🎓" : "Every battle makes your school stronger! Keep fighting! 💙";
          baseInsight.tip = "Practice more to bring glory to your school!";
        }
      } else if (isQuickMatch) {
        if (isWin) {
          baseInsight.message = accuracy >= 90 ? "Dominant victory! You're unstoppable! ⚡" : "You crushed it! Well played! 🎯";
          baseInsight.tip = "Your skills are sharp! Try a harder difficulty!";
        } else {
          baseInsight.message = accuracy >= 70 ? "Good fight! You're climbing the ranks! 📈" : "Keep practicing, you'll win the next one! 🌟";
          baseInsight.tip = "Learn from strong opponents to improve faster!";
        }
      } else if (isTournament) {
        if (isWin) {
          baseInsight.message = "🏆 TOURNAMENT CHAMPION! Legendary performance! 👑";
          baseInsight.tip = "You're a competitive genius! Join more tournaments!";
        } else if (isPodium) {
          baseInsight.message = `Top ${myResult?.rank}! You're among the elite! 🥇`;
          baseInsight.tip = "So close to the top! Keep pushing!";
        } else {
          baseInsight.message = accuracy >= 70 ? "Solid tournament showing! 🎖️" : "Tournament experience gained! Learn and grow! 📚";
          baseInsight.tip = "Tournament pressure builds champions!";
        }
      } else if (isPractice) {
        if (accuracy >= 90) {
          baseInsight.message = "Outstanding! You're mastering this subject! 🌟";
          baseInsight.tip = "Challenge yourself with harder difficulty next time!";
        } else if (accuracy >= 80) {
          baseInsight.message = "Excellent work! You're on fire! 🔥";
          baseInsight.tip = "Keep up this pace and you'll be a top performer!";
        } else if (accuracy >= 70) {
          baseInsight.message = "Great effort! You're improving steadily! 💪";
          baseInsight.tip = "Review the questions you missed to level up!";
        } else if (accuracy >= 60) {
          baseInsight.message = "Good try! Practice makes perfect! 📚";
          baseInsight.tip = "Focus on understanding concepts, not just memorizing!";
        } else {
          baseInsight.message = "Keep going! Every expert was once a beginner! 🌱";
          baseInsight.tip = "Try the easy difficulty and build your confidence!";
        }
      }

      return baseInsight;
    };

    const performance = getPerformanceInsight();

    // Calculate streak (mock for now - you'd track this in the player profile)
    const mockStreak = Math.floor(Math.random() * 7) + 1;

    // Get specific challenge type display name
    const getChallengeTypeName = () => {
      if (isBossBattle) return 'Boss Battle';
      if (isSchoolBattle) return 'School Battle';
      if (isQuickMatch) return 'Quick Match';
      if (isTournament) return 'Tournament';
      if (isPractice) return 'Practice Session';
      return 'Challenge';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${
            isWin ? 'from-yellow-300/20 via-orange-300/20 to-amber-300/20' :
            isPodium ? 'from-green-300/20 via-emerald-300/20 to-teal-300/20' :
            'from-blue-300/20 via-purple-300/20 to-pink-300/20'
          } rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr ${
            isWin ? 'from-amber-300/20 via-yellow-300/20 to-orange-300/20' :
            isPodium ? 'from-teal-300/20 via-cyan-300/20 to-blue-300/20' :
            'from-indigo-300/20 via-purple-300/20 to-pink-300/20'
          } rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto p-3 sm:p-6 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Epic Results Header with Performance Grade */}
            <Card 
              id="results-card"
              className={`mb-6 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 shadow-2xl ${
              isBossBattle ? 'border-purple-400 shadow-purple-200/50' :
              isSchoolBattle ? 'border-blue-400 shadow-blue-200/50' :
              isTournament ? 'border-pink-400 shadow-pink-200/50' :
              isPractice ? 'border-orange-400 shadow-orange-200/50' :
              isWin ? 'border-yellow-400 shadow-yellow-200/50' :
              isPodium ? 'border-green-400 shadow-green-200/50' :
              'border-gray-400'
            }`}>
            <div className={`h-2 bg-gradient-to-r ${performance.color}`} />
            <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
              {/* App Branding Header - for sharing */}
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  S24
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-lg leading-tight">SmartC24</h2>
                  <p className="text-xs text-muted-foreground">Learn • Practice • Excel</p>
                </div>
              </div>
              
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 text-6xl animate-pulse">✨</div>
                <div className="absolute top-20 right-20 text-5xl animate-bounce">⭐</div>
                <div className="absolute bottom-10 left-20 text-4xl animate-pulse">🎯</div>
                <div className="absolute bottom-20 right-10 text-6xl animate-bounce">💫</div>
              </div>

              {/* Main content */}
              <div className="relative z-10">
                {/* Challenge Type Badge */}
                <Badge variant="outline" className="mb-3">
                  {getChallengeTypeName()}
                </Badge>

                {/* Performance Grade Badge */}
                <div className="mb-4 flex justify-center">
                  <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${performance.color} flex items-center justify-center shadow-lg animate-pulse`}>
                    <div className="text-5xl font-black text-white">{performance.grade}</div>
                  </div>
                </div>

                {/* Dynamic Title based on challenge type and result */}
                {isBossBattle ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      {isWin ? (
                        <>
                          <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                          Boss Defeated!
                        </>
                      ) : (
                        <>
                          <Target className="h-10 w-10 text-purple-500" />
                          Battle Complete
                        </>
                      )}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                  </>
                ) : isSchoolBattle ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      {isWin ? (
                        <>
                          🏫 School Victory!
                        </>
                      ) : (
                        <>
                          🎓 Honorable Fight
                        </>
                      )}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                    <p className="text-sm text-muted-foreground">Representing {player?.school}</p>
                  </>
                ) : isTournament ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      {isWin ? (
                        <>
                          <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                          Tournament Champion!
                        </>
                      ) : isPodium ? (
                        <>
                          <Medal className="h-10 w-10 text-blue-500" />
                          Podium Finish!
                        </>
                      ) : (
                        <>
                          <Star className="h-10 w-10 text-purple-500" />
                          Tournament Complete
                        </>
                      )}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                  </>
                ) : isQuickMatch ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      {isWin ? (
                        <>
                          <Zap className="h-10 w-10 text-yellow-500 animate-bounce" />
                          Victory!
                        </>
                      ) : isPodium ? (
                        <>
                          <Award className="h-10 w-10 text-blue-500" />
                          Nice Work!
                        </>
                      ) : (
                        <>
                          <Target className="h-10 w-10 text-gray-500" />
                          Match Complete
                        </>
                      )}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                    <p className="text-sm text-muted-foreground">Rank #{myResult?.rank}</p>
                  </>
                ) : isPractice ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      <span className="text-4xl">{performance.emoji}</span>
                      Practice Complete!
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Challenge Complete</h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                  </>
                )}

                {/* Pro Tip */}
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-primary">Pro Tip</p>
                      <p className="text-sm text-muted-foreground">{performance.tip}</p>
                    </div>
                  </div>
                </div>

                {/* Premium Main Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border-2 border-amber-200/30 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative text-center">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">🏆</div>
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{myResult?.score}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Points</p>
                    </div>
                  </div>
                  
                  <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl border-2 border-green-200/30 dark:border-green-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative text-center">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">🎯</div>
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{accuracy}%</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Accuracy</p>
                    </div>
                  </div>

                  <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative text-center">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">⏱️</div>
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{avgTimePerQuestion}s</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Avg/Question</p>
                    </div>
                  </div>

                  <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl border-2 border-orange-200/30 dark:border-orange-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative text-center">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">🔥</div>
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{mockStreak}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Day Streak</p>
                    </div>
                  </div>
                </div>

                {/* Premium Rating change for competitive modes */}
                {!isPractice && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-5xl">📈</div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Rating Change</p>
                        <p className={`text-4xl sm:text-5xl font-bold ${
                          ratingChange > 0 ? 'text-green-600' :
                          ratingChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {ratingChange > 0 ? '+' : ''}{ratingChange}
                        </p>
                      </div>
                      <div className="h-16 w-px bg-slate-300 dark:bg-slate-700"></div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">New Rating</p>
                        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{player?.rating || 1000}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Call to Action Footer - for sharing */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">🎓 Join the Learning Revolution!</p>
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg">
                      <Globe className="h-5 w-5" />
                      <span>{typeof window !== 'undefined' ? window.location.origin : 'smartc24.com'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Practice • Compete • Excel in WASSCE & BECE
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Performance Breakdown */}
          {isPractice && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Breakdown
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailedStats(!showDetailedStats)}
                  >
                    {showDetailedStats ? 'Hide' : 'Show'} Details
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{myResult?.correctAnswers}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{challenge.questions.length - myResult?.correctAnswers}</p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">{accuracy}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Speed</span>
                      <span className="font-semibold">{avgTimePerQuestion}s per question</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          avgTimePerQuestion <= 20 ? 'bg-purple-500' : avgTimePerQuestion <= 40 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min((60 - avgTimePerQuestion) * 2, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total Time</span>
                      <span className="font-semibold">{totalTimeSeconds}s</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((totalTimeSeconds / (challenge.questions.length * 60)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Stats (Expandable) */}
                {showDetailedStats && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <p className="font-semibold mt-1">{challenge.subject}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Difficulty</p>
                        <p className="font-semibold mt-1 capitalize">{challenge.difficulty}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Questions</p>
                        <p className="font-semibold mt-1">{challenge.questions.length}</p>
                      </div>
                    </div>

                    {/* Performance Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {accuracy === 100 && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          🎯 Perfect Score
                        </Badge>
                      )}
                      {avgTimePerQuestion <= 15 && (
                        <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                          ⚡ Speed Demon
                        </Badge>
                      )}
                      {accuracy >= 90 && (
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                          🌟 Expert
                        </Badge>
                      )}
                      {mockStreak >= 5 && (
                        <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                          🔥 On Fire
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Leaderboard for competitive modes */}
          {!isPractice && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {isSchoolBattle ? 'School Rankings' : isTournament ? 'Tournament Standings' : 'Leaderboard'}
                </h2>
                
                {/* Special message for school battles */}
                {isSchoolBattle && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <span>🏫</span>
                      <span>This battle counts toward your school's overall ranking!</span>
                    </p>
                  </div>
                )}

                {/* Boss Battle special display */}
                {isBossBattle && (
                  <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🤖</div>
                      <div className="flex-1">
                        <p className="font-semibold text-purple-900 dark:text-purple-100">
                          {isWin ? 'AI Boss Defeated!' : 'Boss Survived!'}
                        </p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {isWin 
                            ? `You've proven your superiority over the AI! XP Earned: +${challenge.questions.length * 10}` 
                            : `The AI was strong, but you gained valuable experience. Try again!`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {uniqueResults.map((result: any, idx: number) => (
                    <div
                      key={result.userId}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        result.userId === userId 
                          ? 'bg-primary/10 border-2 border-primary shadow-lg scale-105' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        result.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                        result.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md' :
                        result.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md' :
                        'bg-background border-2 border-border'
                      }`}>
                        {result.rank === 1 && '🥇'}
                        {result.rank === 2 && '🥈'}
                        {result.rank === 3 && '🥉'}
                        {result.rank > 3 && result.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {isSchoolBattle 
                            ? result.school.substring(0, 2).toUpperCase()
                            : result.userName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold flex items-center">
                          {isSchoolBattle ? result.school : result.userName}
                          {result.userId === userId && (
                            <Badge variant="secondary" className="ml-2">You</Badge>
                          )}
                          {isBossBattle && result.userId !== userId && (
                            <Badge variant="outline" className="ml-2 border-purple-500 text-purple-500">AI</Badge>
                          )}
                        </div>
                        {isSchoolBattle && (
                           <p className="text-xs text-muted-foreground">Represented by {result.userName}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {result.correctAnswers}/{challenge.questions.length} correct • {result.timeTaken}s
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{result.score}</p>
                        {!isBossBattle && (
                          <p className={`text-sm flex items-center gap-1 ${
                            result.ratingChange > 0 ? 'text-green-600' :
                            result.ratingChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {result.ratingChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {result.ratingChange > 0 ? '+' : ''}{result.ratingChange}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions with Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Link href="/challenge-arena" className="w-full">
              <Button variant="outline" className="w-full h-12">
                <Home className="h-4 w-4 mr-2" />
                Back to Arena
              </Button>
            </Link>
            <Link href={
              isPractice ? "/challenge-arena/practice" :
              isBossBattle && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss ? "/challenge-arena/boss-battle" :
              isSchoolBattle && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaSchool ? "/challenge-arena/school-battle" :
              isTournament && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament ? "/challenge-arena/tournaments" :
              "/challenge-arena/quick-match"
            } className="w-full">
              <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <RotateCcw className="h-4 w-4 mr-2" />
                {isPractice ? "Practice Again" :
                 isBossBattle ? (isWin ? "Next Boss" : "Rematch") :
                 isSchoolBattle ? "Defend Again" :
                 isTournament ? "View Tournaments" :
                 "Play Again"}
              </Button>
            </Link>
          </div>

          {/* Share Results Card - Enhanced for different types */}
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {isSchoolBattle ? "Share School Victory!" :
                       isBossBattle ? "Share Boss Victory!" :
                       isTournament ? "Share Tournament Result!" :
                       "Share Your Results"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isSchoolBattle ? "Show your school pride!" :
                       isBossBattle ? "Brag about defeating the AI!" :
                       isTournament ? "Show off your ranking!" :
                       "Let others know about your progress!"}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleShare}
                  disabled={isCapturing}
                >
                  {isCapturing ? 'Preparing...' : 'Share'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Recommendations based on performance and challenge type */}
          {!isTournament && (
            <Card className="mt-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">
                      {accuracy >= 80 ? "🚀 Ready for a Challenge?" : "💪 Keep Building Your Skills!"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {isPractice && accuracy >= 80 && "You're ready for competitive play!"}
                      {isPractice && accuracy < 80 && "Practice more to improve your accuracy!"}
                      {isBossBattle && isWin && "Try a harder AI boss for bigger rewards!"}
                      {isBossBattle && !isWin && "Keep practicing to defeat this boss!"}
                      {isSchoolBattle && "Your school needs more champions like you!"}
                      {isQuickMatch && accuracy >= 80 && "Try a Boss Battle or Tournament next!"}
                      {isQuickMatch && accuracy < 80 && "Practice mode can help you improve!"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {isPractice && accuracy >= 80 && (
                        <>
                          <Link href="/challenge-arena/quick-match">
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Quick Match
                            </Button>
                          </Link>
                          {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss && (
                            <Link href="/challenge-arena/boss-battle">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <BrainCircuit className="h-3 w-3 mr-1" />
                                Boss Battle
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                      {isPractice && accuracy < 80 && (
                        <Link href="/challenge-arena/practice">
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Practice Again
                          </Button>
                        </Link>
                      )}
                      {isBossBattle && (
                        <>
                          {isWin && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss && (
                            <Link href="/challenge-arena/boss-battle">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                Harder Boss
                              </Button>
                            </Link>
                          )}
                          {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament && (
                            <Link href="/challenge-arena/tournaments">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Trophy className="h-3 w-3 mr-1" />
                                Join Tournament
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                      {isSchoolBattle && (
                        <>
                          {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaSchool && (
                            <Link href="/challenge-arena/school-battle">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Another Battle
                              </Button>
                            </Link>
                          )}
                          <Link href="/challenge-arena/practice">
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Practice
                            </Button>
                          </Link>
                        </>
                      )}
                      {isQuickMatch && (
                        <>
                          {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss && (
                            <Link href="/challenge-arena/boss-battle">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <BrainCircuit className="h-3 w-3 mr-1" />
                                Boss Battle
                              </Button>
                            </Link>
                          )}
                          {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament && (
                            <Link href="/challenge-arena/tournaments">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Trophy className="h-3 w-3 mr-1" />
                                Tournament
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/20 via-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-300/20 via-red-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-300/10 via-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto p-3 sm:p-6 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Premium Large Visible Timer - Fixed at Top (no header offset needed) */}
          <div className={`fixed top-0 left-0 right-0 z-50 transition-all ${
            timeLeft <= 30 
              ? 'animate-pulse' 
              : ''
          }`}>
            <Card className={`border-b-2 rounded-none shadow-2xl ${
              timeLeft <= 30 
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-950/50 dark:to-orange-950/50 border-red-500/50 dark:border-red-600/50' 
                : timeLeft <= 60
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 dark:from-orange-950/50 dark:to-yellow-950/50 border-orange-500/50 dark:border-orange-600/50'
                : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-500/50 dark:border-blue-600/50'
            } backdrop-blur-xl`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Question Info - Compact */}
                  <div className="flex items-center gap-2">
                    <div className="text-2xl sm:text-3xl">⚡</div>
                    <div>
                      <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Q{currentQuestionIndex + 1}/{challenge.questions.length}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {challenge.subject}
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Prominent Timer */}
                  <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all shadow-lg ${
                    timeLeft <= 30 
                      ? 'border-red-500 bg-gradient-to-br from-red-500 to-orange-600 animate-pulse scale-105' 
                      : timeLeft <= 60
                      ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-yellow-500'
                      : 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    <Clock className={`h-6 w-6 sm:h-8 sm:w-8 text-white ${
                      timeLeft <= 30 ? 'animate-spin' : ''
                    }`} />
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs text-white/80 font-medium leading-none">Time</span>
                      <span className="font-mono font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-none">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Sound Toggle - Compact */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10"
                    onClick={toggleMute}
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    )}
                  </Button>
                </div>
                
                {/* Compact Progress Bars */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-[10px] text-muted-foreground mt-0.5">Progress: {Math.round(progress)}%</div>
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={timeProgress} 
                      className={`h-2 bg-slate-200 dark:bg-slate-700 ${
                        timeLeft <= 30 ? '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-orange-600' : 
                        timeLeft <= 60 ? '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-yellow-500' : 
                        '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600'
                      }`}
                    />
                    <div className={`text-[10px] font-semibold mt-0.5 ${
                      timeLeft <= 30 ? 'text-red-600' : 
                      timeLeft <= 60 ? 'text-orange-600' : 
                      'text-blue-600'
                    }`}>
                      Time: {Math.round(timeProgress)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Spacer for fixed timer (no header, so just timer height) */}
          <div className="h-[120px] sm:h-[140px]"></div>

          {/* Premium Player/Opponent Info - Compact */}
          <Card className="mb-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-slate-200/30 dark:border-slate-700/30 shadow-xl">
            <CardContent className="p-3 sm:p-4">
              {challenge.type === 'practice' ? (
                <div className="flex items-center justify-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-green-500 shadow-lg">
                    <AvatarFallback className="text-base font-bold bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      {player.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{player.userName}</p>
                    <p className="text-xs text-muted-foreground">Rating: {player.rating}</p>
                    <Badge variant="secondary" className="mt-1 text-xs px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                      🧠 Practice
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12 border-2 border-blue-500 shadow-lg">
                      <AvatarFallback className="text-base font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {player.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{player.userName}</p>
                      <p className="text-xs text-muted-foreground">R: {player.rating}</p>
                    </div>
                  </div>
                  
                  <div className="text-2xl animate-pulse">⚔️</div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-bold text-sm bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{challenge.opponents[0]?.userName || 'Opponent'}</p>
                      <p className="text-xs text-muted-foreground">
                        R: {getPlayerProfile(challenge.opponents[0]?.userId)?.rating || '???'}
                      </p>
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-orange-500 shadow-lg">
                      <AvatarFallback className="text-base font-bold bg-gradient-to-br from-orange-500 to-red-600 text-white">
                        {(challenge.opponents[0]?.userName || 'O').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Question Card - Compact */}
          <Card className="mb-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                    {challenge.subject}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-xs border-2 capitalize">
                    {challenge.difficulty}
                  </Badge>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Premium Answer Options - Compact */}
              <div className="space-y-2 sm:space-y-3" key={currentQuestionIndex}>
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showResult = !!selectedAnswer;
                  const letter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={!!selectedAnswer}
                      className={`group relative w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-300 hover:scale-[1.01] ${
                        isSelected
                          ? (isCorrect 
                              ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 font-semibold shadow-lg shadow-green-200/50 dark:shadow-green-900/20' 
                              : 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 font-semibold shadow-lg shadow-red-200/50 dark:shadow-red-900/20')
                          : showResult
                            ? (isCorrect 
                                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-md' 
                                : 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed')
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold text-base transition-all flex-shrink-0 ${
                          isSelected
                            ? (isCorrect 
                                ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' 
                                : 'border-red-500 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg')
                            : showResult && isCorrect
                              ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                              : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 group-hover:border-primary group-hover:bg-primary/10'
                        }`}>
                          {letter}
                        </div>
                        <span className="flex-1 text-sm sm:text-base font-medium leading-tight">{option}</span>
                        {isSelected && (
                          isCorrect 
                            ? <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in flex-shrink-0" />
                            : <XCircle className="h-5 w-5 text-red-500 animate-in zoom-in flex-shrink-0" />
                        )}
                        {showResult && !isSelected && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
          </CardContent>
        </Card>

        {/* Action Button - Hidden for auto-advance, but kept in DOM for accessibility/fallback if needed, or removed entirely */}
        {/* <Button
          onClick={() => handleNextQuestion()}
          disabled={!selectedAnswer}
          className="w-full h-14 text-lg hidden"
          size="lg"
        >
          ...
        </Button> */}

          {/* Premium Score Preview - Compact */}
          <Card className="mt-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="font-semibold text-xs text-muted-foreground">Progress</p>
                    <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {Object.keys(userAnswers).length}/{challenge.questions.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-bold text-sm text-green-600">{Object.keys(userAnswers).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
