/**
 * Dynamic layer over app.json (Feature 7). Only one thing changes per build:
 * Sentry source-map / debug-symbol upload is OFF unless SENTRY_AUTH_TOKEN is
 * set (with SENTRY_ORG and SENTRY_PROJECT), so CI's `expo export` and local
 * builds work without secrets. The token itself is never written into the
 * config: the Sentry tooling reads it from the environment.
 */
module.exports = ({ config }) => {
  const upload = !!process.env.SENTRY_AUTH_TOKEN;
  const plugins = (config.plugins ?? []).map((p) => {
    const name = Array.isArray(p) ? p[0] : p;
    if (name !== '@sentry/react-native') return p;
    return [
      '@sentry/react-native',
      upload
        ? { disableAutoUpload: false, organization: process.env.SENTRY_ORG, project: process.env.SENTRY_PROJECT }
        : { disableAutoUpload: true },
    ];
  });
  return { ...config, plugins };
};
