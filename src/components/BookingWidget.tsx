/* OTA booking widget: service tabs (roving tabindex) + search form → WhatsApp */
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { Busca, CampoBusca, Servico } from '../types/agencia';
import { cx } from '../lib/cx';
import { arr, fmtDateBR, has, todayIso, txt } from '../lib/format';
import { FIELD_ICONS } from '../lib/icons';
import { openWhatsApp } from '../lib/whatsapp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Icon, Reveal } from './ui';

type FieldType = 'text' | 'date' | 'select';

const fieldName = (f: CampoBusca, i: number): string => txt(f.nome) || `campo${i}`;
const fieldType = (f: CampoBusca): FieldType =>
  f.tipo === 'date' ? 'date' : f.tipo === 'select' ? 'select' : 'text';

export function BookingWidget({ svc, busca }: { svc: Servico[]; busca: Busca }) {
  const { data } = useAgency();
  const reduced = usePrefersReducedMotion();
  const campos = useMemo(() => arr(busca.campos), [busca]);
  const [active, setActive] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const minDate = useMemo(todayIso, []);

  // Controlled values; selects without placeholder start on their first option (native behaviour)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    campos.forEach((f, i) => {
      const opts = arr(f.opcoes);
      init[fieldName(f, i)] = fieldType(f) === 'select' && !has(f.placeholder) && opts.length ? txt(opts[0]) : '';
    });
    return init;
  });
  const dateNames = campos.flatMap((f, i) => (fieldType(f) === 'date' ? [fieldName(f, i)] : []));

  const select = (i: number, focus = false) => {
    setActive(i);
    setSwaps((n) => n + 1);
    const tab = tabRefs.current[i];
    if (focus) tab?.focus();
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = svc.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next != null) {
      e.preventDefault();
      select(next, true);
    }
  };

  const setValue = (name: string, value: string) =>
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Return date can't be before departure
      if (dateNames.length > 1 && name === dateNames[0]) {
        const back = next[dateNames[1]];
        if (back && value && back < value) next[dateNames[1]] = value;
      }
      return next;
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lines: string[] = [];
    campos.forEach((f, i) => {
      const v = values[fieldName(f, i)] ?? '';
      if (!has(v)) return;
      const out = fieldType(f) === 'date' ? fmtDateBR(v) : v;
      lines.push(`• ${txt(f.rotulo || f.nome).replace(/[?:]\s*$/, '')}: ${out}`);
    });
    const kind = svc[active]?.titulo;
    const intro = data.contato?.whatsapp?.mensagem_padrao || 'Olá! Vim pelo site.';
    const msg = `${intro}\n\n${kind ? `Tipo de viagem: ${kind}\n` : ''}${lines.join('\n')}`.trim();
    openWhatsApp(data.contato, msg);
  };

  const current = svc[active];
  const swapped = swaps > 0;

  return (
    <Reveal className="booking">
      {svc.length > 0 && (
        <div className="bk-tabs" role="tablist" aria-label="Tipo de viagem">
          {svc.map((s, i) => (
            <button
              key={s.id ?? i}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={cx('bk-tab', i === active && 'is-active')}
              type="button"
              role="tab"
              id={`bk-tab-${i}`}
              aria-selected={i === active}
              aria-controls="bk-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <Icon name={s.icone} fallback="fa-solid fa-suitcase-rolling" />
              <span>{s.titulo}</span>
            </button>
          ))}
        </div>
      )}
      <div
        className="bk-panel"
        id="bk-panel"
        role={svc.length ? 'tabpanel' : undefined}
        aria-labelledby={svc.length ? `bk-tab-${active}` : undefined}
      >
        <div className={cx('bk-head', swapped && 'is-swap')} key={swaps}>
          <span className="bk-head__icon">
            <Icon
              name={current?.icone}
              fallback={swapped ? 'fa-solid fa-suitcase-rolling' : 'fa-solid fa-magnifying-glass-location'}
            />
          </span>
          <div className="bk-head__text">
            <strong>{txt(current?.titulo || (swapped ? '' : busca.botao))}</strong>
            <span>{txt(current?.descricao)}</span>
          </div>
        </div>
        <form className="bk-form" id="bk-form" noValidate onSubmit={onSubmit}>
          {campos.map((f, i) => {
            const name = fieldName(f, i);
            const type = fieldType(f);
            const id = `bk-${name}`;
            const value = values[name] ?? '';
            let control;
            if (type === 'select') {
              control = (
                <select id={id} name={name} value={value} onChange={(e) => setValue(name, e.target.value)}>
                  {has(f.placeholder) && <option value="">{f.placeholder}</option>}
                  {arr(f.opcoes).map((o, k) => (
                    <option key={k} value={txt(o)}>{txt(o)}</option>
                  ))}
                </select>
              );
            } else {
              const min = type === 'date' ? (name === dateNames[1] ? values[dateNames[0]] || minDate : minDate) : undefined;
              control = (
                <input
                  id={id}
                  name={name}
                  type={type}
                  placeholder={has(f.placeholder) ? txt(f.placeholder) : undefined}
                  autoComplete="off"
                  min={min}
                  value={value}
                  onChange={(e) => setValue(name, e.target.value)}
                />
              );
            }
            return (
              <div className={`bk-field bk-field--${type}`} key={name}>
                <label htmlFor={id}>{txt(f.rotulo || f.nome)}</label>
                <div className="bk-control">
                  <Icon name={FIELD_ICONS[type]} />
                  {control}
                </div>
              </div>
            );
          })}
          <button className="btn btn--accent bk-submit" type="submit">
            <Icon name="fa-solid fa-magnifying-glass" />
            <span>{txt(busca.botao) || 'Buscar'}</span>
          </button>
        </form>
      </div>
    </Reveal>
  );
}
