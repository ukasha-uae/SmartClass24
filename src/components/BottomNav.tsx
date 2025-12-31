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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-r from-white/95 via-violet-50/95 to-indigo-50/95 dark:from-slate-900/95 dark:via-violet-950/95 dark:to-indigo-950/95 backdrop-blur-xl md:hidden shadow-2xl shadow-violet-200/20 dark:shadow-violet-900/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-violet-300/5 to-transparent"></div>
      </div>
      
      <div className="grid h-16 grid-cols-4 max-w-2xl mx-auto relative">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = (pathname === '/' && href === '/') || (pathname !== '/' && href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-medium transition-all duration-300',
                isActive
                  ? 'text-violet-600 dark:text-violet-400 scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:scale-105'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-b-full"></div>
              )}
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive 
                  ? "bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 shadow-lg" 
                  : "group-hover:bg-violet-50 dark:group-hover:bg-violet-950/30"
              )}>
                <Icon className={cn(
                  "h-5 w-5 sm:h-6 sm:w-6 transition-all",
                  isActive && "drop-shadow-lg scale-110"
                )} />
              </div>
              <span className={cn(
                "leading-tight font-semibold",
                isActive && "bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent"
              )}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
