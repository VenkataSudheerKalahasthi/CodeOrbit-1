/**
 * Contest Service for CodeOrbit
 * Synchronizes user contest registrations, reminders, scores, and participation in contest_activity table.
 * Provides Admin CRUD management for database-driven multi-platform contests in public.contests.
 */

const ContestService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getUserContests(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('contest_activity')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ContestService.getUserContests error:', e.message);
            return [];
        }
    },

    async toggleRegistration(userId, contestId, isRegistered) {
        if (!this.client || !userId || !contestId) return false;
        try {
            const payload = {
                user_id: userId,
                contest_id: String(contestId),
                registered: Boolean(isRegistered),
                registered_at: isRegistered ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('contest_activity')
                .upsert(payload, { onConflict: 'user_id,contest_id' })
                .select()
                .single();

            if (error) throw error;
            return data.registered;
        } catch (e) {
            console.warn('ContestService.toggleRegistration error:', e.message);
            return isRegistered;
        }
    },

    async batchSaveReminders(userId, remindersMap) {
        if (!this.client || !userId || typeof remindersMap !== 'object') return [];
        try {
            const rows = Object.keys(remindersMap).map(contestId => ({
                user_id: userId,
                contest_id: String(contestId),
                registered: true,
                registered_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            if (rows.length === 0) return [];

            const { data, error } = await this.client
                .from('contest_activity')
                .upsert(rows, { onConflict: 'user_id,contest_id' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ContestService.batchSaveReminders error:', e.message);
            return [];
        }
    },

    /**
     * Fetch all published database contests for the main platform
     */
    async getPublishedContests() {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('contests')
                .select('*')
                .eq('status', 'published')
                .order('start_time', { ascending: true });

            if (error) {
                console.warn('ContestService.getPublishedContests notice:', error.message);
                return [];
            }

            return (data || []).map(c => ({
                id: c.id,
                title: c.title,
                platform: c.platform,
                contestUrl: c.contest_url,
                problemsUrl: c.contest_url,
                startTime: c.start_time,
                endTime: c.end_time,
                startMs: new Date(c.start_time).getTime(),
                endMs: new Date(c.end_time).getTime(),
                category: c.category || 'MEDIUM',
                description: c.description || ''
            }));
        } catch (e) {
            return [];
        }
    },

    /**
     * Fetch all contests for Admin Management (published, draft, archived)
     */
    async getAllContestsAdmin() {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('contests')
                .select('*')
                .order('start_time', { ascending: false });

            if (error) {
                console.warn('ContestService.getAllContestsAdmin error:', error.message);
                return [];
            }

            return data || [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Add a contest (Admin only)
     */
    async addContest(contestData) {
        if (!this.client) throw new Error('Supabase client not initialized.');

        if (!contestData.title || !contestData.title.trim()) {
            throw new Error('Contest title is required.');
        }
        if (!contestData.contest_url || !contestData.contest_url.trim()) {
            throw new Error('Contest URL is required.');
        }
        if (!contestData.start_time || !contestData.end_time) {
            throw new Error('Contest start and end times are required.');
        }

        const id = contestData.id || `${contestData.platform.toLowerCase()}_${Date.now()}`;

        const payload = {
            id,
            title: contestData.title.trim(),
            platform: contestData.platform || 'LeetCode',
            contest_url: contestData.contest_url.trim(),
            start_time: new Date(contestData.start_time).toISOString(),
            end_time: new Date(contestData.end_time).toISOString(),
            category: contestData.category || 'MEDIUM',
            description: (contestData.description || '').trim(),
            status: contestData.status || 'published',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await this.client
            .from('contests')
            .upsert(payload, { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update contest (Admin only)
     */
    async updateContest(contestId, updateData) {
        if (!this.client || !contestId) throw new Error('Contest ID is required.');

        const payload = {
            updated_at: new Date().toISOString()
        };

        if (updateData.title !== undefined) payload.title = String(updateData.title).trim();
        if (updateData.platform !== undefined) payload.platform = updateData.platform;
        if (updateData.contest_url !== undefined) payload.contest_url = String(updateData.contest_url).trim();
        if (updateData.start_time !== undefined) payload.start_time = new Date(updateData.start_time).toISOString();
        if (updateData.end_time !== undefined) payload.end_time = new Date(updateData.end_time).toISOString();
        if (updateData.category !== undefined) payload.category = updateData.category;
        if (updateData.description !== undefined) payload.description = String(updateData.description).trim();
        if (updateData.status !== undefined) payload.status = updateData.status;

        const { data, error } = await this.client
            .from('contests')
            .update(payload)
            .eq('id', String(contestId))
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Archive contest
     */
    async archiveContest(contestId) {
        return this.updateContest(contestId, { status: 'archived' });
    }
};

window.ContestService = ContestService;
