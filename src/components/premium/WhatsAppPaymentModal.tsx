'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  CheckCircle2,
  Crown,
  Sparkles,
  Clock,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WhatsAppPaymentModalProps {
  open: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: string;
  subscriptionType?: 'challengeArena' | 'virtualLab' | 'fullBundle';
}

export function WhatsAppPaymentModal({ 
  open, 
  onClose, 
  planName = 'Premium',
  planPrice = 'GHS 15',
  subscriptionType = 'challengeArena'
}: WhatsAppPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  // SmartClass24 WhatsApp business number
  const whatsappNumber = '+233244123456'; // Replace with your actual business WhatsApp
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`;

  const handleWhatsAppPayment = () => {
    const message = encodeURIComponent(
      `Hi SmartClass24! 👋\n\n` +
      `I want to subscribe to *${planName}* plan.\n\n` +
      `📦 Package: ${subscriptionType === 'fullBundle' ? 'Full Bundle (Challenge Arena + Virtual Labs)' : subscriptionType === 'virtualLab' ? 'Virtual Labs Only' : 'Challenge Arena Premium'}\n` +
      `💰 Amount: ${planPrice}\n` +
      `📱 Payment Method: MTN Mobile Money\n\n` +
      `Please guide me through the payment process. Thank you!`
    );
    
    window.open(`${whatsappLink}?text=${message}`, '_blank');
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-green-500" />
            WhatsApp Payment
          </DialogTitle>
          <DialogDescription className="text-base">
            Chat with us on WhatsApp to complete your payment securely
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status Alert */}
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm ml-2">
              <strong className="text-blue-900 dark:text-blue-100">Manual Payment Processing</strong>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                We're currently accepting payments manually via WhatsApp while we finalize our automated payment system. 
                Your premium access will be activated within <strong>5-10 minutes</strong> after payment confirmation! 🚀
              </p>
            </AlertDescription>
          </Alert>

          {/* Selected Plan Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">{planName}</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {subscriptionType === 'fullBundle' ? 'Challenge Arena + Virtual Labs' : 
                     subscriptionType === 'virtualLab' ? 'Virtual Labs Access' : 
                     'Challenge Arena Premium'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{planPrice}</div>
                  <Badge className="mt-1 bg-purple-600 text-white">Selected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              How It Works
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Click "Chat on WhatsApp" below</p>
                  <p className="text-sm text-muted-foreground">Opens a chat with our payment support team</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Send the pre-filled message</p>
                  <p className="text-sm text-muted-foreground">We'll receive your subscription request with all details</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Complete payment via MTN Mobile Money</p>
                  <p className="text-sm text-muted-foreground">We'll guide you through the quick payment process</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold">Get instant activation!</p>
                  <p className="text-sm text-muted-foreground">Your premium access activates within 5-10 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 dark:text-green-100">100% Secure</p>
                <p className="text-xs text-green-700 dark:text-green-300">MTN Mobile Money</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Quick Setup</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">5-10 min activation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div className="text-sm">
                <p className="font-semibold text-purple-900 dark:text-purple-100">Help Available</p>
                <p className="text-xs text-purple-700 dark:text-purple-300">Chat support 24/7</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppPayment}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-6"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Chat on WhatsApp to Pay
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Or save our number and message us later
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-2 bg-muted rounded text-sm font-mono">{whatsappNumber}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyNumber}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : 'Copy'}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              💡 <strong>Coming Soon:</strong> Automated online payments for instant activation! 
              For now, our WhatsApp payment is fast, secure, and personally supported. 🎉
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
