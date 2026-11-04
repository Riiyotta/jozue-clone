// R12 parity harness, step 1 of 2: capture live and clone at the SAME viewport and the SAME
// scroll offsets, one set of viewport screenshots per semantic section.
//
//   CHROME_PATH=<Chromium binary> PLAYWRIGHT_MODULE=<playwright index.mjs or "playwright"> \
//   LIVE_URL=https://jozue.fr CLONE_URL=http://localhost:5190 OUT_DIR=<empty temp dir> \
//   node extraction/parity_capture.mjs
// then: python3 extraction/parity_compare.py <OUT_DIR>
//
// Determinism: intro skipped via localStorage 'jozue:intro-seen' = Date.now(); filter state
// cleared; CSS animations paused; the rotating hero title, the cycling filter words, the
// filter island, the hint band, the about marquee, the looping signature drawings and video
// frames are masked (identical solid box on both sides). Scroll offsets come from the clone's
// own section tops and are reused verbatim for the live page.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LIVE = process.env.LIVE_URL || 'https://jozue.fr';
const CLONE = process.env.CLONE_URL || 'http://localhost:5190';
const OUT = process.env.OUT_DIR;
if (!OUT) { console.error('OUT_DIR is required'); process.exit(2); }
const ROUTES = (process.env.ROUTES || '/,/fr/,/works/arte/,/works/billy/,/works/youtube/,/works/fnac-darty/,/works/graille-sur-le-rail/,/404/').split(',');
const VP = { width: 1440, height: 900 };
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;

const SECTION_SELECTORS = [
  ['#intro', 'hero.home-intro'], ['#works', 'works.selected-header'], ['.js-works-container > .js-works', 'works.card-list'],
  ['.got-project', 'cta.got-project'], ['.homepage__talk--404', 'hero.not-found'], ['#contact', 'contact.details'],
  ['.homepage__talk', 'cta.lets-talk'], ['.homepage__awards', 'proof.awards'], ['#about', 'about.bio'],
  ['.homepage__partners', 'proof.partners'], ['.project-head', 'hero.work-head'], ['.project-hero-container', 'media.work-hero-image'],
  ['.project-app', 'showcase.app-window'], ['.project-irl', 'showcase.app-window'], ['.project-mission-bis', 'editorial.mission-text'],
  ['.project-stills-container', 'gallery.stills'], ['.project-reels', 'media.reels'], ['.project-3-img', 'gallery.image-row'],
  ['.project-2-img-container', 'gallery.image-pair'], ['.project-triangle-container', 'gallery.triangle'], ['.project-img-large', 'media.large-image'],
  ['.project-carousel-container', 'gallery.carousel'], ['.project-quote-image-container', 'editorial.quote'], ['.project-palette', 'brand.palette'],
  ['.project-cards-container', 'gallery.cards'], ['.project-link', 'cta.project-link'], ['#project-credit', 'credits.project-credits'],
  ['.project-more-works', 'index.more-works'],
];
// Only genuinely time-varying elements are masked; masked pixels are EXCLUDED from the score
// (parity_compare.py), so a mask can never inflate parity.
// The looping signature layers are NOT masked: their strokes are faint (alpha ~0.05) and the
// per-pixel tolerance absorbs them; masking them would hide the whole let's-talk band.
const MASKS = ['.homepage__main-title', '.filter-slot', '.js-filter-island', '.hint-band', '.homepage__what-ul',
  'video', '.typewrite__caret'];
const FREEZE = '*,*::before,*::after{animation-play-state:paused!important;caret-color:transparent!important}';

async function open(browser, base, route) {
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.setItem('jozue:intro-seen', String(Date.now())); sessionStorage.removeItem('jozue:filter'); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  // walk the page once so lazy media and scroll reveals settle, then return to top
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  await page.addStyleTag({ content: FREEZE });
  return { ctx, page, H };
}

async function sections(page) {
  return page.evaluate((MAP) => {
    const seen = new Set(); const out = [];
    for (const [sel, id] of MAP) for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el)) continue; let a = el.parentElement, nested = false;
      while (a) { if (seen.has(a)) { nested = true; break; } a = a.parentElement; }
      seen.add(el); if (nested) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.position === 'fixed') continue;
      const b = el.getBoundingClientRect(); if (b.height < 20) continue;
      out.push({ id, top: Math.round(b.top + scrollY), h: Math.round(b.height) });
    }
    return out.sort((a, b) => a.top - b.top);
  }, SECTION_SELECTORS);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const manifest = { viewport: '1440x900', live: LIVE, clone: CLONE, masks: MASKS, freezeCss: FREEZE, routes: {} };
for (const route of ROUTES) {
  const key = route.replace(/\//g, '_') || '_';
  const clone = await open(browser, CLONE, route);
  const live = await open(browser, LIVE, route);
  const secs = await sections(clone.page);
  const maxScroll = Math.max(0, clone.H - VP.height);
  const shots = [];
  for (const [i, s] of secs.entries()) {
    for (let off = s.top; off < s.top + s.h; off += VP.height) {
      const want = Math.min(off, maxScroll);
      const rec = { section: s.id, index: i, scrollY: want };
      for (const [name, t] of [['clone', clone], ['live', live]]) {
        // live is driven to the offset the clone actually reached, so both shots share it
        const target = name === 'clone' ? want : rec.cloneScrollY;
        await t.page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), target);
        await t.page.waitForTimeout(900);
        rec[name + 'ScrollY'] = await t.page.evaluate(() => Math.round(scrollY));
        const file = join(OUT, key, `${String(shots.length).padStart(3, '0')}-${name}.png`);
        mkdirSync(join(OUT, key), { recursive: true });
        await t.page.screenshot({ path: file, mask: MASKS.map((m) => t.page.locator(m)), maskColor: '#ff00ff' });
        rec[name] = file.slice(OUT.length + 1);
      }
      // crop to the rows the section really occupies at the scroll offset actually reached
      const y = rec.cloneScrollY;
      rec.cropY0 = Math.max(0, Math.max(s.top, y) - y); rec.cropY1 = Math.min(VP.height, Math.min(s.top + s.h, y + VP.height) - y);
      if (rec.cropY1 - rec.cropY0 < 20) continue;
      shots.push(rec);
    }
  }
  manifest.routes[route] = { cloneHeight: clone.H, liveHeight: live.H, sections: secs, shots };
  await clone.ctx.close(); await live.ctx.close();
  process.stderr.write(`${route} clone ${clone.H} live ${live.H} shots ${shots.length}\n`);
}
await browser.close();
writeFileSync(join(OUT, 'capture.json'), JSON.stringify(manifest, null, 1));
