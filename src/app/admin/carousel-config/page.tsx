'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  FEATURE_FLAGS, 
  ROLLOUT_PHASES, 
  applyRolloutPhase, 
  getCarouselConfig 
} from '@/lib/featureFlags';
import { 
  Settings, 
  PlayCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function CarouselAdminPage() {
  const [config, setConfig] = useState(getCarouselConfig());
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const refreshConfig = () => {
    setConfig(getCarouselConfig());
  };

  const handleToggleEnabled = () => {
    FEATURE_FLAGS.CAROUSEL_MODE.enabled = !FEATURE_FLAGS.CAROUSEL_MODE.enabled;
    refreshConfig();
  };

  const handleApplyPhase = (phase: keyof typeof ROLLOUT_PHASES) => {
    applyRolloutPhase(phase);
    setSelectedPhase(phase);
    refreshConfig();
  };

  const handleAddItem = (type: 'subjects' | 'levels' | 'topics' | 'lessons', value: string) => {
    if (!value.trim()) return;
    const normalized = value.toLowerCase().trim();
    const currentArray = FEATURE_FLAGS.CAROUSEL_MODE[type];
    
    if (!currentArray.includes(normalized) && !currentArray.includes('*')) {
      currentArray.push(normalized);
      refreshConfig();
    }
  };

  const handleRemoveItem = (type: 'subjects' | 'levels' | 'topics' | 'lessons', value: string) => {
    const currentArray = FEATURE_FLAGS.CAROUSEL_MODE[type];
    const index = currentArray.indexOf(value);
    if (index > -1) {
      currentArray.splice(index, 1);
      refreshConfig();
    }
  };

  const phases = [
    {
      key: 'PHASE_1_SHS3_CORE' as const,
      title: 'Phase 1: SHS3 Core Math',
      description: '4 algebra lessons for testing',
      status: 'current',
    },
    {
      key: 'PHASE_2_SHS3_ALL_MATH' as const,
      title: 'Phase 2: All SHS3 Math',
      description: 'All topics and lessons',
      status: 'upcoming',
    },
    {
      key: 'PHASE_3_ALL_SHS_MATH' as const,
      title: 'Phase 3: All SHS Math',
      description: 'SHS1, SHS2, SHS3',
      status: 'upcoming',
    },
    {
      key: 'PHASE_4_ALL_MATH' as const,
      title: 'Phase 4: All Mathematics',
      description: 'JHS + SHS all levels',
      status: 'upcoming',
    },
    {
      key: 'PHASE_5_EXPAND_SUBJECTS' as const,
      title: 'Phase 5: Multiple Subjects',
      description: 'Math, English, Science',
      status: 'upcoming',
    },
    {
      key: 'PHASE_6_ALL_SUBJECTS' as const,
      title: 'Phase 6: All Subjects',
      description: 'Full rollout',
      status: 'future',
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Carousel Mode Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage feature flags and rollout phases for the carousel learning mode
        </p>
      </div>

      {/* Global Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Global Control</span>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleToggleEnabled}
              className="ml-auto"
            />
          </CardTitle>
          <CardDescription>
            Master switch for carousel mode across the entire application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={config.enabled ? 'default' : 'secondary'}>
              {config.enabled ? '✓ Enabled' : '✗ Disabled'}
            </Badge>
            {config.envOverride && (
              <Badge variant="outline">
                Env Override: {config.envOverride}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rollout Phases */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rollout Phases</CardTitle>
          <CardDescription>
            Pre-configured deployment stages for safe, gradual expansion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {phases.map((phase) => {
            const isActive = selectedPhase === phase.key;
            return (
              <div
                key={phase.key}
                className={`border rounded-lg p-4 transition-all ${
                  isActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {isActive && <CheckCircle className="h-4 w-4 text-primary" />}
                      {phase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => handleApplyPhase(phase.key)}
                  >
                    {isActive ? 'Active' : 'Apply'}
                  </Button>
                </div>
                {isActive && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Applied: {JSON.stringify(ROLLOUT_PHASES[phase.key])}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Current Configuration */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {(['subjects', 'levels'] as const).map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="capitalize">{type}</CardTitle>
              <CardDescription>
                {type === 'subjects' ? 'Enabled subjects' : 'Enabled education levels'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {config[type].map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1">
                      {item}
                      {item !== '*' && (
                        <button
                          onClick={() => handleRemoveItem(type, item)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                  {config[type].length === 0 && (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Add ${type.slice(0, -1)}...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(type, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {(['topics', 'lessons'] as const).map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="capitalize">{type}</CardTitle>
              <CardDescription>
                Specific {type} where carousel is enabled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 min-h-[40px] max-h-[200px] overflow-y-auto">
                  {config[type].map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1">
                      {item}
                      {item !== '*' && (
                        <button
                          onClick={() => handleRemoveItem(type, item)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                  {config[type].length === 0 && (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Add ${type.slice(0, -1)}...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(type, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Usage Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Quick Start:</strong>
            <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
              <li>Ensure global toggle is ON</li>
              <li>Apply a rollout phase (recommended: Phase 1)</li>
              <li>Or manually add subjects, levels, topics, and lessons</li>
              <li>Navigate to an enabled lesson to see carousel mode</li>
            </ol>
          </div>
          <div>
            <strong>Wildcards:</strong>
            <p className="ml-4 mt-1">
              Use <code className="bg-muted px-1 py-0.5 rounded">*</code> to enable all items in a category
            </p>
          </div>
          <div>
            <strong>Environment Override:</strong>
            <p className="ml-4 mt-1">
              Set <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_ENABLE_CAROUSEL=false</code>{' '}
              in <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> to force disable
            </p>
          </div>
          <div>
            <strong>Testing:</strong>
            <p className="ml-4 mt-1">
              Current test lesson: <code className="bg-muted px-1 py-0.5 rounded">shs3 → mathematics → algebra → quadratic-equations</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
