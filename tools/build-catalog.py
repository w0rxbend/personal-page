#!/usr/bin/env python3
"""Build assets/data/catalog.js from catalog-rules.txt and data/catalog.json.

The site ships one generated JavaScript file, assets/data/catalog.js, which the
page reads at startup. That file is not meant to be hand-edited. It is built
from two inputs:

  catalog-rules.txt   the rules deciding which repositories the site shows —
                      "include everything written in Rust", "leave the
                      playgrounds out", "show this one anyway"
  data/catalog.json   the written content for every repository ever catalogued,
                      selected or not (tagline, summary, highlights, stack,
                      tier, category)

Splitting them this way means changing what the site shows is editing one line
of rules, and nothing that was written is ever thrown away — a repository that
drops out keeps its card and comes back the moment a rule selects it again.

Everything that can be derived is derived here rather than stored: the project
count, the flagship count, the distinct-language count, the star total, the
per-category counts and the language breakdown. Storing a number that is really
a sum of other numbers is how a page ends up claiming "80 projects" above a
grid of 51.

Usage
-----
    python3 tools/build-catalog.py            # write assets/data/catalog.js
    python3 tools/build-catalog.py --explain  # print every repository, whether
                                              # it is in or out, and the rule
                                              # that decided it
    python3 tools/build-catalog.py --check    # verify it is up to date, write
                                              # nothing, exit 1 if it is stale
    python3 tools/build-catalog.py --fetch    # add a stub card for any selected
                                              # repository that has none yet
    python3 tools/build-catalog.py --refresh  # as --fetch, and also re-read
                                              # stars, language, topics and
                                              # last-push date for every card

`--fetch` and `--refresh` shell out to the GitHub CLI (`gh`), so they need
`gh auth login` to have been run. The other modes are offline and need nothing
but Python 3 — no Node.js, no package manager, no lockfile.
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
CONFIG = os.path.join(ROOT, "catalog-rules.txt")
SOURCE = os.path.join(ROOT, "data", "catalog.json")
OUTPUT = os.path.join(ROOT, "assets", "data", "catalog.js")
PAGE = os.path.join(ROOT, "index.html")

# index.html states the project count in four places that a search engine, a
# link preview or a reader with JavaScript disabled sees before any script
# runs, so they cannot be filled in at runtime. Each pattern below has exactly
# one capturing group, and that group is the number to overwrite.
PAGE_COUNT_PATTERNS = [
    r"(\d+) open-source projects",          # <meta name="description"> and og:description
    r"(\d+) public repos(?:itories)?",      # the hero paragraph, long or short form
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

     catalog-rules.txt   the rules deciding which repositories are shown
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


# Which card field each selector looks at, and whether that field is one value
# or a list of them. `repo` is special-cased because it matches the id.
SELECTORS = {
    "repo": ("id", "one"),
    "owner": ("owner", "one"),
    "lang": ("lang", "one"),
    "language": ("lang", "one"),
    "cat": ("category", "one"),
    "category": ("category", "one"),
    "tier": ("tier", "one"),
    "tag": ("tags", "many"),
    "topic": ("topics", "many"),
    "stack": ("stack", "many"),
}


class Rule:
    """One line of catalog-rules.txt: `include lang:Rust`, `exclude tier:lab`."""

    def __init__(self, lineno, include, selector, value, text):
        self.lineno = lineno       # for error messages and --explain
        self.include = include     # True for `include`, False for `exclude`
        self.selector = selector   # "lang", "tier", "all", ...
        self.value = value         # lower-cased, so matching is case-insensitive
        self.text = text           # the line as written, for --explain

    def matches(self, project):
        if self.selector == "all":
            return True
        field, arity = SELECTORS[self.selector]
        if arity == "one":
            return str(project.get(field) or "").lower() == self.value
        return any(str(v).lower() == self.value for v in project.get(field) or [])


def read_rules(path=CONFIG):
    """Parse catalog-rules.txt into an ordered list of Rule objects.

    The grammar is two words: an action (`include` or `exclude`) and a
    selector (`lang:Rust`, `cat:iot`, `repo:owner/name`, or the bare word
    `all`). Blank lines are skipped and everything from a `#` onwards is a
    comment, so a rule can be parked with a `#` in front of it rather than
    deleted.

    Rules are applied in order and **the last one that matches a repository
    wins**. That single sentence is the whole evaluation model: it means broad
    strokes go at the top ("include everything in Rust") and the exceptions go
    at the bottom ("...but not this one"), which is how anyone would write the
    list by hand anyway.
    """
    rules = []
    discover = []
    with open(path, encoding="utf-8") as fh:
        for lineno, raw in enumerate(fh, 1):
            line = raw.split("#", 1)[0].strip()
            if not line:
                continue

            parts = line.split(None, 1)
            action = parts[0].lower()

            # `discover <owner>` is not a rule. It tells --fetch which accounts
            # to ask the GitHub API about, so a repository pushed last week can
            # be picked up without anyone naming it here.
            if action == "discover":
                if len(parts) != 2 or "/" in parts[1]:
                    die(f"{os.path.basename(path)}:{lineno}: expected `discover <account>`, got {line!r}")
                discover.append(parts[1].strip())
                continue

            if action not in ("include", "exclude") or len(parts) != 2:
                die(
                    f"{os.path.basename(path)}:{lineno}: expected `include <selector>`, "
                    f"`exclude <selector>` or `discover <account>`, got {line!r}"
                )

            target = parts[1].strip()
            if target.lower() == "all":
                rules.append(Rule(lineno, action == "include", "all", "", line))
                continue

            if ":" not in target:
                die(
                    f"{os.path.basename(path)}:{lineno}: {target!r} is not a selector. "
                    f"Use `all` or one of: {', '.join(sorted(SELECTORS))} — for example `lang:Rust`."
                )
            selector, value = target.split(":", 1)
            selector = selector.strip().lower()
            value = value.strip().lower()
            if selector not in SELECTORS:
                die(
                    f"{os.path.basename(path)}:{lineno}: unknown selector {selector!r}. "
                    f"Known selectors: all, {', '.join(sorted(SELECTORS))}."
                )
            if not value:
                die(f"{os.path.basename(path)}:{lineno}: {selector!r} needs a value, as in `{selector}:something`")
            rules.append(Rule(lineno, action == "include", selector, value, line))

    if not rules:
        die(f"{os.path.basename(path)} contains no rules")
    return rules, discover


def select(rules, source):
    """Apply the rules to every card and return (selected, decisions).

    `decisions` maps each repository id to the Rule that decided its fate, or
    None when no rule mentioned it at all — which counts as "not shown", so a
    repository is never published by accident.

    Selected repositories come out grouped by category, in the order the
    categories are declared in data/catalog.json, then flagship before solid
    before lab, then most-starred, then alphabetically. Ordering by rule order
    would have been possible, but it would mean the file has to be re-sorted by
    hand every time a project is promoted.
    """
    tier_rank = {"flagship": 0, "solid": 1, "lab": 2}
    cat_rank = {c["key"]: i for i, c in enumerate(source["categories"])}

    decisions = {}
    selected = []
    for project in source["projects"]:
        winner = None
        for rule in rules:
            if rule.matches(project):
                winner = rule
        decisions[project["id"]] = winner
        if winner is not None and winner.include:
            selected.append(project)

    selected.sort(
        key=lambda p: (
            cat_rank.get(p["category"], len(cat_rank)),
            tier_rank.get(p["tier"], len(tier_rank)),
            -int(p.get("stars") or 0),
            str(p.get("title") or p["name"]).lower(),
        )
    )

    # A rule that matches nothing is almost always a typo — `lang:Cpp` for
    # `lang:C++`, `cat:iot` misspelled — and it fails silently otherwise.
    matched_any = {rule.lineno for p in source["projects"] for rule in rules if rule.matches(p)}
    for rule in rules:
        if rule.lineno not in matched_any:
            print(
                f"build-catalog: warning: {os.path.basename(CONFIG)}:{rule.lineno}: "
                f"`{rule.text}` matches no repository",
                file=sys.stderr,
            )

    if not selected:
        die("the rules select no repositories at all — the site would have an empty catalogue")
    return selected, decisions


def explain(rules, source, selected, decisions):
    """Print the fate of every catalogued repository and why."""
    chosen = {p["id"] for p in selected}
    order = {p["id"]: i for i, p in enumerate(selected)}
    rows = sorted(
        source["projects"],
        key=lambda p: (p["id"] not in chosen, order.get(p["id"], 0), p["id"].lower()),
    )
    width = max(len(p["id"]) for p in rows)
    print(f"{'repository'.ljust(width)}  in?  decided by")
    print("-" * (width + 40))
    for p in rows:
        rule = decisions.get(p["id"])
        if rule is None:
            reason = "no rule matched — not shown"
        else:
            reason = f"line {rule.lineno}: {rule.text}"
        print(f"{p['id'].ljust(width)}  {'yes' if p['id'] in chosen else ' no'}  {reason}")
    print(f"\n{len(selected)} of {len(source['projects'])} catalogued repositories are on the site.")


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


def build(projects, source):
    """Return the catalog object the page consumes, with every total derived."""
    blank = [p["id"] for p in projects if not p.get("summary") or not p.get("tagline")]
    if blank:
        die(
            "these selected repositories still have an empty tagline or summary:\n  "
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


def list_owner_repos(owner):
    """Every public, non-fork repository belonging to one account.

    An account can be a user or an organisation, and the API paths differ, so
    try the user path first and fall back to the organisation one.
    """
    repos = []
    for prefix in ("users", "orgs"):
        page = 1
        while True:
            batch = gh_api(f"{prefix}/{owner}/repos?per_page=100&type=public&page={page}")
            if batch is None:
                break
            repos.extend(batch)
            if len(batch) < 100:
                break
            page += 1
        if repos:
            break
    return [r for r in repos if not r.get("fork") and not r.get("private")]


def fetch(rules, discover, source, refresh=False):
    """Add a stub card for every repository that could be selected but has none.

    Two things can produce a repository with no card yet:

      * a rule naming one directly, `include repo:owner/name`
      * a `discover <owner>` line, which asks the GitHub API for that account's
        public repositories, so a project pushed last week turns up here without
        anybody having to remember it exists

    With `refresh` set, the volatile fields of the cards that already exist are
    overwritten too. Volatile means "GitHub owns this value, not me": stars,
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

    # Repositories a rule names outright, plus everything the discovered
    # accounts own, minus what is already catalogued.
    #
    # Compared lower-cased throughout: GitHub treats repository names as
    # case-insensitive, selector values are lower-cased when parsed, and
    # `repo:w0rxbend/freecad-projects` must not add a second card for the
    # `w0rxbend/FreeCAD-Projects` that is already here.
    known = {pid.lower() for pid in cards}
    wanted = [r.value for r in rules if r.selector == "repo" and r.value not in known]
    discovered = {}
    for owner in discover:
        for repo in list_owner_repos(owner):
            pid = repo["full_name"]
            if pid.lower() not in known and pid.lower() not in {k.lower() for k in discovered}:
                discovered[pid] = repo

    added, refreshed, gone = [], 0, []
    targets = list(dict.fromkeys(wanted + list(discovered)))
    if refresh:
        targets = list(dict.fromkeys(list(cards) + targets))

    for requested in targets:
        owner, name = requested.split("/", 1)
        repo = discovered.get(requested) or gh_api(f"repos/{owner}/{name}")
        if repo is None:
            gone.append(requested)
            continue

        # The API knows the real capitalisation; a rule may have been written
        # in any. Take the id from the API so a card is only ever created once.
        pid = repo.get("full_name") or requested
        owner, name = pid.split("/", 1)

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
            + f"\n\nFix or remove them in {os.path.basename(CONFIG)}."
        )

    if added or refreshed:
        # The footer stamp says when the data was harvested, so it only moves
        # when the API actually gave us something new.
        source["generatedAt"] = date.today().isoformat()
        write_source(source)

    if refresh:
        print(f"build-catalog: refreshed {refreshed} existing card(s) from the GitHub API")
    if not added:
        print("build-catalog: every repository the rules could select already has a card")
    if added:
        print(f"build-catalog: added {len(added)} stub card(s) to data/catalog.json.")
        print("               Any of these the rules select needs a tagline and summary")
        print("               written before the build will accept it:")
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
        "--explain",
        action="store_true",
        help="print every catalogued repository, whether it is shown, and the rule that decided it",
    )
    parser.add_argument(
        "--fetch",
        action="store_true",
        help="add a stub card for any repository the rules could select but which has none (needs `gh`)",
    )
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="as --fetch, and also re-read stars, language, topics and last-push date for existing cards",
    )
    args = parser.parse_args(argv)

    rules, discover = read_rules()
    source = read_source()

    if args.fetch or args.refresh:
        source = fetch(rules, discover, source, refresh=args.refresh)

    # Selector values are lower-cased when parsed, so compare like with like:
    # `repo:w0rxbend/freecad-projects` and the real `w0rxbend/FreeCAD-Projects`
    # are the same repository.
    cards = {p["id"].lower() for p in source["projects"]}
    unknown = [r for r in rules if r.selector == "repo" and r.value not in cards]
    if unknown:
        die(
            "these rules name a repository with no card in data/catalog.json:\n  "
            + "\n  ".join(f"{os.path.basename(CONFIG)}:{r.lineno}: {r.text}" for r in unknown)
            + "\n\nCheck the spelling, or run `python3 tools/build-catalog.py --fetch` to add a stub card."
        )

    projects, decisions = select(rules, source)

    if args.explain:
        explain(rules, source, projects, decisions)
        return 0

    catalog = build(projects, source)
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
                + " out of date with catalog-rules.txt and data/catalog.json.\n"
                "Run `python3 tools/build-catalog.py` and commit the result."
            )
        print(f"build-catalog: everything is up to date ({len(projects)} repositories shown)")
        return 0

    with open(OUTPUT, "w", encoding="utf-8") as fh:
        fh.write(rendered)
    with open(PAGE, "w", encoding="utf-8") as fh:
        fh.write(page)
    print(f"build-catalog: wrote assets/data/catalog.js and index.html — {len(projects)} of "
          f"{len(source['projects'])} catalogued repositories are shown")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
