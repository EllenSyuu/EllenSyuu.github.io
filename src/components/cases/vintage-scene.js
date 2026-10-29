import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
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
  FACE,
  ORANGE,
  AMBER,
  RUST,
  SERIF,
  HAND,
} from './kit';

/*
 * SDG 4 Data Revision Tracker as an archivist's drafting plate. Four release sheets lie
 * stacked on the desk, each with a hand-lettered index tab; the front sheet carries the
 * chart. Release curves (countries with a value, by reference year, indicator 4.c.1) are
 * inked one after another — earlier releases in graphite, the selected one in warm ink —
 * and a dimension line on reference year 2021 measures how far later releases revised it.
 * Data: the repository's deterministic synthetic generator (seed 42) — no real data.
 */

const RELEASES = [
  { year: 2022, values: [42, 37, 36, 38, 40, 34, 39, 30, 38, 30, 39, 39, 25, 16] },
  { year: 2023, values: [42, 37, 36, 37, 38, 34, 38, 29, 37, 29, 38, 37, 33, 32, 13] },
  { year: 2024, values: [42, 36, 34, 36, 37, 34, 38, 29, 36, 28, 38, 37, 34, 41, 25, 10] },
  { year: 2025, values: [41, 35, 34, 36, 37, 31, 36, 29, 36, 27, 38, 36, 33, 44, 32, 22, 10] },
];
const AT2021 = [16, 32, 41, 44];

// Plot area on the front sheet.
const X0 = 104;
const X1 = 462;
const Y0 = 398;
const Y1 = 178;
const px = i => X0 + (i / 16) * (X1 - X0);
const py = v => Y0 - (v / 48) * (Y0 - Y1);
const curve = vals => vals.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');

// Front sheet and the stack behind it.
const SX = 56;
const SY = 104;
const SW = 470;
const SH = 344;
const OFF = [14, -11];

const Art = styled.svg`
  ${drawCss}
  .curve {
    transition: stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, stroke-width 0.6s ease,
      stroke 0.6s ease;
  }
  .dot {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 1s, opacity 0.4s, fill 0.4s;
  }
  .tab {
    transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .tabwash {
    transition: opacity 0.6s ease;
  }
  .dim {
    transition: d 0.9s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.5s ease;
  }
  .dimtext {
    transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.5s ease;
  }
`;

const Bars = ({ sel, run }) => {
  const shown = useCountUp(AT2021[sel], { decimals: 0, duration: 900, run });
  return (
    <div>
      <span className="big">
        {shown}
        <small style={{ marginLeft: 10, fontFamily: HAND, fontSize: 15, fontWeight: 400, color: GRAPH }}>
          countries, {RELEASES[sel].year} release
        </small>
      </span>
      <svg viewBox="0 -16 280 128" width="100%" aria-hidden="true" style={{ marginTop: 8 }}>
        <defs>
          <pattern id="sv-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.55" />
          </pattern>
        </defs>
        <line x1="4" x2="276" y1="92" y2="92" stroke={INK} strokeWidth="0.8" />
        {AT2021.map((v, i) => {
          const h = (v / 48) * 84;
          const on = i <= sel;
          const cur = i === sel;
          return (
            <g key={v} transform={`translate(${16 + i * 66} 0)`} style={{ opacity: cur ? 1 : on ? 0.75 : 0.25, transition: 'opacity .5s' }}>
              <rect
                x="0"
                y={92 - h}
                width="42"
                height={h}
                fill={cur ? ORANGE : 'url(#sv-hatch)'}
                fillOpacity={cur ? 0.85 : 1}
                stroke={cur ? 'none' : INK}
                strokeWidth="0.7"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '50% 100%',
                  transform: on ? 'scaleY(1)' : 'scaleY(0.05)',
                  transition: 'transform .8s cubic-bezier(.22,.8,.3,1), fill .4s',
                }}
              />
              <text x="21" y={86 - h} textAnchor="middle" fontSize="15" fill={INK} fontFamily={SERIF} fontWeight="600" style={{ opacity: on ? 1 : 0, transition: 'opacity .4s' }}>
                {v}
              </text>
              {i > 0 && (
                <text x="21" y={70 - h} textAnchor="middle" fontSize="13" fill={ORANGE} fontFamily={HAND} style={{ opacity: on ? 1 : 0, transition: 'opacity .4s' }}>
                  +{v - AT2021[i - 1]}
                </text>
              )}
              <text x="21" y="108" textAnchor="middle" fontSize="13" fill={GRAPH} fontFamily={HAND}>
                {RELEASES[i].year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// A loose inked paper clip.
const CLIP = 'M0 0 V46 C0 56 16 56 16 46 V6 C16 -2 6 -2 6 6 V40';

const VintageScene = () => {
  const scene = useScene();
  const [sel, setSel] = useState(3);
  const [manual, setManual] = useState(false);
  const [lens, setLens] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const paths = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);

  // Measure each curve so it can be drawn in with a dash offset (works in every browser).
  useEffect(() => {
    if (!scene.near) return;
    setLens(paths.current.map(p => (p && p.getTotalLength ? Math.ceil(p.getTotalLength()) + 2 : 0)));
  }, [scene.near]);

  // Autoplay: releases appear one by one, hold, then start again.
  useEffect(() => {
    if (!scene.live || manual) return undefined;
    const id = setTimeout(() => setSel(v => (v + 1) % 4), sel === 3 ? 4600 : 2600);
    return () => clearTimeout(id);
  }, [scene.live, manual, sel]);

  useEffect(() => {
    if (scene.live && !manual) setSel(0);
  }, [scene.seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const cls = drawClass(scene);
  const x21 = px(13);
  const sel21 = AT2021[sel];
  const last = RELEASES[sel].values;
  const endX = px(last.length - 1);
  const endY = py(last[last.length - 1]);

  // Construction lines overshooting the plot frame.
  const over = 16;
  const sheet = (k, i) => {
    const dx = OFF[0] * k;
    const dy = OFF[1] * k;
    return { x: SX + dx, y: SY + dy, i };
  };

  const card = (
    <div className="card" style={{ right: 18, top: 18 }}>
      <p className="tabs-hint">
        <i /> {manual ? 'release' : 'choose a release'}
      </p>
      <div className="tabs" role="group" aria-label="Data release">
        {RELEASES.map((r, i) => (
          <button
            key={r.year}
            type="button"
            aria-pressed={i === sel}
            onClick={() => {
              setManual(true);
              setSel(i);
            }}>
            {r.year}
          </button>
        ))}
      </div>
      <p className="kicker">Reference year 2021, as each release saw it</p>
      <Bars sel={sel} run={scene.live} />
      <p className="note">
        Late data keep arriving for years after a release — a trend read off one release mixes
        that in with real change.
      </p>
    </div>
  );

  return (
    <Scene
      scene={scene}
      card={card}
      label="Drafting-plate drawing of four stacked data-release sheets with a chart on the front sheet: four successive releases are inked one after another, each extending a year further and revising earlier years."
      caption="Countries with a value for indicator 4.c.1, by reference year, in four releases. Synthetic data from the repository's generator.">
      <Art
        className={cls}
        viewBox={narrow ? '14 28 750 421.875' : '0 0 960 540'}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true">
        <defs>
          <filter id="sv-wash" x="-20%" y="-30%" width="140%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="m" />
            <feGaussianBlur in="m" stdDeviation="0.9" />
          </filter>
          <pattern id="sv-grid" width={(X1 - X0) / 16} height={(Y0 - Y1) / 24} patternUnits="userSpaceOnUse" x={X0} y={Y1}>
            <path d={`M${(X1 - X0) / 16} 0 H0 V${(Y0 - Y1) / 24}`} fill="none" stroke={FAINT} strokeWidth="0.35" />
          </pattern>
          <marker id="sv-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 2 L10 5 L0 8" fill="none" stroke={GRAPH} strokeWidth="1.2" />
          </marker>
        </defs>

        <rect width="960" height="540" fill={PAPER} />

        {/* Construction: long guides through the stack's edges. */}
        <g fill="none" stroke={FAINT} strokeWidth="0.5">
          <path className="ink" pathLength="1" style={d(0)} d={`M${SX - 40} ${SY + SH} H${SX + SW + 60}`} opacity="0.7" />
          <path className="ink" pathLength="1" style={d(0.1)} d={`M${SX} ${SY + SH + 30} V${SY - 70}`} opacity="0.7" />
          <path
            className="ink"
            pathLength="1"
            style={d(0.2)}
            d={`M${SX + SW - OFF[0] * 2} ${SY + SH - OFF[1] * -2 + 24} L${SX + SW + OFF[0] * 5} ${SY + SH + OFF[1] * 5}`}
            opacity="0.7"
          />
        </g>

        {/* The stack: oldest release at the back. Each sheet has an index tab. */}
        {[0, 1, 2, 3].map(i => {
          const k = 3 - i;
          const s = sheet(k, i);
          const cur = i === sel;
          const tx = s.x + 18 + i * 92;
          return (
            <g key={i}>
              <g className="tab" style={{ transform: cur ? 'translateY(-7px)' : 'none' }}>
                <path
                  className="tabwash"
                  d={`M${tx} ${s.y + 1} L${tx + 8} ${s.y - 24} H${tx + 72} L${tx + 80} ${s.y + 1} Z`}
                  fill={AMBER}
                  opacity={cur ? 0.55 : 0}
                  filter="url(#sv-wash)"
                  style={{ mixBlendMode: 'multiply' }}
                />
                <path
                  className="ink"
                  pathLength="1"
                  style={d(0.6 + i * 0.12)}
                  d={`M${tx} ${s.y + 1} L${tx + 8} ${s.y - 24} H${tx + 72} L${tx + 80} ${s.y + 1}`}
                  fill="none"
                  stroke={cur ? RUST : INK}
                  strokeWidth={cur ? 1.1 : 0.8}
                />
                <text
                  className="write"
                  style={d(2 + i * 0.15)}
                  x={tx + 40}
                  y={s.y - 6}
                  textAnchor="middle"
                  fontFamily={HAND}
                  fontSize="17"
                  fill={cur ? RUST : INK}>
                  {RELEASES[i].year}
                </text>
              </g>
              <rect className="fade" style={d(0.3 + i * 0.1)} x={s.x} y={s.y} width={SW} height={SH} fill={i === 3 ? '#fbf8f1' : FACE} />
              <path
                className="ink"
                pathLength="1"
                style={d(0.3 + i * 0.12)}
                d={`M${s.x} ${s.y} H${s.x + SW} V${s.y + SH} H${s.x} Z`}
                fill="none"
                stroke={INK}
                strokeWidth={i === 3 ? 1.1 : 0.7}
                opacity={i === 3 ? 1 : 0.75}
              />
              {i < 3 && (
                <path
                  className="ink"
                  pathLength="1"
                  style={d(0.5 + i * 0.12)}
                  d={`M${s.x + SW - 1.5} ${s.y + 1.5} V${s.y + SH - 1.5} H${s.x + 1.5}`}
                  fill="none"
                  stroke={GRAPH}
                  strokeWidth="0.4"
                />
              )}
            </g>
          );
        })}

        {/* Front sheet: a folded corner and a paper clip. */}
        <g fill="none" stroke={INK}>
          <path className="ink" pathLength="1" style={d(1)} d={`M${SX + SW - 26} ${SY + SH} L${SX + SW} ${SY + SH - 26}`} strokeWidth="0.8" />
          <path className="fade" style={d(1)} d={`M${SX + SW - 26} ${SY + SH} L${SX + SW} ${SY + SH - 26} V${SY + SH} Z`} fill={PAPER} stroke="none" />
          <path className="fade" style={d(1.1)} d={`M${SX + SW - 26} ${SY + SH} L${SX + SW - 22} ${SY + SH - 22} L${SX + SW} ${SY + SH - 26}`} fill={FACE} stroke={INK} strokeWidth="0.6" />
          <path className="ink" pathLength="1" style={d(1.4)} d={CLIP} transform={`translate(${SX + 12} ${SY - 18}) rotate(-6)`} strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {/* Chart title, engraved small caps with a hand-lettered subtitle. */}
        <g className="fade" style={d(1.3)}>
          <text x={X0} y={SY + 34} fontFamily={SERIF} fontSize="11.5" fontWeight="600" letterSpacing="0.2em" fill={INK}>
            COUNTRIES WITH A VALUE · INDICATOR 4.C.1
          </text>
          <line x1={X0} x2={X0 + 300} y1={SY + 41} y2={SY + 41} stroke={INK} strokeWidth="0.5" />
        </g>
        <text className="write" style={d(2.2)} x={X0} y={SY + 62} fontFamily={HAND} fontSize="15" fill={GRAPH}>
          by reference year, in four releases
        </text>

        {/* Graph paper, frame and axes. */}
        <rect className="fade" style={d(1.2)} x={X0} y={Y1} width={X1 - X0} height={Y0 - Y1} fill="url(#sv-grid)" />
        <g fill="none" stroke={INK} strokeWidth="0.9">
          <path className="ink" pathLength="1" style={d(1.1)} d={`M${X0 - over} ${Y0} H${X1 + over}`} />
          <path className="ink" pathLength="1" style={d(1.2)} d={`M${X0} ${Y0 + 3} V${Y1 - over}`} />
        </g>
        <g className="fade" style={d(1.6)} fontFamily={SERIF} fontSize="12.5" fontWeight="600" fill={GRAPH}>
          {[10, 20, 30, 40].map(v => (
            <g key={v}>
              <line x1={X0 - 5} x2={X0} y1={py(v)} y2={py(v)} stroke={INK} strokeWidth="0.7" />
              <text x={X0 - 9} y={py(v) + 4} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[0, 4, 8, 12, 16].map(i => (
            <g key={i}>
              <line x1={px(i)} x2={px(i)} y1={Y0} y2={Y0 + 5} stroke={INK} strokeWidth="0.7" />
              <text x={px(i)} y={Y0 + 19} textAnchor="middle">
                {2008 + i}
              </text>
            </g>
          ))}
        </g>

        {/* Reference year 2021: dash-dot station line with a hand-lettered leader. */}
        <path className="ink" pathLength="1" style={d(1.8)} d={`M${x21} ${Y0 + 26} V${Y1 - 6}`} fill="none" stroke={RUST} strokeWidth="0.7" />
        <line className="fade" style={d(2)} x1={x21} x2={x21} y1={Y0 + 26} y2={Y1 - 6} stroke="#fbf8f1" strokeWidth="1.2" strokeDasharray="0 9 3 3" />
        <text className="write" style={d(2.6)} x={x21} y={Y0 + 41} textAnchor="middle" fontFamily={HAND} fontSize="15" fill={RUST}>
          2021, the year we follow
        </text>

        {/* Release curves: earlier ones in graphite, the selected one in warm ink with a wash. */}
        {RELEASES.map((r, i) => {
          const on = i <= sel;
          const cur = i === sel;
          const len = lens ? lens[i] : 0;
          const dash = len ? { strokeDasharray: len, strokeDashoffset: on ? 0 : len } : {};
          return (
            <g key={r.year}>
              <path
                className="curve"
                d={curve(r.values)}
                fill="none"
                stroke={AMBER}
                strokeWidth="7"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#sv-wash)"
                style={{ ...dash, opacity: cur ? 0.4 : 0, mixBlendMode: 'multiply' }}
              />
              <path
                ref={el => (paths.current[i] = el)}
                className="curve"
                d={curve(r.values)}
                fill="none"
                stroke={cur ? ORANGE : GRAPH}
                strokeWidth={cur ? 1.8 : 0.85}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ ...dash, opacity: cur ? 1 : on ? 0.8 : 0 }}
              />
              <circle
                className="dot"
                cx={px(r.values.length - 1)}
                cy={py(r.values[r.values.length - 1])}
                r={cur ? 3.6 : 2.6}
                fill={cur ? ORANGE : PAPER}
                stroke={cur ? RUST : GRAPH}
                strokeWidth="0.9"
                style={{ transform: on ? 'scale(1)' : 'scale(0)', opacity: cur ? 1 : 0.85 }}
              />
            </g>
          );
        })}

        {/* Revision on 2021: a dimension line from the first release to the selected one. */}
        <g style={{ opacity: sel > 0 ? 1 : 0, transition: 'opacity .5s' }}>
          <path
            className="dim"
            d={`M${x21 + 12} ${py(16)} V${py(sel21)}`}
            style={{ d: `path("M${x21 + 12} ${py(16)} V${py(sel21)}")` }}
            fill="none"
            stroke={RUST}
            strokeWidth="0.8"
            markerStart="url(#sv-arr)"
            markerEnd="url(#sv-arr)"
          />
          <line x1={x21 + 3} x2={x21 + 18} y1={py(16)} y2={py(16)} stroke={GRAPH} strokeWidth="0.5" />
          <text
            className="dimtext"
            x={x21 + 20}
            y={0}
            fontFamily={HAND}
            fontSize="16"
            fill={RUST}
            stroke="#fbf8f1"
            strokeWidth="3.5"
            paintOrder="stroke"
            style={{ transform: `translateY(${(py(16) + py(sel21)) / 2 + 5}px)` }}>
            +{sel21 - 16} since 2022
          </text>
        </g>

        {/* Selected release, lettered at its newest point. */}
        <text
          x={endX + 8}
          y={endY - 8}
          fontFamily={HAND}
          fontSize="15"
          fill={RUST}
          stroke="#fbf8f1"
          strokeWidth="3.5"
          paintOrder="stroke"
          style={{ transition: 'all .6s ease' }}>
          {RELEASES[sel].year}
        </text>

        {/* Note on the newest year, with a curved leader to the last point. */}
        <g className="fade" style={d(3)}>
          <path d={`M${px(14) + 4} ${Y0 - 30} Q ${px(15) + 6} ${Y0 - 34} ${px(16) - 2} ${py(10) + 6}`} fill="none" stroke={GRAPH} strokeWidth="0.55" markerEnd="url(#sv-arr)" />
        </g>
        <text className="write" style={d(3.1)} x={px(14)} y={Y0 - 24} textAnchor="end" fontFamily={HAND} fontSize="14.5" fill={GRAPH}>
          newest year: only partly reported
        </text>

        {/* An inked pencil with an amber wash, resting by the stack. */}
        <g transform="translate(560 452) rotate(-14)">
          <path className="fade" style={d(2.8)} d="M0 0 H150 V9 H0 Z" fill={AMBER} opacity="0.45" filter="url(#sv-wash)" />
          <g fill="none" stroke={INK} strokeWidth="0.8" strokeLinejoin="round">
            <path className="ink" pathLength="1" style={d(2.6)} d="M0 0 H150 L172 4.5 L150 9 H0 Z" />
            <path className="ink" pathLength="1" style={d(2.8)} d="M150 0 V9 M164 2.8 L172 4.5 L164 6.2 M-12 0 H0 V9 H-12 Z M0 3 H150" />
          </g>
          <path className="fade" style={d(2.9)} d="M-12 0 H0 V9 H-12 Z" fill={ORANGE} opacity="0.5" />
        </g>

        {/* Plate title and signature. */}
        <g className="fade" style={d(3.4)}>
          <text x={SX} y="492" fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}>
            Planche I.
          </text>
          <text x={SX + 98} y="492" fontFamily={SERIF} fontSize="11" fontWeight="600" letterSpacing="0.26em" fill={GRAPH}>
            RÉVISIONS DE DONNÉES · ODD 4
          </text>
          <line x1={SX} x2={SX + SW} y1="502" y2="502" stroke={INK} strokeWidth="0.5" />
          <line x1={SX} x2={SX + SW} y1="505" y2="505" stroke={INK} strokeWidth="0.25" />
        </g>
        <text className="write" style={d(3.8)} x={SX + SW} y="528" textAnchor="end" fontFamily={HAND} fontSize="16" fill={GRAPH}>
          Z. Zhou, MMXXVI
        </text>
      </Art>
    </Scene>
  );
};

export default VintageScene;
