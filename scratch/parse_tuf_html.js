const fs = require('fs');
const cheerio = require('cheerio');

const mdPath = `C:/Users/venka/.gemini/antigravity-ide/brain/d100336f-e5da-494f-bbe0-09e30d29a7d9/.system_generated/steps/170/content.md`;
const text = fs.readFileSync(mdPath, 'utf8');

// Check for __NEXT_DATA__
const nextDataMatch = text.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);

if (nextDataMatch) {
  console.log('Found __NEXT_DATA__!');
  try {
    const data = JSON.parse(nextDataMatch[1]);
    fs.writeFileSync('scratch/next_data.json', JSON.stringify(data, null, 2));
    console.log('Saved __NEXT_DATA__ to scratch/next_data.json');
  } catch (e) {
    console.log('Error parsing __NEXT_DATA__ JSON:', e.message);
  }
} else {
  console.log('__NEXT_DATA__ script tag not found directly.');
}

// Let's use cheerio to parse HTML
const $ = cheerio.load(text);

// Find script tags
$('script').each((i, el) => {
  const content = $(el).html();
  if (content && (content.includes('props') || content.includes('pageProps') || content.includes('sheet') || content.includes('474'))) {
    console.log(`Script ${i} snippet:`, content.slice(0, 200));
  }
});
