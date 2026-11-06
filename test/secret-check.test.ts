// The pre-commit secret check (Feature 5, Part A). Fake secrets are built at run time,
// so this file never contains a matching literal itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, '../scripts/secret-check.js');
const { scanLine } = require(script) as { scanLine: (file: string, line: string) => string[] };

const fakeAws = () => ['AK', 'IA', 'Q'.repeat(16)].join('');

test('patterns: secrets are caught; placeholders pass', () => {
  assert.ok(scanLine('src/x.ts', `const k = '${fakeAws()}';`).includes('aws-access-key'));
  assert.ok(scanLine('.env.example', `EXPO_PUBLIC_API_KEY=${'a9F'.repeat(12)}`).some((t) => t.startsWith('secret-value')));
  for (const ok of ['EXPO_PUBLIC_API_URL=http://localhost:4000', 'API_TOKEN=', 'SECRET=changeme']) assert.deepEqual(scanLine('.env.example', ok), [], ok);
});

test('the pre-commit hook refuses a commit with a fake secret or a .env file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-hook-'));
  const git = (...args: string[]) => spawnSync('git', ['-c', 'user.name=Hook Test', '-c', 'user.email=hook@example.com', ...args], { cwd: dir, encoding: 'utf8' });
  try {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    fs.mkdirSync(path.join(dir, 'scripts'));
    fs.copyFileSync(script, path.join(dir, 'scripts/secret-check.js'));
    fs.writeFileSync(path.join(dir, '.git/hooks/pre-commit'), '#!/bin/sh\nnode scripts/secret-check.js --staged\n', { mode: 0o755 });
    fs.writeFileSync(path.join(dir, 'config.js'), `export const key = '${fakeAws()}';\n`);
    git('add', '.');
    let r = git('commit', '-q', '-m', 'with a key');
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /aws-access-key/);
    assert.doesNotMatch(r.stderr, new RegExp(fakeAws()));
    fs.writeFileSync(path.join(dir, 'config.js'), 'export const key = process.env.KEY;\n');
    fs.writeFileSync(path.join(dir, '.env.local'), 'KEY=anything\n');
    git('add', '-f', '.');
    r = git('commit', '-q', '-m', 'with env');
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /env-file-committed/);
    git('rm', '-q', '--cached', '.env.local');
    r = git('commit', '-q', '-m', 'clean');
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
