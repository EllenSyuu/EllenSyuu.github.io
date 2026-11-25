import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { T, DISPLAY, SANS, MARGIN, cap } from '@components/editorial';
import { BIO, PATH, LANGUAGES, EXPERIENCE, useJobs } from './shared';

/*
 * A — The opening spread.
 * After the cover the page turns to a photograph, edge to edge, with no gap: the whiteboard,
 * its formulas in the same vermilion as the cover's sun. Then a long silence, one sentence
 * at display size, and a body set like a magazine feature. The way into Experience is a
 * second photograph that bleeds off the right edge while the chapter title waits on the left.
 * References: Stripe Press (the object fills the screen), Kinfolk (full-bleed photograph,
 * small type), Rijksmuseum (one image, one statement), Fondation Cartier (headline scale).
 */

const Sheet = styled.section`
  && {
    width: 100vw;
    max-width: none;
    margin: 0 calc(50% - 50vw);
    padding: 0;
  }
`;

const Bleed = styled.div`
  position: relative;
  width: 100vw;
  margin: 0 calc(50% - 50vw);
`;

const Plate = styled(Bleed)`
  .photo {
    display: block;
    height: clamp(420px, 54vw, 880px);
  }
  @media (max-width: 700px) {
    .photo {
      height: auto;
      aspect-ratio: 4 / 5;
    }
  }
`;

const Strip = styled(Bleed)`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  padding: 14px ${MARGIN} 0;
  color: ${T.muted};
  font-family: ${SANS};
  font-size: 12.5px;
  line-height: 1.5;

  .label {
    grid-column: 1 / span 3;
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
  }
  .cap {
    grid-column: 7 / span 6;
    text-align: right;
  }
  @media (max-width: 700px) {
    .label {
      grid-column: 1 / -1;
      margin-bottom: 4px;
    }
    .cap {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
`;

const Statement = styled.h2`
  grid-column: 1 / span 11;
  margin: clamp(120px, 14vw, 210px) 0 0;
  color: ${T.ink};
  font-family: ${DISPLAY};
  font-size: clamp(46px, 7.6vw, 118px);
  font-weight: 500;
  font-variation-settings: 'opsz' 96;
  line-height: 0.94;
  letter-spacing: -0.02em;

  @media (max-width: 700px) {
    grid-column: 1 / -1;
    margin-top: 88px;
  }
`;

const Body = styled(Grid)`
  margin-top: clamp(56px, 6vw, 96px);
  align-items: start;

  .meta {
    grid-column: 1 / span 3;
    padding-top: 10px;
    border-top: 1px solid ${T.rule};
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
    line-height: 2;
  }
  .lead {
    grid-column: 5 / span 7;
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(22px, 2.1vw, 30px);
    font-variation-settings: 'opsz' 24;
    line-height: 1.34;
  }
  .cols {
    grid-column: 5 / span 8;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: clamp(20px, 2.6vw, 40px);
    margin-top: 36px;
    color: ${T.text};
    font-family: ${SANS};
    font-size: 16px;
    line-height: 1.7;
    p {
      margin: 0;
    }
  }

  @media (max-width: 900px) {
    .meta {
      grid-column: 1 / -1;
      margin-bottom: 28px;
    }
    .lead,
    .cols {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 600px) {
    .cols {
      grid-template-columns: 1fr;
      row-gap: 1em;
    }
  }
`;

const Path = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  margin: clamp(96px, 10vw, 160px) 0 0;
  padding: 0;
  list-style: none;

  li {
    padding-top: 18px;
    border-top: 1px solid ${T.rule};
  }
  .place {
    display: block;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(30px, 3.1vw, 46px);
    font-weight: 500;
    font-variation-settings: 'opsz' 60;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }
  h3 {
    margin: 22px 0 8px;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
  }
  p {
    margin: 0;
    max-width: 34ch;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 14px;
    line-height: 1.6;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    row-gap: 40px;
  }
`;

const Langs = styled.p`
  margin: 56px 0 0;
  color: ${T.ink};
  font-family: ${DISPLAY};
  font-size: clamp(20px, 1.8vw, 24px);
  font-variation-settings: 'opsz' 20;

  .k {
    margin-right: 18px;
    color: ${T.muted};
    ${cap};
    font-size: 10.5px;
    vertical-align: 3px;
    @media (max-width: 600px) {
      display: block;
      margin-bottom: 8px;
    }
  }
  .l + .l:before {
    content: '·';
    margin: 0 0.55em;
    color: ${T.vermilion};
  }
`;

const Bridge = styled(Grid)`
  margin-top: clamp(150px, 16vw, 240px);
  align-items: end;

  .photo-wrap {
    grid-column: 7 / -1;
    grid-row: 1;
    margin-right: calc(-1 * ${MARGIN});
  }
  .photo {
    display: block;
    height: clamp(380px, 46vw, 680px);
  }
  header {
    grid-column: 1 / span 5;
    grid-row: 1;
    padding-bottom: 6px;
  }
  .label {
    display: flex;
    justify-content: space-between;
    padding: 9px 0;
    border-top: 1px solid ${T.rule};
    border-bottom: 1px solid ${T.rule};
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
  }
  h2 {
    margin: 36px 0 22px;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(44px, 5.4vw, 84px);
    font-weight: 500;
    font-variation-settings: 'opsz' 96;
    line-height: 0.95;
    letter-spacing: -0.02em;
  }
  .standfirst {
    max-width: 380px;
    margin: 0;
    color: ${T.text};
    font-family: ${DISPLAY};
    font-size: 19px;
    font-variation-settings: 'opsz' 14;
    line-height: 1.45;
  }

  @media (max-width: 900px) {
    .photo-wrap {
      grid-column: 1 / -1;
      grid-row: 1;
      margin-left: calc(-1 * ${MARGIN});
    }
    .photo {
      height: auto;
      aspect-ratio: 4 / 3;
    }
    header {
      grid-column: 1 / -1;
      grid-row: 2;
      margin-top: 40px;
    }
  }
`;

const Entries = styled.ol`
  margin: clamp(72px, 7vw, 110px) 0 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    padding: 26px 0 32px;
    border-top: 1px solid ${T.hair};
  }
  > li:first-child {
    border-top-color: ${T.rule};
  }
  .when {
    grid-column: 1 / span 3;
    margin: 0;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    small {
      display: block;
      margin-top: 4px;
      color: ${T.muted};
      ${cap};
      font-size: 10px;
    }
  }
  .what {
    grid-column: 4 / span 4;
    h3 {
      margin: 0;
      color: ${T.ink};
      font-family: ${DISPLAY};
      font-size: clamp(21px, 1.9vw, 26px);
      font-weight: 500;
      font-variation-settings: 'opsz' 20;
      line-height: 1.18;
    }
    .org {
      display: block;
      margin-top: 6px;
      color: ${T.vermilionText};
      font-family: ${SANS};
      font-size: 14px;
    }
  }
  .detail {
    grid-column: 8 / span 5;
    color: ${T.text};
    font-family: ${SANS};
    font-size: 15px;
    line-height: 1.62;
    ul {
      margin: 0;
      padding-left: 16px;
    }
    li + li {
      margin-top: 10px;
    }
    a {
      color: ${T.ink};
    }
  }
  @media (max-width: 900px) {
    .when,
    .what,
    .detail {
      grid-column: 1 / -1;
    }
    .what {
      margin: 8px 0 14px;
    }
  }
`;

const Wrap = styled.section`
  && {
    width: 100vw;
    max-width: none;
    margin: 0 calc(50% - 50vw);
    padding: 0 ${MARGIN};
  }
  .wrap {
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const SpreadA = () => {
  const jobs = useJobs(2);
  return (
    <>
      <Sheet id="about" aria-label="About">
        <Plate>
          <StaticImage
            className="photo"
            src="../../images/photos/whiteboard-wide.jpg"
            alt="Ziyi (Ellen) Zhou in a graduation gown at a whiteboard covered in copula and extreme-value formulas"
            layout="fullWidth"
            objectPosition="26% 40%"
            quality={84}
            placeholder="dominantColor"
            formats={['AUTO', 'WEBP', 'AVIF']}
          />
        </Plate>
        <Strip>
          <span className="label">About</span>
          <span className="cap">
            On the board: the extreme-value limit G(z), the Clayton generator ψ<sub>θ</sub> and an
            Archimax copula C<sub>ψ,ℓ</sub>.
          </span>
        </Strip>

        <Wrap as="div">
          <div className="wrap">
            <Grid>
              <Statement>
                I study what happens
                <br />
                in the tails.
              </Statement>
            </Grid>

            <Body>
              <div className="meta">
                Hong Kong · Montréal
                <br />
                Statistics · Data engineering
              </div>
              <p className="lead">{BIO.lead}</p>
              <div className="cols">
                <p>{BIO.craft}</p>
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
              </div>
            </Body>

            <Path aria-label="Path">
              {PATH.map(s => (
                <li key={s.key}>
                  <span className="place">{s.place}</span>
                  <h3>{s.title}</h3>
                  <p>{s.note}</p>
                </li>
              ))}
            </Path>

            <Langs>
              <span className="k">Working languages</span>
              {LANGUAGES.map(l => (
                <span className="l" key={l}>
                  {l}
                </span>
              ))}
            </Langs>
          </div>
        </Wrap>
      </Sheet>

      <Wrap id="jobs" aria-label="Experience">
        <div className="wrap">
          <Bridge>
            <div className="photo-wrap">
              <StaticImage
                className="photo"
                src="../../images/photos/autumn-wide.jpg"
                alt="Ziyi (Ellen) Zhou in a red hoodie on a bench under a tree, autumn leaves on the lawn"
                layout="fullWidth"
                objectPosition="50% 55%"
                quality={84}
                placeholder="dominantColor"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
            </div>
            <header>
              <div className="label">
                <span>{EXPERIENCE.label}</span>
                <span>{EXPERIENCE.span}</span>
              </div>
              <h2>{EXPERIENCE.title}</h2>
              <p className="standfirst">{EXPERIENCE.standfirst}</p>
            </header>
          </Bridge>

          <Entries aria-label="Roles in detail">
            {jobs.map(j => (
              <li key={j.company + j.range}>
                <p className="when">
                  {j.range}
                  <small>{j.location}</small>
                </p>
                <div className="what">
                  <h3>{j.title}</h3>
                  <span className="org">{j.company}</span>
                </div>
                <div className="detail" dangerouslySetInnerHTML={{ __html: j.html }} />
              </li>
            ))}
          </Entries>
        </div>
      </Wrap>
    </>
  );
};

export default SpreadA;
