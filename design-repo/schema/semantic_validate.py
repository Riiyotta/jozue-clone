#!/usr/bin/env python3
"""Semantic validator for PageSpecs: everything Draft-07 JSON Schema cannot express.

    python3 schema/semantic_validate.py <pagespec.json> [...]      # exit 1 on any error
    python3 schema/semantic_validate.py --examples                 # every example in schema/

Layers, in order:
  1. repo integrity pins (PIN_AVAILABILITY, PIN_RETRIEVAL): the registry files must agree with the
     tables pinned below, so editing assets/asset-roles.json or a contract alone cannot loosen them;
  2. Draft-07 schema (SCHEMA);
  3. template cross-reference: the declared template's REAL node list, including the case-study slot
     (TEMPLATE_SEQUENCE, REQUIRED_SECTION_MISSING), route/template binding (ROUTE_TEMPLATE_MISMATCH,
     HOME_ROUTE_ONLY);
  4. compatibility graph rules (ids identical to compatibility/graph.json);
  5. per-field maxWords from the section contracts (MAX_WORDS);
  6. motion (MOTION_PATTERN_NOT_ALLOWED, MOTION_FALLBACK_MISMATCH);
  7. tokens against tokens/llm/token-catalog.json + token-policy.json (TOKEN_*);
  8. asset roles (ASSET_ROLE_NOT_ALLOWED) and, when mode == "generated", the source-identity rules
     GENERATED_MODE_{BRAND,PERSON,CLIENT,PARTNER,RATING,CONTACT,CTA,COPY,URL,STORE,MEDIA,ASSET}
     driven by schema/protected-content.json (patterns grepped from the real source).
The repo root is derived from this file's location; no absolute path is used.
"""
import hashlib, json, re, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent

# R3: availability pinned in code, independent of assets/asset-roles.json.
PINNED_AVAILABILITY = {
    "brand.wordmark": "blocked-for-generation", "brand.monogram": "blocked-for-generation",
    "brand.project-mark": "blocked-for-generation", "brand.signature-trace": "blocked-for-generation",
    "work.card-media": "reference-only", "work.hero-media": "reference-only", "work.gallery-media": "reference-only",
    "work.video": "reference-only", "partner.logo": "blocked-for-generation", "social.share-image": "reference-only",
    "font.display-face": "reference-only", "icon.ui": "generation-safe", "generated.brand-mark": "generation-safe",
    "placeholder.brand-mark": "generation-safe", "generated.project-visual": "generation-safe",
    "placeholder.project-video": "generation-safe", "placeholder.partner-mark": "generation-safe",
    "fictional.person-avatar": "generation-safe", "placeholder.award-label": "generation-safe",
    "placeholder.url": "generation-safe", "original.copy": "generation-safe", "licensed-or-fallback.font": "generation-safe",
}
# Roles whose generation policy is pinned to a specific value (a real wordmark is never reusable).
PINNED_GENERATION_POLICY = {"brand.wordmark": "must-not-reuse", "brand.monogram": "must-not-reuse", "brand.project-mark": "must-not-reuse",
                            "brand.signature-trace": "must-not-reuse", "partner.logo": "must-not-reuse"}
# R8: runtime/utility UI that is not retrievable, pinned in code.
RETRIEVAL_INELIGIBLE = {"shell.page-transition", "shell.intro-preloader", "shell.site-menu", "utility.filter-island"}
RUNTIME_ID = re.compile(r"(^shell\.|^utility\.|overlay|modal|dialog|drawer|menu|preloader|intro-|cookie|consent|toast|transition|lightbox|island|cursor)")
NON_CONTENT = {"SHELL", "UTILITY"}
RESERVED_HOST = re.compile(r"(^|\.)(example|invalid)$|^example\.(com|org|net)$")
MEDIA_SCHEMES = ("generated://", "placeholder://", "user://")

RULES = {  # graph rule ids -> severity; verify_all.py checks equality with compatibility/graph.json
    "ONE_HERO": "error", "HERO_FIRST_CONTENT": "error", "SHELL_BEFORE_CONTENT": "error", "MUST_BE_LAST": "error",
    "ONE_PER_PAGE": "error", "REQUIRES_SECTION": "error", "TEMPLATE_ONLY": "error", "NO_ADJACENT_SAME_CATEGORY": "warn",
    "NO_CONSECUTIVE_DUPLICATE": "warn", "MORE_WORKS_THREE_CARDS": "error", "MOTION_BUDGET": "warn",
    "HOME_ROUTE_ONLY": "error", "RETRIEVAL_INELIGIBLE_SHELL_ONLY": "error",
}


def _j(p):
    return json.loads(Path(p).read_text())


def load_repo(root=ROOT):
    root = Path(root)
    return {
        "root": root,
        "schema": _j(root / "schema/pagespec.schema.json"),
        "contracts": {p.stem: _j(p) for p in sorted((root / "sections").glob("*.json"))},
        "templates": _j(root / "templates/templates.json")["templates"],
        "routes": _j(root / "templates/routes.json")["routes"],
        "graph": _j(root / "compatibility/graph.json"),
        "catalog": _j(root / "tokens/llm/token-catalog.json")["tokens"],
        "policy": _j(root / "tokens/llm/token-policy.json"),
        "allowlist": _j(root / "tokens/llm/component-allowlist.json"),
        "roles": _j(root / "assets/asset-roles.json")["roles"],
        "protected": _j(root / "schema/protected-content.json"),
        "motion": _j(root / "tokens/00-foundation/motion-patterns.json")["patterns"],
    }


def repo_integrity(repo):
    """Pins that every validation run re-asserts against the registry files."""
    errs = []
    roles = repo["roles"]
    if set(roles) != set(PINNED_AVAILABILITY):
        errs.append(("PIN_AVAILABILITY", f"asset roles {sorted(set(roles) ^ set(PINNED_AVAILABILITY))} differ from the pinned table"))
    for r, av in PINNED_AVAILABILITY.items():
        if r in roles and roles[r].get("availability") != av:
            errs.append(("PIN_AVAILABILITY", f"{r}: registry says {roles[r].get('availability')!r}, pinned {av!r}"))
    for r, pol in PINNED_GENERATION_POLICY.items():
        if r in roles and roles[r].get("generationPolicy") != pol:
            errs.append(("PIN_AVAILABILITY", f"{r}: generationPolicy {roles[r].get('generationPolicy')!r}, pinned {pol!r}"))
    for r, d in roles.items():
        if d.get("availability") != "generation-safe":
            subs = d.get("generationSafeSubstitutes") or []
            if not subs or any(PINNED_AVAILABILITY.get(s) != "generation-safe" for s in subs):
                errs.append(("PIN_AVAILABILITY", f"{r}: needs generationSafeSubstitutes that are generation-safe"))
    false_set = {sid for sid, c in repo["contracts"].items() if c.get("retrievalEligible") is False}
    if false_set != RETRIEVAL_INELIGIBLE:
        errs.append(("PIN_RETRIEVAL", f"contracts with retrievalEligible:false {sorted(false_set)} != pinned {sorted(RETRIEVAL_INELIGIBLE)}"))
    for sid, c in repo["contracts"].items():
        if RUNTIME_ID.search(sid) and sid not in RETRIEVAL_INELIGIBLE:
            errs.append(("PIN_RETRIEVAL", f"{sid} looks like runtime UI but is not in RETRIEVAL_INELIGIBLE"))
        if c.get("retrievalEligible") is False and len(c.get("retrievalReason", "")) < 30:
            errs.append(("PIN_RETRIEVAL", f"{sid}: retrievalReason must be >= 30 chars"))
        if c.get("retrievalEligible") is False and c["semantic"]["category"] not in NON_CONTENT:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"{sid}: content category {c['semantic']['category']} cannot be ineligible"))
        a = repo["allowlist"]["sections"].get(sid)
        if a is not None and a.get("retrievalEligible") != (sid not in RETRIEVAL_INELIGIBLE):
            errs.append(("PIN_RETRIEVAL", f"allowlist {sid}.retrievalEligible disagrees with the pin"))
    for t, tpl in repo["templates"].items():
        for n in tpl["nodes"]:
            if "section" in n and n.get("retrievalEligible") != (n["section"] not in RETRIEVAL_INELIGIBLE):
                errs.append(("PIN_RETRIEVAL", f"template {t} node {n['section']} retrievalEligible disagrees with the pin"))
    return errs


# ------------------------------------------------------------------ helpers
def words(s):
    return len(re.findall(r"\S+", s))


def walk_strings(obj, path=""):
    if isinstance(obj, str):
        yield path, obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk_strings(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_strings(v, f"{path}[{i}]")


def walk_media(obj, path=""):
    if isinstance(obj, dict):
        if "assetRole" in obj and "ref" in obj:
            yield path, obj
        for k, v in obj.items():
            yield from walk_media(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_media(v, f"{path}[{i}]")


def check_words(fields, content, path, errs):
    for name, f in fields.items():
        if name not in content:
            continue
        v, k, p = content[name], f["kind"], f"{path}.{name}"
        if k == "text" and isinstance(v, str) and words(v) > f["maxWords"]:
            errs.append(("MAX_WORDS", f"{p}: {words(v)} words > {f['maxWords']}"))
        elif k == "textList" and isinstance(v, list):
            for i, s in enumerate(v):
                if isinstance(s, str) and words(s) > f["maxWords"]:
                    errs.append(("MAX_WORDS", f"{p}[{i}]: {words(s)} words > {f['maxWords']}"))
        elif k == "link" and isinstance(v, dict) and words(v.get("label", "")) > f["maxWords"]:
            errs.append(("MAX_WORDS", f"{p}.label: {words(v['label'])} words > {f['maxWords']}"))
        elif k == "linkList" and isinstance(v, list):
            for i, l in enumerate(v):
                if isinstance(l, dict) and words(l.get("label", "")) > f["maxWords"]:
                    errs.append(("MAX_WORDS", f"{p}[{i}].label: {words(l['label'])} words > {f['maxWords']}"))
        elif k in ("media", "mediaList"):
            for i, m in enumerate(v if isinstance(v, list) else [v]):
                if isinstance(m, dict) and words(m.get("alt", "")) > 40:
                    errs.append(("MAX_WORDS", f"{p}[{i}].alt: {words(m['alt'])} words > 40"))
        elif k == "items" and isinstance(v, list):
            for i, it in enumerate(v):
                if isinstance(it, dict):
                    check_words(f["fields"], it, f"{p}[{i}]", errs)


def field_roles(fields, content, out):
    """Collect (media object, allowed reference roles) pairs from content using the contract's field kinds."""
    for name, f in fields.items():
        if name not in content:
            continue
        v = content[name]
        if f["kind"] in ("media", "mediaList"):
            for m in (v if isinstance(v, list) else [v]):
                if isinstance(m, dict):
                    out.append((name, m, f["assetRoles"]))
        elif f["kind"] == "items" and isinstance(v, list):
            for it in v:
                if isinstance(it, dict):
                    field_roles(f["fields"], it, out)


def accent_values(fields, content, out):
    for name, f in fields.items():
        if name not in content:
            continue
        v = content[name]
        if f["kind"] == "accentToken":
            out.append((name, v))
        elif f["kind"] == "items" and isinstance(v, list):
            for it in v:
                if isinstance(it, dict):
                    accent_values(f["fields"], it, out)


def term_re(term):
    return re.compile(r"(?<![\w])" + re.escape(term) + r"(?![\w])", re.I)


_cache = {}


def compiled(repo):
    key = id(repo)
    if key in _cache:
        return _cache[key]
    pats = repo["protected"]["sourceBrand"]["patterns"]
    c = {g: [term_re(t) for t in d.get("terms", []) + d.get("spellingVariants", [])] + [re.compile(r) for r in d.get("regex", [])]
         for g, d in pats.items() if g not in ("COPY", "URL", "MEDIA")}
    c["COPY_PHRASES"] = [term_re(p) for p in pats["COPY"]["phrases"]]
    c["SHINGLES"] = set(pats["COPY"]["shingleHashes"]); c["SH"] = pats["COPY"]["shingleSize"]
    c["URL_DOMAINS"] = [d.lower() for d in pats["URL"]["domains"]]
    c["MEDIA"] = [re.compile(r) for r in pats["MEDIA"]["regex"]]
    c["PHONE"] = re.compile(repo["protected"]["fictionalPhone"]["regex"])
    _cache[key] = c
    return c


def norm(s):
    s = s.lower().replace("’", "'").replace("‘", "'")
    return re.sub(r"[^a-z0-9à-öø-ÿ']+", " ", s).strip()


def url_strings(spec):
    for p, s in walk_strings(spec):
        if re.match(r"(?i)^(https?://|mailto:|tel:|www\.)", s.strip()) or p.endswith(".href") or p.endswith(".target") or p == "brand.domain" or p.endswith(".phone"):
            yield p, s.strip()


def generated_mode(spec, repo, errs):
    c = compiled(repo)
    texts = [(p, s) for p, s in walk_strings({"meta": spec.get("meta"), "brand": spec.get("brand"), "nodes": spec.get("nodes")})
             if not re.search(r"\.(section|pattern|reducedMotionFallback|assetRole|surface|text|accent|spaceBlock|font|variant|recognitionSource|slug)$", p)
             and not re.search(r"\.tokens\.", p)]
    # multi-line copy is split across list items / line fields (slogan words, title lines): check it joined too
    def joined(o, path):
        if isinstance(o, list):
            if len(o) > 1 and all(isinstance(x, str) for x in o):
                yield path + "[joined]", " ".join(o)
            for i, x in enumerate(o):
                yield from joined(x, f"{path}[{i}]")
        elif isinstance(o, dict):
            lines = [v for k, v in sorted(o.items()) if k.startswith("line") and isinstance(v, str)]
            if len(lines) > 1:
                yield path + ".lines[joined]", " ".join(lines)
            for k, v in o.items():
                yield from joined(v, f"{path}.{k}")
    texts += list(joined(spec.get("nodes", []), "nodes"))
    for p, s in texts:
        for group, code in (("BRAND", "GENERATED_MODE_BRAND"), ("PERSON", "GENERATED_MODE_PERSON"), ("CLIENT", "GENERATED_MODE_CLIENT"),
                            ("PARTNER", "GENERATED_MODE_PARTNER"), ("RATING", "GENERATED_MODE_RATING"), ("CONTACT", "GENERATED_MODE_CONTACT"),
                            ("CTA", "GENERATED_MODE_CTA"), ("STORE", "GENERATED_MODE_STORE")):
            hit = next((r.pattern for r in c[group] if r.search(s)), None)
            if hit:
                errs.append((code, f"{p}: source {group.lower()} pattern {hit!r} in {s[:60]!r}"))
        if any(r.search(s) for r in c["COPY_PHRASES"]):
            errs.append(("GENERATED_MODE_COPY", f"{p}: source phrase in {s[:60]!r}"))
        else:
            w = norm(s).split()
            for i in range(0, len(w) - c["SH"] + 1):
                if hashlib.sha1(" ".join(w[i:i + c["SH"]]).encode()).hexdigest()[:16] in c["SHINGLES"]:
                    errs.append(("GENERATED_MODE_COPY", f"{p}: shares a {c['SH']}-word window with source copy: {' '.join(w[i:i + c['SH']])!r}"))
                    break
        low = s.lower()
        for d in c["URL_DOMAINS"]:
            if d in low:
                errs.append(("GENERATED_MODE_URL", f"{p}: source URL/domain {d!r}"))
                break
    for p, s in url_strings(spec):
        low = s.lower()
        if low.startswith("tel:"):
            if not c["PHONE"].match(s.replace(" ", "")):
                errs.append(("GENERATED_MODE_CONTACT", f"{p}: tel must use a fiction-reserved range, got {s!r}"))
            continue
        if low.startswith("#") or (low.startswith("/") and not low.startswith("//")):
            continue
        host = ""
        if low.startswith("mailto:"):
            host = low.split("@")[-1]
        elif p == "brand.domain":
            host = low
        else:
            host = urlparse(s if "://" in s else "https://" + s).hostname or ""
        if not RESERVED_HOST.search(host):
            errs.append(("GENERATED_MODE_URL", f"{p}: {s!r} is not on a reserved domain (.example/.invalid/example.com)"))
    for p, m in walk_media(spec.get("nodes", [])):
        role, ref = m.get("assetRole"), m.get("ref", "")
        if PINNED_AVAILABILITY.get(role) != "generation-safe":
            errs.append(("GENERATED_MODE_ASSET", f"nodes{p}: role {role!r} is {PINNED_AVAILABILITY.get(role)} (not generation-safe)"))
        if not ref.startswith(MEDIA_SCHEMES) or any(r.search(ref) for r in c["MEDIA"]):
            errs.append(("GENERATED_MODE_MEDIA", f"nodes{p}: ref {ref!r} must be generated://, placeholder:// or user:// and not a source asset"))
    for i, n in enumerate(spec.get("nodes", [])):
        if n.get("section") == "proof.awards":
            for j, a in enumerate(n.get("content", {}).get("awards", [])):
                if a.get("recognitionSource") != "placeholder":
                    errs.append(("GENERATED_MODE_RATING", f"nodes[{i}].content.awards[{j}]: generated recognitions must be recognitionSource 'placeholder'"))


def match_template(spec, repo, errs):
    tpl = repo["templates"].get(spec["template"])
    nodes = spec["nodes"]; i = 0
    for t in tpl["nodes"]:
        if "slot" in t:
            n0 = i
            while i < len(nodes) and nodes[i]["section"] in t["allowed"]:
                i += 1
            cnt = i - n0
            if cnt < t.get("minItems", 0) or cnt > t.get("maxItems", 10 ** 6):
                errs.append(("TEMPLATE_SEQUENCE", f"slot {t['slot']}: {cnt} nodes, allowed {t.get('minItems', 0)}-{t.get('maxItems')}"))
            continue
        if i < len(nodes) and nodes[i]["section"] == t["section"]:
            i += 1
            while t.get("repeatable") and i < len(nodes) and nodes[i]["section"] == t["section"]:
                i += 1
        elif t.get("required"):
            errs.append(("REQUIRED_SECTION_MISSING", f"template {spec['template']} requires {t['section']} at this position (found {nodes[i]['section'] if i < len(nodes) else 'end of page'})"))
    if i < len(nodes):
        errs.append(("TEMPLATE_SEQUENCE", f"node[{i}] {nodes[i]['section']} is not allowed at this position by template {spec['template']}"))


def check_tokens(i, n, spec, repo, errs):
    cat, pol, con = repo["catalog"], repo["policy"], repo["contracts"][n["section"]]
    t = n.get("tokens") or {}
    raw_color = re.compile(pol["rawValueRestrictions"]["color"]["regex"])
    raw_space = re.compile(pol["rawValueRestrictions"]["spacing"]["regex"])
    for field, v in t.items():
        want = pol["pageSpecTokenFields"][field]["category"]
        p = f"nodes[{i}].tokens.{field}"
        if raw_color.search(v) and v not in cat:
            errs.append(("TOKEN_RAW_COLOR", f"{p}: raw colour {v!r}; use a catalog token")); continue
        if field == "spaceBlock" and raw_space.match(v):
            errs.append(("TOKEN_ARBITRARY_SPACING", f"{p}: arbitrary spacing {v!r}; use a space.* token")); continue
        if field == "font" and v not in pol["fontFamilyAllowed"]:
            errs.append(("TOKEN_FONT_UNSUPPORTED", f"{p}: font {v!r} not in {pol['fontFamilyAllowed']}")); continue
        if v not in cat:
            errs.append(("TOKEN_UNKNOWN", f"{p}: {v!r} not in token-catalog")); continue
        if cat[v]["category"] != want:
            errs.append(("TOKEN_CATEGORY", f"{p}: {v!r} is {cat[v]['category']}, field needs {want}")); continue
        if not cat[v].get("pageSpecReferenceable"):
            errs.append(("TOKEN_NOT_REFERENCEABLE", f"{p}: {v!r} is not PageSpec-referenceable"))
    surf, text = t.get("surface"), t.get("text")
    if surf:
        if surf not in pol["themes"].get(spec["theme"], []):
            errs.append(("TOKEN_THEME_COMBINATION", f"nodes[{i}]: surface {surf!r} not defined in theme {spec['theme']!r}"))
        if surf not in con["tokens"]["surfaces"]:
            errs.append(("TOKEN_SURFACE_NOT_ALLOWED", f"nodes[{i}] {n['section']}: surface {surf!r} not in {con['tokens']['surfaces']}"))
        if text and text not in pol["surfaceTextPairs"].get(surf, []):
            errs.append(("TOKEN_THEME_COMBINATION", f"nodes[{i}]: text {text!r} on {surf!r} is not an approved pair"))
        if surf == "surface.accent" and not t.get("accent"):
            errs.append(("TOKEN_ACCENT_REQUIRED", f"nodes[{i}]: surface.accent needs tokens.accent"))
    if t.get("accent") and not con["tokens"]["accent"]:
        errs.append(("TOKEN_ACCENT_NOT_ALLOWED", f"nodes[{i}] {n['section']}: contract does not take an accent"))
    acc = []
    accent_values(con["content"], n.get("content", {}), acc)
    for name, v in acc:
        if not isinstance(v, str):
            continue
        if raw_color.search(v) and v not in cat:
            errs.append(("TOKEN_RAW_COLOR", f"nodes[{i}].content.{name}: raw colour {v!r}"))
        elif v not in cat:
            errs.append(("TOKEN_UNKNOWN", f"nodes[{i}].content.{name}: {v!r} not in token-catalog"))
        elif cat[v]["category"] != "accent":
            errs.append(("TOKEN_CATEGORY", f"nodes[{i}].content.{name}: {v!r} is not an accent token"))


def validate(spec, repo=None):
    """Return (errors, warnings); each a list of (code, message)."""
    repo = repo or load_repo()
    errs, warns = list(repo_integrity(repo)), []
    try:
        from jsonschema import Draft7Validator
    except ImportError:
        return errs + [("SCHEMA", "jsonschema is required (pip install jsonschema)")], warns
    se = sorted(Draft7Validator(repo["schema"]).iter_errors(spec), key=lambda e: list(e.absolute_path))
    for e in se:
        errs.append(("SCHEMA", f"{'/'.join(map(str, e.absolute_path))}: {e.message[:160]}"))
    if se:
        return errs, warns
    C, nodes = repo["contracts"], spec["nodes"]
    mode = spec["mode"]
    # route / template binding
    routes = {r["path"]: r for r in repo["routes"]}
    if mode == "reference":
        r = routes.get(spec["route"])
        if not r or r["template"] != spec["template"]:
            errs.append(("ROUTE_TEMPLATE_MISMATCH", f"route {spec['route']} is mapped to {r['template'] if r else 'nothing'}, spec says {spec['template']}"))
        if spec["template"] == "home" and spec["route"] not in [p for p, x in routes.items() if x["template"] == "home"]:
            errs.append(("HOME_ROUTE_ONLY", f"home template used on {spec['route']}"))
    match_template(spec, repo, errs)
    cats = [C[n["section"]]["semantic"]["category"] for n in nodes]
    # graph rules
    if cats.count("HERO") != 1:
        errs.append(("ONE_HERO", f"{cats.count('HERO')} HERO nodes"))
    content_idx = [k for k, c in enumerate(cats) if c not in NON_CONTENT]
    if content_idx and cats[content_idx[0]] != "HERO":
        errs.append(("HERO_FIRST_CONTENT", f"first content node is {nodes[content_idx[0]]['section']}"))
    if content_idx and any(c == "SHELL" for c in cats[content_idx[0]:]):
        errs.append(("SHELL_BEFORE_CONTENT", "a SHELL node appears after content"))
    counts = {}
    for k, n in enumerate(nodes):
        sid, con = n["section"], C[n["section"]]
        counts[sid] = counts.get(sid, 0) + 1
        cs = con.get("constraints", {})
        if cs.get("mustBeLast") and k != len(nodes) - 1:
            errs.append(("MUST_BE_LAST", f"{sid} must be the last node"))
        if cs.get("templates") and spec["template"] not in cs["templates"]:
            errs.append(("TEMPLATE_ONLY", f"{sid} only allowed in {cs['templates']}"))
        for req in cs.get("requires", []):
            if req not in [x["section"] for x in nodes]:
                errs.append(("REQUIRES_SECTION", f"{sid} requires {req}"))
        if "retrievalEligible" in n and n["retrievalEligible"] != con["retrievalEligible"]:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"nodes[{k}] {sid}: retrievalEligible {n['retrievalEligible']} contradicts the contract/pin"))
        if "retrievalEligible" in n and n["retrievalEligible"] is False and sid not in RETRIEVAL_INELIGIBLE:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"nodes[{k}] {sid}: a content section cannot be marked ineligible"))
        check_words(con["content"], n["content"], f"nodes[{k}].content", errs)
        # motion
        m = n["motion"]
        if m["pattern"] not in con["motion"]["allowed"]:
            errs.append(("MOTION_PATTERN_NOT_ALLOWED", f"nodes[{k}] {sid}: {m['pattern']!r} not in {con['motion']['allowed']}"))
        exp = repo["motion"].get(m["pattern"], {}).get("reducedMotionFallback")
        if m["reducedMotionFallback"] != exp:
            errs.append(("MOTION_FALLBACK_MISMATCH", f"nodes[{k}] {sid}: fallback for {m['pattern']} must be {exp!r}"))
        check_tokens(k, n, spec, repo, errs)
        # assets
        pairs = []
        field_roles(con["content"], n["content"], pairs)
        for name, mobj, roles in pairs:
            role = mobj.get("assetRole")
            allowed = set(con["generatedAssetRoles"]) if mode == "generated" else set(roles) | set(con["generatedAssetRoles"])
            if role not in allowed:
                errs.append(("ASSET_ROLE_NOT_ALLOWED", f"nodes[{k}] {sid}.{name}: role {role!r} not allowed here in {mode} mode"))
        if sid == "index.more-works" and len(n["content"].get("cards", [])) != 3:
            errs.append(("MORE_WORKS_THREE_CARDS", f"nodes[{k}]: {len(n['content'].get('cards', []))} cards"))
    for sid, cnt in counts.items():
        cs = C[sid].get("constraints", {})
        if (cs.get("onePerPage") and cnt > 1) or ("maxPerPage" in cs and cnt > cs["maxPerPage"]):
            errs.append(("ONE_PER_PAGE", f"{sid} appears {cnt} times"))
    # warn-level rhythm rules
    g = {r["id"]: r for r in repo["graph"]["rules"]}
    exc = g["NO_ADJACENT_SAME_CATEGORY"].get("exceptions", [])
    for k in range(1, len(nodes)):
        a, b = nodes[k - 1], nodes[k]
        ca, cb = cats[k - 1], cats[k]
        if ca == cb:
            ok = any(e.get("categories") == [ca, cb] or e.get("pair") == [a["section"], b["section"]] for e in exc)
            if not ok:
                warns.append(("NO_ADJACENT_SAME_CATEGORY", f"{a['section']} -> {b['section']} ({ca})"))
        if a["section"] == b["section"] and a["content"].get("variant") == b["content"].get("variant"):
            warns.append(("NO_CONSECUTIVE_DUPLICATE", f"{a['section']} ({a['content'].get('variant')}) twice in a row"))
    amb = g["MOTION_BUDGET"]
    n_amb = sum(1 for n in nodes if n["motion"]["pattern"] in amb["ambient"])
    if n_amb > amb["max"]:
        warns.append(("MOTION_BUDGET", f"{n_amb} ambient-loop nodes > {amb['max']}"))
    if mode == "generated":
        generated_mode(spec, repo, errs)
    return errs, warns


def example_paths(root=ROOT):
    return [root / "schema/example.pagespec.json"] + sorted((root / "schema/examples").glob("*.json"))


def main(argv):
    paths = example_paths() if argv[1:] == ["--examples"] else [Path(a) for a in argv[1:]]
    if not paths:
        print(__doc__); return 2
    repo = load_repo(); bad = 0
    for p in paths:
        spec = json.loads(Path(p).read_text())
        e, w = validate(spec, repo)
        name = p.relative_to(ROOT) if str(p).startswith(str(ROOT)) else p
        print(f"{'PASS' if not e else 'FAIL'}  {name}  mode={spec.get('mode')} template={spec.get('template')}  errors={len(e)} warnings={len(w)}")
        for code, msg in e:
            print(f"   ERROR {code}: {msg}")
        for code, msg in w:
            print(f"   warn  {code}: {msg}")
        bad += bool(e)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
