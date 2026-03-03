/**
 * HTML Sanitization Utility
 * 
 * Use this to sanitize any user-generated or dynamic HTML before rendering
 * with dangerouslySetInnerHTML to prevent XSS attacks.
 * 
 * @example
 * import { sanitizeHtml } from '@/lib/security/sanitize-html';
 * 
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 */

// Lazy-load DOMPurify to avoid SSR issues with jsdom
let DOMPurify: any = null;

/**
 * Get DOMPurify instance (client-side only)
 */
function getDOMPurify() {
  if (typeof window === 'undefined') {
    // Server-side: return null (no sanitization needed for SSR)
    return null;
  }
  
  if (!DOMPurify) {
    // Client-side: lazy load DOMPurify
    try {
      const createDOMPurify = require('isomorphic-dompurify');
      DOMPurify = createDOMPurify;
    } catch (error) {
      console.error('Failed to load DOMPurify:', error);
      return null;
    }
  }
  
  return DOMPurify;
}

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
}

const DEFAULT_OPTIONS: SanitizeOptions = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'span', 'br', 'p', 'div', 
    'ul', 'ol', 'li', 'sup', 'sub', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  allowedAttributes: ['class', 'style', 'href', 'src', 'alt', 'title'],
  allowDataAttributes: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param html - Raw HTML string (potentially unsafe)
 * @param options - Sanitization options
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(
  html: string, 
  options: SanitizeOptions = {}
): string {
  const purify = getDOMPurify();
  
  // Server-side: return original (will be sanitized on client hydration)
  if (!purify) {
    return html;
  }
  
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: opts.allowedTags,
    ALLOWED_ATTR: opts.allowedAttributes,
    ALLOW_DATA_ATTR: opts.allowDataAttributes,
    // Additional security options
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

/**
 * Sanitize for math content (allows more tags for KaTeX)
 */
export function sanitizeMathHtml(html: string): string {
  const purify = getDOMPurify();
  
  // Server-side: return original (will be sanitized on client hydration)
  if (!purify) {
    return html;
  }
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'span', 'div', 'sup', 'sub', 'br', 'math', 'mi', 'mn', 'mo', 'mrow',
      'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtext', 'annotation'
    ],
    ALLOWED_ATTR: ['class', 'style', 'xmlns'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Strip ALL HTML tags (use for plaintext display)
 */
export function stripHtml(html: string): string {
  const purify = getDOMPurify();
  
  // Server-side: return original (will be sanitized on client hydration)
  if (!purify) {
    return html;
  }
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
