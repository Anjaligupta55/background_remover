const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { FRONTEND_URL } = require('./config/env');
const removeBgRoutes = require('./routes/removeBg.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, 
  contentSecurityPolicy: false,
}));

// Custom CSP to silence Chrome DevTools errors
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:;");
  next();
});

// Root health check
app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'SnapCut AI API is alive' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002', 'http://127.0.0.1:5173'],
  credentials: true,
  exposedHeaders: ['X-Credits-Left']
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Folder for Uploads
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/auth.routes');
const historyRoutes = require('./routes/history.routes');
const paymentRoutes = require('./routes/payment.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', removeBgRoutes); // Keep existing removeBg routes under /api

// Error Handler
app.use(errorHandler);

module.exports = app;
