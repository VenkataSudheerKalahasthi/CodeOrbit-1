/**
 * UI Rendering & Event Controller for Ctrl+Alt+Career & DSA Practice Tracker
 * Dynamic DOM rendering, Striver A2Z section accordion cards, 3-column problem grids,
 * dynamic statistics calculation from PROBLEMS.length, search, filters, modals, and toasts.
 */

const UIManager = {
    currentFilters: {
        searchQuery: "",
        platform: "All",
        difficulty: "All",
        status: "All",
        topic: "All", // Represents A2Z section or topic
        favoritesOnly: false,
        sortBy: "default"
    },

    expandedTopics: new Set(["01 — Learn the Basics", "03 — Arrays", "04 — Arrays"]),

    activeTab: "challenges",

    THEME_KEY: "codecal_theme",

    init() {
        this.initTheme();
        this.bindEvents();
        this.switchTab("challenges");
        this.renderApp();
    },

    initTheme() {
        let theme = "dark";
        try {
            const saved = localStorage.getItem(this.THEME_KEY);
            if (saved === "light" || saved === "dark") {
                theme = saved;
            }
        } catch (e) {
            console.error("Failed to load theme from LocalStorage:", e);
        }
        this.applyTheme(theme);
    },

    applyTheme(theme) {
        if (theme === "light") {
            document.body.classList.add("light-theme");
        } else {
            document.body.classList.remove("light-theme");
        }

        const themeBtn = document.getElementById("theme-toggle-btn");
        if (themeBtn) {
            themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
        }

        try {
            localStorage.setItem(this.THEME_KEY, theme);
        } catch (e) {
            console.error("Failed to save theme:", e);
        }
    },

    toggleTheme() {
        const isLight = document.body.classList.contains("light-theme");
        const newTheme = isLight ? "dark" : "light";
        this.applyTheme(newTheme);
        this.showToast(`Switched to ${newTheme === "light" ? "Light" : "Dark"} Theme`);
    },

    bindEvents() {
        // Tab Navigation
        const tabsContainer = document.querySelector(".nav-tabs");
        if (tabsContainer) {
            tabsContainer.addEventListener("click", (e) => {
                const tabBtn = e.target.closest(".nav-tab");
                if (!tabBtn) return;
                const tab = tabBtn.dataset.tab;
                this.switchTab(tab);
            });
        }

        // Search Input (DSA Mastery)
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.currentFilters.searchQuery = e.target.value.toLowerCase().trim();
                this.renderProblemLibrary();
            });
        }

        // Difficulty Pills (DSA Mastery)
        const difficultyPills = document.getElementById("difficulty-pills");
        if (difficultyPills) {
            difficultyPills.addEventListener("click", (e) => {
                const pill = e.target.closest(".filter-pill");
                if (!pill) return;
                const diff = pill.dataset.difficulty;
                this.currentFilters.difficulty = diff;

                difficultyPills.querySelectorAll(".filter-pill").forEach(p => p.className = "filter-pill");
                if (diff === "All") pill.classList.add("active");
                else if (diff === "Easy") pill.classList.add("active-easy");
                else if (diff === "Medium") pill.classList.add("active-medium");
                else if (diff === "Hard") pill.classList.add("active-hard");

                this.renderProblemLibrary();
            });
        }

        // Platform Select / Pills
        const platformSelect = document.getElementById("platform-select");
        if (platformSelect) {
            platformSelect.addEventListener("change", (e) => {
                this.currentFilters.platform = e.target.value;
                this.renderProblemLibrary();
            });
        }

        // Topic / Section Select
        const topicSelect = document.getElementById("topic-select");
        if (topicSelect) {
            topicSelect.addEventListener("change", (e) => {
                this.currentFilters.topic = e.target.value;
                this.renderProblemLibrary();
            });
        }

        // Status Select
        const statusSelect = document.getElementById("status-select");
        if (statusSelect) {
            statusSelect.addEventListener("change", (e) => {
                this.currentFilters.status = e.target.value;
                this.renderProblemLibrary();
            });
        }

        // Favorites Filter Toggle
        const favToggleBtn = document.getElementById("favorites-toggle-btn");
        if (favToggleBtn) {
            favToggleBtn.addEventListener("click", () => {
                this.currentFilters.favoritesOnly = !this.currentFilters.favoritesOnly;
                favToggleBtn.classList.toggle("active", this.currentFilters.favoritesOnly);
                this.renderProblemLibrary();
            });
        }

        // Sort Select
        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.renderProblemLibrary();
            });
        }

        // Event Delegation on Topics Accordion Container
        const accordionContainer = document.getElementById("topics-accordion-container");
        if (accordionContainer) {
            accordionContainer.addEventListener("click", (e) => {
                // Checkbox toggle
                const checkbox = e.target.closest(".custom-checkbox");
                if (checkbox) {
                    e.stopPropagation();
                    const card = checkbox.closest(".problem-card");
                    const problemId = parseInt(card.dataset.id, 10);
                    this.toggleProblemCompletion(problemId);
                    return;
                }

                // Star favorite toggle
                const starBtn = e.target.closest(".star-btn");
                if (starBtn) {
                    e.stopPropagation();
                    const card = starBtn.closest(".problem-card");
                    const problemId = parseInt(card.dataset.id, 10);
                    this.toggleFavorite(problemId);
                    return;
                }

                // Note button click
                const noteBtn = e.target.closest(".note-action-btn");
                if (noteBtn) {
                    e.stopPropagation();
                    const card = noteBtn.closest(".problem-card");
                    const problemId = parseInt(card.dataset.id, 10);
                    this.openNotesModal(problemId);
                    return;
                }

                // Problem card or title click -> open problem URL
                const card = e.target.closest(".problem-card");
                if (card && !e.target.closest("a")) {
                    const problemId = parseInt(card.dataset.id, 10);
                    const activeDataset = this._getActiveDataset();
                    const problem = activeDataset.find(p => p.id === problemId);
                    if (problem && problem.url && problem.url !== "#" && !problem.url.includes("solve")) {
                        window.open(problem.url, "_blank", "noopener,noreferrer");
                        return;
                    }
                }

                // Accordion header click
                const header = e.target.closest(".topic-card-header");
                if (header) {
                    const topicCard = header.closest(".topic-card");
                    const topicName = topicCard.dataset.topic;
                    if (this.expandedTopics.has(topicName)) {
                        this.expandedTopics.delete(topicName);
                    } else {
                        this.expandedTopics.add(topicName);
                    }
                    topicCard.classList.toggle("open", this.expandedTopics.has(topicName));
                    return;
                }
            });
        }

        // Theme Toggle Button
        const themeBtn = document.getElementById("theme-toggle-btn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => this.toggleTheme());
        }

        // Notes Modal Events
        const notesOverlay = document.getElementById("notes-modal-overlay");
        const closeNotesBtn = document.getElementById("close-notes-modal");
        const saveNotesBtn = document.getElementById("save-note-btn");

        if (closeNotesBtn && notesOverlay) {
            closeNotesBtn.addEventListener("click", () => notesOverlay.classList.remove("active"));
            notesOverlay.addEventListener("click", (e) => {
                if (e.target === notesOverlay) notesOverlay.classList.remove("active");
            });
        }

        if (saveNotesBtn) {
            saveNotesBtn.addEventListener("click", () => this.saveNote());
        }

        // Settings Modal Events
        const settingsOverlay = document.getElementById("settings-modal-overlay");
        const closeSettingsBtn = document.getElementById("close-settings-modal");
        const exportBtn = document.getElementById("export-data-btn");
        const importInput = document.getElementById("import-file-input");
        const resetBtn = document.getElementById("reset-data-btn");

        if (closeSettingsBtn && settingsOverlay) {
            closeSettingsBtn.addEventListener("click", () => settingsOverlay.classList.remove("active"));
            settingsOverlay.addEventListener("click", (e) => {
                if (e.target === settingsOverlay) settingsOverlay.classList.remove("active");
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                try {
                    const json = StorageManager.exportUserData();
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ctrl_alt_career_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    this.showToast("Backup exported successfully!");
                } catch (err) {
                    this.showToast(err.message);
                }
            });
        }

        if (importInput) {
            importInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                    try {
                        StorageManager.importUserData(evt.target.result);
                        this.showToast("Data imported successfully!");
                        this.renderApp();
                        if (settingsOverlay) settingsOverlay.classList.remove("active");
                    } catch (err) {
                        this.showToast("Import error: " + err.message);
                    }
                };
                reader.readAsText(file);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to reset all your practice progress, notes, and streak?")) {
                    StorageManager.resetCurrentUserData();
                    this.showToast("Progress reset.");
                    this.renderApp();
                    if (settingsOverlay) settingsOverlay.classList.remove("active");
                }
            });
        }

        // DSA Mode Change — re-render when BASIC->MEDIUM / MEDIUM->ADVANCED toggles
        document.addEventListener("dsa-mode-changed", () => {
            this.renderApp();
        });
    },

    switchTab(tab) {
        this.activeTab = tab;

        document.querySelectorAll(".nav-tab").forEach(t => {
            t.classList.toggle("active", t.dataset.tab === tab);
        });

        document.querySelectorAll(".view-section").forEach(s => {
            s.classList.toggle("active", s.id === `view-${tab}`);
        });

        if (tab === "challenges" && typeof ContestUI !== "undefined" && ContestUI.renderAll) {
            ContestUI.renderAll();
        } else if (tab === "mastery") {
            this.renderApp();
        } else if (tab === "roadmap" && typeof RoadmapUI !== "undefined" && RoadmapUI.renderRoadmap) {
            RoadmapUI.renderRoadmap();
        }
    },

    renderApp() {
        const user = StorageManager.getCurrentUser();
        const loginBtn = document.getElementById("nav-login-btn");
        const profileBtn = document.getElementById("nav-profile-btn");
        const usernameDisplay = document.getElementById("nav-username-display");

        if (user) {
            if (loginBtn) loginBtn.style.display = "none";
            if (profileBtn) profileBtn.style.display = "flex";
            if (usernameDisplay) usernameDisplay.textContent = user.username;
            this.renderNavStars(user);
        } else {
            if (loginBtn) loginBtn.style.display = "flex";
            if (profileBtn) profileBtn.style.display = "none";
        }

        this.renderStats();
        this.renderTopicSelect();
        this.renderProblemLibrary();
        if (typeof StreakCalendar !== "undefined") {
            StreakCalendar.render();
        }
        if (typeof DailyMissionManager !== "undefined") {
            DailyMissionManager.render();
        }
        if (this.activeTab === "roadmap" && typeof RoadmapUI !== "undefined" && RoadmapUI.renderRoadmap) {
            RoadmapUI.renderRoadmap();
        }
    },

    renderNavStars(user = null) {
        if (!user) {
            user = (typeof StorageManager !== "undefined" && StorageManager.getCurrentUser) ? StorageManager.getCurrentUser() : null;
        }
        const starsCount = user ? (typeof user.dailyMissionStars === "number" ? user.dailyMissionStars : 0) : 0;
        const desktopStarsCount = document.getElementById("nav-stars-count");
        const mobileStarsCount = document.getElementById("mobile-nav-stars-count");
        if (desktopStarsCount) desktopStarsCount.textContent = starsCount;
        if (mobileStarsCount) mobileStarsCount.textContent = starsCount;
    },

    renderStats() {
        const user = StorageManager.getCurrentUser();
        const activeDataset = this._getActiveDataset();
        const stats = AnalyticsEngine.calculateStats(user, activeDataset);

        const totalEl = document.getElementById("stat-total");
        const completedEl = document.getElementById("stat-completed") || document.getElementById("stat-solved-count");
        const remainingEl = document.getElementById("stat-remaining");
        const streakEl = document.getElementById("stat-streak") || document.getElementById("stat-streak-count");
        const accuracyEl = document.getElementById("stat-accuracy-count");

        const problemCount = activeDataset.length;

        if (totalEl) totalEl.textContent = problemCount;
        if (completedEl) completedEl.textContent = stats.completed;
        if (remainingEl) remainingEl.textContent = stats.remaining;
        if (streakEl) streakEl.textContent = stats.currentStreak;
        if (accuracyEl) accuracyEl.textContent = `${stats.percentage}%`;

        const footerBadge = document.getElementById("footer-mastery-badge");
        if (footerBadge) footerBadge.textContent = problemCount;

        const welcomeName = document.getElementById("welcome-user-name");
        if (welcomeName) {
            welcomeName.textContent = user ? user.username : "Guest";
        }

        const heroSub = document.getElementById("hero-sub-progress");
        if (heroSub) {
            heroSub.textContent = `Completed ${stats.completed} of ${problemCount} problems (${stats.percentage}%)`;
        }

        const heroBar = document.getElementById("hero-progress-bar");
        if (heroBar) {
            const pct = problemCount > 0 ? (stats.completed / problemCount) * 100 : 0;
            heroBar.style.width = `${pct}%`;
        }
    },

    renderTopicSelect() {
        const topicSelect = document.getElementById("topic-select");
        if (!topicSelect) return;

        // Only show sections that contain problems visible in the current active mode
        const modeProblems = this._getActiveDataset();
        const sections = [...new Set(modeProblems.map(p => p.a2zSection || p.topic))];
        const currentVal = this.currentFilters.topic;

        topicSelect.innerHTML = `<option value="All">All Sections (${modeProblems.length})</option>` +
            sections.map(s => {
                const count = modeProblems.filter(p => (p.a2zSection || p.topic) === s).length;
                return `<option value="${s}" ${s === currentVal ? "selected" : ""}>${s} (${count})</option>`;
            }).join("");
    },

    // Returns the active dataset for the currently selected learning mode.
    // BASIC->MEDIUM   : Returns BASIC_DSA_PROBLEMS
    // MEDIUM->ADVANCED: Returns PROBLEMS (existing 348 problems)
    _getModeFilteredProblems() {
        return this._getActiveDataset();
    },

    // Returns the full (unfiltered) dataset for the active mode.
    // Used for all DSA Mastery operations so counts and progress are strictly mode-isolated.
    _getActiveDataset() {
        const mode = (typeof DSAModeSelector !== "undefined")
            ? DSAModeSelector.getMode()
            : "basic-medium";
        if (mode === "medium-advanced") {
            return (typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
        }
        // default: basic-medium — dedicated Basic DSA dataset
        if (typeof BASIC_DSA_PROBLEMS !== "undefined" && Array.isArray(BASIC_DSA_PROBLEMS)) {
            return BASIC_DSA_PROBLEMS;
        }
        return (typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS)) ? PROBLEMS : [];
    },

    // Calculates real-time topic progress (completed, total, percentage) from full unfiltered dataset
    getTopicProgress(topicName) {
        const user = (typeof StorageManager !== "undefined" && StorageManager.getCurrentUser)
            ? StorageManager.getCurrentUser()
            : null;
        const completedSet = new Set(user ? user.completedProblems || [] : []);
        const activeDataset = this._getActiveDataset();
        const fallbackDataset = (typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS)) ? PROBLEMS : [];

        const allMatchingProblems = this._getMatchingProblemsForTopic(topicName, activeDataset, fallbackDataset);
        const total = allMatchingProblems.length;
        const completed = allMatchingProblems.filter(p => completedSet.has(p.id)).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            topic: topicName,
            total,
            completed,
            percentage,
            problems: allMatchingProblems
        };
    },

    _getMatchingProblemsForTopic(topicName, activeDataset, fallbackDataset) {
        const norm = (topicName || "").toLowerCase().trim();

        const filterProblems = (dataset) => {
            if (!Array.isArray(dataset)) return [];
            return dataset.filter(p => {
                const sec = (p.a2zSection || "").toLowerCase();
                const top = (p.topic || "").toLowerCase();
                const sub = (p.subtopic || "").toLowerCase();
                const title = (p.title || "").toLowerCase();

                switch (norm) {
                    case "arrays":
                        return sec.includes("04 - arrays") || (sec.includes("array") && !sec.includes("01")) || top === "arrays" || top === "matrix";
                    case "strings":
                        return sec.includes("06 - strings") || (sec.includes("string") && !sec.includes("01")) || top === "strings" || top === "string frequency counting";
                    case "linked list":
                        return sec.includes("08 - linked list") || sec.includes("linked list") || top.includes("linked list");
                    case "stack":
                        return sec.includes("09 - stacks") || (sec.includes("stack") && !sec.includes("queue")) || (top.includes("stack") && !top.includes("queue"));
                    case "queue":
                        return (sec.includes("10 - queues") || sec.includes("queue") || top.includes("queue")) && !sec.includes("heaps") && !sec.includes("priority");
                    case "recursion":
                        return sec.includes("11 - recursion") || sec.includes("recursion") || top.includes("recursion");
                    case "sorting":
                        return sec.includes("sort") || top === "sorting" || top.includes("sort") || sub.includes("sort");
                    case "binary search":
                        return sec.includes("07 - binary search") || sec.includes("binary search") || top.includes("searching") || top.includes("binary search") || sub.includes("binary search");
                    case "bit manipulation":
                        return sec.includes("03 - bit manipulation") || (sec.includes("bit") && !sec.includes("01")) || top.includes("bit") || top === "logical building";
                    case "greedy":
                        return sec.includes("13 - greedy") || sec.includes("greedy") || top.includes("greedy");
                    case "sliding window":
                        return sub.includes("sliding window") || top.includes("sliding window") || title.includes("sliding window");
                    case "two pointer":
                    case "two pointers":
                        return sub.includes("two pointer") || top.includes("two pointer") || title.includes("two pointer");
                    case "heaps":
                    case "heap":
                        return sec.includes("14 - heaps") || sec.includes("heap") || top.includes("heap");
                    case "trees":
                    case "tree":
                        return sec.includes("15 - binary trees") || sec.includes("tree") || top.includes("tree");
                    case "graphs":
                    case "graph":
                        return sec.includes("17 - graphs") || sec.includes("graph") || top.includes("graph");
                    case "backtracking":
                        return sec.includes("12 - backtracking") || sec.includes("backtracking") || top.includes("backtracking") || sub.includes("backtracking");
                    case "dynamic programming":
                    case "dp":
                        return sec.includes("18 - dynamic programming") || sec.includes("dynamic") || top.includes("dynamic") || sec.includes("dp") || top.includes("dp");
                    case "tries":
                    case "trie":
                        return sec.includes("16 - trie") || sec.includes("trie") || top.includes("trie");
                    case "additional practice":
                        return sec.includes("learn the basics") || sec.includes("mathematics") || sec.includes("hashing") ||
                               top.includes("logical building") || top.includes("conditional") || top.includes("loops") || top.includes("functions");
                    default:
                        return sec.includes(norm) || top.includes(norm) || sub.includes(norm);
                }
            });
        };

        let matches = filterProblems(activeDataset);
        if (matches.length === 0 && fallbackDataset && Array.isArray(fallbackDataset)) {
            matches = filterProblems(fallbackDataset);
        }
        if (matches.length === 0 && typeof BASIC_DSA_PROBLEMS !== "undefined" && Array.isArray(BASIC_DSA_PROBLEMS)) {
            matches = filterProblems(BASIC_DSA_PROBLEMS);
        }
        if (matches.length === 0 && typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS)) {
            matches = filterProblems(PROBLEMS);
        }
        return matches;
    },

    renderProblemLibrary() {
        const user = StorageManager.getCurrentUser();
        // Apply mode filter first, then run through the existing FilterEngine
        const activeDataset = this._getActiveDataset();
        const filtered = FilterEngine.filterProblems(activeDataset, user, this.currentFilters);

        const container = document.getElementById("topics-accordion-container") || document.getElementById("dsa-topics-accordion");
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
                    <h3 style="color: var(--text-primary); font-weight: 700;">No problems found</h3>
                    <p style="margin-top: 4px;">Try adjusting your search or filter options.</p>
                </div>
            `;
            return;
        }

        // Group by a2zSection
        const sectionGroups = {};
        filtered.forEach(p => {
            const sec = p.a2zSection || p.topic;
            if (!sectionGroups[sec]) {
                sectionGroups[sec] = [];
            }
            sectionGroups[sec].push(p);
        });

        const completedSet = new Set(user ? user.completedProblems || [] : []);
        const favoritesSet = new Set(user ? user.favorites || [] : []);
        const notesObj = user ? user.notes || {} : {};

        let html = "";
        Object.keys(sectionGroups).forEach(secName => {
            const secProblems = sectionGroups[secName];
            const allSecProblems = activeDataset.filter(p => (p.a2zSection || p.topic) === secName);
            const secTotal = allSecProblems.length;
            const secCompleted = allSecProblems.filter(p => completedSet.has(p.id)).length;
            const secRemaining = Math.max(0, secTotal - secCompleted);
            const secPct = secTotal > 0 ? Math.round((secCompleted / secTotal) * 100) : 0;
            const isOpen = this.expandedTopics.has(secName);
            const isFullyCompleted = secCompleted === secTotal && secTotal > 0;

            // Difficulty breakdown calculations
            const easyProblems = allSecProblems.filter(p => (p.difficulty || "").toLowerCase() === "easy");
            const easyTotal = easyProblems.length;
            const easyCompleted = easyProblems.filter(p => completedSet.has(p.id)).length;

            const mediumProblems = allSecProblems.filter(p => (p.difficulty || "").toLowerCase() === "medium");
            const mediumTotal = mediumProblems.length;
            const mediumCompleted = mediumProblems.filter(p => completedSet.has(p.id)).length;

            const hardProblems = allSecProblems.filter(p => {
                const d = (p.difficulty || "").toLowerCase();
                return d === "hard" || d === "advanced";
            });
            const hardTotal = hardProblems.length;
            const hardCompleted = hardProblems.filter(p => completedSet.has(p.id)).length;

            const circumference = 113.1;
            const dashoffset = circumference - (secPct / 100) * circumference;

            const subGroups = {};
            secProblems.forEach(p => {
                const sub = p.subtopic || secName;
                if (!subGroups[sub]) subGroups[sub] = [];
                subGroups[sub].push(p);
            });

            const activeDSAMode = (typeof DSAModeSelector !== "undefined") ? DSAModeSelector.getMode() : "basic-medium";
            const isBasicMode = (secProblems[0] && (secProblems[0].mode === "basic-to-medium" || secProblems[0].mode === "basic-medium")) || (activeDSAMode === "basic-medium");
            const topicLevelLabel = isBasicMode ? "BEGINNER" : "INTERMEDIATE";

            html += `
                <div class="topic-card ${isOpen ? "open" : ""} ${isFullyCompleted ? "completed" : ""}" data-topic="${secName}">
                    <div class="topic-card-accent-line"></div>
                    <div class="topic-card-header">
                        <div class="topic-info-group">
                            <div class="topic-icon-box">
                                ${this.getSectionIcon(secName)}
                            </div>
                            <div class="topic-title-area">
                                <h2>
                                    ${secName}
                                    <span class="topic-level-badge">${topicLevelLabel}</span>
                                </h2>
                                <div class="topic-subtitle">${secProblems.length} Problems available</div>
                            </div>
                        </div>

                        <div class="topic-progress-group">
                            <div class="progress-circle-wrapper">
                                <svg class="progress-circle-svg">
                                    <circle class="progress-circle-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="progress-circle-val" cx="22" cy="22" r="18" 
                                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashoffset};"></circle>
                                </svg>
                                <span class="progress-circle-text">${secPct}%</span>
                            </div>
                            <div class="topic-fraction">${secCompleted}/${secTotal}</div>
                            <div class="chevron-icon">▼</div>
                        </div>
                    </div>

                    <div class="topic-card-body">
                        <!-- Topic Progress Intelligence -->
                        <div class="topic-progress-intel">
                            <div class="topic-intel-top">
                                <div class="topic-intel-header-info">
                                    <span class="topic-intel-title">Topic Progress</span>
                                    <span class="topic-intel-fraction">${secCompleted} / ${secTotal}</span>
                                </div>
                                <div class="topic-intel-bar-container">
                                    <div class="topic-intel-bar-track">
                                        <div class="topic-intel-bar-fill" style="width: ${secPct}%;"></div>
                                    </div>
                                    <span class="topic-intel-pct">${secPct}%</span>
                                </div>
                            </div>
                            <div class="topic-intel-bottom">
                                <div class="topic-intel-pills">
                                    <div class="topic-intel-pill pill-easy">
                                        <span class="intel-pill-dot dot-easy">🟢</span>
                                        <span class="intel-pill-label">Easy</span>
                                        <span class="intel-pill-val">${easyCompleted} / ${easyTotal}</span>
                                    </div>
                                    <div class="topic-intel-pill pill-medium">
                                        <span class="intel-pill-dot dot-medium">🟡</span>
                                        <span class="intel-pill-label">Medium</span>
                                        <span class="intel-pill-val">${mediumCompleted} / ${mediumTotal}</span>
                                    </div>
                                    <div class="topic-intel-pill pill-hard">
                                        <span class="intel-pill-dot dot-hard">🔴</span>
                                        <span class="intel-pill-label">Hard</span>
                                        <span class="intel-pill-val">${hardCompleted} / ${hardTotal}</span>
                                    </div>
                                </div>
                                <div class="topic-intel-remaining">
                                    ${isFullyCompleted 
                                        ? `<span class="topic-intel-complete-tag">✓ Topic Complete</span>` 
                                        : `<span class="topic-intel-remaining-tag">${secRemaining} problem${secRemaining === 1 ? '' : 's'} remaining</span>`}
                                </div>
                            </div>
                        </div>

                        ${Object.keys(subGroups).map(subName => `
                            <div class="subtopic-header">${subName} (${subGroups[subName].length})</div>
                            <div class="problems-grid">
                                ${subGroups[subName].map(p => {
                                    const isDone = completedSet.has(p.id);
                                    const isFav = favoritesSet.has(p.id);
                                    const hasNote = Boolean(notesObj[p.id]);
                                    const platClass = (p.platform || "").toLowerCase().replace(/\s+/g, '');
                                    const diffClass = (p.difficulty || "medium").toLowerCase();

                                    return `
                                        <div class="problem-card ${isDone ? "completed" : ""}" data-id="${p.id}">
                                            <div class="problem-card-left-border"></div>
                                            <div class="problem-card-top-row">
                                                <div class="checkbox-title-wrapper">
                                                    <div class="custom-checkbox ${isDone ? "checked" : ""}">
                                                        <svg class="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                    <div class="problem-title">${p.title}</div>
                                                </div>
                                                <button class="star-btn ${isFav ? "active" : ""}" title="Favorite">
                                                    ${isFav ? "★" : "☆"}
                                                </button>
                                            </div>

                                            <div class="problem-card-bottom-row">
                                                <div class="badges-group">
                                                    <span class="badge badge-${diffClass}">${p.difficulty}</span>
                                                    <span class="badge badge-platform ${platClass}">${p.platform}</span>
                                                </div>
                                                <div class="actions-group">
                                                    <button class="action-icon-btn note-action-btn ${hasNote ? "has-note" : ""}" title="Personal Notes">
                                                        📝
                                                    </button>
                                                    ${p.url && p.url !== "#" ? `
                                                        <a href="${p.url}" target="_blank" rel="noopener" class="action-icon-btn" title="Open Problem">
                                                            🎯
                                                        </a>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    getSectionIcon(sectionName) {
        const s = (sectionName || "").toLowerCase();
        if (s.includes("basic")) return "🧠";
        if (s.includes("math")) return "🔢";
        if (s.includes("bit")) return "⚙️";
        if (s.includes("array")) return "📐";
        if (s.includes("hash")) return "#️⃣";
        if (s.includes("string")) return "💬";
        if (s.includes("binary search") || s.includes("searching")) return "🔍";
        if (s.includes("linked list")) return "🔗";
        if (s.includes("stack")) return "📚";
        if (s.includes("queue")) return "🚦";
        if (s.includes("recursion")) return "🔄";
        if (s.includes("backtracking")) return "🌿";
        if (s.includes("greedy")) return "💡";
        if (s.includes("heap")) return "⛰️";
        if (s.includes("binary tree") || s.includes("tree")) return "🌳";
        if (s.includes("trie")) return "🌲";
        if (s.includes("graph")) return "🕸️";
        if (s.includes("dynamic") || s.includes("dp")) return "🧩";
        if (sectionName.includes("01")) return "🧠";
        if (sectionName.includes("02")) return "🔢";
        if (sectionName.includes("03")) return "#️⃣";
        if (sectionName.includes("04")) return "🔀";
        if (sectionName.includes("05")) return "📐";
        if (sectionName.includes("06")) return "🟦";
        if (sectionName.includes("07")) return "🔍";
        if (sectionName.includes("08")) return "💬";
        if (sectionName.includes("09")) return "🔗";
        if (sectionName.includes("10")) return "🔄";
        if (sectionName.includes("11")) return "🌿";
        if (sectionName.includes("12")) return "⚙️";
        if (sectionName.includes("13")) return "📚";
        if (sectionName.includes("14")) return "🚦";
        if (sectionName.includes("15")) return "🪟";
        if (sectionName.includes("16")) return "👆";
        if (sectionName.includes("17")) return "⛰️";
        if (sectionName.includes("18")) return "💡";
        if (sectionName.includes("19")) return "🌳";
        if (sectionName.includes("20")) return "🔎";
        if (sectionName.includes("21")) return "🕸️";
        if (sectionName.includes("22")) return "🧩";
        if (sectionName.includes("23")) return "🌲";
        return "📖";
    },

    toggleProblemCompletion(problemId) {
        const user = StorageManager.getCurrentUser();
        if (!user) {
            AuthManager.openModal("login");
            this.showToast("Please log in to track your progress.");
            return;
        }

        const idNum = typeof problemId === "number" ? problemId : parseInt(problemId, 10);
        const activeDataset = this._getActiveDataset();
        let problem = activeDataset.find(p => p.id === problemId || p.id === idNum || String(p.id) === String(problemId));
        if (!problem && typeof PROBLEMS !== "undefined" && Array.isArray(PROBLEMS)) {
            problem = PROBLEMS.find(p => p.id === problemId || p.id === idNum || String(p.id) === String(problemId));
        }
        if (!problem && typeof BASIC_DSA_PROBLEMS !== "undefined" && Array.isArray(BASIC_DSA_PROBLEMS)) {
            problem = BASIC_DSA_PROBLEMS.find(p => p.id === problemId || p.id === idNum || String(p.id) === String(problemId));
        }

        if (!problem) {
            console.warn(`Problem #${problemId} not found.`);
            return;
        }

        const canonicalId = problem.id;
        if (!user.completedProblems) user.completedProblems = [];
        const idx = user.completedProblems.findIndex(p => p === canonicalId || p === idNum || String(p) === String(canonicalId));
        const title = problem.title || `Problem #${canonicalId}`;

        if (idx === -1) {
            user.completedProblems.push(canonicalId);
            AnalyticsEngine.updateStreakOnCompletion(user);
            AnalyticsEngine.logActivity(user, "PROBLEM_COMPLETED", `Completed: ${title}`);
            this.showToast(`Completed: ${title}`);
        } else {
            user.completedProblems.splice(idx, 1);
            const todayStr = new Date().toISOString().split("T")[0];
            if (user.completionDates && typeof user.completionDates[todayStr] === "number" && user.completionDates[todayStr] > 0) {
                user.completionDates[todayStr] -= 1;
            }
            AnalyticsEngine.logActivity(user, "PROBLEM_UNCOMPLETED", `Unmarked: ${title}`);
            this.showToast(`Unmarked: ${title}`);
        }

        StorageManager.saveCurrentUser(user);
        this.renderApp();
        if (typeof StreakCalendar !== "undefined") {
            StreakCalendar.render();
        }
    },

    toggleProblem(problemId) {
        return this.toggleProblemCompletion(problemId);
    },

    toggleFavorite(problemId) {
        const user = StorageManager.getCurrentUser();
        if (!user) {
            AuthManager.openModal("login");
            this.showToast("Please log in to save favorites.");
            return;
        }

        const activeDataset = this._getActiveDataset();
        const problem = activeDataset.find(p => p.id === problemId);
        if (!problem) return;

        if (!user.favorites) user.favorites = [];
        const idx = user.favorites.indexOf(problemId);

        if (idx === -1) {
            user.favorites.push(problemId);
            this.showToast("Added to favorites");
        } else {
            user.favorites.splice(idx, 1);
            this.showToast("Removed from favorites");
        }

        StorageManager.saveCurrentUser(user);
        this.renderApp();
    },

    currentActiveProblemIdForNote: null,

    openNotesModal(problemId) {
        const user = StorageManager.getCurrentUser();
        if (!user) {
            AuthManager.openModal("login");
            this.showToast("Please log in to save notes.");
            return;
        }

        this.currentActiveProblemIdForNote = problemId;
        const activeDataset = this._getActiveDataset();
        const problem = activeDataset.find(p => p.id === problemId);
        const modal = document.getElementById("notes-modal-overlay");
        const titleEl = document.getElementById("notes-modal-title");
        const textarea = document.getElementById("notes-textarea");

        if (titleEl && problem) titleEl.textContent = `Notes: ${problem.title}`;
        if (textarea) textarea.value = (user.notes && user.notes[problemId]) || "";
        if (modal) modal.classList.add("active");
    },

    saveNote() {
        const user = StorageManager.getCurrentUser();
        const problemId = this.currentActiveProblemIdForNote;
        if (!user || !problemId) return;

        const textarea = document.getElementById("notes-textarea");
        const noteText = textarea ? textarea.value.trim() : "";

        if (!user.notes) user.notes = {};
        if (noteText) {
            user.notes[problemId] = noteText;
            this.showToast("Note saved.");
        } else {
            delete user.notes[problemId];
            this.showToast("Note cleared.");
        }

        StorageManager.saveCurrentUser(user);
        const modal = document.getElementById("notes-modal-overlay");
        if (modal) modal.classList.remove("active");
        this.renderApp();
    },

    showToast(message) {
        if (typeof ContestUI !== "undefined" && ContestUI.showToast) {
            ContestUI.showToast(message);
            return;
        }
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }
};

window.UIManager = UIManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
