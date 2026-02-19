'use client';

import { PWAInstallInstructionsDialog } from '@/components/PWAInstallInstructionsDialog';

/**
 * Mounts the PWA install instructions dialog so it can be opened from the header
 * "Install app" button when the native beforeinstallprompt is not available
 * (e.g. after dismiss, or browsers that don't fire it). All tenants (S24, Wisdom
 * Warehouse, etc.) get an Install button; clicking it either triggers the native
 * prompt or opens this step-by-step guide (Add to Home Screen / Install via menu).
 */
export function ManualPWAInstall() {
  return <PWAInstallInstructionsDialog />;
}
