import type { CountryConfig } from '@/lib/localization/country-config';

/**
 * Base exchange rates relative to 1 USD.
 * These are approximate display rates for pricing UX, not payment settlement rates.
 */
const USD_TO_CURRENCY_RATE: Record<string, number> = {
  USD: 1,
  GHS: 16,
  NGN: 1600,
  SLL: 120,
  LRD: 190,
  GMD: 68,
};

function getRate(currencyCode: string): number {
  return USD_TO_CURRENCY_RATE[currencyCode.toUpperCase()] ?? 1;
}

export function convertUsdToLocal(usdAmount: number, currencyCode: string): number {
  return usdAmount * getRate(currencyCode);
}

export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if Intl doesn't support this currency code in a runtime.
    return `${currencyCode.toUpperCase()} ${Math.round(amount).toLocaleString()}`;
  }
}

export function formatUsdBase(usdAmount: number): string {
  return formatCurrencyAmount(usdAmount, 'USD');
}

export function formatLocalizedPriceFromUsd(
  usdAmount: number,
  country: CountryConfig | null
): string {
  if (!country) return formatUsdBase(usdAmount);
  const localAmount = convertUsdToLocal(usdAmount, country.currency.code);
  return formatCurrencyAmount(localAmount, country.currency.code);
}

