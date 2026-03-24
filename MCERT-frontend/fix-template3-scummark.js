const fs = require('fs');
const PizZip = require('pizzip');

const templatePath = 'public/templates/mclerts-template-3.docx';
const buf = fs.readFileSync(templatePath);
const srcZip = new PizZip(buf);
const xml = srcZip.file('word/document.xml').asText();

// Check the old paragraph is present
if (!xml.includes('696F1273')) {
  console.log('ERROR: paragraph with paraId 696F1273 not found!');
  process.exit(1);
}

const rPr = '<w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:lang w:val="en-US"/></w:rPr>';
const pPr = '<w:pPr><w:widowControl w:val="0"/><w:autoSpaceDE w:val="0"/><w:autoSpaceDN w:val="0"/><w:adjustRightInd w:val="0"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:lang w:val="en-US"/></w:rPr></w:pPr>';

// Find the exact paragraph text to replace
const pStart = xml.indexOf('<w:p w14:paraId="696F1273"');
const pEnd = xml.indexOf('</w:p>', pStart) + '</w:p>'.length;
const oldPara = xml.substring(pStart, pEnd);

console.log('Old paragraph found, length:', oldPara.length);
console.log('Old paragraph preview:', oldPara.substring(0, 100));

const newParas =
  // Para 1: main fixed text with {scummark} and {variableflow} inline
  '<w:p w14:paraId="696F1273" w14:textId="31819EEC" w:rsidR="00BD0331" w:rsidRDefault="00BD0331" w:rsidP="00BD0331">' +
    pPr +
    '<w:r>' + rPr + '<w:t xml:space="preserve">There is an inlet open channel rectangular flume installation used to monitor the volume of effluent going forward to treatment and thus representative of treated flow being discharged to the watercourse. The flume is manufactured from stainless steel and has a smooth concrete approach channel. The primary device is compliant with the key dimensional requirements of BS ISO 4359 and is in good condition. Flow is free discharging with no evidence of the flume ever having been drowned under operating conditions. Flow within the approach channel appears uniform and steady with an apparent even velocity distribution, no significant hydraulic disturbances were apparent. There is a visible top scum mark located </w:t></w:r>' +
    '<w:r>' + rPr + '<w:t xml:space="preserve">{scummark}</w:t></w:r>' +
    '<w:r>' + rPr + '<w:t xml:space="preserve"> above zero1, equating to approximately </w:t></w:r>' +
    '<w:r>' + rPr + '<w:t xml:space="preserve">{variableflow}</w:t></w:r>' +
  '</w:p>' +
  // Para 2: italic note
  '<w:p w14:paraId="696F1276" w14:textId="31819EED" w:rsidR="00BD0331" w:rsidRDefault="00BD0331" w:rsidP="00BD0331">' +
    pPr +
    '<w:r><w:rPr><w:i/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:lang w:val="en-US"/></w:rPr><w:t>Visible scum mark is difficult to accurately measure and is used only as a guide for flows at site</w:t></w:r>' +
  '</w:p>';

const newXml = xml.substring(0, pStart) + newParas + xml.substring(pEnd);

if (newXml === xml) {
  console.log('ERROR: replacement did not occur');
  process.exit(1);
}

console.log('Paragraph replaced successfully');

// Repack with Node.js (forward-slash paths — NEVER use PowerShell Compress-Archive)
const fixedZip = new PizZip();
Object.keys(srcZip.files).forEach(name => {
  const file = srcZip.files[name];
  const fixedName = name.split('\\').join('/');
  if (name === 'word/document.xml' || fixedName === 'word/document.xml') {
    fixedZip.file('word/document.xml', newXml);
  } else if (!file.dir) {
    fixedZip.file(fixedName, Buffer.from(file.asUint8Array()), { binary: true });
  } else {
    fixedZip.folder(fixedName);
  }
});

const outBuf = fixedZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/mclerts-template-3.docx', outBuf);
fs.writeFileSync('build/templates/mclerts-template-3.docx', outBuf);
console.log('Template saved to public/templates/ and build/templates/');
console.log('Size:', outBuf.length, 'bytes');

// Verify tags in the new template
const verZip = new PizZip(outBuf);
const verXml = verZip.file('word/document.xml').asText();
const tags = ['scummark', 'variableflow', 'flowmeterType', 'siteName'];
tags.forEach(tag => {
  console.log(`Tag {${tag}}: ${verXml.includes(tag) ? 'FOUND' : 'MISSING'}`);
});
