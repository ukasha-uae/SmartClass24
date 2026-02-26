'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, KeyRound } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useToast } from '@/hooks/use-toast';
import { redeemTenantAccessKey } from '@/lib/tenant-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TenantAccessPage() {
  const { user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const addTenantParam = useTenantLink();
  const [accessKey, setAccessKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRedeem = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in first, then enter your tenant access key.',
        variant: 'destructive',
      });
      return;
    }

    if (!accessKey.trim()) {
      toast({
        title: 'Access key required',
        description: 'Enter the access key your school or tenant admin gave you.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await redeemTenantAccessKey(user, accessKey.trim());
      await user.getIdToken(true);
      toast({
        title: 'Access granted',
        description: `Your account is now linked to ${res.tenantId}. Refresh this page if premium areas do not unlock immediately.`,
      });
      setAccessKey('');
    } catch (error) {
      toast({
        title: 'Could not redeem key',
        description: error instanceof Error ? error.message : 'Please verify the key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 pb-20">
      <div className="max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Tenant Access
            </CardTitle>
            <CardDescription>
              Enter your organization access key to unlock tenant paid features on your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-access-key">Access Key</Label>
              <Input
                id="tenant-access-key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Example: WISDOM-AB12-C3D4E5"
                autoComplete="off"
              />
            </div>
            <Button onClick={handleRedeem} disabled={isUserLoading || isSubmitting} className="w-full">
              <KeyRound className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Applying Access...' : 'Apply Access Key'}
            </Button>
            {!user && !isUserLoading ? (
              <p className="text-sm text-muted-foreground">
                You are not signed in.{' '}
                <Link href={addTenantParam('/profile')} className="underline">
                  Open profile and sign in
                </Link>{' '}
                first.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
