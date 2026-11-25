import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Focus, Featured, Projects, Jobs, Impact, Contact } from '@components';
import ArtLayer from '@components/art/layer';
import VariantStyle from '@components/art/variant-style';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <VariantStyle />
    <StyledMainContainer className="fillHeight">
      <ArtLayer />
      <Hero />
      <About />
      <Jobs />
      <Focus />
      <Featured />
      <Projects />
      <Impact />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
