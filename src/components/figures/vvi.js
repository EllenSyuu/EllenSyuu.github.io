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

export const VviRecovery = () => {
  const [ref, w] = useWidth(640);
  const narrow = w < 520;
  const m = { l: narrow ? 92 : 104, r: narrow ? 8 : 132, t: 28, b: 44 };
  const row = 26;
  const groups = [
    { title: 'Hazard ratio vs BB', rows: VS_BB },
    { title: 'Contrasts', rows: CONTRASTS },
  ];
  const n = VS_BB.length + CONTRASTS.length;
  const h = m.t + n * row + 30 + m.b;
  const x = logScale([0.15, 1.6], [m.l, w - m.r]);
  const ticks = [0.2, 0.3, 0.5, 0.7, 1, 1.5];
  let yAcc = m.t;
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
            <line className="grid" x1={x(t)} x2={x(t)} y1={m.t - 8} y2={h - m.b + 4} />
            <text className="tick" x={x(t)} y={h - m.b + 20} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        <line x1={x(1)} x2={x(1)} y1={m.t - 8} y2={h - m.b + 4} stroke={T.ink} strokeWidth="1" />
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          hazard ratio of reinfection (log scale)
        </text>
        {!narrow && (
          <text className="note" x={w} y={m.t - 12} textAnchor="end">
            estimate (95% CI)
          </text>
        )}
        {groups.map((g, gi) => {
          const top = yAcc + (gi ? 22 : 0);
          yAcc = top + g.rows.length * row + 8;
          return (
            <g key={g.title}>
              <text className="note" x="0" y={top - 10}>
                {g.title.toUpperCase()}
              </text>
              {g.rows.map(([k, truth, est, lo, hi], i) => {
                const cy = top + i * row + row / 2;
                return (
                  <g key={k}>
                    <text className="label" x="0" y={cy + 4} style={{ fontFeatureSettings: '"tnum"' }}>
                      {k}
                    </text>
                    <line x1={x(lo)} x2={x(hi)} y1={cy} y2={cy} stroke={T.ink} strokeWidth="1.6" />
                    <circle cx={x(est)} cy={cy} r="3.8" fill={T.ink} />
                    <line x1={x(truth)} x2={x(truth)} y1={cy - 8} y2={cy + 8} stroke={T.vermilion} strokeWidth="2" />
                    {!narrow && (
                      <text className="tick" x={w} y={cy + 4} textAnchor="end">
                        {est.toFixed(3)} ({lo.toFixed(3)}–{hi.toFixed(3)})
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
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

        <path d={path(PERSON_DAY)} fill="none" stroke={T.steel} strokeWidth="1.8" />
        {PERSON_DAY.map(([a, b]) => (
          <circle key={a} cx={x(a)} cy={y(b)} r="3" fill={T.steel} />
        ))}
        <text className="label" x={x(last[0]) + 10} y={y(last[1]) + 4}>
          {w < 400 ? 'person-day rows' : 'person-day rows (run to 5,000)'}
        </text>

        <path d={path(AGGREGATED)} fill="none" stroke={T.vermilion} strokeWidth="2" />
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
