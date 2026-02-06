const http = require('http');
const fs = require('fs');
const path = require('path');
const { openBrowser } = require('./open');
const { init } = require('./init');
const { sidebar } = require('./sidebar');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serve(dir, flags) {
  const root = path.resolve(dir);

  // If not initialized, auto-init + generate sidebar
  const indexPath = path.join(root, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('Initializing...');
    init(root, { force: false });
    sidebar(root, { force: true });
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${flags.port}`);
    let filePath = path.join(root, url.pathname);

    // Default to index.html for directories
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': mimeType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // For resource files (.md, .css, .js, etc.), return 404 if not found
      // SPA fallback only applies to navigation routes (no extension or .html)
      const ext = path.extname(url.pathname).toLowerCase();
      const isResourceFile = ext && ext !== '.html';

      if (isResourceFile) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else if (fs.existsSync(indexPath)) {
        // SPA fallback: serve index.html for navigation routes
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    }
  });

  // Try to start server, increment port if busy
  function tryListen(port) {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        tryListen(port + 1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`Serving ${root}`);
      console.log(`  ${url}`);
      console.log('');
      console.log('Press Ctrl+C to stop');

      if (flags.open) {
        openBrowser(url);
      }
    });
  }

  tryListen(flags.port);
}

module.exports = { serve };
