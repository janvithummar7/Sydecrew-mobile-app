#!/usr/bin/env node
/**
 * Generates every app icon, the Android adaptive icon layers, the splash image
 * and the web favicon from ONE source: design/brand/symbol.svg, with colours
 * from design/tokens.json.  Run `npm run brand:gen` after changing either.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'design/tokens.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'design/brand/symbol.svg'), 'utf8');
const out = (name) => path.join(root, 'assets/images', name);

function colour(ref) {
  if (ref === 'white') return tokens.color.white ?? '#ffffff';
  const [family, step] = ref.split('.');
  const value = tokens.color[family]?.[step];
  if (!value) throw new Error(`Unknown colour token in symbol.svg: ${ref}`);
  return value;
}

/** The symbol in brand colours, or a single colour (Android monochrome icon). */
const symbol = (mono) => source.replace(/\{\{([\w.]+)\}\}/g, (_, ref) => mono ?? colour(ref));
const background = colour('ink.950');

/** Symbol centred on a square canvas, occupying `scale` of its width. */
async function render(file, size, { scale, bg, mono } = {}) {
  const inner = Math.round(size * scale);
  const art = await sharp(Buffer.from(symbol(mono)), { density: Math.max(72, (inner / 64) * 72) })
    .resize(inner, inner)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toFile(out(file));
  console.log(`wrote assets/images/${file} (${size}x${size})`);
}

(async () => {
  await render('icon.png', 1024, { scale: 0.62, bg: background });
  // Android adaptive icon: keep the symbol inside the 66% safe zone.
  await render('android-icon-foreground.png', 512, { scale: 0.5 });
  await sharp({ create: { width: 512, height: 512, channels: 4, background } }).png().toFile(out('android-icon-background.png'));
  console.log('wrote assets/images/android-icon-background.png (512x512)');
  await render('android-icon-monochrome.png', 512, { scale: 0.5, mono: '#ffffff' });
  await render('splash-icon.png', 512, { scale: 1 });
  await render('favicon.png', 48, { scale: 0.86, bg: background });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
