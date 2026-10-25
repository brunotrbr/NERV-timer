import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const host = '127.0.0.1';
const port = 4173;
const documentRoot = path.resolve(process.cwd(), 'resources');
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.eot', 'application/vnd.ms-fontobject'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

export default async function startTestServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
      const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
      const filePath = path.resolve(documentRoot, relativePath);
      if (filePath !== documentRoot && !filePath.startsWith(`${documentRoot}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }

      const contents = await readFile(filePath);
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream'
      });
      response.end(contents);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  return async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  };
}
