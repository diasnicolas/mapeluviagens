/* Promo banner carousel: CSS scroll-snap track, dots, prev/next, pausable auto-rotation */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { HeroSlide } from '../types/agencia';
import { cx } from '../lib/cx';
import { has, txt } from '../lib/format';
import { extProps, safeUrl } from '../lib/url';
import { waLink } from '../lib/whatsapp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Icon, Img, Reveal } from './ui';

const AUTOPLAY_MS = 5500;

export function PromoCarousel({ slides }: { slides: HeroSlide[] }) {
  const { data, ids } = useAgency();
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [current, setCurrent] = useState(0);
  const [userPaused, setUserPaused] = useState(reduced);
  const [hoverPause, setHoverPause] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const slideEls = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const readCurrent = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return Math.round(track.scrollLeft / ((first.offsetWidth || 1) + gap));
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const perView = Math.max(1, Math.round(track.clientWidth / (first.getBoundingClientRect().width || 1)));
    setPages(Math.max(1, slides.length - perView + 1));
    setCurrent(readCurrent());
  }, [slides.length, readCurrent]);

  const goTo = (i: number) => {
    const els = slideEls();
    const n = pages;
    const idx = ((i % n) + n) % n;
    const target = els[idx];
    if (target && els[0]) {
      trackRef.current?.scrollTo({ left: target.offsetLeft - els[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    }
  };
  const nav = (i: number) => {
    goTo(i);
    setRestartKey((k) => k + 1);
  };

  // Measure on mount and (debounced) on resize
  useLayoutEffect(() => {
    measure();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(measure, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
    };
  }, [measure]);

  // Active dot follows the scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCurrent(readCurrent()));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [readCurrent]);

  // Auto-rotation (paused by the user, hover/focus/touch, or when everything fits)
  useEffect(() => {
    if (userPaused || hoverPause || pages < 2) return;
    const t = window.setInterval(() => {
      const c = readCurrent();
      goTo(c + 1 >= pages ? 0 : c + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
    // goTo only reads refs and `pages` (already a dependency); restartKey resets the timer after manual navigation
  }, [userPaused, hoverPause, pages, restartKey, readCurrent]);

  const contactAnchor = ids.has('contato') ? '#contato' : '';
  const pause = () => setHoverPause(true);
  const resume = () => setHoverPause(false);

  return (
    <Reveal
      className="promos"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Promoções em destaque"
      onMouseEnter={pause}
      onFocus={pause}
      onTouchStart={pause}
      onMouseLeave={resume}
      onBlur={resume}
    >
      <div className="promos__track" id="promos-track" ref={trackRef}>
        {slides.map((s, i) => {
          const img = safeUrl(s.imagem);
          // Promo CTA → WhatsApp with the promo name (fallback: contact section)
          const msg = has(s.titulo)
            ? `Olá! Vi a promoção "${txt(s.titulo)}" no site e gostaria de mais detalhes.`
            : 'Olá! Vi as promoções no site e gostaria de mais detalhes.';
          const href = waLink(data.contato, msg) || contactAnchor;
          return (
            <article className="promo" key={i} aria-roledescription="slide" aria-label={`${i + 1} de ${slides.length}`}>
              {img && <Img className="promo__img" src={img} alt="" loading={i > 0 ? 'lazy' : undefined} />}
              <div className="promo__body">
                <h3 className="promo__title">{s.titulo}</h3>
                {has(s.subtitulo) && <p className="promo__sub">{s.subtitulo}</p>}
                {href && (
                  <a className="promo__link" href={href} {...extProps(href)}>
                    Consultar ofertas <Icon name="fa-solid fa-arrow-right" />
                    <span className="sr-only">: {s.titulo}</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="promos__controls" id="promos-controls" hidden={pages < 2}>
        <button className="icon-btn icon-btn--sm" type="button" aria-label="Anterior" onClick={() => nav(readCurrent() - 1)}>
          <Icon name="fa-solid fa-chevron-left" />
        </button>
        <div className="promos__dots">
          {pages > 1 &&
            Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={cx('promos__dot', i === current && 'is-active')}
                aria-label={`Ir para promoção ${i + 1}`}
                aria-current={i === current ? 'true' : 'false'}
                onClick={() => nav(i)}
              />
            ))}
        </div>
        <button
          className="icon-btn icon-btn--sm"
          type="button"
          aria-label={userPaused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
          aria-pressed={userPaused}
          onClick={() => {
            setUserPaused((p) => !p);
            setRestartKey((k) => k + 1);
          }}
        >
          <Icon name={userPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause'} />
        </button>
        <button className="icon-btn icon-btn--sm" type="button" aria-label="Próximo" onClick={() => nav(readCurrent() + 1)}>
          <Icon name="fa-solid fa-chevron-right" />
        </button>
      </div>
    </Reveal>
  );
}
