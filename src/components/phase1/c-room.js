import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { T, DISPLAY, SANS, MARGIN, cap } from '@components/editorial';
import { BIO, PATH, LANGUAGES, EXPERIENCE, useJobs } from './shared';

/*
 * C — The room.
 * Type carries the first screen: the question that drives the work, at the scale of the
 * cover's masthead, broken across three lines with a deliberate indent. Then the page splits
 * like a gallery room — a single photograph holds its place on the left while the wall text
 * scrolls on the right, each place set as a room title. Into Experience the composition
 * mirrors: the title moves to the right and a close detail of the whiteboard's handwriting
 * takes the left, so the rhythm turns rather than repeats.
 * References: Giorgia Lupi (statement-first, one large line of type), Fondation Cartier
 * (headline as architecture), Serpentine (image and type at the same weight), Herzog & de
 * Meuron (off-grid placement, generous gaps, small museum labels).
 */

const Section = styled.section`
  && {
    position: relative;
    width: 100vw;
    max-width: none;
    margin: 0 calc(50% - 50vw);
    padding: 0 ${MARGIN};
  }
  color: ${T.text};
  .wrap {
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
`;

const Opening = styled.div`
  padding: clamp(96px, 12vw, 180px) 0 clamp(96px, 11vw, 170px);

  .labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: clamp(40px, 5vw, 72px);
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
  }
  h2 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(40px, 7.3vw, 106px);
    font-weight: 500;
    font-variation-settings: 'opsz' 96;
    line-height: 0.98;
    letter-spacing: -0.022em;
  }
  h2 span {
    display: block;
  }
  h2 .in {
    padding-left: 16.7%;
  }
  h2 .mark {
    color: ${T.vermilion};
  }
  @media (max-width: 700px) {
    h2 span,
    h2 .in {
      display: inline;
      padding-left: 0;
    }
  }
`;

const Room = styled(Grid)`
  align-items: start;

  .still {
    grid-column: 1 / span 5;
    position: sticky;
    top: 96px;
    margin: 0;
  }
  .still figcaption {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 11.5px;
  }
  .wall {
    grid-column: 7 / span 6;
    padding-top: 4px;
  }
  .wall > p.lead {
    max-width: none;
    margin: 0 0 1.1em;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(22px, 2vw, 28px);
    font-variation-settings: 'opsz' 24;
    line-height: 1.36;
  }
  .wall > p {
    max-width: 560px;
    margin: 0 0 1em;
    font-family: ${SANS};
    font-size: 16.5px;
    line-height: 1.72;
  }

  @media (max-width: 900px) {
    .still {
      position: relative;
      top: 0;
      grid-column: 1 / -1;
    }
    .wall {
      grid-column: 1 / -1;
      margin-top: 48px;
    }
  }
`;

const Rooms = styled.ol`
  margin: clamp(80px, 9vw, 140px) 0 0;
  padding: 0;
  list-style: none;

  li + li {
    margin-top: clamp(64px, 7vw, 104px);
  }
  .no {
    display: block;
    margin-bottom: 10px;
    color: ${T.vermilionText};
    font-family: ${DISPLAY};
    font-size: 20px;
    font-variation-settings: 'opsz' 18;
    letter-spacing: 0.06em;
  }
  .place {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(38px, 4.4vw, 64px);
    font-weight: 500;
    font-variation-settings: 'opsz' 72;
    line-height: 1;
    letter-spacing: -0.015em;
  }
  h3 {
    margin: 18px 0 6px;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 15.5px;
    font-weight: 600;
  }
  p {
    max-width: 46ch;
    margin: 0;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 14.5px;
    line-height: 1.6;
  }
`;

const Langs = styled.div`
  margin-top: clamp(64px, 7vw, 104px);
  padding-top: 14px;
  border-top: 1px solid ${T.hair};
  .k {
    color: ${T.muted};
    ${cap};
    font-size: 10px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 22px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(22px, 2vw, 28px);
    font-variation-settings: 'opsz' 24;
  }
`;

const Turn = styled(Grid)`
  margin-top: clamp(160px, 17vw, 260px);
  align-items: end;

  .detail {
    grid-column: 1 / span 6;
    margin: 0 0 0 calc(-1 * ${MARGIN});
  }
  .detail .img {
    display: block;
    height: clamp(220px, 23vw, 330px);
  }
  .detail figcaption {
    margin: 10px 0 0 ${MARGIN};
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 11.5px;
  }
  header {
    grid-column: 8 / span 5;
  }
  .label {
    display: flex;
    justify-content: space-between;
    color: ${T.ink};
    ${cap};
    font-size: 10.5px;
  }
  h2 {
    margin: 22px 0 18px;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(44px, 6.4vw, 100px);
    font-weight: 500;
    font-variation-settings: 'opsz' 96;
    line-height: 0.95;
    letter-spacing: -0.02em;
  }
  .standfirst {
    margin: 0;
    font-family: ${DISPLAY};
    font-size: 19px;
    font-variation-settings: 'opsz' 14;
    line-height: 1.45;
  }
  @media (max-width: 900px) {
    .detail {
      grid-column: 1 / -1;
      grid-row: 2;
      margin: 40px calc(-1 * ${MARGIN}) 0;
    }
    header {
      grid-column: 1 / -1;
    }
  }
`;

const Entries = styled.ol`
  margin: clamp(80px, 8vw, 120px) 0 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    padding: 30px 0 34px;
    border-top: 1px solid ${T.hair};
  }
  .head {
    grid-column: 1 / span 5;
  }
  .when {
    margin: 0 0 10px;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
  }
  h3 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(24px, 2.4vw, 34px);
    font-weight: 500;
    font-variation-settings: 'opsz' 30;
    line-height: 1.12;
  }
  .org {
    display: block;
    margin-top: 8px;
    color: ${T.vermilionText};
    font-family: ${SANS};
    font-size: 14px;
  }
  .detail {
    grid-column: 7 / span 6;
    font-family: ${SANS};
    font-size: 15.5px;
    line-height: 1.66;
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
    .head,
    .detail {
      grid-column: 1 / -1;
    }
    .detail {
      margin-top: 18px;
    }
  }
`;

const RoomC = () => {
  const jobs = useJobs(2);
  return (
    <>
      <Section id="about" aria-label="About">
        <div className="wrap">
          <Opening>
            <div className="labels">
              <span>About</span>
              <span>Ziyi Zhou, statistician</span>
            </div>
            <h2>
              <span>How sure can we be</span> <span className="in">about things that</span>{' '}
              <span>
                almost never happen
                <span className="mark" style={{ display: 'inline' }}>
                  ?
                </span>
              </span>
            </h2>
          </Opening>

          <Room>
            <figure className="still">
              <StaticImage
                src="../../images/photos/autumn.jpg"
                alt="Ziyi (Ellen) Zhou in a red hoodie on a bench under a tree, autumn leaves behind her"
                width={620}
                aspectRatio={4 / 5}
                quality={86}
                placeholder="dominantColor"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
              <figcaption>
                <span>Ziyi (Ellen) Zhou</span>
                <span>Autumn</span>
              </figcaption>
            </figure>

            <div className="wall">
              <p className="lead">That question is where my work starts. {BIO.craft}</p>
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

              <Rooms aria-label="Path">
                {PATH.map((s, i) => (
                  <li key={s.key}>
                    <span className="no">{['I', 'II', 'III'][i]}</span>
                    <p className="place">{s.place}</p>
                    <h3>{s.title}</h3>
                    <p>{s.note}</p>
                  </li>
                ))}
              </Rooms>

              <Langs>
                <span className="k">Working languages</span>
                <ul>
                  {LANGUAGES.map(l => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </Langs>
            </div>
          </Room>
        </div>
      </Section>

      <Section id="jobs" aria-label="Experience">
        <div className="wrap">
          <Turn>
            <figure className="detail">
              <StaticImage
                className="img"
                src="../../images/photos/formula.jpg"
                alt="Detail of the whiteboard: an Archimax copula and the Clayton generator written in red marker"
                layout="fullWidth"
                objectPosition="20% 50%"
                quality={86}
                placeholder="dominantColor"
                formats={['AUTO', 'WEBP', 'AVIF']}
              />
              <figcaption>
                Detail of the whiteboard: C<sub>ψ,ℓ</sub> and ψ<sub>θ</sub>(t) = (1 + θt)
                <sup>−1/θ</sup>.
              </figcaption>
            </figure>
            <header>
              <div className="label">
                <span>{EXPERIENCE.label}</span>
                <span>{EXPERIENCE.span}</span>
              </div>
              <h2>{EXPERIENCE.title}</h2>
              <p className="standfirst">{EXPERIENCE.standfirst}</p>
            </header>
          </Turn>

          <Entries aria-label="Roles in detail">
            {jobs.map(j => (
              <li key={j.company + j.range}>
                <div className="head">
                  <p className="when">
                    {j.range} · {j.location}
                  </p>
                  <h3>{j.title}</h3>
                  <span className="org">{j.company}</span>
                </div>
                <div className="detail" dangerouslySetInnerHTML={{ __html: j.html }} />
              </li>
            ))}
          </Entries>
        </div>
      </Section>
    </>
  );
};

export default RoomC;
