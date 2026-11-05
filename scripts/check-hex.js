#!/usr/bin/env node
'use strict';

/**
 * Fails when a colour literal (#rgb / #rrggbb / #rrggbbaa, rgb()/rgba()/hsl()
 * with numbers) appears in app source outside the token files. Colours come
 * from src/theme.ts (derived from the generated src/theme/tokens.ts).
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ALLOW = new Set(['src/theme/tokens.ts', 'src/theme.ts'].map(path.normalize));
const RE = [/(['"`])#[0-9a-fA-F]{3,8}\1/, /(?:rgba?|hsla?)\(\s*\d/];

const problems = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) {
      const rel = path.relative(root, full);
      if (ALLOW.has(path.normalize(rel))) continue;
      fs.readFileSync(full, 'utf8').split(/\r?\n/).forEach((line, i) => {
        if (RE.some((re) => re.test(line))) problems.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
    }
  }
}
walk(path.join(root, 'src'));
if (problems.length) {
  console.error(`Raw colour values found (${problems.length}). Use tokens from '@/theme' (colors, alpha()).`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('Hex check passed.');
