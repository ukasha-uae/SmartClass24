/**
 * Rate Limiting Utility
 * 
 * Provides in-memory rate limiting with configurable limits per endpoint.
 * For production with multiple instances, upgrade to @upstash/ratelimit.
 * 
 * @see https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
    requests: number[];
  };
}

interface RateLimitConfig {
  /**
   * Maximum requests allowed in the time window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Optional message to return when rate limit exceeded
   */
  message?: string;
}

// In-memory store (for development/single-instance deployments)
// For production with multiple instances, use Redis/Upstash
const store: RateLimitStore = {};

// Cleanup counter for opportunistic cleanup (since setInterval not available in Edge)
let cleanupCounter = 0;
const CLEANUP_FREQUENCY = 100; // Clean up every 100 requests

// Note: Automatic cleanup via setInterval is not available in Edge Runtime
// Manual cleanup happens periodically during checkRateLimit calls

/**
 * Get client identifier from request
 * Priority: IP address > User agent hash > Random
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP (works with most proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0];
  
  if (ip) {
    return `ip:${ip}`;
  }
  
  // Fallback to user agent hash
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `ua:${hashCode(userAgent)}`;
}

/**
 * Simple hash function for user agent
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if request is within rate limit
 * Uses sliding window algorithm
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const identifier = getClientIdentifier(request);
  const key = `${identifier}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  // Opportunistic cleanup: Remove entries older than 1 hour (every 100 requests)
  // (Edge Runtime doesn't support setInterval)
  cleanupCounter++;
  if (cleanupCounter >= CLEANUP_FREQUENCY) {
    cleanupCounter = 0;
    Object.keys(store).forEach(storeKey => {
      const entry = store[storeKey];
      if (now - entry.lastRefill > 3600000) {
        delete store[storeKey];
      }
    });
  }
  
  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      tokens: config.maxRequests,
      lastRefill: now,
      requests: [],
    };
  }
  
  const entry = store[key];
  
  // Remove requests outside the time window
  entry.requests = entry.requests.filter(
    timestamp => now - timestamp < config.windowMs
  );
  
  // Check if limit exceeded
  if (entry.requests.length >= config.maxRequests) {
    const oldestRequest = entry.requests[0];
    const resetAt = oldestRequest + config.windowMs;
    
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }
  
  // Add current request
  entry.requests.push(now);
  entry.lastRefill = now;
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.requests.length,
    resetAt: now + config.windowMs,
  };
}

/**
 * Rate limit middleware wrapper
 * Returns 429 Too Many Requests if limit exceeded
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const result = checkRateLimit(request, config);
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          error: config.message || 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toString(),
          },
        }
      );
    }
    
    // Request allowed - return null to continue
    return null;
  };
}

/**
 * Predefined rate limit configurations for different API endpoint types
 */
export const RateLimitPresets = {
  /**
   * Strict limit for authentication endpoints
   * 5 requests per minute per IP
   */
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many authentication attempts. Please try again in a minute.',
  },
  
  /**
   * Moderate limit for payment webhooks
   * 100 requests per minute per IP
   */
  webhook: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Webhook rate limit exceeded.',
  },
  
  /**
   * Standard limit for general API routes
   * 60 requests per minute per IP
   */
  standard: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  
  /**
   * Relaxed limit for public data endpoints
   * 120 requests per minute per IP
   */
  public: {
    maxRequests: 120,
    windowMs: 60 * 1000, // 1 minute
    message: 'Rate limit exceeded. Please try again shortly.',
  },
  
  /**
   * Very strict limit for sensitive operations
   * 3 requests per minute per IP
   */
  sensitive: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many attempts. Please wait before trying again.',
  },
} as const;

/**
 * Production upgrade guide:
 * 
 * For deployments with multiple instances (load balanced), replace this
 * in-memory implementation with @upstash/ratelimit:
 * 
 * ```bash
 * npm install @upstash/ratelimit @upstash/redis
 * ```
 * 
 * ```typescript
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * 
 * const redis = Redis.fromEnv();
 * 
 * const ratelimit = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(60, "1 m"),
 *   analytics: true,
 * });
 * 
 * const { success, remaining, reset } = await ratelimit.limit(identifier);
 * ```
 * 
 * Environment variables required:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
