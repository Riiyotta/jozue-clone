# https://jozue.fr (clone at portfolio/jozue)

Source: https://jozue.fr (clone at portfolio/jozue)
Status: **measured-from-mirror**
39 routes · 4 templates · 32 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Work: editorial case study, Work: app / product case study, Home (portfolio index)) account for 38 of 39 routes (97%). The remaining 1 routes span 1 template.

| template | routes | share |
|---|---:|---:|
| Work: editorial case study | 28 | 72% |
| Work: app / product case study | 8 | 21% |
| Home (portfolio index) | 2 | 5% |
| Not found | 1 | 3% |

## Page chrome

**2 routes carry chrome = `full + intro`** — Home (portfolio index).

**36 routes carry chrome = `full`** — Work: editorial case study, Work: app / product case study.

**1 routes carry chrome = `transition-only`** — Not found.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.page-transition-layer` | SHELL | 4 | 39 | `Transition.jsx` | Every route. |
| `shell.menu-toggle` | SHELL | 3 | 38 | `MenuToggle.jsx / MenuToggleVariant1.jsx` | Every route except the not-found page. |
| `shell.menu-overlay` | SHELL | 3 | 38 | `Menu.jsx / MenuFr.jsx / MenuVariant*.jsx` | Every route except the not-found page. |
| `cta.lets-talk` | CONVERSION | 3 | 38 | `TalkCta.jsx / TalkCtaVariant1.jsx` | The home routes and every work page; not the not-found page. |
| `works.more-works` | WORKS | 2 | 36 | `MoreWorksTitle.jsx + WorksList<Project>.jsx / WorksListVariant*.jsx` | Every work page, editorial and app case studies alike. |
| `hero.project-head` | HERO | 2 | 36 | `ProjectHead*.jsx (per-project variants)` | Every work page. |
| `hero.project-cover` | HERO | 2 | 36 | `ProjectHero*.jsx` | Every work page. |
| `case.mission` | CASE | 2 | 36 | `ProjectMissionBis.jsx / inside ProjectContent*.jsx` | Every work page except fnac-darty. |
| `case.image-large` | CASE | 2 | 36 | `inside ProjectContent*.jsx` | Both work templates. |
| `case.quote-image` | CASE | 2 | 36 | `inside ProjectContent*.jsx` | Both work templates. |
| `case.two-image-bleed` | CASE | 2 | 36 | `inside ProjectContent*.jsx` | Both work templates. |
| `case.external-link` | CASE | 2 | 36 | `inside ProjectContent*.jsx` | Both work templates. |
| `case.credits` | CASE | 2 | 36 | `ProjectSmallTitle.jsx + ProjectCredit*.jsx / inside ProjectContent*.jsx` | Every work page. |
| `case.stills` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies only. |
| `case.gallery-3` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies only. |
| `case.block-title` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies only. |
| `case.carousel` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies only. |
| `case.reels` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies only. |
| `case.palette` | CASE | 1 | 28 | `inside ProjectContent*.jsx` | Editorial case studies (also nested in the app frame of two app case studies). |
| `case.triangle-composition` | CASE | 1 | 28 | `inside ProjectContentBricoDepot*.jsx` | Editorial case studies only. |
| `case.app-frame` | CASE | 1 | 8 | `ProjectContentVariant1.jsx / ProjectContent<Project>*.jsx` | App case studies only. |
| `case.app-next` | CASE | 1 | 8 | `JsProjectNext<Project>.jsx` | App case studies only. |
| `runtime.intro-preloader` | RUNTIME | 1 | 2 | `IntroOverlay.jsx + IntroKeyframes.jsx + TraceJ.jsx (signature path data)` | Both home routes (EN and FR) only. |
| `hero.home-intro` | HERO | 1 | 2 | `Hero.jsx / HeroFr.jsx` | Both home routes (EN and FR) only. |
| `works.selected-heading` | WORKS | 1 | 2 | `SelectedWorks.jsx / SelectedWorksFr.jsx` | Both home routes (EN and FR) only. |
| `works.filter-island` | WORKS | 1 | 2 | `FilterIsland.jsx + FilterLive.jsx` | Both home routes (EN and FR) only. |
| `works.index-list` | WORKS | 1 | 2 | `WorksList.jsx` | Both home routes (EN and FR) only. |
| `cta.contact-footer` | CONVERSION | 1 | 2 | `Contact.jsx` | Both home routes (EN and FR) only. |
| `proof.awards` | PROOF | 1 | 2 | `Awards.jsx` | Both home routes (EN and FR) only. |
| `about.what-i-do` | ABOUT | 1 | 2 | `About.jsx` | Both home routes (EN and FR) only. |
| `proof.partners` | PROOF | 1 | 2 | `Partners.jsx` | Both home routes (EN and FR) only. |
| `status.not-found` | STATUS | 1 | 1 | `TalkCta404.jsx` | The not-found page only (served for any unknown URL). |

**13 shared sections** appear in more than one template and belong in a component library.

**19 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home (portfolio index) — `template.home`

2 routes · `/`, `/fr/` · chrome: **full + intro**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-transition-layer` | shared ×4 |
| 2 | RUNTIME | `runtime.intro-preloader` | page-local |
| 3 | SHELL | `shell.menu-toggle` | shared ×3 |
| 4 | SHELL | `shell.menu-overlay` | shared ×3 |
| 5 | HERO | `hero.home-intro` | page-local |
| 6 | WORKS | `works.selected-heading` | page-local |
| 7 | WORKS | `works.filter-island` | page-local |
| 8 | WORKS | `works.index-list` | page-local |
| 9 | CONVERSION | `cta.lets-talk` | shared ×3 |
| 10 | PROOF | `proof.awards` | page-local |
| 11 | ABOUT | `about.what-i-do` | page-local |
| 12 | PROOF | `proof.partners` | page-local |
| 13 | CONVERSION | `cta.contact-footer` | page-local |

### Work: editorial case study — `template.work-case-study`

28 routes · `/works/arte/`, `/works/athletic-brewing-company/`, `/works/brico-depot/`, `/works/graille-sur-le-rail/`, `/works/hoppy-road/`, `/works/instax/`, `/works/la-canute/`, `/works/le-monde-loreal/`, `/works/mc-cain/`, `/works/mijote/`, `/works/msa/`, `/works/nicolas-feuillatte/`, `/works/youtube-ads/`, `/works/youtube/`, `/fr/works/arte/`, `/fr/works/athletic-brewing-company/`, `/fr/works/brico-depot/`, `/fr/works/graille-sur-le-rail/`, `/fr/works/hoppy-road/`, `/fr/works/instax/`, `/fr/works/la-canute/`, `/fr/works/le-monde-loreal/`, `/fr/works/mc-cain/`, `/fr/works/mijote/`, `/fr/works/msa/`, `/fr/works/nicolas-feuillatte/`, `/fr/works/youtube-ads/`, `/fr/works/youtube/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-transition-layer` | shared ×4 |
| 2 | SHELL | `shell.menu-toggle` | shared ×3 |
| 3 | SHELL | `shell.menu-overlay` | shared ×3 |
| 4 | HERO | `hero.project-head` | shared ×2 |
| 5 | HERO | `hero.project-cover` | shared ×2 |
| 6 | CASE | `case.mission` | shared ×2 |
| 7 | CASE | `case.carousel` | page-local |
| 8 | CASE | `case.stills` | page-local |
| 9 | CASE | `case.gallery-3` | page-local |
| 10 | CASE | `case.block-title` | page-local |
| 11 | CASE | `case.image-large` | shared ×2 |
| 12 | CASE | `case.quote-image` | shared ×2 |
| 13 | CASE | `case.reels` | page-local |
| 14 | CASE | `case.palette` | page-local |
| 15 | CASE | `case.triangle-composition` | page-local |
| 16 | CASE | `case.two-image-bleed` | shared ×2 |
| 17 | CASE | `case.external-link` | shared ×2 |
| 18 | CASE | `case.credits` | shared ×2 |
| 19 | WORKS | `works.more-works` | shared ×2 |
| 20 | CONVERSION | `cta.lets-talk` | shared ×3 |

### Work: app / product case study — `template.work-app-case-study`

8 routes · `/works/billy/`, `/works/fnac-darty/`, `/works/series-mania/`, `/works/vianney/`, `/fr/works/billy/`, `/fr/works/fnac-darty/`, `/fr/works/series-mania/`, `/fr/works/vianney/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-transition-layer` | shared ×4 |
| 2 | SHELL | `shell.menu-toggle` | shared ×3 |
| 3 | SHELL | `shell.menu-overlay` | shared ×3 |
| 4 | HERO | `hero.project-head` | shared ×2 |
| 5 | HERO | `hero.project-cover` | shared ×2 |
| 6 | CASE | `case.app-frame` | page-local |
| 7 | CASE | `case.image-large` | shared ×2 |
| 8 | CASE | `case.mission` | shared ×2 |
| 9 | CASE | `case.app-next` | page-local |
| 10 | CASE | `case.quote-image` | shared ×2 |
| 11 | CASE | `case.two-image-bleed` | shared ×2 |
| 12 | CASE | `case.external-link` | shared ×2 |
| 13 | CASE | `case.credits` | shared ×2 |
| 14 | WORKS | `works.more-works` | shared ×2 |
| 15 | CONVERSION | `cta.lets-talk` | shared ×3 |

### Not found — `template.not-found`

1 route · `/404/` · chrome: **transition-only**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-transition-layer` | shared ×4 |
| 2 | STATUS | `status.not-found` | page-local |

## Section reference

### SHELL

_Persistent chrome present across routes: transition layer, menu toggle, menu overlay._

**`shell.page-transition-layer`** — Empty full-screen transition layer (#js-transi) with a title slot. It is in the DOM on every page but never animates: the real page transitions are swup-driven (a shared-element photo expansion from a work card to the work page, and a fade/slide back home).

· Every route. · appears on 39 routes · implemented by `Transition.jsx`

**`shell.menu-toggle`** — Fixed three-bar burger button, top right. Its colour follows the section underneath (data-nav-dark) and it morphs into a close icon while the menu is open.

· Every route except the not-found page. · appears on 38 routes · implemented by `MenuToggle.jsx / MenuToggleVariant1.jsx`

**`shell.menu-overlay`** — Full-screen dark menu panel that drops from the top. Three large links (About, Works, Contact) arrive with a staggered entrance, plus the EN/FR language switch.

· Every route except the not-found page. · appears on 38 routes · implemented by `Menu.jsx / MenuFr.jsx / MenuVariant*.jsx`

### RUNTIME

_Utility/runtime UI that is not page content (preloader)._

**`runtime.intro-preloader`** — First-visit preloader: the handwritten 'J' signature is traced stroke by stroke, then a stage panel says hi and slides out. It has a skip button and is remembered in localStorage for a month, after which the page loads directly. Utility UI, not page content.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `IntroOverlay.jsx + IntroKeyframes.jsx + TraceJ.jsx (signature path data)`

### HERO

_Page-opening composition._

**`hero.home-intro`** — Home opening screen. Contains in-page nav buttons (About / Works / Contact), the 'Hi, I am …' greeting, a giant rotating role title (three variants, letter-staggered), a two-slide bio slider, the address / phone / email column, a mouse-driven depth-parallax 'J' mark, and the red 'Explore my work' hint band.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `Hero.jsx / HeroFr.jsx`

**`hero.project-head`** — Work-page opening header: small 'jozue' logo, back link, meta columns (client, year, disciplines) and the project claim / slogan.

· Every work page. · appears on 36 routes · implemented by `ProjectHead*.jsx (per-project variants)`

**`hero.project-cover`** — Full-bleed cover image of the project. It is the landing target of the card-to-page shared-element transition.

· Every work page. · appears on 36 routes · implemented by `ProjectHero*.jsx`

### WORKS

_Portfolio index and navigation between projects._

**`works.selected-heading`** — Large 'selected works' title that opens the portfolio index.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `SelectedWorks.jsx / SelectedWorksFr.jsx`

**`works.filter-island`** — Floating pill-shaped filter bar (bottom centre) with cycling category words and a live work count. It opens into a clip-path panel of category filters; the chosen filter persists in sessionStorage. Includes a screen-reader live region announcing results.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `FilterIsland.jsx + FilterLive.jsx`

**`works.index-list`** — Full list of the 18 work cards: a giant title with category pastilles; on hover the card grows from 226 to 407px and reveals a zooming cover photo. Below 767px, half the cards hide behind a load-more button. Ends with the small 'Got a project?' prompt.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `WorksList.jsx`

**`works.more-works`** — 'More works' heading followed by the cards of the other projects (same card design as the home index, without filtering), ending with the 'Got a project?' prompt.

· Every work page, editorial and app case studies alike. · appears on 36 routes · implemented by `MoreWorksTitle.jsx + WorksList<Project>.jsx / WorksListVariant*.jsx`

### CASE

_Body blocks of a work case study._

**`case.mission`** — Paragraph block with the project's mission / context statement. It can recur later in the page as an interstitial text block.

· Every work page except fnac-darty. · appears on 36 routes · implemented by `ProjectMissionBis.jsx / inside ProjectContent*.jsx`

**`case.stills`** — Row of stills / photos (photography outtakes, frames) laid out as a horizontal strip.

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.gallery-3`** — Three-image gallery (or a duo variant) that opens in a lightbox.

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.block-title`** — Small bold uppercase heading that introduces the next body block (e.g. a large image or a reel).

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.image-large`** — Single full-width large image (key visual, poster, campaign shot).

· Both work templates. · appears on 36 routes · implemented by `inside ProjectContent*.jsx`

**`case.quote-image`** — Quote or statement paired with an image, side by side.

· Both work templates. · appears on 36 routes · implemented by `inside ProjectContent*.jsx`

**`case.carousel`** — Horizontal slider of media items. It includes click-to-play self-hosted videos (lazyframe items with a play button) and images.

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.reels`** — Vertical video reels (self-hosted mp4, preload none) with captions, for social-first films.

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.palette`** — Brand colour palette: swatches with their colour codes. On app case studies it sits inside the app frame.

· Editorial case studies (also nested in the app frame of two app case studies). · appears on 28 routes · implemented by `inside ProjectContent*.jsx`

**`case.triangle-composition`** — Bespoke triangle image composition (one oversized bleed image plus a triangle arrangement).

· Editorial case studies only. · appears on 28 routes · implemented by `inside ProjectContentBricoDepot*.jsx`

**`case.two-image-bleed`** — Two-image block where one image bleeds out of the grid.

· Both work templates. · appears on 36 routes · implemented by `inside ProjectContent*.jsx`

**`case.external-link`** — Outbound link to the live project / campaign site.

· Both work templates. · appears on 36 routes · implemented by `inside ProjectContent*.jsx`

**`case.app-frame`** — Browser/app window mockup (title bar with three bullets and a close control) that frames scrolling product screens. This is the signature block of the app/product case studies.

· App case studies only. · appears on 8 routes · implemented by `ProjectContentVariant1.jsx / ProjectContent<Project>*.jsx`

**`case.app-next`** — Next-screen control that advances the app-frame mockup to its next screen.

· App case studies only. · appears on 8 routes · implemented by `JsProjectNext<Project>.jsx`

**`case.credits`** — 'Credits' small title followed by the credits list (roles → people / agencies).

· Every work page. · appears on 36 routes · implemented by `ProjectSmallTitle.jsx + ProjectCredit*.jsx / inside ProjectContent*.jsx`

### PROOF

_Credibility: awards and partner studios._

**`proof.awards`** — 'Awards & Archives' horizontal scroller of past projects. Each entry gives the project, client/agency, disciplines and award (FWA, Awwwards, CSSDA) and links out to the award page.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `Awards.jsx`

**`proof.partners`** — 'Partners in crime' horizontal scroller of partner studios / freelancers: logo, role and outbound link. Logos lazy-load on approach.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `Partners.jsx`

### ABOUT

_Who the person is and what they do._

**`about.what-i-do`** — 'Few words about me' section: a looping marquee of disciplines (Graphic Design, Art Direction, Copywriting, Visual Identity, Digital Design, Photography, Filmmaking & more), the bio paragraph and the small 'J' mark.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `About.jsx`

### CONVERSION

_Contact prompts and contact details._

**`cta.lets-talk`** — 'let's talk' band: large title, a freelance-availability line and a 'Get in touch' link to the contact block / mailto.

· The home routes and every work page; not the not-found page. · appears on 38 routes · implemented by `TalkCta.jsx / TalkCtaVariant1.jsx`

**`cta.contact-footer`** — Closing contact screen: the full 'jozue' wordmark with soft parallax, social links (instagram, bluesky, linkedin), phone number and a large ink-roll mailto link.

· Both home routes (EN and FR) only. · appears on 2 routes · implemented by `Contact.jsx`

### STATUS

_System status pages._

**`status.not-found`** — Not-found message using the 'let's talk' band layout: giant 'not found' title, a one-line explanation and a 'Back home' link. An inline script swaps in the French copy for /fr/ paths.

· The not-found page only (served for any unknown URL). · appears on 1 routes · implemented by `TalkCta404.jsx`
