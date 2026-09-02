/**
 * Profile Service for CodeOrbit
 * Manages user profile information, display name, avatar, and last active timestamps.
 */

const ProfileService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getProfile(userId) {
        if (!this.client || !userId) return null;
        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (!error && data && data.username) {
                return data;
            }

            // Fallback: If profile row not in DB yet, read from auth user_metadata
            const { data: { user } } = await this.client.auth.getUser();
            if (user && user.id === userId && user.user_metadata?.username) {
                return {
                    id: userId,
                    email: user.email,
                    username: user.user_metadata.username,
                    display_name: user.user_metadata.display_name || user.user_metadata.username,
                    avatar_url: user.user_metadata.avatar_url || '',
                    created_at: user.created_at || new Date().toISOString()
                };
            }

            return data || null;
        } catch (e) {
            console.warn('ProfileService.getProfile error:', e.message);
            return null;
        }
    },

    async upsertProfile(profileData) {
        if (!this.client || !profileData.id) return null;
        try {
            const updatePayload = {
                ...profileData,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('profiles')
                .upsert(updatePayload, { onConflict: 'id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('ProfileService.upsertProfile error:', e.message);
            return null;
        }
    },

    async touchLastActive(userId) {
        if (!this.client || !userId) return;
        try {
            await this.client
                .from('profiles')
                .update({ last_active_at: new Date().toISOString() })
                .eq('id', userId);
        } catch (e) {
            // Silently ignore background touch errors
        }
    }
};

window.ProfileService = ProfileService;
