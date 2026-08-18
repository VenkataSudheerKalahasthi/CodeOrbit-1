const https = require('https');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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
    });
}

async function testAll() {
    console.log('Testing APIs...');
    
    // 1. Codeforces Official API
    try {
        const cf = await fetchJson('https://codeforces.com/api/contest.list');
        console.log('Codeforces Status:', cf.status, 'Result count:', cf.data && cf.data.result ? cf.data.result.length : 0);
        if (cf.data && cf.data.result) {
            const upcomingCF = cf.data.result.filter(c => c.phase === 'BEFORE' || c.phase === 'CODING').slice(0, 3);
            console.log('Sample CF:', JSON.stringify(upcomingCF));
        }
    } catch (e) {
        console.log('Codeforces Error:', e.message);
    }

    // 2. Kontests API
    try {
        const kt = await fetchJson('https://kontests.net/api/v1/all');
        console.log('Kontests API Status:', kt.status, 'Count:', Array.isArray(kt.data) ? kt.data.length : 0);
        if (Array.isArray(kt.data)) {
            console.log('Sample Kontests:', JSON.stringify(kt.data.slice(0, 3)));
        }
    } catch (e) {
        console.log('Kontests API Error:', e.message);
    }
}

testAll();
