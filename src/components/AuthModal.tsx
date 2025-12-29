"use client";

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase';
import { linkAnonymousToEmail, initiateEmailSignIn, initiateEmailSignUp, doSignOut, migrateLocalAttemptsToFirestore, sendPasswordReset } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

/**
 * Get user-friendly error message from Firebase error code
 */
function getAuthErrorMessage(error: any): { title: string; description: string } {
  const errorCode = error?.code || '';
  
  // Sign-in errors
  if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
    return {
      title: 'Incorrect password',
      description: 'The password you entered is incorrect. Please check and try again.'
    };
  }
  
  if (errorCode === 'auth/user-not-found') {
    return {
      title: 'Account not found',
      description: 'No account exists with this email address. Please sign up to create an account.'
    };
  }
  
  if (errorCode === 'auth/invalid-email') {
    return {
      title: 'Invalid email',
      description: 'Please enter a valid email address (e.g., student@example.com).'
    };
  }
  
  if (errorCode === 'auth/user-disabled') {
    return {
      title: 'Account disabled',
      description: 'This account has been disabled. Please contact support for assistance.'
    };
  }
  
  if (errorCode === 'auth/too-many-requests') {
    return {
      title: 'Too many attempts',
      description: 'Too many failed sign-in attempts. Please wait a few minutes and try again.'
    };
  }
  
  // Sign-up errors
  if (errorCode === 'auth/email-already-in-use') {
    return {
      title: 'Email already registered',
      description: 'An account with this email already exists. Please sign in instead or use a different email.'
    };
  }
  
  if (errorCode === 'auth/weak-password') {
    return {
      title: 'Password too weak',
      description: 'Your password should be at least 6 characters long. Please choose a stronger password.'
    };
  }
  
  if (errorCode === 'auth/operation-not-allowed') {
    return {
      title: 'Sign-up not allowed',
      description: 'Email/password sign-up is currently disabled. Please contact support.'
    };
  }
  
  // Network errors
  if (errorCode === 'auth/network-request-failed') {
    return {
      title: 'Connection error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.'
    };
  }
  
  // Generic fallback
  return {
    title: 'Something went wrong',
    description: 'We couldn\'t complete your request. Please try again in a moment.'
  };
}

export default function AuthModal() {
  const { auth, user, firestore } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sign-in'|'sign-up'>('sign-in');
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();

  const signUp = async () => {
    setError(null);
    
    if (!auth) { 
      setError({ title: 'Error', description: 'Authentication service is unavailable. Please refresh the page.' });
      return; 
    }
    
    if (!email.trim()) { 
      setError({ title: 'Email required', description: 'Please enter your email address to create an account.' });
      return; 
    }
    
    if (!password.trim()) { 
      setError({ title: 'Password required', description: 'Please enter a password to secure your account.' });
      return; 
    }
    
    if (password.length < 6) { 
      setError({ title: 'Password too short', description: 'Your password must be at least 6 characters long for security.' });
      return; 
    }
    
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
        setError(null);
        
        // Close dialog after showing success message (1.5 seconds)
        setTimeout(() => {
          setDialogOpen(false);
          // Clear form fields
          setEmail('');
          setPassword('');
        }, 1500);
      } else {
        await initiateEmailSignUp(auth, email, password);
        toast({ title: 'Account created', description: 'Welcome! Your account has been created successfully.' });
        setError(null);
        
        // Close dialog after showing success message (1.5 seconds)
        setTimeout(() => {
          setDialogOpen(false);
          // Clear form fields
          setEmail('');
          setPassword('');
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      
      // If email already in use, switch to sign-in tab
      if (err?.code === 'auth/email-already-in-use') {
        setActiveTab('sign-in');
        setPassword('');
      }
      
      // Suppress console errors for expected user input errors
      // These are validation errors, not system errors - we show user-friendly messages instead
      const isExpectedError = err?.code && (
        err.code === 'auth/email-already-in-use' ||
        err.code === 'auth/weak-password' ||
        err.code === 'auth/invalid-email' ||
        err.code === 'auth/invalid-credential'
      );
      
      // Only log unexpected errors for debugging
      if (!isExpectedError) {
        console.error('Unexpected sign up error', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setError(null);
    
    if (!auth) { 
      setError({ title: 'Error', description: 'Authentication service is unavailable. Please refresh the page.' });
      return; 
    }
    
    if (!email.trim()) { 
      setError({ title: 'Email required', description: 'Please enter your email address to sign in.' });
      return; 
    }
    
    if (!password.trim()) { 
      setError({ title: 'Password required', description: 'Please enter your password to sign in.' });
      return; 
    }
    
    setLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({ title: 'Signed in successfully', description: 'Welcome back!' });
      setError(null);
      
      // Close dialog after showing success message (1.5 seconds)
      setTimeout(() => {
        setDialogOpen(false);
        // Clear form fields
        setEmail('');
        setPassword('');
      }, 1500);
    } catch (err: any) {
      // Handle error silently - show user-friendly message instead
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      
      // If user not found, suggest signing up
      if (err?.code === 'auth/user-not-found') {
        // Optionally switch to sign-up tab
        // setActiveTab('sign-up');
      }
      
      // Suppress console errors for expected credential errors
      // These are user input errors, not system errors - we show user-friendly messages instead
      const isExpectedError = err?.code && (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-email'
      );
      
      // Only log unexpected errors for debugging
      if (!isExpectedError) {
        console.error('Unexpected sign in error', err);
      }
    } finally { 
      setLoading(false); 
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setResetEmailSent(false);
    
    if (!auth) {
      setError({ title: 'Error', description: 'Authentication service is unavailable. Please refresh the page.' });
      return;
    }
    
    if (!email.trim()) {
      setError({ title: 'Email required', description: 'Please enter your email address to reset your password.' });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({ title: 'Invalid email', description: 'Please enter a valid email address.' });
      return;
    }
    
    setLoading(true);
    try {
      // Log for debugging
      logger.debug('Sending password reset email', { email });
      
      // Use default Firebase action URL (no custom redirect needed for V1)
      // Firebase will send email with link to their default reset page
      await sendPasswordReset(auth, email);
      
      logger.info('Password reset email sent successfully', { email });
      
      setResetEmailSent(true);
      setError(null);
      toast({ 
        title: 'Password reset email sent!', 
        description: 'Check your inbox (and spam folder) for instructions. The email may take 1-2 minutes to arrive.' 
      });
    } catch (err: any) {
      const errorCode = err?.code || '';
      
      if (errorCode === 'auth/user-not-found') {
        setError({ 
          title: 'Account not found', 
          description: 'No account exists with this email address. Please check your email or sign up to create an account.' 
        });
      } else if (errorCode === 'auth/invalid-email') {
        setError({ 
          title: 'Invalid email', 
          description: 'Please enter a valid email address.' 
        });
      } else if (errorCode === 'auth/too-many-requests') {
        setError({ 
          title: 'Too many requests', 
          description: 'Too many password reset requests. Please wait a few minutes and try again.' 
        });
      } else {
        setError({ 
          title: 'Unable to send email', 
          description: 'We couldn\'t send the password reset email. Please try again later.' 
        });
      }
      
      // Only log unexpected errors
      if (!errorCode.startsWith('auth/')) {
        console.error('Unexpected password reset error', err);
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{user ? 'Account' : 'Sign in'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in or Create Account</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => {
            setActiveTab(v as any);
            setError(null); // Clear error when switching tabs
            setPassword(''); // Clear password for security
            setShowForgotPassword(false); // Reset forgot password view
            setResetEmailSent(false); // Reset email sent state
          }}>
            <TabsList>
              <TabsTrigger value="sign-in">Sign in</TabsTrigger>
              <TabsTrigger value="sign-up">Sign up</TabsTrigger>
            </TabsList>
            
            {/* Error Alert - Shows above form */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">{error.title}</div>
                  <div className="text-sm">{error.description}</div>
                </AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="sign-in" className="space-y-4 mt-4">
              {!showForgotPassword ? (
                <>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Email" 
                      type="email"
                      value={email} 
                      onChange={(e) => {
                        setEmail((e.target as HTMLInputElement).value);
                        setError(null); // Clear error when user types
                      }}
                      className={error ? 'border-destructive' : ''}
                    />
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => {
                        setPassword((e.target as HTMLInputElement).value);
                        setError(null); // Clear error when user types
                      }}
                      className={error ? 'border-destructive' : ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !loading) {
                          signIn();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError(null);
                        setPassword('');
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                    <Button disabled={loading} onClick={signIn}>
                      {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {resetEmailSent ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium mb-1">Password reset email sent!</div>
                          <div className="text-sm">
                            We've sent password reset instructions to <strong>{email}</strong>. 
                            Please check your inbox and follow the link to reset your password.
                          </div>
                        </AlertDescription>
                      </Alert>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>Didn't receive the email?</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Check your spam/junk folder</li>
                          <li>Make sure you entered the correct email address</li>
                          <li>Wait a few minutes and try again</li>
                        </ul>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowForgotPassword(false);
                            setResetEmailSent(false);
                            setError(null);
                          }}
                        >
                          Back to Sign In
                        </Button>
                        <Button 
                          onClick={() => {
                            setResetEmailSent(false);
                            handleForgotPassword();
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Resend Email'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <Input 
                          placeholder="Email address" 
                          type="email"
                          value={email} 
                          onChange={(e) => {
                            setEmail((e.target as HTMLInputElement).value);
                            setError(null);
                          }}
                          className={error ? 'border-destructive' : ''}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !loading) {
                              handleForgotPassword();
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowForgotPassword(false);
                            setError(null);
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleForgotPassword}
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="sign-up" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Email" 
                  type="email"
                  value={email} 
                  onChange={(e) => {
                    setEmail((e.target as HTMLInputElement).value);
                    setError(null); // Clear error when user types
                  }}
                  className={error ? 'border-destructive' : ''}
                />
                <Input 
                  type="password" 
                  placeholder="Password (at least 6 characters)" 
                  value={password} 
                  onChange={(e) => {
                    setPassword((e.target as HTMLInputElement).value);
                    setError(null); // Clear error when user types
                  }}
                  className={error ? 'border-destructive' : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      signUp();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  By creating an account, you can save your progress and access it from any device.
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button disabled={loading} onClick={signUp}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
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
