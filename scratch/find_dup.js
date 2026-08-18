const PROBLEMS = require('../js/data.js');

const seen = new Map();
PROBLEMS.forEach(p => {
  const t = p.title.toLowerCase().trim();
  if (seen.has(t)) {
    console.log("Duplicate title:", p.title);
    console.log("  Item 1:", seen.get(t));
    console.log("  Item 2:", p);
  } else {
    seen.set(t, p);
  }
});
