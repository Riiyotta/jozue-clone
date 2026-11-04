#!/usr/bin/env python3
"""R9 whole-page-wrapper quality gate, run by extraction/verify_all.py (and standalone).

    python3 extraction/wrapper_gate.py          # exit 1 on any error

Heights come from extraction/measured-values.json -> sectionHeights (measured in a headless
browser at 1440x900 for every route by extraction/measure_sections.mjs). Thresholds are pinned
HERE in code; a thresholds block in JSON that disagrees is itself an error.

  HERO > 1800px: warn.  HERO > 3000px: error unless whitelisted.
  One in-flow section > 50% of its page: warn; > 60%: error unless whitelisted
  (pages with < 3 in-flow sections are skipped; SHELL/UTILITY excluded; fixed/sticky and
  display:none elements take no page height).
  Missing measurement or wrong viewport: error.
  Whitelist entries (extraction/wrapper-whitelist.json) need reviewedBy, a justification of
  30+ chars and maxHeightPx above the measured height; stale or over-cap entries fail; a
  whitelisted hit still warns. An agent reviewer must say "agent attestation, not a human sign-off".
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERO_WARN_PX = 1800
HERO_ERROR_PX = 3000
SHARE_WARN = 0.50
SHARE_ERROR = 0.60
MIN_INFLOW_SECTIONS = 3
REQUIRED_VIEWPORT = "1440x900"
EXCLUDED_CATEGORIES = {"SHELL", "UTILITY"}
AGENT_PHRASE = "agent attestation, not a human sign-off"


def _j(p):
    return json.loads(Path(p).read_text())


def check(root=ROOT, measured=None, whitelist=None, routes=None, contracts=None):
    root = Path(root)
    measured = measured if measured is not None else _j(root / "extraction/measured-values.json")
    whitelist = whitelist if whitelist is not None else _j(root / "extraction/wrapper-whitelist.json")
    routes = routes if routes is not None else _j(root / "templates/routes.json")["routes"]
    contracts = contracts if contracts is not None else {p.stem: _j(p) for p in (root / "sections").glob("*.json")}
    errs, warns = [], []
    th = measured.get("thresholds")
    if th is not None and th != {"heroWarnPx": HERO_WARN_PX, "heroErrorPx": HERO_ERROR_PX, "shareWarn": SHARE_WARN, "shareError": SHARE_ERROR}:
        errs.append(("GATE_THRESHOLD_DRIFT", f"JSON thresholds {th} differ from the pinned constants"))
    sh = measured.get("sectionHeights")
    if not isinstance(sh, dict) or not isinstance(sh.get("routes"), dict):
        return errs + [("GATE_MISSING_MEASUREMENT", "extraction/measured-values.json has no sectionHeights.routes")], warns
    if sh.get("viewport") != REQUIRED_VIEWPORT:
        errs.append(("GATE_WRONG_VIEWPORT", f"sectionHeights measured at {sh.get('viewport')!r}, gate requires {REQUIRED_VIEWPORT}"))
    entries = whitelist.get("entries", [])
    wl = {}
    for e in entries:
        key = (e.get("route"), e.get("section"))
        rb = str(e.get("reviewedBy", "")).strip()
        if not rb:
            errs.append(("GATE_WHITELIST_INVALID", f"{key}: reviewedBy missing"))
        elif "agent" in rb.lower() and AGENT_PHRASE not in rb.lower():
            errs.append(("GATE_WHITELIST_INVALID", f"{key}: an agent reviewer must state '{AGENT_PHRASE}'"))
        if len(str(e.get("justification", ""))) < 30:
            errs.append(("GATE_WHITELIST_INVALID", f"{key}: justification must be >= 30 chars"))
        if not isinstance(e.get("maxHeightPx"), (int, float)):
            errs.append(("GATE_WHITELIST_INVALID", f"{key}: maxHeightPx missing"))
        wl[key] = e
    used = set()
    for r in routes:
        m = sh["routes"].get(r["path"])
        if not m:
            errs.append(("GATE_MISSING_MEASUREMENT", f"{r['path']}: no section heights"))
            continue
        page_h = m.get("pageHeight") or 0
        flow = []
        for s in m.get("sections", []):
            c = contracts.get(s["id"])
            if c is None:
                errs.append(("GATE_UNKNOWN_SECTION", f"{r['path']}: measured section {s['id']} has no contract"))
                continue
            if not s.get("inFlow") or c["semantic"]["category"] in EXCLUDED_CATEGORIES:
                continue
            flow.append((s, c))
        for s, c in flow:
            key = (r["path"], s["id"]); h = s["h"]; e = wl.get(key)
            if e is not None and isinstance(e.get("maxHeightPx"), (int, float)) and h > e["maxHeightPx"]:
                errs.append(("GATE_WHITELIST_OVER_CAP", f"{key}: measured {h}px exceeds whitelisted maxHeightPx {e['maxHeightPx']}"))
                e = None
            if c["semantic"]["category"] == "HERO":
                if h > HERO_ERROR_PX:
                    (warns if e else errs).append(("GATE_HERO_TOO_TALL", f"{key}: HERO {h}px > {HERO_ERROR_PX}px" + (" (whitelisted)" if e else "")))
                    if e: used.add(key)
                elif h > HERO_WARN_PX:
                    warns.append(("GATE_HERO_TALL", f"{key}: HERO {h}px > {HERO_WARN_PX}px"))
                    if e: used.add(key)
            if len(flow) >= MIN_INFLOW_SECTIONS and page_h:
                share = h / page_h
                if share > SHARE_ERROR:
                    (warns if e else errs).append(("GATE_MAJORITY_SECTION", f"{key}: {share:.0%} of a {page_h}px page" + (" (whitelisted)" if e else "")))
                    if e: used.add(key)
                elif share > SHARE_WARN:
                    warns.append(("GATE_LARGE_SECTION", f"{key}: {share:.0%} of the page"))
                    if e: used.add(key)
    for key in wl:
        if key not in used:
            errs.append(("GATE_WHITELIST_STALE", f"{key}: whitelist entry no longer matches any gated hit"))
    return errs, warns


def summary(root=ROOT):
    m = _j(Path(root) / "extraction/measured-values.json")["sectionHeights"]
    heroes = [(p, s["h"]) for p, r in m["routes"].items() for s in r["sections"] if s["id"].startswith("hero.") and s.get("inFlow")]
    share = []
    for p, r in m["routes"].items():
        fl = [s for s in r["sections"] if s.get("inFlow") and not s["id"].startswith(("shell.", "utility."))]
        if len(fl) >= MIN_INFLOW_SECTIONS:
            top = max(fl, key=lambda s: s["h"]); share.append((top["h"] / r["pageHeight"], p, top["id"]))
    return max(h for _, h in heroes), max(share)


if __name__ == "__main__":
    e, w = check()
    for c, m in e: print("ERROR", c, m)
    for c, m in w: print("warn ", c, m)
    hmax, (smax, sp, sid) = summary()
    print(f"wrapper gate: {len(e)} errors, {len(w)} warnings; tallest HERO {hmax}px (warn>{HERO_WARN_PX}, error>{HERO_ERROR_PX}); largest share {smax:.1%} ({sid} on {sp}; warn>{SHARE_WARN:.0%}, error>{SHARE_ERROR:.0%})")
    sys.exit(1 if e else 0)
