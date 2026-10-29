import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import Vignette, { hasVignette } from '@components/impact/vignette';
// KaTeX styles only load on pages that can contain maths.
import 'katex/dist/katex.min.css';

const StyledPostContainer = styled.main`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;

  .overline {
    margin: 0 0 15px;
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .tag {
    margin-right: 10px;
  }

  .cover {
    ${({ theme }) => theme.mixins.boxShadow};
    margin-top: 40px;
    border-radius: var(--border-radius);
    overflow: hidden;
  }
`;
const StyledPostContent = styled.div`
  max-width: 760px;
  margin-bottom: 100px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p,
  li {
    line-height: 1.6;
    color: var(--light-slate);
  }

  p {
    margin: 1em 0;
  }

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  blockquote {
    margin: 2em 0;
    padding-left: 24px;
    border-left: 2px solid var(--green);

    p {
      color: var(--lightest-slate);
      font-size: var(--fz-xxl);
      font-style: italic;
    }
  }

  code {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    border-radius: var(--border-radius);
    font-size: var(--fz-sm);
    padding: 0.2em 0.4em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }

  .katex {
    color: var(--lightest-slate);
  }

  .katex-display {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 0;
  }
`;

const PostTemplate = ({ data, location }) => {
  const { frontmatter, html, fileAbsolutePath } = data.markdownRemark;
  const { title, date, tags, overline, location: place, cover, coverAlt, slug } = frontmatter;
  const isImpact = /\/content\/impact\//.test(fileAbsolutePath);
  const image = cover ? getImage(cover) : null;

  return (
    <Layout location={location}>
      <Helmet title={title} />

      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          {isImpact ? <Link to="/impact">All stories</Link> : <Link to="/notes">All notes</Link>}
        </span>

        <StyledPostHeader>
          {overline && <p className="overline">{overline}</p>}
          <h1 className="medium-heading">{title}</h1>
          <p className="subtitle">
            {!isImpact && date && (
              <time>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {isImpact && place && <span>{place}</span>}
            {tags && tags.length > 0 && <span>&nbsp;&mdash;&nbsp;</span>}
            {tags &&
              tags.map((tag, i) => (
                <Link key={i} to={`/notes/tags/${kebabCase(tag)}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>

          {hasVignette(slug) ? (
            <div className="cover">
              <Vignette slug={slug} />
            </div>
          ) : image && (
            <div className="cover">
              <GatsbyImage image={image} alt={coverAlt || title} />
            </div>
          )}
        </StyledPostHeader>

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledPostContainer>
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      fileAbsolutePath
      frontmatter {
        title
        description
        date
        slug
        tags
        overline
        location
        coverAlt
        cover {
          childImageSharp {
            gatsbyImageData(width: 1000, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  }
`;
