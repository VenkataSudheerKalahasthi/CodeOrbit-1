const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/tuf_extracted_raw.json', 'utf8'));

console.log('Total extracted TUF problems:', raw.length);

for (let i = 0; i < Math.min(50, raw.length); i++) {
  const p = raw[i];
  console.log(`[${i + 1}] ID: ${p.problem_id} | Title: "${p.problem_name}" | Diff: ${p.difficulty} | LeetCode: ${p.leetcode} | Article: ${p.article}`);
}
