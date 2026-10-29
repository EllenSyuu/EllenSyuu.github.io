import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Scene, useScene, useCountUp, drawCss, drawClass, delay as d, INK, GRAPH, FAINT, PAPER, FACE, ORANGE, AMBER, RUST, SERIF, HAND, GREEK } from './kit';

/*
 * covarchimax as an atelier engineering drawing.
 * Southern Québec is cut out as an axonometric terrain block — fine-line relief, a section
 * on its faces, construction lines running past the corners, dimensioned edges. Stations are
 * survey pins with hand-lettered names; dependence arcs leap between them (weight ∝ λU).
 * Clouds are inked stroke by stroke, then washed in warm watercolour. Same data as
 * quebec-scene.js.
 */

const SEASONS = [
  { key: 'AM', label: 'Apr–May', fr: 'Avril – mai', eta: 4.028, ci: [3.712, 4.56], pre: 20.62, post: 21.59, diff: 0.96, p: 'p = 0.10', line: 'Spring melt storms: extremes often arrive together.' },
  { key: 'JJ', label: 'Jun–Jul', fr: 'Juin – juillet', eta: 5.73, ci: [5.229, 6.0], pre: 26.98, post: 27.25, diff: 0.26, p: 'p = 0.75', line: 'Summer downpours are local: close to independent.' },
  { key: 'AS', label: 'Aug–Sep', fr: 'Août – septembre', eta: 4.116, ci: [3.722, 4.729], pre: 28.47, post: 31.42, diff: 2.95, p: 'p = 0.005', line: 'Late-summer systems: heavier, and shared again.' },
  { key: 'ON', label: 'Oct–Nov', fr: 'Octobre – novembre', eta: 3.896, ci: [3.602, 4.327], pre: 22.42, post: 25.57, diff: 3.15, p: 'p < 0.001', line: 'Autumn storms: the most likely to strike together.' },
];

const LAMBDA = {
  AM: [[0, 1, 0.374], [0, 2, 0.232], [0, 3, 0.247], [0, 4, 0.187], [0, 5, 0.405], [1, 2, 0.313], [1, 3, 0.323], [1, 4, 0.118], [1, 5, 0.3], [2, 3, 0.253], [2, 4, 0.054], [2, 5, 0.148], [3, 4, 0.093], [3, 5, 0.292], [4, 5, 0.18]],
  JJ: [[0, 1, 0.147], [0, 2, 0.015], [0, 3, 0.064], [0, 4, 0.011], [0, 5, 0.103], [1, 2, 0.015], [1, 3, 0.139], [1, 4, 0.019], [1, 5, 0.148], [2, 3, 0.058], [2, 4, 0], [2, 5, 0.007], [3, 4, 0], [3, 5, 0.11], [4, 5, 0.036]],
  AS: [[0, 1, 0.315], [0, 2, 0.188], [0, 3, 0.167], [0, 4, 0.141], [0, 5, 0.26], [1, 2, 0.326], [1, 3, 0.234], [1, 4, 0.197], [1, 5, 0.283], [2, 3, 0.081], [2, 4, 0.157], [2, 5, 0.099], [3, 4, 0], [3, 5, 0.229], [4, 5, 0.148]],
  ON: [[0, 1, 0.28], [0, 2, 0.285], [0, 3, 0.147], [0, 4, 0.073], [0, 5, 0.426], [1, 2, 0.456], [1, 3, 0.323], [1, 4, 0.019], [1, 5, 0.475], [2, 3, 0.23], [2, 4, 0], [2, 5, 0.275], [3, 4, 0], [3, 5, 0.296], [4, 5, 0.019]],
};


/* ---------- axonometric projection of the block ---------- */
const FL = [420, 334];
const EV = [450, -52]; // west → east
const NV = [50, -130]; // south → north
const T = 54; // block thickness
const P = (e, n, z = 0) => [FL[0] + e * EV[0] + n * NV[0], FL[1] + e * EV[1] + n * NV[1] - z];
const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
const poly = arr => arr.map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`).join(' ');
const clamp = t => Math.max(0, Math.min(1, t));
const smooth = t => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};

// The St. Lawrence in (east, north) block coordinates, SW → NE.
const RIVER = [[-0.02, 0.07], [0.138, 0.22], [0.277, 0.4], [0.432, 0.65], [0.554, 0.78], [0.652, 0.84], [0.83, 0.93], [1.02, 0.99]];
const catmull = (pts, steps = 10) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const RIVER_FINE = catmull(RIVER, 12);
const riverDist = (e, n) => {
  let d = 9;
  for (let i = 0; i < RIVER_FINE.length; i += 2) d = Math.min(d, Math.hypot(e - RIVER_FINE[i][0], n - RIVER_FINE[i][1]));
  return d;
};

// Relief: Laurentians to the north, Appalachians to the south-east, a valley along the river.
const Z = (e, n) => {
  const lau = 30 * smooth((n - 0.64) / 0.36) * (0.62 + 0.38 * Math.sin(e * 9 + 1));
  const app = 27 * Math.exp(-((e - 0.86) ** 2 / 0.025 + (n - 0.14) ** 2 / 0.03)) + 15 * Math.exp(-((e - 0.6) ** 2 / 0.02 + (n - 0.04) ** 2 / 0.02));
  const tex = 2.2 + 1.8 * Math.sin(e * 23) * Math.sin(n * 17);
  return (lau + app + tex) * smooth(riverDist(e, n) / 0.14);
};
const PZ = (e, n, lift = 0) => P(e, n, Z(e, n) + lift);

const STATIONS = [
  { name: 'Drummondville', e: 0.68, n: 0.545, dx: 26, dy: 24 },
  { name: 'L’Assomption', e: 0.3, n: 0.51, dx: -12, dy: -8, end: true },
  { name: 'Les Cèdres', e: 0.054, n: 0.17, dx: 12, dy: -14 },
  { name: 'St-Charles', e: 0.33, n: 0.86, dx: -18, dy: -10, end: true },
  { name: 'Lennoxville', e: 0.925, n: 0.17, dx: -8, dy: 50, end: true },
  { name: 'Nicolet', e: 0.62, n: 0.765, dx: 22, dy: -18 },
].map(s => {
  const base = PZ(s.e, s.n);
  return { ...s, base, head: [base[0], base[1] - 20] };
});

const ctrl = (a, b) => {
  const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 24 - d * 0.2];
};
const arc = (a, b) => `M${pt(a)} Q${pt(ctrl(a, b))} ${pt(b)}`;

// Cloud outline: a row of pen bumps climbing to the middle, and a soft underside.
const cloudPath = (cx, cy, w) => {
  const chords = [0.17, 0.23, 0.27, 0.19, 0.14];
  const lift = [0, 12, 22, 17, 7, 0];
  let x = cx - w / 2;
  let d = `M${x.toFixed(1)} ${cy}`;
  chords.forEach((c, i) => {
    const nx = x + c * w;
    const r = Math.hypot(c * w, lift[i + 1] - lift[i]) * 0.56;
    d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${nx.toFixed(1)} ${(cy - lift[i + 1]).toFixed(1)}`;
    x = nx;
  });
  d += ` Q${cx + w * 0.2} ${cy + 7} ${cx} ${cy + 4} T${(cx - w / 2).toFixed(1)} ${cy}`;
  return d;
};

const CLOUDS = [
  { e: 0.36, n: 0.92, h: 130, w: 150 },
  { e: 0.78, n: 0.96, h: 112, w: 120 },
  { e: 0.08, n: 0.9, h: 92, w: 104 },
  { e: 0.6, n: 0.6, h: 170, w: 96 },
];

const TREES = [[0.1, 0.9, 1], [0.19, 0.84, 0.85], [0.47, 0.97, 0.9], [0.9, 0.86, 0.8], [0.78, 0.09, 1.05], [0.97, 0.42, 0.85], [0.98, 0.1, 0.8], [0.4, 0.12, 0.85], [0.07, 0.42, 0.8], [0.6, 0.05, 0.9]];

// A loose pen scribble around a crown.
const scribble = (cx, cy, r, seed) => {
  const pts = [];
  for (let i = 0; i <= 34; i++) {
    const a = (i / 34) * Math.PI * 2.5 + seed;
    const rr = r * (0.82 + 0.18 * Math.sin(i * 1.7 + seed * 3));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.9]);
  }
  return poly(pts);
};

const MAPLE =
  'M0 -1 L.14 -.6 L.34 -.74 L.3 -.42 L.64 -.5 L.54 -.28 L.96 -.12 L.64 .06 L.74 .3 L.4 .22 L.34 .46 L.08 .32 L.04 .98 L-.04 .98 L-.08 .32 L-.34 .46 L-.4 .22 L-.74 .3 L-.64 .06 L-.96 -.12 L-.54 -.28 L-.64 -.5 L-.3 -.42 L-.34 -.74 L-.14 -.6 Z';

/* ---------- motion ---------- */
const drawIn = keyframes`from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }`;
const washIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const rain = keyframes`to { stroke-dashoffset: -30; }`;
const flow = keyframes`to { stroke-dashoffset: -64; }`;
const pulse = keyframes`0% { transform: scale(0.7); opacity: 0.8; } 100% { transform: scale(2.4); opacity: 0; }`;
const bob = keyframes`0%, 100% { transform: translate(-6px, 0); } 50% { transform: translate(6px, -3px); }`;
const fall = keyframes`0% { transform: translate(0, 0) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 100% { transform: translate(-260px, 300px) rotate(400deg); opacity: 0; }`;
const snow = keyframes`0% { transform: translate(0, -4px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(-8px, 60px); opacity: 0; }`;
const sway = keyframes`0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); }`;

const Art = styled.svg`
  /* First view: everything is drawn in, construction first, then ink, then lettering. */
  ${drawCss}

  .link { transition: stroke-width 1.2s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 1.2s ease; }
  .flow { stroke-dasharray: 2 30; animation: ${flow} 2.4s linear infinite; }
  .ring { transform-box: fill-box; transform-origin: center; animation: ${pulse} 3s ease-out infinite; }
  .cloud-float { animation: ${bob} 14s ease-in-out infinite; }
  .pen { stroke-dasharray: 1; animation: ${drawIn} 1.9s cubic-bezier(0.55, 0.05, 0.25, 1) both; }
  .pen.b { animation-delay: 0.5s; animation-duration: 1.4s; }
  .wash { animation: ${washIn} 1.6s ease 1.2s both; }
  .rain line { stroke-dasharray: 8 7; animation: ${rain} 0.75s linear infinite; }
  .rain { animation: ${washIn} 0.8s ease 1.6s both; }
  .flake { animation: ${snow} 4.5s linear infinite; }
  .crown { transform-box: fill-box; transform-origin: 50% 100%; animation: ${sway} 6s ease-in-out infinite; }
  .leaf { animation: ${fall} 12s linear infinite; }
  .leaves > g:nth-child(2) .leaf { animation-delay: -4s; animation-duration: 14s; }
  .leaves > g:nth-child(3) .leaf { animation-delay: -8.5s; animation-duration: 13s; }
`;

const Gauge = ({ eta, ci, run }) => {
  const x = v => 10 + ((v - 1) / 5) * 260;
  const shown = useCountUp(eta, { run });
  const ease = { transition: 'all 1s cubic-bezier(.22,.8,.3,1)' };
  return (
    <div>
      <span className="big">
        {shown}
        <small style={{ marginLeft: 10, fontFamily: HAND, fontSize: 15, fontWeight: 400, color: GRAPH }}>η, from 1 to 6</small>
      </span>
      <svg viewBox="0 0 280 50" width="100%" aria-hidden="true" style={{ marginTop: 2, overflow: 'visible' }}>
        <rect x={x(ci[0])} y="18" width={x(ci[1]) - x(ci[0])} height="12" fill={ORANGE} opacity="0.2" style={ease} />
        <line x1="10" x2="270" y1="30" y2="30" stroke={INK} strokeWidth="0.8" />
        {Array.from({ length: 51 }, (_, i) => 1 + i * 0.1).map((v, i) => (
          <line key={i} x1={x(v)} x2={x(v)} y1="30" y2={i % 10 === 0 ? 37 : i % 5 === 0 ? 34.5 : 32.5} stroke={INK} strokeWidth={i % 10 === 0 ? 0.9 : 0.45} />
        ))}
        {[1, 2, 3, 4, 5, 6].map(v => (
          <text key={v} x={x(v)} y="48" textAnchor="middle" fontSize="11" fill={GRAPH} fontFamily={SERIF} fontWeight="600">{v}</text>
        ))}
        <g style={{ transform: `translateX(${x(eta)}px)`, transition: 'transform 1s cubic-bezier(.22,.8,.3,1)' }}>
          <line x1="0" x2="0" y1="8" y2="30" stroke={ORANGE} strokeWidth="1.2" />
          <path d="M0 4 L3 8 L0 12 L-3 8 Z" fill={ORANGE} />
        </g>
        <text x={x(ci[1]) + 6} y="27" fontSize="12" fill={ORANGE} fontFamily={HAND} style={ease}>90%</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: HAND, fontSize: 14, color: GRAPH, marginTop: 2 }}>
        <span>all together</span>
        <span>independent</span>
      </div>
    </div>
  );
};

const Bars = ({ pre, post, diff, p }) => {
  const h = v => 8 + ((v - 18) / 14) * 44;
  const ease = { transition: 'all 1s cubic-bezier(.22,.8,.3,1)' };
  const top = v => 60 - h(v);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
      <svg viewBox="0 -14 140 92" width="128" aria-hidden="true">
        <defs>
          <pattern id="at-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.55" />
          </pattern>
        </defs>
        <line x1="0" x2="130" y1="60" y2="60" stroke={INK} strokeWidth="0.8" />
        <rect x="12" y={top(pre)} width="40" height={h(pre)} fill="url(#at-hatch)" stroke={INK} strokeWidth="0.7" style={ease} />
        <rect x="74" y={top(post)} width="40" height={h(post)} fill={ORANGE} opacity="0.85" style={ease} />
        <text x="32" y={top(pre) - 5} textAnchor="middle" fontSize="15" fill={INK} fontFamily={SERIF} fontWeight="600" style={ease}>{pre.toFixed(1)}</text>
        <text x="94" y={top(post) - 5} textAnchor="middle" fontSize="15" fill={INK} fontFamily={SERIF} fontWeight="600" style={ease}>{post.toFixed(1)}</text>
        <text x="32" y="76" textAnchor="middle" fontSize="14" fill={GRAPH} fontFamily={HAND}>1930–75</text>
        <text x="94" y="76" textAnchor="middle" fontSize="14" fill={GRAPH} fontFamily={HAND}>1976–2017</text>
      </svg>
      <div>
        <p className="kicker" style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>MONTHLY MAXIMA</p>
        <strong style={{ color: ORANGE, fontFamily: SERIF, fontWeight: 600, fontSize: 26, whiteSpace: 'nowrap', lineHeight: 1.1 }}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(2)} mm
        </strong>
        <div style={{ fontFamily: HAND, fontSize: 14, color: GRAPH }}>after 1975, {p}</div>
      </div>
    </div>
  );
};

const QuebecScene = () => {
  const scene = useScene();
  const [idx, setIdx] = useState(3);
  const [manual, setManual] = useState(false);
  const s = SEASONS[idx];

  useEffect(() => {
    if (!scene.live || manual) return undefined;
    const id = setInterval(() => setIdx(i => (i + 1) % SEASONS.length), 6000);
    return () => clearInterval(id);
  }, [scene.live, manual]);

  const geo = useMemo(() => {
    const top = {
      back: Array.from({ length: 51 }, (_, i) => PZ(i / 50, 1)),
      right: Array.from({ length: 51 }, (_, i) => PZ(1, 1 - i / 50)),
      front: Array.from({ length: 51 }, (_, i) => PZ(1 - i / 50, 0)),
      left: Array.from({ length: 51 }, (_, i) => PZ(0, i / 50)),
    };
    const mesh = Array.from({ length: 25 }, (_, k) => {
      const n = 0.98 - k * 0.04;
      return poly(Array.from({ length: 81 }, (_, i) => PZ(i / 80, n)));
    });
    const down = ([x, y]) => [x, y + T];
    const fl0 = P(0, 0);
    const fr0 = P(1, 0);
    const br0 = P(1, 1);
    const frontFace = `${poly(top.front.slice().reverse())} L${pt(down(fr0))} L${pt(down(fl0))} Z`;
    const rightFace = `${poly(top.right.slice().reverse())} L${pt(down(br0))} L${pt(down(fr0))} Z`;
    const strataF = [0.3, 0.52, 0.72, 0.88].map((f, k) => poly(Array.from({ length: 41 }, (_, i) => {
      const e = i / 40;
      const [x, y] = P(e, 0);
      return [x, y + T * f + 2.2 * Math.sin(e * 11 + k * 1.3) - Z(e, 0) * (1 - f) * 0.5];
    })));
    const strataR = [0.3, 0.52, 0.72, 0.88].map((f, k) => poly(Array.from({ length: 41 }, (_, i) => {
      const n = i / 40;
      const [x, y] = P(1, n);
      return [x, y + T * f + 2 * Math.sin(n * 9 + k)];
    })));
    // River banks and water lines.
    const bank = off => RIVER_FINE.filter(([e]) => e >= 0 && e <= 1).map(([e, n]) => P(e, n + off, 0));
    const north = bank(0.024);
    const south = bank(-0.024);
    const channel = `${poly(north)} L${pt(south[south.length - 1])} ${poly(south.slice().reverse()).replace(/^M/, 'L')} Z`;
    const label = poly(bank(0.06));
    return { top, mesh, frontFace, rightFace, strataF, strataR, north: poly(north), south: poly(south), mid1: poly(bank(0.008)), mid2: poly(bank(-0.01)), channel, label, fl0, fr0, br0, bl0: P(0, 1) };
  }, []);

  const wet = clamp((s.post - 20) / 12);
  const isSnow = s.key === 'AM';
  const nClouds = 1 + Math.round(wet * 3);
  const washTone = wet > 0.7 ? '#d8763f' : wet > 0.4 ? '#e8995d' : '#f0bd86';
  const gap = Math.round(14 - wet * 8);
  const lam = LAMBDA[s.key];
  const [mi, mj, ml] = lam.reduce((a, b) => (b[2] > a[2] ? b : a));
  const A = STATIONS[mi].head;
  const B = STATIONS[mj].head;
  const cls = drawClass(scene);

  const { fl0, fr0, br0, bl0 } = geo;
  const ext = (a, b, k = 18) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / L;
    const uy = (b[1] - a[1]) / L;
    return `M${pt([a[0] - ux * k, a[1] - uy * k])} L${pt([b[0] + ux * k, b[1] + uy * k])}`;
  };
  const dn = ([x, y], k = T) => [x, y + k];

  // Dimension lines, offset outward from the bottom edges.
  const dim = (a, b, off) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = (b[1] - a[1]) / L;
    const ny = -(b[0] - a[0]) / L;
    const sgn = off;
    const A2 = [a[0] + nx * sgn, a[1] + ny * sgn];
    const B2 = [b[0] + nx * sgn, b[1] + ny * sgn];
    const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    return { A2, B2, ang, mid: [(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2], nx, ny };
  };
  const dimF = dim(dn(fl0), dn(fr0), -26);
  const dimR = dim(dn(fr0), dn(br0), -24);
  const tick = ([x, y]) => `M${x - 4} ${y + 4} L${x + 4} ${y - 4}`;

  const card = (
    <div className="card" style={{ left: 18, top: 18 }}>
      <p className="tabs-hint"><i /> {manual ? s.fr : 'choose a season'}</p>
      <div className="tabs" role="group" aria-label="Season">
        {SEASONS.map((x, i) => (
          <button key={x.key} type="button" aria-pressed={i === idx} onClick={() => { setManual(true); setIdx(i); }}>
            {x.label}
            {i === idx && !manual && scene.live && <span key={idx} className="bar" style={{ '--cycle': '6s' }} />}
          </button>
        ))}
      </div>
      <p className="kicker" style={{ marginTop: 12 }}>EXTREMAL COEFFICIENT · 6 STATIONS</p>
      <Gauge eta={s.eta} ci={s.ci} run={scene.live} />
      <p className="note" style={{ minHeight: 38, marginTop: 6 }}>{s.line}</p>
      <Bars pre={s.pre} post={s.post} diff={s.diff} p={s.p} />
    </div>
  );

  return (
      <Scene
        scene={scene}
        card={card}
        label="Axonometric engineering drawing of southern Québec as a terrain block: six survey-pin stations with hand-lettered names, arcs between them whose weight shows how often their rainfall extremes coincide, and inked clouds washed in warm watercolour."
        caption={<>Planche II — the St. Lawrence lowlands as a cut terrain block. Arc weight = how often two stations’ extremes coincide (λ<sub>U</sub>); clouds and rain = how heavy the season’s monthly maxima are.</>}>
        <Art className={cls} viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id="at-wash" x="-30%" y="-40%" width="160%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="11" result="d" />
              <feGaussianBlur in="d" stdDeviation="1.1" />
            </filter>
            <filter id="at-wash-s" x="-40%" y="-40%" width="180%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="2" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
            </filter>
            <pattern id="at-rock" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
              <line x1="0" y1="0" x2="0" y2="5" stroke={GRAPH} strokeWidth="0.45" />
            </pattern>
            <clipPath id="at-front"><path d={geo.frontFace} /></clipPath>
            <clipPath id="at-right"><path d={geo.rightFace} /></clipPath>
            <path id="at-riverlabel" d={geo.label} />
          </defs>

          <rect width="960" height="540" fill={PAPER} />

          {/* Construction: long axis guides and the z = 0 datum, overshooting every corner. */}
          <g fill="none" stroke={FAINT} strokeWidth="0.5">
            <path className="ink" pathLength="1" style={d(0)} d={ext(dn(fl0), dn(fr0), 240)} opacity="0.55" />
            <path className="ink" pathLength="1" style={d(0.1)} d={ext(dn(fr0), dn(br0), 90)} opacity="0.55" />
            <path className="ink" pathLength="1" style={d(0.2)} d={ext(fl0, fr0)} />
            <path className="ink" pathLength="1" style={d(0.25)} d={ext(fr0, br0)} />
            <path className="ink" pathLength="1" style={d(0.3)} d={ext(br0, bl0)} strokeDasharray="1" />
            <path className="ink" pathLength="1" style={d(0.35)} d={ext(bl0, fl0)} />
            {[fl0, fr0, br0].map((c, i) => (
              <path key={i} className="ink" pathLength="1" style={d(0.4 + i * 0.05)} d={ext(c, dn(c), 16)} />
            ))}
          </g>

          {/* Faces of the block: section with strata and bedrock hatching. */}
          <g className="fade" style={d(0.6)}>
            <path d={geo.frontFace} fill={FACE} />
            <path d={geo.rightFace} fill="#e6dcca" />
            <path d={geo.frontFace} fill="url(#at-rock)" opacity="0.35" />
            <path d={geo.rightFace} fill="url(#at-rock)" opacity="0.45" />
          </g>
          <g fill="none" stroke={GRAPH} strokeWidth="0.55">
            <g clipPath="url(#at-front)">
              {geo.strataF.map((p, i) => <path key={i} className="ink" pathLength="1" style={d(0.9 + i * 0.12)} d={p} />)}
            </g>
            <g clipPath="url(#at-right)">
              {geo.strataR.map((p, i) => <path key={i} className="ink" pathLength="1" style={d(1 + i * 0.12)} d={p} />)}
            </g>
          </g>

          {/* Relief: fine east–west ridgelines, inked back to front. */}
          <g fill="none" stroke={GRAPH} strokeWidth="0.5" strokeLinecap="round">
            {geo.mesh.map((p, i) => <path key={i} className="ink" pathLength="1" style={d(0.5 + i * 0.05)} d={p} opacity={0.55 + (i / geo.mesh.length) * 0.35} />)}
          </g>

          {/* The St. Lawrence. */}
          <path className="fade" style={d(1.6)} d={geo.channel} fill={PAPER} />
          <g fill="none" strokeLinecap="round">
            <path className="ink" pathLength="1" style={d(1.7)} d={geo.north} stroke={INK} strokeWidth="1" />
            <path className="ink" pathLength="1" style={d(1.8)} d={geo.south} stroke={INK} strokeWidth="1" />
            <path className="ink" pathLength="1" style={d(2)} d={geo.mid1} stroke={GRAPH} strokeWidth="0.45" strokeDasharray="1" />
            <path className="fade" style={d(2.2)} d={geo.mid2} stroke={GRAPH} strokeWidth="0.45" strokeDasharray="10 7" />
          </g>
          <text className="write" style={d(3.2)} fontFamily={HAND} fontSize="15" fill={INK}>
            <textPath href="#at-riverlabel" startOffset="34%">Fleuve Saint-Laurent</textPath>
          </text>

          {/* Block outline, retraced once like a pen. */}
          <g fill="none" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
            {['back', 'right', 'front', 'left'].map((k, i) => (
              <path key={k} className="ink" pathLength="1" style={d(0.3 + i * 0.15)} d={poly(geo.top[k])} strokeWidth="1.3" />
            ))}
            <path className="ink" pathLength="1" style={d(0.9)} d={`M${pt(geo.top.front[50])} L${pt(dn(fl0))} L${pt(dn(fr0))} L${pt(dn(br0))} L${pt(geo.top.right[0])}`} strokeWidth="1.3" />
            <path className="ink" pathLength="1" style={d(1)} d={`M${pt(geo.top.front[0])} L${pt(dn(fr0))}`} strokeWidth="1.1" />
            <path className="ink" pathLength="1" style={d(1.1)} d={`M${pt(dn(fl0, T + 0.8))} L${pt(dn(fr0, T + 0.8))} L${pt(dn(br0, T + 0.8))}`} strokeWidth="0.5" opacity="0.6" />
          </g>

          {/* Mountain names in engraved small caps. */}
          <g className="fade" style={d(2.6)} fontFamily={SERIF} fontSize="10.5" fontWeight="600" fill={GRAPH} letterSpacing="0.32em">
            <text x={PZ(0.6, 1)[0]} y={PZ(0.6, 1)[1] - 24} transform={`rotate(-6.6 ${PZ(0.6, 1)[0]} ${PZ(0.6, 1)[1] - 24})`}>LAURENTIDES</text>
            <text x={P(0.8, 0)[0]} y={P(0.8, 0)[1] + 30} textAnchor="middle" transform={`rotate(-6.6 ${P(0.8, 0)[0]} ${P(0.8, 0)[1] + 30})`} stroke={FACE} strokeWidth="4" paintOrder="stroke">APPALACHES</text>
          </g>

          {/* Maples: ink trunk, warm watercolour crown, a loose pen scribble. */}
          {TREES.map(([e, n, k], i) => {
            const [x, y] = PZ(e, n);
            const cy = y - 13 * k;
            return (
              <g key={i} className="fade" style={d(2.2 + i * 0.08)}>
                <ellipse cx={x + 6} cy={y + 1} rx={8 * k} ry={2.4 * k} fill={GRAPH} opacity="0.18" />
                <line x1={x} x2={x} y1={y} y2={cy + 2} stroke={INK} strokeWidth="0.9" />
                <g className="crown" style={{ animationDelay: `${-i * 0.7}s` }}>
                  <g filter="url(#at-wash-s)" style={{ mixBlendMode: 'multiply' }}>
                    <circle cx={x} cy={cy - 3 * k} r={7.5 * k} fill={[ORANGE, AMBER, RUST][i % 3]} opacity="0.55" />
                    <circle cx={x + 4 * k} cy={cy} r={5 * k} fill={[AMBER, RUST, ORANGE][i % 3]} opacity="0.5" />
                  </g>
                  <path d={scribble(x, cy - 2 * k, 7.5 * k, i)} fill="none" stroke={INK} strokeWidth="0.45" opacity="0.75" />
                </g>
              </g>
            );
          })}

          {/* Arc shadows on the ground, then the arcs themselves. */}
          <g fill="none" stroke={GRAPH} strokeWidth="0.5" strokeDasharray="2 3" className="fade" style={d(2.6)}>
            {lam.filter(([, , l]) => l > 0.12).map(([i, j]) => (
              <line key={`s-${i}-${j}`} x1={STATIONS[i].base[0]} y1={STATIONS[i].base[1]} x2={STATIONS[j].base[0]} y2={STATIONS[j].base[1]} />
            ))}
          </g>
          <g fill="none" strokeLinecap="round" className="fade" style={d(2.8)}>
            {lam.map(([i, j, l]) => (
              <path key={`${i}-${j}`} className="link" d={arc(STATIONS[i].head, STATIONS[j].head)} stroke={INK} strokeWidth={0.35 + l * 3.6} opacity={0.2 + Math.min(0.75, l * 1.7)} />
            ))}
            {lam.filter(([, , l]) => l > 0.12).map(([i, j]) => (
              <path key={`f-${i}-${j}`} className="flow" d={arc(STATIONS[i].head, STATIONS[j].head)} stroke={ORANGE} strokeWidth="2.2" />
            ))}
          </g>

          {/* Survey pins and hand-lettered names. */}
          {STATIONS.map((st, i) => {
            const [bx, by] = st.base;
            const [hx, hy] = st.head;
            const lx = hx + st.dx;
            const ly = hy + st.dy;
            return (
              <g key={st.name}>
                <g className="fade" style={d(2.4 + i * 0.1)}>
                  <ellipse cx={bx} cy={by} rx="8" ry="3" fill="none" stroke={INK} strokeWidth="0.6" />
                  <ellipse className="ring" cx={bx} cy={by} rx="8" ry="3" fill="none" stroke={ORANGE} strokeWidth="0.8" />
                  <line x1={bx} x2={hx} y1={by} y2={hy} stroke={INK} strokeWidth="1" />
                  <circle cx={hx} cy={hy} r="3.3" fill={PAPER} stroke={INK} strokeWidth="1" />
                  <circle cx={hx} cy={hy} r="1.3" fill={ORANGE} />
                  <polyline points={`${hx + Math.sign(st.dx) * 4},${hy + Math.sign(st.dy) * 3} ${lx - Math.sign(st.dx) * 2},${ly - Math.sign(st.dy) * 4}`} fill="none" stroke={GRAPH} strokeWidth="0.5" />
                </g>
                <text className="write" style={d(3.3 + i * 0.18)} x={lx} y={ly + (st.dy > 0 ? 10 : 0)} fontFamily={HAND} fontSize="17" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke" textAnchor={st.end ? 'end' : 'start'}>
                  {st.name}
                </text>
              </g>
            );
          })}

          {/* The strongest pair, picked out in warm ink. */}
          <path className="link fade" style={d(3)} d={arc(A, B)} fill="none" stroke={ORANGE} strokeWidth="1" opacity="0.9" />

          {/* Clouds: inked stroke by stroke, then washed; redrawn whenever the season changes. */}
          <g key={s.key}>
            {CLOUDS.slice(0, nClouds).map((c, i) => {
              const ground = PZ(c.e, c.n);
              const cx = ground[0];
              const cy = ground[1] - c.h;
              const path = cloudPath(cx, cy, c.w);
              const x0 = cx - c.w * 0.38;
              const x1 = cx + c.w * 0.36;
              return (
                <g key={i} style={{ animationDelay: `${-i * 3}s` }}>
                                    {!isSnow && (
                    <g className="rain" stroke={GRAPH} strokeWidth="0.6" style={{ animationDelay: `${1.6 + i * 0.35}s` }}>
                      {Array.from({ length: Math.floor((x1 - x0) / gap) + 1 }, (_, k) => (
                        <line key={k} x1={x0 + k * gap} x2={x0 + k * gap - 9 - wet * 6} y1={cy + 9} y2={cy + 40 + wet * 26} style={{ animationDelay: `${-(k % 3) * 0.22}s` }} />
                      ))}
                    </g>
                  )}
                  {isSnow && (
                    <g stroke={GRAPH} strokeWidth="0.6" className="rain" style={{ animationDelay: '1.6s' }}>
                      {Array.from({ length: 7 }, (_, k) => (
                        <g key={k} transform={`translate(${x0 + k * ((x1 - x0) / 6)} ${cy + 14 + (k % 2) * 12})`}>
                          <g className="flake" style={{ animationDelay: `${-k * 0.6}s` }}>
                            <path d="M-2.6 0 H2.6 M0 -2.6 V2.6 M-1.8 -1.8 L1.8 1.8 M1.8 -1.8 L-1.8 1.8" />
                          </g>
                        </g>
                      ))}
                    </g>
                  )}
                  <g className="cloud-float" style={{ animationDelay: `${-i * 4}s` }}>
                    <g transform="translate(4 3)" filter="url(#at-wash)"><g className="wash" style={{ animationDelay: `${1 + i * 0.35}s` }}><path d={path} fill={washTone} opacity="0.5" /><path d={path} fill="none" stroke={washTone} strokeWidth="3" opacity="0.55" /></g></g>
                    <path className="pen" pathLength="1" d={path} fill="none" stroke={INK} strokeWidth="1.05" strokeLinejoin="round" style={{ animationDelay: `${i * 0.35}s` }} />
                    <path className="pen b" pathLength="1" d={cloudPath(cx + 1.5, cy - 1.2, c.w * 0.97)} fill="none" stroke={INK} strokeWidth="0.45" opacity="0.6" style={{ animationDelay: `${0.5 + i * 0.35}s` }} />
                    {/* underside shading strokes */}
                    {[0.22, 0.34, 0.46].map((f, k) => (
                      <path key={k} className="pen b" pathLength="1" d={`M${cx - c.w * f} ${cy - 3 - k * 2} q ${c.w * 0.12} 5 ${c.w * 0.26} 0`} fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" style={{ animationDelay: `${0.9 + i * 0.35 + k * 0.1}s` }} />
                    ))}
                  </g>
                </g>
              );
            })}
          </g>

          {/* Dimensions with architect's ticks and hand-lettered values. */}
          <g className="fade" style={d(3)} fill="none" stroke={INK} strokeWidth="0.55">
            <line x1={dn(fl0)[0]} y1={dn(fl0)[1] + 4} x2={dimF.A2[0]} y2={dimF.A2[1] + 5} stroke={GRAPH} strokeWidth="0.45" />
            <line x1={dn(fr0)[0]} y1={dn(fr0)[1] + 4} x2={dimF.B2[0]} y2={dimF.B2[1] + 5} stroke={GRAPH} strokeWidth="0.45" />
            <path d={ext(dimF.A2, dimF.B2, 8)} />
            <path d={tick(dimF.A2)} strokeWidth="1.1" />
            <path d={tick(dimF.B2)} strokeWidth="1.1" />
            <path d={ext(dimR.A2, dimR.B2, 8)} />
            <path d={tick(dimR.A2)} strokeWidth="1.1" />
            <path d={tick(dimR.B2)} strokeWidth="1.1" />
            <line x1={dn(br0)[0] + 3} y1={dn(br0)[1]} x2={dimR.B2[0] + 3} y2={dimR.B2[1]} stroke={GRAPH} strokeWidth="0.45" />
          </g>
          <g className="write" style={d(3.6)} fontFamily={HAND} fontSize="15" fill={INK}>
            <text x={dimF.mid[0]} y={dimF.mid[1] - 5} textAnchor="middle" transform={`rotate(${dimF.ang} ${dimF.mid[0]} ${dimF.mid[1]})`} stroke={PAPER} strokeWidth="4" paintOrder="stroke">≈ 210 km</text>
            <text x={dimR.mid[0] + 8} y={dimR.mid[1]} textAnchor="middle" transform={`rotate(${dimR.ang + 180} ${dimR.mid[0] + 8} ${dimR.mid[1]})`} stroke={PAPER} strokeWidth="4" paintOrder="stroke">≈ 150 km</text>
          </g>

          {/* North point, aligned with the block's north axis. */}
          <g className="fade" style={d(3.4)} transform="translate(905 448)">
            <circle r="20" fill="none" stroke={INK} strokeWidth="0.5" />
            <circle r="17" fill="none" stroke={GRAPH} strokeWidth="0.35" />
            <g transform={`rotate(${(Math.atan2(NV[1], NV[0]) * 180) / Math.PI + 90})`}>
              <path d="M0 -24 L4 0 L0 24 L-4 0 Z" fill="none" stroke={INK} strokeWidth="0.7" />
              <path d="M0 -24 L4 0 L-4 0 Z" fill={INK} />
              <text y="-29" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="13" fill={INK}>N</text>
            </g>
          </g>

          {/* Plate title and signature. */}
          <g className="fade" style={d(3.9)}>
            <text x="430" y="474" fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}>Planche II.</text>
            <text x="526" y="474" fontFamily={SERIF} fontSize="11" fontWeight="600" letterSpacing="0.26em" fill={GRAPH}>EXTRÊMES DE PLUIE · QUÉBEC MÉRIDIONAL</text>
            <line x1="430" x2="842" y1="484" y2="484" stroke={INK} strokeWidth="0.5" />
            <line x1="430" x2="842" y1="487" y2="487" stroke={INK} strokeWidth="0.25" />
          </g>
          <text className="write" style={d(4.2)} x="430" y="510" fontFamily={HAND} fontSize="15" fill={ORANGE}>
            {s.fr} · strongest pair: {STATIONS[mi].name} & {STATIONS[mj].name} (<tspan fontFamily={GREEK} fontStyle="italic" fontSize="14">λ</tspan><tspan fontFamily={SERIF} fontSize="10" dy="3">U</tspan><tspan dy="-3"> {ml.toFixed(2)})</tspan>
          </text>
          <text className="write" style={d(4.5)} x="930" y="530" textAnchor="end" fontFamily={HAND} fontSize="16" fill={GRAPH}>Z. Zhou, MMXXVI</text>

          {/* A few maple leaves drifting across the plate. */}
          <g className="leaves">
            {[[900, 90, 6, ORANGE], [760, 180, 5, AMBER], [640, 50, 5.5, RUST]].map(([x, y, k, c]) => (
              <g key={x} transform={`translate(${x} ${y})`}>
                <g className="leaf"><path d={MAPLE} transform={`scale(${k})`} fill={c} opacity="0.9" /></g>
              </g>
            ))}
          </g>
        </Art>
      </Scene>
  );
};

export default QuebecScene;
