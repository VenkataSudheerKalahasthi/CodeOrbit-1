const https = require('https');

function fetchJson(url) {
    return new Promise((resolve) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(5000, () => resolve(null));
    });
}

async function inspectFields() {
    const cc = await fetchJson('https://www.codechef.com/api/list/contests/all');
    if (cc) {
        console.log('CodeChef Past Sample:', JSON.stringify(cc.past_contests ? cc.past_contests.slice(0, 3) : []));
        console.log('CodeChef Future Sample:', JSON.stringify(cc.future_contests ? cc.future_contests.slice(0, 3) : []));
    }

    const comp = await fetchJson('https://competeapi.vercel.app/contests');
    if (comp) {
        console.log('Compete API Sample:', JSON.stringify(Array.isArray(comp) ? comp.slice(0, 5) : comp));
    }

    const ac = await fetchJson('https://kenkoooo.com/atcoder/resources/contests.json');
    if (ac && Array.isArray(ac)) {
        const now = Math.floor(Date.now() / 1000);
        // Find recent or upcoming AtCoder contests (ABC/ARC/AGC)
        const filtered = ac.filter(c => c.id.startsWith('abc') || c.id.startsWith('arc') || c.id.startsWith('agc'));
        console.log('AtCoder Sample Recent:', JSON.stringify(filtered.slice(-5)));
    }
}

inspectFields();
