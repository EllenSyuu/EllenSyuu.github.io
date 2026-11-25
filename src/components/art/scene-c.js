/*
 * C · Immersive Scientific Atlas — the river on the cover is the St. Lawrence, and below the
 * cover it keeps flowing: down the whole page as a strip map along its course, from Montréal
 * past Lac Saint-Pierre, Trois-Rivières and Québec to the estuary at Tadoussac. Drawn the way
 * old charts were: water-lined shores, a light graticule, place names in small capitals, the
 * six rain gauges of the thesis marked where they stand. The chapters are read on its banks.
 * Geography: Natural Earth 10 m (public domain), straightened along a centre line of the
 * river (a ribbon map); local scale is kept, the bends are unrolled.
 */
import GEO from './atlas-geo.json';
import { P, f, waterLines } from './kit';

const LAND = '#eef0ee';
const WATER = '#cbdae5';
const SANS = 'Inter Variable, Inter, system-ui, sans-serif';

export const sceneC = ({ W, H, a }) => {
  const top = 130;
  const s = (H - top - 220) / GEO.L;
  const cx = W < 700 ? W * 0.62 : W * 0.7;
  const X = x => cx + x * s;
  const Y = y => top + y * s;
  const pt = ([x, y]) => `${f(X(x))} ${f(Y(y))}`;
  const line = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`).join('');
  const ring = pts => `${line(pts)}Z`;
  let o = '';

  o += `<rect width="${W}" height="${H}" fill="${LAND}"/>`;
  // halo: the map recedes under the text, as labels are haloed on a chart
  const narrow = W < 700;
  const halos = (narrow ? [] : a.text || [])
    .map(([x, y, w, h]) => `<rect x="${x - 20}" y="${y - 16}" width="${w + 40}" height="${h + 32}" rx="40"/>`)
    .join('');
  o += `<defs><filter id="hblur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="22"/></filter>
    <linearGradient id="ctop" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".3" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="criver" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${P.ink}"/><stop offset=".35" stop-color="${P.river}"/><stop offset=".7" stop-color="#9fb6c8"/><stop offset="1" stop-color="${WATER}"/></linearGradient>
    <mask id="cmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>
      <rect width="${W}" height="420" fill="url(#ctop)"/><g fill="#000" fill-opacity=".62" filter="url(#hblur)">${halos}</g></mask></defs>`;
  o += `<rect width="${W}" height="420" fill="url(#criver)"/>`;
  o += `<g mask="url(#cmask)"${narrow ? ' opacity=".55"' : ''}>`;
  o += `<rect width="${W}" height="${H}" fill="${WATER}"/>`;
  o += `<g>`;

  // water-lining: the shore repeated into the water, fading outwards
  const wlOp = [0.7, 0.52, 0.38, 0.26, 0.16];
  GEO.wl.forEach((lv, i) => {
    o += `<path d="${lv.map(line).join('')}" fill="none" stroke="${P.river}" stroke-width="0.9" opacity="${wlOp[i]}"/>`;
  });

  // land, with the shore inked
  const land = GEO.land.map(poly => poly.map(ring).join('')).join('');
  o += `<path d="${land}" fill="${LAND}" fill-rule="evenodd" stroke="${P.ink}" stroke-width="0.9" stroke-opacity=".55"/>`;
  o += `</g>`;

  // tributaries
  o += `<path d="${GEO.rivers.map(line).join('')}" fill="none" stroke="${P.hill}" stroke-width="1" opacity=".7"/>`;

  // graticule, very light, labelled at the margins
  let g = '';
  let labels = '';
  GEO.grat.forEach(gr => {
    gr.pts.forEach(l => {
      g += line(l);
    });
    const all = gr.pts.flat();
    if (!all.length) return;
    // label where the line meets the left margin (or its first visible point)
    let best = null;
    all.forEach(([x, y]) => {
      const px = X(x);
      if (px >= 14 && px <= 60 && (!best || Math.abs(px - 30) < Math.abs(X(best[0]) - 30))) best = [x, y];
    });
    if (best) {
      const v = gr.k === 'lon' ? `${Math.abs(gr.v)}°W` : `${gr.v.toFixed(gr.v % 1 ? 1 : 0)}°N`;
      labels += `<text x="${f(X(best[0]))}" y="${f(Y(best[1]) - 4)}" fill="${P.hill}" font-family="${SANS}" font-size="10" letter-spacing="1">${v}</text>`;
    }
  });
  o += `<path d="${g}" fill="none" stroke="${P.ink}" stroke-width=".6" opacity=".1"/>` + labels;

  // places
  GEO.places.forEach(p => {
    const x = X(p.x);
    const y = Y(p.y);
    if (x < -40 || x > W + 40) return;
    const name = p.n.toUpperCase();
    const halo = `paint-order="stroke" stroke="${LAND}" stroke-width="3" stroke-linejoin="round"`;
    if (p.k === 'city') {
      o += `<rect x="${f(x - 3.5)}" y="${f(y - 3.5)}" width="7" height="7" fill="${P.ink}"/>`;
      o += `<text x="${f(x + 10)}" y="${f(y + 4)}" fill="${P.ink}" font-family="${SANS}" font-size="11" font-weight="600" letter-spacing="2" ${halo}>${name}</text>`;
    } else if (p.k === 'town') {
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="#fff" stroke="${P.ink}" stroke-width="1.1"/>`;
      o += `<text x="${f(x + 8)}" y="${f(y + 4)}" fill="${P.ink}" font-family="${SANS}" font-size="10" letter-spacing="1.5" ${halo}>${name}</text>`;
    } else if (p.k === 'station') {
      o += `<path d="M${f(x)} ${f(y - 5)}l4.6 8h-9.2Z" fill="${P.vermilion}"/>`;
      o += `<text x="${f(x + 8)}" y="${f(y + 3)}" fill="${P.vermilionText || '#a3331a'}" font-family="${SANS}" font-size="9.5" letter-spacing="1.2" ${halo}>${name}</text>`;
    } else {
      o += `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" fill="${P.river}" font-family="${SANS}" font-size="10" letter-spacing="3" paint-order="stroke" stroke="${WATER}" stroke-width="3">${name}</text>`;
    }
  });

  o += `</g>`;
  // the river opens to the estuary: the map fades into open water at the foot of the page
  const yEnd = Y(GEO.L) - 260;
  o += `<defs><linearGradient id="csea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${WATER}" stop-opacity="0"/><stop offset=".55" stop-color="${WATER}"/><stop offset="1" stop-color="#b9ccda"/></linearGradient></defs>`;
  o += `<rect x="0" y="${f(yEnd)}" width="${W}" height="${f(H - yEnd)}" fill="url(#csea)"/>`;
  o += waterLines(W, yEnd + 200, H, '#f4f7f9', 0.7, 51, 0.6);

  // sheet furniture: scale bar and title, in the right margin near the top
  const km = 10;
  const len = km * s;
  const sx = W - 40 - len;
  const sy = a.about && a.jobsHead ? (a.about.bottom + a.jobsHead.top) / 2 - 20 : 420;
  o += `<g font-family="${SANS}" fill="${P.ink}"><path d="M${f(sx)} ${sy}h${f(len)}M${f(sx)} ${sy - 4}v4M${f(sx + len)} ${sy - 4}v4M${f(sx + len / 2)} ${sy - 3}v3" stroke="${P.ink}" stroke-width="1"/>
    <text x="${f(sx + len)}" y="${sy + 16}" text-anchor="end" font-size="10" letter-spacing="1.5">${km} KM</text>
    <text x="${f(W - 40)}" y="${sy + 34}" text-anchor="end" font-size="10" letter-spacing="1.5" fill="${P.hill}">THE ST. LAWRENCE, MONTRÉAL TO TADOUSSAC</text>
    <text x="${f(W - 40)}" y="${sy + 49}" text-anchor="end" font-size="10" letter-spacing="1.5" fill="${P.hill}">RIBBON MAP ALONG THE RIVER · NATURAL EARTH</text></g>`;
  return o;
};
