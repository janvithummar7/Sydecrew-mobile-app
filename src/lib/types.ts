/** API shapes shared with the web app (Sydecrew-web/src/lib/api/auth.ts). */

/** Mirrors `meView` in the API (src/modules/auth/auth.service.js). */
export type Me = {
  id: string;
  full_name: string;
  display_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DEACTIVATED';
  is_staff: boolean;
  roles: string[];
  email_verified: boolean;
  phone_verified: boolean;
  age_confirmed: boolean;
  city_id: string | null;
  zone_id: string | null;
  onboarding: { complete: boolean; next_step: 'VERIFY_PHONE' | 'PROFILE' | null };
};

/** A one-time code that was just sent. `dev_code` appears only in local development. */
export type Challenge = {
  otp_id: string;
  purpose: 'REGISTER' | 'LOGIN';
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  destination: string;
  expires_at: string;
  resend_available_at: string;
  dev_code?: string;
};

export type SessionResponse = {
  access_token: string;
  expires_in: number;
  user: Me;
  /** Only returned to mobile clients (X-Client: mobile). */
  refresh_token?: string;
  dev_link?: string;
};

export type OnboardingOptions = {
  cities: {
    id: string;
    name: string;
    slug: string;
    state: string | null;
    is_pilot: boolean;
    zones: { id: string; name: string; slug: string; status: 'LIVE' | 'COMING_SOON' }[];
  }[];
  interests: { id: string; name: string; slug: string }[];
  legal: { terms_version: string | null; privacy_version: string | null; guidelines_version: string | null };
  min_age: number;
  max_interests: number;
};

export type OnboardingInput = {
  dob: string;
  confirm_18_plus: boolean;
  city_id: string;
  zone_id: string;
  interest_ids: string[];
  privacy: { hide_last_name: boolean };
  consents: {
    terms: boolean;
    privacy: boolean;
    community_guidelines: boolean;
    dpdp_data_processing: boolean;
    marketing: boolean;
  };
};
