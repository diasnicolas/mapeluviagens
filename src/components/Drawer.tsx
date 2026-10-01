/* Accessible mobile drawer: slide-in panel, focus trap, Esc/backdrop/link close, focus return */
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useAgency } from '../data/AgencyContext';
import { hours24, socialsOf } from '../lib/contact';
import { cx } from '../lib/cx';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockScroll } from '../hooks/useLockScroll';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import type { NavItem } from './Header';
import { Logo } from './Logo';
import { Icon, SocialIcons } from './ui';

interface Props {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId: string | null;
}

export function Drawer({ open, onClose, items, activeId }: Props) {
  const { data } = useAgency();
  const c = data.contato;
  const wa = defaultWa(c);
  const h24 = hours24(c);
  const socials = socialsOf(data);
  const reduced = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(open); // not [hidden]
  const [slidIn, setSlidIn] = useState(false); // .is-open
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Mount → focus close button → next frame slide in; on close slide out then hide
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    setSlidIn(false);
    const t = window.setTimeout(() => setMounted(false), reduced ? 0 : 280);
    return () => window.clearTimeout(t);
  }, [open, reduced]);

  useLockScroll(open);
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  // Declared before the focus effect so it records the trigger (burger) as the focus-return target
  useFocusTrap(panelRef, open && mounted, onKey);

  useEffect(() => {
    if (!open || !mounted) return;
    closeRef.current?.focus();
    const raf = requestAnimationFrame(() => setSlidIn(true));
    return () => cancelAnimationFrame(raf);
  }, [open, mounted]);

  // Close when the viewport grows past the mobile breakpoint
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth > 1100) onClose();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, onClose]);

  // Any link inside the drawer closes it
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && e.target.closest('a')) onClose();
  };

  return (
    <div className={cx('drawer', slidIn && 'is-open')} id="drawer" hidden={!mounted} onClick={onClick}>
      <div className="drawer__backdrop" onClick={onClose} />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu" ref={panelRef}>
        <div className="drawer__head">
          <div className="drawer__brand">
            <Logo variant="principal" />
          </div>
          <button className="icon-btn drawer__close" type="button" aria-label="Fechar menu" onClick={onClose} ref={closeRef}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Menu móvel">
          <ul className="drawer__list">
            {items.map((m) => {
              const on = activeId != null && m.href === `#${activeId}`;
              return (
                <li key={m.href + m.label}>
                  <a
                    className={cx('drawer__link', on && 'is-active')}
                    href={m.href}
                    aria-current={on ? 'true' : undefined}
                    {...extProps(m.href)}
                  >
                    {m.label}
                    <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="drawer__foot">
          {wa && (
            <a className="btn btn--accent btn--block" href={wa} {...extProps(wa)}>
              <Icon name="fa-brands fa-whatsapp" />
              Fale com um consultor
            </a>
          )}
          {c?.telefone?.exibicao && (
            <a className="btn btn--ghost btn--block" href={safeUrl(c.telefone.link) || '#contato'}>
              <Icon name="fa-solid fa-phone" />
              {c.telefone.exibicao}
            </a>
          )}
          {h24 && (
            <p className="drawer__hours">
              <Icon name="fa-solid fa-headset" />
              {h24.dias}: <strong>{h24.horario}</strong>
            </p>
          )}
          {socials.length > 0 && (
            <div className="drawer__social">
              <SocialIcons socials={socials} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
