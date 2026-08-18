const XLSX = require('xlsx');

const fp = 'c:/Users/venka/OneDrive/Documents/Desktop/dsa/60DaysPractice.xlsx';
const wb = XLSX.readFile(fp, { cellHyperlinks: true });
const sheet = wb.Sheets['Sheet1'];

const range = XLSX.utils.decode_range(sheet['!ref']);

const rawExcelProblems = [];

for (let r = range.s.r; r <= range.e.r; r++) {
  const col0 = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
  const col1 = sheet[XLSX.utils.encode_cell({ r, c: 1 })];

  const topic = col0 ? String(col0.v).trim() : null;
  let text = col1 ? String(col1.v).trim() : null;
  let link = col1 && col1.l ? col1.l.Target : null;

  if (topic && text && !text.includes('CODING PROBLEMS') && !text.includes('Follow Striver Sheet') && text !== 'TOPICS') {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      if (!link) link = text;
    }
    rawExcelProblems.push({ row: r, topic, text, link });
  }
}

console.log(`Extracted ${rawExcelProblems.length} total rows from 60DaysPractice.xlsx`);

let urlIsTextCount = 0;
let invalidLinkCount = 0;

rawExcelProblems.forEach(p => {
  if (p.text.startsWith('http://') || p.text.startsWith('https://')) {
    urlIsTextCount++;
  }
  if (!p.link || p.link === 'http://solve/' || p.link === 'http://solve') {
    invalidLinkCount++;
  }
});

console.log(`Rows where text is a URL: ${urlIsTextCount}`);
console.log(`Rows with missing/invalid link: ${invalidLinkCount}`);

// Let's print out the ones where text is URL or link is invalid
console.log('\n--- Sample rows where text is URL ---');
console.log(rawExcelProblems.filter(p => p.text.startsWith('http')).slice(0, 10));

console.log('\n--- Sample rows with invalid/missing link ---');
console.log(rawExcelProblems.filter(p => !p.link || p.link.includes('solve')).slice(0, 10));
