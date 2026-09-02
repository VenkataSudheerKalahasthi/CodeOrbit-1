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

module.exports = router;
