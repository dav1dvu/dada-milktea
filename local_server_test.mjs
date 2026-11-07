import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join('.', urlPath === '/' ? 'index.html' : urlPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + urlPath);
  }
});

server.listen(PORT, async () => {
  console.log(`[SERVER RUNNING] http://localhost:${PORT}`);

  const testUrls = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/sw.js',
    '/css/style.css',
    '/css/img.css',
    '/js/main.js',
    '/js/cloud.js',
    '/js/state.js',
    '/js/ui/auth.js',
    '/js/ui/shell.js',
    '/js/ui/prep.js',
    '/js/ui/sell.js',
    '/js/ui/report.js',
    '/js/ui/tour.js',
    '/js/ui/journey.js',
    '/favicon.ico',
    '/img/dada_logo.svg',
    '/img/dada_mascot.svg',
    '/img/staff_buoi.svg',
    '/img/cust_anh3.webp',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-512.png',
    '/icons/apple-touch-icon.png',
    '/music/carefree.mp3',
    '/music/easy-lemon.mp3',
    '/music/life-of-riley.mp3',
    '/music/monkeys-spinning-monkeys.mp3',
    '/music/merry-go.mp3',
    '/js/ui/auth.js?v=bc2b62a8&version=1'
  ];

  let failed = 0;
  for (const u of testUrls) {
    const full = `http://localhost:${PORT}${u}`;
    const r = await fetch(full);
    if (r.status === 200) {
      console.log(`[PASS 200] ${u} (${r.headers.get('content-type')})`);
    } else {
      console.error(`[FAIL ${r.status}] ${u}`);
      failed++;
    }
  }

  console.log(`\nServer Integrity Test Complete: ${testUrls.length - failed}/${testUrls.length} passed.`);
  server.close(() => {
    console.log('[SERVER CLOSED]');
    process.exit(failed > 0 ? 1 : 0);
  });
});
