# jozue.fr — information architecture

**Edit only `ia.json`.** `IA.md` and `matrix.csv` are generated from it, so any hand edits to them will be overwritten.

```bash
node validate.mjs   # checks route totals, section references and categories; exits 1 on a hard failure
node build.mjs      # regenerates IA.md and matrix.csv
```

Source: the original server HTML of all 39 routes (`../.recon/pages/`, fetched from https://jozue.fr) and the clone's components (`../src/components/`). Each section's `implementedBy` field names the clone component that renders it. EN and FR routes have identical structure, so each pair maps to one template.

## What the data shows

- **The work pages are the bulk of the site.** 36 of 39 routes (92%) are work pages from 2 templates: the editorial case study (14 projects) and the app/product case study (4 projects: billy, fnac-darty, series-mania, vianney). The home page is only 2 routes, but it holds 9 of the 32 sections, all of them home-only.
- **Shared vs. page-local.** 13 sections are shared across templates: the shell, the project header and cover, the credits, "more works" and "let's talk". 19 are single-template and should stay page-local.
- **Case-study bodies are a per-project flow, not a fixed layout.** The reuse table counts a `case.*` block against every route of its template, which overstates how often most blocks appear. The real presence is in each section's `presentOn` field. For example, `case.triangle-composition` is only on brico-depot, `case.reels` only on graille-sur-le-rail and mc-cain, and fnac-darty is the one work page without a `case.mission`.
- **Where the clone's code doesn't match this IA.** The clone renders these body blocks inside 28 per-project `ProjectContent*.jsx` files rather than as one component per block type. Splitting out the 15 `case.*` sections as standalone components would let new case studies be built from the IA directly.
- **Shell.** The not-found page is the only route without the menu. The `#js-transi` transition layer is on every route but never animates; the real transitions come from swup.
