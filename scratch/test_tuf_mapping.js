const fs = require('fs');

const tufRaw = JSON.parse(fs.readFileSync('scratch/tuf_extracted_raw.json', 'utf8'));

console.log('Total TUF raw:', tufRaw.length);

// Let's inspect problem names and articles at boundary indices to confirm section breaks
const sampleIndices = [0, 35, 42, 51, 57, 64, 104, 136, 151, 182, 205, 223, 253, 265, 277, 292, 331, 346, 399, 455, 462, 473];

sampleIndices.forEach(idx => {
  if (tufRaw[idx]) {
    const p = tufRaw[idx];
    console.log(`Index ${idx + 1}: Name="${p.problem_name}" | Article=${p.article}`);
  }
});
