/**
 * Realtime Service for CodeOrbit
 * Provides managed, debounced Realtime subscriptions for competitive leaderboards and cross-device sync.
 * Strictly READ-ONLY handlers to prevent database write loops and rate limit saturation.
 */

const RealtimeService = {
    _channels: new Map(),
    _debounceTimers: new Map(),

    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    /**
     * Managed subscription for competitive leaderboard changes.
     * Listens to user_stats table changes with a 500ms debounce.
     */
    subscribeToLeaderboard(onUpdate) {
        if (!this.client) return null;

        const channelName = 'public:user_stats_leaderboard';
        if (this._channels.has(channelName)) {
            return this._channels.get(channelName);
        }

        const channel = this.client
            .channel(channelName)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'user_stats' },
                payload => {
                    // Debounce rapid events by 500ms
                    if (this._debounceTimers.has(channelName)) {
                        clearTimeout(this._debounceTimers.get(channelName));
                    }

                    const timer = setTimeout(() => {
                        this._debounceTimers.delete(channelName);
                        if (typeof onUpdate === 'function') {
                            onUpdate(payload);
                        }
                    }, 500);

                    this._debounceTimers.set(channelName, timer);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // Connected successfully
                }
            });

        this._channels.set(channelName, channel);
        return channel;
    },

    /**
     * Managed subscription for cross-device user problem progress sync.
     */
    subscribeToUserSync(userId, onUpdate) {
        if (!this.client || !userId) return null;

        const channelName = `user_sync_${userId}`;
        if (this._channels.has(channelName)) {
            return this._channels.get(channelName);
        }

        const channel = this.client
            .channel(channelName)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'problem_progress', filter: `user_id=eq.${userId}` },
                payload => {
                    if (this._debounceTimers.has(channelName)) {
                        clearTimeout(this._debounceTimers.get(channelName));
                    }

                    const timer = setTimeout(() => {
                        this._debounceTimers.delete(channelName);
                        if (typeof onUpdate === 'function') {
                            onUpdate(payload);
                        }
                    }, 300);

                    this._debounceTimers.set(channelName, timer);
                }
            )
            .subscribe();

        this._channels.set(channelName, channel);
        return channel;
    },

    unsubscribe(channelName) {
        if (this._debounceTimers.has(channelName)) {
            clearTimeout(this._debounceTimers.get(channelName));
            this._debounceTimers.delete(channelName);
        }

        if (!this.client || !this._channels.has(channelName)) return;
        const ch = this._channels.get(channelName);
        this.client.removeChannel(ch);
        this._channels.delete(channelName);
    },

    unsubscribeAll() {
        this._debounceTimers.forEach(timer => clearTimeout(timer));
        this._debounceTimers.clear();

        if (!this.client) return;
        this._channels.forEach(ch => {
            this.client.removeChannel(ch);
        });
        this._channels.clear();
    }
};

window.RealtimeService = RealtimeService;
