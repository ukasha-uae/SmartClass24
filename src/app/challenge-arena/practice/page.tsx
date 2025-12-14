'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Zap,
  BrainCircuit
} from 'lucide-react';
import { createChallenge } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'text-blue-500' },
  { id: 'english', name: 'English Language', icon: BookOpen, color: 'text-green-500' },
  { id: 'science', name: 'Integrated Science', icon: FlaskConical, color: 'text-orange-500' },
  { id: 'social', name: 'Social Studies', icon: Globe, color: 'text-purple-500' },
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', description: 'Basic concepts, 5 questions' },
  { id: 'medium', name: 'Medium', description: 'Standard level, 10 questions' },
  { id: 'hard', name: 'Hard', description: 'Advanced problems, 15 questions' },
];

export default function PracticeModePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useFirebase();
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
      // No strict time limit for practice, but we set a generous one
      const timeLimit = 300; // 5 minutes per question effectively

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
        opponents: [], // No opponents
        maxPlayers: 1,
      });

      toast({
        title: 'Practice Session Started',
        description: 'Good luck!',
      });

      router.push(`/challenge-arena/play/${challenge.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to start practice session',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/challenge-arena')}
          className="mb-4"
        >
          ← Back to Arena
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Practice Mode
        </h1>
        <p className="text-muted-foreground">Sharpen your skills without pressure</p>
      </div>

      <div className="grid gap-6">
        {/* Subject Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Choose Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUBJECTS.map((subject) => (
                <div
                  key={subject.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 hover:bg-muted/50 transition-all ${
                    formData.subject === subject.id ? 'border-primary bg-primary/5' : 'border-transparent bg-card shadow-sm'
                  }`}
                  onClick={() => setFormData({ ...formData, subject: subject.id })}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <subject.icon className={`h-8 w-8 ${subject.color}`} />
                    <span className="font-medium text-sm">{subject.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Select Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.difficulty} 
              onValueChange={(val) => setFormData({ ...formData, difficulty: val })}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {DIFFICULTIES.map((diff) => (
                <div key={diff.id}>
                  <RadioGroupItem value={diff.id} id={diff.id} className="peer sr-only" />
                  <Label
                    htmlFor={diff.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                  >
                    <div className="mb-2">
                      {diff.id === 'easy' && <Zap className="h-6 w-6 text-green-500" />}
                      {diff.id === 'medium' && <Zap className="h-6 w-6 text-yellow-500" />}
                      {diff.id === 'hard' && <Zap className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold capitalize">{diff.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{diff.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Button 
          size="lg" 
          className="w-full md:w-auto md:self-end"
          disabled={!formData.subject || loading}
          onClick={handleStartPractice}
        >
          {loading ? 'Starting...' : 'Start Practice'}
          {!loading && <BrainCircuit className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
