# Changelog

## 1.1.0 (2026-11-04): portfolio category and common-policy binding (Situation B)

- `registry.manifest.json`: `category: "portfolio"` (and `productDomain: "art-direction-and-photography"`); new `designPolicy` block bound to `n0-design-constraints-common` 0.1.0 (Common IR 0.5, hard-and-soft, domain portfolio) with a `contentHash` over `tokens/llm/token-policy.json`, `compatibility/graph.json`, `schema/pagespec.schema.json` and `schema/semantic_validate.py`. `repositoryVersion` 1.0.0 to 1.1.0.
- New `policy/design-policy.json` (`portfolio-site-web` 1.0.0, local extension): classification (portfolio), generation rules, enforcedBy, approval.
- New `extraction/policy_hash.py` (`--check` default, `--write`). Both new files are manifest entryPoints (`designPolicy`, `policyHash`).
- `verify_all.py`: new `DESIGN_POLICY` check (category, binding ids/versions, recomputed hash, policy file and enforcedBy files present, approval not overstated).
- `prove_drift.py`: 9 new cases (hash drift after editing an enforcing file, tampered hash, category changed, category removed, binding removed, version drift, policy file missing, approval overstated as ratified, policy_hash unregistered); new `--scratch <empty dir>` option.
- Counts recomputed (unchanged: no counted item changed).
- Honest status: approval is **defined-pending-architecture-review**; the category and classification are agent-derived, not owner-confirmed. No IR file or IR schema was created or changed.

## 1.0.0 (2026-11-04): initial build (Situation A)

Built from scratch against the jozue.fr clone in the parent folder and the pristine source pages in `.recon/pages/` (39 routes). Counts are in README.md (recomputed by `extraction/verify_all.py --write-counts`).

### Baseline requirements
- R1/R2: PageSpec `mode` (`reference` | `generated`, required, closed); twelve `GENERATED_MODE_*` rules driven by `schema/protected-content.json`, whose brand, person, client, partner, rating, contact, CTA, URL, store and media patterns were all grepped from the real pages, plus hashed 6-word windows of all visible copy on the 39 pages.
- R3: 22 asset roles with three-way availability, generation policy and generation-safe substitutes, pinned in code in `schema/semantic_validate.py` and `extraction/verify_all.py` (availability, and the generation policy of every logo/partner role).
- R4: generated examples for every template family (home, work-detail, not-found) with a fictional person, original copy, `.example` URLs, fiction-range phone numbers, generated/placeholder assets and placeholder recognitions. Reference examples: home (parsed from the real page), the Arte case study and the 404.
- R5: adversarial suite (PageSpec, registry and wrapper-gate mutations) and `extraction/prove_drift.py` (scratch-copy drift injections against verify_all).
- R6: sections are semantic units. Work pages are decomposed into 13 body block types inside one slot; no section exceeds 38.2% of any page at 1440 (works.card-list on `/`); the tallest HERO is 900px.
- R7: every contract has `source` {id, file, tag, lines, needle} and `semantic` {id, category}; verify_all re-reads each source line and checks the tag and needle.
- R8: `retrievalEligible:false` on the preloader, menu overlay, transition layer and floating filter island, pinned in both scripts and checked against contracts, allowlist and templates.
- R9: `extraction/wrapper_gate.py` with thresholds pinned in code; section heights measured at 1440x900 for all 39 routes by `extraction/measure_sections.mjs` (browser path from `CHROME_PATH`).
- R10: `tokens/llm/token-catalog.json` (re-derived from the token files on every verify) and `token-policy.json`; the validator rejects unknown tokens, raw colours, arbitrary spacing, unsupported fonts, invalid surface/text/theme pairs, disallowed surfaces and accent misuse.
- R11: routes reconciled with `.recon/routes.txt` (39/39, each mapped once); both work-page DOM flavours normalised to one template.
- R12: live-vs-clone parity harness (`parity_capture.mjs` + `parity_compare.py`): 8 routes (/, /fr/, arte, billy, youtube, fnac-darty, graille-sur-le-rail, 404), 1440x900, identical scroll offsets, masked time-varying elements excluded from the score. 83 sections compared, pixel-weighted average 0.999959, lowest section 0.9980 (home hero), 0 below the 0.80 gate. Every live page height equalled the clone's. One section is not measurable: the YouTube case-study hero is a video, fully masked. A discrimination control (mismatched viewports) scores 0.3185, so the comparator is not trivially 1.0.
- R13: no IR file generated (not requested).
- R14: no absolute paths, no junk files, entry points inside the package, counts recomputed, zip built last with the CLI.

### Measured corrections to earlier notes
- Mobile load-more grows the home page to 9557px (CLONE_SPEC says 9467, stale).
- Home scrollHeight at 1440 reads 10636 in this repo's own runs (QA brief: 10637); the document is 10636.x px.
- Branding filter: scrollHeight 7246 (CLONE_SPEC 7247, sub-pixel).

### Not measured / limits
- The YouTube work hero (video) has no comparable pixels after masking; reported as not measurable.
- Parity covers 8 of 39 routes (one or more per template family plus representative work flavours); section heights cover all 39.
- Hover, menu and filter states were not pixel-compared; their timings come from the QA measurements and CLONE_SPEC.
