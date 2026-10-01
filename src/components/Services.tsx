/* Serviços: category tiles with hover benefit overlay + complementary services chips */
import { useAgency } from '../data/AgencyContext';
import type { Servico } from '../types/agencia';
import { arr, has, txt } from '../lib/format';
import { extProps, safeUrl } from '../lib/url';
import { Icon, Img, Reveal, SectionHead } from './ui';

function ServiceCard({ it, index }: { it: Servico; index: number }) {
  const img = safeUrl(it.imagem);
  const link = safeUrl(it.cta?.link);
  const bens = arr(it.beneficios);
  return (
    <Reveal as="article" className="svc" index={index} id={has(it.id) ? `svc-${it.id}` : undefined}>
      <div className="svc__media">
        {img && <Img src={img} alt={txt(it.titulo)} loading="lazy" />}
        <span className="svc__icon">
          <Icon name={it.icone} fallback="fa-solid fa-suitcase-rolling" />
        </span>
        <h3 className="svc__title">{it.titulo}</h3>
      </div>
      <div className="svc__body">
        {has(it.descricao) && <p className="svc__desc">{it.descricao}</p>}
        {bens.length > 0 && (
          <div className="svc__benefits">
            <ul>
              {bens.map((b, k) => (
                <li key={k}>
                  <Icon name="fa-solid fa-circle-check" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
        {link && has(it.cta?.texto) && (
          <a className="svc__cta" href={link} {...extProps(link)}>
            {it.cta?.texto}
            <Icon name="fa-solid fa-arrow-right" />
          </a>
        )}
      </div>
    </Reveal>
  );
}

export function Services() {
  const { data } = useAgency();
  const s = data.servicos;
  const items = arr(s?.itens);
  const extra = arr(s?.servicos_complementares);
  if (!items.length && !extra.length) return null;

  return (
    <section id="servicos" className="section section--white" aria-labelledby={has(s?.titulo) ? 'servicos-title' : undefined}>
      <div className="container">
        <SectionHead etiqueta={s?.etiqueta} titulo={s?.titulo} subtitulo={s?.subtitulo} id="servicos" eyebrowIcon="fa-solid fa-compass" />
        {items.length > 0 && (
          <div className="svc-grid">
            {items.map((it, i) => (
              <ServiceCard key={it.id ?? i} it={it} index={i} />
            ))}
          </div>
        )}
        {extra.length > 0 && (
          <Reveal className="svc-extra">
            <p className="svc-extra__label">
              <Icon name="fa-solid fa-plus" />
              Também oferecemos
            </p>
            <ul className="svc-extra__list">
              {extra.map((x, i) => (
                <li key={i}>
                  <span className="svc-extra__icon">
                    <Icon name={x.icone} />
                  </span>
                  {x.titulo}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
