'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Crown, TrendingUp, Users, BookOpen, BarChart3, Target, Gift, Sparkles, FlaskConical, Dna, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { isPremiumUser, hasVirtualLabAccess, hasFullBundle } from '@/lib/monetization';
import PremiumUnlockModal from '@/components/premium/PremiumUnlockModal';
import { virtualLabExperiments } from '@/lib/virtual-labs-data';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useTenant } from '@/hooks/useTenant';
import { useLocalization } from '@/hooks/useLocalization';
import {
  defaultAdminPricingConfig,
  getEffectiveUsdBasePrice,
  getDiscountedUsdPrice,
  loadAdminPricingConfig,
  type ConcretePricingCategory,
} from '@/lib/pricing/admin-pricing-config';

const WAEC5_COUNTRY_IDS = new Set(['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia']);

export default function PricingPage() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  const { tenantId } = useTenant();
  const { country, formatCurrency } = useLocalization();
  const { user } = useFirebase();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [pricingConfig, setPricingConfig] = useState(defaultAdminPricingConfig);
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (tenantId === 'wisdomwarehouse') {
      router.replace('/');
    }
  }, [tenantId, router]);

  useEffect(() => {
    let mounted = true;
    // Public pricing should not require Firestore read permissions.
    // Use local/default config; admin dashboard handles Firestore sync.
    loadAdminPricingConfig().then((cfg) => {
      if (mounted) setPricingConfig(cfg);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/api/exchange-rates')
      .then((res) => res.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (mounted && data?.rates) setLiveRates(data.rates);
      })
      .catch(() => {
        // Keep admin-config fallback rates if live fetch fails.
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (tenantId === 'wisdomwarehouse') {
    return null;
  }
  
  const userId = user?.uid || 'guest';
  const isPremium = isPremiumUser(userId);
  const hasVirtualLab = hasVirtualLabAccess(userId);
  const hasBundle = hasFullBundle(userId);
  const isWaec5Country = !!country?.id && WAEC5_COUNTRY_IDS.has(country.id);

  const features = {
    free: [
      { name: 'All Game Modes', included: true },
      { name: '20 Questions per Subject', included: true, note: 'Limited question bank' },
      { name: 'Practice Mode', included: true },
      { name: 'Quick Match', included: true },
      { name: 'Boss Battle', included: true },
      { name: 'Tournaments', included: true },
      { name: 'School vs School', included: false, note: 'Coming soon' },
      { name: 'Basic Progress Tracking', included: true },
      { name: 'Daily Challenge (1 per day)', included: true },
      { name: 'Basic Leaderboards', included: true },
      { name: 'Virtual Labs (3 labs)', included: true, note: '1 per subject - Try before you buy' },
      { name: 'Full Question Bank', included: false },
      { name: 'All Virtual Labs (20+)', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Study Streaks with Recovery', included: false },
      { name: 'Priority Matchmaking', included: false, note: 'Coming soon' },
      { name: 'Double Coins (2x Rewards)', included: false, note: 'Coming soon' },
      { name: 'Ad-Free Experience', included: false },
      { name: 'Multiple Daily Challenges', included: false, note: 'Coming soon' },
    ],
    premium: [
      { name: 'All Game Modes', included: true },
      { name: 'Unlimited Question Bank', included: true, highlight: true },
      { name: 'All Questions for Your Level', included: true, highlight: true },
      { name: 'All Virtual Labs (20+)', included: true, highlight: true },
      { name: 'Practice Mode', included: true },
      { name: 'Quick Match', included: true },
      { name: 'Boss Battle', included: true },
      { name: 'Tournaments', included: true },
      { name: 'School vs School', included: false, note: 'Coming soon' },
      { name: 'Advanced Analytics Dashboard', included: true, highlight: true },
      { name: 'Performance by Subject', included: true },
      { name: 'Weak Areas Identification', included: true },
      { name: 'Improvement Trends', included: true },
      { name: 'Study Streaks with Recovery', included: true },
      { name: '3 Daily Challenges per Day', included: false, note: 'Coming soon' },
      { name: 'Priority Matchmaking', included: false, note: 'Coming soon' },
      { name: 'Double Coins (2x Rewards)', included: false, note: 'Coming soon' },
      { name: 'Ad-Free Experience', included: true },
      { name: 'Achievement Showcase', included: false, note: 'Coming soon' },
    ],
  };

  const plans = {
    challengeArena: {
      monthly: {
        price: pricingConfig.baseUsd.challengeArenaMonthly,
        period: 'month',
        savings: null,
      },
      annual: {
        price: pricingConfig.baseUsd.challengeArenaAnnual,
        period: 'year',
        savings: 'Save 33%',
        originalPrice: pricingConfig.baseUsd.challengeArenaMonthly * 12,
      },
    },
    virtualLab: {
      monthly: {
        price: pricingConfig.baseUsd.virtualLabMonthly,
        period: 'month',
        savings: null,
      },
      annual: {
        price: pricingConfig.baseUsd.virtualLabAnnual,
        period: 'year',
        savings: 'Save 33%',
        originalPrice: pricingConfig.baseUsd.virtualLabMonthly * 12,
      },
    },
    fullBundle: {
      monthly: {
        price: pricingConfig.baseUsd.fullBundleMonthly,
        period: 'month',
        savings: 'Save 20%',
        originalPrice:
          pricingConfig.baseUsd.challengeArenaMonthly + pricingConfig.baseUsd.virtualLabMonthly,
      },
      annual: {
        price: pricingConfig.baseUsd.fullBundleAnnual,
        period: 'year',
        savings: 'Save 33%',
        originalPrice:
          pricingConfig.baseUsd.challengeArenaAnnual + pricingConfig.baseUsd.virtualLabAnnual,
      },
    },
  };

  const getDiscountedForDisplay = (usdAmount: number, category: ConcretePricingCategory) => {
    const effectiveUsd = getEffectiveUsdBasePrice(
      usdAmount,
      category,
      pricingConfig,
      country?.id ?? null
    );
    const discounted = getDiscountedUsdPrice(
      effectiveUsd,
      category,
      pricingConfig,
      country?.id ?? null
    );
    return discounted;
  };

  const toDisplayAmount = (usdAmount: number) => {
    if (!country) return usdAmount;
    const code = country.currency.code.toUpperCase();
    // Admin-configured rate has priority so dashboard changes reflect immediately.
    const rate = pricingConfig.usdToLocalRates[code] ?? liveRates?.[code] ?? 1;
    return Math.round(usdAmount * rate);
  };

  const formatPlanPrice = (usdAmount: number) => {
    return formatCurrency(toDisplayAmount(usdAmount));
  };

  const formatPlanPriceWithDiscount = (usdAmount: number, category: ConcretePricingCategory) => {
    const effectiveUsd = getEffectiveUsdBasePrice(
      usdAmount,
      category,
      pricingConfig,
      country?.id ?? null
    );
    const discounted = getDiscountedForDisplay(usdAmount, category);
    return {
      formatted: formatPlanPrice(discounted.amount),
      originalFormatted: formatPlanPrice(effectiveUsd),
      appliedDiscount: discounted.appliedDiscount,
      hasDiscount: discounted.amount < effectiveUsd,
    };
  };

  const currencyBadgeLabel = country
    ? `${country.name} (${country.currency.code})`
    : 'Global (USD)';

  const challengeDisplay = formatPlanPriceWithDiscount(
    plans.challengeArena[selectedPlan].price,
    'challengeArena'
  );
  const virtualLabDisplay = formatPlanPriceWithDiscount(
    plans.virtualLab[selectedPlan].price,
    'virtualLab'
  );
  const fullBundleDisplay = formatPlanPriceWithDiscount(
    plans.fullBundle[selectedPlan].price,
    'fullBundle'
  );
  const institutionStarterDisplay = formatPlanPriceWithDiscount(
    pricingConfig.baseUsd.institutionStarterMonthly,
    'institutionStarter'
  );
  const institutionGrowthDisplay = formatPlanPriceWithDiscount(
    pricingConfig.baseUsd.institutionGrowthMonthly,
    'institutionGrowth'
  );
  const institutionEnterpriseDisplay = formatPlanPriceWithDiscount(
    pricingConfig.baseUsd.institutionEnterpriseMonthly,
    'institutionEnterprise'
  );

  const handleUpgrade = (plan: 'monthly' | 'annual', subscriptionType: 'challengeArena' | 'virtualLab' | 'fullBundle' = 'challengeArena') => {
    if (!user) {
      // Redirect to signup with return URL
      const returnUrl = encodeURIComponent('/pricing');
      router.push(`/?auth=signup&return=${returnUrl}`);
      return;
    }
    // User is logged in, open the modal
    setSelectedPlan(plan);
    setShowUnlockModal(true);
    // Store subscription type for the modal
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('subscriptionType', subscriptionType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              Simple, Transparent Pricing
            </Badge>
            <Badge variant="outline" className="border-blue-300/60 dark:border-blue-700/60">
              {currencyBadgeLabel}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Start free, upgrade when you're ready for serious exam preparation. 
            All features accessible, premium unlocks unlimited questions, all virtual labs, and advanced analytics.
          </p>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            {isWaec5Country
              ? 'K-12 pricing only (Primary, JHS/JSS, SHS/SSS).'
              : 'K-12 pricing only (Primary, Middle School, High School).'}
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Innovation Academy pricing is separate and will be published when the Academy launches.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {country ? (
              <>
                Need global USD pricing?{' '}
                <Link className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href={addTenantParam('/pricing/global')}>
                  View Global Pricing
                </Link>
              </>
            ) : (
              <>Prices are shown in USD for global users.</>
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('student-plans');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Student Pricing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('institution-pricing');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Institution Pricing
            </Button>
          </div>
          <Link href="/redeem-codes">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-purple-300 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 text-purple-700 dark:text-purple-300 font-semibold"
            >
              <Gift className="h-5 w-5 mr-2" />
              {isPremium ? 'Earn Next Month Premium Free' : 'Earn Premium for Free (Invite 10 Friends)'}
            </Button>
          </Link>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              className={`px-6 py-2 rounded-md font-semibold transition-all relative ${
                selectedPlan === 'annual'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5">
                Save 33%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div id="student-plans" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 scroll-mt-24">
          {/* Free Plan */}
          <Card className="relative border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Free</CardTitle>
                <Badge variant="outline">Perfect to Start</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{formatPlanPrice(0)}</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
              <CardDescription className="mt-2">
                Try all features with limited questions. Great for exploring the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                variant={isPremium ? "outline" : "default"}
                disabled={isPremium}
                onClick={() => router.push(addTenantParam('/challenge-arena/ghana'))}
              >
                {isPremium ? 'Current Plan' : 'Get Started Free'}
              </Button>
              
              <div className="space-y-3 pt-4 border-t">
                {features.free.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                      {feature.note && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">
                          ({feature.note})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
            {!isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 text-sm">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  Premium
                  <Crown className="h-5 w-5 text-yellow-500" />
                </CardTitle>
                {isPremium && (
                  <Badge className="bg-green-500">Current Plan</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{challengeDisplay.formatted}</span>
                <span className="text-muted-foreground">/{plans.challengeArena[selectedPlan].period}</span>
              </div>
              {challengeDisplay.hasDiscount && (
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Promo: {challengeDisplay.appliedDiscount?.name}
                </div>
              )}
              {selectedPlan === 'annual' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground line-through">{formatPlanPrice(plans.challengeArena.annual.originalPrice)}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {plans.challengeArena.annual.savings}
                  </Badge>
                </div>
              )}
              <CardDescription className="mt-2">
                Unlimited questions, advanced analytics, and everything you need to ace your exams in Challenge Arena.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                onClick={() => handleUpgrade(selectedPlan, 'challengeArena')}
                disabled={isPremium}
              >
                {isPremium ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    You're Premium!
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </>
                )}
              </Button>
              
              <div className="space-y-3 pt-4 border-t">
                {features.premium.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`h-5 w-5 shrink-0 mt-0.5 ${feature.highlight ? 'text-blue-500' : 'text-green-500'}`} />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span className={`${!feature.included ? 'text-muted-foreground line-through' : ''} ${feature.highlight ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}>
                        {feature.name}
                      </span>
                      {feature.note && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">
                          ({feature.note})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Virtual Lab Premium Plan */}
          <Card className="relative border-2 border-purple-500 shadow-xl bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30">
            {!hasVirtualLab && !hasBundle && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-1 text-sm">
                  Virtual Labs
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  Virtual Lab Premium
                  <FlaskConical className="h-5 w-5 text-purple-500" />
                </CardTitle>
                {(hasVirtualLab || hasBundle) && (
                  <Badge className="bg-green-500">Current Plan</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{virtualLabDisplay.formatted}</span>
                <span className="text-muted-foreground">/{plans.virtualLab[selectedPlan].period}</span>
              </div>
              {virtualLabDisplay.hasDiscount && (
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Promo: {virtualLabDisplay.appliedDiscount?.name}
                </div>
              )}
              {selectedPlan === 'annual' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground line-through">{formatPlanPrice(plans.virtualLab.annual.originalPrice)}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {plans.virtualLab.annual.savings}
                  </Badge>
                </div>
              )}
              <CardDescription className="mt-2">
                Access all {virtualLabExperiments.experiments.length}+ interactive virtual labs for hands-on science learning.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
                onClick={() => handleUpgrade(selectedPlan, 'virtualLab')}
                disabled={hasVirtualLab || hasBundle}
              >
                {(hasVirtualLab || hasBundle) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    You Have Access!
                  </>
                ) : (
                  <>
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Get Virtual Lab Premium
                  </>
                )}
              </Button>
              
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-purple-500" />
                  <div className="flex-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      All {virtualLabExperiments.experiments.length}+ Virtual Labs
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <div className="flex-1">
                    <span>Interactive Experiments</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <div className="flex-1">
                    <span>Biology, Chemistry & Physics</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <div className="flex-1">
                    <span>Progress Tracking & XP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Bundle Plan */}
          <Card className="relative border-2 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
            {!hasBundle && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-4 py-1 text-sm">
                  Best Value
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  Full Bundle
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <FlaskConical className="h-5 w-5 text-purple-500" />
                </CardTitle>
                {hasBundle && (
                  <Badge className="bg-green-500">Current Plan</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{fullBundleDisplay.formatted}</span>
                <span className="text-muted-foreground">/{plans.fullBundle[selectedPlan].period}</span>
              </div>
              {fullBundleDisplay.hasDiscount && (
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Promo: {fullBundleDisplay.appliedDiscount?.name}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground line-through">{formatPlanPrice(plans.fullBundle[selectedPlan].originalPrice)}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {plans.fullBundle[selectedPlan].savings}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                Everything: Challenge Arena Premium + Virtual Lab Premium. Best value for serious students!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white"
                onClick={() => handleUpgrade(selectedPlan, 'fullBundle')}
                disabled={hasBundle}
              >
                {hasBundle ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    You Have Full Bundle!
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Get Full Bundle
                  </>
                )}
              </Button>
              
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                  <div className="flex-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Everything in Challenge Arena Premium
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-purple-500" />
                  <div className="flex-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      Everything in Virtual Lab Premium
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <div className="flex-1">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Save {selectedPlan === 'monthly' ? '20%' : '33%'} vs buying separately
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institution pricing */}
        <Card id="institution-pricing" className="mb-12 scroll-mt-24 border-2 border-emerald-300/60 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-50/60 via-teal-50/60 to-cyan-50/60 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Institution Plans (Schools & Organizations)
            </CardTitle>
            <CardDescription>
              Institution pricing is separate from student plans: one-time onboarding + monthly subscription based on active student count.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Onboarding:</span> from $4,000 one-time. After onboarding, all plans include full platform features; only active student count and support level differ.
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border bg-background/70 p-3">
                <p className="font-semibold mb-1">Starter School</p>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  from {institutionStarterDisplay.formatted}/month
                </p>
                <p className="text-muted-foreground">Up to 300 active students.</p>
              </div>
              <div className="rounded-lg border bg-background/70 p-3">
                <p className="font-semibold mb-1">Growth Institution</p>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  from {institutionGrowthDisplay.formatted}/month
                </p>
                <p className="text-muted-foreground">301-1,000 active students.</p>
              </div>
              <div className="rounded-lg border bg-background/70 p-3">
                <p className="font-semibold mb-1">Enterprise</p>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  from {institutionEnterpriseDisplay.formatted}/month
                </p>
                <p className="text-muted-foreground">1,001+ active students.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={addTenantParam('/partners')}>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                  View Institution Options
                </Button>
              </Link>
              <Link href={addTenantParam('/contact?interest=institution-pricing')}>
                <Button variant="outline">Request Institution Quote</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <Card className="mb-12 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              How It Works
            </CardTitle>
            <CardDescription>
              Simple, transparent pricing. No hidden fees, cancel anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold mb-2">Start Free</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up and access all game modes with 5 questions per subject. 
                  Perfect for exploring the platform.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold mb-2">See the Value</h3>
                <p className="text-sm text-muted-foreground">
                  Experience all features. When you're ready for serious exam prep, 
                  upgrade to unlock unlimited questions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold mb-2">Upgrade Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock premium with one click. Pay via WhatsApp (MTN Mobile Money) 
                  or online payment. Cancel anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Labs Showcase - Show what they're missing */}
        {!isPremium && (
          <Card className="mb-12 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-indigo-950/30 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2 mb-2">
                    <FlaskConical className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                    Virtual Labs - See What You're Missing!
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    You currently have access to 3 free labs. Upgrade to unlock all {virtualLabExperiments.experiments.length}+ interactive experiments!
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.push(addTenantParam('/virtual-labs'))}
                  variant="outline"
                  className="w-full md:w-auto border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 shrink-0"
                >
                  View All Labs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {virtualLabExperiments.experiments.slice(0, 6).map((lab) => {
                  const isFree = ['food-tests', 'litmus-test', 'simple-circuits'].includes(lab.slug);
                  const subjectIcons = {
                    Biology: Dna,
                    Chemistry: FlaskConical,
                    Physics: Zap,
                  };
                  const Icon = subjectIcons[lab.subject as keyof typeof subjectIcons] || FlaskConical;
                  const subjectColors = {
                    Biology: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
                    Chemistry: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
                    Physics: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
                  };
                  const colorClass = subjectColors[lab.subject as keyof typeof subjectColors] || subjectColors.Chemistry;
                  
                  return (
                    <div key={lab.id} className="relative group">
                      {!isFree && (
                        <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-center p-3">
                            <Lock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">Premium Only</p>
                          </div>
                        </div>
                      )}
                      <Card className={`h-full border-2 ${isFree ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20' : 'border-purple-200 dark:border-purple-800 opacity-75'} transition-all hover:shadow-lg`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${colorClass.split(' ')[0]} border ${colorClass.split(' ')[2]}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <Badge className={`text-xs ${colorClass} border`}>
                                  {lab.subject}
                                </Badge>
                                {isFree ? (
                                  <Badge className="bg-green-500 text-white text-xs">Free</Badge>
                                ) : (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs">
                                    <Crown className="h-3 w-3 mr-1 inline" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{lab.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {lab.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  And {virtualLabExperiments.experiments.length - 6} more labs waiting for you!
                </p>
                <Button
                  onClick={() => handleUpgrade(selectedPlan)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock All {virtualLabExperiments.experiments.length}+ Labs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Unlimited Questions</h3>
              <p className="text-sm text-muted-foreground">
                Access all questions for your level. No more repeating the same 5 questions.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track your performance by subject, identify weak areas, and see improvement trends.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Better Preparation</h3>
              <p className="text-sm text-muted-foreground">
                More questions = better exam preparation. Ace BECE/WASSCE with comprehensive practice.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Join Our Community</h3>
              <p className="text-sm text-muted-foreground">
                Join 150+ premium students preparing for their exams. You're not alone!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What's the difference between Free and Premium?</h3>
              <p className="text-sm text-muted-foreground">
                Free users get access to all game modes but with a limited question bank (20 questions per subject) and 3 virtual labs (1 per subject). 
                Premium users get unlimited access to all questions for their education level, all {virtualLabExperiments.experiments.length}+ virtual labs, 
                plus advanced analytics and core premium tools available today.
                Features like priority matchmaking, double coins, and achievement showcase are coming soon.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What are Virtual Labs?</h3>
              <p className="text-sm text-muted-foreground">
                Virtual Labs are interactive science experiments that let you practice Biology, Chemistry, and Physics concepts hands-on. 
                Free users can try 3 labs (Food Tests, Litmus Test, Simple Circuits). Premium users get access to all {virtualLabExperiments.experiments.length}+ labs 
                covering topics like Osmosis, Photosynthesis, Ohm's Law, Projectile Motion, and many more. Perfect for SHS students preparing for WASSCE!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your premium subscription at any time. You'll continue to have access until the 
                end of your billing period, then return to the free tier.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I pay?</h3>
              <p className="text-sm text-muted-foreground">
                Currently, we support WhatsApp payments via MTN Mobile Money. Simply click "Upgrade to Premium" 
                and follow the instructions. We're working on adding online payment options soon.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Will I see questions from other levels?</h3>
              <p className="text-sm text-muted-foreground">
                No. If you're registered as a Primary student, you'll only see Primary questions. JHS students 
                only see JHS questions, and SHS students only see SHS questions. This ensures all questions are 
                relevant to your level.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I change my education level?</h3>
              <p className="text-sm text-muted-foreground">
                Your premium subscription applies to all levels. When you change your level (e.g., from JHS to SHS), 
                you'll automatically get access to questions for your new level.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I earn Premium for FREE?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Share your referral link with friends or share Virtual Labs/Challenge Arena. When 10 friends sign up using your link 
                and complete their profile + first activity (Practice, Challenge, or Quick Match), you earn 1 month of premium access for FREE! 
                Check the "Earn Premium Free" page to track your progress and get your unique referral link.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        {!isPremium && (
          <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of students preparing for BECE and WASSCE with unlimited practice questions.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
                onClick={() => handleUpgrade(selectedPlan)}
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Premium Unlock Modal */}
      <PremiumUnlockModal
        open={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        feature="premium"
        onSuccess={() => {
          setShowUnlockModal(false);
          // Refresh the page to show updated premium status
          window.location.reload();
        }}
      />
    </div>
  );
}

