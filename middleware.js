/**
 * 
 *                  cdn.zhadev.my.id
 *        sebuah web file host open source
 *        yang dibangun bersasarkan inspirasi kpd
 *        jsdelevr.
 * 
 *        project by: zhadevv
 *        dibangun diatas lisensi MIT
 */
 
const cors = require('cors');
const path = require('path');
const settings = require('./settings');

const middleware = {
  cors: cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),

  securityHeaders: (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  },

  errorHandler: (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  },

  notFound: (req, res) => {
    res.status(404).json({ 
      error: 'Not Found',
      message: 'The requested resource was not found' 
    });
  }
};

module.exports = middleware;