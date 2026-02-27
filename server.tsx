import express from 'express';
import { createServer as createViteServer } from 'vite';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import React from 'react';
import { getDaysInYear, getDayOfYear, getWeeksBetween, isValidDate } from './src/lib/dates';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Font loading
let fontData: ArrayBuffer | null = null;
async function getFont() {
  if (fontData) return fontData;
  try {
    console.log('Fetching font...');
    // Use JSDelivr for a reliable WOFF source (Satori supports WOFF)
    const res = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff');
    if (!res.ok) throw new Error(`Font fetch failed: ${res.statusText}`);
    fontData = await res.arrayBuffer();
    console.log('Font loaded successfully');
    return fontData;
  } catch (e) {
    console.error("Failed to load font", e);
    return null;
  }
}

app.get('/api/wallpaper', async (req, res) => {
  console.log('Received wallpaper request:', req.query);
  try {
    const {
      mode = 'year',
      width = '1290',
      height = '2796',
      fg = 'FFFFFF',
      bg = '000000',
      year = new Date().getFullYear().toString(),
      birthday,
      lifeExpectancyYears = '80',
      showStats = '0',
      format = 'png' // Add format param for debugging
    } = req.query;

    const w = parseInt(width as string) || 1290;
    const h = parseInt(height as string) || 2796;
    const fgColor = `#${(fg as string).replace('#', '')}`;
    const bgColor = `#${(bg as string).replace('#', '')}`;
    const isLife = mode === 'life';

    const font = await getFont();
    if (!font) {
      console.error('Font missing, returning 500');
      return res.status(500).send('Font load failed');
    }

    let element: React.ReactNode;

    if (isLife) {
      const bday = new Date(birthday as string);
      if (!isValidDate(bday)) return res.status(400).send('Invalid birthday');
      
      const lifeExp = parseInt(lifeExpectancyYears as string) || 80;
      const totalWeeks = lifeExp * 52;
      const livedWeeks = Math.max(0, getWeeksBetween(bday, new Date()));
      const clampedLived = Math.min(livedWeeks, totalWeeks);
      
      const cols = 52;
      const rows = lifeExp;
      const padding = Math.min(w, h) * 0.05;
      const availableW = w - (padding * 2);
      const availableH = h - (padding * 2);
      
      const gapRatio = 0.5;
      const dotSizeW = availableW / (cols + (cols - 1) * gapRatio);
      const dotSizeH = availableH / (rows + (rows - 1) * gapRatio);
      const dotSize = Math.min(dotSizeW, dotSizeH);
      const gap = dotSize * gapRatio;
      const totalW = cols * dotSize + (cols - 1) * gap;
      const totalH = rows * dotSize + (rows - 1) * gap;

      const dots = [];
      for (let i = 0; i < totalWeeks; i++) {
        const isLived = i < clampedLived;
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        dots.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col * (dotSize + gap),
              top: row * (dotSize + gap),
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: isLived ? fgColor : 'transparent',
              border: isLived ? 'none' : `1px solid ${fgColor}`,
              opacity: isLived ? 1 : 0.2,
              boxSizing: 'border-box'
            }}
          />
        );
      }

      element = (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: totalW, height: totalH }}>{dots}</div>
          {showStats === '1' && (
            <div style={{ marginTop: padding, color: fgColor, fontSize: dotSize * 2, fontFamily: 'Inter', opacity: 0.5 }}>
              {Math.floor((clampedLived / totalWeeks) * 100)}% lived
            </div>
          )}
        </div>
      );

    } else {
      // Year Mode
      const y = parseInt(year as string) || new Date().getFullYear();
      const totalDays = getDaysInYear(y);
      const currentDay = getDayOfYear(new Date());
      
      const cols = 7; // Weeks layout
      const rows = Math.ceil(totalDays / cols);
      const padding = Math.min(w, h) * 0.1;
      const availableW = w - (padding * 2);
      const availableH = h - (padding * 2);
      
      const gapRatio = 0.5;
      const dotSizeW = availableW / (cols + (cols - 1) * gapRatio);
      const dotSizeH = availableH / (rows + (rows - 1) * gapRatio);
      const dotSize = Math.min(dotSizeW, dotSizeH);
      const gap = dotSize * gapRatio;
      const totalW = cols * dotSize + (cols - 1) * gap;
      const totalH = rows * dotSize + (rows - 1) * gap;

      const dots = [];
      for (let i = 0; i < totalDays; i++) {
        let filled = false;
        const nowY = new Date().getFullYear();
        if (y < nowY) filled = true;
        else if (y > nowY) filled = false;
        else filled = (i + 1) <= currentDay;

        const col = i % cols;
        const row = Math.floor(i / cols);

        dots.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col * (dotSize + gap),
              top: row * (dotSize + gap),
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: filled ? fgColor : 'transparent',
              border: filled ? 'none' : `1px solid ${fgColor}`,
              opacity: filled ? 1 : 0.2,
              boxSizing: 'border-box'
            }}
          />
        );
      }
      
      element = (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
           <div style={{ position: 'relative', width: totalW, height: totalH }}>{dots}</div>
           <div style={{ marginTop: padding / 2, color: fgColor, fontSize: dotSize * 2, fontFamily: 'Inter', opacity: 0.5 }}>{y}</div>
        </div>
      );
    }

    console.log('Generating SVG with Satori...');
    const svg = await satori(element, {
      width: w,
      height: h,
      fonts: [{ name: 'Inter', data: font, weight: 400, style: 'normal' }],
    });
    console.log('SVG generated successfully');

    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
      return res.send(svg);
    }

    console.log('Rendering PNG with Resvg...');
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: w } });
    const pngBuffer = resvg.render().asPng();
    console.log('PNG rendered successfully');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.send(pngBuffer);

  } catch (e: any) {
    console.error('Error generating wallpaper:', e);
    res.status(500).send(`Internal Server Error: ${e.message}`);
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
