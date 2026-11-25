import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COVER } from '@utils/cover-scene';

/*
 * The case-study plates, cut in the same flat print as the cover: blues and gold over a wash of
 * dusk, no outlines, no handwriting. Each takes the data its scene already holds.
 */

const C = { ...COVER, sheet: '#fffaf0' };
const SANS = 'Inter, system-ui, sans-serif';
const DISPLAY = '"Bodoni Moda Variable", Didot, serif';

const fall = keyframes`
  0%   { transform: translateY(-8px); opacity: 0; }
  25%  { opacity: 1; }
  100% { transform: translateY(16px); opacity: 0; }
`;
const drift = keyframes`
  from { transform: translateX(-12px); }
  to   { transform: translateX(12px); }
`;
const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
`;
const flow = keyframes`
  to { stroke-dashoffset: -1; }
`;
const pulse = keyframes`
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0; }
`;

const Svg = styled.svg`
  .rain path {
    animation: ${fall} 1.1s linear infinite;
  }
  .cloud {
    animation: ${drift} 9s ease-in-out infinite alternate;
  }
  .tw {
    animation: ${twinkle} 5s ease-in-out infinite;
  }
  .flow {
    stroke-dasharray: 0.09 0.91;
    animation: ${flow} 3.2s linear infinite;
  }
  .pulse {
    transform-box: fill-box;
    transform-origin: center;
    animation: ${pulse} 2.2s ease-out infinite;
  }
  .ripple {
    animation: ${drift} 6s ease-in-out infinite alternate;
  }
  .grow {
    transform-box: fill-box;
    transform-origin: center;
    transform: scaleY(0);
    opacity: 0;
    transition: transform 1s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.4s ease;
  }
  &.on .grow {
    transform: none;
    opacity: 1;
  }
  &.still .grow {
    transition: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .rain path,
    .cloud,
    .tw,
    .flow,
    .pulse,
    .ripple {
      animation: none;
    }
  }
  .pa {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease,
      stroke-width 0.5s ease;
  }
  &.on .pa {
    opacity: 1;
    transform: none;
  }
  &.on .draw {
    stroke-dashoffset: 0;
  }
  &.still .pa,
  &.still .draw {
    transition: none;
  }
  .lab {
    font-family: ${SANS};
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.16em;
    fill: ${C.ink};
  }
  .num {
    font-family: ${DISPLAY};
    font-weight: 600;
    fill: ${C.ink};
  }
`;

const Plate = ({ cls, id, children, wash = 250 }) => (
  <Svg
    className={cls}
    viewBox="0 0 960 540"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-dusk`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#f3cda6" stopOpacity="0" />
        <stop offset="1" stopColor="#f0b999" />
      </linearGradient>
    </defs>
    <rect width="960" height="540" fill={C.cream} />
    <rect y={540 - wash} width="960" height={wash} fill={`url(#${id}-dusk)`} />
    {children}
  </Svg>
);

const t = s => ({ transitionDelay: `${s}s` });

/* ---------- Tail index: bands at five thresholds ---------- */
export const PrintTail = ({ cls, ks, union, first, inter }) => {
  const y = v => 440 - ((v - 0.2) / 1.5) * 360;
  const cx = i => 150 + i * 96;
  return (
    <Plate cls={cls} id="pt">
      <text className="lab" x="60" y="52">
        DANISH FIRE LOSSES · N = 2,167
      </text>
      {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map(v => (
        <g key={v}>
          <path d={`M92 ${y(v)}H590`} stroke={C.haze} strokeWidth="1" />
          <text className="lab" x="80" y={y(v) + 4} textAnchor="end" style={{ letterSpacing: 0 }}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <rect
        className="pa"
        x="92"
        y={y(inter[1])}
        width="498"
        height={y(inter[0]) - y(inter[1])}
        fill={C.hill}
        opacity="0.38"
        style={t(1.1)}
      />
      {ks.map((k, i) => (
        <g key={k}>
          <rect
            className="grow"
            x={cx(i) - 17}
            y={y(union[i][2])}
            width="34"
            height={y(union[i][0]) - y(union[i][2])}
            rx="17"
            fill={C.gold}
            style={t(0.14 * i)}
          />
          <circle
            className="pa"
            cx={cx(i)}
            cy={y(union[i][1])}
            r="5"
            fill={C.ink}
            style={t(0.14 * i + 0.5)}
          />
          <path
            className="grow"
            d={`M${cx(i) + 32} ${y(first[i][2])}V${y(first[i][0])}`}
            stroke={C.ink}
            strokeWidth="5"
            strokeLinecap="round"
            style={t(0.14 * i + 0.3)}
          />
          <text className="lab" x={cx(i) + 4} y="468" textAnchor="middle">
            K = {k}
          </text>
        </g>
      ))}
      <g className="pa" style={t(1.3)}>
        <text className="num" x="590" y={y(inter[0]) + 26} textAnchor="end" fontSize="20">
          ξ ∈ [{inter[0].toFixed(2)}, {inter[1].toFixed(2)}]
        </text>
      </g>
      <rect x="60" y="494" width="14" height="14" rx="7" fill={C.gold} />
      <text className="lab" x="82" y="505">
        UNION BAND
      </text>
      <rect x="197" y="494" width="5" height="14" rx="2.5" fill={C.ink} />
      <text className="lab" x="210" y="505">
        FIRST-ORDER BAND
      </text>
      <rect x="372" y="494" width="14" height="14" fill={C.hill} opacity="0.5" />
      <text className="lab" x="394" y="505">
        HELD AT EVERY K
      </text>
    </Plate>
  );
};

/* ---------- SDG 4 revisions: four releases of one indicator ---------- */
export const PrintVintage = ({ cls, releases, at2021, sel }) => {
  const X0 = 110;
  const X1 = 500;
  const Y0 = 408;
  const Y1 = 196;
  const px = i => X0 + (i / 16) * (X1 - X0);
  const py = v => Y0 - (v / 48) * (Y0 - Y1);
  const curve = vals =>
    vals.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const backs = [C.back, C.hill, C.haze];
  return (
    <Plate cls={cls} id="pv">
      {backs.map((f, n) => {
        const k = 3 - n;
        return (
          <g key={f} className="pa" style={t(0.12 * n)}>
            <rect x={62 + k * 18} y={112 - k * 16} width="480" height="350" fill={f} />
            <rect
              x={62 + k * 18 + 24 + (3 - k) * 0}
              y={112 - k * 16 - 20}
              width="64"
              height="20"
              fill={f}
            />
          </g>
        );
      })}
      <g className="pa" style={t(0.4)}>
        <rect x="62" y="112" width="480" height="350" fill={C.sheet} />
        <rect x="86" y="92" width="64" height="20" fill={C.sheet} />
        <text className="lab" x="118" y="107" textAnchor="middle">
          {releases[sel].year}
        </text>
        <text className="lab" x="110" y="150">
          COUNTRIES WITH A VALUE · INDICATOR 4.C.1
        </text>
      </g>
      {[0, 16, 32, 48].map(v => (
        <g key={v}>
          <path d={`M${X0} ${py(v)}H${X1}`} stroke={C.haze} strokeWidth="1" />
          <text
            className="lab"
            x={X0 - 10}
            y={py(v) + 4}
            textAnchor="end"
            style={{ letterSpacing: 0 }}>
            {v}
          </text>
        </g>
      ))}
      {[0, 4, 8, 12, 16].map(i => (
        <text
          key={i}
          className="lab"
          x={px(i)}
          y={Y0 + 22}
          textAnchor="middle"
          style={{ letterSpacing: 0 }}>
          {2008 + i}
        </text>
      ))}
      <path
        d={`M${px(13)} ${Y1 - 8}V${Y0}`}
        stroke={C.vermilion}
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <text
        className="lab"
        x={px(13) - 8}
        y={Y1 - 14}
        textAnchor="end"
        style={{ fill: C.vermilion }}>
        2021
      </text>
      {releases.map((r, n) => (
        <path
          key={r.year}
          className="draw"
          pathLength="1"
          d={curve(r.values)}
          fill="none"
          stroke={n === sel ? C.ink : C.hill}
          strokeWidth={n === sel ? 3.2 : 1.8}
          strokeLinejoin="round"
          style={t(0.5 + 0.25 * n)}
        />
      ))}
      {at2021.map((v, n) => (
        <circle
          key={n}
          className="pa"
          cx={px(13)}
          cy={py(v)}
          r={n === sel ? 7 : 4}
          fill={n === sel ? C.gold : C.hill}
          style={t(1.2 + 0.1 * n)}
        />
      ))}
      <circle className="pulse" cx={px(13)} cy={py(at2021[sel])} r="7" fill={C.gold} />
      <text className="num pa" x={px(13) + 16} y={py(at2021[sel]) + 8} fontSize="30" style={t(1.5)}>
        {at2021[sel]}
      </text>
    </Plate>
  );
};

/* ---------- Québec: six stations along the St. Lawrence ---------- */
export const PrintQuebec = ({ cls, stations, pairs, river, heavy = 0.5 }) => {
  const X = e => 70 + e * 500;
  const Y = n => 452 - n * 350;
  const riv = river
    .map(([e, n], i) => `${i ? 'L' : 'M'}${X(e).toFixed(1)} ${Y(n).toFixed(1)}`)
    .join(' ');
  const arc = (a, b) => {
    const [x1, y1, x2, y2] = [X(a.e), Y(a.n), X(b.e), Y(b.n)];
    const lift = 0.22 * Math.hypot(x2 - x1, y2 - y1);
    return `M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - lift} ${x2} ${y2}`;
  };
  const drops = Math.round(6 + heavy * 16);
  return (
    <Plate cls={cls} id="pq" wash={200}>
      <path
        className="pa"
        d="M0 150C120 96 180 128 250 92C320 58 380 110 450 78C520 50 580 96 650 84C740 66 820 110 960 90V0H0Z"
        fill={C.haze}
      />
      <path
        className="pa"
        d="M0 120C110 84 170 104 230 70C300 34 360 86 430 56C500 30 570 70 650 58C740 40 840 84 960 60V0H0Z"
        fill={C.hill}
        style={t(0.1)}
      />
      <path
        className="pa"
        d="M640 540C720 470 780 486 840 440C890 404 930 430 960 414V540Z"
        fill={C.back}
        style={t(0.2)}
      />
      <path
        className="pa"
        d="M740 540C800 492 850 504 900 474C930 456 950 466 960 462V540Z"
        fill={C.ink}
        style={t(0.3)}
      />
      <g transform="translate(310 0)">
        <path
          className="draw"
          pathLength="1"
          d={riv}
          fill="none"
          stroke={C.river}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pairs.map(([i, j, l]) =>
          l > 0.03 ? (
            <path
              key={`${i}-${j}`}
              className="draw"
              pathLength="1"
              d={arc(stations[i], stations[j])}
              fill="none"
              stroke={C.ink}
              strokeWidth={0.6 + l * 9}
              opacity={0.25 + Math.min(0.7, l * 1.6)}
              strokeLinecap="round"
              style={t(0.5)}
            />
          ) : null,
        )}
        {pairs
          .filter(([, , l]) => l > 0.28)
          .map(([i, j]) => (
            <path
              key={`f-${i}-${j}`}
              className="flow"
              pathLength="1"
              d={arc(stations[i], stations[j])}
              fill="none"
              stroke={C.gold}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        {stations.map((s, i) => (
          <g key={s.name} className="pa" style={t(0.6 + 0.08 * i)}>
            <circle cx={X(s.e)} cy={Y(s.n)} r="8" fill={C.ink} />
            <circle cx={X(s.e)} cy={Y(s.n)} r="3.6" fill={C.gold} />
            <text
              className="lab"
              x={X(s.e) + (s.end ? -14 : 14)}
              y={Y(s.n) + (s.n > 0.6 ? -12 : 22)}
              textAnchor={s.end ? 'end' : 'start'}>
              {s.name.toUpperCase()}
            </text>
          </g>
        ))}
        {/* cloud and rain: heavier in the heavier season */}
        <g transform="translate(186 62)">
          <g className="pa cloud" style={t(0.9)}>
            <path
              d="M352 196h96a13 13 0 0 0 0-26h-10a22 22 0 0 0-42-8a17 17 0 0 0-30 8h-14a13 13 0 0 0 0 26Z"
              fill={C.sheet}
            />
            <g className="rain">
              {Array.from({ length: drops }, (_, k) => (
                <path
                  key={k}
                  d={`M${358 + (k % 8) * 12} ${206 + Math.floor(k / 8) * 16}l-4 10`}
                  stroke={C.river}
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ animationDelay: `${-((k * 0.37) % 1.1)}s` }}
                />
              ))}
            </g>
          </g>
        </g>
        <text className="lab" x="330" y="40" style={{ fill: C.cream }}>
          LAURENTIDES
        </text>
        <text className="lab" x="636" y="524" textAnchor="end" style={{ fill: C.cream }}>
          APPALACHES
        </text>
        <path d="M110 500h120" stroke={C.ink} strokeWidth="1.5" />
        <path d="M110 495v10M230 495v10" stroke={C.ink} strokeWidth="1.5" />
        <text className="lab" x="170" y="520" textAnchor="middle">
          ≈ 210 KM, END TO END
        </text>
      </g>
    </Plate>
  );
};

/* ---------- VVI: Victoria Harbour, with 2022's two waves as the ridge ---------- */
const TOWERS = [
  [44, 26, 60],
  [76, 20, 96],
  [102, 30, 74],
  [138, 22, 128],
  [166, 34, 88],
  [206, 24, 150],
  [236, 30, 104],
  [272, 20, 176],
  [298, 36, 118],
  [340, 24, 140],
  [370, 30, 92],
  [406, 22, 122],
  [434, 34, 70],
  [474, 24, 100],
  [504, 30, 64],
  [540, 26, 84],
];
export const PrintImmunity = ({ cls, waveY }) => {
  const WATER = 380;
  let ridge = `M30 ${WATER}`;
  for (let x = 30; x <= 590; x += 10) ridge += `L${x} ${waveY(x).toFixed(1)}`;
  ridge += `L590 ${WATER}Z`;
  let body = '';
  let lit = '';
  let litB = '';
  TOWERS.forEach(([x, w, h], n) => {
    body += `M${x} ${WATER}V${WATER - h}h${w}V${WATER}Z`;
    if (n % 3 === 1) body += `M${x + w / 2 - 1} ${WATER - h}v-20h2v20Z`;
    const rows = Math.floor((h - 18) / 8);
    for (let r = 0; r < rows; r++) {
      if ((n * 7 + r * 3) % 11 < 4) {
        const bar = `M${x + 4 + ((n * 5 + r * 2) % Math.max(1, w - 14))} ${
          WATER - h + 14 + r * 8
        }h${5 + ((n + r) % 2) * 4}`;
        if ((n + r) % 3 === 0) litB += bar;
        else lit += bar;
      }
    }
  });
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) cells.push([c, r]);
  return (
    <Plate cls={cls} id="pi" wash={420}>
      <text className="lab" x="40" y="52">
        HONG KONG, 2022 · TWO OMICRON WAVES
      </text>
      <g transform="translate(14 -10)">
        <path className="pa" d={ridge} fill={C.haze} />
      </g>
      <path className="pa" d={ridge} fill={C.hill} style={t(0.15)} />
      <text className="lab pa" x="142" y="118" textAnchor="middle" style={t(0.5)}>
        BA.2 · MARCH
      </text>
      <text className="lab pa" x="366" y="192" textAnchor="middle" style={t(0.6)}>
        BA.5 · SUMMER
      </text>
      <path className="pa" d={body} fill={C.ink} style={t(0.3)} />
      <path className="pa" d={lit} stroke={C.gold} strokeWidth="2" fill="none" style={t(0.7)} />
      <path className="tw" d={litB} stroke={C.gold} strokeWidth="2" fill="none" />
      <rect x="0" y={WATER} width="960" height={540 - WATER} fill={C.river} />
      <path
        className="ripple"
        d="M40 398h150M260 400h90M30 418h80M150 420h170M60 440h120M40 470h90M70 500h160"
        stroke={C.cream}
        strokeWidth="1"
        opacity="0.45"
      />
      {/* the ledger the person-days settle into */}
      <g className="pa" style={t(0.9)}>
        <rect x="330" y="410" width="250" height="100" fill={C.sheet} />
        {cells.map(([c, r]) => (
          <rect
            key={`${c}-${r}`}
            x={340 + c * 26}
            y={420 + r * 21}
            width="22"
            height="17"
            fill={(c * 3 + r * 5) % 7 < 2 ? C.gold : C.cream}
          />
        ))}
      </g>
      {[
        [214, 250],
        [282, 226],
        [346, 262],
        [412, 280],
        [250, 300],
        [380, 240],
      ].map(([x, y0], k) =>
        [0, 1, 2].map(q => (
          <circle key={`${k}-${q}`} r={3.4 - q * 0.6} fill={C.gold}>
            <animateMotion
              dur={`${3.4 + (k % 3) * 0.5}s`}
              begin={`${-(q * 0.9 + k * 0.45)}s`}
              repeatCount="indefinite"
              path={`M${x} ${y0}Q${x + 30} ${y0 + 60} ${352 + ((k * 3 + q * 2) % 9) * 26} ${
                430 + ((k + q) % 4) * 21
              }`}
            />
          </circle>
        )),
      )}
      <text className="lab" x="40" y="524" style={{ fill: C.cream }}>
        PERSON-DAYS, SUMMED INTO CELLS
      </text>
    </Plate>
  );
};
