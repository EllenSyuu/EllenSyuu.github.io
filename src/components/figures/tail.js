import React from 'react';
import { T, ChartSvg, useWidth, linear } from '@components/editorial';

/*
 * Selection-valid tail-index inference — from EllenSyuu/tailfm-union-band
 * (paper/preprint/generated/tab_danish.tex, tab_bench.tex; reports/phase3/danish.json).
 */

// Danish fire-insurance losses, n = 2,167: [lower, centre, upper] at each k.
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

export const TailBands = () => {
  const [ref, w] = useWidth(680);
  const h = Math.round(Math.min(420, Math.max(320, w * 0.6)));
  const m = { l: 40, r: 12, t: 40, b: 40 };
  const y = linear([0.25, 1.65], [h - m.b, m.t]);
  const step = (w - m.l - m.r) / KS.length;
  const cx = i => m.l + step * (i + 0.5);
  const off = Math.min(11, step * 0.13);

  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Danish fire-insurance losses: at five thresholds k from 19 to 317, the union band and the first-order band for the tail index ξ. All five union bands contain the interval 0.52 to 0.84.">
        <g transform={`translate(${m.l} 12)`}>
          <line
            x1="0"
            x2="18"
            y1="0"
            y2="0"
            stroke={T.river}
            strokeOpacity="0.55"
            strokeWidth="9"
          />
          <text className="label" x="26" y="4">
            union band
          </text>
          <line x1="118" x2="136" y1="0" y2="0" stroke={T.vermilion} strokeWidth="2" />
          <text className="label" x="144" y="4">
            first-order band
          </text>
        </g>

        <rect
          x={m.l}
          y={y(INTER[1])}
          width={w - m.l - m.r}
          height={y(INTER[0]) - y(INTER[1])}
          fill={T.gold}
          fillOpacity="0.22"
        />
        <line
          x1={m.l}
          x2={w - m.r}
          y1={y(INTER[0])}
          y2={y(INTER[0])}
          stroke={T.gold}
          strokeWidth="1.4"
        />
        <line
          x1={m.l}
          x2={w - m.r}
          y1={y(INTER[1])}
          y2={y(INTER[1])}
          stroke={T.gold}
          strokeWidth="1.4"
        />

        {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map(v => (
          <g key={v}>
            <line className="grid" x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} />
            <text className="tick" x={m.l - 8} y={y(v) + 4} textAnchor="end">
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {KS.map((k, i) => {
          const [ul, uc, uh] = UNION[i];
          const [fl, fc, fh] = FIRST[i];
          return (
            <g key={k}>
              <line
                x1={cx(i) - off}
                x2={cx(i) - off}
                y1={y(ul)}
                y2={y(uh)}
                stroke={T.river}
                strokeOpacity="0.55"
                strokeWidth="10"
              />
              <circle
                cx={cx(i) - off}
                cy={y(uc)}
                r="4"
                fill={T.river}
                stroke="#fff"
                strokeWidth="1.3"
              />
              <line
                x1={cx(i) + off}
                x2={cx(i) + off}
                y1={y(fl)}
                y2={y(fh)}
                stroke={T.vermilion}
                strokeWidth="2"
              />
              <circle
                cx={cx(i) + off}
                cy={y(fc)}
                r="3.2"
                fill={T.vermilion}
                stroke="#fff"
                strokeWidth="1"
              />
              <text className="tick" x={cx(i)} y={h - m.b + 20} textAnchor="middle">
                {k}
              </text>
            </g>
          );
        })}
        <line className="axis" x1={m.l} x2={w - m.r} y1={h - m.b + 4} y2={h - m.b + 4} />
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          k, number of upper order statistics
        </text>
        <text
          className="label-strong"
          x={w - m.r - 6}
          y={y(INTER[0]) + 16}
          textAnchor="end"
          style={{
            fill: '#8a6416',
            paintOrder: 'stroke',
            stroke: '#fff',
            strokeWidth: 4,
            strokeLinejoin: 'round',
          }}>
          ξ ∈ [0.52, 0.84] at every k
        </text>
        <text className="tick" x={m.l - 8} y={m.t - 14} textAnchor="end">
          ξ
        </text>
      </ChartSvg>
    </div>
  );
};

// Pre-registered benchmark: [family, rho, xi, n, union band min post-selection coverage,
// first-order interval at the Lepski-selected k]. Last four rows are outside the stated ρ range.
const BENCH = [
  ['|t|', -2, 1, 2000, 0.98, 0.86],
  ['|t|', -2, 1, 5000, 0.98, 0.88],
  ['|t|', -1, 0.5, 2000, 0.99, 0.33],
  ['|t|', -1, 0.5, 5000, 0.98, 0.28],
  ['Burr', -1, 0.5, 2000, 0.98, 0.61],
  ['Burr', -1, 0.5, 5000, 0.98, 0.59],
  ['Burr', -1, 1, 2000, 1.0, 0.65],
  ['Burr', -1, 1, 5000, 0.99, 0.52],
  ['Burr', -0.5, 0.5, 2000, 0.96, 0.03],
  ['Burr', -0.5, 0.5, 5000, 0.95, 0.05],
  ['Burr', -0.5, 1, 2000, 0.98, 0.03],
  ['Burr', -0.5, 1, 5000, 0.98, 0.03],
  ['Fréchet', -1, 0.5, 2000, 0.99, 0.84],
  ['Fréchet', -1, 0.5, 5000, 0.99, 0.79],
  ['Fréchet', -1, 1, 2000, 0.98, 0.83],
  ['Fréchet', -1, 1, 5000, 0.98, 0.78],
  ['Burr', -0.25, 0.5, 2000, 0.3, 0.01, true],
  ['Burr', -0.25, 0.5, 5000, 0.17, 0.0, true],
  ['Burr', -0.25, 1, 2000, 0.78, 0.0, true],
  ['Burr', -0.25, 1, 5000, 0.82, 0.0, true],
];

const minus = v => (v < 0 ? `−${Math.abs(v)}` : `${v}`);

export const TailCoverage = () => {
  const [ref, w] = useWidth(440);
  const lw = 162;
  const m = { l: lw, r: 12, t: 46, b: 40 };
  const row = 17;
  const gap = 30;
  const h = m.t + BENCH.length * row + gap + m.b;
  const x = linear([0, 1], [m.l, w - m.r]);
  const rowY = i => m.t + i * row + (i >= 16 ? gap : 0) + row / 2;
  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Pre-registered benchmark coverage. In all 16 settings inside the stated range, the union band's worst coverage over four selection rules is 0.95 or more; the usual interval at a selected k falls below 0.80 in 12 of them, as low as 0.03. In four settings outside the range, with ρ = −0.25, both fail.">
        <g transform={`translate(0 12)`}>
          <circle cx="5" cy="0" r="4.4" fill={T.river} />
          <text className="label" x="14" y="4">
            union band, worst of four rules
          </text>
          <circle cx="5" cy="18" r="3.8" fill="#fff" stroke={T.vermilion} strokeWidth="1.6" />
          <text className="label" x="14" y="22">
            usual interval at a selected k
          </text>
        </g>
        {[0, 0.5, 1].map(v => (
          <g key={v}>
            <line className="grid" x1={x(v)} x2={x(v)} y1={m.t - 4} y2={h - m.b + 2} />
            <text className="tick" x={x(v)} y={h - m.b + 18} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        <line
          x1={x(0.9)}
          x2={x(0.9)}
          y1={m.t - 4}
          y2={h - m.b + 2}
          stroke={T.ink}
          strokeDasharray="3 3"
        />
        <text className="note" x={x(0.9) - 4} y={h - m.b + 18} textAnchor="end">
          target 0.90
        </text>
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          coverage after choosing k from the data
        </text>
        <text className="note" x="0" y={rowY(16) - row / 2 - 9}>
          OUTSIDE THE STATED RANGE
        </text>
        {BENCH.map(([fam, rho, xi, n, u, f, out], i) => {
          const cy = rowY(i);
          const op = out ? 0.5 : 1;
          return (
            <g key={`${fam}${rho}${xi}${n}`} opacity={op}>
              {i % 2 === 0 && <rect x="0" y={cy - row / 2} width={w} height={row} fill={T.paperDeep} />}
              <text className="tick" x="0" y={cy + 4} style={{ fill: T.ink }}>
                {fam}
              </text>
              <text className="tick" x="52" y={cy + 4}>
                ρ {minus(rho)} · ξ {xi} · {n / 1000}k
              </text>
              <line
                x1={x(Math.min(u, f))}
                x2={x(Math.max(u, f))}
                y1={cy}
                y2={cy}
                stroke={T.rose}
                strokeWidth="3"
              />
              <circle
                cx={x(f)}
                cy={cy}
                r="3.6"
                fill="#fff"
                stroke={T.vermilion}
                strokeWidth="1.5"
              />
              <circle cx={x(u)} cy={cy} r="4.2" fill={T.river} />
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
};
