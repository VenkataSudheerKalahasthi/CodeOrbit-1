const fs = require('fs');

const mdPath = `C:/Users/venka/.gemini/antigravity-ide/brain/d100336f-e5da-494f-bbe0-09e30d29a7d9/.system_generated/steps/170/content.md`;
const text = fs.readFileSync(mdPath, 'utf8');

// The text contains self.__next_f.push(...) calls with JSON strings.
// Let's reconstruct the concatenated stream text.

let streamText = '';
const pushRegex = /self\.__next_f\.push\(\[1,"([^\"]+)"\]\)/g;

// Instead of simple regex, let's find all self.__next_f.push([1,"..."])
let idx = 0;
while ((idx = text.indexOf('self.__next_f.push([1,"', idx)) !== -1) {
  const start = idx + 'self.__next_f.push([1,"'.length;
  // Find matching end '"])' taking escaping into account
  let end = start;
  let escaped = false;
  while (end < text.length) {
    if (escaped) {
      escaped = false;
    } else if (text[end] === '\\') {
      escaped = true;
    } else if (text[end] === '"' && text.slice(end, end + 3) === '"])') {
      break;
    }
    end++;
  }
  const chunk = text.slice(start, end);
  // Unescape standard double quotes and backslashes in chunk
  streamText += chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  idx = end + 3;
}

console.log('Total reconstructed stream text length:', streamText.length);

// Let's search for JSON objects or regex matches for problem items
// A problem object typically has "problem_name"
const problemRegex = /\{[^{}]*"problem_name"[^{}]*\}/g;
// Alternatively, let's find all occurrences of problem_name and extract surrounding JSON
const matches = [];
let pIdx = 0;
while ((pIdx = streamText.indexOf('"problem_name"', pIdx)) !== -1) {
  // Backtrack to find start of object '{'
  let objStart = pIdx;
  let braceDepth = 0;
  while (objStart > 0) {
    if (streamText[objStart] === '}') braceDepth++;
    if (streamText[objStart] === '{') {
      if (braceDepth === 0) break;
      braceDepth--;
    }
    objStart--;
  }

  // Forward track to find end of object '}'
  let objEnd = pIdx;
  braceDepth = 0;
  while (objEnd < streamText.length) {
    if (streamText[objEnd] === '{') braceDepth++;
    if (streamText[objEnd] === '}') {
      if (braceDepth === 0) break;
      braceDepth--;
    }
    objEnd++;
  }

  const objStr = streamText.slice(objStart, objEnd + 1);
  try {
    // Fix unicode escapes if any
    const cleanStr = objStr.replace(/\\u0026/g, '&');
    const parsed = JSON.parse(cleanStr);
    matches.push(parsed);
  } catch (e) {
    // If simple parse fails, store raw string
    matches.push({ raw: objStr });
  }

  pIdx += '"problem_name"'.length;
}

console.log(`Found ${matches.length} problem instances!`);
console.log('Sample parsed problem 0:', matches[0]);
console.log('Sample parsed problem 1:', matches[1]);

fs.writeFileSync('scratch/tuf_extracted_raw.json', JSON.stringify(matches, null, 2));
console.log('Saved to scratch/tuf_extracted_raw.json');
