'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  ChevronRight,
  Star,
  Lock,
  Swords
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { isPremiumUser, hasPremiumFeature } from '@/lib/monetization';
import PremiumUnlockModal from '@/components/premium/PremiumUnlockModal';
import { useFirebase } from '@/firebase/provider';
import { useTenantLink } from '@/hooks/useTenantLink';

// V1 Route Guard: Redirect to practice if tournaments are disabled
export default function TournamentsPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const { toast } = useToast();
  const addTenantParam = useTenantLink();
  
  // Check premium access
  const userId = user?.uid || 'test-user-1';
  const isPremium = isPremiumUser(userId);
  const hasTournamentAccess = hasPremiumFeature(userId, 'tournaments');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  
  useEffect(() => {
    if (!FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament) {
      router.replace(addTenantParam('/challenge-arena/practice'));
    } else if (!isPremium && !hasTournamentAccess) {
      setShowUnlockModal(true);
    }
  }, [router, isPremium, hasTournamentAccess]);
  
  // Don't render if feature is disabled
  if (!FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament) {
    return null;
  }
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock Tournament Data
  const TOURNAMENTS = [
  {
    id: 't1',
    title: 'Weekly Math Whiz',
    subject: 'Mathematics',
    status: 'registering', // registering, active, completed
    startTime: 'Starts in 2 days',
    participants: 124,
    maxParticipants: 200,
    prize: 'Gold Badge + 500 XP',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    icon: Trophy
  },
  {
    id: 't2',
    title: 'Science Super Cup',
    subject: 'Integrated Science',
    status: 'active',
    startTime: 'Live Now',
    participants: 64,
    maxParticipants: 64,
    prize: 'Science Master Title',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    icon: Star
  },
  {
    id: 't3',
    title: 'English Essay Battle',
    subject: 'English Language',
    status: 'completed',
    startTime: 'Ended yesterday',
    participants: 88,
    maxParticipants: 100,
    prize: 'Literary Genius Badge',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    icon: Trophy
  }
];

  const handleRegister = (tournamentId: string) => {
    toast({
      title: 'Registration Successful!',
      description: 'You have joined the tournament. We will notify you when it starts.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tournaments</h1>
            <p className="text-muted-foreground">Compete for glory and exclusive rewards</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Live Now</TabsTrigger>
          <TabsTrigger value="completed">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {TOURNAMENTS.filter(t => t.status === 'registering').map(tournament => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onAction={() => handleRegister(tournament.id)}
              actionLabel="Register Now"
            />
          ))}
        </TabsContent>

        <TabsContent value="active" className="mt-6 space-y-4">
          {TOURNAMENTS.filter(t => t.status === 'active').map(tournament => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onAction={() => router.push(`/challenge-arena/tournaments/${tournament.id}`)}
              actionLabel="Enter Arena"
              variant="active"
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {TOURNAMENTS.filter(t => t.status === 'completed').map(tournament => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onAction={() => router.push(`/challenge-arena/tournaments/${tournament.id}`)}
              actionLabel="View Results"
              variant="completed"
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Premium Unlock Modal */}
      <PremiumUnlockModal
        open={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false);
          router.push(addTenantParam('/challenge-arena/ghana'));
        }}
        feature="tournaments"
        onSuccess={() => {
          setShowUnlockModal(false);
        }}
      />
    </div>
  );
}

function TournamentCard({ tournament, onAction, actionLabel, variant = 'default' }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className={`p-4 rounded-xl ${tournament.bgColor}`}>
            <tournament.icon className={`h-8 w-8 ${tournament.color}`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{tournament.title}</h3>
              {variant === 'active' && (
                <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {tournament.startTime}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {tournament.participants}/{tournament.maxParticipants} Joined
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Prize: {tournament.prize}
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className={variant === 'active' ? 'bg-red-600 hover:bg-red-700' : ''}
            onClick={onAction}
          >
            {variant === 'active' ? <Swords className="mr-2 h-4 w-4" /> : null}
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
