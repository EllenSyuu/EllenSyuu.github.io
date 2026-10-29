import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import QuebecScene from '@components/cases/quebec-scene';
import TailScene from '@components/cases/tail-scene';
import VintageScene from '@components/cases/vintage-scene';
import ImmunityScene from '@components/cases/immunity-scene';

const SCENES = { quebec: QuebecScene, tail: TailScene, vintage: VintageScene, immunity: ImmunityScene };

/*
 * Selected Work as three case studies. Each one reads top to bottom:
 * the research question → the figure that answers it (mounted like a plate on paper)
 * → two key results → what was built, with code and live links.
 * Content lives in content/featured/<project>/index.md.
 */

const StyledCases = styled.ol`
  ${({ theme }) => theme.mixins.resetList};
  margin-top: 56px;

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

const StyledCase = styled.li`
  position: relative;
  padding: 0 0 72px;
  margin-bottom: 72px;
  border-bottom: 1px solid var(--lightest-navy);

  &:last-of-type {
    margin-bottom: 0;
    border-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    padding-bottom: 52px;
    margin-bottom: 52px;
  }

  .case-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 10px;
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    .index {
      color: var(--dark-slate);
      font-size: 17px;
      font-style: italic;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: none;
      white-space: nowrap;
    }
  }

  .case-title {
    margin: 0;
    color: var(--lightest-slate);
    font-family: var(--font-display);
    font-size: clamp(32px, 4.6vw, 50px);
    font-weight: 600;
    line-height: 1.05;
  }

  .case-package {
    margin: 10px 0 0;
    color: var(--dark-slate);
    font-family: var(--font-hand);
    font-size: 17px;
  }

  .case-question {
    max-width: 30ch;
    margin: 22px 0 30px;
    color: var(--light-slate);
    font-family: var(--font-display);
    font-size: clamp(23px, 2.8vw, 30px);
    font-style: italic;
    font-weight: 500;
    line-height: 1.35;

    &:before {
      content: '“';
      color: var(--green);
    }
    &:after {
      content: '”';
      color: var(--green);
    }
  }

  /* The figure, mounted like a plate on warm paper. */
  .plate {
    margin: 0;
    padding: clamp(12px, 2.4vw, 22px);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, var(--light-navy), #fbf3e6);
    box-shadow: 0 1px 0 #fff inset, 0 26px 50px -34px var(--navy-shadow);

    .plate-link {
      display: block;
      cursor: zoom-in;

      &:after {
        display: none;
      }
    }

    .plate-img {
      display: block;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0 0 0 1px rgba(91, 70, 54, 0.08);
      overflow: hidden;
    }

    figcaption {
      margin-top: 12px;
      color: var(--dark-slate);
      font-size: var(--fz-sm);
      line-height: 1.5;

      b {
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-xxs);
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-right: 6px;
      }
    }
  }

  .case-body {
    display: grid;
    grid-template-columns: 1fr 1fr 1.25fr;
    gap: 28px;
    margin-top: 32px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 22px;
    }
  }

  .result {
    padding-top: 16px;
    border-top: 0.75px solid var(--ink);

    .value {
      display: block;
      color: var(--lightest-slate);
      font-family: var(--font-display);
      font-size: clamp(28px, 3.4vw, 36px);
      font-weight: 500;
      line-height: 1.1;
    }

    .label {
      margin: 8px 0 0;
      color: var(--slate);
      font-size: var(--fz-sm);
      line-height: 1.55;
    }
  }

  .built {
    @media (max-width: 900px) {
      grid-column: 1 / -1;
    }

    h4 {
      margin: 0 0 10px;
      color: var(--green);
      font-family: var(--font-serif);
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .built-text p {
      margin: 0;
      color: var(--slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
    }

    code {
      font-size: 0.9em;
    }
  }

  .tech {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    gap: 4px 0;
    margin-top: 14px;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;

    li + li:before {
      content: '·';
      margin: 0 8px;
      color: var(--green);
    }
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 15px 8px;
      border: 0.75px solid var(--ink);
      border-radius: 0;
      color: var(--ink);
      font-family: var(--font-serif);
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      line-height: 1;
      transition: var(--transition);

      svg {
        width: 13px;
        height: 13px;
      }

      &:hover,
      &:focus-visible {
        background: var(--ink);
        color: var(--navy);
      }

      &:after {
        display: none;
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { frontmatter: { date: ASC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              slug
              package
              overline
              question
              scene
              figure {
                publicURL
                childImageSharp {
                  gatsbyImageData(
                    width: 1000
                    layout: CONSTRAINED
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
              figureAlt
              figureCaption
              results {
                value
                label
              }
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const cases = data.featured.edges.map(({ node }) => node);
  const revealTitle = useRef(null);
  const revealCases = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealCases.current.forEach(ref => ref && sr.reveal(ref, srConfig()));
  }, [prefersReducedMotion]);

  const pad = n => String(n).padStart(2, '0');

  return (
    <section id="projects">
      <div ref={revealTitle}>
        <h2 className="numbered-heading">Selected Work</h2>
        <p className="chapter-lede">
          Four case studies — the question, the evidence, and the code to rerun it yourself.
        </p>
      </div>

      <StyledCases>
        {cases.map(({ frontmatter, html }, i) => {
          const {
            title,
            slug,
            package: pkg,
            overline,
            question,
            scene,
            figure,
            figureAlt,
            figureCaption,
            results = [],
            tech = [],
            github,
            external,
          } = frontmatter;
          const image = getImage(figure);

          return (
            <StyledCase
              key={title}
              id={slug ? `case-${slug}` : undefined}
              ref={el => (revealCases.current[i] = el)}>
              <div className="case-head">
                <span>{overline}</span>
                <span className="index">
                  {pad(i + 1)} / {pad(cases.length)}
                </span>
              </div>
              <h3 className="case-title">
                <span className="mark">{title}</span>
              </h3>
              {pkg && <p className="case-package">{pkg}</p>}
              {question && <p className="case-question">{question}</p>}

              {SCENES[scene] ? (
                React.createElement(SCENES[scene])
              ) : image && (
                <figure className="plate">
                  <a
                    className="plate-link"
                    href={figure.publicURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open figure ${i + 1} at full size`}>
                    <GatsbyImage image={image} alt={figureAlt || title} className="plate-img" />
                  </a>
                  {figureCaption && (
                    <figcaption>
                      <b>Fig. {i + 1}</b>
                      {figureCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              <div className="case-body">
                {results.map(r => (
                  <div className="result" key={r.value}>
                    <span className="value">{r.value}</span>
                    <p className="label">{r.label}</p>
                  </div>
                ))}

                <div className="built">
                  <h4>What I built</h4>
                  <div className="built-text" dangerouslySetInnerHTML={{ __html: html }} />
                  {tech.length > 0 && (
                    <ul className="tech">
                      {tech.map(t => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {(github || external || (SCENES[scene] && figure)) && (
                    <div className="links">
                      {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer">
                          <Icon name="GitHub" /> Code
                        </a>
                      )}
                      {external && (
                        <a href={external} target="_blank" rel="noopener noreferrer">
                          <Icon name="External" /> Live demo
                        </a>
                      )}
                      {SCENES[scene] && figure && (
                        <a href={figure.publicURL} target="_blank" rel="noopener noreferrer">
                          <Icon name="External" /> Original figure
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </StyledCase>
          );
        })}
      </StyledCases>
    </section>
  );
};

export default Featured;
