/* Depoimentos: marketplace reviews — score card with star distribution + review list with "show more" */
import { useState } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { Depoimento } from '../types/agencia';
import { arr, fmtDateMonth, fmtNum, fmtScore, has, initials, scoreLabel, txt, cssVars } from '../lib/format';
import { cx } from '../lib/cx';
import { pickIcon, SOURCE_ICONS } from '../lib/icons';
import { safeUrl } from '../lib/url';
import { Icon, Img, Reveal, SectionHead, Stars } from './ui';

const INITIAL = 4;

function ReviewItem({ r, index, extra, open }: { r: Depoimento; index: number; extra: boolean; open: boolean }) {
  const foto = safeUrl(r.foto);
  const rating = Number(r.avaliacao);
  return (
    <Reveal as="li" className={cx('review', extra && 'is-extra')} index={index} hidden={extra && !open} force={extra && open}>
      <div className="review__head">
        {foto ? (
          <Img className="review__avatar" src={foto} alt={txt(r.nome)} loading="lazy" width={48} height={48} />
        ) : (
          <span className="review__avatar review__avatar--ph">{initials(r.nome)}</span>
        )}
        <div className="review__who">
          <strong>{r.nome}</strong>
          {has(r.cidade) && (
            <span>
              <Icon name="fa-solid fa-location-dot" />
              {r.cidade}
            </span>
          )}
        </div>
        {rating ? (
          <span className="score score--sm" aria-label={`Nota ${txt(r.avaliacao)}`}>{fmtScore(rating)}</span>
        ) : null}
      </div>
      <div className="review__meta">
        <span className="verified">
          <Icon name="fa-solid fa-circle-check" />
          Viagem verificada
        </span>
        {rating ? <Stars value={rating} /> : null}
      </div>
      <blockquote className="review__text">
        <p>{r.texto}</p>
      </blockquote>
      <div className="review__trip">
        {has(r.viagem) && (
          <span>
            <Icon name="fa-solid fa-plane-departure" />
            {r.viagem}
          </span>
        )}
        {has(r.data) && (
          <time dateTime={txt(r.data)}>
            <Icon name="fa-regular fa-calendar" />
            {fmtDateMonth(r.data)}
          </time>
        )}
      </div>
    </Reveal>
  );
}

export function Testimonials() {
  const { data } = useAgency();
  const s = data.depoimentos;
  const [open, setOpen] = useState(false);
  const items = arr(s?.itens);
  if (!items.length) return null;

  const avg = Number(s?.media_avaliacao) || items.reduce((a, b) => a + (Number(b.avaliacao) || 0), 0) / items.length;
  const total = Number(s?.total_avaliacoes) || items.length;
  const dist = [5, 4, 3, 2, 1].map((st) => {
    const count = items.filter((i) => Math.round(Number(i.avaliacao) || 0) === st).length;
    return { st, pct: Math.round((count / items.length) * 100) };
  });
  const fonteIcon = pickIcon(s?.fonte, SOURCE_ICONS, 'fa-solid fa-circle-check');
  const sorted = [...items].sort((a, b) => txt(b.data).localeCompare(txt(a.data)));
  const hiddenCount = sorted.length - INITIAL;

  return (
    <section id="depoimentos" className="section section--gray" aria-labelledby={has(s?.titulo) ? 'depoimentos-title' : undefined}>
      <div className="container">
        <SectionHead etiqueta={s?.etiqueta} titulo={s?.titulo} subtitulo={s?.subtitulo} id="depoimentos" eyebrowIcon="fa-solid fa-comments" />
        <div className="reviews">
          <Reveal as="aside" className="rating-card" aria-label="Resumo das avaliações">
            <div className="rating-card__top">
              <span className="score score--xl">{fmtScore(avg)}</span>
              <div>
                <strong className="rating-card__label">{scoreLabel(avg)}</strong>
                <Stars value={avg} />
                <span className="rating-card__total">{`${fmtNum(total)} avaliações`}</span>
              </div>
            </div>
            {has(s?.fonte) && (
              <p className="rating-card__source">
                <Icon name={fonteIcon} />
                <span>
                  Fonte: <b>{s?.fonte}</b>
                </span>
              </p>
            )}
            <ul className="dist" aria-label="Distribuição das avaliações">
              {dist.map((x) => (
                <li className="dist__row" key={x.st}>
                  <span className="dist__label">
                    {x.st} <Icon name="fa-solid fa-star" />
                  </span>
                  <span className="dist__bar" role="img" aria-label={`${x.st} estrelas: ${x.pct}%`}>
                    <span style={cssVars({ '--w': `${x.pct}%` })} />
                  </span>
                  <span className="dist__pct">{x.pct}%</span>
                </li>
              ))}
            </ul>
            <p className="rating-card__note">
              <Icon name="fa-solid fa-circle-info" />
              {`Distribuição calculada a partir das ${items.length} avaliações exibidas.`}
            </p>
          </Reveal>
          <div className="reviews__main">
            <ul className="review-list" id="review-list">
              {sorted.map((r, i) => (
                <ReviewItem key={`${txt(r.nome)}-${i}`} r={r} index={i} extra={i >= INITIAL} open={open} />
              ))}
            </ul>
            {hiddenCount > 0 && (
              <div className="reviews__more">
                <button
                  type="button"
                  className="btn btn--outline"
                  id="reviews-more"
                  aria-expanded={open}
                  aria-controls="review-list"
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? 'Ver menos avaliações' : `Ver mais avaliações (${hiddenCount})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
