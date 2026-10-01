/* Diferenciais: trust strip (seals + Cadastur) + image with review score card + "why" grid */
import { useAgency } from '../data/AgencyContext';
import { arr, fmtNum, fmtScore, has, scoreLabel, txt } from '../lib/format';
import { cx } from '../lib/cx';
import { pickIcon, SEAL_ICONS } from '../lib/icons';
import { safeUrl } from '../lib/url';
import { Icon, Img, Reveal, SectionHead, Stars } from './ui';

export function Differentials() {
  const { data } = useAgency();
  const s = data.diferenciais;
  const items = arr(s?.itens);
  if (!s || (!items.length && !has(s.titulo))) return null;

  const seals = arr(data.rodape?.selos);
  const dep = data.depoimentos;
  const img = safeUrl(s.imagem);
  const cad = data.agencia?.cadastur;
  const cadSeal = has(cad) ? seals.find((x) => /cadastur/i.test(txt(x.nome))) : undefined;
  const avg = Number(dep?.media_avaliacao);

  return (
    <section id="diferenciais" className="section section--gray" aria-labelledby={has(s.titulo) ? 'diferenciais-title' : undefined}>
      <div className="container">
        {(seals.length > 0 || has(cad)) && (
          <Reveal as="ul" className="trust-strip">
            {seals.map((x, i) => (
              <li key={i}>
                <span className="trust-strip__icon">
                  <Icon name={pickIcon(`${txt(x.nome)} ${txt(x.descricao)}`, SEAL_ICONS, 'fa-solid fa-award')} />
                </span>
                <span>
                  <strong>{x.nome}</strong>
                  {has(x.descricao) && <small>{x.descricao}</small>}
                  {x === cadSeal && <small className="trust-strip__id">Nº {cad}</small>}
                </span>
              </li>
            ))}
            {has(cad) && !cadSeal && (
              <li>
                <span className="trust-strip__icon">
                  <Icon name="fa-solid fa-id-card" />
                </span>
                <span>
                  <strong>Cadastur</strong>
                  <small className="trust-strip__id">Nº {cad}</small>
                </span>
              </li>
            )}
          </Reveal>
        )}
        <div className={cx('why', !img && 'why--noimg')}>
          {img && (
            <Reveal className="why__media">
              <Img src={img} alt={txt(s.titulo)} loading="lazy" />
              {avg > 0 && (
                <div className="why__float">
                  <span className="score score--lg">{fmtScore(avg)}</span>
                  <span className="why__float-text">
                    <strong>{scoreLabel(avg)}</strong>
                    <Stars value={avg} />
                    {Number(dep?.total_avaliacoes) > 0 && (
                      <small>
                        {`${fmtNum(Number(dep?.total_avaliacoes))} avaliações${has(dep?.fonte) ? ` · ${dep?.fonte}` : ''}`}
                      </small>
                    )}
                  </span>
                </div>
              )}
            </Reveal>
          )}
          <div className="why__content">
            <SectionHead etiqueta={s.etiqueta} titulo={s.titulo} subtitulo={s.subtitulo} id="diferenciais" eyebrowIcon="fa-solid fa-thumbs-up" />
            <ul className="why__grid">
              {items.map((it, i) => (
                <Reveal as="li" className="why-item" index={i} key={i}>
                  <span className="why-item__icon">
                    <Icon name={it.icone} />
                  </span>
                  <div>
                    <h3>{it.titulo}</h3>
                    {has(it.descricao) && <p>{it.descricao}</p>}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
