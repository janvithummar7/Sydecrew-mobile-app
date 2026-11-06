#!/usr/bin/env node
/**
 * Typed API contract (integration pass §3). From the pinned copies the backend
 * exports (Sydecrew-be: `npm run contract:export`):
 *   contracts/openapi.json -> src/lib/contract/schema.ts   (openapi-typescript)
 *                          -> src/lib/contract/enums.ts    (every enum component, as const arrays + types)
 *   contracts/errors.json  -> src/lib/contract/errors.ts   (friendly message per error code)
 *   node scripts/contract.mjs          write
 *   node scripts/contract.mjs --check  exit 1 when a generated file differs (drift)
 */
import fs from 'node:fs';
import path from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';

const root = process.cwd();
const check = process.argv.includes('--check');
const specPath = path.join(root, 'contracts/openapi.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const errors = JSON.parse(fs.readFileSync(path.join(root, 'contracts/errors.json'), 'utf8'));
const HEAD = '/* GENERATED from contracts/*.json by scripts/contract.mjs. Do not edit; run `npm run contract:gen`. */\n';

const ast = await openapiTS(new URL(`file:///${specPath.replace(/\\/g, '/')}`));
const schemaTs = `${HEAD}${astToString(ast)}`;

let enumsTs = HEAD;
for (const [name, s] of Object.entries(spec.components.schemas).sort(([a], [b]) => a.localeCompare(b))) {
  if (!Array.isArray(s.enum)) continue;
  enumsTs += `\nexport const ${name}Values = ${JSON.stringify(s.enum)} as const;\nexport type ${name} = (typeof ${name}Values)[number];\n`;
}

const errorsTs = `${HEAD}\n/** Friendly message for each API error code (the API's own message is the fallback). */\nexport const ERROR_MESSAGES: Record<string, string> = ${JSON.stringify(errors, null, 2)};\n`;

const outputs = [
  ['src/lib/contract/schema.ts', schemaTs],
  ['src/lib/contract/enums.ts', enumsTs],
  ['src/lib/contract/errors.ts', errorsTs],
];

let drift = 0;
for (const [rel, body] of outputs) {
  const file = path.join(root, rel);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
  if (current === body) continue;
  if (check) {
    console.error(`Contract drift: ${rel} does not match contracts/. Run \`npm run contract:gen\`.`);
    drift += 1;
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    console.log(`wrote ${rel}`);
  }
}
if (check && drift) process.exit(1);
if (check) console.log(`Contract OK: ${Object.keys(spec.paths).length} paths, ${Object.keys(spec.components.schemas).length} schemas.`);
