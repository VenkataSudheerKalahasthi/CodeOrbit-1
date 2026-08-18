const fs = require('fs');

const streamText = fs.readFileSync('scratch/stream_text.txt', 'utf8');

// Find all JSON array/object blocks that contain problem lists
// Let's search for "Step " or "Arrays" or "Binary Search" in streamText
const lines = streamText.split('\n');
console.log('Total lines in stream_text:', lines.length);

lines.forEach((line, i) => {
  if (line.includes('Learn the Basics') || line.includes('Arrays') || line.includes('Sorting') || line.includes('Binary Search') || line.includes('Dynamic Programming')) {
    console.log(`Line ${i} contains DSA topics, length: ${line.length}, sample: ${line.slice(0, 300)}`);
  }
});
