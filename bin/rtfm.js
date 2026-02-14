#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { serve } = require('../lib/serve');
const { init } = require('../lib/init');
const { sidebar } = require('../lib/sidebar');
const { open } = require('../lib/open');

const args = process.argv.slice(2);
const command = args[0] || 'serve';

// Parse flags
const flags = {
  port: 4000,
  open: true,
  force: false,
  help: false,
  version: false
};

const positional = [];

for (const arg of args) {
  if (arg.startsWith('--port=')) {
    flags.port = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--no-open') {
    flags.open = false;
  } else if (arg === '--force') {
    flags.force = true;
  } else if (arg === '--help' || arg === '-h') {
    flags.help = true;
  } else if (arg === '--version' || arg === '-v') {
    flags.version = true;
  } else if (!arg.startsWith('-')) {
    positional.push(arg);
  }
}

// Version
if (flags.version) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Help
if (flags.help) {
  console.log(`
rtfm - Local docs reader. Zero dependencies. Zero network.

Usage:
  rtfm                  Serve current directory, open browser
  rtfm [file.md]        Serve a single markdown file
  rtfm serve [dir]      Serve specified directory
  rtfm init             Scaffold rtfm files into current directory
  rtfm sidebar          Auto-generate _sidebar.md from *.md files
  rtfm open [path]      Open specific doc in browser

Options:
  --port=XXXX           Custom port (default: 4000)
  --no-open             Don't open browser
  --force               Overwrite existing files (for sidebar)
  -h, --help            Show this help
  -v, --version         Show version
`);
  process.exit(0);
}

// Route commands
const cmd = positional[0] || 'serve';

switch (cmd) {
  case 'serve':
    serve(positional[1] || '.', flags);
    break;
  case 'init':
    init(null, flags);
    break;
  case 'sidebar':
    sidebar(null, flags);
    break;
  case 'open':
    open(positional[1] || '/', flags);
    break;
  default: {
    // Single .md file: serve its directory, open to that file
    const resolved = path.resolve(cmd);
    if (cmd.endsWith('.md') && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      const dir = path.dirname(resolved);
      const docPath = path.basename(resolved, '.md');
      serve(dir, flags, docPath);
    } else {
      serve(cmd, flags);
    }
  }
}
