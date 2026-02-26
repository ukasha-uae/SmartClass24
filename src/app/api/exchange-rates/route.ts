import { NextResponse } from 'next/server';

const TARGET_CURRENCIES = ['USD', 'GHS', 'NGN', 'SLL', 'LRD', 'GMD'] as const;

const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1,
  GHS: 15.5,
  NGN: 1550,
  SLL: 23000,
  LRD: 190,
  GMD: 68,
};

export async function GET() {
  const to = TARGET_CURRENCIES.filter((c) => c !== 'USD').join(',');
  const url = `https://api.frankfurter.app/latest?from=USD&to=${to}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 6 }, // 6 hours
    });
    if (!res.ok) throw new Error(`Rate API failed: ${res.status}`);

    const data = (await res.json()) as {
      rates?: Record<string, number>;
      date?: string;
    };

    const rates: Record<string, number> = { USD: 1 };
    for (const code of TARGET_CURRENCIES) {
      if (code === 'USD') continue;
      rates[code] = data.rates?.[code] ?? FALLBACK_USD_RATES[code];
    }

    return NextResponse.json({
      base: 'USD',
      rates,
      asOf: data.date ?? new Date().toISOString().slice(0, 10),
      source: 'frankfurter.app',
      fallback: false,
    });
  } catch {
    return NextResponse.json({
      base: 'USD',
      rates: FALLBACK_USD_RATES,
      asOf: new Date().toISOString().slice(0, 10),
      source: 'fallback-static',
      fallback: true,
    });
  }
}

