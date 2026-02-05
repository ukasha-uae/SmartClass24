import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/HeaderNoSSR';
import Footer from '@/components/FooterNoSSR';
import BottomNav from '@/components/BottomNav';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/PWAPrompts';
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

export const metadata: Metadata = {
  title: 'Smartclass24',
  description: 'Smart learning for JHS & SHS students across Ghana',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
         <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className={cn('font-body antialiased bg-background h-full')}>
        <TenantThemeProvider>
          <ForceCacheClear />
          <FirebaseClientProvider>
            <LocalizationProvider>
              <FullscreenProvider>
                {/* Push Notification Components */}
                <NotificationHandler />
                <NotificationPermissionPrompt delay={8000} />

                <div className="relative flex min-h-screen w-full flex-col">
                  <Header />
                  <FullscreenMain>{children}</FullscreenMain>
                  <Footer />
                  <PWAInstallPrompt />
                  <PWAUpdatePrompt />
                  <FirstTimeProfileModal />
                  <Suspense fallback={null}>
                    <ReferralHandler />
                  </Suspense>
                  <BottomNav />
                  <Toaster />
                  {/* Update notification for new versions */}
                  <UpdateNotification />
                </div>
              </FullscreenProvider>
            </LocalizationProvider>
          </FirebaseClientProvider>
        </TenantThemeProvider>
      </body>
    </html>
  );
}
