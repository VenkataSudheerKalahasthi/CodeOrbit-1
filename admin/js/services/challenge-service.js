/**
 * Challenge Service for CodeOrbit
 * Synchronizes Problem of the Day (POTD LeetCode & GFG) and Daily DSA Missions in daily_challenges table.
 */

const ChallengeService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getDailyChallenges(userId, challengeDate) {
        if (!this.client || !userId) return [];
        try {
            let query = this.client
                .from('daily_challenges')
                .select('*')
                .eq('user_id', userId);

            if (challengeDate) {
                query = query.eq('challenge_date', challengeDate);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ChallengeService.getDailyChallenges error:', e.message);
            return [];
        }
    },

    async setChallengeCompletion(userId, challengeDate, problemId, challengeType, completed, starsEarned = 0) {
        if (!this.client || !userId || !challengeDate || !problemId || !challengeType) return null;
        try {
            const payload = {
                user_id: userId,
                challenge_date: challengeDate,
                problem_id: String(problemId),
                challenge_type: challengeType,
                completed: Boolean(completed),
                completed_at: completed ? new Date().toISOString() : null,
                stars_earned: starsEarned
            };

            const { data, error } = await this.client
                .from('daily_challenges')
                .upsert(payload, { onConflict: 'user_id,challenge_date,problem_id,challenge_type' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('ChallengeService.setChallengeCompletion error:', e.message);
            return null;
        }
    },

    async batchSavePOTDProgress(userId, potdMap) {
        if (!this.client || !userId || typeof potdMap !== 'object') return [];
        try {
            const rows = [];
            Object.entries(potdMap).forEach(([dateStr, platforms]) => {
                if (platforms && typeof platforms === 'object') {
                    if (platforms.leetcode) {
                        rows.push({
                            user_id: userId,
                            challenge_date: dateStr,
                            problem_id: 'potd_leetcode_' + dateStr,
                            challenge_type: 'potd_leetcode',
                            completed: true,
                            completed_at: new Date().toISOString(),
                            stars_earned: 0
                        });
                    }
                    if (platforms.geeksforgeeks) {
                        rows.push({
                            user_id: userId,
                            challenge_date: dateStr,
                            problem_id: 'potd_gfg_' + dateStr,
                            challenge_type: 'potd_gfg',
                            completed: true,
                            completed_at: new Date().toISOString(),
                            stars_earned: 0
                        });
                    }
                }
            });

            if (rows.length === 0) return [];

            const { data, error } = await this.client
                .from('daily_challenges')
                .upsert(rows, { onConflict: 'user_id,challenge_date,problem_id,challenge_type' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ChallengeService.batchSavePOTDProgress error:', e.message);
            return [];
        }
    }
};

window.ChallengeService = ChallengeService;
