'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Zap,
  BrainCircuit,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';
import { createChallenge } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';

const SUBJECTS = [
  { id: 'math', name: 'Maths', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'english', name: 'English', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'science', name: 'Science', icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'social', name: 'Social Studies', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', questions: 5, time: '~5 min', color: 'text-green-500' },
  { id: 'medium', name: 'Medium', questions: 10, time: '~10 min', color: 'text-yellow-500' },
  { id: 'hard', name: 'Hard', questions: 15, time: '~15 min', color: 'text-red-500' },
];

export default function PracticeModePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useFirebase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    difficulty: 'medium',
  });

  const handleStartPractice = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to start practice.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      const questionCount = formData.difficulty === 'easy' ? 5 : formData.difficulty === 'medium' ? 10 : 15;
      const timeLimit = 300;

      const selectedSubject = SUBJECTS.find(s => s.id === formData.subject)?.name || 'Mathematics';

      const challenge = createChallenge({
        type: 'practice',
        level: 'JHS',
        subject: selectedSubject,
        difficulty: formData.difficulty as any,
        questionCount,
        timeLimit,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Player',
        creatorSchool: 'Practice Mode',
        opponents: [],
        maxPlayers: 1,
      });

      toast({ title: 'Practice Session Started', description: 'Good luck!' });
      router.push(`/challenge-arena/play/${challenge.id}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to start practice session', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!formData.subject;
    return true;
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else handleStartPractice();
  };

  const selectedDiff = DIFFICULTIES.find(d => d.id === formData.difficulty);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Practice Mode
          </h1>
          <span className="text-sm text-muted-foreground">Step {step} of 2</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Step 1: Subject */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Subject</CardTitle>
              <CardDescription>What do you want to practice?</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all overflow-hidden ${
                      formData.subject === subject.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, subject: subject.id })}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${subject.bg}`}>
                      <subject.icon className={`h-5 w-5 ${subject.color}`} />
                    </div>
                    <span className="font-medium text-sm truncate flex-1 text-left">{subject.name}</span>
                    {formData.subject === subject.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Difficulty & Confirmation */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Difficulty</CardTitle>
              <CardDescription>Choose your challenge level</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Difficulty - Compact */}
              <div className="flex gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    className={`flex-1 py-3 px-3 rounded-lg border-2 text-center transition-all ${
                      formData.difficulty === diff.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, difficulty: diff.id })}
                  >
                    <div className={`font-semibold text-sm ${diff.color}`}>{diff.name}</div>
                    <div className="text-xs text-muted-foreground">{diff.questions} Qs</div>
                  </button>
                ))}
              </div>

              {/* Summary Preview */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" /> Subject
                  </span>
                  <span className="font-medium text-sm">{SUBJECTS.find(s => s.id === formData.subject)?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Questions
                  </span>
                  <span className="font-medium text-sm">{selectedDiff?.questions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Est. Time
                  </span>
                  <span className="font-medium text-sm">{selectedDiff?.time}</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                No time pressure • Learn at your own pace • Review explanations
              </p>
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
            disabled={!canProceed() || loading}
            className="gap-1"
          >
            {loading ? 'Starting...' : step === 2 ? 'Start Practice' : 'Next'}
            {!loading && step < 2 && <ArrowRight className="h-4 w-4" />}
            {!loading && step === 2 && <BrainCircuit className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Summary Preview (always visible) */}
      {formData.subject && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded-full">{SUBJECTS.find(s => s.id === formData.subject)?.name}</span>
          <span className="bg-muted px-2 py-1 rounded-full capitalize">{formData.difficulty}</span>
          <span className="bg-muted px-2 py-1 rounded-full">{selectedDiff?.questions} questions</span>
        </div>
      )}
    </div>
  );
}
