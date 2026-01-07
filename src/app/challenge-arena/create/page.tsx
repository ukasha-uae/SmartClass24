'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Swords, 
  Users, 
  Zap,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Computer,
  Palette,
  Languages,
  Music
} from 'lucide-react';
import { createChallenge, getAllPlayers, Player, getPlayerProfile } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { getAvailableSubjects, type EducationLevel } from '@/lib/challenge-questions';
import { useMemo } from 'react';

// Create challenge page is now enabled for friend challenges
export default function CreateChallengePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, firestore } = useFirebase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get user's education level
  const userLevel = useMemo(() => {
    if (typeof window === 'undefined') return 'JHS';
    const userId = user?.uid || 'test-user-1';
    const player = getPlayerProfile(userId);
    const savedLevel = localStorage.getItem('userEducationLevel');
    return (player?.level || savedLevel || 'JHS') as EducationLevel;
  }, [user]);
  
  // Get available subjects for user's level
  const availableSubjects = useMemo(() => {
    return getAvailableSubjects(userLevel).filter(s => s !== 'Mixed');
  }, [userLevel]);
  
  // Map subjects to UI format with icons
  const getSubjectIcon = (subject: string) => {
    const lower = subject.toLowerCase();
    if (lower.includes('math')) return Calculator;
    if (lower.includes('english') || lower.includes('language')) return BookOpen;
    if (lower.includes('science') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology') || lower.includes('integrated')) return FlaskConical;
    if (lower.includes('social')) return Globe;
    if (lower.includes('ict') || lower.includes('computing')) return Computer;
    if (lower.includes('creative') || lower.includes('arts')) return Palette;
    if (lower.includes('french') || lower.includes('arabic')) return Languages;
    if (lower.includes('music')) return Music;
    return BookOpen;
  };
  
  const getSubjectColor = (subject: string, index: number) => {
    const colors = ['text-blue-500', 'text-green-500', 'text-orange-500', 'text-purple-500', 'text-red-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500'];
    return colors[index % colors.length];
  };
  
  const getSubjectBg = (subject: string, index: number) => {
    const bgs = ['bg-blue-500/10', 'bg-green-500/10', 'bg-orange-500/10', 'bg-purple-500/10', 'bg-red-500/10', 'bg-yellow-500/10', 'bg-pink-500/10', 'bg-indigo-500/10'];
    return bgs[index % bgs.length];
  };
  
  const SUBJECTS = useMemo(() => {
    return availableSubjects.map((subject, index) => ({
      id: subject.toLowerCase().replace(/\s+/g, '-'),
      name: subject,
      icon: getSubjectIcon(subject),
      color: getSubjectColor(subject, index),
      bg: getSubjectBg(subject, index),
    }));
  }, [availableSubjects]);
  
  const [formData, setFormData] = useState({
    subject: '',
    difficulty: 'medium',
    type: 'quick', // quick, friend
    opponentId: '',
  });

  // Query Firestore for real users
  useEffect(() => {
    if (!firestore || !user) return;
    
    const fetchUsers = async () => {
      try {
        const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
        const studentsRef = collection(firestore, 'students');
        // Get up to 50 other users (excluding current user)
        const q = query(studentsRef, limit(50));
        const snapshot = await getDocs(q);
        
        const usersList: Player[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Skip current user
          if (doc.id !== user.uid && data.studentName) {
            usersList.push({
              userId: doc.id,
              userName: data.studentName || 'Student',
              school: data.schoolName || 'Unknown School',
              level: (data.studentClass?.includes('SHS') ? 'SHS' : 
                     data.studentClass?.includes('JHS') ? 'JHS' : 
                     data.studentClass?.includes('Primary') ? 'Primary' : 'JHS') as 'Primary' | 'JHS' | 'SHS',
              rating: 1200,
              wins: 0,
              losses: 0,
              draws: 0,
              totalGames: 0,
              winStreak: 0,
              highestStreak: 0,
              xp: 0,
              achievements: [],
              coins: 0,
            });
          }
        });
        
        // If no real users found, fall back to mock players
        if (usersList.length === 0) {
          const allPlayers = getAllPlayers();
          setFriends(allPlayers.filter(p => p.userId !== user.uid));
        } else {
          setFriends(usersList);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fall back to mock players
        const allPlayers = getAllPlayers();
        setFriends(allPlayers.filter(p => p.userId !== (user?.uid || 'test-user-1')));
      }
    };
    
    fetchUsers();
  }, [firestore, user]);

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

      // Map subject ID back to full subject name
      const subjectName = SUBJECTS.find(s => s.id === formData.subject)?.name || formData.subject;
      
      const challenge = createChallenge({
        type: formData.type as any,
        level: userLevel,
        subject: subjectName,
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

  const DIFFICULTIES = [
    { id: 'easy', name: 'Easy', questions: 5, color: 'text-green-500' },
    { id: 'medium', name: 'Medium', questions: 10, color: 'text-yellow-500' },
    { id: 'hard', name: 'Hard', questions: 15, color: 'text-red-500' },
  ];

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
