/* FAQ as a help center: search hero + accessible accordion + "other channels" card */
import { useMemo, useState, type ReactNode } from 'react';
import { useAgency } from '../data/AgencyContext';
import { cx } from '../lib/cx';
import { has, txt } from '../lib/format';
import { faqItems } from '../lib/sections';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { Icon, Reveal } from './ui';

export function Faq() {
  const { data } = useAgency();
  const s = data.faq;
  const items = useMemo(() => faqItems(data), [data]);
  const [openSet, setOpenSet] = useState<ReadonlySet<number>>(() => new Set());
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  if (!items.length) return null;

  const c = data.contato;
  const wa = defaultWa(c);
  const q = query.trim().toLowerCase();
  const matches = items.map((it) => !q || `${txt(it.pergunta)} ${txt(it.resposta)}`.toLowerCase().includes(q));
  const shown = matches.filter(Boolean).length;

  const toggle = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const helpLinks: ReactNode[] = [];
  if (wa) {
    helpLinks.push(
      <a key="wa" className="help-link help-link--wa" href={wa} {...extProps(wa)}>
        <Icon name="fa-brands fa-whatsapp" />
        <span><strong>WhatsApp</strong><small>{txt(c?.whatsapp?.exibicao)}</small></span>
      </a>,
    );
  }
  if (c?.telefone?.exibicao) {
    helpLinks.push(
      <a key="tel" className="help-link" href={safeUrl(c.telefone.link) || '#contato'}>
        <Icon name="fa-solid fa-phone" />
        <span><strong>Telefone</strong><small>{c.telefone.exibicao}</small></span>
      </a>,
    );
  }
  if (c?.email?.exibicao) {
    helpLinks.push(
      <a key="mail" className="help-link" href={safeUrl(c.email.link) || '#contato'}>
        <Icon name="fa-regular fa-envelope" />
        <span><strong>E-mail</strong><small>{c.email.exibicao}</small></span>
      </a>,
    );
  }

  return (
    <section id="faq" className="section section--gray" aria-labelledby={has(s?.titulo) ? 'faq-title' : undefined}>
      <div className="container">
        <Reveal className="help-hero">
          <span className="help-hero__icon">
            <Icon name="fa-solid fa-life-ring" />
          </span>
          <div className="help-hero__text">
            <span className="eyebrow eyebrow--light">
              <Icon name="fa-solid fa-circle-question" />
              Central de ajuda
            </span>
            {has(s?.titulo) && <h2 className="sec-title" id="faq-title">{s?.titulo}</h2>}
            {has(s?.subtitulo) && <p className="sec-sub">{s?.subtitulo}</p>}
          </div>
          <label className="help-search">
            <span className="sr-only">Buscar nas perguntas frequentes</span>
            <Icon name="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              id="faq-search"
              placeholder="Buscar dúvida…"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(true);
              }}
            />
          </label>
        </Reveal>
        <div className="help-layout">
          <div className="faq-list" id="faq-list">
            {items.map((it, i) => {
              const open = openSet.has(i);
              return (
                <Reveal key={i} className={cx('faq-item', open && 'is-open')} index={i} hidden={!matches[i]} force={searched}>
                  <h3 className="faq-item__h">
                    <button
                      type="button"
                      className="faq-q"
                      id={`faq-q-${i}`}
                      aria-expanded={open}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className="faq-q__icon">
                        <Icon name="fa-regular fa-circle-question" />
                      </span>
                      <span className="faq-q__text">{it.pergunta}</span>
                      <i className="fa-solid fa-chevron-down faq-q__chev" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                    <div className="faq-a__inner">
                      <p>{it.resposta}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <p className="faq-empty" id="faq-empty" hidden={shown > 0}>
              <Icon name="fa-regular fa-face-frown" />
              Nenhuma pergunta encontrada para essa busca.
            </p>
          </div>
          {helpLinks.length > 0 && (
            <Reveal as="aside" className="help-card" aria-label="Outros canais de ajuda">
              <span className="help-card__icon">
                <Icon name="fa-solid fa-headset" />
              </span>
              <h3>Não encontrou sua resposta?</h3>
              <p>Fale com um consultor pelo canal de sua preferência.</p>
              <div className="help-card__links">{helpLinks}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
