/* Contact-related derived data shared by top bar, drawer, FAQ, contact and footer. */
import type { AgencyData, Contato, Endereco, Horario, Maybe, RedeSocial } from '../types/agencia';
import { arr, has } from './format';
import { safeUrl } from './url';

export const socialsOf = (d: AgencyData): RedeSocial[] => arr(d.redes_sociais).filter((s) => safeUrl(s.url));

/** The "24h" support entry (or the first opening-hours row) */
export function hours24(c: Maybe<Contato>): Horario | undefined {
  const hours = arr(c?.horario_atendimento);
  return hours.find((h) => /24\s*h|24 horas/i.test(`${h.horario} ${h.dias}`)) || hours[0];
}

/** endereco.completo, or composed from its parts */
export function fullAddress(e: Maybe<Endereco>): string {
  if (!e) return '';
  if (has(e.completo)) return String(e.completo);
  return [
    [e.logradouro, e.numero].filter(has).join(', '),
    e.complemento,
    e.bairro,
    [e.cidade, e.uf || e.estado].filter(has).join(' - '),
    e.cep,
  ].filter(has).join(', ');
}
