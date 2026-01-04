'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Crown, TrendingUp, Users, BookOpen, BarChart3, Target, Gift, Sparkles, FlaskConical, Dna, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { isPremiumUser, hasVirtualLabAccess, hasFullBundle } from '@/lib/monetization';
import PremiumUnlockModal from '@/components/premium/PremiumUnlockModal';
import { formatGHS } from '@/lib/payments';
import { virtualLabExperiments } from '@/lib/virtual-labs-data';
import Link from 'next/link';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  
  const userId = user?.uid || 'guest';
  const isPremium = isPremiumUser(userId);
  const hasVirtualLab = hasVirtualLabAccess(userId);
  const hasBundle = hasFullBundle(userId);

  const features = {
    free: [
      { name: 'All Game Modes', included: true },
      { name: '5 Questions per Subject', included: true, note: 'Limited question bank' },
      { name: 'Practice Mode', included: true },
      { name: 'Quick Match', included: true },
      { name: 'Boss Battle', included: true },
      { name: 'Tournaments', included: true },
      { name: 'School vs School', included: true },
      { name: 'Basic Progress Tracking', included: true },
      { name: 'Daily Challenge (1 per day)', included: true },
      { name: 'Basic Leaderboards', included: true },
      { name: 'Virtual Labs (3 labs)', included: true, note: '1 per subject - Try before you buy' },
      { name: 'Full Question Bank', included: false },
      { name: 'All Virtual Labs (20+)', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Study Streaks with Recovery', included: false },
      { name: 'Priority Matchmaking', included: false },
      { name: 'Double Coins (2x Rewards)', included: false },
      { name: 'Ad-Free Experience', included: false },
      { name: 'Multiple Daily Challenges', included: false },
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
      { name: 'School vs School', included: true },
      { name: 'Advanced Analytics Dashboard', included: true, highlight: true },
      { name: 'Performance by Subject', included: true },
      { name: 'Weak Areas Identification', included: true },
      { name: 'Improvement Trends', included: true },
      { name: 'Study Streaks with Recovery', included: true },
      { name: '3 Daily Challenges per Day', included: true },
      { name: 'Priority Matchmaking', included: true },
      { name: 'Double Coins (2x Rewards)', included: true },
      { name: 'Ad-Free Experience', included: true },
      { name: 'Achievement Showcase', included: true },
    ],
  };

  const plans = {
    challengeArena: {
      monthly: {
        price: 15,
        period: 'month',
        savings: null,
      },
      annual: {
        price: 120,
        period: 'year',
        savings: 'Save 33%',
        originalPrice: 180,
      },
    },
    virtualLab: {
      monthly: {
        price: 10,
        period: 'month',
        savings: null,
      },
      annual: {
        price: 80,
        period: 'year',
        savings: 'Save 33%',
        originalPrice: 120,
      },
    },
    fullBundle: {
      monthly: {
        price: 20,
        period: 'month',
        savings: 'Save 20%',
        originalPrice: 25, // 15 + 10
      },
      annual: {
        price: 160,
        period: 'year',
        savings: 'Save 33%',
        originalPrice: 240, // 120 + 120
      },
    },
  };

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
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready for serious exam preparation. 
            All features accessible, premium unlocks unlimited questions, all virtual labs, and advanced analytics.
          </p>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Free Plan */}
          <Card className="relative border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Free</CardTitle>
                <Badge variant="outline">Perfect to Start</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">GHS 0</span>
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
                onClick={() => router.push('/challenge-arena/ghana')}
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
                <span className="text-4xl font-bold">GHS {plans.challengeArena[selectedPlan].price}</span>
                <span className="text-muted-foreground">/{plans.challengeArena[selectedPlan].period}</span>
              </div>
              {selectedPlan === 'annual' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground line-through">GHS {plans.challengeArena.annual.originalPrice}</span>
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
                    <Check className={`h-5 w-5 shrink-0 mt-0.5 ${feature.highlight ? 'text-blue-500' : 'text-green-500'}`} />
                    <div className="flex-1">
                      <span className={feature.highlight ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}>
                        {feature.name}
                      </span>
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
                <span className="text-4xl font-bold">GHS {plans.virtualLab[selectedPlan].price}</span>
                <span className="text-muted-foreground">/{plans.virtualLab[selectedPlan].period}</span>
              </div>
              {selectedPlan === 'annual' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground line-through">GHS {plans.virtualLab.annual.originalPrice}</span>
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
                <span className="text-4xl font-bold">GHS {plans.fullBundle[selectedPlan].price}</span>
                <span className="text-muted-foreground">/{plans.fullBundle[selectedPlan].period}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground line-through">GHS {plans.fullBundle[selectedPlan].originalPrice}</span>
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
                  onClick={() => router.push('/virtual-labs')}
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
              <h3 className="font-semibold mb-2">Join Thousands</h3>
              <p className="text-sm text-muted-foreground">
                Join 5,000+ premium students preparing for their exams. You're not alone!
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
                Free users get access to all game modes but with a limited question bank (5 questions per subject) and 3 virtual labs (1 per subject). 
                Premium users get unlimited access to all questions for their education level, all {virtualLabExperiments.experiments.length}+ virtual labs, 
                plus advanced analytics and additional features like study streaks, priority matchmaking, and double coins.
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

