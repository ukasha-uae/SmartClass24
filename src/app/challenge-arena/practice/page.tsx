'use client';

// Disable static generation to allow useSearchParams
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Loader2,
  Languages,
  Palette,
  Computer,
  Music
} from 'lucide-react';
import { createChallenge, getPrimaryPromotionInfo, getPrimaryPromotionProgress } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { getAvailableSubjects, type EducationLevel } from '@/lib/challenge-questions-exports';
import { PromotionProgress } from '@/components/promotion/PromotionProgress';
import { PromotionNotification } from '@/components/promotion/PromotionNotification';

// Get class levels based on education level
const getClassLevels = (level: 'Primary' | 'JHS' | 'SHS') => {
  if (level === 'Primary') {
    return [
      { id: 'Primary 1', name: 'Primary 1', questions: 5, time: '~5 min', color: 'text-green-500' },
      { id: 'Primary 2', name: 'Primary 2', questions: 5, time: '~5 min', color: 'text-green-500' },
      { id: 'Primary 3', name: 'Primary 3', questions: 10, time: '~10 min', color: 'text-yellow-500' },
      { id: 'Primary 4', name: 'Primary 4', questions: 10, time: '~10 min', color: 'text-yellow-500' },
      { id: 'Primary 5', name: 'Primary 5', questions: 15, time: '~15 min', color: 'text-red-500' },
      { id: 'Primary 6', name: 'Primary 6', questions: 15, time: '~15 min', color: 'text-red-500' },
    ];
  } else if (level === 'JHS') {
    return [
      { id: 'JHS 1', name: 'JHS 1', questions: 5, time: '~5 min', color: 'text-green-500' },
      { id: 'JHS 2', name: 'JHS 2', questions: 10, time: '~10 min', color: 'text-yellow-500' },
      { id: 'JHS 3', name: 'JHS 3', questions: 15, time: '~15 min', color: 'text-red-500' },
    ];
  } else {
    return [
      { id: 'SHS 1', name: 'SHS 1', questions: 5, time: '~5 min', color: 'text-green-500' },
      { id: 'SHS 2', name: 'SHS 2', questions: 10, time: '~10 min', color: 'text-yellow-500' },
      { id: 'SHS 3', name: 'SHS 3', questions: 15, time: '~15 min', color: 'text-red-500' },
    ];
  }
};

// Subject icon mapping
const getSubjectIcon = (subject: string) => {
  const subjectLower = subject.toLowerCase();
  if (subjectLower.includes('math')) return Calculator;
  if (subjectLower.includes('english') || subjectLower.includes('language')) return BookOpen;
  if (subjectLower.includes('science') || subjectLower.includes('integrated')) return FlaskConical;
  if (subjectLower.includes('social')) return Globe;
  if (subjectLower.includes('ict') || subjectLower.includes('computing')) return Computer;
  if (subjectLower.includes('creative') || subjectLower.includes('arts')) return Palette;
  if (subjectLower.includes('french')) return Languages;
  if (subjectLower.includes('arabic')) return Languages;
  if (subjectLower.includes('music')) return Music;
  return BookOpen;
};

// Subject color mapping
const getSubjectColor = (subject: string, index: number) => {
  const colors = [
    'text-blue-500',
    'text-green-500',
    'text-orange-500',
    'text-purple-500',
    'text-yellow-500',
    'text-indigo-500',
    'text-teal-500',
    'text-rose-500',
  ];
  return colors[index % colors.length];
};

const getSubjectBg = (subject: string, index: number) => {
  const colors = [
    'bg-blue-500/10',
    'bg-green-500/10',
    'bg-orange-500/10',
    'bg-purple-500/10',
    'bg-yellow-500/10',
    'bg-indigo-500/10',
    'bg-teal-500/10',
    'bg-rose-500/10',
  ];
  return colors[index % colors.length];
};

export default function PracticeModePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useFirebase();
  
  // Get level and subject from URL params
  const levelParam = searchParams.get('level') as EducationLevel | null;
  const subjectParam = searchParams.get('subject');
  
  const [level, setLevel] = useState<EducationLevel>(levelParam || 'JHS');
  const [step, setStep] = useState(subjectParam ? 2 : 1); // Skip to step 2 if subject is provided
  const [loading, setLoading] = useState(false);
  const [showPromotionNotification, setShowPromotionNotification] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState<{from: string; to: string; subject: string} | null>(null);
  
  // Get available subjects for the selected level
  const availableSubjects = useMemo(() => {
    return getAvailableSubjects(level).filter(s => s !== 'Mixed');
  }, [level]);
  
  // Create subject objects with icons
  const subjects = useMemo(() => {
    return availableSubjects.map((subject, index) => ({
      id: subject.toLowerCase().replace(/\s+/g, '-'),
      name: subject,
      icon: getSubjectIcon(subject),
      color: getSubjectColor(subject, index),
      bg: getSubjectBg(subject, index),
    }));
  }, [availableSubjects]);
  
  // Auto-select appropriate class level based on education level
  const getDefaultClassLevel = (eduLevel: EducationLevel): string => {
    if (eduLevel === 'JHS') return 'JHS 1';
    if (eduLevel === 'SHS') return 'SHS 1';
    return 'Primary 1';
  };

  const [formData, setFormData] = useState({
    subject: subjectParam ? subjectParam : '',
    classLevel: getDefaultClassLevel(level),
  });
  
  // Get class levels for the selected education level
  const classLevels = useMemo(() => getClassLevels(level), [level]);
  
  // Update formData when subjectParam changes - auto-advance to step 2
  useEffect(() => {
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
      setStep(2); // Automatically advance to class level selection
    }
  }, [subjectParam]);

  // Auto-advance to step 2 when subject is selected manually
  useEffect(() => {
    if (formData.subject && step === 1) {
      // Small delay to show selection feedback before advancing
      const timer = setTimeout(() => {
        setStep(2);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData.subject, step]);

  // Ensure class level is set when level changes
  useEffect(() => {
    if (!formData.classLevel || !formData.classLevel.startsWith(level)) {
      setFormData(prev => ({ ...prev, classLevel: getDefaultClassLevel(level) }));
    }
  }, [level]);
  
  // Update level when levelParam changes - ensure it's always in sync
  useEffect(() => {
    if (levelParam && ['Primary', 'JHS', 'SHS'].includes(levelParam)) {
      setLevel(levelParam);
      // Also update class level to match the new level
      setFormData(prev => ({ ...prev, classLevel: getDefaultClassLevel(levelParam) }));
    }
  }, [levelParam]);

  const handleStartPractice = async () => {
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    
    setLoading(true);
    try {
      // Ensure class level is set - default to appropriate level for education level
      let selectedClassLevel = formData.classLevel;
      if (!selectedClassLevel || !selectedClassLevel.startsWith(level)) {
        selectedClassLevel = getDefaultClassLevel(level);
        setFormData(prev => ({ ...prev, classLevel: selectedClassLevel }));
      }

      // Use the subject name directly (it's already the full name from getAvailableSubjects)
      const selectedSubject = formData.subject || subjects[0]?.name || 'Mathematics';

      // Check for promotion (Primary level only for now)
      if (level === 'Primary') {
        const promotionInfo = getPrimaryPromotionInfo(userId, selectedSubject, selectedClassLevel);
        if (promotionInfo.wasPromoted && promotionInfo.effectiveLevel !== selectedClassLevel) {
          setPromotionInfo({
            from: selectedClassLevel,
            to: promotionInfo.effectiveLevel,
            subject: selectedSubject,
          });
          setShowPromotionNotification(true);
          // Use the effective (promoted) level for question generation
          selectedClassLevel = promotionInfo.effectiveLevel;
        }
      }

      // Get question count from class level
      const classLevelData = classLevels.find(cl => cl.id === selectedClassLevel);
      const questionCount = classLevelData?.questions || 10;
      const timeLimit = 300;

      const challenge = createChallenge({
        type: 'practice',
        level: level,
        subject: selectedSubject,
        difficulty: selectedClassLevel as any,
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
    if (step === 2) {
      // Always allow proceeding - will auto-select default class level if none chosen
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else handleStartPractice();
  };

  const selectedClassLevel = classLevels.find(cl => cl.id === formData.classLevel);

  // Get promotion progress for Primary level
  const promotionProgress = useMemo(() => {
    if (level === 'Primary' && formData.subject && user?.uid) {
      return getPrimaryPromotionProgress(user.uid, formData.subject, formData.classLevel);
    }
    return null;
  }, [level, formData.subject, formData.classLevel, user?.uid]);

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
          
          {/* Level Selector (if no level in URL) */}
          {!levelParam && (
            <div className="mt-4 flex gap-2 justify-center sm:justify-start">
              {(['Primary', 'JHS', 'SHS'] as EducationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevel(lvl);
                    setFormData({ ...formData, subject: '' }); // Reset subject when level changes
                    setStep(1); // Go back to step 1
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    level === lvl
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
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
                {subjects.map((subject) => {
                  const isSelected = formData.subject === subject.name;
                  return (
                    <button
                      key={subject.id}
                      className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all overflow-hidden hover:scale-105 ${
                        isSelected
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg' 
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700'
                      }`}
                      onClick={() => {
                        setFormData({ ...formData, subject: subject.name });
                        // Auto-advance to step 2 after selection
                        setTimeout(() => setStep(2), 300);
                      }}
                    >
                      <div className={`p-3 rounded-lg shrink-0 ${subject.bg} group-hover:scale-110 transition-transform`}>
                        <subject.icon className={`h-6 w-6 ${subject.color}`} />
                      </div>
                      <span className="font-semibold text-sm sm:text-base truncate flex-1 text-left">{subject.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 animate-in zoom-in" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Difficulty & Confirmation */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Select Class Level
              </CardTitle>
              <CardDescription className="text-base">
                Choose your class level ({level}) - {formData.classLevel} is pre-selected
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Promotion Notification */}
              {showPromotionNotification && promotionInfo && (
                <PromotionNotification
                  fromLevel={promotionInfo.from}
                  toLevel={promotionInfo.to}
                  subject={promotionInfo.subject}
                  onDismiss={() => setShowPromotionNotification(false)}
                />
              )}

              {/* Promotion Progress (Primary level only) */}
              {promotionProgress && (
                <PromotionProgress progress={promotionProgress} subject={formData.subject} />
              )}
              {/* Premium Class Level Cards */}
              <div className={`grid gap-3 sm:gap-4 ${classLevels.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {classLevels.map((cl) => {
                  const isSelected = formData.classLevel === cl.id;
                  const isEasy = cl.id.includes('1') || cl.id.includes('2');
                  const isMedium = cl.id.includes('3') || cl.id.includes('4');
                  const isHard = cl.id.includes('5') || cl.id.includes('6') || cl.id.includes('3') && (level === 'JHS' || level === 'SHS');
                  
                  return (
                    <button
                      key={cl.id}
                      className={`group relative py-4 px-3 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                        isSelected 
                          ? isEasy
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg'
                            : isMedium
                            ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 shadow-lg'
                            : 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      onClick={() => setFormData({ ...formData, classLevel: cl.id })}
                    >
                      <div className={`font-bold text-base sm:text-lg mb-1 ${cl.color}`}>{cl.name}</div>
                      <div className="text-xs text-muted-foreground">{cl.questions} Questions</div>
                      <div className="text-xs text-muted-foreground mt-1">{cl.time}</div>
                    </button>
                  );
                })}
              </div>

              {/* Premium Summary Preview */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 sm:p-6 space-y-4 border-2 border-green-200/50 dark:border-green-800/50">
                <h3 className="font-bold text-lg text-center mb-4">Practice Session Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Target className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <div className="text-xs text-muted-foreground mb-1">Subject</div>
                    <div className="font-bold text-sm">{formData.subject || 'Not selected'}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Zap className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                    <div className="text-xs text-muted-foreground mb-1">Questions</div>
                    <div className="font-bold text-sm">{selectedClassLevel?.questions}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-xs text-muted-foreground mb-1">Est. Time</div>
                    <div className="font-bold text-sm">{selectedClassLevel?.time}</div>
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
          <span className="bg-muted px-2 py-1 rounded-full">{formData.subject}</span>
          <span className="bg-muted px-2 py-1 rounded-full">{formData.classLevel}</span>
          <span className="bg-muted px-2 py-1 rounded-full">{selectedClassLevel?.questions} questions</span>
          <span className="bg-muted px-2 py-1 rounded-full">{level}</span>
        </div>
      )}
      </div>
    </div>
  );
}
