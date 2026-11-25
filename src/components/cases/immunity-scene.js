import React, { useMemo, useState } from 'react';
import { isFrost, FROST_LIGHT } from '@utils/season';
import styled, { keyframes } from 'styled-components';
import { PrintImmunity } from './print-art';
import {
  Scene,
  useScene,
  useCountUp,
  drawCss,
  drawClass,
  delay as d,
  INK,
  GRAPH,
  FAINT,
  PAPER,
  ORANGE,
  AMBER,
  SERIF,
  HAND,
} from './kit';

/*
 * VVI — Victoria Harbour at dusk as an architect's elevation. The ridge behind the city is
 * 2022's two Omicron waves (BA.2 in March, BA.5 in the summer) on a ruled time scale; a few
 * windows are lit in warm wash. Person-days leave the windows and settle into a hand-ruled
 * ledger: the model only needs (people at risk, events) per covariate cell × calendar day,
 * so ~5×10⁸ person-day rows become 17,520. The card shows the synthetic benchmark
 * (docs/benchmark.md) and the synthetic recovery check (README demo) from the VVI
 * repository. No real data anywhere.
 */

// Build + fit time (s) by cohort size, from docs/benchmark.md.
const PERSON_DAY = [[1000, 16.77], [2500, 36.52], [5000, 71.86]];
const AGGREGATED = [[1000, 1.22], [2500, 1.02], [5000, 1.03], [30000, 1.39], [300000, 3.99], [1000000, 13.17]];

// Synthetic recovery check, from the README demo (estimate, 95% CI, planted truth).
const RECOVERY = [
  { term: 'BBB', hr: 0.626, lo: 0.597, hi: 0.657, truth: 0.638 },
  { term: 'BBBI', hr: 0.255, lo: 0.234, hi: 0.277, truth: 0.259 },
  { term: 'BBI', hr: 0.194, lo: 0.173, hi: 0.219, truth: 0.202 },
];

const rnd = seed => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/* ---------- geometry ---------- */
const X0 = 30;
const X1 = 590;
const WATER = 380;
// 2022 across X0..X1: a tall BA.2 peak in March and a broader BA.5 wave in the summer.
const waveY = x => {
  const t = (x - X0) / (X1 - X0);
  const a = Math.exp(-(((t - 0.2) / 0.07) ** 2));
  const b = 0.62 * Math.exp(-(((t - 0.6) / 0.14) ** 2));
  return 326 - 178 * (a + b);
};
const ridgePath = (off = 0) =>
  Array.from({ length: 57 }, (_, i) => {
    const x = X0 + i * 10;
    return `${i ? 'L' : 'M'}${x} ${(waveY(x) + off).toFixed(1)}`;
  }).join(' ');
const monthX = m => X0 + ((m + 0.5) / 12) * (X1 - X0);
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const ext = (x1, y1, x2, y2, k = 16) => {
  const L = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / L;
  const uy = (y2 - y1) / L;
  return `M${x1 - ux * k} ${y1 - uy * k} L${x2 + ux * k} ${y2 + uy * k}`;
};

// A scribble standing in for a handwritten count — no invented numbers.
const squiggle = (x, y, w, seed) => {
  const r = rnd(seed);
  let p = `M${x} ${y}`;
  const n = 4 + Math.floor(r() * 3);
  for (let i = 1; i <= n; i += 1) {
    const px = x + (i / n) * w;
    p += ` q ${(w / n / 2).toFixed(1)} ${(-5 - r() * 3).toFixed(1)} ${(w / n).toFixed(1)} 0`;
    if (px > x + w) break;
  }
  return p;
};

/* ---------- motion ---------- */
const settle = keyframes`
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 1; }
  82%  { opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
`;
const fillIn = keyframes`
  0%, 6%   { opacity: 0; }
  18%, 86% { opacity: 1; }
  100%     { opacity: 0; }
`;
const flicker = keyframes`
  0%, 100% { opacity: 0.45; }
  50%      { opacity: 1; }
`;
const sail = keyframes`
  from { transform: translateX(-140px); }
  to   { transform: translateX(1100px); }
`;
const ripple = keyframes`
  to { stroke-dashoffset: -120; }
`;

const Art = styled.svg`
  ${drawCss}

  .pd {
    animation: ${settle} 3.8s cubic-bezier(0.45, 0, 0.3, 1) infinite;
  }
  .entry {
    animation: ${fillIn} 7.6s ease-in-out infinite;
  }
  .lit {
    animation: ${flicker} 4.2s ease-in-out infinite;
  }
  .ferry {
    animation: ${sail} 46s linear infinite;
  }
  .ripple {
    animation: ${ripple} 14s linear infinite;
  }
`;

/* ---------- card charts ---------- */
const SpeedChart = ({ run }) => {
  const lx = n => 30 + ((Math.log10(n) - 3) / 3) * 232;
  const ly = s => 112 - (s / 80) * 96;
  const path = pts => pts.map(([n, s], i) => `${i ? 'L' : 'M'}${lx(n).toFixed(1)} ${ly(s).toFixed(1)}`).join(' ');
  const pd = PERSON_DAY[PERSON_DAY.length - 1];
  return (
    <svg viewBox="0 0 280 150" width="100%" aria-hidden="true" style={{ marginTop: 4, overflow: 'visible' }}>
      <line x1="30" x2="266" y1={ly(0)} y2={ly(0)} stroke={INK} strokeWidth="0.8" />
      <line x1="30" x2="30" y1={ly(0)} y2={ly(84)} stroke={INK} strokeWidth="0.8" />
      {[20, 40, 60, 80].map(s => (
        <g key={s}>
          <line x1="30" x2="266" y1={ly(s)} y2={ly(s)} stroke={FAINT} strokeWidth="0.4" strokeDasharray="1 3" />
          <text x="24" y={ly(s) + 3.5} fontSize="10.5" fill={GRAPH} textAnchor="end" fontFamily={SERIF} fontWeight="600">
            {s} s
          </text>
        </g>
      ))}
      {[1e3, 1e4, 1e5, 1e6].map(n => (
        <g key={n}>
          <line x1={lx(n)} x2={lx(n)} y1={ly(0)} y2={ly(0) + 4} stroke={INK} strokeWidth="0.7" />
          <text x={lx(n)} y="127" fontSize="10.5" fill={GRAPH} textAnchor="middle" fontFamily={SERIF} fontWeight="600">
            {n >= 1e6 ? '1M' : `${n / 1000}k`}
          </text>
        </g>
      ))}
      <text x="148" y="145" fontSize="13" fill={GRAPH} textAnchor="middle" fontFamily={HAND}>
        people in the cohort
      </text>
      <path d={path(PERSON_DAY)} pathLength="1" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round"
        style={{ strokeDasharray: 1, strokeDashoffset: run ? 0 : 1, transition: 'stroke-dashoffset 1.6s ease' }} />
      <path d={path(AGGREGATED)} pathLength="1" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"
        style={{ strokeDasharray: 1, strokeDashoffset: run ? 0 : 1, transition: 'stroke-dashoffset 2.2s .3s ease' }} />
      <g style={{ opacity: run ? 1 : 0, transition: 'opacity .6s 1.6s' }}>
        <path d={`M${lx(pd[0]) - 4} ${ly(pd[1]) - 4} l8 8 m0 -8 l-8 8`} stroke={INK} strokeWidth="1.2" />
        <text x={lx(pd[0]) + 8} y={ly(pd[1]) + 4} fontSize="13" fill={INK} fontFamily={HAND}>
          out of memory
        </text>
        <text x={lx(2500) + 8} y={ly(36.52) + 12} fontSize="13" fill={INK} fontFamily={HAND}>
          person-day GLM
        </text>
      </g>
      <g style={{ opacity: run ? 1 : 0, transition: 'opacity .6s 2.4s' }}>
        <circle cx={lx(1e6)} cy={ly(13.17)} r="3" fill={ORANGE} />
        <text x={lx(1e6) - 6} y={ly(13.17) - 9} fontSize="13" fill={ORANGE} textAnchor="end" fontFamily={HAND}>
          vvi: 1M in 13 s
        </text>
      </g>
    </svg>
  );
};

const AccuracyChart = () => {
  const x = v => 40 + ((v - 0.15) / 0.55) * 228;
  return (
    <svg viewBox="0 0 280 122" width="100%" aria-hidden="true" style={{ marginTop: 4, overflow: 'visible' }}>
      <line x1="40" x2="268" y1="92" y2="92" stroke={INK} strokeWidth="0.8" />
      {[0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1="8" y2="92" stroke={FAINT} strokeWidth="0.4" strokeDasharray="1 3" />
          <line x1={x(v)} x2={x(v)} y1="92" y2="96" stroke={INK} strokeWidth="0.7" />
          <text x={x(v)} y="107" fontSize="10.5" fill={GRAPH} textAnchor="middle" fontFamily={SERIF} fontWeight="600">
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <text x="154" y="121" fontSize="13" fill={GRAPH} textAnchor="middle" fontFamily={HAND}>
        hazard ratio vs two doses (BB)
      </text>
      {RECOVERY.map((r, i) => {
        const y = 22 + i * 28;
        return (
          <g key={r.term}>
            <text x="0" y={y + 4} fontSize="12" fill={INK} fontFamily={SERIF} fontWeight="600" letterSpacing="0.08em">
              {r.term}
            </text>
            <line x1={x(r.lo)} x2={x(r.hi)} y1={y} y2={y} stroke={ORANGE} strokeWidth="1.6" />
            <line x1={x(r.lo)} x2={x(r.lo)} y1={y - 3} y2={y + 3} stroke={ORANGE} strokeWidth="0.9" />
            <line x1={x(r.hi)} x2={x(r.hi)} y1={y - 3} y2={y + 3} stroke={ORANGE} strokeWidth="0.9" />
            <circle cx={x(r.hr)} cy={y} r="3.2" fill={ORANGE} />
            <line x1={x(r.truth)} x2={x(r.truth)} y1={y - 8} y2={y + 8} stroke={INK} strokeWidth="1.3" />
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- the drawing ---------- */
const buildCity = () => {
  const r = rnd(5);
  const back = [];
  const front = [];
  let x = 4;
  while (x < 960) {
    const w = 14 + r() * 20;
    back.push({ x: x + 6, w: w * 0.9, h: 40 + Math.pow(r(), 1.6) * 120 });
    x += w + 2 + r() * 5;
  }
  x = 0;
  while (x < 960) {
    const w = 13 + r() * 22;
    front.push({ x, w, h: 22 + Math.pow(r(), 2.2) * 92 });
    x += w + 1 + r() * 4;
  }
  // Lit windows: a few, in warm wash.
  const lit = [];
  front.forEach((t, i) => {
    if (i % 3 !== 0) return;
    const n = 1 + Math.floor(r() * 2);
    for (let k = 0; k < n; k += 1) {
      lit.push({
        x: t.x + 3 + r() * Math.max(1, t.w - 9),
        y: WATER - 8 - r() * (t.h - 14),
        delay: -(r() * 4),
      });
    }
  });
  return { back, front, lit };
};

// Landmarks, drawn as clean elevations over the front row.
const IFC = { x: 300, w: 30, h: 196 };
const BOC = { x: 214, w: 34, h: 168 };

const ImmunityScene = () => {
  const scene = useScene();
  const [tab, setTab] = useState('speed');
  // The real value is rendered first (and for crawlers); it counts up from 0 once on screen.
  const rows = useCountUp(scene.near && !scene.seen && !scene.reduced ? 0 : 17520, { decimals: 0, duration: 2200, run: scene.live });
  const city = useMemo(buildCity, []);
  const cls = drawClass(scene);

  // Ledger on the quay.
  const LX = 40;
  const LY = 400;
  const LW = 286;
  const LH = 116;
  const COLS = [12, 70, 134, 214];
  const ROWS = 5;
  const CELLS = ['BB', 'BBB', 'BBI', 'BBBI', 'BI'];

  // Person-days leave windows and settle into the ledger rows.
  const pds = useMemo(() => {
    const src = city.front.filter((t, i) => t.x > 60 && t.x < 590 && i % 2 === 0);
    return src.slice(0, 26).map((t, i) => {
      const sx = t.x + t.w / 2;
      const sy = WATER - t.h * 0.6;
      const tx = LX + COLS[2] + 20 + ((i * 23) % 120);
      const ty = LY + 38 + (i % ROWS) * 15;
      return { sx, sy, dx: `${(tx - sx).toFixed(0)}px`, dy: `${(ty - sy).toFixed(0)}px`, delay: -((i * 0.61) % 3.8) };
    });
  }, [city]);

  const card = (
    <div className="card" style={{ right: 18, top: 18 }}>
      <p className="tabs-hint">
        <i /> choose a view
      </p>
      <div className="tabs" role="group" aria-label="View" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <button type="button" aria-pressed={tab === 'speed'} onClick={() => setTab('speed')}>
          Speed
        </button>
        <button type="button" aria-pressed={tab === 'accuracy'} onClick={() => setTab('accuracy')}>
          Accuracy
        </button>
      </div>
      {tab === 'speed' ? (
        <>
          <p className="kicker">Build + fit time · synthetic cohorts</p>
          <span className="big">
            {Number(rows).toLocaleString('en-US')}
            <small className="hand" style={{ marginLeft: 10, fontSize: 15, fontWeight: 400 }}>
              rows, any cohort size
            </small>
          </span>
          <SpeedChart run={scene.seen || scene.reduced} />
        </>
      ) : (
        <>
          <p className="kicker">Recovering a planted truth</p>
          <span className="big" style={{ fontSize: 26 }}>
            Estimate <span style={{ color: ORANGE }}>●</span> vs truth <span style={{ fontWeight: 600 }}>|</span>
          </span>
          <AccuracyChart />
          <p className="note" style={{ marginTop: 6 }}>
            The planted imprinting effect is found: BBBI vs BBI, HR 1.31 (95% CI 1.15–1.50).
          </p>
        </>
      )}
    </div>
  );

  const towerPath = t => `M${t.x.toFixed(1)} ${WATER} V${(WATER - t.h).toFixed(1)} H${(t.x + t.w).toFixed(1)} V${WATER}`;
  const floors = t => {
    if (t.w < 20 || t.h < 40) return null;
    let p = '';
    for (let y = WATER - 7; y > WATER - t.h + 5; y -= 7) p += `M${(t.x + 3).toFixed(1)} ${y.toFixed(1)} H${(t.x + t.w - 3).toFixed(1)} `;
    return p;
  };

  return (
    <Scene
      scene={scene}
      card={card}
      label="Victoria Harbour at dusk: the ridge behind the city traces 2022's two Omicron waves, and person-days drift from the windows into a ledger of sufficient statistics."
      caption={
        <>
          The ridge is 2022’s two Omicron waves; person-days settle into a ledger of sufficient
          statistics. All numbers are from synthetic cohorts — the licensed records never leave their environment.
        </>
      }>
      <PrintImmunity cls={cls} waveY={waveY} />
    </Scene>
  );
};

export default ImmunityScene;
