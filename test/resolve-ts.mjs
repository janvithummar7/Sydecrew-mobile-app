// Lets Node's test runner load app modules the way Metro does: extensionless
// relative imports and the "@/..." alias resolve to .ts files under src/.
import { registerHooks } from 'node:module';

const src = new URL('../src/', import.meta.url);

registerHooks({
  resolve(specifier, context, next) {
    const spec = specifier.startsWith('@/') ? new URL(specifier.slice(2), src).href : specifier;
    try {
      return next(spec, context);
    } catch (err) {
      const relative = spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('file:');
      if (relative && !/\.[cm]?[jt]sx?$/.test(spec)) return next(`${spec}.ts`, context);
      throw err;
    }
  },
});
