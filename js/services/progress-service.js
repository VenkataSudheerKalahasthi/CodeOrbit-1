/**
 * Progress Service for CodeOrbit
 * Handles problem completion, favorites, notes, and roadmap node progress.
 */

const ProgressService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    // --- Problem Progress ---

    async getProblemProgress(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('problem_progress')
                .select('problem_id, completed, completed_at')
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ProgressService.getProblemProgress error:', e.message);
            return [];
        }
    },

    async setProblemCompletion(userId, problemId, completed) {
        if (!this.client || !userId || problemId === undefined) return null;
        try {
            const payload = {
                user_id: userId,
                problem_id: String(problemId),
                completed: Boolean(completed),
                completed_at: completed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('problem_progress')
                .upsert(payload, { onConflict: 'user_id,problem_id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('ProgressService.setProblemCompletion error:', e.message);
            return null;
        }
    },

    async batchSaveProblemProgress(userId, progressList) {
        if (!this.client || !userId || !Array.isArray(progressList) || progressList.length === 0) return [];
        try {
            const rows = progressList.map(p => ({
                user_id: userId,
                problem_id: String(p.problem_id || p.id || p),
                completed: p.completed !== undefined ? Boolean(p.completed) : true,
                completed_at: p.completed_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { data, error } = await this.client
                .from('problem_progress')
                .upsert(rows, { onConflict: 'user_id,problem_id' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ProgressService.batchSaveProblemProgress error:', e.message);
            return [];
        }
    },

    // --- Favorites ---

    async getFavorites(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('problem_favorites')
                .select('problem_id')
                .eq('user_id', userId);

            if (error) throw error;
            return (data || []).map(r => r.problem_id);
        } catch (e) {
            console.warn('ProgressService.getFavorites error:', e.message);
            return [];
        }
    },

    async toggleFavorite(userId, problemId, isFavorite) {
        if (!this.client || !userId || !problemId) return false;
        try {
            if (isFavorite) {
                const { error } = await this.client
                    .from('problem_favorites')
                    .upsert({ user_id: userId, problem_id: String(problemId), created_at: new Date().toISOString() }, { onConflict: 'user_id,problem_id' });
                if (error) throw error;
                return true;
            } else {
                const { error } = await this.client
                    .from('problem_favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('problem_id', String(problemId));
                if (error) throw error;
                return false;
            }
        } catch (e) {
            console.warn('ProgressService.toggleFavorite error:', e.message);
            return isFavorite;
        }
    },

    async batchSaveFavorites(userId, favoriteIds) {
        if (!this.client || !userId || !Array.isArray(favoriteIds) || favoriteIds.length === 0) return [];
        try {
            const rows = favoriteIds.map(id => ({
                user_id: userId,
                problem_id: String(id),
                created_at: new Date().toISOString()
            }));

            const { data, error } = await this.client
                .from('problem_favorites')
                .upsert(rows, { onConflict: 'user_id,problem_id' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ProgressService.batchSaveFavorites error:', e.message);
            return [];
        }
    },

    // --- Notes ---

    async getNotes(userId) {
        if (!this.client || !userId) return {};
        try {
            const { data, error } = await this.client
                .from('problem_notes')
                .select('problem_id, note')
                .eq('user_id', userId);

            if (error) throw error;
            const notesMap = {};
            (data || []).forEach(r => {
                notesMap[r.problem_id] = r.note;
            });
            return notesMap;
        } catch (e) {
            console.warn('ProgressService.getNotes error:', e.message);
            return {};
        }
    },

    async saveNote(userId, problemId, noteText) {
        if (!this.client || !userId || !problemId) return null;
        try {
            if (noteText && noteText.trim()) {
                const { data, error } = await this.client
                    .from('problem_notes')
                    .upsert({
                        user_id: userId,
                        problem_id: String(problemId),
                        note: noteText.trim(),
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id,problem_id' })
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                const { error } = await this.client
                    .from('problem_notes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('problem_id', String(problemId));

                if (error) throw error;
                return null;
            }
        } catch (e) {
            console.warn('ProgressService.saveNote error:', e.message);
            return null;
        }
    },

    async batchSaveNotes(userId, notesMap) {
        if (!this.client || !userId || typeof notesMap !== 'object') return [];
        try {
            const rows = Object.entries(notesMap)
                .filter(([_, note]) => note && String(note).trim())
                .map(([problemId, note]) => ({
                    user_id: userId,
                    problem_id: String(problemId),
                    note: String(note).trim(),
                    updated_at: new Date().toISOString()
                }));

            if (rows.length === 0) return [];

            const { data, error } = await this.client
                .from('problem_notes')
                .upsert(rows, { onConflict: 'user_id,problem_id' });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ProgressService.batchSaveNotes error:', e.message);
            return [];
        }
    },

    // --- Roadmap Progress ---

    async getRoadmapProgress(userId) {
        if (!this.client || !userId) return [];
        try {
            const { data, error } = await this.client
                .from('roadmap_progress')
                .select('roadmap_node_id, completed')
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn('ProgressService.getRoadmapProgress error:', e.message);
            return [];
        }
    },

    async setRoadmapNodeCompletion(userId, nodeId, completed) {
        if (!this.client || !userId || !nodeId) return null;
        try {
            const { data, error } = await this.client
                .from('roadmap_progress')
                .upsert({
                    user_id: userId,
                    roadmap_node_id: String(nodeId),
                    completed: Boolean(completed),
                    completed_at: completed ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,roadmap_node_id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('ProgressService.setRoadmapNodeCompletion error:', e.message);
            return null;
        }
    }
};

window.ProgressService = ProgressService;
