#!/usr/bin/env python3
"""Build assets/data/catalog.js from tracked-repos.txt and data/catalog.json.

The site ships one generated JavaScript file, assets/data/catalog.js, which the
page reads at startup. That file is not meant to be hand-edited. It is built
from two inputs:

  tracked-repos.txt   a plain list of `owner/name` lines — which repositories
                      appear on the site, and in what order
  data/catalog.json   the written content for every repository ever catalogued,
                      tracked or not (tagline, summary, highlights, stack,
                      tier, category)

Splitting them this way means removing a repository from the site is deleting
one line, and putting it back later is adding that line again — the writing is
never thrown away.

Everything that can be derived is derived here rather than stored: the project
count, the flagship count, the distinct-language count, the star total, the
per-category counts and the language breakdown. Storing a number that is really
a sum of other numbers is how a page ends up claiming "80 projects" above a
grid of 75.

Usage
-----
    python3 tools/build-catalog.py            # write assets/data/catalog.js
    python3 tools/build-catalog.py --check    # verify it is up to date, write
                                              # nothing, exit 1 if it is stale
    python3 tools/build-catalog.py --fetch    # add a stub card for any tracked
                                              # repository that has none yet
    python3 tools/build-catalog.py --refresh  # as --fetch, and also re-read
                                              # stars, language, topics and
                                              # last-push date for every card

`--fetch` and `--refresh` shell out to the GitHub CLI (`gh`), so they need
`gh auth login` to have been run. The other two modes are offline and need
nothing but Python 3 — no Node.js, no package manager, no lockfile.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import date, timezone, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "tracked-repos.txt")
SOURCE = os.path.join(ROOT, "data", "catalog.json")
OUTPUT = os.path.join(ROOT, "assets", "data", "catalog.js")
PAGE = os.path.join(ROOT, "index.html")

# index.html states the project count in four places that a search engine, a
# link preview or a reader with JavaScript disabled sees before any script
# runs, so they cannot be filled in at runtime. Each pattern below has exactly
# one capturing group, and that group is the number to overwrite.
PAGE_COUNT_PATTERNS = [
    r"(\d+) open-source projects",          # <meta name="description"> and og:description
    r"(\d+) public repositories",           # the hero paragraph
    r"Search (\d+) projects",               # the search box placeholder
    r'id="result-count">(\d+) projects',    # the count shown before the first render
]

# Used for a repository whose language GitHub reports but which no existing
# card has, so there is no colour to copy. Deliberately drab: a wrong-looking
# grey chip is a visible prompt to put the real linguist colour in.
FALLBACK_LANG_COLOR = "#8f9fa8"

HEADER = """/* ============================================================================
   Project catalog — GENERATED FILE, DO NOT EDIT BY HAND.

   Built by tools/build-catalog.py from two inputs:

     tracked-repos.txt   which repositories are on the site, and in what order
     data/catalog.json   the written content for every catalogued repository

   To change what appears here, edit one of those and run:

     python3 tools/build-catalog.py

   Stars, language and last-updated come from the GitHub REST API via
   `--fetch`. The summaries and highlights were written against each
   repository's own README, and for repositories with little or no README,
   against the actual source tree.

   Where a repository turned out to be a one-commit stub, the entry says so and
   carries no highlights. That is deliberate: padding a stub into sounding like
   a product is the failure mode this catalog is built to avoid.
   ========================================================================= */

"""


# --------------------------------------------------------------------- input


def read_config(path=CONFIG):
    """Return the tracked `owner/name` ids, in file order.

    Blank lines are skipped and everything from a `#` onwards is a comment, so
    a repository can be parked with a `#` in front of it instead of deleted.
    """
    ids = []
    seen = {}
    with open(path, encoding="utf-8") as fh:
        for lineno, raw in enumerate(fh, 1):
            line = raw.split("#", 1)[0].strip()
            if not line:
                continue
            if line.count("/") != 1 or line.startswith("/") or line.endswith("/"):
                die(f"{os.path.basename(path)}:{lineno}: expected `owner/name`, got {line!r}")
            if line in seen:
                die(f"{os.path.basename(path)}:{lineno}: {line} is already listed on line {seen[line]}")
            seen[line] = lineno
            ids.append(line)
    if not ids:
        die(f"{os.path.basename(path)} lists no repositories")
    return ids


def read_source(path=SOURCE):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    for key in ("generatedAt", "categories", "projects"):
        if key not in data:
            die(f"{os.path.relpath(path, ROOT)} is missing the {key!r} key")
    return data


def write_source(data, path=SOURCE):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)
        fh.write("\n")


def die(message):
    print(f"build-catalog: {message}", file=sys.stderr)
    raise SystemExit(1)


# ------------------------------------------------------------------ assemble


def build(tracked, source):
    """Return the catalog object the page consumes, with every total derived."""
    cards = {p["id"]: p for p in source["projects"]}

    missing = [pid for pid in tracked if pid not in cards]
    if missing:
        die(
            "these repositories are tracked but have no card in data/catalog.json:\n  "
            + "\n  ".join(missing)
            + "\n\nRun `python3 tools/build-catalog.py --fetch` to add stub cards for them, "
            "then write each stub's tagline, summary and highlights."
        )

    projects = [cards[pid] for pid in tracked]

    blank = [p["id"] for p in projects if not p.get("summary") or not p.get("tagline")]
    if blank:
        die(
            "these tracked repositories still have an empty tagline or summary:\n  "
            + "\n  ".join(blank)
            + "\n\nFill them in in data/catalog.json — a card with no text renders as a blank tile."
        )

    known_categories = {c["key"]: c for c in source["categories"]}
    unknown = sorted({p["category"] for p in projects} - set(known_categories))
    if unknown:
        die("these projects use a category that data/catalog.json does not define: " + ", ".join(unknown))

    counts = {}
    for p in projects:
        counts[p["category"]] = counts.get(p["category"], 0) + 1

    categories = []
    for c in source["categories"]:
        n = counts.get(c["key"], 0)
        if not n:
            # A category nobody is tracking any more would otherwise render as
            # an empty heading with an empty grid under it.
            continue
        categories.append({"key": c["key"], "label": c["label"], "blurb": c["blurb"], "count": n})

    lang_counts = {}
    lang_colors = {}
    for p in projects:
        lang = p.get("lang") or ""
        if not lang:
            continue
        lang_counts[lang] = lang_counts.get(lang, 0) + 1
        lang_colors.setdefault(lang, p.get("langColor") or FALLBACK_LANG_COLOR)

    langs = [
        {"lang": lang, "count": lang_counts[lang], "color": lang_colors[lang]}
        for lang in sorted(lang_counts, key=lambda l: (-lang_counts[l], l.lower()))
    ]

    return {
        "generatedAt": source["generatedAt"],
        "totals": {
            "projects": len(projects),
            "flagship": sum(1 for p in projects if p.get("tier") == "flagship"),
            "languages": len(langs),
            "stars": sum(int(p.get("stars") or 0) for p in projects),
        },
        "categories": categories,
        "langs": langs,
        "projects": projects,
    }


def render(catalog):
    return HEADER + "window.WB_CATALOG = " + json.dumps(catalog, indent=2) + ";\n"


def render_page(count, path=PAGE):
    """Return index.html with every stated project count set to `count`.

    The page hard-codes the number in its meta description, its social-card
    description, the hero paragraph and the search box. Those are read before
    any JavaScript runs — by crawlers, by link-preview bots, by anyone with
    scripting off — so they have to be right in the file itself rather than
    filled in at runtime. Rewriting them here is what stops the page claiming
    "80 projects" over a grid of 75.
    """
    text = open(path, encoding="utf-8").read()
    for pattern in PAGE_COUNT_PATTERNS:
        matches = list(re.finditer(pattern, text))
        if not matches:
            die(
                f"index.html has no text matching {pattern!r}.\n"
                "The wording changed; update PAGE_COUNT_PATTERNS in tools/build-catalog.py to match, "
                "so the stated project count keeps tracking the catalog."
            )
        # Replace from the end so earlier match offsets stay valid.
        for m in reversed(matches):
            text = text[: m.start(1)] + str(count) + text[m.end(1) :]
    return text


# --------------------------------------------------------------------- fetch


def gh_api(path):
    """Call the GitHub REST API through the `gh` CLI, or return None on 404."""
    proc = subprocess.run(
        ["gh", "api", path],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        if "404" in proc.stderr or "Not Found" in proc.stderr:
            return None
        die(f"`gh api {path}` failed:\n{proc.stderr.strip()}")
    return json.loads(proc.stdout)


def iso_day(value):
    """GitHub timestamps are `2026-08-07T10:11:12Z`; the site shows the day."""
    if not value:
        return ""
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).date().isoformat()
    except ValueError:
        return value[:10]


def fetch(tracked, source, refresh=False):
    """Add a stub card for any tracked repository that has none.

    With `refresh` set, also overwrite the volatile fields of the cards that
    already exist. Volatile means "GitHub owns this value, not me": stars,
    primary language, last-push date, topics, homepage. Everything written by
    hand — tagline, summary, highlights, stack, tier, category — is left
    exactly as it is either way.

    Note that `updated` is filled from the repository's `pushed_at`, the last
    time code was pushed, and not from `updated_at`, which also moves when
    somebody stars the repository or the description is edited. A card that
    says "updated last week" because a stranger starred it is worse than no
    date at all.
    """
    cards = {p["id"]: p for p in source["projects"]}
    colors = {p["lang"]: p["langColor"] for p in source["projects"] if p.get("lang") and p.get("langColor")}

    added, refreshed, gone = [], 0, []

    for pid in tracked:
        owner, name = pid.split("/", 1)
        if pid in cards and not refresh:
            continue
        repo = gh_api(f"repos/{owner}/{name}")
        if repo is None:
            gone.append(pid)
            continue

        lang = repo.get("language") or ""
        volatile = {
            "lang": lang,
            "langColor": colors.get(lang, FALLBACK_LANG_COLOR) if lang else "",
            "stars": int(repo.get("stargazers_count") or 0),
            "updated": iso_day(repo.get("pushed_at")),
            "topics": sorted(repo.get("topics") or []),
            "url": repo.get("html_url") or f"https://github.com/{pid}",
            "homepage": repo.get("homepage") or "",
        }

        card = cards.get(pid)
        if card is None:
            card = {
                "id": pid,
                "owner": owner,
                "name": name,
                "title": name,
                "tagline": repo.get("description") or "",
                "summary": "",
                "highlights": [],
                "tags": [],
                "stack": [],
                "tier": "lab",
                "status": "",
                "category": "labs",
                "categoryLabel": next(
                    (c["label"] for c in source["categories"] if c["key"] == "labs"), "Language Labs & Ports"
                ),
            }
            card.update(volatile)
            source["projects"].append(card)
            cards[pid] = card
            added.append(pid)
        else:
            card.update(volatile)
            refreshed += 1

    if gone:
        die(
            "the GitHub API has no such repositories (renamed, deleted, or now private):\n  "
            + "\n  ".join(gone)
            + "\n\nFix or remove their lines in tracked-repos.txt."
        )

    if added or refreshed:
        # The footer stamp says when the data was harvested, so it only moves
        # when the API actually gave us something new.
        source["generatedAt"] = date.today().isoformat()
        write_source(source)

    if refresh:
        print(f"build-catalog: refreshed {refreshed} existing card(s) from the GitHub API")
    if not added:
        print("build-catalog: every tracked repository already has a card")
    if added:
        print(f"build-catalog: added {len(added)} stub card(s) — write their tagline, summary and")
        print("               highlights in data/catalog.json before building:")
        for pid in added:
            print(f"                 {pid}")
    return source


# ---------------------------------------------------------------------- main


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify assets/data/catalog.js is up to date; write nothing, exit 1 if stale",
    )
    parser.add_argument(
        "--fetch",
        action="store_true",
        help="add a stub card for any tracked repository that has none, from the GitHub API (needs `gh`)",
    )
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="as --fetch, and also re-read stars, language, topics and last-push date for existing cards",
    )
    args = parser.parse_args(argv)

    tracked = read_config()
    source = read_source()

    if args.fetch or args.refresh:
        source = fetch(tracked, source, refresh=args.refresh)

    catalog = build(tracked, source)
    rendered = render(catalog)
    page = render_page(catalog["totals"]["projects"])

    if args.check:
        stale = []
        current = open(OUTPUT, encoding="utf-8").read() if os.path.exists(OUTPUT) else ""
        if current != rendered:
            stale.append("assets/data/catalog.js")
        if open(PAGE, encoding="utf-8").read() != page:
            stale.append("index.html")
        if stale:
            die(
                ", ".join(stale)
                + (" are" if len(stale) > 1 else " is")
                + " out of date with tracked-repos.txt and data/catalog.json.\n"
                "Run `python3 tools/build-catalog.py` and commit the result."
            )
        print(f"build-catalog: everything is up to date ({len(tracked)} repositories)")
        return 0

    with open(OUTPUT, "w", encoding="utf-8") as fh:
        fh.write(rendered)
    with open(PAGE, "w", encoding="utf-8") as fh:
        fh.write(page)
    print(f"build-catalog: wrote assets/data/catalog.js and index.html — {len(tracked)} repositories")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
