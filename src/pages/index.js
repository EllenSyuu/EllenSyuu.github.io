import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Layout, Hero } from '@components';
import FieldD from '@components/phase1/d-field';

/* Phase-1 prototype: the cover, About and the way into Experience only.
   GATSBY_FIELD=gold|blue|red chooses the colour of the field. */

const Variant = FieldD;

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
          Phase 1 prototype D ({process.env.GATSBY_FIELD || 'gold'}) ends here · remaining sections
          not yet redesigned
        </End>
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
