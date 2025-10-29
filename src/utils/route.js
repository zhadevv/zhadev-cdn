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
const fs = require('fs').promises;
const settings = require('../../settings');

class RouteUtils {
  static getCategoryFromExtension(ext) {
    const categories = settings.fileCategories;
    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(ext.toLowerCase())) {
        return category;
      }
    }
    return 'others';
  }

  static getMimeType(ext) {
    return settings.mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }

  static async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  static generateFileName(originalName, customName = null) {
    const ext = path.extname(originalName);
    const name = customName || path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${name}-${timestamp}-${random}${ext}`;
  }

  static sanitizePath(filePath) {
    return filePath.replace(/\.\./g, '').replace(/\/\/+/g, '/');
  }
}

module.exports = RouteUtils;