"use client";

import { useState, useEffect, useRef } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEducationLevels } from '@/hooks/useEducationLevels';

interface CampusSelectorProps {
  onLevelChange?: (level: 'Primary' | 'JHS' | 'SHS') => void;
  defaultLevel?: 'Primary' | 'JHS' | 'SHS';
  className?: string;
}

export default function CampusSelector({ onLevelChange, defaultLevel, className }: CampusSelectorProps) {
  const { labels } = useEducationLevels();
  const [selectedLevel, setSelectedLevel] = useState<'Primary' | 'JHS' | 'SHS'>('Primary');
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initialize from localStorage or default only once
    if (typeof window !== 'undefined' && !hasInitialized.current) {
      const savedLevel = localStorage.getItem('userEducationLevel') as 'Primary' | 'JHS' | 'SHS' | null;
      const initialLevel = defaultLevel || savedLevel || 'Primary';
      setSelectedLevel(initialLevel);
      onLevelChange?.(initialLevel);
      hasInitialized.current = true;
    }
  }, [defaultLevel]);

  const handleLevelChange = (level: 'Primary' | 'JHS' | 'SHS') => {
    setSelectedLevel(level);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEducationLevel', level);
    }
    onLevelChange?.(level);
  };

  return (
    <div className={cn("flex items-center gap-2 p-1 rounded-lg bg-muted", className)}>
      <Button
        variant={selectedLevel === 'Primary' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLevelChange('Primary')}
        className={cn(
          "flex items-center gap-2 transition-all",
          selectedLevel === 'Primary' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
            : 'hover:bg-background hover:text-foreground'
        )}
      >
        <BookOpen className="h-4 w-4" />
        <span className="font-semibold">{labels.primary}</span>
      </Button>
      <Button
        variant={selectedLevel === 'JHS' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLevelChange('JHS')}
        className={cn(
          "flex items-center gap-2 transition-all",
          selectedLevel === 'JHS' 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white' 
            : 'hover:bg-background hover:text-foreground'
        )}
      >
        <BookOpen className="h-4 w-4" />
        <span className="font-semibold">{labels.jhs}</span>
      </Button>
      <Button
        variant={selectedLevel === 'SHS' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLevelChange('SHS')}
        className={cn(
          "flex items-center gap-2 transition-all",
          selectedLevel === 'SHS' 
            ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white' 
            : 'hover:bg-background hover:text-foreground'
        )}
      >
        <GraduationCap className="h-4 w-4" />
        <span className="font-semibold">{labels.shs}</span>
      </Button>
    </div>
  );
}
