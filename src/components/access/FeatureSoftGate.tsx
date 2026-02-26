'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

interface FeatureSoftGateProps {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  auditFeature?: string;
  auditRoute?: string;
}

export function FeatureSoftGate({
  title,
  description,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
  auditFeature,
  auditRoute,
}: FeatureSoftGateProps) {
  useEffect(() => {
    const payload = {
      event: 'feature_soft_gate_shown',
      feature: auditFeature ?? 'unknown',
      route: auditRoute ?? 'unknown',
      title,
      at: new Date().toISOString(),
    };

    fetch('/api/entitlements/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignore non-critical telemetry errors.
    });
  }, [auditFeature, auditRoute, title]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <Card className="border-2 border-amber-300/60 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/70 to-orange-50/70 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">
              <Lock className="h-3.5 w-3.5 mr-1" />
              Premium Access
            </Badge>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href={ctaHref}>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref}>
              <Button variant="outline">{secondaryLabel}</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
