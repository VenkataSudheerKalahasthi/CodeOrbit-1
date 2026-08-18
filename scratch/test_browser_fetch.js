async function testBrowserFetch() {
    console.log("==========================================");
    console.log("TESTING DIRECT BROWSER-LIKE FETCH & CORS");
    console.log("==========================================");

    // 1. Codeforces
    try {
        console.log("\n--- Testing Codeforces ---");
        const res = await fetch("https://codeforces.com/api/contest.list");
        console.log("Status:", res.status, "CORS header:", res.headers.get("access-control-allow-origin"));
        if (res.ok) {
            const json = await res.json();
            if (json.status === "OK" && Array.isArray(json.result)) {
                const upcoming = json.result.filter(c => c.phase === "BEFORE" || c.phase === "CODING");
                console.log(`✓ Codeforces verified: ${json.result.length} total contests, ${upcoming.length} upcoming/live contests.`);
                console.log("Sample CF item:", upcoming[0] || json.result[0]);
            }
        }
    } catch (e) {
        console.log("❌ Codeforces Failed:", e.message);
    }

    // 2. LeetCode (Alfa API)
    try {
        console.log("\n--- Testing LeetCode (Alfa API) ---");
        const res = await fetch("https://alfa-leetcode-api.onrender.com/contests");
        console.log("Status:", res.status, "CORS header:", res.headers.get("access-control-allow-origin"));
        if (res.ok) {
            const json = await res.json();
            if (json && Array.isArray(json.allContests)) {
                const now = Math.floor(Date.now() / 1000);
                const active = json.allContests.filter(c => c.startTime + c.duration > now - 86400 * 7);
                console.log(`✓ LeetCode verified: ${json.allContests.length} total contests, ${active.length} active/recent contests.`);
                console.log("Sample LC item:", active[0] || json.allContests[0]);
            }
        }
    } catch (e) {
        console.log("❌ LeetCode Alfa Failed:", e.message);
    }

    // 3. LeetCode Official GraphQL
    try {
        console.log("\n--- Testing LeetCode GraphQL ---");
        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: "query { allContests { title titleSlug startTime duration } }"
            })
        });
        console.log("Status:", res.status, "CORS header:", res.headers.get("access-control-allow-origin"));
        if (res.ok) {
            const json = await res.json();
            if (json && json.data && json.data.allContests) {
                console.log(`✓ LeetCode GraphQL verified: ${json.data.allContests.length} contests.`);
            }
        }
    } catch (e) {
        console.log("❌ LeetCode GraphQL Failed:", e.message);
    }

    // 4. CodeChef
    try {
        console.log("\n--- Testing CodeChef Direct ---");
        const res = await fetch("https://www.codechef.com/api/list/contests/all");
        console.log("Status:", res.status, "CORS header:", res.headers.get("access-control-allow-origin"));
    } catch (e) {
        console.log("❌ CodeChef Direct Failed:", e.message);
    }

    // 5. AtCoder / Kenkoooo
    try {
        console.log("\n--- Testing AtCoder (Kenkoooo) ---");
        const res = await fetch("https://kenkoooo.com/atcoder/resources/contests.json");
        console.log("Status:", res.status, "CORS header:", res.headers.get("access-control-allow-origin"));
        if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json)) {
                console.log(`✓ AtCoder verified: ${json.length} contests.`);
            }
        }
    } catch (e) {
        console.log("❌ AtCoder Failed:", e.message);
    }
}

testBrowserFetch();
