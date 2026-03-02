const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Config Imports
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Security Middleware
app.use(helmet()); 

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// NoSQL Injection Protection Middleware
app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (let key in obj) {
                if (/^\$/.test(key)) {
                    delete obj[key];
                } else {
                    sanitize(obj[key]);
                }
            }
        }
        return obj;
    };
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    try { if (req.query) sanitize(req.query); } catch (e) {}
    next();
});

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: { message: "Too many requests, please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

/**
 * AUTH MIDDLEWARE
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; 
    if (!token) token = req.headers['x-auth-token'];

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided!" });

    // JWT Secret එක .env එකෙන් විතරක්ම ගන්නවා (Default අගයන් තැබීම අනතුරුදායකයි)
    const JWT_SECRET = process.env.JWT_SECRET;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token!" });
        req.user = decoded;
        next();
    });
};

// Public Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes')); 
app.use('/api/bookings', require('./routes/bookingRoutes')); 

// Protected Routes (verifyToken middleware එක අවශ්‍ය නම් මෙතනට දාන්න පුළුවන්)
app.use('/api/messages', require('./routes/messageRoutes')); 
app.use('/api/reviews', require('./routes/reviews'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Server active on port ${PORT}`);
});