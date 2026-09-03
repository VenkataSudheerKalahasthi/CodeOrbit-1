/**
 * Admin Service for CodeOrbit
 * Secure administration service querying platform metrics, comprehensive analytics,
 * user telemetry, account status controls, and top performers.
 * Protected server-side via Supabase RLS and the is_admin() security definer function.
 */

const AdminService = {
    get client() {
        return window.SupabaseConfig ? window.SupabaseConfig.getClient() : null;
    },

    /**
     * Check if currently logged in user has the admin role
     */
    async checkIsAdmin() {
        if (!this.client) return false;
        try {
            const { data: { user }, error: userErr } = await this.client.auth.getUser();
            if (userErr || !user) {
                console.warn('[CodeOrbit Admin] No authenticated user session found.');
                return false;
            }

            // 1. Try server-side RPC is_admin() function
            try {
                const { data: rpcIsAdmin, error: rpcErr } = await this.client.rpc('is_admin');
                if (!rpcErr && typeof rpcIsAdmin === 'boolean') {
                    if (rpcIsAdmin) return true;
                }
            } catch (_) {
                // Fallback to table lookup
            }

            // 2. Direct user_roles lookup (enforced by RLS)
            const { data, error } = await this.client
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.warn('[CodeOrbit Admin] user_roles query notice:', error.message);
                return false;
            }

            const isAdmin = (data?.role === 'admin');
            if (!isAdmin) {
                console.info(`[CodeOrbit Admin] User (${user.email || user.id}) has role: '${data?.role || 'none'}'. Admin privileges required.`);
            }
            return isAdmin;
        } catch (e) {
            console.error('[CodeOrbit Admin] checkIsAdmin error:', e);
            return false;
        }
    },

    /**
     * Fetch platform-wide analytics and KPIs
     */
    async getPlatformMetrics() {
        if (!this.client) throw new Error('Supabase client not initialized.');

        const todayStr = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // 1. Total profiles & new signups
        const { data: profiles, error: profErr } = await this.client
            .from('profiles')
            .select('id, created_at, last_active_at, status');
        if (profErr) throw profErr;

        const totalUsers = profiles.length;
        const newUsersToday = profiles.filter(p => p.created_at?.startsWith(todayStr)).length;
        const newUsersThisWeek = profiles.filter(p => p.created_at >= weekAgo).length;
        const activeUsers = profiles.filter(p => p.last_active_at >= weekAgo).length;

        // 2. Total problems completed across platform
        const { count: totalProblemsCompleted, error: compErr } = await this.client
            .from('problem_progress')
            .select('*', { count: 'exact', head: true })
            .eq('completed', true);
        if (compErr) throw compErr;

        // 3. Total stars across platform
        const { data: statsData, error: statsErr } = await this.client
            .from('user_stats')
            .select('stars');
        if (statsErr) throw statsErr;
        const totalStars = (statsData || []).reduce((sum, s) => sum + (s.stars || 0), 0);

        // 4. Total contest registrations
        const { count: totalContestRegs, error: contErr } = await this.client
            .from('contest_activity')
            .select('*', { count: 'exact', head: true })
            .eq('registered', true);
        if (contErr && contErr.code !== 'PGRST116') console.warn('Contest count notice:', contErr.message);

        // 5. Total problems in catalog
        let totalProblemsCatalog = typeof PROBLEMS !== 'undefined' ? PROBLEMS.length : 372;
        try {
            const { count: probCount } = await this.client
                .from('problems')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'published');
            if (probCount && probCount > 0) totalProblemsCatalog = probCount;
        } catch (_) {}

        return {
            totalUsers,
            newUsersToday,
            newUsersThisWeek,
            activeUsers,
            totalProblemsCatalog,
            totalProblemsCompleted: totalProblemsCompleted || 0,
            totalStars,
            totalContestRegs: totalContestRegs || 0
        };
    },

    /**
     * Fetch deep platform activity analytics and real topic completion counts
     */
    async getDeepPlatformAnalytics() {
        if (!this.client) throw new Error('Supabase client not initialized.');

        const metrics = await this.getPlatformMetrics();

        // 1. Fetch completed problems to calculate actual popular topics
        const { data: solves, error: solveErr } = await this.client
            .from('problem_progress')
            .select('problem_id')
            .eq('completed', true);

        const topicCounts = {};
        const platformCounts = { LeetCode: 0, GeeksforGeeks: 0, CodeChef: 0, CodeForces: 0, Other: 0 };
        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

        // Problem lookup helper
        const problemMap = new Map();
        if (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) {
            PROBLEMS.forEach(p => problemMap.set(String(p.id), p));
        }

        // Fetch DB problems to complement problemMap
        try {
            const { data: dbProbs } = await this.client.from('problems').select('id, title, topic, difficulty, platform');
            if (dbProbs) {
                dbProbs.forEach(p => problemMap.set(String(p.id), p));
            }
        } catch (_) {}

        (solves || []).forEach(s => {
            const p = problemMap.get(String(s.problem_id));
            if (p) {
                const t = p.topic || p.section || 'General';
                topicCounts[t] = (topicCounts[t] || 0) + 1;

                const diff = (p.difficulty || 'Medium');
                if (diff.toLowerCase() === 'easy') difficultyCounts.Easy++;
                else if (diff.toLowerCase() === 'hard') difficultyCounts.Hard++;
                else difficultyCounts.Medium++;

                const plat = p.platform || 'LeetCode';
                if (platformCounts[plat] !== undefined) platformCounts[plat]++;
                else platformCounts.Other++;
            }
        });

        // Convert topicCounts to sorted array
        const sortedTopics = Object.keys(topicCounts).map(topic => ({
            topic,
            completions: topicCounts[topic]
        })).sort((a, b) => b.completions - a.completions);

        // 2. Fetch User Stats for streak & competitive user metrics
        const { data: userStats } = await this.client
            .from('user_stats')
            .select('stars, current_streak, longest_streak, total_completed');

        const activeStreaks = (userStats || []).filter(s => s.current_streak > 0).length;
        const avgProblemsPerUser = metrics.totalUsers > 0 ? (metrics.totalProblemsCompleted / metrics.totalUsers).toFixed(1) : 0;
        const avgStarsPerUser = metrics.totalUsers > 0 ? (metrics.totalStars / metrics.totalUsers).toFixed(1) : 0;

        return {
            ...metrics,
            activeStreaks,
            avgProblemsPerUser,
            avgStarsPerUser,
            popularTopics: sortedTopics,
            difficultyDistribution: difficultyCounts,
            platformDistribution: platformCounts
        };
    },

    /**
     * Fetch Top Performers across multiple categories
     */
    async getTopPerformers() {
        if (!this.client) throw new Error('Supabase client not initialized.');

        const allTimeRes = window.LeaderboardService ? await window.LeaderboardService.getLeaderboard('all-time', 100) : { users: [] };
        const users = allTimeRes.users || [];

        const topScore = [...users].sort((a, b) => b.competitiveScore - a.competitiveScore).slice(0, 5);
        const topStars = [...users].sort((a, b) => b.stars - a.stars).slice(0, 5);
        const topStreaks = [...users].sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 5);
        const topCompleted = [...users].sort((a, b) => b.completedProblems - a.completedProblems).slice(0, 5);

        return {
            topScore,
            topStars,
            topStreaks,
            topCompleted
        };
    },

    /**
     * Fetch platform-wide competitive leaderboard analytics (Admin only)
     * Reuses authoritative LeaderboardService scoring rules to guarantee 100% data fidelity.
     */
    async getCompetitiveAnalytics() {
        if (!this.client) throw new Error('Supabase client not initialized.');

        const [allTimeRes, weeklyRes, monthlyRes] = await Promise.all([
            window.LeaderboardService ? window.LeaderboardService.getLeaderboard('all-time', 50) : { users: [], totalCount: 0 },
            window.LeaderboardService ? window.LeaderboardService.getLeaderboard('weekly', 10) : { users: [], totalCount: 0 },
            window.LeaderboardService ? window.LeaderboardService.getLeaderboard('monthly', 10) : { users: [], totalCount: 0 }
        ]);

        const allUsers = allTimeRes.users || [];
        const totalRankedUsers = allTimeRes.totalCount || allUsers.length;
        const totalStars = allUsers.reduce((sum, u) => sum + (u.stars || 0), 0);
        const totalScore = allUsers.reduce((sum, u) => sum + (u.competitiveScore || 0), 0);
        const averageScore = totalRankedUsers > 0 ? Math.round(totalScore / totalRankedUsers) : 0;
        const activeCompetitors = allUsers.filter(u => u.completedProblems > 0 || u.currentStreak > 0 || u.stars > 0).length;

        return {
            totalRankedUsers,
            activeCompetitors,
            averageScore,
            totalStars,
            topAllTime: allUsers.slice(0, 10),
            topWeekly: weeklyRes.users || [],
            topMonthly: monthlyRes.users || []
        };
    },

    /**
     * Fetch searchable list of users with summary stats & account status
     */
    async getUsersList(searchQuery = '', statusFilter = 'All', limit = 50) {
        if (!this.client) throw new Error('Supabase client not initialized.');

        let query = this.client
            .from('profiles')
            .select(`
                id,
                email,
                username,
                display_name,
                avatar_url,
                status,
                created_at,
                last_active_at,
                user_stats:user_stats (
                    stars,
                    current_streak,
                    longest_streak,
                    total_completed
                )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (statusFilter && statusFilter !== 'All') {
            query = query.eq('status', statusFilter.toLowerCase());
        }

        if (searchQuery && searchQuery.trim()) {
            const clean = searchQuery.trim().toLowerCase();
            query = query.or(`username.ilike.%${clean}%,email.ilike.%${clean}%,id.eq.${clean}`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(u => {
            const stats = Array.isArray(u.user_stats) ? u.user_stats[0] : u.user_stats;
            return {
                id: u.id,
                email: u.email || '—',
                username: u.username,
                displayName: u.display_name || u.username,
                avatarUrl: u.avatar_url || '',
                status: u.status || 'active',
                createdAt: u.created_at,
                lastActiveAt: u.last_active_at,
                stars: stats?.stars || 0,
                currentStreak: stats?.current_streak || 0,
                longestStreak: stats?.longest_streak || 0,
                totalCompleted: stats?.total_completed || 0
            };
        });
    },

    /**
     * Update Account Status (Active / Suspended) with safe confirmation
     * Preserves all user stars, streaks, notes, favorites, and completions.
     */
    async updateUserStatus(userId, newStatus) {
        if (!this.client || !userId) throw new Error('User ID is required.');
        const status = newStatus === 'suspended' ? 'suspended' : 'active';

        const { data, error } = await this.client
            .from('profiles')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get backend API base URL
     */
    getBackendUrl() {
        if (typeof window.__ENV__ !== 'undefined' && window.__ENV__.BACKEND_URL) {
            return window.__ENV__.BACKEND_URL;
        }
        if (typeof window.location !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            return 'http://localhost:5000';
        }
        return 'https://codeorbit-backend-vbjx.onrender.com';
    },

    /**
     * Permanently Delete a User (Admin Only)
     * Cascades deletion across auth.users, profiles, progress, streaks, stats, notes, activity, etc.
     */
    async deleteUser(userId) {
        if (!this.client || !userId) throw new Error('User ID is required.');

        // 1. Verify admin privilege before proceeding
        const isAdmin = await this.checkIsAdmin();
        if (!isAdmin) {
            throw new Error('Unauthorized: Administrator privileges required to delete users.');
        }

        // 2. Prevent self-deletion on frontend
        const { data: { user } } = await this.client.auth.getUser();
        if (user && user.id.toLowerCase() === userId.toLowerCase()) {
            throw new Error('Self-deletion prohibited: Platform administrators cannot delete their own account.');
        }

        let deletionSuccess = false;
        let lastErrorMessage = '';

        // 3. Attempt deletion via Render Backend API (uses Admin verification and service layer)
        try {
            const { data: { session } } = await this.client.auth.getSession();
            const token = session?.access_token;
            if (token) {
                const backendUrl = this.getBackendUrl();
                const resp = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (resp.ok) {
                    const result = await resp.json();
                    if (result.success) {
                        deletionSuccess = true;
                        return result;
                    }
                } else {
                    const errJson = await resp.json().catch(() => ({}));
                    lastErrorMessage = errJson.error || `Backend returned status ${resp.status}`;
                }
            }
        } catch (fetchErr) {
            console.warn('Backend deleteUser call failed, attempting database RPC fallback:', fetchErr.message);
        }

        // 4. Attempt deletion via direct Supabase PostgreSQL RPC (Security Definer)
        if (!deletionSuccess) {
            try {
                const { data, error } = await this.client.rpc('admin_delete_user', { target_user_id: userId });
                if (!error && (data?.success || data === true)) {
                    deletionSuccess = true;
                    return data;
                }
                if (error) {
                    lastErrorMessage = error.message || lastErrorMessage;
                }
            } catch (rpcErr) {
                console.warn('RPC admin_delete_user failed:', rpcErr.message);
                lastErrorMessage = rpcErr.message || lastErrorMessage;
            }
        }

        // 5. If both failed, throw error
        if (!deletionSuccess) {
            throw new Error(lastErrorMessage || 'Failed to delete user. Please ensure admin permissions.');
        }
    },

    /**
     * Fetch complete drill-down for a single user (Admin Only)
     */
    async getUserDetail(userId) {
        if (!this.client || !userId) throw new Error('User ID required.');

        const [
            profileRes,
            statsRes,
            progressRes,
            activityRes,
            challengesRes,
            contestsRes,
            roadmapRes,
            notesRes,
            favsRes,
            roleRes
        ] = await Promise.all([
            this.client.from('profiles').select('*').eq('id', userId).maybeSingle(),
            this.client.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
            this.client.from('problem_progress').select('*').eq('user_id', userId),
            this.client.from('user_activity').select('*').eq('user_id', userId).order('activity_date', { ascending: false }),
            this.client.from('daily_challenges').select('*').eq('user_id', userId).order('challenge_date', { ascending: false }),
            this.client.from('contest_activity').select('*').eq('user_id', userId),
            this.client.from('roadmap_progress').select('*').eq('user_id', userId),
            this.client.from('problem_notes').select('*').eq('user_id', userId),
            this.client.from('problem_favorites').select('*').eq('user_id', userId),
            this.client.from('user_roles').select('role').eq('user_id', userId).maybeSingle()
        ]);

        return {
            profile: profileRes.data || {},
            role: roleRes.data?.role || 'user',
            stats: statsRes.data || {},
            progress: progressRes.data || [],
            activity: activityRes.data || [],
            challenges: challengesRes.data || [],
            contests: contestsRes.data || [],
            roadmap: roadmapRes.data || [],
            notes: notesRes.data || [],
            favorites: favsRes.data || []
        };
    }
};

window.AdminService = AdminService;
