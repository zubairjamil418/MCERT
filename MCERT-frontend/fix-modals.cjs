const fs = require('fs');
const path = require('path');
const base = path.join(__dirname);
const files = [
  { path: path.join(base, 'src/components/modals/FormModal.jsx'), title: 'Electromagnetic Flow Meters' },
  { path: path.join(base, 'src/components/modals/FormModal2.jsx'), title: 'V-Notch Weirs' },
  { path: path.join(base, 'src/components/modals/FormModal3.jsx'), title: 'Flumes' },
];

for (const f of files) {
  let content = fs.readFileSync(f.path, 'utf8');

  // Fix em dash mojibake before {editingFormId
  const titleRegex = new RegExp(f.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+[^{]+\\{editingFormId');
  const match = content.match(titleRegex);
  if (match) {
    console.log(f.path + ': Fixed title');
    content = content.replace(match[0], f.title + ' - {editingFormId');
  }

  // Fix garbled emoji before 'Upload Excel File'
  const uploadMatch = content.match(/[^\x20-\x7E]+\s*Upload Excel File/);
  if (uploadMatch) {
    console.log(f.path + ': Fixed upload button');
    content = content.replace(uploadMatch[0], 'Upload Excel File');
  }

  // Fix garbled close button
  const closeMatch = content.match(/>\s*[^\x20-\x7E]+\s*<\/Button>/);
  if (closeMatch) {
    console.log(f.path + ': Fixed close button');
    content = content.replace(closeMatch[0], '>X</Button>');
  }

  fs.writeFileSync(f.path, content, 'utf8');
  console.log(f.path + ': Done');
}
