/* Galeria: category tabs with counts + mosaic grid (big/wide rhythm) + lightbox */
import { useCallback, useMemo, useState } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { Foto } from '../types/agencia';
import { arr, has, txt } from '../lib/format';
import { cx } from '../lib/cx';
import { galleryPhotos } from '../lib/sections';
import { safeUrl } from '../lib/url';
import { Lightbox } from './Lightbox';
import { Icon, Img, Reveal, SectionHead } from './ui';

const norm = (t: unknown) => txt(t).trim().toLowerCase();

export function Gallery() {
  const { data } = useAgency();
  const s = data.galeria;
  const fotos = useMemo(() => galleryPhotos(data), [data]);
  const [cat, setCat] = useState(''); // normalised category, '' = all
  const [filtered, setFiltered] = useState(false);
  const [viewer, setViewer] = useState<{ list: number[]; start: number } | null>(null);
  const closeViewer = useCallback(() => setViewer(null), []);
  if (!fotos.length) return null;

  // Categories: JSON order ("Todos" label reused), plus any category only found on photos
  let cats = arr(s?.categorias).filter(has).map(txt);
  const allLabel = cats.find((c) => norm(c) === 'todos') || 'Todos';
  cats = cats.filter((c) => norm(c) !== 'todos');
  fotos.forEach((f) => {
    if (has(f.categoria) && !cats.some((c) => norm(c) === norm(f.categoria))) cats.push(txt(f.categoria));
  });
  const count = (c: string) => fotos.filter((f) => norm(f.categoria) === norm(c)).length;
  const isVisible = (f: Foto) => !cat || norm(f.categoria) === cat;

  // Mosaic rhythm over visible items: 1st of every 7 big, 5th wide
  let v = 0;
  const layout = fotos.map((f) => {
    if (!isVisible(f)) return '';
    const mod = v++ % 7;
    return mod === 0 ? 'is-big' : mod === 4 ? 'is-wide' : '';
  });

  const pick = (c: string) => {
    setCat(norm(c));
    setFiltered(true);
  };
  const open = (index: number) => {
    const list = fotos.flatMap((f, i) => (isVisible(f) ? [i] : []));
    setViewer({ list, start: Math.max(0, list.indexOf(index)) });
  };

  return (
    <section id="galeria" className="section section--white" aria-labelledby={has(s?.titulo) ? 'galeria-title' : undefined}>
      <div className="container">
        <SectionHead etiqueta={s?.etiqueta} titulo={s?.titulo} subtitulo={s?.subtitulo} id="galeria" eyebrowIcon="fa-solid fa-camera-retro" />
        {cats.length > 0 && (
          <Reveal className="gal-tabs" role="group" aria-label="Filtrar fotos por categoria">
            <button type="button" className={cx('gal-tab', !cat && 'is-active')} aria-pressed={!cat} onClick={() => pick('')}>
              {allLabel}
              <span>{fotos.length}</span>
            </button>
            {cats.filter((c) => count(c)).map((c) => {
              const on = cat === norm(c);
              return (
                <button type="button" key={c} className={cx('gal-tab', on && 'is-active')} aria-pressed={on} onClick={() => pick(c)}>
                  {c}
                  <span>{count(c)}</span>
                </button>
              );
            })}
          </Reveal>
        )}
        <ul className="gal-grid" id="gal-grid">
          {fotos.map((f, i) => (
            <Reveal
              as="li"
              key={i}
              className={cx('gal-item', layout[i])}
              index={i}
              hidden={!isVisible(f)}
              force={filtered}
            >
              <button
                type="button"
                className="gal-item__btn"
                aria-label={`Ampliar foto: ${txt(f.titulo || f.alt)}`}
                onClick={() => open(i)}
              >
                <Img src={safeUrl(f.miniatura || f.url)} alt={txt(f.alt || f.titulo)} loading="lazy" />
                <span className="gal-item__cap">
                  {has(f.categoria) && <small>{f.categoria}</small>}
                  <strong>{f.titulo}</strong>
                  {has(f.local) && (
                    <span>
                      <Icon name="fa-solid fa-location-dot" />
                      {f.local}
                    </span>
                  )}
                </span>
                <span className="gal-item__zoom">
                  <Icon name="fa-solid fa-expand" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
      {viewer && <Lightbox photos={fotos} list={viewer.list} start={viewer.start} onClose={closeViewer} />}
    </section>
  );
}
