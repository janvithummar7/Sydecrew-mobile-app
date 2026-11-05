import { api } from '../api';
import type { Me } from '../types';
import type { ApplyInput, Availability, Companion, CompanionOptions, Rate, UploadTarget } from './types';

type View = { companion: Companion };
type Side = 'FRONT' | 'BACK' | 'SELFIE';
type UploadDecl = { mime: 'image/jpeg'; bytes: number; sha256: string; asset_id?: string };

/** /api/v1/companion — the companion's own application, profile and setup. */
export const companionApi = {
  options: () => api<CompanionOptions>('/companion/options'),
  apply: (body: ApplyInput) => api<{ user: Me; companion: Companion }>('/companion/apply', { method: 'POST', body }),
  me: () => api<View>('/companion/me'),

  updateProfile: (body: Partial<{ display_name: string; intro: string; language_ids: string[]; city_id: string; zone_id: string; service_radius_km: number }>) =>
    api<View>('/companion/profile', { method: 'PATCH', body }),
  setCategories: (category_ids: string[]) => api<View>('/companion/categories', { method: 'PUT', body: { category_ids } }),
  setActivities: (activity_ids: string[]) => api<View>('/companion/activities', { method: 'PUT', body: { activity_ids } }),
  setBoundaries: (option_ids: string[], custom: string[]) => api<View>('/companion/boundaries', { method: 'PUT', body: { option_ids, custom } }),

  photoUploadUrl: (body: UploadDecl) => api<{ asset_id: string; upload: UploadTarget }>('/companion/photos/upload-url', { method: 'POST', body }),
  confirmPhoto: (assetId: string) => api<View & { photo_id: string }>(`/companion/photos/${assetId}/confirm`, { method: 'POST', body: {} }),
  deletePhoto: (photoId: string) => api<View>(`/companion/photos/${photoId}`, { method: 'DELETE' }),
  orderPhotos: (photo_ids: string[]) => api<View>('/companion/photos/order', { method: 'PUT', body: { photo_ids } }),

  startVerification: (body: { document_type?: string; mock_scenario?: string }) => api<View>('/companion/verification', { method: 'POST', body }),
  documentUploadUrl: (body: UploadDecl & { side: Side }) =>
    api<{ asset_id: string; side: Side; upload: UploadTarget }>('/companion/verification/documents/upload-url', { method: 'POST', body }),
  confirmDocument: (assetId: string) => api<View>(`/companion/verification/documents/${assetId}/confirm`, { method: 'POST', body: {} }),
  livenessSession: () => api<{ mode: 'UPLOAD' | 'SDK'; client_token: string | null; ref: string | null }>('/companion/verification/liveness/session', { method: 'POST', body: {} }),
  completeLiveness: (provider_ref: string) => api<View>('/companion/verification/liveness/complete', { method: 'POST', body: { provider_ref } }),
  digilockerStart: () => api<{ url: string | null; ref: string }>('/companion/verification/digilocker/start', { method: 'POST', body: {} }),
  digilockerComplete: (code: string) => api<View>('/companion/verification/digilocker/complete', { method: 'POST', body: { code } }),
  submit: () => api<View>('/companion/submit', { method: 'POST', body: {} }),

  availability: () => api<Availability>('/companion/availability'),
  putAvailability: (body: { rules: Availability['rules']; settings?: Availability['settings'] }) => api<Availability>('/companion/availability', { method: 'PUT', body }),
  addException: (body: { date: string; type: 'BLOCKED' | 'EXTRA'; start_time?: string; end_time?: string; reason?: string }) =>
    api<Availability & { id: string }>('/companion/availability/exceptions', { method: 'POST', body }),
  deleteException: (id: string) => api<Availability>(`/companion/availability/exceptions/${id}`, { method: 'DELETE' }),
  rates: () => api<{ currency: 'INR'; rates: Rate[] }>('/companion/rates'),
  putRates: (rates: { category_id: string; activity_id?: string; hourly_rate_paise: number }[]) =>
    api<{ currency: 'INR'; rates: Rate[] }>('/companion/rates', { method: 'PUT', body: { rates } }),
  goLive: () => api<{ already_live: boolean; companion: Companion }>('/companion/go-live', { method: 'POST', body: {} }),
  pause: (reason?: string) => api<View>('/companion/pause', { method: 'POST', body: reason ? { reason } : {} }),
  resume: () => api<View>('/companion/resume', { method: 'POST', body: {} }),
};
