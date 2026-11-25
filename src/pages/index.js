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

/* The cover stays put while the page slides up over it like a sheet of paper laid on a print:
   the cover sinks back a little and dims as the sheet covers it. One continuous movement
   instead of a cut between two slides. */
const Stage = styled.div`
  position: sticky;
  top: var(--cover-top, 0px);
  z-index: 0;

  > section {
    transform: translate3d(0, calc(var(--p, 0) * -4vh), 0) scale(calc(1 - var(--p, 0) * 0.045));
    transform-origin: 50% 100%;
    will-change: transform;
  }
  &:after {
    content: '';
    position: absolute;
    inset: 0 calc(50% - 50vw);
    background: #14213a;
    opacity: calc(var(--p, 0) * 0.3);
    pointer-events: none;
  }
`;

const Sheet = styled.div`
  position: relative;
  z-index: 1;
  padding-top: 8px;

  /* the paper itself, edge to edge, with a soft shadow on its leading edge */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(50% - 50vw);
    right: calc(50% - 50vw);
    z-index: -1;
    background: var(--navy);
    box-shadow: 0 -22px 60px rgba(20, 33, 58, 0.28);
  }

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
    padding-top: 64px;
    padding-bottom: 28px;
    @media (max-width: 768px) {
      padding-top: 52px;
      padding-bottom: 20px;
    }
  }
`;

const useSheet = ref => {
  useEffect(() => {
    const stage = ref.current;
    if (!stage) {
      return undefined;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = stage.offsetHeight;
      stage.style.setProperty('--cover-top', `${Math.min(0, window.innerHeight - h)}px`);
      if (!reduce) {
        const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, h)));
        stage.style.setProperty('--p', p.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
};

const IndexPage = ({ location }) => {
  usePastCover();
  const stage = useRef(null);
  useSheet(stage);
  return (
    <Layout location={location}>
      <CoverOnly />
      <StyledMainContainer className="fillHeight">
        <Stage ref={stage}>
          <Hero />
        </Stage>
        <Sheet>
          <Stats />
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
