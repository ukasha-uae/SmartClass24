export type MathLabMetricType =
  | 'station_started'
  | 'checkpoint_answered'
  | 'hint_requested'
  | 'station_completed';

export type MathLabMetricEvent = {
  type: MathLabMetricType;
  stationSlug: string;
  userId?: string;
  conceptId?: string;
  isCorrect?: boolean;
  score?: number;
  hintCount?: number;
  timestamp: number;
};

const STORAGE_KEY = 'math_lab_metrics_v1';

export function trackMathLabMetric(event: Omit<MathLabMetricEvent, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  const entry: MathLabMetricEvent = {
    ...event,
    timestamp: Date.now(),
  };

  try {
    const existing = readMathLabMetrics();
    const next = [...existing, entry].slice(-500);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures to keep labs usable offline/private mode.
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[MathLab Metric]', entry);
  }
}

export function readMathLabMetrics(): MathLabMetricEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MathLabMetricEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
