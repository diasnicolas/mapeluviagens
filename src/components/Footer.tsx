/* Big e-commerce footer: brand + socials, link columns, contact, payment chips, seals, legal bar */
import type { ReactNode } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { LinkRodape, List } from '../types/agencia';
import { socialsOf } from '../lib/contact';
import { arr, has, txt } from '../lib/format';
import { cx } from '../lib/cx';
import { paymentIcon, pickIcon, SEAL_ICONS } from '../lib/icons';
import { liveHref } from '../lib/sections';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { Logo } from './Logo';
import { Icon, SocialIcons } from './ui';

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="footer__col">
      <h2 className="footer__h">{title}</h2>
      {children}
    </div>
  );
}

interface FooterLink {
  label: string;
  href: string;
}

/** Labelled links; anchors to sections that aren't rendered are dropped (placeholder "#" links stay) */
function footerLinks(list: List<LinkRodape>, ids: Set<string>): FooterLink[] {
  return arr(list).flatMap((l) => {
    if (!has(l.rotulo)) return [];
    const href = liveHref(l.link, ids);
    if (!href && safeUrl(l.link)) return [];
    return [{ label: txt(l.rotulo), href: href || '#' }];
  });
}

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="footer__links">
      {links.map((l, i) => (
        <li key={i}>
          <a href={l.href} {...extProps(l.href)}>{l.label}</a>
        </li>
      ))}
    </ul>
  );
}

/** Brand icon chip (Visa, Mastercard, Amex, PIX…) or text chip (Elo, unknown); Boleto = barcode + label */
function PaymentChip({ name }: { name: string }) {
  const icon = paymentIcon(name);
  const withLabel = !icon || icon.includes('barcode');
  return (
    <li className={cx('pay-chip', !icon && 'pay-chip--text')} title={name}>
      <span className="sr-only">{name}</span>
      {icon && <i className={icon} aria-hidden="true" />}
      {withLabel && <span aria-hidden="true">{name}</span>}
    </li>
  );
}

export function Footer() {
  const { data, ids } = useAgency();
  const r = data.rodape;
  const ag = data.agencia;
  const c = data.contato;
  const socials = socialsOf(data);
  const quick = footerLinks(r?.links_rapidos, ids);
  const legal = footerLinks(r?.links_legais, ids);
  const pays = arr(r?.formas_pagamento).filter(has).map(txt);
  const seals = arr(r?.selos);
  const addr = data.endereco?.completo;
  const wa = defaultWa(c);
  const about = r?.sobre || ag?.descricao_curta;

  return (
    <footer className="footer" id="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <a className="footer__logo" href={ids.has('hero') ? '#hero' : '#main'}>
            <Logo variant="branco" />
          </a>
          {has(ag?.slogan) && <p className="footer__slogan">{ag?.slogan}</p>}
          {has(about) && <p className="footer__about">{about}</p>}
          {socials.length > 0 && (
            <div className="footer__social">
              <SocialIcons socials={socials} />
            </div>
          )}
        </div>
        {quick.length > 0 && (
          <FooterCol title="Links rápidos">
            <LinkList links={quick} />
          </FooterCol>
        )}
        {legal.length > 0 && (
          <FooterCol title="Institucional">
            <LinkList links={legal} />
          </FooterCol>
        )}
        <FooterCol title="Atendimento">
          <ul className="footer__contact">
            {wa && c?.whatsapp?.exibicao && (
              <li>
                <a href={wa} {...extProps(wa)}>
                  <Icon name="fa-brands fa-whatsapp" />
                  {c.whatsapp.exibicao}
                </a>
              </li>
            )}
            {c?.telefone?.exibicao && (
              <li>
                <a href={safeUrl(c.telefone.link) || '#'}>
                  <Icon name="fa-solid fa-phone" />
                  {c.telefone.exibicao}
                </a>
              </li>
            )}
            {c?.email?.exibicao && (
              <li>
                <a href={safeUrl(c.email.link) || '#'}>
                  <Icon name="fa-regular fa-envelope" />
                  {c.email.exibicao}
                </a>
              </li>
            )}
            {has(addr) && (
              <li>
                <span>
                  <Icon name="fa-solid fa-location-dot" />
                  {addr}
                </span>
              </li>
            )}
            {arr(c?.horario_atendimento).slice(0, 2).map((h, i) => (
              <li key={i}>
                <span>
                  <Icon name="fa-regular fa-clock" />
                  {`${txt(h.dias)}: ${txt(h.horario)}`}
                </span>
              </li>
            ))}
          </ul>
        </FooterCol>
      </div>

      {(pays.length > 0 || seals.length > 0) && (
        <div className="container footer__mid">
          {pays.length > 0 && (
            <div className="footer__pay">
              <h2 className="footer__h footer__h--sm">Formas de pagamento</h2>
              <ul className="pay-list">
                {pays.map((p, i) => <PaymentChip name={p} key={`${p}-${i}`} />)}
              </ul>
            </div>
          )}
          {seals.length > 0 && (
            <div className="footer__seals">
              <h2 className="footer__h footer__h--sm">Segurança e certificações</h2>
              <ul className="seal-list">
                {seals.map((s, i) => (
                  <li className="seal" key={i}>
                    <Icon name={pickIcon(`${txt(s.nome)} ${txt(s.descricao)}`, SEAL_ICONS, 'fa-solid fa-award')} />
                    <span>
                      <strong>{s.nome}</strong>
                      <small>{txt(s.descricao)}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{txt(r?.copyright) || `© ${new Date().getFullYear()} ${txt(ag?.nome)}`}</p>
          <p className="footer__ids">
            {has(ag?.cnpj) && <span>CNPJ {ag?.cnpj}</span>}
            {has(ag?.cadastur) && <span>Cadastur {ag?.cadastur}</span>}
          </p>
          {has(r?.aviso_demo) && (
            <p className="footer__demo">
              <Icon name="fa-solid fa-flask" />
              {r?.aviso_demo}
            </p>
          )}
          <p className="footer__credit">
            Desenvolvido por{' '}
            <a href="https://zapturize.com.br" target="_blank" rel="noopener noreferrer">Zapturize</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
