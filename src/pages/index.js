import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Layout, Hero } from '@components';
import SpreadA from '@components/phase1/a-spread';
import MarginB from '@components/phase1/b-margin';
import RoomC from '@components/phase1/c-room';

/* Phase-1 prototype: the cover, About and the way into Experience only.
   GATSBY_VARIANT=A|B|C chooses the composition at build time. */

const VARIANTS = { A: SpreadA, B: MarginB, C: RoomC };
const Variant = VARIANTS[process.env.GATSBY_VARIANT] || SpreadA;

/* The leaves and the passing birds belong to the cover. Below it they fade out, so nothing
   moves over the reading pages. */
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
    return () => window.removeEventListener('scroll', set);
  }, []);
};

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const End = styled.p`
  margin: 120px 0 0;
  padding: 18px 0 40px;
  border-top: 1px dashed rgba(20, 33, 58, 0.3);
  color: #5d6880;
  font: 500 11px/1.4 Inter, sans-serif;
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
`;

const IndexPage = ({ location }) => {
  usePastCover();
  return (
    <Layout location={location}>
      <CoverOnly />
      <StyledMainContainer className="fillHeight">
        <Hero />
        <Variant />
        <End>
          Phase 1 prototype {process.env.GATSBY_VARIANT || 'A'} ends here · remaining sections not
          yet redesigned
        </End>
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
