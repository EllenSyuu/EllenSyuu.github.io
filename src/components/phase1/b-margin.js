import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { T, DISPLAY, SANS, MARGIN, cap } from '@components/editorial';
import { BIO, PATH, LANGUAGES, EXPERIENCE, useJobs } from './shared';
import PickandsPlate from './pickands-plate';

/*
 * B — Margin and plate.
 * The page below the cover is set as a scientific publication. The cover's issue bar returns
 * as a running head; the biography runs in one narrow reading column with its facts as
 * numbered sidenotes in the margin; the photograph is small, an author's portrait. The visual
 * centre is a plate drawn from the thesis data — the estimated dependence of rainfall extremes
 * across Québec — at full width. Experience continues the same grid, with dates in the margin.
 * References: Distill (sidenotes, figures that break the column), Bartosz Ciechanowski (one
 * column, one object), Quanta Magazine (science set with editorial care), Nicholas Rougeux's
 * Byrne's Euclid (mathematics as the picture itself).
 */

const Paper = styled.div`
  position: relative;
  width: 100vw;
  margin: 0 calc(50% - 50vw);
  padding: 0 ${MARGIN} clamp(40px, 5vw, 80px);
  background: #fafaf8;
  color: ${T.text};

  .wrap {
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const RunningHead = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid ${T.rule};
  color: ${T.ink};
  ${cap};
  font-size: 10.5px;

  &.first {
    padding-top: 26px;
  }
  .c {
    text-align: center;
  }
  .r {
    text-align: right;
  }
  b {
    color: ${T.vermilionText};
    font-weight: 500;
    margin-right: 12px;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr auto;
    .c {
      display: none;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  align-items: start;
`;

const Opening = styled(Grid)`
  margin-top: clamp(88px, 9vw, 140px);

  .portrait {
    grid-column: 1 / span 2;
    margin: 6px 0 0;
    figcaption {
      margin-top: 8px;
      color: ${T.muted};
      font-family: ${SANS};
      font-size: 11.5px;
      line-height: 1.45;
    }
  }
  h2 {
    grid-column: 3 / span 8;
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(34px, 3.9vw, 58px);
    font-weight: 500;
    font-variation-settings: 'opsz' 72;
    line-height: 1.04;
    letter-spacing: -0.012em;
  }
  @media (max-width: 900px) {
    .portrait {
      grid-column: 1 / span 4;
      grid-row: 2;
      margin-top: 32px;
    }
    h2 {
      grid-column: 1 / -1;
    }
  }
`;

const Para = styled(Grid)`
  margin-top: 30px;

  .text {
    grid-column: 3 / span 6;
    margin: 0;
    font-family: ${SANS};
    font-size: 17px;
    line-height: 1.75;
  }
  .text.lead {
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(20px, 1.75vw, 24px);
    font-variation-settings: 'opsz' 18;
    line-height: 1.45;
  }
  sup {
    color: ${T.vermilionText};
    font-family: ${SANS};
    font-size: 11px;
    font-weight: 600;
    margin-left: 1px;
  }
  .side {
    grid-column: 10 / span 3;
    margin: 4px 0 0;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 12.5px;
    line-height: 1.55;
  }
  .side + .side {
    margin-top: 18px;
  }
  .sides {
    grid-column: 10 / span 3;
  }
  .side b {
    display: block;
    color: ${T.ink};
    font-weight: 600;
  }
  .side .n {
    color: ${T.vermilionText};
    font-weight: 600;
    margin-right: 6px;
  }

  @media (max-width: 900px) {
    .text {
      grid-column: 1 / -1;
    }
    .sides {
      grid-column: 1 / -1;
      margin-top: 16px;
      padding-left: 14px;
      border-left: 1px solid ${T.vermilion};
    }
  }
`;

const Plate = styled.figure`
  margin: clamp(96px, 10vw, 150px) 0 0;
  padding-top: 18px;
  border-top: 1px solid ${T.rule};

  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px 16px;
    margin-bottom: 28px;
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
  }
  figcaption {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    margin-top: 26px;
    color: ${T.text};
    font-family: ${SANS};
    font-size: 13.5px;
    line-height: 1.6;
  }
  figcaption p {
    grid-column: 3 / span 6;
    margin: 0;
  }
  figcaption .src {
    grid-column: 10 / span 3;
    color: ${T.muted};
    font-size: 12px;
  }
  @media (max-width: 900px) {
    figcaption p,
    figcaption .src {
      grid-column: 1 / -1;
    }
    figcaption .src {
      margin-top: 10px;
    }
  }
`;

const Chapter = styled.div`
  margin-top: clamp(120px, 12vw, 180px);
`;

const Entries = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    margin-top: 48px;
  }
  .when {
    grid-column: 1 / span 2;
    margin: 4px 0 0;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    small {
      display: block;
      color: ${T.muted};
      ${cap};
      font-size: 9.5px;
      margin-top: 3px;
    }
  }
  .body {
    grid-column: 3 / span 6;
  }
  h3 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(22px, 2vw, 28px);
    font-weight: 500;
    font-variation-settings: 'opsz' 24;
    line-height: 1.15;
  }
  .org {
    display: block;
    margin: 6px 0 14px;
    color: ${T.vermilionText};
    font-family: ${SANS};
    font-size: 14px;
  }
  .detail {
    font-family: ${SANS};
    font-size: 15.5px;
    line-height: 1.68;
    ul {
      margin: 0;
      padding-left: 18px;
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
    .body {
      grid-column: 1 / -1;
    }
    .when {
      margin-bottom: 10px;
    }
  }
`;

const ChapterTitle = styled(Grid)`
  margin-top: clamp(72px, 8vw, 110px);
  h2 {
    grid-column: 3 / span 8;
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(34px, 3.9vw, 58px);
    font-weight: 500;
    font-variation-settings: 'opsz' 72;
    line-height: 1.04;
  }
  p {
    grid-column: 3 / span 6;
    margin: 18px 0 0;
    font-family: ${DISPLAY};
    font-size: clamp(18px, 1.5vw, 21px);
    font-variation-settings: 'opsz' 14;
    line-height: 1.5;
  }
  @media (max-width: 900px) {
    h2,
    p {
      grid-column: 1 / -1;
    }
  }
`;

const [hku, mcgill, uis] = PATH;

const MarginB = () => {
  const jobs = useJobs(2);
  return (
    <Paper>
      <div className="wrap">
        <div id="about" role="region" aria-label="About">
          <RunningHead className="first">
            <span>
              <b>§ 1</b>About
            </span>
            <span className="c">Ziyi Zhou — statistics and data engineering</span>
            <span className="r">Hong Kong · Montréal</span>
          </RunningHead>

          <Opening>
            <figure className="portrait">
              <StaticImage
                src="../../images/photos/whiteboard.jpg"
                alt="Ziyi (Ellen) Zhou in a graduation gown at a whiteboard of copula formulas"
                width={260}
                aspectRatio={4 / 5}
                quality={86}
                placeholder="dominantColor"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
              <figcaption>The whiteboard: an Archimax copula and its bounds.</figcaption>
            </figure>
            <h2>How sure can we be about things that almost never happen?</h2>
          </Opening>

          <Para>
            <p className="text lead">That question is where my work starts. {BIO.craft}</p>
          </Para>

          <Para>
            <p className="text">
              I trained in statistics at HKU<sup>1</sup> and McGill<sup>2</sup>, and today I apply
              it to education data for SDG 4 at the UNESCO Institute for Statistics<sup>3</sup>.
              Next, I want to keep building on official statistics and education data, and to bring
              the same rigour to quantitative research.
            </p>
            <div className="sides">
              {[hku, mcgill, uis].map((s, i) => (
                <p className="side" key={s.key}>
                  <b>
                    <span className="n">{i + 1}</span>
                    {s.title}
                  </b>
                  {s.note}
                </p>
              ))}
              <p className="side">
                <b>Working languages</b>
                {LANGUAGES.join(' · ')}
              </p>
            </div>
          </Para>

          <Plate aria-label="Plate 1">
            <div className="head">
              <span>Plate 1</span>
              <span>M.Sc. thesis · southern Québec, 15 station pairs</span>
            </div>
            <PickandsPlate />
            <figcaption>
              <p>
                <b>When heavy rain falls in several places at once.</b> Each line is one pair of
                weather stations; the further a curve sinks below A = 1, the more often their
                monthly rainfall extremes arrive together. In June–July most pairs sit near
                independence; in October–November the extremes are the most coherent of the year. η
                summarises the six-station network on a scale where 6 means independence.
              </p>
              <span className="src">
                Pointwise estimates of the Pickands dependence function under a Clayton–Archimax
                model, with 90% year-block bootstrap intervals for η. Source: SAC-thesis-2026,
                tab_15 and README.
              </span>
            </figcaption>
          </Plate>
        </div>

        <Chapter id="jobs" aria-label="Experience">
          <RunningHead>
            <span>
              <b>§ 2</b>
              {EXPERIENCE.label}
            </span>
            <span className="c">{EXPERIENCE.title}</span>
            <span className="r">{EXPERIENCE.span}</span>
          </RunningHead>
          <ChapterTitle>
            <h2>Research, data and teaching, since 2020.</h2>
            <p>
              Statistics and education data first, with programming and quantitative work
              throughout.
            </p>
          </ChapterTitle>
          <Entries aria-label="Roles in detail">
            {jobs.map(j => (
              <li key={j.company + j.range}>
                <p className="when">
                  {j.range}
                  <small>{j.location}</small>
                </p>
                <div className="body">
                  <h3>{j.title}</h3>
                  <span className="org">{j.company}</span>
                  <div className="detail" dangerouslySetInnerHTML={{ __html: j.html }} />
                </div>
              </li>
            ))}
          </Entries>
        </Chapter>
      </div>
    </Paper>
  );
};

export default MarginB;
