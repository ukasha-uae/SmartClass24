/**
 * TenantLogo Component
 * Displays tenant logo or fallback text
 * 
 * @module components/tenancy/TenantLogo
 * @version 1.0.0
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
 * Automatically displays current tenant's logo or name
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
  
  const logoSizes = SIZES[size];
  
  // Ensure client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR, render nothing (tenant from URL params is client-only)
  if (!mounted) {
    return null;
  }
  
  // After mount: If tenant has logo URL, show image with responsive sizing
  if (branding.logoUrl) {
    // Generate responsive size classes based on size prop
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8';  // 24px → 28px → 32px
        case 'md':
          return 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12';  // 32px → 40px → 48px
        case 'lg':
          return 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16';  // 48px → 56px → 64px
        case 'xl':
          return 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20';  // 64px → 72px → 80px
        default:
          return 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12';
      }
    };
    
    return (
      <div className={cn('flex items-center gap-2', className)} suppressHydrationWarning>
        <Image
          src={branding.logoUrl}
          alt={`${branding.name} logo`}
          width={logoSizes.desktop}
          height={logoSizes.desktop}
          className={cn('object-contain', getSizeClasses())}
          priority
          data-tenant-id={tenantId}
        />
        {showText && (
          <span className="font-bold text-base sm:text-lg md:text-xl">
            {branding.name}
          </span>
        )}
      </div>
    );
  }
  
  // Fallback: Show text logo with responsive sizing
  return (
    <div 
      className={cn('flex items-center', className)}
      data-tenant-id={tenantId}
    >
      <span 
        className="font-bold"
        style={{ 
          fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : size === 'lg' ? '1.5rem' : '2rem',
          color: branding.primaryColor,
        }}
      >
        {branding.name}
      </span>
    </div>
  );
}
