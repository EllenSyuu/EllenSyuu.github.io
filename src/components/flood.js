import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COVER } from '@utils/cover-scene';

/*
 * The leading edge of the page as it rises over the cover: a body of water.
 * A moving wave crest, then the river's blue running down into the paper and breaking into
 * drips that lengthen as the reader scrolls (--p, set on the page by the cover stage).
 * A few drops keep falling from the drips. Colours are the cover's own river and haze.
 */

const drift = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;
const fall = keyframes`
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  12% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(var(--fall, 160px)) scale(1); opacity: 0; }
`;

// deterministic pseudo-random, so server and browser draw the same drips
const rnd = seed => {
  const x = Math.sin(seed * 999.13) * 43758.5453;
  return x - Math.floor(x);
};

const W = 1440;
const DRIPS = Array.from({ length: 38 }, (_, i) => {
  const x = (i + 0.2 + rnd(i + 1) * 0.6) * (W / 38);
  const w = 10 + rnd(i + 7) * 26;
  const len = 20 + rnd(i + 3) ** 1.6 * 190;
  return { x, w, len };
});
const DRIP_PATH = DRIPS.map(({ x, w, len }) => {
  const r = w / 2;
  // a drip hangs from the edge, narrows, and ends in a round drop
  return `M${x - r - 14},0 C${x - r},0 ${x - r * 0.55},${len * 0.35} ${x - r * 0.55},${
    len - r * 0.6
  } A${r * 0.55},${r * 0.55} 0 0 0 ${x + r * 0.55},${len - r * 0.6} C${x + r * 0.55},${
    len * 0.35
  } ${x + r},0 ${x + r + 14},0 Z`;
}).join(' ');

const DROPS = DRIPS.filter((_, i) => i % 5 === 1).map((d, i) => ({
  left: (d.x / W) * 100,
  top: d.len,
  size: 5 + (i % 3) * 2,
  delay: (i * 0.73) % 3.2,
  dur: 2.2 + (i % 4) * 0.45,
  fallBy: 120 + (i % 3) * 60,
}));

const wave = (amp, len, y) => {
  let d = `M0,${y}`;
  for (let x = 0; x <= W * 2; x += len) {
    d += ` Q${x + len / 4},${y - amp} ${x + len / 2},${y} T${x + len},${y}`;
  }
  return `${d} V200 H0 Z`;
};

const Water = styled.div`
  position: relative;
  left: calc(50% - 50vw);
  width: 100vw;
  height: clamp(300px, 52vh, 560px);
  pointer-events: none;

  .crest {
    position: absolute;
    top: -46px;
    left: 0;
    width: 100%;
    height: 60px;
    overflow: hidden;
  }
  .crest svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    animation: ${drift} 14s linear infinite;
  }
  .crest .back {
    animation-duration: 22s;
    animation-direction: reverse;
  }

  .body {
    position: absolute;
    inset: -2px 0 auto;
    height: 62%;
    background: linear-gradient(
      180deg,
      ${COVER.river} 0%,
      #4d7aa0 30%,
      #7d9cb4 62%,
      ${COVER.haze} 100%
    );
  }
  .drips {
    position: absolute;
    top: calc(62% - 3px);
    left: 0;
    width: 100%;
    height: 30%;
    transform-origin: 50% 0;
    transform: scaleY(calc(0.3 + var(--p, 0) * 0.7));
  }
  .drips svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .drop {
    position: absolute;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    background: ${COVER.haze};
    animation: ${fall} var(--dur) var(--delay) ease-in infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .crest svg,
    .drop {
      animation: none;
    }
    .drop {
      display: none;
    }
  }
`;

const Flood = () => (
  <Water aria-hidden="true">
    <div className="crest">
      <svg className="back" viewBox={`0 0 ${W * 2} 60`} preserveAspectRatio="none">
        <path d={wave(9, 260, 30)} fill="#7d9cb4" opacity="0.7" />
      </svg>
      <svg viewBox={`0 0 ${W * 2} 60`} preserveAspectRatio="none">
        <path d={wave(12, 340, 40)} fill={COVER.river} />
      </svg>
    </div>
    <div className="body" />
    <div className="drips">
      <svg viewBox={`0 0 ${W} 240`} preserveAspectRatio="none">
        <path d={DRIP_PATH} fill={COVER.haze} />
      </svg>
    </div>
    {DROPS.map((d, i) => (
      <span
        key={i}
        className="drop"
        style={{
          left: `${d.left}%`,
          top: `calc(62% + ${d.top * 0.3}px)`,
          width: d.size,
          height: d.size * 1.3,
          '--delay': `${d.delay}s`,
          '--dur': `${d.dur}s`,
          '--fall': `${d.fallBy}px`,
        }}
      />
    ))}
  </Water>
);

export default Flood;
