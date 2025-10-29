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
 
const path = require('path');

const settings = {
  port: process.env.PORT || 3000,
  domain: process.env.DOMAIN || 'localhost:3000',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
  uploadPath: process.env.UPLOAD_PATH || './cdn/uploads',
  
  fileCategories: {
    audio: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
    video: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'],
    images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    fonts: ['ttf', 'otf', 'woff', 'woff2', 'eot'],
    documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    npm: ['js', 'mjs', 'cjs', 'json'],
    codes: ['htm', 'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'],
    raw: ['txt', 'json', 'xml', 'csv', 'yml', 'yaml'],
    others: ['zip', 'rar', '7z', 'tar', 'gz']
  },

  mimeTypes: {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'html': 'text/html',
    'txt': 'text/plain'
  }
};

module.exports = settings;