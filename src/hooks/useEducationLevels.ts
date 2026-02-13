import { useTenant } from './useTenant';

/**
 * Hook to get tenant-specific education level labels
 * Returns the appropriate terminology based on tenant configuration
 */
export function useEducationLevels() {
  const { tenant } = useTenant();
  
  const labels = {
    primary: tenant.branding.educationLevelLabels?.primary || 'Primary',
    jhs: tenant.branding.educationLevelLabels?.jhs || 'JHS',
    shs: tenant.branding.educationLevelLabels?.shs || 'SHS',
  };
  
  return { labels };
}
