/**
 * Input Validation Schemas
 * 
 * Use these Zod schemas to validate all API inputs and user data
 * to prevent injection attacks and data corruption.
 */

import { z } from 'zod';

/**
 * Authentication & User Schemas
 */
export const BearerTokenSchema = z
  .string()
  .min(1, 'Token required')
  .regex(/^[A-Za-z0-9\-._~+/]+=*$/, 'Invalid token format');

export const UserIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid user ID');

export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .max(320);

/**
 * Tenant & Localization Schemas
 */
export const TenantIdSchema = z
  .string()
  .min(3, 'Tenant ID too short')
  .max(50, 'Tenant ID too long')
  .regex(/^[a-z0-9-]+$/, 'Invalid tenant ID (lowercase alphanumeric and hyphens only)');

export const CountryCodeSchema = z
  .enum(['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'])
  .default('ghana');

/**
 * Academic Schemas
 */
export const LevelSchema = z
  .enum(['jhs-1', 'jhs-2', 'jhs-3', 'shs-1', 'shs-2', 'shs-3', 'primary']);

export const SubjectSlugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Invalid subject slug');

export const LessonIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Invalid lesson ID');

/**
 * Quiz & Challenge Schemas
 */
export const QuizAttemptSchema = z.object({
  lessonId: LessonIdSchema,
  score: z.number().min(0).max(100),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedAnswer: z.number(),
    isCorrect: z.boolean(),
  })),
  completedAt: z.date().or(z.string()),
});

export const ChallengeIdSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid challenge ID');

/**
 * Payment Schemas
 */
export const PaymentAmountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(1000000, 'Amount too large');

export const CurrencyCodeSchema = z
  .enum(['GHS', 'NGN', 'SLL', 'LRD', 'GMD', 'USD']);

/**
 * API Request Schemas
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const SearchQuerySchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Invalid search query');

/**
 * Helper function to validate and parse
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ')
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}
