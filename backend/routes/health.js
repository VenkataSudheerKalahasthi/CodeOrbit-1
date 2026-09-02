const express = require('express');
const router = express.Router();

// GET /health - Render Health Check & Uptime Telemetry
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'CodeOrbit Backend API',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
