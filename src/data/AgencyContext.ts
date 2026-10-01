import { createContext, useContext } from 'react';
import type { AgencyData } from '../types/agencia';

export interface AgencyContextValue {
  data: AgencyData;
  /** ids of elements that exist in the rendered page */
  ids: Set<string>;
}

export const AgencyContext = createContext<AgencyContextValue>({ data: {}, ids: new Set() });

export const useAgency = (): AgencyContextValue => useContext(AgencyContext);
