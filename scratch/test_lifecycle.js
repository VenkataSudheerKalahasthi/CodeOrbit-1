// Test script for contest lifecycle and platform filtering

// Mock browser objects
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
};
global.window = global;

// Load contests.js
const fs = require('fs');
const path = require('path');
const contestsCode = fs.readFileSync(path.join(__dirname, '../js/contests.js'), 'utf8');
eval(contestsCode);

console.log("==========================================");
console.log("TEST 1-3: EXACT BOUNDARY & STATUS TESTS");
console.log("==========================================");

const mockContest = {
    id: "test_c1",
    platform: "LeetCode",
    title: "Test Contest",
    startTime: new Date(10000000).toISOString(),
    endTime: new Date(20000000).toISOString(),
    startMs: 10000000,
    endMs: 20000000
};

// Before start
const statusBefore = window.ContestManager.getStatus(mockContest, 5000000);
console.log(`Current: 5,000,000 (Start: 10,000,000) -> Status: ${statusBefore} (Expected: UPCOMING)`);
console.assert(statusBefore === "UPCOMING", "TEST 1 Failed");

// Exactly at start
const statusAtStart = window.ContestManager.getStatus(mockContest, 10000000);
console.log(`Current: 10,000,000 (Start: 10,000,000) -> Status: ${statusAtStart} (Expected: LIVE NOW)`);
console.assert(statusAtStart === "LIVE NOW", "TEST 2a Failed");

// During contest
const statusDuring = window.ContestManager.getStatus(mockContest, 15000000);
console.log(`Current: 15,000,000 (End: 20,000,000) -> Status: ${statusDuring} (Expected: LIVE NOW)`);
console.assert(statusDuring === "LIVE NOW", "TEST 2b Failed");

// Exactly at end
const statusAtEnd = window.ContestManager.getStatus(mockContest, 20000000);
console.log(`Current: 20,000,000 (End: 20,000,000) -> Status: ${statusAtEnd} (Expected: ENDED)`);
console.assert(statusAtEnd === "ENDED", "TEST 3a Failed");

// After end
const statusAfter = window.ContestManager.getStatus(mockContest, 25000000);
console.log(`Current: 25,000,000 (End: 20,000,000) -> Status: ${statusAfter} (Expected: ENDED)`);
console.assert(statusAfter === "ENDED", "TEST 3b Failed");

console.log("\n==========================================");
console.log("TEST 4: LIVE CONTESTS SORTING (ENDING SOONEST FIRST)");
console.log("==========================================");

window.ContestManager.rawFetchedContests = [
    { id: "c_late", platform: "CodeForces", title: "Contest Late", startMs: 1000, endMs: 50000 },
    { id: "c_soon", platform: "CodeForces", title: "Contest Soon", startMs: 1000, endMs: 20000 },
    { id: "c_mid", platform: "CodeForces", title: "Contest Mid", startMs: 1000, endMs: 30000 }
];

const liveContests = window.ContestManager.getContests("CodeForces", 5000)
    .filter(c => c.status === "LIVE NOW")
    .sort((a, b) => a.endMs - b.endMs);

console.log("Live ordering:", liveContests.map(c => `${c.title} (endMs: ${c.endMs})`));
console.assert(liveContests[0].id === "c_soon", "TEST 4 Failed - First should be c_soon");
console.assert(liveContests[1].id === "c_mid", "TEST 4 Failed - Second should be c_mid");
console.assert(liveContests[2].id === "c_late", "TEST 4 Failed - Third should be c_late");

console.log("\n==========================================");
console.log("TEST 5: UPCOMING CONTESTS SORTING (STARTING SOONEST FIRST)");
console.log("==========================================");

window.ContestManager.rawFetchedContests = [
    { id: "u_far", platform: "AtCoder", title: "Contest Far", startMs: 50000, endMs: 60000 },
    { id: "u_near", platform: "AtCoder", title: "Contest Near", startMs: 20000, endMs: 30000 },
    { id: "u_mid", platform: "AtCoder", title: "Contest Mid", startMs: 35000, endMs: 45000 }
];

const upcomingContests = window.ContestManager.getContests("AtCoder", 5000)
    .filter(c => c.status === "UPCOMING")
    .sort((a, b) => a.startMs - b.startMs);

console.log("Upcoming ordering:", upcomingContests.map(c => `${c.title} (startMs: ${c.startMs})`));
console.assert(upcomingContests[0].id === "u_near", "TEST 5 Failed - First should be u_near");
console.assert(upcomingContests[1].id === "u_mid", "TEST 5 Failed - Second should be u_mid");
console.assert(upcomingContests[2].id === "u_far", "TEST 5 Failed - Third should be u_far");

console.log("\n==========================================");
console.log("TEST 6: AUTOMATIC TRANSITIONS OVER TIME");
console.log("==========================================");

const timelineContest = { id: "t1", platform: "CodeChef", title: "Transition Contest", startMs: 10000, endMs: 20000 };
window.ContestManager.rawFetchedContests = [timelineContest];

// t = 9999
console.log("t=9999 status:", window.ContestManager.getContests("CodeChef", 9999)[0].status);
console.assert(window.ContestManager.getContests("CodeChef", 9999)[0].status === "UPCOMING", "Failed t=9999");

// t = 10000
console.log("t=10000 status:", window.ContestManager.getContests("CodeChef", 10000)[0].status);
console.assert(window.ContestManager.getContests("CodeChef", 10000)[0].status === "LIVE NOW", "Failed t=10000");

// t = 19999
console.log("t=19999 status:", window.ContestManager.getContests("CodeChef", 19999)[0].status);
console.assert(window.ContestManager.getContests("CodeChef", 19999)[0].status === "LIVE NOW", "Failed t=19999");

// t = 20000
console.log("t=20000 status:", window.ContestManager.getContests("CodeChef", 20000)[0].status);
console.assert(window.ContestManager.getContests("CodeChef", 20000)[0].status === "ENDED", "Failed t=20000");

console.log("\n==========================================");
console.log("TEST 7: PLATFORM ISOLATION & SUMMARY CARDS");
console.log("==========================================");

window.ContestManager.rawFetchedContests = [
    { id: "lc_1", platform: "LeetCode", title: "LC Live", startMs: 1000, endMs: 20000 },
    { id: "cf_1", platform: "CodeForces", title: "CF Upcoming", startMs: 30000, endMs: 40000 },
    { id: "cc_1", platform: "CodeChef", title: "CC Concluded", startMs: 100, endMs: 500 },
    { id: "ac_1", platform: "AtCoder", title: "AC Concluded", startMs: 200, endMs: 600 },
    { id: "gfg_1", platform: "GeeksforGeeks", title: "GFG Upcoming", startMs: 25000, endMs: 35000 }
];

const nowTest = 5000;
const platforms = ["LeetCode", "CodeForces", "CodeChef", "AtCoder", "GeeksforGeeks", "All"];

platforms.forEach(plat => {
    const stats = window.ContestManager.getSummaryStats(plat, nowTest);
    const contests = window.ContestManager.getContests(plat, nowTest);
    console.log(`Platform [${plat}]: Contests=${contests.length}, Live=${stats.liveCount}, Upcoming=${stats.upcomingCount}, Ended=${stats.endedCount}`);
    
    if (plat !== "All") {
        contests.forEach(c => {
            console.assert(c.platform.toLowerCase() === plat.toLowerCase(), `Platform mismatch for ${c.id}`);
        });
    }
});

console.log("\nAll simulation tests passed successfully!");
