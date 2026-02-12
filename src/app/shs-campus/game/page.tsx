/**
 * @deprecated - Use /challenge-arena instead
 * Games now accessed through Challenge Arena
 * This route maintained for backward compatibility only
 */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSGameRedirect() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  
  useEffect(() => {
    // Redirect to Challenge Arena
    router.replace(addTenantParam('/challenge-arena'));
  }, [router, addTenantParam]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to Challenge Arena...</p>
      </div>
    </div>
  );
}
