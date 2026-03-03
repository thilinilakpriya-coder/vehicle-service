const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const app = express();

// Database Connection
connectDB();

// ✅ Security & CORS Fix
app.use(helmet()); 
app.use(cors({
    origin: '*', // ඕනෑම තැනක සිට Frontend එකට connect වීමට ඉඩ ලබා දෙයි
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// NoSQL Injection Protection
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
    message: { message: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// AUTH MIDDLEWARE
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; 
    if (!token) token = req.headers['x-auth-token'];

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token!" });
        req.user = decoded;
        next();
    });
};

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes')); 
app.use('/api/bookings', require('./routes/bookingRoutes')); 
app.use('/api/messages', require('./routes/messageRoutes')); 
app.use('/api/reviews', require('./routes/reviews'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
