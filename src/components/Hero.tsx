/* Hero: short image stage + tabbed booking widget + promo banner carousel + trust badges */
import { useAgency } from '../data/AgencyContext';
import type { LinkCta, Maybe } from '../types/agencia';
import { arr, cssVars, has, txt } from '../lib/format';
import { cx } from '../lib/cx';
import { pickIcon, STAT_ICONS } from '../lib/icons';
import { liveHref } from '../lib/sections';
import { extProps, safeUrl } from '../lib/url';
import { BookingWidget } from './BookingWidget';
import { PromoCarousel } from './PromoCarousel';
import { Icon, Img, Reveal } from './ui';

/** Hero button; hidden when its link is missing or points to a section that isn't rendered */
function HeroCta({ cta, className }: { cta: Maybe<LinkCta>; className: string }) {
  const { ids } = useAgency();
  const u = liveHref(cta?.link, ids);
  if (!cta || !has(cta.texto) || !u) return null;
  return (
    <a className={`btn ${className}`} href={u} {...extProps(u)}>
      {has(cta.icone) && <Icon name={cta.icone} />}
      <span>{cta.texto}</span>
    </a>
  );
}

export function Hero() {
  const { data } = useAgency();
  const h = data.hero;
  if (!h) return null;

  const svc = arr(data.servicos?.itens);
  const busca = h.busca?.ativo && arr(h.busca.campos).length ? h.busca : null;
  const slides = arr(h.slides).filter((s) => s.imagem || s.titulo);
  const stats = arr(h.estatisticas);
  const ovRaw = Number(h.overlay_opacidade ?? 0.45);
  const ov = Number.isFinite(ovRaw) ? Math.max(0, Math.min(0.9, ovRaw)) : 0.45;
  const bgImg = safeUrl(h.imagem_fundo);
  const video = safeUrl(h.video_fundo);
  const hasCopy = has(h.titulo) || has(h.subtitulo) || has(h.etiqueta);

  return (
    <section id="hero" className="hero" aria-label="Destaque">
      <div className={cx('hero__stage', busca && 'has-widget')}>
        <div className="hero__media">
          {video ? (
            <video className="hero__video" autoPlay muted loop playsInline poster={bgImg || undefined} aria-hidden="true">
              <source src={video} />
            </video>
          ) : (
            bgImg && <Img className="hero__img" src={bgImg} alt="" fetchPriority="high" />
          )}
        </div>
        <div className="hero__overlay" style={cssVars({ '--ov': ov })} />
        {hasCopy && (
          <div className="container hero__inner">
            <div className="hero__copy">
              {has(h.etiqueta) && <span className="hero__tag">{h.etiqueta}</span>}
              <h1 className="hero__title">
                {txt(h.titulo || data.agencia?.nome)}
                {has(h.titulo_destaque) && (
                  <>
                    {' '}
                    <span className="hero__hl">{h.titulo_destaque}</span>
                  </>
                )}
              </h1>
              {has(h.subtitulo) && <p className="hero__sub">{h.subtitulo}</p>}
              <div className="hero__ctas">
                <HeroCta cta={h.cta_primario} className="btn--accent btn--lg" />
                <HeroCta cta={h.cta_secundario} className="btn--glass btn--lg" />
              </div>
            </div>
          </div>
        )}
      </div>

      {busca && (
        <div className="container hero__widget">
          <BookingWidget svc={svc} busca={busca} />
        </div>
      )}

      {(slides.length > 0 || stats.length > 0) && (
        <div className="container hero__below">
          {slides.length > 0 && <PromoCarousel slides={slides} />}
          {stats.length > 0 && (
            <Reveal as="ul" className="trust-badges" index={slides.length > 0 ? 1 : 0}>
              {stats.map((s, i) => (
                <li className="trust-badge" key={i}>
                  <span className="trust-badge__icon">
                    <Icon name={pickIcon(`${txt(s.rotulo)} ${txt(s.valor)}`, STAT_ICONS, 'fa-solid fa-circle-check')} />
                  </span>
                  <span className="trust-badge__text">
                    <strong>{txt(s.valor)}</strong>
                    <span>{s.rotulo}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          )}
        </div>
      )}
    </section>
  );
}
