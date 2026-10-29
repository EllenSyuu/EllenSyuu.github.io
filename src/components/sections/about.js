import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

// The path so far, oldest first. Shown as a timeline beside the short bio.
const PATH = [
  {
    place: 'Hong Kong',
    title: 'B.Sc. Statistics, University of Hong Kong',
    note: 'Dean’s Honours List; exchange semester at McGill (2022). Research assistant in epidemiology (co-author in Vaccines); final-year project on Omicron hybrid immunity.',
  },
  {
    place: 'Montréal',
    title: 'M.Sc. Mathematics & Statistics, McGill',
    note: 'Thesis on covariate-dependent Archimax copulas for rainfall extremes in Québec.',
  },
  {
    place: 'Montréal',
    title: 'UNESCO Institute for Statistics',
    note: 'SDG 4 education statistics: cohort models and release-vintage analytics.',
    now: true,
  },
];

const LANGUAGES = ['English', 'Français', '普通话', '廣東話', '日本語'];

const StyledAboutSection = styled.section`
  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: clamp(40px, 6vw, 80px);

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledText = styled.div`
  p {
    margin: 0 0 18px;
  }

  .lead {
    color: var(--lightest-slate);
    font-family: var(--font-display);
    font-size: clamp(20px, 1.9vw, 23px);
    line-height: 1.4;
  }

  .langs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 26px 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 5px 14px 4px;
      border: 0.75px solid var(--hairline);
      border-radius: 0;
      background: var(--light-navy);
      color: var(--light-slate);
      font-family: var(--font-serif);
      font-size: 17px;
      font-weight: 500;
    }
  }

  .langs-label {
    margin: 30px 0 0;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
`;

// Two photos, pinned like polaroids; they straighten and lift on hover.
const StyledPolaroids = styled.div`
  position: relative;
  height: 330px;
  margin: 0 0 34px;

  @media (max-width: 480px) {
    height: 250px;
  }

  figure {
    position: absolute;
    top: 0;
    width: 50%;
    margin: 0;
    padding: 10px 10px 34px;
    border-radius: 4px;
    background: #fffdf8;
    box-shadow: 0 1px 2px rgba(60, 35, 18, 0.12), 0 18px 34px -18px rgba(60, 35, 18, 0.45);
    transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.5s ease, z-index 0s;

    &:first-child {
      left: -2%;
      transform: rotate(-5deg);
      z-index: 1;
    }
    &:last-child {
      right: -2%;
      top: 26px;
      transform: rotate(4deg);
    }
    &:hover {
      z-index: 2;
      transform: rotate(0deg) translateY(-8px) scale(1.03);
      box-shadow: 0 1px 2px rgba(60, 35, 18, 0.12), 0 30px 44px -20px rgba(60, 35, 18, 0.5);
    }

    .img {
      display: block;
      border-radius: 2px;
    }

    figcaption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 8px;
      color: var(--light-slate);
      font-family: var(--font-hand);
      font-size: 16px;
      text-align: center;
    }

    /* A strip of washi tape. */
    &:before {
      content: '';
      position: absolute;
      z-index: 1;
      top: -9px;
      left: 50%;
      width: 64px;
      height: 20px;
      margin-left: -32px;
      background: rgba(226, 176, 74, 0.55);
      transform: rotate(-3deg);
    }
  }
`;

const StyledPath = styled.ol`
  position: relative;
  margin: 6px 0 0;
  padding: 0 0 0 30px;
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    left: 6px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: linear-gradient(var(--lightest-navy), var(--green));
  }

  li {
    position: relative;
    padding: 0 0 30px;

    &:last-child {
      padding-bottom: 0;
    }

    &:before {
      content: '';
      position: absolute;
      left: -29px;
      top: 7px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--navy);
      border: 2px solid var(--green);
    }

    &.now:before {
      background: var(--green);
      box-shadow: 0 0 0 5px var(--green-tint);
    }
  }

  .place {
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;

    .now-badge {
      margin-left: 10px;
      padding: 0;
      background: none;
      color: var(--green);
      font-family: var(--font-hand);
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0;
      text-transform: none;
    }
  }

  h3 {
    margin: 4px 0 4px;
    font-size: 19px;
  }

  p {
    margin: 0;
    color: var(--slate);
    font-size: var(--fz-md);
    line-height: 1.55;
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <p className="lead">
            I study what happens in the tails — the rare, high-impact events that averages hide.
          </p>
          <p>
            My work starts with a simple question: how sure can we be about things that almost
            never happen? Answering it well takes two skills I try to hold to the same standard —
            careful statistics, and engineering that lets anyone rerun the result.
          </p>
          <p>
            I trained in statistics at <a href="https://www.hku.hk/">HKU</a> and{' '}
            <a href="https://www.mcgill.ca/mathstat/">McGill</a>, and today I apply it to education
            data for SDG 4 at the <a href="https://uis.unesco.org/">UNESCO Institute for Statistics</a>.
            Next, I want to keep building on official statistics and education data, and to bring the same rigour to quantitative research.
          </p>

          <p className="langs-label">Working languages</p>
          <ul className="langs">
            {LANGUAGES.map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </StyledText>

        <div>
          <StyledPolaroids>
            <figure>
              <StaticImage
                className="img"
                src="../../images/photos/whiteboard.jpg"
                alt="Ziyi (Ellen) Zhou in a graduation gown, wiping a whiteboard covered in copula formulas"
                width={460}
                aspectRatio={4 / 5}
                quality={86}
                placeholder="blurred"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
              <figcaption>Copulas on the whiteboard</figcaption>
            </figure>
            <figure>
              <StaticImage
                className="img"
                src="../../images/photos/autumn.jpg"
                alt="Ziyi (Ellen) Zhou in a red sweater, sitting under a tree among autumn leaves"
                width={460}
                aspectRatio={4 / 5}
                quality={86}
                placeholder="blurred"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
              <figcaption>Autumn leaves</figcaption>
            </figure>
          </StyledPolaroids>

        <StyledPath aria-label="My path so far">
          {PATH.map(step => (
            <li key={step.title} className={step.now ? 'now' : ''}>
              <span className="place">
                {step.place}
                {step.now && <span className="now-badge">Now</span>}
              </span>
              <h3>{step.title}</h3>
              <p>{step.note}</p>
            </li>
          ))}
        </StyledPath>
        </div>
      </div>
    </StyledAboutSection>
  );
};

export default About;
