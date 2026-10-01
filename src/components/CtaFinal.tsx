/* CTA final banner (image + brand gradient + WhatsApp button) */
import { useAgency } from '../data/AgencyContext';
import { has } from '../lib/format';
import { extProps, safeUrl } from '../lib/url';
import { defaultWa } from '../lib/whatsapp';
import { Icon, Img, Reveal } from './ui';

export function CtaFinal() {
  const { data } = useAgency();
  const c = data.cta_final;
  if (!c || (!has(c.titulo) && !has(c.botao?.texto))) return null;
  const bg = safeUrl(c.imagem_fundo);
  const link = safeUrl(c.botao?.link) || defaultWa(data.contato);

  return (
    <section id="cta-final" className="cta-banner" aria-labelledby={has(c.titulo) ? 'cta-final-title' : undefined}>
      {bg && <Img className="cta-banner__img" src={bg} alt="" loading="lazy" />}
      <Reveal className="cta-banner__body">
        {has(c.titulo) && <h2 id="cta-final-title">{c.titulo}</h2>}
        {has(c.subtitulo) && <p>{c.subtitulo}</p>}
        {link && has(c.botao?.texto) && (
          <a className="btn btn--accent btn--lg" href={link} {...extProps(link)}>
            <Icon name={c.botao?.icone} fallback="fa-brands fa-whatsapp" />
            {c.botao?.texto}
          </a>
        )}
      </Reveal>
    </section>
  );
}
