# Generation guide

How to compose a valid PageSpec from this repo, and the judgement calls behind its contracts.

## Steps

1. Pick a template from `templates/templates.json` (`home`, `work-detail`, `not-found`) and follow its `nodes` in order. A `slot` node takes a run of the listed sections in any order.
2. For each node, fill `content` with exactly the fields of `sections/<id>.json` (no extras), within each field's `maxWords`.
3. Pick `motion.pattern` from the contract's `motion.allowed`; `reducedMotionFallback` must equal the value in `tokens/00-foundation/motion-patterns.json`.
4. `tokens` may set `surface`, `text`, `accent`, `spaceBlock`, `font`, using catalog ids only (`tokens/llm/token-catalog.json`). The surface must be in the contract's `tokens.surfaces`, the text colour must pair with it (`token-policy.json` `surfaceTextPairs`), and `surface.accent` needs an `accent` token.
5. Media objects are `{assetRole, ref, alt}`. In generated mode the role must be generation-safe and listed in the contract's `generatedAssetRoles`; refs use `generated://`, `placeholder://` or `user://`.
6. Run `python3 schema/semantic_validate.py page.json` until it reports zero errors. Copy the shape of `schema/examples/generated.*.json`.

## Rhythm the validator enforces

- One HERO per page, first after the shell; shell nodes before content.
- `contact.details` is last on home; `index.more-works` has exactly three cards.
- Media blocks may follow each other (case studies chain galleries); `cta.got-project` directly above `cta.lets-talk` is the real pattern on every page.
- At most four ambient-loop motions per page (warn).

## Judgement calls

- **Retrieval eligibility.** The preloader, the menu overlay, the page-transition layer and the floating filter island are `retrievalEligible: false`. The island is a real feature, but it is a fixed control that takes no page height and only works bound to the work list; generators get it through the home template, not by retrieval. The gallery lightbox is a runtime component, not a section.
- **Load more** is part of `works.card-list` (mobile only, `display:none` at 1440), not a separate section.
- **CTA patterns.** Only labels distinctive to this site are blocked (`Explore my work`, `Got a project?`, `load more?`, `Back home`, project outbound labels, and anything pairing a contact verb with the owner's name). Generic labels the site also uses (`Get in touch`, `More works`, `Credits`) are allowed.
- **Accent palette.** The 17 per-project `data-color` values are kept as `accent.*` tokens with neutral names. They are colours, not identities, so a generated page may use them; they are not tied to the clients they came from.
- **Arial on buttons.** Recorded as `font.family.ua-button` for fidelity, but not selectable.
- **Transition overlay.** `#js-transi` is kept as a shell contract because it is in every page's DOM, with the note that it never animates.
- **Section heights** were measured on the clone, not on the live site. The clone's DOM is identical to the original, and every page height in the parity capture matched the live site exactly.
