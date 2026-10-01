/* Which sections render for a given data set (shared by components and the menu filter). */
import type { AgencyData, Foto, FaqItem } from '../types/agencia';
import { arr, has } from './format';
import { safeUrl } from './url';

export const galleryPhotos = (d: AgencyData): Foto[] =>
  arr(d.galeria?.fotos).filter((f) => safeUrl(f.miniatura || f.url));

export const faqItems = (d: AgencyData): FaqItem[] => arr(d.faq?.itens).filter((i) => has(i.pergunta));

export const showSection = {
  hero: (d: AgencyData) => !!d.hero,
  servicos: (d: AgencyData) =>
    arr(d.servicos?.itens).length > 0 || arr(d.servicos?.servicos_complementares).length > 0,
  diferenciais: (d: AgencyData) => arr(d.diferenciais?.itens).length > 0 || has(d.diferenciais?.titulo),
  sobre: (d: AgencyData) => !!d.sobre && (has(d.sobre.titulo) || arr(d.sobre.paragrafos).length > 0),
  depoimentos: (d: AgencyData) => arr(d.depoimentos?.itens).length > 0,
  galeria: (d: AgencyData) => galleryPhotos(d).length > 0,
  faq: (d: AgencyData) => faqItems(d).length > 0,
  'cta-final': (d: AgencyData) => !!d.cta_final && (has(d.cta_final.titulo) || has(d.cta_final.botao?.texto)),
  contato: (d: AgencyData) => !!d.contato,
};

/** Sanitised href, or '' when it is an in-page #anchor whose target section isn't rendered */
export function liveHref(u: unknown, ids: Set<string>): string {
  const href = safeUrl(u);
  if (href.length > 1 && href.startsWith('#') && !ids.has(decodeURIComponent(href.slice(1)))) return '';
  return href;
}

/** Every element id that will exist in the page (used to validate #anchors) */
export function renderedIds(d: AgencyData): Set<string> {
  const ids = new Set<string>(['main', 'footer', 'site-header']);
  (Object.keys(showSection) as Array<keyof typeof showSection>).forEach((k) => {
    if (showSection[k](d)) ids.add(k);
  });
  if (showSection.servicos(d)) arr(d.servicos?.itens).forEach((s) => { if (has(s.id)) ids.add(`svc-${s.id}`); });
  return ids;
}
