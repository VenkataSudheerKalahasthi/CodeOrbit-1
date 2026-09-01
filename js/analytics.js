/**
 * Analytics & Streak Engine for DSA Practice Tracker
 */

const AnalyticsEngine = {
    // Return local calendar date string (YYYY-MM-DD) avoiding UTC timezone shift
    getLocalDateKey(dateInput) {
        if (!dateInput) return null;
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return null;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Check if two ISO date strings belong to the same local calendar day (YYYY-MM-DD)
    isSameDay(d1, d2) {
        if (!d1 || !d2) return false;
        return this.getLocalDateKey(d1) === this.getLocalDateKey(d2);
    },

    // Check if d2 is yesterday relative to d1 in user's local calendar
    isYesterday(todayDate, testDate) {
        if (!todayDate || !testDate) return false;
        const t = new Date(todayDate);
        t.setDate(t.getDate() - 1);
        return this.getLocalDateKey(t) === this.getLocalDateKey(testDate);
    },

    // Update practice streak when a problem is completed
    updateStreakOnCompletion(user) {
        const now = new Date();
        const todayStr = this.getLocalDateKey(now);

        if (!user.completionDates) user.completionDates = {};
        if (!user.lastActiveDate) {
            user.currentStreak = 1;
            user.longestStreak = 1;
            user.lastActiveDate = now.toISOString();
        } else {
            const lastStr = this.getLocalDateKey(user.lastActiveDate);
            if (todayStr === lastStr) {
                // Same day completion — streak remains unchanged
            } else if (this.isYesterday(now, user.lastActiveDate)) {
                // Consecutive day!
                user.currentStreak += 1;
                if (user.currentStreak > user.longestStreak) {
                    user.longestStreak = user.currentStreak;
                }
                user.lastActiveDate = now.toISOString();
            } else {
                // Missed one or more days — reset current streak to 1
                user.currentStreak = 1;
                user.lastActiveDate = now.toISOString();
            }
        }
        return user;
    },

    // Calculate progress stats — authoritative unique completed & derived remaining
    calculateStats(user, problems) {
        const problemList = Array.isArray(problems) ? problems : [];
        const total = problemList.length;

        // Deduplicated normalized Set of unique completed problem IDs
        const completedRaw = user ? (user.completedProblems || []) : [];
        const completedSet = new Set(completedRaw.map(id => String(id).trim()));

        // Count how many unique problems in this problemList have been completed
        const completed = problemList.filter(p => completedSet.has(String(p.id).trim())).length;
        const remaining = Math.max(0, total - completed);
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Topic breakdown
        const topicStats = {};
        // Platform breakdown
        const platformStats = {};
        // Difficulty breakdown
        const difficultyStats = {
            Easy: { total: 0, completed: 0 },
            Medium: { total: 0, completed: 0 },
            Hard: { total: 0, completed: 0 }
        };

        problemList.forEach(p => {
            const pIdStr = String(p.id).trim();
            const isDone = completedSet.has(pIdStr);

            // Topic
            const t = p.topic || "General";
            if (!topicStats[t]) {
                topicStats[t] = { total: 0, completed: 0, subtopics: {} };
            }
            topicStats[t].total += 1;
            if (isDone) {
                topicStats[t].completed += 1;
            }

            // Platform
            const pl = p.platform || "Other";
            if (!platformStats[pl]) {
                platformStats[pl] = { total: 0, completed: 0 };
            }
            platformStats[pl].total += 1;
            if (isDone) {
                platformStats[pl].completed += 1;
            }

            // Difficulty
            const diff = p.difficulty || "Medium";
            if (!difficultyStats[diff]) {
                difficultyStats[diff] = { total: 0, completed: 0 };
            }
            difficultyStats[diff].total += 1;
            if (isDone) {
                difficultyStats[diff].completed += 1;
            }
        });

        // Compute percentages
        Object.keys(topicStats).forEach(t => {
            const st = topicStats[t];
            st.percentage = st.total > 0 ? Math.round((st.completed / st.total) * 100) : 0;
        });

        Object.keys(platformStats).forEach(pl => {
            const sp = platformStats[pl];
            sp.percentage = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
        });

        Object.keys(difficultyStats).forEach(d => {
            const sd = difficultyStats[d];
            sd.percentage = sd.total > 0 ? Math.round((sd.completed / sd.total) * 100) : 0;
        });

        return {
            total,
            completed,
            remaining,
            percentage,
            currentStreak: user ? user.currentStreak || 0 : 0,
            longestStreak: user ? user.longestStreak || 0 : 0,
            topicStats,
            platformStats,
            difficultyStats
        };
    },

    logActivity(user, type, description, problemId = null) {
        if (!user.activity) user.activity = [];
        user.activity.unshift({
            type,
            description,
            problemId: problemId !== null ? String(problemId) : null,
            timestamp: new Date().toISOString()
        });
        // Limit activity log to latest 50 entries
        if (user.activity.length > 50) {
            user.activity = user.activity.slice(0, 50);
        }
    }
};

window.AnalyticsEngine = AnalyticsEngine;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsEngine;
}
