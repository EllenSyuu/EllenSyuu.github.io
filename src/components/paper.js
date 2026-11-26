import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

/*
 * The paper.
 *
 * An original family of oversized, tone-on-tone motifs printed into the cream background, in the
 * spirit of Scandinavian textile printing: few shapes, very large, cut off by the edge of the page,
 * almost the colour of the paper. Every motif comes from the site's own subject —
 *   currents   the river's surface lines, grown into long free curves;
 *   contours   nested density contours, like a fitted distribution seen from above;
 *   rain-leaves  long drops that are also leaves, on one stem — precipitation and growth;
 *   drops      single drops of rain;
 *   ridge      the soft line of the mountain.
 * Shapes are smooth Bézier curves through hand-placed points, not assembled primitives.
 *
 * Also here: <Currents/>, the river's lines inside the cover transition, which straighten,
 * lengthen and drift apart into the first of these curves as the water dissolves.
 */

const PAPER = '#f6f0e4';
const TONE = {
  stone: '#f0e7d7',
  deep: '#ebe1cf',
  blue: '#e9e8e0',
  ivory: '#fbf8f1',
  gold: '#f2e6cd',
  line: '#e1d8c6',
};

const rnd = i => {
  const v = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return v - Math.floor(v);
};

/* Catmull–Rom through points, as cubic Béziers */
const smooth = (pts, closed = false) => {
  const n = pts.length;
  const at = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(
      1,
    )} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? `${d}Z` : d;
};

/* an organic closed outline around (cx, cy) */
const blob = (cx, cy, r, seed, wob = 0.16, n = 9, squash = 0.86) =>
  smooth(
    Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2 + rnd(seed) * 0.6;
      const rr = r * (1 + wob * (rnd(seed + k * 3.1) * 2 - 1));
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squash];
    }),
    true,
  );

/* a long drop that is also a leaf: base at 0,0, tip at 0,-L */
const leaf = (L, W, lean = 0.12) =>
  `M0,0C${W * 0.95},${-L * 0.1} ${W * (0.85 + lean)},${-L * 0.7} ${W * lean * 0.6},${-L}C${
    -W * 0.5
  },${-L * 0.74} ${-W * 0.78},${-L * 0.24} 0,0Z`;
const vein = (L, W, lean = 0.12) =>
  `M0,${-L * 0.05}Q${W * (0.18 + lean)},${-L * 0.5} ${W * lean * 0.5},${-L * 0.92}`;

/* a falling drop, point up */
const drop = (x, y, s) =>
  `M${x},${y - s * 1.35}C${x + s * 0.18},${y - s * 0.75} ${x + s},${y - s * 0.2} ${x + s},${
    y + s * 0.25
  }A${s},${s} 0 0 1 ${x - s},${y + s * 0.25}C${x - s},${y - s * 0.2} ${x - s * 0.18},${
    y - s * 0.75
  } ${x},${y - s * 1.35}Z`;

/* a flowing band: centre line y(x) with varying thickness */
const ribbon = (x0, x1, y, amp, freq, phase, t0, t1, seed) => {
  const N = 14;
  const top = [];
  const bot = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = x0 + (x1 - x0) * u;
    const c =
      y + amp * Math.sin(u * freq * Math.PI * 2 + phase) + amp * 0.35 * Math.sin(u * 7.3 + seed);
    const th = t0 + (t1 - t0) * (0.5 + 0.5 * Math.sin(u * Math.PI * 1.6 + seed));
    top.push([x, c - th / 2]);
    bot.unshift([x, c + th / 2]);
  }
  return `${smooth(top)}L${bot[0][0].toFixed(1)},${bot[0][1].toFixed(1)}${smooth(bot).slice(
    smooth(bot).indexOf('C'),
  )}Z`;
};

/* ------------------------------------------------------------------ motifs (viewBox units) */

const Contours = ({ seed = 1 }) => (
  <svg viewBox="0 0 1000 900">
    <path d={blob(520, 470, 430, seed, 0.13)} fill={TONE.stone} />
    <path d={blob(560, 430, 320, seed + 7, 0.15)} fill={PAPER} />
    <path d={blob(590, 410, 240, seed + 13, 0.17)} fill={TONE.blue} />
    <path d={blob(615, 395, 140, seed + 19, 0.2)} fill={PAPER} />
    <path d={blob(650, 372, 70, seed + 23, 0.22)} fill={TONE.gold} opacity="0.7" />
  </svg>
);

const RainLeaves = () => {
  const leaves = [
    { a: -48, L: 470, W: 170, c: TONE.stone },
    { a: -18, L: 640, W: 215, c: TONE.deep },
    { a: 14, L: 560, W: 190, c: TONE.blue },
    { a: 46, L: 420, W: 150, c: TONE.stone },
  ];
  return (
    <svg viewBox="-500 -760 1000 1100">
      <path
        d="M0,0C-10,110 30,220 -40,330"
        stroke={TONE.deep}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {leaves.map((l, i) => (
        <g key={i} transform={`rotate(${l.a})`}>
          <path d={leaf(l.L, l.W)} fill={l.c} />
          <path
            d={vein(l.L, l.W)}
            stroke={TONE.ivory}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d={drop(330, -560, 34)} fill={TONE.gold} />
      <path d={drop(395, -380, 22)} fill={TONE.stone} />
      <path d={drop(-360, -470, 26)} fill={TONE.blue} />
    </svg>
  );
};

const Ridge = () => (
  <svg viewBox="0 0 1600 600">
    <path
      d={`${smooth([
        [0, 560],
        [220, 470],
        [430, 300],
        [610, 140],
        [790, 110],
        [1000, 230],
        [1240, 330],
        [1600, 300],
      ])}L1600,600L0,600Z`}
      fill={TONE.stone}
    />
    <path
      d={smooth([
        [120, 560],
        [340, 430],
        [560, 270],
        [760, 210],
        [960, 300],
        [1200, 420],
        [1500, 440],
      ])}
      stroke={TONE.ivory}
      strokeWidth="5"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

const Ribbons = () => (
  <svg viewBox="0 0 1600 700">
    <path d={ribbon(-40, 1640, 190, 70, 0.9, 0.4, 40, 120, 1)} fill={TONE.blue} />
    <path d={ribbon(-40, 1640, 380, 55, 1.15, 2.1, 18, 60, 2)} fill={TONE.stone} />
    <path d={ribbon(-40, 1640, 540, 80, 0.7, 4, 50, 140, 3)} fill={TONE.deep} />
  </svg>
);

const Lines = () => (
  <svg viewBox="0 0 1600 500">
    {[
      [70, 38, 0.8, 0.2],
      [170, 52, 0.62, 1.7],
      [300, 30, 1.05, 3.1],
      [420, 60, 0.55, 4.2],
    ].map(([y, amp, f, ph], i) => (
      <path
        key={i}
        d={smooth(
          Array.from({ length: 10 }, (_, k) => {
            const u = k / 9;
            return [-60 + u * 1720, y + amp * Math.sin(u * f * Math.PI * 2 + ph) * (0.4 + u)];
          }),
        )}
        stroke={TONE.line}
        strokeWidth="2.2"
        fill="none"
      />
    ))}
  </svg>
);

const Drops = () => (
  <svg viewBox="0 0 600 900">
    <path d={drop(180, 220, 90)} fill={TONE.stone} />
    <path d={drop(420, 470, 55)} fill={TONE.blue} />
    <path d={drop(250, 720, 34)} fill={TONE.gold} />
  </svg>
);

const MOTIFS = {
  contours: Contours,
  leaves: RainLeaves,
  ridge: Ridge,
  ribbons: Ribbons,
  lines: Lines,
  drops: Drops,
};

/*
 * Where they go. Positions are relative to a section's top-left; widths in vw so the motifs
 * stay oversized at any width; `x` in vw from the left edge of the page; `drift` is the parallax
 * rate (0 = printed flat).
 */
const LAYOUT = [
  { section: 'about', motif: 'lines', x: -4, y: -40, w: 108, mw: 160, drift: 0 },
  { section: 'about', motif: 'contours', x: -30, y: 420, w: 62, mw: 130, drift: 0.05 },
  { section: 'jobs', motif: 'ridge', x: 46, y: -120, w: 70, mw: 150, drift: 0.04 },
  { section: 'focus', motif: 'leaves', x: 70, y: 40, w: 52, mw: 120, drift: 0.06 },
  { section: 'focus', motif: 'drops', x: -6, y: 520, w: 16, mw: 34, drift: 0 },
  { section: 'impact', motif: 'ribbons', x: -12, y: 60, w: 124, mw: 230, drift: 0.03 },
  { section: 'contact', motif: 'contours', x: 58, y: -60, w: 58, mw: 125, drift: 0.05, seed: 5 },
];

const Layer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(50% - 50vw);
  width: 100vw;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease;
  &.on {
    opacity: 1;
  }

  .motif {
    position: absolute;
    width: var(--w);
    left: var(--x);
    will-change: transform;
  }
  .motif svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  @media (max-width: 700px) {
    .motif {
      width: var(--mw);
    }
  }
`;

export const PaperLayer = () => {
  const ref = useRef(null);
  useEffect(() => {
    const layer = ref.current;
    const host = layer && layer.parentElement;
    if (!host) return undefined;
    const items = [...layer.querySelectorAll('.motif')].map(el => ({
      el,
      section: el.dataset.section,
      dy: +el.dataset.y,
      drift: +el.dataset.drift,
      top: 0,
    }));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const place = () => {
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const narrow = window.innerWidth < 700;
      items.forEach(it => {
        const s = document.getElementById(it.section);
        if (!s) return;
        it.top =
          s.getBoundingClientRect().top + window.scrollY - hostTop + it.dy * (narrow ? 0.5 : 1);
        it.el.style.top = `${Math.round(it.top)}px`;
      });
      layer.classList.add('on');
    };
    const drift = () => {
      frame = 0;
      if (reduce) return;
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const mid = window.scrollY + window.innerHeight / 2 - hostTop;
      items.forEach(it => {
        if (!it.drift) return;
        const off = (mid - it.top) * it.drift;
        if (Math.abs(mid - it.top) < window.innerHeight * 2)
          it.el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(drift);
    };
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => (place(), onScroll())) : null;
    if (ro) ro.observe(host);
    place();
    drift();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Layer ref={ref} aria-hidden="true">
      {LAYOUT.map((m, i) => {
        const M = MOTIFS[m.motif];
        return (
          <div
            key={i}
            className="motif"
            data-section={m.section}
            data-y={m.y}
            data-drift={m.drift}
            style={{ '--x': `${m.x}vw`, '--w': `${m.w}vw`, '--mw': `${m.mw}vw` }}>
            <M seed={m.seed} />
          </div>
        );
      })}
    </Layer>
  );
};

/* ------------------------------------------------------------------ the transition's currents */

const CURRENT_TARGETS = [
  // where each current settles at the end of the transition, as a share of the viewport height,
  // and how much it bends
  { y: 0.14, amp: 0.035, f: 0.7, ph: 0.3 },
  { y: 0.27, amp: 0.05, f: 0.55, ph: 1.8 },
  { y: 0.78, amp: 0.045, f: 0.9, ph: 3.0 },
  { y: 0.9, amp: 0.06, f: 0.6, ph: 4.4 },
];
const WATER_ROWS = [762, 776, 792, 810];

const mix = (a, b, t) => {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};
const ss = (a, b, v) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const CurrentsSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
`;

/* drawn inside the pinned cover stage; reads --p from the stage */
export const Currents = () => {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    const stage = svg && svg.closest('.pin') && svg.closest('.pin').parentElement;
    if (!svg || !stage) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const paths = [...svg.querySelectorAll('path')];
    let lastP = -1;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const p = parseFloat(stage.style.getPropertyValue('--p')) || 0;
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      const water = document.querySelector('#top .layer-water svg');
      const m = water && water.getScreenCTM();
      const box = svg.getBoundingClientRect();
      const W = box.width;
      const H = window.innerHeight;
      const appear = ss(0.5, 0.66, p);
      const morph = ss(0.5, 0.96, p);
      svg.style.opacity = appear.toFixed(3);
      if (appear <= 0) return;
      paths.forEach((el, i) => {
        const tg = CURRENT_TARGETS[i];
        const wy = m ? m.d * WATER_ROWS[i] + m.f - box.top : H * 0.8;
        const y0 = wy + (tg.y * H - wy) * morph;
        const amp = tg.amp * Math.min(H, W * 0.9) * morph;
        const pts = Array.from({ length: 9 }, (_, k) => {
          const u = k / 8;
          return [
            -0.08 * W + u * 1.16 * W,
            y0 + amp * Math.sin(u * tg.f * Math.PI * 2 + tg.ph) * (0.35 + u),
          ];
        });
        el.setAttribute('d', smooth(pts));
        // cream on the river, blue-grey in the mist, then almost the paper's own colour
        const k1 = ss(0.5, 0.66, p);
        const k2 = ss(0.72, 0.92, p);
        el.setAttribute(
          'stroke',
          k2 > 0 ? mix('#a7b8c4', TONE.line, k2) : mix('#f6f0e4', '#a7b8c4', k1),
        );
        el.setAttribute('stroke-opacity', '1');
        el.setAttribute('stroke-width', (1 + morph * 1.2).toFixed(2));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <CurrentsSvg ref={ref} aria-hidden="true" style={{ opacity: 0 }}>
      {CURRENT_TARGETS.map((_, i) => (
        <path key={i} fill="none" strokeLinecap="round" />
      ))}
    </CurrentsSvg>
  );
};
