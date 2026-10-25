import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const vendorDir = path.join(root, 'resources', 'js', 'vendor');
const windowsAssets = path.join(root, 'installerassets', 'windows');
const linuxAssets = path.join(root, 'installerassets', 'linux');
const builderConfig = path.join(root, 'node_modules', '@neutralinojs-contrib', 'builder', 'neutralino.config.json');

await Promise.all([
  mkdir(vendorDir, { recursive: true }),
  mkdir(windowsAssets, { recursive: true }),
  mkdir(linuxAssets, { recursive: true })
]);

await Promise.all([
  copyFile(path.join(root, 'node_modules', 'howler', 'dist', 'howler.min.js'), path.join(vendorDir, 'howler.min.js')),
  copyFile(path.join(root, 'resources', 'icons', 'appIcon.png'), path.join(linuxAssets, 'app.png'))
]);

const iconSource = path.join(root, 'resources', 'icons', 'appIcon.png');
const icon = await pngToIco(iconSource);
await writeFile(path.join(windowsAssets, 'app.ico'), icon);

// Builder 1.0.0 resolves configuration beside the plugin instead of from the
// application working directory. Keep its installed copy synchronized until
// the upstream resolver uses process.cwd().
try {
  await copyFile(path.join(root, 'neutralino.config.json'), builderConfig);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Fail early if package installation produced empty vendor files.
for (const file of ['howler.min.js']) {
  const contents = await readFile(path.join(vendorDir, file));
  if (contents.length === 0) throw new Error(`Generated vendor file is empty: ${file}`);
}
