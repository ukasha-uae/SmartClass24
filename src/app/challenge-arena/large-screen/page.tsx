'use client';

/**
 * Large Screen Arena – hub to choose game (Light Your City or Rocket Race)
 * and set level, class, and subject before launching.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useLocalization } from '@/hooks/useLocalization';
import { useRouter } from 'next/navigation';
import CampusSelector from '@/components/CampusSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getAvailableSubjectsForGlobalArena,
  getAvailableSubjects,
} from '@/lib/challenge-questions-exports';
import {
  getClassLevelOptions,
  type EducationLevel,
} from '@/lib/large-screen-arena';

export default function LargeScreenHubPage() {
  const router = useRouter();
  const { hasArenaChallenge } = useTenant();
  const addTenantParam = useTenantLink();
  const { country } = useLocalization();

  const [educationLevel, setEducationLevel] = useState<EducationLevel>('JHS');
  const [classLevel, setClassLevel] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const isGlobal = country === null;
  const classLevels = useMemo(
    () => getClassLevelOptions(educationLevel, isGlobal),
    [educationLevel, isGlobal]
  );

  const subjects = useMemo(() => {
    const base = isGlobal
      ? getAvailableSubjectsForGlobalArena(educationLevel)
      : getAvailableSubjects(educationLevel);
    return base.filter((s) => s !== 'Mixed');
  }, [educationLevel, isGlobal]);

  useEffect(() => {
    if (classLevels.length > 0 && !classLevels.some((c) => c.id === classLevel)) {
      setClassLevel(classLevels[0].id);
    } else if (!classLevel && classLevels.length > 0) {
      setClassLevel(classLevels[0].id);
    }
  }, [educationLevel, classLevels, classLevel]);

  useEffect(() => {
    if (subjects.length > 0 && !subjects.includes(subject)) {
      setSubject(subjects[0]);
    } else if (!subject && subjects.length > 0) {
      setSubject(subjects[0]);
    }
  }, [subjects, subject]);

  if (!hasArenaChallenge) {
    router.replace(addTenantParam('/challenge-arena'));
    return null;
  }

  const query = new URLSearchParams({
    level: educationLevel,
    class: classLevel || classLevels[0]?.id || '',
    subject: subject || subjects[0] || '',
  }).toString();
  const lightYourCityHref = `${addTenantParam('/challenge-arena/light-your-city')}?${query}`;
  const rocketRaceHref = `${addTenantParam('/challenge-arena/rocket-race')}?${query}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
      <div className="container max-w-3xl mx-auto p-4 pt-16 pb-20">
        <Link href={addTenantParam('/challenge-arena')}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Arena
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Large Screen Arena
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose level, class, subject, then pick a game for your classroom.
          </p>
        </div>

        <Card className="mb-8 border-2 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-lg">Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Level</p>
              <CampusSelector
                defaultLevel={educationLevel}
                onLevelChange={(lvl) => {
                  setEducationLevel(lvl);
                  setClassLevel('');
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Class</p>
              <div className="flex flex-wrap gap-2">
                {classLevels.map((lvl) => (
                  <Button
                    key={lvl.id}
                    size="sm"
                    variant={classLevel === lvl.id ? 'default' : 'outline'}
                    onClick={() => setClassLevel(lvl.id)}
                    className={
                      classLevel === lvl.id
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600'
                        : ''
                    }
                  >
                    {lvl.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Subject</p>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm font-medium text-muted-foreground mb-3">Choose a game</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href={lightYourCityHref}>
            <Card className="h-full border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🏙️</div>
                <h3 className="text-xl font-bold">Light Your City</h3>
                <p className="text-sm opacity-90 mt-1">
                  Power up your city. First team to 100% wins.
                </p>
                <div className="mt-4 py-2 px-3 rounded-lg bg-white/20 text-sm font-medium">
                  Play Now
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href={rocketRaceHref}>
            <Card className="h-full border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-xl font-bold">Rocket Race</h3>
                <p className="text-sm opacity-90 mt-1">
                  Fuel your rocket. First to 100% wins.
                </p>
                <div className="mt-4 py-2 px-3 rounded-lg bg-white/20 text-sm font-medium">
                  Play Now
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
