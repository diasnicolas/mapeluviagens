import { useEffect } from 'react';
import type { AgencyData } from '../types/agencia';
import { arr, has, txt } from '../lib/format';
import { safeUrl } from '../lib/url';

function setMeta(attr: 'name' | 'property', key: string, content: unknown): void {
  if (!has(content)) return;
  let m = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute(attr, key);
    document.head.appendChild(m);
  }
  m.setAttribute('content', String(content));
}

/** SEO: title, description, keywords, og:* and favicon from the JSON */
export function useDocumentMeta(d: AgencyData): void {
  useEffect(() => {
    const seo = d.seo ?? {};
    const ag = d.agencia ?? {};
    document.title = txt(seo.titulo || ag.nome) || document.title;
    setMeta('name', 'description', seo.descricao || ag.descricao_curta);
    setMeta('name', 'keywords', arr(seo.palavras_chave).join(', '));
    setMeta('property', 'og:title', seo.titulo || ag.nome);
    setMeta('property', 'og:description', seo.descricao || ag.descricao_curta);
    setMeta('property', 'og:image', safeUrl(seo.imagem_compartilhamento));
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:locale', 'pt_BR');
    const fav = safeUrl(ag.logotipo?.favicon || ag.logotipo?.icone);
    if (fav) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = fav;
    }
  }, [d]);
}
