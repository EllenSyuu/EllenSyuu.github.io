import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { maplePath } from '@utils/leaves';
import { createCover } from '@utils/leaf-cover';

/*
 * Tail-dependence field — the hero's live visual.
 *
 * Points are draws from a bivariate Gumbel copula, generated with the Marshall–Olkin
 * algorithm (positive-stable frailty via Chambers–Mallows–Stuck). The random inputs are
 * fixed, so animating the dependence parameter θ morphs the same sample smoothly:
 * low θ looks like independence, high θ pulls the extremes into the upper-right corner.
 * The upper-tail dependence coefficient is χ = 2 − 2^{1/θ}.
 */

const fieldIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: none; }
`;

const StyledField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: ${fieldIn} 1.6s 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .legend {
    position: absolute;
    right: 0;
    top: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.7;
    text-align: right;
    font-variant-numeric: tabular-nums;

    b {
      color: var(--green);
      font-weight: 500;
    }

    @media (max-width: 900px) {
      display: none;
    }
  }

  /* In the arch frame, the readout sits in the dome above the plot. */
  &.framed .legend {
    display: block;
    top: 13%;
    right: auto;
    bottom: auto;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    text-align: center;
    font-size: var(--fz-xs);
    line-height: 1.8;

    b {
      font-size: var(--fz-md);
    }
  }
`;

const N_DESKTOP = 700;
const N_TOUCH = 360;

// Seeded PRNG so the field looks the same on every visit.
const mulberry32 = seed => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const makeInputs = n => {
  const rand = mulberry32(2026);
  return Array.from({ length: n }, () => ({
    v: Math.PI * (rand() * 0.998 + 0.001), // uniform angle for the stable variate
    w: -Math.log(rand() * 0.999 + 0.001), // Exp(1)
    e1: -Math.log(rand() * 0.999 + 0.001), // Exp(1)
    e2: -Math.log(rand() * 0.999 + 0.001), // Exp(1)
    jitter: rand(),
  }));
};

// One Gumbel-copula draw (u1, u2) for parameter theta, from fixed inputs.
const gumbel = (p, theta) => {
  const a = 1 / theta;
  const s =
    (Math.sin(a * p.v) / Math.pow(Math.sin(p.v), 1 / a)) *
    Math.pow(Math.sin((1 - a) * p.v) / p.w, (1 - a) / a);
  return [Math.exp(-Math.pow(p.e1 / s, a)), Math.exp(-Math.pow(p.e2 / s, a))];
};

const css = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

const hexToRgb = hex => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
};

const TailField = ({ animate, variant }) => {
  const framed = variant === 'frame';
  // 'sky': no frame, axes or leaf blanket — the points live inside the cover illustration.
  const sky = variant === 'sky';
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const thetaRef = useRef(null);
  const chiRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coarse = !window.matchMedia('(any-pointer: fine)').matches || window.innerWidth < 700;
    const N = coarse ? N_TOUCH : N_DESKTOP;
    const frameGap = coarse ? 50 : 33; // ~20 fps on touch devices (reveal only), ~30 fps elsewhere
    const inputs = makeInputs(N);
    let lastFrame = 0;
    let lastText = 0;
    const accent = hexToRgb(css(document.documentElement, '--green') || '#a83d1b');
    const ink = hexToRgb(css(document.documentElement, '--dark-slate') || '#7d6552');
    // Autumn ramp for the points: dry wheat → gold → amber → maple → cranberry.
    const RAMP = [
      [205, 186, 158],
      [226, 176, 74],
      [201, 131, 31],
      [196, 80, 31],
      [143, 42, 28],
    ];
    // In the cover drawing the points are ink stipple; only the joint extremes turn warm.
    if (sky) RAMP.splice(0, 5, [150, 160, 175], [111, 123, 140], [34, 49, 74], [207, 96, 43], [163, 67, 42]);
    const ramp = k => {
      const x = Math.min(0.9999, Math.max(0, k)) * (RAMP.length - 1);
      const i = Math.floor(x);
      const f = x - i;
      return RAMP[i].map((c, j) => Math.round(c + (RAMP[i + 1][j] - c) * f));
    };
    const leaf = maplePath();
    const drifting = []; // leaves released from the joint tail
    // Leaves resting on the plot until a breeze blows them away (see utils/leaf-cover).
    const cover = createCover({ count: coarse ? 46 : 74, rand: mulberry32(1031) });
    const revealOnly = !animate; // reduced motion: start in the revealed state

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let mouse = null;
    const ripples = [];
    let lastRipple = 0;
    const start = performance.now();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Pin the θ / χ readout just under the plot's right edge.
      if (legendRef.current && !framed) {
        const { x0, y0, size } = box();
        legendRef.current.style.top = `${y0 + size + 30}px`;
        legendRef.current.style.right = `${width - (x0 + size)}px`;
      }
    };

    // Plot area: centred square inside a frame, or on the right of a wide container.
    const box = () => {
      if (sky) {
        const size = Math.min(width, height) * 0.86;
        return { x0: (width - size) / 2, y0: (height - size) / 2, size };
      }
      if (framed) {
        // Sit low in the arch so the rounded top never clips the plot corners.
        const size = Math.min(width * 0.74, height * 0.6);
        return { x0: (width - size) / 2, y0: height - size - 64, size };
      }
      const size = Math.min(height * 0.6, width * 0.62, 460);
      const x0 = width - size - Math.max(24, width * 0.04);
      const y0 = height * 0.5 - size / 2;
      return { x0, y0, size };
    };

    const draw = now => {
      const t = (now - start) / 1000;
      // θ breathes between near-independence and strong tail dependence (period ≈ 14 s).
      const theta = animate && !coarse ? 2.1 + 0.95 * Math.sin(t * 0.45) : 2.6;
      const chi = 2 - Math.pow(2, 1 / theta);
      // Update the text readout a few times a second, not every frame (avoids layout work).
      if (now - lastText > 240) {
        lastText = now;
        const th = theta.toFixed(2);
        const ch = chi.toFixed(2);
        if (thetaRef.current && thetaRef.current.textContent !== th) thetaRef.current.textContent = th;
        if (chiRef.current && chiRef.current.textContent !== ch) chiRef.current.textContent = ch;
      }

      ctx.clearRect(0, 0, width, height);
      const { x0, y0, size } = box();

      // Frame and quantile guides (a hairline inset in the cover drawing).
      {
        ctx.strokeStyle = sky ? 'rgba(34,49,74,0.55)' : `rgba(${ink.join(',')},0.35)`;
        ctx.lineWidth = sky ? 0.75 : 1;
        ctx.strokeRect(x0 + 0.5, y0 + 0.5, size, size);
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        [0.9].forEach(q => {
          ctx.moveTo(x0 + q * size, y0);
          ctx.lineTo(x0 + q * size, y0 + size);
          ctx.moveTo(x0, y0 + (1 - q) * size);
          ctx.lineTo(x0 + size, y0 + (1 - q) * size);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Upper-tail region glow (warm, like late-afternoon light).
      const g = ctx.createRadialGradient(x0 + size, y0, 0, x0 + size, y0, size * 0.62);
      g.addColorStop(0, `rgba(226,176,74,${(sky ? 0.1 : 0.16) + 0.12 * chi})`);
      g.addColorStop(1, 'rgba(226,176,74,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x0, y0, size, size);

      let top = null;
      for (let i = 0; i < N; i += 1) {
        const [u, v] = gumbel(inputs[i], theta);
        let x = x0 + u * size;
        let y = y0 + (1 - v) * size;
        const m = Math.min(u, v);

        if (mouse) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 6400) {
            const f = (1 - d2 / 6400) * 10;
            const d = Math.sqrt(d2) || 1;
            x += (dx / d) * f;
            y += (dy / d) * f;
          }
        }

        const k = Math.pow(m, 2.2); // weight towards the joint extremes
        const [r, gg, b] = ramp(k);
        if (m > 0.8 && leaf) {
          // Joint extremes become little maple leaves, each with its own angle.
          const s = (sky ? 1.2 : 1) * (2.6 + (4.6 * (m - 0.8)) / 0.2);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(inputs[i].jitter * 6.283 + t * 0.15 * (inputs[i].jitter - 0.5));
          ctx.scale(s, s);
          ctx.fillStyle = `rgba(${r},${gg},${b},0.92)`;
          ctx.fill(leaf);
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(${r},${gg},${b},${sky ? 0.55 + 0.4 * k : 0.45 + 0.5 * k})`;
          ctx.beginPath();
          ctx.arc(x, y, (sky ? 1.05 : 1) * (1.15 + 1.5 * k), 0, Math.PI * 2);
          ctx.fill();
        }

        if (m > 0.9 && (!top || inputs[i].jitter > top.j)) top = { x, y, j: inputs[i].jitter };
      }

      // Leaf blanket over the plot: rests, then the breeze lifts it away.
      if (sky) {
        // no blanket in the sky
      } else if (revealOnly) cover.drawSettled(ctx, { x0, y0, size }, height);
      else cover.step(ctx, now, { x0, y0, size }, width, height, mouse);

      // After the reveal, an "extreme event" every ~3 s: a ripple, and a leaf lets go.
      if (animate && (sky || cover.done) && top && now - lastRipple > 3000) {
        ripples.push({ x: top.x, y: top.y, born: now });
        drifting.push({ x: top.x, y: top.y, born: now, spin: Math.random() * 6.28 });
        lastRipple = now;
      }
      for (let i = drifting.length - 1; i >= 0; i -= 1) {
        const d = drifting[i];
        const age = (now - d.born) / 4200;
        if (age > 1 || !leaf) {
          drifting.splice(i, 1);
        } else {
          const fx = d.x - age * size * 0.35 + Math.sin(age * 9) * 10;
          const fy = d.y + age * size * 0.9;
          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(d.spin + age * 5);
          ctx.scale(7 * (0.35 + 0.65 * Math.abs(Math.cos(age * 7))), 7);
          ctx.fillStyle = `rgba(196,80,31,${0.85 * (1 - age)})`;
          ctx.fill(leaf);
          ctx.restore();
        }
      }
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const age = (now - ripples[i].born) / 1600;
        if (age > 1) {
          ripples.splice(i, 1);
        } else {
          ctx.strokeStyle = `rgba(${accent.join(',')},${0.6 * (1 - age)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(ripples[i].x, ripples[i].y, 4 + age * 34, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Axis labels.
      {
        ctx.fillStyle = sky ? 'rgba(34,49,74,0.8)' : `rgba(${ink.join(',')},0.9)`;
        ctx.font = sky ? 'italic 15px "Cormorant Garamond", Georgia, serif' : `11px ${css(document.documentElement, '--font-mono')}`;
        ctx.fillText('U₁', x0 + size - 14, y0 + size + 18);
        ctx.fillText('U₂', x0 - 22, y0 + 12);
      }
    };

    const loop = now => {
      if (visible && now - lastFrame >= frameGap) {
        lastFrame = now;
        draw(now);
      }
      // Phones: play the reveal once, then hold the final frame.
      if (coarse && (sky || cover.done)) return;
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());

    const onResize = () => {
      resize();
      draw(performance.now());
    };
    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse = null;
    };

    window.addEventListener('resize', onResize);
    let io;
    let idle;
    // Phones play the leaf reveal once at a low frame rate, then stop; desktops keep the
    // gentle animation running while the hero is on screen.
    if (animate) {
      if (!coarse) {
        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);
      }
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
      });
      io.observe(wrap);
      // Start animating once the page is idle, so it never competes with first paint.
      const kick = () => {
        raf = requestAnimationFrame(loop);
      };
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(kick, { timeout: 1500 });
      } else {
        idle = setTimeout(kick, 600);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(idle);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (io) io.disconnect();
    };
  }, [animate, framed]);

  return (
    <StyledField ref={wrapRef} aria-hidden="true" className={framed ? 'framed' : ''}>
      <canvas ref={canvasRef} />
      <div className="legend" ref={legendRef}>
        Gumbel copula · θ = <b ref={thetaRef}>2.40</b>
        <br />
        upper-tail dependence χ = <b ref={chiRef}>0.66</b>
      </div>
    </StyledField>
  );
};

TailField.propTypes = {
  animate: PropTypes.bool,
  variant: PropTypes.oneOf(['wide', 'frame', 'sky']),
};

export default TailField;
