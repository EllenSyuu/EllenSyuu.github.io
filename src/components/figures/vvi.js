import React from 'react';
import { T, ChartSvg, useWidth, logScale, f1 } from '@components/editorial';

/*
 * VVI — synthetic validation and scaling, from the VVI repository (README and
 * docs/benchmark.md). One synthetic cohort, seed 2024: 600,000 people. Nothing here comes
 * from the licensed Hong Kong records.
 */

// [history, planted HR, estimate, CI low, CI high] — hazard ratio vs BB.
const VS_BB = [
  ['BBB', 0.638, 0.622, 0.602, 0.644],
  ['BBI', 0.202, 0.192, 0.177, 0.209],
  ['BBBI', 0.259, 0.252, 0.237, 0.268],
  ['SS', 1.284, 1.26, 1.219, 1.303],
  ['SSS', 0.905, 0.894, 0.866, 0.923],
  ['SSI', 0.273, 0.267, 0.248, 0.287],
  ['SSSI', 0.247, 0.257, 0.24, 0.274],
];
const CONTRASTS = [
  ['BBBI vs BBI', 1.284, 1.31, 1.189, 1.443],
  ['SSSI vs SSI', 0.905, 0.96, 0.877, 1.052],
];

const decode = code => {
  const n = (code.match(/[BS]/g) || []).length;
  const inf = code.endsWith('I');
  return `${n} dose${n > 1 ? 's' : ''}${inf ? ', then infection' : ''}`;
};

export const VviRecovery = () => {
  const [ref, w] = useWidth(640);
  const narrow = w < 520;
  const m = { l: narrow ? 112 : 168, r: narrow ? 10 : 112, t: 20, b: 46 };
  const row = 28;
  const groups = [
    { title: 'Comirnaty', color: T.river, rows: VS_BB.slice(0, 3) },
    { title: 'CoronaVac', color: '#c2902f', rows: VS_BB.slice(3) },
    { title: 'Contrasts', color: T.ink, rows: CONTRASTS },
  ];
  const gap = 30;
  const n = VS_BB.length + CONTRASTS.length;
  const h = m.t + n * row + gap * groups.length + m.b;
  const x = logScale([0.15, 1.6], [m.l, w - m.r]);
  const ticks = [0.2, 0.3, 0.5, 0.7, 1, 1.5];
  let top = m.t;
  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Estimated hazard ratios with 95% confidence intervals for each vaccination–infection history, against the values planted in a synthetic cohort of 600,000 people. Every planted value lies inside its interval.">
        {ticks.map(t => (
          <g key={t}>
            <line className="grid" x1={x(t)} x2={x(t)} y1={m.t} y2={h - m.b + 4} />
            <text className="tick" x={x(t)} y={h - m.b + 20} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          hazard ratio of reinfection, log scale ← more protection
        </text>
        {groups.map(g => {
          const g0 = top + gap;
          top = g0 + g.rows.length * row;
          return (
            <g key={g.title}>
              <rect x="0" y={g0 - 19} width="10" height="10" fill={g.color} />
              <text className="label-strong" x="16" y={g0 - 10}>
                {g.title}
              </text>
              <line x1="0" x2={w} y1={g0 - 3} y2={g0 - 3} stroke={T.hair} />
              {g.rows.map(([k, truth, est, lo, hi], i) => {
                const cy = g0 + i * row + row / 2;
                return (
                  <g key={k}>
                    {i % 2 === 0 && (
                      <rect x="0" y={cy - row / 2} width={w} height={row} fill={T.paperDeep} />
                    )}
                    <text className="label-strong" x="0" y={cy + 4}>
                      {k}
                    </text>
                    {!narrow && g.title !== 'Contrasts' && (
                      <text className="note" x="46" y={cy + 4}>
                        {decode(k)}
                      </text>
                    )}
                    <line
                      x1={x(lo)}
                      x2={x(hi)}
                      y1={cy}
                      y2={cy}
                      stroke={g.color}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={x(est)}
                      cy={cy}
                      r="4.6"
                      fill={g.color}
                      stroke="#fff"
                      strokeWidth="1.3"
                    />
                    <line
                      x1={x(truth)}
                      x2={x(truth)}
                      y1={cy - 9}
                      y2={cy + 9}
                      stroke={T.vermilion}
                      strokeWidth="2"
                    />
                    {!narrow && (
                      <text className="tick" x={w} y={cy + 4} textAnchor="end">
                        {est.toFixed(2)} ({lo.toFixed(2)}–{hi.toFixed(2)})
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        <line x1={x(1)} x2={x(1)} y1={m.t} y2={h - m.b + 4} stroke={T.ink} strokeWidth="1.2" />
        {!narrow && (
          <text className="note" x={w} y={m.t + 8} textAnchor="end">
            estimate (95% CI)
          </text>
        )}
        <g transform={`translate(${m.l} ${m.t + 2})`}>
          <line x1="0" x2="0" y1="-6" y2="8" stroke={T.vermilion} strokeWidth="2" />
          <text className="note" x="7" y="5">
            planted value
          </text>
        </g>
      </ChartSvg>
    </div>
  );
};

// Build + fit time (s) by cohort size (docs/benchmark.md).
const PERSON_DAY = [
  [1000, 16.77],
  [2500, 36.52],
  [5000, 71.86],
];
const AGGREGATED = [
  [1000, 1.22],
  [2500, 1.02],
  [5000, 1.03],
  [30000, 1.39],
  [300000, 3.99],
  [1000000, 13.17],
];

export const VviScaling = () => {
  const [ref, w] = useWidth(420);
  const h = Math.round(Math.min(300, Math.max(230, w * 0.62)));
  const m = { l: 40, r: 16, t: 18, b: 40 };
  const x = logScale([800, 1.2e6], [m.l, w - m.r]);
  const y = logScale([0.7, 120], [h - m.b, m.t]);
  const path = pts => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${f1(x(a))} ${f1(y(b))}`).join('');
  const last = PERSON_DAY[PERSON_DAY.length - 1];
  const xt = [
    [1e3, '1k'],
    [1e4, '10k'],
    [1e5, '100k'],
    [1e6, '1M'],
  ];
  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Build and fit time against cohort size, log–log. The person-day model grows from 17 to 72 seconds between 1,000 and 5,000 people; the aggregated model stays near one second up to 30,000 people and fits a million people in 13 seconds.">
        {[1, 10, 100].map(v => (
          <g key={v}>
            <line className="grid" x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} />
            <text className="tick" x={m.l - 8} y={y(v) + 4} textAnchor="end">
              {v} s
            </text>
          </g>
        ))}
        {xt.map(([v, l]) => (
          <text key={l} className="tick" x={x(v)} y={h - m.b + 18} textAnchor="middle">
            {l}
          </text>
        ))}
        <line className="axis" x1={m.l} x2={w - m.r} y1={h - m.b} y2={h - m.b} />
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          people in the synthetic cohort (log scale)
        </text>

        <path
          d={`${path(PERSON_DAY)}L${f1(x(5000))} ${f1(y(1.03))}L${f1(x(2500))} ${f1(y(1.02))}L${f1(
            x(1000),
          )} ${f1(y(1.22))}Z`}
          fill={T.mist}
        />
        <line
          x1={x(5000)}
          x2={x(5000)}
          y1={y(71.86) + 6}
          y2={y(1.03) - 6}
          stroke={T.ink}
          strokeWidth="0.9"
        />
        <text className="label-strong" x={x(5000) + 8} y={y(8.6)}>
          ≈70× faster
        </text>
        <text className="note" x={x(5000) + 8} y={y(8.6) + 15}>
          at 5,000 people
        </text>
        <path d={path(PERSON_DAY)} fill="none" stroke={T.steel} strokeWidth="2" />
        {PERSON_DAY.map(([a, b]) => (
          <circle key={a} cx={x(a)} cy={y(b)} r="3" fill={T.steel} />
        ))}
        <text className="label" x={x(last[0]) + 10} y={y(last[1]) + 4}>
          {w < 400 ? 'person-day rows' : 'person-day rows (run to 5,000)'}
        </text>

        <path d={path(AGGREGATED)} fill="none" stroke={T.vermilion} strokeWidth="2.4" />
        {AGGREGATED.map(([a, b]) => (
          <circle key={a} cx={x(a)} cy={y(b)} r="3" fill={T.vermilion} />
        ))}
        <text className="label-strong" x={x(1e6) - 6} y={y(13.17) - 10} textAnchor="end">
          VVI, aggregated: 1M in 13 s
        </text>
      </ChartSvg>
    </div>
  );
};
