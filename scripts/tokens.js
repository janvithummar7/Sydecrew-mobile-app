#!/usr/bin/env node
'use strict';

/**
 * Design token generator (integration pass §2.1). One source: design/tokens.json.
 *   node scripts/tokens.js web           -> src/styles/tokens.css (Tailwind v4 @theme + CSS variables)
 *   node scripts/tokens.js mobile        -> src/theme/tokens.ts
 *   node scripts/tokens.js <target> --check
 *       fails if the generated file differs from tokens.json (drift) or if any
 *       contrastPairs entry is below 4.5:1 (WCAG AA for text).
 * The same script lives in Sydecrew-web and Sydecrew-mobile-app; mobile keeps a
 * pinned copy of tokens.json (sync: copy Sydecrew-web/design/tokens.json over it).
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const [target = 'web', flag] = process.argv.slice(2);
const T = JSON.parse(fs.readFileSync(path.join(root, 'design/tokens.json'), 'utf8'));

const resolve = (ref) => {
  if (typeof ref !== 'string' || ref.startsWith('#') || ref.startsWith('rgba')) return ref;
  const [group, shade] = ref.split('.');
  const v = shade ? T.color[group]?.[shade] : T.color[group];
  if (!v) throw new Error(`Unknown colour token ${ref}`);
  return v;
};

// ── Contrast (WCAG 2.x relative luminance) ──
function lum(hex) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
function contrastReport() {
  return T.contrastPairs.map(([fg, bg]) => {
    const r = ratio(resolve(T.semantic[fg]), resolve(T.semantic[bg]));
    return { fg, bg, ratio: Math.round(r * 100) / 100, ok: r >= 4.5 };
  });
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const HEADER = '/* GENERATED from design/tokens.json by scripts/tokens.js. Do not edit; run `npm run tokens:gen`. */\n';

function web() {
  const lines = [HEADER, '@theme {'];
  for (const [group, shades] of Object.entries(T.color)) {
    if (typeof shades === 'string') lines.push(`  --color-${group}: ${shades};`);
    else for (const [shade, v] of Object.entries(shades)) lines.push(`  --color-${group}-${shade}: ${v};`);
  }
  for (const [name, v] of Object.entries(T.alpha)) lines.push(`  --color-${kebab(name)}: ${v};`);
  for (const [name, ref] of Object.entries(T.semantic)) lines.push(`  --color-${kebab(name)}: ${resolve(ref)};`);
  for (const [name, px] of Object.entries(T.radius)) lines.push(`  --radius-${name}: ${px === 9999 ? '9999px' : `${px / 16}rem`};`);
  for (const [name, t] of Object.entries(T.type)) {
    lines.push(`  --text-${name}: ${t.size / 16}rem;`, `  --text-${name}--line-height: ${t.line / 16}rem;`, `  --text-${name}--letter-spacing: ${t.tracking / 16}rem;`, `  --text-${name}--font-weight: ${t.weight};`);
  }
  for (const [name, s] of Object.entries(T.shadow)) lines.push(`  --shadow-${name}: ${s.web};`);
  for (const [name, e] of Object.entries(T.motion.easing)) lines.push(`  --ease-${kebab(name)}: cubic-bezier(${e.join(', ')});`);
  lines.push('}', '', '@theme inline {');
  for (const [name, f] of Object.entries(T.font)) lines.push(`  --font-${name}: ${f.web};`);
  lines.push('}', '', ':root {');
  for (const [name, px] of Object.entries(T.space)) lines.push(`  --space-${name}: ${px / 16}rem;`);
  for (const [name, ms] of Object.entries(T.motion.duration)) lines.push(`  --dur-${name}: ${ms}ms;`);
  for (const [name, z] of Object.entries(T.z)) lines.push(`  --z-${name}: ${z};`);
  lines.push(`  --touch-target: ${T.touchTarget / 16}rem;`, '}', '');
  return { file: 'src/styles/tokens.css', body: lines.join('\n') };
}

function mobile() {
  const colors = {};
  for (const [group, shades] of Object.entries(T.color)) {
    if (typeof shades === 'string') colors[group] = shades;
    else for (const [shade, v] of Object.entries(shades)) colors[`${group}${shade}`] = v;
  }
  Object.assign(colors, T.alpha);
  const semantic = Object.fromEntries(Object.entries(T.semantic).map(([k, v]) => [k, resolve(v)]));
  const type = Object.fromEntries(
    Object.entries(T.type).map(([k, t]) => [k, { fontSize: t.size, lineHeight: t.line, fontWeight: String(t.weight), letterSpacing: t.tracking, ...(t.uppercase ? { textTransform: 'uppercase' } : {}) }]),
  );
  const shadow = Object.fromEntries(
    Object.entries(T.shadow).map(([k, s]) => [k, { shadowColor: s.mobile.color, shadowOpacity: s.mobile.opacity, shadowRadius: s.mobile.radius, shadowOffset: { width: 0, height: s.mobile.offsetY }, elevation: s.mobile.elevation }]),
  );
  const out = {
    colors,
    semantic,
    fonts: Object.fromEntries(Object.entries(T.font).map(([k, f]) => [k, f.mobile])),
    type,
    space: T.space,
    radius: T.radius,
    shadow,
    z: T.z,
    motion: T.motion,
    touchTarget: T.touchTarget,
  };
  const body = `${HEADER.replace('/*', '/*').trim()}\n\n${Object.entries(out)
    .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2).replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, '$1:')} as const;`)
    .join('\n\n')}\n\nexport const tokensVersion = ${T.version};\n`;
  return { file: 'src/theme/tokens.ts', body };
}

const gen = target === 'mobile' ? mobile() : web();
const outPath = path.join(root, gen.file);
const report = contrastReport();
const bad = report.filter((r) => !r.ok);

if (flag === '--check') {
  const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n') : '';
  let failed = false;
  if (current !== gen.body) {
    console.error(`Token drift: ${gen.file} does not match design/tokens.json. Run \`npm run tokens:gen\`.`);
    failed = true;
  }
  if (bad.length) {
    console.error('Contrast below 4.5:1:', bad.map((r) => `${r.fg} on ${r.bg} = ${r.ratio}`).join(', '));
    failed = true;
  }
  if (failed) process.exit(1);
  console.log(`Tokens OK (${gen.file}); ${report.length} contrast pairs >= 4.5:1 (lowest ${Math.min(...report.map((r) => r.ratio))}).`);
} else {
  if (bad.length) console.warn('Warning: contrast below 4.5:1:', bad.map((r) => `${r.fg} on ${r.bg} = ${r.ratio}`).join(', '));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, gen.body);
  console.log(`wrote ${gen.file}`);
}

module.exports = { contrastReport, ratio };
