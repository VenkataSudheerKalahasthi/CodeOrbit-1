const https = require('https');

function checkCors(url, postData = null) {
    return new Promise((resolve) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: postData ? 'POST' : 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            console.log(url);
            console.log('  Status:', res.statusCode);
            console.log('  CORS Origin Header:', res.headers['access-control-allow-origin'] || 'NONE');
            resolve();
        });
        req.on('error', (e) => {
            console.log(url, 'Error:', e.message);
            resolve();
        });
        if (postData) req.write(JSON.stringify(postData));
        req.end();
    });
}

async function run() {
    await checkCors('https://codeforces.com/api/contest.list');
    await checkCors('https://leetcode.com/graphql', { query: 'query { allContests { title titleSlug startTime duration } }' });
    await checkCors('https://alfa-leetcode-api.onrender.com/contests');
    await checkCors('https://www.codechef.com/api/list/contests/all');
    await checkCors('https://kenkoooo.com/atcoder/resources/contests.json');
}

run();
