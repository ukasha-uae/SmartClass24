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
import { PWAInstallProvider } from '@/contexts/PWAInstallContext';
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
import { getTenantPwaIconUrls, getProductionSafeIconUrl } from '@/tenancy/pwa';
import { getCountryConfig } from '@/lib/localization/countries';

// Base metadata (merged with tenant-specific in generateMetadata)
const baseMetadata: Metadata = {
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
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartclass24.app',
    siteName: 'SmartClass24',
    title: 'SmartClass24 - Global AI-Powered Learning Platform',
    description: 'White-label education platform serving students worldwide. Interactive virtual labs, gamified learning, and personalized AI tutoring.',
    images: [{ url: '/og-image-global.png', width: 1200, height: 630, alt: 'SmartClass24 - Global Learning Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartClass24 - Global AI Learning Platform',
    description: 'Master West African exams with AI-driven learning, virtual labs, and challenge arenas.',
    images: ['/og-image-global.png'],
    creator: '@smartclass24',
  },
};

/** Tenant-aware title and app name so installed PWA (e.g. Wisdom) shows their brand in the title bar. */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const tenantId = headerStore.get('x-tenant') ?? cookieStore.get('tenant')?.value ?? null;
  const tenant = tenantId && TENANT_REGISTRY[tenantId] ? TENANT_REGISTRY[tenantId] : TENANT_REGISTRY.smartclass24;
  const name = tenant.branding.name;
  const title = tenantId && tenantId !== 'smartclass24'
    ? `${name} - Smart Learning Platform`
    : 'SmartClass24 - Global AI-Powered Learning Platform';
  return {
    ...baseMetadata,
    title,
    applicationName: name,
    openGraph: {
      ...baseMetadata.openGraph,
      siteName: name,
      title,
    },
    twitter: baseMetadata.twitter ? { ...baseMetadata.twitter, title } : undefined,
  };
}

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

  // Tenant-specific manifest so "Open in App" / install uses correct name and icon (Wisdom gets their logo via API)
  const manifestUrl =
    initialTenantId && initialTenantId !== 'smartclass24'
      ? `/api/manifest?tenant=${initialTenantId}`
      : '/manifest.json';

  const themeColor = tenantConfig.branding.primaryColor;
  const pwaIcons = getTenantPwaIconUrls(initialTenantId ?? 'smartclass24', tenantConfig.branding);
  const appleTouchIconHref = getProductionSafeIconUrl(initialTenantId ?? '', pwaIcons.icon192);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA Manifest - tenant-specific so install uses tenant name and logo */}
        <link rel="manifest" href={manifestUrl} />
        <link rel="apple-touch-icon" href={appleTouchIconHref} />
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
          <PWAInstallProvider>
          <TenantTitle />
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
                  {/* PWA install prompt for all tenants (each gets their own branded install with their logo) */}
                  <PWAInstallPrompt />
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
          </PWAInstallProvider>
        </TenantThemeProvider>
        </TenantParamProvider>
      </body>
    </html>
  );
}
