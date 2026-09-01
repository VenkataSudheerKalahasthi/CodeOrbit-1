/**
 * Migration & Synchronization Service for CodeOrbit
 * Performs safe, idempotent merging of legacy LocalStorage data into Supabase
 * and restores cloud data to local cache across devices.
 */

const MigrationService = {
    MIGRATION_FLAG_PREFIX: 'codeorbit_migrated_',

    /**
     * Migrate local legacy data to Supabase (Idempotent merge)
     * Strictly isolates data by Supabase user UUID (auth.uid())
     */
    async migrateToCloud(userId) {
        if (!userId) return;

        const flagKey = this.MIGRATION_FLAG_PREFIX + userId;
        const alreadyMigrated = localStorage.getItem(flagKey);

        // 1. Gather all local data strictly owned by this userId
        let localUser = null;
        try {
            const rawUsers = localStorage.getItem('dsa_tracker_users_v1');
            const users = rawUsers ? JSON.parse(rawUsers) : [];
            localUser = users.find(u => u.id === userId) || null;
        } catch (e) {
            console.warn('Migration: Failed to read local users:', e);
        }

        let localPOTD = {};
        try {
            const rawPOTD = localStorage.getItem('ctrl_alt_career_potd_progress');
            const potdData = rawPOTD ? JSON.parse(rawPOTD) : {};
            localPOTD = potdData[userId] || {};
        } catch (e) {
            console.warn('Migration: Failed to read local POTD:', e);
        }

        let localReminders = {};
        try {
            const rawReminders = localStorage.getItem('codecal_reminders');
            const remData = rawReminders ? JSON.parse(rawReminders) : {};
            localReminders = remData[userId] || {};
        } catch (e) {
            console.warn('Migration: Failed to read local reminders:', e);
        }

        if (!localUser && Object.keys(localPOTD).length === 0 && Object.keys(localReminders).length === 0) {
            // No local data to migrate
            localStorage.setItem(flagKey, 'true');
            return;
        }

        console.log(`MigrationService: Migrating local data for user ${userId}...`);

        try {
            // A. Migrate completed problems
            if (localUser && Array.isArray(localUser.completedProblems) && localUser.completedProblems.length > 0) {
                const cloudProgress = await ProgressService.getProblemProgress(userId);
                const cloudMap = new Map(cloudProgress.map(p => [String(p.problem_id), p]));

                const itemsToSave = [];
                localUser.completedProblems.forEach(pId => {
                    const sId = String(pId);
                    if (!cloudMap.has(sId) || !cloudMap.get(sId).completed) {
                        itemsToSave.push({
                            problem_id: sId,
                            completed: true,
                            completed_at: (localUser.completionDates && localUser.completionDates[sId]) || new Date().toISOString()
                        });
                    }
                });

                if (itemsToSave.length > 0) {
                    await ProgressService.batchSaveProblemProgress(userId, itemsToSave);
                }
            }

            // B. Migrate favorites
            if (localUser && Array.isArray(localUser.favorites) && localUser.favorites.length > 0) {
                await ProgressService.batchSaveFavorites(userId, localUser.favorites);
            }

            // C. Migrate notes
            if (localUser && localUser.notes && typeof localUser.notes === 'object') {
                await ProgressService.batchSaveNotes(userId, localUser.notes);
            }

            // D. Migrate daily activity dates
            if (localUser && localUser.completionDates && typeof localUser.completionDates === 'object') {
                await ActivityService.batchSaveActivity(userId, localUser.completionDates);
            }

            // E. Migrate user stats
            if (localUser) {
                const existingStats = await StatsService.getUserStats(userId);
                const mergedStars = Math.max(existingStats?.stars || 0, localUser.dailyMissionStars || 0);
                const mergedCurrentStreak = Math.max(existingStats?.current_streak || 0, localUser.currentStreak || 0);
                const mergedLongestStreak = Math.max(existingStats?.longest_streak || 0, localUser.longestStreak || 0);
                const totalComp = (localUser.completedProblems || []).length;

                await StatsService.saveUserStats(userId, {
                    stars: mergedStars,
                    current_streak: mergedCurrentStreak,
                    longest_streak: mergedLongestStreak,
                    total_completed: Math.max(existingStats?.total_completed || 0, totalComp),
                    last_activity_date: localUser.lastActiveDate || new Date().toISOString().split('T')[0]
                });
            }

            // F. Migrate POTD progress
            if (Object.keys(localPOTD).length > 0) {
                await ChallengeService.batchSavePOTDProgress(userId, localPOTD);
            }

            // G. Migrate contest reminders
            if (Object.keys(localReminders).length > 0) {
                await ContestService.batchSaveReminders(userId, localReminders);
            }

            localStorage.setItem(flagKey, 'true');
            console.log('MigrationService: Migration completed successfully.');
        } catch (err) {
            console.error('MigrationService error during migration:', err);
        }
    },

    _restorePromise: null,
    _lastRestoredUserId: null,

    /**
     * Restore all cloud state to local cache for fast responsive UI
     * Thread-safe / deduplicated: concurrent callers share single in-flight Promise.
     */
    async restoreFromCloud(userId) {
        if (!userId) return null;

        if (this._restorePromise && this._lastRestoredUserId === userId) {
            return this._restorePromise;
        }

        this._lastRestoredUserId = userId;
        this._restorePromise = (async () => {
            try {
                const [
                    profile,
                    progressList,
                    favorites,
                    notes,
                    stats,
                    activityList,
                    challenges,
                    contests,
                    roadmapList
                ] = await Promise.all([
                    ProfileService.getProfile(userId),
                    ProgressService.getProblemProgress(userId),
                    ProgressService.getFavorites(userId),
                    ProgressService.getNotes(userId),
                    StatsService.getUserStats(userId),
                    ActivityService.getUserActivity(userId),
                    ChallengeService.getDailyChallenges(userId),
                    ContestService.getUserContests(userId),
                    RoadmapService.getUserRoadmap(userId)
                ]);

            // 1. Process progressList (the single source of truth for problem completion)
            const completedProblemsSet = new Set();
            const dailyCountsFromProgress = {};

            (progressList || []).forEach(p => {
                if (p.completed) {
                    const pid = isNaN(Number(p.problem_id)) ? String(p.problem_id).trim() : Number(p.problem_id);
                    completedProblemsSet.add(pid);

                    // Group by local calendar date of completed_at / updated_at
                    const dateVal = p.completed_at || p.updated_at;
                    const dateKey = (typeof AnalyticsEngine !== 'undefined' && AnalyticsEngine.getLocalDateKey)
                        ? AnalyticsEngine.getLocalDateKey(dateVal)
                        : (dateVal ? dateVal.split('T')[0] : null);

                    if (dateKey) {
                        dailyCountsFromProgress[dateKey] = (dailyCountsFromProgress[dateKey] || 0) + 1;
                    }
                }
            });

            const completedProblems = Array.from(completedProblemsSet);

            // 2. Merge daily completion dates with user_activity table
            const completionDates = { ...dailyCountsFromProgress };
            (activityList || []).forEach(a => {
                if (a.activity_date) {
                    completionDates[a.activity_date] = Math.max(
                        completionDates[a.activity_date] || 0,
                        typeof a.problems_solved === 'number' ? a.problems_solved : 0
                    );
                }
            });

            // Extract daily mission rewarded dates from challenges
            const dailyMissionRewardedDates = {};
            (challenges || []).forEach(c => {
                if (c.challenge_type === 'daily_mission' && c.completed) {
                    dailyMissionRewardedDates[c.challenge_date] = true;
                }
            });

            // Authoritative username resolution
            let resolvedUsername = profile?.username;
            let resolvedDisplayName = profile?.display_name || profile?.username;
            if ((!resolvedUsername || resolvedUsername === 'User') && window.SupabaseConfig) {
                try {
                    const client = window.SupabaseConfig.getClient();
                    if (client) {
                        const { data: { user: authUser } } = await client.auth.getUser();
                        if (authUser && authUser.id === userId && authUser.user_metadata?.username) {
                            resolvedUsername = authUser.user_metadata.username;
                            resolvedDisplayName = authUser.user_metadata.display_name || resolvedUsername;
                        }
                    }
                } catch (_) {}
            }

            const cacheUser = {
                id: userId,
                username: resolvedUsername || 'User',
                displayName: resolvedDisplayName || resolvedUsername || 'User',
                avatarUrl: profile?.avatar_url || '',
                createdAt: profile?.created_at || new Date().toISOString(),
                completedProblems: completedProblems,
                favorites: favorites || [],
                notes: notes || {},
                completionDates: completionDates,
                currentStreak: stats?.current_streak || 0,
                longestStreak: stats?.longest_streak || 0,
                lastActiveDate: stats?.last_activity_date || null,
                dailyMissionStars: stats?.stars || 0,
                dailyMissionRewardedDates: dailyMissionRewardedDates,
                activity: (activityList || []).map(a => ({
                    type: 'PROBLEM_COMPLETED',
                    description: `Active on ${a.activity_date}`,
                    timestamp: `${a.activity_date}T12:00:00.000Z`
                })),
                settings: {
                    theme: localStorage.getItem('codecal_theme') || 'dark'
                }
            };

            // Update POTD local cache
            try {
                const rawPOTD = localStorage.getItem('ctrl_alt_career_potd_progress');
                const potdData = rawPOTD ? JSON.parse(rawPOTD) : {};
                const uKey = userId;
                if (!potdData[uKey]) potdData[uKey] = {};

                (challenges || []).forEach(c => {
                    if (!potdData[uKey][c.challenge_date]) potdData[uKey][c.challenge_date] = {};
                    if (c.challenge_type === 'potd_leetcode') potdData[uKey][c.challenge_date].leetcode = c.completed;
                    if (c.challenge_type === 'potd_gfg') potdData[uKey][c.challenge_date].geeksforgeeks = c.completed;
                });
                localStorage.setItem('ctrl_alt_career_potd_progress', JSON.stringify(potdData));
            } catch (e) {
                console.warn('Failed to update local POTD cache:', e);
            }

            // Update Contests reminders local cache
            try {
                const rawRem = localStorage.getItem('codecal_reminders');
                const remData = rawRem ? JSON.parse(rawRem) : {};
                const uKey = userId;
                if (!remData[uKey]) remData[uKey] = {};

                (contests || []).forEach(c => {
                    if (c.registered) {
                        remData[uKey][c.contest_id] = true;
                    }
                });
                localStorage.setItem('codecal_reminders', JSON.stringify(remData));
            } catch (e) {
                console.warn('Failed to update local reminders cache:', e);
            }

            // Update StorageManager cache locally without triggering circular cloud sync
            if (window.StorageManager) {
                window.StorageManager.saveCurrentUserLocally(cacheUser);
                window.StorageManager.setCurrentUserId(userId);
            }

            // Re-render UI components with cloud state
            if (window.UIManager) {
                window.UIManager.renderApp();
            }
            if (window.POTDManager) {
                window.POTDManager.updateCardCompletionState();
            }
            if (window.ContestUI) {
                window.ContestUI.renderAll(false);
            }
            if (window.DailyMissionManager) {
                window.DailyMissionManager.render();
            }
            if (window.StreakCalendar) {
                window.StreakCalendar.render();
            }

            console.log('MigrationService: Cloud state restored successfully.');
            return cacheUser;
        } catch (err) {
            console.error('MigrationService: Failed to restore from cloud:', err);
            return null;
        } finally {
            this._restorePromise = null;
        }
    })();

    return this._restorePromise;
}
};

window.MigrationService = MigrationService;
