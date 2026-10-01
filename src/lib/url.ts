/* URL sanitising: allow http(s), mailto, tel, #anchors and relative paths only. */
import { has } from './format';

export function safeUrl(u: unknown): string {
  if (!has(u)) return '';
  const s = String(u).trim();
  if (s.startsWith('#')) return s;
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.startsWith('//')) return '';
  return s; // relative path
}

export const isExternal = (u: unknown): boolean => /^https?:/i.test(String(u ?? ''));

/** target/rel attributes for external links */
export const extProps = (u: unknown): { target?: string; rel?: string } =>
  isExternal(u) ? { target: '_blank', rel: 'noopener' } : {};
