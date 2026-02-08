"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { User, FlaskConical, Swords, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BottomNav Component - Mobile-only bottom navigation
 * Shows on screens smaller than md breakpoint
 * Hidden on desktop where Footer is shown
 */
type BottomNavProps = {
  initialTenantId?: string | null;
};

function getCookieValue(cookieName: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function BottomNav({ initialTenantId = null }: BottomNavProps) {
  const [pathname, setPathname] = useState('');
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId);

  useEffect(() => {
    const updateFromLocation = () => {
      const nextPathname = window.location.pathname;
      const urlTenant = new URLSearchParams(window.location.search).get('tenant');
      const cookieTenant = getCookieValue('tenant');
      setPathname(nextPathname);
      setTenantId(urlTenant || cookieTenant || null);
    };

    updateFromLocation();

    const onLocationChange = () => updateFromLocation();
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('smartclass24:locationchange', onLocationChange);

    const historyAny = window.history as any;
    const originalPushState = historyAny.pushState;
    const originalReplaceState = historyAny.replaceState;

    historyAny.pushState = function (...args: any[]) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('smartclass24:locationchange'));
      return result;
    };

    historyAny.replaceState = function (...args: any[]) {
      const result = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('smartclass24:locationchange'));
      return result;
    };

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('smartclass24:locationchange', onLocationChange);
      historyAny.pushState = originalPushState;
      historyAny.replaceState = originalReplaceState;
    };
  }, []);

  const addTenantParam = useCallback(
    (href: string) => {
      if (!tenantId || tenantId === 'smartclass24') return href;
      const separator = href.includes('?') ? '&' : '?';
      return `${href}${separator}tenant=${tenantId}`;
    },
    [tenantId]
  );

  const navItems = useMemo(() => {
    const items = [
      { href: addTenantParam('/challenge-arena'), label: 'Arena', icon: Swords },
      { href: addTenantParam('/virtual-labs'), label: 'Labs', icon: FlaskConical },
      { href: addTenantParam('/pricing'), label: 'Pricing', icon: Coins },
      { href: addTenantParam('/profile'), label: 'Profile', icon: User },
    ];

    return items.filter(item => !(tenantId === 'wisdomwarehouse' && item.label === 'Pricing'));
  }, [addTenantParam, tenantId]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-r from-white/95 via-violet-50/95 to-indigo-50/95 dark:from-slate-900/95 dark:via-violet-950/95 dark:to-indigo-950/95 backdrop-blur-xl md:hidden shadow-2xl shadow-violet-200/20 dark:shadow-violet-900/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-violet-300/5 to-transparent"></div>
      </div>
      
      <div className={cn(
        "grid h-16 max-w-2xl mx-auto relative",
        navItems.length === 3 ? "grid-cols-3" : "grid-cols-4"
      )}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (pathname === '/' && href === '/') ||
            (pathname !== '/' && href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 group",
                isActive && "text-violet-700 dark:text-violet-300"
              )}
            >
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
