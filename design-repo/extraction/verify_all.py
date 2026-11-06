#!/usr/bin/env python3
"""One-shot verification of this design-repo. Exit 1 on any failure.

    python3 extraction/verify_all.py                 # verify
    python3 extraction/verify_all.py --write-counts  # recompute manifest counts + README count block, then verify

Checks (each named in the output):
  JSON            every *.json parses
  MANIFEST        entryPoints exist and stay inside design-repo; counts recomputed from disk;
                  allowlistVersion == tokens/llm/component-allowlist.json version (machine-checked)
  DESIGN_POLICY   category == portfolio; designPolicy bound to n0-design-constraints-common 0.1.0 (Common IR 0.5,
                  hard-and-soft); contentHash recomputed over the enforcing files (extraction/policy_hash.py);
                  policy/design-policy.json exists;
                  policy approval stays defined-pending-architecture-review (owner made no architecture decision)
  REVIEW          status == designReviewStatus == design-reviewed; designReview {by (named human, not an agent), date};
                  productionApproved is false
  README_COUNTS   README count block equals the recomputed counts (never hand-typed)
  ALLOWLIST       parity both ways: allowlist ids <-> contract files (sections/primitives/components)
  CONTRACTS       every section contract validates against schema/section-contract.schema.json
  SOURCE_SEMANTIC R7: semantic.id == id == file stem, source.id != id
  RETRIEVAL       R8: RETRIEVAL_INELIGIBLE pin == contracts == allowlist == templates; runtime-looking ids pinned
  PINS            R3: PINNED_AVAILABILITY here == the one in semantic_validate.py == assets/asset-roles.json
  TOKENS          R10: token-catalog re-derived from the token files (no missing/extra/changed); policy
                  categories resolve to real catalog categories; catalog/policy registered in the manifest
  SCHEMA_SYNC     schema section enum == contracts; content properties == contract fields; assetRole enum
                  == asset roles; template enum == templates; motion enum == motion-patterns
  MOTION          every contract motion pattern exists and has a reducedMotionFallback
  TEMPLATES       node sections exist; routes 1:1 (39), and == the source route list when present
  GRAPH_SYNC      compatibility/graph.json rule ids == semantic_validate.RULES (same severities)
  CITATIONS       every {cite, needle} resolves: file exists, range inside the file, needle inside range
  SOURCE_TAGS     R7: each contract's source.file has <tag at source.lines containing source.needle
  EXAMPLES        every example passes schema + semantic validation; one generated example per template
  WRAPPER_GATE    R9: extraction/wrapper_gate.py
  HYGIENE         no absolute machine paths, no __pycache__/.DS_Store/__MACOSX/Thumbs.db
Citations and source tags resolve against the project root (the folder containing design-repo/);
when that source tree is absent they are reported as warnings, not failures (self-contained copy).
"""
import importlib.util, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent
EXPECTED_ROUTES = 39

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
RETRIEVAL_INELIGIBLE = {"shell.page-transition", "shell.intro-preloader", "shell.site-menu", "utility.filter-island"}
RUNTIME_ID = re.compile(r"(^shell\.|^utility\.|overlay|modal|dialog|drawer|menu|preloader|intro-|cookie|consent|toast|transition|lightbox|island|cursor)")

FAILS, WARNS, PASSES = [], [], []


def fail(check, msg): FAILS.append((check, msg))
def warn(check, msg): WARNS.append((check, msg))
def j(rel): return json.loads((ROOT / rel).read_text())


def load_module(name, rel):
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); return mod


def compute_counts():
    secs = sorted((ROOT / "sections").glob("*.json"))
    cat = j("tokens/llm/token-catalog.json")["tokens"]
    tpl = j("templates/templates.json")["templates"]
    ex = [ROOT / "schema/example.pagespec.json"] + sorted((ROOT / "schema/examples").glob("*.json"))
    exm = [json.loads(p.read_text())["mode"] for p in ex]
    adv = load_module("adv_count", "schema/tests/adversarial_test.py")
    return {
        "tokens": len(cat),
        "pageSpecReferenceableTokens": sum(1 for t in cat.values() if t.get("pageSpecReferenceable")),
        "primitives": len(list((ROOT / "primitives").glob("*.json"))),
        "components": len(list((ROOT / "components").glob("*.json"))),
        "sections": len(secs),
        "retrievalIneligibleSections": sum(1 for p in secs if json.loads(p.read_text()).get("retrievalEligible") is False),
        "templates": len(tpl),
        "routes": len(j("templates/routes.json")["routes"]),
        "assetRoles": len(j("assets/asset-roles.json")["roles"]),
        "motionPatterns": len(j("tokens/00-foundation/motion-patterns.json")["patterns"]),
        "graphRules": len(j("compatibility/graph.json")["rules"]),
        "examples": len(ex), "referenceExamples": exm.count("reference"), "generatedExamples": exm.count("generated"),
        "adversarialMutations": len(adv.MUTATIONS) + len(adv.REPO_MUTATIONS) + len(adv.GATE_MUTATIONS),
        "adversarialControls": len(ex) + 1,  # every example + the wrapper gate on real measurements
    }


def readme_block(c):
    rows = "\n".join(f"| {k} | {v} |" for k, v in c.items())
    return f"<!-- counts:start (written by extraction/verify_all.py --write-counts) -->\n| item | count |\n|---|---|\n{rows}\n<!-- counts:end -->"


def check_citation(obj, where):
    """obj = {cite: 'path:a[-b]', needle}. Returns False when the source tree is absent."""
    m = re.match(r"^(.+):(\d+)(?:-(\d+))?$", obj["cite"])
    if not m:
        fail("CITATIONS", f"{where}: malformed cite {obj['cite']!r}"); return True
    path, a, b = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
    f = SRC / path
    if not f.exists():
        return False
    lines = f.read_text(errors="ignore").split("\n")
    if a < 1 or b > len(lines) or a > b:
        fail("CITATIONS", f"{where}: {obj['cite']} outside {path} (1-{len(lines)})"); return True
    if obj.get("needle") and not any(obj["needle"] in l for l in lines[a - 1:b]):
        fail("CITATIONS", f"{where}: needle {obj['needle'][:50]!r} not at {obj['cite']}")
    return True


def walk_cites(o, where, out):
    if isinstance(o, dict):
        if isinstance(o.get("cite"), str):
            out.append((o, where))
        for k, v in o.items():
            walk_cites(v, where, out)
    elif isinstance(o, list):
        for v in o:
            walk_cites(v, where, out)


BOUND_POLICY = {"policyId": "n0-design-constraints-common", "policyVersion": "0.1.0", "commonIrVersion": "0.5",
                "enforcementMode": "hard-and-soft"}
LOCAL_EXTENSION = {"ref": "policy/design-policy.json", "policyId": "portfolio-site-web", "policyVersion": "1.0.0"}


def check_design_policy(man):
    """Portfolio category + common-policy binding. Policy approval is still awaiting an architecture decision: the check also fails if the files claim a
    ratified decision, so the status cannot be overstated."""
    ph = load_module("policy_hash", "extraction/policy_hash.py")
    dp = man.get("designPolicy") or {}
    errs = []
    if man.get("category") != "portfolio":
        errs.append(f"manifest category is {man.get('category')!r}, expected 'portfolio'")
    if not dp:
        errs.append("manifest has no designPolicy binding")
    for k, v in BOUND_POLICY.items():
        if dp.get(k) != v:
            errs.append(f"designPolicy.{k} is {dp.get(k)!r}, expected {v!r}")
    if dp.get("category") != "portfolio" or dp.get("domain") != "art-direction-and-photography" or man.get("productDomain") != dp.get("domain"):
        errs.append("designPolicy category/domain must be portfolio / art-direction-and-photography and match the manifest")
    ext = dp.get("localExtension") or {}
    for k, v in LOCAL_EXTENSION.items():
        if ext.get(k) != v:
            errs.append(f"designPolicy.localExtension.{k} is {ext.get(k)!r}, expected {v!r}")
    pol = {}
    if not (ROOT / LOCAL_EXTENSION["ref"]).is_file():
        errs.append("policy/design-policy.json does not exist")
    else:
        pol = j(LOCAL_EXTENSION["ref"])
        cls = pol.get("classification") or {}
        if pol.get("policyId") != LOCAL_EXTENSION["policyId"] or pol.get("policyVersion") != LOCAL_EXTENSION["policyVersion"]:
            errs.append("policy file id/version disagree with designPolicy.localExtension")
        if (pol.get("extends") or {}).get("policyId") != BOUND_POLICY["policyId"] or (pol.get("extends") or {}).get("policyVersion") != BOUND_POLICY["policyVersion"]:
            errs.append("policy file must extend n0-design-constraints-common 0.1.0")
        if cls.get("productCategory") != "portfolio" or cls.get("productDomain") != dp.get("domain"):
            errs.append("policy classification must be portfolio with the manifest domain")
        ap = pol.get("approval") or {}
        if ap.get("policyDecision") != "defined-pending-architecture-review" or ap.get("architectureDecisionRecorded") is not False:
            errs.append("policy approval must stay defined-pending-architecture-review / architectureDecisionRecorded false")
        if (dp.get("decision") or {}).get("architectureDecisionRecorded") is not False:
            errs.append("designPolicy.decision must not claim a recorded decision")
        for rel in pol.get("enforcedBy", []):
            if not (ROOT / rel).exists():
                errs.append(f"policy enforcedBy {rel} missing")
    if dp.get("contentHashFiles") != ph.POLICY_FILES:
        errs.append("designPolicy.contentHashFiles != extraction/policy_hash.py POLICY_FILES")
    want = ph.compute(ROOT)
    if dp.get("contentHash") != want:
        errs.append(f"designPolicy.contentHash {dp.get('contentHash')!r} != recomputed {want!r}")
    for e in errs:
        fail("DESIGN_POLICY", e)
    PASSES.append("DESIGN_POLICY")


AGENT_RE = re.compile(r"\b(claude|ai|agent|bot|assistant|gpt|llm|automated|script)\b", re.I)


def check_review(man):
    """Owner review record (engine reviewed state): named human, dated; never production-approved."""
    errs = []
    for k in ("status", "designReviewStatus"):
        if man.get(k) != "design-reviewed":
            errs.append(f"manifest {k} is {man.get(k)!r}, expected 'design-reviewed'")
    dr = man.get("designReview")
    if not isinstance(dr, dict):
        errs.append("manifest designReview record missing")
    else:
        by = str(dr.get("by", "")).strip()
        if len(by) < 3 or AGENT_RE.search(by):
            errs.append(f"designReview.by {by!r} must be a named human, not an agent")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(dr.get("date", ""))):
            errs.append("designReview.date must be YYYY-MM-DD")
        if not str(dr.get("note", "")).strip():
            errs.append("designReview.note missing")
    if man.get("productionApproved") is not False:
        errs.append("productionApproved must stay false")
    for e in errs:
        fail("REVIEW", e)
    PASSES.append("REVIEW")


def main(write_counts=False):
    # JSON
    docs = {}
    for p in sorted(ROOT.rglob("*.json")):
        try:
            docs[str(p.relative_to(ROOT))] = json.loads(p.read_text())
        except Exception as e:
            fail("JSON", f"{p.relative_to(ROOT)}: {e}")
    PASSES.append("JSON")
    man = j("registry.manifest.json")
    counts = compute_counts()
    if write_counts:
        man["counts"] = counts
        (ROOT / "registry.manifest.json").write_text(json.dumps(man, indent=1, ensure_ascii=False) + "\n")
        rd = (ROOT / "README.md").read_text()
        rd = re.sub(r"<!-- counts:start.*?<!-- counts:end -->", readme_block(counts), rd, flags=re.S)
        (ROOT / "README.md").write_text(rd)
    # MANIFEST
    for name, ep in man.get("entryPoints", {}).items():
        if ep.startswith("..") or ep.startswith("/") or not (ROOT / ep).exists():
            fail("MANIFEST", f"entryPoint {name} -> {ep} missing or outside design-repo")
    for need in ("token-catalog", "token-policy", "component-allowlist", "motion-patterns", "asset-roles", "pagespec.schema", "section-contract.schema", "semantic_validate", "verify_all", "wrapper_gate", "measured-values", "design-policy", "policy_hash"):
        if not any(need in ep for ep in man.get("entryPoints", {}).values()):
            fail("MANIFEST", f"{need} not registered in entryPoints")
    if man.get("counts") != counts:
        diff = {k: (man.get("counts", {}).get(k), v) for k, v in counts.items() if man.get("counts", {}).get(k) != v}
        fail("MANIFEST", f"counts drift (manifest, disk): {diff}")
    al = j("tokens/llm/component-allowlist.json")
    if man.get("allowlistVersion") != al.get("version"):
        fail("MANIFEST", f"allowlistVersion {man.get('allowlistVersion')} != allowlist {al.get('version')}")
    PASSES.append("MANIFEST")
    check_design_policy(man)
    check_review(man)
    # README counts
    rd = (ROOT / "README.md").read_text()
    if readme_block(counts) not in rd:
        fail("README_COUNTS", "README count block is stale; run verify_all.py --write-counts")
    PASSES.append("README_COUNTS")
    # ALLOWLIST parity
    contracts = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "sections").glob("*.json"))}
    prims = {json.loads(p.read_text())["id"] for p in (ROOT / "primitives").glob("*.json")}
    comps = {json.loads(p.read_text())["id"] for p in (ROOT / "components").glob("*.json")}
    for kind, have, listed in (("sections", set(contracts), set(al["sections"])), ("primitives", prims, set(al["primitives"])), ("components", comps, set(al["components"]))):
        for x in sorted(listed - have): fail("ALLOWLIST", f"phantom {kind} entry {x} (no contract file)")
        for x in sorted(have - listed): fail("ALLOWLIST", f"orphan {kind} contract {x} (not in allowlist)")
    for sid, c in contracts.items():
        a = al["sections"].get(sid)
        if a and (sorted(c["content"]) != a["contentFields"] or c["variants"] != a["variants"] or c["motion"]["allowed"] != a["motion"]):
            fail("ALLOWLIST", f"{sid}: allowlist settable properties out of sync with the contract")
    PASSES.append("ALLOWLIST")
    # CONTRACTS (closed contract schema)
    from jsonschema import Draft7Validator
    cs = Draft7Validator(j("schema/section-contract.schema.json"))
    for sid, c in contracts.items():
        for e in cs.iter_errors(c):
            fail("CONTRACTS", f"{sid}: {'/'.join(map(str, e.absolute_path))} {e.message[:120]}")
    PASSES.append("CONTRACTS")
    # SOURCE_SEMANTIC
    for sid, c in contracts.items():
        if not (c["id"] == sid == c["semantic"]["id"]):
            fail("SOURCE_SEMANTIC", f"{sid}: id/semantic.id/file stem disagree")
        if c["source"]["id"] == c["id"]:
            fail("SOURCE_SEMANTIC", f"{sid}: source.id must not equal the semantic id")
    PASSES.append("SOURCE_SEMANTIC")
    # RETRIEVAL
    sv = load_module("sv", "schema/semantic_validate.py")
    if sv.RETRIEVAL_INELIGIBLE != RETRIEVAL_INELIGIBLE:
        fail("RETRIEVAL", "RETRIEVAL_INELIGIBLE differs between verify_all.py and semantic_validate.py")
    false_set = {s for s, c in contracts.items() if c.get("retrievalEligible") is False}
    if false_set != RETRIEVAL_INELIGIBLE:
        fail("RETRIEVAL", f"contracts false {sorted(false_set)} != pin {sorted(RETRIEVAL_INELIGIBLE)}")
    for sid, c in contracts.items():
        if RUNTIME_ID.search(sid) and sid not in RETRIEVAL_INELIGIBLE:
            fail("RETRIEVAL", f"{sid} looks like runtime UI but is not pinned ineligible")
        if al["sections"].get(sid, {}).get("retrievalEligible") != (sid not in RETRIEVAL_INELIGIBLE):
            fail("RETRIEVAL", f"allowlist {sid}.retrievalEligible disagrees with the pin")
        if c.get("retrievalEligible") is False and len(c.get("retrievalReason", "")) < 30:
            fail("RETRIEVAL", f"{sid}: reason < 30 chars")
    for t, tpl in j("templates/templates.json")["templates"].items():
        for n in tpl["nodes"]:
            if "section" in n and n.get("retrievalEligible") != (n["section"] not in RETRIEVAL_INELIGIBLE):
                fail("RETRIEVAL", f"template {t}: node {n['section']} retrievalEligible disagrees with the pin")
    PASSES.append("RETRIEVAL")
    # PINS
    roles = j("assets/asset-roles.json")["roles"]
    if sv.PINNED_AVAILABILITY != PINNED_AVAILABILITY:
        fail("PINS", "PINNED_AVAILABILITY differs between verify_all.py and semantic_validate.py")
    if set(roles) != set(PINNED_AVAILABILITY):
        fail("PINS", f"roles not pinned / pins without role: {sorted(set(roles) ^ set(PINNED_AVAILABILITY))}")
    for r, av in PINNED_AVAILABILITY.items():
        if r in roles and roles[r]["availability"] != av:
            fail("PINS", f"{r}: registry {roles[r]['availability']!r} != pinned {av!r}")
    for r, pol in sv.PINNED_GENERATION_POLICY.items():
        if roles.get(r, {}).get("generationPolicy") != pol:
            fail("PINS", f"{r}: generationPolicy pinned to {pol!r}")
    for r, d in roles.items():
        if d["availability"] != "generation-safe" and not all(PINNED_AVAILABILITY.get(s) == "generation-safe" for s in d.get("generationSafeSubstitutes", [None])):
            fail("PINS", f"{r}: substitutes must be generation-safe roles")
    for sid, c in contracts.items():
        for r in c["generatedAssetRoles"]:
            if PINNED_AVAILABILITY.get(r) != "generation-safe":
                fail("PINS", f"{sid}: generatedAssetRoles lists non-generation-safe {r}")
    PASSES.append("PINS")
    # TOKENS
    cat = j("tokens/llm/token-catalog.json")["tokens"]
    derived = {}
    for f in sorted((ROOT / "tokens/00-foundation").glob("*.json")):
        if f.name == "motion-patterns.json":
            continue
        for tid, t in json.loads(f.read_text())["tokens"].items():
            derived[tid] = t["$value"]
    for rel in ("tokens/10-semantic/semantic.json", "tokens/20-component/component.json", "tokens/30-layout/layout.json"):
        for tid, t in j(rel)["tokens"].items():
            derived[tid] = t["$value"]
    for tid in sorted(set(derived) - set(cat)): fail("TOKENS", f"{tid} in token files but missing from token-catalog")
    for tid in sorted(set(cat) - set(derived)): fail("TOKENS", f"{tid} in token-catalog but not in any token file")
    for tid in sorted(set(cat) & set(derived)):
        if cat[tid]["value"] != derived[tid]:
            fail("TOKENS", f"{tid}: catalog {cat[tid]['value']!r} != token file {derived[tid]!r}")
    pol = j("tokens/llm/token-policy.json")
    real_cats = {t["category"] for t in cat.values()}
    for k in pol["rawValueRestrictions"]:
        if k not in real_cats: fail("TOKENS", f"policy rawValueRestrictions key {k!r} is not a catalog category")
    for k, v in pol["pageSpecTokenFields"].items():
        if v["category"] not in real_cats: fail("TOKENS", f"policy field {k} -> unknown category {v['category']}")
    for s, ts in pol["surfaceTextPairs"].items():
        for x in [s] + ts:
            if x not in cat: fail("TOKENS", f"policy pair token {x} not in catalog")
    lt = j("tokens/themes/light.json")["resolves"]
    for s in pol["themes"]["light"]:
        if s not in lt: fail("TOKENS", f"theme light does not resolve {s}")
    for sid, c in contracts.items():
        for x in c["tokens"]["surfaces"] + c["tokens"]["text"]:
            if x not in cat: fail("TOKENS", f"{sid}: token {x} not in catalog")
    PASSES.append("TOKENS")
    # SCHEMA_SYNC
    sch = j("schema/pagespec.schema.json"); d = sch["definitions"]
    if set(d["node"]["properties"]["section"]["enum"]) != set(contracts): fail("SCHEMA_SYNC", "section enum != contracts")
    for sid, c in contracts.items():
        props = d.get("content." + sid, {}).get("properties", {})
        if set(props) != set(c["content"]): fail("SCHEMA_SYNC", f"{sid}: schema content fields {sorted(props)} != contract {sorted(c['content'])}")
        req = sorted(n for n, f in c["content"].items() if f["required"])
        if sorted(d.get("content." + sid, {}).get("required", [])) != req: fail("SCHEMA_SYNC", f"{sid}: required fields differ")
    if set(d["media"]["properties"]["assetRole"]["enum"]) != set(roles): fail("SCHEMA_SYNC", "assetRole enum != asset roles")
    if set(sch["properties"]["template"]["enum"]) != set(j("templates/templates.json")["templates"]): fail("SCHEMA_SYNC", "template enum != templates")
    mp = j("tokens/00-foundation/motion-patterns.json")["patterns"]
    if set(d["motion"]["properties"]["pattern"]["enum"]) != set(mp): fail("SCHEMA_SYNC", "motion enum != motion-patterns")
    if set(al["nodeProperties"]) != set(d["node"]["properties"]): fail("SCHEMA_SYNC", f"allowlist nodeProperties {al['nodeProperties']} != schema node properties")
    PASSES.append("SCHEMA_SYNC")
    # MOTION
    for sid, c in contracts.items():
        for p in c["motion"]["allowed"]:
            if p not in mp or not mp[p].get("reducedMotionFallback"): fail("MOTION", f"{sid}: pattern {p} unknown or without fallback")
    PASSES.append("MOTION")
    # TEMPLATES
    tpls = j("templates/templates.json")["templates"]
    routes = j("templates/routes.json")["routes"]
    for t, tpl in tpls.items():
        for n in tpl["nodes"]:
            for s in ([n["section"]] if "section" in n else n["allowed"]):
                if s not in contracts: fail("TEMPLATES", f"{t}: unknown section {s}")
    paths = [r["path"] for r in routes]
    if len(paths) != len(set(paths)): fail("TEMPLATES", "a route is mapped more than once")
    if len(paths) != EXPECTED_ROUTES: fail("TEMPLATES", f"{len(paths)} routes, expected {EXPECTED_ROUTES}")
    for r in routes:
        if r["template"] not in tpls: fail("TEMPLATES", f"{r['path']}: unknown template {r['template']}")
    for t, tpl in tpls.items():
        if sorted(tpl["routes"]) != sorted(r["path"] for r in routes if r["template"] == t): fail("TEMPLATES", f"{t}: routes list out of sync with routes.json")
    src_routes = SRC / ".recon/routes.txt"
    if src_routes.exists():
        real = [l.strip() for l in src_routes.read_text().split("\n") if l.strip()]
        if sorted(real) != sorted(paths): fail("TEMPLATES", f"routes.json != source route list: {sorted(set(real) ^ set(paths))}")
        for r in routes:
            if not (SRC / r["evidence"]).exists(): fail("TEMPLATES", f"{r['path']}: evidence {r['evidence']} missing")
    else:
        warn("TEMPLATES", "source route list not present (self-contained copy): 1:1 checked against routes.json only")
    PASSES.append("TEMPLATES")
    # GRAPH_SYNC
    g = {r["id"]: r["severity"] for r in j("compatibility/graph.json")["rules"]}
    if g != sv.RULES: fail("GRAPH_SYNC", f"graph rules/severities differ from semantic_validate.RULES: {sorted(set(g.items()) ^ set(sv.RULES.items()))}")
    PASSES.append("GRAPH_SYNC")
    # CITATIONS + SOURCE_TAGS
    cites = []
    for rel, doc in docs.items():
        walk_cites(doc, rel, cites)
    resolved = sum(1 for o, w in cites if check_citation(o, w))
    if resolved < len(cites):
        warn("CITATIONS", f"{len(cites) - resolved}/{len(cites)} citations not checkable (source tree absent)")
    PASSES.append(f"CITATIONS ({resolved}/{len(cites)} resolved)")
    tag_ok = 0
    for sid, c in contracts.items():
        s = c["source"]; f = SRC / s["file"]
        if not f.exists():
            continue
        lines = f.read_text(errors="ignore").split("\n")
        a, _, b = s["lines"].partition("-"); a = int(a); b = int(b or a)
        if b > len(lines): fail("SOURCE_TAGS", f"{sid}: {s['file']}:{s['lines']} out of range"); continue
        seg = "\n".join(lines[a - 1:b])
        if f"<{s['tag']}" not in seg or s["needle"] not in seg:
            fail("SOURCE_TAGS", f"{sid}: <{s['tag']} with {s['needle'][:40]!r} not at {s['file']}:{s['lines']}")
        else:
            tag_ok += 1
    PASSES.append(f"SOURCE_TAGS ({tag_ok}/{len(contracts)} verified)")
    # EXAMPLES
    repo = sv.load_repo(ROOT)
    fams = {}
    for p in sv.example_paths(ROOT):
        spec = json.loads(p.read_text())
        e, w = sv.validate(spec, repo)
        for code, msg in e: fail("EXAMPLES", f"{p.relative_to(ROOT)}: {code} {msg}")
        fams.setdefault(spec["template"], set()).add(spec["mode"])
    for t in tpls:
        if "generated" not in fams.get(t, set()): fail("EXAMPLES", f"no generated example for template {t}")
    if "reference" not in fams.get("home", set()): fail("EXAMPLES", "no reference home example")
    PASSES.append("EXAMPLES")
    # WRAPPER_GATE
    wg = load_module("wg", "extraction/wrapper_gate.py")
    e, w = wg.check(ROOT)
    for code, msg in e: fail("WRAPPER_GATE", f"{code} {msg}")
    for code, msg in w: warn("WRAPPER_GATE", f"{code} {msg}")
    PASSES.append("WRAPPER_GATE")
    # HYGIENE
    # character classes keep this file itself free of the literal patterns it searches for
    absre = re.compile(r"/U[s]ers/[A-Za-z0-9._-]+/|/h[o]me/[A-Za-z0-9._-]+/|/private/(tmp|var)/|C:\\\\U[s]ers\\\\")
    for p in ROOT.rglob("*"):
        if p.is_dir() and p.name in ("__pycache__", "__MACOSX"): fail("HYGIENE", f"junk dir {p.relative_to(ROOT)}")
        if p.is_file():
            if p.name in (".DS_Store", "Thumbs.db", "desktop.ini"): fail("HYGIENE", f"junk file {p.relative_to(ROOT)}")
            elif p.suffix in (".json", ".md", ".py", ".mjs", ".txt") and absre.search(p.read_text(errors="ignore")): fail("HYGIENE", f"absolute path in {p.relative_to(ROOT)}")
    PASSES.append("HYGIENE")

    for c in PASSES:
        name = c.split(" ")[0]
        print(f"{'FAIL' if any(f[0] == name for f in FAILS) else 'PASS'}  {c}")
    for c, m in WARNS: print(f"warn  {c}: {m}")
    for c, m in FAILS: print(f"FAIL  {c}: {m}")
    print(f"\nverify_all: {len(FAILS)} failures, {len(WARNS)} warnings; counts {json.dumps(counts)}")
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.dont_write_bytecode = True
    sys.exit(main("--write-counts" in sys.argv))
