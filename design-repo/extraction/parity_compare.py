#!/usr/bin/env python3
"""R12 parity harness, step 2 of 2: pixel-compare the captures from parity_capture.mjs.

    python3 extraction/parity_compare.py <OUT_DIR> [--write extraction/parity-results.json]

A pixel "matches" when its largest per-channel difference is <= TOLERANCE (anti-aliasing and
JPEG/WebP decode noise). Each shot is cropped to the rows the section occupies in the viewport.
Section score = matching pixels / compared pixels over all its shots. Gate: every section
>= SECTION_GATE and the pixel-weighted average >= SECTION_GATE. Needs Pillow.
Exit 1 when the gate fails, 2 when there is nothing to compare.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageChops

TOLERANCE = 24
MASK = (255, 0, 255)
SECTION_GATE = 0.80

def main():
    if len(sys.argv) < 2:
        print(__doc__); return 2
    out = Path(sys.argv[1]); cap = json.loads((out / "capture.json").read_text())
    write = sys.argv[sys.argv.index("--write") + 1] if "--write" in sys.argv else None
    results = {"viewport": cap["viewport"], "tolerance": TOLERANCE, "sectionGate": SECTION_GATE,
               "live": cap["live"], "clone": cap["clone"], "masks": cap["masks"], "routes": {}}
    tot_m = tot_n = 0; failures = []
    for route, r in cap["routes"].items():
        per = {}
        for s in r["shots"]:
            a = Image.open(out / s["clone"]).convert("RGB"); b = Image.open(out / s["live"]).convert("RGB")
            box = (0, int(s["cropY0"]), a.width, int(s["cropY1"]))
            a, b = a.crop(box), b.crop(box)
            diff = ImageChops.difference(a, b)
            chans = diff.split()
            mx = ImageChops.lighter(ImageChops.lighter(chans[0], chans[1]), chans[2])
            # masked pixels (mask colour on both sides) are excluded from numerator AND denominator
            masked = sum(1 for pa, pb in zip(a.getdata(), b.getdata()) if pa == MASK and pb == MASK)
            hist = mx.histogram(); n = a.width * a.height - masked; m = sum(hist[: TOLERANCE + 1]) - masked
            key = f'{s["index"]:02d}:{s["section"]}'
            acc = per.setdefault(key, {"section": s["section"], "match": 0, "pixels": 0, "shots": 0, "scrollOffsets": []})
            acc["match"] += m; acc["pixels"] += n; acc["shots"] += 1; acc["scrollOffsets"].append(s["cloneScrollY"])
            acc["masked"] = acc.get("masked", 0) + masked; acc["total"] = acc.get("total", 0) + a.width * a.height
            if s.get("liveScrollY") != s.get("cloneScrollY"):
                acc.setdefault("scrollMismatch", []).append([s.get("cloneScrollY"), s.get("liveScrollY")])
        secs = []
        for key, acc in per.items():
            if acc["pixels"] < 0.05 * acc["total"]:
                # fewer than 5% of the section's pixels left after masking (e.g. a video-only hero):
                # reported as not measurable, never scored as a pass or as a number
                secs.append({"key": key, "section": acc["section"], "parity": None, "notMeasurable": True, "maskedFraction": round(acc["masked"] / acc["total"], 4),
                             "reason": "time-varying content (video) masked; <5% of pixels comparable", "shots": acc["shots"], "scrollOffsets": acc["scrollOffsets"]})
                continue
            score = acc["match"] / acc["pixels"]
            tot_m += acc["match"]; tot_n += acc["pixels"]
            row = {"key": key, "section": acc["section"], "parity": round(score, 6), "maskedFraction": round(acc["masked"] / acc["total"], 4), "shots": acc["shots"], "scrollOffsets": acc["scrollOffsets"], "pass": score >= SECTION_GATE}
            if "scrollMismatch" in acc: row["scrollMismatch"] = acc["scrollMismatch"]
            secs.append(row)
            if score < SECTION_GATE: failures.append(f"{route} {key} {score:.4f}")
        rm = sum(per[k]["match"] for k in per); rn = sum(per[k]["pixels"] for k in per)
        results["routes"][route] = {"cloneHeight": r["cloneHeight"], "liveHeight": r["liveHeight"],
                                    "routeAverage": round(rm / rn, 6) if rn else None, "minSection": min((x["parity"] for x in secs if x["parity"] is not None), default=None), "sections": secs}
    if not tot_n:
        print("nothing compared"); return 2
    avg = tot_m / tot_n
    # discrimination control: the comparator must score two DIFFERENT viewports low,
    # otherwise a 1.0 parity would mean nothing. Pair shot k (clone) with shot k+3 (live).
    neg = []
    for route, r in cap["routes"].items():
        sh = r["shots"]
        for k in range(0, max(0, len(sh) - 3), 3):
            a = Image.open(out / sh[k]["clone"]).convert("RGB"); b = Image.open(out / sh[k + 3]["live"]).convert("RGB")
            ch = ImageChops.difference(a, b).split(); mx = ImageChops.lighter(ImageChops.lighter(ch[0], ch[1]), ch[2])
            neg.append(sum(mx.histogram()[: TOLERANCE + 1]) / (a.width * a.height))
    results["discriminationControl"] = {"pairs": len(neg), "meanSimilarityOfMismatchedViewports": round(sum(neg) / len(neg), 4) if neg else None,
                                        "note": "Same comparator applied to deliberately mismatched viewports; must stay well below the gate."}
    results["average"] = round(avg, 6); results["sectionsCompared"] = sum(1 for v in results["routes"].values() for x in v["sections"] if x["parity"] is not None)
    results["notMeasurable"] = [f'{r} {x["key"]}' for r, v in results["routes"].items() for x in v["sections"] if x["parity"] is None]
    results["failures"] = failures; results["pass"] = not failures and avg >= SECTION_GATE
    for route, r in results["routes"].items():
        print(f'{route:24} clone {r["cloneHeight"]:>6} live {r["liveHeight"]:>6}  avg {r["routeAverage"]:.4f}  min {r["minSection"]:.4f}  sections {len(r["sections"])}')
    for nm in results["notMeasurable"]: print("  NOT MEASURABLE", nm)
    print(f'sections compared: {results["sectionsCompared"]}  pixel-weighted average: {avg:.6f}  failures (<{SECTION_GATE}): {len(failures)}')
    for f in failures: print("  FAIL", f)
    dc = results["discriminationControl"]; print(f'discrimination control: {dc["pairs"]} mismatched pairs, mean similarity {dc["meanSimilarityOfMismatchedViewports"]}')
    if write: Path(write).write_text(json.dumps(results, indent=1) + "\n")
    return 0 if results["pass"] else 1

if __name__ == "__main__":
    sys.exit(main())
