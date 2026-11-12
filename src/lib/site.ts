/** Public site for legal pages and the admin (EXPO_PUBLIC_SITE_URL, default the production site). */
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || 'https://sydecrew.com').replace(/\/$/, '');
