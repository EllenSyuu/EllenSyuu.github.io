import React from 'react';

/*
 * A constructed display alphabet for section titles.
 * Every letter is built on the same module: cap height 4 units, strokes 0.6 units, from five
 * parts only — bar, disc, half-disc, triangle and a small diamond. Counters are cut in the
 * ground colour, so a letter is always one colour on one field. The parts are the shapes the
 * statistics already draws: the half-disc of a density, the triangle of the Pickands bounds,
 * the bar of a histogram.
 */

const S = 0.6; // stroke

// each glyph: { w, parts: [ [kind, ...args, ink?] ] }, ink 'bg' cuts a counter
const half = (cx, cy, r, dir) => {
  // half-disc facing dir: r(ight) l(eft) u(p) d(own)
  const p = {
    r: `M${cx},${cy - r}A${r},${r} 0 0 1 ${cx},${cy + r}Z`,
    l: `M${cx},${cy - r}A${r},${r} 0 0 0 ${cx},${cy + r}Z`,
    u: `M${cx - r},${cy}A${r},${r} 0 0 1 ${cx + r},${cy}Z`,
    d: `M${cx - r},${cy}A${r},${r} 0 0 0 ${cx + r},${cy}Z`,
  }[dir];
  return ['path', p];
};
const tri = (...pts) => ['path', `M${pts.map(p => p.join(',')).join('L')}Z`];
const rect = (x, y, w, h) => ['rect', x, y, w, h];
const disc = (cx, cy, r) => ['circle', cx, cy, r];
const dia = (cx, cy, s) => [
  'path',
  `M${cx},${cy - s}L${cx + s},${cy}L${cx},${cy + s}L${cx - s},${cy}Z`,
];
const bg = part => [...part, 'bg'];
const acc = part => [...part, 'acc'];

export const GLYPHS = {
  A: { w: 3, parts: [tri([0, 4], [1.5, 0], [3, 4]), bg(tri([1.05, 4], [1.5, 2.7], [1.95, 4]))] },
  B: {
    w: 1.75,
    parts: [
      rect(0, 0, S, 4),
      half(S - 0.04, 0.95, 0.95, 'r'),
      half(S - 0.04, 2.95, 1.05, 'r'),
      bg(disc(S + 0.02, 0.95, 0.32)),
    ],
  },
  C: {
    w: 3.3,
    parts: [disc(2, 2, 2), bg(tri([2, 2], [4.1, 0.2], [4.1, 3.8])), bg(disc(2, 2, 0.72))],
  },
  E: {
    w: 2,
    parts: [
      rect(0, 0, S, 4),
      rect(0, 0, 2, S),
      tri([S - 0.04, 1.4], [1.85, 2], [S - 0.04, 2.6]),
      rect(0, 4 - S, 2, S),
    ],
  },
  I: { w: 0.9, parts: [rect(0.15, 1.15, S, 2.85), acc(dia(0.45, 0.42, 0.42))] },
  N: {
    w: 2.7,
    parts: [rect(0, 0, S, 4), rect(2.1, 0, S, 4), ['path', 'M0,0L0.85,0L2.7,4L1.85,4Z']],
  },
  O: { w: 4, parts: [disc(2, 2, 2), bg(disc(2, 1.55, 0.7))] },
  P: {
    w: 1.85,
    parts: [rect(0, 0, S, 4), half(S - 0.04, 1.25, 1.25, 'r'), bg(disc(S + 0.02, 1.25, 0.4))],
  },
  R: {
    w: 2.1,
    parts: [
      rect(0, 0, S, 4),
      half(S - 0.04, 1.25, 1.25, 'r'),
      bg(disc(S + 0.02, 1.25, 0.4)),
      tri([S - 0.04, 2.5], [2.1, 4], [S - 0.04, 4]),
    ],
  },
  T: { w: 3, parts: [rect(0, 0, 3, S), rect(1.2, 0, S, 4), acc(dia(1.5, 1.55, 0.32))] },
  U: {
    w: 3,
    parts: [
      rect(0, 0, 3, 2.54),
      half(1.5, 2.5, 1.5, 'd'),
      bg(rect(S, -0.01, 3 - 2 * S, 2.54)),
      bg(half(1.5, 2.5, 1.5 - S, 'd')),
    ],
  },
  X: { w: 2.7, parts: [tri([0, 0], [2.7, 0], [1.35, 2]), tri([0, 4], [2.7, 4], [1.35, 2])] },
};

export const GAP = 0.5;

export const wordWidth = text =>
  [...text].reduce((s, ch, i) => s + GLYPHS[ch].w + (i ? GAP : 0), 0);

/* One line of constructed letters. `height` is the cap height in px. */
export const Word = ({ text, height, ink, ground, accent, className, style }) => {
  const W = wordWidth(text);
  let x = 0;
  const fill = k => (k === 'bg' ? ground : k === 'acc' ? accent : ink);
  return (
    <svg
      className={className}
      style={{ width: (W / 4) * height, height, ...style }}
      viewBox={`0 0 ${W} 4`}
      width={(W / 4) * height}
      height={height}
      role="img"
      aria-label={text}>
      {[...text].map((ch, i) => {
        const g = GLYPHS[ch];
        const tx = x;
        x += g.w + GAP;
        return (
          <g key={i} transform={`translate(${tx} 0)`}>
            {g.parts.map((p, j) => {
              const kind = p[p.length - 1];
              const k = kind === 'bg' || kind === 'acc' ? kind : 'ink';
              const f = fill(k);
              if (p[0] === 'rect')
                return <rect key={j} x={p[1]} y={p[2]} width={p[3]} height={p[4]} fill={f} />;
              if (p[0] === 'circle')
                return <circle key={j} cx={p[1]} cy={p[2]} r={p[3]} fill={f} />;
              return <path key={j} d={p[1]} fill={f} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};
