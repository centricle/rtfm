const fs = require('fs');
const path = require('path');

const TEMPLATES = ['index.html', 'docsify.min.js', 'simple.css', '_sidebar.md'];

function init(dir, flags = {}) {
  const cwd = dir ? path.resolve(dir) : process.cwd();
  const templateDir = path.join(__dirname, '..', 'templates');

  let created = [];
  let skipped = [];

  for (const file of TEMPLATES) {
    const src = path.join(templateDir, file);
    const dest = path.join(cwd, file);

    if (fs.existsSync(dest) && !flags.force) {
      skipped.push(file);
    } else {
      fs.copyFileSync(src, dest);
      created.push(file);
    }
  }

  // Create README.md if missing
  const readmePath = path.join(cwd, 'README.md');
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# Documentation

Welcome to your documentation.

Edit this file or add more \`.md\` files, then run \`rtfm sidebar\` to generate navigation.
`);
    created.push('README.md');
  }

  // Report
  if (created.length > 0) {
    console.log('Created:');
    created.forEach(f => console.log(`  ${f}`));
  }

  if (skipped.length > 0) {
    console.log('Skipped (already exist):');
    skipped.forEach(f => console.log(`  ${f}`));
  }

  console.log('');
  console.log('Run "rtfm" to start the server.');
}

module.exports = { init };
