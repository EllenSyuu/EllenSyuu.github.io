import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { LEAF_COLOURS, pick } from '@utils/leaves';
import { isFrost } from '@utils/season';
import { paintLeaf } from '@utils/maple';

/*
 * A few autumn leaves drifting down over the cover; below it no new leaves start, so the
 * drawings and text further down stay calm. Each leaf follows a damped sway, spins,
 * and "flips" (a scaleX of cos φ fakes 3D rotation). Scrolling adds a gust of wind;
 * the cursor gently pushes leaves aside. Desktop only, paused when the tab is hidden.
 */

const StyledCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: -1; /* behind the content: leaves pass under text and cards */
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const FallingLeaves = () => {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const desktop = window.matchMedia('(any-pointer: fine) and (min-width: 900px)').matches;
    if (prefersReducedMotion || !desktop) return undefined;

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let wind = 0;
    let lastScroll = window.scrollY;
    let mouse = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    // In the first-frost season: light snow, with the odd last leaf among it.
    const COUNT = isFrost
      ? Math.round(Math.min(26, Math.max(14, window.innerWidth / 70)))
      : Math.round(Math.min(7, Math.max(4, window.innerWidth / 240)));
    const spawn = (initial = false) => {
      const depth = Math.random(); // 0 = far, 1 = near
      if (isFrost && Math.random() < 0.88) {
        return {
          snow: true,
          x: Math.random() * w,
          y: initial ? Math.random() * h : -20 - Math.random() * 80,
          size: depth > 0.72 ? 3 + (depth - 0.72) * 9 : 1 + depth * 2.4,
          vy: 14 + depth * 26,
          sway: 6 + Math.random() * 16,
          swayFreq: 0.25 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.6,
          alpha: 0.45 + depth * 0.45,
          dx: 0,
        };
      }
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -40 - Math.random() * 120,
        size: 9 + depth * 11,
        vy: 9 + depth * 17, // px / s — slow, unhurried
        sway: 18 + Math.random() * 34,
        swayFreq: 0.3 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.9,
        flipFreq: 0.4 + Math.random() * 0.7,
        colour: pick(LEAF_COLOURS, Math.random()),
        alpha: 0.28 + depth * 0.38,
        dx: 0,
      };
    };

    resize();
    const leaves = Array.from({ length: COUNT }, () => spawn(true));

    const draw = now => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      wind *= 0.96;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      leaves.forEach((l, i) => {
        l.y += (l.vy + Math.abs(wind) * 0.15) * dt;
        l.dx += wind * dt * (0.4 + l.alpha);
        l.dx *= 0.985;
        l.rot += (l.spin + wind * 0.004) * dt;

        let x = l.x + Math.sin(t * l.swayFreq + l.phase) * l.sway + l.dx;
        if (mouse) {
          const ddx = x - mouse.x;
          const ddy = l.y - mouse.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < 14000) {
            const push = (1 - d2 / 14000) * 90 * dt * 6;
            l.dx += (ddx / Math.sqrt(d2 + 1)) * push;
            x = l.x + Math.sin(t * l.swayFreq + l.phase) * l.sway + l.dx;
          }
        }

        if (l.y > h + 40 || x < -80 || x > w + 80) {
          // New leaves only start falling while the cover is in view; further down the page
          // the drawings and text stay calm.
          leaves[i] = window.scrollY < h * 0.6 ? spawn(false) : { ...spawn(false), y: -9999, vy: 0 };
          return;
        }
        if (l.y < -1000) {
          if (window.scrollY < h * 0.6) leaves[i] = spawn(false);
          return;
        }

        if (l.snow) {
          ctx.save();
          ctx.translate(x, l.y);
          if (l.size < 3) {
            // Far flakes: out of focus, a soft pale dot.
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2.6);
            g.addColorStop(0, `rgba(255,255,255,${0.95 * l.alpha})`);
            g.addColorStop(0.45, `rgba(214,224,234,${0.55 * l.alpha})`);
            g.addColorStop(1, 'rgba(214,224,234,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, l.size * 2.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Near flakes: a six-armed crystal in hairline, turning slowly.
            ctx.rotate(l.rot);
            ctx.strokeStyle = `rgba(96,124,154,${0.7 * l.alpha})`;
            ctx.lineWidth = 0.6;
            ctx.lineCap = 'round';
            const R = l.size * 2.4;
            ctx.beginPath();
            for (let k = 0; k < 6; k += 1) {
              const a = (k * Math.PI) / 3;
              const ca = Math.cos(a);
              const sa = Math.sin(a);
              ctx.moveTo(0, 0);
              ctx.lineTo(ca * R, sa * R);
              [0.5, 0.74].forEach(u => {
                const bx = ca * R * u;
                const by = sa * R * u;
                const len = R * (u === 0.5 ? 0.3 : 0.2);
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + Math.cos(a + 1.05) * len, by + Math.sin(a + 1.05) * len);
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + Math.cos(a - 1.05) * len, by + Math.sin(a - 1.05) * len);
              });
            }
            ctx.stroke();
          }
          ctx.restore();
          return;
        }
        const flip = Math.cos(t * l.flipFreq + l.phase);
        paintLeaf(ctx, { x, y: l.y, size: l.size, rot: l.rot, flip, rgb: l.colour, alpha: Math.min(1, l.alpha + 0.3) });
      });
    };

    const loop = now => {
      if (!document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const y = window.scrollY;
      wind += Math.max(-60, Math.min(60, (y - lastScroll) * 0.9));
      lastScroll = y;
    };
    const onMove = e => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouse = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let idle;
    const kick = () => {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(kick, { timeout: 1500 });
    else idle = setTimeout(kick, 700);

    return () => {
      cancelAnimationFrame(raf);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(idle);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [prefersReducedMotion]);

  return <StyledCanvas ref={ref} aria-hidden="true" />;
};

export default FallingLeaves;
