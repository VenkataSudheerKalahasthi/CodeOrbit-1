/**
 * CodeOrbit — Backend Web Service & API Gateway
 * Optimized for Render Deployment with Health Monitoring, CORS, and Supabase Integration.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Client Initialization
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://usfurexaoyzyskipqjdt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_Hg2geAI3UL21Sskyj3mSEA_RqzEbB6x';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
app.set('supabase', supabase);

// Security & Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(null, true); // Permissive CORS for public API endpoints
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', require('./routes/health'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/problems', require('./routes/problems'));

// Root route
app.get('/', (req, res) => {
    res.json({
        service: 'CodeOrbit Backend Service',
        status: 'online',
        documentation: '/health',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 CodeOrbit Backend listening on port ${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/health`);
});
