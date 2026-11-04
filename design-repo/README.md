# jozue portfolio design-repo

A machine-validated PageSpec system extracted from the jozue.fr clone in the parent folder: tokens, primitives, components, semantic section contracts, three page templates, a compatibility graph, a Draft-07 PageSpec schema, a semantic validator, an adversarial suite, drift proofs and measured evidence.

**Status: design-review-pending, `productionApproved: false`.** The source is a real, live freelance portfolio of a named person. Generated pages may borrow the system (layout rhythm, type scale, motion, colour roles) but never the person's identity, contact details, clients, partners, awards, bio or imagery. Read `docs/sensitivity-and-licensing.md` before using it, and do not publish this repository.

## Counts (recomputed from disk)

<!-- counts:start (written by extraction/verify_all.py --write-counts) -->
| item | count |
|---|---|
| tokens | 129 |
| pageSpecReferenceableTokens | 40 |
| primitives | 13 |
| components | 10 |
| sections | 31 |
| retrievalIneligibleSections | 4 |
| templates | 3 |
| routes | 39 |
| assetRoles | 22 |
| motionPatterns | 24 |
| graphRules | 13 |
| examples | 6 |
| referenceExamples | 3 |
| generatedExamples | 3 |
| adversarialMutations | 91 |
| adversarialControls | 7 |
<!-- counts:end -->

## Layout

| Path | What it is |
|---|---|
| `tokens/00-foundation/` | colour, accent (per-project data-color values, neutrally named), typography, spacing, radius, breakpoint, elevation, motion, plus `motion-patterns.json` |
| `tokens/10-semantic/`, `20-component/`, `30-layout/`, `themes/light.json` | semantic roles, component tokens, layout tokens, and the one theme (dark bands are surfaces, not a dark mode) |
| `tokens/llm/` | `token-catalog.json` (re-derived from the token files by verify_all), `token-policy.json` (what a PageSpec may reference and which combinations are legal), `component-allowlist.json` |
| `primitives/`, `components/` | content-agnostic building blocks (pill link, underline link, pastille, work card, award card, slider, signature layer, ...) |
| `sections/` | one contract per semantic section type: `semantic` {id, category} for the AI, `source` {id, file, tag, lines, needle} for provenance, content fields with `maxWords`, motion, token surfaces, responsive notes, asset roles, measured heights, `retrievalEligible` |
| `templates/` | `templates.json` (home, work-detail, not-found) and `routes.json` (all 39 routes, each mapped once) |
| `compatibility/graph.json` | rhythm and position rules with severities; same ids as the validator's `RULES` |
| `schema/` | `pagespec.schema.json`, `section-contract.schema.json`, `semantic_validate.py`, `protected-content.json`, `example.pagespec.json` (reference home) and `examples/` |
| `assets/asset-roles.json` | closed asset roles with three-way availability, generation policy and generation-safe substitutes |
| `extraction/` | `measured-values.json` (citation ledger, section heights for every route at 1440, QA values), `verify_all.py`, `policy_hash.py`, `wrapper_gate.py`, `prove_drift.py`, `measure_sections.mjs`, `parity_capture.mjs` + `parity_compare.py` + `parity-results.json` |
| `policy/` | `design-policy.json`: the portfolio design policy (local extension of the bound common policy) |
| `docs/` | generation guide, sensitivity and licensing |

## Category and design policy

This repo is a **portfolio** (`category: "portfolio"`, domain art direction and photography), and `registry.manifest.json` `designPolicy` binds it to the generic common policy `n0-design-constraints-common` 0.1.0 (Common IR 0.5, hard-and-soft). The site has no pricing tiers, feature matrices, integrations, dashboards or demo booking, and a generator must not add them. `policy/design-policy.json` (`portfolio-site-web` 1.0.0) is the local extension: work / case-study, about and contact structures are first class, and real client names, partner and award marks, personal identity and photography are must-not-fabricate in generated mode.

`designPolicy.contentHash` covers the files that enforce the policy (`tokens/llm/token-policy.json`, `compatibility/graph.json`, `schema/pagespec.schema.json`, `schema/semantic_validate.py`). After editing any of them run `python3 extraction/policy_hash.py --write`; `verify_all.py` (check `DESIGN_POLICY`) recomputes it and fails on drift.

Status, stated honestly: the policy is **defined, pending architecture review**. The category label and the policy classification (surfaces, audiences) were derived by the extraction agent from the clone; no owner decision is recorded (`architectureDecisionRecorded: false`). Legal and asset-licensing review are separate and still open.

## Modes

Every PageSpec declares `mode`:

- `reference`: a faithful reconstruction of a source route. The route must be one of the 39 in `templates/routes.json` and bound to the declared template. Real copy and assets are allowed as evidence.
- `generated`: a new page for someone else. The `GENERATED_MODE_*` rules in `schema/semantic_validate.py` reject the source brand and its spellings, real people, clients, partner studios, award bodies and ratings, contact details, distinctive CTAs, source copy (exact phrases and any 6-word window of the 39 pages' text), non-reserved URLs, app-store marks and links, source media paths, and any asset role that is not generation-safe. Patterns live in `schema/protected-content.json`; each was found in the real pages.

## Templates

| Template | Routes | Shape |
|---|---|---|
| `home` | `/`, `/fr/` | shell (transition, preloader, menu) -> hero.home-intro -> works.selected-header -> utility.filter-island -> works.card-list -> cta.got-project -> cta.lets-talk -> proof.awards -> about.bio -> proof.partners -> contact.details |
| `work-detail` | 18 EN + 18 FR case studies | shell -> hero.work-head -> media.work-hero-image -> **case-study-body slot** (1-30 of: app window, mission text, stills, image row, image pair, triangle, large image, reels, carousel, quote, palette, phone screens, project link) -> credits -> more works (3 cards) -> got-project -> let's talk |
| `not-found` | `/404/` | shell.page-transition -> hero.not-found |

The two work-page DOM flavours (14 "simple", 4 "web") share one purpose and are one template.

## Run it

Requires Python 3.9+ with `jsonschema` (Draft-07) for the validators; Pillow only for the parity compare.

```bash
python3 extraction/verify_all.py               # everything, exit 1 on any failure
python3 schema/semantic_validate.py --examples # schema + semantic layer on every example
python3 schema/semantic_validate.py my.pagespec.json
python3 schema/tests/adversarial_test.py       # every mutation rejected, every control passes
python3 extraction/prove_drift.py              # verify_all catches each injected drift
python3 extraction/wrapper_gate.py             # R9 height gate alone
python3 extraction/verify_all.py --write-counts  # after adding files: recompute manifest + README counts
```

Re-measuring needs Node and Playwright, with the browser binary given by environment variable (no path is stored here):

```bash
CHROME_PATH=... PLAYWRIGHT_MODULE=... BASE_URL=http://localhost:5190 node extraction/measure_sections.mjs > heights.json
CHROME_PATH=... PLAYWRIGHT_MODULE=... OUT_DIR=<empty temp dir> node extraction/parity_capture.mjs
python3 extraction/parity_compare.py <that dir> --write extraction/parity-results.json
```

The clone itself installs from its lockfile (`npm ci` in the parent project); no dependency folder ships here.

## Evidence and honesty notes

- Citations are `path:line[-line]` plus a `needle` string that must appear inside the cited range; paths are relative to the project root. `verify_all.py` resolves all of them when the source tree is next to this folder and reports them as warnings when it is not.
- The original CSS files are minified onto one line, so CSS citations point at line 1 and rely on the needle.
- Section heights were measured on the clone for all 39 routes at 1440x900. The clone is DOM-identical to the original and the parity harness found identical page heights on every route it captured.
- Parity numbers and what could not be measured are in `extraction/parity-results.json` and `CHANGELOG.md`.
- Judgement calls (which generic labels are not treated as source CTAs, the filter island and menu as non-retrievable, the accent palette named neutrally) are listed in `docs/generation-guide.md`.
