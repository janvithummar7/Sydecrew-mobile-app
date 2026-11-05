/** Shapes of the companion API (Sydecrew-be/src/modules/companion/companion.view.js, companion.service.js). */
import type { CompanionStatus } from './steps';

export type FixItem = { code: string; step: string; label: string };

export type CompanionPhoto = {
  id: string;
  sort_order: number;
  is_primary: boolean;
  moderation_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  url: string | null;
  thumb_url: string | null;
  url_expires_at: string | null;
};

export type Verification = {
  id: string | null;
  status: string;
  attempt_number: number | null;
  verification_type: string | null;
  document_type: string | null;
  required_sides: ('FRONT' | 'BACK' | 'SELFIE')[];
  documents: Partial<Record<'FRONT' | 'BACK' | 'SELFIE', { asset_id: string; status: string }>>;
  digilocker_completed: boolean;
  submitted_at: string | null;
  decided_at: string | null;
  auto_reason_code: string | null;
  fix_items: FixItem[];
  decision_reason: { code: string; text: string } | null;
  note: string | null;
};

export type Checklist = { profile: boolean; photos: boolean; categories: boolean; documents: boolean; ready: boolean; missing: string[] };
export type SetupState = {
  categories: boolean;
  rates: boolean;
  availability: boolean;
  photos: boolean;
  ready: boolean;
  missing: string[];
  priced_offerings: number;
  weekly_slots: number;
};

export type Companion = {
  id: string;
  status: CompanionStatus;
  next_step: string;
  display_name: string;
  intro: string | null;
  languages: { id: string; code: string; name: string }[];
  city_id: string;
  zone_id: string | null;
  service_radius_km: number;
  categories: { category_id: string; code: string; name: string; min_age: number; status: 'PENDING' | 'APPROVED' | 'INELIGIBLE' | 'REMOVED'; ineligible_reason: string | null }[];
  activities: { activity_id: string; category_id: string; name: string }[];
  boundaries: { id: string; boundary_option_id: string | null; text: string; custom: boolean; mandatory: boolean; moderation_status: string }[];
  photos: CompanionPhoto[];
  verification: Verification | null;
  checklist: Checklist;
  setup: SetupState | null;
  pending_changes: { id: string; field: string; proposed_value: { value: string } | null; created_at: string }[];
  timeline: { from: string | null; to: string; at: string; reason_code: string | null }[];
  review_sla_text: string;
  submitted_at: string | null;
  approved_at: string | null;
  live_at: string | null;
  paused_reason: string | null;
  reverify_due_at: string | null;
  reapply_after: string | null;
  reapply_blocked: boolean;
  retry_after: string | null;
  manual_reopen_required: boolean;
  bank_details_reminder: boolean;
};

export type CompanionOptions = {
  categories: {
    id: string;
    code: string;
    name: string;
    tagline: string | null;
    description: string | null;
    min_age: number;
    price_band: { min_paise: number; max_paise: number };
    min_duration_minutes: number;
    max_duration_minutes: number;
    activities: { id: string; name: string; slug: string; description: string | null }[];
  }[];
  boundary_options: { id: string; text: string; category_id: string | null; mandatory: boolean }[];
  languages: { id: string; code: string; name: string; native_name: string | null }[];
  cities: { id: string; name: string; slug: string; zones: { id: string; name: string; slug: string }[] }[];
  document_types: { code: string; label: string; sides: string[]; via_digilocker: boolean }[];
  fix_items: FixItem[];
  limits: {
    photos_min: number;
    photos_max: number;
    photo_min_px: number;
    photo_max_bytes: number;
    upload_mimes: string[];
    radius_km_min: number;
    radius_km_max: number;
    display_name_max_chars: number;
    intro_min_chars: number;
    intro_max_chars: number;
    boundary_text_max_chars: number;
    max_languages: number;
    max_activities: number;
  };
  review_sla_text: string;
  min_age: number;
};

export type UploadTarget = {
  method: 'PUT' | 'POST';
  url: string;
  headers?: Record<string, string>;
  fields?: Record<string, string>;
  expires_at: string;
};

export type ApplyInput = {
  dob?: string;
  city_id?: string;
  zone_id?: string;
  confirm_18_plus: true;
  consents: Record<'terms' | 'privacy' | 'community_guidelines' | 'dpdp_data_processing' | 'companion_terms' | 'companion_conduct' | 'kyc_biometric_processing', boolean>;
};

export type Availability = {
  timezone: string;
  rules: { id?: string; day_of_week: number; start_time: string; end_time: string }[];
  exceptions: { id: string; date: string; type: 'BLOCKED' | 'EXTRA'; start_time: string | null; end_time: string | null; reason: string | null }[];
  settings: { buffer_minutes: number; min_duration_minutes: number; max_duration_minutes: number; min_notice_hours: number; max_advance_days: number };
};

export type Rate = {
  offering_id: string;
  category_id: string;
  category: string;
  category_status: string | null;
  activity_id: string;
  activity: string;
  hourly_rate_paise: number | null;
  min_duration_minutes: number;
  rate_set: boolean;
  active: boolean;
  out_of_band: boolean;
  band: { min_paise: number; max_paise: number };
};
