import { useEffect, useMemo } from 'react';
import { AgencyContext, type AgencyContextValue } from './data/AgencyContext';
import { DATA_URL, useAgencyData } from './data/useAgencyData';
import type { AgencyData } from './types/agencia';
import { arr, has, txt } from './lib/format';
import { liveHref, renderedIds } from './lib/sections';
import { applyTheme } from './lib/theme';
import { useActiveSection } from './hooks/useActiveSection';
import { useDocumentMeta } from './hooks/useDocumentMeta';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Differentials } from './components/Differentials';
import { ErrorState } from './components/ErrorState';
import { Faq } from './components/Faq';
import { BackToTop, WhatsAppFloat } from './components/FloatingButtons';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Header, type NavItem } from './components/Header';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { PromoArea } from './components/PromoArea';
import { SectionBoundary } from './components/SectionBoundary';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { TopBar } from './components/TopBar';

/** Menu entries with a label and a valid target (hidden when the section isn't rendered) */
function buildMenu(d: AgencyData, ids: Set<string>): NavItem[] {
  return arr(d.menu).flatMap((m) => {
    const href = liveHref(m.ancora, ids);
    if (!href || href === '#' || !has(m.rotulo)) return [];
    return [{ label: txt(m.rotulo), href }];
  });
}

function Site({ data }: { data: AgencyData }) {
  const ctx = useMemo<AgencyContextValue>(() => ({ data, ids: renderedIds(data) }), [data]);
  const menu = useMemo(() => buildMenu(data, ctx.ids), [data, ctx.ids]);
  const anchorIds = menu.filter((m) => m.href.startsWith('#')).map((m) => m.href.slice(1));
  const activeId = useActiveSection(anchorIds);

  useEffect(() => applyTheme(data.agencia?.identidade_visual), [data]);
  useDocumentMeta(data);

  // Honour an initial #hash once the dynamic content exists
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    const t = window.setTimeout(() => el.scrollIntoView(), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AgencyContext.Provider value={ctx}>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <SectionBoundary name="TopBar"><TopBar /></SectionBoundary>
      <SectionBoundary name="Header"><Header items={menu} activeId={activeId} /></SectionBoundary>
      <main id="main">
        <SectionBoundary name="Hero"><Hero /></SectionBoundary>
        <SectionBoundary name="Services"><Services /></SectionBoundary>
        <SectionBoundary name="Differentials"><Differentials /></SectionBoundary>
        <SectionBoundary name="About"><About /></SectionBoundary>
        <SectionBoundary name="Testimonials"><Testimonials /></SectionBoundary>
        <SectionBoundary name="Gallery"><Gallery /></SectionBoundary>
        <SectionBoundary name="Faq"><Faq /></SectionBoundary>
        <SectionBoundary name="PromoArea"><PromoArea /></SectionBoundary>
        <SectionBoundary name="Contact"><Contact /></SectionBoundary>
      </main>
      <SectionBoundary name="Footer"><Footer /></SectionBoundary>
      <SectionBoundary name="WhatsAppFloat"><WhatsAppFloat /></SectionBoundary>
      <BackToTop />
    </AgencyContext.Provider>
  );
}

export default function App() {
  const state = useAgencyData(DATA_URL);
  return (
    <>
      <Preloader done={state.status !== 'loading'} />
      {state.status === 'error' && <ErrorState url={DATA_URL} message={state.message} />}
      {state.status === 'ready' && <Site data={state.data} />}
    </>
  );
}
