"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, BrainCircuit, Swords, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BottomNav Component - Mobile-only bottom navigation
 * Shows on screens smaller than md breakpoint
 * Hidden on desktop where Footer is shown
 */
export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/past-questions', label: 'Practice', icon: BrainCircuit },
    { href: '/challenge-arena', label: 'Arena', icon: Swords },
    { href: '/study-groups', label: 'Social', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4 max-w-2xl mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = (pathname === '/' && href === '/') || (pathname !== '/' && href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-primary hover:scale-105'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-transform", isActive && "drop-shadow-sm")} />
              <span className="leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
