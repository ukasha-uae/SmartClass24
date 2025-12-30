"use client";

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase';
import { linkAnonymousToEmail, initiateEmailSignIn, initiateEmailSignUp, doSignOut, migrateLocalAttemptsToFirestore } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';

export default function AuthModal() {
  const { auth, user, firestore } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sign-in'|'sign-up'>('sign-in');
  const { toast } = useToast();

  const signUp = async () => {
    if (!auth) { toast({ title: 'Error', description: 'Auth is unavailable.'}); return; }
    if (!email.trim()) { toast({ title: 'Email required', description: 'Please enter your email address.' }); return; }
    if (!password.trim()) { toast({ title: 'Password required', description: 'Please enter a password.' }); return; }
    if (password.length < 6) { toast({ title: 'Password too short', description: 'Password must be at least 6 characters.' }); return; }
    setLoading(true);
    try {
      if (user && (user as any).isAnonymous) {
        // Link anonymous user to email credential
        await linkAnonymousToEmail(auth, email, password);
        // Attempt to migrate any local quiz attempts into Firestore for this user
        try {
          const migratedCount = await migrateLocalAttemptsToFirestore(auth, firestore);
          if (migratedCount > 0) {
            toast({ title: 'Progress migrated', description: `Successfully migrated ${migratedCount} local quiz attempt(s) to your profile.` });
          }
        } catch (e) {
          console.error('Migration error after linking:', e);
          // Don't block flow — migration is best-effort.
        }
        toast({ title: 'Account created', description: 'Your anonymous session is now linked to your email.' });
      } else {
        await initiateEmailSignUp(auth, email, password);
      }
    } catch (err: any) {
      // Only log unexpected errors, not email-already-in-use
      if (err?.code !== 'auth/email-already-in-use') {
        console.error('Sign up error', err);
      }
      // If email already in use, show message prompting sign in
      if (err?.code === 'auth/email-already-in-use') {
        toast({ title: 'Email already in use', description: 'This email is already registered. Please sign in instead.', variant: 'destructive' });
        setActiveTab('sign-in');
        setPassword('');
        // Optionally focus email input if you use a ref
        // if (emailInputRef.current) emailInputRef.current.focus();
      } else {
        toast({ title: 'Sign-up failed', description: err?.message || String(err), variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!auth) { toast({ title: 'Error', description: 'Auth is unavailable.'}); return; }
    if (!email.trim()) { toast({ title: 'Email required', description: 'Please enter your email address.' }); return; }
    if (!password.trim()) { toast({ title: 'Password required', description: 'Please enter a password.' }); return; }
    setLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({ title: 'Signed in successfully', description: 'Welcome back!' });
    } catch (err: any) {
      console.error('Sign in error', err);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        toast({ title: 'Sign-in failed', description: 'Invalid email or password.', variant: 'destructive' });
      } else if (err?.code === 'auth/invalid-credential') {
        toast({ title: 'Sign-in failed', description: 'Invalid email or password.', variant: 'destructive' });
      } else {
        toast({ title: 'Sign-in failed', description: err?.message || String(err), variant: 'destructive' });
      }
    } finally { setLoading(false); }
  };

  const signOutClick = async () => {
    if (!auth) return;
    try {
      await doSignOut(auth);
    } catch (err) {
      console.error('Sign out error', err);
      toast({ title: 'Sign-out failed', description: 'Try again.' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">{user ? 'Account' : 'Sign in'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in or Create Account</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="sign-in">Sign in</TabsTrigger>
              <TabsTrigger value="sign-up">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in" className="space-y-2 mt-4">
              <Input placeholder="Email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
              <div className="flex gap-2 justify-end">
                <Button disabled={loading} onClick={signIn}>Sign in</Button>
              </div>
            </TabsContent>
            <TabsContent value="sign-up" className="space-y-2 mt-4">
              <Input placeholder="Email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
              <div className="flex gap-2 justify-end">
                <Button disabled={loading} onClick={signUp}>Create Account</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            {user && <Button variant="ghost" onClick={signOutClick}>Sign out</Button>}
            <div />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
