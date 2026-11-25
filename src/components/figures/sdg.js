import React from 'react';
import { T, ChartSvg, useWidth, linear, f1 } from '@components/editorial';

/*
 * SDG 4 Data Revision Tracker — one indicator (4.c.1) as published in four successive
 * releases: countries with a value, by reference year. Synthetic data from the
 * repository's deterministic generator (seed 42); no real data.
 */

const RELEASES = [
  { year: 2022, color: T.pale, w: 1.6, values: [42, 37, 36, 38, 40, 34, 39, 30, 38, 30, 39, 39, 25, 16] },
  { year: 2023, color: T.steel, w: 1.6, values: [42, 37, 36, 37, 38, 34, 38, 29, 37, 29, 38, 37, 33, 32, 13] },
  { year: 2024, color: T.river, w: 1.8, values: [42, 36, 34, 36, 37, 34, 38, 29, 36, 28, 38, 37, 34, 41, 25, 10] },
  { year: 2025, color: T.ink, w: 2.2, values: [41, 35, 34, 36, 37, 31, 36, 29, 36, 27, 38, 36, 33, 44, 32, 22, 10] },
];
const Y0 = 2008;
const REF = 2021;

export const SdgVintages = () => {
  const [ref, w] = useWidth(860);
  const narrow = w < 560;
  const h = Math.round(Math.min(440, Math.max(300, w * 0.46)));
  const m = { l: 30, r: narrow ? 14 : 24, t: 48, b: 30 };
  const x = linear([2008, 2024], [m.l, w - m.r]);
  const y = linear([0, 48], [h - m.b, m.t]);
  const path = vals => vals.map((v, i) => `${i ? 'L' : 'M'}${f1(x(Y0 + i))} ${f1(y(v))}`).join('');
  const years = narrow ? [2008, 2012, 2016, 2020, 2024] : [2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];
  const at = RELEASES.map(r => r.values[REF - Y0]);

  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Countries with a value for indicator 4.c.1 by reference year, in the 2022, 2023, 2024 and 2025 releases. For reference year 2021 the count grows from 16 to 32, 41 and 44 as later releases fill in late data.">
        {/* key */}
        <g transform={`translate(${m.l} 12)`}>
          <text className="note" y="4">
            Release
          </text>
          {RELEASES.map((r, i) => (
            <g key={r.year} transform={`translate(${56 + i * (narrow ? 58 : 70)} 0)`}>
              <line x1="0" x2="20" y1="0" y2="0" stroke={r.color} strokeWidth={r.w + 0.6} />
              <text className="label" x="26" y="4">
                {r.year}
              </text>
            </g>
          ))}
        </g>

        {[0, 16, 32, 48].map(v => (
          <g key={v}>
            <line className="grid" x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} />
            <text className="tick" x={m.l - 8} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <line className="axis" x1={m.l} x2={w - m.r} y1={y(0)} y2={y(0)} />
        {years.map(yr => (
          <text key={yr} className="tick" x={x(yr)} y={h - m.b + 18} textAnchor="middle">
            {yr}
          </text>
        ))}

        {/* reference year 2021 */}
        <line x1={x(REF)} x2={x(REF)} y1={m.t - 6} y2={y(0)} stroke={T.vermilion} strokeDasharray="2 3" />

        {RELEASES.map(r => (
          <path key={r.year} d={path(r.values)} fill="none" stroke={r.color} strokeWidth={r.w} strokeLinejoin="round" />
        ))}

        {at.map((v, i) => (
          <g key={RELEASES[i].year}>
            <circle cx={x(REF)} cy={y(v)} r="4" fill={T.paper} stroke={RELEASES[i].color === T.pale ? T.steel : RELEASES[i].color} strokeWidth="1.6" />
            <text
              className="label-strong"
              x={i === 2 ? x(REF) + 9 : x(REF) - 9}
              y={y(v) + 4}
              textAnchor={i === 2 ? 'start' : 'end'}
              style={{ paintOrder: 'stroke', stroke: T.paper, strokeWidth: 4, strokeLinejoin: 'round' }}>
              {v}
            </text>
          </g>
        ))}
        <text className="note" x={x(REF) + 8} y={m.t - 2} fill={T.vermilion} style={{ fill: T.vermilionText }}>
          {narrow ? '2021' : 'Reference year 2021: 16 → 44 countries'}
        </text>
      </ChartSvg>
    </div>
  );
};

export default SdgVintages;
