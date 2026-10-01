/* Brand colours from identidade_visual → CSS custom properties on :root */
import type { IdentidadeVisual, Maybe } from '../types/agencia';
import { has } from './format';

function hexToRgb(hex: unknown): [number, number, number] | null {
  let h = String(hex ?? '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const onColor = (c: unknown, darkInk: string): string | null => {
  const rgb = hexToRgb(c);
  if (!rgb) return null;
  return luminance(rgb) > 0.45 ? darkInk : '#ffffff';
};

const VAR_MAP = {
  cor_primaria: '--brand-primary',
  cor_secundaria: '--brand-secondary',
  cor_destaque: '--brand-accent',
  cor_escura: '--brand-dark',
  cor_clara: '--brand-light',
} as const;

/** Applies the theme; returns a cleanup that restores the CSS fallbacks */
export function applyTheme(iv: Maybe<IdentidadeVisual>): () => void {
  const root = document.documentElement;
  const set: string[] = [];
  const put = (prop: string, value: string) => {
    root.style.setProperty(prop, value);
    set.push(prop);
  };

  (Object.keys(VAR_MAP) as Array<keyof typeof VAR_MAP>).forEach((k) => {
    const c = iv?.[k];
    if (has(c) && CSS.supports('color', String(c))) put(VAR_MAP[k], String(c));
  });
  const onAccent = onColor(iv?.cor_destaque, '#1A1405');
  if (onAccent) put('--on-accent', onAccent);
  const onPrimary = onColor(iv?.cor_primaria, '#0A1F2C');
  if (onPrimary) put('--on-primary', onPrimary);
  const onSecondary = onColor(iv?.cor_secundaria, '#0A1F2C');
  if (onSecondary) put('--on-secondary', onSecondary);

  const meta = document.querySelector('meta[name="theme-color"]');
  const prevThemeColor = meta?.getAttribute('content') ?? null;
  if (meta && has(iv?.cor_primaria)) meta.setAttribute('content', String(iv?.cor_primaria));

  return () => {
    set.forEach((p) => root.style.removeProperty(p));
    if (meta && prevThemeColor != null) meta.setAttribute('content', prevThemeColor);
  };
}
