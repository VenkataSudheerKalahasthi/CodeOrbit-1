const XLSX = require('xlsx');
const fs = require('fs');

// Helper to normalize strings for comparison
function normalizeTitle(t) {
  if (!t) return '';
  return String(t)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(u) {
  if (!u || u === '$undefined' || u.includes('solve')) return '';
  let url = String(u).trim();
  url = url.replace(/&amp;/g, '&');
  // strip trailing slash
  url = url.replace(/\/+$/, '');
  // strip query parameters and fragment anchors
  url = url.split('?')[0].split('#')[0];
  return url.toLowerCase();
}

function titleFromUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    let slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
    if (slug === 'problems' && parts.length >= 2) slug = parts[parts.length - 2];
    if (!slug) return url;
    let title = slug.replace(/[-_]/g, ' ');
    // capitalize words
    return title.replace(/\b\w/g, l => l.toUpperCase());
  } catch (e) {
    return url;
  }
}

function detectPlatform(url) {
  if (!url) return 'Other';
  const l = url.toLowerCase();
  if (l.includes('leetcode.com')) return 'LeetCode';
  if (l.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
  if (l.includes('codechef.com')) return 'CodeChef';
  if (l.includes('hackerrank.com')) return 'HackerRank';
  if (l.includes('codeforces.com')) return 'CodeForces';
  if (l.includes('atcoder.jp')) return 'AtCoder';
  if (l.includes('codingninjas.com') || l.includes('code360')) return 'CodingNinjas';
  if (l.includes('takeuforward.org')) return 'TakeUForward';
  return 'Other';
}

function cleanDifficulty(diff) {
  if (!diff) return 'Medium';
  const d = String(diff).trim().toLowerCase();
  if (d.startsWith('e')) return 'Easy';
  if (d.startsWith('m')) return 'Medium';
  if (d.startsWith('h')) return 'Hard';
  return 'Medium';
}

// Map Excel topics to standard DSA section titles
function mapExcelTopicToSection(excelTopic) {
  if (!excelTopic) return 'Additional Practice';
  const t = excelTopic.trim().toLowerCase();
  if (t.includes('math')) return 'Learn the Basics';
  if (t.includes('array')) return 'Arrays';
  if (t.includes('string')) return 'Strings';
  if (t.includes('sort')) return 'Learn Important Sorting Techniques';
  if (t.includes('binary search') || t.includes('search')) return 'Binary Search';
  if (t.includes('linked')) return 'Linked List';
  if (t.includes('recursion')) return 'Recursion';
  if (t.includes('bit')) return 'Bit Manipulation';
  if (t.includes('stack') || t.includes('queue')) return 'Stack and Queue';
  if (t.includes('sliding') || t.includes('pointer')) return 'Sliding Window & Two Pointer';
  if (t.includes('heap')) return 'Heaps';
  if (t.includes('greedy')) return 'Greedy Algorithms';
  if (t.includes('tree')) return 'Binary Trees';
  if (t.includes('bst')) return 'Binary Search Trees';
  if (t.includes('graph')) return 'Graphs';
  if (t.includes('dp') || t.includes('dynamic')) return 'Dynamic Programming';
  if (t.includes('trie')) return 'Tries';
  return excelTopic;
}

// 1. Process Excel
const excelPath = 'c:/Users/venka/OneDrive/Documents/Desktop/dsa/60DaysPractice.xlsx';
const wb = XLSX.readFile(excelPath, { cellHyperlinks: true });
const sheet = wb.Sheets['Sheet1'];
const range = XLSX.utils.decode_range(sheet['!ref']);

const excelProblems = [];

for (let r = range.s.r; r <= range.e.r; r++) {
  const col0 = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
  const col1 = sheet[XLSX.utils.encode_cell({ r, c: 1 })];

  const rawTopic = col0 ? String(col0.v).trim() : null;
  let rawText = col1 ? String(col1.v).trim() : null;
  let rawLink = col1 && col1.l ? col1.l.Target : null;

  if (rawTopic && rawText && !rawText.includes('CODING PROBLEMS') && !rawText.includes('Follow Striver Sheet') && rawText !== 'TOPICS') {
    if (rawText.startsWith('http://') || rawText.startsWith('https://')) {
      if (!rawLink) rawLink = rawText;
      rawText = titleFromUrl(rawLink);
    }
    
    let link = rawLink ? rawLink.replace(/&amp;/g, '&') : null;
    if (link === 'http://solve/' || link === 'http://solve') link = null;

    const title = rawText;
    const topic = rawTopic;
    const section = mapExcelTopicToSection(rawTopic);
    const platform = detectPlatform(link);
    const normTitle = normalizeTitle(title);
    const normUrl = normalizeUrl(link);

    excelProblems.push({
      excelIndex: excelProblems.length + 1,
      title,
      topic,
      section,
      difficulty: 'Medium', // Excel doesn't have explicit difficulty col
      platform,
      url: link,
      normTitle,
      normUrl,
      source: '60DaysPractice'
    });
  }
}

console.log(`SOURCE 1 (60DaysPractice.xlsx) parsed: ${excelProblems.length} valid problem records`);

// 2. Process Striver A2Z
const tufRaw = JSON.parse(fs.readFileSync('scratch/tuf_extracted_raw.json', 'utf8'));

const tufProblems = tufRaw.map((p, idx) => {
  let url = null;
  if (p.leetcode && p.leetcode !== '$undefined' && p.leetcode.includes('http')) {
    url = p.leetcode.replace(/\\$/g, '').replace(/\\/g, '');
  } else if (p.gfg && p.gfg !== '$undefined' && p.gfg.includes('http')) {
    url = p.gfg.replace(/\\$/g, '').replace(/\\/g, '');
  } else if (p.codingninjas && p.codingninjas !== '$undefined' && p.codingninjas.includes('http')) {
    url = p.codingninjas.replace(/\\$/g, '').replace(/\\/g, '');
  } else if (p.plus && p.plus !== '$undefined') {
    url = 'https://takeuforward.org' + p.plus;
  } else if (p.article && p.article !== '$undefined' && p.article.includes('http')) {
    url = p.article;
  }

  if (url) url = url.replace(/&amp;/g, '&');

  const title = p.problem_name;
  const normTitle = normalizeTitle(title);
  const normUrl = normalizeUrl(url);
  const platform = detectPlatform(url);
  const difficulty = cleanDifficulty(p.difficulty);

  return {
    tufIndex: idx + 1,
    title,
    topic: 'Striver A2Z',
    section: 'Striver A2Z',
    difficulty,
    platform,
    url,
    normTitle,
    normUrl,
    source: 'Striver A2Z'
  };
});

console.log(`SOURCE 2 (Striver A2Z Sheet) parsed: ${tufProblems.length} valid problem records`);

// 3. Deduplicate
const masterList = [];
let duplicatesFound = 0;

// We process TUF problems first to maintain A2Z ordering, then merge Excel problems
const titleMap = new Map();
const urlMap = new Map();

tufProblems.forEach(p => {
  masterList.push(p);
  if (p.normTitle) titleMap.set(p.normTitle, p);
  if (p.normUrl) urlMap.set(p.normUrl, p);
});

excelProblems.forEach(ep => {
  let existing = null;
  if (ep.normUrl && urlMap.has(ep.normUrl)) {
    existing = urlMap.get(ep.normUrl);
  } else if (ep.normTitle && titleMap.has(ep.normTitle)) {
    existing = titleMap.get(ep.normTitle);
  }

  if (existing) {
    duplicatesFound++;
    existing.source = 'Both';
    // If ep has a direct platform link (e.g. LeetCode) and existing has generic, upgrade URL
    if (ep.url && detectPlatform(ep.url) !== 'TakeUForward' && detectPlatform(ep.url) !== 'Other') {
      if (!existing.url || detectPlatform(existing.url) === 'TakeUForward' || detectPlatform(existing.url) === 'Other') {
        existing.url = ep.url;
        existing.platform = ep.platform;
      }
    }
  } else {
    masterList.push(ep);
    if (ep.normTitle) titleMap.set(ep.normTitle, ep);
    if (ep.normUrl) urlMap.set(ep.normUrl, ep);
  }
});

console.log(`\nDEDUPLICATION SUMMARY:`);
console.log(`SOURCE 1 (60DaysPractice): ${excelProblems.length}`);
console.log(`SOURCE 2 (Striver A2Z): ${tufProblems.length}`);
console.log(`DUPLICATES FOUND: ${duplicatesFound}`);
console.log(`FINAL UNIQUE PROBLEMS: ${masterList.length}`);

// Breakdown statistics
let easyCount = 0, medCount = 0, hardCount = 0;
const platformCounts = {};

masterList.forEach(p => {
  if (p.difficulty === 'Easy') easyCount++;
  else if (p.difficulty === 'Hard') hardCount++;
  else medCount++;

  platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1;
});

console.log(`\nDIFFICULTY BREAKDOWN:`);
console.log(`Easy: ${easyCount}, Medium: ${medCount}, Hard: ${hardCount}`);

console.log(`\nPLATFORM BREAKDOWN:`);
console.log(platformCounts);
