/**
 * Daily DSA Mission Manager for CodeOrbit
 * Generates a stable, date-seeded 3-problem daily mission (1 Easy + 1 Medium + 1 Hard)
 * from the existing problem dataset and synchronizes in real-time with existing completion state.
 */

const DailyMissionManager = {
    STORAGE_KEY_PREFIX: "ctrl_alt_career_daily_mission_",
    isExpanded: false,

    init() {
        this.render();
    },

    getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    getDailySeed(dateStr) {
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = (hash << 5) - hash + dateStr.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    },

    getDataset() {
        if (typeof UIManager !== "undefined" && typeof UIManager._getActiveDataset === "function") {
            const ds = UIManager._getActiveDataset();
            if (Array.isArray(ds) && ds.length > 0) return ds;
        }
        if (typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS) && PROBLEMS.length > 0) {
            return PROBLEMS;
        }
        if (typeof BASIC_DSA_PROBLEMS !== "undefined" && Array.isArray(BASIC_DSA_PROBLEMS)) {
            return BASIC_DSA_PROBLEMS;
        }
        return [];
    },

    configuredCount: 3,

    getTodayMission() {
        const dateStr = this.getTodayDateString();
        const key = this.STORAGE_KEY_PREFIX + dateStr;
        const dataset = this.getDataset();
        if (!dataset || dataset.length === 0) return null;

        const targetCount = parseInt(this.configuredCount, 10) || 3;

        // Try loading stored mission IDs for today's date
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const storedIds = JSON.parse(raw);
                if (Array.isArray(storedIds) && storedIds.length === targetCount) {
                    const matchedProblems = storedIds.map(id => {
                        return dataset.find(p => p.id === id || String(p.id) === String(id)) || 
                               (typeof PROBLEMS !== "undefined" ? PROBLEMS.find(p => p.id === id || String(p.id) === String(id)) : null) ||
                               (typeof BASIC_DSA_PROBLEMS !== "undefined" ? BASIC_DSA_PROBLEMS.find(p => p.id === id || String(p.id) === String(id)) : null);
                    }).filter(Boolean);

                    if (matchedProblems.length === targetCount) {
                        return {
                            date: dateStr,
                            problems: matchedProblems
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Failed to parse daily mission cache:", e);
        }

        // Generate deterministic N-problem mission for today (1 Easy, 1 Medium, 1 Hard, plus additional if configured)
        const easyPool = dataset.filter(p => (p.difficulty || "").toLowerCase() === "easy");
        const mediumPool = dataset.filter(p => (p.difficulty || "").toLowerCase() === "medium");
        const hardPool = dataset.filter(p => {
            const d = (p.difficulty || "").toLowerCase();
            return d === "hard" || d === "advanced";
        });

        const seed = this.getDailySeed(dateStr);

        function pickProblem(pool, subSeed, pickedSet) {
            if (!pool || pool.length === 0) {
                for (let k = 0; k < dataset.length; k++) {
                    const candidate = dataset[(subSeed + k) % dataset.length];
                    if (!pickedSet.has(String(candidate.id))) return candidate;
                }
                return dataset[subSeed % dataset.length];
            }
            for (let k = 0; k < pool.length; k++) {
                const candidate = pool[(subSeed + k) % pool.length];
                if (!pickedSet.has(String(candidate.id))) return candidate;
            }
            return pool[subSeed % pool.length];
        }

        const pickedSet = new Set();
        const missionProblems = [];

        // 1. Easy
        const easyP = pickProblem(easyPool, seed, pickedSet);
        if (easyP) { pickedSet.add(String(easyP.id)); missionProblems.push(easyP); }

        // 2. Medium
        const medP = pickProblem(mediumPool, seed + 11, pickedSet);
        if (medP) { pickedSet.add(String(medP.id)); missionProblems.push(medP); }

        // 3. Hard
        const hardP = pickProblem(hardPool, seed + 23, pickedSet);
        if (hardP) { pickedSet.add(String(hardP.id)); missionProblems.push(hardP); }

        // 4. Additional problems if targetCount > 3
        while (missionProblems.length < targetCount) {
            const idx = missionProblems.length;
            const extraPool = idx % 2 === 0 ? hardPool : mediumPool;
            const extraP = pickProblem(extraPool, seed + (idx * 17), pickedSet);
            if (extraP) {
                pickedSet.add(String(extraP.id));
                missionProblems.push(extraP);
            } else {
                break;
            }
        }

        const missionIds = missionProblems.map(p => p.id);

        try {
            localStorage.setItem(key, JSON.stringify(missionIds));
        } catch (e) {
            console.warn("Failed to save daily mission:", e);
        }

        return {
            date: dateStr,
            problems: missionProblems
        };
    },

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.render();
    },

    handleToggle(problemId) {
        if (typeof UIManager !== "undefined" && typeof UIManager.toggleProblemCompletion === "function") {
            UIManager.toggleProblemCompletion(problemId);
        }
    },

    bindEvents() {
        const container = document.getElementById("daily-mission-section");
        if (!container || container._eventsBound) return;
        container._eventsBound = true;

        container.addEventListener("click", (e) => {
            const toggleBtn = e.target.closest(".btn-mission-toggle");
            if (toggleBtn) {
                e.stopPropagation();
                const pId = toggleBtn.dataset.problemId;
                if (pId) {
                    this.handleToggle(pId);
                }
                return;
            }

            const chkGroup = e.target.closest(".mission-problem-checkbox-group");
            if (chkGroup) {
                e.stopPropagation();
                const pId = chkGroup.dataset.problemId;
                if (pId) {
                    this.handleToggle(pId);
                }
                return;
            }
        });
    },

    checkAndAwardDailyMissionStar() {
        const user = (typeof StorageManager !== "undefined" && StorageManager.getCurrentUser) ? StorageManager.getCurrentUser() : null;
        if (!user) return { awarded: false, totalStars: 0 };

        const mission = this.getTodayMission();
        if (!mission || !mission.problems || mission.problems.length < 3) {
            return { awarded: false, totalStars: user.dailyMissionStars || 0 };
        }

        const dateStr = mission.date || this.getTodayDateString();
        const completedList = user.completedProblems || [];
        const isDone = (id) => completedList.some(cId => cId === id || String(cId) === String(id));

        const allDone = mission.problems.every(p => isDone(p.id));
        if (!allDone) {
            return { awarded: false, totalStars: user.dailyMissionStars || 0 };
        }

        // Check if star for this date was already awarded
        if (!user.dailyMissionRewardedDates || typeof user.dailyMissionRewardedDates !== "object") {
            user.dailyMissionRewardedDates = {};
        }

        if (user.dailyMissionRewardedDates[dateStr]) {
            return { awarded: false, totalStars: user.dailyMissionStars || 0 };
        }

        // Award exactly +1 Star
        user.dailyMissionRewardedDates[dateStr] = true;
        user.dailyMissionStars = (typeof user.dailyMissionStars === "number" ? user.dailyMissionStars : 0) + 1;

        if (typeof AnalyticsEngine !== "undefined" && typeof AnalyticsEngine.logActivity === "function") {
            AnalyticsEngine.logActivity(user, "DAILY_MISSION_STAR_EARNED", `Earned ⭐ for completing Daily DSA Mission (${dateStr})`);
        }

        // Persist locally
        StorageManager.saveCurrentUserLocally(user);

        // Persist to Supabase cloud
        if (user.id && window.ChallengeService) {
            window.ChallengeService.setChallengeCompletion(
                user.id,
                dateStr,
                'daily_mission_' + dateStr,
                'daily_mission',
                true,
                1
            );
        }

        if (user.id && window.StatsService) {
            window.StatsService.saveUserStats(user.id, {
                stars: user.dailyMissionStars,
                current_streak: user.currentStreak || 0,
                longest_streak: user.longestStreak || 0,
                total_completed: (user.completedProblems || []).length
            });
        }

        if (user.id && window.ActivityService) {
            window.ActivityService.recordDailyActivity(user.id, dateStr, 0, 1);
        }

        // Trigger subtle navbar star animation
        this.triggerStarPopAnimation();

        // If UIManager is available, update navbar stars immediately
        if (typeof UIManager !== "undefined" && typeof UIManager.renderNavStars === "function") {
            UIManager.renderNavStars();
        }

        return { awarded: true, totalStars: user.dailyMissionStars };
    },

    triggerStarPopAnimation() {
        const displays = [
            document.getElementById("nav-stars-display"),
            document.getElementById("mobile-nav-stars-display")
        ];
        displays.forEach(el => {
            if (el) {
                el.classList.remove("star-earned-pop");
                void el.offsetWidth; // Trigger reflow
                el.classList.add("star-earned-pop");
                setTimeout(() => {
                    if (el) el.classList.remove("star-earned-pop");
                }, 1000);
            }
        });
    },

    render() {
        const container = document.getElementById("daily-mission-section");
        if (!container) return;

        const mission = this.getTodayMission();
        if (!mission || !mission.problems || mission.problems.length < 3) {
            container.innerHTML = "";
            return;
        }

        // Check and award star if today's 3 problems are all completed
        this.checkAndAwardDailyMissionStar();

        const user = (typeof StorageManager !== "undefined" && StorageManager.getCurrentUser) ? StorageManager.getCurrentUser() : null;
        const completedList = user ? user.completedProblems || [] : [];
        const isDone = (id) => completedList.some(cId => cId === id || String(cId) === String(id));

        const [easyP, medP, hardP] = mission.problems;
        const easyDone = isDone(easyP.id);
        const medDone = isDone(medP.id);
        const hardDone = isDone(hardP.id);

        const completedCount = (easyDone ? 1 : 0) + (medDone ? 1 : 0) + (hardDone ? 1 : 0);
        const pct = Math.round((completedCount / 3) * 100);
        const isComplete = completedCount === 3;

        container.innerHTML = `
            <div class="glass-card daily-mission-card ${isComplete ? 'mission-all-done' : ''}">
                <div class="daily-mission-accent-line"></div>
                
                <!-- Main Header Row -->
                <div class="daily-mission-header">
                    <div class="daily-mission-info">
                        <div class="daily-mission-tag-row">
                            <span class="daily-mission-badge">🔥 TODAY'S DSA MISSION</span>
                            <span class="daily-mission-date-badge">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h2 class="daily-mission-title">Complete Today's 3-Problem Challenge</h2>
                        <p class="daily-mission-desc">1 Easy · 1 Medium · 1 Hard — Daily discipline for interview dominance.</p>
                    </div>

                    <div class="daily-mission-stats-group">
                        <div class="daily-mission-fraction-box">
                            <span class="mission-fraction-num">${completedCount}</span>
                            <span class="mission-fraction-denom">/ 3</span>
                        </div>
                        <div class="daily-mission-pct-badge">${pct}%</div>
                    </div>
                </div>

                <!-- Difficulty Chips Preview Row -->
                <div class="daily-mission-chips-row">
                    <div class="mission-chip chip-easy ${easyDone ? 'completed' : ''}">
                        <span class="chip-status-icon">${easyDone ? '✓' : '○'}</span>
                        <span class="chip-label">🟢 Easy</span>
                        <span class="chip-title">${easyP.title}</span>
                    </div>
                    <div class="mission-chip chip-medium ${medDone ? 'completed' : ''}">
                        <span class="chip-status-icon">${medDone ? '✓' : '○'}</span>
                        <span class="chip-label">🟡 Medium</span>
                        <span class="chip-title">${medP.title}</span>
                    </div>
                    <div class="mission-chip chip-hard ${hardDone ? 'completed' : ''}">
                        <span class="chip-status-icon">${hardDone ? '✓' : '○'}</span>
                        <span class="chip-label">🔴 Hard</span>
                        <span class="chip-title">${hardP.title}</span>
                    </div>
                </div>

                <!-- Horizontal Progress Bar -->
                <div class="daily-mission-progress-bar-wrap">
                    <div class="daily-mission-progress-track">
                        <div class="daily-mission-progress-fill" style="width: ${pct}%;"></div>
                    </div>
                </div>

                <!-- Action / Footer Row -->
                <div class="daily-mission-footer">
                    <div class="mission-footer-left">
                        ${isComplete ? `
                            <div class="mission-celebration-tag">
                                <span>🏆</span>
                                <strong>TODAY'S MISSION COMPLETE!</strong>
                                <span>⭐ +1 STAR EARNED · 3 / 3 Solved ✓</span>
                            </div>
                        ` : `
                            <span class="mission-remaining-text">${3 - completedCount} problem${(3 - completedCount) === 1 ? '' : 's'} remaining today</span>
                        `}
                    </div>
                    <button class="btn-start-mission" onclick="DailyMissionManager.toggleExpand()">
                        ${this.isExpanded ? 'Hide Problems ▲' : 'Start Mission →'}
                    </button>
                </div>

                <!-- Expanded Mission Problems List -->
                ${this.isExpanded ? `
                    <div class="daily-mission-problems-grid">
                        ${mission.problems.map((p) => {
                            const pDone = isDone(p.id);
                            const diff = (p.difficulty || "medium").toLowerCase();
                            const platClass = (p.platform || "").toLowerCase().replace(/\s+/g, '');
                            const diffIcon = diff === 'easy' ? '🟢' : (diff === 'medium' ? '🟡' : '🔴');

                            return `
                                <div class="mission-problem-card ${pDone ? 'completed' : ''}">
                                    <div class="mission-problem-top">
                                        <div class="mission-problem-checkbox-group" data-problem-id="${p.id}">
                                            <div class="custom-checkbox ${pDone ? 'checked' : ''}">
                                                <svg class="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <div class="mission-problem-meta">
                                                <span class="mission-diff-tag diff-${diff}">${diffIcon} ${p.difficulty}</span>
                                                <span class="mission-topic-tag">${p.topic || p.a2zSection || 'DSA'}</span>
                                            </div>
                                        </div>
                                        <span class="badge badge-platform ${platClass}">${p.platform || 'Judge'}</span>
                                    </div>

                                    <h4 class="mission-problem-title">${p.title}</h4>

                                    <div class="mission-problem-actions">
                                        <button class="btn-mission-toggle ${pDone ? 'btn-done' : ''}" data-problem-id="${p.id}">
                                            ${pDone ? '✓ Solved' : 'Mark Complete'}
                                        </button>
                                        ${p.url && p.url !== '#' ? `
                                            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn-mission-solve">
                                                🎯 Solve ↗
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        this.bindEvents();
    }
};

window.DailyMissionManager = DailyMissionManager;
