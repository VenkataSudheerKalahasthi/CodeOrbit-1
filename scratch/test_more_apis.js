const https = require('https');

function fetchJson(url, postData = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: postData ? 'POST' : 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, error: e.message, raw: data.slice(0, 200) });
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(8000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
}

async function testAPIs() {
    console.log('--- Testing LeetCode GraphQL ---');
    try {
        const query = {
            query: `query {
                topTwoContests { title titleSlug startTime duration cardImg }
                allContests { title titleSlug startTime duration cardImg }
            }`
        };
        const lc = await fetchJson('https://leetcode.com/graphql', query);
        console.log('LC Status:', lc.status, 'Data keys:', lc.data ? Object.keys(lc.data) : null);
        if (lc.data && lc.data.data) {
            console.log('LC Top Two:', JSON.stringify(lc.data.data.topTwoContests));
            console.log('LC All sample:', JSON.stringify(lc.data.data.allContests ? lc.data.data.allContests.slice(0, 3) : []));
        }
    } catch (e) {
        console.log('LC GraphQL Error:', e.message);
    }

    console.log('--- Testing LeetCode Alfa API ---');
    try {
        const alfa = await fetchJson('https://alfa-leetcode-api.onrender.com/contests');
        console.log('Alfa Status:', alfa.status);
        if (alfa.data) {
            console.log('Alfa Sample:', JSON.stringify(alfa.data).slice(0, 300));
        }
    } catch (e) {
        console.log('Alfa Error:', e.message);
    }

    console.log('--- Testing Clist API / Compete APIs ---');
    try {
        const comp = await fetchJson('https://competeapi.vercel.app/contests');
        console.log('Compete API Status:', comp.status);
        if (comp.data) {
            console.log('Compete Sample:', JSON.stringify(comp.data).slice(0, 300));
        }
    } catch (e) {
        console.log('Compete API Error:', e.message);
    }

    console.log('--- Testing CodeChef API ---');
    try {
        const cc = await fetchJson('https://www.codechef.com/api/list/contests/all');
        console.log('CodeChef Status:', cc.status, 'Keys:', cc.data ? Object.keys(cc.data) : null);
        if (cc.data) {
            console.log('CC Present:', cc.data.present_contests ? cc.data.present_contests.length : 0);
            console.log('CC Future:', cc.data.future_contests ? cc.data.future_contests.length : 0);
            console.log('CC Sample Future:', JSON.stringify(cc.data.future_contests ? cc.data.future_contests.slice(0, 2) : []));
        }
    } catch (e) {
        console.log('CodeChef Error:', e.message);
    }

    console.log('--- Testing AtCoder / Kenkoooo API ---');
    try {
        const ac = await fetchJson('https://kenkoooo.com/atcoder/resources/contests.json');
        console.log('Kenkoooo Status:', ac.status, 'Count:', Array.isArray(ac.data) ? ac.data.length : 0);
        if (Array.isArray(ac.data)) {
            const now = Math.floor(Date.now() / 1000);
            const upcomingAC = ac.data.filter(c => c.start_epoch_second + c.duration_second > now - 86400 * 7).slice(-5);
            console.log('Sample AC:', JSON.stringify(upcomingAC));
        }
    } catch (e) {
        console.log('AtCoder Error:', e.message);
    }
}

testAPIs();
