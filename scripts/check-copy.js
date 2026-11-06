#!/usr/bin/env node
'use strict';

/**
 * Brand / compliance copy check (Feature 2, decision H). Fails (exit 1) when
 * user-facing copy or templates contain wording that is off-brand or a
 * payment-gateway / legal risk:
 *   "rent a partner|friend|companion", girlfriend, boyfriend, dating, escort,
 *   and the old brand name RENDER (upper case, whole word).
 *
 * Configuration: copy-check.config.json next to package.json
 *   { "include": ["src"], "exclude": ["src/migrations"], "extensions": [".ts"],
 *     "allowFiles": { "path/to/file": "why this file may name them" } }
 * A single line is allowed when it, or the line just above it, contains
 * "copy-check-allow" (legal text that must name prohibited services).
 *
 * The same script is used in Sydecrew-be, Sydecrew-web and Sydecrew-mobile-app.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, 'copy-check.config.json'), 'utf8'));
const extensions = new Set(config.extensions || ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.html']);
const exclude = (config.exclude || []).map((p) => path.normalize(p));
const allowFiles = Object.fromEntries(Object.entries(config.allowFiles || {}).map(([p, why]) => [path.normalize(p), why]));

const RULES = [
  [/\brent\s*-?\s*an?\s+(partner|friend|companion|girl|boy)/i, 'old "Rent a ..." category name'],
  [/\b(girl|boy)\s?-?friends?\b/i, 'romantic wording'],
  [/\bdating\b/i, 'romantic wording'],
  [/\bescort(s|ing|ed)?\b/i, 'prohibited-service wording'],
  [/\bRENDER\b/, 'old brand name'],
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);
    if (entry.name === 'node_modules' || entry.name.startsWith('.') || exclude.some((e) => rel === e || rel.startsWith(e + path.sep))) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (extensions.has(path.extname(entry.name))) yield rel;
  }
}

const problems = [];
for (const inc of config.include || ['src']) {
  const start = path.join(root, inc);
  if (!fs.existsSync(start)) continue;
  const files = fs.statSync(start).isDirectory() ? walk(start) : [inc];
  for (const rel of files) {
    if (allowFiles[path.normalize(rel)]) continue;
    const lines = fs.readFileSync(path.join(root, rel), 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes('copy-check-allow') || (i > 0 && lines[i - 1].includes('copy-check-allow'))) return;
      for (const [re, why] of RULES) {
        const m = line.match(re);
        if (m) problems.push(`${rel}:${i + 1}: "${m[0]}" (${why})`);
      }
    });
  }
}

if (problems.length) {
  console.error(`Copy check failed: ${problems.length} problem(s). Use the public names Crew, Plus-One, Crew Care, Crew Events and the brand "Sydecrew".`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('Copy check passed.');
