/* Sobre: compact institutional block — images + XP badge, "read more", MVV, count-up numbers, team */
import { useState, type ReactNode } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { Numero } from '../types/agencia';
import { arr, fmtNum, has, txt } from '../lib/format';
import { cx } from '../lib/cx';
import { extProps, safeUrl } from '../lib/url';
import { useCountUp } from '../hooks/useCountUp';
import { Icon, Img, Reveal, SectionHead } from './ui';

function NumberItem({ n }: { n: Numero }) {
  const [ref, value] = useCountUp<HTMLSpanElement>(Number(n.valor) || 0);
  return (
    <li className="numbers__item">
      <strong className="numbers__value">
        <span ref={ref}>{fmtNum(value)}</span>
        {txt(n.sufixo)}
      </strong>
      <span className="numbers__label">{n.rotulo}</span>
    </li>
  );
}

export function About() {
  const { data } = useAgency();
  const s = data.sobre;
  const [expanded, setExpanded] = useState(false);
  const paras = arr(s?.paragrafos);
  if (!s || (!has(s.titulo) && !paras.length)) return null;

  const img1 = safeUrl(s.imagem_principal);
  const img2 = safeUrl(s.imagem_secundaria);
  const nums = arr(s.numeros);
  const team = arr(s.equipe);
  const valores = arr(s.valores);
  const ctaLink = safeUrl(s.cta?.link);

  const mvv: ReactNode[] = [];
  if (has(s.missao)) {
    mvv.push(
      <div className="mvv__item" key="missao">
        <span className="mvv__icon"><Icon name="fa-solid fa-bullseye" /></span>
        <div><h3>Missão</h3><p>{s.missao}</p></div>
      </div>,
    );
  }
  if (has(s.visao)) {
    mvv.push(
      <div className="mvv__item" key="visao">
        <span className="mvv__icon"><Icon name="fa-solid fa-eye" /></span>
        <div><h3>Visão</h3><p>{s.visao}</p></div>
      </div>,
    );
  }
  if (valores.length) {
    mvv.push(
      <div className="mvv__item mvv__item--wide" key="valores">
        <span className="mvv__icon"><Icon name="fa-solid fa-gem" /></span>
        <div>
          <h3>Valores</h3>
          <ul className="chips">
            {valores.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
        </div>
      </div>,
    );
  }

  return (
    <section id="sobre" className="section section--white" aria-labelledby={has(s.titulo) ? 'sobre-title' : undefined}>
      <div className="container">
        <div className="about">
          {(img1 || img2) && (
            <Reveal className="about__media">
              {img1 && <Img className="about__img1" src={img1} alt={txt(s.titulo || data.agencia?.nome)} loading="lazy" />}
              {img2 && <Img className="about__img2" src={img2} alt={txt(s.subtitulo)} loading="lazy" />}
              {has(s.selo_experiencia?.valor) && (
                <div className="xp-badge">
                  <strong>{txt(s.selo_experiencia?.valor)}</strong>
                  <span>{s.selo_experiencia?.rotulo}</span>
                </div>
              )}
            </Reveal>
          )}
          <div className="about__content">
            <SectionHead etiqueta={s.etiqueta} titulo={s.titulo} subtitulo={s.subtitulo} id="sobre" eyebrowIcon="fa-solid fa-building" />
            <Reveal className={cx('about__text', expanded && 'is-open')} id="about-text">
              {paras.map((p, i) => (
                <p key={i} className={i > 1 ? 'about__more' : undefined}>{p}</p>
              ))}
            </Reveal>
            <Reveal className="about__actions" index={1}>
              {paras.length > 2 && (
                <button
                  type="button"
                  className="link-btn"
                  id="about-toggle"
                  aria-expanded={expanded}
                  aria-controls="about-text"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? 'Ler menos' : 'Ler mais'}{' '}
                  <Icon name={expanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'} />
                </button>
              )}
              {ctaLink && has(s.cta?.texto) && (
                <a className="btn btn--primary" href={ctaLink} {...extProps(ctaLink)}>
                  {s.cta?.texto}
                  <Icon name="fa-solid fa-arrow-right" />
                </a>
              )}
            </Reveal>
            {mvv.length > 0 && <Reveal className="mvv" index={2}>{mvv}</Reveal>}
          </div>
        </div>

        {nums.length > 0 && (
          <Reveal as="ul" className="numbers">
            {nums.map((n, i) => <NumberItem n={n} key={i} />)}
          </Reveal>
        )}

        {team.length > 0 && (
          <div className="team">
            <Reveal as="h3" className="team__title">
              <Icon name="fa-solid fa-user-group" />
              Nossos especialistas
            </Reveal>
            <ul className="team__list">
              {team.map((m, i) => {
                const foto = safeUrl(m.foto);
                return (
                  <Reveal as="li" className="member" index={i} key={i}>
                    {foto ? (
                      <Img src={foto} alt={txt(m.nome)} loading="lazy" width={64} height={64} />
                    ) : (
                      <span className="member__ph"><Icon name="fa-solid fa-user" /></span>
                    )}
                    <div>
                      <strong>{m.nome}</strong>
                      {has(m.cargo) && <span className="member__role">{m.cargo}</span>}
                      {has(m.especialidade) && (
                        <span className="member__spec">
                          <Icon name="fa-solid fa-map-pin" />
                          {m.especialidade}
                        </span>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
