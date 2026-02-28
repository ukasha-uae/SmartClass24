'use client';

import { PlayCircle, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StartLessonCardProps = {
  teacherName: string;
  title: string;
  description: string;
  steps: string[];
  onStart: () => void;
  startLabel?: string;
};

export function StartLessonCard({
  teacherName,
  title,
  description,
  steps,
  onStart,
  startLabel = 'Start Lesson',
}: StartLessonCardProps) {
  return (
    <Card className="border border-violet-200 dark:border-violet-800 bg-white/90 dark:bg-gray-900/90 shadow-sm">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <UserRound className="h-4 w-4 text-violet-600" />
          Meet {teacherName}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 space-y-3">
        <div>
          <p className="text-sm font-semibold mb-1">{title}</p>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
            {steps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        </div>
        <Button onClick={onStart} className="w-full sm:w-auto gap-2">
          <PlayCircle className="h-4 w-4" />
          {startLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

