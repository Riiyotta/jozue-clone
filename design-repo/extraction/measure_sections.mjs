// Re-measure semantic section heights at 1440x900 for every route.
//
//   CHROME_PATH=<path to a Chromium/Chrome binary> \
//   PLAYWRIGHT_MODULE=<path to playwright's index.mjs, or "playwright" if resolvable> \
//   BASE_URL=http://localhost:5190 \
//   node extraction/measure_sections.mjs > heights.json
//
// No absolute path is stored in this repo: the browser binary and the playwright module
// both come from environment variables. Routes come from templates/routes.json.
// The intro preloader is skipped by setting localStorage 'jozue:intro-seen' to Date.now()
// (the site's own return-visit rule, see extraction/measured-values.json -> introSkip).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL || 'http://localhost:5190';
const VIEWPORT = { width: 1440, height: 900 };
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const routes = JSON.parse(readFileSync(join(ROOT, 'templates/routes.json'), 'utf8')).routes;

// DOM selector -> semantic section id. Same table the contracts cite in source.tag.
// Outermost match wins, so a block nested inside another matched block is not counted twice.
const MAP = [
  ['#js-intro', 'shell.intro-preloader'],
  ['#js-transi', 'shell.page-transition'],
  ['#js-menu', 'shell.site-menu'],
  ['.js-filter-island', 'utility.filter-island'],
  ['#intro', 'hero.home-intro'],
  ['#works', 'works.selected-header'],
  ['.js-works-container > .js-works', 'works.card-list'],
  ['#js-load-more-container', 'works.card-list'],
  ['.got-project', 'cta.got-project'],
  ['.homepage__talk--404', 'hero.not-found'],
  ['#contact', 'contact.details'],
  ['.homepage__talk', 'cta.lets-talk'],
  ['.homepage__awards', 'proof.awards'],
  ['#about', 'about.bio'],
  ['.homepage__partners', 'proof.partners'],
  ['.project-head', 'hero.work-head'],
  ['.project-hero-container', 'media.work-hero-image'],
  ['.project-app', 'showcase.app-window'],
  ['.project-irl', 'showcase.app-window'],
  ['.project-mission-bis', 'editorial.mission-text'],
  ['.project-stills-container', 'gallery.stills'],
  ['.project-reels', 'media.reels'],
  ['.project-3-img', 'gallery.image-row'],
  ['.project-2-img-container', 'gallery.image-pair'],
  ['.project-triangle-container', 'gallery.triangle'],
  ['.project-img-large', 'media.large-image'],
  ['.project-carousel-container', 'gallery.carousel'],
  ['.project-quote-image-container', 'editorial.quote'],
  ['.project-palette', 'brand.palette'],
  ['.project-cards-container', 'gallery.cards'],
  ['.project-link', 'cta.project-link'],
  ['.js-credit-title', 'credits.project-credits'],
  ['#project-credit', 'credits.project-credits'],
  ['.project-more-works', 'index.more-works'],
  ['.js-project-list', 'index.more-works'],
];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
await ctx.addInitScript(() => {
  try { localStorage.setItem('jozue:intro-seen', String(Date.now())); sessionStorage.removeItem('jozue:filter'); } catch (e) {}
});
const page = await ctx.newPage();
const out = { viewport: '1440x900', baseUrl: BASE, measuredAt: new Date().toISOString(), routes: {} };
for (const r of routes) {
  await page.goto(BASE + r.path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const res = await page.evaluate((MAP) => {
    const seen = new Set(); const hits = [];
    const fixedLike = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
    for (const [sel, id] of MAP) {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        let anc = el.parentElement, nested = false;
        while (anc) { if (seen.has(anc)) { nested = true; break; } anc = anc.parentElement; }
        seen.add(el); if (nested) continue;
        const b = el.getBoundingClientRect();
        const hidden = getComputedStyle(el).display === 'none';
        hits.push({ id, sel, top: Math.round((b.top + scrollY) * 10) / 10, h: Math.round(b.height * 10) / 10, inFlow: !hidden && !fixedLike(el), hidden });
      }
    }
    return { pageHeight: document.documentElement.scrollHeight, hits };
  }, MAP);
  // aggregate contiguous instances of the same section id (e.g. credits title band + credit grid)
  const sections = [];
  for (const h of res.hits.sort((a, b) => a.top - b.top)) {
    const last = sections[sections.length - 1];
    if (h.inFlow && last && last.id === h.id && last.inFlow && Math.abs(last.top + last.h - h.top) < 2) { last.h = Math.round((last.h + h.h) * 10) / 10; continue; }
    sections.push({ id: h.id, top: h.top, h: h.h, inFlow: h.inFlow, ...(h.hidden ? { hidden: true } : {}) });
  }
  out.routes[r.path] = { template: r.template, pageHeight: res.pageHeight, sections };
  process.stderr.write(`${r.path} ${res.pageHeight} ${sections.length}\n`);
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
