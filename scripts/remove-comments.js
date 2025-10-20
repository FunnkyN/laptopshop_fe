const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

const allowExtensions = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.html',
]);
const skipDirs = new Set(['node_modules', '.git']);
const roots = ['src', 'public'];
const singleFiles = ['tailwind.config.js'];

function walkDir(dir, fileList) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walkDir(path.join(dir, entry.name), fileList);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!allowExtensions.has(ext)) continue;
    fileList.push(path.join(dir, entry.name));
  }
}

function stripFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const stripped = stripComments(content, { preserveNewlines: true });
  if (stripped === content) return false;
  fs.writeFileSync(filePath, stripped, 'utf8');
  return true;
}

function run() {
  const targets = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    walkDir(root, targets);
  }
  for (const file of singleFiles) {
    if (fs.existsSync(file)) targets.push(file);
  }

  console.log(`Processing ${targets.length} files...`);
  let updated = 0;
  for (const file of targets) {
    if (stripFile(file)) {
      updated += 1;
    }
  }
  console.log(`Stripped comments from ${updated} file(s).`);
}

run();
