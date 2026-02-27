'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Plus, Ban, RefreshCcw, Users } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/lib/admin-config';
import {
  createTenantAccessKey,
  listTenantBillingOverview,
  listTenantAccessKeys,
  rotateTenantAccessKey,
  revokeTenantAccessKey,
  updateTenantAccessKeyMaxUses,
  type TenantAccessKeySummary,
  type TenantBillingSummary,
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
  const [isRotating, setIsRotating] = useState(false);
  const [keys, setKeys] = useState<TenantAccessKeySummary[]>([]);
  const [billing, setBilling] = useState<TenantBillingSummary[]>([]);
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

  const loadBilling = async () => {
    if (!user) return;
    try {
      const rows = await listTenantBillingOverview(user);
      setBilling(rows);
    } catch (error) {
      toast({
        title: 'Failed to load tenant billing overview',
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
        await loadBilling();
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
      await loadBilling();
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

  const handleRotate = async () => {
    if (!user) return;
    if (!label.trim()) {
      toast({ title: 'Label required', description: 'Add a label so your team can identify this key rotation.', variant: 'destructive' });
      return;
    }

    setIsRotating(true);
    try {
      const maxUsesNumber = maxUses.trim() ? Number(maxUses) : undefined;
      const result = await rotateTenantAccessKey(user, {
        tenantId,
        label: label.trim(),
        expiresAt: expiresAt || undefined,
        maxUses: Number.isFinite(maxUsesNumber) ? maxUsesNumber : undefined,
      });
      setNewlyCreatedKey(result.accessKey);
      setLabel('');
      setExpiresAt('');
      setMaxUses('');
      await Promise.all([loadKeys(), loadBilling()]);
      toast({
        title: 'School key rotated',
        description: `New key ready. Revoked ${result.revokedCount} active key(s) for ${result.tenantId}.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to rotate key',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRotating(false);
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

  const handleEditMaxUses = async (item: TenantAccessKeySummary) => {
    if (!user) return;
    const current = item.maxUses == null ? '' : String(item.maxUses);
    const input = window.prompt(
      'Enter new max uses. Leave empty for unlimited.',
      current
    );
    if (input === null) return;

    const trimmed = input.trim();
    const nextMaxUses = trimmed === '' ? null : Number(trimmed);
    if (trimmed !== '' && (!Number.isFinite(nextMaxUses) || nextMaxUses <= 0)) {
      toast({
        title: 'Invalid value',
        description: 'Max uses must be a positive number, or empty for unlimited.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateTenantAccessKeyMaxUses(user, { keyHash: item.keyHash, maxUses: nextMaxUses });
      await loadKeys();
      toast({
        title: 'Key updated',
        description: `Max uses updated for ${item.label}.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to update key',
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
              <Users className="h-5 w-5" />
              Tenant User Counts (Billing Snapshot)
            </CardTitle>
            <CardDescription>
              Use these counts to bill institutions by active users. Refresh after major onboarding batches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadBilling}>
              Refresh Counts
            </Button>
            {billing.length === 0 ? <p className="text-sm text-muted-foreground">No tenant usage records yet.</p> : null}
            {billing.map((row) => (
              <div key={row.tenantId} className="border rounded p-3 text-sm">
                <p><strong>Tenant:</strong> {row.tenantId}</p>
                <p><strong>Users:</strong> {row.userCount}</p>
                <p><strong>Active keys:</strong> {row.activeKeys} ({row.totalKeys} total issued)</p>
              </div>
            ))}
          </CardContent>
        </Card>

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
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCreate} disabled={isCreating || isRotating}>
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Creating...' : 'Create Access Key'}
              </Button>
              <Button variant="secondary" onClick={handleRotate} disabled={isCreating || isRotating}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                {isRotating ? 'Rotating...' : 'Rotate School Key'}
              </Button>
            </div>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditMaxUses(item)}>
                        Edit Max Uses
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRevoke(item.keyHash)}>
                        <Ban className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
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
