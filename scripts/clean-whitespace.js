const fs = require('fs');
const path = require('path');

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

function cleanContent(content) {
  const hadNewline = content.endsWith('\n');
  const lines = content.split(/\r?\n/);
  const cleanedLines = [];
  let blankStreak = 0;

  for (let line of lines) {
    const trimmedLine = line.replace(/\s+$/, '');
    if (trimmedLine === '') {
      blankStreak += 1;
      if (blankStreak > 1) continue;
      cleanedLines.push('');
      continue;
    }

    blankStreak = 0;
    cleanedLines.push(trimmedLine);
  }

  let result = cleanedLines.join('\n');
  if (hadNewline) {
    result += '\n';
  }
  return result;
}

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = cleanContent(content);
  if (cleaned === content) return false;
  fs.writeFileSync(filePath, cleaned, 'utf8');
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

  console.log(`Cleaning whitespace in ${targets.length} files...`);
  let updated = 0;
  for (const file of targets) {
    if (cleanFile(file)) {
      updated += 1;
    }
  }
  console.log(`Updated whitespace in ${updated} file(s).`);
}

run();
