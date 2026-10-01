import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/* One shared IntersectionObserver for every scroll-reveal element. */
const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          callbacks.get(en.target)?.();
          callbacks.delete(en.target);
          observer?.unobserve(en.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    );
  }
  return observer;
}

const canObserve = () => typeof window !== 'undefined' && 'IntersectionObserver' in window;

/**
 * Returns a ref and whether the element has entered the viewport (once).
 * `force` shows it immediately (e.g. items revealed by a filter/"show more").
 */
export function useReveal<T extends Element>(force = false) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(() => !canObserve() || prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const io = getObserver();
    callbacks.set(el, () => setSeen(true));
    io.observe(el);
    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, [seen]);

  return [ref, seen || force] as const;
}
