'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Zap, Calendar, Users, Target, TrendingUp, 
  Clock, Award, Play, Plus, Eye, Swords, School, Bell,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import {
  getPlayerProfile,
  createOrUpdatePlayer,
  getMyChallenges,
  getChallengeNotifications,
  getSchoolRankings,
  getMatchHistory,
  initializeChallengeData,
  getAllPlayers,
  Player,
  Challenge,
  SchoolRanking,
} from '@/lib/challenge';
import { GamificationProfile } from '@/components/GamificationProfile';
import { getLevel } from '@/lib/gamification';
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import CampusSelector from '@/components/CampusSelector';
import { useLocalization } from '@/hooks/useLocalization';
import CountrySelector from '@/components/CountrySelector';
import { useParams, notFound, useRouter } from 'next/navigation';
import { COUNTRIES } from '@/lib/localization/countries/index';

export default function LocalizedChallengeArenaPage() {
  const params = useParams();
  const router = useRouter();
  const countryParam = params.country as string;
  
  // Validate country parameter
  const isValidCountry = Object.keys(COUNTRIES).includes(countryParam?.toLowerCase());
  if (!isValidCountry) {
    notFound();
  }

  const { country, setCountry } = useLocalization();
  const [player, setPlayer] = useState<Player | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [schoolRankings, setSchoolRankings] = useState<SchoolRanking[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('play');
  const [educationLevel, setEducationLevel] = useState<'Primary' | 'JHS' | 'SHS'>('Primary');
  const [hasInitialized, setHasInitialized] = useState(false);

  const { firestore, user } = useFirebase();
  const profileRef = useMemo(() => (user && firestore) ? doc(firestore, `students/${user.uid}`) : null, [user, firestore]);
  const { data: userProfile } = useDoc(profileRef);

  // Set country from URL parameter (only on initial load)
  useEffect(() => {
    const matchedCountry = COUNTRIES[countryParam];
    if (matchedCountry && (!country || country.id !== countryParam)) {
      setCountry(countryParam);
    }
  }, [countryParam, setCountry]);

  // Handle country changes from CountrySelector - navigate to new URL
  useEffect(() => {
    if (country && country.id !== countryParam) {
      router.push(`/challenge-arena/${country.id}`);
    }
  }, [country, countryParam, router]);

  // Country-specific color theming
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-green-700 to-emerald-800',
        accent: 'from-emerald-500 to-green-600',
        cardBg: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
        flag: '🇳🇬',
        tagline: "Nigeria's Challenge Arena"
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        secondary: 'from-yellow-500 to-orange-500',
        accent: 'from-green-600 to-green-700',
        cardBg: 'from-red-50 to-yellow-50 dark:from-red-950/30 dark:to-yellow-950/30',
        flag: '🇬🇭',
        tagline: "Ghana's Challenge Arena"
      };
    } else if (country?.id === 'sierra-leone') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-blue-600 to-blue-700',
        accent: 'from-blue-500 to-green-600',
        cardBg: 'from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30',
        flag: '🇸🇱',
        tagline: "Sierra Leone's Challenge Arena"
      };
    } else if (country?.id === 'liberia') {
      return {
        primary: 'from-red-600 to-blue-700',
        secondary: 'from-blue-700 to-red-800',
        accent: 'from-blue-500 to-red-600',
        cardBg: 'from-red-50 to-blue-50 dark:from-red-950/30 dark:to-blue-950/30',
        flag: '🇱🇷',
        tagline: "Liberia's Challenge Arena"
      };
    } else if (country?.id === 'gambia') {
      return {
        primary: 'from-red-600 to-blue-700',
        secondary: 'from-blue-700 to-green-800',
        accent: 'from-green-500 to-blue-600',
        cardBg: 'from-red-50 to-green-50 dark:from-red-950/30 dark:to-green-950/30',
        flag: '🇬🇲',
        tagline: "Gambia's Challenge Arena"
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-indigo-600 to-purple-600',
      accent: 'from-violet-500 to-purple-600',
      cardBg: 'from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30',
      flag: '🌍',
      tagline: 'Challenge Arena'
    };
  };

  const colors = getCountryColors();

  useEffect(() => {
    if (!user || hasInitialized) return;
    
    initializeChallengeData();
    loadData();
    setHasInitialized(true);
  }, [user, hasInitialized]);

  const handleLevelChange = useCallback((newLevel: 'Primary' | 'JHS' | 'SHS') => {
    setEducationLevel(newLevel);
    if (player && user) {
      const updatedPlayer = createOrUpdatePlayer({
        ...player,
        level: newLevel
      });
      setPlayer(updatedPlayer);
    }
  }, [player, user]);

  const loadData = useCallback(() => {
    if (!user) return;

    const uid = user.uid;
    
    // Detect education level from user profile or stored data
    let detectedLevel: 'Primary' | 'JHS' | 'SHS' = 'Primary';
    
    if (userProfile) {
      const campus = userProfile.campus?.toLowerCase();
      if (campus) {
        if (campus.includes('primary')) {
          detectedLevel = 'Primary';
        } else if (campus.includes('jhs') || campus.includes('jss') || campus.includes('junior')) {
          detectedLevel = 'JHS';
        } else if (campus.includes('shs') || campus.includes('sss') || campus.includes('senior')) {
          detectedLevel = 'SHS';
        }
      }
    } else if (typeof window !== 'undefined') {
      const storedLevel = localStorage.getItem('userEducationLevel');
      if (storedLevel === 'Primary' || storedLevel === 'JHS' || storedLevel === 'SHS') {
        detectedLevel = storedLevel;
      } else if (storedLevel) {
        detectedLevel = 'SHS';
      }
    }

    // Update state with detected level
    setEducationLevel(detectedLevel);

    // Create or get player profile
    const playerProfile = createOrUpdatePlayer({
      userId: uid,
      userName: userProfile?.studentName || 'Student',
      school: userProfile?.schoolName || 'My School',
      avatar: userProfile?.profilePictureUrl,
      level: detectedLevel
    });
    
    setPlayer(playerProfile);

    setChallenges(getMyChallenges(uid));
    setNotifications(getChallengeNotifications(uid));
    setSchoolRankings(getSchoolRankings(country?.id));
    setTopPlayers(getAllPlayers().sort((a, b) => b.rating - a.rating).slice(0, 10));
    setMatchHistory(getMatchHistory(uid));
  }, [user, userProfile, country]);

  useEffect(() => {
    if (user && hasInitialized) {
      loadData();
    }
  }, [user, hasInitialized, loadData]);

  const pendingChallenges = challenges.filter(c => 
    c.status === 'pending' && c.opponents.some(o => o.userId === (user?.uid || 'user-1') && o.status === 'invited')
  );

  const activeChallenges = challenges.filter(c => 
    c.status === 'accepted' || c.status === 'in-progress'
  );

  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access the Challenge Arena</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Challenge Arena...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br ${colors.primary} opacity-10 rounded-full blur-3xl animate-float`} />
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr ${colors.accent} opacity-10 rounded-full blur-3xl`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${colors.secondary} opacity-5 rounded-full blur-3xl`} />
      </div>

      <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
                <span className="text-2xl">{colors.flag}</span>
                <span className="text-sm font-semibold text-primary">{colors.tagline}</span>
              </div>

              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                <Trophy className="h-10 w-10 text-yellow-500" />
                Challenge Arena
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span>{country?.flag}</span>
                <span>Compete with classmates and schools across {country?.name || 'West Africa'}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <CampusSelector onLevelChange={handleLevelChange} defaultLevel={educationLevel} />
              <CountrySelector variant="compact" autoApply={true} />
            </div>
          </div>
        </div>

        {/* Welcome & Multi-Country Info Banner */}
        <Card className={`mb-6 bg-gradient-to-r ${colors.cardBg} border-2`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${colors.primary}`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">🌍 Welcome to Cross-Country Challenges!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You're now part of a West African learning community! Challenge students from:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-900">🇬🇭 Ghana</Badge>
                  <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-900">🇳🇬 Nigeria</Badge>
                  <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-900">🇸🇱 Sierra Leone</Badge>
                  <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-900">🇱🇷 Liberia</Badge>
                  <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-900">🇬🇲 Gambia</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Use the country selector above to switch between countries and see different school rankings. School battles are filtered by your selected country!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Stats */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-4 border-primary">
                {player.avatar ? (
                  <AvatarImage src={player.avatar} alt={player.userName} />
                ) : (
                  <AvatarFallback className="text-2xl font-bold">
                    {player.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{player.userName}</h2>
                <p className="text-sm text-muted-foreground">{player.school}</p>
                <Badge variant="outline" className="mt-1">{player.level || 'JHS'}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-primary">Level {Math.floor((player.xp || 0) / 100) + 1}</div>
                <div className="text-xs text-muted-foreground">{player.xp || 0} XP</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{player.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{player.wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">{player.winStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{player.totalGames}</div>
                <div className="text-xs text-muted-foreground">Games</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.slice(0, 3).map((notif, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-gray-900 rounded-lg flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                  {notif.actionUrl && (
                    <Link href={notif.actionUrl}>
                      <Button size="sm">View</Button>
                    </Link>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4">
            <TabsTrigger value="play">Play</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
            <TabsTrigger value="history" className="hidden sm:block">History</TabsTrigger>
          </TabsList>

          {/* Play Tab */}
          <TabsContent value="play" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href={`/challenge-arena/${countryParam}/practice`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <BrainCircuit className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Sharpen your skills without affecting your rating
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Solo</Badge>
                          <Badge variant="outline">No pressure</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/challenge-arena/${countryParam}/quick-match`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                        <Zap className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Quick Match</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Instant matchmaking with students at your level
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">2 players</Badge>
                          <Badge variant="outline">10 questions</Badge>
                          <Badge variant="outline">2 min each</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/challenge-arena/${countryParam}/create`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Challenge Friends</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create custom challenge and invite specific students
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Schedule time</Badge>
                          <Badge variant="outline">Custom rules</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/challenge-arena/${countryParam}/school-battle`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <School className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          School vs School
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">5 Countries</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Represent your school in inter-school battles across {country?.name || 'West Africa'}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Team battle</Badge>
                          <Badge variant="outline">School pride</Badge>
                          <Badge variant="outline">{country?.flag}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/challenge-arena/${countryParam}/tournaments`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Tournaments</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Join competitive tournaments and win prizes
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Brackets</Badge>
                          <Badge variant="outline">Win prizes</Badge>
                          <Badge variant="outline">Weekly</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/challenge-arena/${countryParam}/boss-battle`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-red-500 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                        <Swords className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-red-600">Boss Battle</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Challenge the top-ranked players in {country?.name}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="destructive">Hard mode</Badge>
                          <Badge variant="outline">High rewards</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* Active Challenges Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Challenges in progress or awaiting response</CardDescription>
              </CardHeader>
              {activeChallenges.length === 0 && pendingChallenges.length === 0 ? (
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Swords className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No active challenges</p>
                  <Link href={`/challenge-arena/${countryParam}/quick-match`}>
                    <Button className="mt-4">Start Playing</Button>
                  </Link>
                </CardContent>
              ) : (
                <CardContent className="space-y-4">
                  {pendingChallenges.map(challenge => (
                    <Card key={challenge.id} className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Challenge Invitation</h3>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.creatorName} from {challenge.creatorSchool} has challenged you!
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline">{challenge.subject}</Badge>
                              <Badge variant="outline">{challenge.difficulty}</Badge>
                              <Badge variant="outline">{challenge.questionCount} questions</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/challenge-arena/${countryParam}/play/${challenge.id}`}>
                            <Button size="sm">Accept Challenge</Button>
                          </Link>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {activeChallenges.map(challenge => (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                vs {challenge.opponents.map(o => o.userName).join(', ')}
                              </h3>
                              <Badge variant={challenge.status === 'in-progress' ? 'default' : 'secondary'}>
                                {challenge.status}
                              </Badge>
                            </div>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="outline">{challenge.subject}</Badge>
                              <Badge variant="outline">{challenge.difficulty}</Badge>
                              <Badge variant="outline">{challenge.questionCount} questions</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created {formatDate(challenge.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Link href={`/challenge-arena/${countryParam}/play/${challenge.id}`}>
                          <Button size="sm" className="w-full sm:w-auto">
                            <Play className="h-4 w-4 mr-2" />
                            Continue Playing
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Players - {country?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topPlayers.map((p, idx) => (
                    <div key={p.userId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${getRankColor(idx + 1)}`}>
                        #{idx + 1}
                      </div>
                      <Avatar>
                        <AvatarFallback>{p.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{p.userName}</p>
                        <p className="text-xs text-muted-foreground">{p.school}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{p.rating}</p>
                        <p className="text-xs text-muted-foreground">{p.wins}W</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-purple-500" />
                    School Rankings - {country?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schoolRankings.slice(0, 10).map((school, idx) => (
                    <div key={school.school} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${getRankColor(idx + 1)}`}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{school.school}</p>
                        <p className="text-xs text-muted-foreground">
                          {school.totalStudents} players • Avg: {school.averageRating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{school.totalWins}W</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Match History</CardTitle>
                <CardDescription>Your recent challenges and results</CardDescription>
              </CardHeader>
              {matchHistory.length === 0 ? (
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No match history yet</p>
                  <Link href={`/challenge-arena/${countryParam}/quick-match`}>
                    <Button className="mt-4">Start Your First Match</Button>
                  </Link>
                </CardContent>
              ) : (
                <CardContent className="space-y-3">
                  {matchHistory.map((match, idx) => (
                    <div key={idx} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            match.result === 'win' ? 'default' : 
                            match.result === 'draw' ? 'secondary' : 
                            'destructive'
                          }>
                            {match.result.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{match.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(match.date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          vs {match.opponents.join(', ')}
                        </span>
                        <div className="flex items-center gap-3">
                          <span>Score: {match.myScore}</span>
                          <span className={match.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {match.ratingChange >= 0 ? '+' : ''}{match.ratingChange}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
