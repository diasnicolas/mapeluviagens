/* Keyword → Font Awesome icon mapping (generic, not agency specific) */
import { normalize } from './format';

type IconMap = ReadonlyArray<readonly [RegExp, string]>;

export function pickIcon(text: unknown, map: IconMap, fallback: string): string {
  const t = normalize(text);
  for (const [re, icon] of map) if (re.test(t)) return icon;
  return fallback;
}

export const STAT_ICONS: IconMap = [
  [/client|viajant|passageir/, 'fa-solid fa-users'],
  [/destino|pais/, 'fa-solid fa-earth-americas'],
  [/avalia|nota|google/, 'fa-solid fa-star'],
  [/suporte|atendimento|24/, 'fa-solid fa-headset'],
  [/ano|experien/, 'fa-solid fa-award'],
  [/consultor|equipe/, 'fa-solid fa-user-tie'],
];

export const SEAL_ICONS: IconMap = [
  [/cadastur|turismo/, 'fa-solid fa-id-card'],
  [/abav|associa/, 'fa-solid fa-handshake'],
  [/ssl|seguro|segur/, 'fa-solid fa-lock'],
  [/iata/, 'fa-solid fa-plane-circle-check'],
];

export const SOURCE_ICONS: IconMap = [
  [/google/, 'fa-brands fa-google'],
  [/tripadvisor/, 'fa-brands fa-tripadvisor'],
  [/facebook/, 'fa-brands fa-facebook'],
  [/reclame/, 'fa-solid fa-scale-balanced'],
];

export const FIELD_ICONS: Record<'text' | 'date' | 'select', string> = {
  text: 'fa-solid fa-location-dot',
  date: 'fa-regular fa-calendar',
  select: 'fa-solid fa-user-group',
};

const PAYMENT_ICONS: IconMap = [
  [/visa/, 'fa-brands fa-cc-visa'],
  [/master/, 'fa-brands fa-cc-mastercard'],
  [/amex|american/, 'fa-brands fa-cc-amex'],
  [/pix/, 'fa-brands fa-pix'],
  [/paypal/, 'fa-brands fa-cc-paypal'],
  [/diners/, 'fa-brands fa-cc-diners-club'],
  [/boleto/, 'fa-solid fa-barcode'],
];

/** Brand icon for a payment method, or '' when it should be a text chip */
export const paymentIcon = (name: unknown): string => pickIcon(name, PAYMENT_ICONS, '');
