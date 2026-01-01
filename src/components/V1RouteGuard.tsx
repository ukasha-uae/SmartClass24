'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hasCampusFeature } from '@/lib/featureFlags';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface V1RouteGuardProps {
  campus: 'primary' | 'jhs' | 'shs';
  feature: 'lessons' | 'virtualLabs' | 'arena';
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * V1 Route Guard - Redirects users based on campus feature access
 * 
 * For V1:
 * - Primary & JHS: Arena Challenge only (no lessons, no virtual labs)
 * - SHS: Arena Challenge + Virtual Labs only (no lessons - V2)
 */
export function V1RouteGuard({ 
  campus, 
  feature, 
  children, 
  redirectTo 
}: V1RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasAccess = hasCampusFeature(campus, feature);

  useEffect(() => {
    if (!hasAccess && typeof window !== 'undefined') {
      // Default redirect to Arena Challenge for Primary/JHS
      const defaultRedirect = '/challenge-arena/ghana';
      const redirect = redirectTo || defaultRedirect;
      
      // Only redirect if we're not already on the redirect path
      // Check both exact match and if pathname includes the redirect path
      const currentPath = pathname || window.location.pathname;
      if (currentPath !== redirect && !currentPath.includes('/challenge-arena')) {
        console.log(`[V1RouteGuard] Redirecting ${campus} from ${currentPath} to ${redirect} (no access to ${feature})`);
        router.replace(redirect);
      }
    }
  }, [hasAccess, redirectTo, router, pathname, campus, feature]);

  if (!hasAccess) {
    const featureName = feature === 'lessons' ? 'lessons' : 
                       feature === 'virtualLabs' ? 'virtual labs' : 
                       'arena challenge';
    
    const campusName = campus === 'primary' ? 'Primary School' :
                      campus === 'jhs' ? 'Junior High School' :
                      'Senior High School';

    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {campusName} students have access to <strong>Arena Challenge</strong> in V1.
              {campus === 'shs' && ' SHS students also have access to Virtual Labs.'}
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              {feature === 'lessons' && 'Lessons will be available in V2. For now, enjoy Arena Challenge and Virtual Labs!'}
              {feature === 'virtualLabs' && campus !== 'shs' && 'Virtual Labs are available for SHS students only.'}
            </p>
            <Link href="/challenge-arena/ghana">
              <Button className="w-full">
                Go to Arena Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to check if current user has access to a feature
 */
export function useV1FeatureAccess(feature: 'lessons' | 'virtualLabs' | 'arena') {
  if (typeof window === 'undefined') {
    return { hasAccess: false, campus: 'shs' as const };
  }

  const storedLevel = localStorage.getItem('userEducationLevel')?.toLowerCase() || 'shs';
  const campus = (storedLevel === 'primary' ? 'primary' :
                 storedLevel === 'jhs' ? 'jhs' :
                 'shs') as 'primary' | 'jhs' | 'shs';

  const hasAccess = hasCampusFeature(campus, feature);

  return { hasAccess, campus };
}

