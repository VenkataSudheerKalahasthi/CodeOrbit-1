/**
 * Authoritative Competitive Leaderboard Service for CodeOrbit
 * 
 * Computes deterministic competitive scores from verified Supabase records.
 * Exposes ONLY public competitive fields. Zero mock or fake data.
 * 
 * SCORING FORMULA:
 * - All-Time: (stars * 10) + (current_streak * 15) + (completed_problems * 5) + (longest_streak * 5)
 * - Weekly:   (weekly_stars * 10) + (weekly_problems * 15) + (weekly_active_days * 20)
 * - Monthly:  (monthly_stars * 10) + (monthly_problems * 15) + (monthly_active_days * 20)
 * 
 * TIE-BREAKING:
 * 1. competitive_score DESC
 * 2. completed_problems DESC
 * 3. stars DESC
 * 4. user_id ASC (string comparison)
 */

(function () {
    'use strict';

    // In-memory cache of previous rank snapshots for live delta tracking
    // Map<category, Map<userId, previousRank>>
    const _previousRankSnapshots = {
        'all-time': new Map(),
        'weekly': new Map(),
        'monthly': new Map()
    };

    const LeaderboardService = {
        get client() {
            return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
        },

        /**
         * Calculate deterministic All-Time competitive score
         */
        calculateAllTimeScore(stats = {}) {
            const stars = Math.max(0, parseInt(stats.stars, 10) || 0);
            const currentStreak = Math.max(0, parseInt(stats.current_streak || stats.currentStreak, 10) || 0);
            const longestStreak = Math.max(0, parseInt(stats.longest_streak || stats.longestStreak, 10) || 0);
            const completedProblems = Math.max(0, parseInt(stats.total_completed || stats.completed_problems || stats.totalCompleted, 10) || 0);

            return (stars * 10) + (currentStreak * 15) + (completedProblems * 5) + (longestStreak * 5);
        },

        /**
         * Calculate deterministic Period (Weekly / Monthly) competitive score
         */
        calculatePeriodScore(periodStats = {}) {
            const stars = Math.max(0, parseInt(periodStats.stars || periodStats.weekly_stars || periodStats.monthly_stars, 10) || 0);
            const problems = Math.max(0, parseInt(periodStats.completed_problems || periodStats.problems_solved || periodStats.weekly_problems || periodStats.monthly_problems, 10) || 0);
            const activeDays = Math.max(0, parseInt(periodStats.active_days || periodStats.weekly_active_days || periodStats.monthly_active_days, 10) || 0);

            return (stars * 10) + (problems * 15) + (activeDays * 20);
        },

        /**
         * Compare two contestant records for deterministic ranking
         */
        _compareContestants(a, b) {
            // 1. Score DESC
            if (b.competitiveScore !== a.competitiveScore) {
                return b.competitiveScore - a.competitiveScore;
            }
            // 2. Completed Problems DESC
            if (b.completedProblems !== a.completedProblems) {
                return b.completedProblems - a.completedProblems;
            }
            // 3. Stars DESC
            if (b.stars !== a.stars) {
                return b.stars - a.stars;
            }
            // 4. User ID ASC
            const idA = String(a.userId || a.id || '');
            const idB = String(b.userId || b.id || '');
            return idA.localeCompare(idB);
        },

        /**
         * Get start of current week (Monday 00:00:00) in ISO YYYY-MM-DD
         */
        getWeekStartDateString() {
            const now = new Date();
            const day = now.getDay();
            // In JS: 0=Sun, 1=Mon, ..., 6=Sat
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(now.setDate(diff));
            return monday.toISOString().split('T')[0];
        },

        /**
         * Get start of current month (1st of month) in ISO YYYY-MM-DD
         */
        getMonthStartDateString() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}-01`;
        },

        /**
         * Fetch competitive leaderboard from Supabase
         * @param {string} timeframe - 'all-time' | 'weekly' | 'monthly'
         * @param {number} limit - maximum top results to return (default 10)
         * @param {string|null} currentUserId - optional current user UUID to look up position
         */
        async getLeaderboard(timeframe = 'all-time', limit = 10, currentUserId = null) {
            if (!this.client) {
                return {
                    success: false,
                    error: 'Supabase client is not initialized.',
                    users: [],
                    currentUserPosition: null,
                    totalCount: 0,
                    category: timeframe
                };
            }

            const categoryKey = ['weekly', 'monthly', 'all-time'].includes(timeframe) ? timeframe : 'all-time';

            try {
                // 1. First attempt authoritative database RPC function
                let rankedRows = [];
                let rpcSucceeded = false;

                try {
                    const { data: rpcData, error: rpcError } = await this.client.rpc('get_competitive_leaderboard', {
                        p_timeframe: categoryKey,
                        p_limit: 100
                    });

                    if (!rpcError && Array.isArray(rpcData)) {
                        rankedRows = rpcData.map(r => ({
                            userId: r.user_id,
                            username: r.username || 'Coder',
                            displayName: r.display_name || r.username || 'Coder',
                            avatarUrl: r.avatar_url || '',
                            stars: r.stars || 0,
                            currentStreak: r.current_streak || 0,
                            longestStreak: r.longest_streak || 0,
                            completedProblems: r.completed_problems || 0,
                            activeDays: r.active_days || 0,
                            competitiveScore: r.competitive_score || 0
                        }));
                        rpcSucceeded = true;
                    }
                } catch (rpcEx) {
                    // Fallback to table queries if RPC is not yet registered
                }

                // 2. Direct fallback query if RPC was unavailable
                if (!rpcSucceeded) {
                    rankedRows = await this._fetchLeaderboardDirect(categoryKey);
                }

                // Sort deterministically
                rankedRows.sort(this._compareContestants);

                // Assign 1-indexed ranks and compute rank movements
                const prevSnapshot = _previousRankSnapshots[categoryKey];
                const hasPreviousSnapshot = prevSnapshot.size > 0;
                const newSnapshot = new Map();

                const processedUsers = rankedRows.map((user, idx) => {
                    const currentRank = idx + 1;
                    newSnapshot.set(user.userId, currentRank);

                    let movement = 0; // 0 = unchanged, >0 = moved up, <0 = moved down
                    let movementText = '—';

                    if (hasPreviousSnapshot && prevSnapshot.has(user.userId)) {
                        const prevRank = prevSnapshot.get(user.userId);
                        movement = prevRank - currentRank; // e.g. prev 3, now 1 => +2
                        if (movement > 0) {
                            movementText = `↑ +${movement}`;
                        } else if (movement < 0) {
                            movementText = `↓ ${movement}`;
                        } else {
                            movementText = '—';
                        }
                    }

                    return {
                        ...user,
                        rank: currentRank,
                        movement,
                        movementText
                    };
                });

                // Update in-memory snapshot for subsequent realtime comparisons
                _previousRankSnapshots[categoryKey] = newSnapshot;

                // Find current logged-in user position
                let currentUserPosition = null;
                if (currentUserId) {
                    const foundIdx = processedUsers.findIndex(u => u.userId === currentUserId || String(u.userId) === String(currentUserId));
                    if (foundIdx !== -1) {
                        currentUserPosition = {
                            ...processedUsers[foundIdx],
                            inTop: foundIdx < limit
                        };
                    } else {
                        // User exists but has 0 activity for this category period
                        currentUserPosition = await this._fetchSingleUserPosition(currentUserId, categoryKey, processedUsers.length + 1);
                    }
                }

                const topUsers = processedUsers.slice(0, limit);

                return {
                    success: true,
                    users: topUsers,
                    currentUserPosition,
                    totalCount: processedUsers.length,
                    category: categoryKey
                };
            } catch (err) {
                console.warn('LeaderboardService.getLeaderboard error:', err);
                return {
                    success: false,
                    error: err.message || 'Failed to fetch leaderboard.',
                    users: [],
                    currentUserPosition: null,
                    totalCount: 0,
                    category: categoryKey
                };
            }
        },

        /**
         * Fallback direct query on public profiles & user_stats tables (RLS protected)
         */
        async _fetchLeaderboardDirect(categoryKey) {
            if (!this.client) return [];

            const { data, error } = await this.client
                .from('profiles')
                .select(`
                    id,
                    username,
                    display_name,
                    avatar_url,
                    user_stats (
                        stars,
                        current_streak,
                        longest_streak,
                        total_completed
                    )
                `);

            if (error || !Array.isArray(data)) {
                console.warn('Error in _fetchLeaderboardDirect:', error);
                return [];
            }

            return data.map(p => {
                const s = Array.isArray(p.user_stats) ? p.user_stats[0] : p.user_stats;
                const statsObj = {
                    stars: s?.stars || 0,
                    current_streak: s?.current_streak || 0,
                    longest_streak: s?.longest_streak || 0,
                    total_completed: s?.total_completed || 0
                };

                const score = this.calculateAllTimeScore(statsObj);

                return {
                    userId: p.id,
                    username: p.username || 'Coder',
                    displayName: p.display_name || p.username || 'Coder',
                    avatarUrl: p.avatar_url || '',
                    stars: statsObj.stars,
                    currentStreak: statsObj.current_streak,
                    longestStreak: statsObj.longest_streak,
                    completedProblems: statsObj.total_completed,
                    activeDays: 0,
                    competitiveScore: score
                };
            });
        },

        /**
         * Lookup single user details if they fall outside the current list
         */
        async _fetchSingleUserPosition(userId, categoryKey, defaultRank = 999) {
            if (!this.client || !userId) return null;
            try {
                const { data: profile } = await this.client
                    .from('profiles')
                    .select('id, username, display_name, avatar_url')
                    .eq('id', userId)
                    .maybeSingle();

                const { data: stats } = await this.client
                    .from('user_stats')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!profile) return null;

                const stars = stats?.stars || 0;
                const currentStreak = stats?.current_streak || 0;
                const longestStreak = stats?.longest_streak || 0;
                const totalCompleted = stats?.total_completed || 0;

                const score = this.calculateAllTimeScore({
                    stars,
                    current_streak: currentStreak,
                    longest_streak: longestStreak,
                    total_completed: totalCompleted
                });

                return {
                    userId: profile.id,
                    username: profile.username || 'You',
                    displayName: profile.display_name || profile.username || 'You',
                    avatarUrl: profile.avatar_url || '',
                    stars,
                    currentStreak,
                    longestStreak,
                    completedProblems: totalCompleted,
                    activeDays: 0,
                    competitiveScore: score,
                    rank: defaultRank,
                    movement: 0,
                    movementText: '—',
                    inTop: false
                };
            } catch (e) {
                return null;
            }
        },

        /**
         * Clear cached rank movement snapshots (e.g. on manual reset or logout)
         */
        clearSnapshots() {
            _previousRankSnapshots['all-time'].clear();
            _previousRankSnapshots['weekly'].clear();
            _previousRankSnapshots['monthly'].clear();
        }
    };

    window.LeaderboardService = LeaderboardService;
})();
