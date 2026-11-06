#!/usr/bin/env node
'use strict';

/**
 * Secret check (Feature 5, Part A). The same file is committed in all three
 * Sydecrew repos. It never prints a secret value: findings name the file,
 * line, commit and secret type only.
 *
 *   node scripts/secret-check.js --staged    pre-commit hook: the staged diff
 *   node scripts/secret-check.js --tracked   CI (npm run precheck): every tracked file at HEAD
 *   node scripts/secret-check.js --history   every commit on every branch and tag (git log -p --all)
 *   node scripts/secret-check.js --env       env:check: .env.example files hold placeholders only
 *
 * Refused:
 *   - committing a .env file (anything named .env or .env.* except *.example);
 *   - private keys, AWS / GitHub / Slack / Google / Stripe / Razorpay keys, JWTs;
 *   - database URLs with a password for a non-local host;
 *   - KEY=value lines whose key looks secret (SECRET, KEY, TOKEN, PASSWORD, PEPPER, …)
 *     with a value that is not a placeholder;
 *   - in .env.example: any value that is not empty, "changeme", "<…>", a localhost
 *     default, or (for non-secret keys) a short plain setting such as "mock", "true", "4000".
 * A line can opt out with the marker `secret-check-allow` (for documented test vectors).
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ALLOW_MARK = 'secret-check-allow';
const SECRET_KEY = /(SECRET|PASSWORD|PASSWD|TOKEN|API_?KEY|ACCESS_KEY|PRIVATE|PEPPER|CREDENTIAL|ENCRYPTION_KEYS?|DSN|DATABASE_URL|_KEY$|SUPER_ADMIN_EMAIL)/i;
const PLACEHOLDER_WORDS = /(changeme|change-me|placeholder|example|dummy|your[-_]|xxx|<[^>]*>|test|dev[-_]only|sydecrew-dev|mock|fake|sample|perf)/i;

const PATTERNS = [
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['aws-access-key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ['slack-token', /\bxox[abposr]-[A-Za-z0-9-]{10,}/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['stripe-live-key', /\b[sr]k_live_[0-9A-Za-z]{16,}/],
  ['razorpay-key', /\brzp_(?:live|test)_[0-9A-Za-z]{14,}/],
  ['jwt', /\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/],
];

/** A database URL that carries a password and points at a host that is not local. */
function dbUrlWithPassword(line) {
  const m = line.match(/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/([^:\s/@'"]+):([^@\s'"]+)@([^/:\s'"]+)/i); // secret-check-allow (the pattern itself)
  if (!m) return false;
  const [, , pass, host] = m;
  if (/^(localhost|127\.0\.0\.1|db|postgres|0\.0\.0\.0)$/i.test(host)) return false;
  return !PLACEHOLDER_WORDS.test(pass);
}

const isPlaceholder = (v) => {
  const s = v.trim().replace(/^['"]|['"]$/g, '');
  if (!s) return true;
  if (/^(changeme|change-me)$/i.test(s) || /^<[^>]*>$/.test(s)) return true;
  if (/^\d{1,7}$/.test(s) || /^(true|false)$/i.test(s)) return true; // TTLs, sizes and flags (ACCESS_TOKEN_TTL_SECONDS=900)
  if (/^[a-z][a-z0-9+.-]*:\/\/[^@/]*@?(localhost|127\.0\.0\.1)([:/]|$)/i.test(s) || /^https?:\/\/(localhost|127\.0\.0\.1)([:/]|$)/i.test(s)) return true;
  return false;
};
/** A short, plain, non-secret setting: mock, true, 4000, development, ap-south-1, s3, Asia/Kolkata. */
const isPlainSetting = (v) => /^[A-Za-z0-9_./:-]{0,24}$/.test(v.trim()) && !/^[A-Za-z0-9+/=_-]{20,}$/.test(v.trim());

/** Findings for one added line of a file. */
function scanLine(file, line) {
  if (line.includes(ALLOW_MARK)) return [];
  const out = [];
  for (const [type, re] of PATTERNS) if (re.test(line)) out.push(type);
  if (dbUrlWithPassword(line)) out.push('database-url-with-password');
  const kv = line.match(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/);
  if (kv && SECRET_KEY.test(kv[1])) {
    const value = kv[2].replace(/\s+#.*$/, '').trim();
    if (!isPlaceholder(value) && !PLACEHOLDER_WORDS.test(value)) out.push(`secret-value:${kv[1]}`);
  }
  if (/\.env(\.[\w-]+)?\.example$/.test(file) && kv && !SECRET_KEY.test(kv[1])) {
    const value = kv[2].replace(/\s+#.*$/, '').trim();
    if (!isPlaceholder(value) && !isPlainSetting(value)) out.push(`non-placeholder:${kv[1]}`);
  }
  return out;
}

const isEnvFile = (file) => {
  const base = path.basename(file);
  return /^\.env(\..+)?$/.test(base) && !/\.example$/.test(base);
};

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 512 });
}

/** Parses `git diff`/`git log -p` output into findings. */
function scanPatch(patch, { commitLabel = 'staged' } = {}) {
  const findings = [];
  let commit = commitLabel;
  let file = null;
  let lineNo = 0;
  for (const raw of patch.split('\n')) {
    if (raw.startsWith('commit ') && /^commit [0-9a-f]{40}/.test(raw)) {
      commit = raw.slice(7, 14);
      continue;
    }
    if (raw.startsWith('+++ ')) {
      file = raw.slice(4).replace(/^b\//, '');
      if (file !== '/dev/null' && isEnvFile(file)) findings.push({ commit, file, line: 0, type: 'env-file-committed' });
      continue;
    }
    if (raw.startsWith('@@')) {
      const m = raw.match(/\+(\d+)/);
      lineNo = m ? Number(m[1]) - 1 : 0;
      continue;
    }
    if (raw.startsWith('+') && file) {
      lineNo += 1;
      for (const type of scanLine(file, raw.slice(1))) findings.push({ commit, file, line: lineNo, type });
    } else if (!raw.startsWith('-')) lineNo += 1;
  }
  return findings;
}

function scanEnvExamples(root = process.cwd()) {
  const files = git(['ls-files']).split('\n').filter((f) => /(^|\/)\.env(\.[\w-]+)?\.example$/.test(f));
  const findings = [];
  for (const f of files) {
    fs.readFileSync(path.join(root, f), 'utf8')
      .split(/\r?\n/)
      .forEach((l, i) => {
        for (const type of scanLine(f, l)) findings.push({ commit: 'working tree', file: f, line: i + 1, type });
      });
  }
  return { files, findings };
}

function report(findings, what) {
  const uniq = [...new Map(findings.map((f) => [`${f.commit}|${f.file}|${f.line}|${f.type}`, f])).values()];
  if (!uniq.length) {
    console.log(`secret-check: ${what}: clean`);
    return 0;
  }
  console.error(`secret-check: ${what}: ${uniq.length} finding(s) (values are never printed):`);
  for (const f of uniq) console.error(`  ${f.commit}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.type}`);
  console.error('Remove the secret (use .env, which is git-ignored), or mark a documented test vector with "secret-check-allow".');
  return 1;
}

function main() {
  const mode = process.argv[2] || '--staged';
  if (mode === '--staged') {
    const names = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR']).split('\n').filter(Boolean);
    const findings = names.filter(isEnvFile).map((file) => ({ commit: 'staged', file, line: 0, type: 'env-file-committed' }));
    findings.push(...scanPatch(git(['diff', '--cached', '--unified=0', '--no-color', '--diff-filter=ACMR'])));
    const env = scanEnvExamples();
    findings.push(...env.findings);
    return report(findings, 'staged changes');
  }
  if (mode === '--tracked') {
    const files = git(['ls-files']).split('\n').filter(Boolean);
    const findings = files.filter(isEnvFile).map((file) => ({ commit: 'HEAD', file, line: 0, type: 'env-file-committed' }));
    for (const f of files) {
      if (/\.(png|jpe?g|webp|gif|ico|woff2?|ttf|zip|hbc|lock)$/i.test(f) || f.endsWith('package-lock.json')) continue;
      let text;
      try {
        text = fs.readFileSync(f, 'utf8');
      } catch {
        continue;
      }
      text.split(/\r?\n/).forEach((l, i) => {
        for (const type of scanLine(f, l)) findings.push({ commit: 'HEAD', file: f, line: i + 1, type });
      });
    }
    return report(findings, `${files.length} tracked files`);
  }
  if (mode === '--history') {
    const patch = git(['log', '-p', '--all', '--no-color', '--unified=0', '--format=commit %H']);
    return report(scanPatch(patch), 'full history (all branches and tags)');
  }
  if (mode === '--env') {
    const { files, findings } = scanEnvExamples();
    return report(findings, `env:check (${files.join(', ') || 'no .env.example'})`);
  }
  console.error(`Unknown mode ${mode}`);
  return 2;
}

if (require.main === module) process.exit(main());
module.exports = { scanLine, scanPatch, isEnvFile, isPlaceholder };
