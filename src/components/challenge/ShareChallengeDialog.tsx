'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWhatsAppLink } from '@/lib/email-notifications';

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
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartc24.com';
  const challengeUrl = `${baseUrl}/challenge-arena/play/${challengeId}`;

  const message = `🎯 ${creatorName} from ${creatorSchool} has challenged ${opponentName ? `${opponentName} ` : 'you '}to a ${subject} duel on S24!

Click here to accept and play: ${challengeUrl}

Practice • Compete • Excel in WASSCE & BECE`;

  const handleWhatsAppShare = () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: 'WhatsApp number required',
        description: 'Please enter a WhatsApp number',
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

    const subject = `${creatorName} has challenged you on S24!`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
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
          {/* WhatsApp Share */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <div className="flex gap-2">
              <Input
                id="whatsapp"
                type="tel"
                placeholder="e.g., 0244123456 or +233244123456"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <Button onClick={handleWhatsAppShare} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Opens WhatsApp with a pre-filled message. Send it to notify your opponent!
            </p>
          </div>

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

