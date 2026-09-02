/**
 * Roadmap Service for CodeOrbit
 * Synchronizes roadmap node completions in roadmap_progress table.
 */

const RoadmapService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getUserRoadmap(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('roadmap_progress')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('RoadmapService.getUserRoadmap error:', e.message);
            return [];
        }
    },

    async setNodeCompletion(userId, nodeId, completed) {
        if (!this.client || !userId || !nodeId) return null;
        try {
            const payload = {
                user_id: userId,
                roadmap_node_id: String(nodeId),
                completed: Boolean(completed),
                completed_at: completed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('roadmap_progress')
                .upsert(payload, { onConflict: 'user_id,roadmap_node_id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('RoadmapService.setNodeCompletion error:', e.message);
            return null;
        }
    }
};

window.RoadmapService = RoadmapService;
