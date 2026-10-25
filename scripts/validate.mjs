import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const config = JSON.parse(await readFile(path.join(root, 'neutralino.config.json'), 'utf8'));

const errors = [];
if (pkg.version !== config.version) {
  errors.push(`Version mismatch: package.json=${pkg.version}, neutralino.config.json=${config.version}`);
}

const tag = process.env.GITHUB_REF_TYPE === 'tag' ? process.env.GITHUB_REF_NAME : process.env.RELEASE_TAG;
if (tag && tag !== `v${pkg.version}`) {
  errors.push(`Release tag ${tag} must match v${pkg.version}`);
}

const requiredFiles = [
  'resources/index.html',
  'resources/style.css',
  'resources/js/neutralino.js',
  'resources/js/vendor/howler.min.js',
  'resources/src/sounds/tic.mp3',
  'resources/src/sounds/ping.mp3',
  'resources/src/sounds/the-beast.mp3',
  'resources/src/sounds/NervShutdown.mp3',
  'installerassets/windows/app.ico',
  'installerassets/linux/app.png'
];

for (const file of requiredFiles) {
  try {
    await access(path.join(root, file));
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const html = await readFile(path.join(root, 'resources', 'index.html'), 'utf8');
const externalRuntimeReference = /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//i.test(html);
if (externalRuntimeReference) errors.push('resources/index.html contains an external runtime dependency');

if (Number(config.cli.binaryVersion.split('.')[0]) < 6) {
  errors.push('Neutralino framework 6.3 or newer is required for embedded resources');
}

const forbiddenRootEntries = [
  'index.html', 'style.css', 'manifest.json', 'favicon.ico', 'js', 'images',
  'icons', 'src', 'testxml.php', 'error_log', 'desktop.ini'
];
const rootEntries = new Set(await readdir(root));
for (const entry of forbiddenRootEntries) {
  if (rootEntries.has(entry)) errors.push(`Forbidden legacy path: ${entry}`);
}

async function findForbiddenFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', '.tmp', 'node_modules', 'bin', 'dist', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const relative = path.relative(root, path.join(directory, entry.name));
    if (/^(?:desktop\.ini|\.DS_Store)$/i.test(entry.name) || /\.(?:log|zip|wav)$/i.test(entry.name)) {
      errors.push(`Forbidden repository file: ${relative}`);
    }
    if (entry.name === '__MACOSX') errors.push(`Forbidden repository directory: ${relative}`);
    if (entry.isDirectory()) await findForbiddenFiles(path.join(directory, entry.name));
  }
}

await findForbiddenFiles(root);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`NERV Timer ${pkg.version} configuration is valid.`);
