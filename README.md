# jozue.fr — replica

An exact replica of https://jozue.fr (EN + FR home and all 18 work pages, 38 routes), built as React components.

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # static site in dist/ (one index.html per route)
```

## How it is built

- **`src/components/`**: one React component per page section (Hero, SelectedWorks, FilterIsland, WorksList, Awards, About, Partners, Contact, Menu, ProjectHead, ProjectContent…). Sections that appear on several pages are shared, and what changes between pages (text, links, images) comes in as props.
- **`src/pages/`**: one component per route. Each one holds its own `content` object (copy, links, images) and puts the sections together.
- **Rendering**: pages are server-rendered with `react-dom/server`, by the Vite middleware in dev and by `scripts/prerender.mjs` for the build. They are **not hydrated**. The original stylesheet and motion engine in `public/_astro/` (swup page transitions, intro, parallax, reveals, filter island) control the DOM in the browser, the same way they do on jozue.fr. That is why the motion is identical rather than an approximation.
- **Assets**: all fonts (Neue Haas Grotesk Display 55/75), images (every responsive variant), videos and favicons are local in `public/`, at the same paths as on the original.

## Verifying fidelity

- `scripts/verify-dom.sh`: renders every route and diffs its DOM against the original server HTML (`.recon/pages/`). Expected output: `All 38 routes: DOM identical to original`.
- `scripts/convert.mjs`: regenerates the components from `.recon/pages/` if the original site changes. Re-fetch the pages first.

## Differences from production

- The Vercel Analytics script (`/_vercel/insights`) is removed because it only works on Vercel.
- The YouTube embeds on work pages (lazyframe) still load from youtube.com.
- Canonical / Open Graph URLs still point to https://jozue.fr.
- Tailwind is deliberately not used. Its preflight reset and utility layer would change the original cascade, and the goal is to reproduce that cascade exactly.
