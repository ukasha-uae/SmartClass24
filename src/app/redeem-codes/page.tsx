'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { 
  redeemReferralCode, 
  getUserReferralStats, 
  getReferralLink,
  type UserReferralStats 
} from '@/lib/referrals';
import { Gift, Copy, CheckCircle2, XCircle, Share2, MessageCircle, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default function RedeemCodesPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserReferralStats | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (isUserLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }

    // Load user's referral stats
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const userStats = await getUserReferralStats(user.uid);
        setStats(userStats);
        setReferralLink(getReferralLink(user.uid));
      } catch (error) {
        console.error('Error loading referral stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user, isUserLoading, router]);

  const handleRedeem = async () => {
    if (!user) return;
    if (!code.trim()) {
      toast({
        title: 'Code Required',
        description: 'Please enter a referral code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await redeemReferralCode(user.uid, code.trim().toUpperCase());
      
      if (result.success) {
        toast({
          title: 'Code Redeemed!',
          description: result.message,
        });
        setCode('');
        // Reload stats
        const userStats = await getUserReferralStats(user.uid);
        setStats(userStats);
      } else {
        toast({
          title: 'Code Invalid',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to redeem code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with your friends to invite them.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!referralLink) return;
    const message = encodeURIComponent(
      `Hi! 👋\n\n` +
      `Join me on SmartClass24 (S24) - the smart way to prepare for WASSCE & BECE! 📚✨\n\n` +
      `🎯 What you can do:\n` +
      `• Practice Mode - Study at your own pace\n` +
      `• Challenge Friends - Compete with classmates\n` +
      `• Quick Match - Find instant opponents\n` +
      `• Boss Battle - Test your skills against AI\n` +
      `• Tournaments - Climb the leaderboards\n\n` +
      `📈 Track your progress and improve with every session!\n\n` +
      `👉 Sign up using my link:\n${referralLink}\n\n` +
      `💡 After you complete your profile and finish your first activity (Practice, Challenge, or Quick Match), I'll earn 1 referral code. ` +
      `When I collect 10 codes, I unlock 1 month of premium access for free! 🎁\n\n` +
      `It's completely free to start - join me and let's excel together! 🚀`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const codesNeeded = 10 - (stats?.referralCount || 0);
  const progressPercent = ((stats?.referralCount || 0) / 10) * 100;

  // Show loading spinner while checking authentication
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            ← Back to Profile
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Earn Premium for Free
          </h1>
          <p className="text-lg text-muted-foreground">
            Invite 10 friends and get 1 month premium access
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Progress
              {stats && stats.referralRedemptions && stats.referralRedemptions > 0 && (
                <Badge className="ml-auto bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                  {stats.referralRedemptions} {stats.referralRedemptions === 1 ? 'Month' : 'Months'} Earned!
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {loadingStats ? 'Loading...' : `${stats?.referralCount || 0} out of 10 codes collected toward your ${stats?.referralRedemptions ? 'next' : 'first'} month`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{stats?.referralCount || 0} / 10 codes</span>
                <span className={codesNeeded > 0 ? 'text-muted-foreground' : 'text-green-600 dark:text-green-400'}>
                  {codesNeeded > 0 ? `${codesNeeded} more needed` : 'Premium Unlocked! 🎉'}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            {stats && stats.referralCount >= 10 && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">
                    Congratulations! You've earned {stats.referralRedemptions ? 'another' : 'your first'} month of premium! 
                    {stats.referralRedemptions && stats.referralRedemptions > 0 && ` (Total: ${stats.referralRedemptions + 1} months)`}
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  Keep sharing to earn more! Every 10 validated referrals = 1 additional month of premium.
                </p>
              </div>
            )}

            {stats && stats.referralCount < 10 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <Star className="h-4 w-4 inline mr-1" />
                  You need {codesNeeded} more {codesNeeded === 1 ? 'code' : 'codes'} to unlock premium.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Redeem Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-500" />
                Redeem a Code
              </CardTitle>
              <CardDescription>
                Enter a referral code from a friend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Referral Code</Label>
                <Input
                  id="code"
                  placeholder="Enter code (e.g., REF-ABC123-XYZ)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleRedeem()}
                  disabled={loading}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={handleRedeem} 
                disabled={loading || !code.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Redeeming...' : 'Redeem Code'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Codes can only be used once. You cannot use your own code.
              </p>
            </CardContent>
          </Card>

          {/* Share Your Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-500" />
                Share Your Link
              </CardTitle>
              <CardDescription>
                Invite friends to join SmartClass24
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Referral Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleShareWhatsApp}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>How it works:</strong> Share your link with friends (or share challenges/virtual labs from Challenge Arena and Virtual Labs). When they sign up, complete their profile, and finish their first activity (Practice, Challenge a friend, or Quick Match), you get 1 code. Collect 10 codes to unlock 1 month of premium! 🎁
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Card */}
        {stats && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Referral Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.referralCount}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Valid Codes</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalReferrals}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Referrals</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.codesRedeemed}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Codes You Used</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.premiumEarned ? '✅' : '⏳'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Premium Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
