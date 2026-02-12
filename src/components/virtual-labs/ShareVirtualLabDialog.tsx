'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getReferralLink } from '@/lib/referrals';
import { useLocalization } from '@/hooks/useLocalization';

interface ShareVirtualLabDialogProps {
  labTitle: string;
  labSlug: string;
  subject: string;
  userId: string;
}

export function ShareVirtualLabDialog({
  labTitle,
  labSlug,
  subject,
  userId,
}: ShareVirtualLabDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { getPrimaryExam, getSecondaryExam } = useLocalization();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartclass24.com';
  const labUrl = labSlug ? `${baseUrl}/virtual-labs/${labSlug}` : `${baseUrl}/virtual-labs`;
  const referralLink = getReferralLink(userId);

  const shareMessage = labSlug 
    ? `🧪 Check out this amazing ${subject} experiment on SmartClass24!\n\n` +
      `"${labTitle}"\n\n` +
      `Experience interactive virtual labs and master science concepts! 🔬✨\n\n` +
      `Try it here: ${labUrl}\n\n` +
      `Want full access to 20+ virtual labs? Sign up using my link:\n${referralLink}\n\n` +
      `💡 Complete your profile and finish your first activity, and I'll earn 1 referral code towards FREE premium access! ` +
      `(10 codes = 1 month premium)\n\n` +
      `Join thousands of students preparing for ${getSecondaryExam()} & ${getPrimaryExam()}! 📚🚀`
    : `🔬 Check out Virtual Labs on SmartClass24!\n\n` +
      `Experience 20+ interactive science experiments covering Biology, Chemistry, and Physics! 🧪✨\n\n` +
      `Try it here: ${labUrl}\n\n` +
      `Sign up using my link to get started:\n${referralLink}\n\n` +
      `💡 Complete your profile and finish your first activity, and I'll earn 1 referral code towards FREE premium access! ` +
      `(10 codes = 1 month premium)\n\n` +
      `Join thousands of students preparing for ${getSecondaryExam()} & ${getPrimaryExam()}! 📚🚀`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'WhatsApp opened',
      description: 'Share with your friends to earn premium access!',
    });
    
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    toast({
      title: 'Message copied!',
      description: 'Share it anywhere to invite friends and earn premium!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share & Earn Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Share Virtual Lab & Earn Premium
          </DialogTitle>
          <DialogDescription>
            Share this amazing experiment with friends! For every 10 friends who join and complete their profile + first activity, you earn 1 month of premium access FREE! 🎁
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* WhatsApp Share */}
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-100 text-sm">
                    Share on WhatsApp
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Share this lab with friends and earn towards premium access!
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleWhatsAppShare} 
              className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </Button>
          </div>

          {/* Copy Message */}
          <div className="pt-2 border-t">
            <Button onClick={handleCopyLink} variant="secondary" className="w-full gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Message Copied!' : 'Copy Message'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Paste anywhere: SMS, Email, Social Media, etc.
            </p>
          </div>

          {/* How it works */}
          <div className="pt-2 border-t">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-900 dark:text-purple-100 font-semibold mb-2">
                How to Earn Premium:
              </p>
              <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Share your referral link with friends</li>
                <li>• They sign up and complete their profile</li>
                <li>• They finish their first activity (Practice/Challenge/Match)</li>
                <li>• You earn 1 referral code (10 codes = 1 month premium FREE!)</li>
              </ul>
              <div className="mt-3 text-center">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-purple-600 dark:text-purple-400 underline"
                  onClick={() => {
                    setOpen(false);
                    window.location.href = '/redeem-codes';
                  }}
                >
                  Track Your Progress →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
