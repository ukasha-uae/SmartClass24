import { useTenant } from './useTenant';
import { useLocalization } from './useLocalization';

/** Global labels – Primary, Middle School, High School (US/international) */
const GLOBAL_LABELS = {
  primary: 'Primary',
  jhs: 'Middle School',
  shs: 'High School',
};

/** West Africa labels – Primary, JHS, SHS (Ghana, Nigeria, etc.) */
const WEST_AFRICA_LABELS = {
  primary: 'Primary',
  jhs: 'JHS',
  shs: 'SHS',
};

/**
 * Hook to get education level labels
 * Priority: tenant branding > global (country null) > West Africa (country selected)
 */
export function useEducationLevels() {
  const { tenant } = useTenant();
  const { countryId } = useLocalization();

  const tenantLabels = tenant.branding.educationLevelLabels;
  if (tenantLabels) {
    return {
      labels: {
        primary: tenantLabels.primary ?? 'Primary',
        jhs: tenantLabels.jhs ?? 'JHS',
        shs: tenantLabels.shs ?? 'SHS',
      },
    };
  }

  const labels = !countryId ? GLOBAL_LABELS : WEST_AFRICA_LABELS;
  return { labels };
}
