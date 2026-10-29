import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import ImpactCard, { StyledImpactGrid } from '@components/impact/card';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;
  }
`;

const ImpactPage = ({ location, data }) => (
  <Layout location={location}>
    <Helmet title="Impact" />

    <StyledMainContainer>
      <header>
        <h1 className="big-heading">Beyond the Code</h1>
        <p className="subtitle">leadership, teaching and public-interest work</p>
      </header>

      <StyledImpactGrid>
        {data.stories.nodes.map(node => (
          <ImpactCard key={node.id} node={node} headingLevel={2} />
        ))}
      </StyledImpactGrid>
    </StyledMainContainer>
  </Layout>
);

ImpactPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ImpactPage;

export const pageQuery = graphql`
  {
    stories: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/impact/" }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { order: ASC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          overline
          description
          coverAlt
          cover {
            childImageSharp {
              gatsbyImageData(width: 720, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
            }
          }
        }
      }
    }
  }
`;
