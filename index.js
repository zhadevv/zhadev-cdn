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
 
require('dotenv').config();
const CDNServer = require('./src/main');

const server = new CDNServer();
server.start();