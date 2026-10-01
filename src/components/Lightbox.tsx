/* Lightbox dialog: prev/next, captions, Esc/arrow keys, swipe, focus trap + return, click outside closes */
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Foto } from '../types/agencia';
import { cx } from '../lib/cx';
import { has, txt } from '../lib/format';
import { safeUrl } from '../lib/url';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockScroll } from '../hooks/useLockScroll';
import { Icon } from './ui';

interface Props {
  photos: Foto[];
  /** indices (into photos) of the currently filtered set */
  list: number[];
  start: number;
  onClose: () => void;
}

export function Lightbox({ photos, list, start, onClose }: Props) {
  const [pos, setPos] = useState(start);
  const [visible, setVisible] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = list.length;

  const step = useCallback((n: number) => setPos((p) => (p + n + total) % total), [total]);
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    },
    [onClose, step],
  );

  useLockScroll(true);
  // Before the focus effect: records the gallery button as focus-return target
  useFocusTrap(rootRef, true, onKey);

  useEffect(() => {
    closeRef.current?.focus();
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const f = photos[list[pos]];
  if (!f) return null;
  const src = safeUrl(f.url || f.miniatura);

  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && !e.target.closest('button, .lightbox__img, .lightbox__caption')) onClose();
  };

  return createPortal(
    <div
      className={cx('lightbox', visible && 'is-open')}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizar foto"
      ref={rootRef}
      onClick={onBackdrop}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const x0 = touchX.current;
        touchX.current = null;
        if (x0 == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? x0) - x0;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      <button className="lightbox__close icon-btn" type="button" aria-label="Fechar" onClick={onClose} ref={closeRef}>
        <Icon name="fa-solid fa-xmark" />
      </button>
      <button className="lightbox__nav lightbox__nav--prev icon-btn" type="button" aria-label="Anterior" hidden={total < 2} onClick={() => step(-1)}>
        <Icon name="fa-solid fa-chevron-left" />
      </button>
      <figure className="lightbox__figure">
        <img
          className={cx('lightbox__img', loadedSrc === src && 'is-ready')}
          id="lightbox-img"
          src={src}
          alt={txt(f.alt || f.titulo)}
          onLoad={() => setLoadedSrc(src)}
        />
        <figcaption className="lightbox__caption" id="lightbox-caption">
          <strong>{f.titulo}</strong>
          {has(f.local) && (
            <span>
              <Icon name="fa-solid fa-location-dot" />
              {f.local}
            </span>
          )}
          <em>{`${pos + 1} / ${total}`}</em>
        </figcaption>
      </figure>
      <button className="lightbox__nav lightbox__nav--next icon-btn" type="button" aria-label="Próximo" hidden={total < 2} onClick={() => step(1)}>
        <Icon name="fa-solid fa-chevron-right" />
      </button>
    </div>,
    document.body,
  );
}
