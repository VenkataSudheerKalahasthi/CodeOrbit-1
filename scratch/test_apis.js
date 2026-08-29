const https = require('https');

async function testFetch(url, options = {}) {
    return new Promise((resolve) => {
        try {
            const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({ status: res.statusCode, length: data.length, sample: data.slice(0, 200) });
                });
            });
            req.on('error', (err) => resolve({ error: err.message }));
            req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
        } catch (e) {
            resolve({ error: e.message });
        }
    });
}

async function run() {
    const urls = [
        "https://codeforces.com/api/contest.list",
        "https://kontests.net/api/v1/all",
        "https://kontests.net/api/v1/leet_code",
        "https://alfa-leetcode-api.onrender.com/contests",
        "https://kenkoooo.com/atcoder/resources/contests.json",
        "https://practiceapi.geeksforgeeks.org/api/v1/events/?type=contest",
        "https://www.codechef.com/api/list/contests/all"
    ];
    for (const url of urls) {
        const res = await testFetch(url);
        console.log(url, res.status ? `Status: ${res.status}, Length: ${res.length}` : `Error: ${res.error}`);
        if (res.sample) console.log("  Sample:", res.sample.slice(0, 100));
    }
}
run();
