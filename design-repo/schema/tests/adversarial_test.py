#!/usr/bin/env python3
"""Adversarial suite: every mutation must be REJECTED with its expected rule code; every control must pass.

    python3 schema/tests/adversarial_test.py        # exit 1 if any mutation slips through or a control fails

Three layers:
  MUTATIONS       PageSpec mutations (schema, structure, words, motion, tokens, assets, retrieval and the
                  generated-mode leakage rules R2/R5), validated by schema/semantic_validate.py
  REPO_MUTATIONS  in-memory edits of the registry files (asset availability, contracts, allowlist,
                  templates) that the code pins must catch while validating an untouched control
  GATE_MUTATIONS  wrapper-gate inputs (HERO 1900/3100, majority share, whitelist defects, missing or
                  wrong-viewport measurements, threshold drift) run through extraction/wrapper_gate.py
Controls: all examples in schema/ (reference + generated) and the real measured heights.
"""
import copy, importlib.util, json, sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]


def mod(name, rel):
    s = importlib.util.spec_from_file_location(name, ROOT / rel); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


sv = mod("sv", "schema/semantic_validate.py")
wg = mod("wg", "extraction/wrapper_gate.py")
EX = {p.stem.replace("example.pagespec", "reference.home"): json.loads(p.read_text()) for p in sv.example_paths(ROOT)}


def nd(spec, sid, k=0):
    return [n for n in spec["nodes"] if n["section"] == sid][k]


def put(path_fn):
    def f(s):
        path_fn(s); return s
    return f


def swap(spec, a, b):
    ia = [i for i, n in enumerate(spec["nodes"]) if n["section"] == a][0]
    ib = [i for i, n in enumerate(spec["nodes"]) if n["section"] == b][0]
    spec["nodes"][ia], spec["nodes"][ib] = spec["nodes"][ib], spec["nodes"][ia]


def drop(spec, sid):
    spec["nodes"] = [n for n in spec["nodes"] if n["section"] != sid]


LONG = " ".join(["word"] * 60)
G, GW, R, RW = "generated.home", "generated.work-detail", "reference.home", "reference.work-detail.arte"

MUTATIONS = [
    # ---- R2/R5 generated-mode leakage
    ("brand name leak", G, lambda s: s["brand"].update(name="Josué Pichot"), "GENERATED_MODE_BRAND"),
    ("wordmark text in copy", G, lambda s: nd(s, "hero.home-intro")["content"].update(greeting=["Hi,", "I am Josué."]), "GENERATED_MODE_BRAND"),
    ("wordmark/logo asset reuse", G, lambda s: nd(s, "contact.details")["content"].update(backgroundMark={"assetRole": "brand.wordmark", "ref": "/_astro/jozue-logo-full.DpMZCk-F.svg", "alt": "jozue"}), "GENERATED_MODE_ASSET"),
    ("signature trace reuse", G, lambda s: nd(s, "hero.home-intro")["content"].update(backgroundMark={"assetRole": "brand.signature-trace", "ref": "generated://trace", "alt": ""}), "GENERATED_MODE_ASSET"),
    ("store mark leak", G, lambda s: nd(s, "contact.details")["content"]["socials"].append({"label": "App Store", "href": "https://shop.example/app"}), "GENERATED_MODE_STORE"),
    ("store URL leak", G, lambda s: nd(s, "contact.details")["content"]["socials"].append({"label": "get the app", "href": "https://play.google.com/store/apps/details?id=x"}), "GENERATED_MODE_STORE"),
    ("real rating leak", G, lambda s: nd(s, "proof.awards")["content"]["awards"][0].update(recognitions=["1 TheFWA"]), "GENERATED_MODE_RATING"),
    ("rating marked real", G, lambda s: nd(s, "proof.awards")["content"]["awards"][0].update(recognitionSource="real"), "GENERATED_MODE_RATING"),
    ("real person identity", G, lambda s: nd(s, "proof.partners")["content"]["partners"][0].update(name="Basile Tournier"), "GENERATED_MODE_PERSON"),
    ("real partner studio", G, lambda s: nd(s, "proof.partners")["content"]["partners"][0].update(name="VIVAN"), "GENERATED_MODE_PARTNER"),
    ("partner logo reuse", G, lambda s: nd(s, "proof.partners")["content"]["partners"][0].update(logo={"assetRole": "partner.logo", "ref": "placeholder://x", "alt": "x"}), "GENERATED_MODE_ASSET"),
    ("source social URL", G, lambda s: nd(s, "contact.details")["content"]["socials"].append({"label": "insta", "href": "https://www.instagram.com/__jozue__"}), "GENERATED_MODE_URL"),
    ("non-reserved URL", G, lambda s: nd(s, "contact.details")["content"]["socials"].append({"label": "site", "href": "https://ilsevarga.com"}), "GENERATED_MODE_URL"),
    ("source domain as brand domain", G, lambda s: s["brand"].update(domain="jozue.fr"), "GENERATED_MODE_URL"),
    ("source phone", G, lambda s: nd(s, "contact.details")["content"].update(phone="tel:+33661773220"), "GENERATED_MODE_CONTACT"),
    ("source email", G, lambda s: nd(s, "contact.details")["content"].update(email={"label": "hi@jozue.fr", "href": "mailto:hi@jozue.fr"}), "GENERATED_MODE_CONTACT"),
    ("source address", G, lambda s: nd(s, "hero.home-intro")["content"]["addressLinks"][0].update(label="93310 Le Pré-Saint-Gervais"), "GENERATED_MODE_CONTACT"),
    ("source copy sentence", G, lambda s: nd(s, "hero.home-intro")["content"]["description"].__setitem__(0, "I am a Paris-based multidisciplinary art director and creator."), "GENERATED_MODE_COPY"),
    ("source copy 6-word window", G, lambda s: nd(s, "about.bio")["content"]["paragraphs"].append("Funny story: classmates were paying me to make their artwork back then."), "GENERATED_MODE_COPY"),
    ("source signature phrase", G, lambda s: nd(s, "proof.partners")["content"].update(title="Partners in crime"), "GENERATED_MODE_COPY"),
    ("source project slogan", GW, lambda s: nd(s, "hero.work-head")["content"].update(slogan=["sold out", "by design"]), "GENERATED_MODE_COPY"),
    ("source CTA label", G, lambda s: nd(s, "hero.home-intro")["content"].update(scrollHint="Explore my work"), "GENERATED_MODE_CTA"),
    ("brand CTA", G, lambda s: nd(s, "cta.lets-talk")["content"].update(link={"label": "Contact Josue", "href": "#contact"}), "GENERATED_MODE_CTA"),
    ("client name", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0].update(title="Arte"), "GENERATED_MODE_CLIENT"),
    ("client spelling variant", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0].update(title="Mc Cain"), "GENERATED_MODE_CLIENT"),
    ("proprietary media ref", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0]["media"].update(ref="/_astro/arte-hero-1.DiJqoqfB_1YzdRy.webp"), "GENERATED_MODE_MEDIA"),
    ("reference-only role in generated", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0]["media"].update(assetRole="work.card-media"), "GENERATED_MODE_ASSET"),
    ("work hero media reuse", GW, lambda s: nd(s, "media.work-hero-image")["content"]["media"].update(assetRole="work.hero-media", ref="/_astro/arte-hero-1.DiJqoqfB_1YzdRy.webp"), "GENERATED_MODE_MEDIA"),
    ("reference home relabelled generated", R, lambda s: s.update(mode="generated"), "GENERATED_MODE_BRAND"),
    ("reference case study relabelled generated", RW, lambda s: s.update(mode="generated"), "GENERATED_MODE_CLIENT"),
    # ---- schema layer
    ("mode missing", G, lambda s: s.pop("mode"), "SCHEMA"),
    ("mode not in enum", G, lambda s: s.update(mode="remix"), "SCHEMA"),
    ("invented section", G, lambda s: s["nodes"].insert(4, {"section": "hero.invented", "content": {}, "motion": {"pattern": "none", "reducedMotionFallback": "none"}}), "SCHEMA"),
    ("invented content field", G, lambda s: nd(s, "cta.got-project")["content"].update(subtitle="x"), "SCHEMA"),
    ("missing reducedMotionFallback", G, lambda s: nd(s, "about.bio")["motion"].pop("reducedMotionFallback"), "SCHEMA"),
    ("invented motion field", G, lambda s: nd(s, "about.bio")["motion"].update(inventedAnimation="spin"), "SCHEMA"),
    ("invented asset role", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0]["media"].update(assetRole="image"), "SCHEMA"),
    ("more-works with 2 cards", GW, lambda s: nd(s, "index.more-works")["content"]["cards"].pop(), "SCHEMA"),
    # ---- structure (template cross-reference + graph)
    ("template/node mismatch", G, lambda s: s.update(template="not-found"), "TEMPLATE_SEQUENCE"),
    ("required section removed", G, lambda s: drop(s, "works.selected-header"), "REQUIRED_SECTION_MISSING"),
    ("reordered sections", G, lambda s: swap(s, "about.bio", "proof.awards"), "TEMPLATE_SEQUENCE"),
    ("duplicate hero", G, lambda s: s["nodes"].insert(4, copy.deepcopy(nd(s, "hero.home-intro"))), "ONE_HERO"),
    ("contact not last", G, lambda s: swap(s, "contact.details", "proof.partners"), "MUST_BE_LAST"),
    ("filter island without list", G, lambda s: drop(s, "works.card-list"), "REQUIRES_SECTION"),
    ("home-only section on work page", GW, lambda s: s["nodes"].insert(5, copy.deepcopy(nd(EX[G], "about.bio"))), "TEMPLATE_ONLY"),
    ("empty case-study body", GW, lambda s: s.update(nodes=[n for n in s["nodes"] if n["section"] not in sv.load_repo(ROOT)["templates"]["work-detail"]["nodes"][4]["allowed"]]), "TEMPLATE_SEQUENCE"),
    ("route bound to another template", R, lambda s: s.update(route="/works/arte/"), "ROUTE_TEMPLATE_MISMATCH"),
    ("home template on non-home route", R, lambda s: s.update(route="/404/"), "HOME_ROUTE_ONLY"),
    ("shell after content", G, lambda s: s["nodes"].append(s["nodes"].pop(2)), "SHELL_BEFORE_CONTENT"),
    # ---- words / motion / assets
    ("maxWords overflow (generated)", GW, lambda s: nd(s, "hero.work-head")["content"].update(mission=LONG), "MAX_WORDS"),
    ("maxWords overflow (reference)", R, lambda s: nd(s, "cta.lets-talk")["content"].update(title="let's talk about everything today"), "MAX_WORDS"),
    ("motion not allowed for section", G, lambda s: nd(s, "hero.home-intro").update(motion={"pattern": "marquee", "reducedMotionFallback": "instant-static"}), "MOTION_PATTERN_NOT_ALLOWED"),
    ("motion fallback mismatch", G, lambda s: nd(s, "hero.home-intro").update(motion={"pattern": "title-rotate", "reducedMotionFallback": "none"}), "MOTION_FALLBACK_MISMATCH"),
    ("asset role not allowed in field", R, lambda s: nd(s, "proof.partners")["content"]["partners"][0]["logo"].update(assetRole="work.card-media"), "ASSET_ROLE_NOT_ALLOWED"),
    # ---- retrieval eligibility (node level)
    ("node flips runtime UI to eligible", G, lambda s: nd(s, "shell.site-menu").update(retrievalEligible=True), "RETRIEVAL_INELIGIBLE_SHELL_ONLY"),
    ("node marks content ineligible", G, lambda s: nd(s, "works.card-list").update(retrievalEligible=False), "RETRIEVAL_INELIGIBLE_SHELL_ONLY"),
    # ---- tokens (R10)
    ("raw hex surface", G, lambda s: nd(s, "about.bio")["tokens"].update(surface="#f73326"), "TOKEN_RAW_COLOR"),
    ("raw rgb accent in content", G, lambda s: nd(s, "works.card-list")["content"]["cards"][0].update(accent="rgb(1,2,3)"), "TOKEN_RAW_COLOR"),
    ("unknown token", G, lambda s: nd(s, "about.bio")["tokens"].update(surface="surface.neon"), "TOKEN_UNKNOWN"),
    ("unknown accent token", GW, lambda s: nd(s, "hero.work-head")["tokens"].update(accent="accent.neon"), "TOKEN_UNKNOWN"),
    ("arbitrary spacing", G, lambda s: nd(s, "about.bio")["tokens"].update(spaceBlock="37px"), "TOKEN_ARBITRARY_SPACING"),
    ("unsupported font", G, lambda s: nd(s, "about.bio")["tokens"].update(font="Comic Sans MS"), "TOKEN_FONT_UNSUPPORTED"),
    ("non-selectable font token", G, lambda s: nd(s, "about.bio")["tokens"].update(font="font.family.ua-button"), "TOKEN_FONT_UNSUPPORTED"),
    ("invalid surface/text pair", G, lambda s: nd(s, "about.bio")["tokens"].update(text="text.primary"), "TOKEN_THEME_COMBINATION"),
    ("surface not allowed for section", G, lambda s: nd(s, "about.bio")["tokens"].update(surface="surface.paper", text="text.primary"), "TOKEN_SURFACE_NOT_ALLOWED"),
    ("token of wrong category", G, lambda s: nd(s, "about.bio")["tokens"].update(surface="accent.teal"), "TOKEN_CATEGORY"),
    ("accent surface without accent", GW, lambda s: nd(s, "hero.work-head")["tokens"].pop("accent"), "TOKEN_ACCENT_REQUIRED"),
    ("accent on a non-accent section", G, lambda s: nd(s, "hero.home-intro")["tokens"].update(accent="accent.teal"), "TOKEN_ACCENT_NOT_ALLOWED"),
]


def repo_mut(fn):
    def run():
        repo = sv.load_repo(ROOT); fn(repo); return repo
    return run


REPO_MUTATIONS = [
    ("registry loosens wordmark availability", repo_mut(lambda r: r["roles"]["brand.wordmark"].update(availability="generation-safe")), "PIN_AVAILABILITY"),
    ("registry sets wordmark to a different valid policy", repo_mut(lambda r: r["roles"]["brand.wordmark"].update(generationPolicy="may-generate-new")), "PIN_AVAILABILITY"),
    ("registry tightens a safe role", repo_mut(lambda r: r["roles"]["generated.project-visual"].update(availability="reference-only")), "PIN_AVAILABILITY"),
    ("registry drops substitutes", repo_mut(lambda r: r["roles"]["partner.logo"].pop("generationSafeSubstitutes")), "PIN_AVAILABILITY"),
    ("registry adds an unpinned role", repo_mut(lambda r: r["roles"].update({"brand.extra": {"availability": "generation-safe"}})), "PIN_AVAILABILITY"),
    ("contract flips menu to eligible", repo_mut(lambda r: r["contracts"]["shell.site-menu"].update(retrievalEligible=True)), "PIN_RETRIEVAL"),
    ("allowlist flips menu to eligible", repo_mut(lambda r: r["allowlist"]["sections"]["shell.site-menu"].update(retrievalEligible=True)), "PIN_RETRIEVAL"),
    ("contract+allowlist flip together", repo_mut(lambda r: (r["contracts"]["shell.intro-preloader"].update(retrievalEligible=True), r["allowlist"]["sections"]["shell.intro-preloader"].update(retrievalEligible=True))), "PIN_RETRIEVAL"),
    ("contract marks content ineligible", repo_mut(lambda r: r["contracts"]["about.bio"].update(retrievalEligible=False, retrievalReason="x" * 40)), "PIN_RETRIEVAL"),
    ("template node flips eligibility", repo_mut(lambda r: r["templates"]["home"]["nodes"][2].update(retrievalEligible=True)), "PIN_RETRIEVAL"),
]


def gate_mut(fn):
    def run():
        m = json.loads((ROOT / "extraction/measured-values.json").read_text())
        w = json.loads((ROOT / "extraction/wrapper-whitelist.json").read_text())
        fn(m, w); return wg.check(ROOT, measured=m, whitelist=w)
    return run


def sec(m, route, sid):
    return [s for s in m["sectionHeights"]["routes"][route]["sections"] if s["id"] == sid][0]


GOOD_WL = lambda h: {"route": "/", "section": "hero.home-intro", "reviewedBy": "design lead (human)", "justification": "Adversarial fixture: a deliberately tall hero used to prove the whitelist path.", "maxHeightPx": h}
GATE_MUTATIONS = [
    ("HERO 1900px warns", gate_mut(lambda m, w: sec(m, "/", "hero.home-intro").update(h=1900)), "warn:GATE_HERO_TALL"),
    ("HERO 3100px fails", gate_mut(lambda m, w: sec(m, "/", "hero.home-intro").update(h=3100)), "GATE_HERO_TOO_TALL"),
    ("HERO 3100px whitelisted still warns", gate_mut(lambda m, w: (sec(m, "/", "hero.home-intro").update(h=3100), w["entries"].append(GOOD_WL(3200)))), "warn-only:GATE_HERO_TOO_TALL"),
    ("majority section fails", gate_mut(lambda m, w: sec(m, "/works/arte/", "gallery.stills").update(h=0.7 * m["sectionHeights"]["routes"]["/works/arte/"]["pageHeight"])), "GATE_MAJORITY_SECTION"),
    ("55% section warns", gate_mut(lambda m, w: sec(m, "/works/arte/", "gallery.stills").update(h=0.55 * m["sectionHeights"]["routes"]["/works/arte/"]["pageHeight"])), "warn:GATE_LARGE_SECTION"),
    ("whitelist without justification", gate_mut(lambda m, w: (sec(m, "/", "hero.home-intro").update(h=3100), w["entries"].append({**GOOD_WL(3200), "justification": "short"}))), "GATE_WHITELIST_INVALID"),
    ("whitelist agent posing as human review", gate_mut(lambda m, w: (sec(m, "/", "hero.home-intro").update(h=3100), w["entries"].append({**GOOD_WL(3200), "reviewedBy": "design-repo agent"}))), "GATE_WHITELIST_INVALID"),
    ("stale whitelist entry", gate_mut(lambda m, w: w["entries"].append(GOOD_WL(3200))), "GATE_WHITELIST_STALE"),
    ("whitelist over cap", gate_mut(lambda m, w: (sec(m, "/", "hero.home-intro").update(h=3100), w["entries"].append(GOOD_WL(3050)))), "GATE_WHITELIST_OVER_CAP"),
    ("missing measurement", gate_mut(lambda m, w: m["sectionHeights"]["routes"].pop("/works/mc-cain/")), "GATE_MISSING_MEASUREMENT"),
    ("no sectionHeights at all", gate_mut(lambda m, w: m.pop("sectionHeights")), "GATE_MISSING_MEASUREMENT"),
    ("measured at the wrong viewport", gate_mut(lambda m, w: m["sectionHeights"].update(viewport="390x844")), "GATE_WRONG_VIEWPORT"),
    ("thresholds loosened in JSON only", gate_mut(lambda m, w: m.update(thresholds={"heroWarnPx": 5000, "heroErrorPx": 9000, "shareWarn": 0.9, "shareError": 0.95})), "GATE_THRESHOLD_DRIFT"),
]


def main():
    repo = sv.load_repo(ROOT); ok = 0; bad = []
    print("controls")
    for name, spec in EX.items():
        e, w = sv.validate(copy.deepcopy(spec), repo)
        print(f"  {'PASS' if not e else 'FAIL'}  control {name} ({spec['mode']}) errors={len(e)} warnings={len(w)}")
        if e: bad.append(f"control {name}: {e[:3]}")
    e, w = wg.check(ROOT)
    print(f"  {'PASS' if not e else 'FAIL'}  control wrapper gate on real measurements errors={len(e)} warnings={len(w)}")
    if e: bad.append(f"gate control: {e[:3]}")
    print("mutations")
    for name, base, fn, code in MUTATIONS:
        s = copy.deepcopy(EX[base]); fn(s)
        e, _ = sv.validate(s, repo)
        hit = code in [c for c, _ in e]
        ok += hit
        print(f"  {'REJECTED' if hit else 'MISSED  '}  [{code}] {name} ({base})")
        if not hit: bad.append(f"{name}: expected {code}, got {[c for c, _ in e][:4]}")
    for name, mk, code in REPO_MUTATIONS:
        e, _ = sv.validate(copy.deepcopy(EX[G]), mk())
        hit = code in [c for c, _ in e]; ok += hit
        print(f"  {'REJECTED' if hit else 'MISSED  '}  [{code}] {name} (repo)")
        if not hit: bad.append(f"{name}: expected {code}")
    for name, run, code in GATE_MUTATIONS:
        e, w = run(); ec, wc = [c for c, _ in e], [c for c, _ in w]
        if code.startswith("warn-only:"):
            c = code.split(":")[1]; hit = c in wc and not e
        elif code.startswith("warn:"):
            c = code.split(":")[1]; hit = c in wc
        else:
            hit = code in ec
        ok += hit
        print(f"  {'CAUGHT  ' if hit else 'MISSED  '}  [{code}] {name} (gate)")
        if not hit: bad.append(f"{name}: expected {code}, errors {ec[:3]} warnings {wc[:3]}")
    total = len(MUTATIONS) + len(REPO_MUTATIONS) + len(GATE_MUTATIONS)
    print(f"\nadversarial: {ok}/{total} mutations rejected; {len(EX) + 1} controls; failures: {len(bad)}")
    for b in bad: print("  FAIL", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
