'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Gift, Users, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase/provider';
import { getUserReferralStats } from '@/lib/referrals';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';

interface EarnPremiumBannerProps {
  variant?: 'full' | 'compact' | 'floating';
  dismissible?: boolean;
  showProgress?: boolean;
}

export function EarnPremiumBanner({ 
  variant = 'full', 
  dismissible = false,
  showProgress = false 
}: EarnPremiumBannerProps) {
  const { user } = useFirebase();
  const { branding, features } = useTenant();
  const addTenantParam = useTenantLink();
  const [isDismissed, setIsDismissed] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side mounting for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide banner if referrals are disabled for this tenant
  if (!features.enableReferrals) {
    return null;
  }

  useEffect(() => {
    // Check if banner was dismissed (expires after 24 hours)
    if (dismissible) {
      const dismissed = localStorage.getItem('earnPremiumBannerDismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const now = Date.now();
        // Show banner again after 24 hours
        if (now - dismissedTime < 24 * 60 * 60 * 1000) {
          setIsDismissed(true);
          return;
        }
      }
    }

    // Load referral stats if user is logged in and showProgress is true
    if (user && showProgress) {
      getUserReferralStats(user.uid).then(stats => {
        if (stats) {
          setReferralCount(stats.referralCount);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, dismissible, showProgress]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (dismissible) {
      localStorage.setItem('earnPremiumBannerDismissed', Date.now().toString());
    }
  };

  if (isDismissed) return null;

  // Floating variant (bottom of screen)
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-slide-up">
        <Card className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white border-0 shadow-2xl">
          <div className="p-4 relative">
            {dismissible && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎁</div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">Get Premium FREE!</h3>
                <p className="text-xs text-white/90 mb-3">
                  Share with 10 friends & unlock 1 month premium. No payment needed!
                </p>
                <Link href="/redeem-codes">
                  <Button 
                    size="sm" 
                    className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
                  >
                    Start Earning <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="relative">
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-2 border-purple-200 dark:border-purple-800">
          <div className="p-3 flex items-center justify-between gap-3">
            {dismissible && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <div className="flex items-center gap-2 flex-1">
              <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  Earn Premium FREE
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  {showProgress && !loading ? `${referralCount}/10 codes` : 'Invite 10 friends'}
                </p>
              </div>
            </div>
            <Link href="/redeem-codes">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0">
                Start
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Full variant
  return (
    <div className="relative">
      <Card className="overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white border-0 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="p-6 relative">
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-6xl">🎁</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-xl md:text-2xl font-bold">Get Premium Access FREE!</h3>
              </div>
              <p className="text-white/90 mb-4 text-sm md:text-base">
                Share {branding.name} with friends. For every 10 friends who join and complete their profile + first activity, 
                you earn <strong>1 month premium access</strong> - completely free! Keep earning unlimited months.
              </p>
              
              {showProgress && !loading && user && (
                <div className="mb-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Your Progress</span>
                    <span className="text-sm">{referralCount}/10 codes</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${(referralCount / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <Link href="/redeem-codes">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-bold shadow-lg"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Start Earning Now
                  </Button>
                </Link>
                <Link href={addTenantParam('/pricing')}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
