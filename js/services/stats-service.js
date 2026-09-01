/**
 * Stats Service for CodeOrbit
 * Manages authoritative user statistics (stars, streaks, completion counts)
 * and provides competitive leaderboard data.
 */

const StatsService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getUserStats(userId) {
        if (!this.client || !userId) return null;
        try {
            const { data, error } = await this.client
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('StatsService.getUserStats error:', e.message);
            return null;
        }
    },

    async saveUserStats(userId, stats) {
        if (!this.client || !userId) return null;
        try {
            const payload = {
                user_id: userId,
                stars: typeof stats.stars === 'number' ? stats.stars : 0,
                current_streak: typeof stats.current_streak === 'number' ? stats.current_streak : 0,
                longest_streak: typeof stats.longest_streak === 'number' ? stats.longest_streak : 0,
                total_completed: typeof stats.total_completed === 'number' ? stats.total_completed : 0,
                last_activity_date: stats.last_activity_date || new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('user_stats')
                .upsert(payload, { onConflict: 'user_id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('StatsService.saveUserStats error:', e.message);
            return null;
        }
    },

    /**
     * Authoritative calculation of user completion stats directly from Supabase problem_progress.
     * Returns { totalCompleted, totalAvailable, remaining, percentage, uniqueCompletedIds, dailyCompletedByDate }
     */
    async getUserCompletionStats(userId, dataset = null) {
        if (!this.client || !userId) {
            const user = (typeof StorageManager !== 'undefined') ? StorageManager.getCurrentUser() : null;
            const problems = dataset || (typeof PROBLEMS !== 'undefined' ? PROBLEMS : []);
            return (typeof AnalyticsEngine !== 'undefined') ? AnalyticsEngine.calculateStats(user, problems) : null;
        }

        try {
            const { data: progressList, error } = await this.client
                .from('problem_progress')
                .select('problem_id, completed, completed_at, updated_at')
                .eq('user_id', userId)
                .eq('completed', true);

            if (error) throw error;

            const completedSet = new Set();
            const dailyMap = {};

            (progressList || []).forEach(p => {
                const pid = isNaN(Number(p.problem_id)) ? String(p.problem_id).trim() : Number(p.problem_id);
                completedSet.add(pid);

                const dKey = (typeof AnalyticsEngine !== 'undefined' && AnalyticsEngine.getLocalDateKey)
                    ? AnalyticsEngine.getLocalDateKey(p.completed_at || p.updated_at)
                    : (p.completed_at || p.updated_at || '').split('T')[0];

                if (dKey) {
                    dailyMap[dKey] = (dailyMap[dKey] || 0) + 1;
                }
            });

            const uniqueCompletedIds = Array.from(completedSet);
            const totalAvailable = Array.isArray(dataset) ? dataset.length : (typeof PROBLEMS !== 'undefined' ? PROBLEMS.length : 375);
            const totalCompleted = uniqueCompletedIds.length;
            const remaining = Math.max(0, totalAvailable - totalCompleted);
            const percentage = totalAvailable > 0 ? Math.round((totalCompleted / totalAvailable) * 100) : 0;

            return {
                totalAvailable,
                totalCompleted,
                remaining,
                percentage,
                uniqueCompletedIds,
                dailyCompletedByDate: dailyMap
            };
        } catch (e) {
            console.warn('StatsService.getUserCompletionStats error:', e.message);
            return null;
        }
    },

    /**
     * Fetch competitive public leaderboard rankings (stars, total completed, streak)
     * Excludes private user email — returns username, avatar, stars, completed, streak.
     */
    async getLeaderboard(limit = 25) {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('user_stats')
                .select(`
                    stars,
                    current_streak,
                    longest_streak,
                    total_completed,
                    profiles:user_id (
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .order('stars', { ascending: false })
                .order('total_completed', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return (data || []).map(r => ({
                username: r.profiles?.username || 'Coder',
                displayName: r.profiles?.display_name || r.profiles?.username || 'Coder',
                avatarUrl: r.profiles?.avatar_url || '',
                stars: r.stars || 0,
                currentStreak: r.current_streak || 0,
                longestStreak: r.longest_streak || 0,
                totalCompleted: r.total_completed || 0
            }));
        } catch (e) {
            console.warn('StatsService.getLeaderboard error:', e.message);
            return [];
        }
    }
};

window.StatsService = StatsService;
