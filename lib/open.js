const { exec } = require('child_process');

function openBrowser(url) {
  const platform = process.platform;
  let cmd;

  switch (platform) {
    case 'darwin':
      cmd = `open "${url}"`;
      break;
    case 'win32':
      cmd = `start "" "${url}"`;
      break;
    default:
      cmd = `xdg-open "${url}"`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.error('Could not open browser:', err.message);
    }
  });
}

function open(docPath, flags) {
  // Ensure path starts with /
  if (!docPath.startsWith('/')) {
    docPath = '/' + docPath;
  }

  // Remove .md extension if present
  docPath = docPath.replace(/\.md$/, '');

  const url = `http://localhost:${flags.port}${docPath}`;
  openBrowser(url);
}

module.exports = { open, openBrowser };
