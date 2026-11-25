import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import DATA from './pickands-seasons.json';

/*
 * covarchimax, drawn from the thesis tables rather than illustrated.
 *
 * Left: the estimated Pickands dependence function A(ω) for all 15 station pairs, inside the
 * triangle every Pickands function must stay in — A = 1 is independence, max(ω, 1 − ω) is
 * complete dependence. Choosing a season morphs the 15 curves to that season's estimates.
 * Right: the six stations on a ring, west to east; each curve is as heavy as the pair's
 * upper-tail dependence 2(1 − A(½)) read from the same curves.
 * Below: the six-station extremal coefficient η for the four seasons, with 90% intervals.
 *
 * Sources: SAC-thesis-2026 — results/tables/tab_15_season_pickands_curves.csv (curves),
 * data/processed/stations.csv (coordinates), README (η, intervals, monthly maxima tests).
 */

const SEASONS = [
  {
    key: 'AM',
    label: 'Apr – May',
    eta: 4.028,
    ci: [3.712, 4.56],
    pre: 20.62,
    post: 21.59,
    diff: 0.96,
    p: 'p = 0.10',
    line: 'Spring storms: extremes often arrive together.',
  },
  {
    key: 'JJ',
    label: 'Jun – Jul',
    eta: 5.73,
    ci: [5.229, 6.0],
    pre: 26.98,
    post: 27.25,
    diff: 0.26,
    p: 'p = 0.75',
    line: 'Summer downpours are local: close to independent.',
  },
  {
    key: 'AS',
    label: 'Aug – Sep',
    eta: 4.116,
    ci: [3.722, 4.729],
    pre: 28.47,
    post: 31.42,
    diff: 2.95,
    p: 'p = 0.005',
    line: 'Late-summer systems: heavier, and shared again.',
  },
  {
    key: 'ON',
    label: 'Oct – Nov',
    eta: 3.896,
    ci: [3.602, 4.327],
    pre: 22.42,
    post: 25.57,
    diff: 3.15,
    p: 'p < 0.001',
    line: 'Autumn storms: the most likely to strike together.',
  },
];

const STATIONS = [
  { short: 'Drum.', name: 'Drummondville', lat: 45.88, lon: -72.48, ax: 'start', dx: 9, dy: 4 },
  { short: "L'Ass.", name: 'L’Assomption', lat: 45.8, lon: -73.42, ax: 'end', dx: -9, dy: 4 },
  { short: 'Les Cèd.', name: 'Les Cèdres', lat: 45.3, lon: -74.05, ax: 'start', dx: 9, dy: 4 },
  { short: 'St-Ch.', name: 'St-Charles', lat: 46.4, lon: -73.35, ax: 'start', dx: 9, dy: 4 },
  { short: 'Lennox.', name: 'Lennoxville', lat: 45.37, lon: -71.82, ax: 'end', dx: -9, dy: 4 },
  { short: 'Nicolet', name: 'Nicolet', lat: 46.22, lon: -72.62, ax: 'start', dx: 9, dy: 4 },
];
const IDX = Object.fromEntries(STATIONS.map((s, i) => [s.short, i]));
const PAIRS = DATA.pairs.map(p => p.split(' & ').map(s => IDX[s]));
const W_HALF = DATA.w.indexOf(0.5);

const INK = '#14213a';
const MUTED = '#5d6880';
const RED = '#c8431f';
const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* interpolates the 15 curves from one season to the next */
const useMorph = (target, reduce) => {
  const [cur, setCur] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduce) {
      setCur(target);
      from.current = target;
      return undefined;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = now => {
      const t = Math.min(1, (now - t0) / 900);
      const k = ease(t);
      const next = target.map((row, i) => row.map((v, j) => start[i][j] + (v - start[i][j]) * k));
      setCur(next);
      from.current = next;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return cur;
};

const useSize = () => {
  const ref = useRef(null);
  const [w, setW] = useState(960);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

const useSeen = () => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
};

const Curves = ({ A, w, seen }) => {
  const H = Math.round(Math.min(400, Math.max(240, w * 0.58)));
  const m = { l: 40, r: 12, t: 28, b: 34 };
  const x = v => m.l + v * (w - m.l - m.r);
  const y = v => H - m.b - ((v - 0.5) / 0.5) * (H - m.t - m.b);
  const path = row =>
    [[0, 1], ...DATA.w.map((ww, j) => [ww, row[j]]), [1, 1]]
      .map(([a, b], i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(b).toFixed(1)}`)
      .join('');
  const mean = DATA.w.map((_, j) => A.reduce((s, row) => s + row[j], 0) / A.length);
  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      width={w}
      height={H}
      role="img"
      aria-label="Estimated Pickands dependence functions for 15 station pairs">
      <line x1={x(0)} x2={x(1)} y1={y(1)} y2={y(1)} stroke={INK} strokeWidth="1" />
      <path
        d={`M${x(0)},${y(1)}L${x(0.5)},${y(0.5)}L${x(1)},${y(1)}`}
        fill="none"
        stroke={INK}
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />
      {[0.5, 0.75, 1].map(v => (
        <g key={v}>
          <line x1={m.l - 5} x2={m.l} y1={y(v)} y2={y(v)} stroke={MUTED} strokeWidth="0.8" />
          <text x={m.l - 9} y={y(v) + 4} textAnchor="end" className="tick">
            {v}
          </text>
        </g>
      ))}
      {[0, 0.5, 1].map(v => (
        <text key={v} x={x(v)} y={H - 12} textAnchor="middle" className="tick">
          {v === 0.5 ? 'ω = ½' : v}
        </text>
      ))}
      <text x={x(0.5)} y={y(1) - 9} textAnchor="middle" className="note">
        A = 1 · independent
      </text>
      <text x={x(0.5) + 14} y={y(0.5) - 4} className="note">
        complete dependence
      </text>
      <g className={`draw ${seen ? 'on' : ''}`}>
        {A.map((row, i) => (
          <path
            key={i}
            d={path(row)}
            pathLength="1"
            fill="none"
            stroke={INK}
            strokeOpacity="0.55"
            strokeWidth="1.1"
            strokeLinejoin="round"
            style={{ transitionDelay: `${0.15 + i * 0.05}s` }}>
            <title>{DATA.pairs[i]}</title>
          </path>
        ))}
        <path
          d={path(mean)}
          pathLength="1"
          fill="none"
          stroke={RED}
          strokeWidth="2.4"
          strokeLinejoin="round"
          style={{ transitionDelay: '1s' }}
        />
      </g>
    </svg>
  );
};

/* the six stations on a ring, west to east clockwise from the left; each pair is joined by a
   curve through the middle, as thick as the pair's upper-tail dependence 2(1 − A(½)) */
const RING = [...STATIONS.keys()].sort((a, b) => STATIONS[a].lon - STATIONS[b].lon);
const Ring = ({ A, w }) => {
  const H = Math.round(Math.min(380, Math.max(260, w * 0.86)));
  const cx = w / 2;
  const cy = H / 2;
  const R = Math.min(w / 2 - 70, H / 2 - 30);
  const pos = {};
  RING.forEach((st, i) => {
    const a = Math.PI + (i / RING.length) * 2 * Math.PI + Math.PI / RING.length;
    pos[st] = { a, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const lam = A.map(row => Math.max(0, 2 * (1 - row[W_HALF])));
  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      width={w}
      height={H}
      role="img"
      aria-label="Upper-tail dependence between each pair of the six stations">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeOpacity="0.14" />
      {PAIRS.map(([a, b], i) => {
        const p1 = pos[a];
        const p2 = pos[b];
        const k = 0.18;
        const qx = cx + ((p1.x + p2.x) / 2 - cx) * k;
        const qy = cy + ((p1.y + p2.y) / 2 - cy) * k;
        return (
          <path
            key={i}
            d={`M${p1.x},${p1.y} Q${qx},${qy} ${p2.x},${p2.y}`}
            fill="none"
            stroke={RED}
            strokeLinecap="round"
            className="link"
            style={{
              strokeWidth: 0.8 + lam[i] * 16,
              opacity: lam[i] < 0.02 ? 0.12 : 0.22 + lam[i] * 1.3,
            }}>
            <title>{`${DATA.pairs[i]}: ${lam[i].toFixed(2)}`}</title>
          </path>
        );
      })}
      {RING.map(st => {
        const p = pos[st];
        const lx = cx + (R + 14) * Math.cos(p.a);
        const ly = cy + (R + 14) * Math.sin(p.a);
        const anchor =
          Math.abs(Math.cos(p.a)) < 0.3 ? 'middle' : Math.cos(p.a) > 0 ? 'start' : 'end';
        return (
          <g key={st}>
            <circle cx={p.x} cy={p.y} r="5" fill="#f6f0e4" stroke={INK} strokeWidth="1.6" />
            <text
              x={lx}
              y={ly + 4 + (Math.sin(p.a) > 0.8 ? 8 : Math.sin(p.a) < -0.8 ? -6 : 0)}
              textAnchor={anchor}
              className="stn">
              {STATIONS[st].name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Eta = ({ idx, w }) => {
  const row = 22;
  const H = SEASONS.length * row + 34;
  const m = { l: 74, r: 14 };
  const x = v => m.l + ((v - 1) / 5) * (w - m.l - m.r);
  const base = SEASONS.length * row + 6;
  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      width={w}
      height={H}
      role="img"
      aria-label="Extremal coefficient by season">
      {SEASONS.map((s, i) => {
        const on = i === idx;
        const yy = i * row + 12;
        return (
          <g key={s.key} style={{ opacity: on ? 1 : 0.45, transition: 'opacity .5s' }}>
            <text x={0} y={yy + 4} className={`tick ${on ? 'red strong' : ''}`}>
              {s.label}
            </text>
            <line x1={x(1)} x2={x(6)} y1={yy} y2={yy} stroke={INK} strokeOpacity="0.12" />
            <line
              x1={x(s.ci[0])}
              x2={x(s.ci[1])}
              y1={yy}
              y2={yy}
              stroke={on ? RED : INK}
              strokeWidth={on ? 4 : 3}
              strokeLinecap="round"
            />
            <circle cx={x(s.eta)} cy={yy} r={on ? 5.5 : 4} fill={on ? RED : INK} />
          </g>
        );
      })}
      <line x1={x(1)} x2={x(6)} y1={base} y2={base} stroke={INK} strokeWidth="1" />
      {[1, 2, 3, 4, 5, 6].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={base} y2={base + 4} stroke={INK} strokeWidth="1" />
          <text
            x={x(v)}
            y={base + 18}
            textAnchor={v === 1 ? 'start' : v === 6 ? 'end' : 'middle'}
            className="tick">
            {v === 1 ? '1 · all together' : v === 6 ? '6 · independent' : v}
          </text>
        </g>
      ))}
    </svg>
  );
};

const Wrap = styled.div`
  margin: 34px 0 10px;
  color: ${INK};

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .tick {
    fill: ${MUTED};
    font: 500 11px/1 ${SANS};
    font-variant-numeric: tabular-nums;
  }
  .tick.red,
  .note.red {
    fill: ${RED};
  }
  .tick.strong {
    font-weight: 700;
  }
  .note {
    fill: ${MUTED};
    font: 500 10.5px/1 ${SANS};
    letter-spacing: 0.03em;
  }
  .stn {
    fill: ${INK};
    font: 500 12px/1 ${SANS};
    paint-order: stroke;
    stroke: #f4eee2;
    stroke-width: 4px;
    stroke-linejoin: round;
  }
  .link {
    transition: stroke-width 0.9s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.9s;
  }
  .draw path {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.4s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .draw.on path {
    stroke-dashoffset: 0;
  }

  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 18px;
    margin-bottom: 26px;
  }
  .chips {
    display: inline-flex;
    border: 1px solid ${INK};
  }
  .chips button {
    min-height: 40px;
    padding: 0 16px;
    border: 0;
    border-left: 1px solid ${INK};
    background: transparent;
    color: ${INK};
    font: 500 13px/1 ${SANS};
    cursor: pointer;
    transition: background 0.25s, color 0.25s;
  }
  @media (max-width: 480px) {
    .chips {
      display: flex;
      width: 100%;
    }
    .chips button {
      flex: 1;
      padding: 0 6px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
  .chips button:first-child {
    border-left: 0;
  }
  .chips button[aria-pressed='true'] {
    background: ${INK};
    color: #f6f0e4;
  }
  .chips button:focus-visible {
    outline: 2px solid ${RED};
    outline-offset: 2px;
  }
  .line {
    margin: 0;
    color: ${INK};
    font: 400 clamp(17px, 1.6vw, 20px) / 1.35 ${SERIF};
  }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    gap: clamp(24px, 4vw, 56px);
    align-items: start;
  }
  .panel h5 {
    margin: 0 0 4px;
    color: ${INK};
    font: 600 13px/1.3 ${SANS};
  }
  .panel p {
    margin: 0 0 12px;
    color: ${MUTED};
    font: 400 12.5px/1.45 ${SANS};
  }
  .foot {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    gap: clamp(24px, 4vw, 56px);
    margin-top: 28px;
    padding-top: 16px;
    border-top: 1px solid rgba(20, 33, 58, 0.2);
  }
  .max .big {
    display: block;
    color: ${INK};
    font: 500 clamp(28px, 3vw, 38px) / 1 ${SERIF};
    font-variant-numeric: tabular-nums;
  }
  .max .big small {
    margin-left: 6px;
    color: ${RED};
    font-size: 0.55em;
  }
  .src {
    margin-top: 16px;
    color: ${MUTED};
    font: 400 11.5px/1.5 ${SANS};
  }
  @media (max-width: 760px) {
    .grid,
    .foot {
      grid-template-columns: 1fr;
    }
  }
`;

const QuebecPlate = () => {
  const [idx, setIdx] = useState(3);
  const [reduce, setReduce] = useState(false);
  const [seenRef, seen] = useSeen();
  const [leftRef, lw] = useSize();
  const [rightRef, rw] = useSize();
  const [etaRef, ew] = useSize();
  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  const target = useMemo(() => DATA.A[SEASONS[idx].key], [idx]);
  const A = useMorph(target, reduce);
  const s = SEASONS[idx];

  return (
    <Wrap ref={seenRef}>
      <div className="bar">
        <div className="chips" role="group" aria-label="Choose a season">
          {SEASONS.map((x, i) => (
            <button key={x.key} type="button" aria-pressed={i === idx} onClick={() => setIdx(i)}>
              {x.label}
            </button>
          ))}
        </div>
        <p className="line" aria-live="polite">
          {s.line}
        </p>
      </div>

      <div className="grid">
        <div className="panel" ref={leftRef}>
          <h5>How tightly two stations’ extremes move together</h5>
          <p>
            Estimated Pickands function A(ω): one grey line per pair of stations (15 pairs), their
            average in red.
          </p>
          <Curves A={A} w={Math.max(280, lw)} seen={seen || reduce} />
        </div>
        <div className="panel" ref={rightRef}>
          <h5>Which pairs share their extremes</h5>
          <p>
            The six stations from west to east; the thicker the curve, the more often two stations
            see their extremes in the same month.
          </p>
          <Ring A={A} w={Math.max(260, rw)} />
        </div>
      </div>

      <div className="foot">
        <div ref={etaRef}>
          <div className="panel">
            <h5>All six at once: extremal coefficient η, by season</h5>
            <p>Dot = estimate, bar = 90% year-block bootstrap interval.</p>
          </div>
          <Eta idx={idx} w={Math.max(260, ew)} />
        </div>
        <div className="max panel">
          <h5>Mean monthly maximum, {s.label}</h5>
          <p>1930–1975 → 1976–2017</p>
          <span className="big">
            {s.pre.toFixed(1)} → {s.post.toFixed(1)} mm<small>+{s.diff.toFixed(2)}</small>
          </span>
          <p style={{ marginTop: 8 }}>{s.p}</p>
        </div>
      </div>
      <p className="src">
        From the M.Sc. thesis repository: season-wise pointwise estimates of A(ω)
        (results/tables/tab_15); station order by longitude (data/processed/stations.csv); η, its
        intervals and the monthly-maxima tests from the README.
      </p>
    </Wrap>
  );
};

export default QuebecPlate;
