'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  School, 
  Trophy, 
  Swords, 
  Users, 
  TrendingUp, 
  Target,
  Crown,
  Medal,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  getSchoolRankings, 
  getPlayerProfile, 
  createChallenge, 
  SchoolRanking, 
  Player 
} from '@/lib/challenge';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useTenant } from '@/hooks/useTenant';
import { getAvailableSubjects } from '@/lib/challenge-questions-exports';
import type { EducationLevel } from '@/lib/challenge-questions-exports';
import { getSchoolsByCountry, getAllMultiCountrySchools } from '@/lib/schools-multi-country';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { useEntitlements } from '@/hooks/useEntitlements';
import { FeatureSoftGate } from '@/components/access/FeatureSoftGate';

export default function SchoolBattlePage() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  const { hasArenaChallenge } = useTenant();
  
  const { toast } = useToast();
  const { country } = useLocalization();
  const { user } = useFirebase();
  const entitlements = useEntitlements();
  
  // Tenant Route Guard: Check if arena is enabled for this tenant
  useEffect(() => {
    if (!hasArenaChallenge) {
      router.replace(addTenantParam('/'));
    }
  }, [hasArenaChallenge, router, addTenantParam]);
  
  // V1 Route Guard: Check feature flag (premium check removed for V1)
  useEffect(() => {
    if (!FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaSchool) {
      router.replace(addTenantParam('/challenge-arena/practice'));
    }
  }, [router, addTenantParam]);

  if (!entitlements.isResolved) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        <p className="text-sm text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  if (!entitlements.canAccess.schoolBattle) {
    return (
      <FeatureSoftGate
        title="School Battle Is Premium"
        description="School-vs-school competition is available to premium users and learners under active institution licenses."
        ctaHref={addTenantParam('/pricing')}
        ctaLabel="View Pricing"
        secondaryHref={addTenantParam('/challenge-arena')}
        secondaryLabel="Back to Arena"
        auditFeature="arena_school_battle"
        auditRoute="/challenge-arena/school-battle"
      />
    );
  }
  const [rankings, setRankings] = useState<SchoolRanking[]>([]);
  const [mySchool, setMySchool] = useState<SchoolRanking | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedRivalSchool, setSelectedRivalSchool] = useState<string>('');
  const [showSchoolSelector, setShowSchoolSelector] = useState(false);

  useEffect(() => {
    // Load data
    const userId = user?.uid || `anon-${Date.now()}`;
    const allRankings = getSchoolRankings();
    const currentPlayer = getPlayerProfile(userId);
    setPlayer(currentPlayer);
    
    if (currentPlayer && country) {
      // Filter rankings by education level (JHS or SHS) and country
      const playerLevel = currentPlayer.level || 'JHS';
      const countryId = country.id as 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia';
      const countrySchools = getSchoolsByCountry(countryId);
      const schoolsOfSameLevel = countrySchools.filter(school => school.type === playerLevel).map(s => s.name);
      const filteredRankings = allRankings.filter(r => schoolsOfSameLevel.includes(r.school));
      setRankings(filteredRankings);
      
      const schoolData = filteredRankings.find(r => r.school === currentPlayer.school);
      setMySchool(schoolData || null);
      
      // Set default subject based on player level (dynamic from question bank)
      const subjects = getAvailableSubjects(playerLevel as EducationLevel);
      setSelectedSubject(subjects[0]);
    }
  }, [country, user]);

  const handleStartBattle = async () => {
    if (!player?.isVerified) {
      toast({
        title: 'Verification Required',
        description: 'You must verify your student status to represent your school.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRivalSchool) {
      toast({
        title: 'Select Rival School',
        description: 'Please choose which school you want to challenge!',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Get the selected rival school
      const rivalSchool = rankings.find(r => r.school === selectedRivalSchool);
      
      // Create AI opponent from selected rival school
      const aiOpponent = {
        userId: `ai-${rivalSchool?.school || 'rival'}-${Date.now()}`,
        userName: `${rivalSchool?.school || 'Rival School'} Champion`,
        school: rivalSchool?.school || 'Rival School',
        status: 'accepted' as const,
        acceptedAt: new Date().toISOString(),
      };
      
      const challenge = createChallenge({
        type: 'school',
        level: player?.level || 'JHS',
        subject: selectedSubject, // Use selected subject
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 45,
        creatorId: player?.userId || user?.uid || `anon-${Date.now()}`,
        creatorName: player?.userName || 'Unknown',
        creatorSchool: player?.school || 'Unknown',
        opponents: [aiOpponent], // Add AI opponent
        maxPlayers: 2,
      });

      toast({
        title: 'Matched with Rival School!',
        description: `You'll be battling ${rivalSchool?.school || 'a rival school'}!`,
      });

      // Shorter delay since opponent is ready
      setTimeout(() => {
        router.push(`/challenge-arena/play/${challenge.id}`);
      }, 1000);
      
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to start battle',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (!player) return null;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <School className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              School Battle Arena
              {country && <span className="text-2xl">{country.flag}</span>}
            </h1>
            <p className="text-muted-foreground">Defend your school's honor in {country?.name || 'your country'}!</p>
          </div>
        </div>
      </div>

      {/* Country Info Banner */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                🎯 You're competing with schools in <strong>{country?.name || 'your country'}</strong>. 
                Want to see other countries? Use the country selector in the main Arena page!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!player.isVerified && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>
              To prevent mischief and ensure fair play, you must verify your student status before representing <strong>{player.school}</strong>.
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-red-50 border-red-200 text-red-600 whitespace-nowrap"
              onClick={() => {
                // Mock verification for demo
                const updatedPlayer = { ...player, isVerified: true };
                localStorage.setItem('challengePlayers', JSON.stringify([
                  updatedPlayer,
                  ...getSchoolRankings().flatMap(() => []) // This is just a placeholder, real update logic needed
                ]));
                // For demo simplicity, we just reload to pick up the change or update state
                // In a real app, this would open a modal to upload ID card
                setPlayer(updatedPlayer);
                toast({
                  title: "Verification Successful",
                  description: "You are now a verified student of " + player.school,
                });
              }}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* My School Stats */}
        <Card className="md:col-span-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {player.school}
                  {player.isVerified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                  {mySchool?.rank === 1 && <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
                </h2>
                <p className="text-muted-foreground">Your Contribution: {player.wins * 3} pts</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">#{mySchool?.rank || '-'}</div>
                <div className="text-sm text-muted-foreground">{country?.name || 'National'} Rank</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-background/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4" />
                  <span>Points</span>
                </div>
                <p className="text-2xl font-bold">{mySchool?.points || 0}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </div>
                <p className="text-2xl font-bold">{mySchool?.totalStudents || 0}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Swords className="h-4 w-4" />
                  <span>Wins</span>
                </div>
                <p className="text-2xl font-bold">{mySchool?.totalWins || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Rival School</label>
                <Select 
                  value={selectedRivalSchool} 
                  onValueChange={setSelectedRivalSchool}
                  disabled={!player.isVerified}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select school to challenge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {rankings
                      .filter(r => r.school !== player?.school)
                      .sort((a, b) => a.rank - b.rank)
                      .map((school) => (
                        <SelectItem key={school.school} value={school.school}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{school.school}</span>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant="outline" className="text-xs">
                                #{school.rank}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {school.points} pts
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Battle Subject</label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject}
                  disabled={!player.isVerified}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSubjects((player?.level || 'JHS') as EducationLevel).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                onClick={handleStartBattle}
                disabled={loading || !player.isVerified || !selectedRivalSchool}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Starting Battle...</span>
                  </div>
                ) : !player.isVerified ? (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verify to Battle
                  </>
                ) : (
                  <>
                    <Swords className="mr-2 h-5 w-5" />
                    Challenge {selectedRivalSchool ? selectedRivalSchool : 'School'}!
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Rival */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              Top Rival
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.length > 1 ? (
              <div className="text-center py-4">
                <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <School className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {rankings.find(r => r.school !== player.school)?.school}
                </h3>
                <Badge variant="secondary" className="mb-4">Rank #{rankings.find(r => r.school !== player.school)?.rank}</Badge>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points Gap</span>
                    <span className="font-bold text-red-600">
                      {Math.abs((mySchool?.points || 0) - (rankings.find(r => r.school !== player.school)?.points || 0))}
                    </span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Win 5 more battles to overtake them!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No rivals found yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Challenge - Featured Rivalries */}
      {rankings.length > 3 && (
        <Card className="mb-6 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-orange-600" />
              Quick Challenge - Featured Rivals
            </CardTitle>
            <CardDescription>
              Challenge top schools and climb the rankings!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rankings
                .filter(r => r.school !== player?.school)
                .slice(0, 3)
                .map((school) => (
                  <Card 
                    key={school.school}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      selectedRivalSchool === school.school 
                        ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/30' 
                        : ''
                    }`}
                    onClick={() => setSelectedRivalSchool(school.school)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                          school.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                          school.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          school.rank === 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-background'
                        }`}>
                          #{school.rank}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-tight">{school.school}</h4>
                          <p className="text-xs text-muted-foreground">{school.totalWins} wins</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-bold">{school.points}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* National School Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            School Leaderboard
          </CardTitle>
          <CardDescription>Top performing schools in Ghana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.map((school, index) => (
              <div 
                key={school.school}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  school.school === player.school 
                    ? 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800' 
                    : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold">{school.school}</p>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {school.totalStudents}
                      </span>
                      <span className="flex items-center gap-1">
                        <Swords className="h-3 w-3" /> {school.totalWins} wins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{school.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
