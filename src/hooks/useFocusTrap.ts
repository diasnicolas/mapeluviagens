import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapTab(e: KeyboardEvent, container: HTMLElement): void {
  const f = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hidden && el.offsetParent !== null,
  );
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * While active: keeps Tab focus inside `containerRef`, forwards other keys to `onKey`
 * (Esc, arrows…) and returns focus to the previously focused element on deactivation.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onKey?: (e: KeyboardEvent) => void,
): void {
  const onKeyRef = useRef(onKey);
  useEffect(() => {
    onKeyRef.current = onKey;
  }, [onKey]);

  useEffect(() => {
    if (!active) return;
    const lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && containerRef.current) trapTab(e, containerRef.current);
      else onKeyRef.current?.(e);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastFocus?.focus({ preventScroll: true });
    };
  }, [active, containerRef]);
}
