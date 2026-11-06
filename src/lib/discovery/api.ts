import { api } from '../api';
import type {
  DiscoveryCards,
  DiscoveryList,
  DiscoveryOptions,
  PublicProfile,
  ReportedResponse,
  ReportInput,
  SavedResponse,
  WaitlistInput,
  WaitlistResponse,
} from './types';

const enc = encodeURIComponent;

/** /api/v1/discovery: customer browsing, public profiles, saved / recent, reports and the waitlist. */
export const discoveryApi = {
  options: () => api<DiscoveryOptions>('/discovery/options'),
  /** `query` comes from filtersToQuery() and already starts with "?" (or is empty). */
  list: (query: string) => api<DiscoveryList>(`/discovery/companions${query}`),
  profile: (id: string) => api<PublicProfile>(`/discovery/companions/${enc(id)}`),
  save: (id: string) => api<SavedResponse>(`/discovery/companions/${enc(id)}/save`, { method: 'POST', body: {} }),
  unsave: (id: string) => api<SavedResponse>(`/discovery/companions/${enc(id)}/save`, { method: 'DELETE' }),
  saved: () => api<DiscoveryCards>('/discovery/saved'),
  recent: () => api<DiscoveryCards>('/discovery/recent'),
  report: (id: string, body: ReportInput) => api<ReportedResponse>(`/discovery/companions/${enc(id)}/report`, { method: 'POST', body }),
  joinWaitlist: (body: WaitlistInput) => api<WaitlistResponse>('/discovery/waitlist', { method: 'POST', body }),
};
