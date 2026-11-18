#!/usr/bin/env node
'use strict';

/**
 * Writes .expo/types/router.d.ts (expo-router typed routes) without starting
 * the dev server, so `npm run typecheck` is deterministic in CI and on a fresh
 * clone (Feature 7). Uses the same generator `expo start` uses.
 *
 *   npm run typecheck   (runs this first)
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appRoot = path.join(root, 'src', 'app');
process.env.EXPO_ROUTER_APP_ROOT = appRoot;

// @expo/router-server is a dependency of the Expo CLI; resolve it from there.
const cli = path.dirname(require.resolve('@expo/cli/package.json', { paths: [require.resolve('expo/package.json', { paths: [root] })] }));
const generatorPath = require.resolve('@expo/router-server/build/typed-routes/generate', { paths: [cli] });
const { getTypedRoutesDeclarationFile } = require(generatorPath);
const { requireContext } = require(require.resolve('expo-router/internal/testing', { paths: [root] }));
const { EXPO_ROUTER_CTX_IGNORE } = require(require.resolve('expo-router/_ctx-shared', { paths: [root] }));

const ctx = requireContext(appRoot, true, EXPO_ROUTER_CTX_IGNORE);
const file = getTypedRoutesDeclarationFile(ctx, {});
if (!file) {
  console.error('typed-routes: the generator returned nothing');
  process.exit(1);
}
const out = path.join(root, '.expo', 'types');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'router.d.ts'), file);
// expo-env.d.ts (git-ignored, normally written by `expo start`).
const env = path.join(root, 'expo-env.d.ts');
if (!fs.existsSync(env)) fs.writeFileSync(env, '/// <reference types="expo/types" />\n\n// NOTE: This file should not be edited and should be in your git ignore\n');
console.log(`typed-routes: wrote .expo/types/router.d.ts (${ctx.keys().length} route files)`);
