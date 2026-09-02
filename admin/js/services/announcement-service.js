/**
 * Announcement Service for CodeOrbit
 * 
 * Provides database-backed CRUD, lifecycle management, and active banner delivery
 * for platform announcements stored in Supabase.
 */

(function () {
    'use strict';

    const AnnouncementService = {
        get client() {
            return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
        },

        /**
         * Fetch active published announcements for main website (index.html)
         */
        async getActiveAnnouncements() {
            if (!this.client) return [];

            try {
                const nowIso = new Date().toISOString();

                const { data, error } = await this.client
                    .from('announcements')
                    .select('*')
                    .eq('status', 'published')
                    .order('priority', { ascending: false })
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('AnnouncementService.getActiveAnnouncements error:', error.message);
                    return [];
                }

                // Filter for valid time window
                const nowMs = Date.now();
                return (data || []).filter(a => {
                    if (a.start_time && new Date(a.start_time).getTime() > nowMs) return false;
                    if (a.end_time && new Date(a.end_time).getTime() < nowMs) return false;
                    return true;
                });
            } catch (e) {
                console.warn('AnnouncementService.getActiveAnnouncements exception:', e.message);
                return [];
            }
        },

        /**
         * Fetch all announcements for Admin Management (published, draft, archived)
         */
        async getAllAnnouncements() {
            if (!this.client) return [];

            try {
                const { data, error } = await this.client
                    .from('announcements')
                    .select('*')
                    .order('priority', { ascending: false })
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('AnnouncementService.getAllAnnouncements error:', error.message);
                    return [];
                }

                return data || [];
            } catch (e) {
                console.warn('AnnouncementService.getAllAnnouncements exception:', e.message);
                return [];
            }
        },

        /**
         * Add a new announcement (Admin only)
         */
        async addAnnouncement(announcementData) {
            if (!this.client) throw new Error('Supabase client not initialized.');

            if (!announcementData.title || !announcementData.title.trim()) {
                throw new Error('Announcement title is required.');
            }
            if (!announcementData.message || !announcementData.message.trim()) {
                throw new Error('Announcement message is required.');
            }

            const payload = {
                title: announcementData.title.trim(),
                message: announcementData.message.trim(),
                link_url: (announcementData.link_url || '').trim() || null,
                link_text: (announcementData.link_text || 'View Challenge').trim(),
                category: announcementData.category || 'General',
                status: announcementData.status || 'published',
                start_time: announcementData.start_time || new Date().toISOString(),
                end_time: announcementData.end_time || null,
                priority: parseInt(announcementData.priority, 10) || 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from('announcements')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * Update an existing announcement (Admin only)
         */
        async updateAnnouncement(id, updateData) {
            if (!this.client || !id) throw new Error('Announcement ID is required.');

            const payload = {
                updated_at: new Date().toISOString()
            };

            if (updateData.title !== undefined) payload.title = String(updateData.title).trim();
            if (updateData.message !== undefined) payload.message = String(updateData.message).trim();
            if (updateData.link_url !== undefined) payload.link_url = String(updateData.link_url).trim() || null;
            if (updateData.link_text !== undefined) payload.link_text = String(updateData.link_text).trim();
            if (updateData.category !== undefined) payload.category = updateData.category;
            if (updateData.status !== undefined) payload.status = updateData.status;
            if (updateData.start_time !== undefined) payload.start_time = updateData.start_time || null;
            if (updateData.end_time !== undefined) payload.end_time = updateData.end_time || null;
            if (updateData.priority !== undefined) payload.priority = parseInt(updateData.priority, 10) || 0;

            const { data, error } = await this.client
                .from('announcements')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * Archive an announcement (soft delete)
         */
        async archiveAnnouncement(id) {
            return this.updateAnnouncement(id, { status: 'archived' });
        },

        /**
         * Delete an announcement permanently (Admin only)
         */
        async deleteAnnouncement(id) {
            if (!this.client || !id) throw new Error('Announcement ID is required.');

            const { data, error } = await this.client
                .from('announcements')
                .delete()
                .eq('id', id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        }
    };

    window.AnnouncementService = AnnouncementService;
})();
