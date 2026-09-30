// Borka Mart — editorial fashion illustration generator.
// Produces the SVG product, hero and lookbook artwork in assets/img.
// Run: node scripts/generate-art.mjs

/* ---------- colour helpers ---------- */
const clamp = (v, a = 0, b = 255) => Math.max(a, Math.min(b, v));
const hexToRgb = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map((v) => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
};
export const shade = (hex, amt) => (amt >= 0 ? mix(hex, '#ffffff', amt) : mix(hex, '#000000', -amt));
const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

/* ---------- deterministic randomness ---------- */
const rng = (seed) => {
  let s = 0;
  for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/* ---------- motifs ---------- */
function embroideryPattern(id, trim, kind = 'vine', bg = 'none') {
  const t = trim, t2 = shade(trim, 0.35);
  if (kind === 'pearl')
    return `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${bg}"/>
      <circle cx="7" cy="7" r="3.4" fill="${t2}"/><circle cx="6" cy="6" r="1.2" fill="#fff" opacity=".8"/>
    </pattern>`;
  if (kind === 'geo')
    return `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="${bg}"/>
      <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke="${t}" stroke-width="1.3"/>
      <circle cx="8" cy="8" r="1.8" fill="${t2}"/>
    </pattern>`;
  // floral vine
  return `<pattern id="${id}" width="18" height="22" patternUnits="userSpaceOnUse">
    <rect width="18" height="22" fill="${bg}"/>
    <path d="M9 0 C 14 5, 4 11, 9 16 S 9 22 9 22" fill="none" stroke="${t}" stroke-width="1.1"/>
    <circle cx="9" cy="8" r="2.2" fill="${t2}"/>
    <path d="M9 8 m-4 0 a4 2 0 1 0 8 0 a4 2 0 1 0 -8 0" fill="none" stroke="${t}" stroke-width=".8"/>
    <circle cx="4" cy="17" r="1.1" fill="${t}"/><circle cx="14" cy="4" r="1.1" fill="${t}"/>
  </pattern>`;
}

/* ---------- the figure ---------- */
// Draws a full-length faceless modest-fashion figure in a 600x800 space.
// opts: { id, base, hijab, trim, inner, skin, style, motif, sheen }
export function figure(o) {
  const id = o.id;
  const base = o.base;
  const hijab = o.hijab || base;
  const trim = o.trim || '#C9A45C';
  const inner = o.inner || shade(base, 0.25);
  const skin = o.skin || '#E2B894';
  const style = o.style || 'classic';
  const dark = lum(base) < 0.25;
  const hi = shade(base, dark ? 0.22 : 0.18);
  const lo = shade(base, dark ? -0.45 : -0.28);
  const mid = shade(base, dark ? 0.06 : 0.02);
  const hjHi = shade(hijab, lum(hijab) < 0.25 ? 0.2 : 0.16);
  const hjLo = shade(hijab, lum(hijab) < 0.25 ? -0.45 : -0.26);
  const r = rng(id);
  const sway = (r() - 0.5) * 18; // hem movement

  const defs = `
    <linearGradient id="${id}-fab" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${lo}"/><stop offset=".3" stop-color="${hi}"/>
      <stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/>
    </linearGradient>
    <linearGradient id="${id}-fabv" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".18"/>
    </linearGradient>
    <linearGradient id="${id}-slv" x1="0" x2="1">
      <stop offset="0" stop-color="${lo}"/><stop offset=".45" stop-color="${hi}"/><stop offset="1" stop-color="${shade(base, -0.2)}"/>
    </linearGradient>
    <linearGradient id="${id}-hj" x1="0" x2="1">
      <stop offset="0" stop-color="${hjLo}"/><stop offset=".35" stop-color="${hjHi}"/>
      <stop offset=".65" stop-color="${shade(hijab, 0.04)}"/><stop offset="1" stop-color="${hjLo}"/>
    </linearGradient>
    <radialGradient id="${id}-skin" cx=".42" cy=".38" r=".75">
      <stop offset="0" stop-color="${shade(skin, 0.16)}"/><stop offset="1" stop-color="${shade(skin, -0.14)}"/>
    </radialGradient>
    <linearGradient id="${id}-inner" x1="0" x2="1">
      <stop offset="0" stop-color="${shade(inner, -0.18)}"/><stop offset=".5" stop-color="${shade(inner, 0.12)}"/><stop offset="1" stop-color="${shade(inner, -0.2)}"/>
    </linearGradient>
    <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
    ${embroideryPattern(id + '-emb', trim, o.motif || 'vine', 'none')}
    ${embroideryPattern(id + '-embb', trim, o.motif || 'vine', shade(base, dark ? 0.04 : -0.08))}
  `;

  const hemL = 128 + sway * 0.4, hemR = 472 + sway * 0.4, hemY = 748;
  const body = `M 262 236 C 236 242 214 252 204 274 C 196 330 192 380 190 430
    C 180 560 150 660 ${hemL} ${hemY} Q ${300 + sway} ${hemY + 22} ${hemR} ${hemY}
    C 450 660 420 560 410 430 C 408 380 404 330 396 274 C 386 252 364 242 338 236 Z`;

  const butterfly = style === 'butterfly';
  const wings = butterfly
    ? `<path d="M 206 272 C 150 300 110 380 92 470 C 80 540 88 600 110 640 C 118 680 122 715 ${hemL + 6} ${hemY - 4} L 190 430 Z" fill="url(#${id}-slv)"/>
       <path d="M 394 272 C 450 300 490 380 508 470 C 520 540 512 600 490 640 C 482 680 478 715 ${hemR - 6} ${hemY - 4} L 410 430 Z" fill="url(#${id}-slv)"/>
       <path d="M 206 272 C 150 300 110 380 92 470 C 80 540 88 600 110 640" fill="none" stroke="${shade(base, dark ? 0.3 : -0.35)}" stroke-width="1.4" opacity=".55"/>
       <path d="M 394 272 C 450 300 490 380 508 470 C 520 540 512 600 490 640" fill="none" stroke="${shade(base, dark ? 0.3 : -0.35)}" stroke-width="1.4" opacity=".55"/>
       <path d="M 150 380 C 140 470 132 560 136 690" stroke="${lo}" stroke-width="10" fill="none" opacity=".35" filter="url(#${id}-soft)"/>
       <path d="M 450 380 C 460 470 468 560 464 690" stroke="${lo}" stroke-width="10" fill="none" opacity=".35" filter="url(#${id}-soft)"/>`
    : '';

  // Folds
  const folds = [
    [252, 440, 238, 560, 214, 748, 0.28],
    [300, 450, 298, 600, 300 + sway, 760, 0.18],
    [346, 440, 364, 560, 392, 748, 0.3],
    [224, 470, 204, 600, 170, 745, 0.22],
    [380, 470, 400, 600, 430, 745, 0.22],
  ]
    .map(([x1, y1, x2, y2, x3, y3, op]) =>
      `<path d="M ${x1} ${y1} C ${x2} ${y2} ${x2} ${y2} ${x3} ${y3}" stroke="${lo}" stroke-width="9" fill="none" opacity="${op}" filter="url(#${id}-soft)"/>
       <path d="M ${x1 + 8} ${y1} C ${x2 + 9} ${y2} ${x2 + 9} ${y2} ${x3 + 10} ${y3}" stroke="${hi}" stroke-width="4" fill="none" opacity="${op * 0.8}" filter="url(#${id}-soft)"/>`)
    .join('');

  // Style details
  let detail = '';
  if (style === 'open') {
    detail += `<path d="M 286 330 L 314 330 C 330 480 346 620 356 ${hemY + 10} Q 300 ${hemY + 18} 244 ${hemY + 10} C 254 620 270 480 286 330 Z" fill="url(#${id}-inner)"/>
      <path d="M 286 330 C 270 480 254 620 244 ${hemY + 10}" stroke="url(#${id}-emb)" stroke-width="12" fill="none"/>
      <path d="M 314 330 C 330 480 346 620 356 ${hemY + 10}" stroke="url(#${id}-emb)" stroke-width="12" fill="none"/>
      <path d="M 280 330 C 264 480 248 620 238 ${hemY + 10}" stroke="${trim}" stroke-width="1.2" fill="none" opacity=".8"/>
      <path d="M 320 330 C 336 480 352 620 362 ${hemY + 10}" stroke="${trim}" stroke-width="1.2" fill="none" opacity=".8"/>`;
  } else if (style === 'classic' || style === 'belted' || style === 'butterfly') {
    detail += `<path d="M 300 334 C 299 480 300 620 ${300 + sway * 0.8} ${hemY + 14}" stroke="url(#${id}-emb)" stroke-width="14" fill="none"/>
      <path d="M 292 334 C 291 480 292 620 ${292 + sway * 0.8} ${hemY + 14}" stroke="${trim}" stroke-width="1" fill="none" opacity=".7"/>
      <path d="M 308 334 C 307 480 308 620 ${308 + sway * 0.8} ${hemY + 14}" stroke="${trim}" stroke-width="1" fill="none" opacity=".7"/>`;
  }
  if (o.hem) {
    detail += `<clipPath id="${id}-hemclip"><path d="${body}"/></clipPath>
      <g clip-path="url(#${id}-hemclip)">
        <path d="M 100 ${hemY - 44} Q ${300 + sway} ${hemY - 22} 500 ${hemY - 44} L 500 800 L 100 800 Z" fill="url(#${id}-embb)"/>
        <path d="M 100 ${hemY - 44} Q ${300 + sway} ${hemY - 22} 500 ${hemY - 44}" stroke="${trim}" stroke-width="2" fill="none"/>
        <path d="M 100 ${hemY - 50} Q ${300 + sway} ${hemY - 28} 500 ${hemY - 50}" stroke="${trim}" stroke-width=".8" fill="none"/>
      </g>`;
  }
  if (style === 'belted') {
    detail += `<path d="M 191 418 Q 300 440 409 418 L 410 438 Q 300 460 190 438 Z" fill="${shade(base, dark ? 0.12 : -0.18)}"/>
      <path d="M 191 418 Q 300 440 409 418" stroke="${trim}" stroke-width="1.2" fill="none" opacity=".8"/>
      <path d="M 190 438 Q 300 460 410 438" stroke="${trim}" stroke-width="1.2" fill="none" opacity=".8"/>
      <rect x="286" y="424" width="28" height="24" rx="5" fill="none" stroke="${trim}" stroke-width="3.2"/>
      <path d="M 296 446 C 290 500 286 540 280 580" stroke="${shade(base, dark ? 0.12 : -0.18)}" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M 304 446 C 312 495 318 530 326 566" stroke="${shade(base, dark ? 0.1 : -0.2)}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  }

  // Cape overlay
  const cape = style === 'cape'
    ? `<path d="M 206 270 C 170 340 146 440 140 540 Q 300 590 460 540 C 454 440 430 340 394 270 C 370 300 330 320 300 322 C 270 320 230 300 206 270 Z" fill="url(#${id}-slv)" opacity=".97"/>
       <path d="M 140 540 Q 300 590 460 540 L 461 552 Q 300 602 139 552 Z" fill="url(#${id}-emb)"/>
       <path d="M 139 554 Q 300 604 461 554" stroke="${trim}" stroke-width="1.6" fill="none"/>
       <path d="M 230 330 C 214 400 200 470 196 548" stroke="${lo}" stroke-width="8" opacity=".3" fill="none" filter="url(#${id}-soft)"/>
       <path d="M 370 330 C 386 400 400 470 404 548" stroke="${lo}" stroke-width="8" opacity=".3" fill="none" filter="url(#${id}-soft)"/>
       <path d="M 300 340 C 300 420 300 490 300 572" stroke="${hi}" stroke-width="6" opacity=".25" fill="none" filter="url(#${id}-soft)"/>`
    : '';

  // Sleeves & hands (not for butterfly / cape where arms sit under fabric)
  const cuffKind = o.motif || 'vine';
  const sleeves = butterfly || style === 'cape'
    ? `<ellipse cx="${butterfly ? 118 : 158}" cy="${butterfly ? 520 : 560}" rx="11" ry="15" fill="url(#${id}-skin)" transform="rotate(${butterfly ? 30 : 12} ${butterfly ? 118 : 158} ${butterfly ? 520 : 560})"/>
       <ellipse cx="${butterfly ? 482 : 442}" cy="${butterfly ? 520 : 560}" rx="11" ry="15" fill="url(#${id}-skin)" transform="rotate(${butterfly ? -30 : -12} ${butterfly ? 482 : 442} ${butterfly ? 520 : 560})"/>`
    : `<path d="M 208 270 C 188 300 176 380 164 470 L 156 512 C 178 522 208 524 230 516 C 232 450 236 360 240 300 Z" fill="url(#${id}-slv)"/>
       <path d="M 392 270 C 412 300 424 380 436 470 L 444 512 C 422 522 392 524 370 516 C 368 450 364 360 360 300 Z" fill="url(#${id}-slv)"/>
       <path d="M 156 512 C 178 522 208 524 230 516 L 229 500 C 208 507 180 506 159 497 Z" fill="url(#${id}-emb)"/>
       <path d="M 444 512 C 422 522 392 524 370 516 L 371 500 C 392 507 420 506 441 497 Z" fill="url(#${id}-emb)"/>
       <path d="M 156 512 C 178 522 208 524 230 516" stroke="${trim}" stroke-width="1.4" fill="none"/>
       <path d="M 444 512 C 422 522 392 524 370 516" stroke="${trim}" stroke-width="1.4" fill="none"/>
       <path d="M 222 300 C 216 360 210 430 206 500" stroke="${lo}" stroke-width="6" opacity=".35" fill="none" filter="url(#${id}-soft)"/>
       <path d="M 378 300 C 384 360 390 430 394 500" stroke="${lo}" stroke-width="6" opacity=".35" fill="none" filter="url(#${id}-soft)"/>
       <ellipse cx="193" cy="534" rx="12" ry="16" fill="url(#${id}-skin)"/>
       <ellipse cx="407" cy="534" rx="12" ry="16" fill="url(#${id}-skin)"/>`;
  void cuffKind;

  // Head & hijab
  const head = `
    <path d="M 300 86 C 350 86 362 128 360 170 C 358 200 350 222 342 236 L 258 236 C 250 222 242 200 240 170 C 238 128 250 86 300 86 Z" fill="url(#${id}-hj)"/>
    <ellipse cx="300" cy="164" rx="26" ry="33" fill="url(#${id}-skin)"/>
    <path d="M 270 150 C 276 118 324 118 330 150 C 322 136 278 136 270 150 Z" fill="${shade(hijab, lum(hijab) < 0.25 ? 0.08 : -0.06)}"/>
    <path d="M 272 136 C 280 112 320 112 328 136" stroke="${shade(hijab, lum(hijab) < 0.25 ? 0.25 : -0.2)}" stroke-width="1.2" fill="none" opacity=".6"/>
    <path d="M 256 176 C 248 214 230 250 212 290 C 240 322 272 336 300 338 C 328 336 360 322 388 290 C 370 250 352 214 344 176 C 336 206 322 222 300 224 C 278 222 264 206 256 176 Z" fill="url(#${id}-hj)"/>
    <path d="M 262 206 C 256 240 244 270 232 296" stroke="${hjLo}" stroke-width="6" opacity=".45" fill="none" filter="url(#${id}-soft)"/>
    <path d="M 338 206 C 344 240 356 270 368 296" stroke="${hjLo}" stroke-width="6" opacity=".45" fill="none" filter="url(#${id}-soft)"/>
    <path d="M 300 226 C 300 260 300 300 300 334" stroke="${hjHi}" stroke-width="5" opacity=".35" fill="none" filter="url(#${id}-soft)"/>
    <path d="M 212 290 C 240 322 272 336 300 338 C 328 336 360 322 388 290" stroke="${o.hijabTrim ? trim : hjLo}" stroke-width="${o.hijabTrim ? 1.6 : 1}" fill="none" opacity=".7"/>
    ${o.brooch ? `<circle cx="336" cy="212" r="5" fill="${trim}"/><circle cx="335" cy="211" r="1.8" fill="#fff" opacity=".7"/>` : ''}
  `;

  return {
    defs,
    body: `
      <g>
        ${wings}
        <path d="${body}" fill="url(#${id}-fab)"/>
        <path d="${body}" fill="url(#${id}-fabv)"/>
        ${folds}
        ${detail}
        ${cape}
        ${sleeves}
        <path d="M 214 296 C 242 330 272 344 300 346 C 328 344 358 330 386 296" stroke="#000" stroke-width="10" opacity=".16" fill="none" filter="url(#${id}-soft)"/>
        ${head}
      </g>`,
  };
}

/* ---------- scenes ---------- */
export function backdrop(id, bg, kind = 'arch', accent = '#C9A45C') {
  const b1 = bg[0], b2 = bg[1];
  const archFill = shade(b1, lum(b1) < 0.3 ? 0.07 : -0.085);
  const floor = shade(b2, lum(b2) < 0.3 ? -0.15 : -0.07);
  const defs = `
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient>
    <radialGradient id="${id}-glow" cx=".5" cy=".38" r=".55"><stop offset="0" stop-color="#fff" stop-opacity="${lum(b1) < 0.3 ? 0.14 : 0.45}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor}" stop-opacity=".0"/><stop offset=".25" stop-color="${floor}" stop-opacity=".9"/><stop offset="1" stop-color="${shade(floor, -0.08)}"/></linearGradient>
  `;
  let shapes = `<rect width="600" height="800" fill="url(#${id}-bg)"/>`;
  if (kind === 'arch') {
    shapes += `<path d="M 130 800 L 130 330 A 170 170 0 0 1 470 330 L 470 800 Z" fill="${archFill}"/>
      <path d="M 146 800 L 146 332 A 154 154 0 0 1 454 332 L 454 800" fill="none" stroke="${accent}" stroke-width="1.6" opacity=".75"/>`;
  } else if (kind === 'double') {
    shapes += `<path d="M 60 800 L 60 380 A 120 120 0 0 1 300 380 L 300 800 Z" fill="${archFill}" opacity=".8"/>
      <path d="M 300 800 L 300 380 A 120 120 0 0 1 540 380 L 540 800 Z" fill="${archFill}" opacity=".55"/>
      <path d="M 170 800 L 170 300 A 130 130 0 0 1 430 300 L 430 800 Z" fill="${shade(archFill, -0.03)}"/>
      <path d="M 184 800 L 184 302 A 116 116 0 0 1 416 302 L 416 800" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".5"/>`;
  } else if (kind === 'circle') {
    shapes += `<circle cx="300" cy="360" r="230" fill="${archFill}"/>
      <circle cx="300" cy="360" r="214" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".5"/>`;
  } else if (kind === 'curtain') {
    for (let i = 0; i < 9; i++) {
      const x = i * 75;
      shapes += `<path d="M ${x} 0 C ${x + 20} 300 ${x - 14} 500 ${x + 8} 800" stroke="${shade(b1, -0.06)}" stroke-width="22" fill="none" opacity=".5"/>`;
    }
  }
  shapes += `<rect width="600" height="800" fill="url(#${id}-glow)"/>
    <rect y="690" width="600" height="110" fill="url(#${id}-floor)"/>
    <ellipse cx="300" cy="760" rx="190" ry="18" fill="#000" opacity=".18" filter="url(#${id}-shadow)"/>`;
  return {
    defs: defs + `<filter id="${id}-shadow" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>`,
    shapes,
  };
}

// Small scattered botanicals for a styled set.
export function props(id, color, side = 'left') {
  const x = side === 'left' ? 70 : 530, dir = side === 'left' ? 1 : -1;
  const stems = [];
  for (let i = 0; i < 6; i++) {
    const a = -70 + i * 22;
    const len = 150 + (i % 3) * 40;
    const ex = x + dir * Math.sin((a * Math.PI) / 180) * len * 0.5;
    const ey = 700 - Math.cos((a * Math.PI) / 180) * len;
    stems.push(`<path d="M ${x} 700 Q ${x + dir * (i - 2) * 10} ${(700 + ey) / 2} ${ex} ${ey}" stroke="${color}" stroke-width="1.6" fill="none"/>
      <ellipse cx="${ex}" cy="${ey}" rx="9" ry="20" fill="${color}" opacity=".85" transform="rotate(${a * dir} ${ex} ${ey})"/>
      <ellipse cx="${(x + ex) / 2 + dir * 8}" cy="${(700 + ey) / 2}" rx="6" ry="14" fill="${color}" opacity=".7" transform="rotate(${a * dir + 30} ${(x + ex) / 2 + dir * 8} ${(700 + ey) / 2})"/>`);
  }
  return `<g opacity=".9">${stems.join('')}
    <path d="M ${x - 34} 700 L ${x + 34} 700 L ${x + 26} 770 L ${x - 26} 770 Z" fill="${shade(color, 0.55)}"/>
    <path d="M ${x - 34} 700 L ${x + 34} 700" stroke="${shade(color, 0.2)}" stroke-width="2"/></g>`;
}

export function svgDoc(w, h, viewBox, defs, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${content}</svg>`;
}
