import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { Page, SectionHead, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * About — set as the opening feature of a magazine: one large photograph, a short
 * biography with a drop initial, and a profile column of plain facts in the margin.
 */

const PATH = [
  {
    place: 'Hong Kong',
    title: 'B.Sc. Statistics, University of Hong Kong',
    note: 'Dean’s Honours List; exchange semester at McGill (2022). Research assistant in epidemiology (co-author in Vaccines); final-year project on Omicron hybrid immunity.',
  },
  {
    place: 'Montréal',
    title: 'M.Sc. Mathematics & Statistics, McGill',
    note: 'CGPA 3.88; NSERC research grant and Graduate Excellence Award. Thesis on covariate-dependent Archimax copulas for rainfall extremes in Québec.',
  },
  {
    place: 'Montréal · now',
    title: 'UNESCO Institute for Statistics',
    note: 'Data Innovation and AI Intern: SDG 4 data pipelines and dashboards across 200+ countries.',
  },
];

const LANGUAGES = ['English', 'Français', '普通话', '廣東話', '日本語'];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  align-items: start;

  .portrait {
    grid-column: 1 / span 5;
    margin: 0;
  }
  .col {
    grid-column: 7 / span 6;
  }

  @media (max-width: 900px) {
    .portrait {
      grid-column: 1 / span 8;
    }
    .col {
      grid-column: 1 / -1;
      margin-top: 40px;
    }
  }
  @media (max-width: 560px) {
    .portrait {
      grid-column: 1 / -1;
    }
  }

  figure {
    .img {
      display: block;
    }
    figcaption {
      margin-top: 10px;
      color: ${T.muted};
      font-family: ${SANS};
      font-size: 12.5px;
      line-height: 1.5;
    }
  }
`;

const Text = styled.div`
  font-family: ${SANS};
  font-size: 17px;
  line-height: 1.72;
  color: ${T.text};

  p {
    max-width: 600px;
  }

  .opening {
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(22px, 2.1vw, 28px);
    font-variation-settings: 'opsz' 18;
    line-height: 1.38;
    margin-bottom: 1.1em;
  }
`;

const Profile = styled.aside`
  margin-top: 40px;
  border-top: 1px solid ${T.rule};

  h3 {
    margin: 0;
    padding: 9px 0;
    border-bottom: 1px solid ${T.hair};
    color: ${T.ink};
    ${cap};
  }

  dl {
    margin: 0;
  }

  .row {
    padding: 14px 0 15px;
    border-bottom: 1px solid ${T.hair};
  }

  dt {
    margin-bottom: 4px;
    color: ${T.muted};
    ${cap};
    font-size: 10px;
  }

  dd {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 17px;
    font-variation-settings: 'opsz' 14;
    line-height: 1.3;
  }

  dd p {
    margin: 4px 0 0;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 13px;
    line-height: 1.5;
  }

  .langs {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
  }
`;

const About = () => (
  <Page id="about">
    <div className="wrap">
      <SectionHead
        label="About"
        aside="Hong Kong · Montréal"
        title={
          <>
            I study what happens
            <br />
            in the tails.
          </>
        }
        standfirst="I model rare, high-impact events — floods, financial tail risk, gaps in education data — and build the software that makes those models trustworthy."
      />

      <Grid>
        <figure className="portrait">
          <StaticImage
            className="img"
            src="../../images/photos/whiteboard.jpg"
            alt="Ziyi (Ellen) Zhou in a graduation gown, wiping a whiteboard covered in copula formulas"
            width={620}
            aspectRatio={4 / 5}
            quality={86}
            placeholder="dominantColor"
            formats={['AUTO', 'WEBP', 'AVIF']}
          />
          <figcaption>Copula formulas on the whiteboard.</figcaption>
        </figure>

        <div className="col">
          <Text>
            <p className="opening">
              My work starts with a simple question: how sure can we be about things that almost
              never happen?
            </p>
            <p>
              Answering it well takes two skills I try to hold to the same standard — careful
              statistics, and engineering that lets anyone rerun the result.
            </p>
            <p>
              I trained in statistics at{' '}
              <a className="inline" href="https://www.hku.hk/">
                HKU
              </a>{' '}
              and{' '}
              <a className="inline" href="https://www.mcgill.ca/mathstat/">
                McGill
              </a>
              , and today I apply it to education data for SDG 4 at the{' '}
              <a className="inline" href="https://uis.unesco.org/">
                UNESCO Institute for Statistics
              </a>
              . Next, I want to keep building on official statistics and education data, and to
              bring the same rigour to quantitative research.
            </p>
          </Text>

          <Profile aria-label="Profile">
            <h3>Profile</h3>
            <dl>
              {PATH.map(s => (
                <div className="row" key={s.title}>
                  <dt>{s.place}</dt>
                  <dd>
                    {s.title}
                    <p>{s.note}</p>
                  </dd>
                </div>
              ))}
              <div className="row">
                <dt>Working languages</dt>
                <dd className="langs">
                  {LANGUAGES.map(l => (
                    <span key={l}>{l}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </Profile>
        </div>
      </Grid>
    </div>
  </Page>
);

export default About;
