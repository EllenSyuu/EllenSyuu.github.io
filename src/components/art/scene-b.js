/*
 * B · Editorial Art Canvas — one sheet of printmaking paper under the whole page. The cover is
 * treated as the print it is: below it, details of the same print are pulled again at large
 * scale and overprinted (multiply), slightly out of register, across the joins between
 * chapters — the river's edge torn off the cover, Mont Royal and its cross, the river
 * swinging across the page, the bridge's gold truss, the Old Port's silos and clock tower,
 * the ferry. Text keeps to clean paper; the prints live in the margins and the joins.
 */
import { P, rng, f, cloud, gulls, band, waterLines, coverMap } from './kit';

const get = (a, k, d) => (a[k] ? a[k] : d);
const PAPER = '#edf0f2';

/* A deckled (torn) edge from x0 to x1 around y. */
const deckle = (x0, x1, y, amp, seed) => {
  const R = rng(seed);
  const dir = x1 >= x0 ? 1 : -1;
  let d = '';
  for (let x = x0; dir > 0 ? x <= x1 : x >= x1; x += dir * (6 + R() * 10))
    d += `L${f(x)} ${f(y + (R() - 0.5) * amp + Math.sin(x / 90) * amp * 0.6)}`;
  d += `L${f(x1)} ${f(y)}`;
  return d;
};

/* The river swinging across the page: a ribbon between two soft curves. */
const ribbon = (pts, colour, op = 1, mode = 'multiply') => {
  // pts: [x, y, halfWidth]
  const L = [];
  const Rt = [];
  pts.forEach(([x, y, w]) => {
    L.push([x - w, y]);
    Rt.push([x + w, y]);
  });
  const curve = arr => {
    let d = `M${f(arr[0][0])} ${f(arr[0][1])}`;
    for (let i = 1; i < arr.length; i++) {
      const [x0, y0] = arr[i - 1];
      const [x1, y1] = arr[i];
      const my = (y0 + y1) / 2;
      d += `C${f(x0)} ${f(my)} ${f(x1)} ${f(my)} ${f(x1)} ${f(y1)}`;
    }
    return d;
  };
  const back = Rt.slice().reverse();
  let d = curve(L);
  d += `L${f(back[0][0])} ${f(back[0][1])}`;
  for (let i = 1; i < back.length; i++) {
    const [x0, y0] = back[i - 1];
    const [x1, y1] = back[i];
    const my = (y0 + y1) / 2;
    d += `C${f(x0)} ${f(my)} ${f(x1)} ${f(my)} ${f(x1)} ${f(y1)}`;
  }
  d += 'Z';
  return `<path d="${d}" fill="${colour}" opacity="${op}" style="mix-blend-mode:${mode}"/>`;
};

/* Mont Royal, as on the cover, at any scale; with its cross. */
const mountain = (ox, oy, s, colour, fill = null, xmax = 99999) => {
  const pt = (x, y) => `${f(ox + (x - 640) * s)} ${f(oy + (y - 742) * s)}`;
  const ext = `L${f(Math.max(ox + 800 * s, xmax))} ${f(oy + (600 - 742) * s)}L${f(Math.max(ox + 800 * s, xmax))} ${f(oy)}`;
  const d = `M${pt(640, 742)}C${pt(740, 716)} ${pt(800, 668)} ${pt(870, 624)}C${pt(912, 598)} ${pt(944, 568)} ${pt(
    990,
    556,
  )}C${pt(1030, 545)} ${pt(1056, 560)} ${pt(1090, 540)}C${pt(1124, 520)} ${pt(1150, 498)} ${pt(1190, 496)}C${pt(
    1232,
    494,
  )} ${pt(1256, 520)} ${pt(1290, 530)}C${pt(1330, 542)} ${pt(1352, 536)} ${pt(1380, 556)}C${pt(1404, 573)} ${pt(
    1424,
    590,
  )} ${pt(1440, 600)}${ext}Z`;
  const cx = ox + (1190 - 640) * s;
  const cy = oy + (496 - 742) * s;
  return {
    shape: `<path d="${d}" fill="${fill || colour}" style="mix-blend-mode:multiply"/>`,
    cross: `<path d="M${f(cx)} ${f(cy)}v${f(-38 * s)}M${f(cx - 11 * s)} ${f(cy - 26 * s)}h${f(22 * s)}" stroke="${P.gold}" stroke-width="${f(
      2.6 * s,
    )}"/>`,
  };
};

/* The Jacques-Cartier truss in gold, across the page, with its arch. */
const truss = (W, y, s, archX) => {
  let d = `M0 ${f(y + 16 * s)}H${W}M0 ${f(y)}H${W}`;
  for (let x = -8 * s; x < W; x += 16 * s) d += `M${f(x)} ${f(y + 16 * s)}l${f(8 * s)} ${f(-16 * s)}l${f(8 * s)} ${f(16 * s)}`;
  const a0 = archX - 120 * s;
  const a1 = archX + 120 * s;
  d += `M${f(a0)} ${f(y)}Q${f(archX)} ${f(y - 96 * s)} ${f(a1)} ${f(y)}`;
  for (let x = a0 + 16 * s; x < a1; x += 16 * s) {
    const t = (x - a0) / (a1 - a0);
    d += `M${f(x)} ${f(y - 4 * 48 * s * t * (1 - t))}V${f(y)}`;
  }
  let piers = '';
  [0.18, 0.42, 0.66, 0.9].forEach(fx => {
    piers += `M${f(fx * W)} ${f(y + 16 * s)}v${f(54 * s)}`;
  });
  return `<path d="${d}" stroke="${P.gold}" stroke-width="${f(1.5 * Math.max(1, s * 0.7))}" fill="none"/><path d="${piers}" stroke="${P.gold}" stroke-width="${f(
    2.4 * s,
  )}"/>`;
};

/* The Old Port: grain silos and sheds, with lit windows. */
const silos = (x0, ground, s, colour) => {
  let d = '';
  for (let i = 0; i < 9; i++) d += `M${f(x0 + i * 17 * s)} ${f(ground)}V${f(ground - 56 * s)}a${f(8.5 * s)} ${f(8.5 * s)} 0 0 1 ${f(17 * s)} 0V${f(ground)}Z`;
  d += `M${f(x0 + 153 * s)} ${f(ground)}V${f(ground - 78 * s)}h${f(34 * s)}V${f(ground)}Z`;
  d += `M${f(x0 + 187 * s)} ${f(ground)}V${f(ground - 42 * s)}h${f(70 * s)}V${f(ground)}Z`;
  let lit = '';
  for (let i = 0; i < 6; i++) lit += `M${f(x0 + (196 + i * 10) * s)} ${f(ground - 28 * s)}h${f(5 * s)}`;
  return `<path d="${d}" fill="${colour}"/><path d="${lit}" stroke="${P.gold}" stroke-width="${f(2 * s)}"/>`;
};

const clockTower = (x, ground, s, colour) => {
  const d = `M${f(x)} ${f(ground)}V${f(ground - 78 * s)}h${f(-3 * s)}v${f(-6 * s)}h${f(3 * s)}V${f(ground - 102 * s)}h${f(3 * s)}l${f(
    5 * s,
  )} ${f(-12 * s)}l${f(5 * s)} ${f(12 * s)}h${f(3 * s)}v${f(18 * s)}h${f(3 * s)}v${f(6 * s)}h${f(-3 * s)}V${f(ground)}Z`;
  return `<path d="${d}" fill="${colour}"/><circle cx="${f(x + 8 * s)}" cy="${f(ground - 92 * s)}" r="${f(3.2 * s)}" fill="${P.gold}"/>`;
};

/* A line-screen: horizontal bars that thin out from full to nothing, the way a print fades a
   tone without a gradient. */
const lineScreen = (W, y0, y1, colour, invert = false, pitch = 6) => {
  let d = '';
  const n = Math.floor((y1 - y0) / pitch);
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1);
    const q = invert ? p : 1 - p;
    const t = pitch * Math.pow(q, 1.25);
    if (t > 0.25) d += `M0 ${f(y0 + i * pitch)}h${W}v${f(t)}h${-W}Z`;
  }
  return `<path d="${d}" fill="${colour}"/>`;
};

const HATCH = `<defs>
  <pattern id="hb" width="8" height="5" patternUnits="userSpaceOnUse"><path d="M0 1h8" stroke="${P.river}" stroke-width="1.3"/></pattern>
  <pattern id="hi" width="8" height="4" patternUnits="userSpaceOnUse"><path d="M0 1h8" stroke="${P.ink}" stroke-width="1.1"/></pattern>
  <pattern id="hw" width="10" height="6" patternUnits="userSpaceOnUse"><path d="M0 1h10" stroke="#f7f9fa" stroke-width="1"/></pattern>
</defs>`;

export const sceneB = ({ W, H, a }) => {
  const aboutHead = get(a, 'aboutHead', { top: 150, bottom: 700 });
  const aboutGrid = get(a, 'aboutGrid', { top: 800, bottom: 1700 });
  const jobsHead = get(a, 'jobsHead', { top: 2000, bottom: 2300 });
  const jobs = get(a, 'jobs', { top: 1800, bottom: 4600 });
  const focus = get(a, 'focus', { top: 4600, bottom: 6000 });
  const focusList = get(a, 'focusList', { top: 5000, bottom: 6000 });
  const projectsHead = get(a, 'projectsHead', { top: 6200, bottom: 6500 });
  const more = get(a, 'more', { top: H - 4600, bottom: H - 3000 });
  const impact = get(a, 'impact', { top: H - 3000, bottom: H - 1300 });
  const contact = get(a, 'contact', { top: H - 1300, bottom: H - 150 });
  const arts = a.articles || [];
  const cm = coverMap(W);
  const sc = Math.max(0.6, W / 1440);
  let o = '';

  o += `<rect width="${W}" height="${H}" fill="${PAPER}"/>` + HATCH;

  /* 1 · the cover's river runs off the page as a line-screen: ink bars thinning into paper */
  const t0 = Math.min(240, aboutHead.top - 40);
  o += `<rect x="0" y="0" width="${W}" height="20" fill="${P.ink}"/>`;
  o += lineScreen(W, 20, t0, P.ink);
  o += waterLines(W, 0, 40, P.cream, 0.35, 3, 1);

  /* 2 · Mont Royal, large and cropped at the right, printed twice: a pale tint, then the same
        shape in an etched line-screen of river blue, out of register */
  const mS = Math.max(1.1, (W / 1440) * 2.0);
  const mGround = aboutGrid.top - 40;
  const mx = W - (1190 - 640) * mS + 160 * sc;
  o += mountain(mx, mGround, mS, '#d4dee6', null, W + 20).shape;
  const m = mountain(mx + 14 * sc, mGround + 10 * sc, mS, '', 'url(#hb)', W + 20);
  o += m.shape.replace('mix-blend-mode:multiply', 'mix-blend-mode:multiply;opacity:.55') + m.cross;

  /* 3 · About → Experience: a strip of river, etched, with gulls over it */
  const r0 = aboutGrid.bottom + 40;
  const r1 = jobsHead.top - 40;
  const rm = (r0 + r1) / 2;
  o += band(W, rm - 26 * sc, rm + 30 * sc, '#cfdbe4', [
    [5, 900, 1],
    [2, 240, 2],
  ]);
  o += band(W, rm - 22 * sc, rm + 30 * sc, 'url(#hw)', [
    [5, 900, 1],
    [2, 240, 2],
  ]);
  o += `<path d="M0 ${f(rm - 26 * sc)}H${W}" stroke="${P.ink}" stroke-width=".8" opacity=".5"/>`;
  o += gulls(
    [
      [W * 0.12, rm - 52 * sc, 9],
      [W * 0.145, rm - 66 * sc, 7],
      [W * 0.17, rm - 48 * sc, 6],
    ],
    P.ink,
    1.4,
  );

  /* 4 · the bridge across the join of Experience and What I do */
  const by = jobs.bottom + (focus.top + 160 - jobs.bottom) * 0.5 + 40;
  o += `<rect x="0" y="${f(by + 16 * 1.6 * sc)}" width="${W}" height="${f(110 * sc)}" fill="#d4dee6"/>`;
  o += `<rect x="0" y="${f(by + 16 * 1.6 * sc + 6)}" width="${W}" height="${f(104 * sc)}" fill="url(#hw)"/>`;
  o += lineScreen(W, by + 16 * 1.6 * sc + 110 * sc, by + 16 * 1.6 * sc + 200 * sc, '#d4dee6');
  o += truss(W, by, 1.6 * sc, W * 0.7);
  o += cloud(W * 0.06, by - 130 * sc, W * 0.2, 13, P.cloud, 0.95);

  /* 5 · the Old Port at the join of What I do and Selected work */
  const g5 = projectsHead.top - 80;
  const s5 = 1.6 * sc;
  o += `<g opacity=".92">${silos(-30 * sc, g5, s5, P.back)}</g>`;
  o += `<g transform="translate(${f(8 * sc)} ${f(6 * sc)})" opacity=".5">${silos(-30 * sc, g5, s5, 'url(#hb)')}</g>`;
  o += clockTower(W * 0.86, g5, s5, P.back);
  o += `<rect x="0" y="${f(g5)}" width="${W}" height="${f(44 * sc)}" fill="#d4dee6"/>`;
  o += `<rect x="0" y="${f(g5 + 4)}" width="${W}" height="${f(40 * sc)}" fill="url(#hw)"/>`;
  o += lineScreen(W, g5 + 44 * sc, g5 + 110 * sc, '#d4dee6');
  o += `<path d="M0 ${f(g5 + 0.5)}H${W}" stroke="${P.ink}" stroke-width="1"/>`;

  /* 6 · between the four studies: only gulls crossing the joins */
  arts.slice(1).forEach((ar, i) => {
    const y = ar.top - 90;
    const x = (i % 2 ? 0.78 : 0.2) * W;
    o += gulls(
      [
        [x, y, 7],
        [x + 22, y - 12, 5],
      ],
      P.ink,
      1.2,
    );
  });

  /* 7 · the clock tower, etched and very large, crossing from Other projects into Beyond the code */
  const g7 = impact.top + 110;
  o += `<g opacity=".35">${clockTower(W * 0.07, g7, 3.4 * sc, 'url(#hb)')}</g>`;

  /* 8 · the river again at the foot of the page, rising as a line-screen; the ferry; the
        colophon sits on the water */
  const gy = H - 170;
  o += mountain(-W * 0.04, gy - 60, 0.9 * sc, '#d4dee6', null, W * 0.55).shape;
  o += mountain(-W * 0.04 + 10, gy - 52, 0.9 * sc, '', 'url(#hb)', W * 0.55).shape.replace(
    'mix-blend-mode:multiply',
    'mix-blend-mode:multiply;opacity:.45',
  );
  o += lineScreen(W, gy - 110, gy, P.ink, true);
  o += `<rect x="0" y="${gy}" width="${W}" height="170" fill="${P.ink}"/>`;
  o += waterLines(W, gy + 14, H, P.cream, 0.35, 25, 1);
  const fx = W * 0.62;
  const fy = gy - 60;
  const fs = 1.4 * sc;
  o += `<g transform="translate(${f(fx)} ${f(fy)}) scale(${f(fs)})"><path d="M0 0h96l-10 12h-78Z" fill="${P.navy}"/><path d="M20 0v-9h52v9Z M34 -9v-6h22v6Z" fill="${P.cream}"/><path d="M26 -5h4m6 0h4m6 0h4m6 0h4m6 0h4" stroke="${P.gold}" stroke-width="2"/><path d="M45 -15v-12" stroke="${P.navy}" stroke-width="1.4"/></g>`;
  o += cloud(W * 0.62, contact.top + 120, W * 0.18, 12, P.cloud, 0.9);

  return o;
};
