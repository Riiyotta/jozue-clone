import { renderToStaticMarkup } from 'react-dom/server';
import { routes } from './routes.js';

// Pages are rendered to static HTML (no hydration): the original motion engine
// (public/_astro/*.js) and swup own the DOM on the client, exactly like on jozue.fr.
export function render(url) {
  const pathname = url.split(/[?#]/)[0].replace(/\/?$/, '/').replace(/^\/index\.html\/$/, '/');
  const Page = routes[pathname];
  if (!Page) return null;
  return '<!DOCTYPE html>' + renderToStaticMarkup(<Page />);
}

export const routeList = Object.keys(routes);
