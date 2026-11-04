import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: every route is server-rendered from the React page components on request,
// so swup's fetch()-based page transitions get real HTML documents, as on the original.
function reactPages() {
  return {
    name: 'react-static-pages',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' || !(req.headers.accept || '').includes('text/html') && !req.url.endsWith('/')) return next();
        try {
          const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
          let html = render(req.url);
          if (!html) {
            // Unknown route: serve the original's 404 page (only for document requests, not assets).
            if (/\.[a-z0-9]+$/i.test(req.url.split('?')[0])) return next();
            html = render('/404/');
            res.statusCode = 404;
          }
          html = html.replace('</head>', '<script type="module" src="/@vite/client"></script></head>');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (e) {
          server.ssrFixStacktrace(e);
          next(e);
        }
      });
      // Full reload whenever a component/page changes (pages are not hydrated, so no HMR).
      server.watcher.on('change', (f) => { if (f.includes('/src/')) server.ws.send({ type: 'full-reload' }); });
    },
  };
}

export default defineConfig({
  plugins: [react(), reactPages()],
  appType: 'custom',
  server: { port: 5190, strictPort: true },
});
