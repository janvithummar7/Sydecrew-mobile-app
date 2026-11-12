import { api } from '../api';
import type { EarningStatus, Earnings, EarningsSummary, Payout, PayoutAccountInput, PayoutAccountState, Payouts } from './types';

const enc = encodeURIComponent;

/** /api/v1/companion earnings, payouts and payout account (Feature 6). Money is integer paise. */
export const payoutsApi = {
  summary: () => api<EarningsSummary>('/companion/earnings/summary'),
  earnings: (q: { status?: EarningStatus | null; before?: string | null } = {}) => {
    const p = [q.status ? `status=${enc(q.status)}` : null, q.before ? `before=${enc(q.before)}` : null].filter(Boolean).join('&');
    return api<Earnings>(`/companion/earnings${p ? `?${p}` : ''}`);
  },
  payouts: () => api<Payouts>('/companion/payouts'),
  payout: (id: string) => api<{ payout: Payout }>(`/companion/payouts/${enc(id)}`).then((r) => r.payout),
  account: () => api<PayoutAccountState>('/companion/payout-account'),
  saveAccount: (body: PayoutAccountInput) => api<PayoutAccountState>('/companion/payout-account', { method: 'POST', body }),
};
