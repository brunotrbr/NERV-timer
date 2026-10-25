import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), 'utf8');

async function exists(file) {
  try {
    await access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

test('native window close always terminates the application process', async () => {
  const config = JSON.parse(await read('neutralino.config.json'));
  const desktop = await read('resources/js/desktop.js');

  assert.equal(config.modes.window.exitProcessOnClose, true);
  assert.match(desktop, /Neutralino\.events\.on\(['"]windowClose['"]/);
  assert.match(desktop, /Neutralino\.app\.exit\(\)/);
  assert.deepEqual(config.nativeAllowList, ['app.exit']);
});

test('resources is the only application source tree', async () => {
  const forbidden = [
    'index.html', 'style.css', 'manifest.json', 'favicon.ico', 'js', 'images',
    'icons', 'src', 'testxml.php', 'error_log', 'desktop.ini'
  ];
  const present = [];
  for (const file of forbidden) {
    if (await exists(file)) present.push(file);
  }
  assert.deepEqual(present, []);
});

test('public repository metadata and text policies are present', async () => {
  const required = [
    '.gitattributes', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md',
    '.github/ISSUE_TEMPLATE/bug_report.yml',
    '.github/ISSUE_TEMPLATE/feature_request.yml',
    '.github/pull_request_template.md',
    '.github/dependabot.yml'
  ];
  const missing = [];
  for (const file of required) {
    if (!await exists(file)) missing.push(file);
  }
  assert.deepEqual(missing, []);
});

test('release workflow pins actions, NSIS, and publishes checksums', async () => {
  const workflow = await read('.github/workflows/release.yml');
  const mutableActions = [...workflow.matchAll(/uses:\s+[^\s@]+@([^\s#]+)/g)]
    .map((match) => match[1])
    .filter((ref) => !/^[0-9a-f]{40}$/.test(ref));

  assert.deepEqual(mutableActions, []);
  assert.match(workflow, /choco install nsis --version[= ]/);
  assert.match(workflow, /npm run checksums/);
  assert.match(workflow, /SHA256SUMS/);
});

test('package exposes reproducible validation and checksum commands', async () => {
  const pkg = JSON.parse(await read('package.json'));
  for (const script of ['dev', 'test', 'build', 'package:windows', 'package:debian', 'checksums']) {
    assert.equal(typeof pkg.scripts[script], 'string', `missing npm script: ${script}`);
  }
});
