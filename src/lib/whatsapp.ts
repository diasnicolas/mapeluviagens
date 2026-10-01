/* WhatsApp link builders (wa.me/<numero>?text=...) with fallback to contato.whatsapp.link */
import type { Contato, Maybe } from '../types/agencia';
import { safeUrl } from './url';

export const waNumber = (c: Maybe<Contato>): string => String(c?.whatsapp?.numero ?? '').replace(/\D/g, '');

export function waLink(c: Maybe<Contato>, message?: string): string {
  const n = waNumber(c);
  if (n) return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  return safeUrl(c?.whatsapp?.link) || '';
}

/** Default "talk to us" link */
export const defaultWa = (c: Maybe<Contato>): string =>
  safeUrl(c?.whatsapp?.link) || waLink(c, c?.whatsapp?.mensagem_padrao || '');

export function openWhatsApp(c: Maybe<Contato>, message: string): void {
  const url = waLink(c, message);
  if (url) window.open(url, '_blank', 'noopener');
}
