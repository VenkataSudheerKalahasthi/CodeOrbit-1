/**
 * Storage Manager for DSA Practice Tracker
 * Serves as the local cache and synchronization bridge between the CodeOrbit UI
 * and Supabase cloud persistence layer.
 */

const StorageManager = {
    STORAGE_KEY_USERS: "dsa_tracker_users_v1",
    STORAGE_KEY_CURRENT_USER: "dsa_tracker_current_user_id_v1",

    // Password Hashing via Web Crypto API (SHA-256 fallback for offline local accounts)
    async hashPassword(password) {
        if (!window.crypto || !window.crypto.subtle) {
            return btoa(password);
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    },

    getUsers() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_USERS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Failed to load users from localStorage:", e);
            return [];
        }
    },

    saveUsers(users) {
        try {
            localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
        } catch (e) {
            console.error("Failed to save users to localStorage:", e);
        }
    },

    getCurrentUserId() {
        return localStorage.getItem(this.STORAGE_KEY_CURRENT_USER);
    },

    setCurrentUserId(userId) {
        if (userId) {
            localStorage.setItem(this.STORAGE_KEY_CURRENT_USER, userId);
        } else {
            localStorage.removeItem(this.STORAGE_KEY_CURRENT_USER);
        }
    },

    getCurrentUser() {
        const userId = this.getCurrentUserId();
        if (!userId) return null;
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },

    getUserById(userId) {
        if (!userId) return null;
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },

    saveCurrentUserLocally(updatedUser) {
        if (!updatedUser) return;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === updatedUser.id);
        if (idx !== -1) {
            users[idx] = updatedUser;
        } else {
            users.push(updatedUser);
        }
        this.saveUsers(users);
    },

    saveCurrentUser(updatedUser, syncToCloud = true) {
        if (!updatedUser) return;
        this.saveCurrentUserLocally(updatedUser);

        // Asynchronously sync with Supabase in background if requested
        if (syncToCloud) {
            this.syncToCloudBackground(updatedUser);
        }
    },

    /**
     * Non-blocking background sync of updated user progress to Supabase
     */
    async syncToCloudBackground(user) {
        if (!user || !user.id || typeof window.SupabaseConfig === 'undefined' || !window.SupabaseConfig.isConfigured()) {
            return;
        }

        try {
            const userId = user.id;

            // 1. Sync problem progress
            if (Array.isArray(user.completedProblems) && window.ProgressService) {
                const items = user.completedProblems.map(pId => ({
                    problem_id: String(pId),
                    completed: true,
                    completed_at: (user.completionDates && user.completionDates[pId]) || new Date().toISOString()
                }));
                await ProgressService.batchSaveProblemProgress(userId, items);
            }

            // 2. Sync favorites
            if (Array.isArray(user.favorites) && window.ProgressService) {
                await ProgressService.batchSaveFavorites(userId, user.favorites);
            }

            // 3. Sync notes
            if (user.notes && window.ProgressService) {
                await ProgressService.batchSaveNotes(userId, user.notes);
            }

            // 4. Sync stats
            if (window.StatsService) {
                await StatsService.saveUserStats(userId, {
                    stars: user.dailyMissionStars || 0,
                    current_streak: user.currentStreak || 0,
                    longest_streak: user.longestStreak || 0,
                    total_completed: (user.completedProblems || []).length,
                    last_activity_date: user.lastActiveDate || new Date().toISOString().split('T')[0]
                });
            }

            // 5. Sync activity
            if (user.completionDates && window.ActivityService) {
                await ActivityService.batchSaveActivity(userId, user.completionDates);
            }
        } catch (err) {
            console.warn("StorageManager: Background cloud sync error:", err.message);
        }
    },

    async registerUser(username, password) {
        const cleanName = username.trim();
        if (!cleanName) {
            throw new Error("Username cannot be empty.");
        }
        if (!password || password.length < 3) {
            throw new Error("Password must be at least 3 characters long.");
        }

        const users = this.getUsers();
        const existing = users.find(u => u.username.toLowerCase() === cleanName.toLowerCase());
        if (existing) {
            throw new Error("Username already taken. Please choose another.");
        }

        const hash = await this.hashPassword(password);
        const newUser = {
            id: "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
            username: cleanName,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            completedProblems: [],
            favorites: [],
            notes: {},
            completionDates: {},
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
            dailyMissionStars: 0,
            dailyMissionRewardedDates: {},
            activity: [
                {
                    type: "ACCOUNT_CREATED",
                    description: "Account created",
                    timestamp: new Date().toISOString()
                }
            ],
            settings: {
                theme: localStorage.getItem("codecal_theme") || "dark"
            }
        };

        users.push(newUser);
        this.saveUsers(users);
        this.setCurrentUserId(newUser.id);
        return newUser;
    },

    async loginUser(username, password) {
        const cleanName = username.trim();
        if (!cleanName || !password) {
            throw new Error("Please enter both username and password.");
        }

        const users = this.getUsers();
        const user = users.find(u => u.username.toLowerCase() === cleanName.toLowerCase());
        if (!user) {
            throw new Error("User not found. Please sign up first.");
        }

        const hash = await this.hashPassword(password);
        if (user.passwordHash !== hash) {
            throw new Error("Incorrect password.");
        }

        this.setCurrentUserId(user.id);
        return user;
    },

    logout() {
        this.setCurrentUserId(null);
        if (window.AuthService) {
            window.AuthService.signOut().catch(() => {});
        }
    },

    exportUserData() {
        const user = this.getCurrentUser();
        if (!user) throw new Error("No active user session.");
        
        const exportData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            userData: {
                username: user.username,
                completedProblems: user.completedProblems || [],
                favorites: user.favorites || [],
                notes: user.notes || {},
                completionDates: user.completionDates || {},
                currentStreak: user.currentStreak || 0,
                longestStreak: user.longestStreak || 0,
                lastActiveDate: user.lastActiveDate || null,
                dailyMissionStars: user.dailyMissionStars || 0,
                dailyMissionRewardedDates: user.dailyMissionRewardedDates || {},
                activity: user.activity || [],
                settings: user.settings || {}
            }
        };
        return JSON.stringify(exportData, null, 2);
    },

    importUserData(jsonString) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) throw new Error("No active user session.");

        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e) {
            throw new Error("Invalid JSON backup file.");
        }

        if (!parsed || !parsed.userData) {
            throw new Error("Unrecognized backup format.");
        }

        const d = parsed.userData;
        currentUser.completedProblems = Array.isArray(d.completedProblems) ? d.completedProblems : [];
        currentUser.favorites = Array.isArray(d.favorites) ? d.favorites : [];
        currentUser.notes = typeof d.notes === "object" ? d.notes : {};
        currentUser.completionDates = typeof d.completionDates === "object" ? d.completionDates : {};
        currentUser.currentStreak = typeof d.currentStreak === "number" ? d.currentStreak : 0;
        currentUser.longestStreak = typeof d.longestStreak === "number" ? d.longestStreak : 0;
        currentUser.lastActiveDate = d.lastActiveDate || null;
        currentUser.dailyMissionStars = typeof d.dailyMissionStars === "number" ? d.dailyMissionStars : 0;
        currentUser.dailyMissionRewardedDates = (d.dailyMissionRewardedDates && typeof d.dailyMissionRewardedDates === "object") ? d.dailyMissionRewardedDates : {};
        currentUser.activity = Array.isArray(d.activity) ? d.activity : [];

        this.saveCurrentUser(currentUser);
        return currentUser;
    },

    resetCurrentUserData() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        currentUser.completedProblems = [];
        currentUser.favorites = [];
        currentUser.notes = {};
        currentUser.completionDates = {};
        currentUser.currentStreak = 0;
        currentUser.longestStreak = 0;
        currentUser.lastActiveDate = null;
        currentUser.dailyMissionStars = 0;
        currentUser.dailyMissionRewardedDates = {};
        currentUser.activity = [
            {
                type: "DATA_RESET",
                description: "Progress reset",
                timestamp: new Date().toISOString()
            }
        ];

        this.saveCurrentUser(currentUser);
        return currentUser;
    }
};

window.StorageManager = StorageManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
