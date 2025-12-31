'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Swords, 
  Users, 
  Zap,
  Clock,
  Trophy,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { createChallenge, Challenge, getAllPlayers, Player } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// V1 Route Guard: Redirect to practice if create challenge is disabled
export default function CreateChallengePage() {
  const router = useRouter();
  
  useEffect(() => {
    // V1: Create challenge is not available - redirect to practice
    router.replace('/challenge-arena/practice');
  }, [router]);
  
  return null;
}

// Original component code below (commented out for V1)
/*
export default function CreateChallengePage() {
  const router = useRouter();

const SUBJECTS = [
  { id: 'math', name: 'Maths', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'english', name: 'English', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'science', name: 'Science', icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'social', name: 'Social Studies', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', questions: 5, color: 'text-green-500' },
  { id: 'medium', name: 'Medium', questions: 10, color: 'text-yellow-500' },
  { id: 'hard', name: 'Hard', questions: 15, color: 'text-red-500' },
];

export default function CreateChallengePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useFirebase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    subject: '',
    difficulty: 'medium',
    type: 'quick', // quick, friend
    opponentId: '',
  });

  useEffect(() => {
    const userId = user?.uid || 'test-user-1';
    const allPlayers = getAllPlayers();
    setFriends(allPlayers.filter(p => p.userId !== userId));
  }, [user]);

  const filteredFriends = friends.filter(friend => 
    friend.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFriend = friends.find(f => f.userId === formData.opponentId);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const userId = user?.uid || 'test-user-1';
      const currentUser = { id: userId, name: user?.displayName || user?.email || 'Test Player', school: 'My School' };
      const questionCount = formData.difficulty === 'easy' ? 5 : formData.difficulty === 'medium' ? 10 : 15;
      const timeLimit = formData.difficulty === 'easy' ? 30 : formData.difficulty === 'medium' ? 45 : 60;
      
      let opponents: any[] = [];
      if (formData.type === 'friend' && formData.opponentId) {
        const friend = friends.find(f => f.userId === formData.opponentId);
        if (friend) {
          opponents = [{ userId: friend.userId, userName: friend.userName, school: friend.school, status: 'invited' as const }];
        }
      }

      const challenge = createChallenge({
        type: formData.type as any,
        level: 'JHS',
        subject: formData.subject,
        difficulty: formData.difficulty as any,
        questionCount,
        timeLimit,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorSchool: currentUser.school,
        opponents,
        maxPlayers: 2,
      });

      toast({ title: 'Challenge Created!', description: 'Get ready to battle!' });
      router.push(`/challenge-arena/play/${challenge.id}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create challenge', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!formData.subject;
    if (step === 2) return true; // difficulty always selected
    if (step === 3) return formData.type === 'quick' || (formData.type === 'friend' && formData.opponentId);
    return true;
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleCreate();
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            Challenge Arena
          </h1>
          <span className="text-sm text-muted-foreground">Step {step} of 3</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
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
              <CardDescription>What do you want to battle in?</CardDescription>
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
                      <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Difficulty & Type */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Battle Settings</CardTitle>
              <CardDescription>Choose difficulty and opponent type</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Difficulty - Compact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Difficulty</Label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-center transition-all ${
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
              </div>
              
              {/* Challenge Type - Compact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Opponent</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.type === 'quick' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'quick', opponentId: '' })}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-sm">Quick Match</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Random opponent</p>
                  </button>
                  <button
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.type === 'friend' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'friend' })}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-sm">Challenge Friend</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Pick a friend</p>
                  </button>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 3: Friend Selection OR Confirmation */}
        {step === 3 && (
          <div className="animate-in fade-in duration-200">
            {formData.type === 'friend' ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Select Friend</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-9 h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {filteredFriends.map((friend) => (
                      <button
                        key={friend.userId}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${
                          formData.opponentId === friend.userId 
                            ? 'border-primary bg-primary/5' 
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        }`}
                        onClick={() => setFormData({ ...formData, opponentId: friend.userId })}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{friend.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left overflow-hidden">
                          <p className="font-medium text-sm truncate">{friend.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{friend.school}</p>
                        </div>
                        {formData.opponentId === friend.userId && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                    {filteredFriends.length === 0 && (
                      <p className="text-center py-6 text-sm text-muted-foreground">No friends found</p>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ready to Battle!</CardTitle>
                  <CardDescription>Review your challenge settings</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subject</span>
                      <span className="font-medium text-sm">{SUBJECTS.find(s => s.id === formData.subject)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <span className="font-medium text-sm capitalize">{formData.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Questions</span>
                      <span className="font-medium text-sm">{DIFFICULTIES.find(d => d.id === formData.difficulty)?.questions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Opponent</span>
                      <span className="font-medium text-sm">Random Match</span>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
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
            {loading ? 'Creating...' : step === 3 ? 'Start Challenge' : 'Next'}
            {!loading && step < 3 && <ArrowRight className="h-4 w-4" />}
            {!loading && step === 3 && <Swords className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Summary Preview (always visible) */}
      {formData.subject && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded-full">{SUBJECTS.find(s => s.id === formData.subject)?.name}</span>
          <span className="bg-muted px-2 py-1 rounded-full capitalize">{formData.difficulty}</span>
          <span className="bg-muted px-2 py-1 rounded-full">{formData.type === 'quick' ? 'Quick Match' : selectedFriend?.userName || 'Select friend'}</span>
        </div>
      )}
    </div>
  );
}
