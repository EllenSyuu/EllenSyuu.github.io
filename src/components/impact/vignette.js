import React from 'react';
import PropTypes from 'prop-types';

/*
 * Small ink vignettes for the "Beyond the Code" stories, drawn in the same atelier language
 * as the case-study plates. Used in place of a photo until a real one is added.
 */

const INK = '#22314a';
const GRAPH = '#6f7b8c';
const FAINT = '#b4bcc7';
const PAPER = '#f1ebdf';
const ORANGE = '#cf602b';
const AMBER = '#e0a046';
const HAND = '"La Belle Aurore", cursive';
const SERIF = '"Cormorant Garamond", Georgia, serif';

const Frame = ({ id, children, label, plate }) => (
  <svg viewBox="0 0 320 200" role="img" aria-label={label} style={{ display: 'block', width: '100%', height: '100%' }}>
    <defs>
      <filter id={`${id}-wash`} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
      </filter>
      <pattern id={`${id}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M10 0 H0 V10" fill="none" stroke="#e1d9ca" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="320" height="200" fill={PAPER} />
    <rect width="320" height="200" fill={`url(#${id}-grid)`} />
    <g stroke={FAINT} strokeWidth="0.5">
      <line x1="0" x2="320" y1="168" y2="168" />
    </g>
    {children}
    <text x="14" y="190" fontFamily={SERIF} fontSize="9" fontWeight="600" letterSpacing="2" fill={GRAPH}>
      {plate}
    </text>
  </svg>
);

Frame.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  plate: PropTypes.string,
};

// A globe of meridians and parallels, ringed by the seventeen goals.
const Globe = () => (
  <Frame id="vg" label="Ink drawing of a globe ringed by seventeen marks for the Sustainable Development Goals" plate="FIG. A · LES 17 OBJECTIFS">
    <g transform="translate(160 92)">
      <g filter="url(#vg-wash)">
        <circle r="52" fill={AMBER} opacity="0.18" />
      </g>
      {Array.from({ length: 17 }, (_, i) => {
        const a0 = (i / 17) * Math.PI * 2 - Math.PI / 2;
        const a1 = a0 + (Math.PI * 2) / 17 - 0.07;
        const r = 66;
        const warm = i === 3; // goal 4, quality education
        return (
          <path
            key={i}
            d={`M${(Math.cos(a0) * r).toFixed(1)} ${(Math.sin(a0) * r).toFixed(1)} A${r} ${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)} ${(Math.sin(a1) * r).toFixed(1)}`}
            fill="none"
            stroke={warm ? ORANGE : INK}
            strokeWidth={warm ? 5 : 2.2}
            opacity={warm ? 0.9 : 0.75}
          />
        );
      })}
      <circle r="52" fill="none" stroke={INK} strokeWidth="1.1" />
      {[-34, -12, 12, 34].map(y => (
        <ellipse key={y} cx="0" cy={y} rx={Math.sqrt(52 * 52 - y * y)} ry={Math.sqrt(52 * 52 - y * y) * 0.18} fill="none" stroke={GRAPH} strokeWidth="0.6" />
      ))}
      <line x1="-52" x2="52" y1="0" y2="0" stroke={GRAPH} strokeWidth="0.6" />
      {[0.25, 0.55, 0.85].map(k => (
        <ellipse key={k} cx="0" cy="0" rx={52 * k} ry="52" fill="none" stroke={GRAPH} strokeWidth="0.6" />
      ))}
      <line x1="0" x2="0" y1="-60" y2="60" stroke={FAINT} strokeWidth="0.5" />
    </g>
    <path d="M226 50 q 14 -10 28 -8" fill="none" stroke={GRAPH} strokeWidth="0.6" />
    <text x="256" y="46" fontFamily={HAND} fontSize="13" fill={ORANGE}>goal 4</text>
  </Frame>
);

// A ruled ledger with a revision curve and a magnifier over the newest value.
const Ledger = () => (
  <Frame id="vl" label="Ink drawing of an open ledger with a line chart and a magnifying glass" plate="FIG. B · DONNÉES PUBLIQUES">
    <g transform="translate(46 30)">
      <path d="M0 8 L104 0 L104 126 L0 134 Z" fill="#fbf8f1" stroke={INK} strokeWidth="1" />
      <path d="M104 0 L208 8 L208 134 L104 126 Z" fill="#fbf8f1" stroke={INK} strokeWidth="1" />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} stroke={FAINT} strokeWidth="0.6">
          <line x1="10" x2="96" y1={22 + i * 11} y2={21.2 + i * 11 - 0.4} />
        </g>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M14 ${26 + i * 22} q 12 -4 24 0 t 24 0`} fill="none" stroke={GRAPH} strokeWidth="0.6" />
      ))}
      <g transform="translate(116 20)">
        <line x1="0" x2="0" y1="0" y2="92" stroke={INK} strokeWidth="0.7" />
        <line x1="0" x2="82" y1="92" y2="92" stroke={INK} strokeWidth="0.7" />
        <polyline points="4,80 18,70 32,62 46,50 60,42 74,30" fill="none" stroke={GRAPH} strokeWidth="0.8" strokeDasharray="3 2" />
        <polyline points="4,78 18,66 32,56 46,42 60,30 74,16" fill="none" stroke={ORANGE} strokeWidth="1.3" />
        {[4, 18, 32, 46, 60, 74].map((x, i) => (
          <circle key={x} cx={x} cy={[78, 66, 56, 42, 30, 16][i]} r="1.8" fill={ORANGE} />
        ))}
      </g>
    </g>
    <g transform="translate(248 52)">
      <circle r="18" fill="#fbf8f1" fillOpacity="0.4" stroke={INK} strokeWidth="1.4" />
      <line x1="13" y1="13" x2="32" y2="34" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </g>
    <text x="226" y="118" fontFamily={HAND} fontSize="12" fill={INK}>revised, not wrong</text>
  </Frame>
);

// A geometry construction with a compass, the way intuition comes before formulas.
const Compass = () => (
  <Frame id="vc" label="Ink drawing of a geometric construction with a compass and a hand-written formula" plate="FIG. C · L'INTUITION D'ABORD">
    <g filter="url(#vc-wash)">
      <circle cx="120" cy="100" r="40" fill={AMBER} opacity="0.2" />
    </g>
    <circle cx="120" cy="100" r="48" fill="none" stroke={INK} strokeWidth="1.1" />
    <line x1="72" x2="168" y1="100" y2="100" stroke={GRAPH} strokeWidth="0.6" />
    <line x1="120" x2="120" y1="52" y2="148" stroke={GRAPH} strokeWidth="0.6" />
    <path d="M120 100 L154 66" stroke={ORANGE} strokeWidth="1.3" />
    <path d="M140 100 A20 20 0 0 0 134 86" fill="none" stroke={ORANGE} strokeWidth="0.9" />
    <text x="146" y="94" fontFamily={HAND} fontSize="12" fill={ORANGE}>θ</text>
    <line x1="154" x2="154" y1="66" y2="100" stroke={GRAPH} strokeWidth="0.6" strokeDasharray="2 2" />
    {/* compass */}
    <g transform="translate(196 34) rotate(18)">
      <circle r="4" fill="none" stroke={INK} strokeWidth="1" />
      <line x1="-2" y1="3" x2="-22" y2="106" stroke={INK} strokeWidth="1.6" />
      <line x1="2" y1="3" x2="20" y2="104" stroke={INK} strokeWidth="1.6" />
      <path d="M20 104 l 2 8" stroke={ORANGE} strokeWidth="1.6" />
    </g>
    <text x="214" y="160" fontFamily={HAND} fontSize="15" fill={INK}>sin²θ + cos²θ = 1</text>
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
