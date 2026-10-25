import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const artifactDirectory = path.resolve(root, process.argv[2] ?? path.join('dist', 'release'));
const outputName = 'SHA256SUMS';
const entries = (await readdir(artifactDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name !== outputName)
  .sort((left, right) => left.name.localeCompare(right.name));

if (entries.length === 0) {
  throw new Error(`No release artifacts found in ${artifactDirectory}`);
}

const lines = [];
for (const entry of entries) {
  const contents = await readFile(path.join(artifactDirectory, entry.name));
  const digest = createHash('sha256').update(contents).digest('hex');
  lines.push(`${digest}  ${entry.name}`);
}

await writeFile(path.join(artifactDirectory, outputName), `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${entries.length} SHA-256 checksum(s) to ${path.join(artifactDirectory, outputName)}`);
