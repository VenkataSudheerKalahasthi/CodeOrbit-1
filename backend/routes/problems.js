const express = require('express');
const router = express.Router();

// GET /api/problems - Public list of published problems
router.get('/', async (req, res) => {
    const supabase = req.app.get('supabase');
    if (!supabase) {
        return res.status(503).json({ error: 'Database service unavailable' });
    }

    try {
        const { data, error } = await supabase
            .from('problems')
            .select('*')
            .eq('status', 'published')
            .order('problem_order', { ascending: true });

        if (error) throw error;
        res.json({ problems: data || [] });
    } catch (e) {
        res.status(500).json({ error: e.message || 'Failed to fetch problems' });
    }
});

module.exports = router;
