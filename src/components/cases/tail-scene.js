import React from 'react';
import styled, { keyframes } from 'styled-components';
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
      label="Engineering-style drawing of tail-index intervals for Danish fire-insurance losses at five thresholds: a wide union band and a narrower first-order band at each threshold, with a ruled stripe where all union bands overlap, from 0.52 to 0.84. The card compares coverage in a pre-registered benchmark: the union band stays near or above 95% in all 16 settings, while the usual interval at a selected threshold falls as low as 3%."
      caption="Planche IV — Danish fire-insurance losses (n = 2,167). At each threshold k: the union band (warm, hull over working ρ′) and the first-order band (graphite). The ruled stripe is their common ground, ξ ∈ [0.52, 0.84], valid whichever k is chosen.">
      <Art className={cls} viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="tf-wash" x="-40%" y="-10%" width="180%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="dd" />
            <feGaussianBlur in="dd" stdDeviation="0.8" />
          </filter>
          <pattern id="tf-rule" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={GRAPH} strokeWidth="0.4" />
          </pattern>
        </defs>

        <rect width="960" height="540" fill={PAPER} />

        {/* Construction: ξ gridlines, overshooting the frame. */}
        <g fill="none" stroke={FAINT} strokeWidth="0.5">
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map((v, i) => (
            <path key={v} className="ink" pathLength="1" style={d(i * 0.06)} d={`M${LEFT - 14} ${y(v)} H${RIGHT + 10}`} opacity={v === 1 ? 0.9 : 0.6} />
          ))}
          <path className="ink" pathLength="1" style={d(0.3)} d={`M${LEFT} ${Y1 - 30} V${Y0 + 14}`} />
        </g>
        <g className="fade" style={d(0.8)} fontFamily={SERIF} fontSize="12" fontWeight="600" fill={GRAPH} textAnchor="end">
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map(v => (
            <text key={v} x={LEFT - 18} y={y(v) + 4}>
              {v.toFixed(2)}
            </text>
          ))}
        </g>
        <text className="write" style={d(1)} x={LEFT - 6} y={Y1 - 40} fontFamily={GREEK} fontStyle="italic" fontSize="22" fill={INK} textAnchor="middle">
          ξ
        </text>

        {/* The common ground of all union bands. */}
        <g className="fade" style={d(2.6)}>
          <rect className="stripe" x={LEFT} y={y(INTER[1])} width={RIGHT - LEFT} height={y(INTER[0]) - y(INTER[1])} fill={stripeTone} opacity="0.7" />
          <rect x={LEFT} y={y(INTER[1])} width={RIGHT - LEFT} height={y(INTER[0]) - y(INTER[1])} fill="url(#tf-rule)" opacity="0.55" />
          <line x1={LEFT} x2={RIGHT} y1={y(INTER[1])} y2={y(INTER[1])} stroke={INK} strokeWidth="0.6" strokeDasharray="5 4" />
          <line x1={LEFT} x2={RIGHT} y1={y(INTER[0])} y2={y(INTER[0])} stroke={INK} strokeWidth="0.6" strokeDasharray="5 4" />
        </g>

        {/* Bands at each threshold. */}
        {KS.map((k, i) => {
          const x = X(i);
          const [ul, uc, uh] = UNION[i];
          const [fl, fc, fh] = FIRST[i];
          return (
            <g key={k}>
              <g className="bar" style={{ animationDelay: `${1.2 + i * 0.18}s` }}>
                <rect x={x - 9} y={y(uh)} width="18" height={y(ul) - y(uh)} fill={ORANGE} opacity="0.32" filter="url(#tf-wash)" style={{ mixBlendMode: 'multiply' }} />
                <path d={`M${x - 9} ${y(uh)} H${x + 9} M${x - 9} ${y(ul)} H${x + 9} M${x} ${y(uh)} V${y(ul)}`} fill="none" stroke={RUST} strokeWidth="1.3" />
              </g>
              <circle className="fade" style={d(2 + i * 0.12)} cx={x} cy={y(uc)} r="3.4" fill={ORANGE} stroke={PAPER} strokeWidth="1" />
              <g className="bar" style={{ animationDelay: `${1.5 + i * 0.18}s` }}>
                <path d={`M${x + 22} ${y(fh)} V${y(fl)} M${x + 18} ${y(fh)} H${x + 26} M${x + 18} ${y(fl)} H${x + 26}`} fill="none" stroke={GRAPH} strokeWidth="1" />
              </g>
              <circle className="fade" style={d(2.2 + i * 0.12)} cx={x + 22} cy={y(fc)} r="2.4" fill={PAPER} stroke={INK} strokeWidth="0.9" />
              {/* k on the axis */}
              <path className="ink" pathLength="1" style={d(0.6 + i * 0.05)} d={`M${x} ${Y0 + 6} V${Y0 + 14}`} stroke={INK} strokeWidth="0.8" />
              <text className="fade" style={d(1 + i * 0.06)} x={x + 6} y={Y0 + 32} fontFamily={SERIF} fontSize="14" fontWeight="600" fill={INK} textAnchor="middle">
                {k}
              </text>
            </g>
          );
        })}
        <path className="ink" pathLength="1" style={d(0.5)} d={`M${LEFT - 14} ${Y0 + 10} H${RIGHT + 10}`} fill="none" stroke={INK} strokeWidth="0.8" />
        <text className="write" style={d(3)} x={LEFT} y={Y0 + 48} fontFamily={HAND} fontSize="15" fill={GRAPH}>
          k — how many of the largest losses enter the estimate
        </text>

        {/* Width shrinks like k^(-1/2): a dimension on the first and last union bands. */}
        <g className="fade" style={d(3.2)} fill="none" stroke={GRAPH} strokeWidth="0.5">
          <path d={`M${X(0) - 18} ${y(UNION[0][2])} V${y(UNION[0][0])} M${X(0) - 22} ${y(UNION[0][2]) + 4} L${X(0) - 14} ${y(UNION[0][2]) - 4} M${X(0) - 22} ${y(UNION[0][0]) + 4} L${X(0) - 14} ${y(UNION[0][0]) - 4}`} />
        </g>
        <text className="write" style={d(3.4)} x={X(0) + 18} y={y(1.55)} fontFamily={HAND} fontSize="15" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          width ∝ k
          <tspan dy="-7" fontSize="11">−1/2</tspan>
        </text>

        {/* Labels with leaders. */}
        <path className="ink" pathLength="1" style={d(3.2)} d={`M${X(1) + 10} ${y(1.2)} C ${X(1) + 40} ${y(1.3)} ${X(2) - 10} ${y(1.36)} ${X(2) + 14} ${y(1.36)}`} fill="none" stroke={RUST} strokeWidth="0.6" />
        <text className="write" style={d(3.5)} x={X(2) + 18} y={y(1.36) + 5} fontFamily={HAND} fontSize="16" fill={RUST} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          union band — hull over working ρ′
        </text>
        <path className="ink" pathLength="1" style={d(3.3)} d={`M${X(3) + 26} ${y(0.88)} C ${X(3) + 40} ${y(1.0)} ${X(3) + 46} ${y(1.08)} ${X(3) + 62} ${y(1.1)}`} fill="none" stroke={GRAPH} strokeWidth="0.5" />
        <text className="write" style={d(3.6)} x={X(3) + 66} y={y(1.1) + 5} fontFamily={HAND} fontSize="15" fill={GRAPH} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          first-order band
        </text>
        <text className="write" style={d(3.8)} x={RIGHT - 4} y={y(INTER[0]) + 22} textAnchor="end" fontFamily={HAND} fontSize="16" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          common ground: ξ ∈ [0.52, 0.84]
        </text>

        <text className="write" style={d(0.9)} x={LEFT + 14} y={Y1 - 40} fontFamily={HAND} fontSize="19" fill={INK}>
          Danish fire losses, n = 2,167
        </text>

        {/* Plate title and signature. */}
        <g className="fade" style={d(3.9)}>
          <text x="40" y="518" fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}>Planche IV.</text>
          <text x="148" y="518" fontFamily={SERIF} fontSize="11" fontWeight="600" letterSpacing="0.26em" fill={GRAPH}>
            QUEUES LOURDES · INFÉRENCE APRÈS SÉLECTION
          </text>
          <line x1="40" x2="600" y1="526" y2="526" stroke={INK} strokeWidth="0.5" />
          <line x1="40" x2="600" y1="529" y2="529" stroke={INK} strokeWidth="0.25" />
        </g>
      </Art>
    </Scene>
  );
};

export default TailScene;
