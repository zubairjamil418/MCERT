const fs = require('fs');
const PizZip = require('pizzip');

const templatePath = 'public/templates/mclerts-template-3.docx';
const buf = fs.readFileSync(templatePath);
const srcZip = new PizZip(buf);
let xml = srcZip.file('word/document.xml').asText();

// Empty paragraphs before "NIW Asset ID:" in the label (left) cell
// paraIds: 5076F9C0, 72E6A1D5, 3F287ACF
const emptyLeftParas = [
  '<w:p w14:paraId="5076F9C0" w14:textId="77777777" w:rsidR="005D598C" w:rsidRDefault="005D598C" w:rsidP="002C69DB"><w:pPr><w:jc w:val="right"/><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:b/></w:rPr></w:pPr></w:p>',
  '<w:p w14:paraId="72E6A1D5" w14:textId="77777777" w:rsidR="002C494C" w:rsidRDefault="002C494C" w:rsidP="002C69DB"><w:pPr><w:jc w:val="right"/><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:b/></w:rPr></w:pPr></w:p>',
  '<w:p w14:paraId="3F287ACF" w14:textId="77777777" w:rsidR="002C494C" w:rsidRDefault="002C494C" w:rsidP="002C69DB"><w:pPr><w:jc w:val="right"/><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:b/></w:rPr></w:pPr></w:p>',
];

// Empty paragraphs before {niwAssetId} in the value (right) cell
// paraIds: 20F296FC, 1596FC4B, 2C53071E
const emptyRightParas = [
  '<w:p w14:paraId="20F296FC" w14:textId="2B9AEE47" w:rsidR="005D598C" w:rsidRPr="00B24EDD" w:rsidRDefault="00E002DD" w:rsidP="002C69DB"><w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:bCs/><w:lang w:val="en-US"/></w:rPr></w:pPr></w:p>',
  '<w:p w14:paraId="1596FC4B" w14:textId="5A4F3D8D" w:rsidR="00E002DD" w:rsidRPr="00A134F1" w:rsidRDefault="00E002DD" w:rsidP="00E002DD"><w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:bCs/><w:lang w:val="en-US"/></w:rPr></w:pPr></w:p>',
  '<w:p w14:paraId="2C53071E" w14:textId="77777777" w:rsidR="002C494C" w:rsidRPr="00056D57" w:rsidRDefault="002C494C" w:rsidP="00E002DD"><w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/><w:bCs/></w:rPr></w:pPr></w:p>',
];

let removed = 0;
for (const para of [...emptyLeftParas, ...emptyRightParas]) {
  if (xml.includes(para)) {
    xml = xml.replace(para, '');
    removed++;
  } else {
    console.log('WARNING: paragraph not found exactly, trying by paraId...');
    // Extract the paraId from the para string
    const paraIdMatch = para.match(/w14:paraId="([^"]+)"/);
    if (paraIdMatch) {
      const paraId = paraIdMatch[1];
      const pStart = xml.indexOf(`w14:paraId="${paraId}"`);
      if (pStart >= 0) {
        const realPStart = xml.lastIndexOf('<w:p ', pStart);
        const realPEnd = xml.indexOf('</w:p>', pStart) + '</w:p>'.length;
        const found = xml.substring(realPStart, realPEnd);
        console.log('Found by paraId:', paraId, '| length:', found.length);
        xml = xml.substring(0, realPStart) + xml.substring(realPEnd);
        removed++;
      } else {
        console.log('ERROR: paraId not found:', paraId);
      }
    }
  }
}

console.log(`Removed ${removed} empty paragraphs`);

// Repack with Node.js (forward-slash paths)
const fixedZip = new PizZip();
Object.keys(srcZip.files).forEach(name => {
  const file = srcZip.files[name];
  const fixedName = name.split('\\').join('/');
  if (fixedName === 'word/document.xml') {
    fixedZip.file('word/document.xml', xml);
  } else if (!file.dir) {
    fixedZip.file(fixedName, Buffer.from(file.asUint8Array()), { binary: true });
  } else {
    fixedZip.folder(fixedName);
  }
});

const outBuf = fixedZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/mclerts-template-3.docx', outBuf);
fs.writeFileSync('build/templates/mclerts-template-3.docx', outBuf);
console.log('Template saved. Size:', outBuf.length, 'bytes');

// Verify key tags still present
const verZip = new PizZip(outBuf);
const verXml = verZip.file('word/document.xml').asText();
['niwAssetId', 'flowmeterType', 'scummark', 'variableflow', 'siteName'].forEach(tag => {
  console.log(`{${tag}}: ${verXml.includes(tag) ? 'OK' : 'MISSING'}`);
});
