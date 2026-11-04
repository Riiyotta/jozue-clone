# Sensitivity and licensing

The source is the live portfolio of a real, named freelance art director. Treat everything that identifies him, his clients or his collaborators as someone else's property.

## Never reproduce in generated output

| Kind | Examples in the source | Where it is enforced |
|---|---|---|
| Identity | the person's name and the site's wordmark, both logo SVGs, the project logo, the handwritten "J" and signature stroke data (`#trace-j`, `#trace-signature`) | `GENERATED_MODE_BRAND`, roles `brand.*` = blocked-for-generation |
| Contact | phone number, email address, postal code and town, social profile handles | `GENERATED_MODE_CONTACT`, `GENERATED_MODE_URL` |
| Clients and work | client and brand names, project titles and slogans, all work imagery and films | `GENERATED_MODE_CLIENT`, `GENERATED_MODE_COPY`, `GENERATED_MODE_MEDIA`, roles `work.*` = reference-only |
| Collaborators | partner studios and freelancers, their logos and sites | `GENERATED_MODE_PERSON`, `GENERATED_MODE_PARTNER`, role `partner.logo` = blocked-for-generation |
| Recognition | award bodies and listings | `GENERATED_MODE_RATING`; generated award entries must be `recognitionSource: "placeholder"` |
| Copy | bio, taglines, case-study text, distinctive labels | `GENERATED_MODE_COPY` (phrases + 6-word windows hashed from all 39 pages), `GENERATED_MODE_CTA` |

The full pattern list is `schema/protected-content.json`. Every entry was found in the real pages; none was invented.

## Asset availability

`assets/asset-roles.json` gives each role one of `reference-only`, `generation-safe`, `blocked-for-generation`, plus generation-safe substitutes. The same table is pinned in code (`PINNED_AVAILABILITY` in `schema/semantic_validate.py` and `extraction/verify_all.py`), so editing the registry alone fails validation. No source wordmark or logo is ever reusable in generated mode.

## Typeface

Neue Haas Grotesk Display is a commercial typeface. The token `font.family.display` names the family and its fallback stack; a generated page must either hold its own licence or render the fallback stack (`licensed-or-fallback.font`).

## URLs and phone numbers in generated pages

Absolute links must use reserved domains (`*.example`, `*.invalid`, `example.com/.org/.net`). Phone links must use a range reserved for fiction: France +33 1 99 00 xx xx, or North America +1 555-01xx.

## Distribution

Keep this repository private. `design-repo.zip` is a build artefact; do not commit it next to this folder.
