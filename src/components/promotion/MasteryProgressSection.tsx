'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { getUserSubjectMastery, resetSubjectMastery, getPrimaryPromotionProgress } from '@/lib/challenge';
import { getAvailableSubjects, type EducationLevel } from '@/lib/challenge-questions-exports';
import { RotateCcw, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';
import { PromotionProgress } from './PromotionProgress';

export function MasteryProgressSection() {
  const { user } = useFirebase();
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('Primary');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = user?.uid || 'guest';
  const subjects = useMemo(() => getAvailableSubjects(selectedLevel), [selectedLevel]);
  const availableSubjects = subjects.filter(s => s !== 'Mixed');

  // Get mastery records for selected level and subject
  const masteryRecords = useMemo(() => {
    if (!selectedSubject) return [];
    return getUserSubjectMastery(userId, selectedLevel, selectedSubject);
  }, [userId, selectedLevel, selectedSubject, refreshKey]);

  // Get current promotion progress (Primary only)
  const promotionProgress = useMemo(() => {
    if (selectedLevel === 'Primary' && selectedSubject && userId !== 'guest') {
      // Find the highest class level with records
      const levels = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
      for (let i = levels.length - 1; i >= 0; i--) {
        const record = masteryRecords.find(r => r.classLevel === levels[i]);
        if (record) {
          return getPrimaryPromotionProgress(userId, selectedSubject, levels[i]);
        }
      }
      // If no records, check Primary 1
      return getPrimaryPromotionProgress(userId, selectedSubject, 'Primary 1');
    }
    return null;
  }, [selectedLevel, selectedSubject, masteryRecords, userId]);

  const handleReset = () => {
    if (!selectedSubject) return;
    resetSubjectMastery(userId, selectedLevel, selectedSubject);
    setRefreshKey(k => k + 1);
    toast({
      title: 'Progress Reset',
      description: `Mastery progress for ${selectedSubject} has been reset. You'll start fresh.`,
    });
  };

  const hasRecords = masteryRecords.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Auto-Promotion Progress
        </CardTitle>
        <CardDescription>
          View and manage your class level promotion progress. Complete 5 challenges with 80% accuracy to level up!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Education Level</label>
          <div className="flex gap-2">
            {(['Primary', 'JHS', 'SHS'] as EducationLevel[]).map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedLevel(level);
                  setSelectedSubject('');
                }}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Subject Selector */}
        {availableSubjects.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Display */}
        {selectedSubject && (
          <>
            <Separator />
            {promotionProgress ? (
              <PromotionProgress progress={promotionProgress} subject={selectedSubject} />
            ) : (
              <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
                No progress yet. Complete challenges to start tracking your promotion progress!
              </div>
            )}

            {/* Mastery Records Summary */}
            {hasRecords && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Current Progress by Class Level</h4>
                <div className="space-y-2">
                  {masteryRecords.map((record) => {
                    const accuracy = record.totalQuestions > 0
                      ? ((record.totalCorrect / record.totalQuestions) * 100).toFixed(1)
                      : '0';
                    return (
                      <div
                        key={record.classLevel}
                        className="p-3 bg-muted rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold">{record.classLevel}</div>
                          <div className="text-xs text-muted-foreground">
                            {record.challengesPlayed} challenges • {accuracy}% accuracy
                          </div>
                        </div>
                        <Badge variant="outline">
                          {record.totalCorrect}/{record.totalQuestions} correct
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reset Button */}
            {hasRecords && (
              <>
                <Separator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Progress for {selectedSubject}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Reset Mastery Progress?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          This will reset all your mastery progress for <strong>{selectedSubject}</strong> at the{' '}
                          <strong>{selectedLevel}</strong> level.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You'll need to complete 5 challenges at 80% accuracy again to be promoted to the next
                          class level.
                        </p>
                        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                          This action cannot be undone.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                        Reset Progress
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {!hasRecords && selectedSubject && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm">
                <p className="text-blue-900 dark:text-blue-100">
                  <strong>💡 How Auto-Promotion Works:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-blue-800 dark:text-blue-200 ml-4 list-disc">
                  <li>Complete 5 challenges at your current class level</li>
                  <li>Achieve 80% accuracy or higher</li>
                  <li>You'll automatically be promoted to the next class level</li>
                  <li>Promotions are subject-specific (you can be at different levels for different subjects)</li>
                </ul>
              </div>
            )}
          </>
        )}

        {!selectedSubject && (
          <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
            Select a subject to view your promotion progress
          </div>
        )}
      </CardContent>
    </Card>
  );
}
