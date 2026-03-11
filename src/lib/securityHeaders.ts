/**
 * Security Headers Configuration
 * These headers should be set on the server (Vite/Express/Vercel)
 */

export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Adjust as needed
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.supabase.co https://api.ipify.org",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),

  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Cross-Origin Resource Sharing
  'Access-Control-Allow-Origin': process.env.REACT_APP_API_URL || 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  'Access-Control-Allow-Credentials': 'true',
};

/**
 * Vite Configuration for Security Headers
 * Add this to vite.config.ts
 */
export const viteSecurityConfig = {
  server: {
    headers: securityHeaders,
    middlewareMode: true,
  },
  preview: {
    headers: securityHeaders,
  },
};

/**
 * Content Security Policy Directives
 */
export const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.supabase.co'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * XSS Protection Utilities
 */
export const xssProtection = {
  // Sanitize HTML
  sanitizeHTML: (html: string): string => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  // Escape special characters
  escapeHTML: (text: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  },

  // Validate URL
  isValidURL: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Sanitize URL
  sanitizeURL: (url: string): string => {
    if (!xssProtection.isValidURL(url)) {
      return '/';
    }
    return url;
  },
};

/**
 * CSRF Protection
 */
export const csrfProtection = {
  // Get CSRF token from meta tag or cookie
  getToken: (): string | null => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
  },

  // Add CSRF token to request headers
  addTokenToHeaders: (headers: HeadersInit, token: string): HeadersInit => {
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  },
};

/**
 * SQL Injection Prevention
 * (Supabase handles this automatically with parameterized queries)
 */
export const sqlInjectionPrevention = {
  // Validate input before sending to database
  validateInput: (input: string, type: 'email' | 'phone' | 'text' | 'number'): boolean => {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'phone':
        return /^\d{11}$/.test(input.replace(/\D/g, ''));
      case 'number':
        return /^\d+$/.test(input);
      case 'text':
        return input.length > 0 && input.length <= 500;
      default:
        return false;
    }
  },
};

/**
 * CORS Configuration
 */
export const corsConfig = {
  origin: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
  maxAge: 86400, // 24 hours
};

/**
 * Security Best Practices
 */
export const securityBestPractices = {
  // Never store sensitive data in localStorage
  // Use sessionStorage for temporary data only
  // Always use HTTPS
  // Implement rate limiting
  // Use strong password requirements
  // Implement 2FA
  // Regular security audits
  // Keep dependencies updated
  // Use environment variables for secrets
  // Implement proper logging and monitoring
  // Regular backups
  // Incident response plan
};
