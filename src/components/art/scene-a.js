/*
 * A · Continuous Landscape — the cover's evening carried through the page as one day.
 * Below the cover the river goes on: the towers' reflections break up in the current and
 * the fog lifts off the water (About). A far shore of low hills draws the horizon under
 * Experience; the water darkens to night with a village's lights on the far bank (What I do);
 * dawn comes up behind a ridge (Selected work), the morning stays pale for the figures, and
 * the light warms back to the cover's dusk, where the city stands again over the river at
 * the very end (Contact).
 */
import { TOWERS, BACK } from '@utils/cover-scene';
import { P, rng, f, cloud, gulls, band, waterLines, coverMap } from './kit';

const get = (a, k, d) => (a[k] ? a[k] : d);

/* Low hills on a far shore, with a village and a spire; lights in gold. */
const farShore = (W, y, colour, seed, lights = true) => {
  const R = rng(seed);
  let d = `M0 ${y}`;
  let x = 0;
  let lit = '';
  while (x < W) {
    const kind = R();
    if (kind < 0.12) {
      // a spire
      d += `H${f(x + 6)}V${f(y - 16)}l4 -16l4 16V${y}`;
      x += 20;
    } else if (kind < 0.55) {
      const w = 10 + R() * 22;
      const h = 5 + R() * 11;
      d += `H${f(x)}V${f(y - h)}h${f(w)}V${y}`;
      if (lights && R() < 0.7) lit += `M${f(x + 3 + R() * (w - 8))} ${f(y - h / 2)}h3`;
      x += w + R() * 8;
    } else {
      x += 30 + R() * 140;
    }
  }
  d += `H${W}V${y + 3}H0Z`;
  const land = band(W, y - 7, y + 3, colour, [
    [3, 420, seed],
    [2, 130, seed * 2],
  ]);
  return {
    shape: `${land}<path d="${d}" fill="${colour}"/>`,
    lights: lit ? `<path d="${lit}" stroke="${P.gold}" stroke-width="1.6" fill="none"/>` : '',
    lightXs: (lit.match(/M([\d.]+)/g) || []).map(m => parseFloat(m.slice(1))),
  };
};

/* Light on water: gold dashes below a source, shortening and spreading with depth. */
const glints = (xs, y, depth, opacity, seed) => {
  const R = rng(seed);
  let d = '';
  xs.forEach(x => {
    let yy = y + 4;
    let k = 0;
    while (yy < y + depth) {
      const l = Math.max(2, 10 - k * 0.6) * (0.6 + R() * 0.8);
      d += `M${f(x - l / 2 + (R() - 0.5) * 4)} ${f(yy)}h${f(l)}`;
      k += 1;
      yy += 6 + k * 1.8;
    }
  });
  return `<path d="${d}" stroke="${P.gold}" stroke-width="1.5" opacity="${opacity}" fill="none"/>`;
};

/* The towers' reflections under the cover, cut into ripples that drift as they deepen. */
const reflections = (W, depthMax) => {
  const cm = coverMap(W);
  const R = rng(61);
  let o = '';
  TOWERS.forEach(([x0, w, h], n) => {
    const L = Math.min(depthMax, h * 1.38 * cm.k * 2.1);
    let d = '';
    let y = 2 + R() * 6;
    let i = 0;
    while (y < L) {
      const t = y / L;
      const th = 2 + R() * 5 * (1 - t * 0.5);
      const sh = Math.sin(i * 0.9 + n * 1.7) * (1 + t * 9) * cm.k + (R() - 0.5) * 3 * t * cm.k;
      const ww = w * cm.k * (0.78 - t * 0.3) * (0.7 + R() * 0.4);
      d += `M${f(cm.x(x0) + (w * cm.k - ww) / 2 + sh)} ${f(y)}h${f(ww)}v${f(th)}h${f(-ww)}Z`;
      y += th + 3 + R() * (4 + t * 10);
      i += 1;
    }
    o += `<path d="${d}" fill="${P.back}" opacity="${f(0.36 - (n % 3) * 0.05)}"/>`;
  });
  return `<g mask="url(#rfade)">${o}</g>`;
};

const closingCity = (W, gy, riverH) => {
  const cm = coverMap(W);
  const ks = cm.k * 0.62;
  const X = x => cm.x(x);
  const Y = y => gy - (742 - y) * ks;
  const pathT = d =>
    d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `${f(X(+x))} ${f(Y(+y))}`);
  let o = '';
  // the mountain, as on the cover, paler with distance
  o += `<path d="${pathT(
    'M640 742 C740 716 800 668 870 624 C912 598 944 568 990 556 C1030 545 1056 560 1090 540 C1124 520 1150 498 1190 496 C1232 494 1256 520 1290 530 C1330 542 1352 536 1380 556 C1404 573 1424 590 1440 600 L1440 742 Z',
  )}" fill="${P.haze}"/>`;
  o += `<path d="M${f(X(1190))} ${f(Y(496))}v${f(-24 * ks)}M${f(X(1190) - 7 * ks)} ${f(Y(496) - 16 * ks)}h${f(14 * ks)}" stroke="${P.gold}" stroke-width="1.6"/>`;
  let back = '';
  BACK.forEach(([x, w, h]) => {
    back += `M${f(X(x))} ${gy}V${f(gy - h * ks * 1.38)}h${f(w * cm.k)}V${gy}Z`;
  });
  o += `<path d="${back}" fill="${P.hill}"/>`;
  let body = '';
  let lit = '';
  TOWERS.forEach(([x, w, h, kind], n) => {
    const top = gy - h * 1.38 * ks;
    const xx = X(x);
    const ww = w * cm.k;
    if (kind === 'point') body += `M${f(xx)} ${gy}V${f(top + 22 * ks)}L${f(xx + ww / 2)} ${f(top)}L${f(xx + ww)} ${f(top + 22 * ks)}V${gy}Z`;
    else body += `M${f(xx)} ${gy}V${f(top)}h${f(ww)}V${gy}Z`;
    for (let r = 0; r < (h * 1.38 * ks - 16) / 7; r++) {
      if ((n * 7 + r * 3) % 11 < 2) lit += `M${f(xx + 3 + ((n * 5 + r * 2) % Math.max(1, ww - 9)))} ${f(top + 12 + r * 7)}h4`;
    }
  });
  o += `<path d="${body}" fill="${P.back}"/>`;
  o += `<path d="${lit}" stroke="${P.gold}" stroke-width="1.3" fill="none"/>`;
  // the bridge, as on the cover
  let br = `M${f(X(700))} ${f(gy + 10 * ks)}H${W}M${f(X(700))} ${f(gy - 6 * ks)}H${W}`;
  const st = 16 * cm.k;
  for (let bx = X(700); bx < W; bx += st) br += `M${f(bx)} ${f(gy + 10 * ks)}l${f(st / 2)} ${f(-16 * ks)}l${f(st / 2)} ${f(16 * ks)}`;
  br += `M${f(X(900))} ${f(gy - 6 * ks)}Q${f(X(1020))} ${f(gy - 102 * ks)} ${f(X(1140))} ${f(gy - 6 * ks)}`;
  o += `<path d="${br}" stroke="${P.gold}" stroke-width="1.2" fill="none"/>`;
  // the river
  o += `<defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${P.river}"/><stop offset="1" stop-color="${P.ink}"/></linearGradient></defs>`;
  o += `<rect x="0" y="${f(gy + 10 * ks)}" width="${W}" height="${riverH + 4}" fill="url(#ar)"/>`;
  o += waterLines(W, gy + 16, gy + riverH, P.cream, 0.4, 41, 1);
  return o;
};

const vgrad = (id, y0, y1, stops) =>
  `<defs><linearGradient id="${id}" x1="0" x2="0" y1="${f(y0)}" y2="${f(y1)}" gradientUnits="userSpaceOnUse">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient></defs>`;

/* Fog: a few long cut clouds, layered from the colour of the water into the colour of the mist. */
const fog = (W, y0, y1, colours, n, seed) => {
  const R = rng(seed);
  let o = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = y0 + t * (y1 - y0) + (R() - 0.5) * 18;
    const w = W * (0.28 + R() * 0.38);
    const x = (i % 2 ? W - w * 0.7 : -w * 0.25) + (R() - 0.5) * W * 0.35;
    o += cloud(x, y, w, 14 + R() * 12, colours[Math.min(colours.length - 1, Math.floor(t * colours.length))], 0.92);
  }
  return o;
};

export const sceneA = ({ W, H, a }) => {
  const aboutHead = get(a, 'aboutHead', { top: 150, bottom: 700 });
  const aboutGrid = get(a, 'aboutGrid', { top: 1000, bottom: 1800 });
  const jobsHead = get(a, 'jobsHead', { top: 2000, bottom: 2300 });
  const jobs = get(a, 'jobs', { top: 1800, bottom: 4600 });
  const focusHead = get(a, 'focusHead', { top: 5200, bottom: 5500 });
  const focusList = get(a, 'focusList', { top: 5600, bottom: 6600 });
  const projectsHead = get(a, 'projectsHead', { top: 7400, bottom: 7700 });
  const impact = get(a, 'impact', { top: H - 3000, bottom: H - 1200 });
  const contact = get(a, 'contact', { top: H - 1200, bottom: H - 120 });
  const arts = a.articles || [];
  const cm = coverMap(W);
  let o = '';

  /* ---- 1 · the river under the cover; reflections; fog lifting off the water (About) ---- */
  const ab = aboutHead.bottom;
  const Y1 = aboutGrid.top - 20;
  o += vgrad('a1', 0, Y1, [
    [0, P.ink],
    [f((ab - 60) / Y1), '#21406a'],
    [f((ab + 70) / Y1), P.river],
    [f((ab + 150) / Y1), P.hill],
    [f((ab + 220) / Y1), P.haze],
    [1, P.mist],
  ]);
  o += `<rect x="0" y="0" width="${W}" height="${Y1 + 4}" fill="url(#a1)"/>`;
  o += `<defs><linearGradient id="rf" x1="0" x2="0" y1="0" y2="${ab}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".12" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="rfade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${ab + 40}"><rect width="${W}" height="${ab + 40}" fill="url(#rf)"/></mask></defs>`;
  o += reflections(W, ab);
  o += waterLines(W, 0, ab + 40, P.cream, 0.22, 5, 0.7);
  o += glints([884, 930, 973, 806, 1055, 722, 1134, 476].map(cm.x), 0, Math.min(460, ab), 0.8, 9);
  let piers = '';
  [780, 900, 1140, 1300].forEach(px => {
    for (let y = 2, k = 0; y < 260; k += 1, y += 14 + k * 3) piers += `M${f(cm.x(px))} ${y}v${f(Math.max(3, 10 - k * 0.6))}`;
  });
  o += `<path d="${piers}" stroke="${P.gold}" stroke-width="2.2" opacity=".5" fill="none"/>`;
  o += fog(W, ab + 70, Y1 - 30, ['#6f8fab', '#9fb3c3', P.haze, '#d6e0e6', '#eef2f4'], 10, 71);

  /* ---- 2 · mist, then the far shore that draws the horizon under Experience ---- */
  const lakeTop = jobsHead.bottom + 120;
  const night0 = jobs.bottom + 80;
  o += `<rect x="0" y="${Y1}" width="${W}" height="${lakeTop - Y1 + 2}" fill="${P.mist}"/>`;
  const gap0 = aboutGrid.bottom + 30;
  const gap1 = jobsHead.top - 30;
  if (gap1 - gap0 > 40) {
    o += gulls(
      [
        [W * 0.47, gap0 + (gap1 - gap0) * 0.45, 7],
        [W * 0.495, gap0 + (gap1 - gap0) * 0.35, 5],
      ],
      P.ink,
      1.2,
    );
  }
  o += band(W, lakeTop - 50, lakeTop + 2, '#c9d4dc', [
    [18, 760, 0.6],
    [7, 230, 2],
  ]);
  o += band(W, lakeTop - 22, lakeTop + 2, '#a6b9c8', [
    [10, 540, 2.2],
    [4, 150, 1],
  ]);

  /* ---- 3 · evening on the lake; a village on the far bank; night (What I do) ---- */
  const shoreY = focusHead.top - 260;
  o += vgrad('a3', lakeTop, shoreY, [
    [0, P.lake],
    [f((night0 - lakeTop) / (shoreY - lakeTop)), P.lake],
    [f((night0 + (shoreY - night0) * 0.55 - lakeTop) / (shoreY - lakeTop)), '#b4c4d0'],
    [1, '#7f9ab0'],
  ]);
  o += `<rect x="0" y="${lakeTop}" width="${W}" height="${shoreY - lakeTop + 2}" fill="url(#a3)"/>`;
  o += `<path d="M0 ${lakeTop + 0.5}H${W}" stroke="#f6f8f9" stroke-width="1"/>`;
  o += waterLines(W, lakeTop + 6, lakeTop + 140, '#f6f8f9', 0.7, 13, 0.35);
  const nEnd = focusList.bottom + 160;
  o += vgrad('a3b', shoreY, nEnd, [
    [0, P.back],
    [0.22, '#2c4d72'],
    [0.45, P.ink],
    [1, '#18304f'],
  ]);
  o += `<rect x="0" y="${shoreY}" width="${W}" height="${nEnd - shoreY + 2}" fill="url(#a3b)"/>`;
  o += band(W, shoreY - 38, shoreY + 2, '#93abbe', [
    [12, 900, 1.2],
    [5, 260, 0.2],
  ]);
  const shore = farShore(W, shoreY + 2, '#223a5c', 31);
  o += shore.shape + shore.lights;
  o += glints(shore.lightXs.filter((_, i) => i % 2 === 0), shoreY + 6, 300, 0.65, 33);
  o += waterLines(W, shoreY + 40, nEnd - 40, P.cream, 0.12, 35, 0.5);

  /* ---- 4 · fog, then dawn behind a ridge (Selected work) ---- */
  const ph = projectsHead.top - 40;
  const ridgeY = nEnd + (ph - nEnd) * 0.5;
  o += vgrad('a4', nEnd, ph, [
    [0, '#18304f'],
    [0.14, '#3e6386'],
    [0.32, '#9bb0c1'],
    [0.47, '#e7c6ad'],
    [0.53, '#ecd3c0'],
    [0.75, '#e6e7e6'],
    [1, P.morning],
  ]);
  o += `<rect x="0" y="${nEnd}" width="${W}" height="${ph - nEnd + 2}" fill="url(#a4)"/>`;
  o += fog(W, nEnd - 20, nEnd + (ridgeY - nEnd) * 0.6, ['#2c4d72', '#4f7395', '#7f9ab0', '#a9bccb'], 8, 77);
  o += band(W, ridgeY - 40, ridgeY + 2, P.back, [
    [24, 820, 1.4],
    [9, 260, 0.3],
  ]);
  o += band(W, ridgeY - 14, ridgeY + 2, '#2f5175', [
    [13, 600, 2.9],
    [5, 170, 1.1],
  ]);
  o += waterLines(W, ridgeY + 8, ridgeY + 150, '#fbf3ec', 0.8, 39, 0.5);
  o += gulls(
    [
      [W * 0.7, ridgeY - 120, 8],
      [W * 0.725, ridgeY - 134, 6],
      [W * 0.745, ridgeY - 112, 5],
    ],
    P.ink,
    1.3,
  );

  /* ---- 5 · the pale morning that the figures sit on ---- */
  const z6 = impact.top - 220;
  o += `<rect x="0" y="${ph}" width="${W}" height="${z6 - ph + 2}" fill="${P.morning}"/>`;
  arts.slice(1).forEach((ar, i) => {
    const y = ar.top - 120;
    o += cloud(((i * 0.37 + 0.06) % 0.7) * W, y, W * 0.2, 11, '#ffffff', 0.9);
    o += cloud(((i * 0.29 + 0.55) % 0.8) * W, y + 40, W * 0.15, 9, P.cloud, 0.7);
  });

  /* ---- 6 · the light warms to the cover's dusk; the city again (Contact) ---- */
  const riverH = 160;
  const gy = H - riverH;
  o += vgrad('a6', z6, gy, [
    [0, P.morning],
    [f((contact.top - z6) / (gy - z6) * 0.6), '#f1e4da'],
    [f((contact.top - z6) / (gy - z6)), '#f3d6bd'],
    [1, P.coral],
  ]);
  o += `<rect x="0" y="${z6}" width="${W}" height="${gy - z6 + 2}" fill="url(#a6)"/>`;
  [
    [0.05, contact.top + 180, 0.24, 13, P.cloud],
    [0.6, contact.top + 110, 0.2, 11, P.cloud],
    [0.7, gy - 330, 0.15, 10, P.cloud2],
    [0.16, gy - 270, 0.18, 10, P.cloud2],
  ].forEach(([fx, y, fw, h, c]) => {
    o += cloud(fx * W, y, fw * W, h, c);
  });
  o += closingCity(W, gy, riverH);
  return o;
};
