import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { cn } from '@/lib/utils';
import HeaderNoSSR from '@/components/HeaderNoSSR';
import FooterNoSSR from '@/components/FooterNoSSR';
import BottomNav from '@/components/BottomNav';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/PWAPrompts';
import { ManualPWAInstall } from '@/components/ManualPWAInstall';
import FirstTimeProfileModal from '@/components/FirstTimeProfileModal';
import { LocalizationProvider } from '@/lib/localization/localization-context';
import { FullscreenProvider } from '@/contexts/FullscreenContext';
import { FullscreenMain } from '@/components/FullscreenMain';
import { ReferralHandler } from '@/components/ReferralHandler';
import { NotificationHandler } from '@/components/NotificationHandler';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';
import { UpdateNotification } from '@/components/update-notification';
import { ForceCacheClear } from '@/components/force-cache-clear';
import { TenantThemeProvider } from '@/components/tenancy/TenantThemeProvider';
import { TenantParamProvider } from '@/components/tenancy/TenantParamProvider';
import { TenantTitle } from '@/components/tenancy/TenantTitle';
import { DynamicManifest } from '@/components/tenancy/DynamicManifest';
import { DynamicAppleIcon } from '@/components/tenancy/DynamicAppleIcon';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { TENANT_REGISTRY } from '@/tenancy/registry';
import { getCountryConfig } from '@/lib/localization/countries';

// SEO-optimized metadata (default/global)
export const metadata: Metadata = {
  title: 'SmartClass24 - Global AI-Powered Learning Platform',
  description: 'Personalized education for students worldwide. Master any curriculum with AI-driven learning, interactive labs, and challenge arenas. Serving Africa, Middle East, and expanding globally with white-label solutions for schools.',
  keywords: [
    'online learning',
    'AI education',
    'global education platform',
    'white-label learning',
    'multi-tenant education',
    'BECE preparation',
    'WASSCE preparation',
    'NECO preparation',
    'virtual labs',
    'challenge arena',
    'Africa education',
    'international curriculum',
    'exam preparation',
    'interactive learning',
    'personalized education'
  ],
  authors: [{ name: 'SmartClass24 Team' }],
  creator: 'SmartClass24',
  publisher: 'SmartClass24',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartclass24.app',
    siteName: 'SmartClass24',
    title: 'SmartClass24 - Global AI-Powered Learning Platform',
    description: 'White-label education platform serving students worldwide. Interactive virtual labs, gamified learning, and personalized AI tutoring. Trusted by schools in Africa, Middle East, and beyond.',
    images: [
      {
        url: '/og-image-global.png', // TODO: Create this image
        width: 1200,
        height: 630,
        alt: 'SmartClass24 - Global Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartClass24 - Global AI Learning Platform',
    description: 'Master West African exams with AI-driven learning, virtual labs, and challenge arenas.',
    images: ['/og-image-global.png'],
    creator: '@smartclass24', // TODO: Update with actual Twitter handle
  },
  // manifest dynamically set by DynamicManifest component
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const initialTenantId =
    headerStore.get('x-tenant') ?? cookieStore.get('tenant')?.value ?? null;

  // Get tenant config for PWA branding
  const tenantConfig = initialTenantId && TENANT_REGISTRY[initialTenantId] 
    ? TENANT_REGISTRY[initialTenantId] 
    : TENANT_REGISTRY.smartclass24;

  // Server-side manifest URL determination for instant PWA detection
  const manifestUrl = initialTenantId === 'wisdomwarehouse' 
    ? '/manifest-wisdomwarehouse.json'
    : initialTenantId && initialTenantId !== 'smartclass24'
    ? `/api/manifest?tenant=${initialTenantId}`
    : '/manifest.json';

  const themeColor = tenantConfig.branding.primaryColor;

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA Manifest - Server-rendered for instant Chrome detection */}
        <link rel="manifest" href={manifestUrl} />
        {/* Aggressive cache-busting meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
         {/* Theme color dynamically set per tenant for PWA branding */}
         <meta name="theme-color" content={themeColor} />
      </head>
      <body className={cn('font-body antialiased bg-background h-full')}>
        <TenantParamProvider initialTenantId={initialTenantId}>
        <TenantThemeProvider>
          <TenantTitle />
          {/* DynamicManifest still here for client-side updates, but manifest already in head */}
          <DynamicManifest />
          <DynamicAppleIcon />
          <ForceCacheClear />
          <ServiceWorkerRegistration />
          <FirebaseClientProvider>
            <LocalizationProvider>
              <FullscreenProvider>
                {/* Push Notification Components */}
                <NotificationHandler />
                <NotificationPermissionPrompt delay={8000} />

                <div className="relative flex min-h-screen w-full flex-col">
                  <HeaderNoSSR />
                  <FullscreenMain>{children}</FullscreenMain>
                  <FooterNoSSR />
                  {/* Show PWAInstallPrompt only for SmartClass24 tenant */}
                  {(!initialTenantId || initialTenantId === 'smartclass24') && <PWAInstallPrompt />}
                  <PWAUpdatePrompt />
                  <ManualPWAInstall />
                  <FirstTimeProfileModal />
                  <Suspense fallback={null}>
                    <ReferralHandler />
                  </Suspense>
                  <Suspense fallback={null}>
                    <BottomNav initialTenantId={initialTenantId} />
                  </Suspense>
                  <Toaster />
                  {/* Update notification for new versions */}
                  <UpdateNotification />
                </div>
              </FullscreenProvider>
            </LocalizationProvider>
          </FirebaseClientProvider>
        </TenantThemeProvider>
        </TenantParamProvider>
      </body>
    </html>
  );
}
