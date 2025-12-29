import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/PWAPrompts';
import { LocalizationProvider } from '@/lib/localization/localization-context';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
         <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className={cn('font-body antialiased bg-background h-full')}>
        <FirebaseClientProvider>
          <LocalizationProvider>
            <div className="relative flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1 pb-20 md:pb-8 pt-16">{children}</main>
              <Footer />
              <ProfileSetupDialog />
              <PWAInstallPrompt />
              <PWAUpdatePrompt />
              <BottomNav />
              <Toaster />
            </div>
          </LocalizationProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
