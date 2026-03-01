import { normalizeMathText } from '@/lib/text/normalize-math-text';

/**
 * Converts math-heavy UI text into speech-friendly phrasing.
 * This only affects text sent to speech synthesis, not on-screen rendering.
 */
export function formatTextForSpeech(input: string): string {
  if (!input) return '';

  let text = normalizeMathText(input);

  // Common symbols and punctuation used in guided lessons/labs.
  text = text
    .replace(/•/g, ', ')
    .replace(/±/g, ' plus or minus ')
    .replace(/≠/g, ' not equal to ')
    .replace(/≥/g, ' greater than or equal to ')
    .replace(/≤/g, ' less than or equal to ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/=/g, ' equals ');

  // Percentages and simple numeric fractions.
  text = text
    .replace(/\b(\d+(?:\.\d+)?)%/g, '$1 percent')
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, '$1 over $2');

  // Decimal pronunciation.
  text = text.replace(/\b(\d+)\.(\d+)\b/g, '$1 point $2');

  // Roots and powers.
  text = text
    .replace(/√\s*(\d+(?:\.\d+)?)/g, 'square root of $1')
    .replace(/\b([A-Za-z0-9]+)\^([0-9]+)\b/g, '$1 to the power of $2')
    .replace(/\b([A-Za-z0-9]+)²\b/g, '$1 squared')
    .replace(/\b([A-Za-z0-9]+)³\b/g, '$1 cubed');

  // Numeric subtraction and negatives.
  text = text
    .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2')
    .replace(/(^|[\s(])-([0-9]+(?:\.[0-9]+)?)/g, '$1negative $2');

  // Plus signs in arithmetic contexts.
  text = text.replace(/(\d)\s*\+\s*(\d)/g, '$1 plus $2');

  // Normalize spacing for cleaner speech output.
  text = text.replace(/\s{2,}/g, ' ').trim();

  return text;
}

/**
 * Sentence chunking for speech/reveal that avoids splitting decimal numbers (e.g. 29.5).
 */
export function splitSentencesForSpeech(input: string): string[] {
  if (!input) return [];
  const text = input.trim();
  if (!text) return [];

  // Split only when punctuation is followed by whitespace.
  // This keeps decimal numbers like 29.5 in one sentence chunk.
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

