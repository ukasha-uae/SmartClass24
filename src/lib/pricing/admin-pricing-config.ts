import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

export type PricingCategory =
  | 'challengeArena'
  | 'virtualLab'
  | 'fullBundle'
  | 'premiumStudent'
  | 'premiumPlus'
  | 'institutionStarter'
  | 'institutionGrowth'
  | 'institutionEnterprise'
  | 'all';

export type ConcretePricingCategory = Exclude<PricingCategory, 'all'>;
export type PricePolicyMode =
  | 'strict_shared'
  | 'shared_with_exceptions'
  | 'fully_country_specific';

export const WAEC5_COUNTRY_IDS = [
  'ghana',
  'nigeria',
  'sierra-leone',
  'liberia',
  'gambia',
] as const;

export interface PricingDiscountCampaign {
  id: string;
  name: string;
  enabled: boolean;
  type: 'percent' | 'fixedUsd';
  value: number;
  startsAtIso?: string;
  endsAtIso?: string;
  countryIds: string[]; // e.g. ["all"] or ["ghana","nigeria"]
  appliesTo: PricingCategory[]; // e.g. ["all"] or ["challengeArena","virtualLab"]
}

export interface AdminPricingConfig {
  baseUsd: {
    premiumStudentMonthly: number;
    premiumPlusMonthly: number;
    challengeArenaMonthly: number;
    challengeArenaAnnual: number;
    virtualLabMonthly: number;
    virtualLabAnnual: number;
    fullBundleMonthly: number;
    fullBundleAnnual: number;
    institutionStarterMonthly: number;
    institutionGrowthMonthly: number;
    institutionEnterpriseMonthly: number;
  };
  usdToLocalRates: Record<string, number>;
  /**
   * Country-specific affordability + explicit overrides.
   * Key is countryId (e.g. "ghana", "nigeria", "global") or shared groups like "waec5".
   */
  countryAdjustments: Record<
    string,
    {
      /** Multiplies base USD for this country (e.g. 0.7 for lower purchasing power). */
      usdMultiplier?: number;
      /** Explicit per-category USD override for this country. */
      overrideUsd?: Partial<Record<ConcretePricingCategory, number>>;
    }
  >;
  /**
   * Controls how shared-country pricing behaves.
   * - strict_shared: WAEC-5 countries must use waec5 adjustment only
   * - shared_with_exceptions: country override first, then waec5 fallback
   * - fully_country_specific: only exact country adjustment, no waec5 fallback
   */
  pricePolicyMode: PricePolicyMode;
  discounts: PricingDiscountCampaign[];
  updatedAtIso: string;
  updatedBy?: string;
}

const STORAGE_KEY = 'admin-pricing-config-v1';
const FIRESTORE_DOC_PATH = ['app_config', 'pricing_v1'] as const;

export const defaultAdminPricingConfig: AdminPricingConfig = {
  baseUsd: {
    premiumStudentMonthly: 5,
    premiumPlusMonthly: 10,
    challengeArenaMonthly: 15,
    challengeArenaAnnual: 120,
    virtualLabMonthly: 10,
    virtualLabAnnual: 80,
    fullBundleMonthly: 20,
    fullBundleAnnual: 160,
    institutionStarterMonthly: 150,
    institutionGrowthMonthly: 300,
    institutionEnterpriseMonthly: 500,
  },
  usdToLocalRates: {
    USD: 1,
    GHS: 15.5,
    NGN: 1550,
    SLL: 23000,
    LRD: 190,
    GMD: 68,
  },
  countryAdjustments: {},
  pricePolicyMode: 'shared_with_exceptions',
  discounts: [],
  updatedAtIso: new Date().toISOString(),
};

function mergeWithDefaults(partial: Partial<AdminPricingConfig> | null | undefined): AdminPricingConfig {
  if (!partial) return defaultAdminPricingConfig;
  return {
    ...defaultAdminPricingConfig,
    ...partial,
    baseUsd: {
      ...defaultAdminPricingConfig.baseUsd,
      ...(partial.baseUsd ?? {}),
    },
    usdToLocalRates: {
      ...defaultAdminPricingConfig.usdToLocalRates,
      ...(partial.usdToLocalRates ?? {}),
    },
    countryAdjustments: {
      ...defaultAdminPricingConfig.countryAdjustments,
      ...(partial.countryAdjustments ?? {}),
    },
    pricePolicyMode:
      partial.pricePolicyMode ?? defaultAdminPricingConfig.pricePolicyMode,
    discounts: Array.isArray(partial.discounts) ? partial.discounts : defaultAdminPricingConfig.discounts,
  };
}

function readLocalConfig(): AdminPricingConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeLocalConfig(config: AdminPricingConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function loadAdminPricingConfig(firestore?: Firestore | null): Promise<AdminPricingConfig> {
  if (firestore) {
    try {
      const ref = doc(firestore, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const merged = mergeWithDefaults(snap.data() as Partial<AdminPricingConfig>);
        writeLocalConfig(merged);
        return merged;
      }
    } catch {
      // Fallback to local/default
    }
  }

  const local = readLocalConfig();
  return local ?? defaultAdminPricingConfig;
}

export async function saveAdminPricingConfig(
  config: AdminPricingConfig,
  firestore?: Firestore | null
): Promise<void> {
  const normalized: AdminPricingConfig = {
    ...config,
    updatedAtIso: new Date().toISOString(),
  };

  writeLocalConfig(normalized);

  if (!firestore) return;
  try {
    const ref = doc(firestore, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
    await setDoc(ref, normalized, { merge: true });
  } catch {
    // Keep local saved config even when Firestore rules block this write.
    // This enables safe local testing without requiring immediate rules changes.
  }
}

function isDiscountActive(
  discount: PricingDiscountCampaign,
  countryId: string | null,
  category: PricingCategory,
  now: Date
): boolean {
  if (!discount.enabled) return false;
  const startOk = !discount.startsAtIso || new Date(discount.startsAtIso) <= now;
  const endOk = !discount.endsAtIso || new Date(discount.endsAtIso) >= now;
  if (!startOk || !endOk) return false;

  const countries = discount.countryIds.map((c) => c.toLowerCase());
  const country = (countryId ?? 'global').toLowerCase();
  const countryMatch = countries.includes('all') || countries.includes(country) || (country === 'global' && countries.includes('global'));
  if (!countryMatch) return false;

  const categoryMatch = discount.appliesTo.includes('all') || discount.appliesTo.includes(category);
  return categoryMatch;
}

function applyDiscount(usdAmount: number, discount: PricingDiscountCampaign): number {
  if (discount.type === 'percent') {
    const out = usdAmount * (1 - discount.value / 100);
    return Math.max(0, out);
  }
  return Math.max(0, usdAmount - discount.value);
}

export function getDiscountedUsdPrice(
  usdAmount: number,
  category: PricingCategory,
  config: AdminPricingConfig,
  countryId: string | null
): { amount: number; appliedDiscount: PricingDiscountCampaign | null } {
  const now = new Date();
  const active = config.discounts.filter((d) => isDiscountActive(d, countryId, category, now));
  if (active.length === 0) return { amount: usdAmount, appliedDiscount: null };

  // Pick the best discount for the learner (lowest final price).
  let best: PricingDiscountCampaign | null = null;
  let lowest = usdAmount;
  for (const d of active) {
    const discounted = applyDiscount(usdAmount, d);
    if (discounted < lowest) {
      lowest = discounted;
      best = d;
    }
  }
  return { amount: lowest, appliedDiscount: best };
}

export function getUsdToLocalRate(
  currencyCode: string,
  config: AdminPricingConfig
): number {
  const code = currencyCode.toUpperCase();
  return config.usdToLocalRates[code] ?? 1;
}

export function convertUsdToLocalWithConfig(
  usdAmount: number,
  currencyCode: string,
  config: AdminPricingConfig
): number {
  return usdAmount * getUsdToLocalRate(currencyCode, config);
}

export function getEffectiveUsdBasePrice(
  baseUsdAmount: number,
  category: ConcretePricingCategory,
  config: AdminPricingConfig,
  countryId: string | null
): number {
  if (!countryId) return baseUsdAmount;
  const key = countryId.toLowerCase();
  const isWaecCountry = WAEC5_COUNTRY_IDS.includes(
    key as (typeof WAEC5_COUNTRY_IDS)[number]
  );
  const countryAdjustment = config.countryAdjustments[key];
  const waecAdjustment = config.countryAdjustments.waec5;

  let adjustment:
    | {
        usdMultiplier?: number;
        overrideUsd?: Partial<Record<ConcretePricingCategory, number>>;
      }
    | undefined;

  switch (config.pricePolicyMode) {
    case 'strict_shared':
      adjustment = isWaecCountry ? waecAdjustment : countryAdjustment;
      break;
    case 'fully_country_specific':
      adjustment = countryAdjustment;
      break;
    case 'shared_with_exceptions':
    default:
      adjustment = countryAdjustment ?? (isWaecCountry ? waecAdjustment : undefined);
      break;
  }
  if (!adjustment) return baseUsdAmount;

  const overrideUsd = adjustment.overrideUsd?.[category];
  if (typeof overrideUsd === 'number' && Number.isFinite(overrideUsd)) {
    return Math.max(0, overrideUsd);
  }

  const multiplier =
    typeof adjustment.usdMultiplier === 'number' && Number.isFinite(adjustment.usdMultiplier)
      ? adjustment.usdMultiplier
      : 1;
  return Math.max(0, baseUsdAmount * multiplier);
}

