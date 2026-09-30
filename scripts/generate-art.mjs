// Generates all SVG artwork for the storefront.
// Usage: node scripts/generate-art.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { figure, backdrop, props, svgDoc, shade, mix } from './art.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS } = require(path.join(ROOT, 'assets/js/data.js'));
const OUT_P = path.join(ROOT, 'assets/img/products');
const OUT_S = path.join(ROOT, 'assets/img/site');
fs.mkdirSync(OUT_P, { recursive: true });
fs.mkdirSync(OUT_S, { recursive: true });

const PLANT = '#8F9C82';
const write = (dir, name, svg) => fs.writeFileSync(path.join(dir, name), svg.replace(/\s{2,}/g, ' '));

const figOpts = (p, c, id) => ({
  id, base: c.base, hijab: c.hijab, trim: c.trim, inner: c.inner, skin: p.skin,
  style: p.style, motif: p.motif, hem: p.hem, brooch: p.brooch, hijabTrim: p.hijabTrim,
});

/* ---- product images ---- */
let count = 0;
for (const p of PRODUCTS) {
  for (const c of p.colors) {
    const key = `${p.id}${c.key}`;
    // a — hero shot
    {
      const f = figure(figOpts(p, c, key + 'a'));
      const b = backdrop(key + 'ab', c.bg, 'arch', c.trim);
      write(OUT_P, `${p.id}-${c.key}-a.svg`, svgDoc(600, 800, '0 0 600 800', b.defs + f.defs, b.shapes + props(key + 'ap', PLANT, 'left') + f.body));
    }
    // b — detail crop
    {
      const f = figure(figOpts(p, c, key + 'b'));
      const b = backdrop(key + 'bb', c.bg, 'arch', c.trim);
      write(OUT_P, `${p.id}-${c.key}-b.svg`, svgDoc(600, 800, '150 64 300 400', b.defs + f.defs, b.shapes + f.body));
    }
    // c — alternate set
    {
      const f = figure(figOpts(p, c, key + 'c'));
      const bg = [mix(c.bg[0], c.base, 0.1), mix(c.bg[1], c.base, 0.16)];
      const b = backdrop(key + 'cb', bg, count % 2 ? 'circle' : 'double', c.trim);
      write(OUT_P, `${p.id}-${c.key}-c.svg`, svgDoc(600, 800, '0 0 600 800', b.defs + f.defs, b.shapes + props(key + 'cp', shade(PLANT, -0.1), 'right') + f.body));
    }
    count++;
  }
}

/* ---- group compositions ---- */
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
function group(prefix, members, W, H, bg, accent, arches) {
  let defs = '', body = '';
  const bgd = backdrop(prefix + 'bg', bg, 'none', accent);
  defs += bgd.defs;
  // stretch the 600x800 backdrop to the canvas
  body += `<g transform="scale(${W / 600} ${H / 800})">${bgd.shapes.replace(/<ellipse[^>]*\/>/, '')}</g>`;
  for (const a of arches) {
    const { x, w, top } = a;
    const r = w / 2;
    body += `<path d="M ${x - r} ${H} L ${x - r} ${top + r} A ${r} ${r} 0 0 1 ${x + r} ${top + r} L ${x + r} ${H} Z" fill="${shade(bg[0], a.fill ?? 0.05)}"/>
      <path d="M ${x - r + 14} ${H} L ${x - r + 14} ${top + r} A ${r - 14} ${r - 14} 0 0 1 ${x + r - 14} ${top + r} L ${x + r - 14} ${H}" fill="none" stroke="${accent}" stroke-width="1.6" opacity=".6"/>`;
  }
  members.forEach((m, i) => {
    const p = byId[m.id];
    const c = p.colors.find((cc) => cc.key === m.color) || p.colors[0];
    const f = figure(figOpts(p, c, `${prefix}f${i}`));
    defs += f.defs;
    body += `<g transform="translate(${m.x - 300 * m.s} ${m.y}) scale(${m.s})">
      <ellipse cx="300" cy="760" rx="170" ry="16" fill="#000" opacity=".28" filter="url(#${prefix}bg-shadow)"/>${f.body}</g>`;
  });
  return svgDoc(W, H, `0 0 ${W} ${H}`, defs, body);
}

const heroes = [
  {
    name: 'hero-1', bg: ['#1A433B', '#0B1F1B'], accent: '#D4B06A',
    members: [
      { id: 'p02', color: 'noir', x: 230, y: 230, s: 0.95 },
      { id: 'p08', color: 'champagne', x: 670, y: 230, s: 0.95 },
      { id: 'p11', color: 'emerald', x: 450, y: 150, s: 1.1 },
    ],
  },
  {
    name: 'hero-2', bg: ['#F1E4D4', '#DCC6AE'], accent: '#A9864E',
    members: [
      { id: 'p04', color: 'sand', x: 220, y: 230, s: 0.95 },
      { id: 'p12', color: 'blush', x: 680, y: 230, s: 0.95 },
      { id: 'p03', color: 'rose', x: 450, y: 150, s: 1.1 },
    ],
  },
  {
    name: 'hero-3', bg: ['#3D1A2A', '#1A0911'], accent: '#D8B06A',
    members: [
      { id: 'p06', color: 'plum', x: 225, y: 230, s: 0.95 },
      { id: 'p16', color: 'plum', x: 675, y: 230, s: 0.95 },
      { id: 'p09', color: 'wine', x: 450, y: 150, s: 1.1 },
    ],
  },
];
for (const h of heroes) {
  const W = 900, H = 1100;
  const arches = [
    { x: 230, w: 330, top: 230, fill: 0.04 },
    { x: 670, w: 330, top: 230, fill: 0.04 },
    { x: 450, w: 400, top: 110, fill: 0.08 },
  ];
  write(OUT_S, `${h.name}.svg`, group(h.name, h.members, W, H, h.bg, h.accent, arches));
}

// Wide lookbook banner
{
  const W = 1600, H = 800;
  const members = [
    { id: 'p13', color: 'noir', x: 260, y: 90, s: 0.88 },
    { id: 'p02', color: 'navy', x: 540, y: 60, s: 0.92 },
    { id: 'p11', color: 'wine', x: 800, y: 30, s: 0.96 },
    { id: 'p08', color: 'champagne', x: 1060, y: 60, s: 0.92 },
    { id: 'p09', color: 'emerald', x: 1340, y: 90, s: 0.88 },
  ];
  const arches = members.map((m) => ({ x: m.x, w: 250, top: 70 + (m.y - 30), fill: 0.05 }));
  write(OUT_S, 'eid-banner.svg', group('eid', members, W, H, ['#15352F', '#0A1C18'], '#D4B06A', arches));
}

// Portrait lookbook tiles
const looks = [
  { name: 'look-1', id: 'p05', color: 'olive', bg: ['#E9E4D6', '#D4CCB6'] },
  { name: 'look-2', id: 'p14', color: 'indigo', bg: ['#E6E8E6', '#CFD3D0'] },
  { name: 'look-3', id: 'p15', color: 'terracotta', bg: ['#F2E5D8', '#DFC8B3'] },
];
for (const l of looks) {
  const p = byId[l.id];
  const c = p.colors.find((x) => x.key === l.color);
  const f = figure(figOpts(p, c, l.name));
  const b = backdrop(l.name + 'b', l.bg, 'curtain', c.trim);
  write(OUT_S, `${l.name}.svg`, svgDoc(600, 800, '0 0 600 800', b.defs + f.defs, b.shapes + props(l.name + 'p', PLANT, 'right') + f.body));
}

/* ---- atelier still life (about page) ---- */
{
  const W = 800, H = 1000;
  const fabrics = ['#1B1A1F', '#6B1E2E', '#1E5A4C', '#C9B397', '#C48E8C', '#1E2740', '#ECE6DC'];
  let s = `<rect width="${W}" height="${H}" fill="url(#atbg)"/>
    <path d="M 160 ${H} L 160 360 A 240 240 0 0 1 640 360 L 640 ${H} Z" fill="#E9DDCD"/>
    <path d="M 178 ${H} L 178 362 A 222 222 0 0 1 622 362 L 622 ${H}" fill="none" stroke="#C9A45C" stroke-width="1.6" opacity=".7"/>
    <rect y="760" width="${W}" height="240" fill="#CDB89E"/><rect y="760" width="${W}" height="8" fill="#B89F82"/>`;
  let y = 740;
  fabrics.forEach((f, i) => {
    const w = 500 - i * 18, x = 400 - w / 2 + (i % 2 ? 12 : -12), h = 60;
    s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="18" fill="${f}"/>
      <rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="18" fill="url(#atfold)"/>
      <path d="M ${x + 20} ${y - h / 2} L ${x + w - 20} ${y - h / 2}" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>`;
    if (i === 1 || i === 4) s += `<rect x="${x + 30}" y="${y - h + 8}" width="${w - 60}" height="6" fill="url(#atemb)" opacity=".9"/>`;
    y -= h - 4;
  });
  // thread spools
  [[88, '#C9A45C'], [138, '#E8E0D2'], [712, '#B77F7F']].forEach(([x, col]) => {
    s += `<rect x="${x - 22}" y="690" width="44" height="10" rx="3" fill="#8A6A48"/>
      <rect x="${x - 17}" y="630" width="34" height="62" rx="6" fill="${col}"/>
      <rect x="${x - 17}" y="630" width="34" height="62" rx="6" fill="url(#atfold)"/>
      <rect x="${x - 22}" y="622" width="44" height="10" rx="3" fill="#8A6A48"/>`;
  });
  s += `<path d="M 560 740 C 600 700 660 700 700 720" stroke="#C9A45C" stroke-width="2" fill="none"/>
    <ellipse cx="400" cy="752" rx="280" ry="14" fill="#000" opacity=".14"/>`;
  const defs = `<linearGradient id="atbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5EEE5"/><stop offset="1" stop-color="#E8DCCB"/></linearGradient>
    <linearGradient id="atfold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <pattern id="atemb" width="10" height="6" patternUnits="userSpaceOnUse"><circle cx="5" cy="3" r="2" fill="#D6B26A"/></pattern>`;
  write(OUT_S, 'atelier.svg', svgDoc(W, H, `0 0 ${W} ${H}`, defs, s));
}

console.log(`Generated ${count * 3} product images + site artwork.`);
