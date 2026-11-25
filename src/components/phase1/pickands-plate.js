import React from 'react';
import styled from 'styled-components';
import { T, SANS, DISPLAY, useWidth, linear } from '@components/editorial';
import DATA from './pickands.json';

/*
 * Plate 1 — estimated Pickands dependence functions A(ω) for the 15 station pairs of the
 * M.Sc. thesis, June–July against October–November. Data: SAC-thesis-2026,
 * results/tables/tab_15_season_pickands_curves.csv (pointwise estimates, Clayton–Archimax).
 * The feasible region max(ω, 1−ω) ≤ A(ω) ≤ 1 is drawn because it is part of the mathematics,
 * not as ornament: it is the same inequality written on the whiteboard in the portrait.
 */

const PANELS = [
  {
    key: 'JJ',
    name: 'June – July',
    eta: 'network η = 5.73 (90% interval 5.23–6.00)',
    color: T.ink,
  },
  {
    key: 'ON',
    name: 'October – November',
    eta: 'network η = 3.90 (90% interval 3.60–4.33)',
    color: T.vermilion,
  },
];

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 3.4vw, 56px);
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  text {
    font-family: ${SANS};
  }
  .t {
    fill: ${T.muted};
    font-size: 11px;
  }
  .name {
    fill: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 22px;
    font-variation-settings: 'opsz' 20;
  }
  .eta {
    fill: ${T.text};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .note {
    fill: ${T.muted};
    font-size: 10.5px;
    letter-spacing: 0.04em;
  }
`;

const Panel = ({ p, w }) => {
  const H = Math.round(w * 0.64);
  const m = { l: 34, r: 8, t: 72, b: 30 };
  const x = linear([0, 1], [m.l, w - m.r]);
  const y = linear([0.5, 1], [H - m.b, m.t]);
  const curves = Object.entries(DATA[p.key]).map(([pair, pts]) => {
    const all = [[0, 1], ...pts, [1, 1]];
    return {
      pair,
      d: all.map(([a, b], i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(b).toFixed(1)}`).join(''),
    };
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      role="img"
      aria-label={`${p.name}: estimated Pickands dependence functions for 15 station pairs`}>
      <text className="name" x={m.l} y={22}>
        {p.name}
      </text>
      <text className="eta" x={m.l} y={42}>
        {p.eta}
      </text>
      <line x1={x(0)} x2={x(1)} y1={y(1)} y2={y(1)} stroke={T.ink} strokeWidth="1" />
      <path
        d={`M${x(0)},${y(1)}L${x(0.5)},${y(0.5)}L${x(1)},${y(1)}`}
        fill="none"
        stroke={T.ink}
        strokeWidth="0.75"
        strokeDasharray="2 3"
      />
      {curves.map(c => (
        <path
          key={c.pair}
          d={c.d}
          fill="none"
          stroke={p.color}
          strokeWidth="1.15"
          strokeOpacity="0.78"
          strokeLinejoin="round">
          <title>{c.pair}</title>
        </path>
      ))}
      <text className="note" x={x(0.5)} y={y(1) - 7} textAnchor="middle">
        A = 1 · independence
      </text>
      <text className="note" x={x(0.5) + 18} y={y(0.5) - 16}>
        <tspan x={x(0.5) + 18}>max(ω, 1 − ω)</tspan>
        <tspan x={x(0.5) + 18} dy="13">
          complete dependence
        </tspan>
      </text>
      {[0.5, 0.75, 1].map(v => (
        <text key={v} className="t" x={m.l - 8} y={y(v) + 4} textAnchor="end">
          {v}
        </text>
      ))}
      <text className="t" x={w - m.r} y={H - 8} textAnchor="end" dx="-14">
        ω
      </text>
      {[0, 0.5, 1].map(v => (
        <text key={v} className="t" x={x(v)} y={H - 8} textAnchor="middle">
          {v === 0.5 ? '' : v}
        </text>
      ))}
    </svg>
  );
};

const PickandsPlate = () => {
  const [ref, width] = useWidth(1180);
  const w = width < 700 ? width : (width - Math.max(24, Math.min(56, width * 0.034))) / 2;
  return (
    <Wrap ref={ref}>
      {PANELS.map(p => (
        <Panel key={p.key} p={p} w={Math.max(280, Math.round(w))} />
      ))}
    </Wrap>
  );
};

export default PickandsPlate;
