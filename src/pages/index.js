import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

/* Everything below the cover hangs on one thread: the river leaves the bottom of the cover and
   runs down the left margin of the page to Contact. Chapter headings are stops on it, so the
   page reads as one continuous scroll rather than a stack of slides. */
const Thread = styled.div`
  --thread-x: -56px;
  position: relative;

  @media (max-width: 1080px) {
    --thread-x: -44px;
  }
  @media (max-width: 768px) {
    --thread-x: -28px;
  }
  @media (max-width: 480px) {
    --thread-x: -13px;
  }

  /* the line sits on the left edge of the 1080px reading column every section shares */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 160px;
    left: calc(max(0px, (100% - 1080px) / 2) + var(--thread-x));
    width: 1.5px;
    background: linear-gradient(180deg, #1d3557 0, #3f6f96 120px, rgba(63, 111, 150, 0.45) 520px);
    pointer-events: none;
  }

  /* chapter headings become stops on the line instead of numbered slide titles */
  .numbered-heading {
    margin: 0 0 26px;
    padding-top: 0;
    font-size: clamp(32px, 4vw, 46px);

    &:before {
      content: '';
      counter-increment: none;
      position: absolute;
      top: 0.42em;
      left: calc(var(--thread-x) - 4.25px);
      width: 10px;
      height: 10px;
      margin: 0;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 0 4px var(--navy);
    }
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

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <Thread>
        <Stats />
        <About />
        <Jobs />
        <Focus />
        <Featured />
        <Projects />
        <Impact />
        <Contact />
      </Thread>
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
