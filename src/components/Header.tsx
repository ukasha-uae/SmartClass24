"use client";
import Link from 'next/link';
import { GraduationCap, Users, MessagesSquare, Trophy, HelpCircle, ChevronDown, Menu, Calendar, BookOpen, Globe, ChevronRight, MessageCircle, Lock, Download } from 'lucide-react';
import AuthModal from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import CountrySelector from './CountrySelector';
import NotificationBell from './NotificationBell';
import { FlagIcon } from './FlagIcon';
import { TenantLogo } from './tenancy/TenantLogo';
import { useFirebase, useDoc } from '@/firebase';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SubscriptionStatusBadge } from '@/components/SubscriptionStatusBadge';
import { Button } from '@/components/ui/button';
import { buildNavigation } from '@/lib/navigation-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { doc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/useLocalization';
import { useV1FeatureAccess } from '@/components/V1RouteGuard';
import { useFullscreen } from '@/contexts/FullscreenContext';
import { usePWAInstall } from '@/contexts/PWAInstallContext';

// WhatsApp Header Button Component
function WhatsAppHeaderButton({ isMobile = false }: { isMobile?: boolean }) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+233244432795'; // Fallback for development
  const message = 'Hello! I would like to purchase coins or subscribe to premium.';

  const formatPhoneNumber = (phone: string): string => {
    let formatted = phone.replace(/^\+/, '').replace(/^0/, '');
    if (!formatted.startsWith('233')) {
      formatted = '233' + formatted;
    }
    return formatted;
  };

  const handleWhatsAppClick = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleWhatsAppClick}
        className="flex items-center justify-center p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-300/30 dark:border-green-700/30 hover:border-green-400/50 dark:hover:border-green-600/50 transition-all hover:scale-105"
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleWhatsAppClick}
      className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-300/30 dark:border-green-700/30 hover:border-green-400/50 dark:hover:border-green-600/50 transition-all hover:scale-105"
      title="Contact us on WhatsApp"
    >
      <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <span className="hidden lg:inline font-semibold text-green-700 dark:text-green-400">WhatsApp</span>
    </Button>
  );
}

export default function Header() {
  const { user, firestore } = useFirebase();
  const scrolled = useScrollPosition(10);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const { country } = useLocalization();
  const { tenant, tenantId, market, branding, hasLocalization, features, hasArenaChallenge, hasVirtualLabs } = useTenant();
  const { isFullscreen } = useFullscreen();
  const pwaInstall = usePWAInstall();
  const addTenantParam = useTenantLink();
  const profileRef = useMemo(() => (user && firestore) ? doc(firestore, `students/${user.uid}`) : null, [user, firestore]);
  const { data: profile } = useDoc<any>(profileRef as any);
  
  // V1: Check feature access based on user's education level
  const { hasAccess: hasLessonsAccess } = useV1FeatureAccess('lessons');
  const { hasAccess: hasVirtualLabsAccess } = useV1FeatureAccess('virtualLabs');
  
  // Hide header during fullscreen (gameplay/lessons)
  if (isFullscreen) {
    return null;
  }
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-r from-white/90 via-violet-50/90 to-indigo-50/90 dark:from-slate-900/90 dark:via-violet-950/90 dark:to-indigo-950/90 backdrop-blur-xl transition-all duration-300",
        scrolled && "shadow-xl shadow-violet-200/20 dark:shadow-violet-900/20"
      )}
      suppressHydrationWarning
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-300/10 to-indigo-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative" suppressHydrationWarning>
        <Link 
          href={addTenantParam('/')}
          className="flex items-center gap-2.5 group shrink-0"
          suppressHydrationWarning
        >
          {/* Tenant-aware logo */}
          <TenantLogo size="md" className="transition-transform group-hover:scale-105" />
        </Link>
        
        <div className="ml-auto flex items-center gap-1 sm:gap-2 relative z-10" suppressHydrationWarning>
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center gap-1">
            {tenantId === 'smartclass24' && <WhatsAppHeaderButton isMobile={true} />}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto p-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-indigo-950/30 border-r-2 border-purple-200/30 dark:border-purple-800/30">
                {/* Premium Animated Background */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-300/20 via-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <SheetHeader className="relative z-10 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-2 border-purple-200/30 dark:border-purple-800/30">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl">
                      <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-0 flex flex-col gap-2 p-4 relative z-10">
                  {/* Premium Dark Mode & Auth Section */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg">
                        <ThemeToggle />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
                    </div>
                    <AuthModal />
                  </div>
                  
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />

                  {/* Install app - only when browser offers one-click install (no 3-dots instructions) */}
                  {pwaInstall?.canShowInstall && pwaInstall?.deferredPrompt && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSheetOpen(false); pwaInstall.triggerInstall(); }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:scale-[1.02] shadow-md group text-left cursor-pointer"
                    >
                      <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg">
                        <Download className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Install {branding.name}</span>
                      <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </button>
                  )}

                  <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                  
                  {/* Premium Country Selector - Collapsible (only show if localization enabled) */}
                  {hasLocalization && (
                  <Collapsible open={countryOpen} onOpenChange={setCountryOpen}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all hover:scale-[1.02] group shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Country</span>
                            <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 flex items-center gap-1.5 transition-colors font-medium">
                              {country?.iso2 && <FlagIcon countryCode={country.iso2} size="sm" />}
                              {country?.name || 'Select country'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={cn(
                          "h-5 w-5 text-blue-600 dark:text-blue-400 transition-all",
                          countryOpen && "rotate-90"
                        )} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 pb-3 pt-2">
                      <div className="mt-2 p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30">
                        <CountrySelector 
                          variant="default" 
                          showSearch={true} 
                          className="w-full" 
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  )}
                  
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                  
                  {/* Premium Profile Link - Only when signed in */}
                  {user && (
                    <>
                      <Link 
                        href={addTenantParam("/profile")} 
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-[1.02] shadow-md group"
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-purple-300 dark:border-purple-700 shadow-lg">
                            <AvatarImage src={profile?.profilePictureUrl} alt={profile?.studentName || 'Student'} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-bold">
                              {profile?.studentName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                            {profile?.studentName || user.email || 'Profile'}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <SubscriptionStatusBadge variant="compact" />
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">View Profile</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                    </>
                  )}

                  {/* Parent & Teacher Dashboard Links - Conditional based on tenant */}
                  {features.enableParentDashboard && (
                    <>
                      <Link 
                        href={addTenantParam("/parent/dashboard")} 
                        onClick={() => setSheetOpen(false)}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 backdrop-blur-sm border-2 border-teal-200/50 dark:border-teal-800/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all hover:scale-[1.02] shadow-md"
                      >
                        <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                          <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Parent Dashboard</span>
                        <ChevronRight className="h-4 w-4 text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </Link>
                      
                      <Link 
                        href={addTenantParam("/teacher/dashboard")} 
                        onClick={() => setSheetOpen(false)}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-rose-200/50 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-700 transition-all hover:scale-[1.02] shadow-md"
                      >
                        <div className="p-2 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all">
                          <GraduationCap className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Teacher Dashboard</span>
                        <ChevronRight className="h-4 w-4 text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </Link>
                      
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                    </>
                  )}
                      
                  {/* Dynamic Navigation - Platform, Regional, Global, Utility */}
                  {(() => {
                    const nav = buildNavigation(country, tenant);
                    
                    return (
                      <div className="flex flex-col gap-4">
                        {/* Platform Section */}
                        {nav.platform.show && (
                          <div>
                            <div className="px-4 mb-3">
                              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {nav.platform.title}
                              </h3>
                              {nav.platform.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                  {nav.platform.description}
                                </p>
                              )}
                            </div>
                            <nav className="flex flex-col gap-2">
                              {nav.platform.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={addTenantParam(item.href)}
                                    onClick={() => setSheetOpen(false)}
                                    className={`group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border-2 ${item.borderColor} ${item.hoverBorder} transition-all hover:scale-[1.02] shadow-md`}
                                  >
                                    <div className={`p-2 bg-gradient-to-br ${item.iconBg} rounded-lg transition-all`}>
                                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                      <span className={`font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r ${item.textGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                        {item.label}
                                      </span>
                                      {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    {item.showBadge && item.badgeText && (
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.badgeColor}`}>
                                        {item.badgeText}
                                      </span>
                                    )}
                                    <ChevronRight className={`h-4 w-4 ${item.iconColor} opacity-0 group-hover:opacity-100 transition-opacity ml-auto`} />
                                  </Link>
                                );
                              })}
                            </nav>
                          </div>
                        )}
                        
                        {/* Regional Section */}
                        {nav.regional.show && (
                          <div>
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700 my-3" />
                            <div className="px-4 mb-3">
                              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                {country && <FlagIcon countryCode={country.iso2} size="sm" />}
                                {nav.regional.title}
                              </h3>
                              {nav.regional.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                  {nav.regional.description}
                                </p>
                              )}
                            </div>
                            <nav className="flex flex-col gap-2">
                              {nav.regional.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={addTenantParam(item.href)}
                                    onClick={() => setSheetOpen(false)}
                                    className={`group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border-2 ${item.borderColor} ${item.hoverBorder} transition-all hover:scale-[1.02] shadow-md`}
                                  >
                                    <div className={`p-2 bg-gradient-to-br ${item.iconBg} rounded-lg transition-all`}>
                                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                      <span className={`font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r ${item.textGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                        {item.label}
                                      </span>
                                      {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    {item.showBadge && item.badgeText && (
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.badgeColor}`}>
                                        {item.badgeText}
                                      </span>
                                    )}
                                    <ChevronRight className={`h-4 w-4 ${item.iconColor} opacity-0 group-hover:opacity-100 transition-opacity ml-auto`} />
                                  </Link>
                                );
                              })}
                            </nav>
                          </div>
                        )}
                        
                        {/* Global Section (when no country selected) */}
                        {nav.global.show && (
                          <div>
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700 my-3" />
                            <div className="px-4 mb-3">
                              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                🌍 {nav.global.title}
                              </h3>
                              {nav.global.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                  {nav.global.description}
                                </p>
                              )}
                            </div>
                            <nav className="flex flex-col gap-2">
                              {nav.global.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={addTenantParam(item.href)}
                                    onClick={() => setSheetOpen(false)}
                                    className={`group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border-2 ${item.borderColor} ${item.hoverBorder} transition-all hover:scale-[1.02] shadow-md`}
                                  >
                                    <div className={`p-2 bg-gradient-to-br ${item.iconBg} rounded-lg transition-all`}>
                                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                      <span className={`font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r ${item.textGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                        {item.label}
                                      </span>
                                      {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    {item.showBadge && item.badgeText && (
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.badgeColor}`}>
                                        {item.badgeText}
                                      </span>
                                    )}
                                    <ChevronRight className={`h-4 w-4 ${item.iconColor} opacity-0 group-hover:opacity-100 transition-opacity ml-auto`} />
                                  </Link>
                                );
                              })}
                            </nav>
                          </div>
                        )}
                        
                        {/* Utility Section */}
                        {nav.utility.show && (
                          <div>
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700 my-3" />
                            <nav className="flex flex-col gap-2">
                              {nav.utility.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={addTenantParam(item.href)}
                                    onClick={() => setSheetOpen(false)}
                                    className={`group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border-2 ${item.borderColor} ${item.hoverBorder} transition-all hover:scale-[1.02] shadow-md`}
                                  >
                                    <div className={`p-2 bg-gradient-to-br ${item.iconBg} rounded-lg transition-all`}>
                                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                    </div>
                                    <span className={`font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r ${item.textGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                      {item.label}
                                    </span>
                                    <ChevronRight className={`h-4 w-4 ${item.iconColor} opacity-0 group-hover:opacity-100 transition-opacity ml-auto`} />
                                  </Link>
                                );
                              })}
                            </nav>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Install app - desktop: only when browser offers one-click install (no 3-dots instructions) */}
          {pwaInstall?.canShowInstall && pwaInstall?.deferredPrompt && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); pwaInstall.triggerInstall(); }}
              className="hidden md:flex items-center gap-2 cursor-pointer select-none text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 border border-transparent hover:border-violet-300/50 transition-all relative z-10"
              title={`Install ${branding.name}`}
            >
              <Download className="h-4 w-4" />
              <span className="font-semibold">Install app</span>
            </Button>
          )}

          {/* Desktop Navigation */}
          <CountrySelector 
            variant="compact" 
            showSearch={false} 
            className={hasLocalization ? "hidden md:flex border-0 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30" : "hidden"}
          />
          <ThemeToggle className="hidden md:flex" />
          {/* WhatsApp Button - Desktop (Hidden on Mobile) */}
          <div className="hidden md:block">
            {tenantId === 'smartclass24' && <WhatsAppHeaderButton isMobile={false} />}
          </div>
          {user && (
            <>
              {/* Parent & Teacher Dashboard - Conditional based on tenant */}
              {features.enableParentDashboard && (
                <>
                  <Link href={addTenantParam("/parent/dashboard")} className="hidden md:block">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-cyan-500/10 hover:border-teal-300/50 dark:hover:border-teal-700/50 border border-transparent transition-all hover:scale-105">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">Parent</span>
                    </Button>
                  </Link>
                  
                  <Link href={addTenantParam("/teacher/dashboard")} className="hidden md:block">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 hover:border-rose-300/50 dark:hover:border-rose-700/50 border border-transparent transition-all hover:scale-105">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-semibold">Teacher</span>
                    </Button>
                  </Link>
                </>
              )}

              {/* Virtual Labs - Conditional based on tenant */}
              {hasVirtualLabs && (
              <Link href={addTenantParam("/virtual-labs")} className="hidden md:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>Virtual Labs</span>
                </Button>
              </Link>
              )}

              {features.enablePublicPricing !== false && (
              <Link href={addTenantParam(country ? "/pricing" : "/pricing/global")} className="hidden md:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-300/50 dark:hover:border-green-700/50 border border-transparent transition-all hover:scale-105">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Pricing</span>
                </Button>
              </Link>
              )}
              {hasArenaChallenge && (
              <Link href={addTenantParam("/challenge-arena")} className="hidden md:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 hover:border-violet-300/50 dark:hover:border-violet-700/50 border border-transparent transition-all hover:scale-105">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Arena</span>
                </Button>
              </Link>
              )}
              <NotificationBell />
              {user && (
                <div className="hidden sm:flex items-center gap-2">
                  <SubscriptionStatusBadge variant="compact" />
                  {profile?.profilePictureUrl ? (
                    <Link href={addTenantParam("/profile")}>
                      <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity border-2 border-violet-300 dark:border-violet-700">
                        <AvatarImage src={profile.profilePictureUrl} alt={profile.studentName || 'Student'} />
                        <AvatarFallback>{profile.studentName?.charAt(0)?.toUpperCase() || 'S'}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ) : (
                    <Link href={addTenantParam("/profile")}>
                      <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity border-2 border-violet-300 dark:border-violet-700">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                          {user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
          <div className="hidden md:block">
            <AuthModal />
          </div>
        </div>
      </div>
    </header>
  );
}
