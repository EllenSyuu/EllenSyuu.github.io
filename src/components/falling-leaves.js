import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { maplePath, almondPath, oakPath, LEAF_COLOURS, pick } from '@utils/leaves';

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
    const shapes = [maplePath(), maplePath(), oakPath(), almondPath()];
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

    const COUNT = Math.round(Math.min(7, Math.max(4, window.innerWidth / 240)));
    const spawn = (initial = false) => {
      const depth = Math.random(); // 0 = far, 1 = near
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -40 - Math.random() * 120,
        size: 7 + depth * 11,
        vy: 9 + depth * 17, // px / s — slow, unhurried
        sway: 18 + Math.random() * 34,
        swayFreq: 0.3 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.9,
        flipFreq: 0.4 + Math.random() * 0.7,
        shape: pick(shapes, Math.random()),
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

        const flip = Math.cos(t * l.flipFreq + l.phase);
        const [r, g, b] = l.colour;
        ctx.save();
        ctx.translate(x, l.y);
        ctx.rotate(l.rot);
        ctx.scale(l.size * (0.25 + 0.75 * Math.abs(flip)), l.size);
        // Darker underside when the leaf is "flipped".
        const shade = flip < 0 ? 0.78 : 1;
        ctx.fillStyle = `rgba(${Math.round(r * shade)},${Math.round(g * shade)},${Math.round(
          b * shade,
        )},${l.alpha})`;
        ctx.fill(l.shape);
        // Mid-vein.
        ctx.strokeStyle = `rgba(255,240,220,${0.35 * l.alpha})`;
        ctx.lineWidth = 0.06;
        ctx.beginPath();
        ctx.moveTo(0, -0.7);
        ctx.lineTo(0, 0.9);
        ctx.stroke();
        ctx.restore();
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
