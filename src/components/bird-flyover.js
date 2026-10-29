import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

/*
 * Now and then a bird crosses the page — a seagull or a pigeon drawn in ink, flapping and
 * gliding on a gentle curve, like a figure sketched in the margin of a plate. The first one
 * comes after a few seconds, then one every minute or so. Nothing runs between flights,
 * nothing happens while the tab is hidden, and there are no birds with reduced motion.
 */

const StyledSky = styled.svg`
  position: fixed;
  inset: 0;
  z-index: 40;
  width: 100vw;
  height: 100vh;
  overflow: visible;
  pointer-events: none;
`;

const INK = '#22314a';
const ORANGE = '#cf602b';

// Wing pair seen from below: an "M" whose height follows the flap phase (−1 … 1).
const gullWings = f => {
  const a = 4 + f * 9;
  return `M-17 ${(-a * 0.55).toFixed(1)} Q-9 ${(-a - 4).toFixed(1)} -1 0 M1 0 Q9 ${(-a - 4).toFixed(1)} 17 ${(-a * 0.55).toFixed(1)}`;
};
const pigeonWings = f => {
  const a = 3 + f * 8;
  return `M-3 -1 Q-8 ${(-a - 5).toFixed(1)} -15 ${(-a * 0.7).toFixed(1)} Q-9 ${(-a * 0.2).toFixed(1)} -2 1 M2 -1 Q7 ${(-a - 5).toFixed(1)} 13 ${(-a * 0.7).toFixed(1)} Q8 ${(-a * 0.2).toFixed(1)} 2 1`;
};

const BirdFlyover = () => {
  const gRef = useRef(null);
  const wingRef = useRef(null);
  const bodyRef = useRef(null);
  const beakRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    let timer = 0;
    let n = 0;

    const fly = () => {
      if (document.hidden) {
        timer = setTimeout(fly, 8000);
        return;
      }
      const g = gRef.current;
      if (!g) return;
      const kind = n % 3 === 2 ? 'pigeon' : 'gull';
      n += 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ltr = Math.random() < 0.6;
      const y0 = h * (0.12 + Math.random() * 0.3);
      const y1 = y0 + (Math.random() - 0.5) * h * 0.18;
      const scale = (kind === 'gull' ? 1 : 0.85) * (0.9 + Math.random() * 0.6) * (w < 700 ? 0.75 : 1);
      const dur = (kind === 'gull' ? 13000 : 9500) * (w < 700 ? 0.7 : 1);
      const flapHz = kind === 'gull' ? 2.2 : 4.4;

      bodyRef.current.setAttribute(
        'd',
        kind === 'gull'
          ? 'M-5 0.5 Q0 -2 6 0 Q8 0.4 9 1 Q2 2.6 -5 0.5 Z M-5 0.5 L-9 2 L-6 -0.4'
          : 'M-7 1 Q-2 -4 6 -1 Q9 -0.5 10 0.8 Q4 4 -7 1 Z M-7 1 L-11 3 L-10 0',
      );
      beakRef.current.setAttribute('d', kind === 'gull' ? 'M9 1 L11.5 1.4 L9 1.8 Z' : 'M10 0.8 L12 1.1 L10 1.5 Z');
      g.style.opacity = '1';

      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / dur);
        const x = ltr ? -60 + (w + 120) * t : w + 60 - (w + 120) * t;
        const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 3) * 14;
        // Flap in bursts, then glide with wings held up.
        const sec = (now - start) / 1000;
        const gliding = kind === 'gull' && Math.sin(sec * 0.9) > 0.35;
        const f = gliding ? 0.35 + Math.sin(sec * 2) * 0.05 : Math.sin(sec * Math.PI * 2 * flapHz);
        wingRef.current.setAttribute('d', kind === 'gull' ? gullWings(f) : pigeonWings(f));
        const tilt = Math.cos(t * Math.PI * 3) * 4;
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - f * 1.5).toFixed(1)}) scale(${ltr ? scale : -scale} ${scale}) rotate(${tilt.toFixed(1)})`);
        if (t < 1) raf = requestAnimationFrame(step);
        else {
          g.style.opacity = '0';
          timer = setTimeout(fly, 45000 + Math.random() * 40000);
        }
      };
      raf = requestAnimationFrame(step);
    };

    timer = setTimeout(fly, 7000 + Math.random() * 6000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <StyledSky aria-hidden="true">
      <g ref={gRef} style={{ opacity: 0, transition: 'opacity 0.6s' }}>
        <path ref={wingRef} fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={bodyRef} fill="#f6f1e6" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
        <path ref={beakRef} fill={ORANGE} />
      </g>
    </StyledSky>
  );
};

export default BirdFlyover;
