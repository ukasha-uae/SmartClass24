/**
 * CurriculumBadge Component
 * 
 * Displays tenant curriculum information with configurable size and style variants.
 * Automatically formats curriculum system names, exam systems, and grade levels.
 * 
 * @module components/tenancy/CurriculumBadge
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * // Default usage (compact inline badge)
 * <CurriculumBadge />
 * 
 * // Large detailed card
 * <CurriculumBadge variant="card" size="lg" />
 * 
 * // Small inline badge with minimal info
 * <CurriculumBadge variant="badge" size="sm" />
 * ```
 */

'use client';

import { useTenant } from '@/hooks/useTenant';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Size variants for the component
 */
type CurriculumBadgeSize = 'sm' | 'md' | 'lg';

/**
 * Display style variants
 */
type CurriculumBadgeVariant = 'badge' | 'inline' | 'card';

/**
 * Component props
 */
interface CurriculumBadgeProps {
  /**
   * Display size variant
   * @default 'md'
   */
  size?: CurriculumBadgeSize;
  
  /**
   * Display style variant
   * - badge: Compact pill-style badge (single line)
   * - inline: Horizontal layout with icon and text
   * - card: Full-featured card with all details
   * @default 'inline'
   */
  variant?: CurriculumBadgeVariant;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Hide the component if no curriculum is configured
   * @default true
   */
  hideIfEmpty?: boolean;
  
  /**
   * Show country list (only applicable for card variant)
   * @default true
   */
  showCountries?: boolean;
  
  /**
   * Show curriculum description (only applicable for card variant)
   * @default true
   */
  showDescription?: boolean;
}

/**
 * Formats curriculum system name (e.g., 'west-african' → 'West African')
 */
function formatSystemName(system: string): string {
  return system
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats country names (e.g., 'sierra-leone' → 'Sierra Leone')
 */
function formatCountryName(country: string): string {
  return country
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * CurriculumBadge Component
 */
export function CurriculumBadge({
  size = 'md',
  variant = 'inline',
  className,
  hideIfEmpty = true,
  showCountries = true,
  showDescription = true,
}: CurriculumBadgeProps) {
  const { curriculum } = useTenant();
  
  // Hide if no curriculum and hideIfEmpty is true
  if (!curriculum && hideIfEmpty) {
    return null;
  }
  
  // Fallback message if no curriculum
  if (!curriculum) {
    return (
      <div className={cn('text-sm text-muted-foreground italic', className)}>
        No curriculum configured
      </div>
    );
  }
  
  const formattedSystemName = formatSystemName(curriculum.system);
  
  // Size-specific classes
  const sizeClasses = {
    sm: {
      text: 'text-xs',
      icon: 'w-3 h-3',
      badge: 'text-xs px-1.5 py-0',
      gap: 'gap-1.5',
      padding: 'p-2',
    },
    md: {
      text: 'text-sm',
      icon: 'w-4 h-4',
      badge: 'text-xs px-2 py-0.5',
      gap: 'gap-2',
      padding: 'p-3',
    },
    lg: {
      text: 'text-base',
      icon: 'w-5 h-5',
      badge: 'text-sm px-2.5 py-0.5',
      gap: 'gap-3',
      padding: 'p-4',
    },
  };
  
  const sizes = sizeClasses[size];
  
  // Badge variant (most compact)
  if (variant === 'badge') {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40',
          'text-purple-900 dark:text-purple-100',
          'border border-purple-200 dark:border-purple-800/50',
          'font-medium',
          sizes.badge,
          className
        )}
      >
        📚 {formattedSystemName}
      </Badge>
    );
  }
  
  // Inline variant (icon + text, single line)
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center',
          sizes.gap,
          'px-3 py-1.5',
          'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30',
          'border border-purple-200 dark:border-purple-800/50',
          'rounded-lg',
          className
        )}
      >
        <BookOpen className={cn(sizes.icon, 'text-purple-600 dark:text-purple-400 flex-shrink-0')} />
        <div className="flex items-center gap-2">
          <span className={cn(sizes.text, 'font-semibold text-purple-900 dark:text-purple-100')}>
            {formattedSystemName}
          </span>
          {curriculum.examSystems.length > 0 && (
            <>
              <span className="text-purple-400 dark:text-purple-600">•</span>
              <span className={cn(sizes.text, 'text-purple-600 dark:text-purple-400')}>
                {curriculum.examSystems.join(' • ')}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Card variant (full details)
  return (
    <div
      className={cn(
        sizes.padding,
        'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
        'border border-purple-200 dark:border-purple-800/50',
        'rounded-lg',
        className
      )}
    >
      <div className={cn('flex items-start', sizes.gap)}>
        <GraduationCap
          className={cn(
            sizes.icon,
            'text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0'
          )}
        />
        <div className={cn('flex-1 space-y-2')}>
          {/* System Name */}
          <h3 className={cn(sizes.text, 'font-semibold text-purple-900 dark:text-purple-100')}>
            📚 Curriculum: {formattedSystemName}
          </h3>
          
          {/* Details */}
          <div className={cn('space-y-1', size === 'sm' ? 'text-xs' : 'text-xs')}>
            {/* Exam Systems */}
            {curriculum.examSystems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="font-medium text-purple-700 dark:text-purple-300">
                  Exam Systems:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {curriculum.examSystems.map((exam) => (
                    <Badge
                      key={exam}
                      variant="secondary"
                      className={cn(
                        'bg-purple-100 dark:bg-purple-900/40',
                        'text-purple-900 dark:text-purple-100',
                        'border-purple-200 dark:border-purple-800',
                        sizes.badge
                      )}
                    >
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Grade Levels */}
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <span className="font-medium">Grade Levels:</span>
              <span>{curriculum.gradeLevels.join(' • ')}</span>
            </div>
            
            {/* Countries (optional) */}
            {showCountries && curriculum.countries && curriculum.countries.length > 0 && (
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <span className="font-medium">Countries:</span>
                <span>
                  {curriculum.countries.map(formatCountryName).join(', ')}
                </span>
              </div>
            )}
            
            {/* Description (optional) */}
            {showDescription && curriculum.description && (
              <p className="mt-2 text-purple-600 dark:text-purple-400 italic leading-relaxed">
                {curriculum.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact variant for use in headers, footers, or tight spaces
 * Always uses badge variant in small size
 */
export function CurriculumBadgeCompact({ className }: { className?: string }) {
  return <CurriculumBadge variant="badge" size="sm" className={className} />;
}

/**
 * Full-featured variant for use in settings, about pages, or feature showcases
 * Always uses card variant in large size with all details
 */
export function CurriculumBadgeFull({ className }: { className?: string }) {
  return (
    <CurriculumBadge
      variant="card"
      size="lg"
      className={className}
      showCountries={true}
      showDescription={true}
    />
  );
}
