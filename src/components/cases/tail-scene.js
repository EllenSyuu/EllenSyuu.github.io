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

/*
 * TailFM as an atelier plate. Three heavy-tailed densities (tail index ξ = 0.15, 0.35, 0.6)
 * are engraved as a ridge plot, each breathing between a lighter and a heavier tail; the
 * heaviest tail is washed in amber and dimensioned. Simulated worlds (glass specimens holding
 * point clouds) drop samples onto the ridges; magnitudes (warm) and ranks (ink) take two
 * separate pathways into a small DeepSets network that outputs ξ and χ. The card is the
 * held-out result from reports/benchmark/report.md: for every training seed × copula family,
 * the paired ξ error of the network minus Hill, with its 95% Monte Carlo interval. All nine
 * sit on Hill's side.
 */

const RESULTS = [
  { family: 'Independent', rows: [[0.0654, 0.0491, 0.0817], [0.1, 0.0811, 0.1188], [0.061, 0.0452, 0.0768]] },
  { family: 'Gaussian', rows: [[0.0656, 0.0482, 0.083], [0.0935, 0.0734, 0.1136], [0.0639, 0.0474, 0.0805]] },
  { family: 'Student-t', rows: [[0.0858, 0.0678, 0.1038], [0.1209, 0.1001, 0.1418], [0.0847, 0.068, 0.1013]] },
];
const SEEDS = [ORANGE, INK, GRAPH];

/* ---------- ridges ---------- */
const PEAK = 118;
const AMP = 108;
// Density shape: Gaussian-like rise, generalised-Pareto-like tail.
const f = (xi, width, px) => {
  if (px < PEAK) {
    const z = (px - PEAK) / 34;
    return Math.exp(-z * z);
  }
  return Math.pow(1 + (xi * (px - PEAK)) / width, -1 / xi - 1);
};
const ridgeY = (r, xi, px) => r.base - AMP * f(xi, r.width, px);
const ridge = (r, xi) => {
  const pts = [];
  for (let px = 30; px <= 940; px += 6) pts.push(`${px} ${ridgeY(r, xi, px).toFixed(1)}`);
  return `M30 ${r.base} L${pts.join(' L')} L940 ${r.base}`;
};

// Back → front: lighter tails far away, the heaviest in front.
const RIDGES = [
  { xi: 0.15, lo: 0.12, hi: 0.2, base: 330, width: 44, label: '0.15' },
  { xi: 0.35, lo: 0.3, hi: 0.42, base: 386, width: 58, label: '0.35' },
  { xi: 0.6, lo: 0.55, hi: 0.66, base: 442, width: 74, label: '0.6' },
];
const FRONT = RIDGES[2];

// The heaviest tail, for the amber wash and the hatching.
const tailShape = (() => {
  const pts = [];
  for (let px = 210; px <= 620; px += 6) pts.push(`${px} ${ridgeY(FRONT, FRONT.xi, px).toFixed(1)}`);
  return `M210 ${FRONT.base} L${pts.join(' L')} L620 ${FRONT.base} Z`;
})();

/* ---------- network ---------- */
const NET = [
  [392, [128, 160, 192]],
  [448, [112, 144, 176, 208]],
  [504, [138, 182]],
];
const MAGNITUDE = `M340 ${ridgeY(FRONT, FRONT.xi, 340).toFixed(1)} C 362 360 352 236 384 184`;
const RANKS = 'M236 122 C 290 104 330 112 384 132';

const WORLDS = [
  [92, 92, 30, 0],
  [196, 136, 21, 1],
  [270, 62, 17, 2],
];

/* ---------- motion ---------- */
const fall = keyframes`
  0%   { transform: translateY(0); opacity: 0; }
  15%  { opacity: 0.9; }
  80%  { opacity: 0.9; }
  100% { transform: translateY(210px); opacity: 0; }
`;
const breathe = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
`;
const pulse = keyframes`
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const Art = styled.svg`
  ${drawCss}

  .drop { animation: ${fall} 4.8s cubic-bezier(0.5, 0, 0.9, 0.6) infinite; }
  .world { animation: ${breathe} 7s ease-in-out infinite; }
  .ring { transform-box: fill-box; transform-origin: center; animation: ${pulse} 2.8s ease-out infinite; }
`;

// Engraved forest chart for the card.
const Chart = ({ run }) => {
  const x = v => 78 + v * 1380; // 0 → 78, 0.14 → 271
  return (
    <svg viewBox="0 0 290 176" width="100%" aria-hidden="true" style={{ marginTop: 6 }}>
      <defs>
        <pattern id="tf-hill" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={ORANGE} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x={x(0)} y="4" width={x(0.145) - x(0)} height="146" fill="url(#tf-hill)" opacity="0.35" />
      <line x1={x(0)} x2={x(0)} y1="0" y2="154" stroke={INK} strokeWidth="0.8" strokeDasharray="2 3" />
      <line x1={x(0)} x2={x(0.145)} y1="150" y2="150" stroke={INK} strokeWidth="0.6" />
      {[0, 0.05, 0.1].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1="150" y2="154" stroke={INK} strokeWidth="0.6" />
          <text x={x(v)} y="164" fontSize="9.5" fill={GRAPH} textAnchor="middle" fontFamily={SERIF} fontWeight="600">
            {v === 0 ? '' : `+${v.toFixed(2)}`}
          </text>
        </g>
      ))}
      {RESULTS.map((g, gi) => (
        <g key={g.family} transform={`translate(0 ${20 + gi * 46})`}>
          <text x="0" y="12" fontSize="13" fill={INK} fontFamily={SERIF} fontWeight="600">
            {g.family}
          </text>
          {g.rows.map(([m, lo, hi], si) => (
            <g
              key={si}
              style={{
                transform: `translate(${run ? 0 : x(0) - x(m)}px, ${si * 11}px)`,
                opacity: run ? 1 : 0,
                transition: `transform 1.4s cubic-bezier(.22,.8,.3,1) ${gi * 0.35 + si * 0.12}s, opacity .6s ${gi * 0.35 + si * 0.12}s`,
              }}>
              <line x1={x(lo)} x2={x(hi)} y1="0" y2="0" stroke={SEEDS[si]} strokeWidth="1.2" />
              <line x1={x(lo)} x2={x(lo)} y1="-2.5" y2="2.5" stroke={SEEDS[si]} strokeWidth="0.8" />
              <line x1={x(hi)} x2={x(hi)} y1="-2.5" y2="2.5" stroke={SEEDS[si]} strokeWidth="0.8" />
              <circle cx={x(m)} cy="0" r="3" fill={si === 0 ? ORANGE : PAPER} stroke={SEEDS[si]} strokeWidth="1" />
            </g>
          ))}
        </g>
      ))}
      <text x={x(0) - 4} y="176" fontSize="12" fill={GRAPH} textAnchor="end" fontFamily={HAND}>
        tie
      </text>
      <text x={x(0.145)} y="176" fontSize="12" fill={ORANGE} textAnchor="end" fontFamily={HAND}>
        Hill better →
      </text>
    </svg>
  );
};

const TailScene = () => {
  const scene = useScene();
  // The real value is rendered first (and for crawlers); it counts up from 0 once on screen.
  const shown = useCountUp(scene.near && !scene.seen && !scene.reduced ? 0 : 9, { decimals: 0, duration: 1800, run: scene.seen && !scene.reduced });
  const cls = drawClass(scene);

  const card = (
    <div className="card" style={{ right: 18, top: 18 }}>
      <p className="kicker">Held-out test · tail-index error</p>
      <span className="big">{shown} of 9</span>
      <p className="note" style={{ marginTop: 6 }}>
        comparisons where the classical Hill estimator is still more accurate. Reported as found.
      </p>
      <Chart run={scene.seen || scene.reduced} />
      <p className="note" style={{ marginTop: 4, fontSize: 13.5 }}>
        Paired error, network − Hill, with 95% intervals; three training seeds, 64 shared worlds per family.
      </p>
    </div>
  );

  return (
    <Scene
      scene={scene}
      card={card}
      label="Engineering-style drawing of three heavy-tailed densities as an engraved ridge plot, simulated worlds dropping samples onto them, and two pathways — magnitudes and ranks — feeding a small neural network; the chart shows the network did not beat the Hill estimator."
      caption="Planche IV — ridges are heavy-tailed densities with different tail indices; magnitudes (warm) and ranks (ink) take separate pathways into the network, the fix for the identifiability flaw.">
      <Art className={cls} viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="tf-wash" x="-20%" y="-30%" width="140%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="dd" />
            <feGaussianBlur in="dd" stdDeviation="1" />
          </filter>
          <pattern id="tf-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={GRAPH} strokeWidth="0.45" />
          </pattern>
          <clipPath id="tf-tail">
            <path d={tailShape} />
          </clipPath>
          <marker id="tf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 2 L10 5 L0 8" fill="none" stroke={INK} strokeWidth="1.2" />
          </marker>
        </defs>

        <rect width="960" height="540" fill={PAPER} />

        {/* Construction: baselines and a vertical datum through the mode, overshooting. */}
        <g fill="none" stroke={FAINT} strokeWidth="0.5">
          {RIDGES.map((r, i) => (
            <path key={i} className="ink" pathLength="1" style={d(i * 0.1)} d={`M14 ${r.base} H950`} />
          ))}
          <path className="ink" pathLength="1" style={d(0.3)} d={`M${PEAK} 196 V462`} strokeDasharray="1" />
          <path className="ink" pathLength="1" style={d(0.35)} d="M14 120 L330 120" opacity="0.6" />
        </g>

        {/* Simulated worlds: glass specimens with small point clouds. */}
        {WORLDS.map(([cx, cy, r, k]) => (
          <g key={k} transform={`translate(${cx} ${cy})`}>
            <g className="world" style={{ animationDelay: `${-k * 2.1}s` }}>
              <circle className="ink" pathLength="1" style={d(0.5 + k * 0.15)} r={r} fill="none" stroke={INK} strokeWidth="0.9" />
              <path className="ink" pathLength="1" style={d(0.8 + k * 0.15)} d={`M${-r * 0.62} ${-r * 0.3} A ${r * 0.7} ${r * 0.7} 0 0 1 ${-r * 0.1} ${-r * 0.7}`} fill="none" stroke={GRAPH} strokeWidth="0.6" />
              <ellipse className="ink" pathLength="1" style={d(0.9 + k * 0.15)} rx={r} ry={r * 0.28} fill="none" stroke={FAINT} strokeWidth="0.5" />
              <g className="fade" style={d(1.1 + k * 0.15)}>
                {Array.from({ length: 13 }, (_, j) => {
                  const a = (j * 2.39996) % (Math.PI * 2);
                  const rr = r * 0.72 * Math.sqrt(((j * 37 + k * 11) % 13) / 13);
                  const u = Math.cos(a) * rr;
                  const v = Math.sin(a) * rr * 0.6 - u * 0.4;
                  return <circle key={j} cx={u} cy={v} r={r / 18 + 0.7} fill={j % 6 === 0 ? ORANGE : INK} opacity="0.85" />;
                })}
              </g>
            </g>
          </g>
        ))}
        <text className="write" style={d(2.4)} x="40" y="150" fontFamily={HAND} fontSize="15" fill={GRAPH}>
          simulated worlds
        </text>

        {/* Samples falling from the worlds onto the ridges. */}
        <g className="fade" style={d(2.6)}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 60 + ((i * 71) % 240);
            const y = 150 + ((i * 29) % 40);
            return (
              <circle key={i} className="drop" cx={x} cy={y} r={1.6 + (i % 2)} fill={i % 4 === 0 ? ORANGE : INK} style={{ animationDelay: `${-(i * 0.53) % 4.8}s` }} />
            );
          })}
        </g>

        {/* Heavy-tailed ridges, engraved back to front; each breathes between lighter and heavier tails. */}
        {RIDGES.map((r, i) => (
          <path key={i} className="ink" pathLength="1" style={d(0.6 + i * 0.25)} d={ridge(r, r.xi)} fill={PAPER} stroke={INK} strokeWidth={0.8 + i * 0.25} strokeLinejoin="round">
            <animate
              attributeName="d"
              dur={`${9 + i * 2}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              values={`${ridge(r, r.lo)};${ridge(r, r.hi)};${ridge(r, r.lo)}`}
            />
          </path>
        ))}
        {/* Fine engraving lines under each ridge's body. */}
        <g fill="none" stroke={GRAPH} strokeWidth="0.4" className="fade" style={d(1.4)}>
          {RIDGES.map((r, i) =>
            [0.35, 0.6].map(k => {
              const pts = [];
              for (let px = 70; px <= 190; px += 6) pts.push(`${px} ${(r.base - AMP * k * f(r.xi, r.width, px)).toFixed(1)}`);
              return <path key={`${i}-${k}`} d={`M${pts.join(' L')}`} opacity="0.6" />;
            }),
          )}
        </g>

        {/* The heaviest tail: amber wash, hatching, and a dimension marking where the tail begins. */}
        <g className="fade" style={d(1.8)}>
          <path d={tailShape} fill={AMBER} opacity="0.4" filter="url(#tf-wash)" style={{ mixBlendMode: 'multiply' }} />
          <rect x="200" y="380" width="430" height="70" fill="url(#tf-hatch)" clipPath="url(#tf-tail)" opacity="0.8" />
        </g>
        <g className="fade" style={d(2.2)} fill="none" stroke={INK} strokeWidth="0.55">
          <line x1="210" x2="210" y1={FRONT.base + 4} y2={FRONT.base + 22} stroke={GRAPH} strokeWidth="0.45" />
          <line x1="560" x2="560" y1={FRONT.base + 4} y2={FRONT.base + 22} stroke={GRAPH} strokeWidth="0.45" />
          <line x1="202" x2="568" y1={FRONT.base + 17} y2={FRONT.base + 17} />
          <path d={`M206 ${FRONT.base + 21} L214 ${FRONT.base + 13} M556 ${FRONT.base + 21} L564 ${FRONT.base + 13}`} strokeWidth="1.1" />
        </g>
        <text className="write" style={d(2.8)} x="385" y={FRONT.base + 35} textAnchor="middle" fontFamily={HAND} fontSize="16" fill={RUST} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
          the tail, where extremes live
        </text>

        {/* Tail-index labels with leaders. */}
        {RIDGES.map((r, i) => {
          const lx = 172 + i * 14;
          const ly = ridgeY(r, r.xi, lx);
          return (
            <g key={r.label}>
              <path className="ink" pathLength="1" style={d(2.4 + i * 0.12)} d={`M${lx} ${ly - 2} L${lx + 16} ${ly - 20} H${lx + 22}`} fill="none" stroke={GRAPH} strokeWidth="0.5" />
              <text className="write" style={d(2.6 + i * 0.15)} x={lx + 25} y={ly - 17} fontSize="16" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
                <tspan fontFamily={GREEK} fontStyle="italic" fontSize="14">ξ</tspan>
                <tspan fontFamily={HAND}> = {r.label}</tspan>
              </text>
            </g>
          );
        })}

        {/* Two pathways into the network. */}
        <path className="ink" pathLength="1" style={d(2)} d={MAGNITUDE} fill="none" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" />
        <path className="ink" pathLength="1" style={d(2.1)} d={MAGNITUDE} fill="none" stroke={ORANGE} strokeWidth="0.5" strokeLinecap="round" transform="translate(4 2)" opacity="0.6" />
        <path className="ink" pathLength="1" style={d(2.2)} d={RANKS} fill="none" stroke={INK} strokeWidth="1.1" strokeDasharray="1" strokeLinecap="round" />
        <path className="fade" style={d(2.6)} d={RANKS} fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="5 4" transform="translate(0 4)" />
        <g className="fade" style={d(3)}>
          {[0, 1, 2].map(k => (
            <g key={k}>
              <circle r="2.6" fill={ORANGE}>
                <animateMotion dur="3.2s" begin={`${-k * 1.05}s`} repeatCount="indefinite" path={MAGNITUDE} />
              </circle>
              <circle r="2.3" fill={PAPER} stroke={INK} strokeWidth="0.9">
                <animateMotion dur="3.6s" begin={`${-k * 1.2}s`} repeatCount="indefinite" path={RANKS} />
              </circle>
            </g>
          ))}
        </g>
        <text className="write" style={d(3.1)} x="372" y="318" fontFamily={HAND} fontSize="16" fill={ORANGE} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke" transform="rotate(-70 372 318)">
          magnitudes
        </text>
        <text className="write" style={d(3.2)} x="292" y="98" fontFamily={HAND} fontSize="16" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          ranks
        </text>

        {/* The network inside a dashed construction box with overshooting corners. */}
        <g fill="none" stroke={FAINT} strokeWidth="0.55">
          <path className="ink" pathLength="1" style={d(1.2)} d="M360 92 H594 M360 228 H594 M370 82 V238 M584 82 V238" />
        </g>
        <text className="fade" style={d(1.6)} x="370" y="76" fontFamily={SERIF} fontSize="10.5" fontWeight="600" letterSpacing="0.24em" fill={GRAPH}>
          DEEPSETS · TWO PATHWAYS
        </text>
        <g className="fade" style={d(2.4)}>
          {NET.slice(0, -1).map(([lx, ys], li) =>
            ys.map(y =>
              NET[li + 1][1].map(y2 => <line key={`${lx}-${y}-${y2}`} x1={lx} y1={y} x2={NET[li + 1][0]} y2={y2} stroke={GRAPH} strokeWidth="0.45" opacity="0.7" />),
            ),
          )}
        </g>
        {NET.map(([lx, ys], li) =>
          ys.map((y, k) => (
            <g key={`${lx}-${y}`} className="fade" style={d(2.5 + li * 0.15 + k * 0.05)}>
              {li === 2 && <circle className="ring" cx={lx} cy={y} r="7" fill="none" stroke={ORANGE} strokeWidth="0.8" />}
              <circle cx={lx} cy={y} r="6.5" fill={PAPER} stroke={INK} strokeWidth="1" />
              <circle cx={lx} cy={y} r="2" fill={li === 2 ? ORANGE : INK} />
            </g>
          )),
        )}
        <g className="write" style={d(3.3)} fontFamily={GREEK} fontStyle="italic" fontSize="17" fill={INK}>
          <path d="M512 138 H530 M512 182 H530" stroke={GRAPH} strokeWidth="0.5" />
          <text x="536" y="143">ξ</text>
          <text x="536" y="187">χ</text>
        </g>
        <text className="write" style={d(3.5)} x="557" y="143" fontFamily={HAND} fontSize="13" fill={GRAPH}>tail</text>
        <text className="write" style={d(3.6)} x="557" y="187" fontFamily={HAND} fontSize="13" fill={GRAPH}>together</text>

        {/* Note with leader: why two pathways. */}
        <path className="ink" pathLength="1" style={d(3.4)} d="M448 212 L462 252 H474" fill="none" stroke={GRAPH} strokeWidth="0.5" />
        <text className="write" style={d(3.6)} x="478" y="256" fontFamily={HAND} fontSize="14" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          the fix for the
        </text>
        <text className="write" style={d(3.8)} x="478" y="274" fontFamily={HAND} fontSize="14" fill={INK} stroke={PAPER} strokeWidth="3.5" paintOrder="stroke">
          identifiability flaw
        </text>

        {/* Plate title and signature. */}
        <g className="fade" style={d(3.9)}>
          <text x="40" y="506" fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}>Planche IV.</text>
          <text x="148" y="506" fontFamily={SERIF} fontSize="11" fontWeight="600" letterSpacing="0.26em" fill={GRAPH}>
            QUEUES LOURDES · INFÉRENCE AMORTIE
          </text>
          <line x1="40" x2="600" y1="515" y2="515" stroke={INK} strokeWidth="0.5" />
          <line x1="40" x2="600" y1="518" y2="518" stroke={INK} strokeWidth="0.25" />
        </g>
        <text className="write" style={d(4.3)} x="600" y="535" textAnchor="end" fontFamily={HAND} fontSize="15" fill={GRAPH}>
          Z. Zhou, MMXXVI
        </text>
      </Art>
    </Scene>
  );
};

export default TailScene;
