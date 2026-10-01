/* Global floating actions: WhatsApp FAB + back-to-top */
import { useAgency } from '../data/AgencyContext';
import { cx } from '../lib/cx';
import { defaultWa } from '../lib/whatsapp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useScrolledPast } from '../hooks/useScrolledPast';

export function WhatsAppFloat() {
  const { data } = useAgency();
  const wa = defaultWa(data.contato);
  if (!wa) return null;
  return (
    <a className="fab-wa" id="fab-wa" href={wa} target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">
      <i className="fa-brands fa-whatsapp" aria-hidden="true" />
    </a>
  );
}

export function BackToTop() {
  const visible = useScrolledPast(600);
  const reduced = usePrefersReducedMotion();
  return (
    <button
      className={cx('to-top', visible && 'is-visible')}
      id="to-top"
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        document.getElementById('brand')?.focus({ preventScroll: true });
      }}
    >
      <i className="fa-solid fa-arrow-up" aria-hidden="true" />
    </button>
  );
}
