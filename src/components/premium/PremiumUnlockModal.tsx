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
  Crown, 
  CheckCircle2, 
  MessageCircle
} from 'lucide-react';
import { SUBSCRIPTION_PACKAGES_GHS, formatGHS } from '@/lib/payments';
import { PREMIUM_FEATURES } from '@/lib/monetization';
import { useFirebase } from '@/firebase/provider';
import { WhatsAppPaymentModal } from './WhatsAppPaymentModal';

interface PremiumUnlockModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  onSuccess?: () => void;
}

export default function PremiumUnlockModal({ 
  open, 
  onClose, 
  feature,
  onSuccess 
}: PremiumUnlockModalProps) {
  const { user } = useFirebase();
  const [selectedPackage, setSelectedPackage] = useState<string>('premium_monthly');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const userId = user?.uid || `anon-${Date.now()}`;

  const handleProceedToPayment = () => {
    setShowWhatsAppModal(true);
  };

  const selectedPackageData = SUBSCRIPTION_PACKAGES_GHS.find(p => p.packageId === selectedPackage);
  const subscriptionType = selectedPackage.includes('virtualLab') ? 'virtualLab' : 
                           selectedPackage.includes('fullBundle') ? 'fullBundle' : 'challengeArena';

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className="text-base">
              Get access to all premium game modes and exclusive benefits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Premium Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(PREMIUM_FEATURES).slice(0, 6).map(([key, feature]) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50">
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>

            {/* Subscription Packages */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUBSCRIPTION_PACKAGES_GHS.map((pkg) => (
                  <Card
                    key={pkg.packageId}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPackage === pkg.packageId
                        ? 'border-2 border-purple-500 shadow-lg'
                        : 'border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedPackage(pkg.packageId)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        {pkg.savings && (
                          <Badge className="mb-2 bg-green-500 text-white">
                            {pkg.savings}
                          </Badge>
                        )}
                        <h4 className="font-bold text-lg mb-2">{pkg.name}</h4>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">{formatGHS(pkg.price)}</span>
                          <span className="text-muted-foreground">/{pkg.duration}</span>
                        </div>
                        {selectedPackage === pkg.packageId && (
                          <CheckCircle2 className="h-6 w-6 mx-auto text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleProceedToPayment}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-6"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Continue to WhatsApp Payment
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                Secure payment via WhatsApp • Activated within 5-10 minutes
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Payment Modal */}
      <WhatsAppPaymentModal
        open={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        planName={selectedPackageData?.name || 'Premium'}
        planPrice={selectedPackageData ? formatGHS(selectedPackageData.price) : 'GHS 15'}
        subscriptionType={subscriptionType}
      />
    </>
  );
}