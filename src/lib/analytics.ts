/**
 * Analytics Tracking for Carousel Mode
 * Track usage patterns, engagement, and errors
 */

export interface CarouselUsageData {
  lessonSlug: string;
  level: string;
  subject: string;
  topic: string;
  slideIndex: number;
  totalSlides: number;
  action: 'view' | 'next' | 'previous' | 'jump' | 'complete' | 'exit';
  timeSpent?: number; // milliseconds
  timestamp: number;
}

export interface CarouselErrorData {
  lessonSlug: string;
  error: string;
  errorType: 'validation' | 'render' | 'navigation' | 'audio' | 'other';
  context: string;
  userAgent?: string;
  timestamp: number;
}

export interface CarouselSessionData {
  lessonSlug: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  slidesViewed: number[];
  navigationPattern: string[]; // ['next', 'next', 'previous', 'jump', ...]
  voiceUsed: boolean;
  completed: boolean;
  quizScore?: number;
}

/**
 * Track carousel usage events
 */
export function trackCarouselUsage(data: CarouselUsageData): void {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Carousel Analytics]', {
      type: 'usage',
      ...data,
    });
  }

  // TODO: Send to Firebase Analytics
  // if (window.gtag) {
  //   window.gtag('event', 'carousel_interaction', {
  //     lesson_slug: data.lessonSlug,
  //     action: data.action,
  //     slide_index: data.slideIndex,
  //     time_spent: data.timeSpent,
  //   });
  // }

  // TODO: Send to custom analytics endpoint
  // fetch('/api/analytics/carousel', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).catch(console.error);
}

/**
 * Track carousel errors
 */
export function trackCarouselError(data: CarouselErrorData): void {
  if (typeof window === 'undefined') return;

  // Only log if error is a non-empty, non-object, non-array string
  if (
    !data ||
    typeof data.error !== 'string' ||
    !data.error.trim() ||
    data.error.trim() === '{}' ||
    data.error.trim() === '[]'
  ) {
    return; // Silently ignore empty, object, or array errors
  }

  console.error('[Carousel Error]', {
    type: 'error',
    ...data,
  });

  // TODO: Send to error tracking service (Sentry, etc.)
  // if (window.Sentry) {
  //   window.Sentry.captureException(new Error(data.error), {
  //     tags: {
  //       feature: 'carousel',
  //       lesson: data.lessonSlug,
  //       error_type: data.errorType,
  //     },
  //     extra: {
  //       context: data.context,
  //     },
  //   });
  // }

  // TODO: Send to custom error endpoint
  // fetch('/api/analytics/carousel-error', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).catch(console.error);
}

/**
 * Track complete carousel session
 */
export function trackCarouselSession(data: CarouselSessionData): void {
  if (typeof window === 'undefined') return;

  const sessionDuration = data.endTime
    ? data.endTime - data.startTime
    : Date.now() - data.startTime;

  if (process.env.NODE_ENV === 'development') {
    console.log('[Carousel Analytics]', {
      type: 'session',
      duration: sessionDuration,
      ...data,
    });
  }

  // TODO: Send to analytics
  // Similar implementation as trackCarouselUsage
}

/**
 * Create a new session tracker
 */
export class CarouselSessionTracker {
  private sessionData: CarouselSessionData;
  private slideStartTime: number = Date.now();

  constructor(lessonSlug: string, totalSlides: number) {
    this.sessionData = {
      lessonSlug,
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      slidesViewed: [0], // Start on first slide
      navigationPattern: [],
      voiceUsed: false,
      completed: false,
    };
  }

  private generateSessionId(): string {
    return `carousel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackSlideView(slideIndex: number): void {
    if (!this.sessionData.slidesViewed.includes(slideIndex)) {
      this.sessionData.slidesViewed.push(slideIndex);
    }
  }

  trackNavigation(action: 'next' | 'previous' | 'jump'): void {
    this.sessionData.navigationPattern.push(action);
  }

  trackVoiceUsage(): void {
    this.sessionData.voiceUsed = true;
  }

  trackCompletion(quizScore?: number): void {
    this.sessionData.completed = true;
    this.sessionData.quizScore = quizScore;
    this.sessionData.endTime = Date.now();
  }

  endSession(): void {
    this.sessionData.endTime = Date.now();
    trackCarouselSession(this.sessionData);
  }

  getSessionData(): CarouselSessionData {
    return { ...this.sessionData };
  }
}

/**
 * Calculate engagement metrics
 */
export function calculateEngagementMetrics(session: CarouselSessionData) {
  const duration = session.endTime
    ? session.endTime - session.startTime
    : Date.now() - session.startTime;
  const durationMinutes = duration / 1000 / 60;

  return {
    duration: durationMinutes.toFixed(2),
    slidesViewed: session.slidesViewed.length,
    completion: session.completed ? 100 : 0,
    navigationActions: session.navigationPattern.length,
    voiceUsed: session.voiceUsed,
    avgTimePerSlide:
      session.slidesViewed.length > 0
        ? (durationMinutes / session.slidesViewed.length).toFixed(2)
        : 0,
  };
}

/**
 * Track feature flag usage for A/B testing
 */
export function trackFeatureFlagStatus(
  feature: string,
  enabled: boolean,
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Feature Flag]', {
      feature,
      enabled,
      context,
    });
  }

  // TODO: Send to analytics for A/B testing analysis
}
