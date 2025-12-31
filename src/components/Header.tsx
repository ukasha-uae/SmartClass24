"use client";
import Link from 'next/link';
import { GraduationCap, Users, MessagesSquare, Trophy, HelpCircle, ChevronDown, Menu, Calendar, BookOpen, Globe, ChevronRight } from 'lucide-react';
import AuthModal from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import CountrySelector from './CountrySelector';
import NotificationBell from './NotificationBell';
import { FlagIcon } from './FlagIcon';
import { useFirebase, useDoc } from '@/firebase';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

export default function Header() {
  const { user, firestore } = useFirebase();
  const hasMounted = useHasMounted();
  const scrolled = useScrollPosition(10);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const { country } = useLocalization();
  const profileRef = useMemo(() => (user && firestore) ? doc(firestore, `students/${user.uid}`) : null, [user, firestore]);
  const { data: profile } = useDoc<any>(profileRef as any);
  
  // V1: Check feature access based on user's education level
  const { hasAccess: hasLessonsAccess } = useV1FeatureAccess('lessons');
  const { hasAccess: hasVirtualLabsAccess } = useV1FeatureAccess('virtualLabs');
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-r from-white/90 via-violet-50/90 to-indigo-50/90 dark:from-slate-900/90 dark:via-violet-950/90 dark:to-indigo-950/90 backdrop-blur-xl transition-all duration-300",
        scrolled && "shadow-xl shadow-violet-200/20 dark:shadow-violet-900/20"
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-300/10 to-indigo-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600 dark:text-violet-400 relative transition-transform group-hover:scale-110 group-hover:rotate-12 duration-200" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg md:text-xl font-bold font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              SmartC24
            </span>
            <span className="hidden xs:inline text-[9px] text-muted-foreground -mt-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Smart Learning</span>
          </div>
        </Link>
        
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Mobile Hamburger Menu */}
          {hasMounted && isMobile && (
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
                  
                  {/* Premium Country Selector - Collapsible */}
                  <Collapsible open={countryOpen} onOpenChange={setCountryOpen}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:scale-[1.02] group shadow-md">
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
                  
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                  
                  {/* Premium Profile Link - Only when signed in */}
                  {user && profile?.profilePictureUrl && (
                    <>
                      <Link 
                        href="/profile" 
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-[1.02] shadow-md group"
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-purple-300 dark:border-purple-700 shadow-lg">
                            <AvatarImage src={profile.profilePictureUrl} alt={profile.studentName || 'Student'} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-bold">{profile.studentName?.charAt(0)?.toUpperCase() || 'S'}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">{profile.studentName || 'Profile'}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">View Profile</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                    </>
                  )}
                      
                  {/* Premium Main Navigation Links */}
                  <nav className="flex flex-col gap-2">
                        {hasLessonsAccess && (
                          <Link 
                            href="/shs-programmes" 
                            onClick={() => setSheetOpen(false)}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-[1.02] shadow-md"
                          >
                            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-all">
                              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">SHS Programmes</span>
                            <ChevronRight className="h-4 w-4 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                          </Link>
                        )}
                        
                        {hasVirtualLabsAccess && (
                          <Link 
                            href="/virtual-labs" 
                            onClick={() => setSheetOpen(false)}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:scale-[1.02] shadow-md"
                          >
                            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all">
                              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Virtual Labs</span>
                            <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                          </Link>
                        )}
                        
                        <Link 
                          href="/challenge-arena" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Challenge Arena</span>
                          <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                        
                        <Link 
                          href="/study-schedule" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm border-2 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all">
                            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Study Schedule</span>
                          <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                        
                        <Link 
                          href="/wassce-questions" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">WASSCE Questions</span>
                          <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                      </nav>
                      
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                      
                      {/* Premium Community Links */}
                      <div className="space-y-2">
                        <p className="px-4 text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Community</p>
                        
                        <Link 
                          href="/study-groups" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 backdrop-blur-sm border-2 border-cyan-200/50 dark:border-cyan-800/50 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                            <MessagesSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Study Groups</span>
                          <ChevronRight className="h-4 w-4 text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                        
                        <Link 
                          href="/achievements-feed" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 backdrop-blur-sm border-2 border-yellow-200/50 dark:border-yellow-800/50 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-all">
                            <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-amber-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Achievements</span>
                          <ChevronRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                        
                        <Link 
                          href="/community" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 backdrop-blur-sm border-2 border-teal-200/50 dark:border-teal-800/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                            <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Q&A Community</span>
                          <ChevronRight className="h-4 w-4 text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                      </div>
                      
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                      
                      {/* Premium Other Portals */}
                      <div className="space-y-2">
                        <p className="px-4 text-sm font-bold bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">Portals</p>
                        
                        <Link 
                          href="/teacher/dashboard" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg group-hover:from-slate-500/30 group-hover:to-gray-500/30 transition-all">
                            <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-slate-600 group-hover:to-gray-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Teacher Dashboard</span>
                          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                        
                        <Link 
                          href="/parent/dashboard" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg group-hover:from-slate-500/30 group-hover:to-gray-500/30 transition-all">
                            <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-slate-600 group-hover:to-gray-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">Parent Portal</span>
                          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                      </div>
                      
                      {/* Premium PWA Test Link */}
                      <>
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/50 my-2" />
                        <Link 
                          href="/pwa-test" 
                          onClick={() => setSheetOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 backdrop-blur-sm border-2 border-pink-200/50 dark:border-pink-800/50 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:scale-[1.02] shadow-md"
                        >
                          <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-all">
                            <svg className="h-5 w-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">PWA Test</span>
                          <ChevronRight className="h-4 w-4 text-pink-600 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                      </>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop Navigation */}
          <CountrySelector 
            variant="compact" 
            showSearch={false} 
            className="hidden md:flex border-0 bg-transparent hover:bg-accent" 
          />
          <ThemeToggle className="hidden md:flex" />
          {hasMounted && user && (
            <>
              {/* Resources Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 sm:px-3 transition-colors">
                    <MessagesSquare className="h-4 w-4" />
                    <span className="hidden md:inline">Resources</span>
                    <ChevronDown className="h-3 w-3 hidden md:inline transition-transform group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in fade-in-50 slide-in-from-top-1">
                  <DropdownMenuLabel>Learning Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hasLessonsAccess && (
                    <Link href="/shs-programmes">
                      <DropdownMenuItem className="cursor-pointer">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        SHS Programmes
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {hasVirtualLabsAccess && (
                    <Link href="/virtual-labs">
                      <DropdownMenuItem className="cursor-pointer">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Virtual Labs
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/wassce-questions">
                    <DropdownMenuItem className="cursor-pointer">
                      <Trophy className="h-4 w-4 mr-2" />
                      WASSCE Questions
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Community</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/study-groups">
                    <DropdownMenuItem className="cursor-pointer">
                      <MessagesSquare className="h-4 w-4 mr-2" />
                      Study Groups
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/achievements-feed">
                    <DropdownMenuItem className="cursor-pointer">
                      <Trophy className="h-4 w-4 mr-2" />
                      Achievements
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/community">
                    <DropdownMenuItem className="cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Q&A Community
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/challenge-arena" className="hidden md:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 hover:border-violet-300/50 dark:hover:border-violet-700/50 border border-transparent transition-all hover:scale-105">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Arena</span>
                </Button>
              </Link>
              <Link href="/study-schedule" className="hidden lg:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Schedule</span>
                </Button>
              </Link>
              <NotificationBell />
              <Link href="/teacher/dashboard" className="hidden lg:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Teacher</span>
                </Button>
              </Link>
              <Link href="/parent/dashboard" className="hidden md:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Parent Portal</span>
                </Button>
              </Link>
              {profile?.profilePictureUrl && (
                <Link href="/profile" className="hidden sm:block">
                  <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={profile.profilePictureUrl} alt={profile.studentName || 'Student'} />
                    <AvatarFallback>{profile.studentName?.charAt(0)?.toUpperCase() || 'S'}</AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </>
          )}
          {hasMounted ? (
            <div className="hidden md:block">
              <AuthModal />
            </div>
          ) : (
            <div className="h-8 w-8 hidden md:block" />
          )}
        </div>
      </div>
    </header>
  );
}
