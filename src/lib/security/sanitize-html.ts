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
 *
 * Implementation note: this is a dependency-free, regex-based allowlist
 * sanitizer (no jsdom/DOMPurify). Earlier versions used isomorphic-dompurify,
 * but its jsdom dependency behaves inconsistently under Next.js's server
 * bundler (Turbopack/webpack) vs. the browser, producing different output
 * for the same input and causing React hydration mismatches. This
 * implementation runs identical, deterministic logic in both environments.
 */

// Tags whose content (not just the tag) must never survive sanitization
const ALWAYS_STRIP_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form', 'noscript'];

// Attribute values are blocked if they start with (after trimming/lowering) one of these
const DANGEROUS_URL_SCHEMES = ['javascript:', 'vbscript:', 'data:text/html'];

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
}

const DEFAULT_OPTIONS: Required<SanitizeOptions> = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'span', 'br', 'p', 'div',
    'ul', 'ol', 'li', 'sup', 'sub', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'pre', 'code'
  ],
  allowedAttributes: ['class', 'style', 'href', 'src', 'alt', 'title'],
  allowDataAttributes: false,
};

function isSafeUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized.startsWith('data:image/')) return true; // allow inline images only
  return !DANGEROUS_URL_SCHEMES.some(scheme => normalized.startsWith(scheme));
}

/** Remove disallowed attributes (and dangerous attribute values) from a single tag's attribute string. */
function sanitizeAttributes(attrString: string, allowedAttributes: string[], allowDataAttributes: boolean): string {
  const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let cleaned = '';
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? '';

    // Never allow inline event handlers, regardless of the allowlist
    if (name.startsWith('on')) continue;

    const isDataAttr = name.startsWith('data-');
    if (!allowedAttributes.includes(name) && !(isDataAttr && allowDataAttributes)) continue;

    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue;

    cleaned += ` ${name}="${value.replace(/"/g, '&quot;')}"`;
  }

  return cleaned;
}

function stripTagsWithContent(html: string, tags: string[]): string {
  let result = html;
  for (const tag of tags) {
    const pairedRegex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    result = result.replace(pairedRegex, '').replace(selfClosingRegex, '');
  }
  return result;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param html - Raw HTML string (potentially unsafe)
 * @param options - Sanitization options
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const withoutDangerousTags = stripTagsWithContent(html, ALWAYS_STRIP_TAGS);

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*)?)\/?>/g;
  return withoutDangerousTags.replace(tagRegex, (fullMatch, tagName: string, attrString: string) => {
    const name = tagName.toLowerCase();
    if (!opts.allowedTags.includes(name)) return '';

    const isClosingTag = fullMatch.startsWith('</');
    if (isClosingTag) return `</${name}>`;

    const isSelfClosing = fullMatch.endsWith('/>');
    const cleanedAttrs = sanitizeAttributes(attrString, opts.allowedAttributes, opts.allowDataAttributes);
    return `<${name}${cleanedAttrs}${isSelfClosing ? ' />' : '>'}`;
  });
}

/**
 * Sanitize for math content (allows more tags for KaTeX)
 */
export function sanitizeMathHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'span', 'div', 'sup', 'sub', 'br', 'math', 'mi', 'mn', 'mo', 'mrow',
      'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtext', 'annotation'
    ],
    allowedAttributes: ['class', 'style', 'xmlns'],
    allowDataAttributes: false,
  });
}

/**
 * Strip ALL HTML tags (use for plaintext display)
 */
export function stripHtml(html: string): string {
  return stripTagsWithContent(html, ALWAYS_STRIP_TAGS).replace(/<[^>]*>/g, '');
}

