/* Generic helpers: presence checks, pt-BR number/date formatting, rating labels. */
import type { CSSProperties } from 'react';
import type { List } from '../types/agencia';

/** Non-null array items (anything that isn't an array → []) */
export function arr<T>(v: List<T>): T[] {
  return Array.isArray(v) ? (v as ReadonlyArray<T | null | undefined>).filter((x): x is T => x != null) : [];
}

/** True when the value is present and not a blank string */
export const has = (v: unknown): boolean => v != null && String(v).trim() !== '';

/** Stringify any scalar for text output */
export const txt = (v: unknown): string => (v == null ? '' : String(v));

export const fmtNum = (n: number | string, opts?: Intl.NumberFormatOptions): string =>
  Number(n).toLocaleString('pt-BR', opts);

/** "4,9" style score (always one decimal) */
export const fmtScore = (n: number | string): string =>
  fmtNum(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "2026-06-18" → "junho de 2026" */
export function fmtDateMonth(iso: unknown): string {
  if (!has(iso)) return '';
  const m = String(iso).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return String(iso);
  const d = new Date(+m[1], +m[2] - 1, +(m[3] || 1));
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/** "2026-06-18" → "18/06/2026" */
export function fmtDateBR(iso: unknown): string {
  const m = String(iso ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(iso ?? '');
}

/** Local "today" as yyyy-mm-dd */
export function todayIso(): string {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function scoreLabel(v: unknown): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return '';
  if (n >= 4.5) return 'Excelente';
  if (n >= 4) return 'Muito bom';
  if (n >= 3.5) return 'Bom';
  if (n >= 2.5) return 'Regular';
  return 'Ruim';
}

/** Initials for avatar placeholders */
export const initials = (name: unknown): string =>
  String(name || '?').split(/\s+/).map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase();

/** Inline CSS custom properties (e.g. { '--d': '70ms' }) */
export const cssVars = (vars: Record<`--${string}`, string | number>): CSSProperties => vars as CSSProperties;

/** Case/accent-insensitive normalisation for keyword matching */
export const normalize = (t: unknown): string =>
  String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
