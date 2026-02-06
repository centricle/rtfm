const fs = require('fs');
const path = require('path');

const IGNORE = ['_sidebar.md', 'node_modules', '.git'];

function toTitleCase(str) {
  // Handle kebab-case and snake_case
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function findMarkdownFiles(dir, base = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Sort: directories first, then files, alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(base, entry.name);

    // Skip ignored
    if (IGNORE.some(i => entry.name === i || entry.name.startsWith('.'))) {
      continue;
    }

    if (entry.isDirectory()) {
      const nested = findMarkdownFiles(fullPath, relativePath);
      if (nested.length > 0) {
        files.push({
          type: 'dir',
          name: entry.name,
          children: nested
        });
      }
    } else if (entry.name.endsWith('.md')) {
      files.push({
        type: 'file',
        name: entry.name,
        path: relativePath
      });
    }
  }

  return files;
}

function generateSidebar(files, indent = 0) {
  let lines = [];
  const prefix = '  '.repeat(indent);

  for (const item of files) {
    if (item.type === 'dir') {
      lines.push(`${prefix}- **${toTitleCase(item.name)}**`);
      lines.push(...generateSidebar(item.children, indent + 1));
    } else {
      // Convert path to link
      let linkPath = '/' + item.path.replace(/\\/g, '/');
      // Remove .md extension for cleaner URLs
      linkPath = linkPath.replace(/\.md$/, '');
      // README becomes just the directory
      linkPath = linkPath.replace(/\/README$/, '/');

      // Display name: use filename without extension, title-cased
      let displayName = item.name.replace(/\.md$/, '');
      if (displayName.toLowerCase() === 'readme') {
        displayName = 'Home';
      } else {
        displayName = toTitleCase(displayName);
      }

      lines.push(`${prefix}- [${displayName}](${linkPath})`);
    }
  }

  return lines;
}

function sidebar(dir, flags = {}) {
  const cwd = dir ? path.resolve(dir) : process.cwd();
  const sidebarPath = path.join(cwd, '_sidebar.md');

  // Check if exists and not forcing
  if (fs.existsSync(sidebarPath) && !flags.force) {
    console.error('_sidebar.md already exists. Use --force to overwrite.');
    process.exit(1);
  }

  const files = findMarkdownFiles(cwd);
  const lines = generateSidebar(files);

  if (lines.length === 0) {
    console.error('No markdown files found.');
    process.exit(1);
  }

  const content = lines.join('\n') + '\n';
  fs.writeFileSync(sidebarPath, content);

  console.log('Generated _sidebar.md:');
  console.log(content);
}

module.exports = { sidebar };
