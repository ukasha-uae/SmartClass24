'use client';

import { useState } from 'react';
import { IntelligentWelcome } from '@/components/IntelligentWelcome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  RefreshCw, 
  CheckCircle2,
  Sparkles,
  Volume2,
  Brain
} from 'lucide-react';

export default function WelcomeDemoPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<'JHS' | 'SHS' | 'Primary'>('JHS');
  const [studentName, setStudentName] = useState('Kwame');

  const handleComplete = () => {
    setShowWelcome(false);
    setHasCompleted(true);
  };

  const handleRestart = () => {
    setHasCompleted(false);
    setShowWelcome(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="h-12 w-12 text-violet-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligent Welcome Experience
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Interactive AI-powered teacher guidance using the Intelligent Teacher Voice Method
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary">
              <Volume2 className="h-3 w-3 mr-1" />
              Text-to-Speech
            </Badge>
            <Badge variant="secondary">
              <Brain className="h-3 w-3 mr-1" />
              AI Narration
            </Badge>
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Animations
            </Badge>
          </div>
        </div>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>✨ Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-violet-600" />
                  Intelligent Voice Narration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Curated teacher-style narration that guides students warmly and professionally, not raw text reading.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Multi-Scene Journey
                </h3>
                <p className="text-sm text-muted-foreground">
                  6 carefully crafted scenes that build excitement, explain features, and motivate learning.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  Adaptive Pacing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Auto-advances through scenes with natural pauses, or let students control the pace with next/pause buttons.
                </p>
              </div>

              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-pink-600" />
                  Visual Highlights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Key words highlighted, animated emojis, teacher tips, and progress indicators for engagement.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700">
              <p className="text-sm">
                <strong>🎯 Implementation Note:</strong> This follows the TTS Implementation Standard - 
                using curated, contextual narration instead of literal text reading. Each scene has 
                personality, enthusiasm, and teaching presence!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle>🎮 Try It Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customization Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campus Level</label>
                <div className="flex gap-2">
                  {(['Primary', 'JHS', 'SHS'] as const).map((campus) => (
                    <Button
                      key={campus}
                      variant={selectedCampus === campus ? 'default' : 'outline'}
                      onClick={() => setSelectedCampus(campus)}
                      className="flex-1"
                    >
                      {campus}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setShowWelcome(true)}
                className="flex-1 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Launch Welcome Experience
              </Button>

              {hasCompleted && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleRestart}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Replay
                </Button>
              )}
            </div>

            {/* Completion Status */}
            {hasCompleted && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-medium">
                    Welcome experience completed! Student "{studentName}" is ready to learn 🎉
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Component Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Uses <code>useSpeechSynthesis</code> hook with 0.95 rate and 1.1 pitch for friendly tone</li>
                <li>6 narration scenes with emojis, visual content, and teacher tips</li>
                <li>Auto-play with 800ms pause between scenes for natural pacing</li>
                <li>Framer Motion animations for smooth transitions and engaging visuals</li>
                <li>Responsive controls: play/pause, next, skip all</li>
                <li>Progress bar showing journey completion</li>
                <li>Graceful fallback for browsers without speech synthesis</li>
                <li>Customizable: accepts studentName, campus level, and onComplete callback</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{`<IntelligentWelcome
  studentName="${studentName}"
  campus="${selectedCampus}"
  onComplete={() => {
    // Navigate to dashboard or start lesson
    console.log('Welcome completed!');
  }}
/>`}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Usage Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Usage Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <strong>First-time user onboarding</strong>
                  <p className="text-muted-foreground">
                    Show when a student creates their account or logs in for the first time
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <strong>New campus selection</strong>
                  <p className="text-muted-foreground">
                    Welcome students when they switch from JHS to SHS or start a new academic level
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <strong>Feature introduction</strong>
                  <p className="text-muted-foreground">
                    Introduce new features like challenge arena, study groups, or virtual labs
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <strong>Daily motivation</strong>
                  <p className="text-muted-foreground">
                    Optional: Show a shorter version as a daily motivational greeting
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Component Overlay */}
      {showWelcome && (
        <IntelligentWelcome
          studentName={studentName}
          campus={selectedCampus}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
