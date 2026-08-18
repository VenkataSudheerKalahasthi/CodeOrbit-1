const fs = require('fs');

const streamText = fs.readFileSync('scratch/stream_text.txt', 'utf8');

// Find all JSON objects and arrays in streamText
// Specifically let's search for "Step " or "Lec " or section titles and inspect their structure
const matches = streamText.match(/\{"id":[^}]+\}/g) || [];
console.log('Sample JSON objects with "id":', matches.slice(0, 10));

// Let's search for strings matching "Step 1" .. "Step 18" or section names
const stepMatches = streamText.match(/Step \d+:[^"\\]+/g) || streamText.match(/Step \d+[^"\\]+/g) || [];
console.log('Found Step titles:', Array.from(new Set(stepMatches)));

// Let's search for all keys in JSON objects inside streamText
const keyMatches = Array.from(new Set(streamText.match(/"[a-zA-Z0-9_]+":/g) || []));
console.log('Sample JSON keys found in streamText:', keyMatches.slice(0, 40));
