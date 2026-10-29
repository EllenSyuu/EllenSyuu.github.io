import React, { useEffect, useRef, useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import styled, { keyframes } from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { showResume, socialMedia } from '@config';
import TailField from '@components/tail-field';

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
const PAPER = '#f6f1e6';
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

  .scene {
    position: absolute;
    inset: 0;
    z-index: -1;

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

    @media (max-width: 900px) {
      justify-content: flex-start;
      min-height: 0;
      padding-top: calc(var(--nav-height) + 36px);
      padding-bottom: max(320px, 46svh);
    }
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0 0 20px;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    animation: ${fade} 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    &:before {
      content: '';
      width: 40px;
      height: 0.75px;
      background: currentColor;
    }
  }

  h1 {
    margin: 0;
    max-width: 11em;
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: clamp(54px, 7.4vw, 112px);
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: -0.012em;

    .w {
      display: inline-block;
      overflow: hidden;
      padding: 0.06em 0.04em 0.12em 0;
      margin-bottom: -0.12em;
      vertical-align: bottom;

      > span {
        display: inline-block;
        animation: ${up} 1.1s cubic-bezier(0.2, 0.75, 0.15, 1) both;
      }
    }

    em {
      color: var(--green);
      font-style: italic;
      font-weight: 500;
    }
    /* Phones: always two lines, whichever font is showing, so nothing reflows. */
    @media (max-width: 600px) {
      .w:nth-child(3) {
        display: block;
        width: max-content;
      }
    }
  }

  .positioning {
    max-width: 29em;
    margin: 30px 0 0;
    color: var(--light-slate);
    font-size: clamp(17px, 1.45vw, 19px);
    line-height: 1.65;
    animation: ${fade} 1s 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    em {
      font-family: var(--font-serif);
      font-size: 1.18em;
      font-style: italic;
      font-weight: 600;
      color: var(--lightest-slate);
    }
  }

  .roles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 0;
    margin: 24px 0 0;
    padding: 0;
    list-style: none;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    animation: ${fade} 1s 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    li {
      white-space: nowrap;
    }

    li + li:before {
      content: '·';
      margin: 0 14px;
      color: var(--green);
    }

    @media (max-width: 600px) {
      flex-direction: column;

      li + li:before {
        display: none;
      }
    }
  }

  .open {
    max-width: 26em;
    margin: 18px 0 0;
    color: var(--green);
    font-family: var(--font-hand);
    font-size: clamp(16px, 1.3vw, 18px);
    line-height: 1.5;
    animation: ${fade} 1s 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 26px;
    margin-top: 40px;
    animation: ${fade} 1s 1.05s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .quick {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 0;
    margin: 26px 0 0;
    padding: 0;
    list-style: none;
    animation: ${fade} 1s 1.15s cubic-bezier(0.2, 0.7, 0.2, 1) both;

    li + li:before {
      content: '·';
      margin: 0 12px;
      color: var(--green);
    }

    a {
      color: var(--dark-slate);
      font-family: var(--font-serif);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;

      &:hover,
      &:focus-visible {
        color: var(--green);
      }

      &:after {
        display: none;
      }
    }
  }

  .primary {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 15px 26px 14px;
    background: var(--lightest-slate);
    color: ${PAPER};
    font-family: var(--font-serif);
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    outline: 0.75px solid var(--lightest-slate);
    outline-offset: 4px;
    transition: var(--transition);

    .arrow {
      letter-spacing: 0;
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    &:hover,
    &:focus-visible {
      background: var(--maple);
      color: ${PAPER};
      outline-color: var(--green);

      .arrow {
        transform: translateX(4px);
      }
    }

    &:after {
      display: none;
    }
  }

  .secondary {
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: 19px;
    font-style: italic;
    font-weight: 500;
    border-bottom: 0.75px solid currentColor;
    padding-bottom: 1px;

    &:after {
      display: none;
    }

    &:hover {
      color: var(--green);
    }
  }

  /* The live copula field: a hairline inset in the sky of the drawing. */
  .sky-field {
    position: absolute;
    z-index: 0;
    right: max(15vw, calc((100vw - 1180px) / 2 + 150px));
    top: 19%;
    width: min(15vw, 236px);
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

    @media (max-width: 1100px) {
      display: none;
    }
  }

  .plate-title {
    position: absolute;
    z-index: 0;
    right: max(28px, calc((100vw - 1180px) / 2));
    bottom: 26px;
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

  .scroll {
    position: absolute;
    left: max(24px, calc((100vw - 1080px) / 2));
    bottom: 34px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;

    span {
      display: block;
      width: 0.75px;
      height: 40px;
      background: currentColor;
      animation: ${cue} 2.4s ease-in-out infinite;
    }

    &:after {
      display: none;
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

const MAPLE =
  'M0 -1 L.14 -.6 L.34 -.74 L.3 -.42 L.64 -.5 L.54 -.28 L.96 -.12 L.64 .06 L.74 .3 L.4 .22 L.34 .46 L.08 .32 L.04 .98 L-.04 .98 L-.08 .32 L-.34 .46 L-.4 .22 L-.74 .3 L-.64 .06 L-.96 -.12 L-.54 -.28 L-.64 -.5 L-.3 -.42 L-.34 -.74 L-.14 -.6 Z';

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
    const apply = () => svg.setAttribute('preserveAspectRatio', mq.matches ? 'xMaxYMax meet' : 'xMaxYMax slice');
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
              <stop offset="0" stopColor={AMBER} stopOpacity="0.35" />
              <stop offset="1" stopColor={AMBER} stopOpacity="0" />
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
              <Cloud cx={1100} cy={330} w={170} tone={ORANGE} t={0.6} />
              <Cloud cx={1500} cy={120} w={130} tone={AMBER} t={0.9} />
            </g>
            <g className="clouds b">
              <Cloud cx={1190} cy={420} w={110} tone={AMBER} t={1.1} />
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
            <g stroke={GRAPH} strokeWidth="0.6" strokeLinecap="round" className="fade" style={d(1.8)}>
              {Array.from({ length: 34 }, (_, i) => {
                const x = 960 + i * 19 + (i % 3) * 4;
                return <path key={i} d={`M${x} 800 q 2 -8 ${4 - (i % 4) * 2} -${10 + (i % 5) * 3}`} fill="none" />;
              })}
            </g>
            {[
              [1478, 774, 0.72, [ORANGE, RUST, AMBER]],
              [1560, 770, 0.6, [AMBER, ORANGE, RUST]],
            ].map(([x, y, k, tones], i) => (
              <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
                <path className="ink" pathLength="1" style={d(2 + i * 0.2)} d="M0 0 V-120 M0 -70 L-34 -110 M0 -90 L28 -126" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <g className="crown">
                  <g className="fade" style={d(2.4 + i * 0.2)}>
                    <g filter="url(#hwash)" style={{ mixBlendMode: 'multiply' }}>
                      {[[0, -150, 70], [-36, -172, 48], [36, -164, 46], [4, -200, 42]].map(([cx, cy, rr], j) => (
                        <circle key={j} cx={cx} cy={cy} r={rr} fill={tones[j % 3]} opacity="0.32" />
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
                    opacity="0.75"
                  />
                </g>
              </g>
            ))}
            <g transform="translate(1390 772)">
              <circle cx="0" cy="-116" r="13" fill={AMBER} opacity="0.3" filter="url(#hwash)" className="fade" style={d(2.4)} />
              <path className="ink" pathLength="1" style={d(2.2)} d="M0 4 V-108 M-8 -108 H8 M-6 -108 L-4 -124 H4 L6 -108" fill="none" stroke={INK} strokeWidth="1.3" />
            </g>
          </Layer>

          {/* Soften the drawing towards the text side. */}
          <rect x="900" y="0" width="150" height="900" fill="url(#hfade)" />
          <rect x="0" y="0" width="900" height="900" fill={PAPER} />

          {/* Maple branch entering from the top corner: ink twig, watercolour leaves. */}
          <Layer depth={0.3}>
            <g transform="translate(1600 96) scale(0.86)">
              <g className="branch">
                <path className="ink" pathLength="1" style={d(0.6)} d="M0 40 C -120 70 -220 60 -330 120 C -380 148 -420 150 -470 140" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                <path className="ink" pathLength="1" style={d(0.9)} d="M-200 72 C -230 110 -240 140 -238 170" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
                {[
                  [-470, 140, 34, -30, ORANGE],
                  [-420, 170, 28, 20, AMBER],
                  [-350, 110, 30, -60, RUST],
                  [-300, 160, 36, 10, ORANGE],
                  [-238, 196, 30, 30, AMBER],
                  [-180, 50, 32, -20, ORANGE],
                  [-120, 110, 38, 15, RUST],
                  [-60, 70, 30, -40, AMBER],
                ].map(([x, y, s, rot, c], i) => (
                  <g key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
                    <g className="fade" style={d(1.2 + i * 0.08)}>
                      <path d={MAPLE} fill={c} opacity="0.62" transform="translate(0.05 0.05)" />
                    </g>
                    <path className="ink" pathLength="1" style={d(1 + i * 0.08)} d={MAPLE} fill="none" stroke={INK} strokeWidth={0.9 / s} strokeLinejoin="round" />
                    <path className="ink" pathLength="1" style={d(1.3 + i * 0.08)} d="M0 0.95 L0 -0.6 M0 0 L-0.5 -0.3 M0 0 L0.5 -0.3" fill="none" stroke={INK} strokeWidth={0.6 / s} opacity="0.7" />
                  </g>
                ))}
              </g>
            </g>
          </Layer>

          {/* A few leaves crossing the whole drawing. */}
          {[
            [1100, 0, 14, ORANGE, 0],
            [1400, 0, 11, AMBER, -6],
            [900, 0, 12, RUST, -10],
          ].map(([x, y, s, c, dl]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <g className="leafFall" style={{ animationDelay: `${dl}s` }}>
                <path d={MAPLE} transform={`scale(${s})`} fill={c} opacity="0.85" />
              </g>
            </g>
          ))}
        </svg>
      </div>

      <div className="copy">
        <p className="eyebrow">Statistician &amp; data engineer · Montréal</p>
        <h1 aria-label="Ziyi (Ellen) Zhou">
          <span aria-hidden="true">
            {word('Ziyi', 0)} {word('(Ellen)', 1, true)} {word('Zhou.', 2)}
          </span>
        </h1>
        <p className="positioning">
          I model <em>rare, high-impact events</em> — floods, financial tail risk, gaps in
          education data — and build the software that makes those models trustworthy.
        </p>
        <ul className="roles">
          <li>UNESCO Institute for Statistics</li>
          <li>M.Sc. Statistics, McGill</li>
          <li>B.Sc. Statistics, HKU</li>
        </ul>
        <div className="actions">
          <Link className="primary" to="/#projects">
            Selected work <span className="arrow">→</span>
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
        </div>
        <ul className="quick" aria-label="Find me">
          {socialMedia.map(s => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name === 'Linkedin' ? 'LinkedIn' : s.name}
              </a>
            </li>
          ))}
          <li>
            <Link to="/#contact">Write to me</Link>
          </li>
        </ul>
      </div>

      <div className="sky-field" aria-hidden="true">
        {wide && <TailField animate={!prefersReducedMotion} variant="sky" />}
      </div>
      <p className="sky-note">
        <b>live, in the sky</b>how extremes cluster — a Gumbel copula, the idea behind my thesis
      </p>
      <p className="plate-title" aria-hidden="true">
        Montréal, vue du fleuve<span>Planche 0</span>
      </p>

      <Link className="scroll" to="/#about" aria-label="Scroll to About">
        <span /> Scroll
      </Link>
    </StyledHero>
  );
};

export default Hero;
