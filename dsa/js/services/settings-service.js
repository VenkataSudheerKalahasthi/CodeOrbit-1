/**
 * Platform Settings Service for CodeOrbit
 * 
 * Provides database-backed configuration for platform rules:
 * - Daily Problems Count (default: 3)
 * - Star Rules & Bonuses
 * - Streak Rules & Grace Periods
 * - Leaderboard Scoring Weights
 * 
 * Includes local memory cache and resilient fallback defaults.
 */

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        daily_problems_count: { count: 3 },
        star_rules: { daily_problem_stars: 1, daily_mission_bonus: 1 },
        streak_rules: { grace_period_hours: 24, min_solves_for_streak: 1 },
        leaderboard_weights: { stars: 10, streak: 15, completed: 5, longest_streak: 5, active_day: 20 },
        platform_status: { maintenance: false, allow_registrations: true }
    };

    const _cache = {};

    const SettingsService = {
        get client() {
            return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
        },

        /**
         * Get a specific setting value
         */
        async getSetting(key, defaultValue = null) {
            if (_cache[key] !== undefined) {
                return _cache[key];
            }

            const fallback = defaultValue !== null ? defaultValue : (DEFAULT_SETTINGS[key] || null);

            if (!this.client) {
                return fallback;
            }

            try {
                const { data, error } = await this.client
                    .from('platform_settings')
                    .select('value')
                    .eq('key', key)
                    .maybeSingle();

                if (error || !data) {
                    return fallback;
                }

                _cache[key] = data.value;
                return data.value;
            } catch (err) {
                console.warn(`SettingsService.getSetting notice for '${key}':`, err.message);
                return fallback;
            }
        },

        /**
         * Get all platform settings
         */
        async getAllSettings() {
            const result = { ...DEFAULT_SETTINGS };

            if (!this.client) {
                return result;
            }

            try {
                const { data, error } = await this.client
                    .from('platform_settings')
                    .select('key, value, description, updated_at');

                if (error || !data || data.length === 0) {
                    return result;
                }

                data.forEach(item => {
                    result[item.key] = item.value;
                    _cache[item.key] = item.value;
                });

                return result;
            } catch (err) {
                console.warn('SettingsService.getAllSettings notice:', err.message);
                return result;
            }
        },

        /**
         * Save / Update a platform setting (Admin only, verified by RLS)
         */
        async saveSetting(key, value, description = '') {
            if (!this.client) throw new Error('Supabase client not initialized.');

            const payload = {
                key,
                value: typeof value === 'object' ? value : { value },
                updated_at: new Date().toISOString()
            };

            if (description) {
                payload.description = description;
            }

            const { data, error } = await this.client
                .from('platform_settings')
                .upsert(payload, { onConflict: 'key' })
                .select()
                .single();

            if (error) throw error;

            _cache[key] = payload.value;
            return data;
        },

        /**
         * Clear cached settings
         */
        clearCache() {
            Object.keys(_cache).forEach(k => delete _cache[k]);
        }
    };

    window.SettingsService = SettingsService;
})();
