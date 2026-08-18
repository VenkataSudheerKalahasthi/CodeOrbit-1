const fs = require('fs');

const mdPath = `C:/Users/venka/.gemini/antigravity-ide/brain/d100336f-e5da-494f-bbe0-09e30d29a7d9/.system_generated/steps/170/content.md`;
const text = fs.readFileSync(mdPath, 'utf8');

console.log('Sample content.md snippet (lines 1 to 100):');
console.log(text.split('\n').slice(0, 100).join('\n'));

// Check for URLs in text
const rawUrls = text.match(/https?:\/\/[^\s"'<>\)]+/g) || [];
console.log('Total raw URLs found:', rawUrls.length);

const leetcodeUrls = rawUrls.filter(u => u.includes('leetcode.com'));
const gfgUrls = rawUrls.filter(u => u.includes('geeksforgeeks.org'));
const tufUrls = rawUrls.filter(u => u.includes('takeuforward.org'));

console.log('LeetCode URLs:', leetcodeUrls.length);
console.log('GFG URLs:', gfgUrls.length);
console.log('TUF URLs:', tufUrls.length);

console.log('Sample LeetCode URLs:', leetcodeUrls.slice(0, 10));
console.log('Sample GFG URLs:', gfgUrls.slice(0, 10));
