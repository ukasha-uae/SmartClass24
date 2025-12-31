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
  Target,
  Loader2
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
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    
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
        creatorId: userId,
        creatorName: user?.displayName || user?.email || 'Player',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-950 dark:to-emerald-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-300/20 via-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 via-cyan-300/20 to-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto p-4 md:p-6 max-w-2xl relative z-10 pb-20">
        {/* Premium Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
            <div className="text-5xl sm:text-6xl animate-pulse">🧠</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Practice Mode
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center sm:text-left">
            Sharpen your skills without affecting your rating
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Step {step} of 2</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{Math.round((step / 2) * 100)}% Complete</span>
          </div>
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-green-200/30 dark:border-green-800/30 shadow-2xl">
        {/* Step 1: Subject */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Choose Subject
              </CardTitle>
              <CardDescription className="text-base">What do you want to practice?</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all overflow-hidden hover:scale-105 ${
                      formData.subject === subject.id 
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                    onClick={() => setFormData({ ...formData, subject: subject.id })}
                  >
                    <div className={`p-3 rounded-lg shrink-0 ${subject.bg} group-hover:scale-110 transition-transform`}>
                      <subject.icon className={`h-6 w-6 ${subject.color}`} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base truncate flex-1 text-left">{subject.name}</span>
                    {formData.subject === subject.id && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 animate-in zoom-in" />
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
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Select Difficulty
              </CardTitle>
              <CardDescription className="text-base">Choose your challenge level</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Premium Difficulty Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    className={`group relative py-4 px-3 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                      formData.difficulty === diff.id 
                        ? diff.id === 'easy'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg'
                          : diff.id === 'medium'
                          ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 shadow-lg'
                          : 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => setFormData({ ...formData, difficulty: diff.id })}
                  >
                    <div className={`font-bold text-base sm:text-lg mb-1 ${diff.color}`}>{diff.name}</div>
                    <div className="text-xs text-muted-foreground">{diff.questions} Questions</div>
                    <div className="text-xs text-muted-foreground mt-1">{diff.time}</div>
                  </button>
                ))}
              </div>

              {/* Premium Summary Preview */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 sm:p-6 space-y-4 border-2 border-green-200/50 dark:border-green-800/50">
                <h3 className="font-bold text-lg text-center mb-4">Practice Session Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Target className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <div className="text-xs text-muted-foreground mb-1">Subject</div>
                    <div className="font-bold text-sm">{SUBJECTS.find(s => s.id === formData.subject)?.name}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Zap className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                    <div className="text-xs text-muted-foreground mb-1">Questions</div>
                    <div className="font-bold text-sm">{selectedDiff?.questions}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-xs text-muted-foreground mb-1">Est. Time</div>
                    <div className="font-bold text-sm">{selectedDiff?.time}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-xs sm:text-sm text-center text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">✨ Practice Benefits:</span> No time pressure • Learn at your own pace • Review explanations • No rating impact
                </p>
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
            size="lg"
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className={`gap-2 font-bold text-base sm:text-lg h-12 sm:h-14 ${
              step === 2
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting...
              </>
            ) : step === 2 ? (
              <>
                <BrainCircuit className="h-5 w-5" />
                Start Practice
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-5 w-5" />
              </>
            )}
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
    </div>
  );
}
