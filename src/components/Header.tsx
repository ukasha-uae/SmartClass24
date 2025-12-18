"use client";
import Link from 'next/link';
import { GraduationCap, Users, MessagesSquare, Trophy, HelpCircle, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import CountrySelector from './CountrySelector';
import NotificationBell from './NotificationBell';
import { useFirebase, useDoc } from '@/firebase';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useScrollPosition } from '@/hooks/use-scroll-position';
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
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, firestore } = useFirebase();
  const hasMounted = useHasMounted();
  const scrolled = useScrollPosition(10);
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
          <CountrySelector 
            variant="compact" 
            showSearch={false} 
            className="hidden xs:flex border-0 bg-transparent hover:bg-accent" 
          />
          <ThemeToggle />
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
          {hasMounted ? <AuthModal /> : <div className="h-8 w-8" />}
        </div>
      </div>
    </header>
  );
}
