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
  S: { name: 'St-Charles-de-Mandeville', lat: 46.4, lon: -73.35, dx: 9, dy: 4, anchor: 'start' },
  L: { name: 'Lennoxville', lat: 45.37, lon: -71.82, dx: 0, dy: 18, anchor: 'middle' },
  N: { name: 'Nicolet', lat: 46.22, lon: -72.62, dx: 8, dy: -7, anchor: 'start' },
};

// Empirical lambda_U at q = 0.8, by season (tab_07_tail_dependence_empirical.csv).
const LAMBDA = {
  JJ: {
    'D-A': 0.2924,
    'D-C': 0.3179,
    'D-S': 0.2941,
    'D-L': 0.3179,
    'D-N': 0.2616,
    'A-C': 0.2299,
    'A-S': 0.4386,
    'A-L': 0.1724,
    'A-N': 0.3468,
    'C-S': 0.2601,
    'C-L': 0.2273,
    'C-N': 0.2286,
    'S-L': 0.1734,
    'S-N': 0.2907,
    'L-N': 0.2571,
  },
  ON: {
    'D-A': 0.578,
    'D-C': 0.4942,
    'D-S': 0.3571,
    'D-L': 0.3448,
    'D-N': 0.431,
    'A-C': 0.614,
    'A-S': 0.5389,
    'A-L': 0.289,
    'A-N': 0.5491,
    'C-S': 0.4217,
    'C-L': 0.3198,
    'C-N': 0.3488,
    'S-L': 0.1488,
    'S-N': 0.4167,
    'L-N': 0.2586,
  },
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

// Three classes of pairwise tail dependence; 0.2 is what independence gives.
const CLASSES = [
  { max: 0.3, color: T.pale, w: 1.4, label: 'under 0.30 — close to independent' },
  { max: 0.45, color: T.river, w: 2.6, label: '0.30 – 0.45' },
  { max: 1, color: T.vermilion, w: 4.2, label: '0.45 and over — strongly shared' },
];
const cls = l => CLASSES.find(c => l < c.max);
const halo = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' };

const Locator = ({ x, y, w }) => {
  const L = GEO.locator;
  const [lo0, lo1, la0, la1] = L.box;
  const h = w * ((la1 - la0) / ((lo1 - lo0) * Math.cos((46 * Math.PI) / 180)));
  const px = linear([lo0, lo1], [0, w]);
  const py = linear([la0, la1], [h, 0]);
  const P = ([lon, lat]) => `${f1(px(lon))} ${f1(py(lat))}`;
  const ring = pts => `${pts.map((p, i) => `${i ? 'L' : 'M'}${P(p)}`).join('')}Z`;
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect x="0" y="0" width={w} height={h} fill={T.water} stroke={T.ink} strokeWidth="0.8" />
      {L.land.map((poly, i) => (
        <path key={i} d={poly.map(ring).join('')} fill="#fff" fillRule="evenodd" />
      ))}
      {L.lakes.map((r, i) => (
        <path key={`k${i}`} d={ring(r)} fill={T.water} />
      ))}
      <rect
        x={px(BOX.lon[0])}
        y={py(BOX.lat[1])}
        width={px(BOX.lon[1]) - px(BOX.lon[0])}
        height={py(BOX.lat[0]) - py(BOX.lat[1])}
        fill="none"
        stroke={T.vermilion}
        strokeWidth="1.4"
      />
    </g>
  );
};

const SmallMap = ({ w, season, title, showNames, showLocator, id }) => {
  const h = Math.round(w * RATIO);
  const px = linear(BOX.lon, [0, w]);
  const py = linear(BOX.lat, [h, 0]);
  const P = ([lon, lat]) => `${f1(px(lon))} ${f1(py(lat))}`;
  const line = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${P(p)}`).join('');
  const ring = pts => `${line(pts)}Z`;
  const pairs = Object.entries(LAMBDA[season]).sort((a, b) => a[1] - b[1]);
  const pt = k => [px(STATIONS[k].lon), py(STATIONS[k].lat)];

  return (
    <ChartSvg
      width={w}
      height={h + 34}
      viewBox={`0 0 ${w} ${h + 34}`}
      role="img"
      aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>
        {`${title}: map of six stations in southern Québec joined by lines whose weight is the tail dependence of their monthly rainfall maxima; mean over pairs ${MEAN(
          season,
        ).toFixed(2)}.`}
      </title>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width={w} height={h} fill={T.water} />
        {GEO.land.map((poly, i) => (
          <path key={`l${i}`} d={poly.map(ring).join('')} fill={T.land} fillRule="evenodd" />
        ))}
        {GEO.lakes.map((r, i) => (
          <path key={`k${i}`} d={ring(r)} fill={T.water} />
        ))}
        {GEO.rivers.map((r, i) => (
          <path key={`r${i}`} d={line(r)} fill="none" stroke={T.water} strokeWidth="1.1" />
        ))}
        {GEO.borders.concat(GEO.nation).map((r, i) => (
          <path
            key={`b${i}`}
            d={line(r)}
            fill="none"
            stroke={T.muted}
            strokeWidth="0.8"
            strokeDasharray="4 3"
            opacity="0.7"
          />
        ))}

        {pairs.map(([k, l]) => {
          const [a, b] = k.split('-');
          const [x1, y1] = pt(a);
          const [x2, y2] = pt(b);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const d = Math.hypot(x2 - x1, y2 - y1);
          const bow = d * 0.12;
          const cx = mx + ((y1 - y2) / d) * bow;
          const cy = my + ((x2 - x1) / d) * bow;
          const c = cls(l);
          return (
            <path
              key={k}
              d={`M${f1(x1)} ${f1(y1)}Q${f1(cx)} ${f1(cy)} ${f1(x2)} ${f1(y2)}`}
              fill="none"
              stroke={c.color}
              strokeWidth={c.w}
              strokeLinecap="round"
            />
          );
        })}

        <rect
          x={px(MONTREAL.lon) - 3}
          y={py(MONTREAL.lat) - 3}
          width="6"
          height="6"
          fill={T.vermilion}
        />
        <text className="note" x={px(MONTREAL.lon) + 7} y={py(MONTREAL.lat) + 13} style={halo}>
          Montréal
        </text>

        {Object.entries(STATIONS).map(([k, s]) => {
          const [x0, y0] = pt(k);
          return (
            <g key={k}>
              <circle cx={x0} cy={y0} r="5" fill="#fff" stroke={T.ink} strokeWidth="1.8" />
              {showNames && (
                <text
                  className="label"
                  x={x0 + s.dx}
                  y={y0 + s.dy}
                  textAnchor={s.anchor}
                  style={halo}>
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
            <g transform={`translate(${(w - len) / 2} ${h - 14})`}>
              <line x1="0" x2={len} y1="0" y2="0" stroke={T.ink} strokeWidth="1.2" />
              <line x1="0" x2="0" y1="-4" y2="0" stroke={T.ink} />
              <line x1={len} x2={len} y1="-4" y2="0" stroke={T.ink} />
              <text className="note" x={len / 2} y="-7" textAnchor="middle">
                {km} km
              </text>
            </g>
          );
        })()}
        {showLocator && <Locator x={10} y={10} w={Math.min(96, w * 0.22)} />}
      </g>
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} fill="none" stroke={T.hair} />
      <text className="label-strong" x="0" y={h + 22} style={{ fontSize: 14 }}>
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
        <SmallMap id="map-jj" w={mw} season="JJ" title="June – July" showNames showLocator />
        <SmallMap id="map-on" w={mw} season="ON" title="October – November" showNames={stacked} />
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 22px', marginTop: 14 }}
        aria-hidden="true">
        {CLASSES.map(c => (
          <span
            key={c.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: T.text,
            }}>
            <svg width="30" height="10" style={{ width: 30, height: 10 }}>
              <line
                x1="2"
                x2="28"
                y1="5"
                y2="5"
                stroke={c.color}
                strokeWidth={c.w}
                strokeLinecap="round"
              />
            </svg>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ExtremalCoefficient = () => {
  const [ref, w] = useWidth(380);
  const m = { l: 64, r: 16, t: 34, b: 44 };
  const row = 40;
  const h = m.t + row * ETA.length + m.b;
  const x = linear([1, 6], [m.l, w - m.r]);
  const colour = k => (k === 'ON' ? T.vermilion : k === 'JJ' ? T.river : T.ink);
  return (
    <div ref={ref}>
      <ChartSvg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Six-station extremal coefficient by season with 90% confidence intervals: April–May 4.03, June–July 5.73, August–September 4.12, October–November 3.90. Six means the stations' extremes are independent; one means they always occur together.">
        <rect
          x={x(1)}
          y={m.t - 10}
          width={x(6) - x(1)}
          height={row * ETA.length + 14}
          fill={T.paperDeep}
        />
        {[1, 2, 3, 4, 5, 6].map(v => (
          <g key={v}>
            <line
              x1={x(v)}
              x2={x(v)}
              y1={m.t - 10}
              y2={h - m.b + 4}
              stroke="#fff"
              strokeWidth="1.5"
            />
            <text className="tick" x={x(v)} y={h - m.b + 20} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        <text className="note" x={x(1)} y="14">
          all six together
        </text>
        <text className="note" x={x(6)} y="14" textAnchor="end">
          independent
        </text>
        <text className="axis-title" x={(m.l + w - m.r) / 2} y={h - 4} textAnchor="middle">
          extremal coefficient, six stations
        </text>
        {ETA.map((e, i) => {
          const cy = m.t + row * i + row / 2 - 4;
          const c = colour(e.key);
          return (
            <g key={e.key}>
              <text
                className={e.key === 'ON' || e.key === 'JJ' ? 'label-strong' : 'label'}
                x="0"
                y={cy + 4}>
                {e.label}
              </text>
              <line
                x1={x(e.lo)}
                x2={x(e.hi)}
                y1={cy}
                y2={cy}
                stroke={c}
                strokeOpacity="0.35"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx={x(e.eta)} cy={cy} r="5.5" fill={c} stroke="#fff" strokeWidth="1.5" />
              <text
                className="label-strong"
                x={x(e.lo) - 8}
                y={cy + 4}
                textAnchor="end"
                style={{ fontSize: 11.5 }}>
                {e.eta.toFixed(2)}
              </text>
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
};
