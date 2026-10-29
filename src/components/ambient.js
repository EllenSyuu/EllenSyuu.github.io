import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

/*
 * Site-wide motion layer:
 *  - reading-progress bar along the top edge
 *  - soft spotlight that follows the cursor (fine pointers only)
 *  - section-heading rules that draw in when they enter the viewport
 * Everything is skipped when the visitor prefers reduced motion.
 */

const StyledProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  z-index: 50;
  transform-origin: left;
  transform: scaleX(0);
  background: var(--maple);
  pointer-events: none;
`;

const StyledSpotlight = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
  background: radial-gradient(
    560px circle at var(--mx, 50%) var(--my, 50%),
    rgba(226, 176, 74, 0.13),
    transparent 62%
  );

  &.on {
    opacity: 1;
  }
`;

const Ambient = () => {
  const progressRef = useRef(null);
  const spotRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Desktop-only flourish: skip entirely on touch devices and small screens.
    const desktop = window.matchMedia('(any-pointer: fine) and (min-width: 900px)').matches;
    if (prefersReducedMotion || !desktop) {
      return;
    }
    const cleanups = [];
    document.body.classList.add('motion');
    cleanups.push(() => document.body.classList.remove('motion'));

    // Reading progress.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    // Cursor spotlight.
    const fine = window.matchMedia('(any-pointer: fine)').matches;
    if (fine && spotRef.current) {
      const el = spotRef.current;
      const onMove = e => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
        el.classList.add('on');
      };
      const onLeave = () => el.classList.remove('on');
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
      });
    }

    // Heading rules draw in on first view.
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.6 },
    );
    document.querySelectorAll('.numbered-heading').forEach(el => io.observe(el));
    cleanups.push(() => io.disconnect());

    return () => cleanups.forEach(fn => fn());
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <StyledProgress className="progress-bar" ref={progressRef} aria-hidden="true" />
      <StyledSpotlight className="spotlight" ref={spotRef} aria-hidden="true" />
    </>
  );
};

export default Ambient;
