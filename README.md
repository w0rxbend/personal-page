# personal-page

The source of my personal site: a résumé and a browsable catalogue of the
public repositories I maintain across three GitHub accounts.

**Live:** <https://w0rxbend.github.io/personal-page/>

It is one HTML file, one stylesheet, and about a dozen small JavaScript files.
There is no framework, no bundler and no package manager, and nothing is
compiled or minified — the code in this repository is the code the browser
runs. One file is generated: `assets/data/catalog.js`, the project data, which
a small Python script builds from a plain file of selection rules. See
[Regenerating the project catalogue](#regenerating-the-project-catalogue).

---

## What the site contains

| Section | What is in it |
| --- | --- |
| **Hero** | Name, current focus, and headline numbers from nine years of backend work |
| **Projects** | The repositories `catalog-rules.txt` selects, grouped into six domains, with client-side search |
| **Experience** | Employment history — LotusFlare, EPAM, Unicorn, OmnieSoft |
| **Skills** | Languages, data and messaging, infrastructure, weighted by years of production use |
| **Profiles** | The three GitHub accounts and what lives on each |
| **Education** | M.Sc. and B.Sc., Khmelnitsky National University |
| **Contact** | Email, phone, Telegram, GitHub |

### The project catalogue

The six domains, and what each collects (the live counts are on the page
itself, next to each heading):

- **Streaming & Broadcast** — control surfaces for OBS Studio (the
  open-source live-streaming program), terminal chat clients for Twitch and
  YouTube, and browser-source overlays.
- **IoT, Sensors & Embedded** — AirGradient air-quality monitoring across
  five client platforms, ESP32 camera firmware with a hand-rolled binary TCP
  protocol and the Go server that receives it, and assorted microcontroller
  hardware.
- **Linux Tooling & Workstation** — declarative provisioning: one YAML
  profile, a dry-run plan you read before anything happens, and the same
  machine on every box.
- **Scala, JVM & Libraries** — typed API clients, a Scala 3 binding for
  OpenCV, a terminal-UI toolkit, and the Mill monorepo the smaller libraries
  are cut from.
- **Web, Dashboards & Apps** — desktop and browser front-ends for the
  hardware and services above, plus the odd standalone application.
- **Language Labs & Ports** — whole libraries rewritten into an unfamiliar
  language to find out what that language forces you to do differently, with
  the output checked against the original bit for bit.

---

## Running it locally

Any static file server will do. The site never calls a backend, so there is
nothing else to start.

```bash
git clone https://github.com/w0rxbend/personal-page.git
cd personal-page
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem mostly works, but browsers
apply stricter rules to `file://` pages: `history.replaceState` is refused, so
the address bar will not track your search. Use a server if that matters.

---

## How it is put together

```
index.html                  markup and the mount points the scripts fill
favicon.svg
netlify.toml                headers and cache policy for the Netlify deploy
.nojekyll                   opt out of Jekyll on GitHub Pages
catalog-rules.txt           rules deciding which repositories the site shows
data/
  catalog.json              the written content for every catalogued repository
tools/
  build-catalog.py          builds assets/data/catalog.js from those two files
.github/workflows/
  deploy-pages.yml          publishes the repository to GitHub Pages on push
assets/
  styles.css                design tokens, six themes, every component
  app.js                    wiring: render, search, palette, settings, telemetry
  search.js                 the search engine — inverted index, no dependencies
  telemetry.js              local-only analytics on IndexedDB
  data/
    catalog.js              generated: the project entries the page renders
    profile.js              résumé, skills, education, accounts
  fx/
    engine.js               background effect manager — tiers, palette, lifecycle
    network.js              particle mesh, Canvas2D
    stars.js                starfield and orbital mechanism, three.js
    glyphs.js               falling glyph rain, PixiJS
  vendor/
    three.min.js            three.js r160.1, loaded on demand
    pixi.min.js             PixiJS 8.19.0, loaded on demand
```

### Search

`assets/search.js` builds an inverted index over the catalogue when the page
loads — a map from each word to the entries containing it, so a lookup costs
time proportional to the number of matches rather than the size of the
catalogue. On top of that:

- **Field weighting.** A word found in a project's title counts for ten times
  as much as the same word buried in a summary paragraph, so results are
  ordered by something meaningful rather than by chance.
- **Prefix matching.** Typing `kub` finds `kubernetes`. Indexed words are kept
  in one sorted array and the matching range is found by binary search.
- **Typo tolerance.** For words of four characters or more, if nothing matches
  the search retries allowing a single edit — including swapping two adjacent
  letters, which is the most common typing mistake. `kafak` finds `kafka`.
- **Field queries.** `lang:rust`, `owner:worxbend`, `tier:flagship`,
  `cat:iot`, `tag:esp32`.
- **Maturity weighting.** A released, documented project outranks a
  one-commit stub when both mention the same word.

Search state lives in the address bar, so a filtered view can be linked and
survives a reload: [`?q=esp32`](https://w0rxbend.github.io/personal-page/?q=esp32),
[`?cat=iot&tier=flagship`](https://w0rxbend.github.io/personal-page/?cat=iot&tier=flagship).

Press <kbd>/</kbd> to jump to the search box, or <kbd>Ctrl</kbd>+<kbd>K</kbd>
for the command menu, which also switches themes and jumps between sections.

### Themes

Six themes: **Prime Radiant** (the default), **Matrix**, **Blueprint**,
**Solar**, **Nebula**, and **Observatory** (light). Your choice is written to
`localStorage` and reapplied before the first paint by a small inline script,
so a chosen theme never flashes the default one first.

Each theme is a block of CSS custom properties. Alongside the usual colours it
defines an `--fx-*` group — node colour, link colour, three accents, alpha
values, a star hue — which the background engines read off the root element
with `getComputedStyle`. **Adding a theme therefore needs no JavaScript
change**: define the variables, add one entry to the `THEMES` array in
`app.js` for the settings-panel swatch, and the animated background follows
automatically.

### Background effects

`assets/fx/engine.js` is a small coordinator. It owns what the visual layers
share — the palette, the cursor, the viewport, the device-pixel ratio — and
each layer is an independent module that registers itself:

```js
WBFX.register("stars", function (canvas, ctx) {
  return { resize() {}, theme(palette) {}, pause() {}, resume() {}, destroy() {} };
});
```

A single dial, the **tier**, decides which layers exist:

| Tier | Layers | Cost |
| --- | --- | --- |
| `low` | none — the CSS grid and vignette still render | nothing |
| `medium` | particle mesh on a 2D canvas | modest |
| `high` | starfield and orbital mechanism (three.js), particle mesh, glyph rain (PixiJS) | two WebGL contexts |

The tier is chosen from CPU cores, device memory, pointer type, the Save-Data
header and the reduce-motion preference, and can be overridden in the settings
panel. **three.js and PixiJS are fetched only when a tier needs them**, so a
default visit on a phone downloads neither.

The particle mesh keeps its cost down in two specific ways: nothing allocates
inside the frame loop — every buffer is a typed array sized once at startup —
and neighbour search uses a uniform grid with a counting sort rather than
comparing every node against every other. Line drawing is batched into six
brightness bands, so a frame is six stroke calls instead of several hundred.

Everything pauses when the tab is hidden.

### Local analytics

`assets/telemetry.js` records page views, searches, filter changes, opened
projects and theme switches into an IndexedDB database.

**Nothing is transmitted.** There is no endpoint, no `fetch`, no `sendBeacon`,
no tracking pixel and no third-party script. The data exists only in the
visitor's own browser profile, and the only ways it comes back out are the
"Export JSON" and "Clear" buttons in the settings panel. If this file ever
grows a network call, that is a bug.

It is a foundation rather than a demo: the event schema, session model, write
batching and pruning are real, and the missing transport is a deliberate
choice. It is enabled by default because the data stays local, and turns
itself off before recording anything if the browser sends a Do Not Track or
Global Privacy Control signal. Writes are batched and flushed on `pagehide`;
the store is capped at 5,000 events and pruned while the browser is idle.

### Accessibility and graceful degradation

- Entrance animations are an enhancement, never a prerequisite. Content is
  visible by default and only hidden while `[data-reveal="on"]` is set, which
  `app.js` applies alongside a failsafe timer. If the `IntersectionObserver`
  callback never arrives, the timer un-hides everything after 2.5 seconds
  rather than leaving a page of blank cards.
- The reduce-motion preference is honoured, and can be overridden in either
  direction. Both paths funnel through one `--motion` variable.
- Skip link, focus-visible outlines, `aria-pressed` on every toggle,
  labelled dialogs, and a print stylesheet that drops the chrome.
- Every value rendered from the catalogue is HTML-escaped before it reaches
  the page, including search-term highlighting.

---

## Regenerating the project catalogue

`assets/data/catalog.js` is generated, not hand-maintained. It is built by
`tools/build-catalog.py` from two files that *are* hand-maintained:

| File | What it decides |
| --- | --- |
| `catalog-rules.txt` | **which** repositories the site shows, as rules rather than a list — "everything written in Rust", "nothing marked as a lab" |
| `data/catalog.json` | **what each card says** — tagline, summary, highlights, stack, tier, category — for every repository ever catalogued, shown or not |

Nothing written is ever thrown away. A repository that drops out of the
selection keeps its card and returns the moment a rule picks it up again.

### The rules

A rule is two words — `include` or `exclude`, then a selector — and **the last
rule that matches a repository wins**. Broad strokes at the top, exceptions at
the bottom. A repository that no rule matches is not shown, so nothing is
published by accident.

```
exclude all                              # start from nothing
include tier:flagship                    # the documented, released work
include cat:iot                          # a whole domain
include lang:Rust                        # a whole language
exclude tier:lab                         # ...but no playgrounds or stubs
include repo:w0rxbend/FreeCAD-Projects   # ...except this one
```

Selectors are `all`, `repo:owner/name`, `owner:name`, `lang:X`, `cat:X`,
`tier:X`, `tag:X`, `topic:X` and `stack:X`, matched without regard to case.
The three tiers are the judgement recorded in `data/catalog.json` when a card
was written: **flagship** (documented, released, tested), **solid** (real and
working, less ceremony) and **lab** (a playground, a sandbox, a one-commit
stub).

```bash
# See what the rules do before committing anything: every catalogued
# repository, whether it is shown, and the rule that decided it
python3 tools/build-catalog.py --explain

# Rebuild after editing either input
python3 tools/build-catalog.py

# Verify the generated files are in step with their inputs — writes nothing,
# exits 1 if stale. This runs in CI before every deploy.
python3 tools/build-catalog.py --check

# Add a stub card for any repository the rules could select but which has
# none yet. Needs the GitHub CLI (`gh auth login`).
python3 tools/build-catalog.py --fetch

# As --fetch, and also re-read stars, language, topics and last-push date
# for the repositories that already have cards.
python3 tools/build-catalog.py --refresh
```

New repositories are found rather than remembered. The `discover <account>`
lines at the bottom of `catalog-rules.txt` tell `--fetch` which GitHub accounts
to ask about, so something pushed last week turns up as a stub card without
anyone having to notice it exists. Writing that stub's tagline, summary and
highlights is the only manual step — and the build **refuses** to emit a card
with either left empty, so a half-finished entry fails loudly instead of
shipping as a blank tile.

Every number the page states about itself is derived at build time and never
stored: the project count, the flagship count, the number of distinct
languages, the star total, the per-domain counts and the language breakdown.
The four places `index.html` prints the project count in plain text — the meta
description, the social-card description, the hero paragraph and the search
placeholder, all of which are read before any JavaScript runs — are rewritten
by the same build. This is what stops the page advertising "80 projects" above
a grid of 75.

Summaries and highlights are written against each repository's README, and for
repositories with little or no README, against the actual source tree.

**Where a repository turned out to be a one-commit stub, its entry says so and
carries no highlights.** That is deliberate. Padding a stub into sounding like
a finished product is the failure this catalogue is built to avoid, and seven
entries are honest about being minimal.

Editing a summary by hand is fine — that is where summaries live. Editing
`stars`, `lang`, `updated` or `topics` is not: `--refresh` overwrites all four
from the API.

---

## Deployment

Two targets, both publishing this repository verbatim:

- **GitHub Pages** — `.github/workflows/deploy-pages.yml`, on every push to
  `main`. It checks that every required file is present and non-empty before
  uploading, so a missing asset fails the run instead of publishing a broken
  page that reports success.

  This needs one manual step, once: in **Settings → Pages**, set
  **Build and deployment → Source** to **GitHub Actions**. Without it the
  deploy step fails with "Pages site not found".

- **Netlify** — `netlify.toml`, which sets security headers and cache policy.
  Vendored libraries are cached hard because they are version-pinned; HTML
  always revalidates.

### Refreshing the vendored libraries

```bash
curl -fsSL -o assets/vendor/three.min.js https://unpkg.com/three@0.160.1/build/three.min.js
curl -fsSL -o assets/vendor/pixi.min.js  https://unpkg.com/pixi.js@8.19.0/dist/pixi.min.js
```

three.js is pinned to r160.1 because it is the last release to ship a UMD
build that defines a `THREE` global. Later versions are ES modules only, which
would mean either a build step or rewriting the effect layers as modules.

---

## Browser support

Current Chrome, Firefox, Safari and Edge. The features it leans on —
`IntersectionObserver`, CSS custom properties, `color-mix()`, `URLSearchParams`,
IndexedDB — are all long-standing. Where something is missing the page degrades
rather than breaking: no `IntersectionObserver` means content appears without
animating, blocked `localStorage` means settings do not persist, and no WebGL
means the background falls back to the 2D canvas layer.

---

## Licence

The site code is mine to reuse from. The vendored libraries under
`assets/vendor/` keep their own licences — three.js and PixiJS are both MIT.
