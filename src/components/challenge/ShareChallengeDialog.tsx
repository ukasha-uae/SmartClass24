'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Mail, MessageCircle, Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';
import { generateWhatsAppLink, getUserWhatsApp } from '@/lib/email-notifications';
import { getUserPresence } from '@/lib/user-presence';

interface ShareChallengeDialogProps {
  challengeId: string;
  creatorName: string;
  creatorSchool: string;
  subject: string;
  opponentName?: string;
  opponentUserId?: string;
  onEmailSent?: () => void;
  onWhatsAppSent?: () => void;
}

export function ShareChallengeDialog({
  challengeId,
  creatorName,
  creatorSchool,
  subject,
  opponentName,
  opponentUserId,
  onEmailSent,
  onWhatsAppSent,
}: ShareChallengeDialogProps) {
  const [open, setOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isOpponentOnline, setIsOpponentOnline] = useState<boolean | null>(null);
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const { toast } = useToast();
  const { branding } = useTenant();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartc24.com';
  const challengeUrl = `${baseUrl}/challenge-arena/play/${challengeId}`;

  const message = `${creatorName} from ${creatorSchool} has invited ${opponentName ? `${opponentName} ` : 'you '}to a ${subject} challenge on ${branding.name}.
Click here to play and see who scores higher: ${challengeUrl}

Practice • Compete • Excel in WASSCE & BECE`;

  // Auto-load WhatsApp number and check online status when dialog opens
  useEffect(() => {
    if (open && opponentUserId) {
      setLoadingWhatsApp(true);
      // Check if opponent is online
      getUserPresence(opponentUserId).then(presence => {
        setIsOpponentOnline(presence?.isOnline || false);
        // If offline, load WhatsApp number
        if (!presence?.isOnline) {
          getUserWhatsApp(opponentUserId).then(number => {
            if (number) {
              setWhatsappNumber(number);
            }
            setLoadingWhatsApp(false);
          }).catch(() => setLoadingWhatsApp(false));
        } else {
          setLoadingWhatsApp(false);
        }
      }).catch(() => {
        setIsOpponentOnline(false);
        setLoadingWhatsApp(false);
      });
    } else if (!opponentUserId) {
      setIsOpponentOnline(null);
    }
  }, [open, opponentUserId]);

  const handleWhatsAppShare = () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: 'WhatsApp number required',
        description: 'Please enter a WhatsApp number or update your opponent\'s profile with their WhatsApp number',
        variant: 'destructive',
      });
      return;
    }

    const whatsappUrl = generateWhatsAppLink(whatsappNumber, message);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'WhatsApp opened',
      description: 'Send the message to notify your opponent!',
    });
    
    onWhatsAppSent?.();
    setOpen(false);
  };

  const handleEmailShare = () => {
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    const subjectLine = `${creatorName} has challenged you on ${branding.name}!`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    
    toast({
      title: 'Email client opened',
      description: 'Send the email to notify your opponent!',
    });
    
    onEmailSent?.();
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl);
    setCopied(true);
    toast({
      title: 'Link copied!',
      description: 'Share this link with your opponent',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Challenge with Opponent</DialogTitle>
          <DialogDescription>
            Notify your opponent via WhatsApp or Email. They can accept the challenge even when offline!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Online/Offline Status Info */}
          {isOpponentOnline === true && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Opponent is online</p>
                <p className="text-xs mt-1">They will receive an in-app notification. WhatsApp is not needed.</p>
              </div>
            </div>
          )}

          {/* WhatsApp Share - Only show if opponent is offline or status unknown */}
          {(isOpponentOnline === false || isOpponentOnline === null) && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                WhatsApp Number {opponentUserId ? '(auto-filled from profile)' : ''}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder={loadingWhatsApp ? "Loading..." : "e.g., 0244123456 or +233244123456"}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  disabled={loadingWhatsApp}
                />
                <Button 
                  onClick={handleWhatsAppShare} 
                  className="gap-2"
                  disabled={loadingWhatsApp || !whatsappNumber.trim()}
                >
                  <MessageCircle className="h-4 w-4" />
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isOpponentOnline === false 
                  ? "Opponent is offline. Send WhatsApp to notify them about the challenge."
                  : "Opens WhatsApp with a pre-filled message. Send it to notify your opponent!"}
              </p>
              {!whatsappNumber && opponentUserId && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  No WhatsApp number found in opponent's profile. They can add it in their profile settings.
                </p>
              )}
            </div>
          )}

          {/* Email Share */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="opponent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleEmailShare} variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Opens your email client with a pre-filled message. Send it to notify your opponent!
            </p>
          </div>

          {/* Copy Link */}
          <div className="pt-4 border-t">
            <Button onClick={handleCopyLink} variant="secondary" className="w-full gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Link Copied!' : 'Copy Challenge Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
