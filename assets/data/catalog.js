/* ============================================================================
   Project catalog — generated data, not hand-maintained prose.

   Every entry is derived from the public GitHub repositories of the three
   accounts listed in the "profiles" section of the page. Stars, language and
   last-updated come straight from the GitHub REST API; the summaries and
   highlights were written against each repository's own README, and for
   repositories with little or no README, against the actual source tree.

   Where a repository turned out to be a one-commit stub, the entry says so
   and carries no highlights. That is deliberate: padding a stub into sounding
   like a product is the failure mode this catalog is built to avoid.

   Regenerate rather than edit — see README.md for the harvest step. Editing a
   summary here is fine; editing `stars` is not, since the next regeneration
   overwrites it.
   ========================================================================= */

window.WB_CATALOG = {
  "generatedAt": "2026-08-10",
  "totals": {
    "projects": 80,
    "flagship": 22,
    "languages": 16,
    "stars": 37
  },
  "categories": [
    {
      "key": "streaming",
      "label": "Streaming & Broadcast",
      "blurb": "Terminal and desktop control surfaces for OBS Studio, plus chat clients and browser-source overlays for Twitch and YouTube.",
      "count": 15
    },
    {
      "key": "iot",
      "label": "IoT, Sensors & Embedded",
      "blurb": "Air-quality monitoring across five client platforms, ESP32 camera firmware with its own binary TCP protocol and Go frame server, and assorted microcontroller hardware.",
      "count": 18
    },
    {
      "key": "linux",
      "label": "Linux Tooling & Workstation",
      "blurb": "Declarative workstation provisioning: one YAML profile, a dry-run plan you read first, and the same machine on every box.",
      "count": 10
    },
    {
      "key": "scala",
      "label": "Scala, JVM & Libraries",
      "blurb": "Typed API clients, an OpenCV binding, a terminal-UI toolkit, and the Mill monorepo the smaller libraries are cut from.",
      "count": 14
    },
    {
      "key": "web",
      "label": "Web, Dashboards & Apps",
      "blurb": "Front-end surfaces for the hardware and services above, plus a few standalone applications.",
      "count": 10
    },
    {
      "key": "labs",
      "label": "Language Labs & Ports",
      "blurb": "Learning by porting. Whole libraries rewritten into unfamiliar languages, and the scratch space where the rewriting happens.",
      "count": 13
    }
  ],
  "langs": [
    {
      "lang": "Scala",
      "count": 15,
      "color": "#c22d40"
    },
    {
      "lang": "Rust",
      "count": 9,
      "color": "#dea584"
    },
    {
      "lang": "C++",
      "count": 8,
      "color": "#f34b7d"
    },
    {
      "lang": "Go",
      "count": 8,
      "color": "#00ADD8"
    },
    {
      "lang": "Python",
      "count": 8,
      "color": "#3572A5"
    },
    {
      "lang": "TypeScript",
      "count": 8,
      "color": "#3178c6"
    },
    {
      "lang": "Crystal",
      "count": 3,
      "color": "#8f9fa8"
    },
    {
      "lang": "Java",
      "count": 3,
      "color": "#b07219"
    },
    {
      "lang": "JavaScript",
      "count": 3,
      "color": "#f1e05a"
    },
    {
      "lang": "Flix",
      "count": 2,
      "color": "#dc7d00"
    },
    {
      "lang": "Kotlin",
      "count": 2,
      "color": "#A97BFF"
    },
    {
      "lang": "Shell",
      "count": 2,
      "color": "#89e051"
    },
    {
      "lang": "C",
      "count": 1,
      "color": "#8a8a8a"
    },
    {
      "lang": "CSS",
      "count": 1,
      "color": "#8f6bbf"
    },
    {
      "lang": "Elixir",
      "count": 1,
      "color": "#a389b8"
    },
    {
      "lang": "Zig",
      "count": 1,
      "color": "#ec915c"
    }
  ],
  "projects": [
    {
      "id": "worxbend/scenedeck",
      "owner": "worxbend",
      "name": "scenedeck",
      "title": "SceneDeck",
      "tagline": "Linux desktop controller for OBS Studio: scenes, audio mixer, telemetry, scene graph",
      "summary": "SceneDeck is a desktop application for Linux that drives OBS Studio (the open-source live streaming and recording program) from outside it. It talks to OBS over obs-websocket, the remote-control protocol built into OBS, and offers scene switching, an audio mixer with live level meters, streaming and recording controls, and a live stats page. It is written in Rust with GTK4 and libadwaita, the toolkit behind modern GNOME desktop apps, and ships through the Snap Store alongside a product site.",
      "highlights": [
        "Audio cards mirror OBS mixer strips: per-channel meters, peak fall-off, 20-second peak hold",
        "Scene switching by keyboard: bare digits, modifier plus digit, or a vim-style leader key",
        "Local scene registry with roles, accent colours, drag ordering, and YAML export/import",
        "OBS password kept in the system Secret Service keyring instead of the config file"
      ],
      "tags": [
        "obs",
        "obs-websocket",
        "gtk4",
        "rust",
        "linux-desktop",
        "streaming",
        "audio-mixer"
      ],
      "stack": [
        "Rust",
        "GTK4",
        "libadwaita",
        "Tokio",
        "obs-websocket 5.x",
        "Snap"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 2,
      "updated": "2026-08-09",
      "topics": [
        "obs",
        "obs-control",
        "obs-studio",
        "obs-websocket"
      ],
      "url": "https://github.com/worxbend/scenedeck",
      "homepage": "https://snapcraft.io/scenedeck"
    },
    {
      "id": "worxbend/obsctl-rs",
      "owner": "worxbend",
      "name": "obsctl-rs",
      "title": "obsctl-rs",
      "tagline": "Keyboard-first terminal dashboard and scriptable CLI for OBS Studio in one Rust binary",
      "summary": "obsctl-rs controls OBS Studio from a terminal. A single Rust binary provides three things: a background daemon that owns the connection to OBS, a live TUI (text user interface) dashboard showing scenes, an audio matrix with decibel meters, profiles, telemetry and a log feed, and a command-line interface for scripting. The TUI and CLI are thin clients that talk to the daemon over a local Unix socket, so only one process ever holds the OBS WebSocket connection.",
      "highlights": [
        "Daemon-first design: one process owns the OBS connection, TUI and CLI are IPC clients",
        "Optimistic, debounced writes for volume, mute and scene switches so the UI never stalls",
        "Every action has a CLI command with a stable --json envelope and documented exit codes",
        "29 built-in themes with a btop-style live picker, down to a TTY-safe mono mode"
      ],
      "tags": [
        "obs",
        "obs-websocket",
        "tui",
        "ratatui",
        "rust",
        "cli",
        "daemon"
      ],
      "stack": [
        "Rust 2024",
        "Ratatui",
        "obs-websocket 5.x",
        "Unix domain sockets",
        "systemd user service"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [
        "obs",
        "obs-cli",
        "obs-client",
        "obs-control",
        "obs-studio",
        "ratatui",
        "ratatui-rs",
        "rust",
        "tui"
      ],
      "url": "https://github.com/worxbend/obsctl-rs",
      "homepage": ""
    },
    {
      "id": "worxbend/twi",
      "owner": "worxbend",
      "name": "twi",
      "title": "twi",
      "tagline": "Keyboard-first Twitch chat client for the terminal, with 57 themes and no browser tab",
      "summary": "twi reads and sends Twitch chat from a terminal window instead of a browser tab. It connects over Twitch's IRC chat interface, supports multiple channels, and is driven entirely from the keyboard. It is written in Go, ships a Dockerfile and a documentation site, and is careful with credentials: the project treats keeping the OAuth token (the secret that authorises the account) out of logs as a design requirement.",
      "highlights": [
        "A mock mode runs the full interface with no credentials and no network: `twi chat --mock`",
        "57 built-in themes, 24 of them authored for twi, previewed live with ctrl+t",
        "Three message layouts (grouped, inline, compact) swappable at runtime with ctrl+g",
        "OAuth tokens are redacted rather than printed, documented as a first-class concern"
      ],
      "tags": [
        "twitch",
        "twitch-chat",
        "irc",
        "tui",
        "go",
        "bubbletea",
        "cli"
      ],
      "stack": [
        "Go 1.26",
        "Bubble Tea / Charm",
        "Twitch IRC",
        "Docker"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 1,
      "updated": "2026-08-08",
      "topics": [
        "bubbletea",
        "charmbracelet",
        "chat-client",
        "cli-tool",
        "go",
        "golang",
        "irc",
        "terminal",
        "terminal-ui",
        "tui",
        "twitch",
        "twitch-api",
        "twitch-chat",
        "twitch-irc"
      ],
      "url": "https://github.com/worxbend/twi",
      "homepage": "https://worxbend.github.io/twi/"
    },
    {
      "id": "worxbend/yc",
      "owner": "worxbend",
      "name": "yc",
      "title": "yc",
      "tagline": "YouTube live chat in your terminal, paced to survive the daily API quota",
      "summary": "yc shows YouTube live chat in a terminal. The whole project is shaped around one constraint: the YouTube Data API v3 (Google's public interface for YouTube data) grants only 10,000 quota units per day, and polling chat at the cadence YouTube itself suggests burns through that in under three hours. yc meters every call it makes, stretches its own polling interval so the budget lasts until the daily reset, and shows the remaining estimate on screen. Written in Go, with a documentation site, CI and released binaries.",
      "highlights": [
        "A quota meter in the status bar shows the estimate and effective poll cadence every frame",
        "Poll interval is computed to make the remaining units last until the Pacific-time reset, with jitter",
        "Respects `pollingIntervalMillis` as an absolute floor it never polls beneath",
        "A mock mode runs the full interface with no credentials, no network and no quota spend"
      ],
      "tags": [
        "youtube",
        "live-chat",
        "tui",
        "go",
        "cli",
        "api-quota"
      ],
      "stack": [
        "Go 1.26",
        "YouTube Data API v3",
        "Docker"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-08-08",
      "topics": [],
      "url": "https://github.com/worxbend/yc",
      "homepage": "https://worxbend.github.io/yc/"
    },
    {
      "id": "worxbend/obs-stats",
      "owner": "worxbend",
      "name": "obs-stats",
      "title": "obs-stats",
      "tagline": "btop-style terminal dashboard showing which part of an OBS pipeline is dropping frames",
      "summary": "obs-stats is a live monitoring dashboard for OBS Studio that runs in a terminal, styled after btop (a popular system resource monitor). It reads OBS over obs-websocket 5.x and answers a question OBS's own stats dock does not: not merely that frames were dropped, but which stage lost them and when. It separates renderer, encoder and network losses, tracks them over time, and turns the result into a readable health verdict.",
      "highlights": [
        "Keeps three loss channels apart: GPU renderer skips, encoder skips, and network drops",
        "Derives a HEALTHY / STRAINED / DROPPING verdict from drop rate, congestion, frame budget and FPS",
        "Counters are measured per stream, not since OBS launched, so old numbers cannot mask new ones",
        "Six dashboards one keypress apart, plus 24 themes with a live picker and Esc to revert"
      ],
      "tags": [
        "obs",
        "obs-websocket",
        "monitoring",
        "dashboard",
        "tui",
        "ratatui",
        "rust"
      ],
      "stack": [
        "Rust 2024",
        "Ratatui",
        "obs-websocket 5.x",
        "Linux desktop notifications"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 1,
      "updated": "2026-08-04",
      "topics": [
        "dashboard",
        "monitoring",
        "obs",
        "obs-studio",
        "obs-websocket",
        "ratatui",
        "rust",
        "streaming",
        "terminal",
        "tui"
      ],
      "url": "https://github.com/worxbend/obs-stats",
      "homepage": "https://worxbend.github.io/obs-stats/"
    },
    {
      "id": "worxbend/multistream-manager",
      "owner": "worxbend",
      "name": "multistream-manager",
      "title": "multistream-manager",
      "tagline": "Set up a Twitch stream and a YouTube broadcast from one terminal form, then go live in OBS",
      "summary": "multistream-manager handles the paperwork of streaming to two platforms at once. From a single terminal form it prepares a Twitch stream and a YouTube broadcast, shows the ingest server address and masked stream key for each, and tells you when both are ready so you can press Start Streaming in OBS. Once live, it displays each platform's status side by side. It is written in Rust and ships tagged releases with continuous integration and a documentation site.",
      "highlights": [
        "Side-by-side Twitch and YouTube panels showing readiness, ingest URL and masked stream key",
        "Reuses an existing YouTube stream key rather than minting a new one each broadcast",
        "Live per-platform stats while streaming: viewers, followers, likes and uptime",
        "CI workflow, tagged releases, MIT licence and a minimum supported Rust version of 1.88"
      ],
      "tags": [
        "twitch",
        "youtube",
        "streaming",
        "tui",
        "rust",
        "rtmp"
      ],
      "stack": [
        "Rust",
        "terminal UI",
        "Twitch API",
        "YouTube Live API",
        "RTMP"
      ],
      "tier": "flagship",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [
        "obs",
        "rust",
        "streaming",
        "tui",
        "twitch",
        "youtube"
      ],
      "url": "https://github.com/worxbend/multistream-manager",
      "homepage": ""
    },
    {
      "id": "w0rxbend/obs-effects",
      "owner": "w0rxbend",
      "name": "obs-effects",
      "title": "obs-effects",
      "tagline": "GPU-accelerated PixiJS overlays and animated screens for OBS browser sources",
      "summary": "A collection of animated web pages meant to be added to OBS Studio as browser sources, which are scenes that render a URL on top of your stream. Every screen draws on a transparent background so it layers over the video. The set covers webcam frame borders, full-scene ambient backgrounds, and branding or transition screens, each at its own URL. Rendering uses PixiJS 8, a WebGL-based 2D graphics library, so the work happens on the GPU.",
      "highlights": [
        "Webcam border variants including wave distortion, hexagonal rings, dense hex grids and warped trapezoids",
        "Full-scene backgrounds: flocking boids, Delaunay-style triangulation, rain ripples, orbital simulation",
        "Every screen renders transparent so it can be stacked over existing stream layers",
        "Dev server with an index of all screens, plus a static `dist/` build any file server can host"
      ],
      "tags": [
        "obs",
        "obs-overlay",
        "pixijs",
        "webgl",
        "typescript",
        "browser-source"
      ],
      "stack": [
        "TypeScript",
        "PixiJS 8",
        "WebGL",
        "Node.js 18+",
        "npm"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [
        "obs",
        "obs-background",
        "obs-effects",
        "obs-overlay",
        "obs-overlays"
      ],
      "url": "https://github.com/w0rxbend/obs-effects",
      "homepage": "https://obs-effects.worxbend.com"
    },
    {
      "id": "w0rxbend/twitch-voxer",
      "owner": "w0rxbend",
      "name": "twitch-voxer",
      "title": "twitch-voxer",
      "tagline": "Self-hosted text-to-speech bot that reads Twitch chat into an OBS browser source",
      "summary": "twitch-voxer speaks Twitch chat aloud on stream. A Python service listens to chat through Twitch EventSub (Twitch's event delivery system), synthesises each message with the Supertonic text-to-speech engine, and pushes the resulting audio over WebSocket to a transparent page you add to OBS Studio as a browser source. It handles language detection, bot filtering and message clean-up before anything reaches the speech engine.",
      "highlights": [
        "Each Twitch username keeps the same randomly assigned voice across sessions, stored via pickledb",
        "Detects Ukrainian and English, expands abbreviations per language, and maps laughs to a TTS tag",
        "Audio files are deleted server-side as soon as the browser confirms playback finished",
        "A scheduler posts weighted random chat messages, reloaded from data/messages.json without a restart"
      ],
      "tags": [
        "twitch",
        "tts",
        "obs",
        "python",
        "websocket",
        "chatbot",
        "docker"
      ],
      "stack": [
        "Python 3.14",
        "uv",
        "TwitchIO",
        "Supertonic TTS",
        "ffmpeg",
        "WebSocket",
        "Docker"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 2,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/twitch-voxer",
      "homepage": ""
    },
    {
      "id": "worxbend/streaming-tools-site",
      "owner": "worxbend",
      "name": "streaming-tools-site",
      "title": "streaming-tools-site",
      "tagline": "Static landing page mapping how the worxbend streaming tools reach OBS, Twitch and YouTube",
      "summary": "This is the landing page at obs.worxbend.com. It draws an interactive map of the streaming toolchain: which tools (scenedeck, obsctl-rs, obsctl, obs-stats) reach a remote OBS through obs-websocket 5.x, and which (multistream-manager, twi, yc) talk to Twitch and YouTube directly without touching the streaming machine. It was implemented by hand from a Claude Design source file, translating that preview runtime's constructs into plain web equivalents.",
      "highlights": [
        "No framework, bundler or build step; PixiJS 8 is vendored as a script tag and loaded lazily",
        "All asset paths are relative, so the same files serve from a domain root or a project subpath",
        "Separate background engine handles particles, springs and energy renderers",
        "Deploys two ways: Netlify via netlify.toml, and GitHub Pages via a deploy workflow"
      ],
      "tags": [
        "landing-page",
        "static-site",
        "pixijs",
        "vanilla-js",
        "github-pages",
        "netlify"
      ],
      "stack": [
        "HTML",
        "CSS",
        "vanilla JavaScript",
        "PixiJS 8",
        "Netlify",
        "GitHub Pages"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "JavaScript",
      "langColor": "#f1e05a",
      "stars": 1,
      "updated": "2026-08-08",
      "topics": [],
      "url": "https://github.com/worxbend/streaming-tools-site",
      "homepage": "obs.worxbend.com"
    },
    {
      "id": "worxbend/obsctl",
      "owner": "worxbend",
      "name": "obsctl",
      "title": "obsctl",
      "tagline": "Terminal dashboard, CLI and connection-keeping daemon for OBS Studio, written in Crystal",
      "summary": "obsctl puts OBS Studio in a terminal window. It combines a dashboard showing scenes, audio levels, profiles, collections, logs and stream health on one screen; a command-line interface for hotkeys, Stream Deck buttons and scripts; and a small daemon that holds the OBS connection open and reconnects when OBS restarts. It is written in Crystal, a compiled language with Ruby-like syntax, and installs as a static binary through a one-line script.",
      "highlights": [
        "One-line curl installer publishing static binaries that run on any Linux distribution",
        "Neovim/AstroNvim-shaped keys: ':' runs commands, 'Space' opens a which-key style menu",
        "A background daemon reconnects after OBS restarts so clients never storm the connection",
        "README screenshots are rendered from the real widget code by `make readme-shots`"
      ],
      "tags": [
        "obs",
        "obs-websocket",
        "tui",
        "cli",
        "crystal",
        "streaming"
      ],
      "stack": [
        "Crystal 1.21+",
        "obs-websocket 5.x",
        "static Linux binaries",
        "GitHub Pages installer"
      ],
      "tier": "flagship",
      "status": "Crystal implementation; a Rust version of the same idea lives in obsctl-rs",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Crystal",
      "langColor": "#8f9fa8",
      "stars": 2,
      "updated": "2026-08-07",
      "topics": [],
      "url": "https://github.com/worxbend/obsctl",
      "homepage": ""
    },
    {
      "id": "w0rxbend/chat-brawl",
      "owner": "w0rxbend",
      "name": "chat-brawl",
      "title": "ChatBrawl",
      "tagline": "Browser overlay that turns Twitch chat into a side-scrolling brawl, built for OBS",
      "summary": "ChatBrawl is a web overlay meant to be added to OBS (Open Broadcaster Software, the streaming tool) as a Browser Source. It connects to Twitch's chat over an anonymous IRC-over-WebSocket connection — the client logs in as a `justinfan` guest, so no OAuth token is needed — and turns each chatter into a fighter in an arena drawn with Pixi.js. The repository has no README, but the docs/ folder documents the mechanics, the internal message contracts, the OBS setup, and the URL parameters. It is a single-commit repository, so there is no visible development history to judge it by.",
      "highlights": [
        "Configuration is read entirely from URL query parameters — `channel`, `scale`, `mode` (brawl / rounds / duel), `joinMode`, `maxFighters`, `theme`, `locale`, `dev` — parsed and clamped in src/app/config.ts.",
        "The simulation core is deliberately isolated: docs/PROTOCOL.md states src/core must not import renderer, DOM, WebSocket, or Pixi code, and `npm run lint` runs scripts/check-boundaries.mjs to enforce that.",
        "Ships five test files under tests/ (core, IRC parser with a fixture corpus, persistence, assets, pixel text) run through Vitest, plus headless-browser smoke and soak scripts.",
        "The Twitch client reconnects on its own with exponential backoff capped at 60 seconds plus random jitter, and answers server PING with PONG (src/adapters/twitch/irc-client.ts)."
      ],
      "tags": [
        "twitch",
        "obs-overlay",
        "browser-game",
        "typescript",
        "game-loop"
      ],
      "stack": [
        "TypeScript",
        "Vite",
        "Pixi.js 8",
        "Vitest",
        "Node.js scripts",
        "Twitch IRC over WebSocket"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-07-05",
      "topics": [],
      "url": "https://github.com/w0rxbend/chat-brawl",
      "homepage": ""
    },
    {
      "id": "w0rxbend/twitch-vizer",
      "owner": "w0rxbend",
      "name": "twitch-vizer",
      "title": "twitch-vizer",
      "tagline": "Twitch chat and channel events rendered as themed OBS browser-source overlay scenes",
      "summary": "twitch-vizer turns Twitch activity into on-screen visuals. A Python backend subscribes to Twitch EventSub (Twitch's event delivery system) for chat and channel events, converts them into visual events, and broadcasts them over WebSocket. A TypeScript frontend renders themed scene pages that you add to OBS Studio as browser sources, covering chat messages with emotes and avatars plus follows, subscriptions, gift subs, cheers and raids.",
      "highlights": [
        "Nine overlay scene styles, including hacker-chat, mr-robot, silicon-valley, pixel-chat and fluid-chat",
        "Chat payloads carry text fragments, emote URLs, emoji images, avatars and stable per-user colors",
        "Optional local emote cache from a SQLite file or JSON dump, with a configurable path",
        "Docker image builds the frontend scenes and serves them from the Python backend at /scenes/"
      ],
      "tags": [
        "twitch",
        "obs",
        "overlay",
        "eventsub",
        "pixijs",
        "python",
        "typescript"
      ],
      "stack": [
        "Python 3.12",
        "TwitchIO",
        "Starlette",
        "uvicorn",
        "TypeScript",
        "Vite",
        "PixiJS",
        "Docker"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-06-21",
      "topics": [],
      "url": "https://github.com/w0rxbend/twitch-vizer",
      "homepage": ""
    },
    {
      "id": "w0rxbend/twitch-musicplayer",
      "owner": "w0rxbend",
      "name": "twitch-musicplayer",
      "title": "twitch-musicplayer",
      "tagline": "Backend-controlled lofi music player with a WebGL visualizer for stream scenes",
      "summary": "A two-part project for playing background music on stream. A Go backend indexes a folder of MP3 files, exposes resource-oriented HTTP endpoints, streams the audio efficiently, records playback history in SQLite, and coordinates what plays over a WebSocket protocol. The browser frontend holds no library of its own: it follows the backend's instructions, plays the supplied URLs through the browser's native audio element, and renders a visualizer with PixiJS on WebGL.",
      "highlights": [
        "Authority lives in the backend; the frontend is a follower driven by the WebSocket protocol",
        "Playback history is tracked in SQLite, with audio streamed rather than fully downloaded",
        "Visualizer runs on PixiJS/WebGL with a live tweaks panel toggled by pressing T",
        "Ten documents covering the API, WebSocket protocol, deployment, configuration and performance"
      ],
      "tags": [
        "music-player",
        "visualizer",
        "go",
        "websocket",
        "pixijs",
        "sqlite",
        "streaming"
      ],
      "stack": [
        "Go",
        "SQLite",
        "WebSocket",
        "TypeScript",
        "PixiJS",
        "WebGL"
      ],
      "tier": "solid",
      "status": "",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-06-07",
      "topics": [],
      "url": "https://github.com/w0rxbend/twitch-musicplayer",
      "homepage": ""
    },
    {
      "id": "w0rxbend/anime-cam",
      "owner": "w0rxbend",
      "name": "anime-cam",
      "title": "AnimeCam",
      "tagline": "Real-time anime-style webcam filter driven by the AnimeGANv3 Shinkai neural model",
      "summary": "AnimeCam restyles a live webcam feed to look hand-painted, using AnimeGANv3 Shinkai, a small neural network trained to imitate the look of Makoto Shinkai's animated films. The camera frame is scaled down, run through the model with ONNX Runtime (a cross-platform engine for running trained models), then scaled back up. Display and inference run on separate threads so the preview window stays smooth while the model works at its own slower pace.",
      "highlights": [
        "Display thread holds a steady 30 fps while the style updates independently at roughly 14 fps",
        "Model is 4.1 MB with dynamic spatial dimensions, so it accepts any input resolution",
        "Measured throughput at 256x144: about 8 fps on plain CPU, about 14 fps with the OpenVINO backend",
        "A BLEND_ALPHA knob mixes stylised output with the original feed, from full effect to none"
      ],
      "tags": [
        "webcam",
        "onnx",
        "openvino",
        "python",
        "computer-vision",
        "anime-style",
        "obs"
      ],
      "stack": [
        "Python",
        "ONNX Runtime",
        "OpenVINO",
        "OpenCV",
        "NumPy",
        "AnimeGANv3"
      ],
      "tier": "lab",
      "status": "experiment; feeding the stylised video into OBS via a virtual camera is still a TODO in the README",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 0,
      "updated": "2026-06-04",
      "topics": [],
      "url": "https://github.com/w0rxbend/anime-cam",
      "homepage": ""
    },
    {
      "id": "w0rxbend/obs-shaders",
      "owner": "w0rxbend",
      "name": "obs-shaders",
      "title": "obs-shaders",
      "tagline": "Custom HLSL-style shaders for the OBS ShaderFilter plugin",
      "summary": "A small collection of shader files for OBS ShaderFilter, a third-party OBS Studio plugin that applies custom GPU programs as a filter on any source. The shaders are written in the plugin's HLSL-style .effect format, and the repository defines a folder convention so each shader keeps its base version, its tweaked variants and its preview media together. One shader is published so far.",
      "highlights": [
        "lens-dirt: a procedural noise-based sensor dust and smudge overlay for a source",
        "Per-shader folder holds the base effect, named variants, a preview GIF and a demo video",
        "Large demo media is tracked with Git LFS, so `git lfs install` is needed before cloning",
        "Applied through the OBS filter panel, with the shader's uniforms exposed as adjustable controls"
      ],
      "tags": [
        "obs",
        "shaders",
        "hlsl",
        "obs-plugin",
        "video-effects",
        "git-lfs"
      ],
      "stack": [
        "HLSL .effect format",
        "OBS ShaderFilter plugin",
        "Git LFS"
      ],
      "tier": "lab",
      "status": "early collection; one shader published so far",
      "category": "streaming",
      "categoryLabel": "Streaming & Broadcast",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 0,
      "updated": "2026-06-03",
      "topics": [],
      "url": "https://github.com/w0rxbend/obs-shaders",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-cli",
      "owner": "worxbend",
      "name": "airgradient-cli",
      "title": "airgradient-cli",
      "tagline": "Rust command-line tool and live terminal dashboard for a LAN-local AirGradient air monitor",
      "summary": "AirGradient makes open-source indoor air-quality monitors that expose their readings over the local network. This Rust program queries such a device directly and prints the numbers, or renders them as a live TUI (text user interface) dashboard in the terminal. Nothing leaves the local network: there is no cloud account and no browser involved. It reads the same configuration file as the companion desktop app, so both point at the same device.",
      "highlights": [
        "One-line installer resolves the latest release, verifies its SHA256 checksum, installs to ~/.local/bin",
        "Installer version and target directory are overridable by flag or environment variable",
        "Tagged releases with prebuilt binaries for Linux amd64 and arm64, plus a project website",
        "Shares the airgradient-desktop config file rather than defining a second device setting"
      ],
      "tags": [
        "airgradient",
        "cli",
        "tui",
        "rust",
        "air-quality",
        "terminal"
      ],
      "stack": [
        "Rust",
        "Cargo",
        "GitHub Actions CI",
        "AirGradient local HTTP API"
      ],
      "tier": "flagship",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-08-02",
      "topics": [
        "airgradient",
        "cli",
        "rust",
        "tui",
        "tui-app"
      ],
      "url": "https://github.com/worxbend/airgradient-cli",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-papr",
      "owner": "worxbend",
      "name": "airgradient-papr",
      "title": "airgradient-papr",
      "tagline": "ESP32 e-paper firmware turning a LILYGO T5 4.7-inch board into an air-quality wall display",
      "summary": "Called \"airdeck\", this is standalone firmware for a LILYGO T5-4.7-inch ESP32 e-paper board (a low-cost Wi-Fi microcontroller wired to an electronic-paper screen). It reads an AirGradient ONE sensor entirely over the local network and renders the readings as a large, glare-free dashboard you can read from across the room. It also pulls outdoor weather and forecast data plus live currency and crypto rates onto extra pages.",
      "highlights": [
        "Drives an ED047TC1 960x540 16-gray e-paper panel through LVGL 9.2, a C user-interface library",
        "Talks to the AirGradient ONE over the LAN local API only - no cloud service, phone app, or subscription",
        "Additional pages cover outdoor weather, forecast and UV index, plus live FX and crypto quotes",
        "CI and Release GitHub Actions workflows, illustrated docs assets, and a 60-second video demo"
      ],
      "tags": [
        "esp32",
        "e-paper",
        "lvgl",
        "airgradient",
        "platformio",
        "firmware",
        "air-quality"
      ],
      "stack": [
        "C/C++",
        "ESP32-WROVER-E",
        "PlatformIO",
        "Arduino 2.0.x",
        "LVGL 9.2",
        "ED047TC1 e-paper panel"
      ],
      "tier": "flagship",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C",
      "langColor": "#8a8a8a",
      "stars": 0,
      "updated": "2026-07-26",
      "topics": [],
      "url": "https://github.com/worxbend/airgradient-papr",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-desktop",
      "owner": "worxbend",
      "name": "airgradient-desktop",
      "title": "airgradient-desktop",
      "tagline": "GTK 4 and libadwaita desktop dashboard for a local AirGradient air-quality monitor",
      "summary": "Presented as \"Air Monitor\", this is a Linux desktop application that puts the readings from an AirGradient ONE sensor on screen instead of on the sensor's own small display. It fetches the device's local endpoint on a timer, converts the JSON payload into a Rust data model, and renders a GNOME-style dashboard with colours and trend indicators. It supports desktop notifications, a background mode, and a tray icon.",
      "highlights": [
        "Fetches {server_url}/measures/current and normalizes the payload into an AirMeasureSnapshot model",
        "Shows AQI, temperature, humidity, CO2, TVOC, NOx and PM0.3 through PM10 with per-reading trend deltas",
        "Device URL is stored in the XDG config directory and reused by the CLI and GNOME extension",
        "Ten tagged releases, three UI screenshots, and a docs/ARCHITECTURE.md design walkthrough"
      ],
      "tags": [
        "airgradient",
        "gtk4",
        "libadwaita",
        "rust",
        "air-quality",
        "gnome",
        "linux-desktop"
      ],
      "stack": [
        "Rust",
        "GTK 4",
        "libadwaita",
        "GLib/GIO",
        "HTTP + JSON"
      ],
      "tier": "flagship",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-07-15",
      "topics": [
        "air-gradient",
        "air-quality",
        "air-quality-monitor",
        "airgradient",
        "dashboard",
        "gtk4",
        "libadwaita",
        "rust"
      ],
      "url": "https://github.com/worxbend/airgradient-desktop",
      "homepage": ""
    },
    {
      "id": "w0rxbend/echo",
      "owner": "w0rxbend",
      "name": "echo",
      "title": "echo",
      "tagline": "Go HTTP proxy that turns webhooks into animations on ESP8266 LED matrices",
      "summary": "A service that sits between webhook sources - home automation, monitoring alerts, CI pipelines - and one or more ESP8266-driven 8x8 LED matrices. You POST a JSON event over HTTP; configured rules decide which animation plays, and the proxy sends it down the firmware's binary TCP protocol. Each device keeps its own queue and idle background animation that the scheduler restores when nothing else is playing.",
      "highlights": [
        "8x8 pixel-art animations are authored in YAML, and 22 built-in firmware presets can be triggered by API",
        "Manages several matrices at once, each with an independent queue and idle background animation",
        "Prometheus metrics, Swagger UI at /docs, a /readyz probe, and TCP reconnect with exponential backoff",
        "Multi-arch Docker images for amd64, arm64 and arm/v7 published to ghcr.io, suited to a Raspberry Pi"
      ],
      "tags": [
        "go",
        "esp8266",
        "led-matrix",
        "webhooks",
        "docker",
        "prometheus",
        "home-automation"
      ],
      "stack": [
        "Go 1.23",
        "Docker / ghcr.io",
        "YAML config",
        "Prometheus",
        "Swagger UI",
        "raw TCP"
      ],
      "tier": "flagship",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-07-08",
      "topics": [],
      "url": "https://github.com/w0rxbend/echo",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-observability",
      "owner": "worxbend",
      "name": "airgradient-observability",
      "title": "airgradient-observability",
      "tagline": "Self-hosted pipeline scraping an AirGradient sensor into VictoriaMetrics and Grafana",
      "summary": "A full self-hosted monitoring stack for a single AirGradient ONE air-quality sensor. An agent on the local network scrapes the device's Prometheus metrics endpoint and ships the samples over HTTPS to a cloud virtual machine, where VictoriaMetrics (a time-series database) stores them and Grafana charts them. A small Go API sits alongside for programmatic access. The repository also carries a SolidStart frontend that the production documentation deliberately leaves out of scope.",
      "highlights": [
        "vmagent runs on a LAN edge host, buffers locally, and remote-writes over HTTPS with Basic Auth",
        "Only Caddy publishes ports 80 and 443; the database, Grafana and API stay on the private Docker network",
        "A mock-server module stands in for the real backend when VictoriaMetrics is not available locally",
        "Twelve docs pages cover architecture, configuration, deployment, day-2 runbooks, security and metrics"
      ],
      "tags": [
        "observability",
        "prometheus",
        "victoriametrics",
        "grafana",
        "go",
        "airgradient",
        "self-hosted"
      ],
      "stack": [
        "Go",
        "Gin",
        "VictoriaMetrics",
        "vmagent",
        "Grafana",
        "Caddy",
        "Docker Compose",
        "SolidStart"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-06-21",
      "topics": [],
      "url": "https://github.com/worxbend/airgradient-observability",
      "homepage": ""
    },
    {
      "id": "w0rxbend/spycam",
      "owner": "w0rxbend",
      "name": "spycam",
      "title": "spycam",
      "tagline": "ESP32-CAM firmware that streams JPEG frames to a TCP server over a compact binary protocol",
      "summary": "Firmware for an ESP32-CAM (a low-cost Wi-Fi microcontroller with an attached camera module) that captures JPEG images and pushes them to a server over a long-lived raw TCP connection. There is no HTTP, WebSocket, or text framing: each frame is a fixed 16-byte header followed by the image bytes. The README specifies the wire format precisely enough for someone to write a receiver from scratch.",
      "highlights": [
        "16-byte big-endian header: magic \"JPGS\", sequence number, payload length, and a millis() timestamp",
        "A single latest-frame slot means stale frames are dropped when the sender or network falls behind",
        "The sender task owns all network I/O and reconnects Wi-Fi and TCP forever with exponential backoff",
        "Wi-Fi, server address, frame size, JPEG quality and target FPS all live in include/AppConfig.h"
      ],
      "tags": [
        "esp32",
        "esp32-cam",
        "firmware",
        "tcp",
        "jpeg",
        "streaming",
        "platformio"
      ],
      "stack": [
        "C++",
        "Arduino framework",
        "ESP32-CAM",
        "PlatformIO",
        "raw TCP"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/spycam",
      "homepage": ""
    },
    {
      "id": "oleksandr-balyshyn/deskctl",
      "owner": "oleksandr-balyshyn",
      "name": "deskctl",
      "title": "deskctl",
      "tagline": "GTK4 and Relm4 desktop app for a standing desk, driving a mocked device link for now",
      "summary": "A native Linux desktop controller for a standing desk whose motor is driven by an ESP32 microcontroller. The application never talks to the ESP32 directly; it is designed to speak to a small proxy server that relays commands and streams desk state back. That link is currently mocked in source so the interface can be developed against a realistic animated desk while the proxy is being built.",
      "highlights": [
        "Hand-drawn cairo-rendered side view of the desk that raises and lowers smoothly in real time",
        "Hold-to-move raise/lower buttons, sit and stand presets, and routines scheduled by time and weekday",
        "src/device.rs is a MockDevice standing in for the planned proxy-server client",
        "Roadmap names the gaps: real WebSocket client, persisted settings, connection-loss retry"
      ],
      "tags": [
        "rust",
        "gtk4",
        "relm4",
        "libadwaita",
        "standing-desk",
        "esp32",
        "linux-desktop"
      ],
      "stack": [
        "Rust",
        "GTK4",
        "libadwaita",
        "Relm4",
        "Cairo"
      ],
      "tier": "solid",
      "status": "in progress",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-07-16",
      "topics": [],
      "url": "https://github.com/oleksandr-balyshyn/deskctl",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-gnome-extension",
      "owner": "worxbend",
      "name": "airgradient-gnome-extension",
      "title": "airgradient-gnome-extension",
      "tagline": "GNOME Shell panel extension that shows AirGradient air readings in the top bar",
      "summary": "A GNOME Shell extension (a JavaScript add-on that extends the GNOME desktop's own shell) for the same local AirGradient workflow as the desktop app. The top bar shows an icon only, coloured by the current air-quality status; clicking it opens a compact popup with gauges for AQI, CO2, particles, TVOC, NOx, temperature and humidity, plus a manual refresh. It reuses the desktop app's configuration file rather than keeping its own.",
      "highlights": [
        "Reads and writes the same config.json as airgradient-desktop, with a file watcher for live changes",
        "Preferences accept a bare host such as 192.168.1.201 and normalize it to a base URL",
        "Modules split by concern: sensor parsing, alert cooldown policy, presentation, HTTP adapter",
        "CI runs npm run check; a Release workflow packs the extension zip and attaches it to a release"
      ],
      "tags": [
        "gnome-shell",
        "gnome-extension",
        "airgradient",
        "gjs",
        "air-quality",
        "javascript"
      ],
      "stack": [
        "JavaScript",
        "GJS 1.88+",
        "GNOME Shell 50+",
        "libadwaita",
        "libsoup/Gio",
        "Node.js tooling"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "JavaScript",
      "langColor": "#f1e05a",
      "stars": 0,
      "updated": "2026-07-15",
      "topics": [
        "air-gradient",
        "air-quality-monitor",
        "airgradient",
        "gnome-extensions"
      ],
      "url": "https://github.com/worxbend/airgradient-gnome-extension",
      "homepage": ""
    },
    {
      "id": "worxbend/airgradient-android",
      "owner": "worxbend",
      "name": "airgradient-android",
      "title": "airgradient-android",
      "tagline": "Kotlin and Jetpack Compose Android app for a local AirGradient monitor with background alerts",
      "summary": "A native Android client for AirGradient-compatible devices on the local network, written in Kotlin with Jetpack Compose (Google's declarative Android UI toolkit). Beyond a pull-to-refresh dashboard, it can keep watching the sensor in the background and raise notifications when air quality crosses a chosen severity. The README states the codebase is being built out incrementally against a PLAN.md.",
      "highlights": [
        "Two opt-in monitoring modes: a foreground service at 30s-5min, and WorkManager checks at 15min-1h",
        "Notification engine persists cooldown, stale-data, and recovery state across app process restarts",
        "Cleartext HTTP is enabled deliberately so plain LAN addresses such as http://192.168.1.201 work",
        "CI runs test, lint, ktlint and detekt, then uploads debug instrumentation and release APKs"
      ],
      "tags": [
        "android",
        "kotlin",
        "jetpack-compose",
        "airgradient",
        "air-quality",
        "workmanager"
      ],
      "stack": [
        "Kotlin",
        "Jetpack Compose",
        "DataStore",
        "WorkManager",
        "Gradle",
        "ktlint",
        "detekt"
      ],
      "tier": "solid",
      "status": "in progress",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Kotlin",
      "langColor": "#A97BFF",
      "stars": 0,
      "updated": "2026-07-15",
      "topics": [
        "air-quality",
        "air-quality-monitor",
        "air-quality-sensor",
        "airgradient",
        "jetpack-compose",
        "kotlin-android"
      ],
      "url": "https://github.com/worxbend/airgradient-android",
      "homepage": ""
    },
    {
      "id": "w0rxbend/echoctl",
      "owner": "w0rxbend",
      "name": "echoctl",
      "title": "echoctl",
      "tagline": "Scala 3 command-line client for the echo LED matrix proxy, HTTP API only",
      "summary": "A terminal client for the echo service, written in Scala 3. It deliberately restricts itself to echo's HTTP API and never speaks the raw TCP firmware protocol, which keeps the boundary between the two projects clean. Commands cover health checks, device listing, animation playback, firmware effects, direct matrix control, and queue management.",
      "highlights": [
        "Commands span health, ready, devices, animations, play, preset, effect, notify, matrix, background, queue",
        "Configuration resolves flags > environment > ~/.config/echoctl/config.json > defaults, with named profiles",
        "Validates colour and duration inputs and carries a built-in table of firmware effect ids and names",
        "Unit tests cover colour and duration parsing, preset resolution, and config precedence"
      ],
      "tags": [
        "scala-3",
        "cli",
        "mill",
        "led-matrix",
        "graalvm",
        "http-client"
      ],
      "stack": [
        "Scala 3",
        "Mill",
        "GraalVM native-image",
        "picocli",
        "com.lihaoyi requests / upickle",
        "fansi"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-07-05",
      "topics": [],
      "url": "https://github.com/w0rxbend/echoctl",
      "homepage": ""
    },
    {
      "id": "w0rxbend/neoncore",
      "owner": "w0rxbend",
      "name": "neoncore",
      "title": "neoncore",
      "tagline": "ESP32 and WS2812B 4x4 matrix that mirrors AirGradient air-quality status as colour patterns",
      "summary": "A wireless secondary display for an AirGradient ONE air-quality monitor. The sensor stays wherever it measures best; this small 16-pixel LED panel, driven by an ESP32 microcontroller, sits wherever you actually look. A scraper reads the sensor's local API, maps the reading to a status, and pushes it to the device over Wi-Fi, which then shows a distinct colour and animation for that level.",
      "highlights": [
        "13 visual states, each a distinct combination of pattern, colour and animation, readable without a legend",
        "Falls back to a soft breathing standby animation after 60 seconds with no update from the scraper",
        "TCP protocol also accepts individual pixel writes, preset effects, and custom animation frames",
        "Opens its own access point when no Wi-Fi credentials are set; README documents parts and wiring"
      ],
      "tags": [
        "esp32",
        "ws2812b",
        "airgradient",
        "air-quality",
        "led-matrix",
        "firmware",
        "tcp"
      ],
      "stack": [
        "C++",
        "Arduino framework",
        "ESP32 DevKit v1 (WROOM32)",
        "WS2812B 4x4 matrix",
        "PlatformIO",
        "TCP over Wi-Fi"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2026-06-27",
      "topics": [],
      "url": "https://github.com/w0rxbend/neoncore",
      "homepage": ""
    },
    {
      "id": "w0rxbend/led-matrix-controller",
      "owner": "w0rxbend",
      "name": "led-matrix-controller",
      "title": "led-matrix-controller",
      "tagline": "ESP8266 firmware driving a WS2812B 8x8 LED matrix over a binary TCP protocol on port 7777",
      "summary": "Firmware that turns an ESP8266 NodeMCU (a small, inexpensive Wi-Fi microcontroller board) into a network-controlled driver for a 64-pixel addressable RGB LED panel. It joins Wi-Fi, prints its address, listens on TCP port 7777, and applies compact binary commands to the panel in real time. The README doubles as a hardware guide, with a wiring table and explicit power warnings.",
      "highlights": [
        "Falls back to hosting its own access point when Wi-Fi credentials are missing from include/creds.h",
        "Binary commands cover brightness, single pixels, solid fills, and whole 8x8 frames",
        "The panel can be switched off and back on without losing the image currently stored in memory",
        "Wiring section calls out the mandatory shared ground and warns against powering 64 LEDs from the board"
      ],
      "tags": [
        "esp8266",
        "ws2812b",
        "led-matrix",
        "firmware",
        "tcp",
        "platformio",
        "arduino"
      ],
      "stack": [
        "C++",
        "Arduino framework",
        "ESP8266 NodeMCU v2",
        "WS2812B / NeoPixel",
        "PlatformIO",
        "raw TCP"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2026-06-23",
      "topics": [
        "esp8266",
        "esp8266-arduino",
        "esp8266-projects",
        "led",
        "tcp-server",
        "ws2812b-8x8",
        "ws2812b-led"
      ],
      "url": "https://github.com/w0rxbend/led-matrix-controller",
      "homepage": ""
    },
    {
      "id": "w0rxbend/instachron",
      "owner": "w0rxbend",
      "name": "instachron",
      "title": "instachron",
      "tagline": "Go workspace of services that receive ESP32-CAM TCP frames and restream them over HTTP",
      "summary": "The server side of the spycam cameras: a Go workspace holding several independently deployable services. One accepts the raw TCP frame stream from the microcontrollers and republishes it on a Unix domain socket; others expose an HTTP API and web UI, proxy the stream with enhancement, upscaling, or object detection, record H.264 timelapses, and push to RTMP through ffmpeg.",
      "highlights": [
        "Eight service modules under services/: TCP receiver, web API, restream proxies, recorder, ffmpeg streamer",
        "Accepts the multi-camera \"JPGD\" protocol and still decodes legacy \"JPGS\" frames as camera id 0",
        "Validates JPEG start and end markers and rejects oversized payloads before publishing a frame",
        "Optional restream proxies add image enhancement, upscaling, and YOLOv8 object detection"
      ],
      "tags": [
        "go",
        "esp32-cam",
        "streaming",
        "tcp",
        "video",
        "microservices",
        "timelapse"
      ],
      "stack": [
        "Go",
        "Go workspaces",
        "raw TCP",
        "Unix domain sockets",
        "ffmpeg",
        "RTMP",
        "YOLOv8"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-05-29",
      "topics": [],
      "url": "https://github.com/w0rxbend/instachron",
      "homepage": ""
    },
    {
      "id": "w0rxbend/spycam-s3",
      "owner": "w0rxbend",
      "name": "spycam-s3",
      "title": "spycam-s3",
      "tagline": "ESP32-S3 camera firmware speaking the same binary JPEG-over-TCP protocol, with a camera id",
      "summary": "A sibling of spycam retargeted at ESP32-S3 camera boards, keeping the same capture-and-stream architecture. The frame header gains a 4-byte camera identifier so a single server can distinguish several cameras. Board-specific wiring is isolated in one header file, so adapting it to a different vendor layout means editing that file alone.",
      "highlights": [
        "Header magic changes to \"JPGD\" and carries a 4-byte camera id ahead of the JPEG payload",
        "Targets a GOOUUU ESP32-S3-CAM profile: 16 MB flash, 8 MB OPI PSRAM, documented OV2640 pin map",
        "Vendor differences are confined to include/CameraPins.h rather than spread through the source",
        "A justfile wraps the routine commands: just test, build, flash /dev/ttyACM0, monitor"
      ],
      "tags": [
        "esp32",
        "esp32-s3",
        "firmware",
        "tcp",
        "jpeg",
        "streaming",
        "platformio"
      ],
      "stack": [
        "C++",
        "Arduino framework",
        "ESP32-S3",
        "OV2640 camera",
        "PlatformIO",
        "just"
      ],
      "tier": "solid",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2026-05-26",
      "topics": [],
      "url": "https://github.com/w0rxbend/spycam-s3",
      "homepage": ""
    },
    {
      "id": "w0rxbend/FreeCAD-Projects",
      "owner": "w0rxbend",
      "name": "FreeCAD-Projects",
      "title": "FreeCAD Projects",
      "tagline": "Seven folders of FreeCAD design documents, three of them with printable exports",
      "summary": "This repository is a file store rather than a codebase: it holds FreeCAD design documents and their exported meshes for a handful of 3D-printing projects. FreeCAD is an open-source parametric CAD (computer-aided design) program, and its .FCStd files are the editable source documents. Seven top-level folders are present — ENTEL, ESP32-PrinterCamera, PDB-Cover, Raspberry-Pi-Zero-Webcam, Scratch, Tigerbee and Ubiquity-Holders — several of which pair the .FCStd file with an exports/ folder of .stl and .3mf files ready for a slicer. There is no README and no build or automation of any kind; everything arrived in a single commit on 10 June 2026.",
      "highlights": [
        "The Raspberry-Pi-Zero-Webcam and ENTEL folders are split into separately exported parts — case, rear lid, interim cover, fan mount, holder ring, top/middle/bottom plates — rather than a single printable body.",
        "The .gitignore is tailored to FreeCAD, excluding .FCBak and .FCStd1 backups and .FCStd.lock lock files so only the working documents are tracked.",
        "Tigerbee includes scanned reference images (refs/Scan_1.jpeg, refs/Scan_2.jpeg) alongside its CAD document."
      ],
      "tags": [
        "3d-printing",
        "cad",
        "freecad",
        "hardware",
        "enclosures"
      ],
      "stack": [
        "FreeCAD"
      ],
      "tier": "lab",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "",
      "langColor": "",
      "stars": 0,
      "updated": "2026-06-10",
      "topics": [],
      "url": "https://github.com/w0rxbend/FreeCAD-Projects",
      "homepage": ""
    },
    {
      "id": "w0rxbend/chillmate",
      "owner": "w0rxbend",
      "name": "chillmate",
      "title": "chillmate",
      "tagline": "One-day ESP32 scratch sketch that drives fans through an L298N motor driver",
      "summary": "This repository is minimal. It is a PlatformIO project for an ESP32 development board (nodemcu-32s) containing a single sketch of under 40 lines that sets four pins as outputs, writes a fixed HIGH/LOW pattern to them, and prints a small C-string formatting demonstration over the serial port. The commit message identifies the intent as controlling fans via an L298N motor driver board, and the pin comments are labelled IN1 to IN4, which are that board's input names. The README contains only the project title, and both commits were made within a few minutes of each other on 9 June 2024.",
      "highlights": [],
      "tags": [
        "esp32",
        "scratch",
        "motor-driver",
        "embedded"
      ],
      "stack": [
        "C++",
        "PlatformIO",
        "Arduino framework",
        "ESP32 (nodemcu-32s)"
      ],
      "tier": "lab",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2025-07-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/chillmate",
      "homepage": ""
    },
    {
      "id": "w0rxbend/macropad-greycode",
      "owner": "w0rxbend",
      "name": "macropad-greycode",
      "title": "Macropad (Greycode)",
      "tagline": "Work-in-progress firmware for a 3x3 macro keypad with rotary encoder and NeoPixel lighting",
      "summary": "This is firmware for a hand-built macro keypad, written against PlatformIO and the Arduino framework for an ATmega32U4 microcontroller (the chip in an Arduino Pro Micro board), which can present itself to a computer as a USB keyboard. The single source file scans a 3x3 key matrix and sends the characters 1 through 9 as keystrokes, tracks a KY-040 rotary encoder through a pin-change interrupt, and lights two 8-pixel NeoPixel addressable LED strands with fixed test colors. There is no README and the code is exploratory: a two-layer scheme is declared but never applied, and the OLED display libraries are included without any display being created. Six commits over two days in February 2025, the last one labelled a keyboard press/release test.",
      "highlights": [
        "platformio.ini targets board `32u416m` with the MCU forced to atmega32u4 at 16 MHz and overrides the USB vendor/product IDs to Arduino Leonardo values so the host recognises it as a keyboard.",
        "Row pins are commented as an open question — a note records that MOSI works as INPUT_PULLUP while D4, D6, D7 and A10 were tried first, and a TODO asks for the pinout to be documented.",
        "A `justfile` wraps the two commands actually used: `pio run` to build and `pio run --target upload` followed by the serial monitor to flash.",
        "extras/ carries an Arduino Pro Micro pinout diagram and a photo, checked in as build references."
      ],
      "tags": [
        "firmware",
        "macropad",
        "arduino",
        "usb-hid",
        "embedded"
      ],
      "stack": [
        "C++",
        "PlatformIO",
        "Arduino framework",
        "ATmega32U4",
        "Adafruit NeoPixel",
        "Keypad library",
        "Arduino Keyboard (USB HID)"
      ],
      "tier": "lab",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2025-02-23",
      "topics": [],
      "url": "https://github.com/w0rxbend/macropad-greycode",
      "homepage": ""
    },
    {
      "id": "w0rxbend/paranoid",
      "owner": "w0rxbend",
      "name": "paranoid",
      "title": "paranoid",
      "tagline": "STM32 Blue Pill scratch project: an LED blink sketch plus a clone-chip flashing workaround",
      "summary": "This repository is minimal and its purpose is not determinable from its contents — the name gives no clue and the README holds only the project title. What is actually there is a PlatformIO project targeting the STM32 \"Blue Pill\" board (bluepill_f103c8) with the Arduino framework, and a single sketch that blinks the on-board LED on pin PC13 in a fixed short-short-long pattern. The one detail with real substance is in the build configuration: a comment records that these boards often carry a CS32F103C8T6, a Chinese clone of the STM32F103C8T6, and the upload flags override the debugger's expected CPU TAP ID so an ST-Link programmer will accept the clone. Earlier commit messages mention initial tests on STM32 F401 and F407 targets, but the checked-in configuration targets only the F103.",
      "highlights": [],
      "tags": [
        "stm32",
        "blue-pill",
        "scratch",
        "embedded"
      ],
      "stack": [
        "C++",
        "PlatformIO",
        "Arduino framework",
        "STM32F103 (Blue Pill)",
        "ST-Link"
      ],
      "tier": "lab",
      "status": "",
      "category": "iot",
      "categoryLabel": "IoT, Sensors & Embedded",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2024-09-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/paranoid",
      "homepage": ""
    },
    {
      "id": "worxbend/fluxion.cr",
      "owner": "worxbend",
      "name": "fluxion.cr",
      "title": "fluxion.cr",
      "tagline": "Crystal rewrite of Fluxion: the same YAML workstation profiles, one compiled binary",
      "summary": "This is Fluxion reimplemented in Crystal, a compiled language with Ruby-like syntax. It keeps the same idea — describe the machine you want in YAML, preview it, then apply it — through three commands: validate, dry-run and apply. The preview and the real run are produced by the same code, so the plan you read is the plan that executes. Remote artifacts are pinned and checksum-verified before they run, and every privileged step is spelled out rather than assumed.",
      "highlights": [
        "validate / dry-run / apply, with preview and execution generated by the same code path",
        "Phases run in dependency order; a phase blocked by a failed dependency is reported, not skipped silently",
        "Packages install one process each, so a single bad package name cannot lose the rest of the list",
        "Install script resolves the latest release and checks its published SHA-256 before writing anything"
      ],
      "tags": [
        "linux",
        "bootstrap",
        "workstation",
        "crystal",
        "yaml",
        "provisioning",
        "tui",
        "dotfiles"
      ],
      "stack": [
        "Crystal 1.21",
        "Shards",
        "YAML",
        "GitHub Actions",
        "GitHub Pages"
      ],
      "tier": "flagship",
      "status": "Crystal reimplementation of the Java Fluxion",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Crystal",
      "langColor": "#8f9fa8",
      "stars": 0,
      "updated": "2026-08-08",
      "topics": [
        "bootstrap",
        "cli",
        "crystal",
        "dotfiles",
        "linux",
        "provisioning",
        "tui",
        "workstation"
      ],
      "url": "https://github.com/worxbend/fluxion.cr",
      "homepage": "https://worxbend.github.io/fluxion.cr/"
    },
    {
      "id": "worxbend/binstaller",
      "owner": "worxbend",
      "name": "binstaller",
      "title": "binstaller",
      "tagline": "Declarative installer for prebuilt command-line binaries, with lock files and checksum checks",
      "summary": "binstaller installs binary tool distributions — the standalone executables projects publish as release tarballs — from a single YAML profile, so every machine ends up with the same versions. It prints a dry-run plan you read before anything is written, verifies each download's SHA-256 checksum, and records the result in a lock file that pins exactly what was installed. Written in Scala 3 and compiled ahead of time with GraalVM native-image, so it runs as a plain executable with no Java runtime to install first.",
      "highlights": [
        "Dry-run plan, SHA-256 verification, and a lock file pinning exactly what got installed",
        "Install script checks the tarball checksum and a keyless Sigstore signature when cosign is present",
        "Native builds for Linux and macOS on both Intel/AMD (amd64) and ARM64",
        "Resumable applies, a documentation site, a wiki, and a written security model"
      ],
      "tags": [
        "installer",
        "cli",
        "binaries",
        "scala-3",
        "graalvm",
        "supply-chain-security",
        "yaml",
        "dotfiles"
      ],
      "stack": [
        "Scala 3.8",
        "Mill",
        "GraalVM native-image",
        "YAML",
        "Sigstore / cosign",
        "GitHub Actions"
      ],
      "tier": "flagship",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-01",
      "topics": [
        "binary-installer",
        "cli",
        "command-line-tool",
        "developer-tools",
        "devtools",
        "dotfiles",
        "graalvm",
        "installer",
        "mill",
        "native-image",
        "reproducible-builds",
        "scala",
        "scala3",
        "supply-chain-security",
        "yaml"
      ],
      "url": "https://github.com/worxbend/binstaller",
      "homepage": "https://worxbend.github.io/binstaller/"
    },
    {
      "id": "worxbend/nerd-fonts-installer",
      "owner": "worxbend",
      "name": "nerd-fonts-installer",
      "title": "nerd-fonts-installer",
      "tagline": "Go CLI and terminal picker that installs Nerd Fonts from a few lines of YAML",
      "summary": "Nerd Fonts are programming fonts patched to include extra icon glyphs, which tools like Starship, Neovim, tmux and lazygit rely on to draw their symbols. Installing one by hand means finding the release archive, unzipping it, fishing out the font files, moving them into a font directory and refreshing the font cache — then repeating for every font and every machine. This tool reduces that to a config file kept in your dotfiles and one command, with an interactive picker for when you would rather browse.",
      "highlights": [
        "Interactive terminal picker filters font families and updates the install plan as you tick them",
        "Checksum-verified downloads and a --dry-run pass before anything lands in a font directory",
        "Published on the Snap Store, plus release tarballs for Linux and macOS on amd64 and arm64",
        "Website, wiki and release automation back the project rather than a lone README"
      ],
      "tags": [
        "nerd-fonts",
        "go",
        "tui",
        "cli",
        "fonts",
        "dotfiles",
        "ricing",
        "yaml"
      ],
      "stack": [
        "Go 1.26",
        "Bubble Tea (Charm)",
        "YAML",
        "Snapcraft",
        "fontconfig",
        "GitHub Actions"
      ],
      "tier": "flagship",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-08-01",
      "topics": [
        "bubbletea",
        "charmbracelet",
        "cli",
        "command-line-tool",
        "developer-tools",
        "dotfiles",
        "font-installer",
        "fontconfig",
        "fonts",
        "fonts-management",
        "go",
        "golang",
        "linux",
        "macos",
        "nerd-fonts",
        "ricing",
        "terminal",
        "tui",
        "yaml-configuration"
      ],
      "url": "https://github.com/worxbend/nerd-fonts-installer",
      "homepage": "https://worxbend.github.io/nerd-fonts-installer/"
    },
    {
      "id": "worxbend/fluxion",
      "owner": "worxbend",
      "name": "fluxion",
      "title": "Fluxion",
      "tagline": "YAML-driven Linux workstation bootstrapper with dry-run previews, a CLI and a terminal UI",
      "summary": "Fluxion turns a fresh Linux install into a configured machine from one declarative YAML file. The profile lists the packages you want and which installer should handle each one — apt, dnf, pacman, zypper, Flatpak, direct binary downloads, shell installers, Nerd Fonts, dotfiles, or plain commands — plus which jobs depend on which, and where a restart or logout checkpoint belongs. It shows the plan first, then runs only the parts that make sense for the distribution it finds itself on. The goal is repeatable setup without a dotfiles repository turning into a pile of shell scripts.",
      "highlights": [
        "Two config frontends: a stable jobs/steps schema and an ordered WorkstationProfile manifest",
        "Distro-aware steps for Ubuntu, Debian, Fedora, Arch/EndeavourOS and openSUSE in one profile",
        "State files let an interrupted run resume and skip work that live probes show is already done",
        "Ships a native Linux binary from a GraalVM release workflow plus a curl-able install script"
      ],
      "tags": [
        "linux",
        "bootstrap",
        "workstation",
        "yaml",
        "java",
        "graalvm",
        "dotfiles",
        "tui"
      ],
      "stack": [
        "Java 25",
        "Mill",
        "GraalVM native-image",
        "YAML",
        "GitHub Actions",
        "GitHub Pages"
      ],
      "tier": "flagship",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Java",
      "langColor": "#b07219",
      "stars": 2,
      "updated": "2026-07-31",
      "topics": [],
      "url": "https://github.com/worxbend/fluxion",
      "homepage": "https://worxbend.github.io/fluxion/"
    },
    {
      "id": "w0rxbend/system-bootstrap",
      "owner": "w0rxbend",
      "name": "system-bootstrap",
      "title": "System Bootstrap",
      "tagline": "Multi-distro dotfiles and workstation bootstrap for Fedora, Arch Linux and openSUSE",
      "summary": "The personal automation repository behind the author's development machines, and the most-starred project in this group. It pulls package installation, prebuilt binary installs, Dotbot-managed dotfiles, Nerd Fonts, terminal and editor configuration, desktop environment setup, wallpapers and maintenance workflows into one place. The just command runner is the entry point: pick the recipe for your distribution, then run the shared configuration steps.",
      "highlights": [
        "Per-distro paths as just recipes: fedora-step-0..2, arch-install (Hyprland), opensuse-install (Sway)",
        "Dev toolchain covers Zsh, tmux, Neovim, Go, Rust, Java, Node, Python and Kubernetes tooling",
        "Desktop side spans GNOME, COSMIC, Sway, Waybar, Fuzzel and GDM/SDDM tweaks",
        "GitHub Actions auto-formats and lints the tree; just format and just lint run the same checks locally"
      ],
      "tags": [
        "dotfiles",
        "bash",
        "fedora",
        "arch-linux",
        "opensuse",
        "ricing",
        "just",
        "workstation"
      ],
      "stack": [
        "Shell",
        "just",
        "Dotbot",
        "Flatpak",
        "Nerd Fonts",
        "GitHub Actions"
      ],
      "tier": "solid",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Shell",
      "langColor": "#89e051",
      "stars": 4,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/system-bootstrap",
      "homepage": ""
    },
    {
      "id": "worxbend/dotbot-scala",
      "owner": "worxbend",
      "name": "dotbot-scala",
      "title": "dotbot-scala",
      "tagline": "Scala 3 port of the Dotbot dotfiles installer, shipped as a native Linux binary",
      "summary": "Dotbot is a well-known dotfiles bootstrapper: one config file describes the folders to create, the files to symlink into your home directory, the broken links to clean up, and the setup commands to run. This project reimplements Dotbot's built-in workflow in Scala 3 with typed parsing and a small command surface that is easy to script. It deliberately leaves out Dotbot's Python plugin system, and mirrors the same directive set as its sibling dotbot-go.",
      "highlights": [
        "Built-in directives defaults, clean, create, link and shell, matching upstream Dotbot",
        "Reads YAML, HOCON, JSON and TOML config, not only Dotbot's original YAML format",
        "plan mode gives a reviewable dry plan with JSON output; validate mode gates a CI check",
        "Ports-and-adapters structure with unit, property and golden tests; native amd64 and arm64 releases"
      ],
      "tags": [
        "dotfiles",
        "scala-3",
        "graalvm",
        "cli",
        "dotfiles-manager",
        "yaml"
      ],
      "stack": [
        "Scala 3.8.4",
        "Java 21",
        "Mill",
        "GraalVM native-image",
        "YAML / HOCON / JSON / TOML"
      ],
      "tier": "flagship",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-07-15",
      "topics": [
        "dotfiles",
        "dotfiles-automation",
        "dotfiles-installer",
        "dotfiles-linux",
        "dotfiles-manager"
      ],
      "url": "https://github.com/worxbend/dotbot-scala",
      "homepage": ""
    },
    {
      "id": "worxbend/dotbot-go",
      "owner": "worxbend",
      "name": "dotbot-go",
      "title": "dotbot-go",
      "tagline": "Go implementation of the Dotbot dotfiles workflow as one self-contained binary",
      "summary": "A Go rewrite of the core Dotbot workflow for installing dotfiles — configuration files such as .vimrc and .tmux.conf that people keep in a Git repository and want identical across machines. One config file states which folders to create, which files to symlink into the home directory, which stale symlinks to clean, and which setup commands to run. It keeps Dotbot's familiar config style while shipping as a single binary with no Python interpreter required.",
      "highlights": [
        "validate, plan (with JSON output) and --dry-run all run before anything touches the filesystem",
        "Install script pins a release via DOTBOT_VERSION and can add the install dir to bash and zsh PATH",
        "Builds with just build or a plain go build; the result is one binary with no runtime dependency",
        "README walks through each config directive in plain English rather than assuming Dotbot knowledge"
      ],
      "tags": [
        "dotfiles",
        "go",
        "cli",
        "dotfiles-manager",
        "yaml",
        "symlinks"
      ],
      "stack": [
        "Go",
        "YAML",
        "just",
        "GitHub Actions"
      ],
      "tier": "solid",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-07-15",
      "topics": [
        "dotfiles",
        "dotfiles-automation",
        "dotfiles-installer",
        "dotfiles-manager"
      ],
      "url": "https://github.com/worxbend/dotbot-go",
      "homepage": ""
    },
    {
      "id": "w0rxbend/infrastruct",
      "owner": "w0rxbend",
      "name": "infrastruct",
      "title": "Infrastruct",
      "tagline": "Infrastructure-as-code for a mixed ARM homelab running K3s, Docker Compose and Swarm",
      "summary": "Infrastruct is the source of truth for a self-hosted homelab built from Raspberry Pi, Rock64 and similar ARM boards. It holds the host inventory, Ansible automation for users, SSH, packages, firewall and health checks, K3s node lifecycle (K3s is a lightweight Kubernetes distribution), Docker Compose services on single hosts, Docker Swarm stacks across several, and the policy for where encrypted secrets live. The README describes much of the stack as planned rather than finished, so treat it as a repository under active construction.",
      "highlights": [
        "Seven Ansible roles: common, users, ssh, packages, firewall, monitoring_agent and inventory_assertions",
        "make validate runs YAML lint, Ansible syntax and lint, Compose/Swarm checks, SOPS policy and secret scanning",
        "make validate-local-contracts offers a cheap subset for machines without Ansible, SOPS or Docker",
        "Secrets use SOPS with age keys; the checked-in .sops.yaml still carries a dummy recipient by design"
      ],
      "tags": [
        "homelab",
        "ansible",
        "k3s",
        "gitops",
        "docker-swarm",
        "sops",
        "raspberry-pi",
        "iac"
      ],
      "stack": [
        "Ansible",
        "K3s",
        "Flux CD",
        "Helm",
        "Kustomize",
        "Docker Compose",
        "Docker Swarm",
        "SOPS + age"
      ],
      "tier": "solid",
      "status": "in progress",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 1,
      "updated": "2026-07-02",
      "topics": [],
      "url": "https://github.com/w0rxbend/infrastruct",
      "homepage": ""
    },
    {
      "id": "oleksandr-balyshyn/bootstrap-scripts",
      "owner": "oleksandr-balyshyn",
      "name": "bootstrap-scripts",
      "title": "Ubuntu Bootstrap",
      "tagline": "Terminal UI that turns Fedora bootstrap scripts into selectable Ubuntu modules",
      "summary": "A Go program with a TUI (text user interface, built on the Charm libraries) for provisioning one Ubuntu workstation. It takes the package intent from the author's system-bootstrap repository — which targets Fedora, Arch and openSUSE — and re-expresses it as Ubuntu modules driven by external YAML config files. You tick the modules you want, preview the plan, then run it; flags cover the same ground for scripted, non-interactive use.",
      "highlights": [
        "Modules declare depends_on in configs/modules.yaml, so cargo-packages pulls in language-installers",
        "Non-interactive flags --list, --validate, --dry-run, --all, --yes and --keep-going for scripted runs",
        "Maps Fedora package names to Ubuntu equivalents, such as fd to fd-find and wireshark-cli to tshark",
        "Dotfiles are a selectable module that installs Dotbot first, then applies a vendored dotfiles tree"
      ],
      "tags": [
        "ubuntu",
        "go",
        "tui",
        "charm",
        "bootstrap",
        "dotfiles",
        "yaml",
        "workstation"
      ],
      "stack": [
        "Go",
        "Charm TUI libraries",
        "YAML",
        "just",
        "Dotbot"
      ],
      "tier": "solid",
      "status": "personal; targets one Ubuntu machine",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 0,
      "updated": "2026-06-01",
      "topics": [],
      "url": "https://github.com/oleksandr-balyshyn/bootstrap-scripts",
      "homepage": ""
    },
    {
      "id": "w0rxbend/env-sphere",
      "owner": "w0rxbend",
      "name": "env-sphere",
      "title": "env-sphere",
      "tagline": "Docker images and compose stacks for Jenkins agents, dev containers, and self-hosted services",
      "summary": "A personal collection of container build files and deployment manifests, started in 2019 and still receiving commits in September 2024. It contains three Jenkins build-agent images (a base agent with variants for 64-bit ARM and for JDK 11, an agent that connects over JNLP — Java Network Launch Protocol — and an SSH agent with a Bats shell test suite), three VS Code dev-container images (an Alpine base, plus Elixir and Haskell layers that each add a project template), and Docker Compose or Swarm stack files for Traefik, NGINX, a streaming NGINX image, a Gitea git server backed by MySQL, and a private Docker registry. Nearly every compose file targets Docker Swarm rather than plain Compose, using `deploy:` blocks with replica counts and `node.role == manager` placement constraints. The README is a single 390-byte section covering only the JNLP agent image, so the rest of the repository is discoverable only by reading the directories.",
      "highlights": [
        "Images are published rather than only built locally: the READMEs give `docker buildx build --push` commands producing multi-architecture (linux/amd64 and linux/arm64) tags under worxbend/*-dev-container, and the top-level README points at limpidkzonix/jenkins-jnlp-slave on Docker Hub.",
        "Dependency and merge automation is wired in — renovate.json, .mergify.yml and .whitesource sit at the repository root, and the recent commit log is dominated by Renovate pull requests bumping base-image tags (Alpine 3.20.3, arm64v8/openjdk 11.0.16).",
        "The SSH agent image ships a test suite (jenkins-docker-ssh-slave/tests/tests.bats plus helper scripts), which is unusual for a scratch Dockerfile collection."
      ],
      "tags": [
        "docker",
        "devops",
        "jenkins",
        "dev-containers",
        "self-hosted",
        "docker-swarm"
      ],
      "stack": [
        "Docker",
        "Docker Compose",
        "Docker Swarm",
        "Alpine Linux",
        "Shell",
        "Jenkins",
        "Traefik v3.1",
        "NGINX",
        "Gitea",
        "MySQL 9",
        "Bats",
        "Renovate",
        "Mergify"
      ],
      "tier": "solid",
      "status": "",
      "category": "linux",
      "categoryLabel": "Linux Tooling & Workstation",
      "lang": "Shell",
      "langColor": "#89e051",
      "stars": 2,
      "updated": "2024-09-10",
      "topics": [],
      "url": "https://github.com/w0rxbend/env-sphere",
      "homepage": ""
    },
    {
      "id": "worxbend/gitea-scala-client",
      "owner": "worxbend",
      "name": "gitea-scala-client",
      "title": "gitea4s",
      "tagline": "Scala 3 client for the Gitea API, audited against the Gitea 1.26.2 OpenAPI contract",
      "summary": "A library that lets Scala programs talk to Gitea, a self-hosted Git service similar to GitHub. It is built on ZIO 2 (an effect system for Scala), sttp client4 for HTTP, and zio-json for parsing, and its typed endpoints are checked against the Gitea 1.26.2 OpenAPI specification that ships in the repository. Version 1.0.0 covers reading users, organizations, repositories, issues, releases, pull requests and notifications, plus a growing set of issue and pull-request writes.",
      "highlights": [
        "Four published modules: core, client, backend-zio (default) and an optional backend-okhttp bridge",
        "Distributed four ways: Maven Central, GitHub Packages, JitPack, and jars on GitHub Releases",
        "A release workflow runs on every v* tag and attaches jar, -sources and -javadoc artifacts",
        "Documentation site at worxbend.github.io/gitea-scala-client, with PLAN.md and CHANGELOG.md tracking surface"
      ],
      "tags": [
        "gitea",
        "api-client",
        "scala3",
        "zio",
        "sttp",
        "mill",
        "http-client"
      ],
      "stack": [
        "Scala 3",
        "ZIO 2",
        "sttp client4",
        "zio-json",
        "Mill",
        "Java 21",
        "OkHttp"
      ],
      "tier": "flagship",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [
        "api-client",
        "functional-programming",
        "gitea",
        "gitea-api",
        "http-client",
        "json",
        "mill",
        "rest-client",
        "scala",
        "scala3",
        "sttp",
        "zio"
      ],
      "url": "https://github.com/worxbend/gitea-scala-client",
      "homepage": "https://worxbend.github.io/gitea-scala-client/"
    },
    {
      "id": "w0rxbend/scalacv",
      "owner": "w0rxbend",
      "name": "scalacv",
      "title": "scalacv",
      "tagline": "Scala 3 API over OpenCV 4.13 — typed, headless, and explicit about native memory",
      "summary": "A high-level image toolkit that wraps OpenCV, the widely used open-source computer-vision library, in idiomatic Scala 3. It replaces OpenCV's raw integer constants with typed values, wraps native resources so they are released exactly once, and returns Either values for expected failures while reserving exceptions for genuine bugs. The full underlying org.opencv.* Java surface stays reachable, so the high-level pipeline never becomes a ceiling.",
      "highlights": [
        "Managed[A] releases native handles once and throws on use-after-release, before JNI turns it into a SIGSEGV",
        "Typed constants instead of magic numbers: ColorConversion.BgrToGray, not 6",
        "Optional layers: -vision (detectors, DNN, pose, OCR, calibration) and -graphs (Picture scene graph, charts)",
        "OpenCv.load() is headless — no GUI toolkit and no apt-get needed on a CI runner"
      ],
      "tags": [
        "opencv",
        "computer-vision",
        "scala3",
        "image-processing",
        "mill",
        "onnx"
      ],
      "stack": [
        "Scala 3.3 LTS",
        "OpenCV 4.13",
        "JDK 17+",
        "Mill",
        "ONNX Runtime",
        "Apache-2.0"
      ],
      "tier": "flagship",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 1,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/scalacv",
      "homepage": "w0rxbend.github.io/scalacv"
    },
    {
      "id": "oleksandr-balyshyn/glyphora",
      "owner": "oleksandr-balyshyn",
      "name": "glyphora",
      "title": "glyphora",
      "tagline": "Terminal UI library for Scala 3 with reactive signals, 50+ widgets and native-image support",
      "summary": "A library for building TUIs — text user interfaces, the kind of full-screen application that runs inside a terminal — written to feel like ordinary typed Scala rather than manual escape-code plumbing. State is expressed with Signal and Computed values; glyphora tracks which parts of the view depend on which values and redraws only what changed. It ships a broad widget set, first-class keyboard and mouse handling, composable motion, and headless tests so a terminal app can be verified in continuous integration.",
      "highlights": [
        "Signal/Computed dependency tracking drives redraws, so views describe state instead of repaint logic",
        "Over 50 widgets ship together: inputs, tables, trees, Markdown, charts, spinners, dialogs, menus, chrome",
        "Input handling covers focus order, bubbling key events, bracketed paste and mouse",
        "Zero reflection by design, which is what makes GraalVM native-image binaries buildable"
      ],
      "tags": [
        "tui",
        "terminal",
        "scala3",
        "ui",
        "library",
        "mill",
        "native-image"
      ],
      "stack": [
        "Scala 3.7",
        "JDK 21",
        "Mill",
        "GraalVM native-image"
      ],
      "tier": "flagship",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [
        "cli",
        "library",
        "scala",
        "terminal",
        "tui",
        "ui"
      ],
      "url": "https://github.com/oleksandr-balyshyn/glyphora",
      "homepage": "https://oleksandr-balyshyn.github.io/glyphora/"
    },
    {
      "id": "worxbend/playground",
      "owner": "worxbend",
      "name": "playground",
      "title": "playground",
      "tagline": "CloudEvents to Kafka to PostgreSQL event observatory with a server-rendered search UI",
      "summary": "Despite the name, this is a full three-service system whose product is the event log itself. It accepts CloudEvents 1.0 (a standard envelope format for event data) over HTTP, streams them through Apache Kafka, stores them verbatim in PostgreSQL, and serves a server-rendered web interface for searching and live-tailing them. The stated design reference is Grafana, Kibana or Home Assistant rather than a typical create-read-update-delete application.",
      "highlights": [
        "Three services on three different Scala 3 web stacks: Tapir/Vert.x, Pekko Streams + Cask, and Play 3",
        "Events stored verbatim as jsonb; query columns are GENERATED ALWAYS AS STORED so projections cannot drift",
        "Search is pure PostgreSQL — JSONB with GIN, BRIN on time, no second datastore to reindex",
        "One W3C trace context spans HTTP to Kafka to database; dead letters are inspectable and replayable"
      ],
      "tags": [
        "cloudevents",
        "kafka",
        "postgresql",
        "scala3",
        "tapir",
        "play-framework",
        "htmx",
        "observability"
      ],
      "stack": [
        "Scala 3.8",
        "sbt 2",
        "JDK 25",
        "Apache Kafka",
        "PostgreSQL",
        "Tapir on Vert.x 5",
        "Pekko Streams + Cask",
        "Play 3 + Twirl/htmx"
      ],
      "tier": "solid",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-07",
      "topics": [
        "micronautfw",
        "nodejs",
        "playframework",
        "scala",
        "spring",
        "vertx"
      ],
      "url": "https://github.com/worxbend/playground",
      "homepage": ""
    },
    {
      "id": "worxbend/codeberg4s",
      "owner": "worxbend",
      "name": "codeberg4s",
      "title": "codeberg4s",
      "tagline": "Scala 3 client covering 439 Forgejo REST API operations with a plain Future-based surface",
      "summary": "A client library for the Codeberg and Forgejo REST API (Forgejo is the Git hosting software Codeberg runs). Its public interface returns Scala's standard Future, so no effect system is imposed on callers or added to their classpath, and every operation is offered on two error rails: throw exceptions, or receive typed Either values. The README states that all 439 in-scope operations are implemented on both rails, covering the whole Forgejo v1 API apart from admin, activitypub and package endpoints.",
      "highlights": [
        "Owners, repo names, branches, labels and page sizes are validated types, so forged paths are rejected early",
        "No operation returns an unbounded List; every listing returns a Page[A] that reports whether more exists",
        "Dependency footprint is two libraries: sttp client4 and jsoniter-scala",
        "Jars target Java 25 (class-file version 69); README explains the UnsupportedClassVersionError this causes on 21"
      ],
      "tags": [
        "forgejo",
        "codeberg",
        "api-client",
        "scala3",
        "sttp",
        "mill"
      ],
      "stack": [
        "Scala 3",
        "sttp client4",
        "jsoniter-scala",
        "Mill",
        "Java 25"
      ],
      "tier": "solid",
      "status": "pre-release 0.1.0, not yet on Maven Central",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/worxbend/codeberg4s",
      "homepage": ""
    },
    {
      "id": "worxbend/worxbend",
      "owner": "worxbend",
      "name": "worxbend",
      "title": "worxbend",
      "tagline": "Personal Scala monorepo of small apps, libraries, infra recipes and notes, built with Mill",
      "summary": "A single repository where Oleksandr keeps his Scala and JVM (Java Virtual Machine) experiments together instead of scattering them across dozens of small repos. It holds small applications and services, reusable libraries shared between them, written notes, docker-compose stacks for a home lab, and Ansible playbooks for infrastructure automation. The README is explicit that none of it is meant as a product: it describes itself as a workshop rather than a showroom.",
      "highlights": [
        "Layout splits applications/, libs/, docs/, deployments/, .ansible/ and .cookiecutter/ templates",
        "Ships its own ./mill bootstrap script, so no separate build-tool install is needed",
        "JDK version pinned in .sdkmanrc so SDKMAN picks the right toolchain automatically",
        "Projects carry deliberately opaque codenames (Astrion, Calyx, Nebula, Umbra) instead of descriptive ones"
      ],
      "tags": [
        "scala",
        "monorepo",
        "mill",
        "homelab",
        "ansible",
        "docker-compose"
      ],
      "stack": [
        "Scala",
        "Mill",
        "Ansible",
        "Docker Compose",
        "just",
        "Cookiecutter",
        "SDKMAN"
      ],
      "tier": "solid",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 2,
      "updated": "2026-08-08",
      "topics": [
        "scala"
      ],
      "url": "https://github.com/worxbend/worxbend",
      "homepage": ""
    },
    {
      "id": "w0rxbend/codeberg4s",
      "owner": "w0rxbend",
      "name": "codeberg4s",
      "title": "codeberg4s",
      "tagline": "Tiered Scala 3 Forgejo client with separate transport, domain, error and tracing layers",
      "summary": "A second, independent codebase for talking to Forgejo's /api/v1 from Scala 3, organised as explicitly named tiers rather than one flat client. HTTP transport uses sttp's HttpClientFutureBackend, domain models are mapped from data transfer objects with quicklens, errors form a hierarchy split by cause (config, request, transport, http, api, codec, rate-limit), and every request carries a RequestTrace with operation, path, method, request id and latency logged through Izumi logstage. A FutureToEffect bridge keeps ZIO, Cats or Kyo wrappers thin.",
      "highlights": [
        "Rate limiting is its own error tier, carrying a RateLimitInfo built from the server's throttling headers",
        "Python audit scripts diff client and README endpoint coverage against Codeberg's live swagger.v1.json",
        "Maintainer audits check VERSION syntax, version pins, Mill wrapper sync and dependency coordinates offline",
        "Public API keeps source-compatible aliases matching Forgejo Swagger operationId names"
      ],
      "tags": [
        "forgejo",
        "codeberg",
        "api-client",
        "scala3",
        "mill",
        "sttp",
        "tracing"
      ],
      "stack": [
        "Scala 3.8.4",
        "Mill 1.1.7",
        "sttp",
        "quicklens",
        "Izumi logstage",
        "Python (audit scripts)"
      ],
      "tier": "solid",
      "status": "a second take on the same idea as worxbend/codeberg4s",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-07-17",
      "topics": [],
      "url": "https://github.com/w0rxbend/codeberg4s",
      "homepage": ""
    },
    {
      "id": "w0rxbend/ai-garbage",
      "owner": "w0rxbend",
      "name": "ai-garbage",
      "title": "ai-garbage",
      "tagline": "Scala examples of OOP fundamentals, SOLID and all 23 Gang-of-Four patterns, aimed at AI systems",
      "summary": "A teaching repository with two audiences. Humans read worked Scala examples of the four object-oriented programming (OOP) pillars, the five SOLID principles, and all twenty-three Gang-of-Four design patterns; AI coding agents load the same material as skills in the SKILL.md format used by Claude Code. Every example is framed around problems that appear in generative-AI systems — large language model (LLM) clients, content moderation, tool-using agents — with a multi-agent swing-trading pipeline as the capstone.",
      "highlights": [
        "Pattern catalog is complete: 5 creational, 7 structural and 11 behavioral examples, one Scala file each",
        "Skills cover oop-design, solid-principles, gof-patterns, refactoring and Scala 3 direct-style conventions",
        "Examples name their AI use case directly: RateLimitingProxy, LLMClientDecorators, EmbeddingCacheFlyweight",
        "Skills are activated in-repo through symlinks under .claude/skills/"
      ],
      "tags": [
        "design-patterns",
        "scala3",
        "solid",
        "oop",
        "agent-skills",
        "llm",
        "refactoring"
      ],
      "stack": [
        "Scala 3",
        "Markdown",
        "Claude Code agent skills"
      ],
      "tier": "solid",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-07-12",
      "topics": [],
      "url": "https://github.com/w0rxbend/ai-garbage",
      "homepage": ""
    },
    {
      "id": "w0rxbend/compression",
      "owner": "w0rxbend",
      "name": "compression",
      "title": "compression",
      "tagline": "Lichess chess-clock and move compression algorithms, migrated from Java to Scala",
      "summary": "A port of lichess.org's compression library, which shrinks stored chess games and clock histories. Only the language syntax was translated from Java to Scala; the README is upfront that the original design and paradigms were kept, so the result is deliberately not idiomatic Scala. The repository links the two lichess developer blog posts describing the clock-history format and the 275% game-compression improvement the algorithms achieved.",
      "highlights": [
        "Language-only migration: the README states the Java design and paradigms were preserved on purpose",
        "JMH benchmark suite runs via sbt 'benchmarks/jmh:run -i 5 -wi 3 -f1 -t1 org.lichess.compression.benchmark.*'",
        "Licensed AGPL-3.0-or-later, matching the upstream lichess-org/compression project"
      ],
      "tags": [
        "lichess",
        "chess",
        "compression",
        "scala",
        "jmh",
        "port"
      ],
      "stack": [
        "Scala",
        "sbt",
        "JMH (Java Microbenchmark Harness)",
        "AGPL-3.0"
      ],
      "tier": "lab",
      "status": "port of an upstream project, kept non-idiomatic by design",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/compression",
      "homepage": ""
    },
    {
      "id": "w0rxbend/data-engineering",
      "owner": "w0rxbend",
      "name": "data-engineering",
      "title": "Data Engineering Sandbox",
      "tagline": "Kafka, Kafka Connect and Apache Flink experiments with a Docker Compose lab environment",
      "summary": "A personal scratch workspace, described by its own repository description as \"Some random stuff with Kafka, KafkaConnect and Apache Flink\". It holds three loosely related pieces: an Apache Flink streaming job in Scala that reads a Kafka topic and writes files to S3-compatible storage, a copy of a third-party Kafka Connect partitioner written in Java, and a docker-compose environment that starts Kafka, Flink, MinIO and related tooling. The top-level README explains how to set up Java and Scala versions and how to start the environment; the Flink sub-project's own README file is empty. Most of the commit history is automated dependency-update merges.",
      "highlights": [
        "flink-kafka-s3sink-job reads a Kafka source (topic test_topic, broker kafka:29092) with event-time semantics, exactly-once checkpointing every 15 seconds and a RocksDB state backend, then writes through a StreamingFileSink; build.sbt sets the assembly main class to demo.flink.Main.",
        "kafka-connect-field-and-time-partitioner is a copy of third-party work: the Java package is com.canelmas.kafka.connect, it ships its own Apache License 2.0 file, and it builds with Maven against Confluent's kafka-connect-storage-partitioner 11.2.16.",
        "data-engineering-tools/docker-compose.yaml defines a 12-service local lab: ZooKeeper, Kafka, Schema Registry, a custom s3sink Connect image, MinIO, Flink jobmanager/taskmanager/client, AWS CLI, MinIO client, kafkactl and Redpanda Console.",
        "The README and the build file disagree on the Scala version: the README says the Flink project needs Scala 2.12.19, while build.sbt pins scalaVersion to 2.13.14."
      ],
      "tags": [
        "kafka",
        "flink",
        "stream-processing",
        "scala",
        "docker-compose"
      ],
      "stack": [
        "Scala 2.13.14",
        "sbt (with sbt-assembly)",
        "Apache Flink 1.20.0",
        "Apache Kafka clients 3.8.0",
        "circe",
        "Java 11 / Java 17 (via SDKMAN)",
        "Maven",
        "Docker Compose",
        "MinIO"
      ],
      "tier": "lab",
      "status": "Sandbox; 32 commits, last pushed 2026-08-07",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 2,
      "updated": "2025-09-27",
      "topics": [],
      "url": "https://github.com/w0rxbend/data-engineering",
      "homepage": ""
    },
    {
      "id": "w0rxbend/chronovault",
      "owner": "w0rxbend",
      "name": "chronovault",
      "title": "chronovault",
      "tagline": "Quarkus scaffold with two placeholder endpoints and a logging scheduler",
      "summary": "A Quarkus 3.13.3 project on Java 21, built with Gradle, created and last touched on the same day in September 2024. The whole of the application code is five small classes: a JAX-RS resource at /information exposing a `server` endpoint that returns a `ServerInfo` record filled with hardcoded literals (\"http://localhost\", \"1\", empty strings) and a `jvm` endpoint returning the fixed string \"Hello from Quarkus REST\"; a `Scheduler` bean that logs a line every 10 seconds; a `SimpleServerStatsService` whose only implementation returns null; and a Jackson ObjectMapper customizer whose body is a log statement and a comment. There is no configuration — src/main/resources/application.properties is a zero-byte file — and the single test asserts a GET on /hello, a path no resource in the repository defines. JAX-RS stands for Jakarta RESTful Web Services, the Java standard for HTTP endpoints; Quarkus is a Java framework that implements it.",
      "highlights": [],
      "tags": [
        "scaffold",
        "rest-api",
        "scheduler",
        "one-day-project"
      ],
      "stack": [
        "Java 21",
        "Quarkus 3.13.3",
        "Gradle",
        "Jakarta REST (RESTEasy Reactive)",
        "Mutiny",
        "Jackson",
        "JUnit 5",
        "REST Assured",
        "Docker"
      ],
      "tier": "lab",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Java",
      "langColor": "#b07219",
      "stars": 2,
      "updated": "2025-05-01",
      "topics": [],
      "url": "https://github.com/w0rxbend/chronovault",
      "homepage": ""
    },
    {
      "id": "w0rxbend/kzonix-opencv-app",
      "owner": "w0rxbend",
      "name": "kzonix-opencv-app",
      "title": "kzonix-opencv-app",
      "tagline": "Akka Streams webcam pipeline over JavaCV, alongside a large mostly unused cascade library",
      "summary": "A Scala experiment in wiring a webcam into Akka Streams, a library for processing data as a flow of elements with backpressure. The main runnable path is Main.scala: it opens a JavaCV `CanvasFrame` window, builds a 640x480 source from camera device 0, converts each frame to an OpenCV matrix, mirrors it horizontally, converts it back, and shows it in the window. The source itself is WebCam.scala, an actor that grabs frames only while there is downstream demand. Most of the rest of the tree is unfinished: FaceDetection, BodyDetection and HostDetectionResolver are empty objects and classes, and src/main/resources/detection holds 41 Haar, CUDA-Haar, LBP and HOG cascade XML files (faces, eyes, bodies, hands, licence plates) that no Scala code in the repository loads — the only cascade-loading code is a Java class, FaceDetecor.java, that Main never calls. A second Java entry point, CarDetection.java, is independently runnable and does background-subtraction contour detection in its own window. Haar/LBP/HOG cascades are pre-trained object-detection models that ship with OpenCV.",
      "highlights": [
        "The webcam source is a real backpressure-aware integration rather than a polling loop: WebCamFramePublisher only calls the blocking `grabber.grab()` while `totalDemand > 0`, and re-triggers itself with a private `Continue` message, so frames are pulled at the rate the downstream consumer can absorb them.",
        "There is a version mismatch worth knowing about before building: build.sbt was bumped by Renovate to Akka 2.6.20 and Scala 2.13.9 in October 2022, while the code still uses the older `akka.stream.actor.ActorPublisher` and `ActorMaterializer` APIs, so the repository as published is not self-evidently compilable."
      ],
      "tags": [
        "computer-vision",
        "akka-streams",
        "opencv",
        "webcam",
        "unfinished"
      ],
      "stack": [
        "Scala 2.13.9",
        "sbt",
        "Akka Actor / Akka Stream 2.6.20",
        "JavaCV",
        "JavaCPP presets (flandmark)",
        "OpenCV",
        "ImageJ",
        "ScalaTest",
        "JUnit"
      ],
      "tier": "lab",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 1,
      "updated": "2023-03-08",
      "topics": [],
      "url": "https://github.com/w0rxbend/kzonix-opencv-app",
      "homepage": ""
    },
    {
      "id": "w0rxbend/scala-concurrency",
      "owner": "w0rxbend",
      "name": "scala-concurrency",
      "title": "scala-concurrency",
      "tagline": "Producer/consumer exercise in Scala using a synchronized mailbox and wait/notify",
      "summary": "A textbook exercise, not a project: five files totalling a few kilobytes, written over two days in January 2019. The whole program lives in a 1.6 KB Main.scala that starts one producer thread and one consumer thread sharing a `Pipe` object holding a single message slot. The pipe guards that slot with a plain Java monitor — `synchronized`, `wait()` and `notifyAll()` — and a helper that waits until an `empty` flag flips. The producer sends four fixed strings with a five-second pause between each, then a \"Finish\" sentinel that stops the consumer loop. It is the Producer/Consumer problem from the \"Guarded Blocks\" lesson of the Java tutorial, transcribed into Scala using Java threads rather than any Scala concurrency library.",
      "highlights": [],
      "tags": [
        "learning-exercise",
        "concurrency",
        "producer-consumer",
        "scala"
      ],
      "stack": [
        "Scala 2.12.8",
        "sbt 1.2.8",
        "Java threads"
      ],
      "tier": "lab",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Scala",
      "langColor": "#c22d40",
      "stars": 1,
      "updated": "2023-03-08",
      "topics": [],
      "url": "https://github.com/w0rxbend/scala-concurrency",
      "homepage": ""
    },
    {
      "id": "w0rxbend/csv-reader-app",
      "owner": "w0rxbend",
      "name": "csv-reader-app",
      "title": "csv-reader-app",
      "tagline": "Guice-wired CLI that groups a bug-report CSV by label and writes a priority summary",
      "summary": "A single-commit Java command-line tool, written in one sitting in September 2018, that reads a bug-report CSV (comma-separated values) file, groups the rows by their Labels column, counts them into per-label priority buckets, and writes a summary CSV next to the input file. Everything is wired with Google Guice: AppModule binds the application entry point, the file finder, reader, parser, processor and writer, and Typesafe Config supplies the input directory, file names and separator from application.conf. The processor path is complete and handles the empty cases — a missing input file and an empty parse result each log a warning and return an empty map rather than throwing. The README documents exactly two things: `sbt clean universal:packageBin` to produce a runnable zip, and running `bin/csv-reader-app`.",
      "highlights": [
        "The build script is unusual for a Java project: it is sbt (a Scala build tool) driving sbt-native-packager, and the generated launch script includes an extra shell block that installs a JDK through SDKMAN if JAVA_HOME is unset before running the application.",
        "Tests exist and target the wiring rather than only the parsing: GuiceApplicationTest plus ApplicationTestModule, ConfigTestUtils and a custom log-capturing WarningsAppender/TestAppender pair.",
        "RxBus.java wraps an RxJava PublishSubject and is referenced nowhere. The zero-byte src/main/resources/limpid.conf is not dead weight though: ApplicationConfigLoader loads `<user.name>.conf` from the classpath when it exists, so it is a per-user override hook."
      ],
      "tags": [
        "cli",
        "csv",
        "dependency-injection",
        "java",
        "one-commit"
      ],
      "stack": [
        "Java",
        "Guice",
        "Typesafe Config (HOCON)",
        "univocity-parsers",
        "Lombok",
        "Guava",
        "SLF4J / Logback",
        "RxJava 2",
        "sbt with sbt-native-packager",
        "AssertJ",
        "JUnit",
        "Jukito"
      ],
      "tier": "lab",
      "status": "",
      "category": "scala",
      "categoryLabel": "Scala, JVM & Libraries",
      "lang": "Java",
      "langColor": "#b07219",
      "stars": 1,
      "updated": "2023-03-08",
      "topics": [],
      "url": "https://github.com/w0rxbend/csv-reader-app",
      "homepage": ""
    },
    {
      "id": "w0rxbend/Zephyr",
      "owner": "w0rxbend",
      "name": "Zephyr",
      "title": "Zephyr",
      "tagline": "Desktop GUI for SDKMAN that finds orphaned local-only JDK and SDK installs",
      "summary": "Zephyr is a desktop application for SDKMAN, the command-line tool that installs and switches between Java Development Kits (JDKs) and other software development kits. Over time SDKMAN accumulates \"local-only\" versions - builds still sitting in ~/.sdkman that the remote catalog no longer lists, because a vendor pulled them or renamed a provider. Finding those normally means running sdk list one candidate at a time and reading the output; Zephyr surfaces them across every installed candidate in one screen and makes cleanup explicit. It wraps the SDKMAN command-line tool rather than reimplementing package management.",
      "highlights": [
        "Version 1.0.0 ships AppImage, Snap, and Flatpak bundles for amd64 and arm64 with a SHA256SUMS file",
        "Screens are grouped into Workspace, Discover, and Maintenance, plus Diagnostics and a searchable operation history with CSV export",
        "Presents SDKMAN's internal \"candidate\" term as user-facing JDK and SDK labels while keeping the internal mapping intact",
        "Diagnostics can export a redacted support bundle, and settings include SDKMAN-path privacy controls"
      ],
      "tags": [
        "sdkman",
        "jvm",
        "desktop-app",
        "compose-desktop",
        "kotlin-multiplatform",
        "linux",
        "developer-tools"
      ],
      "stack": [
        "Kotlin Multiplatform",
        "Compose Desktop",
        "SDKMAN CLI",
        "AppImage",
        "Snap",
        "Flatpak"
      ],
      "tier": "flagship",
      "status": "",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "Kotlin",
      "langColor": "#A97BFF",
      "stars": 1,
      "updated": "2026-07-30",
      "topics": [],
      "url": "https://github.com/w0rxbend/Zephyr",
      "homepage": ""
    },
    {
      "id": "w0rxbend/codefolio",
      "owner": "w0rxbend",
      "name": "codefolio",
      "title": "Codeflio",
      "tagline": "Native GTK4 desktop dashboard for a GitHub profile, written in Rust with Relm4",
      "summary": "A Linux desktop application that shows the signed-in user's GitHub profile, contribution history, repositories, organizations and aggregate statistics. The code is real and substantial: eight UI components plus a GitHub GraphQL (a query language for APIs) client, an OAuth device-flow login, and SQLite caches, laid out in separate domain, ports, infrastructure and app layers. The repository name is codefolio but the crate, binary and application ID are all named codeflio. It carries continuous integration and a Flatpak (a Linux application packaging format) manifest, though the history is only two commits and no release has been tagged.",
      "highlights": [
        "Layered structure enforced in code: src/domain, src/ports, src/infrastructure and src/app are separate modules, and docs/architecture.md states that domain imports no GTK, HTTP or persistence crates.",
        "GitHub sign-in uses the OAuth device-authorization flow against github.com/login/device/code, requesting the scopes read:user, user:email and read:org; tokens are held in a zeroizing SecretToken type and stored via the Linux Secret Service.",
        "Local caching is implemented as five SQLite-backed caches under src/infrastructure/sqlite (repositories, profile, contributions, languages, activity).",
        "CI runs cargo fmt --check, clippy with -D warnings, test and build, and a second job builds the Flatpak bundle against the GNOME 50 runtime; a tag-triggered release workflow packages a tarball with SHA256 checksums."
      ],
      "tags": [
        "desktop",
        "gtk4",
        "rust",
        "github-api",
        "linux"
      ],
      "stack": [
        "Rust (edition 2024)",
        "Relm4",
        "GTK4",
        "libadwaita",
        "rusqlite (SQLite)",
        "reqwest",
        "tokio",
        "GitHub GraphQL API",
        "Linux Secret Service",
        "Flatpak",
        "GitHub Actions"
      ],
      "tier": "solid",
      "status": "Working code, 2 commits, last pushed 2026-07-24; no tagged release",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 0,
      "updated": "2026-07-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/codefolio",
      "homepage": ""
    },
    {
      "id": "w0rxbend/bounce-io",
      "owner": "w0rxbend",
      "name": "bounce-io",
      "title": "Bounce IO",
      "tagline": "Browser platformer where up to 8 players race upward through procedurally generated floating ruins",
      "summary": "Bounce IO is a competitive vertical racing game played in a web browser. Players pick a pixel-art character and climb procedurally generated floating islands, choosing between safe recovery lanes, fast central lines, and narrow routes guarded by collectible relics, while kicking rivals off ledges. A Go server runs the authoritative simulation - it holds the single true copy of the game state - and browser clients predict their own movement locally so play feels responsive over the network. There is a public test build linked from the README.",
      "highlights": [
        "Authoritative Go server with client-side prediction; 14 Go test files cover rooms, PvP and protocol compatibility",
        "World is built from seeded chunks with reachability checks, so every player climbs the same fair route",
        "Custom binary snapshot format and area-of-interest streaming keep per-tick network payloads small",
        "Checkpoint respawn returns a fallen player to their highest reached chunk instead of ending their run"
      ],
      "tags": [
        "game",
        "multiplayer",
        "websocket",
        "pixijs",
        "golang",
        "platformer",
        "procedural-generation"
      ],
      "stack": [
        "TypeScript",
        "PixiJS",
        "Vite",
        "Go",
        "WebSockets",
        "npm workspaces"
      ],
      "tier": "solid",
      "status": "",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 0,
      "updated": "2026-07-17",
      "topics": [],
      "url": "https://github.com/w0rxbend/bounce-io",
      "homepage": ""
    },
    {
      "id": "worxbend/tv-dashboard",
      "owner": "worxbend",
      "name": "tv-dashboard",
      "title": "Aurora TV Dashboard",
      "tagline": "Full-screen ambient home dashboard for a 1920x1080 TV, fed by a typed REST backend",
      "summary": "Aurora TV Dashboard is a wall-display dashboard meant to run full-screen on a television or a browser in kiosk mode. A SolidJS front end draws seven cards - clock and location, indoor air quality, weather and forecast, calendar agenda, a telemetry chart, indoor climate, and a status strip - and a Hono backend-for-frontend (a small server whose only job is to serve one specific user interface) fetches live data from Open-Meteo and a local AirGradient air-quality sensor. Each card refreshes on its own schedule, from once per second for the clock to every ten minutes for the forecast.",
      "highlights": [
        "Layout is design-fixed at 1920x1080 and scaled per axis with CSS transform, so it never reflows on other screens",
        "Backend describes itself with Zod and OpenAPI and ships a built-in Swagger UI at /api/docs",
        "Ships two Compose entry points: one building local images, one pulling prebuilt images from a registry",
        "Documents container-to-host addressing for reaching an AirGradient sensor from Docker or Podman"
      ],
      "tags": [
        "dashboard",
        "solidjs",
        "hono",
        "air-quality",
        "kiosk",
        "self-hosted",
        "docker"
      ],
      "stack": [
        "TypeScript",
        "SolidJS",
        "Vite",
        "Hono",
        "Zod",
        "OpenAPI/Swagger UI",
        "Docker Compose"
      ],
      "tier": "solid",
      "status": "",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 1,
      "updated": "2026-06-21",
      "topics": [],
      "url": "https://github.com/worxbend/tv-dashboard",
      "homepage": ""
    },
    {
      "id": "w0rxbend/saltmere",
      "owner": "w0rxbend",
      "name": "saltmere",
      "title": "Saltmere",
      "tagline": "Jekyll engineering journal: 244 articles across eight topic tracks, deployed to GitHub Pages",
      "summary": "A static publishing site built with Jekyll and deployed to GitHub Pages by a GitHub Actions workflow. The content is the bulk of the repository: 244 Markdown articles filed under eight topic tracks, with file dates running from 2026-07-24 to 2026-08-07. The custom code is small and readable — two layouts, one stylesheet, and an index page whose Liquid template lists the six newest articles and then groups everything by track. The README states that articles are researched and published automatically twice a day by a scheduled Claude task; that is the repository's own claim rather than something visible in the checked-in configuration.",
      "highlights": [
        "244 Markdown files under _articles/, split across distributed-systems (41), microservices (40), iot-embedded (32), linux-tools (30), sys-patterns (27), scala-jvm (25), observability (25) and cad-3dprint (24).",
        "Articles are a Jekyll collection with per-article front matter carrying title, date, track, summary, reading_time, tags and a list of sources with URLs, and _config.yml defaults every article to the article layout.",
        "Track names and blurbs live in a tracks list in _config.yml, and index.md reads that list to render the per-track sections, so adding a track is a configuration change rather than a template change.",
        ".github/workflows/jekyll.yml builds with bundle exec jekyll build and deploys via actions/upload-pages-artifact, with configure-pages enablement:true; the Pages API reports the site at https://w0rxbend.github.io/saltmere/."
      ],
      "tags": [
        "jekyll",
        "github-pages",
        "static-site",
        "technical-writing",
        "blog"
      ],
      "stack": [
        "Jekyll (github-pages gem)",
        "Ruby 3.1",
        "Liquid templates",
        "kramdown / Rouge",
        "jekyll-seo-tag",
        "jekyll-sitemap",
        "GitHub Actions",
        "GitHub Pages",
        "CSS"
      ],
      "tier": "solid",
      "status": "Live on GitHub Pages; 30 commits, last pushed 2026-08-07",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "CSS",
      "langColor": "#8f6bbf",
      "stars": 0,
      "updated": "2026-08-07",
      "topics": [],
      "url": "https://github.com/w0rxbend/saltmere",
      "homepage": ""
    },
    {
      "id": "worxbend/frostfire-backend",
      "owner": "worxbend",
      "name": "frostfire-backend",
      "title": "Frostfire Backend",
      "tagline": "FastAPI service that turns physical PC power-button presses into a guarded HTTP API",
      "summary": "Frostfire Backend is the server half of the Frostfire pair. It exposes an HTTP API for pressing a personal computer's physical power button, forwarding each request to an ESP32 microcontroller that closes a relay across the motherboard's power-button header. Because a mistaken call can cut power to a running machine, the service wraps every command in a safety policy: a token is required, commands are rate-limited by a minimum interval, a lock prevents overlapping presses, and the destructive long-press \"force off\" only executes when the request body explicitly confirms it.",
      "highlights": [
        "Code is split into API, application (PowerService, DeviceService, SafetyPolicy), domain, and infrastructure layers",
        "Force-off requires a {\"confirm\": true} body; short press and long press have separate configured durations",
        "Optional idempotency window, request-body size cap, and audit logging are all environment-configurable",
        "OpenAPI docs default to off for a stricter security posture; quality gates run ruff, mypy, pytest, and coverage"
      ],
      "tags": [
        "fastapi",
        "python",
        "asyncio",
        "home-lab",
        "esp32",
        "rest-api",
        "layered-architecture"
      ],
      "stack": [
        "Python 3.12+",
        "FastAPI",
        "asyncio",
        "uv",
        "pytest",
        "ruff",
        "mypy"
      ],
      "tier": "solid",
      "status": "",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 0,
      "updated": "2026-06-15",
      "topics": [],
      "url": "https://github.com/worxbend/frostfire-backend",
      "homepage": ""
    },
    {
      "id": "worxbend/frostfire",
      "owner": "worxbend",
      "name": "frostfire",
      "title": "Frostfire",
      "tagline": "ESP32 firmware that presses a PC power button through a relay, with bounded pulses and token auth",
      "summary": "Frostfire is firmware for the ESP32, a low-cost Wi-Fi microcontroller. Wired to a single-channel relay module whose contacts sit across a PC motherboard's power-button header, it lets you power a machine on or off over the network. The design is deliberately conservative about a circuit that can cut power to a running computer: the relay can only be pulsed for a bounded duration and then returns to off, it defaults to off during boot and restart, and every state-changing endpoint requires a bearer token. It is intended for trusted local networks only.",
      "highlights": [
        "Pulse duration is clamped by configurable minimum, default, and maximum values stored in ESP32 Preferences",
        "Serves a small built-in web page showing live status with a single \"Pulse PC Power Button\" action",
        "Over-the-air firmware update is a build-time opt-in requiring a password, and is off in the default build",
        "Ships wiring, API, and safety documents under docs/ plus a troubleshooting section for relay polarity mistakes"
      ],
      "tags": [
        "esp32",
        "firmware",
        "platformio",
        "relay",
        "home-lab",
        "rest-api",
        "embedded"
      ],
      "stack": [
        "C++",
        "PlatformIO",
        "ESP32",
        "ESP32 Preferences",
        "HTTP REST API",
        "Arduino OTA"
      ],
      "tier": "solid",
      "status": "",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "C++",
      "langColor": "#f34b7d",
      "stars": 0,
      "updated": "2026-06-15",
      "topics": [],
      "url": "https://github.com/worxbend/frostfire",
      "homepage": ""
    },
    {
      "id": "w0rxbend/dosecord",
      "owner": "w0rxbend",
      "name": "dosecord",
      "title": "Dosecord",
      "tagline": "Discord wellbeing-tracking bot split into two Python services that talk over Kafka",
      "summary": "An early-stage Discord bot for tracking mood, medication and habits, structured as a monorepo with a Discord-facing service and a backend service that exchange messages through Kafka. The interesting part is the messaging design: a CloudEvents-style envelope carries platform-neutral commands, the backend deduplicates them and writes replies through a transactional outbox table that a separate worker publishes back to Kafka. It is genuinely early — the whole history is three commits made on a single day, there is one test file and no continuous integration, and the medication-taken handler carries a code comment saying occurrence matching is deferred.",
      "highlights": [
        "shared/contracts/envelope.py defines a CloudEvents-style MessageEnvelope (specversion, id, type, source, time, correlation_id, causation_id, idempotency_key, actor, typed data payload) that both services use, keeping the message format independent of Discord.",
        "The backend uses the transactional outbox pattern: command handlers write outbox_messages rows in the same database transaction, and a standalone worker (workers/outbox_publisher.py) polls pending rows in batches and publishes them to Kafka.",
        "The Discord service implements eight command handlers — start, signup, mood, medicine, schedule, habit, stats and help — and the backend routes them through a CommandProcessor with an explicit duplicate check against a processed_messages table.",
        "The SQLAlchemy schema covers 13 tables including users, platform_identities, conversation_sessions, mood_checkins, medications, medication_schedules, medication_occurrences, habits and reminders; the reminders table is modelled but the workers directory contains only database initialisation and the outbox publisher, so no reminder-dispatch worker is present."
      ],
      "tags": [
        "discord-bot",
        "kafka",
        "python",
        "event-driven",
        "wellbeing"
      ],
      "stack": [
        "Python 3.10+",
        "discord.py",
        "Poetry",
        "Pydantic 2",
        "confluent-kafka",
        "SQLAlchemy 2 (async) with asyncpg",
        "Alembic",
        "PostgreSQL 15",
        "Docker Compose",
        "Make"
      ],
      "tier": "lab",
      "status": "Early prototype; 3 commits on 2026-05-24, no CI",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 0,
      "updated": "2026-05-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/dosecord",
      "homepage": ""
    },
    {
      "id": "w0rxbend/telegram-jitsi-meet",
      "owner": "w0rxbend",
      "name": "telegram-jitsi-meet",
      "title": "telegram-jitsi-meet",
      "tagline": "Telegram bot that mints one-off Jitsi Meet room links, containerised and auto-deployed",
      "summary": "A small Python bot for Telegram (the messaging app) that hands a chat a fresh video-call link on demand. The whole behaviour lives in one 3.4 KB file, `src/telegram_jitsi_meet/main.py`, built on the `python-telegram-bot` library: it registers three slash commands — `/start`, `/help` and `/meet` — and `/meet` composes a room name, appends a randomly generated universally unique identifier (UUID), strips every non-alphanumeric character to hyphens, and replies with an `https://meet.jit.si/<room>` link plus an inline \"Join\" button. Jitsi Meet is a public, account-free video-conferencing service, so the bot creates no server-side state — the link itself is the meeting. Packaging and delivery get more attention than the code: Poetry for dependencies, a multi-stage Dockerfile running as a non-root user, and a GitHub Actions workflow that builds a multi-architecture image, pushes it to Docker Hub and deploys it over SSH.",
      "highlights": [
        "`/meet` accepts an optional room name through a standard `argparse` parser (`-n/--name` or a positional argument) and falls back to the chat's title, or its numeric identifier, when none is given",
        "Room names are always suffixed with a `uuid.uuid4()` value and sanitised with `re.sub(\"[^A-Za-z0-9]\", \"-\", ...)`, so repeated calls never collide and never produce a malformed URL",
        "The Dockerfile is two-stage: a Poetry builder image exports a `requirements.txt`, and the runtime stage is `python:3.13-slim` running under a created non-root user (uid 1000)",
        "The GitHub Actions workflow builds for `linux/amd64` and `linux/arm64/v8` via QEMU and Buildx, pushes to Docker Hub, then SSHes to a host to `docker pull` and `docker compose up -d`, sending Telegram notifications at each stage"
      ],
      "tags": [
        "telegram-bot",
        "jitsi",
        "video-conferencing",
        "python",
        "docker",
        "ci-cd"
      ],
      "stack": [
        "Python 3.10+",
        "python-telegram-bot 20.x",
        "python-dotenv",
        "Poetry",
        "Docker",
        "Docker Compose",
        "GitHub Actions"
      ],
      "tier": "solid",
      "status": "The README advertises a public bot handle, though nothing in the repository shows it running; the most recent commits are automated dependency and base-image security bumps rather than feature work.",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 1,
      "updated": "2024-10-21",
      "topics": [],
      "url": "https://github.com/w0rxbend/telegram-jitsi-meet",
      "homepage": ""
    },
    {
      "id": "w0rxbend/ops-dashboard",
      "owner": "w0rxbend",
      "name": "ops-dashboard",
      "title": "Homelab Ops Dashboard",
      "tagline": "SolidJS wall dashboard for homelab devices, paired with a Docker Compose monitoring stack",
      "summary": "A pnpm workspace with three parts: a SolidJS front end that draws device cards, gauges and uptime strips on a fixed 1920x1080 canvas scaled to the browser window; a very small Hono web service; and a docker-compose file that runs a self-hosted monitoring stack. The front end currently renders data from a deterministic mock generator that is checked into the repository, not from the web service or the monitoring stack — nothing in the source connects them. The repository has no README file. It was created in 2022 and its early history is React dependency bumps, so the current SolidJS content is a later rewrite.",
      "highlights": [
        "homelab-ui/src/data/mock.ts generates the displayed values from seeded device definitions using a Mulberry32 pseudo-random number generator and an FNV-1a hash, so the dashboard shows repeatable synthetic data; App.tsx passes that mockSource into the data hook.",
        "The data hook (useHomelabData.ts) polls its source on an interval and flips a \"stale\" flag when a fetch throws, which is the only failure handling present.",
        "homelab-backend is a stub: app.ts registers exactly two routes, a root route returning service metadata and /health, plus CORS and logging middleware.",
        "homelab-infra/docker-compose.yml pins a full monitoring stack — node-exporter 1.8.2, cAdvisor 0.49.1, vmagent and VictoriaMetrics 1.103.0, Grafana 11.4.0, Gatus 5.12.1 and Beszel 0.9.3 — with vmagent scrape targets and Gatus HTTP health checks configured."
      ],
      "tags": [
        "homelab",
        "dashboard",
        "solidjs",
        "monitoring",
        "docker-compose"
      ],
      "stack": [
        "TypeScript 5.8",
        "SolidJS 1.9",
        "Vite 6",
        "pnpm workspaces",
        "Hono 4",
        "Node.js",
        "Docker Compose",
        "VictoriaMetrics",
        "Grafana",
        "Gatus"
      ],
      "tier": "lab",
      "status": "Front end runs on mock data; 33 commits, last pushed 2026-05-28",
      "category": "web",
      "categoryLabel": "Web, Dashboards & Apps",
      "lang": "TypeScript",
      "langColor": "#3178c6",
      "stars": 1,
      "updated": "2026-05-28",
      "topics": [],
      "url": "https://github.com/w0rxbend/ops-dashboard",
      "homepage": ""
    },
    {
      "id": "w0rxbend/compression-flix",
      "owner": "w0rxbend",
      "name": "compression-flix",
      "title": "compression-flix",
      "tagline": "Flix rewrite of lichess's clock and move compression, byte-identical to the Scala original",
      "summary": "A rewrite of lichess.org's compression library in Flix, a functional JVM (Java Virtual Machine) language with an effect system. The original Scala library packs chess clock times and move lists into a few bytes for long-term storage, so the port's whole point is producing output identical bit for bit — a single changed bit would invalidate every game already saved on disk. Two Scala-facing artifacts are published: one under its own namespace, and a drop-in one that reuses the original package names so existing callers need no edits. The repository carries a detailed write-up of what Flix forced the design to do differently.",
      "highlights": [
        "122 Flix tests whose expected values come from the Scala original, not from the port itself",
        "Perft check over 6,838 positions to depth 4 agreeing on 4,135,458,706 nodes plus a move-order checksum",
        "After optimisation, 10 of 12 throughput rows beat the reference implementation; cold start 37.7 ms vs 67.9 ms",
        "Drop-in artifact is compile-checked against lila's real import shape, so the build enforces the guarantee"
      ],
      "tags": [
        "flix",
        "scala",
        "chess",
        "lichess",
        "compression",
        "jvm",
        "port"
      ],
      "stack": [
        "Flix 0.75.1",
        "Scala",
        "Java",
        "JVM",
        "AGPL v3"
      ],
      "tier": "flagship",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Flix",
      "langColor": "#dc7d00",
      "stars": 1,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/compression-flix",
      "homepage": ""
    },
    {
      "id": "w0rxbend/scalachess-flix",
      "owner": "w0rxbend",
      "name": "scalachess-flix",
      "title": "scalachess-flix",
      "tagline": "Port of lichess's scalachess rules engine to Flix, perft-verified against the upstream fixtures",
      "summary": "A standalone port of scalachess — the chess rules library behind lichess.org — into Flix, a functional JVM (Java Virtual Machine) language. It covers board representation, move generation, FEN and PGN parsing (the standard text formats for positions and games), clocks, Elo and Glicko-2 ratings, sixteen FIDE tie-break systems, and ten chess variants. Correctness is checked with perft, a standard technique that counts every legal move sequence to a given depth and compares the total against published reference numbers. The README is explicit that this is an experiment rather than a replacement, and names the two structural limits that keep lila from consuming it.",
      "highlights": [
        "1,211 tests pass in 46.4 s; 30 source files, 33 modules, 19,268 lines, 1,277 public functions",
        "Covers 9,823 of 10,208 hand-written lines of scalachess core (96%), 71 of 76 files",
        "All ten variants have real rules and perft fixtures, including all 960 Chess960 start positions",
        "Documents its own limits: no zero-cost newtypes in Flix, and no supported way to call Flix from Scala"
      ],
      "tags": [
        "flix",
        "scala",
        "chess",
        "lichess",
        "perft",
        "port",
        "jvm"
      ],
      "stack": [
        "Flix 0.75.1",
        "Scala",
        "Java 21",
        "JVM",
        "GitHub Actions"
      ],
      "tier": "flagship",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Flix",
      "langColor": "#dc7d00",
      "stars": 0,
      "updated": "2026-08-09",
      "topics": [],
      "url": "https://github.com/w0rxbend/scalachess-flix",
      "homepage": ""
    },
    {
      "id": "w0rxbend/CATUTTC-UA",
      "owner": "w0rxbend",
      "name": "CATUTTC-UA",
      "title": "CATUTTC-UA",
      "tagline": "A single 21 MB JSON dump of Ukraine's KATOTTG administrative-territorial codifier",
      "summary": "This repository is a data drop, not an application: it contains no source code, no build file, and no license. The only substantive file is `data.json` (21.4 MB), a flat JavaScript Object Notation (JSON) array of 143,903 objects, each carrying five string fields — `id`, `cat`, `label`, `category`, `children_number`. The identifiers are 19-character KATOTTG codes (Kodyfikator administratyvno-terytorialnykh odynyts ta terytorii terytorialnykh hromad, the Ukrainian state codifier of administrative-territorial units and territories of territorial communities), for example `UA01000000000013043` labelled \"Автономна Республіка Крим\". The array contains substantial duplication — only 31,736 of the 143,903 `id` values are distinct, and one identifier appears 280 times — and the hierarchy is not materialised: there is no parent field, only a `children_number` count.",
      "highlights": [
        "Covers the full KATOTTG category ladder in one file: 25 oblasts (`Область`), 136 raions (`Район`), 1,772 territorial-community territories, 2,076 cities, 3,957 urban-type settlements, 4,680 city districts, 5,194 settlements and 126,056 villages",
        "Each record is uniform — all 143,903 objects share exactly the same five keys, so the file can be loaded without shape checks",
        "Known data quality issues are visible in the file itself: rows are duplicated (143,903 entries vs 31,736 distinct identifiers), and five rows use a Cyrillic \"С\" as the `cat` code with a `null` `category`",
        "All seven commits in the repository are dated 7 January 2024; there are no releases and no LICENSE file"
      ],
      "tags": [
        "dataset",
        "ukraine",
        "json",
        "open-data",
        "geodata",
        "reference-data"
      ],
      "stack": [
        "JSON"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "",
      "langColor": "",
      "stars": 0,
      "updated": "2024-01-07",
      "topics": [],
      "url": "https://github.com/w0rxbend/CATUTTC-UA",
      "homepage": ""
    },
    {
      "id": "w0rxbend/zig-playground",
      "owner": "w0rxbend",
      "name": "zig-playground",
      "title": "Zig Playground",
      "tagline": "A newly initialised Zig project: generated starter code plus a README describing intended goals",
      "summary": "This repository is minimal. It was created and last pushed on the same day (2026-04-11) with a single commit, and contains six files: build.zig, build.zig.zon, .gitignore, README.md, and two Zig sources. The Zig code is the generated starter content — src/root.zig defines a buffered-print helper and an `add` function with one test, and src/main.zig prints a placeholder message, calls that helper, and includes a sample list test and a fuzz-test example. The README describes what the author intends to explore (data structures, algorithms, memory management, comptime, allocators, WebAssembly) and gives the standard build, run, and test commands, but none of those topics are implemented yet.",
      "highlights": [],
      "tags": [
        "zig",
        "scaffold",
        "learning",
        "minimal"
      ],
      "stack": [
        "Zig (build.zig.zon declares minimum_zig_version 0.15.2)",
        "Zig build system"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Zig",
      "langColor": "#ec915c",
      "stars": 0,
      "updated": "2026-04-11",
      "topics": [],
      "url": "https://github.com/w0rxbend/zig-playground",
      "homepage": ""
    },
    {
      "id": "w0rxbend/rust-playground",
      "owner": "w0rxbend",
      "name": "rust-playground",
      "title": "Rust Playground",
      "tagline": "A Cargo workspace holding language exercises, six Codewars kata solutions, and four empty crates",
      "summary": "A personal Rust learning repository organised as a single Cargo workspace (Cargo is Rust's build tool and package manager) with eight member crates. Two of them contain real code: `exercises` is a walkthrough of Rust basics that prints commentary on variable shadowing, integer and floating-point types, parsing, Unicode characters, tuples, arrays and slices, and then reads an index from standard input to look up an array element; `katastrophes` runs six solutions to Codewars practice problems. The remaining crates are near-empty scaffolding — `zephyr` is a two-crate demonstration where a command-line crate calls `add_one` and `add_two` from a shared library crate, and all four `tippletracker` crates contain only a `Hello, world!` main function. The repository is a workspace of experiments, not a working application.",
      "highlights": [
        "The `katastrophes` crate holds six named Codewars kata modules (high_and_low, create_phone_numbers, find_odd, get_sum, maskify, find_outlier); find_outlier.rs links the original kata URL and carries a `#[cfg(test)]` unit test with three assertions.",
        "No third-party crates anywhere: the manifests declare empty `[dependencies]` sections, and the only dependency in the workspace is zephyr-cli’s path reference to its sibling zephyr-common.",
        "The four `tippletracker` crates (api, auth, config, db) exist as workspace members but each contains only the default `fn main() { println!(\"Hello, world!\"); }`."
      ],
      "tags": [
        "rust",
        "cargo-workspace",
        "learning",
        "codewars",
        "exercises"
      ],
      "stack": [
        "Rust",
        "Cargo workspace (resolver 2)",
        "Rust editions 2021 and 2024",
        "Dev Container"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Rust",
      "langColor": "#dea584",
      "stars": 1,
      "updated": "2026-04-11",
      "topics": [],
      "url": "https://github.com/w0rxbend/rust-playground",
      "homepage": ""
    },
    {
      "id": "w0rxbend/empyrean",
      "owner": "w0rxbend",
      "name": "empyrean",
      "title": "empyrean",
      "tagline": "Placeholder repository — one commit, a README holding a project name and a YouTube link",
      "summary": "This repository is effectively empty. Its only file is README.md, which contains a YouTube video URL immediately followed by the heading \"# empyrean\", committed once. There is no source code, no build or dependency file, no repository description and no detected language. What the project is meant to be is not determinable from the published contents; the linked video was not opened, so no claim is made about it.",
      "highlights": [],
      "tags": [
        "placeholder",
        "empty-repository"
      ],
      "stack": [],
      "tier": "lab",
      "status": "Single commit dated 2024-09-24; repository size reported as 1 KB",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "",
      "langColor": "",
      "stars": 0,
      "updated": "2024-12-25",
      "topics": [],
      "url": "https://github.com/w0rxbend/empyrean",
      "homepage": ""
    },
    {
      "id": "w0rxbend/elixir-demo",
      "owner": "w0rxbend",
      "name": "elixir-demo",
      "title": "Elixir Demo",
      "tagline": "A two-commit Elixir project skeleton whose single function returns :world",
      "summary": "This repository is minimal. It was created and last pushed on 2024-09-24 with two commits and contains eight files. The library code is one module, `ElixirDemo`, with a single `hello/0` function that returns the atom `:world`. The README is the unmodified generated template, still saying \"TODO: Add description\" and referring to the package as `example`. The test file has not been renamed to match the library: test/example_test.exs calls `Example.hello()` and runs `doctest Example`, but no module named `Example` is defined anywhere in lib/, so the test suite refers to a module the project does not contain. There is nothing else in the repository beyond a dev container configuration and formatter settings.",
      "highlights": [
        "The generated project was renamed to `ElixirDemo` in lib/ and mix.exs, but the test and the README still reference the original `Example`/`example` names, so test/example_test.exs targets an undefined module."
      ],
      "tags": [
        "elixir",
        "scaffold",
        "minimal",
        "mix"
      ],
      "stack": [
        "Elixir (mix.exs requires ~> 1.17)",
        "Mix build tool",
        "ExUnit",
        "Dev Container"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Elixir",
      "langColor": "#a389b8",
      "stars": 0,
      "updated": "2024-09-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/elixir-demo",
      "homepage": ""
    },
    {
      "id": "w0rxbend/paradoxium",
      "owner": "w0rxbend",
      "name": "paradoxium",
      "title": "paradoxium",
      "tagline": "Three-commit Discord bot stub: the discord.py starter script plus a privacy policy and terms",
      "summary": "A minimal Python repository for a Discord bot. The only code is main.py, roughly 20 lines, which creates a discord.py client with the message-content intent, prints a line when the bot logs in, and replies \"Hello!\" to any message beginning with `$hello`. The bot token is left as the placeholder string `<>`. The other tracked files are a Discord privacy policy and a terms-of-service document, plus a stub README containing only the project name. There is no dependency manifest, no configuration, and no further functionality in the repository.",
      "highlights": [
        "The bundled terms-of-service document states the bot \"is designed for testing purposes and is used to manage a private Discord channel\" — that behaviour is described in the policy text but is not present in main.py"
      ],
      "tags": [
        "discord-bot",
        "python",
        "stub",
        "early-stage"
      ],
      "stack": [
        "Python",
        "discord.py"
      ],
      "tier": "lab",
      "status": "Three commits, the most recent on 2024-09-24; repository size reported as 5 KB",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Python",
      "langColor": "#3572A5",
      "stars": 0,
      "updated": "2024-09-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/paradoxium",
      "homepage": ""
    },
    {
      "id": "w0rxbend/gazeguard",
      "owner": "w0rxbend",
      "name": "gazeguard",
      "title": "gazeguard",
      "tagline": "Empty placeholder repository — one commit containing a README with only the project name",
      "summary": "This repository is effectively empty. It contains a single file, README.md, whose entire content is the heading \"# gazeguard\", added in one commit. There is no source code, no build or dependency file, no repository description, no topics and no detected language, so the intended purpose of the project cannot be determined from what is published. Nothing here supports a technical description.",
      "highlights": [],
      "tags": [
        "placeholder",
        "empty-repository"
      ],
      "stack": [],
      "tier": "lab",
      "status": "Single commit dated 2024-09-24; repository size reported as 1 KB",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "",
      "langColor": "",
      "stars": 0,
      "updated": "2024-09-24",
      "topics": [],
      "url": "https://github.com/w0rxbend/gazeguard",
      "homepage": ""
    },
    {
      "id": "w0rxbend/golang-sandbox",
      "owner": "w0rxbend",
      "name": "golang-sandbox",
      "title": "Go Sandbox",
      "tagline": "Scratch Go workspace: a nested-module call chain, one kata, and an unused Fiber HTTP server",
      "summary": "A personal scratch repository for trying out Go. The root program (main.go) calls a chain of three tiny local modules — cli-app prints \"CLI\" and calls server-app, which prints \"Server\" and calls client-app, which prints \"Client\" — and then counts the `true` values in a hard-coded boolean slice via a `CountSheeps` function. Separately, app/server.go contains an HTTP server built on Fiber (a Go web framework) that answers GET / with a JSON object holding the caller's IP address, the process uptime, and the start timestamp, logging through zap (a structured logging library); nothing in main.go calls it. The repository is exploratory rather than a finished project, and it also contains a committed 10.8 MB compiled debug binary (__debug_bin).",
      "highlights": [
        "Splits trivial code across four independent Go modules (root plus modules/cli-app, modules/server-app, modules/client-app) that depend on each other by published commit digest rather than by local path or a go.work file — go.work.sum is present but go.work is not.",
        "app/server.go is a complete, self-contained Fiber HTTP handler returning {ip, uptime, started_at} as JSON on port 3000, but it is not referenced from main.go.",
        "Most recent commits on the main branch are automated Renovate dependency bumps (dated 2024-09-03), including a security update of Fiber to v2.52.5."
      ],
      "tags": [
        "go",
        "sandbox",
        "learning",
        "http",
        "multi-module"
      ],
      "stack": [
        "Go 1.21.11",
        "Go modules (four separate module manifests)",
        "Fiber v2.52.5",
        "Uber zap v1.27.0",
        "Dev Container",
        "Renovate"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Go",
      "langColor": "#00ADD8",
      "stars": 1,
      "updated": "2024-09-03",
      "topics": [],
      "url": "https://github.com/w0rxbend/golang-sandbox",
      "homepage": ""
    },
    {
      "id": "w0rxbend/flight-pulse",
      "owner": "w0rxbend",
      "name": "flight-pulse",
      "title": "FlightPulse",
      "tagline": "README-only repository describing planned Betaflight CLI automation for FPV drones",
      "summary": "FlightPulse is described in its README as a personal set of Python scripts for automating the setup of FPV (first-person view) racing drones through the command-line interface of Betaflight Configurator, the standard tool for configuring drone flight-control firmware. At present the repository contains that README and nothing else: the tree has exactly one file. The scripts, dependency list and licence file the README tells you to run and read are not in the repository. The README itself opens with a caution notice saying the project is under construction.",
      "highlights": [
        "The README's usage instructions reference `flightpulse_config.py`, `requirements.txt` and a LICENSE file, none of which exist in the repository tree",
        "All six commits are the initial commit plus five README edits, all on 2024-07-15"
      ],
      "tags": [
        "fpv",
        "drones",
        "betaflight",
        "documentation",
        "early-stage"
      ],
      "stack": [],
      "tier": "lab",
      "status": "README-only; last pushed 2024-07-15",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "",
      "langColor": "",
      "stars": 0,
      "updated": "2024-07-15",
      "topics": [],
      "url": "https://github.com/w0rxbend/flight-pulse",
      "homepage": ""
    },
    {
      "id": "w0rxbend/cr-code-playground",
      "owner": "w0rxbend",
      "name": "cr-code-playground",
      "title": "Crystal Code Playground",
      "tagline": "A 2019 Crystal scratch project whose only program benchmarks two ways of writing to_s",
      "summary": "This repository is minimal and dates from 2019–2020. It is a Crystal project skeleton (Crystal is a compiled language with Ruby-like syntax) whose single source file compares two implementations of `to_s`: one that writes values directly into the output stream (`io << x`) and one that builds an interpolated string first. It runs those against each other with Crystal's built-in `Benchmark.ips` iterations-per-second harness, plus a second comparison of writing an integer directly versus calling `.to_s` on it. The README is the generated template with most sections left as \"TODO\", and the single spec file is a placeholder that asserts `false == false`.",
      "highlights": [
        "src/main.cr is a self-contained micro-benchmark of stream-writing versus string-interpolation inside `to_s`, using Crystal's Benchmark.ips."
      ],
      "tags": [
        "crystal",
        "benchmark",
        "scratch",
        "minimal"
      ],
      "stack": [
        "Crystal (shard.yml pins crystal: 0.31.1)",
        "Shards (Crystal's dependency manager)",
        "Crystal Spec",
        "Travis CI config (present but with its script section commented out)"
      ],
      "tier": "lab",
      "status": "",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "Crystal",
      "langColor": "#8f9fa8",
      "stars": 1,
      "updated": "2023-03-08",
      "topics": [],
      "url": "https://github.com/w0rxbend/cr-code-playground",
      "homepage": ""
    },
    {
      "id": "w0rxbend/coc-crystal-experimental",
      "owner": "w0rxbend",
      "name": "coc-crystal-experimental",
      "title": "coc-crystal-experimental",
      "tagline": "coc.nvim editor plugin that wires Neovim to the \"scry\" Crystal language server",
      "summary": "A small plugin for coc.nvim (a Language Server Protocol client for the Vim and Neovim text editors) that connects the editor to \"scry\", a language server for the Crystal programming language. The single source file, src/index.ts, reads a `crystal` configuration block, checks that the configured path to the `scry` executable exists on disk, and if so starts a LanguageClient scoped to Crystal files, watching `**/*.cr` for changes. Beyond that one file the repository is plugin scaffolding: a webpack build, a TypeScript config, tslint, and bot configuration for Renovate and Mergify. The README is two lines, there are no tests, and the source file has not changed since May 2020 — every commit in the final year is an automated dependency bump.",
      "highlights": [
        "src/index.ts refuses to start the server when `crystal.enable` is false or when the configured `scry` binary path does not exist, logging a message instead of throwing",
        "package.json declares configuration keys `crystal.server`, `crystal.completion`, `crystal.hover`, `crystal.implementations`, `crystal.logLevel` and `crystal.enabled`, but only `server` and `enable` are read by the code",
        "Version is still 0.0.1 and the built bundle (lib/index.js) is committed alongside the source; no releases have been published on GitHub"
      ],
      "tags": [
        "neovim",
        "editor-tooling",
        "language-server-protocol",
        "crystal-lang",
        "plugin"
      ],
      "stack": [
        "TypeScript",
        "coc.nvim",
        "vscode-languageserver-protocol",
        "webpack",
        "tslint",
        "Yarn"
      ],
      "tier": "lab",
      "status": "No source changes since May 2020; the final year of commits is automated dependency updates and merges",
      "category": "labs",
      "categoryLabel": "Language Labs & Ports",
      "lang": "JavaScript",
      "langColor": "#f1e05a",
      "stars": 1,
      "updated": "2023-03-08",
      "topics": [
        "coc-nvim",
        "crystal-lang"
      ],
      "url": "https://github.com/w0rxbend/coc-crystal-experimental",
      "homepage": ""
    }
  ]
};
