import React from 'react';
import { T, ChartSvg, useWidth, linear, f1 } from '@components/editorial';
import GEO from './quebec-geo.json';

/*
 * covarchimax — where heavy rain coincides. Six ECCC stations in southern Québec on a
 * Natural Earth base map (public domain): each pair of stations is joined by a line whose
 * weight is the empirical upper-tail dependence of their monthly maxima at the 0.8 quantile
 * (1930–2017), for June–July and for October–November. Under independence the value is 0.2.
 * Numbers: EllenSyuu/SAC-thesis-2026, results/tables/tab_07 and tab_20.
 */

const STATIONS = {
  D: { name: 'Drummondville', lat: 45.88, lon: -72.48, dx: 8, dy: 14, anchor: 'start' },
  A: { name: 'L’Assomption', lat: 45.8, lon: -73.42, dx: -8, dy: -7, anchor: 'end' },
  C: { name: 'Les Cèdres', lat: 45.3, lon: -74.05, dx: 0, dy: 18, anchor: 'middle' },
  S: { name: 'St-Charles-de-Mandeville', lat: 46.4, lon: -73.35, dx: 0, dy: -10, anchor: 'middle' },
  L: { name: 'Lennoxville', lat: 45.37, lon: -71.82, dx: 0, dy: 18, anchor: 'middle' },
  N: { name: 'Nicolet', lat: 46.22, lon: -72.62, dx: 8, dy: -7, anchor: 'start' },
};

// Empirical lambda_U at q = 0.8, by season (tab_07_tail_dependence_empirical.csv).
const LAMBDA = {
  JJ: { 'D-A': 0.2924, 'D-C': 0.3179, 'D-S': 0.2941, 'D-L': 0.3179, 'D-N': 0.2616, 'A-C': 0.2299, 'A-S': 0.4386, 'A-L': 0.1724, 'A-N': 0.3468, 'C-S': 0.2601, 'C-L': 0.2273, 'C-N': 0.2286, 'S-L': 0.1734, 'S-N': 0.2907, 'L-N': 0.2571 },
  ON: { 'D-A': 0.578, 'D-C': 0.4942, 'D-S': 0.3571, 'D-L': 0.3448, 'D-N': 0.431, 'A-C': 0.614, 'A-S': 0.5389, 'A-L': 0.289, 'A-N': 0.5491, 'C-S': 0.4217, 'C-L': 0.3198, 'C-N': 0.3488, 'S-L': 0.1488, 'S-N': 0.4167, 'L-N': 0.2586 },
};
const MEAN = k => Object.values(LAMBDA[k]).reduce((a, b) => a + b, 0) / 15;

// Six-station extremal coefficient by season with 90% block-bootstrap CI (tab_20).
const ETA = [
  { key: 'AM', label: 'Apr–May', eta: 4.028, lo: 3.712, hi: 4.56 },
  { key: 'JJ', label: 'Jun–Jul', eta: 5.73, lo: 5.229, hi: 6.0 },
  { key: 'AS', label: 'Aug–Sep', eta: 4.116, lo: 3.722, hi: 4.729 },
  { key: 'ON', label: 'Oct–Nov', eta: 3.896, lo: 3.602, hi: 4.327 },
];

const BOX = { lon: [-74.45, -71.45], lat: [45.05, 46.62] };
const COS = Math.cos((45.85 * Math.PI) / 180);
const RATIO = (BOX.lat[1] - BOX.lat[0]) / ((BOX.lon[1] - BOX.lon[0]) * COS);
const MONTREAL = { lat: 45.5, lon: -73.57 };

const width = l => 0.8 + Math.max(0, l - 0.14) * 15;

const SmallMap = ({ w, season, title, showNames, id }) => {
  const h = Math.round(w * RATIO);
  const px = linear(BOX.lon, [0, w]);
  const py = linear(BOX.lat, [h, 0]);
  const P = ([lon, lat]) => `${f1(px(lon))} ${f1(py(lat))}`;
  const line = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${P(p)}`).join('');
  const ring = pts => `${line(pts)}Z`;
  const pairs = Object.entries(LAMBDA[season]).sort((a, b) => a[1] - b[1]);
  const pt = k => [px(STATIONS[k].lon), py(STATIONS[k].lat)];

  return (
    <ChartSvg width={w} height={h + 34} viewBox={`0 0 ${w} ${h + 34}`} role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>
        {`${title}: map of six stations in southern Québec joined by lines whose weight is the tail dependence of their monthly rainfall maxima; mean over pairs ${MEAN(season).toFixed(2)}.`}
      </title>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width={w} height={h} fill={T.pale} />
        {GEO.land.map((poly, i) => (
          <path key={`l${i}`} d={poly.map(ring).join('')} fill={T.paper} fillRule="evenodd" />
        ))}
        {GEO.lakes.map((r, i) => (
          <path key={`k${i}`} d={ring(r)} fill={T.pale} />
        ))}
        {GEO.rivers.map((r, i) => (
          <path key={`r${i}`} d={line(r)} fill="none" stroke={T.steel} strokeOpacity="0.55" strokeWidth="0.9" />
        ))}
        {GEO.borders.concat(GEO.nation).map((r, i) => (
          <path key={`b${i}`} d={line(r)} fill="none" stroke={T.muted} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.7" />
        ))}

        {pairs.map(([k, l]) => {
          const [a, b] = k.split('-');
          const [x1, y1] = pt(a);
          const [x2, y2] = pt(b);
          return (
            <line
              key={k}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={T.ink}
              strokeOpacity={0.25 + l}
              strokeWidth={width(l)}
              strokeLinecap="round"
            />
          );
        })}

        <rect x={px(MONTREAL.lon) - 3} y={py(MONTREAL.lat) - 3} width="6" height="6" fill={T.vermilion} />
        <text className="note" x={px(MONTREAL.lon) + 7} y={py(MONTREAL.lat) + 13}>
          Montréal
        </text>

        {Object.entries(STATIONS).map(([k, s]) => {
          const [x0, y0] = pt(k);
          return (
            <g key={k}>
              <circle cx={x0} cy={y0} r="4.5" fill={T.paper} stroke={T.ink} strokeWidth="1.5" />
              {showNames && (
                <text
                  className="label"
                  x={x0 + s.dx}
                  y={y0 + s.dy}
                  textAnchor={s.anchor}
                  style={{ paintOrder: 'stroke', stroke: T.paper, strokeWidth: 3, strokeLinejoin: 'round' }}>
                  {s.name}
                </text>
              )}
            </g>
          );
        })}
        {(() => {
          const km = 50;
          const len = (km / (111.32 * COS)) * (w / (BOX.lon[1] - BOX.lon[0]));
          return (
            <g transform={`translate(${w - 14 - len} 24)`}>
              <line x1="0" x2={len} y1="0" y2="0" stroke={T.ink} strokeWidth="1.2" />
              <line x1="0" x2="0" y1="-4" y2="0" stroke={T.ink} />
              <line x1={len} x2={len} y1="-4" y2="0" stroke={T.ink} />
              <text className="note" x={len / 2} y="-7" textAnchor="middle">
                {km} km
              </text>
            </g>
          );
        })()}
      </g>
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} fill="none" stroke={T.hair} />
      <text className="label-strong" x="0" y={h + 20}>
        {title}
      </text>
      <text className="note" x={w} y={h + 20} textAnchor="end">
        mean over pairs {MEAN(season).toFixed(2)}
      </text>
    </ChartSvg>
  );
};

export const QuebecDependence = () => {
  const [ref, w] = useWidth(840);
  const stacked = w < 640;
  const gap = 24;
  const mw = stacked ? w : Math.floor((w - gap) / 2);
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', gap }}>
        <SmallMap id="map-jj" w={mw} season="JJ" title="June – July" showNames />
        <SmallMap id="map-on" w={mw} season="ON" title="October – November" showNames={stacked} />
      </div>
      <ChartSvg width={Math.min(w, 420)} height={34} viewBox={`0 0 ${Math.min(w, 420)} 34`} aria-hidden="true" style={{ marginTop: 14 }}>
        <text className="note" x="0" y="21">
          Tail dependence
        </text>
        {[0.2, 0.4, 0.6].map((l, i) => (
          <g key={l} transform={`translate(${104 + i * 92} 0)`}>
            <line x1="0" x2="34" y1="17" y2="17" stroke={T.ink} strokeOpacity={0.25 + l} strokeWidth={width(l)} strokeLinecap="round" />
            <text className="label" x="42" y="21">
              {l.toFixed(1)}
              {l === 0.2 ? '*' : ''}
            </text>
          </g>
        ))}
      </ChartSvg>
    </div>
  );
};

export const ExtremalCoefficient = () => {
  const [ref, w] = useWidth(380);
  const m = { l: 62, r: 14, t: 30, b: 40 };
  const row = 34;
  const h = m.t + row * ETA.length + m.b;
  const x = linear([3, 6], [m.l, w - m.r]);
  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Six-station extremal coefficient by season with 90% confidence intervals: April–May 4.03, June–July 5.73, August–September 4.12, October–November 3.90. Six means the stations' extremes are independent; one means they always occur together.">
        <text className="note" x={m.l} y="12">
          ← extremes more shared
        </text>
        <text className="note" x={w - m.r} y="12" textAnchor="end">
          independent →
        </text>
        {[3, 4, 5, 6].map(v => (
          <g key={v}>
            <line className="grid" x1={x(v)} x2={x(v)} y1={m.t - 6} y2={h - m.b + 4} />
            <text className="tick" x={x(v)} y={h - m.b + 20} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          extremal coefficient, six stations (1 – 6)
        </text>
        {ETA.map((e, i) => {
          const cy = m.t + row * i + row / 2;
          const hot = e.key === 'ON' || e.key === 'JJ';
          return (
            <g key={e.key}>
              <text className={hot ? 'label-strong' : 'label'} x="0" y={cy + 4}>
                {e.label}
              </text>
              <line x1={x(e.lo)} x2={x(e.hi)} y1={cy} y2={cy} stroke={T.ink} strokeWidth="1.5" />
              <circle cx={x(e.eta)} cy={cy} r="4.5" fill={e.key === 'ON' ? T.vermilion : T.ink} />
              <text className="note" x={x(e.eta)} y={cy - 9} textAnchor="middle">
                {e.eta.toFixed(2)}
              </text>
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
};
