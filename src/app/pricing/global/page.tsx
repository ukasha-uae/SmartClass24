'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Building2, ArrowRight, Sparkles, Globe, Shield, BarChart3 } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useLocalization } from '@/hooks/useLocalization';

export default function GlobalPricingPage() {
  const addTenantParam = useTenantLink();
  const { tenantId, branding } = useTenant();
  const { formatCurrency } = useLocalization();

  // Wisdom Warehouse is B2B-only and uses custom pricing
  if (tenantId === 'wisdomwarehouse') return null;

  const studentPlans = [
    {
      name: 'Free',
      price: formatCurrency(0),
      period: 'forever',
      highlight: false,
      features: ['Arena Challenge', 'Virtual Labs (starter set)', 'Progress tracking basics', 'Community leaderboards'],
      cta: { label: 'Start Free', href: addTenantParam('/') },
    },
    {
      name: 'Premium Student',
      price: formatCurrency(5),
      period: 'month',
      highlight: true,
      badge: 'Most Popular',
      features: ['Unlimited question bank', 'All virtual labs', 'Advanced analytics', 'More daily challenges'],
      cta: { label: 'Join Premium', href: addTenantParam('/contact?interest=premium') },
    },
    {
      name: 'Premium Plus',
      price: formatCurrency(10),
      period: 'month',
      highlight: false,
      features: ['Everything in Premium', 'Priority matchmaking', '2x rewards', 'Early access to new arenas'],
      cta: { label: 'Contact Us', href: addTenantParam('/contact?interest=premium-plus') },
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-violet-950/30 dark:to-indigo-950/30">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
              Global Pricing (USD)
            </Badge>
            <Badge variant="outline" className="border-indigo-300/60 dark:border-indigo-700/60">
              <Globe className="h-3.5 w-3.5 mr-1" />
              Worldwide
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Choose the plan that fits you
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Built for global learning: multi-curriculum support, curriculum mapping, 3D arena challenges, and hands-on virtual labs.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Looking for Ghana student pricing in GHS? Visit{' '}
            <Link className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href={addTenantParam('/pricing')}>
              Ghana Pricing
            </Link>
            .
          </p>
        </div>

        {/* Student plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {studentPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl overflow-hidden ${
                plan.highlight ? 'border-indigo-300 dark:border-indigo-700 shadow-2xl' : 'border-slate-200/70 dark:border-slate-700/70'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    {plan.badge ?? 'Recommended'}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.name === 'Free'
                    ? 'Great for exploring the platform.'
                    : plan.name === 'Premium Student'
                      ? 'Best for serious learning and practice.'
                      : 'For power learners and early adopters.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href={plan.cta.href} className="block">
                  <Button className={`w-full font-bold ${plan.highlight ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : ''}`}>
                    {plan.cta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schools / Institutions */}
        <div className="border-t pt-12 dark:border-slate-800">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
              For Schools & Institutions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">
              Launch your branded learning platform
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              White-label your platform, use your custom domain, and map one content base to multiple curricula (Ghana WASSCE, US Common Core, UK GCSE).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-emerald-200/60 dark:border-emerald-800/60 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  White-label
                </CardTitle>
                <CardDescription>Branding + domain + tenant controls</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Logo, colors, custom domain, and content transformation rules per school.
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200/60 dark:border-indigo-800/60 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Multi-curriculum
                </CardTitle>
                <CardDescription>Curriculum mapping (MVP live)</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Align topics across curricula without rewriting your entire content base.
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  Security & analytics
                </CardTitle>
                <CardDescription>Data isolation and visibility</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Separate tenants, progress tracking, and performance insights for leadership.
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Link href={addTenantParam('/contact?interest=whitelabel')}>
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold shadow-lg">
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Prefer email? Reach us at <span className="font-semibold">{branding.supportEmail}</span>
            </p>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <BarChart3 className="inline-block h-3.5 w-3.5 mr-1" />
          Pricing varies by region and institution size. We’ll tailor plans to your needs.
        </div>
      </div>
    </div>
  );
}

