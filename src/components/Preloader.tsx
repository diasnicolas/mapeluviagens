import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/** Themed preloader; fades out once `done` and then unmounts */
export function Preloader({ done }: { done: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('is-loading', !done);
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), reduced ? 0 : 500);
    return () => window.clearTimeout(t);
  }, [done, reduced]);

  useEffect(() => () => document.body.classList.remove('is-loading'), []);

  if (gone) return null;
  return (
    <div className={cx('preloader', done && 'is-done')} id="preloader" role="status" aria-live="polite">
      <div className="preloader__ring">
        <svg className="preloader__svg" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="5" />
          <circle
            className="preloader__arc"
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="60 200"
          />
        </svg>
        <i className="fa-solid fa-plane preloader__plane" aria-hidden="true" />
      </div>
      <p className="preloader__text">Buscando as melhores ofertas…</p>
    </div>
  );
}
