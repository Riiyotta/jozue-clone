Source: https://jozue.fr/

# jozue.fr: clone spec (ground-truth reference for QA)

Measured live on 2026-11-04 with Playwright (Chromium, DPR 1). All numbers are `getComputedStyle` / `getBoundingClientRect` readings unless marked "(token)", which means the value is read from the original motion-token object in `public/_astro/motion.CqR23D0i.js`. The clone loads the original CSS and JS as-is, so every value below should come out the same without extra work. Treat any difference as a DOM or asset bug, not a styling task.

Reference screenshots are in `.recon/ref/` (listed in section 9). The pristine server HTML is `.recon/index.raw.html`.

---

## 0. Stack facts (what the original is)

- Astro static build. Swup page transitions with `containers: ['#swup']`. GSAP is bundled inside `Base.astro_astro_type_script_index_0_lang.o1EI0Byl.js`. No Lenis or other smooth-scroll library: anchor scrolling is GSAP, 1200 ms, `power3.inOut` (token `scroll.duration`, `ease.gsapScroll`).
- `<html lang="en">` gets classes `js swup-enabled` after boot. During the first-visit intro it is `is-intro js swup-enabled`.
- An inline head script controls the intro:
  - `?intro` in the URL removes `localStorage['jozue:intro-seen']` and `sessionStorage['jozue:intro']`, then strips the query with `history.replaceState`. Mode becomes `full`.
  - Mode is `direct` (no loader) if `jozue:intro-seen` is less than 30 days old (`rememberDays = 30`) or if `sessionStorage['jozue:intro']` is set.
  - `prefers-reduced-motion: reduce` sets mode `none`.
  - `moduleMax = 8000` ms is a safety timeout.
- Storage keys: `localStorage['jozue:intro-seen']` (epoch ms), `sessionStorage['jozue:intro'] = "1"`, `sessionStorage['jozue:filter']` (JSON array of active category slugs), `jozue:entry`.

## 1. Route inventory

Internal routes linked from home (`/`):

| Route | How it's linked | Swup? |
|---|---|---|
| `/works/billy/`, `/works/hoppy-road/`, `/works/vianney/`, `/works/graille-sur-le-rail/`, `/works/mijote/`, `/works/la-canute/`, `/works/le-monde-loreal/` (title "Le Monde Plus"), `/works/arte/`, `/works/mc-cain/`, `/works/msa/`, `/works/brico-depot/`, `/works/youtube-ads/`, `/works/series-mania/`, `/works/nicolas-feuillatte/`, `/works/instax/`, `/works/athletic-brewing-company/`, `/works/youtube/`, `/works/fnac-darty/` (18 total, in DOM order) | `a.js-homepage-work` cards | **Yes**: shared-element "arrival" transition (see 4.11) |
| `/fr/` | menu `a.menu-lang__link` | **No**: `data-no-swup`, full reload. Returns 200 text/html. Not recon'd. |
| `/#about`, `/#works`, `/#contact` | menu `a.menu-link` | `data-no-swup`. JS closes the menu and GSAP-scrolls. |
| `#about`, `#works`, `#contact` | `button.js-to-scroll[data-anchor]` (hero nav, "Explore my work", hint band, "Got a project?", "Get in touch") | No navigation, GSAP scroll only |
| `/sitemap-index.xml` | `<link rel=sitemap>` | n/a |

From a work page (`/works/arte/`):
- `a.js-back` goes to `/#works` (data-color `#F73326`, data-title `Works`).
- `/fr/works/arte/` is `data-no-swup` (200).
- "More works" shows 3 `a.js-homepage-work` cards. For Arte these were YouTube, Graille sur le rail, Mijote, and they were the same on 2 loads.
- `a.got-project__link` and `a.homepage__talk-link` go to `/#contact`.
- `.project-stills-picture` / `.project-3-img-link` link to full-size `/_astro/*.webp` images. They sit inside `[data-no-swup]` galleries and open a JS lightbox.

External links (`target=_blank`): Instagram, Bluesky, LinkedIn, Google Maps, `tel:`, `mailto:hi@jozue.fr`, plus award and partner sites.

## 2. Design tokens in use

### 2.1 Fonts
Only one family is loaded, `"Neue Haas Grotesk Display"`, with fallback stack `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif`. Both faces use `font-display: swap`:
- 400 normal from `/fonts/NHaasGroteskDSPro-55Rg.woff2`
- 700 normal from `/fonts/NHaasGroteskDSPro-75Bd.woff2`

Root `html { font-size: 10px }` (rem = 10px). `body` is 16px / 25.6px.

**Quirk to preserve:** `<button>` elements that don't get a font from a class compute to **Arial**, because buttons don't inherit `font-family`. This is the original behaviour, not a bug. It affects: hero nav buttons (`.homepage__nav-link`, 17px/21.59px), `.js-work-category` filter buttons, pastilles, and `#js-menu-button`. Buttons with `.h4` (Explore, Got a project?) do use NHaas.

### 2.2 Colors (computed)

| Role | Value |
|---|---|
| Ink / text / dark sections (`.homepage__talk`, `#contact`, menu panel) | `#111319` rgb(17,19,25) |
| Body bg / work card bg | `#ffffff` |
| Hero `#intro` bg, `.homepage__awards` bg | `#f3f2f0` rgb(243,242,240) |
| Brand red: `#works` header, `.hint-band`, `#about`, `.filter-island`, `#js-load-more-container`, `--hint-color` | `#f73326` rgb(247,51,38) |
| Pastille bg (counts) | `#d12525` rgb(209,37,37) |
| Works list bg (`.js-works-container`), `.homepage__partners` bg | `#f7f2e7` rgb(247,242,231) |
| Hero background "J" (`#js-intro-j`) | `#dcdbdb` at opacity .1 (token `intro.homeJColor` / `homeJOpacity`) |
| Intro signature stroke | `#050507` (token) |
| Work hover overlay `::before` | `rgba(0,0,0,.3)` |
| Work hover category text/border | `#dcdcd9` |
| White text on dark/red | `#ffffff` |

`data-color` values (each sets the transition band / photo border color and the project page header bg):

| Card / link | data-color |
|---|---|
| Billy | `#655bd5` |
| Hoppy Road | `#07080c` |
| Vianney | `#2c3138` |
| Graille sur le rail | `#2e3ca8` |
| Mijote | `#7a7b7b` |
| La Canute | `#2a3a4f` |
| Le Monde Plus | `#020101` |
| Arte | `#241f1a` (Arte page header bg rgb(36,31,26); "More works" bg rgb(31,26,22)) |
| McCain | `#005a7f` |
| MSA | `#173a5e` |
| Brico Dépôt | `#dc2f24` |
| YouTube Ads | `#ef2c20` |
| Séries Mania | `#433774` |
| Nicolas Feuillatte | `#346b72` |
| Instax | `#00263b` |
| Athletic Brewing | `#009ce0` |
| YouTube | `#ef2c20` |
| Fnac Darty | `#2e2a2a` |
| Menu "About." / "Works." | `#F73326` |
| Menu "Contact." / `#js-menu-button` | `#111319` |

### 2.3 CSS custom properties (computed on `:root`)

```
--ease-enter: cubic-bezier(0.22,0.61,0.36,1)   --ease-exit: cubic-bezier(0.4,0,1,1)
--ease-move:  cubic-bezier(0.4,0,0.2,1)        --ease-emphasis / --roll-ease: cubic-bezier(0.2,0.8,0.2,1)
--dur-micro 160ms  --dur-base 380ms  --dur-move 720ms  --dur-cine 1400ms
--reveal-distance 24px  --reveal-duration 480ms  --stagger-step 60ms
--panel-duration 720ms  --cycle-duration 420ms  --magnet-duration 600ms
--underline-duration 380ms  --underline-thickness 1px
--roll-duration 420ms  --roll-step 20ms  --roll-max 200ms
--hint-color #f73326  --hint-duration 1800ms
--gutter: max(3.8rem, 100vw / 12)
```

### 2.4 Typography by role (computed)

Format: size / line-height / letter-spacing / weight. "≈" is not used anywhere: every value below was measured.

| Role (selector) | 1440×900 | 390×844 |
|---|---|---|
| Hero title `h1.homepage__main-title` (each line is a `.art-director-title` / `.photographer-title` row) | **170px / 125.8px / -5.1px / 700** | **67px / 49.58px / -2.01px / 700** |
| Hero title at 768w / 1024w / 1920w | 88.3847px / 65.4047px (768); 121.082px / 89.6006px (1024); 170px / 125.8px (1920) | n/a |
| Hi text `.homepage__infos-hi` (`.js-hi-1` "Hi,", `.js-hi-2` "I am Josué.") | 35px / 31.5px / -0.35px / 700 | same |
| Hero nav `.homepage__nav-link` (Arial, see 2.1) | 17px / 21.59px / normal / 400 | same |
| Hero description `.homepage__description-*`, address links | 16px / 25.6px / normal / 400 | same |
| "Explore my work" `.link__scrollable--description` (h4) | 13px / 15.86px / 0.39px / 700 uppercase | same |
| Section labels `.h4` (Awards & Archives, Few words, Partners, Credits…) | 13px / 15.86px / 0.39px / 700 uppercase | same |
| "selected works" `h2.homepage__selected-works-title` | 170px / 125.8px / -5.1px / 700, white | 67px / 49.58px / -2.01px (also 67px at 768 and 1024) |
| Large pastille `.button-selected-pastille--large-desktop` | 42px / 42px / -1.26px / 700, 65.3×65.3 circle, bg #d12525 | hidden; `--large` variant shows instead |
| Work title `.homepage__work-link` | **101px / 134.33px / normal / 400** | **50px / 66.5px** (also 50px at 768; 101px from 1024) |
| Work category pill `.homepage__work-category` | 11px / 17.6px / 400, padding 0 6px | same |
| Mobile filter intro `.h5` | n/a (hidden ≥767) | 17px / 20.74px / 0.51px |
| Filter buttons `.js-work-category` (Arial) | 23px / 28.06px / 0.69px (island panel) | 15px / 18.3px / 0.45px, padding 4px 10px |
| "let's talk" `.homepage__talk-title` | 170px / 125.8px / -5.1px / 700 | 67px / 49.58px (also 67px at 768 and 1024) |
| Talk description / contact phone `.homepage__talk-description` | 22px / 26.84px / 0.66px / 400 | 17px / 20.74px / 0.51px |
| Pill links `.homepage__talk-link` (Get in touch, load more?, contact **email** `hi@jozue.fr`) | 22px / 26.84px / 0.66px / 400, padding 3px 15px | 17px / 20.74px / 0.51px |
| Award context `.homepage__award-context` | 11px / 13.53px | n/a |
| Award client `.homepage__award-client` | 42px / 55.86px / 400 | 34px / 35.36px |
| Award list item | 17px / 20.74px / 0.51px | n/a |
| About "about me" `.homepage__what-head-title` | 42px / 35.28px / -1.26px / 700 | same |
| About marquee items `.homepage__what-list` | 42px / 55.86px / 400 | 34px / 35.36px |
| About body `.homepage__what-text p` | 23px / 28.06px / 0.69px / 400 | 19px / 24.7px / 0.57px |
| About "available" `.homepage__what-available` | 34px / 35.36px / 400 | same |
| Socials `.homepage__social` (instagram/bluesky/linkedin) | 42px / 35.28px / -1.26px / 700 | same |
| Menu links `.menu-link` | 23px / 28.06px / 0.69px / 400, white | same |
| Menu lang `.menu-lang__item` | 15px / 18.3px / 0.45px | same |
| Transition title `#js-transi-title` | 42px / 42px / -1.26px / 700 lowercase (3.5rem below 767) | n/a |
| Project h1 (`/works/arte/` `.project-h1`) | 42px / 35.28px / -1.26px / 700 lowercase | n/a |
| Project slogan `.project-title` | 170px / 125.8px / -5.1px / 700 | n/a |
| Project mission | 23px / 28.06px | n/a |

## 3. Home page geometry

### 3.1 Home at 1440×900 (document coords `[x, y, w, h]`, intro already seen, `scrollHeight = 10637`)

| Element | Box |
|---|---|
| `#intro` (`.homepage__infos`, bg #f3f2f0) | [0, 0, 1440, 900] (height = 100vh) |
| `.wrapper--infos` | [20.5, 0, 1399, 900]: margin 0 20.5px, padding 0 34px, so content x = 54.5, width 1331 |
| `.homepage__nav` | [54.5, 0, 1331, 57.6], padding-top 32px. Links About / Works / Contact are justified across (About at x 54.5, y 34; 44.4×21.6) |
| `.homepage__infos-hi` | [54.5, 133.6, 1331, 63], margin-top 76px. "Hi," at y 133.6, "I am Josué." at y 165.1 |
| `h1.homepage__main-title` | [54.5, 249.6, 1331, 251.6], margin-top 53px. Line 1 y 249.6 (h 125.8), line 2 y 375.4 |
| `.homepage__description-jozue` | [54.5, 601.2, 1331, 246.8], margin-top 100px, padding-bottom 170px |
| `.homepage__description-first` | [54.5, 601.2, 371.5, 76.8]. Second paragraph at x 476 (screenshot) |
| `.homepage__description-adress` | [976.7, 601.2, 185.8, 76.8] (3 links, 25.6px rows) |
| `#js-intro-j` (bg J) | [270.5, 180, 1028, 1605.8] (overflows the section, clipped) |
| `.link__scrollable--description` | [650, 854, 139.9, 34] |
| `.hint-band` (red band at bottom of hero) | [0, 842, 1440, 63] at rest (band 55 + grow 8), label centered |
| `#js-menu-button` (fixed) | [1382, 26, 20, 17]: right 38px; bars 20×3px, ±8px apart |
| `#works` (`.homepage__selected`, red) | [0, 900, 1440, 343.1] |
| `h2.homepage__selected-works-title` | [174.6, 1015.6, 1090.7, 214]; "works" span at x 820.1; pastille "18" at [1240.1, 1065.6, 65.3, 65.3] |
| `.filter-island` (fixed) | [481.6, vp 509.6, 476.8, 446.4]. Bar `.js-island-bar` 476.8×56, sits 24px above viewport bottom when shown |
| `.js-works-container` (bg #f7f2e7) | [0, 1243.1, 1440, 4309] |
| `.js-works` list | [0, 1243.1, 1440, 4068] = 18 × 226 |
| Work card `a.homepage__work` | x 20.5, w 1399, h 226, padding 0 34px. First card y 1267.1, then every +226 (1267.1 … 5109.1). Divider lines at x 54.5–1385.5 (screenshot) |
| Card title | e.g. Billy `.homepage__work-link` [591.3, 1313, 173.5, 134.3] (centered); categories column right of title (x 774.8, 11px pills stacked) |
| Card media `img.homepage__work--media` | 1779.5×517.7 for `--web` cards, 1482.9×431.4 otherwise, centered (x -169.8 / -21.5); opacity 0 until hover |
| `#js-load-more-container` | **display:none at ≥767px** (all 18 cards shown) |
| `.got-project` | [0, 5311.1, 1440, 241], padding 121px 0 86px; button [664, 5432.1, 112, 15.9] |
| `.homepage__talk` ("let's talk", bg #111319) | [0, 5552.1, 1440, 710]; title [430.6, 5811.4, 578.9, 125.8]; desc [434.1, 5967.2, 571.8, 26.8]; "Get in touch" pill [643.7, 6024, 152.6, 36.8] |
| `.homepage__awards` (bg #f3f2f0) | [0, 6262.1, 1440, 1602.2], padding 71px 0 60px; title y 6333.1; first award card [101, 6440.1, 582, 275.2] (2 columns, padding 36px 31px) |
| `#about` (`.homepage__what`, red) | [0, 7864.4, 1440, 1342.7], padding-top 93px. Title [142.5, 7981.4, 1155, 34]; "about me" [142.5, 8114.4, 245, 841.5]; marquee column [398, 8104.4, 344, 851.5] (vertical list, items 55.9 tall); text [752.5, 8110.4, 545, 845.5]; "available" [142.5, 9055.9, 1155, 35.4]; pill [642.8, 9129.3, 154.4, 37.3]; small J `#js-about-j` [1154.5, 9083.7, 143, 223.4] |
| `.homepage__partners` (bg #f7f2e7) | [0, 9207.1, 1440, 530], padding 130px 0 118px; title y 9337.1; partner slide [170, 9428.1, 366.7, 250]; logos 220×220 |
| `#contact` (`.homepage__talk--home`, bg #111319) | [0, 9737.1, 1440, 900] (= 100vh). Socials row [483.3, 10129.6, 473.5, 35.3]: instagram x 483.3 (179.9 w), bluesky x 671.7, linkedin x 818.3. Phone [595.6, 10198.9, 248.8, 26.8]; email pill at y 10260.7 |

### 3.2 Home at 390×844 (`scrollHeight = 7557` before load-more, 9467 after)

| Element | Box |
|---|---|
| `#intro` | [0, 0, 390, 844] |
| `.wrapper--infos` | [38, 0, 314, 844] (margin 0 38px) |
| nav | [38, 0, 314, 57.6] |
| hi | [38, 133.6, 314, 63] |
| h1 | [38, 249.6, 250, 198.3] (grid; lines at 274.4 and 324, photographer line wraps to 2 rows) |
| description | [38, 497.9, 314, 319.6], margin-top 50px, padding-bottom 86px. **Horizontal slider**: `.homepage__description-first` at x 38, `-second` at x 352 (off-screen), next arrow [361, 528.8, 15, 15], dots `.scroll-nav--infos` [163, 584.7, 64, 24] |
| address | [38, 654.7, 314, 76.8], margin-top 80px |
| `#js-intro-j` | [-50, 220, 507, 792] |
| hint band | [0, 785.6, 390, 63] |
| `#works` | [0, 844, 390, 321.2]. Mobile filter block visible: h5 [24, 892, 342, 20.7], cycling slot [24, 924.7], buttons (first at [24, 975.5, 131.2, 30.3]); title [24, 1015, 342, 99.2] |
| island | [16, …, 358, 394.1]; bar 358×52 |
| works container | [0, 1165.2, 390, 2281]. Cards full-bleed: x 0, w 390, h 226, first at y 1189.2. **9 visible** (Billy…McCain); MSA→Fnac Darty are `homepage__work--mobile js-work-to-show`, height 0, `inert` |
| `#js-load-more-container` (red) | [0, 3199.2, 390, 124]; button [135.9, 3245.8, 118.3, 30.7] |
| got-project | [0, 3323.2, 390, 123] |
| talk | [0, 3446.2, 390, 530] |
| awards | [0, 3976.2, 390, 530], slider with 1 card per view (w 390) |
| `#about` | [0, 4506.2, 390, 1677]; marquee horizontal [0, 4770.5, 390, 37.1] |
| partners | [0, 6183.1, 390, 530], slider 1 per view |
| `#contact` | [0, 6713.1, 390, 844] (100vh) |
| menu button | [346, 26, 20, 17] (right 24px) |

## 4. Motion inventory

### 4.1 First-visit intro (`?intro`, 1440×900; ms from navigation start, observed with a MutationObserver attached during parse)

| t (ms) | Event |
|---|---|
| 141 | document parsing, `html.is-intro` set by inline script |
| 154 | `html` gets `js`. `#js-home` set `inert` with style `--intro-push: 900px` (= innerHeight). Title variants and `#intro` get `.is-staged` |
| 167 | `swup-enabled` added |
| from load | Loader J (`.intro__loader-j`): 80+ polylines, each with an inline keyframe `intro-loader-kN`, loop `917.0ms linear infinite` (`data-period=917 data-written=561 data-fade=799`), stroke #111319, width 80 |
| 753 | `.intro__skip` gets `.is-visible` ("Skip" button) |
| 775 | `.intro__stage.panel` gets `.panel--in` (`data-from=bottom`, translateY 101% to 0). Menu button `.is-on-light`. Sliders, filter and marquee init (`--marquee-duration: 8s`) |
| 1169 | Signature `.intro__signature` becomes a `draw-on` SVG (inline style `width:3067.5px; left:263.8px; top:-192.7px; transition: transform 623ms var(--ease-move)`). Home J `#js-intro-j` SVG built |
| 1230 → 1512 | `.intro__hi` typewriter ("Hi…"); `span.typewrite__caret` added at 1230, removed at 1512 |
| 1519 | Signature draw: 4 clip rects animate `1222.1ms linear forwards` |
| 2329 | Signature wipe/erase: `777.7ms linear forwards` |
| **2788** | **`html.is-intro` removed** (class becomes `js swup-enabled`). Stage `.panel--out`. `#js-home` inert removed. `#js-intro-j` gets `.is-landed`, home-J draw `565.6ms` |
| 3068 | `#intro` adds `.is-in`; title variant 0 `.is-in` (letters rise) |
| 3151 | `#js-intro` element removed from DOM |
| 3378 | Reveal delays assigned (`--reveal-delay: 0/60/120…ms`, capped at 420ms). Filter slots get `.is-current`. 4 `span.roll__ink` injected |
| 4769 | `#intro` drops `.is-staged`. Title `.is-done`. `.hint-band` gets `.is-line` |
| 5517 | `#intro.is-hinting`; hint band `.is-breathing` (1800ms × 2) |
| 9135 | hint band `.is-full` (2200ms, `linear(0, 0.02 5%, 0.69 80%, 0.93 92%, 1)` sweep), then `.is-set` (breathes forever) |

**Total intro: `html.is-intro` lasts ~2634ms after script boot (2788ms after navigation start).** The intro tokens are scaled by `intro.tempo = 0.5`: panel 360, hiDelay 60, char 19, hold 175, skipAt 600, lead 90.

**Direct mode (return visit)**: no loader. The hero enters with CSS transition delays: hi lines 380ms ease-enter at **140ms / 230ms** delay; address 720ms at 960ms delay; Explore 380ms at 1080ms delay. Tokens `home.*`: nav 0 + 70/step, hi 140 + 90/step, title 240, letterStep 18, letterMax 460, text 780 + 100/step, address 960, explore 1080, total 1700.

### 4.2 Hero title rotation
- 3 variants: 0 "art director / + photographer", 1 "creative / + director", 2 "product / + brand designer", cycled 0 → 1 → 2 → 0.
- **Period 5.22–5.33 s** (`.is-out` at 3424, 8641, 13972 ms).
  - `.is-out`: chars `translateY(0 → -210.8px)` over **380ms ease-exit**, per-char stagger (`titleExitStep` 12ms).
  - ~600–700ms later the next variant gets `.is-in .is-current`: chars `translateY(+210.8px → 0)` over **720ms ease-enter**, stagger 18ms per char (max 460ms).
  - `.is-done` follows ~1.11–1.17 s after `.is-in`.
  - Hold 3500ms (`titleHold`), then the next `.is-out`.
- Screenshots are therefore non-deterministic: `1440-01-top.png` shows variant 1 ("creative + director").

### 4.3 Mouse-depth parallax (`[data-depth]` inside `[data-depth-scene]`, desktop pointer)
- The inline `transform: translate3d(x, y, 0)` is the inverse of the pointer offset from viewport center: `x = -18px × depth × (px − cx)/cx`.
- Example: pointer at (1356, 45) on 1440×900 gave depth 1 → (-15.87, 16.18); 0.6 → (-9.52, 9.71); 0.5 → (-7.94, 8.09); 0.3 → (-4.76, 4.85); 0.25 → (-3.97, 4.04).
- Depths: `#js-intro-j` .25, nav .3, hi .6, h1 1, description .5. Project page: `.logo-full-container` .35, `.project-meta` .5, `.project-claim` 1.
- Lerp factor .08 per frame (token `depth.ease`), amplitude 18 (token).

### 4.4 Scroll parallax (`[data-parallax]`)
- Talk signature layer (`soft`): translateY clamps at +65.1px off-screen and passes through e.g. -18.9px at scrollY 5300 and +11.4px at 5552.
- Contact layer: -63.6px at scrollY 9207, 0 at 9737.
- Project hero `img.project-hero-image` (`data-parallax=hero`, origin top, max .05): translateY 0 (y 0) → 30px (y 300) → 40.5px (y ≥ 600, = 0.05 × 810).
- Tokens: back .25, mid .5, soft .88, hero .9, front 1, lift 1.1, maxShift .12.

### 4.5 Scroll reveals (`[data-reveal]`, MotionTokens.css + IntersectionObserver threshold .15)
- Default: opacity 0 + `translateY(24px)`, changing to `.is-in` (opacity 1, none) over **480ms ease-enter**, delayed by `--reveal-delay`. Inside `[data-reveal-group]` the delay staggers 60ms per item, capped at 420ms. Work cards reached 420ms.
- `=fade`: opacity only. `=soft`: 900ms, 32px.
- Applies to: work cards, talk title/desc/link (0/60/120), awards (title 0, cards 60…420), about blocks (0…300), partners (0…300), socials and contact (0/60/120).

### 4.6 Hover effects
- **`[data-underline]`**: `background-image: linear-gradient(currentColor)`, `background-size: 0% 1px` → `100% 1px` over **380ms ease-enter**, anchored left-bottom. Used on hero nav, menu links, address links, socials. `[data-underline-host]:hover` also triggers it.
- **`[data-roll="ink"]`** pills ("load more?", "Get in touch", contact email, about pill):
  - Text is split into `.split__char` (`--i`).
  - On hover each char translates up by `1lh + .2em + .32em` over 420ms `cubic-bezier(.2,.8,.2,1)`, delay `min(i × 20ms, 200ms)`. The text-shadow copy rolls in.
  - `span.roll__ink` overlay goes `clip-path: inset(100% 0 0)` → `inset(0)` over 380ms ease-enter (fills with `--pill-bg`; load-more uses the red `--hint-color`).
- **About pill** `.homepage__talk-link--what`: `pill-breathe 2.6s ease-move infinite` (scale 1 → 1.04 → 1).
- **Work card hover** (1440, Arte):
  - Card height **226 → 407px** (`round(22.6rem × --card-grow 1.8)`; mobile grow 1.4) over **720ms ease-enter**.
  - Media opacity 0 → 1 (380ms). Media scale `--magnet-scale` 1.06 → **1.12** (600ms ease-enter). `--magnet-x/y` follow the pointer, amplitude 6%.
  - Title color #111319 → #fff (380ms). Categories → #dcdcd9. `::before` overlay rgba(0,0,0,.3).
  - Samples: h 248.6 @0, 335 @152, 379.2 @304, 400 @457, 406.4 @607, 407 @758ms.
  - `.js-works.is-still` blocks hover until the pointer moves more than 2px.
- No custom cursor. Only `cursor: pointer` and slider `-webkit-grab`.

### 4.7 Menu open/close (`#js-menu-button` → `nav#js-menu.menu--site`)
- **Button**:
  - `.is-visible` once the hero is scrolled past (absent at scrollY 0, present at 200). Opacity/translateY(-.6rem) over 380ms ease-enter.
  - `.is-on-light` (dark bars) over light sections, removed over red/dark (`[data-nav-dark]`).
  - `.is-over-panel` while the menu panel covers it.
- **Open**:
  - `body.nav-open` (overflow hidden), `#js-menu.is-open`, `aria-expanded=true`.
  - A `.panel-host > .panel[data-from=top]` with bg #111319 slides translateY(-909px → 0) over **720ms ease-move**. Samples: -876 @106, -684 @208, -364 @308, -170 @410, -70 @512, -20 @613, -0.4 @716.
  - Bars rotate ±45° over 300ms; middle bar fades.
  - Links: opacity 0 → 1, translateY(.5em → 0), **720ms ease-enter**, delay `720 × .45 + i × 60ms` (324/384/444ms; lang at i=3, 504ms). First link opacity 0.22 @410, 0.89 @716, 1 @1121.
- **Close**:
  - Links fade over 380ms ease-exit (opacity 0 by ~410ms).
  - `.panel--out` starts ~200ms after click and slides down translateY(0 → 101%) over 720ms ease-exit (22px @309, 506px @714, 868px @915). `.is-over-panel` removed at ~400ms.
- Menu links are `data-no-swup` anchors: JS closes the menu and scrolls.

### 4.8 Works filter island (`.js-filter-island`, fixed, desktop and mobile)
- `data-state` values:
  - `hidden`: transform translateY(80px), clip `inset(calc(100% - 56px) 0 0 round 28px)`. Applies above `#works` and past the list (e.g. at scrollY 0–900 and ≥5300).
  - `bar`: translateY 0, only the 56px pill visible, while the works list is in view.
  - `open`: clip animates to `inset(0 round 28px)` over **720ms ease-move** (92% @126, 57% @247, 21% @371, 7.7% @492, 0 @739).
- Transition string: `transform .38s ease-exit, clip-path .72s ease-move, visibility 0s linear .38s`.
- Bar content: two `[data-cycle]` slots with words "Graphic design / Copywriting / Photography / Filmmaking / Art Direction / Product design" and "Campaigns / Websites / Branding / Social Media", the text "for", and a count pastille.
  - Slots cycle every 2400ms; the right slot is offset by 1200ms (`data-cycle-delay`).
  - Word swap: 420ms ease-enter, translateY(.55em) in. The leaving word fades over 160ms ease-exit.
- On desktop, mouse `pointermove` over the bar opens it and `pointerleave` closes it. Click, Escape, outside-click and the close X also work.
- Selecting a category:
  - Non-matching buttons get `.button-selected--off`; the active one gets `aria-pressed=true`.
  - The works container gets `.is-filtered` and the island and `#works` lose `.is-all`.
  - Pastilles update. Example: Branding → 3 cards (Billy, Mijote, Brico Dépôt) and scrollHeight 10637 → 7247.
  - Persisted in `sessionStorage['jozue:filter']`.
- `all` button: restores all categories.
- Peek tokens: `filter.peek 1800`, `peekAt .6`, `island.showAt 0`, `hideAt .6`.

### 4.9 Load more (mobile <767 only)
- Click `#js-load-more` and the container gets `.hide`. Each `.js-work-to-show` loses `inert` and gets inline `height:226px`. Every 100ms (`loadMore.stagger`) the next one drops `.homepage__work--mobile`.
- Height animates 0 → 226 over 720ms ease-enter: 70 @102, 136 @203, 177 @304, 202 @405, 216 @506, 223 @607, 226 @708.
- scrollHeight goes 7557 → 9467.

### 4.10 Loops and ambient motion
- `.hint-band` breathe: 1800ms ease-move, 4px distance. `.chevron-bounce:after` same timing.
- `.hint-nudge__word`: 6000ms loop.
- Marquee `.homepage__what-ul`: `what-marquee` translate(-50%) linear infinite, `--marquee-duration: 8s` set by JS (CSS default 24s). Moves horizontally on mobile; desktop shows a vertical column.
- Typewriter caret: 1s steps(2) blink.
- Signatures in `.homepage__talk` and `#about` J draw/erase in a loop (`talk.*` tokens: hold 1400, gap 700).

### 4.11 Swup page transitions (measured)
- **Home → work card (arrival)**, Arte at 1440:
  - t=5 ms: body gets `.shared-cover.is-on` (#fff, opacity over 380ms), `.shared-photo` (fixed clone of the card hero, `transition: top/left/width/height 720ms ease-move`) and `.shared-band` (bg = data-color, height 100vh).
  - `html.is-changing.is-animating.is-leaving`, `body.stop`.
  - t=441: photo set to `top:400px; height:810px; border-top:50px solid <data-color>`; band `.is-half` (translateY(-100% → -50%), 720ms ease-move).
  - t=563–862: slogan claim words injected (`data-slogan`, e.g. Arte `["arte.tv","& chill"]`).
  - t=1192: content replace (`is-rendering`); the project article starts `.is-arriving`.
  - t≈2740: classes cleared; scroll 0.
- **Work → home (return)** (`a.js-back`, Got a project?, Get in touch; `html[data-arrival=return]`):
  - `body.stop`. The project article fades opacity 1 → 0 and translateY 0 → -24px over ~420ms (0.97 @63, 0.54 @246, 0.12 @369).
  - At ~425ms content is replaced. `#js-home` fades 0 → 1 and translateY 24 → 0 (0.25 @491, 0.60 @615, 0.88 @802).
  - Back restores the previous scrollY (2600). The `/#contact` hash lands at 9737.
- **`#js-transi`** (fixed 100vw×100vh, `.transi--on` sets opacity 1 and z 100, bg = trigger's data-color, title = data-title, holds `pageTransition.hold` 1000ms):
  - The code path exists (`hc()` / `gc()`) but it was **never active** in any of the transitions tested above.
  - There are no `.transi` keyframes in the CSS. Don't try to make it show.

### 4.12 Other
- Hero description slider (mobile) and the awards and partners sliders use Siema. Inline style `width: …; transition: 200ms ease-out; transform: translate3d(...)`.
- Lightbox on project galleries: 500ms track, scale .96 (MotionTokens.css).
- Under `prefers-reduced-motion`, everything collapses to 150–200ms with no transforms.

## 5. Breakpoints observed

CSS breakpoints present: 374, 375, 420, 560, 600, **767** (main mobile/desktop split; JS `(max-width: 766px)`), **1024**, **1100**, **1399**. Measured:

| Width | Changes |
|---|---|
| 390 | wrapper margin 38px; h1 67px; description is a swipe slider with dots/arrow; address stacks below; mobile filter block inside `#works`; only 9 cards plus red "load more?"; cards full-bleed; work title 50px; talk 530 tall; awards/partners 1-up sliders; marquee horizontal; menu btn right 24px; contact = 100vh (844) |
| 768 | wrapper [38, 692]; h1 88.38px; description paragraphs stacked (first 391w), address at x 499; mobile filter hidden, island 477w; all 18 cards, no load-more; work title 50px; "selected works" / "let's talk" 67px; awards 1979 tall; about marquee column 300w; contact 710 tall; scrollH 11418 |
| 1024 | h1 121.08px; work title 101px; titles still 67px; contact 710; scrollH 10532 (1024×768) |
| 1440 | wrapper 1399 max, margin 20.5, padding 34; h1 170px; desc 3 columns; "selected works" / "let's talk" 170px; contact 100vh; scrollH 10637 |
| 1920 | Same metrics as 1440. Wrapper and work cards centered at x 261 (max-width 1399); bg sections full-bleed; contact = 1080; scrollH 10997 |

## 6. Assets (all requested by home at 1440; all 200 from same origin)

- CSS: `Base.Db0Vu-aS.css`, `MotionTokens.mJrO5Au9.css`, `lazyframe.JfMrjVw8.css`.
- JS: `Base.astro_astro_type_script_index_0_lang.o1EI0Byl.js` (module), `rolldown-runtime.hePW80VL.js`, `motion.CqR23D0i.js`, `/_vercel/insights/script.js` (defer).
- Fonts: the 2 woff2 files above.
- SVG: `jozue-logo-full.DpMZCk-F.svg` (232×150, preloaded), `jozue-logo-small.DJpN4TMc.svg` (143×225). Project pages also use `jozue-logo-project.B0nm3wc4.svg`.
- Card media (lazy, from `data-src`, all webp, 1200 wide):

| File | Size |
|---|---|
| billy | 1200×796 |
| hoppy-road | 754 |
| vianney | 675 |
| graille | 675 |
| mijote | 675 |
| la-canute | 627 |
| le-monde-loreal | 675 |
| arte | 675 |
| mc-cain | 750 |
| msa | 627 |
| Group-34 | 710 |
| youtube-ads-hero-hd | 832 |
| series-mania | 635 |
| DJI_0010-1 | 635 |
| Capture-decran…21.52-1 | 635 |
| gouttes-gif | 1031 |
| BEACON_HERVE… | 661 |
| fnac-darty | 634 |

  - `data-hero` points to a second, larger variant used by the shared-element transition (e.g. Arte hero `arte-hero-1.DiJqoqfB_1YzdRy.webp` is 2039×1147).
- Partner logos (webp, displayed 220×220): vivan 520², alexandre_desane 260², basile_tournier 450×448, jonathan_guyader 522×520, quatrevingts 520².
- OG image `share-home.BtD6-h8F_Z1O31Pl.jpeg` (1200×630).
- Favicons: `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`.
- Inline JSON stroke data `#trace-j` and `#trace-signature` drive all J/signature drawings. They are part of the HTML and must be byte-identical.
- `/works/arte/` extra assets: `arte-one-word-1..5`, `arte-on-the-wall-1` (webp; hero 2039×1147, one-word-1 693×1039, one-word-2 344×516). `/works/youtube/` uses **self-hosted mp4** (`/_astro/youtube-film-*.mp4`, `youtube-context-coline-*.mp4`) in `.lazyframe--hosted` with `preload=none`. **No YouTube iframes.**

## 7. Representative work page: `/works/arte/` at 1440×900 (scrollHeight 6723)

| Element | Box / value |
|---|---|
| `.project-head` (bg #241f1a, `data-signature-ink=light`) | [0, 0, 1440, 568] |
| `a.js-back` | [38, 25, 32, 32]: white arrow, dark when `.is-on-light` (from scrollY ≈ 600) |
| Menu button | [1382, 32, 20, 17], white |
| `.project-meta` | [170, 0, 1100, 316.6]: left column [170, 171, 300] (h1 "Arte" plus categories list); right `.project-mission` [760, 171, 510, 84.2] |
| `.project-claim h2.project-title` | [0, 379, 1440, 377]: "arte.tv" / "& chill" lines at y 379 and 504.8, white, 170px |
| `.project-hero-container--full` | [0, 568, 1440, 810]; img 1440×891 at y 527.5 (parallax) |
| `.project-content` | [0, 1378, 1440, 3437.2] |
| `.project-mission-bis` | [429.5, 1496, 581, 140.3] |
| Stills gallery | [199.5, 1809.3, 1041, 1043]: big left 692.7×1039 plus 2 stacked 344.3×519.5 / 516.5 |
| Duo `.project-3-img--duo` | [170, 2955.3, 1100, 541], two 360.7×541 |
| "On the wall" large image | [22.5, 3700.3, 1395, 784.8] |
| Credits title band | [0, 4460.2, 1440, 170]; `.project-credit` (bg data-color) [0, 4630.2, 1440, 185] |
| `.project-more-works` (bg rgb(31,26,22)) | [0, 4815.2, 1440, 279] |
| More-works list | [0, 5094.2, 1440, 678]: 3 cards, same card component as home |
| `.got-project` | [0, 5772.2, 1440, 241] |
| `.homepage__talk` (bg #241f1a) | [0, 6013.2, 1440, 710] |

## 8. External dependencies and things not reproducible locally

- **Vercel Web Analytics**: `/_vercel/insights/script.js` plus `POST /_vercel/insights/view`. Locally these return 404 (harmless). Either omit them or stub the script; don't count them as diffs.
- No YouTube/Vimeo/third-party embeds; lazyframe is self-hosted video. No Google Fonts, no CDN.
- `/fr/` and every `/works/*` page other than arte/youtube were not recon'd. The swup arrival transition fetches the target HTML, so any work page the clone links to must exist locally or the click falls back to a full load / 404.
- Live timing values come from a headless run. JS-driven timings (intro, title rotation) can drift ±50ms with frame timing. The intro also scales with `innerHeight` (`--intro-push`).
- The hero title rotation and the cycling filter words make pixel diffs non-deterministic. Freeze them (wait for a known variant or diff with masks).

## 9. Reference screenshots (`.recon/ref/`, viewport-only, CSS px)

- `1440-01-top.png`: hero, scrollY 0 (title variant "creative + director", hint band breathing)
- `1440-02-works-y2400.png`: works list at scrollY 2400 (island in `bar` state)
- `1440-03-about.png`: `#about` at its top (7864)
- `1440-04-contact.png`: bottom of page (scrollY 9737, `#contact`)
- `1440-05-work-hover-arte.png`: Arte card hovered (407px tall, photo visible)
- `1440-06-menu-open.png`: menu open (dark panel)
- `1440-07-island-open-filter-branding.png`: island open, Branding filter active
- `1440-10-arte-top-after-swup.png`: `/works/arte/` top after the arrival transition
- `390-01-top.png`, `390-02-works-y1900.png`, `390-03-about.png` (after load-more, scrollY 6416), `390-04-contact.png`
