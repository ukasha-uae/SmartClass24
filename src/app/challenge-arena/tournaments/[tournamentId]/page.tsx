'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Trophy, 
  ChevronLeft, 
  Swords, 
  Crown,
  Medal,
  User
} from 'lucide-react';

// Mock Bracket Data
const BRACKET_ROUNDS = [
  {
    name: 'Quarter Finals',
    matches: [
      { id: 1, p1: 'Kwame A.', p2: 'Ama O.', s1: 10, s2: 8, winner: 'Kwame A.' },
      { id: 2, p1: 'Kofi M.', p2: 'Esi B.', s1: 12, s2: 11, winner: 'Kofi M.' },
      { id: 3, p1: 'Yaw D.', p2: 'Akosua S.', s1: 9, s2: 10, winner: 'Akosua S.' },
      { id: 4, p1: 'Kojo F.', p2: 'Abena T.', s1: 7, s2: 9, winner: 'Abena T.' },
    ]
  },
  {
    name: 'Semi Finals',
    matches: [
      { id: 5, p1: 'Kwame A.', p2: 'Kofi M.', s1: 11, s2: 9, winner: 'Kwame A.' },
      { id: 6, p1: 'Akosua S.', p2: 'Abena T.', s1: 8, s2: 10, winner: 'Abena T.' },
    ]
  },
  {
    name: 'Finals',
    matches: [
      { id: 7, p1: 'Kwame A.', p2: 'Abena T.', s1: null, s2: null, winner: null, status: 'live' },
    ]
  }
];

export default function TournamentBracketPage() {
  const router = useRouter();
  const params = useParams();
  const addTenantParam = useTenantLink();
  const { hasArenaChallenge } = useTenant();
  
  // Tenant Route Guard: Check if arena is enabled for this tenant
  useEffect(() => {
    if (!hasArenaChallenge) {
      router.replace(addTenantParam('/'));
    }
  }, [hasArenaChallenge, router, addTenantParam]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Tournaments
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Science Super Cup
            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
          </h1>
          <p className="text-muted-foreground">Single Elimination • 64 Players</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">Prize Pool</p>
            <p className="text-xs text-muted-foreground">Science Master Title</p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Bracket Visualization */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-muted/20 p-4">
        <div className="flex gap-12 min-w-max p-4">
          {BRACKET_ROUNDS.map((round, roundIdx) => (
            <div key={round.name} className="flex flex-col justify-around gap-8 w-64">
              <h3 className="text-center font-bold text-muted-foreground mb-4 sticky top-0">
                {round.name}
              </h3>
              <div className="flex flex-col justify-around h-full gap-8">
                {round.matches.map((match) => (
                  <MatchCard key={match.id} match={match} isFinal={roundIdx === BRACKET_ROUNDS.length - 1} />
                ))}
              </div>
            </div>
          ))}
          
          {/* Winner Placeholder */}
          <div className="flex flex-col justify-center items-center w-48 gap-4">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border-4 border-yellow-500">
              <Trophy className="h-12 w-12 text-yellow-600" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Champion</p>
              <p className="text-muted-foreground">???</p>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function MatchCard({ match, isFinal }: any) {
  const isLive = match.status === 'live';

  return (
    <Card className={`w-full relative ${isLive ? 'border-red-500 shadow-red-100 dark:shadow-red-900/20' : ''}`}>
      {isLive && (
        <Badge className="absolute -top-2 -right-2 bg-red-500 animate-pulse text-[10px] px-1.5 h-5">
          LIVE
        </Badge>
      )}
      <CardContent className="p-0">
        {/* Player 1 */}
        <div className={`flex justify-between items-center p-3 border-b ${
          match.winner === match.p1 ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">{match.p1.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className={`text-sm ${match.winner === match.p1 ? 'font-bold' : ''}`}>
              {match.p1}
            </span>
          </div>
          <span className="font-mono font-bold text-sm">{match.s1 ?? '-'}</span>
        </div>

        {/* Player 2 */}
        <div className={`flex justify-between items-center p-3 ${
          match.winner === match.p2 ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">{match.p2.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className={`text-sm ${match.winner === match.p2 ? 'font-bold' : ''}`}>
              {match.p2}
            </span>
          </div>
          <span className="font-mono font-bold text-sm">{match.s2 ?? '-'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
