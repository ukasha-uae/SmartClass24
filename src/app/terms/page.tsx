'use client';

import { useTenant } from '@/hooks/useTenant';
import { getDefaultTenant } from '@/tenancy/registry';
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const { tenantId, branding } = useTenant();
  const [mounted, setMounted] = useState(false);
  const defaultTenant = getDefaultTenant();
  const safeTenantId = mounted ? tenantId : defaultTenant.id;
  const safeBranding = mounted ? branding : defaultTenant.branding;
  const isWisdomWarehouse = safeTenantId === 'wisdomwarehouse';
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose dark:prose-invert max-w-none" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: February 8, 2026
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using {safeBranding.name}, you agree to be bound by these Terms of Service 
          and all applicable laws and regulations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
        <p>You are responsible for:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Maintaining the confidentiality of your account</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of unauthorized use</li>
          {isWisdomWarehouse && (
            <>
              <li>Ensuring accurate parent/guardian contact information</li>
              <li>Supervising minors' use of the platform</li>
            </>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Violate any laws or regulations</li>
          <li>Share your account with others</li>
          <li>Attempt to access restricted areas</li>
          <li>Interfere with platform operation</li>
          <li>Use content without permission</li>
          {isWisdomWarehouse && (
            <>
              <li>Disrupt the supportive learning environment</li>
              <li>Share other students' personal information</li>
            </>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          All content on {safeBranding.name}, including lessons, materials, and resources, is protected 
          by copyright and other intellectual property rights.
        </p>

        {isWisdomWarehouse && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Learning Philosophy</h2>
            <p>
              {safeBranding.name} provides an alternative, holistic educational experience. We believe in 
              individualized learning, emotional resilience, and real-world relevance. Our approach may 
              differ from traditional educational settings, and we encourage open communication with parents 
              and guardians about their child's unique learning journey.
            </p>
          </>
        )}

        <h2 className="text-2xl font-semibold mt-8 mb-4">{isWisdomWarehouse ? '6' : '5'}. Limitation of Liability</h2>
        <p>
          {safeBranding.name} provides educational content "as is" and makes no warranties about 
          accuracy or completeness. We are not liable for any damages arising from use of the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{isWisdomWarehouse ? '7' : '6'}. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the platform 
          constitutes acceptance of modified terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{isWisdomWarehouse ? '8' : '7'}. Contact</h2>
        <p>
          For questions about these terms, contact: <a href={`mailto:${safeBranding.supportEmail}`} className="text-primary hover:underline">{safeBranding.supportEmail}</a>
        </p>
      </div>
    </div>
  );
}
