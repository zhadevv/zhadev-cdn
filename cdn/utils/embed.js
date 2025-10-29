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
const RouteUtils = require('../../src/utils/route');

class EmbedGenerator {
  static async generateEmbed(filePath, category) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = RouteUtils.getMimeType(ext.slice(1));
    
    try {
      const fileBuffer = await fs.readFile(filePath);
      const fileContent = fileBuffer.toString('utf8');
      
      let embedHtml = '';
      
      switch (category) {
        case 'images':
          embedHtml = this.generateImageEmbed(filePath);
          break;
        case 'video':
          embedHtml = this.generateVideoEmbed(filePath, mimeType);
          break;
        case 'audio':
          embedHtml = this.generateAudioEmbed(filePath, mimeType);
          break;
        case 'codes':
        case 'raw':
          embedHtml = this.generateCodeEmbed(fileContent, ext);
          break;
        default:
          embedHtml = this.generateDownloadEmbed(filePath);
      }
      
      return this.wrapInHtml(embedHtml, path.basename(filePath));
    } catch (error) {
      return this.generateErrorEmbed('Failed to read file');
    }
  }

  static generateImageEmbed(filePath) {
    return `
      <div class="image-embed">
        <img src="${filePath}" alt="Embedded Image" style="max-width: 100%; height: auto;">
      </div>
    `;
  }

  static generateVideoEmbed(filePath, mimeType) {
    return `
      <div class="video-embed">
        <video controls style="max-width: 100%;">
          <source src="${filePath}" type="${mimeType}">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
  }

  static generateAudioEmbed(filePath, mimeType) {
    return `
      <div class="audio-embed">
        <audio controls style="width: 100%;">
          <source src="${filePath}" type="${mimeType}">
          Your browser does not support the audio tag.
        </audio>
      </div>
    `;
  }

  static generateCodeEmbed(content, ext) {
    const lang = ext.slice(1);
    return `
      <div class="code-embed">
        <pre><code class="language-${lang}">${this.escapeHtml(content)}</code></pre>
      </div>
    `;
  }

  static generateDownloadEmbed(filePath) {
    return `
      <div class="download-embed">
        <p>This file type cannot be embedded directly.</p>
        <a href="${filePath}" download class="download-btn">Download File</a>
      </div>
    `;
  }

  static generateErrorEmbed(message) {
    return `
      <div class="error-embed">
        <p>Error: ${message}</p>
      </div>
    `;
  }

  static wrapInHtml(content, title) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - CDN Embed</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 20px; 
            background: #f5f5f5; 
          }
          .embed-container { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            max-width: 1000px; 
            margin: 0 auto; 
          }
          .download-btn { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin-top: 10px; 
          }
          pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto; 
            border: 1px solid #e9ecef; 
          }
          code { 
            font-family: 'Monaco', 'Menlo', monospace; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="embed-container">
          <h3>${title}</h3>
          ${content}
        </div>
      </body>
      </html>
    `;
  }

  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

module.exports = EmbedGenerator;