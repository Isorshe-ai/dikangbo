#!/usr/bin/env bash
# GitHub Copilot
# html testing for CI/CD
# Usage: ./test.sh [path]
# Finds .html files and validates them using the first available validator:
#  - tidy
#  - vnu (CLI) or vnu.jar (W3C validator)
#  - html-validate (npm)
#  - htmlhint (npm)
#
# Exits 0 on success, non-zero if any file has validation errors or no validator is available.

set -o pipefail

ROOT="${1:-.}"
# gather html files tracked by git if available, otherwise fallback to find
if git rev-parse --git-dir >/dev/null 2>&1; then
    mapfile -t FILES < <(git ls-files '*.html' 2>/dev/null)
else
    mapfile -t FILES < <(find "$ROOT" -type f -name '*.html' 2>/dev/null)
fi

if [ "${#FILES[@]}" -eq 0 ]; then
    echo "No HTML files found. Skipping HTML validation."
    exit 0
fi

echo "Found ${#FILES[@]} HTML file(s)."

errors=0

run_tidy() {
    echo "Using tidy for validation..."
    for f in "${FILES[@]}"; do
        # -quiet suppresses info, -errors prints only errors, -utf8 to handle encodings
        tidy -e -q -utf8 "$f" 2>&1
        rc=$?
        if [ $rc -ne 0 ]; then
            echo "tidy reported issues in: $f"
            errors=$((errors + 1))
        fi
    done
}

run_vnu_cli() {
    echo "Using vnu (W3C) CLI for validation..."
    vnu --errors-only "${FILES[@]}"
    rc=$?
    if [ $rc -ne 0 ]; then errors=$((errors + 1)); fi
}

run_vnu_jar() {
    echo "Using vnu.jar (W3C) for validation..."
    # vnu.jar may produce non-zero exit on errors
    java -jar "$1" --errors-only "${FILES[@]}"
    rc=$?
    if [ $rc -ne 0 ]; then errors=$((errors + 1)); fi
}

run_html_validate() {
    echo "Using html-validate (npm) for validation..."
    html-validate "${FILES[@]}"
    rc=$?
    if [ $rc -ne 0 ]; then errors=$((errors + 1)); fi
}

run_htmlhint() {
    echo "Using htmlhint (npm) for validation..."
    htmlhint "${FILES[@]}"
    rc=$?
    if [ $rc -ne 0 ]; then errors=$((errors + 1)); fi
}

# detect available validator
if command -v tidy >/dev/null 2>&1; then
    run_tidy
elif command -v vnu >/dev/null 2>&1; then
    run_vnu_cli
elif [ -f "./vnu.jar" ] || [ -f "/usr/local/bin/vnu.jar" ] || [ -f "/usr/share/vnu/vnu.jar" ]; then
    # prefer local ./vnu.jar, else check common locations
    if [ -f "./vnu.jar" ]; then jar="./vnu.jar"; elif [ -f "/usr/local/bin/vnu.jar" ]; then jar="/usr/local/bin/vnu.jar"; else jar="/usr/share/vnu/vnu.jar"; fi
    if command -v java >/dev/null 2>&1; then
        run_vnu_jar "$jar"
    else
        echo "vnu.jar found but 'java' is not available."
        errors=$((errors + 1))
    fi
elif command -v html-validate >/dev/null 2>&1; then
    run_html_validate
elif command -v htmlhint >/dev/null 2>&1; then
    run_htmlhint
else
    echo "No HTML validator found. Install one of: tidy, vnu (or vnu.jar), html-validate, htmlhint."
    echo "On Debian/Ubuntu: sudo apt-get install tidy"
    echo "Or install html-validate/htmlhint via npm: npm i -g html-validate htmlhint"
    exit 1
fi

if [ "$errors" -ne 0 ]; then
    echo "HTML validation failed."
    exit 1
else
    echo "HTML validation passed."
    exit 0
fi