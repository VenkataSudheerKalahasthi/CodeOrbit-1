const https = require('https');

function fetchUrl(url, options = {}) {
    return new Promise((resolve) => {
        const parsedUrl = new URL(url);
        const reqOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                ...options.headers
            }
        };

        const req = https.request(reqOptions, (res) => {
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
        req.setTimeout(8000, () => resolve(null));
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
    });
}

async function testNormalizer() {
    const contests = [];
    const nowMs = Date.now();

    // 1. Codeforces
    try {
        const cfData = await fetchUrl('https://codeforces.com/api/contest.list');
        if (cfData && cfData.status === 'OK' && Array.isArray(cfData.result)) {
            const cfItems = cfData.result.filter(c => {
                const endMs = (c.startTimeSeconds + c.durationSeconds) * 1000;
                return endMs > nowMs - 7 * 24 * 60 * 60 * 1000; // Last 7 days to future
            });
            cfItems.forEach(c => {
                const startMs = c.startTimeSeconds * 1000;
                const endMs = (c.startTimeSeconds + c.durationSeconds) * 1000;
                let category = "MEDIUM";
                if (c.name.includes("Div. 3") || c.name.includes("Div. 4")) category = "EASY";
                else if (c.name.includes("Div. 1")) category = "ADVANCED";

                contests.push({
                    id: `codeforces_${c.id}`,
                    platform: "CodeForces",
                    title: c.name,
                    category: category,
                    startTime: new Date(startMs).toISOString(),
                    endTime: new Date(endMs).toISOString(),
                    startMs,
                    endMs,
                    contestUrl: `https://codeforces.com/contest/${c.id}`,
                    problemsUrl: `https://codeforces.com/contest/${c.id}/problems`
                });
            });
            console.log(`Codeforces loaded: ${cfItems.length} contests.`);
        }
    } catch (e) {
        console.error("CF Error:", e);
    }

    // 2. LeetCode
    try {
        const lcData = await fetchUrl('https://alfa-leetcode-api.onrender.com/contests');
        if (lcData && Array.isArray(lcData.allContests)) {
            const lcItems = lcData.allContests.filter(c => {
                const endMs = (c.startTime + c.duration) * 1000;
                return endMs > nowMs - 7 * 24 * 60 * 60 * 1000;
            });
            lcItems.forEach(c => {
                const startMs = c.startTime * 1000;
                const endMs = (c.startTime + c.duration) * 1000;
                const isBiweekly = c.title.toLowerCase().includes("biweekly");

                contests.push({
                    id: `leetcode_${c.titleSlug || c.title}`,
                    platform: "LeetCode",
                    title: c.title,
                    category: isBiweekly ? "ADVANCED" : "MEDIUM",
                    startTime: new Date(startMs).toISOString(),
                    endTime: new Date(endMs).toISOString(),
                    startMs,
                    endMs,
                    contestUrl: `https://leetcode.com/contest/${c.titleSlug}/`,
                    problemsUrl: `https://leetcode.com/contest/${c.titleSlug}/`
                });
            });
            console.log(`LeetCode loaded: ${lcItems.length} contests.`);
        }
    } catch (e) {
        console.error("LC Error:", e);
    }

    // Print summary
    console.log(`Total Normalized Contests: ${contests.length}`);
    const live = contests.filter(c => nowMs >= c.startMs && nowMs <= c.endMs);
    const upcoming = contests.filter(c => nowMs < c.startMs);
    const ended = contests.filter(c => nowMs > c.endMs);
    console.log(`Live: ${live.length}, Upcoming: ${upcoming.length}, Ended: ${ended.length}`);
    if (upcoming.length > 0) console.log("Next upcoming:", upcoming[0]);
}

testNormalizer();
