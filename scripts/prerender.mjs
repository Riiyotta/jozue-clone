// Production build: renders every route's React page to static HTML in dist/, plus public assets.
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { render, routeList } = await server.ssrLoadModule('/src/entry-server.jsx');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
  for (const route of routeList) {
    const file = path.join(dist, route, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, render(route));
  }
  fs.copyFileSync(path.join(dist, '404', 'index.html'), path.join(dist, '404.html')); // static hosts serve this for unknown URLs
  console.log(`Rendered ${routeList.length} routes to dist/`);
} finally {
  await server.close();
}
