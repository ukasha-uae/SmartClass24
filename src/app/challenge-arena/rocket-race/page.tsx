'use client';

/**
 * Rocket Race – Large-screen Arena
 * Two rockets; correct answers = fuel up, wrong = burn. First to 100% wins.
 * Reads level, class, subject from URL (set on Large Screen hub).
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, Settings } from 'lucide-react';

import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useLocalization } from '@/hooks/useLocalization';
import { useEducationLevels } from '@/hooks/useEducationLevels';
import { ArenaScreen } from '@/components/arena/ArenaScreen';
import { MOCK_QUESTIONS } from '@/lib/arena';
import { Button } from '@/components/ui/button';
import {
  getClassLevelOptions,
  getArenaQuestionsForLargeScreen,
  type EducationLevel,
} from '@/lib/large-screen-arena';

export default function RocketRacePage() {
  const { hasArenaChallenge } = useTenant();
  const addTenantParam = useTenantLink();
  const { country } = useLocalization();
  const { labels } = useEducationLevels();
  const searchParams = useSearchParams();

  const [educationLevel, setEducationLevel] = useState<EducationLevel>('JHS');
  const [classLevel, setClassLevel] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const isGlobal = country === null;
  const classLevels = getClassLevelOptions(educationLevel, isGlobal);

  useEffect(() => {
    const levelParam = searchParams.get('level') as EducationLevel | null;
    const classParam = searchParams.get('class');
    const subjectParam = searchParams.get('subject');
    if (levelParam === 'Primary' || levelParam === 'JHS' || levelParam === 'SHS') {
      setEducationLevel(levelParam);
    }
    if (classParam) setClassLevel(classParam);
    if (subjectParam) setSubject(subjectParam);
  }, [searchParams]);

  const classDisplayName = (classLevels.find((c) => c.id === classLevel)?.name ?? classLevel) || '';
  const levelLabel = (labels[educationLevel.toLowerCase() as 'primary' | 'jhs' | 'shs']) ?? educationLevel;
  const subtitle = [levelLabel, classDisplayName, subject].filter(Boolean).join(' • ');

  const questions = useMemo(() => {
    if (!subject?.trim() || !classLevel?.trim()) return MOCK_QUESTIONS;
    const fromBank = getArenaQuestionsForLargeScreen(
      educationLevel,
      subject,
      classLevel,
      25,
      'guest'
    );
    return fromBank.length > 0 ? fromBank : MOCK_QUESTIONS;
  }, [educationLevel, subject, classLevel]);

  const hubHref = addTenantParam(
    `/challenge-arena/large-screen?level=${educationLevel}&class=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}`
  );

  if (!hasArenaChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="absolute top-4 left-4 z-10">
          <Link href={addTenantParam('/challenge-arena')}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Arena
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <p className="text-muted-foreground mb-4">Arena Challenge is not available for your school.</p>
          <Link href={addTenantParam('/challenge-arena')}>
            <Button>Return to Arena</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Link href={addTenantParam('/challenge-arena')}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Arena
          </Button>
        </Link>
        <Link href={hubHref}>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Change settings
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto pt-14 px-4 pb-6">
        <ArenaScreen
          arenaId="rocket-race"
          questions={questions}
          autoPlay={false}
          leftColor="#f59e0b"
          rightColor="#3b82f6"
          subtitle={subtitle}
        />
      </div>
    </div>
  );
}
