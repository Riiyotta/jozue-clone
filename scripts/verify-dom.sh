#!/bin/bash
# Renders every route from the local dev server and diffs its DOM against the original page.
cd "$(dirname "$0")/.." && mkdir -p .recon/local
fail=0
while read r; do n=$(echo "$r" | sed 's#^/##; s#/$##; s#/#__#g'); [ -z "$n" ] && n=index
  curl -s -H 'Accept: text/html' "http://localhost:5190$r" -o ".recon/local/$n.html"
  out=$(node scripts/domdiff.mjs ".recon/pages/$n.html" ".recon/local/$n.html")
  echo "$out" | tail -1 | grep -q 'diffs 0$' || { echo "$out"; fail=1; }
done < .recon/routes.txt
[ $fail = 0 ] && echo "All $(wc -l < .recon/routes.txt | tr -d ' ') routes: DOM identical to original"
