/* Shared UI atoms: Icon, Stars, Reveal, Img, SectionHead, SocialIcons */
import { createElement, useState, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from 'react';
import type { Maybe, RedeSocial } from '../types/agencia';
import { cx } from '../lib/cx';
import { cssVars, fmtNum, has, txt } from '../lib/format';
import { safeUrl } from '../lib/url';
import { useReveal } from '../hooks/useReveal';

/* ---------- Font Awesome icon ---------- */
export function Icon({ name, fallback = 'fa-solid fa-circle-check', className }: {
  name?: Maybe<string>;
  fallback?: string;
  className?: string;
}) {
  const cls = has(name) ? String(name) : fallback;
  return <i className={cx(cls, className)} aria-hidden="true" />;
}

/* ---------- Star rating ---------- */
export function Stars({ value, max = 5 }: { value: unknown; max?: number }) {
  const n = Math.max(0, Math.min(max, Number(value) || 0));
  return (
    <span className="stars" role="img" aria-label={`${fmtNum(n, { maximumFractionDigits: 1 })} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, k) => {
        const i = k + 1;
        const cls = n >= i ? 'fa-solid fa-star' : n >= i - 0.5 ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star';
        return <i key={i} className={cls} aria-hidden="true" />;
      })}
    </span>
  );
}

/* ---------- Scroll reveal wrapper ---------- */
type RevealTag = 'div' | 'ul' | 'li' | 'aside' | 'article' | 'p' | 'h3';

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** position among revealing siblings → stagger delay */
  index?: number;
  force?: boolean;
  children?: ReactNode;
}

export function Reveal({ as = 'div', index = 0, force = false, className, style, children, ...rest }: RevealProps) {
  const [ref, shown] = useReveal<HTMLElement>(force);
  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cx(className, 'reveal', shown && 'is-in'),
      style: { ...cssVars({ '--d': `${Math.min(index, 6) * 70}ms` }), ...style },
    },
    children,
  );
}

/* ---------- Image with graceful failure ---------- */
export function Img({ className, onError, alt = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...rest}
      alt={alt}
      className={cx(className, failed && 'img-failed') || undefined}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}

/* ---------- Section heading (eyebrow + title + subtitle) ---------- */
export function SectionHead({ etiqueta, titulo, subtitulo, id, eyebrowIcon }: {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  id: string;
  eyebrowIcon?: string;
}) {
  return (
    <div className="sec-head">
      <Reveal className="sec-head__text">
        {has(etiqueta) && (
          <span className="eyebrow">
            {eyebrowIcon && <Icon name={eyebrowIcon} />}
            {etiqueta}
          </span>
        )}
        {has(titulo) && <h2 className="sec-title" id={`${id}-title`}>{titulo}</h2>}
        {has(subtitulo) && <p className="sec-sub">{subtitulo}</p>}
      </Reveal>
    </div>
  );
}

/* ---------- Social icon links ---------- */
export function SocialIcons({ socials }: { socials: RedeSocial[] }) {
  return (
    <>
      {socials.map((s, i) => (
        <a key={`${s.url}-${i}`} href={safeUrl(s.url)} target="_blank" rel="noopener" aria-label={txt(s.nome) || 'Rede social'}>
          <Icon name={s.icone} fallback="fa-solid fa-link" />
        </a>
      ))}
    </>
  );
}
