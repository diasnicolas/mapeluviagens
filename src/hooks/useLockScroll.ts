import { useEffect } from 'react';

let locks = 0;

/** Adds `body.no-scroll` while active (ref-counted for nested overlays) */
export function useLockScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.classList.add('no-scroll');
    return () => {
      locks = Math.max(0, locks - 1);
      if (!locks) document.body.classList.remove('no-scroll');
    };
  }, [active]);
}
