'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Plus, Ban } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/lib/admin-config';
import {
  createTenantAccessKey,
  listTenantAccessKeys,
  revokeTenantAccessKey,
  type TenantAccessKeySummary,
} from '@/lib/tenant-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminTenantAccessPage() {
  const { user, isUserLoading } = useFirebase();
  const addTenantParam = useTenantLink();
  const { toast } = useToast();

  const [authorized, setAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [keys, setKeys] = useState<TenantAccessKeySummary[]>([]);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const [tenantId, setTenantId] = useState('wisdomwarehouse');
  const [label, setLabel] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxUses, setMaxUses] = useState('');

  const loadKeys = async () => {
    if (!user) return;
    try {
      const rows = await listTenantAccessKeys(user);
      setKeys(rows);
    } catch (error) {
      toast({
        title: 'Failed to load keys',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!user?.email) {
        setAuthorized(false);
        setIsChecking(false);
        return;
      }
      const ok = await isAdmin(user.email);
      setAuthorized(ok);
      setIsChecking(false);
      if (ok) {
        await loadKeys();
      }
    };
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, user?.email]);

  const handleCreate = async () => {
    if (!user) return;
    if (!label.trim()) {
      toast({ title: 'Label required', description: 'Add a label so your team can identify this key.', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    try {
      const maxUsesNumber = maxUses.trim() ? Number(maxUses) : undefined;
      const result = await createTenantAccessKey(user, {
        tenantId,
        label: label.trim(),
        expiresAt: expiresAt || undefined,
        maxUses: Number.isFinite(maxUsesNumber) ? maxUsesNumber : undefined,
      });
      setNewlyCreatedKey(result.accessKey);
      setLabel('');
      setExpiresAt('');
      setMaxUses('');
      await loadKeys();
      toast({ title: 'Access key created', description: 'Share it securely with your tenant users.' });
    } catch (error) {
      toast({
        title: 'Failed to create key',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (keyHash: string) => {
    if (!user) return;
    try {
      await revokeTenantAccessKey(user, keyHash);
      await loadKeys();
      toast({ title: 'Key revoked', description: 'This access key can no longer be used.' });
    } catch (error) {
      toast({
        title: 'Failed to revoke key',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading || isChecking) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Tenant Access Keys</CardTitle>
            <CardDescription>Please sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={addTenantParam('/profile')} className="underline">
              Go to profile
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Tenant Access Keys</CardTitle>
            <CardDescription>You do not have admin permission for this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tenant Access Key Management
            </CardTitle>
            <CardDescription>
              Create, rotate, and revoke tenant keys. Newly created keys are visible once, then only hash metadata is stored.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tenant</Label>
                <Select value={tenantId} onValueChange={setTenantId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wisdomwarehouse">Wisdom Warehouse</SelectItem>
                    <SelectItem value="smartclass24">SmartClass24</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Example: Wisdom Feb 2026 Batch A" />
              </div>
              <div className="space-y-2">
                <Label>Expires At (optional)</Label>
                <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Max Uses (optional)</Label>
                <Input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Example: 500" />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Access Key'}
            </Button>
            {newlyCreatedKey ? (
              <div className="rounded border p-3 bg-muted/40">
                <p className="text-xs text-muted-foreground mb-1">Copy and share this key securely (shown once):</p>
                <p className="font-mono text-sm break-all">{newlyCreatedKey}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issued Keys</CardTitle>
            <CardDescription>Use revoke when a key leaks or you want to rotate access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {keys.length === 0 ? <p className="text-sm text-muted-foreground">No keys yet.</p> : null}
            {keys.map((item) => (
              <div key={item.keyHash} className="border rounded p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 text-sm">
                    <p><strong>Tenant:</strong> {item.tenantId || '-'}</p>
                    <p><strong>Label:</strong> {item.label}</p>
                    <p><strong>Uses:</strong> {item.uses}{item.maxUses ? ` / ${item.maxUses}` : ''}</p>
                    <p><strong>Status:</strong> {item.isActive ? 'Active' : 'Revoked'}</p>
                    <p className="text-xs text-muted-foreground break-all">Hash: {item.keyHash}</p>
                  </div>
                  {item.isActive ? (
                    <Button variant="destructive" size="sm" onClick={() => handleRevoke(item.keyHash)}>
                      <Ban className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
