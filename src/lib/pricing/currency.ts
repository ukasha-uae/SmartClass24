/**
 * Pricing currency helpers
 *
 * Keep student plan base prices in USD, then convert for the selected country.
 * Rates are approximate and can be updated without touching UI components.
 */

export const USD_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  GHS: 15.5,
  NGN: 1550,
  SLL: 23000,
  LRD: 190,
  GMD: 68,
};

/**
 * Converts a USD amount into a target currency amount.
 * Falls back to 1:1 if a rate is missing.
 */
export function convertUsdToLocal(usdAmount: number, currencyCode: string): number {
  const code = currencyCode.toUpperCase();
  const rate = USD_EXCHANGE_RATES[code] ?? 1;
  return usdAmount * rate;
}

/**
 * Round to whole number for clean pricing display.
 */
export function roundPrice(amount: number): number {
  return Math.round(amount);
}

