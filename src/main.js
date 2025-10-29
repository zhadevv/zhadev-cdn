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
 
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const RouteUtils = require('./utils/route');
const settings = require('../settings');
const middleware = require('../middleware');

class CDNServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupStatic();
  }

  setupMiddleware() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(middleware.cors);
    this.app.use(middleware.securityHeaders);
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'web'));
  }

  setupStatic() {
    this.app.use('/cdn', express.static(path.join(__dirname, '../cdn')));
  }

  setupRoutes() {
    this.app.get('/', this.serveHomePage.bind(this));
    this.app.post('/api/upload', this.handleUpload.bind(this));
    this.app.get('/files/*', this.serveFile.bind(this));
    this.app.get('/api/files', this.listFiles.bind(this));
    this.app.delete('/api/files/:filename', this.deleteFile.bind(this));
    
    this.app.use(middleware.notFound);
    this.app.use(middleware.errorHandler);
  }

  async serveHomePage(req, res) {
    try {
      const viewsPath = path.join(__dirname, 'web', 'views.ejs');
      
      res.render('views.ejs', { 
        domain: settings.domain,
        maxFileSize: settings.maxFileSize 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load page' });
    }
  }

  async handleUpload(req, res) {
    try {
      const { file: fileData, customName, optimize } = req.body;
      
      if (!fileData || !fileData.data) {
        return res.status(400).json({ error: 'No file data provided' });
      }

      const buffer = Buffer.from(fileData.data, 'base64');
      const originalName = fileData.name || 'file';
      const fileName = RouteUtils.generateFileName(originalName, customName);
      const ext = path.extname(originalName).toLowerCase().slice(1);
      const category = RouteUtils.getCategoryFromExtension(ext);
      
      const categoryPath = path.join(settings.uploadPath, category);
      await RouteUtils.ensureDirectory(categoryPath);
      
      const filePath = path.join(categoryPath, fileName);
      await fs.writeFile(filePath, buffer);

      const fileUrl = `https://${settings.domain}/files/${category}/${fileName}`;
      
      res.json({
        success: true,
        url: fileUrl,
        filename: fileName,
        category: category,
        size: buffer.length,
        mimetype: RouteUtils.getMimeType(ext)
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed', message: error.message });
    }
  }

  async serveFile(req, res) {
    try {
      const filePath = req.params[0];
      const sanitizedPath = RouteUtils.sanitizePath(filePath);
      const fullPath = path.join(settings.uploadPath, sanitizedPath);
      
      try {
        await fs.access(fullPath);
      } catch {
        return res.status(404).json({ error: 'File not found' });
      }

      const ext = path.extname(fullPath).toLowerCase().slice(1);
      const mimeType = RouteUtils.getMimeType(ext);
      
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.sendFile(path.resolve(fullPath));
    } catch (error) {
      res.status(500).json({ error: 'Failed to serve file' });
    }
  }

  async listFiles(req, res) {
    try {
      const files = [];
      
      for (const category of Object.keys(settings.fileCategories)) {
        const categoryPath = path.join(settings.uploadPath, category);
        try {
          const categoryFiles = await fs.readdir(categoryPath);
          files.push(...categoryFiles.map(file => ({
            name: file,
            category: category,
            url: `https://${settings.domain}/files/${category}/${file}`,
            path: path.join(category, file)
          })));
        } catch (error) {
          continue;
        }
      }
      
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list files' });
    }
  }

  async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      
      for (const category of Object.keys(settings.fileCategories)) {
        const filePath = path.join(settings.uploadPath, category, filename);
        try {
          await fs.unlink(filePath);
          return res.json({ success: true, message: 'File deleted' });
        } catch (error) {
          continue;
        }
      }
      
      res.status(404).json({ error: 'File not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }

  start() {
    const port = settings.port;
    this.app.listen(port, () => {
      console.log(`CDN Server running on port ${port}`);
      console.log(`Access via: https://${settings.domain}`);
    });
  }
}

module.exports = CDNServer;
