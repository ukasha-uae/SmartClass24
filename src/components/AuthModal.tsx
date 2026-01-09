"use client";

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase';
import { linkAnonymousToEmail, initiateEmailSignIn, initiateEmailSignUp, doSignOut, migrateLocalAttemptsToFirestore, sendPasswordReset } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function AuthModal() {
  const { auth, user, firestore } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sign-in'|'sign-up'>('sign-in');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(true); // Default to true for better UX
  const [open, setOpen] = useState(false); // Control dialog open state
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
        toast({ title: 'Account created', description: 'Your anonymous session is now linked to your email.', duration: 3000 });
        // Close dialog after a short delay to show the success message
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      } else {
        await initiateEmailSignUp(auth, email, password, stayLoggedIn);
        // Save preference for future reference
        if (typeof window !== 'undefined') {
          localStorage.setItem('stayLoggedInPreference', String(stayLoggedIn));
        }
        // Successful sign-up - welcome as new user (user is auto-signed in)
        toast({ 
          title: 'Account created successfully!', 
          description: stayLoggedIn 
            ? 'Welcome! Your account has been created and you are signed in.' 
            : 'Welcome! Your account has been created and you are signed in for this session.',
          duration: 3000
        });
        setActiveTab('sign-in');
        setPassword('');
        // Close dialog after a short delay to show the success message
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      }
    } catch (err: any) {
      // Only log unexpected errors, not email-already-in-use
      if (err?.code !== 'auth/email-already-in-use') {
        console.error('Sign up error', err);
      }
      // If email already in use, welcome them and ask to sign in (no red warning)
      if (err?.code === 'auth/email-already-in-use') {
        toast({ 
          title: 'Welcome!', 
          description: 'Your account is ready. Please sign in to continue.',
          duration: 5000
        });
        setActiveTab('sign-in');
        setPassword('');
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
      await initiateEmailSignIn(auth, email, password, stayLoggedIn);
      // Save preference for future reference
      if (typeof window !== 'undefined') {
        localStorage.setItem('stayLoggedInPreference', String(stayLoggedIn));
      }
      toast({ 
        title: 'Signed in successfully', 
        description: stayLoggedIn 
          ? 'Welcome! You are now signed in and will stay logged in.' 
          : 'Welcome! You are now signed in.',
        duration: 3000
      });
      setShowForgotPassword(false);
      setResetEmailSent(false);
      // Close dialog after a short delay to show the success message
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err: any) {
      // Handle invalid credentials professionally
      if (err?.code === 'auth/wrong-password' || 
          err?.code === 'auth/user-not-found' || 
          err?.code === 'auth/invalid-credential' ||
          err?.code === 'auth/invalid-email') {
        // Show professional error message and offer password reset
        toast({ 
          title: 'Invalid credentials', 
          description: 'The email or password you entered is incorrect. Would you like to reset your password?', 
          variant: 'destructive',
          duration: 5000
        });
        setShowForgotPassword(true);
      } else if (err?.code === 'auth/too-many-requests') {
        toast({ 
          title: 'Too many attempts', 
          description: 'Too many failed login attempts. Please try again later or reset your password.', 
          variant: 'destructive' 
        });
        setShowForgotPassword(true);
      } else {
        // For other errors, show a generic message
        toast({ 
          title: 'Sign-in failed', 
          description: 'Unable to sign in. Please check your connection and try again.', 
          variant: 'destructive' 
        });
      }
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!auth) { 
      toast({ title: 'Error', description: 'Auth is unavailable.' }); 
      return; 
    }
    if (!email.trim()) { 
      toast({ title: 'Email required', description: 'Please enter your email address to reset your password.' }); 
      return; 
    }
    
    setLoading(true);
    try {
      await sendPasswordReset(auth, email);
      setResetEmailSent(true);
      toast({ 
        title: 'Password reset email sent', 
        description: `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`,
        duration: 6000
      });
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') {
        toast({ 
          title: 'Email not found', 
          description: 'No account found with this email address. Please check your email or sign up for a new account.', 
          variant: 'destructive' 
        });
      } else if (err?.code === 'auth/invalid-email') {
        toast({ 
          title: 'Invalid email', 
          description: 'Please enter a valid email address.', 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Error', 
          description: 'Unable to send password reset email. Please try again later.', 
          variant: 'destructive' 
        });
      }
    } finally {
      setLoading(false);
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Input 
                placeholder="Email" 
                value={email} 
                onChange={(e) => {
                  setEmail((e.target as HTMLInputElement).value);
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }} 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    signIn();
                  }
                }}
              />
              
              {/* Stay Logged In Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stay-logged-in" 
                  checked={stayLoggedIn}
                  onCheckedChange={(checked) => setStayLoggedIn(checked === true)}
                />
                <Label 
                  htmlFor="stay-logged-in" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Stay logged in
                </Label>
              </div>
              
              {/* Forgot Password Section */}
              {showForgotPassword && !resetEmailSent && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Forgot your password? We can help you reset it.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Sending...' : 'Send Password Reset Email'}
                  </Button>
                </div>
              )}
              
              {resetEmailSent && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    ✓ Password reset email sent! Check your inbox at <strong>{email}</strong> and follow the instructions to reset your password.
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button disabled={loading} onClick={signIn}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="sign-up" className="space-y-2 mt-4">
              <Input placeholder="Email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />
              
              {/* Stay Logged In Checkbox for Sign Up */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stay-logged-in-signup" 
                  checked={stayLoggedIn}
                  onCheckedChange={(checked) => setStayLoggedIn(checked === true)}
                />
                <Label 
                  htmlFor="stay-logged-in-signup" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Stay logged in
                </Label>
              </div>
              
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
