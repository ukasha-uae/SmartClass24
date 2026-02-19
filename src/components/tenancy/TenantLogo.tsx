/**
 * TenantLogo Component
 * Displays tenant-specific logo or neo-glamorphic "S24" fallback
 * 
 * @module components/tenancy/TenantLogo
 * @version 2.1.0
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTenant } from '@/hooks/useTenant';
import { cn } from '@/lib/utils';

interface TenantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;  // Show tenant name next to logo
}

const SIZES = {
  sm: { mobile: 24, desktop: 32 },
  md: { mobile: 32, desktop: 48 },
  lg: { mobile: 48, desktop: 64 },
  xl: { mobile: 64, desktop: 80 },
} as const;

/**
 * Tenant-aware logo component
 * Shows tenant's custom logo if available, otherwise neo-glamorphic "S24" design
 * 
 * @example
 * ```tsx
 * <TenantLogo size="md" />
 * <TenantLogo size="lg" showText />
 * ```
 */
export function TenantLogo({ 
  size = 'md', 
  className = '',
  showText = false,
}: TenantLogoProps) {
  const { branding, tenantId } = useTenant();
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const logoSizes = SIZES[size];
  
  // Ensure client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR, render placeholder
  if (!mounted) {
    return <div className={cn('w-12 h-12', className)} />;
  }
  
  // If tenant has custom logo (e.g., Wisdom Warehouse), show it (with fallback when 404 in production)
  if (branding.logoUrl && !logoError) {
    const getImageSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8';
        case 'md':
          return 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12';
        case 'lg':
          return 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16';
        case 'xl':
          return 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20';
        default:
          return 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12';
      }
    };
    // Use API route for /logos/ so production always gets the logo (static public/ may not be deployed)
    const logoSrc =
      branding.logoUrl.startsWith('/logos/') && tenantId
        ? `/api/tenant-logo?tenant=${encodeURIComponent(tenantId)}`
        : typeof window !== 'undefined' && branding.logoUrl.startsWith('/')
          ? `${window.location.origin}${branding.logoUrl}`
          : branding.logoUrl;

    return (
      <div className={cn('flex items-center gap-2', className)} suppressHydrationWarning>
        <Image
          src={logoSrc}
          alt={`${branding.name} logo`}
          width={logoSizes.desktop}
          height={logoSizes.desktop}
          className={cn('object-contain', getImageSizeClasses())}
          priority
          unoptimized={branding.logoUrl?.startsWith('/')}
          data-tenant-id={tenantId}
          onError={() => setLogoError(true)}
        />
        {showText && (
          <span className="font-bold text-base sm:text-lg md:text-xl">
            {branding.name}
          </span>
        )}
      </div>
    );
  }
  
  // Fallback when logo URL is set but failed to load (e.g. missing file in production): show tenant name
  if (branding.logoUrl && logoError) {
    const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base';
    return (
      <div className={cn('flex items-center gap-2', className)} data-tenant-id={tenantId}>
        <span
          className={cn(
            'font-bold text-slate-700 dark:text-slate-300 truncate max-w-[8rem] sm:max-w-[10rem]',
            textSize
          )}
          title={branding.name}
        >
          {branding.name}
        </span>
      </div>
    );
  }
  
  // For white-label tenants (non-S24), never show S24 branding - show tenant name only
  if (tenantId && tenantId !== 'smartclass24') {
    const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base';
    return (
      <div className={cn('flex items-center gap-2', className)} data-tenant-id={tenantId}>
        <span
          className={cn(
            'font-bold text-slate-700 dark:text-slate-300 truncate max-w-[8rem] sm:max-w-[12rem]',
            textSize
          )}
          title={branding.name}
        >
          {branding.name}
        </span>
      </div>
    );
  }

  // Fallback: Neo-glamorphic "S24" logo for SmartClass24 (no custom logo)
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-8 sm:w-9 sm:h-9',
          text: 'text-sm sm:text-base',
        };
      case 'md':
        return {
          container: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
          text: 'text-base sm:text-lg md:text-xl',
        };
      case 'lg':
        return {
          container: 'w-14 h-14 sm:w-16 sm:h-16',
          text: 'text-xl sm:text-2xl',
        };
      case 'xl':
        return {
          container: 'w-16 h-16 sm:w-20 sm:h-20',
          text: 'text-2xl sm:text-3xl',
        };
      default:
        return {
          container: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
          text: 'text-base sm:text-lg md:text-xl',
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div 
      className={cn('flex items-center gap-2', className)}
      data-tenant-id={tenantId}
    >
      {/* Neo-glamorphic "S24" container */}
      <div 
        className={cn(
          'relative flex items-center justify-center rounded-xl',
          'bg-gradient-to-br from-violet-50 via-white to-indigo-50',
          'dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/40',
          'shadow-[6px_6px_12px_rgba(139,92,246,0.15),-6px_-6px_12px_rgba(255,255,255,0.7)]',
          'dark:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(139,92,246,0.1)]',
          'border border-violet-200/50 dark:border-violet-800/30',
          'transition-all duration-300 hover:shadow-[8px_8px_16px_rgba(139,92,246,0.2),-8px_-8px_16px_rgba(255,255,255,0.8)]',
          'dark:hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(139,92,246,0.15)]',
          sizeClasses.container
        )}
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/10 via-transparent to-indigo-400/10 dark:from-violet-500/5 dark:to-indigo-500/5" />
        
        {/* S24 text with gradient */}
        <span 
          className={cn(
            'relative font-black tracking-tight',
            'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600',
            'dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400',
            'bg-clip-text text-transparent',
            'drop-shadow-sm',
            sizeClasses.text
          )}
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          S24
        </span>
      </div>
      
      {/* Optional tenant name text */}
      {showText && (
        <span className="font-bold text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300">
          {branding.name}
        </span>
      )}
    </div>
  );
}
