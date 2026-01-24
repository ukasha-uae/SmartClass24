'use client';
// Enhanced after-game experience for all Arena modes

import { useState, useEffect, useRef } from 'react';
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
  Share2, Download, Camera, Globe, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import {
  getChallenge,
  getPlayerProfile,
  createOrUpdatePlayer,
  submitChallengeAnswers,
  completeChallenge,
  acceptChallenge,
  declineChallenge,
  createChallenge,
  startChallenge,
  Challenge,
  GameQuestion,
  Player,
  PlayerAnswer,
  checkGameQuestionAnswer,
} from '@/lib/challenge';
import ArenaQuestionRenderer from '@/components/arena/ArenaQuestionRenderer';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { useFullscreen } from '@/contexts/FullscreenContext';
import { ShareChallengeDialog } from '@/components/challenge/ShareChallengeDialog';
import { useBotChallenge } from '@/lib/use-bot-challenge';
import { isBot } from '@/lib/ai-bot-profiles';
import { getUserDisplayName } from '@/lib/user-display';

export default function QuizBattlePage() {
  const params = useParams();
  const router = useRouter();
  const { playSound, isMuted, toggleMute } = useSoundEffects();
  const { user, firestore, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const { setFullscreen } = useFullscreen();
  const challengeId = params.challengeId as string;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [gamePhase, setGamePhase] = useState<'loading' | 'waiting' | 'playing' | 'results' | 'waiting-for-opponent'>('loading');
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Enhanced timing tracking for anti-cheat
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
  const [suspiciousActivity, setSuspiciousActivity] = useState<string[]>([]);
  
  // Extend gamePhase type to include 'waiting-for-opponent'
  type GamePhaseType = 'loading' | 'waiting' | 'playing' | 'results' | 'waiting-for-opponent';
  
  // Ref to store unsubscribe function for challenge listener
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Get opponent user ID for bot detection
  const opponentUserId = challenge?.opponents[0]?.userId;
  
  // Activate bot answering when player starts playing
  const { isBotAnswering, botAnswersSubmitted } = useBotChallenge(
    challenge,
    gamePhase === 'playing',
    opponentUserId
  );

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
    // Use authenticated user ID from Firebase
    const userId = user?.uid;
    
    // CRITICAL: Don't redirect if still loading user state
    // This prevents interruption during auth persistence loading or HMR
    if (!userId && !isUserLoading) {
      // No user after loading complete - redirect to sign in
      router.push('/challenge-arena');
      return;
    }
    
    // Skip if still loading
    if (!userId) {
      return;
    }
    
    // Set up player profile immediately from localStorage (synchronous, non-blocking)
    // This allows the challenge to load without waiting for Firestore
    let playerProfile = getPlayerProfile(userId);
    if (!playerProfile) {
      // Try to get student name from Firestore profile
      let displayName = getUserDisplayName(user);
      
      // Async fetch of student profile name (non-blocking)
      if (firestore) {
        import('firebase/firestore').then(async ({ doc, getDoc }) => {
          try {
            const profileRef = doc(firestore, `students/${userId}`);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              const profileData = profileSnap.data();
              const studentName = getUserDisplayName({ ...profileData, ...user });
              if (studentName && playerProfile) {
                // Update player profile with actual student name
                const updatedProfile = createOrUpdatePlayer({
                  ...playerProfile,
                  userName: studentName
                });
                setPlayer(updatedProfile);
              }
            }
          } catch (err) {
            console.warn('[Challenge] Could not fetch student profile:', err);
          }
        });
      }
      
      // Create a default player immediately so we don't block on loading
      playerProfile = createOrUpdatePlayer({
        userId,
        userName: displayName,
        school: 'Unknown School',
        rating: 1000,
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0,
        winStreak: 0,
        highestStreak: 0,
        coins: 0,
        level: 'SHS' as const
      });
    }
    setPlayer(playerProfile); // Set immediately so challenge can load
    
    // Load challenge data
    const loadChallenge = async () => {
      try {
        const challengeData = await getChallenge(challengeId);
        if (!challengeData) {
          router.push('/challenge-arena');
          return;
        }
        setChallenge(challengeData);
        
        // Check if challenge is already completed OR has results - show results (prevents reset to waiting)
        if (challengeData.status === 'completed' || (challengeData.results && challengeData.results.length > 0)) {
          setGamePhase('results');
          if (challengeData.results && challengeData.results.length > 0) {
            setResults(challengeData.results);
          }
        } else if (challengeData.status === 'pending' && challengeData.opponents.some(o => o.userId === userId && o.status === 'invited')) {
          // Show accept button for opponent
          setGamePhase('waiting');
        } else if (challengeData.status === 'pending') {
          setGamePhase('waiting');
        } else {
          setGamePhase('playing');
          // Track start time for first question
          if (challengeData.questions.length > 0) {
            setQuestionStartTimes({ [challengeData.questions[0].id]: Date.now() });
          }
        }
      } catch (error) {
        console.error('Failed to load challenge:', error);
        router.push('/challenge-arena');
      }
    };
    
    loadChallenge();
    
    // Set up real-time listener for challenge updates (so creator sees when opponent accepts)
    if (firestore) {
      const setupListener = async () => {
        try {
          const { doc, onSnapshot } = await import('firebase/firestore');
          const challengeRef = doc(firestore, 'challenges', challengeId);
          
          unsubscribeRef.current = onSnapshot(
            challengeRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const firestoreChallenge = snapshot.data() as Challenge;
                
                // Merge Firestore results with current challenge state to ensure we have all results
                setChallenge((currentChallenge) => {
                  if (!currentChallenge) {
                    return firestoreChallenge;
                  }
                  
                  // Merge results: combine Firestore results with current results, avoiding duplicates
                  const mergedChallenge = { ...currentChallenge, ...firestoreChallenge };
                  if (firestoreChallenge.results && firestoreChallenge.results.length > 0) {
                    if (!mergedChallenge.results) {
                      mergedChallenge.results = [];
                    }
                    // Merge results by userId, preferring Firestore data (most up-to-date)
                    firestoreChallenge.results.forEach((firestoreResult: any) => {
                      const existingIndex = mergedChallenge.results!.findIndex(r => r.userId === firestoreResult.userId);
                      if (existingIndex > -1) {
                        mergedChallenge.results![existingIndex] = firestoreResult;
                      } else {
                        mergedChallenge.results!.push(firestoreResult);
                      }
                    });
                  }
                  
                  return mergedChallenge;
                });
                
                // Update results state when challenge.results changes (from Firestore, contains all players)
                if (firestoreChallenge.results && firestoreChallenge.results.length > 0) {
                  setResults((currentResults: any) => {
                    // Merge with existing results to ensure we don't lose any
                    const merged = [...(currentResults || [])];
                    firestoreChallenge.results!.forEach((firestoreResult: any) => {
                      const existingIndex = merged.findIndex(r => r.userId === firestoreResult.userId);
                      if (existingIndex > -1) {
                        merged[existingIndex] = firestoreResult;
                      } else {
                        merged.push(firestoreResult);
                      }
                    });
                    return merged;
                  });
                }
                
                // Update game phase based on challenge status
                setGamePhase((currentPhase) => {
                  // CRITICAL: If challenge is completed OR has all results, always show results
                  const expectedResults = 1 + (firestoreChallenge.opponents?.length || 0);
                  const hasAllResults = firestoreChallenge.results && firestoreChallenge.results.length >= expectedResults;
                  
                  if (firestoreChallenge.status === 'completed' || hasAllResults) {
                    console.log('[Listener] Challenge complete or has all results, showing results');
                    return 'results';
                  }
                  
                  // If we're already in results phase, stay there (prevents resetting to waiting)
                  if (currentPhase === 'results') {
                    return currentPhase;
                  }
                  
                  // Handle status transitions only if not in results phase and no results data
                  if (firestoreChallenge.status === 'pending') {
                    return 'waiting';
                  } else if (firestoreChallenge.status === 'accepted' && currentPhase === 'waiting') {
                    // Challenge was accepted, start the game
                    // Track start time for first question
                    if (firestoreChallenge.questions.length > 0) {
                      setQuestionStartTimes({ [firestoreChallenge.questions[0].id]: Date.now() });
                    }
                    return 'playing';
                  }
                  
                  // Keep current phase for other statuses (in-progress, etc.)
                  return currentPhase;
                });
              }
            },
            (error) => {
              console.error('Error listening to challenge updates:', error);
            }
          );
        } catch (err) {
          console.error('Failed to set up challenge listener:', err);
        }
      };
      
      setupListener();
    }
    
    // Enhance player profile asynchronously from Firestore (non-blocking)
    if (firestore && user && playerProfile) {
      const enhancePlayerProfile = async () => {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const profileRef = doc(firestore, 'students', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            // Update player profile with real data
            const enhancedProfile = createOrUpdatePlayer({
              userId,
              userName: getUserDisplayName({ ...profileData, ...user }),
              school: profileData.schoolName || 'Unknown School',
              rating: playerProfile?.rating || 1000,
              wins: playerProfile?.wins || 0,
              losses: playerProfile?.losses || 0,
              draws: playerProfile?.draws || 0,
              totalGames: playerProfile?.totalGames || 0,
              winStreak: playerProfile?.winStreak || 0,
              highestStreak: playerProfile?.highestStreak || 0,
              coins: playerProfile?.coins || 0,
              level: (profileData.studentClass?.includes('SHS') ? 'SHS' : 
                     profileData.studentClass?.includes('JHS') ? 'JHS' : 
                     profileData.studentClass?.includes('Primary') ? 'Primary' : 
                     playerProfile?.level || 'JHS') as 'Primary' | 'JHS' | 'SHS'
            });
            setPlayer(enhancedProfile);
          }
        } catch (err) {
          console.error('Failed to fetch player profile from Firestore:', err);
          // Non-critical error, continue with existing profile
        }
      };
      
      enhancePlayerProfile();
    }
    
    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    }, [challengeId, user, router, firestore]);

  // Reset selected answer when question changes - with explicit null assignment for mobile
  useEffect(() => {
    if (gamePhase === 'playing' && challenge) {
      // Explicitly set to null to ensure mobile browsers clear state
      setSelectedAnswer(null);
      // Force a micro-delay on mobile to ensure state is cleared before render
      if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        // Mobile device detected - use requestAnimationFrame for smoother reset
        requestAnimationFrame(() => {
          setSelectedAnswer(null);
        });
      }
    }
  }, [currentQuestionIndex, gamePhase, challenge]);

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

  const handleAnswerSelect = (answer: any) => {
    if (!challenge || selectedAnswer !== null && selectedAnswer !== undefined) return; // Prevent changing answer once selected
    
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
    
    setSelectedAnswer(answer);

    const isCorrect = checkGameQuestionAnswer(currentQuestion, answer);
    
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      handleNextQuestion(answer);
    }, 1500); // Increased delay to show feedback
  };

  const handleNextQuestion = (answerToSubmit?: any) => {
    const answer = answerToSubmit !== undefined ? answerToSubmit : selectedAnswer;
    if (!challenge || (answer === null || answer === undefined)) return;

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
      setTimeLeft(120);
      // Note: selectedAnswer is reset via useEffect when currentQuestionIndex changes
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

  const finishChallenge = async (answersMap: Record<string, string>) => {
    if (!challenge || gamePhase === 'results') return;

    // Use authenticated user ID - anonymous users get unique ID from Firebase
    const userId = user?.uid;
    if (!userId) {
      toast({ title: 'Error', description: 'You must be signed in to submit answers.', variant: 'destructive' });
      return;
    }

    // Convert to PlayerAnswer[] with proper timing tracking
    const playerAnswers: PlayerAnswer[] = challenge.questions.map(q => {
      const answer = answersMap[q.id];
      const isCorrect = checkGameQuestionAnswer(q, answer);
      const timeSpent = questionTimeSpent[q.id] || (Date.now() - (questionStartTimes[q.id] || startTime));
      
      return {
        questionId: q.id,
        answer: String(answer), // Convert to string for storage
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
    const updatedChallenge = await submitChallengeAnswers(challengeId, userId, playerAnswers, totalTimeTaken);
    
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
    
    // CRITICAL: Only show results if BOTH players have finished (for non-practice modes)
    // For practice mode or boss battles, show results immediately
    const isPractice = challenge.type === 'practice';
    const isBossBattle = challenge.type === 'boss';
    const isQuickMatch = challenge.type === 'quick';
    const totalPlayers = 1 + (challenge.opponents?.length || 0); // Creator + opponents
    const finishedPlayers = updatedChallenge?.results?.length || 1;
    
    console.log('[Finish Challenge] Type:', challenge.type, 'Total players:', totalPlayers, 'Finished:', finishedPlayers);
    console.log('[Finish Challenge] Results:', updatedChallenge?.results?.map(r => ({ userId: r.userId, userName: r.userName })));
    
    // For quick matches with bots, show results immediately since bot finishes fast
    const opponentIsBot = challenge.opponents.some(o => o.userId.startsWith('bot-'));
    
    if (isPractice || isBossBattle || finishedPlayers >= totalPlayers || (isQuickMatch && opponentIsBot)) {
      // All players finished (or bot match), show results
      console.log('[Finish Challenge] Showing results now');
      setGamePhase('results');
      playSound('complete');
    } else {
      // Wait for opponent to finish
      console.log('[Finish Challenge] Waiting for opponent');
      setGamePhase('waiting-for-opponent');
      toast({ 
        title: 'Challenge Complete!', 
        description: 'Waiting for opponent to finish...',
        duration: 5000
      });
    }
  };

  const handleShare = async () => {
    if (!challenge || !results || isCapturing) return;

    setIsCapturing(true);
    toast({ title: 'Creating shareable image...', description: 'Please wait' });

    try {
      // Find the shareable card element
      const shareableCard = document.getElementById('shareable-results-card');
      if (!shareableCard) {
        throw new Error('Shareable card not found');
      }

      // Capture the element as canvas
      const canvas = await html2canvas(shareableCard, {
        scale: 3, // Higher quality for social media
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        width: shareableCard.scrollWidth,
        height: shareableCard.scrollHeight,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png', 1.0);
      });

      const file = new File([blob], 'smartc24-results.png', { type: 'image/png' });

      // Try Web Share API (mobile native share)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'S24 Challenge Results',
            text: '🎯 Check out my results on S24! Join me and excel in WASSCE & BECE!',
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

  if (gamePhase === 'loading' || !challenge) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (gamePhase === 'waiting' || gamePhase === 'waiting-for-opponent') {
    const userId = user?.uid;
    if (!userId) {
      return (
        <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to join challenges.</p>
          </div>
        </div>
      );
    }
    const isCreator = challenge?.creatorId === userId;
    const opponent = challenge?.opponents.find(o => o.userId === userId);
    const isInvitedOpponent = opponent?.status === 'invited';
    
    // Check if waiting for opponent to finish (after completing challenge)
    const isWaitingForResults = gamePhase === 'waiting-for-opponent';
    
    const handleAcceptChallenge = async () => {
      if (!challenge) return;
      const success = await acceptChallenge(challenge.id, userId);
      if (success) {
        toast({ title: 'Challenge Accepted!', description: 'Get ready to battle!' });
        setGamePhase('playing');
        // Reload challenge to get updated status
        const updatedChallenge = await getChallenge(challenge.id);
        if (updatedChallenge) {
          setChallenge(updatedChallenge);
        }
      } else {
        toast({ title: 'Error', description: 'Failed to accept challenge', variant: 'destructive' });
      }
    };
    
    const handleDeclineChallenge = async () => {
      if (!challenge) return;
      try {
        const success = await declineChallenge(challenge.id, userId);
        if (success) {
          toast({ 
            title: 'Challenge Declined', 
            description: 'You have declined this challenge. The creator will be notified.' 
          });
          // Navigate back to challenge arena after a short delay
          setTimeout(() => {
            router.push('/challenge-arena');
          }, 1500);
        } else {
          toast({ title: 'Error', description: 'Failed to decline challenge', variant: 'destructive' });
        }
      } catch (error) {
        console.error('Error declining challenge:', error);
        toast({ title: 'Error', description: 'Failed to decline challenge', variant: 'destructive' });
      }
    };
    
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative bg-background rounded-full p-6 border-4 border-primary">
            <Clock className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        
        {isWaitingForResults ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              You've finished the challenge! Waiting for your opponent to complete their answers...
            </p>
            <div className="bg-muted/50 rounded-lg p-6 max-w-md">
              <p className="text-sm text-muted-foreground mb-4">
                Your results will be displayed once both players have finished.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Fair Play Enabled</span>
              </div>
            </div>
          </>
        ) : isInvitedOpponent ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Challenge Invitation</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              {challenge?.creatorName} from {challenge?.creatorSchool} has invited you to a {challenge?.subject} challenge on SmartClass24 (S24).
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleDeclineChallenge}>
                Decline
              </Button>
              <Button onClick={handleAcceptChallenge} size="lg">
                Accept Challenge
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Waiting for Opponent</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              We've sent the challenge invitation. The game will start as soon as your opponent accepts.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-8 w-full max-w-md">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 border-4 border-primary mb-3">
                  <AvatarFallback>
                    {(challenge?.creatorName || player?.userName || 'C').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">{challenge?.creatorName || player?.userName}</p>
                <Badge variant="outline" className="mt-1">Ready</Badge>
              </div>

              <div className="flex flex-col items-center">
                {challenge?.opponents && challenge.opponents.length > 0 && challenge.opponents[0].userName ? (
                  <>
                    <Avatar className="h-20 w-20 border-4 border-dashed border-muted-foreground mb-3 bg-muted/30">
                      <AvatarFallback className="text-muted-foreground">
                        {challenge.opponents[0].userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-muted-foreground">{challenge.opponents[0].userName}</p>
                    <Badge variant="secondary" className="mt-1 animate-pulse">Waiting...</Badge>
                  </>
                ) : (
                  <>
                    <div className="h-20 w-20 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center mb-3 bg-muted/30">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-bold text-muted-foreground">Opponent</p>
                    <Badge variant="secondary" className="mt-1 animate-pulse">Waiting...</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              {challenge?.opponents && challenge.opponents.length > 0 && challenge.opponents[0].userName && (
                <ShareChallengeDialog
                  challengeId={challenge.id}
                  creatorName={challenge.creatorName}
                  creatorSchool={challenge.creatorSchool}
                  subject={challenge.subject}
                  opponentName={challenge.opponents[0].userName}
                  opponentUserId={challenge.opponents[0].userId}
                  onEmailSent={() => {
                    toast({ title: 'Email opened!', description: 'Send the email to notify your opponent.' });
                  }}
                  onWhatsAppSent={() => {
                    toast({ title: 'WhatsApp opened!', description: 'Send the message to notify your opponent.' });
                  }}
                />
              )}
              <Button variant="outline" onClick={() => router.push('/challenge-arena')}>
                Cancel Challenge
              </Button>
            </div>
          </>
        )}
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

  if (gamePhase === 'results' && (results || challenge?.results)) {
    // Get current user ID - require authenticated user
    const userId = user?.uid;
    if (!userId) {
      return (
        <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to view results.</p>
          </div>
        </div>
      );
    }
    
    // CRITICAL: Always use challenge.results as primary source (from Firestore, contains all players)
    // Merge with results state to ensure we have the most up-to-date data
    // This ensures we always show both players' results even if state updates are out of sync
    let allResults: any[] = [];
    
    // Start with challenge.results (most authoritative, from Firestore)
    if (challenge?.results && challenge.results.length > 0) {
      allResults = [...challenge.results];
    }
    
    // Merge with results state (local state, might have more recent data)
    if (results && Array.isArray(results) && results.length > 0) {
      results.forEach((result: any) => {
        const existingIndex = allResults.findIndex(r => r.userId === result.userId);
        if (existingIndex > -1) {
          // Update existing result with newer data
          allResults[existingIndex] = result;
        } else {
          // Add new result
          allResults.push(result);
        }
      });
    }
    
    console.log('[Results Debug] Current user:', user?.uid);
    console.log('[Results Debug] Challenge ID:', challenge?.id);
    console.log('[Results Debug] Challenge type:', challenge?.type);
    console.log('[Results Debug] Challenge creatorId:', challenge?.creatorId);
    console.log('[Results Debug] Challenge opponents:', challenge?.opponents?.map((o: any) => ({ userId: o.userId, userName: o.userName, status: o.status })));
    console.log('[Results Debug] Challenge.results from Firestore:', challenge?.results?.map((r: any) => ({ userId: r.userId, userName: r.userName, score: r.score })));
    console.log('[Results Debug] Results state:', results?.map((r: any) => ({ userId: r.userId, userName: r.userName, score: r.score })));
    console.log('[Results Debug] All results count:', allResults.length);
    console.log('[Results Debug] All results:', allResults.map((r: any) => ({ userId: r.userId, userName: r.userName, score: r.score, rank: r.rank })));
    
    // Deduplicate results to prevent key collisions from legacy data
    const uniqueResults = allResults.reduce((acc: any[], current: any) => {
      if (!acc.find(item => item.userId === current.userId)) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    console.log('[Results Debug] After deduplication - uniqueResults:', uniqueResults.map((r: any) => ({ userId: r.userId, userName: r.userName, score: r.score })));
    
    // Ensure ranks are assigned - if all ranks are 0 or undefined, sort and assign them
    // For 2-player challenges, assign ranks even if only 1 result exists (so we can show winner/loser when both are available)
    const expectedResultCount = (challenge?.opponents?.length || 0) + 1; // creator + opponents
    const hasRanks = uniqueResults.every((r: any) => r.rank && r.rank > 0);
    const challengeType = challenge?.type || '';
    const isTwoPlayerChallenge = expectedResultCount === 2 && (challengeType === 'quick' || challengeType === 'tournament' || challengeType === 'school');
    
    if (!hasRanks && uniqueResults.length > 0) {
      // For 2-player challenges, assign ranks even with 1 result (temporary rank 1, will be updated when opponent submits)
      // For other challenges, only assign ranks if we have all expected results
      if (isTwoPlayerChallenge || uniqueResults.length >= expectedResultCount) {
        // Sort by score (descending), then by time (ascending)
        uniqueResults.sort((a: any, b: any) => {
          if (b.score !== a.score) return b.score - a.score;
          return (a.totalTime || 0) - (b.totalTime || 0);
        });
        // Assign ranks
        uniqueResults.forEach((result: any, index: number) => {
          result.rank = index + 1;
        });
      }
    }
    
    console.log('[Results Debug] Unique results count:', uniqueResults.length);
    console.log('[Results Debug] Unique results:', uniqueResults.map((r: any) => ({ userId: r.userId, userName: r.userName, score: r.score, rank: r.rank })));
    console.log('[Results Debug] Expected results:', challenge?.opponents?.length + 1, '(creator +', challenge?.opponents?.length, 'opponents)');
    console.log('[Results Debug] Current user ID:', user?.uid);
    console.log('[Results Debug] Has current user result?:', uniqueResults.some((r: any) => r.userId === user?.uid));
    console.log('[Results Debug] Has bot result?:', uniqueResults.some((r: any) => r.userId?.startsWith('bot-')));

    // ASYNC MODEL: Detect if match is complete (both players have submitted) vs incomplete (only one player has submitted)
    const isMatchComplete = challenge?.status === 'completed';
    const isMatchIncomplete = uniqueResults.length < expectedResultCount;
    const allPlayerIds = [
      challenge?.creatorId,
      ...(challenge?.opponents?.map((o: any) => o.userId) || [])
    ].filter(Boolean);
    const completedPlayerIds = uniqueResults.map((r: any) => r.userId);
    const incompletePlayerIds = allPlayerIds.filter(id => !completedPlayerIds.includes(id));

    // Find current user's result - STRICT matching by userId only (no fallbacks that could show wrong player's result)
    let myResult = null;
    
    if (user?.uid) {
      // CRITICAL: Only match by exact userId - never use fallbacks that could show another player's result
      myResult = uniqueResults.find((r: any) => r.userId === user.uid);
      
      // Log if user doesn't have a result (incomplete match scenario)
      if (!myResult && isMatchIncomplete) {
        console.log('[Results Debug] Match incomplete - current user has not submitted results:', user.uid);
      }
    }
    
    // SAFETY: Never use fallback to first result - this could show wrong player's data
    // If user has no result, myResult remains null and we'll show incomplete match UI
    const ratingChange = myResult?.ratingChange || 0;
    const isWin = myResult?.rank === 1;
    const isPodium = myResult?.rank <= 3;
    const isPractice = challenge.type === 'practice';
    const isBossBattle = challenge.type === 'boss';
    const isSchoolBattle = challenge.type === 'school';
    const isQuickMatch = challenge.type === 'quick';
    const isTournament = challenge.type === 'tournament';

    // Calculate performance metrics - ONLY if myResult exists (prevents showing wrong player's stats)
    const correctAnswers = myResult?.correctAnswers ?? 0;
    const totalQuestions = challenge?.questions?.length || 1; // Prevent division by zero
    const accuracy = myResult?.accuracy !== undefined 
      ? Math.round(myResult.accuracy) 
      : (correctAnswers > 0 && totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);
    const totalTimeSeconds = myResult?.totalTime ? Math.round(myResult.totalTime / 1000) : 0;
    const avgTimePerQuestion = totalQuestions > 0 && correctAnswers > 0 ? Math.round(totalTimeSeconds / totalQuestions) : 0;
    
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

    // Handle Play Again - rematch with same opponent for quick matches
    // BOTH PLAYERS can call for rematch: The function correctly identifies the opponent
    // whether the current user is the creator or the opponent
    const handlePlayAgain = async () => {
      if (!challenge || !user) return;
      
      // For quick matches, create a rematch with the same opponent
      if (isQuickMatch && challenge.opponents.length === 1) {
        const currentUserId = user.uid;
        
        // Determine the opponent for rematch:
        // - If current user is creator → opponent is in opponents array
        // - If current user is opponent → creator is the opponent for rematch
        // This ensures BOTH players can initiate a rematch correctly
        // Use challenge data directly (don't rely on player profile cache which may not have opponent)
        let opponentUserId: string;
        let opponentUserName: string;
        let opponentSchool: string;
        
        if (challenge.creatorId === currentUserId) {
          // Current user is creator, opponent is in opponents array
          const opponentData = challenge.opponents[0];
          opponentUserId = opponentData.userId;
          opponentUserName = opponentData.userName;
          opponentSchool = opponentData.school;
        } else {
          // Current user is the opponent, so the creator is the opponent for rematch
          // Try to get creator info from challenge results or use fallback
          const creatorResult = challenge.results?.find(r => r.userId === challenge.creatorId);
          opponentUserId = challenge.creatorId;
          opponentUserName = creatorResult?.userName || challenge.creatorName || 'Opponent';
          opponentSchool = creatorResult?.school || challenge.creatorSchool || 'Unknown School';
        }
        
        // Get current user's info (try player profile, fallback to challenge results)
        const playerProfile = getPlayerProfile(currentUserId);
        const currentUserResult = challenge.results?.find(r => r.userId === currentUserId);
        const creatorName = playerProfile?.userName || currentUserResult?.userName || challenge.creatorName || 'You';
        const creatorSchool = playerProfile?.school || currentUserResult?.school || challenge.creatorSchool || 'Unknown School';
        
        // Create new challenge with same opponent
        const questionCount = challenge.difficulty === 'easy' ? 5 : challenge.difficulty === 'medium' ? 10 : 15;
        const timeLimit = challenge.difficulty === 'easy' ? 30 : challenge.difficulty === 'medium' ? 45 : 60;
        
        const newChallenge = createChallenge({
          type: 'quick',
          level: challenge.level,
          subject: challenge.subject,
          difficulty: challenge.difficulty,
          questionCount,
          timeLimit,
          creatorId: currentUserId,
          creatorName: creatorName,
          creatorSchool: creatorSchool,
          opponents: [{ userId: opponentUserId, userName: opponentUserName, school: opponentSchool, status: 'invited' as const }],
          maxPlayers: 2,
        });
        
        // If opponent is Sarah bot, auto-accept and start
        if (opponentUserId.startsWith('bot-')) {
          try {
            await acceptChallenge(newChallenge.id, opponentUserId);
            await new Promise(resolve => setTimeout(resolve, 100));
            await startChallenge(newChallenge.id);
            console.log('✅ Sarah auto-accepted rematch');
          } catch (error) {
            console.error('Sarah rematch accept error:', error);
          }
        }
        
        toast({ title: 'Rematch Created!', description: `Challenging ${opponentUserName} again!` });
        router.push(`/challenge-arena/play/${newChallenge.id}`);
        return;
      }
      
      // For other challenge types, use the default redirect behavior
      if (isPractice) {
        router.push(`/challenge-arena/practice?level=${challenge?.level || 'JHS'}`);
      } else if (isBossBattle && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss) {
        router.push("/challenge-arena/boss-battle");
      } else if (isSchoolBattle && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaSchool) {
        router.push("/challenge-arena/school-battle");
      } else if (isTournament && FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament) {
        router.push("/challenge-arena/tournaments");
      } else {
        // Default: redirect to quick-match
        router.push("/challenge-arena/quick-match");
      }
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
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 rounded-full blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg shadow-lg">
                    S24
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="font-black text-lg leading-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                    S24
                  </h2>
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
                    {uniqueResults.length === 2 ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                          {isWin ? (
                            <>
                              <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                              You Won!
                            </>
                          ) : (
                            <>
                              <Target className="h-10 w-10 text-purple-500" />
                              {(() => {
                                const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                                return `${winnerResult?.userName || 'Opponent'} Won!`;
                              })()}
                            </>
                          )}
                        </h1>
                        <div className="text-lg text-muted-foreground mb-2 flex items-center justify-center gap-2 flex-wrap">
                          <span className="font-semibold">{myResult?.userName || 'You'}</span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="font-semibold">
                            {uniqueResults.find((r: any) => r.userId !== (user?.uid || userId) && r.userId !== myResult?.userId)?.userName || 'Opponent'}
                          </span>
                        </div>
                        {(() => {
                          // Check if scores are tied but winner was determined by time
                          const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                          const loserResult = uniqueResults.find((r: any) => r.rank === 2);
                          const isTieByScore = winnerResult && loserResult && winnerResult.score === loserResult.score;
                          return isTieByScore ? (
                            <p className="text-xs text-muted-foreground mb-2 italic">
                              ⚡ Tied on score! Winner determined by fastest time
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm text-muted-foreground">{performance.message}</p>
                      </>
                    ) : (
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
                    )}
                  </>
                ) : isTournament ? (
                  <>
                    {uniqueResults.length === 2 ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                          {isWin ? (
                            <>
                              <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                              You Won!
                            </>
                          ) : (
                            <>
                              <Medal className="h-10 w-10 text-purple-500" />
                              {(() => {
                                const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                                return `${winnerResult?.userName || 'Opponent'} Won!`;
                              })()}
                            </>
                          )}
                        </h1>
                        <div className="text-lg text-muted-foreground mb-2 flex items-center justify-center gap-2 flex-wrap">
                          <span className="font-semibold">{myResult?.userName || 'You'}</span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="font-semibold">
                            {uniqueResults.find((r: any) => r.userId !== (user?.uid || userId) && r.userId !== myResult?.userId)?.userName || 'Opponent'}
                          </span>
                        </div>
                        {(() => {
                          // Check if scores are tied but winner was determined by time
                          const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                          const loserResult = uniqueResults.find((r: any) => r.rank === 2);
                          const isTieByScore = winnerResult && loserResult && winnerResult.score === loserResult.score;
                          return isTieByScore ? (
                            <p className="text-xs text-muted-foreground mb-2 italic">
                              ⚡ Tied on score! Winner determined by fastest time
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm text-muted-foreground">{performance.message}</p>
                      </>
                    ) : (
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
                    )}
                  </>
                ) : isQuickMatch ? (
                  <>
                    {uniqueResults.length === 2 ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                          {isWin ? (
                            <>
                              <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                              You Won!
                            </>
                          ) : (
                            <>
                              <Target className="h-10 w-10 text-purple-500" />
                              {(() => {
                                const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                                return `${winnerResult?.userName || 'Opponent'} Won!`;
                              })()}
                            </>
                          )}
                        </h1>
                        <div className="text-lg text-muted-foreground mb-2 flex items-center justify-center gap-2 flex-wrap">
                          <span className="font-semibold">{myResult?.userName || 'You'}</span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="font-semibold">
                            {uniqueResults.find((r: any) => r.userId !== (user?.uid || userId) && r.userId !== myResult?.userId)?.userName || 'Opponent'}
                          </span>
                        </div>
                        {(() => {
                          // Check if scores are tied but winner was determined by time
                          const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                          const loserResult = uniqueResults.find((r: any) => r.rank === 2);
                          const isTieByScore = winnerResult && loserResult && winnerResult.score === loserResult.score;
                          return isTieByScore ? (
                            <p className="text-xs text-muted-foreground mb-2 italic">
                              ⚡ Tied on score! Winner determined by fastest time
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm text-muted-foreground">{performance.message}</p>
                      </>
                    ) : (
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
                        {/* Only show rank if it's been assigned (rank > 0). Avoids showing "Rank #0" or "Rank #undefined" */}
                        {myResult?.rank && myResult.rank > 0 && (
                          <p className="text-sm text-muted-foreground">Rank #{myResult.rank}</p>
                        )}
                      </>
                    )}
                  </>
                ) : isPractice ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      <span className="text-4xl">{performance.emoji}</span>
                      Practice Complete!
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{performance.message}</p>
                  </>
                ) : uniqueResults.length === 2 ? (
                  // Default case: Any other challenge type with 2 players - show winner
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                      {isWin ? (
                        <>
                          <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
                          {`${myResult?.userName || 'You'} Won!`}
                        </>
                      ) : (
                        <>
                          <Target className="h-10 w-10 text-purple-500" />
                          {(() => {
                            const winnerResult = uniqueResults.find((r: any) => r.rank === 1);
                            return `${winnerResult?.userName || 'Opponent'} Won!`;
                          })()}
                        </>
                      )}
                    </h1>
                    <div className="text-lg text-muted-foreground mb-2 flex items-center justify-center gap-2 flex-wrap">
                      <span className="font-semibold">{myResult?.userName || 'You'}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-semibold">
                        {uniqueResults.find((r: any) => r.userId !== (user?.uid || userId) && r.userId !== myResult?.userId)?.userName || 'Opponent'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{performance.message}</p>
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

                {/* Head-to-Head Comparison for 2 Players - Only show when match is COMPLETE (both players finished) */}
                {!isPractice && isMatchComplete && uniqueResults.length === 2 ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className={`p-6 rounded-2xl border-2 ${
                          myResult?.rank === 1 
                            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400 shadow-lg' 
                            : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/30'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                                <AvatarFallback className="text-lg font-bold">
                                  {myResult?.userName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'You'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-lg">{myResult?.userName || 'You'}</p>
                                {/* Only show rank badge if rank is assigned (rank > 0). Prevents "Rank #0" display */}
                                {myResult?.rank && myResult.rank > 0 && (
                                  <Badge variant={myResult.rank === 1 ? 'default' : 'secondary'} className="mt-1">
                                    {myResult.rank === 1 ? '🏆 Winner' : `Rank #${myResult.rank}`}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold">{myResult?.score ?? 0}</p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                              <p className="text-xs text-muted-foreground">Accuracy</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</p>
                              <p className="text-xs text-muted-foreground">Correct</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{totalTimeSeconds}s</p>
                              <p className="text-xs text-muted-foreground">Time</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-muted-foreground py-2">VS</div>
                      
                      <div className="flex-1 w-full sm:w-auto">
                        {(() => {
                          // Find opponent result - CRITICAL: Only use authenticated user.uid, never fallback
                          const opponentResult = uniqueResults.find((r: any) => r.userId !== user?.uid && r.userId !== myResult?.userId);
                          const opponentAccuracy = opponentResult?.accuracy !== undefined 
                            ? Math.round(opponentResult.accuracy) 
                            : (opponentResult?.correctAnswers && challenge?.questions?.length 
                              ? Math.round((opponentResult.correctAnswers / challenge.questions.length) * 100) 
                              : 0);
                          const opponentTimeSeconds = opponentResult?.totalTime ? Math.round(opponentResult.totalTime / 1000) : (opponentResult?.timeTaken || 0);
                          
                          return (
                            <div className={`p-6 rounded-2xl border-2 ${
                              opponentResult?.rank === 1 
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400 shadow-lg' 
                                : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/30'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                                    <AvatarFallback className="text-lg font-bold">
                                      {opponentResult?.userName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'Opp'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-lg">{opponentResult?.userName || 'Opponent'}</p>
                                    {/* Only show rank badge if rank is assigned (rank > 0). Prevents "Rank #0" display */}
                                    {opponentResult?.rank && opponentResult.rank > 0 && (
                                      <Badge variant={opponentResult.rank === 1 ? 'default' : 'secondary'} className="mt-1">
                                        {opponentResult.rank === 1 ? '🏆 Winner' : `Rank #${opponentResult.rank}`}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold">{opponentResult?.score ?? 0}</p>
                                  <p className="text-xs text-muted-foreground">points</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-green-600">{opponentAccuracy}%</p>
                                  <p className="text-xs text-muted-foreground">Accuracy</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-600">{opponentResult?.correctAnswers ?? 0}/{totalQuestions}</p>
                                  <p className="text-xs text-muted-foreground">Correct</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-purple-600">{opponentTimeSeconds}s</p>
                                  <p className="text-xs text-muted-foreground">Time</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single Player Stats Grid (for practice or multiple players) */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border-2 border-amber-200/30 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                      <div className="relative text-center">
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">🏆</div>
                        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{myResult?.score ?? 0}</p>
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
                )}

                {/* Premium Rating change and Coins for competitive modes */}
                {!isPractice && (
                  <div className="mt-6 space-y-4">
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
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
                    {myResult?.coinsEarned !== undefined && myResult.coinsEarned > 0 && (
                      <div className="p-6 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/30 dark:border-yellow-800/30 shadow-xl">
                        <div className="flex items-center justify-center gap-6">
                          <div className="text-5xl">💰</div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Coins Earned</p>
                            <p className="text-4xl sm:text-5xl font-bold text-yellow-600">
                              +{myResult.coinsEarned}
                            </p>
                          </div>
                          <div className="h-16 w-px bg-slate-300 dark:bg-slate-700"></div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Coins</p>
                            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{player?.coins || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
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

          {/* Hidden Shareable Card - Compact design for social media */}
          <div id="shareable-results-card" className="fixed -left-[9999px] top-0 w-[800px] bg-white">
            <div className="p-8 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 rounded-full blur-lg opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-black text-xl shadow-lg">
                      S24
                    </div>
                  </div>
                  <div>
                    <h2 className="font-black text-2xl leading-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      S24 Challenge Results
                    </h2>
                    <p className="text-sm text-gray-600">Learn • Practice • Excel</p>
                  </div>
                </div>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${performance.color} flex items-center justify-center shadow-xl`}>
                  <div className="text-4xl font-black text-white">{performance.grade}</div>
                </div>
              </div>

              {/* Main Result - Compact for 2 players */}
              {uniqueResults.length === 2 && myResult ? (() => {
                const opponentResult = uniqueResults.find((r: any) => r.userId !== (user?.uid || userId));
                const opponentAccuracy = opponentResult?.accuracy !== undefined 
                  ? Math.round(opponentResult.accuracy) 
                  : (opponentResult?.correctAnswers && challenge?.questions?.length 
                    ? Math.round((opponentResult.correctAnswers / challenge.questions.length) * 100) 
                    : 0);
                
                return (
                  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-8">
                      {/* Player 1 */}
                      <div className="text-center flex-1">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                          myResult.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                        }`}>
                          <span className="text-2xl font-bold text-white">
                            {myResult.rank === 1 ? '🥇' : '🥈'}
                          </span>
                        </div>
                        <p className="font-bold text-lg mb-1">{myResult.userName || 'You'}</p>
                        <p className="text-3xl font-black text-gray-800 mb-2">{myResult.score ?? 0}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{accuracy}% Accuracy</p>
                          <p>{correctAnswers}/{totalQuestions} Correct</p>
                        </div>
                      </div>

                      <div className="text-3xl font-bold text-gray-400">VS</div>

                      {/* Player 2 */}
                      <div className="text-center flex-1">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                          opponentResult?.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                        }`}>
                          <span className="text-2xl font-bold text-white">
                            {opponentResult?.rank === 1 ? '🥇' : '🥈'}
                          </span>
                        </div>
                        <p className="font-bold text-lg mb-1">{opponentResult?.userName || 'Opponent'}</p>
                        <p className="text-3xl font-black text-gray-800 mb-2">{opponentResult?.score ?? 0}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{opponentAccuracy}% Accuracy</p>
                          <p>{opponentResult?.correctAnswers ?? 0}/{totalQuestions} Correct</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    isWin ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    <span className="text-4xl">
                      {isWin ? '🏆' : '⭐'}
                    </span>
                  </div>
                  <p className="font-bold text-2xl mb-2">{myResult?.userName || 'You'}</p>
                  <p className="text-4xl font-black text-gray-800 mb-3">{myResult?.score ?? 0} Points</p>
                  <div className="flex justify-center gap-6 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold">{accuracy}%</p>
                      <p>Accuracy</p>
                    </div>
                    <div>
                      <p className="font-semibold">{correctAnswers}/{totalQuestions}</p>
                      <p>Correct</p>
                    </div>
                    <div>
                      <p className="font-semibold">{totalTimeSeconds}s</p>
                      <p>Time</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer with app link */}
              <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center">
                <p className="text-xl font-bold mb-2">🎓 Join the Learning Revolution!</p>
                <p className="text-sm opacity-90 mb-3">Practice • Compete • Excel in WASSCE & BECE</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                  <p className="font-mono font-bold text-lg">{typeof window !== 'undefined' ? window.location.origin : 'smartc24.com'}</p>
                </div>
                <p className="text-xs mt-3 opacity-75">Download the app and start your learning journey today!</p>
              </div>
            </div>
          </div>

          {/* Leaderboard for competitive modes - Show both players immediately */}
          {!isPractice && uniqueResults.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {isSchoolBattle ? 'School Rankings' : isTournament ? 'Tournament Standings' : 'Match Results'}
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
                  {uniqueResults.map((result: any, idx: number) => {
                    const resultAccuracy = result.accuracy !== undefined 
                      ? Math.round(result.accuracy) 
                      : (result.correctAnswers && challenge?.questions?.length 
                        ? Math.round((result.correctAnswers / challenge.questions.length) * 100) 
                        : 0);
                    const resultTimeSeconds = result.totalTime ? Math.round(result.totalTime / 1000) : (result.timeTaken || 0);
                    
                    return (
                      <div
                        key={result.userId || idx}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-all border-2 ${
                          result.userId === (user?.uid || userId)
                            ? 'bg-primary/10 border-primary shadow-lg' 
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
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
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">
                            {isSchoolBattle 
                              ? result.school?.substring(0, 2).toUpperCase() || '??'
                              : result.userName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base sm:text-lg flex items-center gap-2 flex-wrap">
                            <span className="truncate">{isSchoolBattle ? result.school : result.userName}</span>
                            {result.userId === (user?.uid || userId) && (
                              <Badge variant="secondary" className="shrink-0">You</Badge>
                            )}
                            {isBossBattle && result.userId !== userId && (
                              <Badge variant="outline" className="shrink-0 border-purple-500 text-purple-500">AI</Badge>
                            )}
                          </div>
                          {isSchoolBattle && result.userName && (
                             <p className="text-xs text-muted-foreground truncate">Represented by {result.userName}</p>
                          )}
                          <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm flex-wrap">
                            <span className="text-muted-foreground whitespace-nowrap">
                              {result.correctAnswers ?? 0}/{challenge?.questions?.length || 0} correct
                            </span>
                            <span className="text-muted-foreground hidden sm:inline">•</span>
                            <span className="text-muted-foreground whitespace-nowrap">
                              {resultAccuracy}% accuracy
                            </span>
                            <span className="text-muted-foreground hidden sm:inline">•</span>
                            <span className="text-muted-foreground whitespace-nowrap">
                              {resultTimeSeconds}s
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl sm:text-2xl font-bold">{result.score ?? 0}</p>
                          <p className="text-xs text-muted-foreground mb-1">points</p>
                          {!isBossBattle && result.ratingChange !== undefined && (
                            <p className={`text-xs sm:text-sm flex items-center justify-end gap-1 ${
                              result.ratingChange > 0 ? 'text-green-600' :
                              result.ratingChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                            }`}>
                              {result.ratingChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {result.ratingChange > 0 ? '+' : ''}{result.ratingChange}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

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
                    <p className="text-2xl font-bold text-red-600">
                      {(() => {
                        const total = challenge?.questions?.length ?? 0;
                        const correct = myResult?.correctAnswers ?? 0;
                        const incorrect = total - correct;
                        return isNaN(incorrect) ? '0' : incorrect.toString();
                      })()}
                    </p>
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

          {/* Quick Actions with Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Link href="/challenge-arena" className="w-full">
              <Button variant="outline" className="w-full h-12">
                <Home className="h-4 w-4 mr-2" />
                Back to Arena
              </Button>
            </Link>
            <Button 
              onClick={handlePlayAgain}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {isPractice ? "Practice Again" :
               isBossBattle ? (isWin ? "Next Boss" : "Rematch") :
               isSchoolBattle ? "Defend Again" :
               isTournament ? "View Tournaments" :
               isQuickMatch ? "Re-match" :
               "Play Again"}
            </Button>
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
                        <Link href={`/challenge-arena/practice?level=${challenge?.level || 'JHS'}`}>
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
                          <Link href={`/challenge-arena/practice?level=${challenge?.level || 'JHS'}`}>
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
                      {(player?.userName || 'Player').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{player?.userName || 'Player'}</p>
                    <p className="text-xs text-muted-foreground">Rating: {player?.rating || 1000}</p>
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
                        {(player?.userName || 'Player').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{player?.userName || 'Player'}</p>
                      <p className="text-xs text-muted-foreground">R: {player?.rating || 1000}</p>
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

          {/* Premium Question Card - Using QuestionRenderer - Scrollable */}
          <Card className="mb-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                  {challenge.subject}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs border-2 capitalize">
                  {challenge.difficulty}
                </Badge>
              </div>
              
              {/* Scrollable question container with max height */}
              <div className="max-h-[calc(100vh-350px)] sm:max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-hidden pr-2 -mr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                <ArenaQuestionRenderer
                  key={`question-${currentQuestion.id}-${currentQuestionIndex}`}
                  question={currentQuestion}
                  onAnswer={handleAnswerSelect}
                  selectedAnswer={selectedAnswer}
                  showResult={selectedAnswer !== null && selectedAnswer !== undefined}
                  isCorrect={selectedAnswer !== null && selectedAnswer !== undefined ? checkGameQuestionAnswer(currentQuestion, selectedAnswer) : false}
                  disabled={selectedAnswer !== null && selectedAnswer !== undefined}
                />
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
