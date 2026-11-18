import type { ComponentType } from 'react';
import Constants from 'expo-constants';
import * as Sentry from '@sentry/react-native';
import { scrubBreadcrumb, scrubEvent } from './scrub';

/**
 * Crash reporting (Feature 7). OFF unless EXPO_PUBLIC_SENTRY_DSN is set for
 * the build (eas.json env or the shell), so development and CI send nothing.
 *  - No session replay, no screenshots, no view hierarchy (both can show chat
 *    text or names), no tracing, `sendDefaultPii: false`.
 *  - Every event and breadcrumb goes through the PII scrubber (src/lib/scrub.ts).
 *  - Source-map upload is a build-time concern (app.config.js): off unless
 *    SENTRY_AUTH_TOKEN is set.
 */
const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';
export const sentryEnabled = DSN.length > 0;

if (sentryEnabled) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENV || (__DEV__ ? 'development' : 'production'),
    release: Constants.expoConfig?.version ? `sydecrew-mobile@${Constants.expoConfig.version}` : undefined,
    sendDefaultPii: false,
    attachScreenshot: false,
    attachViewHierarchy: false,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    tracesSampleRate: 0,
    maxBreadcrumbs: 50,
    beforeSend: (event) => scrubEvent(event),
    beforeBreadcrumb: (crumb) => scrubBreadcrumb(crumb),
  });
}

/** Wraps the root component (error boundary, touch breadcrumbs) only when Sentry is on. */
export function withSentry(Root: ComponentType<Record<string, unknown>>): ComponentType<Record<string, unknown>> {
  return sentryEnabled ? Sentry.wrap(Root) : Root;
}
