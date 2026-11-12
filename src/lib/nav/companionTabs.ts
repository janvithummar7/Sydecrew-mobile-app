/**
 * Companion tab bar (carry-over gap §5.2): at most five tabs. Everything else
 * in the (tabs) group is hidden from the bar (`href: null`), listed under
 * "More" (src/app/companion/(tabs)/more.tsx), and keeps its route.
 */
export const COMPANION_TABS = ['dashboard', 'bookings', 'messages', 'earnings', 'more'] as const;
export const COMPANION_MORE = ['profile', 'availability', 'rates', 'status'] as const;
export const MAX_TABS = 5;
