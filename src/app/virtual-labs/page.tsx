"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { virtualLabExperiments } from '@/lib/virtual-labs-data';
import { FlaskConical, Atom, Dna, Zap, CheckCircle2, Lock, Trophy, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLabProgress } from '@/stores/lab-progress-store';
import { Progress } from "@/components/ui/progress";

export default function VirtualLabsPage() {
  const [filter, setFilter] = useState<'All' | 'Biology' | 'Chemistry' | 'Physics'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const { completedLabs, totalXP, streak, isLabCompleted } = useLabProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subjectIcons = {
    Biology: Dna,
    Chemistry: FlaskConical,
    Physics: Zap
  };

  const subjectColors = {
    Biology: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    Chemistry: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    Physics: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
  };

  // Assign difficulty levels to labs (you can customize this)
  const labDifficulty: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
    'food-tests': 'Easy',
    'litmus-test': 'Easy',
    'simple-circuits': 'Easy',
    'osmosis': 'Medium',
    'photosynthesis-oxygen-production': 'Medium',
    'hookes-law': 'Medium',
    'ohms-law': 'Hard',
    'projectile-motion': 'Hard',
    'cell-division-simulator': 'Hard',
  };

  const getDifficulty = (slug: string): 'Easy' | 'Medium' | 'Hard' => {
    return labDifficulty[slug] || 'Medium';
  };

  const filteredExperiments = virtualLabExperiments.experiments
    .filter(exp => filter === 'All' || exp.subject === filter)
    .filter(exp => difficultyFilter === 'All' || getDifficulty(exp.slug) === difficultyFilter);

  const completionRate = virtualLabExperiments.experiments.length > 0
    ? Math.round((Object.keys(completedLabs).length / virtualLabExperiments.experiments.length) * 100)
    : 0;

  const currentLevel = Math.floor(totalXP / 500) + 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FlaskConical className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Virtual Labs
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master science through hands-on experiments. {virtualLabExperiments.experiments.length} interactive labs await!
        </p>
      </div>

      {/* Progress Section - Compact */}
      {mounted && (
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Title and Level */}
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-violet-600" />
                  <h3 className="text-base font-bold">Your Progress</h3>
                  <Badge variant="outline" className="bg-violet-100 dark:bg-violet-900 border-violet-300 text-xs">
                    Level {currentLevel}
                  </Badge>
                </div>

                {/* Quick Stats - Horizontal */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-bold">{completionRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold">{Object.keys(completedLabs).length}/{virtualLabExperiments.experiments.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-bold">{streak}d</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-bold">{totalXP} XP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">Subject</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(['All', 'Biology', 'Chemistry', 'Physics'] as const).map((subject) => (
            <button
              key={subject}
              onClick={() => setFilter(subject)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === subject
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        
        <p className="text-sm font-semibold mb-2">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                difficultyFilter === diff
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - Compact */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(subjectIcons).map(([subject, Icon]) => {
          const count = virtualLabExperiments.experiments.filter(exp => exp.subject === subject).length;
          return (
            <div key={subject} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
              <Icon className={`h-5 w-5 ${subject === 'Biology' ? 'text-green-600' : subject === 'Chemistry' ? 'text-orange-600' : 'text-blue-600'}`} />
              <span className="font-bold text-lg">{count}</span>
              <span className="text-sm text-muted-foreground">{subject}</span>
            </div>
          );
        })}
      </div>

      {/* Experiments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((experiment) => {
          const Icon = subjectIcons[experiment.subject as keyof typeof subjectIcons];
          const colorClass = subjectColors[experiment.subject as keyof typeof subjectColors];
          const isCompleted = mounted && isLabCompleted(experiment.id);
          const difficulty = getDifficulty(experiment.id);
          const estimatedXP = difficulty === 'Easy' ? 50 : difficulty === 'Medium' ? 75 : 100;
          
          const difficultyColors = {
            Easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300',
            Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300',
            Hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300',
          };
          
          return (
            <Link key={experiment.id} href={`/virtual-labs/${experiment.slug}`}>
              <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                isCompleted 
                  ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20' 
                  : 'hover:border-violet-400'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="relative">
                      <Icon className="h-8 w-8" />
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge className={`${colorClass} border`}>
                        {experiment.subject}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${difficultyColors[difficulty]}`}
                      >
                        {difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{experiment.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {experiment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Learning Objective */}
                  <div className="mb-3 p-2 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1">
                      🎯 You'll Learn:
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {(experiment as any).learningObjective || 'Master key scientific concepts through hands-on experimentation'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-3">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        10-15 min
                      </span>
                      <span className="text-violet-600 font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        +{estimatedXP} XP
                      </span>
                    </div>
                    {isCompleted && (
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="text-center py-12">
          <FlaskConical className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No experiments found for {filter}</p>
        </div>
      )}
    </div>
  );
}
