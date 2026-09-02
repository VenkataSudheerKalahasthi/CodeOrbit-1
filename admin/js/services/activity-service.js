/**
 * Activity Service for CodeOrbit
 * Manages daily user activity logs, daily problem counts, and calendar heatmap records.
 */

const ActivityService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getUserActivity(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('user_activity')
                .select('activity_date, problems_solved, stars_earned')
                .eq('user_id', userId)
                .order('activity_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ActivityService.getUserActivity error:', e.message);
            return [];
        }
    },

    async recordDailyActivity(userId, activityDate, problemsSolvedDelta = 1, starsEarnedDelta = 0) {
        if (!this.client || !userId) return null;
        try {
            const dateStr = activityDate || new Date().toISOString().split('T')[0];

            // Fetch existing record for today if present
            const { data: existing } = await this.client
                .from('user_activity')
                .select('*')
                .eq('user_id', userId)
                .eq('activity_date', dateStr)
                .maybeSingle();

            const newSolved = Math.max(0, (existing?.problems_solved || 0) + problemsSolvedDelta);
            const newStars = Math.max(0, (existing?.stars_earned || 0) + starsEarnedDelta);

            const { data, error } = await this.client
                .from('user_activity')
                .upsert({
                    user_id: userId,
                    activity_date: dateStr,
                    problems_solved: newSolved,
                    stars_earned: newStars
                }, { onConflict: 'user_id,activity_date' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('ActivityService.recordDailyActivity error:', e.message);
            return null;
        }
    },

    async batchSaveActivity(userId, activityMap) {
        if (!this.client || !userId || typeof activityMap !== 'object') return [];
        try {
            const rows = Object.entries(activityMap).map(([dateStr, count]) => ({
                user_id: userId,
                activity_date: dateStr,
                problems_solved: typeof count === 'number' ? count : (count ? 1 : 0),
                stars_earned: 0
            }));

            if (rows.length === 0) return [];

            const { data, error } = await this.client
                .from('user_activity')
                .upsert(rows, { onConflict: 'user_id,activity_date' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ActivityService.batchSaveActivity error:', e.message);
            return [];
        }
    }
};

window.ActivityService = ActivityService;
