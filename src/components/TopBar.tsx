/* Top bar: 24h support, phone, WhatsApp, e-mail and social icons */
import type { ReactNode } from 'react';
import { useAgency } from '../data/AgencyContext';
import { hours24, socialsOf } from '../lib/contact';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { Icon, SocialIcons } from './ui';

export function TopBar() {
  const { data } = useAgency();
  const c = data.contato;
  const socials = socialsOf(data);
  const h24 = hours24(c);
  const wa = defaultWa(c);

  const items: ReactNode[] = [];
  if (h24) {
    items.push(
      <span key="hours" className="topbar__item topbar__item--hours">
        <Icon name="fa-solid fa-headset" />
        <strong>{h24.horario}</strong>
        <span className="topbar__muted">{h24.dias}</span>
      </span>,
    );
  }
  if (c?.telefone?.exibicao) {
    items.push(
      <a key="tel" className="topbar__item topbar__hide-sm" href={safeUrl(c.telefone.link) || '#contato'}>
        <Icon name="fa-solid fa-phone" />
        {c.telefone.exibicao}
      </a>,
    );
  }
  if (c?.whatsapp?.exibicao) {
    items.push(
      <a key="wa" className="topbar__item topbar__hide-sm" href={wa || '#contato'} {...extProps(wa)}>
        <Icon name="fa-brands fa-whatsapp" />
        {c.whatsapp.exibicao}
      </a>,
    );
  }
  if (c?.email?.exibicao) {
    items.push(
      <a key="mail" className="topbar__item topbar__hide-md" href={safeUrl(c.email.link) || '#contato'}>
        <Icon name="fa-regular fa-envelope" />
        {c.email.exibicao}
      </a>,
    );
  }

  if (!items.length && !socials.length) return null;
  return (
    <div className="topbar" id="topbar">
      <div className="container topbar__inner">
        <div className="topbar__left">{items}</div>
        {socials.length > 0 && (
          <div className="topbar__social" aria-label="Redes sociais">
            <SocialIcons socials={socials} />
          </div>
        )}
      </div>
    </div>
  );
}
