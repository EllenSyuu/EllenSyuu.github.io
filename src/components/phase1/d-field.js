import React from 'react';
import styled from 'styled-components';
import { T, SANS, MARGIN, useWidth } from '@components/editorial';
import { COVER } from '@utils/cover-scene';
import { BIO, PATH, LANGUAGES, EXPERIENCE, useJobs } from './shared';
import { Word, wordWidth } from './glyphs';

/*
 * D — Type as image.
 * After the cover, one flat field of colour edge to edge, carrying a single word built from
 * a constructed alphabet. Small labels sit in the gap between the two lines of letters, as
 * on an exhibition poster. Below, a plain white page in one grotesk: a headline, a paragraph,
 * three columns. Experience opens with the same alphabet in ink on white, so the identity
 * carries without a second block of colour.
 * Reference: Pentagram's identity for the Doha Design Biennial (full field, constructed
 * letters, labels between the lines); Pentagram's own page for the text that follows.
 */

const FIELDS = {
  gold: {
    ground: COVER.gold,
    ink: COVER.navy,
    accent: COVER.vermilion,
    text: COVER.navy,
    pill: 'rgba(255,255,255,0.55)',
  },
  blue: {
    ground: COVER.river,
    ink: '#f6f0e4',
    accent: COVER.gold,
    text: '#ffffff',
    pill: 'rgba(255,255,255,0.16)',
  },
  red: {
    ground: COVER.vermilion,
    ink: '#fbf6ee',
    accent: COVER.navy,
    text: '#ffffff',
    pill: 'rgba(255,255,255,0.18)',
  },
};
const F = FIELDS[process.env.GATSBY_FIELD] || FIELDS.gold;

const Bleed = styled.section`
  && {
    position: relative;
    width: 100vw;
    max-width: none;
    margin: 0 calc(50% - 50vw);
    padding: 0;
  }
`;

const Field = styled.div`
  position: relative;
  height: ${p => p.h}px;
  background: ${F.ground};
  color: ${F.text};
  font-family: ${SANS};
  overflow: hidden;

  .w1,
  .w2 {
    position: absolute;
    display: block;
  }
  .w1 {
    top: ${p => p.pad}px;
    left: ${MARGIN};
  }
  .w2 {
    bottom: ${p => p.pad}px;
    right: ${MARGIN};
  }
  .mid {
    position: absolute;
    top: 50%;
    left: ${MARGIN};
    right: ${MARGIN};
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    transform: translateY(-50%);
    font-size: 17px;
    font-weight: 500;
  }
  .mid .r {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .pill {
    padding: 7px 14px;
    background: ${F.pill};
    border-radius: 3px;
    font-size: 14px;
    font-weight: 500;
  }
  .foot {
    position: absolute;
    left: ${MARGIN};
    bottom: 18px;
    max-width: 520px;
    font-size: 13.5px;
    line-height: 1.45;
  }
  .foot b {
    display: block;
    font-weight: 600;
  }

  @media (max-width: 700px) {
    .mid {
      font-size: 14px;
      grid-template-columns: 1fr 1fr;
    }
    .pill {
      display: none;
    }
    .foot {
      position: absolute;
      bottom: 16px;
      right: ${MARGIN};
      font-size: 12.5px;
    }
  }
`;

const Page = styled.div`
  padding: 0 ${MARGIN};
  color: ${T.text};
  font-family: ${SANS};
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

const Intro = styled(Grid)`
  padding-top: clamp(72px, 8vw, 120px);
  h2 {
    grid-column: 1 / span 11;
    margin: 0;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: clamp(36px, 4.6vw, 66px);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -0.03em;
  }
  .text {
    grid-column: 1 / span 7;
    margin-top: 28px;
    font-size: clamp(17px, 1.35vw, 19px);
    line-height: 1.62;
    p {
      margin: 0 0 0.9em;
    }
  }
  @media (max-width: 900px) {
    h2,
    .text {
      grid-column: 1 / -1;
    }
  }
`;

const Cols = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  margin: clamp(72px, 8vw, 112px) 0 0;
  padding: 0;
  list-style: none;

  li {
    padding-top: 16px;
    border-top: 2px solid ${T.ink};
  }
  .place {
    display: block;
    color: ${T.ink};
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  h3 {
    margin: 14px 0 6px;
    font-family: ${SANS};
    color: ${T.ink};
    font-size: 15.5px;
    font-weight: 600;
  }
  p {
    margin: 0;
    color: ${T.muted};
    font-size: 14.5px;
    line-height: 1.58;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    row-gap: 36px;
  }
`;

const Langs = styled.p`
  && {
    margin: 80px 0 0;
  }
  color: ${T.ink};
  font-size: clamp(18px, 1.5vw, 21px);
  font-weight: 500;
  letter-spacing: -0.01em;
  span {
    color: ${T.muted};
    font-weight: 400;
    margin-right: 14px;
  }
`;

const Opener = styled.div`
  margin-top: clamp(140px, 14vw, 220px);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  align-items: end;

  .word {
    grid-column: 1 / span 8;
  }
  .word svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
  .word svg + svg {
    margin-top: ${p => Math.round(p.cap * 0.22)}px;
  }
  .side {
    grid-column: 9 / span 4;
    padding-bottom: 4px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 2px solid ${T.ink};
    color: ${T.ink};
    font-size: 15px;
    font-weight: 500;
  }
  .side p {
    margin: 16px 0 0;
    font-size: 16px;
    line-height: 1.55;
  }
  @media (max-width: 900px) {
    .word,
    .side {
      grid-column: 1 / -1;
    }
    .side {
      margin-top: 32px;
    }
  }
`;

const Entries = styled.ol`
  margin: clamp(64px, 6vw, 96px) 0 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    padding: 24px 0 32px;
    border-top: 1px solid ${T.hair};
  }
  .when {
    grid-column: 1 / span 3;
    margin: 0;
    color: ${T.muted};
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  }
  .what {
    grid-column: 4 / span 4;
    h3 {
      margin: 0;
      color: ${T.ink};
      font-family: ${SANS};
      font-size: clamp(20px, 1.7vw, 24px);
      font-weight: 500;
      letter-spacing: -0.015em;
      line-height: 1.2;
    }
    .org {
      display: block;
      margin-top: 6px;
      color: ${T.vermilionText};
      font-size: 14.5px;
    }
  }
  .detail {
    grid-column: 8 / span 5;
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
      margin: 6px 0 14px;
    }
  }
`;

const FieldD = () => {
  const jobs = useJobs(2);
  const [ref, W] = useWidth(1440);
  const narrow = W < 700;
  const margin = Math.max(20, Math.min(W * 0.055, 80));
  // desktop: cap height from the field's height; phone: from the width of the longer line
  const H = narrow ? null : Math.round(Math.min(Math.max(W * 0.54, 560), 780));
  const capByWidth = ((W - 2 * margin) * 4) / wordWidth('OUT');
  const cap = narrow ? Math.floor(capByWidth) : Math.round(Math.min(H * 0.4, capByWidth * 0.75));
  const pad = narrow ? 28 : Math.round(H * 0.06);
  const fieldH = narrow ? cap * 2 + pad * 2 + 64 + 64 : H;

  const exCapW =
    ((Math.min(W, 1280 + 2 * margin) - 2 * margin) * (narrow ? 1 : 8 / 12) * 4) /
    wordWidth('IENCE');
  const exCap = Math.floor(Math.min(exCapW, 190));

  return (
    <>
      <Bleed id="about" aria-label="About" ref={ref}>
        <Field h={fieldH} pad={pad}>
          <Word
            className="w1"
            text="AB"
            height={cap}
            ink={F.ink}
            ground={F.ground}
            accent={F.accent}
          />
          <div className="mid" style={narrow ? { top: pad + cap + 32 } : undefined}>
            <span>About</span>
            {!narrow && <span className="pill">Statistics · Data engineering</span>}
            <span className="r">Hong Kong — Montréal</span>
          </div>
          <Word
            className="w2"
            text="OUT"
            height={cap}
            ink={F.ink}
            ground={F.ground}
            accent={F.accent}
            style={narrow ? { bottom: pad + 64 } : undefined}
          />
          <p className="foot">
            <b>Ziyi (Ellen) Zhou</b>
            Statistician. Extremes and copulas; education data for SDG 4.
          </p>
        </Field>

        <Page>
          <div className="wrap">
            <Intro>
              <h2>I study what happens in the tails.</h2>
              <div className="text">
                <p>{BIO.lead}</p>
                <p>{BIO.craft}</p>
                <p>{BIO.path}</p>
              </div>
            </Intro>

            <Cols aria-label="Path">
              {PATH.map(s => (
                <li key={s.key}>
                  <span className="place">{s.place}</span>
                  <h3>{s.title}</h3>
                  <p>{s.note}</p>
                </li>
              ))}
            </Cols>

            <Langs>
              <span>Working languages</span>
              {LANGUAGES.join('  ·  ')}
            </Langs>
          </div>
        </Page>
      </Bleed>

      <Bleed id="jobs" aria-label="Experience">
        <Page>
          <div className="wrap">
            <Opener cap={exCap}>
              <div className="word">
                <Word
                  text="EXPER"
                  height={exCap}
                  ink={T.ink}
                  ground="#ffffff"
                  accent={COVER.vermilion}
                />
                <Word
                  text="IENCE"
                  height={exCap}
                  ink={T.ink}
                  ground="#ffffff"
                  accent={COVER.vermilion}
                />
              </div>
              <div className="side">
                <div className="row">
                  <span>{EXPERIENCE.title}</span>
                  <span>{EXPERIENCE.span}</span>
                </div>
                <p>{EXPERIENCE.standfirst}</p>
              </div>
            </Opener>

            <Entries aria-label="Roles in detail">
              {jobs.map(j => (
                <li key={j.company + j.range}>
                  <p className="when">
                    {j.range}
                    <br />
                    {j.location}
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
        </Page>
      </Bleed>
    </>
  );
};

export default FieldD;
