import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Layout,
  Hero,
  Stats,
  About,
  Focus,
  Featured,
  Projects,
  Jobs,
  Impact,
  Contact,
} from '@components';
import { PaperLayer, Currents } from '@components/paper';

/* The leaves and the passing birds belong to the cover; below it they fade out, so nothing
   moves across the reading pages. */
const CoverOnly = createGlobalStyle`
  [data-cover-fx] {
    transition: opacity 0.6s ease;
  }
  body.past-cover [data-cover-fx] {
    opacity: 0 !important;
    visibility: hidden;
  }
`;

const usePastCover = () => {
  useEffect(() => {
    const hero = document.getElementById('top');
    const set = () => {
      const h = hero ? hero.offsetHeight : window.innerHeight;
      document.body.classList.toggle('past-cover', window.scrollY > h * 0.6);
    };
    set();
    window.addEventListener('scroll', set, { passive: true });
    return () => {
      window.removeEventListener('scroll', set);
      document.body.classList.remove('past-cover');
    };
  }, []);
};

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

/*
 * Cover → page, as one camera move.
 *
 * The cover and the statistics share one stage. The stage is pinned (position: sticky) for a
 * short run of scroll while a single progress value p (0 → 1) drives everything in it:
 *   - the masthead and the lines over the water fade and lift away (p 0 → 0.35);
 *   - the landscape's depth layers rise at different speeds — sky slowest, river fastest — with
 *     a slight push-in, so the camera seems to sink towards the water;
 *   - the river runs on below the drawing and lightens through blue-grey into the cream paper,
 *     while the mountain and the city dissolve into the same paper;
 *   - the statistics settle in where the river ends.
 * Nothing slides across the screen: every change is position, depth or opacity inside the
 * pinned frame, scrubbed by native scrolling and fully reversible.
 */
const Stage = styled.div`
  position: relative;
  z-index: 1;
  height: calc(var(--pin-h, 100svh) + var(--run));
  --run: 90svh;
  @media (max-width: 700px) {
    --run: 76svh;
  }

  .pin {
    position: sticky;
    top: var(--pin-top, 0px);
    width: 100vw;
    margin: 0 calc(50% - 50vw);
    overflow: hidden;
    background: var(--navy);
  }
  #top .scene {
    transform: scale(calc(1 + var(--zoom, 0)));
    transform-origin: 50% 85%;
  }
  .numbers {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--stats-top, 60%);
    opacity: var(--stats-o, 0);
    translate: 0 var(--stats-y, 24px);
    pointer-events: var(--stats-pe, none);
    padding: 0 150px;
    @media (max-width: 1080px) {
      padding: 0 100px;
    }
    @media (max-width: 768px) {
      padding: 0 50px;
    }
    @media (max-width: 480px) {
      padding: 0 25px;
    }

    > section {
      margin: 0 auto;
      padding: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    height: auto;
    .pin {
      position: relative;
      overflow: visible;
    }
    .numbers {
      position: static;
      opacity: 1;
      translate: none;
      pointer-events: auto;
      padding-top: 64px;
    }
  }
`;

const Sheet = styled.div`
  position: relative;
  z-index: 2;
  margin-top: calc(var(--pull, 0px) * -1);

  /* chapter headings without slide numbers or divider rules */
  .numbered-heading {
    margin: 0 0 26px;
    padding-top: 0;
    font-size: clamp(32px, 4vw, 46px);

    &:before,
    &:after {
      display: none;
    }
  }
  .chapter-lede,
  section .lede {
    margin-top: 0;
  }

  > section {
    position: relative;
    z-index: 1;
    padding-top: 64px;
    padding-bottom: 28px;
    @media (max-width: 768px) {
      padding-top: 52px;
      padding-bottom: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    margin-top: 0;
  }
`;

const clamp01 = v => Math.max(0, Math.min(1, v));
// smoothstep between a and b
const ss = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const useCameraMove = ref => {
  useEffect(() => {
    const stage = ref.current;
    if (!stage) {
      return undefined;
    }
    const pin = stage.querySelector('.pin');
    const numbers = stage.querySelector('.numbers');
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let geo = null;

    const measure = () => {
      const vh = window.innerHeight;
      const pinH = pin.offsetHeight;
      const statsH = numbers.offsetHeight;
      const statsTop = Math.round(Math.max(vh * 0.16, (vh - statsH) / 2 + vh * 0.05));
      const gap = vh < 700 || window.innerWidth < 700 ? 110 : 150;
      const pull = Math.max(0, Math.round(pinH - (statsTop + statsH) - gap));
      stage.style.setProperty('--pin-h', `${pinH}px`);
      stage.style.setProperty('--pin-top', `${Math.min(0, vh - pinH)}px`);
      stage.style.setProperty('--stats-top', `${statsTop + Math.max(0, pinH - vh)}px`);
      root.style.setProperty('--pull', `${pull}px`);
      geo = { vh, pinH, run: stage.offsetHeight - pinH };
    };

    const update = () => {
      frame = 0;
      if (mq.matches) {
        return;
      }
      if (!geo) measure();
      const top = stage.getBoundingClientRect().top + window.scrollY;
      const lead = Math.max(0, geo.pinH - geo.vh);
      const p = clamp01((window.scrollY - top - lead) / Math.max(1, geo.run));
      const s = stage.style;
      s.setProperty('--p', p.toFixed(4));
      s.setProperty('--cam', `${(ss(0, 0.9, p) * geo.vh * 0.7).toFixed(1)}px`);
      s.setProperty('--zoom', (ss(0, 1, p) * 0.05).toFixed(4));
      s.setProperty('--text-o', (1 - ss(0, 0.32, p)).toFixed(3));
      s.setProperty('--text-y', `${(-34 * ss(0, 0.4, p)).toFixed(1)}px`);
      s.setProperty('--fade-far', (1 - ss(0.36, 0.68, p)).toFixed(3));
      s.setProperty('--fade-mid', (1 - ss(0.42, 0.74, p)).toFixed(3));
      s.setProperty('--haze', ss(0.44, 0.68, p).toFixed(3));
      s.setProperty('--fade-water', (1 - ss(0.62, 0.88, p)).toFixed(3));
      const so = ss(0.7, 0.95, p);
      s.setProperty('--stats-o', so.toFixed(3));
      s.setProperty('--stats-y', `${((1 - so) * 26).toFixed(1)}px`);
      s.setProperty('--stats-pe', so > 0.5 ? 'auto' : 'none');
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      geo = null;
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    mq.addEventListener?.('change', onResize);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(pin);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mq.removeEventListener?.('change', onResize);
      if (ro) ro.disconnect();
      cancelAnimationFrame(frame);
      root.style.removeProperty('--pull');
    };
  }, [ref]);
};

const IndexPage = ({ location }) => {
  usePastCover();
  const stage = useRef(null);
  useCameraMove(stage);
  return (
    <Layout location={location}>
      <CoverOnly />
      <StyledMainContainer className="fillHeight">
        <Stage ref={stage}>
          <div className="pin">
            <Hero />
            <Currents />
            <div className="numbers">
              <Stats />
            </div>
          </div>
        </Stage>
        <Sheet>
          <PaperLayer />
          <About />
          <Jobs />
          <Focus />
          <Featured />
          <Projects />
          <Impact />
          <Contact />
        </Sheet>
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
