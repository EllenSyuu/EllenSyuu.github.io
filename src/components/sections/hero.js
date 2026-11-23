import React, { useEffect, useRef, useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import styled, { keyframes } from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { showResume, socialMedia } from '@config';
import TailField from '@components/tail-field';
import { Icon } from '@components/icons';
import { isFrost, FROST, FROST_LIGHT, SNOW } from '@utils/season';
import { MAPLE_D, VEINS_D } from '@utils/maple';

/*
 * The cover: Montréal seen from the river, drawn as an atelier plate — Mont Royal in contour
 * and hatching, a skyline in architect's elevation, the Jacques-Cartier truss, the river in
 * fine ruled lines, maples and a maple branch washed in warm watercolour. On load the whole
 * plate inks itself (construction first, then lines, then lettering). Layers move gently with
 * the pointer and with scrolling. In the sky, a hairline inset keeps the live Gumbel-copula
 * field — the idea behind the thesis.
 */

const INK = '#22314a';
const GRAPH = '#6f7b8c';
const FAINT = '#b4bcc7';
const PAPER = '#f4f2ec';
const ORANGE = '#cf602b';
const AMBER = '#e0a046';
const RUST = '#a3432a';
const HAND = '"La Belle Aurore", cursive';
const SERIF = '"Cormorant Garamond", Garamond, Georgia, serif';

const up = keyframes`
  from { transform: translateY(110%); }
  to   { transform: none; }
`;
const fade = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
`;
const drift = keyframes`
  from { transform: translateX(-40px); }
  to   { transform: translateX(40px); }
`;
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.85; }
`;
const sway = keyframes`
  0%, 100% { transform: rotate(-1.6deg); }
  50%      { transform: rotate(2deg); }
`;
const fall = keyframes`
  0%   { transform: translate(0, -60px) rotate(0deg); opacity: 0; }
  8%   { opacity: 1; }
  100% { transform: translate(-320px, 980px) rotate(620deg); opacity: 0; }
`;
const shimmer = keyframes`
  to { stroke-dashoffset: -200; }
`;
const cue = keyframes`
  0%   { transform: scaleY(0); transform-origin: top; }
  45%  { transform: scaleY(1); transform-origin: top; }
  55%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
`;

const StyledHero = styled.section`
  position: relative;
  width: 100vw;
  max-width: none;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 calc(50% - 50vw);
  padding: 0;
  overflow: hidden;
  isolation: isolate;
  background: var(--navy);
  --mx: 0;
  --my: 0;
  --sy: 0;

  /* Wide screens: the drawing is a framed plate on the right, like a print in a passe-partout —
     a hairline frame, an inner rule, the plate number in the corner and a caption below. */
  --plate-w: min(46vw, 660px);
  --plate-r: max(40px, calc((100vw - 1280px) / 2));

  .scene {
    position: absolute;
    inset: 0;
    z-index: -1;

    @media (min-width: 901px) {
      inset: auto;
      top: calc(var(--nav-height) + 6px);
      bottom: 78px;
      right: var(--plate-r);
      width: var(--plate-w);
      background: var(--navy);
      box-shadow: 0 0 0 0.75px var(--ink), 0 30px 60px -40px rgba(34, 49, 74, 0.35);
      outline: 0.75px solid var(--hairline);
      outline-offset: -10px;
      animation: ${fade} 1.2s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;

      .edge {
        display: none;
      }

    }

    @media (max-width: 900px) {
      top: auto;
      height: 44svh;
      min-height: 300px;
      overflow: hidden;
    }

    svg {
      width: 100%;
      height: 100%;

      @media (max-width: 900px) {
        position: absolute;
        bottom: 0;
        height: 175%;
      }
    }
  }

  /* Pen draw-in on load. */
  .plate {
    .ink {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset 1.6s cubic-bezier(0.55, 0.05, 0.25, 1);
    }
    .fade {
      opacity: 0;
      transition: opacity 1.3s ease;
    }
    .write {
      clip-path: inset(-30% 100% -30% 0);
      transition: clip-path 1.4s cubic-bezier(0.5, 0, 0.3, 1);
    }
    &.on .ink {
      stroke-dashoffset: 0;
    }
    &.on .fade {
      opacity: 1;
    }
    &.on .write {
      clip-path: inset(-30% -5% -30% 0);
    }
    &.still .ink,
    &.still .fade,
    &.still .write {
      transition: none;
    }
  }

  .layer {
    transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .clouds {
    animation: ${drift} 28s ease-in-out infinite alternate;
  }
  .clouds.b {
    animation-duration: 36s;
    animation-delay: -12s;
  }
  .win {
    animation: ${twinkle} 5s ease-in-out infinite;
  }
  .branch {
    transform-box: fill-box;
    transform-origin: 100% 0%;
    animation: ${sway} 8s ease-in-out infinite;
  }
  .crown {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: ${sway} 9s ease-in-out infinite;
  }
  .leafFall {
    animation: ${fall} 16s linear infinite;
  }
  .shine {
    stroke-dasharray: 26 140;
    animation: ${shimmer} 10s linear infinite;
  }

  .copy {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    min-height: 100svh;
    max-width: calc(1080px + 2 * max(24px, (100vw - 1080px) / 2));
    padding: calc(var(--nav-height) + 20px) max(24px, calc((100vw - 1080px) / 2)) 120px;

    @media (min-width: 901px) {
      max-width: none;
      padding: calc(var(--nav-height) + 10px) calc(var(--plate-w) + var(--plate-r) + clamp(40px, 5vw, 88px)) 96px
        max(40px, calc((100vw - 1280px) / 2));
    }

    @media (max-width: 900px) {
      justify-content: flex-start;
      min-height: 0;
      padding-top: calc(var(--nav-height) + 36px);
      padding-bottom: max(320px, 46svh);
    }
  }

  .eyebrow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 0;
    margin: 0 0 28px;
    padding: 0;
    list-style: none;
    color: var(--dark-slate);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    animation: ${fade} 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    &:before {
      content: '';
      width: 32px;
      height: 0.75px;
      margin-right: 16px;
      background: var(--ink);
    }

    li {
      white-space: nowrap;
    }

    @media (max-width: 600px) {
      font-size: 10.5px;
      letter-spacing: 0.13em;

      &:before {
        display: none;
      }
      li + li:before {
        margin: 0 9px 2px;
      }
    }

    li + li:before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      margin: 0 12px 2px;
      border-radius: 50%;
      background: var(--maple);
      vertical-align: middle;
    }
  }

  h1 {
    margin: 0 0 0 -0.04em;
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: clamp(60px, 7.2vw, 118px);
    font-weight: 500;
    line-height: 0.9;
    letter-spacing: -0.028em;
    white-space: nowrap;

    .w {
      display: inline-block;
      overflow: hidden;
      padding: 0.04em 0.02em 0.14em 0;
      margin-bottom: -0.14em;
      vertical-align: bottom;

      > span {
        display: inline-block;
        animation: ${up} 1.1s cubic-bezier(0.2, 0.75, 0.15, 1) both;
      }
    }
  }

  .aka {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 14px 0 0 0.2em;
    color: var(--green);
    font-family: var(--font-hand);
    font-size: clamp(20px, 1.7vw, 25px);
    line-height: 1;
    transform: rotate(-1.5deg);
    transform-origin: left;
    animation: ${fade} 1s 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    &:before {
      content: '';
      width: 28px;
      height: 0.75px;
      background: currentColor;
    }
  }

  .positioning {
    max-width: 20.5em;
    margin: 36px 0 0;
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: clamp(20px, 1.65vw, 25px);
    font-weight: 500;
    line-height: 1.32;
    letter-spacing: -0.003em;
    animation: ${fade} 1s 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    em {
      color: var(--green);
      font-style: italic;
    }
  }

  .creds {
    display: grid;
    grid-template-columns: repeat(3, auto);
    justify-content: start;
    gap: 0 40px;
    max-width: 620px;
    margin: 40px 0 0;
    padding-top: 16px;
    border-top: 0.75px solid var(--hairline);
    animation: ${fade} 1s 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    dt {
      margin-bottom: 6px;
      color: var(--dark-slate);
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      color: var(--lightest-slate);
      font-family: var(--font-sans);
      font-size: 15px;
      line-height: 1.4;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 10px;

      > div {
        display: grid;
        grid-template-columns: 64px 1fr;
        align-items: baseline;
      }

      dt {
        margin: 0;
      }
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18px 28px;
    margin-top: 40px;
    animation: ${fade} 1s 1.05s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 15px 26px;
    border-radius: 0;
    background: var(--lightest-slate);
    color: ${PAPER};
    font-family: var(--font-sans);
    font-size: 14.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    box-shadow: none;
    transition: background 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);

    .arrow {
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    &:hover,
    &:focus-visible {
      background: var(--green);
      color: ${PAPER};
      transform: translateY(-1px);

      .arrow {
        transform: translateX(4px);
      }
    }

    &:after {
      display: none;
    }
  }

  .secondary {
    position: relative;
    color: var(--lightest-slate);
    font-family: var(--font-sans);
    font-size: 14.5px;
    font-weight: 500;
    padding: 4px 0;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 0.75px;
      background: currentColor;
      transform-origin: right;
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    &:hover,
    &:focus-visible {
      color: var(--green);
      &:after {
        transform: scaleX(0.35);
      }
    }
  }

  .quick {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 0 0 0 28px;
    border-left: 0.75px solid var(--hairline);
    list-style: none;

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      color: var(--light-slate);
      transition: color 0.25s ease, background 0.25s ease;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover,
      &:focus-visible {
        color: var(--green);
        background: rgba(207, 96, 43, 0.08);
      }

      &:after {
        display: none;
      }
    }

    @media (max-width: 600px) {
      width: 100%;
      padding: 0;
      border-left: 0;
      margin-left: -10px;
    }
  }

  /* The live copula field: a hairline inset in the sky of the drawing. */
  .sky-field {
    position: absolute;
    z-index: 0;
    right: calc(var(--plate-r) + var(--plate-w) * 0.62);
    top: calc(var(--nav-height) + 6px + var(--plate-w) * 0.08);
    width: calc(var(--plate-w) * 0.3);
    aspect-ratio: 1 / 1;
    pointer-events: none;
    animation: ${fade} 1.6s 2.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    .legend {
      display: none;
    }

    @media (max-width: 900px) {
      display: none;
    }
  }

  .sky-note {
    position: absolute;
    z-index: 0;
    right: calc(max(15vw, calc((100vw - 1180px) / 2 + 150px)) + min(15vw, 236px) + 14px);
    top: calc(19% + min(15vw, 236px) * 0.12);
    max-width: 150px;
    margin: 0;
    color: var(--light-slate);
    font-family: ${HAND};
    font-size: 15px;
    line-height: 1.35;
    text-align: right;
    animation: ${fade} 1.6s 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    b {
      display: block;
      color: var(--green);
      font-weight: 400;
    }

    &:after {
      content: '';
      position: absolute;
      right: -12px;
      top: 0.6em;
      width: 10px;
      height: 0.75px;
      background: var(--light-slate);
    }

    @media (max-width: 1500px) {
      display: none;
    }
  }

  .plate-title {
    position: absolute;
    z-index: 0;
    right: var(--plate-r);
    bottom: 34px;
    margin: 0;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 17px;
    font-style: italic;
    text-align: right;
    animation: ${fade} 1.6s 2.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    span {
      margin-left: 12px;
      font-size: 11px;
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      opacity: 0.8;
    }

    @media (max-width: 900px) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *:before {
      animation: none !important;
    }
  }

  /* Phones: the text is there at once (fast first paint); the drawing appears finished. */
  @media (max-width: 900px) {
    .copy *,
    .copy *:before {
      animation: none !important;
    }
  }
`;

const MAPLE = MAPLE_D;

// Deterministic pseudo-random numbers so the drawing renders the same on server and client.
const rnd = seed => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const d = t => ({ transitionDelay: `${t}s` });

const Layer = ({ depth, children, className = '' }) => (
  <g
    className={`layer ${className}`}
    style={{
      transform: `translate(calc(var(--mx) * ${-depth * 50}px), calc(var(--my) * ${-depth * 22}px + var(--sy) * ${depth * 220}px))`,
    }}>
    {children}
  </g>
);

// Cloud outline: pen bumps climbing to the middle, and a soft underside.
const cloudPath = (cx, cy, w) => {
  const chords = [0.17, 0.23, 0.27, 0.19, 0.14];
  const lift = [0, 12, 22, 17, 7, 0].map(v => (v * w) / 140);
  let x = cx - w / 2;
  let p = `M${x.toFixed(1)} ${cy}`;
  chords.forEach((c, i) => {
    const nx = x + c * w;
    const r = Math.hypot(c * w, lift[i + 1] - lift[i]) * 0.56;
    p += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${nx.toFixed(1)} ${(cy - lift[i + 1]).toFixed(1)}`;
    x = nx;
  });
  p += ` Q${cx + w * 0.2} ${cy + 7} ${cx} ${cy + 4} T${(cx - w / 2).toFixed(1)} ${cy}`;
  return p;
};

const Cloud = ({ cx, cy, w, tone, t }) => {
  const p = cloudPath(cx, cy, w);
  return (
    <g>
      <g transform="translate(5 4)" filter="url(#hwash)">
        <g className="fade" style={d(t + 0.9)}>
          <path d={p} fill={tone} opacity="0.42" />
          <path d={p} fill="none" stroke={tone} strokeWidth="3" opacity="0.5" />
        </g>
      </g>
      <path className="ink" pathLength="1" style={d(t)} d={p} fill="none" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      <path className="ink" pathLength="1" style={d(t + 0.4)} d={cloudPath(cx + 2, cy - 1.5, w * 0.97)} fill="none" stroke={INK} strokeWidth="0.55" opacity="0.55" />
    </g>
  );
};

// Mont Royal in contour and hatching, with the summit level dimensioned.
const MOUNT = 'M930 640 C 990 604 1040 552 1100 520 C 1150 492 1200 464 1250 458 C 1306 452 1360 478 1420 504 C 1480 530 1540 552 1600 566';
// Lower edge of the snow on Mont Royal: follows the summit contour about 40 px down, ragged.
const SNOWLINE = (() => {
  const pts = [];
  for (let x = 1020; x <= 1560; x += 20) {
    const t = (x - 1020) / 540;
    const base = 560 - Math.sin(t * Math.PI) * 58;
    pts.push(`${x} ${(base + ((x / 20) % 3) * 6).toFixed(1)}`);
  }
  return `M1020 420 L${pts.join(' L')} L1560 420 Z`;
})();

const Mount = () => (
  <g>
    <clipPath id="hmount">
      <path d={`${MOUNT} V640 H930 Z`} />
    </clipPath>
    <g clipPath="url(#hmount)" stroke={GRAPH} strokeWidth="0.6" className="fade" style={d(0.9)}>
      {Array.from({ length: 70 }, (_, i) => (
        <line key={i} x1={900 + i * 11} y1="640" x2={990 + i * 11} y2="440" />
      ))}
    </g>
    {isFrost && (
      <g clipPath="url(#hmount)" className="fade" style={d(1.5)}>
        {/* First snow on the upper slopes: paper left blank, edged with a ragged frost line. */}
        <path d={SNOWLINE} fill={SNOW} />
        <path d={SNOWLINE} fill="none" stroke={FROST} strokeWidth="0.9" opacity="0.9" />
        <g stroke={FROST} strokeWidth="0.6" opacity="0.7">
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={1120 + i * 20} y1={492 + Math.abs(8 - i) * 2.2} x2={1132 + i * 20} y2={482 + Math.abs(8 - i) * 2.2} />
          ))}
        </g>
      </g>
    )}
    <g fill="none" stroke={GRAPH} strokeWidth="0.6">
      {[16, 34].map((k, i) => (
        <path key={k} className="ink" pathLength="1" style={d(0.8 + i * 0.15)} d={MOUNT} transform={`translate(${k * 0.6} ${k})`} opacity="0.7" />
      ))}
    </g>
    <path className="ink" pathLength="1" style={d(0.5)} d={MOUNT} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    {/* the cross on the summit */}
    <g className="fade" style={d(1.6)} stroke={INK} strokeWidth="1.4">
      <line x1="1290" x2="1290" y1="456" y2="418" />
      <line x1="1282" x2="1298" y1="428" y2="428" />
    </g>
    {/* summit level, dimensioned */}
    <g className="fade" style={d(2)} stroke={FAINT} strokeWidth="0.75" fill="none">
      <line x1="1040" x2="1250" y1="458" y2="458" strokeDasharray="6 5" />
      <line x1="1052" x2="1052" y1="458" y2="640" strokeDasharray="1 4" />
      <path d="M1048 462 L1056 454 M1048 644 L1056 636" stroke={INK} strokeWidth="1.1" />
    </g>
    <text className="write" style={d(2.4)} x="1060" y="520" fontFamily={HAND} fontSize="19" fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
      + 233 m
    </text>
     <text className="write" style={d(2.6)} x="1306" y="434" fontFamily={HAND} fontSize="24" fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
      Mont Royal
    </text>
  </g>
);

const Skyline = () => {
  const r = rnd(42);
  const buildings = [];
  let x = 1070;
  while (x < 1600) {
    const w = 22 + r() * 34;
    const h = 40 + Math.pow(r(), 1.7) * 160;
    buildings.push({ x, w, h, spire: r() < 0.16 });
    x += w + 3 + r() * 8;
  }
  const lit = [];
  buildings.forEach(b => {
    for (let k = 0; k < 3; k += 1) {
      if (r() < 0.45) lit.push({ x: b.x + 4 + r() * (b.w - 10), y: 640 - b.h + 10 + r() * (b.h - 24), dl: -(r() * 5) });
    }
  });
  return (
    <g>
      {/* paper behind, so the mountain hatching does not show through */}
      {buildings.map(b => (
        <rect key={`p${b.x}`} x={b.x} y={640 - b.h} width={b.w} height={b.h} fill={PAPER} />
      ))}
      <g filter="url(#hwash)" className="fade" style={d(2)}>
        {lit.map((w, k) => (
          <rect key={k} className="win" x={w.x} y={w.y} width="5" height="7" fill={AMBER} opacity="0.7" style={{ animationDelay: `${w.dl}s` }} />
        ))}
      </g>
      {isFrost && (
        <g className="fade" style={d(2.2)}>
          {buildings.map(b => (
            <path key={`s${b.x}`} d={`M${b.x - 3} ${640 - b.h} q ${b.w / 2 + 3} -5 ${b.w + 6} 0 Z`} fill={SNOW} stroke={FROST} strokeWidth="0.7" />
          ))}
        </g>
      )}
      <g fill="none" stroke={INK} strokeLinecap="round">
        {buildings.map((b, i) => (
          <path
            key={b.x}
            className="ink"
            pathLength="1"
            style={d(1 + i * 0.035)}
            d={`M${b.x} 640 V${640 - b.h - 3} M${b.x - 3} ${640 - b.h} H${b.x + b.w + 3} M${b.x + b.w} ${640 - b.h - 3} V640${b.spire ? ` M${b.x + b.w / 2} ${640 - b.h} V${640 - b.h - 26}` : ''}`}
            strokeWidth="1"
          />
        ))}
      </g>
      {/* floor lines, lightly */}
      <g stroke={GRAPH} strokeWidth="0.45" className="fade" style={d(1.8)}>
        {buildings.map(b =>
          Array.from({ length: Math.floor(b.h / 12) }, (_, k) => (
            <line key={`${b.x}-${k}`} x1={b.x + 2} x2={b.x + b.w - 2} y1={640 - b.h + 10 + k * 12} y2={640 - b.h + 10 + k * 12} opacity={k % 2 ? 0.45 : 0.8} />
          )),
        )}
      </g>
    </g>
  );
};

// The Jacques-Cartier bridge: a truss in fine ink, with its central arch.
const Bridge = () => {
  const x0 = 990;
  const x1 = 1600;
  const y = 666;
  const truss = [];
  for (let x = x0; x < x1; x += 24) truss.push(`M${x} ${y} L${x + 12} ${y - 22} L${x + 24} ${y}`);
  return (
    <g fill="none" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      <path className="ink" pathLength="1" style={d(1.6)} d={`M${x0 - 14} ${y} H${x1}`} strokeWidth="1.6" />
      <path className="ink" pathLength="1" style={d(1.7)} d={`M${x0} ${y - 22} H${x1}`} strokeWidth="1" />
      <path className="fade" style={d(2)} d={truss.join(' ')} strokeWidth="0.6" />
      <path className="ink" pathLength="1" style={d(1.9)} d={`M1200 ${y} Q 1320 ${y - 110} 1440 ${y}`} strokeWidth="1.4" />
      <path className="fade" style={d(2.2)} d={Array.from({ length: 11 }, (_, i) => {
        const xx = 1210 + i * 21;
        const t = (xx - 1200) / 240;
        const yy = y - 4 * 110 * t * (1 - t) / 2 * 2;
        return `M${xx} ${yy.toFixed(1)} V${y}`;
      }).join(' ')} strokeWidth="0.5" />
      {[1050, 1130, 1200, 1440, 1540].map((px, i) => (
        <path key={px} className="ink" pathLength="1" style={d(2 + i * 0.05)} d={`M${px - 5} ${y} V 740 M${px + 5} ${y} V 740`} strokeWidth="0.9" />
      ))}
    </g>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [on, setOn] = useState(false);
  // The live copula inset only exists on wide screens; on phones it is never mounted.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    setWide(window.matchMedia('(min-width: 901px)').matches);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // On wide screens fit the whole drawing (it never runs under the text, even on tall
  // windows); on small screens keep it cropped to fill the strip under the text.
  useEffect(() => {
    const svg = ref.current && ref.current.querySelector('.scene svg');
    if (!svg) return undefined;
    const mq = window.matchMedia('(min-width: 901px)');
    const apply = () => {
      // Wide: crop to the drawing itself so it fills its frame; phones: the full plate, cropped by CSS.
      svg.setAttribute('viewBox', mq.matches ? '900 70 700 790' : '0 0 1600 900');
      svg.setAttribute('preserveAspectRatio', mq.matches ? 'xMidYMid slice' : 'xMaxYMax slice');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Pointer and scroll parallax (desktop pointers only).
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return undefined;
    const fine = window.matchMedia('(any-pointer: fine)').matches;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      el.style.setProperty('--sy', Math.min(1, window.scrollY / window.innerHeight).toFixed(3));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = e => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      queue();
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', queue);
    };
  }, [prefersReducedMotion]);

  const word = (w, i, em) => (
    <span className="w" key={w}>
      <span style={{ animationDelay: `${0.18 + i * 0.12}s` }}>{em ? <em>{w}</em> : w}</span>
    </span>
  );

  // On phones the plate is shown already drawn (no per-line transitions), as with reduced motion.
  const still = prefersReducedMotion || !wide;
  const plateCls = `plate ${on || still ? 'on' : ''} ${still ? 'still' : ''}`;

  return (
    <StyledHero id="top" ref={ref}>
      <div className="scene" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMax slice" className={plateCls}>
          <defs>
            <filter id="hwash" x="-30%" y="-40%" width="160%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="12" result="dd" />
              <feGaussianBlur in="dd" stdDeviation="1.1" />
            </filter>
            <radialGradient id="hhalo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={isFrost ? FROST_LIGHT : AMBER} stopOpacity={isFrost ? 0.45 : 0.35} />
              <stop offset="1" stopColor={isFrost ? FROST_LIGHT : AMBER} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hleaf0" cx="0.3" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor={RUST} stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id="hleaf1" cx="0.7" cy="0.35" r="0.9">
              <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor={RUST} stopOpacity="0.7" />
            </radialGradient>
            <radialGradient id="hsun" cx="0.42" cy="0.38" r="0.7">
              <stop offset="0" stopColor="#f3dfae" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#e3bd74" stopOpacity="0.7" />
              <stop offset="1" stopColor="#c9964a" stopOpacity="0.55" />
            </radialGradient>
            <linearGradient id="hfade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={PAPER} stopOpacity="1" />
              <stop offset="1" stopColor={PAPER} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Construction: horizon and a few long guides overshooting the drawing. */}
          <g stroke={FAINT} strokeWidth="0.6" fill="none">
            <path className="ink" pathLength="1" style={d(0)} d="M900 640 H1600" />
            <path className="ink" pathLength="1" style={d(0.15)} d="M960 760 L1600 760" opacity="0.7" />
            <path className="ink" pathLength="1" style={d(0.3)} d="M1290 380 V700" opacity="0.6" />
            <path className="ink" pathLength="1" style={d(0.35)} d="M960 458 H1600" opacity="0.5" />
          </g>

          {/* Warm light behind the copula inset. */}
          <Layer depth={0.02}>
            <circle cx="1335" cy="290" r="210" fill="url(#hhalo)" className="fade" style={d(0.6)} />
          </Layer>

          <Layer depth={0.05}>
            <g className="clouds">
              <Cloud cx={isFrost ? 1400 : 1300} cy={isFrost ? 300 : 360} w={170} tone={isFrost ? FROST : ORANGE} t={0.6} />
              <Cloud cx={isFrost ? 1250 : 1500} cy={isFrost ? 150 : 120} w={130} tone={isFrost ? FROST_LIGHT : AMBER} t={0.9} />
            </g>
            <g className="clouds b">
              <Cloud cx={1190} cy={420} w={110} tone={isFrost ? FROST_LIGHT : AMBER} t={1.1} />
            </g>
          </Layer>

          <Layer depth={0.08}>
            <Mount />
          </Layer>
          <Layer depth={0.11}>
            <Skyline />
          </Layer>

          <Layer depth={0.14}>
            {/* The river in ruled lines. */}
            <g stroke={GRAPH} strokeWidth="0.55">
              {Array.from({ length: 16 }, (_, i) => (
                <path key={i} className="ink" pathLength="1" style={d(1.2 + i * 0.04)} d={`M${960 + (i % 3) * 24} ${648 + i * 7} H1600`} opacity={0.85 - i * 0.03} />
              ))}
            </g>
            <g stroke={PAPER} strokeWidth="2.2" strokeLinecap="round">
              {[655, 676, 697, 718].map((y, i) => (
                <path key={y} className="shine" d={`M${1000 + i * 40} ${y} H1600`} style={{ animationDelay: `${-i * 2.5}s` }} />
              ))}
            </g>
            {isFrost && (
              <g className="fade" style={d(2.4)} fill={SNOW} stroke={FROST} strokeWidth="0.8" strokeLinejoin="round">
                {[[1030, 712, 38], [1120, 728, 24], [1330, 704, 46], [1450, 724, 30], [1540, 700, 22], [1240, 738, 28]].map(([x, y, w]) => (
                  <path key={x} d={`M${x} ${y} l${w * 0.3} -5 l${w * 0.5} 1 l${w * 0.2} 5 l-${w * 0.35} 4 l-${w * 0.55} -1 Z`} />
                ))}
              </g>
            )}
            <Bridge />
            <text className="write" style={d(2.9)} x="1060" y="702" fontFamily={HAND} fontSize="21" fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
              Pont Jacques-Cartier
            </text>
            <text className="write" style={d(3.1)} x="1250" y="740" fontFamily={HAND} fontSize="19" fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
              Fleuve Saint-Laurent
            </text>
          </Layer>

          <Layer depth={0.2}>
            {/* Near bank: a contour, grass strokes, maples and a lamp. */}
            <path d="M900 780 C 1020 760 1120 790 1240 774 C 1380 756 1500 780 1600 768 V900 H900 Z" fill={PAPER} />
            <path className="ink" pathLength="1" style={d(1.4)} d="M900 780 C 1020 760 1120 790 1240 774 C 1380 756 1500 780 1600 768" fill="none" stroke={INK} strokeWidth="1.4" />
            {isFrost && (
              <path
                className="fade"
                style={d(1.7)}
                d="M900 781 C 1020 761 1120 791 1240 775 C 1380 757 1500 781 1600 769 V786 C 1500 796 1380 772 1240 790 C 1120 806 1020 776 900 796 Z"
                fill={SNOW}
                stroke={FROST}
                strokeWidth="0.6"
              />
            )}
            <g stroke={GRAPH} strokeWidth="0.6" strokeLinecap="round" className="fade" style={d(1.8)}>
              {Array.from({ length: isFrost ? 18 : 34 }, (_, i) => {
                const x = 960 + i * 19 + (i % 3) * 4;
                return <path key={i} d={`M${x} 800 q 2 -8 ${4 - (i % 4) * 2} -${10 + (i % 5) * 3}`} fill="none" />;
              })}
            </g>
            {[
              [1478, 774, 0.72, isFrost ? [RUST, '#b98a5a', RUST] : [ORANGE, RUST, AMBER]],
              [1560, 770, 0.6, isFrost ? ['#b98a5a', RUST, '#b98a5a'] : [AMBER, ORANGE, RUST]],
            ].map(([x, y, k, tones], i) => (
              <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
                <path className="ink" pathLength="1" style={d(2 + i * 0.2)} d="M0 0 V-120 M0 -70 L-34 -110 M0 -90 L28 -126" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <g className="crown">
                  <g className="fade" style={d(2.4 + i * 0.2)}>
                    <g filter="url(#hwash)" style={{ mixBlendMode: 'multiply' }}>
                      {[[0, -150, 70], [-36, -172, 48], [36, -164, 46], [4, -200, 42]].map(([cx, cy, rr], j) => (
                        <circle key={j} cx={cx} cy={cy} r={rr} fill={tones[j % 3]} opacity={isFrost ? 0 : 0.32} />
                      ))}
                    </g>
                  </g>
                  <path
                    className="ink"
                    pathLength="1"
                    style={d(2.3 + i * 0.2)}
                    d={Array.from({ length: 40 }, (_, j) => {
                      const a = (j / 40) * Math.PI * 2.4;
                      const rr = 72 * (0.86 + 0.14 * Math.sin(j * 1.7));
                      return `${j ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(1)} ${(-160 + Math.sin(a) * rr * 0.82).toFixed(1)}`;
                    }).join(' ')}
                    fill="none"
                    stroke={INK}
                    strokeWidth="0.7"
                    opacity={isFrost ? 0 : 0.75}
                  />
                  {isFrost && (
                    <path
                      className="ink"
                      pathLength="1"
                      style={d(2.5 + i * 0.2)}
                      d="M0 -120 L-18 -168 M-18 -168 L-34 -176 M-18 -168 L-12 -196 M0 -120 L22 -170 M22 -170 L40 -182 M22 -170 L16 -204 M-34 -110 L-58 -132 M28 -126 L54 -148 M0 -150 L4 -214"
                      fill="none"
                      stroke={INK}
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              </g>
            ))}
            <g transform="translate(1390 772)">
              <circle cx="0" cy="-116" r="13" fill={AMBER} opacity="0.3" filter="url(#hwash)" className="fade" style={d(2.4)} />
              <path className="ink" pathLength="1" style={d(2.2)} d="M0 4 V-108 M-8 -108 H8 M-6 -108 L-4 -124 H4 L6 -108" fill="none" stroke={INK} strokeWidth="1.3" />
            </g>
          </Layer>

          {/* Soften the drawing towards the text side. */}
          <rect className="edge" x="900" y="0" width="150" height="900" fill="url(#hfade)" />
          <rect className="edge" x="0" y="0" width="900" height="900" fill={PAPER} />

          {/* Maple branch entering from the top corner: ink twig, watercolour leaves. */}
          {isFrost && (
            <Layer depth={0.03}>
              {/* A low winter sun: gilt wash, hairline rings, engraved where it meets the haze. */}
              <g transform="translate(1452 236)">
                <circle r="54" fill="url(#hsun)" className="fade" style={d(0.8)} />
                <clipPath id="hsunc">
                  <rect x="-60" y="6" width="120" height="60" />
                </clipPath>
                <g clipPath="url(#hsunc)" stroke={INK} strokeWidth="0.45" opacity="0.55" className="fade" style={d(1.6)}>
                  {Array.from({ length: 9 }, (_, i) => (
                    <line key={i} x1="-60" x2="60" y1={10 + i * 5.5} y2={10 + i * 5.5} />
                  ))}
                </g>
                <circle className="ink" pathLength="1" style={d(0.7)} r="54" fill="none" stroke={INK} strokeWidth="1" />
                <circle className="ink" pathLength="1" style={d(1)} r="70" fill="none" stroke={INK} strokeWidth="0.45" opacity="0.6" />
                <circle className="ink" pathLength="1" style={d(1.2)} r="92" fill="none" stroke={FAINT} strokeWidth="0.6" strokeDasharray="1 5" />
                <path className="ink" pathLength="1" style={d(1.4)} d="M-120 0 H-98 M98 0 H120 M0 -120 V-98" stroke={INK} strokeWidth="0.6" />
              </g>
            </Layer>
          )}
          <Layer depth={0.3}>
            <g transform="translate(1600 96) scale(0.86)" style={isFrost ? { display: 'none' } : undefined}>
              <g className="branch">
                <path className="ink" pathLength="1" style={d(0.6)} d="M0 40 C -120 70 -220 60 -330 120 C -380 148 -420 150 -470 140" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                <path className="ink" pathLength="1" style={d(0.9)} d="M-200 72 C -230 110 -240 140 -238 170" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
                {isFrost && (
                  <g className="fade" style={d(1.4)} fill={SNOW} stroke={FROST} strokeWidth="1">
                    <path d="M-4 37 C -60 44 -110 50 -150 58 C -120 52 -64 40 -4 31 Z" />
                    <path d="M-250 76 C -290 90 -320 104 -352 118 C -322 100 -292 84 -250 70 Z" />
                    <path d="M-404 140 C -428 144 -448 144 -466 138 C -446 136 -428 136 -404 134 Z" />
                  </g>
                )}
                {(isFrost
                  ? [
                      [-238, 196, 30, 30, RUST],
                      [-120, 110, 34, 15, '#b98a5a'],
                      [-470, 140, 26, -30, RUST],
                    ]
                  : [
                      [-470, 140, 34, -30, ORANGE],
                      [-420, 170, 28, 20, AMBER],
                      [-350, 110, 30, -60, RUST],
                      [-300, 160, 36, 10, ORANGE],
                      [-238, 196, 30, 30, AMBER],
                      [-180, 50, 32, -20, ORANGE],
                      [-120, 110, 38, 15, RUST],
                      [-60, 70, 30, -40, AMBER],
                    ]
                ).map(([x, y, s, rot, c], i) => (
                  <g key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
                    <g className="fade" style={d(1.2 + i * 0.08)}>
                      {/* wash: a light ground, then pigment pooling towards one side */}
                      <path d={MAPLE} fill={c} opacity="0.42" transform="translate(0.04 0.04)" />
                      <path d={MAPLE} fill={`url(#hleaf${i % 2})`} opacity="0.55" transform="translate(0.04 0.04)" />
                    </g>
                    <path className="ink" pathLength="1" style={d(1 + i * 0.08)} d={MAPLE} fill="none" stroke={INK} strokeWidth={0.85 / s} strokeLinejoin="round" />
                    <path className="ink" pathLength="1" style={d(1.3 + i * 0.08)} d={VEINS_D} fill="none" stroke={INK} strokeWidth={0.5 / s} strokeLinecap="round" opacity="0.55" />
                  </g>
                ))}
              </g>
            </g>
          </Layer>

          {/* A few leaves crossing the whole drawing. */}
          {(isFrost
            ? []
            : [
                [1100, 0, 14, ORANGE, 0],
                [1400, 0, 11, AMBER, -6],
                [900, 0, 12, RUST, -10],
              ]
          ).map(([x, y, s, c, dl]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <g className="leafFall" style={{ animationDelay: `${dl}s` }}>
                <g transform={`scale(${s})`}>
                  <path d={MAPLE} fill={c} opacity="0.6" />
                  <path d={MAPLE} fill="none" stroke={INK} strokeWidth={0.8 / s} strokeLinejoin="round" />
                  <path d={VEINS_D} fill="none" stroke={INK} strokeWidth={0.5 / s} opacity="0.5" />
                </g>
              </g>
            </g>
          ))}
        </svg>
      </div>

      <div className="copy">
        <ul className="eyebrow" aria-label="Role and city">
          <li>Statistician</li>
          <li>Data engineer</li>
          <li>Montréal</li>
        </ul>
        <h1 aria-label="Ziyi (Ellen) Zhou">
          <span aria-hidden="true">
            {word('Ziyi', 0)} {word('Zhou', 1)}
          </span>
        </h1>
        <p className="aka" aria-hidden="true">
          or simply Ellen
        </p>
        <p className="positioning">
          I model <em>rare, high-impact events</em> — floods, financial tail risk, gaps in
          education data — and build the software that makes those models trustworthy.
        </p>
        <dl className="creds">
          <div>
            <dt>Now</dt>
            <dd>UNESCO Institute for Statistics</dd>
          </div>
          <div>
            <dt>M.Sc.</dt>
            <dd>Statistics, McGill</dd>
          </div>
          <div>
            <dt>B.Sc.</dt>
            <dd>Statistics, HKU</dd>
          </div>
        </dl>
        <div className="actions">
          <Link className="primary" to="/#projects">
            See selected work <span className="arrow">→</span>
          </Link>
          {showResume ? (
            <a className="secondary" href={withPrefix('/resume.pdf')} target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
          ) : (
            <Link className="secondary" to="/#jobs">
              Experience
            </Link>
          )}
          <ul className="quick" aria-label="Find me">
            {socialMedia.map(s => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name === 'Linkedin' ? 'LinkedIn' : s.name}
                  title={s.name === 'Linkedin' ? 'LinkedIn' : s.name}>
                  <Icon name={s.name} />
                </a>
              </li>
            ))}
            <li>
              <Link to="/#contact" aria-label="Write to me" title="Write to me">
                <Icon name="Mail" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="sky-field" aria-hidden="true">
        {wide && <TailField animate={!prefersReducedMotion} variant="sky" />}
      </div>
      <p className="plate-title" aria-hidden="true">
        Montréal, vue du fleuve{isFrost ? ' · premier gel' : ''}<span>Planche 0</span>
      </p>

    </StyledHero>
  );
};

export default Hero;
