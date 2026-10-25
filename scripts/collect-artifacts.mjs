import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const COPY_RETRIES = 8;
const COPY_RETRY_DELAY_MS = 250;

const mode = process.argv[2];
const root = process.cwd();
const dist = path.join(root, 'dist');
const release = path.join(dist, 'release');
const { version } = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(path.join(root, 'package.json'), 'utf8')));

async function walk(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (target.startsWith(release)) continue;
    if (entry.isDirectory()) results.push(...await walk(target));
    else results.push(target);
  }
  return results;
}

await mkdir(release, { recursive: true });
const files = await walk(dist);

async function collect(predicate, destination) {
  const matches = files.filter(predicate);
  if (matches.length === 0) throw new Error(`Unable to locate artifact for ${destination}`);
  const source = matches[0];
  const target = path.join(release, destination);

  // Executable patching and antivirus scans can briefly keep a generated
  // Windows binary open. Retry only transient lock failures.
  for (let attempt = 1; ; attempt += 1) {
    try {
      await copyFile(source, target);
      break;
    } catch (error) {
      const canRetry = ['EBUSY', 'EPERM', 'EACCES'].includes(error.code) && attempt < COPY_RETRIES;
      if (!canRetry) {
        if (['EBUSY', 'EPERM', 'EACCES'].includes(error.code)) {
          throw new Error(
            `Unable to replace ${path.relative(root, target)}. Close the running packaged application and retry.`,
            { cause: error }
          );
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, COPY_RETRY_DELAY_MS * attempt));
    }
  }

  console.log(`${path.relative(root, source)} -> dist/release/${destination}`);
}

if (mode === 'portable' || mode === 'windows') {
  await collect(
    (file) => /nerv-timer-win_x64\.exe$/i.test(file),
    `nerv-timer-${version}-windows-x64.exe`
  );
}

if (mode === 'windows') {
  await collect(
    (file) => file.toLowerCase().endsWith('.exe') && !/nerv-timer-win_x64\.exe$/i.test(file),
    `nerv-timer-setup-${version}-windows-x64.exe`
  );
}

if (mode === 'debian') {
  await collect(
    (file) => file.toLowerCase().endsWith('.deb'),
    `nerv-timer-${version}-debian-x64.deb`
  );
}
