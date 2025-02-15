const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
    }
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            message: 'File upload error'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    res.status(500).json({
        message: 'Internal server error'
    });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid or expired token'
                });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Main middleware setup function
const setupMiddleware = (app) => {
    // Basic middleware
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Apply rate limiting to all routes
    app.use('/api/', apiLimiter);

    // Security headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // Error handling should be last
    app.use(errorHandler);

    return {
        upload,
        authenticateToken
    };
};

module.exports = {
    setupMiddleware,
    authenticateToken,
    upload
};