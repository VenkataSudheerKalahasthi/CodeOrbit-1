const XLSX = require('xlsx');
const fs = require('fs');

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
  url = url.replace(/\/+$/, '');
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

function getLevel(diff) {
  if (diff === 'Easy') return 'BEGINNER';
  if (diff === 'Hard') return 'ADVANCED';
  return 'CORE';
}

function getTufSectionInfo(index) {
  if (index <= 57) return { section: "01 — Learn the Basics", order: 1 };
  if (index <= 64) return { section: "02 — Learn Important Sorting Techniques", order: 2 };
  if (index <= 104) return { section: "03 — Arrays", order: 3 };
  if (index <= 136) return { section: "04 — Binary Search", order: 4 };
  if (index <= 151) return { section: "05 — Strings", order: 5 };
  if (index <= 182) return { section: "06 — Learn LinkedList", order: 6 };
  if (index <= 205) return { section: "07 — Recursion", order: 7 };
  if (index <= 223) return { section: "08 — Bit Manipulation", order: 8 };
  if (index <= 253) return { section: "09 — Stack and Queues", order: 9 };
  if (index <= 265) return { section: "10 — Sliding Window & Two Pointer", order: 10 };
  if (index <= 277) return { section: "11 — Heaps", order: 11 };
  if (index <= 292) return { section: "12 — Greedy Algorithms", order: 12 };
  if (index <= 331) return { section: "13 — Binary Trees", order: 13 };
  if (index <= 346) return { section: "14 — Binary Search Trees", order: 14 };
  if (index <= 399) return { section: "15 — Graphs", order: 15 };
  if (index <= 455) return { section: "16 — Dynamic Programming", order: 16 };
  if (index <= 462) return { section: "17 — Tries", order: 17 };
  return { section: "18 — Advanced Strings & Practice", order: 18 };
}

function getExcelSectionInfo(excelTopic) {
  if (!excelTopic) return { section: "19 — Additional Practice", order: 19 };
  const t = excelTopic.trim().toLowerCase();
  if (t.includes('math')) return { section: "01 — Learn the Basics", order: 1 };
  if (t.includes('sort')) return { section: "02 — Learn Important Sorting Techniques", order: 2 };
  if (t.includes('array')) return { section: "03 — Arrays", order: 3 };
  if (t.includes('binary search') || t.includes('search')) return { section: "04 — Binary Search", order: 4 };
  if (t.includes('string')) return { section: "05 — Strings", order: 5 };
  if (t.includes('linked')) return { section: "06 — Learn LinkedList", order: 6 };
  if (t.includes('recursion')) return { section: "07 — Recursion", order: 7 };
  if (t.includes('bit')) return { section: "08 — Bit Manipulation", order: 8 };
  if (t.includes('stack') || t.includes('queue')) return { section: "09 — Stack and Queues", order: 9 };
  if (t.includes('sliding') || t.includes('pointer')) return { section: "10 — Sliding Window & Two Pointer", order: 10 };
  if (t.includes('heap')) return { section: "11 — Heaps", order: 11 };
  if (t.includes('greedy')) return { section: "12 — Greedy Algorithms", order: 12 };
  if (t.includes('tree')) return { section: "13 — Binary Trees", order: 13 };
  if (t.includes('bst')) return { section: "14 — Binary Search Trees", order: 14 };
  if (t.includes('graph')) return { section: "15 — Graphs", order: 15 };
  if (t.includes('dp') || t.includes('dynamic')) return { section: "16 — Dynamic Programming", order: 16 };
  if (t.includes('trie')) return { section: "17 — Tries", order: 17 };
  return { section: "19 — Additional Practice", order: 19 };
}

// 1. Load Excel
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
    const secInfo = getExcelSectionInfo(rawTopic);
    const platform = detectPlatform(link);
    const normTitle = normalizeTitle(title);
    const normUrl = normalizeUrl(link);

    excelProblems.push({
      title,
      topic,
      subtopic: rawTopic,
      difficulty: 'Medium',
      platform,
      url: link,
      a2zSection: secInfo.section,
      a2zSectionOrder: secInfo.order,
      normTitle,
      normUrl,
      sourceSheets: ['60DaysPractice'],
      source: '60DaysPractice'
    });
  }
}

// 2. Load TUF
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
  const secInfo = getTufSectionInfo(idx + 1);

  return {
    title,
    topic: secInfo.section,
    subtopic: secInfo.section.split('—')[1]?.trim() || secInfo.section,
    difficulty,
    platform,
    url,
    a2zSection: secInfo.section,
    a2zSectionOrder: secInfo.order,
    a2zProblemOrder: idx + 1,
    normTitle,
    normUrl,
    sourceSheets: ['Striver A2Z'],
    source: 'Striver A2Z'
  };
});

// 3. Deduplicate and merge
const masterList = [];
let duplicatesFound = 0;

const titleMap = new Map();
const urlMap = new Map();

// Add TUF problems (deduplicating internally if identical title or url occurs in TUF)
tufProblems.forEach(p => {
  let existing = null;
  if (p.normUrl && urlMap.has(p.normUrl)) {
    existing = urlMap.get(p.normUrl);
  } else if (p.normTitle && titleMap.has(p.normTitle)) {
    existing = titleMap.get(p.normTitle);
  }

  if (!existing) {
    masterList.push(p);
    if (p.normTitle) titleMap.set(p.normTitle, p);
    if (p.normUrl) urlMap.set(p.normUrl, p);
  }
});

// Merge Excel problems
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
    if (!existing.sourceSheets.includes('60DaysPractice')) {
      existing.sourceSheets.push('60DaysPractice');
    }
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

// Assign numeric IDs and levels
masterList.forEach((p, index) => {
  p.id = index + 1;
  p.level = getLevel(p.difficulty);
  delete p.normTitle;
  delete p.normUrl;
});

console.log(`Final unique master list count: ${masterList.length}`);

// Generate js/data.js content
const headerComment = `/**
 * Ctrl+Alt+Career Master Problem Database
 * Merged & Deduplicated Dataset: Striver A2Z Sheet (${tufProblems.length} problems) + 60DaysPractice Sheet (${excelProblems.length} problems)
 * Deduplication Metrics:
 * - Source 1 (60DaysPractice): ${excelProblems.length} problems
 * - Source 2 (Striver A2Z): ${tufProblems.length} problems
 * - Duplicates Removed: ${duplicatesFound} problems
 * - Final Unique Total: ${masterList.length} problems
 */

`;

const jsContent = headerComment + `const PROBLEMS = ` + JSON.stringify(masterList, null, 2) + `;\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = PROBLEMS;\n}\n`;

fs.writeFileSync('c:/Users/venka/OneDrive/Documents/Desktop/dsa/js/data.js', jsContent, 'utf8');
console.log('Successfully written c:/Users/venka/OneDrive/Documents/Desktop/dsa/js/data.js!');
