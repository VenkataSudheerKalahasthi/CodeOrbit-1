/**
 * CodeOrbit Supabase Configuration & Client Initializer
 * Provides safe client initialization, offline fallback detection,
 * and environment variable resolution.
 */

(function () {
    'use strict';

    // Default configuration (can be populated via env injection, window.SUPABASE_CONFIG, or UI setup)
    const DEFAULT_URL = (typeof window.__ENV__ !== 'undefined' && window.__ENV__.SUPABASE_URL)
        || (typeof window.SUPABASE_CONFIG !== 'undefined' && window.SUPABASE_CONFIG.url)
        || 'https://usfurexaoyzyskipqjdt.supabase.co';

    const DEFAULT_ANON_KEY = (typeof window.__ENV__ !== 'undefined' && window.__ENV__.SUPABASE_ANON_KEY)
        || (typeof window.SUPABASE_CONFIG !== 'undefined' && window.SUPABASE_CONFIG.anonKey)
        || 'sb_publishable_Hg2geAI3UL21Sskyj3mSEA_RqzEbB6x';

    const SupabaseConfig = {
        url: DEFAULT_URL,
        anonKey: DEFAULT_ANON_KEY,

        isConfigured() {
            return (
                this.url &&
                this.anonKey &&
                !this.url.includes('your-supabase-project') &&
                !this.anonKey.includes('your-anon-or-publishable-key')
            );
        },

        initClient() {
            if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
                console.warn('Supabase JS SDK not loaded yet. Retrying on load.');
                return null;
            }

            try {
                const client = window.supabase.createClient(this.url, this.anonKey, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true,
                        storage: window.localStorage
                    }
                });
                window.supabaseClient = client;
                return client;
            } catch (err) {
                console.error('Error initializing Supabase client:', err);
                return null;
            }
        },

        getClient() {
            if (!window.supabaseClient) {
                return this.initClient();
            }
            return window.supabaseClient;
        }
    };

    window.SupabaseConfig = SupabaseConfig;

    // Auto-init if Supabase SDK is ready
    if (typeof window.supabase !== 'undefined') {
        SupabaseConfig.initClient();
    }
})();
