import { useState } from 'react';
import { useAgency } from '../data/AgencyContext';
import { txt } from '../lib/format';
import { safeUrl } from '../lib/url';

/** Agency logo: `branco` on dark surfaces, `principal` on light ones; text fallback if missing/broken */
export function Logo({ variant }: { variant: 'branco' | 'principal' }) {
  const ag = useAgency().data.agencia;
  const lg = ag?.logotipo;
  const src = safeUrl(variant === 'branco' ? lg?.branco || lg?.principal : lg?.principal || lg?.branco);
  const name = txt(ag?.nome_curto || ag?.nome);
  const [failedSrc, setFailedSrc] = useState('');

  if (src && failedSrc !== src) {
    return (
      <img
        className="logo-img"
        src={src}
        alt={txt(lg?.alt) || name}
        width={160}
        height={48}
        onError={() => setFailedSrc(src)}
      />
    );
  }
  return <span className="logo-text">{name}</span>;
}
