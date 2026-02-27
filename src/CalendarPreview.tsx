/**
 * Client-side calendar render with auto-scaling SVG dots.
 * Measures its own container via ResizeObserver and computes dot sizes to fit.
 */

import { useRef, useState, useEffect } from 'react';
import { getDaysInYear, getDayOfYear, getWeeksBetween, isValidDate } from './lib/dates';

type Mode = 'year' | 'life';

interface CalendarPreviewProps {
  mode: Mode;
  fg: string;
  bg: string;
  year: number;
  birthday: string;
  lifeExp: number;
  showStats: boolean;
  width: number;
  height: number;
}

export function CalendarPreview({
  mode,
  fg,
  bg,
  year,
  birthday,
  lifeExp,
  showStats,
}: CalendarPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    measure();
    const obs = new ResizeObserver(() => measure());
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        overflow: 'hidden',
      }}
    >
      {size.w > 0 && size.h > 0 && (
        mode === 'life'
          ? <LifeGrid fg={fg} birthday={birthday} lifeExp={lifeExp} showStats={showStats} cw={size.w} ch={size.h} />
          : <YearGrid fg={fg} year={year} cw={size.w} ch={size.h} />
      )}
    </div>
  );
}

function LifeGrid({ fg, birthday, lifeExp, showStats, cw, ch }: {
  fg: string; birthday: string; lifeExp: number; showStats: boolean; cw: number; ch: number;
}) {
  const bday = new Date(birthday);
  if (!isValidDate(bday)) return <text fill={fg}>?</text>;

  const totalWeeks = lifeExp * 52;
  const livedWeeks = Math.max(0, getWeeksBetween(bday, new Date()));
  const clampedLived = Math.min(livedWeeks, totalWeeks);
  const cols = 52;
  const rows = lifeExp;
  const pad = 4;
  const aw = cw - pad * 2;
  const ah = ch - pad * 2;
  const gr = 0.3;
  const dw = aw / (cols + (cols - 1) * gr);
  const dh = ah / (rows + (rows - 1) * gr);
  const d = Math.max(0.5, Math.min(dw, dh));
  const g = d * gr;
  const gw = cols * d + (cols - 1) * g;
  const gh = rows * d + (rows - 1) * g;
  const ox = (cw - gw) / 2;
  const oy = (ch - gh) / 2;

  return (
    <svg width={cw} height={ch} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const i = row * cols + col;
          if (i >= totalWeeks) return null;
          const lived = i < clampedLived;
          const cx = ox + col * (d + g) + d / 2;
          const cy = oy + row * (d + g) + d / 2;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={d / 2}
              fill={lived ? fg : 'none'}
              stroke={fg}
              strokeWidth={lived ? 0 : Math.max(0.2, d * 0.15)}
              opacity={lived ? 1 : 0.35}
            />
          );
        })
      )}
      {showStats && (
        <text x={cw / 2} y={ch - 2} fill={fg} fontSize={Math.max(6, d * 2)} textAnchor="middle" opacity={0.6}>
          {Math.floor((clampedLived / totalWeeks) * 100)}%
        </text>
      )}
    </svg>
  );
}

function YearGrid({ fg, year, cw, ch }: {
  fg: string; year: number; cw: number; ch: number;
}) {
  const totalDays = getDaysInYear(year);
  const currentDay = getDayOfYear(new Date());
  const nowY = new Date().getFullYear();
  const cols = 7;
  const rows = Math.ceil(totalDays / cols);
  const pad = 6;
  const labelH = 14;
  const aw = cw - pad * 2;
  const ah = ch - pad * 2 - labelH;
  const gr = 0.35;
  const dw = aw / (cols + (cols - 1) * gr);
  const dh = ah / (rows + (rows - 1) * gr);
  const d = Math.max(0.5, Math.min(dw, dh));
  const g = d * gr;
  const gw = cols * d + (cols - 1) * g;
  const gh = rows * d + (rows - 1) * g;
  const ox = (cw - gw) / 2;
  const oy = (ch - gh - labelH) / 2;

  return (
    <svg width={cw} height={ch} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const i = row * cols + col;
          if (i >= totalDays) return null;
          let filled = false;
          if (year < nowY) filled = true;
          else if (year > nowY) filled = false;
          else filled = (i + 1) <= currentDay;
          const cx = ox + col * (d + g) + d / 2;
          const cy = oy + row * (d + g) + d / 2;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={d / 2}
              fill={filled ? fg : 'none'}
              stroke={fg}
              strokeWidth={filled ? 0 : Math.max(0.3, d * 0.12)}
              opacity={filled ? 1 : 0.35}
            />
          );
        })
      )}
      <text x={cw / 2} y={ch - pad} fill={fg} fontSize={Math.max(8, d * 1.5)} textAnchor="middle" opacity={0.6} fontFamily="Inter, sans-serif">
        {year}
      </text>
    </svg>
  );
}
