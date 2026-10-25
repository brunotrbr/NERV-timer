import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'dist', 'installers', 'debian');
const deb = (await readdir(outputDir)).find((file) => file.endsWith('.deb'));
if (!deb) throw new Error(`No Debian package found in ${outputDir}`);

const packagePath = path.join(outputDir, deb);
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'nerv-timer-deb-'));

function dpkg(...args) {
  const result = spawnSync('dpkg-deb', args, { encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'dpkg-deb failed');
}

try {
  dpkg('-R', packagePath, temporaryDirectory);
  const controlPath = path.join(temporaryDirectory, 'DEBIAN', 'control');
  let control = await readFile(controlPath, 'utf8');
  control = control.replace(/^Package:.*$/m, 'Package: nerv-timer');
  if (/^Depends:/m.test(control)) {
    control = control.replace(/^Depends:.*$/m, 'Depends: libwebkit2gtk-4.1-0 | libwebkit2gtk-4.0-37');
  } else {
    control += '\nDepends: libwebkit2gtk-4.1-0 | libwebkit2gtk-4.0-37\n';
  }
  await writeFile(controlPath, control);
  dpkg('-b', temporaryDirectory, packagePath);
  console.log(`Patched Debian metadata: ${path.relative(process.cwd(), packagePath)}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
