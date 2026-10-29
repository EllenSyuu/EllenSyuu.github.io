import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Vignette, { hasVignette } from './vignette';

// Photo card in the v4 language: navy card, mint overline, duotone photo that turns
// to full colour on hover (same treatment as the About photo).
const StyledCard = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .card__inner {
        transform: translateY(-7px);
      }
    }
  }

  &:hover,
  &:focus-within {
    .card__media {
      background-color: transparent;

      &:before {
        opacity: 0;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .card__title {
      color: var(--green);
    }
  }

  .card__inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 0;
    background-color: var(--light-navy);
    overflow: hidden;
    transition: var(--transition);
  }

  .card__media {
    position: relative;
    aspect-ratio: 16 / 10;
    background-color: var(--photo-tint);
    border-bottom: 0.75px solid var(--hairline);
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
      background-color: transparent;
      mix-blend-mode: normal;
      transition: var(--transition);
    }

    .img {
      width: 100%;
      height: 100%;
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }
  }

  .card__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.75rem 1.75rem 2rem;
  }

  .card__overline {
    margin: 0 0 10px;
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .card__title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: 26px;
    transition: var(--transition);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 3;
        inset: 0;
      }
    }
  }

  .card__desc {
    margin: 0;
    color: var(--light-slate);
    font-size: 17px;
  }
`;

const ImpactCard = ({ node, innerRef, style, headingLevel = 3 }) => {
  const Heading = `h${headingLevel}`;
  const { title, slug, overline, description, cover, coverAlt } = node.frontmatter;
  const image = cover ? getImage(cover) : null;

  return (
    <StyledCard ref={innerRef} style={style}>
      <div className="card__inner">
        {hasVignette(slug) ? (
          <div className="card__media">
            <Vignette slug={slug} />
          </div>
        ) : image && (
          <div className="card__media">
            <GatsbyImage image={image} alt={coverAlt || title} className="img" />
          </div>
        )}
        <div className="card__body">
          {overline && <p className="card__overline">{overline}</p>}
          <Heading className="card__title">
            <Link to={slug}>{title}</Link>
          </Heading>
          {description && <p className="card__desc">{description}</p>}
        </div>
      </div>
    </StyledCard>
  );
};

ImpactCard.propTypes = {
  node: PropTypes.object.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object,
  headingLevel: PropTypes.number,
};

export const StyledImpactGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 15px;
  position: relative;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

export default ImpactCard;
