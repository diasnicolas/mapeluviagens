import { useEffect, useState } from 'react';
import type { AgencyData } from '../types/agencia';

export const DATA_URL =
  new URLSearchParams(location.search).get('data') ?? `${import.meta.env.BASE_URL}agencia-viagens.json`;

export type AgencyState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: AgencyData };

/** Fetches the agency JSON (no-store, aborted on unmount) */
export function useAgencyData(url: string = DATA_URL): AgencyState {
  const [state, setState] = useState<AgencyState>({ status: 'loading' });

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${url}`);
        const json: unknown = await res.json();
        if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('JSON inválido');
        setState({ status: 'ready', data: json as AgencyData });
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setState({ status: 'error', message: err instanceof Error ? err.message : String(err) });
      }
    };
    void load();
    return () => ctrl.abort();
  }, [url]);

  return state;
}
