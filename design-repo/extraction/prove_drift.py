#!/usr/bin/env python3
"""Prove that verify_all.py's checks catch drift: for each case, copy the repo to a fresh OS temp
directory, inject one defect, run verify_all.py there and require exit 1 plus the expected check name.
The untouched copy must pass (control).

    python3 extraction/prove_drift.py [--scratch <empty dir>]

When the source evidence tree (.recon/, src/, public/, CLONE_SPEC.md next to design-repo/) is present,
it is linked read-only into the temp project so the citation / source-tag cases run; otherwise those
cases are reported as SKIP (never as a pass).
"""
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent
SOURCE_ENTRIES = [".recon", "src", "public", "CLONE_SPEC.md"]
HAS_SOURCE = all((SRC / e).exists() for e in SOURCE_ENTRIES)


def jedit(rel, fn):
    def run(repo):
        p = repo / rel; d = json.loads(p.read_text()); fn(d); p.write_text(json.dumps(d, indent=1, ensure_ascii=False))
    return run


def tedit(rel, old, new, count=1):
    def run(repo):
        p = repo / rel; t = p.read_text()
        assert old in t, f"{rel}: pattern not found"
        p.write_text(t.replace(old, new, count))
    return run


def first_cite(repo):
    p = repo / "tokens/00-foundation/color.json"; d = json.loads(p.read_text())
    return p, d


def bad_range(repo):
    p, d = first_cite(repo)
    d["tokens"]["color.ink"]["evidence"][0]["cite"] = "public/_astro/Base.Db0Vu-aS.css:999999"
    p.write_text(json.dumps(d, indent=1))


def bad_needle(repo):
    p, d = first_cite(repo)
    d["tokens"]["color.ink"]["evidence"][0]["needle"] = "color:#123456"
    p.write_text(json.dumps(d, indent=1))


def orphan(repo):
    shutil.copy(repo / "sections/about.bio.json", repo / "sections/about.bio-copy.json")


def drop_verify_pin(repo):
    p = repo / "extraction/verify_all.py"; t = p.read_text()
    p.write_text(re.sub(r'\n\s*"work\.video": "reference-only", ', "\n    ", t, count=1))


CASES = [
    ("phantom allowlist entry", jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"].update({"hero.phantom": d["sections"]["hero.home-intro"]})), "ALLOWLIST", False),
    ("orphan contract file", orphan, "ALLOWLIST", False),
    ("citation out of range", bad_range, "CITATIONS", True),
    ("citation in range, wrong content", bad_needle, "CITATIONS", True),
    ("source tag moved", jedit("sections/hero.home-intro.json", lambda d: d["source"].update(lines="1")), "SOURCE_TAGS", True),
    ("manifest count hand-bumped", jedit("registry.manifest.json", lambda d: d["counts"].update(sections=40)), "MANIFEST", False),
    ("allowlistVersion drift", jedit("registry.manifest.json", lambda d: d.update(allowlistVersion="9.9.9")), "MANIFEST", False),
    ("README count edited", tedit("README.md", "| sections | ", "| sections | 9"), "README_COUNTS", False),
    ("registry availability loosened", jedit("assets/asset-roles.json", lambda d: d["roles"]["brand.wordmark"].update(availability="generation-safe")), "PINS", False),
    ("registry policy set to a different valid value", jedit("assets/asset-roles.json", lambda d: d["roles"]["partner.logo"].update(generationPolicy="may-generate-new")), "PINS", False),
    ("pin removed from verify_all", drop_verify_pin, "PINS", False),
    ("pin removed from semantic_validate", tedit("schema/semantic_validate.py", '"work.video": "reference-only", ', ""), "PINS", False),
    ("contract + allowlist flipped together", lambda r: (jedit("sections/shell.site-menu.json", lambda d: d.update(retrievalEligible=True))(r), jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["shell.site-menu"].update(retrievalEligible=True))(r)), "RETRIEVAL", False),
    ("content section marked ineligible", jedit("sections/about.bio.json", lambda d: d.update(retrievalEligible=False, retrievalReason="an attempt to hide a real content section")), "RETRIEVAL", False),
    ("token value edited in catalog only", jedit("tokens/llm/token-catalog.json", lambda d: d["tokens"]["color.brand-red"].update(value="#ff0000")), "TOKENS", False),
    ("token added to a token file only", jedit("tokens/00-foundation/color.json", lambda d: d["tokens"].update({"color.new": {"$type": "color", "$value": "#000001", "evidence": []}})), "TOKENS", False),
    ("policy category is a human label", jedit("tokens/llm/token-policy.json", lambda d: d["rawValueRestrictions"].update(typography={"rule": "x"})), "TOKENS", False),
    ("schema section enum drift", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["node"]["properties"]["section"]["enum"].remove("brand.palette")), "SCHEMA_SYNC", False),
    ("schema content field drift", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["content.about.bio"]["properties"].pop("skills")), "SCHEMA_SYNC", False),
    ("graph rule severity drift", jedit("compatibility/graph.json", lambda d: d["rules"][0].update(severity="warn")), "GRAPH_SYNC", False),
    ("route removed", jedit("templates/routes.json", lambda d: d["routes"].pop()), "TEMPLATES", False),
    ("route mapped twice", jedit("templates/routes.json", lambda d: d["routes"].append(d["routes"][0])), "TEMPLATES", False),
    ("measured heights removed", jedit("extraction/measured-values.json", lambda d: d.pop("sectionHeights")), "WRAPPER_GATE", False),
    ("gate thresholds loosened in JSON", jedit("extraction/measured-values.json", lambda d: d.update(thresholds={"heroWarnPx": 9000, "heroErrorPx": 9999, "shareWarn": 0.9, "shareError": 0.99})), "WRAPPER_GATE", False),
    ("example drifts from its template", jedit("schema/examples/generated.home.json", lambda d: d["nodes"].pop(4)), "EXAMPLES", False),
    ("enforcing file edited without refreshing the policy hash", lambda r: (r / "schema/semantic_validate.py").open("a").write("\n# drift\n"), "DESIGN_POLICY", False),
    ("contentHash tampered", jedit("registry.manifest.json", lambda d: d["designPolicy"].update(contentHash="sha256:" + "0" * 64)), "DESIGN_POLICY", False),
    ("category changed away from portfolio", jedit("registry.manifest.json", lambda d: d.update(category="marketplace")), "DESIGN_POLICY", False),
    ("category removed", jedit("registry.manifest.json", lambda d: d.pop("category")), "DESIGN_POLICY", False),
    ("designPolicy binding removed", jedit("registry.manifest.json", lambda d: d.pop("designPolicy")), "DESIGN_POLICY", False),
    ("bound policy version drift", jedit("registry.manifest.json", lambda d: d["designPolicy"].update(policyVersion="0.2.0")), "DESIGN_POLICY", False),
    ("policy file missing", lambda r: (r / "policy/design-policy.json").unlink(), "DESIGN_POLICY", False),
    ("approval overstated as ratified", jedit("policy/design-policy.json", lambda d: d["approval"].update(policyDecision="ratified", architectureDecisionRecorded=True)), "DESIGN_POLICY", False),
    ("designReview record missing", jedit("registry.manifest.json", lambda d: d.pop("designReview")), "REVIEW", False),
    ("designReview.by is an agent", jedit("registry.manifest.json", lambda d: d["designReview"].update(by="Claude (AI agent)")), "REVIEW", False),
    ("status reverted to unreviewed without a record", jedit("registry.manifest.json", lambda d: (d.pop("designReview"), d.update(status="design-review-" + "pending", designReviewStatus="design-review-" + "pending"))), "REVIEW", False),
    ("productionApproved flipped to true", jedit("registry.manifest.json", lambda d: d.update(productionApproved=True)), "REVIEW", False),
    ("designReviewStatus differs from status", jedit("registry.manifest.json", lambda d: d.update(designReviewStatus="design-review-" + "pending")), "REVIEW", False),
    ("policy_hash script unregistered", jedit("registry.manifest.json", lambda d: d["entryPoints"].pop("policyHash")), "MANIFEST", False),
    ("absolute machine path", tedit("README.md", "# ", "# " + "/" + "Users/someone/project ", 1), "HYGIENE", False),
]


SCRATCH = None  # --scratch <dir>: an empty or absent directory to hold the throwaway copies


def make_copy():
    tmp = Path(tempfile.mkdtemp(prefix="drift-", dir=SCRATCH))
    proj = tmp / "project"; proj.mkdir()
    shutil.copytree(ROOT, proj / "design-repo", ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    if HAS_SOURCE:
        for e in SOURCE_ENTRIES:
            os.symlink(SRC / e, proj / e)
    return tmp, proj / "design-repo"


def run_verify(repo):
    r = subprocess.run([sys.executable, "-B", str(repo / "extraction/verify_all.py")], cwd=repo, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def main():
    global SCRATCH
    if "--scratch" in sys.argv:
        SCRATCH = Path(sys.argv[sys.argv.index("--scratch") + 1])
        if SCRATCH.exists() and any(SCRATCH.iterdir()):
            sys.exit("--scratch directory must be empty")
        SCRATCH.mkdir(parents=True, exist_ok=True)
    tmp, repo = make_copy()
    code, out = run_verify(repo); shutil.rmtree(tmp)
    print(f"{'PASS' if code == 0 else 'FAIL'}  control: untouched copy passes verify_all (exit {code}); source tree {'linked' if HAS_SOURCE else 'absent'}")
    control_ok = code == 0; bad = 0 if control_ok else 1
    if code: print(out[-1500:])
    caught = skipped = 0
    for name, fn, check, needs_src in CASES:
        if needs_src and not HAS_SOURCE:
            print(f"SKIP  {name}: needs the source evidence tree"); skipped += 1; continue
        tmp, repo = make_copy()
        fn(repo)
        code, out = run_verify(repo); shutil.rmtree(tmp)
        hit = code == 1 and re.search(rf"^FAIL  {check}", out, re.M)
        caught += bool(hit)
        print(f"{'CAUGHT' if hit else 'MISSED'}  [{check}] {name}")
        if not hit:
            bad += 1; print(out[-800:])
    print(f"\nprove_drift: {caught}/{len(CASES) - skipped} drift cases caught, {skipped} skipped; control {'passed' if control_ok else 'FAILED'}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
