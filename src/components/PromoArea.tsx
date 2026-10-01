/* Promo area: full-width CTA banner band before the contact section */
import { useAgency } from '../data/AgencyContext';
import { showSection } from '../lib/sections';
import { CtaFinal } from './CtaFinal';

export function PromoArea() {
  const { data } = useAgency();
  if (!showSection['cta-final'](data)) return null;

  return (
    <div className="promo-area" id="promo-area">
      <div className="container">
        <CtaFinal />
      </div>
    </div>
  );
}
