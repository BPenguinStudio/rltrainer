// ─────────────────────────────────────────────────────────────────────────
//  Rank emblems — procedurally drawn SVG badges, one per competitive tier.
//  Each tier gets a distinct shape detail + its theme gradient so progress
//  feels visually earned (Bronze chevrons → Champion wings → SSL crown).
// ─────────────────────────────────────────────────────────────────────────
import { RANKS } from './skills.js';

const RANK_BY_KEY = Object.fromEntries(RANKS.map((r) => [r.key, r]));

// tier index helpers
const ORDER = RANKS.map((r) => r.key);

function chevrons(count, color) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const y = 60 + i * 9;
    out += `<path d="M30 ${y} L50 ${y - 9} L70 ${y}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="${0.9 - i * 0.12}"/>`;
  }
  return out;
}

function wings(color) {
  return `
    <path d="M50 40 C30 40 18 50 12 64 C26 60 34 62 42 70 C40 58 46 48 50 40Z" fill="${color}" opacity="0.9"/>
    <path d="M50 40 C70 40 82 50 88 64 C74 60 66 62 58 70 C60 58 54 48 50 40Z" fill="${color}" opacity="0.9"/>`;
}

function crown(color) {
  return `<path d="M28 64 L34 44 L44 56 L50 38 L56 56 L66 44 L72 64 Z" fill="${color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="50" cy="34" r="4" fill="#fff"/>`;
}

/**
 * Build an SVG string for a rank tier.
 * @param {string} key   rank key (bronze, silver, ...)
 * @param {number} size  pixel size
 */
export function rankEmblem(key, size = 100) {
  const r = RANK_BY_KEY[key] || RANKS[0];
  const idx = ORDER.indexOf(r.key);
  const gid = `rg_${r.key}`;
  const sid = `rs_${r.key}`;

  // detail per tier band
  let detail;
  if (idx <= 2) detail = chevrons(idx + 1, '#ffffff');                 // bronze/silver/gold-ish chevrons by tier
  else if (idx <= 4) detail = chevrons(3, '#ffffff') ;                  // plat/diamond — three solid chevrons
  else if (idx === 5 || idx === 6) detail = wings('#ffffff');          // champion / GC wings
  else detail = crown('#fff7c2');                                      // SSL crown

  // central pip count grows with tier for a sense of progression
  const pips = Math.min(idx, 6);
  let pipMarks = '';
  for (let i = 0; i < pips; i++) {
    const a = (-Math.PI / 2) + (i / Math.max(pips, 1)) * Math.PI * 2;
    pipMarks += `<circle cx="${50 + Math.cos(a) * 30}" cy="${50 + Math.sin(a) * 30}" r="2" fill="#fff" opacity="0.5"/>`;
  }

  return `
  <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${r.name} emblem">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${r.colorA}"/>
        <stop offset="1" stop-color="${r.colorB}"/>
      </linearGradient>
      <radialGradient id="${sid}" cx="0.5" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path d="M50 6 L86 22 L86 54 C86 74 70 88 50 96 C30 88 14 74 14 54 L14 22 Z"
          fill="url(#${gid})" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
    <path d="M50 6 L86 22 L86 54 C86 74 70 88 50 96 C30 88 14 74 14 54 L14 22 Z"
          fill="url(#${sid})"/>
    ${pipMarks}
    ${detail}
  </svg>`;
}

export function rankColors(key) {
  const r = RANK_BY_KEY[key] || RANKS[0];
  return { a: r.colorA, b: r.colorB };
}
