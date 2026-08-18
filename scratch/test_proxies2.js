const https = require('https');

function fetchJson(url) {
    return new Promise((resolve) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, cors: res.headers['access-control-allow-origin'], data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, error: e.message, raw: data.slice(0, 150) });
                }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(8000, () => resolve(null));
    });
}

async function testProxies2() {
    console.log('--- Testing api.allorigins.win for CodeChef ---');
    const cc = await fetchJson('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.codechef.com/api/list/contests/all'));
    console.log('CodeChef via allorigins:', cc ? cc.status : 'failed', 'CORS:', cc ? cc.cors : '');
    if (cc && cc.data) {
        console.log('CC Future:', cc.data.future_contests ? cc.data.future_contests.length : 0);
        console.log('CC Past:', cc.data.past_contests ? cc.data.past_contests.length : 0);
    }

    console.log('--- Testing api.allorigins.win for AtCoder ---');
    const ac = await fetchJson('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://kenkoooo.com/atcoder/resources/contests.json'));
    console.log('AtCoder via allorigins:', ac ? ac.status : 'failed', 'CORS:', ac ? ac.cors : '');
    if (ac && Array.isArray(ac.data)) {
        console.log('AtCoder count:', ac.data.length);
    }

    console.log('--- Testing api.codetabs.com for AtCoder ---');
    const ct = await fetchJson('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://kenkoooo.com/atcoder/resources/contests.json'));
    console.log('AtCoder via codetabs:', ct ? ct.status : 'failed', 'CORS:', ct ? ct.cors : '');
}

testProxies2();
