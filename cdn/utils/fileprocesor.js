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
 
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class FileProcessor {
  static async optimizeImage(inputPath, outputPath, options = {}) {
    const { quality = 80, width, height, format = 'webp' } = options;
    
    let image = sharp(inputPath);
    
    if (width || height) {
      image = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    switch (format) {
      case 'webp':
        image = image.webp({ quality });
        break;
      case 'jpeg':
        image = image.jpeg({ quality });
        break;
      case 'png':
        image = image.png({ compressionLevel: 9 });
        break;
      default:
        image = image.webp({ quality });
    }
    
    await image.toFile(outputPath);
    return outputPath;
  }

  static async compressFile(inputPath, outputPath) {
    const buffer = await fs.readFile(inputPath);
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  static async getFileInfo(filePath) {
    const stats = await fs.stat(filePath);
    const ext = path.extname(filePath).toLowerCase().slice(1);
    
    return {
      size: stats.size,
      extension: ext,
      created: stats.birthtime,
      modified: stats.mtime
    };
  }

  static async validateFile(filePath, maxSize) {
    const stats = await fs.stat(filePath);
    
    if (stats.size > maxSize) {
      throw new Error(`File size exceeds limit: ${stats.size} > ${maxSize}`);
    }
    
    return true;
  }
}

module.exports = FileProcessor;