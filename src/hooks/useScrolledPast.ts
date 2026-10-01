import { useEffect, useState } from 'react';

/** True once the window has scrolled more than `px` pixels (re-renders only on threshold crossings) */
export function useScrolledPast(px: number): boolean {
  const [past, setPast] = useState(() => window.scrollY > px);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > px);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [px]);
  return past;
}
