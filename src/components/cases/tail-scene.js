import React from 'react';
import styled, { keyframes } from 'styled-components';
import { PrintTail } from './print-art';
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
  RUST,
  SERIF,
  HAND,
  GREEK,
} from './kit';
import { isFrost, FROST_LIGHT } from '@utils/season';

/*
 * Planche IV — the tail-index preprint as an atelier plate, drawn from its stored outputs
 * (EllenSyuu/tailfm-union-band, reports/phase3).
 *
 * Main drawing: the Danish fire-insurance application (n = 2,167). At five thresholds k the
 * union band — the hull of simultaneous credible bands over a range of working ρ′ — is drawn
 * as a washed bar in warm ink; the first-order band sits beside it in graphite. The ruled
 * stripe is where all union bands overlap, ξ ∈ [0.523, 0.843], the interval that survives
 * any choice of k on the grid.
 *
 * Card: the pre-registered benchmark (seed 2033, code frozen), the 16 settings inside the
 * stated ρ range. For each, the minimum post-selection coverage of the union band over four
 * selection rules (warm) and the coverage of the usual first-order interval at a
 * Lepski-selected k (hollow). Values from paper/preprint/generated/tab_bench.tex.
 */

// Danish application: [simultaneous lower, centre, simultaneous upper] at each k.
const KS = [19, 39, 79, 158, 317];
const UNION = [
  [0.365, 0.774, 1.587],
  [0.379, 0.712, 1.295],
  [0.364, 0.59, 1.009],
  [0.379, 0.583, 0.843],
  [0.523, 0.725, 0.976],
];
const FIRST = [
  [0.38, 0.606, 1.053],
  [0.398, 0.555, 0.806],
  [0.467, 0.591, 0.765],
  [0.616, 0.729, 0.873],
  [0.619, 0.698, 0.792],
];
const INTER = [0.523, 0.843];

// Benchmark, in-range settings: [union band min post-selection coverage, first-order at Lepski k].
const BENCH = [
  ['|t|', 0.98, 0.86],
  ['|t|', 0.98, 0.88],
  ['|t|', 0.99, 0.33],
  ['|t|', 0.98, 0.28],
  ['Burr', 0.98, 0.61],
  ['Burr', 0.98, 0.59],
  ['Burr', 1.0, 0.65],
  ['Burr', 0.99, 0.52],
  ['Burr', 0.96, 0.03],
  ['Burr', 0.95, 0.05],
  ['Burr', 0.98, 0.03],
  ['Burr', 0.98, 0.03],
  ['Fréchet', 0.99, 0.84],
  ['Fréchet', 0.99, 0.79],
  ['Fréchet', 0.98, 0.83],
  ['Fréchet', 0.98, 0.78],
];

/* ---------- geometry ---------- */
const Y0 = 426;
const Y1 = 92;
const XI_LO = 0.2;
const XI_HI = 1.7;
const y = xi => Y0 - ((xi - XI_LO) / (XI_HI - XI_LO)) * (Y0 - Y1);
const X = i => 128 + i * 104;
const LEFT = 78;
const RIGHT = 600;

const grow = keyframes`
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
`;
const breathe = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.9; }
`;

const Art = styled.svg`
  ${drawCss}

  .bar {
    transform-box: fill-box;
    transform-origin: 50% 50%;
  }
  &.on .bar {
    animation: ${grow} 1.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  &.still .bar {
    animation: none;
  }
  .stripe {
    animation: ${breathe} 6s ease-in-out infinite;
  }
`;

// Dot chart for the card: one row per benchmark setting.
const Chart = ({ run }) => {
  const x = v => 70 + v * 205;
  const rowY = i => 22 + i * 8.8;
  return (
    <svg viewBox="0 0 290 182" width="100%" aria-hidden="true" style={{ marginTop: 6 }}>
      <line x1={x(0.9)} x2={x(0.9)} y1="14" y2="164" stroke={ORANGE} strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1={x(0)} x2={x(1)} y1="166" y2="166" stroke={INK} strokeWidth="0.6" />
      {[0, 0.5, 0.9, 1].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1="166" y2="170" stroke={INK} strokeWidth="0.6" />
          <text x={x(v)} y="180" fontSize="9.5" fill={v === 0.9 ? ORANGE : GRAPH} textAnchor="middle" fontFamily={SERIF} fontWeight="600">
            {v === 0 ? '0' : v === 1 ? '1' : v.toFixed(v === 0.5 ? 1 : 2)}
          </text>
        </g>
      ))}
      {BENCH.map(([fam, u, f], i) => (
        <g
          key={i}
          style={{
            opacity: run ? 1 : 0,
            transition: `opacity .6s ${0.08 * i}s`,
          }}>
          {(i === 0 || BENCH[i - 1][0] !== fam) && (
            <text x="0" y={rowY(i) + 3.5} fontSize="11.5" fill={INK} fontFamily={SERIF} fontWeight="600">
              {fam}
            </text>
          )}
          <line x1={x(f)} x2={x(u)} y1={rowY(i)} y2={rowY(i)} stroke={FAINT} strokeWidth="0.7" />
          <circle cx={x(f)} cy={rowY(i)} r="2.4" fill={PAPER} stroke={INK} strokeWidth="0.9" />
          <circle
            cx={x(u)}
            cy={rowY(i)}
            r="2.8"
            fill={ORANGE}
            style={{
              transform: `translateX(${run ? 0 : x(f) - x(u)}px)`,
              transition: `transform 1.3s cubic-bezier(.22,.8,.3,1) ${0.08 * i}s`,
            }}
          />
        </g>
      ))}
      <text x={x(0.9) - 4} y="11" fontSize="11" fill={ORANGE} textAnchor="end" fontFamily={HAND}>
        nominal 90%
      </text>
    </svg>
  );
};

const TailScene = () => {
  const scene = useScene();
  // The real value is rendered first (and for crawlers); it counts up from 0 once on screen.
  const shown = useCountUp(scene.near && !scene.seen && !scene.reduced ? 0 : 16, { decimals: 0, duration: 1800, run: scene.seen && !scene.reduced });
  const cls = drawClass(scene);
  const stripeTone = isFrost ? FROST_LIGHT : AMBER;

  const card = (
    <div className="card" style={{ right: 18, top: 18 }}>
      <p className="kicker">Pre-registered benchmark · coverage</p>
      <span className="big">{shown} of 16</span>
      <p className="note" style={{ marginTop: 6 }}>
        settings where the band kept coverage after four ways of choosing <i>k</i>. The usual interval fell below 80% in 12 of them.
      </p>
      <Chart run={scene.seen || scene.reduced} />
      <p className="note" style={{ marginTop: 4, fontSize: 13.5 }}>
        <span style={{ color: ORANGE }}>●</span> union band, worst of four selection rules &nbsp;○ first-order interval at the chosen <i>k</i>
      </p>
    </div>
  );

  return (
    <Scene
      scene={scene}
      card={card}
      label="Chart of tail-index intervals for Danish fire-insurance losses at five thresholds: a wide union band and a narrower first-order band at each threshold, with a ruled stripe where all union bands overlap, from 0.52 to 0.84. The card compares coverage in a pre-registered benchmark: the union band stays near or above 95% in all 16 settings, while the usual interval at a selected threshold falls as low as 3%."
      caption="Danish fire-insurance losses (n = 2,167). At each threshold k: the union band (gold, hull over working ρ′) and the first-order band (navy). The blue stripe is their common ground, ξ ∈ [0.52, 0.84], valid whichever k is chosen.">
      <PrintTail cls={cls} ks={KS} union={UNION} first={FIRST} inter={INTER} />
    </Scene>
  );
};

export default TailScene;
