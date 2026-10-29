import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';

/*
 * Shared pieces for the animated case-study scenes.
 *
 * - useScene(): `ref` for the scene root, `live` (on screen and motion allowed) and
 *   `reduced` (prefers-reduced-motion). CSS/SMIL loops are paused through the
 *   `data-live` attribute, so nothing animates off screen.
 * - useCountUp(): eases a number towards its target.
 * - Scene: the illustrated frame + an optional floating data card, which drops
 *   below the illustration on narrow screens.
 */

export const useScene = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [seen, setSeen] = useState(false);
  // Mount the (large) illustration only when it comes near the viewport, so the page
  // hydrates quickly; until then the frame shows its background colour.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      setSeen(true);
      setNear(true);
      return undefined;
    }
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    nearIo.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      nearIo.disconnect();
    };
  }, []);

  // Pause SMIL animations in this scene while it is off screen.
  useEffect(() => {
    const svg = ref.current && ref.current.querySelector('svg');
    if (!svg || !svg.pauseAnimations) return;
    if (visible && !reduced) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [visible, reduced, near]);

  return { ref, live: visible && !reduced, seen, reduced, near };
};

export const useCountUp = (target, { decimals = 2, duration = 900, run = true } = {}) => {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (!run) {
      setValue(target);
      from.current = target;
      return undefined;
    }
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      const v = a + (target - a) * e;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, run]);

  return value.toFixed(decimals);
};

/* Atelier palette: blue-black ink and graphite on warm paper; orange only for the warm
   things (clouds, maples, leaves) and for the data that matters. */
export const INK = '#22314a';
export const GRAPH = '#6f7b8c';
export const FAINT = '#b4bcc7';
export const PAPER = '#f6f1e6';
export const FACE = '#eee6d6';
export const ORANGE = '#cf602b';
export const AMBER = '#e0a046';
export const RUST = '#a3432a';
export const SERIF = '"Cormorant Garamond", Garamond, Georgia, serif';
export const HAND = '"La Belle Aurore", cursive';
export const GREEK = "Georgia, 'Times New Roman', serif";

/* Pen draw-in on first view. Give the SVG className={drawClass(scene)} and use
   .ink (with pathLength="1"), .fade and .write on elements; stagger with style={delay(t)}. */
export const drawClass = scene => `${scene.seen || scene.reduced ? 'on' : ''} ${scene.reduced ? 'still' : ''}`;
export const delay = t => ({ transitionDelay: `${t}s` });
export const drawCss = `
  .ink {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.5s cubic-bezier(0.55, 0.05, 0.25, 1);
  }
  .fade {
    opacity: 0;
    transition: opacity 1.2s ease;
  }
  .write {
    clip-path: inset(-20% 100% -20% 0);
    transition: clip-path 1.3s cubic-bezier(0.5, 0, 0.3, 1);
  }
  &.on .ink { stroke-dashoffset: 0; }
  &.on .fade { opacity: 1; }
  &.on .write { clip-path: inset(-20% -5% -20% 0); }
  &.still .ink, &.still .fade, &.still .write { transition: none; }
`;

export const StyledScene = styled.div`
  position: relative;
  margin: 0;

  .frame {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 2px;
    background: ${PAPER};
    box-shadow: 0 0 0 0.75px rgba(34, 49, 74, 0.28), 0 30px 60px -44px rgba(34, 49, 74, 0.45);
    isolation: isolate;

    > svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* Paper grain over the whole drawing. */
    &:after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      background-image: url(${withPrefix('/grain.png')});
      background-size: 160px;
      mix-blend-mode: multiply;
      opacity: 0.3;
    }
  }

  /* Paused off screen and for reduced motion. */
  &[data-live='false'] * {
    animation-play-state: paused !important;
  }

  .card {
    position: absolute;
    z-index: 4;
    width: min(320px, 37%);
    padding: 16px 20px 14px;
    border-radius: 0;
    background: rgba(250, 247, 240, 0.94);
    box-shadow: 0 0 0 0.75px ${INK}, 0 22px 40px -30px rgba(34, 49, 74, 0.55);
    outline: 0.75px solid rgba(34, 49, 74, 0.35);
    outline-offset: -6px;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: ${INK};
    font-size: var(--fz-sm);

    @media (max-width: 820px) {
      position: static;
      width: auto;
      margin-top: 14px;
      backdrop-filter: none;
    }
  }

  .kicker {
    margin: 0 0 2px;
    color: ${GRAPH};
    font-family: ${SERIF};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .big {
    display: block;
    color: ${INK};
    font-family: ${SERIF};
    font-size: clamp(36px, 4vw, 44px);
    font-weight: 500;
    line-height: 1;
    font-variant-numeric: lining-nums tabular-nums;
  }

  .note {
    margin: 8px 0 0;
    color: #4a5568;
    font-family: ${SERIF};
    font-size: 15px;
    font-style: italic;
    line-height: 1.3;
  }

  .hand {
    font-family: ${HAND};
    color: ${GRAPH};
  }

  .tabs-hint {
    margin: 0 0 6px;
    color: ${ORANGE};
    font-family: ${HAND};
    font-size: 16px;

    i {
      display: none;
    }
  }

  @keyframes tabProgress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    margin: 0 0 12px;
    border: 0.75px solid ${INK};

    button {
      position: relative;
      overflow: hidden;
      padding: 6px 0 7px;
      border: 0;
      border-left: 0.75px solid ${INK};
      border-radius: 0;
      background: transparent;
      color: ${INK};
      font-family: ${SERIF};
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: background 0.35s, color 0.35s;

      &:first-child {
        border-left: 0;
      }

      &:hover {
        background: rgba(207, 96, 43, 0.08);
      }

      &[aria-pressed='true'] {
        background: ${ORANGE};
        color: #fffaf2;
      }

      /* Auto-play progress under the active tab. */
      .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: rgba(255, 250, 242, 0.75);
        transform-origin: left;
        animation: tabProgress var(--cycle, 5.2s) linear forwards;
      }
    }
  }

  .caption {
    margin: 12px 2px 0;
    color: ${GRAPH};
    font-family: ${SERIF};
    font-size: 15px;
    font-style: italic;
    line-height: 1.45;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

export const Scene = ({ scene, card, caption, children, label }) => (
  <StyledScene ref={scene.ref} data-live={scene.live ? 'true' : 'false'}>
    <div className="frame" role="img" aria-label={label}>
      {scene.near ? children : null}
    </div>
    {card}
    {caption && <p className="caption">{caption}</p>}
  </StyledScene>
);
