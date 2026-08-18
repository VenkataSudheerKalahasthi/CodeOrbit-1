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
                    resolve({ status: res.statusCode, error: e.message });
                }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(5000, () => resolve(null));
    });
}

async function testProxies() {
    console.log('--- Testing corsproxy.io for CodeChef ---');
    const cc = await fetchJson('https://corsproxy.io/?' + encodeURIComponent('https://www.codechef.com/api/list/contests/all'));
    console.log('CodeChef via corsproxy:', cc ? cc.status : 'failed', 'CORS:', cc ? cc.cors : '');

    console.log('--- Testing corsproxy.io for AtCoder ---');
    const ac = await fetchJson('https://corsproxy.io/?' + encodeURIComponent('https://kenkoooo.com/atcoder/resources/contests.json'));
    console.log('AtCoder via corsproxy:', ac ? ac.status : 'failed', 'CORS:', ac ? ac.cors : '');
    if (ac && ac.data && Array.isArray(ac.data)) {
        console.log('AtCoder count:', ac.data.length);
    }
}

testProxies();
