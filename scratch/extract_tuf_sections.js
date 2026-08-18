const fs = require('fs');

const mdPath = `C:/Users/venka/.gemini/antigravity-ide/brain/d100336f-e5da-494f-bbe0-09e30d29a7d9/.system_generated/steps/170/content.md`;
const text = fs.readFileSync(mdPath, 'utf8');

// Reconstruct streamText
let streamText = '';
let idx = 0;
while ((idx = text.indexOf('self.__next_f.push([1,"', idx)) !== -1) {
  const start = idx + 'self.__next_f.push([1,"'.length;
  let end = start;
  let escaped = false;
  while (end < text.length) {
    if (escaped) escaped = false;
    else if (text[end] === '\\') escaped = true;
    else if (text[end] === '"' && text.slice(end, end + 3) === '"])') break;
    end++;
  }
  const chunk = text.slice(start, end);
  streamText += chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  idx = end + 3;
}

fs.writeFileSync('scratch/stream_text.txt', streamText);
console.log('Saved stream_text.txt, length:', streamText.length);

// Search for step / section keywords
const stepMatches = [];
let match;
const stepRegex = /"step_name":"([^"]+)"/g;
while ((match = stepRegex.exec(streamText)) !== null) {
  stepMatches.push(match[1]);
}
console.log('Found step_name matches:', Array.from(new Set(stepMatches)));

// Let's also check "title" or "section" or "topics"
const topicMatches = [];
const topicRegex = /"topic_name":"([^"]+)"|"title":"([^"]+)"|"category":"([^"]+)"/g;
while ((match = topicRegex.exec(streamText)) !== null) {
  const name = match[1] || match[2] || match[3];
  topicMatches.push(name);
}
console.log('Found topic/title matches sample:', Array.from(new Set(topicMatches)).slice(0, 30));
