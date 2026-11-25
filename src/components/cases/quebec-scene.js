import React, { useEffect, useMemo, useState } from 'react';
import { isFrost } from '@utils/season';
import { MAPLE_D } from '@utils/maple';
import styled, { keyframes } from 'styled-components';
import { PrintQuebec } from './print-art';
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

const MAPLE = MAPLE_D;

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
  // Cloud wash: warm in autumn, frost blue-grey once the season turns.
  const washTone = isFrost
    ? wet > 0.7 ? '#7f98b0' : wet > 0.4 ? '#9fb2c5' : '#c3cfdb'
    : wet > 0.7 ? '#d8763f' : wet > 0.4 ? '#e8995d' : '#f0bd86';
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
        label="Map of southern Québec along the St. Lawrence: six stations, with arcs between them whose weight shows how often their rainfall extremes coincide."
        caption={<>Six stations along the St. Lawrence. Arc weight = how often two stations’ extremes coincide (λ<sub>U</sub>); rain = how heavy the season’s monthly maxima are.</>}>
        <PrintQuebec cls={cls} stations={STATIONS} pairs={LAMBDA[SEASONS[idx].key]} river={RIVER} heavy={idx / 3} />
      </Scene>
  );
};

export default QuebecScene;
