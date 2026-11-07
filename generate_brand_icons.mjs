import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8089;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Helper to assemble multi-resolution ICO file from PNG buffers
function createIco(pngBuffers) {
  // Header: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Type (1 = ICO)
  // 4-5: Count of images
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);   // Width (0 = 256)
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1); // Height (0 = 256)
    entry.writeUInt8(0, 2);                                     // Color palette
    entry.writeUInt8(0, 3);                                     // Reserved
    entry.writeUInt16LE(1, 4);                                  // Color planes
    entry.writeUInt16LE(32, 6);                                 // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8);                 // Image size in bytes
    entry.writeUInt32LE(offset, 12);                            // Offset in file
    offset += item.buffer.length;
    dirEntries.push(entry);
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.buffer)]);
}

// Generate HTML with SVG for each icon mode
function getIconHtml(type) {
  const isMaskable = type === 'maskable';
  const isApple = type === 'apple';
  
  // Maskable has full bleed background and scales inner art to ~76% so it stays inside 410px safe zone
  const scale = isMaskable ? 0.76 : (isApple ? 0.88 : 0.90);
  const translateY = isMaskable ? 26 : (isApple ? 10 : 8);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
  .canvas {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    ${isMaskable ? 'background: radial-gradient(circle at 50% 40%, #FFFDF9 0%, #F7EBE1 70%, #EAD6C3 100%);' : 
      isApple ? 'background: radial-gradient(circle at 50% 35%, #FFFDF9 0%, #F8EFE6 65%, #ECD8C4 100%);' : 
      'background: transparent;'}
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
</head>
<body>
<div class="canvas">
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgSphere" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFFDF9"/>
      <stop offset="65%" stop-color="#F7EBE1"/>
      <stop offset="100%" stop-color="#E8D2BD"/>
    </radialGradient>
    <radialGradient id="sunburst" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="#FFB300" stop-opacity="0.32"/>
      <stop offset="65%" stop-color="#FF8A80" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#F7EBE1" stop-opacity="0"/>
    </radialGradient>

    <!-- Tea & Cream Gradients -->
    <linearGradient id="teaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D97724"/>
      <stop offset="35%" stop-color="#AD5617"/>
      <stop offset="100%" stop-color="#3E2A22"/>
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#FFF3E8"/>
      <stop offset="100%" stop-color="#F7EBE1"/>
    </linearGradient>
    <linearGradient id="pearlGold" x1="30%" y1="20%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="45%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#C67D00"/>
    </linearGradient>
    <linearGradient id="strawGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF8A80"/>
      <stop offset="50%" stop-color="#FFA49C"/>
      <stop offset="100%" stop-color="#E57373"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="45%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>

    <!-- Shadows -->
    <filter id="iconShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#3E2A22" flood-opacity="0.18"/>
    </filter>
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#3E2A22" flood-opacity="0.25"/>
    </filter>

    <!-- Clip Paths -->
    <clipPath id="cupClip">
      <path d="M165,120 L347,120 L327,290 Q325,306 307,306 L205,306 Q187,306 185,290 Z"/>
    </clipPath>
  </defs>

  ${!isMaskable && !isApple ? `
  <!-- Standalone App Icon Rounded Squircle Background -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgSphere)" stroke="#F7EBE1" stroke-width="4" filter="url(#iconShadow)"/>
  <rect x="24" y="24" width="464" height="464" rx="100" fill="none" stroke="#D97724" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.6"/>
  ` : ''}

  <!-- Sunburst Ambient Glow -->
  <circle cx="256" cy="${210 + translateY}" r="170" fill="url(#sunburst)"/>

  <!-- Centered Scaled Content -->
  <g transform="translate(${256 - 256 * scale}, ${translateY}) scale(${scale})">
    
    <!-- Cup Shadow -->
    <ellipse cx="256" cy="314" rx="80" ry="12" fill="#3E2A22" opacity="0.16"/>

    <!-- Straw -->
    <g class="straw" transform="rotate(14 280 60)">
      <rect x="272" y="16" width="20" height="115" rx="10" fill="url(#strawGrad)" stroke="#3E2A22" stroke-width="3"/>
      <path d="M272,34 L292,44 M272,58 L292,68 M272,82 L292,92 M272,106 L292,116" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.95"/>
    </g>

    <!-- Main Cup Art -->
    <g filter="url(#iconShadow)">
      <!-- Liquid & Pearls (Clipped) -->
      <g clip-path="url(#cupClip)">
        <rect x="150" y="110" width="220" height="210" fill="url(#teaGrad)"/>
        
        <!-- Cream Foam Wave -->
        <path d="M150,140 Q200,154 256,142 T360,145 L360,110 L150,110 Z" fill="url(#creamGrad)"/>
        <path d="M150,142 Q205,128 260,140 T360,134 L360,110 L150,110 Z" fill="#FFFFFF" opacity="0.65"/>

        <!-- Golden Tapioca Pearls -->
        <circle cx="208" cy="285" r="14" fill="url(#pearlGold)"/>
        <circle cx="236" cy="289" r="14.5" fill="url(#pearlGold)"/>
        <circle cx="264" cy="287" r="14.5" fill="url(#pearlGold)"/>
        <circle cx="292" cy="290" r="14.5" fill="url(#pearlGold)"/>
        <circle cx="195" cy="270" r="13.5" fill="url(#pearlGold)"/>
        <circle cx="222" cy="272" r="14" fill="url(#pearlGold)"/>
        <circle cx="250" cy="274" r="14.5" fill="url(#pearlGold)"/>
        <circle cx="278" cy="273" r="14" fill="url(#pearlGold)"/>
        <circle cx="304" cy="269" r="13.5" fill="url(#pearlGold)"/>
        <circle cx="210" cy="254" r="13" fill="url(#pearlGold)"/>
        <circle cx="240" cy="257" r="13.5" fill="url(#pearlGold)"/>
        <circle cx="270" cy="256" r="13.5" fill="url(#pearlGold)"/>
        <circle cx="296" cy="253" r="12.5" fill="url(#pearlGold)"/>

        <!-- Pearl Specular Highlights -->
        <g fill="#FFFFFF" opacity="0.9">
          <circle cx="204" cy="281" r="3.6"/>
          <circle cx="232" cy="285" r="3.8"/>
          <circle cx="260" cy="283" r="3.8"/>
          <circle cx="288" cy="286" r="3.8"/>
          <circle cx="191" cy="266" r="3.4"/>
          <circle cx="218" cy="268" r="3.6"/>
          <circle cx="246" cy="270" r="3.8"/>
          <circle cx="274" cy="269" r="3.6"/>
          <circle cx="236" cy="253" r="3.2"/>
          <circle cx="266" cy="252" r="3.2"/>
        </g>

        <!-- Glass Reflection -->
        <path d="M172,120 L182,284 Q186,296 193,296 L188,120 Z" fill="#FFFFFF" opacity="0.35"/>
      </g>

      <!-- Cup Outline -->
      <path d="M165,120 L347,120 L327,290 Q325,306 307,306 L205,306 Q187,306 185,290 Z"
            fill="none" stroke="#3E2A22" stroke-width="4.5" stroke-linejoin="round"/>

      <!-- Cup Dome Lid -->
      <path d="M153,122 Q256,70 359,122 Z" fill="#FFFFFF" opacity="0.96" stroke="#3E2A22" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="256" cy="122" rx="108" ry="11" fill="#F7EBE1" stroke="#3E2A22" stroke-width="4"/>
      <ellipse cx="256" cy="120" rx="92" ry="6" fill="#FFFFFF" opacity="0.8"/>

      <!-- Little Golden Crown on Lid -->
      <path d="M256,66 L261,77 L273,78 L264,85 L267,96 L256,89 L245,96 L248,85 L239,78 L251,77 Z"
            fill="url(#goldText)" stroke="#3E2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="256" cy="81" r="2.2" fill="#FFFFFF"/>

      <!-- Chibi Sparkling Eyes -->
      <g>
        <!-- Left Eye -->
        <ellipse cx="226" cy="190" rx="9" ry="12" fill="#3E2A22"/>
        <ellipse cx="223" cy="185" rx="4" ry="5" fill="#FFFFFF"/>
        <circle cx="228" cy="194" r="2" fill="#FFFFFF"/>
        <!-- Right Eye -->
        <ellipse cx="286" cy="190" rx="9" ry="12" fill="#3E2A22"/>
        <ellipse cx="283" cy="185" rx="4" ry="5" fill="#FFFFFF"/>
        <circle cx="288" cy="194" r="2" fill="#FFFFFF"/>

        <!-- Blush Cheeks -->
        <ellipse cx="206" cy="204" rx="11" ry="6.5" fill="#FF8A80" opacity="0.75"/>
        <ellipse cx="306" cy="204" rx="11" ry="6.5" fill="#FF8A80" opacity="0.75"/>

        <!-- Happy Smile -->
        <path d="M245,198 Q256,212 267,198 Q256,203 245,198 Z" fill="#E53935" stroke="#3E2A22" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M250,203 Q256,209 262,203 Z" fill="#FFCDD2"/>
      </g>

      <!-- Little Cute Waving Arms -->
      <path d="M168,200 Q146,195 148,183 Q154,175 166,186" fill="#F7EBE1" stroke="#3E2A22" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M344,198 Q366,188 365,176 Q356,170 346,185" fill="#F7EBE1" stroke="#3E2A22" stroke-width="3.2" stroke-linecap="round"/>
    </g>

    <!-- Brand Typography Section: DADA MILKTEA -->
    <g filter="url(#badgeShadow)">
      <!-- 3D Shadow -->
      <text x="256" y="380"
            font-family="'Baloo 2', 'Arial Rounded MT Bold', sans-serif"
            font-weight="900"
            font-size="60"
            text-anchor="middle"
            fill="#3E2A22"
            letter-spacing="0.06em">DADA</text>
      <!-- Foreground Gold Text -->
      <text x="256" y="376"
            font-family="'Baloo 2', 'Arial Rounded MT Bold', sans-serif"
            font-weight="900"
            font-size="60"
            text-anchor="middle"
            fill="url(#goldText)"
            stroke="#3E2A22"
            stroke-width="3"
            stroke-linejoin="round"
            letter-spacing="0.06em">DADA</text>
    </g>

    <!-- Subtitle Pill: MILKTEA -->
    <g>
      <rect x="146" y="394" width="220" height="32" rx="16" fill="#3E2A22"/>
      <text x="256" y="416"
            font-family="'Segoe UI', Roboto, sans-serif"
            font-weight="800"
            font-size="16"
            text-anchor="middle"
            fill="#F7EBE1"
            letter-spacing="0.3em">MILKTEA</text>
    </g>

    <!-- Little Matcha Leaves Accent -->
    <path d="M356,394 C367,384 374,390 372,398 C365,404 360,399 356,394 Z" fill="#81C784" stroke="#3E2A22" stroke-width="1.5"/>
  </g>
</svg>
</div>
</body>
</html>`;
}

// Minimal CDP class
class CDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async renderAndCapture(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false
    });
    await this.send('Emulation.setVisibleSize', { width, height });
    // Wait for repaint
    await new Promise(r => setTimeout(r, 200));
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width, height, scale: 1 }
    });
    return Buffer.from(data, 'base64');
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('--- Starting Brand Icon Generator for Dada Milktea ---');

  // 1. Launch HTTP Server to serve icon pages
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const type = url.searchParams.get('type') || 'standard';
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(getIconHtml(type));
  });

  await new Promise(r => server.listen(PORT, r));
  console.log(`[HTTP Server] Listening on http://localhost:${PORT}`);

  // 2. Launch headless browser
  const tmpDir = path.join(process.cwd(), '.tmp_browser_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const browserProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for CDP endpoint
  await new Promise(r => setTimeout(r, 1500));

  let pageTarget = null;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9224/json/list');
      const targets = await res.json();
      pageTarget = targets.find(t => t.type === 'page');
      if (pageTarget) break;
    } catch {}
    await new Promise(r => setTimeout(r, 400));
  }

  if (!pageTarget) {
    throw new Error('Failed to find page target on port 9224');
  }

  const cdp = new CDP(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  console.log('[CDP] Connected to Edge browser page target.');

  await cdp.send('Page.enable');

  const iconsDir = path.join(process.cwd(), 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  // A. Render icon-512.png (512x512)
  console.log('Rendering icons/icon-512.png (512x512)...');
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/?type=standard` });
  await new Promise(r => setTimeout(r, 400));
  const buf512 = await cdp.renderAndCapture(512, 512);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), buf512);
  console.log(`[SAVED] icons/icon-512.png (${buf512.length} bytes)`);

  // B. Render icon-192.png (192x192)
  console.log('Rendering icons/icon-192.png (192x192)...');
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/?type=standard` });
  await new Promise(r => setTimeout(r, 300));
  const buf192 = await cdp.renderAndCapture(192, 192);
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), buf192);
  console.log(`[SAVED] icons/icon-192.png (${buf192.length} bytes)`);

  // C. Render icon-maskable-512.png (512x512)
  console.log('Rendering icons/icon-maskable-512.png (512x512 adaptive)...');
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/?type=maskable` });
  await new Promise(r => setTimeout(r, 300));
  const bufMaskable = await cdp.renderAndCapture(512, 512);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), bufMaskable);
  console.log(`[SAVED] icons/icon-maskable-512.png (${bufMaskable.length} bytes)`);

  // D. Render apple-touch-icon.png (180x180)
  console.log('Rendering icons/apple-touch-icon.png (180x180 iOS)...');
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/?type=apple` });
  await new Promise(r => setTimeout(r, 300));
  const bufApple = await cdp.renderAndCapture(180, 180);
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), bufApple);
  console.log(`[SAVED] icons/apple-touch-icon.png (${bufApple.length} bytes)`);

  // E. Render sizes for favicon.ico (48x48, 32x32, 16x16)
  console.log('Rendering favicon frames (48, 32, 16)...');
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/?type=standard` });
  await new Promise(r => setTimeout(r, 300));
  const buf48 = await cdp.renderAndCapture(48, 48);
  const buf32 = await cdp.renderAndCapture(32, 32);
  const buf16 = await cdp.renderAndCapture(16, 16);

  const icoBuffer = createIco([
    { width: 48, height: 48, buffer: buf48 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 16, height: 16, buffer: buf16 }
  ]);
  fs.writeFileSync(path.join(process.cwd(), 'favicon.ico'), icoBuffer);
  console.log(`[SAVED] favicon.ico (${icoBuffer.length} bytes, 3 frames)`);

  // Cleanup
  cdp.close();
  browserProc.kill();
  server.close();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}

  console.log('--- ALL BRAND ICONS GENERATED SUCCESSFULLY ---');
}

main().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
