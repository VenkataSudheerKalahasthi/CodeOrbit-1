/**
 * Authentication Service for CodeOrbit
 * Enterprise Supabase Auth integration:
 * - Dual Email / Username login resolution
 * - Guaranteed single-flight requests
 * - Instant non-blocking signup with background cloud state initialization
 * - Safe password recovery & session persistence
 */

const AuthService = {
    _isSigningIn: false,
    _isSigningUp: false,
    _isResetting: false,

    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    async getSession() {
        if (!this.client) return null;
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            if (error) throw error;
            return session;
        } catch (e) {
            console.warn('AuthService.getSession error:', e.message);
            return null;
        }
    },

    async getUser() {
        if (!this.client) return null;
        try {
            const { data: { user }, error } = await this.client.auth.getUser();
            if (error) throw error;
            return user;
        } catch (e) {
            return null;
        }
    },

    /**
     * Compute environment-aware redirect URL for password reset
     */
    getRedirectUrl(callbackPage = 'reset-password.html') {
        if (typeof window !== 'undefined' && window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
            const origin = window.location.origin;
            const path = window.location.pathname;
            const dir = path.substring(0, path.lastIndexOf('/') + 1);
            const cleanDir = dir ? (dir.endsWith('/') ? dir : dir + '/') : '/';
            return `${origin}${cleanDir}${callbackPage}`;
        }
        return `http://localhost:3000/${callbackPage}`;
    },

    /**
     * Check if a username is already taken in the profiles table
     */
    async isUsernameTaken(username) {
        if (!this.client) return false;
        try {
            const clean = username.trim().toLowerCase();
            const { data, error } = await this.client
                .from('profiles')
                .select('id')
                .ilike('username', clean)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.warn('Username check warning:', error.message);
            }
            return Boolean(data && data.id);
        } catch (e) {
            return false;
        }
    },

    /**
     * Sign up with Email, Password, and Username
     * Fast, reliable, and non-blocking.
     */
    async signUp(email, password, username, displayName) {
        if (!this.client) throw new Error('Supabase client not initialized.');
        if (this._isSigningUp) return null;

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanUsername) throw new Error('Username is required.');
        if (cleanUsername.length < 3) throw new Error('Username must be at least 3 characters.');
        if (!cleanEmail) throw new Error('Email is required.');

        this._isSigningUp = true;
        try {
            const { data, error } = await this.client.auth.signUp({
                email: cleanEmail,
                password: password,
                options: {
                    data: {
                        username: cleanUsername,
                        display_name: (displayName || cleanUsername).trim(),
                        avatar_url: ''
                    }
                }
            });

            if (error) throw error;

            if (data.user && data.session) {
                const cleanDisplayName = (displayName || cleanUsername).trim();
                if (window.StorageManager) {
                    window.StorageManager.saveCurrentUserLocally({
                        id: data.user.id,
                        username: cleanUsername,
                        displayName: cleanDisplayName,
                        completedProblems: [],
                        dailyMissionStars: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        favorites: [],
                        notes: {},
                        completionDates: {}
                    });
                    window.StorageManager.setCurrentUserId(data.user.id);
                }
                if (window.UIManager) {
                    window.UIManager.renderApp();
                }

                // Background profile ensure & data restore (non-blocking)
                ProfileService.upsertProfile({
                    id: data.user.id,
                    email: cleanEmail,
                    username: cleanUsername,
                    display_name: cleanDisplayName
                }).catch(err => console.warn('Background profile upsert notice:', err));

                if (window.MigrationService) {
                    window.MigrationService.migrateToCloud(data.user.id)
                        .then(() => window.MigrationService.restoreFromCloud(data.user.id))
                        .catch(err => console.warn('Background sync notice:', err));
                }
            }

            return data;
        } finally {
            this._isSigningUp = false;
        }
    },

    /**
     * Sign in with Email OR Username and Password
     * Resolves username to email securely via RPC or fallback lookup.
     */
    async signIn(identifier, password) {
        if (!this.client) throw new Error('Supabase client not initialized.');
        if (this._isSigningIn) return null;

        const cleanInput = (identifier || '').trim();
        if (!cleanInput) throw new Error('Please enter your email or username.');
        if (!password) throw new Error('Please enter your password.');

        this._isSigningIn = true;
        try {
            let resolvedEmail = cleanInput;

            // If input does NOT contain '@', resolve username to registered email
            if (!cleanInput.includes('@')) {
                let foundEmail = null;

                // 1. Try secure Postgres RPC function
                try {
                    const { data: rpcEmail, error: rpcErr } = await this.client.rpc('get_email_by_username', {
                        p_username: cleanInput.toLowerCase()
                    });
                    if (!rpcErr && rpcEmail) {
                        foundEmail = rpcEmail;
                    }
                } catch (rpcEx) {
                    console.warn('RPC lookup notice:', rpcEx.message);
                }

                // 2. Fallback to profiles table query if RPC was unavailable
                if (!foundEmail) {
                    try {
                        const { data: profile } = await this.client
                            .from('profiles')
                            .select('email')
                            .ilike('username', cleanInput.toLowerCase())
                            .maybeSingle();

                        if (profile?.email) {
                            foundEmail = profile.email;
                        }
                    } catch (profEx) {
                        console.warn('Profile fallback lookup notice:', profEx.message);
                    }
                }

                if (foundEmail) {
                    resolvedEmail = foundEmail;
                } else {
                    throw new Error(`No account found with username "${cleanInput}". Please check the spelling or sign in with your email address.`);
                }
            } else {
                resolvedEmail = cleanInput.toLowerCase();
            }

            const { data, error } = await this.client.auth.signInWithPassword({
                email: resolvedEmail,
                password: password
            });

            if (error) {
                if (error.message && error.message.toLowerCase().includes('invalid login credentials')) {
                    throw new Error('Incorrect password. Please try again or click "Forgot Password?".');
                }
                throw error;
            }

            if (data.user) {
                const metaUsername = data.user.user_metadata?.username;
                if (metaUsername && window.StorageManager) {
                    const existing = window.StorageManager.getUserById(data.user.id);
                    window.StorageManager.saveCurrentUserLocally({
                        ...(existing || {}),
                        id: data.user.id,
                        username: metaUsername,
                        displayName: data.user.user_metadata?.display_name || metaUsername
                    });
                    window.StorageManager.setCurrentUserId(data.user.id);
                    if (window.UIManager) {
                        window.UIManager.renderApp();
                    }
                }

                // Background cloud sync
                ProfileService.touchLastActive(data.user.id).catch(() => {});

                if (window.MigrationService) {
                    window.MigrationService.migrateToCloud(data.user.id)
                        .then(() => window.MigrationService.restoreFromCloud(data.user.id))
                        .catch(() => {});
                }
            }

            return data;
        } finally {
            this._isSigningIn = false;
        }
    },

    /**
     * Sign out
     */
    async signOut() {
        if (this.client) {
            try {
                await this.client.auth.signOut();
            } catch (e) {
                console.warn('Sign out warning:', e);
            }
        }
        if (window.StorageManager) {
            window.StorageManager.setCurrentUserId(null);
        }
    },

    /**
     * Send Password Reset Email
     */
    async resetPassword(email) {
        if (!this.client) throw new Error('Supabase client not initialized.');
        if (this._isResetting) return null;

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) throw new Error('Please enter your email address.');

        this._isResetting = true;
        try {
            const redirectUrl = this.getRedirectUrl('reset-password.html');
            const { data, error } = await this.client.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: redirectUrl
            });

            if (error) throw error;
            return data;
        } finally {
            this._isResetting = false;
        }
    },

    /**
     * Listen for auth state changes with deduplication
     */
    onAuthStateChange(callback) {
        if (!this.client) return { unsubscribe: () => {} };

        const { data: { subscription } } = this.client.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                if (window.StorageManager) {
                    window.StorageManager.setCurrentUserId(null);
                }
            }
            if (typeof callback === 'function') {
                callback(event, session);
            }
        });

        return subscription;
    }
};

window.AuthService = AuthService;
