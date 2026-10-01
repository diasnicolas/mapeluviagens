/* Dynamic quote form (text/email/tel/select/textarea) → validation → WhatsApp message */
import { useRef, useState, type FormEvent } from 'react';
import { useAgency } from '../data/AgencyContext';
import type { CampoFormulario, Formulario } from '../types/agencia';
import { arr, has, txt } from '../lib/format';
import { safeUrl } from '../lib/url';
import { openWhatsApp } from '../lib/whatsapp';
import { Icon } from './ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Kind = 'select' | 'textarea' | 'text' | 'email' | 'tel' | 'number' | 'date';

const INPUT_KINDS: readonly Kind[] = ['text', 'email', 'tel', 'number', 'date'];
const kindOf = (f: CampoFormulario): Kind => {
  const t = txt(f.tipo);
  if (t === 'select' || t === 'textarea') return t;
  return INPUT_KINDS.find((k) => k === t) ?? 'text';
};
const nameOf = (f: CampoFormulario, i: number): string => txt(f.nome) || `campo${i}`;

function validate(f: CampoFormulario, raw: string): string {
  const v = raw.trim();
  const kind = kindOf(f);
  if (f.obrigatorio && !v) return 'Campo obrigatório.';
  if (v && kind === 'email' && !EMAIL_RE.test(v)) return 'Informe um e-mail válido.';
  if (v && kind === 'tel' && v.replace(/\D/g, '').length < 10) return 'Informe um telefone com DDD.';
  return '';
}

export function ContactForm({ form, campos }: { form: Formulario; campos: CampoFormulario[] }) {
  const { data } = useAgency();
  const [values, setValues] = useState<Record<string, string>>({});
  // key present = field validated; '' = valid, text = error message
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const privacyHref = safeUrl(arr(data.rodape?.links_legais).find((l) => /privacidade/i.test(txt(l.rotulo)))?.link);
  const refs = useRef<Record<string, Control | null>>({});

  const check = (f: CampoFormulario, i: number) => {
    const name = nameOf(f, i);
    const err = validate(f, values[name] ?? '');
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    const bad: string[] = [];
    campos.forEach((f, i) => {
      const name = nameOf(f, i);
      next[name] = validate(f, values[name] ?? '');
      if (next[name]) bad.push(name);
    });
    setErrors(next);
    const firstBad = bad[0];
    if (firstBad !== undefined) {
      refs.current[firstBad]?.focus();
      setMsg({ ok: false, text: 'Revise os campos destacados.' });
      return;
    }
    const lines = campos.flatMap((f, i) => {
      const v = values[nameOf(f, i)] ?? '';
      return has(v) ? [`*${txt(f.rotulo || f.nome)}:* ${v.trim()}`] : [];
    });
    const title = has(form.titulo) ? `${form.titulo}\n\n` : '';
    openWhatsApp(data.contato, `${title}${lines.join('\n')}`);
    setMsg({ ok: true, text: txt(form.mensagem_sucesso) || 'Mensagem enviada!' });
    setValues({});
    setErrors({});
  };

  return (
    <form className="contact-form" id="contact-form" noValidate onSubmit={onSubmit}>
      <div className="form-grid">
        {campos.map((f, i) => {
          const name = nameOf(f, i);
          const id = `cf-${name}`;
          const kind = kindOf(f);
          const required = !!f.obrigatorio;
          const err = errors[name];
          const common = {
            id,
            name,
            required,
            'aria-required': required || undefined,
            'aria-invalid': name in errors ? Boolean(err) : undefined,
            'aria-describedby': `${id}-err`,
            value: values[name] ?? '',
            onBlur: () => {
              if (values[name] || err) check(f, i);
            },
          };
          const set = (v: string) => setValues((prev) => ({ ...prev, [name]: v }));
          const placeholder = has(f.placeholder) ? txt(f.placeholder) : undefined;

          let control;
          if (kind === 'select') {
            control = (
              <select {...common} ref={(el) => { refs.current[name] = el; }} onChange={(e) => set(e.target.value)}>
                <option value="">{txt(f.placeholder) || 'Selecione'}</option>
                {arr(f.opcoes).map((o, k) => (
                  <option key={k} value={txt(o)}>{txt(o)}</option>
                ))}
              </select>
            );
          } else if (kind === 'textarea') {
            control = (
              <textarea
                {...common}
                rows={4}
                placeholder={placeholder}
                ref={(el) => { refs.current[name] = el; }}
                onChange={(e) => set(e.target.value)}
              />
            );
          } else {
            const autoComplete = kind === 'email' ? 'email' : kind === 'tel' ? 'tel' : name === 'nome' ? 'name' : 'off';
            control = (
              <input
                {...common}
                type={kind}
                autoComplete={autoComplete}
                placeholder={placeholder}
                ref={(el) => { refs.current[name] = el; }}
                onChange={(e) => set(e.target.value)}
              />
            );
          }

          return (
            <div className={kind === 'textarea' ? 'field field--full' : 'field'} key={name}>
              <label htmlFor={id}>
                {txt(f.rotulo || f.nome)}
                {required && (
                  <>
                    {' '}
                    <span className="req" aria-hidden="true">*</span>
                  </>
                )}
              </label>
              {control}
              <span className="field__err" id={`${id}-err`} aria-live="polite">{err || ''}</span>
            </div>
          );
        })}
      </div>
      <button className="btn btn--accent btn--lg btn--block" type="submit">
        <Icon name="fa-brands fa-whatsapp" />
        {txt(form.botao) || 'Enviar'}
      </button>
      {has(form.aviso_privacidade) && (
        <p className="privacy">
          <Icon name="fa-solid fa-lock" />
          <span>
            {form.aviso_privacidade}
            {privacyHref && privacyHref !== '#' && (
              <>
                {' '}
                <a href={privacyHref}>Política de Privacidade</a>
              </>
            )}
          </span>
        </p>
      )}
      <p className={msg ? `form-msg ${msg.ok ? 'is-ok' : 'is-err'}` : 'form-msg'} id="contact-msg" aria-live="polite">
        {msg && (
          <>
            <Icon name={msg.ok ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'} />
            {msg.text}
          </>
        )}
      </p>
    </form>
  );
}
