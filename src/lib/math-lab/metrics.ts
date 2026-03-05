import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type MathLabMetricType =
  | 'station_started'
  | 'interaction_completed'
  | 'checkpoint_answered'
  | 'hint_requested'
  | 'station_completed'
  | 'misconception_detected'
  | 'intervention_triggered';

export type MathLabMetricEvent = {
  type: MathLabMetricType;
  stationSlug: string;
  userId?: string;
  conceptId?: string;
  isCorrect?: boolean;
  misconceptionTag?: string;
  strategyTag?: string;
  masteryBand?: 'needs_support' | 'developing' | 'secure' | 'advanced';
  score?: number;
  hintCount?: number;
  timestamp: number;
};

// Enhanced diagnostic data for Firestore
export interface DiagnosticEvent {
  source: 'equation-builder' | 'fractions-lab' | 'venn-lab' | 'arena-challenge' | 'quiz';
  subject: string;
  level: string;
  conceptId: string;
  misconceptionTag?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  attemptNumber: number;
  severity: 'first-time' | 'recurring';
  timestamp: any; // Firestore serverTimestamp
  contextData?: {
    stepKey?: string;
    timeSpent?: number;
    hintsRequested?: number;
    stationSlug?: string;
    isCorrect?: boolean;
    strategyTag?: string;
  };
}

const STORAGE_KEY = 'math_lab_metrics_v1';

/**
 * Track math lab metric to both localStorage (backward compatibility) and Firestore (new diagnostic engine)
 */
export function trackMathLabMetric(event: Omit<MathLabMetricEvent, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  const entry: MathLabMetricEvent = {
    ...event,
    timestamp: Date.now(),
  };

  // Write to localStorage (backward compatibility, offline support)
  try {
    const existing = readMathLabMetrics();
    const next = [...existing, entry].slice(-500);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures to keep labs usable offline/private mode.
  }

  // Write to Firestore (new diagnostic engine) - only for authenticated users with misconception data
  if (event.userId && event.misconceptionTag && event.conceptId) {
    writeDiagnosticToFirestore(event).catch(err => {
      // Silent fail - don't break lab experience if Firestore is down
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Diagnostic Write Failed]', err);
      }
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[MathLab Metric]', entry);
  }
}

/**
 * Write diagnostic event to Firestore
 * Schema: diagnostics/{userId}/misconceptions/{autoId}
 */
async function writeDiagnosticToFirestore(event: Omit<MathLabMetricEvent, 'timestamp'>): Promise<void> {
  if (!event.userId || !event.conceptId) return;

  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return;

    // Count recent attempts for this concept to determine severity
    const recentMetrics = readMathLabMetrics()
      .filter(m => m.userId === event.userId && m.conceptId === event.conceptId)
      .slice(-10); // Last 10 attempts
    
    const attemptNumber = recentMetrics.length + 1;
    const severity: 'first-time' | 'recurring' = attemptNumber >= 3 ? 'recurring' : 'first-time';

    // Map station slug to subject/level
    const { subject, level } = inferSubjectAndLevel(event.stationSlug, event.conceptId);

    const diagnosticData: DiagnosticEvent = {
      source: mapStationToSource(event.stationSlug),
      subject,
      level,
      conceptId: event.conceptId,
      misconceptionTag: event.misconceptionTag,
      attemptNumber,
      severity,
      timestamp: serverTimestamp(),
      contextData: {
        stationSlug: event.stationSlug,
        isCorrect: event.isCorrect,
        strategyTag: event.strategyTag,
        hintsRequested: event.hintCount,
      }
    };

    // Write to Firestore: diagnostics/{userId}/misconceptions/{autoId}
    const diagnosticsRef = collection(firestore, 'diagnostics', event.userId, 'misconceptions');
    await addDoc(diagnosticsRef, diagnosticData);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Diagnostic Saved to Firestore]', diagnosticData);
    }
  } catch (error) {
    // Silent fail - don't disrupt user experience
    if (process.env.NODE_ENV === 'development') {
      console.error('[Firestore Write Error]', error);
    }
  }
}

/**
 * Map station slug to diagnostic source type
 */
function mapStationToSource(stationSlug: string): DiagnosticEvent['source'] {
  if (stationSlug.includes('equation-builder')) return 'equation-builder';
  if (stationSlug.includes('fractions')) return 'fractions-lab';
  if (stationSlug.includes('venn')) return 'venn-lab';
  return 'equation-builder'; // Default
}

/**
 * Infer subject and level from station and concept
 */
function inferSubjectAndLevel(stationSlug: string, conceptId?: string): { subject: string; level: string } {
  // Default to mathematics/JHS
  let subject = 'Mathematics';
  let level = 'JHS';

  // Infer from concept ID if available
  if (conceptId) {
    if (conceptId.includes('linear') || conceptId.includes('quadratic') || conceptId.includes('algebra')) {
      subject = 'Mathematics';
      // Check if it's more advanced (SHS level)
      if (conceptId.includes('quadratic') || conceptId.includes('polynomial')) {
        level = 'SHS';
      }
    }
    if (conceptId.includes('fraction')) {
      subject = 'Mathematics';
      level = 'JHS';
    }
  }

  return { subject, level };
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
