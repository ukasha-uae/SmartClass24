'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, BrainCircuit, ArrowLeft, ArrowRight, Star, CheckCircle2, Trophy
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AI_BOSSES,
  createBossChallenge,
  AIBoss,
  getPlayerProfile,
  createOrUpdatePlayer
} from '@/lib/challenge';
import type { Player } from '@/lib/challenge';
import { useFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

export default function BossBattlePage() {
  const router = useRouter();
  
  // V1 Route Guard: Redirect to practice if boss battles are disabled
  useEffect(() => {
    if (!FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss) {
      router.replace('/challenge-arena/practice');
    }
  }, [router]);
  
  // Don't render if feature is disabled
  if (!FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss) {
    return null;
  }
  const { user } = useFirebase();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [selectedBoss, setSelectedBoss] = useState<AIBoss | null>(null);
  const [subject, setSubject] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const getSubjectsForLevel = () => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('userEducationLevel');
      if (savedLevel === 'SHS') {
        return ['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies'];
      }
    }
    return ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT'];
  };

  const subjects = getSubjectsForLevel();
  
  if (!subject && subjects.length > 0) {
    setSubject(subjects[0]);
  }

  const handleStartBattle = () => {
    if (!selectedBoss) {
      toast({ title: 'Select a Boss', description: 'Please select an AI opponent first.', variant: 'destructive' });
      return;
    }
    
    setIsStarting(true);
    
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    
    // Ensure player profile exists
    let player = getPlayerProfile(userId);
    if (!player) {
      // Create a player profile if it doesn't exist
      player = createOrUpdatePlayer({
        userId: userId, 
        userName: user?.displayName || user?.email || 'Test Player',
        school: 'My School',
        level: 'JHS'
      });
    }
    
    const challenge = createBossChallenge(userId, selectedBoss.id, subject);
    
    if (challenge) {
      toast({ title: 'Battle Started!', description: `You are battling ${selectedBoss.name}!` });
      router.push(`/challenge-arena/play/${challenge.id}`);
    } else {
      toast({ title: 'Error', description: 'Failed to create battle. Please try again.', variant: 'destructive' });
      setIsStarting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedBoss;
    if (step === 2) return !!subject;
    return true;
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else handleStartBattle();
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-purple-500" />
            AI Boss Battle
          </h1>
          <span className="text-sm text-muted-foreground">Step {step} of 2</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-purple-500' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Step 1: Boss Selection */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Opponent</CardTitle>
              <CardDescription>Select an AI boss to battle</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-1">
                {AI_BOSSES.map((boss) => (
                  <button
                    key={boss.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      selectedBoss?.id === boss.id 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setSelectedBoss(boss)}
                  >
                    <div className="text-3xl shrink-0">{boss.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{boss.name}</span>
                        <Badge 
                          variant={boss.difficulty === 'easy' ? 'secondary' : boss.difficulty === 'medium' ? 'default' : 'destructive'} 
                          className={`text-[10px] px-1.5 py-0 ${boss.difficulty === 'insane' ? 'border-purple-500 text-purple-500 bg-transparent' : ''}`}
                        >
                          {boss.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">{boss.title}</p>
                      <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                        <Star className="h-3 w-3 fill-current" />
                        {boss.xpReward} XP
                      </div>
                    </div>
                    {selectedBoss?.id === boss.id && (
                      <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Subject & Confirmation */}
        {step === 2 && selectedBoss && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Battle Settings</CardTitle>
              <CardDescription>Choose subject and confirm</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Subject Select */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Battle Summary */}
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-purple-200 dark:border-purple-800">
                  <div className="text-3xl">{selectedBoss.avatar}</div>
                  <div>
                    <p className="font-bold">VS {selectedBoss.name}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">{selectedBoss.title}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Difficulty</span>
                    <p className="font-medium capitalize">{selectedBoss.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">AI Accuracy</span>
                    <p className="font-medium">{selectedBoss.accuracy * 100}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Questions</span>
                    <p className="font-medium">10</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Win Reward</span>
                    <p className="font-medium text-yellow-600 flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> {selectedBoss.xpReward} XP
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="border-t px-4 py-3 flex items-center justify-between bg-muted/30">
          {step === 1 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/challenge-arena')}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={nextStep}
            disabled={!canProceed() || isStarting}
            className="gap-1 bg-purple-600 hover:bg-purple-700"
          >
            {isStarting ? 'Starting...' : step === 2 ? 'Start Battle' : 'Next'}
            {!isStarting && step < 2 && <ArrowRight className="h-4 w-4" />}
            {!isStarting && step === 2 && <Swords className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Summary Preview (always visible) */}
      {selectedBoss && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">{selectedBoss.name}</span>
          <span className="bg-muted px-2 py-1 rounded-full capitalize">{selectedBoss.difficulty}</span>
          {subject && <span className="bg-muted px-2 py-1 rounded-full">{subject}</span>}
        </div>
      )}
    </div>
  );
}
