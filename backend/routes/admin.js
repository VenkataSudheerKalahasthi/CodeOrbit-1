const express = require('express');
const router = express.Router();

/**
 * Middleware: Verify Admin Token from Authorization Header
 */
const requireAdmin = async (req, res, next) => {
    const supabase = req.app.get('supabase');
    if (!supabase) {
        return res.status(503).json({ error: 'Database service unavailable' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !user) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        // Check Admin role in user_roles table
        const { data: roleData, error: roleErr } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

        if (roleErr || roleData?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Platform Administrator privileges required' });
        }

        req.adminUser = user;
        next();
    } catch (e) {
        return res.status(500).json({ error: 'Authorization verification failed' });
    }
};

// GET /api/admin/verify - Verify Admin Token
router.get('/verify', requireAdmin, (req, res) => {
    res.json({
        authorized: true,
        user: {
            id: req.adminUser.id,
            email: req.adminUser.email
        }
    });
});

// GET /api/admin/metrics - Fetch platform metrics via backend
router.get('/metrics', requireAdmin, async (req, res) => {
    const supabase = req.app.get('supabase');
    try {
        const [profilesRes, solvesRes, statsRes] = await Promise.all([
            supabase.from('profiles').select('id, created_at, last_active_at, status'),
            supabase.from('problem_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
            supabase.from('user_stats').select('stars')
        ]);

        const profiles = profilesRes.data || [];
        const totalStars = (statsRes.data || []).reduce((sum, s) => sum + (s.stars || 0), 0);

        res.json({
            totalUsers: profiles.length,
            totalProblemsCompleted: solvesRes.count || 0,
            totalStars: totalStars,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        res.status(500).json({ error: e.message || 'Failed to fetch platform metrics' });
    }
});

// DELETE /api/admin/users/:userId - Permanently delete user and cascade associated data
router.delete('/users/:userId', requireAdmin, async (req, res) => {
    const supabase = req.app.get('supabase');
    const { userId } = req.params;

    // 1. Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!userId || !uuidRegex.test(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format: Valid UUID required.' });
    }

    // 2. Self-deletion protection: Admin cannot delete their own account
    if (userId.toLowerCase() === req.adminUser.id.toLowerCase()) {
        return res.status(400).json({ error: 'Self-deletion prohibited: Platform administrators cannot delete their own account.' });
    }

    try {
        let deletedUsername = 'user';
        let deletedEmail = '';

        // Fetch user info for confirmation & audit logging
        const { data: prof } = await supabase.from('profiles').select('username, email').eq('id', userId).maybeSingle();
        if (prof) {
            deletedUsername = prof.username || deletedUsername;
            deletedEmail = prof.email || '';
        }

        // 3. Attempt deletion via PostgreSQL RPC admin_delete_user
        let rpcSuccess = false;
        const { data: rpcData, error: rpcErr } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
        
        if (!rpcErr && rpcData?.success) {
            rpcSuccess = true;
        }

        // 4. If RPC was not used or service role is active, call Auth Admin API
        if (!rpcSuccess && supabase.auth && supabase.auth.admin && typeof supabase.auth.admin.deleteUser === 'function') {
            const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
            if (authErr && !authErr.message.includes('User not found')) {
                // If profiles deletion is needed as fallback
                const { error: profErr } = await supabase.from('profiles').delete().eq('id', userId);
                if (profErr) {
                    throw new Error(authErr.message || profErr.message);
                }
            }
            rpcSuccess = true;
        }

        // 5. If both were bypassed or direct table cleanup is required as fallback
        if (!rpcSuccess) {
            const { error: profErr } = await supabase.from('profiles').delete().eq('id', userId);
            if (profErr) {
                throw new Error(rpcErr?.message || profErr.message);
            }
        }

        // 6. Record in admin_audit_logs if not already logged by RPC
        try {
            await supabase.from('admin_audit_logs').insert({
                admin_id: req.adminUser.id,
                action: 'DELETE_USER',
                target_type: 'user',
                target_id: userId,
                details: {
                    username: deletedUsername,
                    email: deletedEmail,
                    deleted_by_admin: req.adminUser.email
                }
            });
        } catch (auditErr) {
            console.warn('Audit logging warning:', auditErr.message);
        }

        res.json({
            success: true,
            message: `User ${deletedUsername} (${userId}) has been permanently deleted.`,
            deletedUserId: userId
        });
    } catch (e) {
        console.error('Delete user error:', e);
        res.status(500).json({ error: e.message || 'Failed to permanently delete user.' });
    }
});

module.exports = router;

