import React from 'react';
import PropTypes from 'prop-types';
import { COVER as C } from '@utils/cover-scene';

/*
 * Small plates for the "Beyond the Code" stories, cut in the same flat print as the cover.
 * Used in place of a photo until a real one is added.
 */

const Frame = ({ id, children, label }) => (
  <svg viewBox="0 0 320 200" role="img" aria-label={label} style={{ display: 'block', width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id={`${id}-dusk`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#f3cda6" stopOpacity="0" />
        <stop offset="1" stopColor="#f0b999" />
      </linearGradient>
    </defs>
    <rect width="320" height="200" fill={C.cream} />
    <rect y="70" width="320" height="130" fill={`url(#${id}-dusk)`} />
    {children}
  </svg>
);

Frame.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
};

// Seventeen marks around a globe, the fourth one lit.
const Globe = () => (
  <Frame id="vg" label="A globe ringed by seventeen marks for the Sustainable Development Goals">
    <circle cx="160" cy="104" r="50" fill={C.river} />
    <path d="M128 76c14-8 30-4 36 6c6 10-4 18-14 20c-12 2-20 12-30 6c-8-6-2-24 8-32Z" fill={C.hill} />
    <path d="M176 112c10-6 24-2 26 8c2 10-8 20-18 22c-10 2-16-6-16-14c0-6 2-12 8-16Z" fill={C.hill} />
    <path d="M110 104h100M118 80h84M118 128h84" stroke={C.cream} strokeWidth="0.8" opacity="0.5" />
    {Array.from({ length: 17 }, (_, i) => {
      const a = (i / 17) * Math.PI * 2 - Math.PI / 2;
      const lit = i === 3;
      return (
        <rect
          key={i}
          x="-4"
          y={lit ? -84 : -78}
          width="8"
          height={lit ? 22 : 14}
          fill={lit ? C.gold : C.ink}
          transform={`translate(160 104) rotate(${(a * 180) / Math.PI + 90})`}
        />
      );
    })}
  </Frame>
);

// An open book of figures.
const Ledger = () => (
  <Frame id="vl" label="An open book with a bar chart on one page and ruled lines on the other">
    <path d="M40 150V58l120 14v92Z" fill="#fffaf0" />
    <path d="M280 150V58l-120 14v92Z" fill="#fffaf0" />
    <path d="M160 72v92" stroke={C.ink} strokeWidth="3" />
    <path d="M40 150l120 14l120-14v8l-120 14l-120-14Z" fill={C.ink} />
    {[38, 56, 30, 68, 48].map((h, i) => (
      <rect key={i} x={58 + i * 18} y={140 - h + i * 2.1} width="11" height={h} fill={i === 3 ? C.gold : C.back} transform={`skewY(6.6) translate(0 ${-6 - i * 2.1})`} />
    ))}
    {[0, 1, 2, 3, 4, 5].map(i => (
      <path key={i} d={`M178 ${88 + i * 11 - 1}l${i === 5 ? 50 : 84} ${-(i === 5 ? 5.8 : 9.8)}`} stroke={i === 2 ? C.gold : C.hill} strokeWidth="3" />
    ))}
  </Frame>
);

// A board with a construction in chalk.
const Compass = () => (
  <Frame id="vc" label="A dark board with a circle and triangle constructed in gold chalk">
    <rect x="46" y="34" width="228" height="124" fill={C.ink} />
    <rect x="46" y="158" width="228" height="8" fill={C.back} />
    <circle cx="140" cy="98" r="40" fill="none" stroke={C.gold} strokeWidth="2" />
    <path d="M100 98h80M140 98l28-28" stroke={C.cream} strokeWidth="1.6" />
    <path d="M140 58l-34.6 60h69.2Z" fill="none" stroke={C.cream} strokeWidth="1.6" />
    <circle cx="140" cy="98" r="3" fill={C.gold} />
    <path d="M204 70h48M204 86h36M204 102h44M204 118h26" stroke={C.hill} strokeWidth="3" />
    <rect x="226" y="160" width="26" height="5" fill={C.cream} />
  </Frame>
);

const VIGNETTES = {
  '/impact/millennium-fellowship': Globe,
  '/impact/statistics-as-a-public-good': Ledger,
  '/impact/teaching': Compass,
};

export const hasVignette = slug => Boolean(VIGNETTES[slug]);

const Vignette = ({ slug }) => {
  const Art = VIGNETTES[slug];
  return Art ? <Art /> : null;
};

Vignette.propTypes = {
  slug: PropTypes.string,
};

export default Vignette;
