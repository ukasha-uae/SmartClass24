'use client';

import { useTenant } from '@/hooks/useTenant';
import { getDefaultTenant } from '@/tenancy/registry';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
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
      <h1 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: February 8, 2026
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Name and email address</li>
          <li>Profile information</li>
          <li>Learning progress and performance data</li>
          <li>Device and usage information</li>
          {isWisdomWarehouse && (
            <>
              <li>Parent/guardian contact information</li>
              <li>Student learning preferences and needs</li>
            </>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide and improve our educational services</li>
          <li>Personalize your learning experience</li>
          <li>Track academic progress</li>
          <li>Communicate important updates</li>
          <li>Ensure platform security</li>
          {isWisdomWarehouse && (
            <>
              <li>Coordinate with parents and guardians</li>
              <li>Provide individualized support and mentorship</li>
              <li>Create a safe, supportive learning environment</li>
            </>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your personal information 
          from unauthorized access, alteration, or disclosure.
          {isWisdomWarehouse && (
            <> We are especially committed to protecting children's privacy and follow best practices for data security in educational settings.</>
          )}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access your personal data</li>
          <li>Request data correction or deletion</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your learning data</li>
          {isWisdomWarehouse && (
            <>
              <li>Request information about how your child's data is used</li>
              <li>Withdraw consent at any time</li>
            </>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
        <p>
          For privacy-related questions, contact us at: <a href={`mailto:${safeBranding.supportEmail}`} className="text-primary hover:underline">{safeBranding.supportEmail}</a>
        </p>
      </div>
    </div>
  );
}
