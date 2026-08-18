const fs = require('fs');
const path = require('path');

// Mock localStorage & window for Node environment
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.window = global;

// Load contests.js
const contestsCode = fs.readFileSync(path.join(__dirname, '../js/contests.js'), 'utf8');
eval(contestsCode);

async function testContestModule() {
    console.log("Testing ContestManager.fetchRealTimeContests()...");
    await window.ContestManager.fetchRealTimeContests();
    
    const contests = window.ContestManager.getContests();
    console.log(`Loaded ${contests.length} contests.`);
    
    const stats = window.ContestManager.getSummaryStats();
    console.log("Summary Stats:", JSON.stringify(stats, null, 2));

    if (contests.length > 0) {
        console.log("Sample contest item:", contests[0]);
    }
}

testContestModule();
