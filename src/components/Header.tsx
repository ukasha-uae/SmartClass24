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
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm transition-shadow duration-300",
        scrolled && "shadow-md"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600 dark:text-violet-400 transition-transform group-hover:scale-110 duration-200" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg md:text-xl font-bold font-headline bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              SmartC24
            </span>
            <span className="hidden xs:inline text-[9px] text-muted-foreground -mt-1">Smart Learning</span>
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
              <SheetContent side="left" className="w-[280px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {/* Dark Mode & Auth Section */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <span className="text-sm font-medium">Dark Mode</span>
                    </div>
                    <AuthModal />
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  {/* Country Selector - Collapsible */}
                  <Collapsible open={countryOpen} onOpenChange={setCountryOpen}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-foreground">Country</span>
                            <span className="text-xs text-muted-foreground group-hover:text-foreground/70 flex items-center gap-1.5 transition-colors">
                              {country?.iso2 && <FlagIcon countryCode={country.iso2} size="sm" />}
                              {country?.name || 'Select country'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all",
                          countryOpen && "rotate-90"
                        )} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <div className="mt-2 space-y-2">
                        <CountrySelector 
                          variant="default" 
                          showSearch={true} 
                          className="w-full" 
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="h-px bg-border" />
                  
                  {/* Profile Link - Only when signed in */}
                  {user && profile?.profilePictureUrl && (
                    <>
                      <Link 
                        href="/profile" 
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.profilePictureUrl} alt={profile.studentName || 'Student'} />
                          <AvatarFallback>{profile.studentName?.charAt(0)?.toUpperCase() || 'S'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{profile.studentName || 'Profile'}</span>
                          <span className="text-xs text-muted-foreground">View Profile</span>
                        </div>
                      </Link>
                      
                      <div className="h-px bg-border" />
                    </>
                  )}
                      
                  {/* Main Navigation Links */}
                  <nav className="flex flex-col gap-1">
                        <Link 
                          href="/shs-programmes" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="font-medium">SHS Programmes</span>
                        </Link>
                        
                        <Link 
                          href="/virtual-labs" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <svg className="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span className="font-medium">Virtual Labs</span>
                        </Link>
                        
                        <Link 
                          href="/challenge-arena" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <Trophy className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="font-medium">Challenge Arena</span>
                        </Link>
                        
                        <Link 
                          href="/study-schedule" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="font-medium">Study Schedule</span>
                        </Link>
                        
                        <Link 
                          href="/wassce-questions" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="font-medium">WASSCE Questions</span>
                        </Link>
                      </nav>
                      
                      <div className="h-px bg-border" />
                      
                      {/* Community Links */}
                      <div className="space-y-1">
                        <p className="px-3 text-sm font-medium text-muted-foreground">Community</p>
                        
                        <Link 
                          href="/study-groups" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <MessagesSquare className="h-5 w-5" />
                          <span>Study Groups</span>
                        </Link>
                        
                        <Link 
                          href="/achievements-feed" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <Trophy className="h-5 w-5" />
                          <span>Achievements</span>
                        </Link>
                        
                        <Link 
                          href="/community" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span>Q&A Community</span>
                        </Link>
                      </div>
                      
                      <div className="h-px bg-border" />
                      
                      {/* Other Portals */}
                      <div className="space-y-1">
                        <p className="px-3 text-sm font-medium text-muted-foreground">Portals</p>
                        
                        <Link 
                          href="/teacher/dashboard" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Teacher Dashboard</span>
                        </Link>
                        
                        <Link 
                          href="/parent/dashboard" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <Users className="h-5 w-5" />
                          <span>Parent Portal</span>
                        </Link>
                      </div>
                      
                      {/* PWA Test Link */}
                      <>
                        <div className="h-px bg-border" />
                        <Link 
                          href="/pwa-test" 
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-foreground"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>PWA Test</span>
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
                  <Link href="/shs-programmes">
                    <DropdownMenuItem className="cursor-pointer">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      SHS Programmes
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/virtual-labs">
                    <DropdownMenuItem className="cursor-pointer">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Virtual Labs
                    </DropdownMenuItem>
                  </Link>
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
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">Arena</span>
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
