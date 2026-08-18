const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/tuf_extracted_raw.json', 'utf8'));

console.log(`Loaded ${raw.length} raw problems from tuf_extracted_raw.json`);

// Inspect fields across all problems
const keys = new Set();
raw.forEach(p => Object.keys(p).forEach(k => keys.add(k)));
console.log('All keys found in problem objects:', Array.from(keys));

// Check links breakdown
let leetcodeCount = 0;
let gfgCount = 0;
let cnCount = 0;
let tufArticleCount = 0;
let ytCount = 0;

raw.forEach(p => {
  if (p.leetcode && p.leetcode !== '$undefined' && p.leetcode.includes('http')) leetcodeCount++;
  if (p.gfg && p.gfg !== '$undefined' && p.gfg.includes('http')) gfgCount++;
  if (p.codingninjas && p.codingninjas !== '$undefined' && p.codingninjas.includes('http')) cnCount++;
  if (p.article && p.article !== '$undefined' && p.article.includes('http')) tufArticleCount++;
  if (p.youtube && p.youtube !== '$undefined' && p.youtube.includes('http')) ytCount++;
});

console.log(`LeetCode links: ${leetcodeCount}`);
console.log(`GFG links: ${gfgCount}`);
console.log(`CodingNinjas links: ${cnCount}`);
console.log(`TUF Article links: ${tufArticleCount}`);
console.log(`YouTube links: ${ytCount}`);

// Inspect sample problems with various fields
console.log('\n--- Sample problem 10 ---');
console.log(raw[10]);

console.log('\n--- Sample problem 50 ---');
console.log(raw[50]);

console.log('\n--- Sample problem 100 ---');
console.log(raw[100]);
