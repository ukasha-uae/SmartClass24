/**
 * @deprecated - Use /campus/shs instead
 * This route redirects to /campus/shs for the new campus architecture
 * Maintained for backward compatibility only
 */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSCampusRedirect() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  
  useEffect(() => {
    // Redirect to new campus architecture
    router.replace(addTenantParam('/campus/shs'));
  }, [router, addTenantParam]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to SHS Campus...</p>
      </div>
    </div>
  );
}
