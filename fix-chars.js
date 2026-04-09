const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const frontendSrcPath = path.resolve(__dirname, 'MCERT-frontend', 'src');
let filesToProcess = [];

if (fs.existsSync(frontendSrcPath)) {
    filesToProcess = filesToProcess.concat(walk(frontendSrcPath));
}

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replacements
  const replacements = {
    'â€”': '-',
    'â€“': '-',
    'â€˜': "'",
    'â€™': "'",
    'â€œ': '"',
    'â€': '"',
    'â€¢': '•',
    'Â ': ' ',
    'Â': ' '
  };

  for (const [bad, good] of Object.entries(replacements)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed characters in:', file);
  }
});
console.log('Done cleaning up characters!');