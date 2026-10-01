/* Contato: help-center layout — channel cards, hours/address/socials, quote form, map */
import type { ReactNode } from 'react';
import { useAgency } from '../data/AgencyContext';
import { fullAddress, socialsOf } from '../lib/contact';
import { cx } from '../lib/cx';
import { arr, has, txt } from '../lib/format';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { ContactForm } from './ContactForm';
import { Icon, Reveal, SectionHead } from './ui';

export function Contact() {
  const { data } = useAgency();
  const c = data.contato;
  if (!c) return null;

  const endereco = data.endereco;
  const socials = socialsOf(data);
  const hours = arr(c.horario_atendimento);
  const depts = arr(c.emails_departamentos).filter((x) => has(x.email));
  const form = c.formulario;
  const campos = arr(form?.campos);
  const wa = defaultWa(c);
  const addr = fullAddress(endereco);
  const mapLink =
    safeUrl(c.mapa?.link) || (addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}` : '');
  const mapEmbed = safeUrl(c.mapa?.embed_url);
  const agencyName = data.agencia?.nome;

  /* Channel cards */
  const channels: Array<{ key: string; className?: string; body: ReactNode }> = [];
  if (wa) {
    channels.push({
      key: 'wa',
      className: 'channel--wa',
      body: (
        <>
          <span className="channel__icon"><Icon name="fa-brands fa-whatsapp" /></span>
          <h3>WhatsApp</h3>
          <p>{txt(c.whatsapp?.exibicao)}</p>
          <a className="channel__cta" href={wa} {...extProps(wa)}>
            Iniciar conversa <Icon name="fa-solid fa-arrow-right" />
          </a>
        </>
      ),
    });
  }
  if (c.telefone?.exibicao) {
    channels.push({
      key: 'tel',
      body: (
        <>
          <span className="channel__icon"><Icon name="fa-solid fa-phone" /></span>
          <h3>Telefone</h3>
          <p>{c.telefone.exibicao}</p>
          <a className="channel__cta" href={safeUrl(c.telefone.link) || '#'}>
            Ligar agora <Icon name="fa-solid fa-arrow-right" />
          </a>
        </>
      ),
    });
  }
  if (c.email?.exibicao) {
    channels.push({
      key: 'mail',
      body: (
        <>
          <span className="channel__icon"><Icon name="fa-regular fa-envelope" /></span>
          <h3>E-mail</h3>
          <p className="channel__break">{c.email.exibicao}</p>
          <a className="channel__cta" href={safeUrl(c.email.link) || '#'}>
            Enviar e-mail <Icon name="fa-solid fa-arrow-right" />
          </a>
        </>
      ),
    });
  }
  if (depts.length) {
    channels.push({
      key: 'depts',
      className: 'channel--depts',
      body: (
        <>
          <span className="channel__icon"><Icon name="fa-solid fa-sitemap" /></span>
          <h3>Departamentos</h3>
          <ul className="depts">
            {depts.map((x, i) => (
              <li key={i}>
                <span>{x.setor}</span>
                <a href={safeUrl(`mailto:${txt(x.email).trim()}`)}>{x.email}</a>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /* Side info cards */
  const infoCards: Array<{ key: string; body: ReactNode }> = [];
  if (hours.length) {
    infoCards.push({
      key: 'hours',
      body: (
        <>
          <h3><Icon name="fa-regular fa-clock" />Horário de atendimento</h3>
          <ul className="hours">
            {hours.map((h, i) => {
              const closed = /fechado/i.test(txt(h.horario));
              const allDay = /24\s*h|24 horas/i.test(txt(h.horario));
              return (
                <li key={i} className={cx(closed && 'is-closed', allDay && 'is-24') || undefined}>
                  <span>{h.dias}</span>
                  <b>
                    {allDay && <Icon name="fa-solid fa-circle" />}
                    {h.horario}
                  </b>
                </li>
              );
            })}
          </ul>
        </>
      ),
    });
  }
  if (addr) {
    infoCards.push({
      key: 'addr',
      body: (
        <>
          <h3><Icon name="fa-solid fa-location-dot" />Endereço</h3>
          <address className="addr">{addr}</address>
          {has(endereco?.referencia) && (
            <p className="addr__ref">
              <Icon name="fa-solid fa-signs-post" />
              {endereco?.referencia}
            </p>
          )}
          {mapLink && (
            <a className="link-arrow" href={mapLink} target="_blank" rel="noopener">
              Abrir no Google Maps <Icon name="fa-solid fa-arrow-up-right-from-square" />
            </a>
          )}
        </>
      ),
    });
  }
  if (socials.length) {
    infoCards.push({
      key: 'social',
      body: (
        <>
          <h3><Icon name="fa-solid fa-share-nodes" />Redes sociais</h3>
          <ul className="social-list">
            {socials.map((s, i) => (
              <li key={i}>
                <a href={safeUrl(s.url)} target="_blank" rel="noopener">
                  <span className="social-list__icon"><Icon name={s.icone} fallback="fa-solid fa-link" /></span>
                  <span className="social-list__name">
                    <strong>{s.nome}</strong>
                    <small>{txt(s.usuario)}</small>
                  </span>
                  {has(s.seguidores) && (
                    <span className="social-list__count">
                      {txt(s.seguidores)}
                      <small>seguidores</small>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  return (
    <section id="contato" className="section section--gray" aria-labelledby={has(c.titulo) ? 'contato-title' : undefined}>
      <div className="container">
        <SectionHead etiqueta={c.etiqueta} titulo={c.titulo} subtitulo={c.subtitulo} id="contato" eyebrowIcon="fa-solid fa-headset" />
        {channels.length > 0 && (
          <ul className="channels">
            {channels.map((ch, i) => (
              <Reveal as="li" key={ch.key} className={cx('channel', ch.className)} index={i}>
                {ch.body}
              </Reveal>
            ))}
          </ul>
        )}
        <div className={cx('contact-layout', !campos.length && 'contact-layout--noform')}>
          <div className="contact-side">
            {infoCards.map((card, i) => (
              <Reveal key={card.key} className="info-card" index={i}>
                {card.body}
              </Reveal>
            ))}
          </div>
          {form && campos.length > 0 && (
            <Reveal className="form-card">
              <div className="form-card__head">
                <span className="form-card__icon"><Icon name="fa-solid fa-file-pen" /></span>
                <div>
                  <h3>{txt(form.titulo)}</h3>
                  <p>
                    <span className="req">*</span> Campos obrigatórios
                  </p>
                </div>
              </div>
              <ContactForm form={form} campos={campos} />
            </Reveal>
          )}
        </div>
        {mapEmbed && (
          <Reveal className="map-card">
            <iframe
              src={mapEmbed}
              title={`Mapa de localização${has(agencyName) ? ` — ${agencyName}` : ''}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {mapLink && (
              <a className="btn btn--primary map-card__btn" href={mapLink} target="_blank" rel="noopener">
                <Icon name="fa-solid fa-map-location-dot" />
                Abrir no Google Maps
              </a>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
