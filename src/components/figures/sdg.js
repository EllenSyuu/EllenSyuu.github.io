import React from 'react';
import { T, ChartSvg, useWidth, linear, f1 } from '@components/editorial';

/*
 * SDG 4 Data Revision Tracker — one indicator (4.c.1) as published in four successive
 * releases: countries with a value, by reference year. Synthetic data from the
 * repository's deterministic generator (seed 42); no real data.
 * Left: the four vintages, darkening with the age of the release. Right: reference year
 * 2021 as each release saw it, with the revision each new release added.
 */

const RELEASES = [
  {
    year: 2022,
    color: T.pale,
    w: 1.6,
    values: [42, 37, 36, 38, 40, 34, 39, 30, 38, 30, 39, 39, 25, 16],
  },
  {
    year: 2023,
    color: T.steel,
    w: 1.7,
    values: [42, 37, 36, 37, 38, 34, 38, 29, 37, 29, 38, 37, 33, 32, 13],
  },
  {
    year: 2024,
    color: T.river,
    w: 1.9,
    values: [42, 36, 34, 36, 37, 34, 38, 29, 36, 28, 38, 37, 34, 41, 25, 10],
  },
  {
    year: 2025,
    color: T.ink,
    w: 2.4,
    values: [41, 35, 34, 36, 37, 31, 36, 29, 36, 27, 38, 36, 33, 44, 32, 22, 10],
  },
];
const Y0 = 2008;
const REF = 2021;
const halo = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' };

const Lines = ({ w, h }) => {
  const narrow = w < 520;
  const m = { l: 30, r: narrow ? 12 : 64, t: 34, b: 30 };
  const x = linear([2008, 2024], [m.l, w - m.r]);
  const y = linear([0, 50], [h - m.b, m.t]);
  const path = vals => vals.map((v, i) => `${i ? 'L' : 'M'}${f1(x(Y0 + i))} ${f1(y(v))}`).join('');
  const latest = RELEASES[3].values;
  const area = `${path(latest)}L${f1(x(Y0 + latest.length - 1))} ${f1(y(0))}L${f1(x(Y0))} ${f1(
    y(0),
  )}Z`;
  const years = narrow
    ? [2008, 2012, 2016, 2020, 2024]
    : [2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];

  return (
    <ChartSvg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <g transform={`translate(${m.l} 10)`}>
        {RELEASES.map((r, i) => (
          <g key={r.year} transform={`translate(${i * (narrow ? 64 : 124)} 0)`}>
            <line x1="0" x2="18" y1="0" y2="0" stroke={r.color} strokeWidth={r.w + 1} />
            <text className="label" x="24" y="4">
              {narrow ? r.year : `${r.year} release`}
            </text>
          </g>
        ))}
      </g>

      {[0, 10, 20, 30, 40, 50].map(v => (
        <g key={v}>
          <line className="grid" x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} />
          <text className="tick" x={m.l - 8} y={y(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <path d={area} fill={T.pale} fillOpacity="0.3" />
      <line className="axis" x1={m.l} x2={w - m.r} y1={y(0)} y2={y(0)} />
      {years.map(yr => (
        <text key={yr} className="tick" x={x(yr)} y={h - m.b + 18} textAnchor="middle">
          {yr}
        </text>
      ))}

      {RELEASES.map(r => (
        <path
          key={r.year}
          d={path(r.values)}
          fill="none"
          stroke={r.color}
          strokeWidth={r.w}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {RELEASES.map(r => {
        const i = r.values.length - 1;
        return <circle key={r.year} cx={x(Y0 + i)} cy={y(r.values[i])} r="3" fill={r.color} />;
      })}

      <line
        x1={x(REF)}
        x2={x(REF)}
        y1={y(44) - 4}
        y2={y(16)}
        stroke={T.vermilion}
        strokeWidth="1.4"
      />
      <circle cx={x(REF)} cy={y(44)} r="5" fill={T.vermilion} stroke="#fff" strokeWidth="1.5" />
      <circle cx={x(REF)} cy={y(16)} r="4.5" fill="#fff" stroke={T.vermilion} strokeWidth="1.6" />
      <text className="label-strong" x={x(REF) - 9} y={y(44) - 6} textAnchor="end" style={halo}>
        44
      </text>
      <text className="label-strong" x={x(REF) - 9} y={y(16) + 4} textAnchor="end" style={halo}>
        16
      </text>

      {!narrow && (
        <g>
          <path
            d={`M${f1(x(2016.7))} ${f1(y(9))}Q${f1(x(2019))} ${f1(y(9))} ${f1(x(2020.75))} ${f1(
              y(14.5),
            )}`}
            fill="none"
            stroke={T.ink}
            strokeWidth="0.8"
          />
          <text className="label" x={x(2016.6)} y={y(9) - 4} textAnchor="end">
            The newest year is only
          </text>
          <text className="label" x={x(2016.6)} y={y(9) + 11} textAnchor="end">
            partly reported at first
          </text>
        </g>
      )}
    </ChartSvg>
  );
};

const AT = RELEASES.map(r => r.values[REF - Y0]);

const Staircase = ({ w, h }) => {
  const m = { l: 8, r: 8, t: 46, b: 30 };
  const y = linear([0, 50], [h - m.b, m.t]);
  const step = (w - m.l - m.r) / AT.length;
  const bw = Math.min(44, step * 0.6);
  return (
    <ChartSvg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <text className="label-strong" x={m.l} y="14">
        Reference year 2021,
      </text>
      <text className="label" x={m.l} y="30">
        as each release saw it
      </text>
      <line className="axis" x1={m.l} x2={w - m.r} y1={y(0)} y2={y(0)} />
      {AT.map((v, i) => {
        const cx = m.l + step * (i + 0.5);
        const prev = i ? AT[i - 1] : 0;
        return (
          <g key={RELEASES[i].year}>
            {i > 0 && (
              <rect x={cx - bw / 2} y={y(prev)} width={bw} height={y(0) - y(prev)} fill={T.pale} />
            )}
            <rect
              x={cx - bw / 2}
              y={y(v)}
              width={bw}
              height={y(prev) - y(v)}
              fill={i ? T.gold : T.river}
            />
            {i > 0 && (
              <line
                x1={cx - step + bw / 2}
                x2={cx - bw / 2}
                y1={y(prev)}
                y2={y(prev)}
                stroke={T.ink}
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            )}
            <text className="label-strong" x={cx} y={y(v) - 7} textAnchor="middle">
              {v}
            </text>
            {i > 0 && (
              <text
                className="note"
                x={cx}
                y={y(v) - 21}
                textAnchor="middle"
                style={{ fill: T.vermilionText }}>
                +{v - prev}
              </text>
            )}
            <text className="tick" x={cx} y={h - m.b + 18} textAnchor="middle">
              {RELEASES[i].year}
            </text>
          </g>
        );
      })}
    </ChartSvg>
  );
};

export const SdgVintages = () => {
  const [ref, w] = useWidth(1100);
  const side = w >= 820;
  const h = side ? 380 : Math.round(Math.max(300, w * 0.62));
  const sw = side ? Math.round(w * 0.28) : w;
  const lw = side ? w - sw - 48 : w;
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Countries with a value for indicator 4.c.1 by reference year, in the 2022 to 2025 releases. For reference year 2021 the count grows from 16 to 32, 41 and 44 as later releases fill in late data.">
      <div style={{ display: 'flex', flexDirection: side ? 'row' : 'column', gap: 48 }}>
        <Lines w={lw} h={h} />
        <Staircase w={sw} h={side ? h : 280} />
      </div>
    </div>
  );
};

export default SdgVintages;
