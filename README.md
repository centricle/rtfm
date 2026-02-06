# rtfm

Local docs reader for development. Zero dependencies. Zero network.

## Installation

Requires Node.js 14+.

```bash
npm install -g @centricle/rtfm
```

Or run without installing:

```bash
npx @centricle/rtfm
```

Uninstall:

```bash
npm uninstall -g @centricle/rtfm
```

## Quick Start

```bash
cd your-docs-folder
rtfm init      # scaffold index.html, docsify assets, sidebar stub
rtfm sidebar   # generate _sidebar.md from *.md files
rtfm           # serve on localhost:4000, open browser
```

That's it. Your markdown files are now a navigable documentation site.

## Commands

| Command | Description |
|---------|-------------|
| `rtfm` | Serve current directory and open browser |
| `rtfm serve [dir]` | Serve specified directory |
| `rtfm init` | Scaffold rtfm files into current directory |
| `rtfm sidebar` | Auto-generate `_sidebar.md` from `*.md` files |
| `rtfm open [path]` | Open specific doc in browser |

## Options

| Option | Description |
|--------|-------------|
| `--port=XXXX` | Custom port (default: 4000, auto-increments if busy) |
| `--no-open` | Don't open browser |
| `--force` | Overwrite existing files |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## Theme Toggle

Toggle between Classic and Modern themes via the button in the top-right corner. Preference persists to localStorage.

| Theme | Typography | Line Height | Measure |
|-------|------------|-------------|---------|
| **Classic** | Serif (Charter, Georgia) | 1.8 | 65ch |
| **Modern** | Sans-serif (system) | 1.5 | 80ch |

## Philosophy

rtfm makes zero outbound HTTP requests. No CDNs, no analytics, no tracking. All assets (Docsify, CSS, fonts) are bundled locally and served from your machine.

This matters for:

- **Air-gapped environments** — Works without internet
- **Privacy** — No third-party calls, ever
- **Speed** — No network latency for assets
- **Reliability** — No CDN outages or breaking changes

## Credits

Built on [Docsify](https://docsify.js.org/), the magical documentation site generator. Docsify is bundled locally so rtfm works offline.

## License

MIT
