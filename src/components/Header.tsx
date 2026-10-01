/* Sticky brand header: logo, main nav with active highlight, consultant CTA, burger → drawer */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAgency } from '../data/AgencyContext';
import { cx } from '../lib/cx';
import { extProps } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { useScrolledPast } from '../hooks/useScrolledPast';
import { Drawer } from './Drawer';
import { Logo } from './Logo';
import { Icon } from './ui';

export interface NavItem {
  label: string;
  href: string;
}

export function Header({ items, activeId }: { items: NavItem[]; activeId: string | null }) {
  const { data, ids } = useAgency();
  const ag = data.agencia;
  const wa = defaultWa(data.contato);
  const scrolled = useScrolledPast(40);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // Keep --header-h in sync (scroll offset + sticky elements)
  useEffect(() => {
    const update = () => {
      const h = headerRef.current?.offsetHeight || 72;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <header className={cx('site-header', scrolled && 'is-scrolled')} id="site-header" ref={headerRef}>
        <div className="container site-header__inner">
          <a
            className="brand"
            id="brand"
            href={ids.has('hero') ? '#hero' : '#main'}
            aria-label={`${ag?.nome || ag?.nome_curto || 'Início'} — página inicial`}
          >
            <Logo variant="principal" />
          </a>
          <nav className="nav" aria-label="Menu principal">
            <ul className="nav__list">
              {items.map((m) => {
                const on = activeId != null && m.href === `#${activeId}`;
                return (
                  <li key={m.href + m.label}>
                    <a
                      className={cx('nav__link', on && 'is-active')}
                      href={m.href}
                      aria-current={on ? 'true' : undefined}
                      {...extProps(m.href)}
                    >
                      {m.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="site-header__actions">
            {wa && (
              <a className="btn btn--accent btn--header" href={wa} {...extProps(wa)}>
                <Icon name="fa-brands fa-whatsapp" />
                <span>Fale com um consultor</span>
              </a>
            )}
          </div>
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="drawer"
            hidden={!items.length}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <Drawer open={open} onClose={close} items={items} activeId={activeId} />
    </>
  );
}
