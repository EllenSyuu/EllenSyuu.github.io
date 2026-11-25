import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { Page, SectionHead, Figure, T, DISPLAY, SANS, cap } from '@components/editorial';
import { SdgVintages } from '@components/figures/sdg';
import { QuebecDependence, ExtremalCoefficient } from '@components/figures/quebec';
import { VviRecovery, VviScaling } from '@components/figures/vvi';
import { TailBands, TailCoverage } from '@components/figures/tail';

/*
 * Selected work — four short research articles. Each has its question, why it matters, the
 * method and what I built, the evidence as figures drawn from the project's own published
 * numbers, and the code. Layouts differ with what each study needs to show.
 * Figure 1 is the experience chart, so the studies start at Figure 2.
 */

const STUDIES = {
  sdg: {
    layout: 'wide',
    figs: [
      {
        C: SdgVintages,
        area: 'f1',
        caption:
          'One indicator (4.c.1, teachers with the minimum required qualifications), published four times: countries with a value, by reference year. Each release adds a year, fills in late data and revises the past.',
        source: 'Synthetic data from the repository’s deterministic generator — not UNESCO data.',
      },
    ],
  },
  covarchimax: {
    layout: 'map',
    figs: [
      {
        C: QuebecDependence,
        area: 'f1',
        caption:
          'Six ECCC stations in southern Québec, 1930–2017. Each pair is joined by a line weighted by the empirical upper-tail dependence of their monthly precipitation maxima at the 0.8 quantile. *Under independence the value is 0.2. In June–July extremes are close to independent; in October–November most pairs share their extremes.',
        source: 'Base map: Natural Earth (public domain). Values: SAC-thesis-2026, results/tables/tab_07.',
      },
      {
        C: ExtremalCoefficient,
        area: 'f2',
        caption:
          'Six-station extremal coefficient by season, with 90% block-bootstrap intervals (200 replicates). The June–July minus October–November difference is 1.83 (1.24–2.28).',
        source: 'SAC-thesis-2026, results/tables/tab_20.',
      },
    ],
  },
  vvi: {
    layout: 'side',
    figs: [
      {
        C: VviRecovery,
        area: 'f1',
        caption:
          'Synthetic validation. Hazard ratios of reinfection by vaccination–infection history (B = Comirnaty dose, S = CoronaVac dose, I = infection, in order), with 95% intervals; the vermilion tick is the value planted in the simulation. All nine are recovered.',
        source: 'One synthetic cohort, seed 2024: 600,000 people, 35,305 infections, 188 million person-days fitted from 17,520 rows.',
      },
      {
        C: VviScaling,
        area: 'f2',
        caption:
          'Build and fit time against cohort size. Identical estimates; only the cost differs. At 5,000 people the person-day route peaks at 5.3 GB of memory, the aggregated one at 59 MB.',
        source: 'VVI, docs/benchmark.md (single CPU process).',
      },
    ],
  },
  tailfm: {
    layout: 'pair',
    figs: [
      {
        C: TailBands,
        area: 'f1',
        caption:
          'Danish fire-insurance losses (n = 2,167). At each threshold k, the union band (the hull of simultaneous bands over a range of working ρ′) and the first-order band. The shaded stripe, ξ ∈ [0.52, 0.84], lies inside every union band.',
        source: 'tailfm-union-band, paper/preprint/generated/tab_danish.tex.',
      },
      {
        C: TailCoverage,
        area: 'f2',
        caption:
          'Pre-registered benchmark, run once on frozen code. Inside the stated ρ range the union band holds coverage in all 16 settings; the usual interval at a selected k falls below 0.80 in 12. Outside it (ρ = −0.25) both fail, and this is reported.',
        source: 'tailfm-union-band, paper/preprint/generated/tab_bench.tex.',
      },
    ],
  },
};

const Article = styled.article`
  padding-top: 22px;
  border-top: 1px solid ${T.rule};
  & + & {
    margin-top: clamp(110px, 12vw, 180px);
  }

  .kicker {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px 20px;
    color: ${T.vermilionText};
    ${cap};
    span + span {
      color: ${T.muted};
    }
  }

  h3 {
    max-width: 1000px;
    margin: clamp(20px, 2.4vw, 32px) 0 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(34px, 4.4vw, 62px);
    font-weight: 500;
    font-variation-settings: 'opsz' 48;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }

  .deck {
    max-width: 780px;
    margin: clamp(18px, 2vw, 26px) 0 clamp(40px, 4.6vw, 64px);
    color: ${T.text};
    font-family: ${DISPLAY};
    font-size: clamp(20px, 1.9vw, 26px);
    font-variation-settings: 'opsz' 18;
    line-height: 1.36;
  }
  .deck small {
    display: block;
    margin-bottom: 8px;
    color: ${T.muted};
    ${cap};
    font-size: 10px;
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  row-gap: clamp(40px, 4.6vw, 64px);
  align-items: start;

  .f1,
  .f2,
  .text,
  .evidence {
    min-width: 0;
  }

  &.wide {
    .f1 {
      grid-column: 1 / -1;
    }
    .text {
      grid-column: 1 / span 7;
    }
    .evidence {
      grid-column: 9 / span 4;
    }
  }
  &.map {
    .f1 {
      grid-column: 1 / span 8;
      grid-row: 1;
    }
    .f2 {
      grid-column: 9 / span 4;
      grid-row: 1;
    }
    .text {
      grid-column: 1 / span 7;
      grid-row: 2;
    }
    .evidence {
      grid-column: 9 / span 4;
      grid-row: 2;
    }
  }
  &.side {
    .text {
      grid-column: 1 / span 5;
      grid-row: 1;
    }
    .f1 {
      grid-column: 7 / span 6;
      grid-row: 1;
    }
    .evidence {
      grid-column: 1 / span 5;
      grid-row: 2;
    }
    .f2 {
      grid-column: 7 / span 6;
      grid-row: 2;
    }
  }
  &.pair {
    .f1 {
      grid-column: 1 / span 7;
      grid-row: 1;
    }
    .f2 {
      grid-column: 8 / span 5;
      grid-row: 1 / span 2;
    }
    .text {
      grid-column: 1 / span 7;
      grid-row: 2;
    }
    .evidence {
      grid-column: 1 / span 7;
      grid-row: 3;
    }
  }

  @media (max-width: 1000px) {
    &.wide,
    &.map,
    &.side,
    &.pair {
      .f1,
      .f2,
      .text,
      .evidence {
        grid-column: 1 / -1;
        grid-row: auto;
      }
    }
    &.side .f1 {
      order: -1;
    }
  }
`;

const Text = styled.div`
  font-family: ${SANS};
  font-size: 16px;
  line-height: 1.7;
  color: ${T.text};

  h4 {
    margin: 0 0 8px;
    color: ${T.ink};
    ${cap};
  }
  h4 + p,
  h4 + div {
    margin-top: 0;
  }
  p {
    max-width: 640px;
  }
  .why {
    margin-bottom: 28px;
  }
  code {
    padding: 1px 5px;
    background: ${T.paperDeep};
    font-size: 13.5px;
  }
`;

const Evidence = styled.aside`
  font-family: ${SANS};

  h4 {
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid ${T.rule};
    color: ${T.ink};
    ${cap};
  }

  .results {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
  }
  .pair & .results,
  .side & .results {
    grid-template-columns: 1fr 1fr;
    column-gap: 28px;
    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }
  .result {
    padding: 14px 0 16px;
    border-bottom: 1px solid ${T.hair};
  }
  .value {
    display: block;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 500;
    font-variation-settings: 'opsz' 30;
    line-height: 1.1;
  }
  .label {
    margin: 8px 0 0;
    color: ${T.text};
    font-size: 14px;
    line-height: 1.55;
  }

  .built {
    margin: 16px 0 0;
    color: ${T.muted};
    font-size: 13px;
    line-height: 1.6;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 22px;
    margin-top: 16px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: ${T.ink};
      font-size: 14px;
      font-weight: 500;
      text-decoration: underline;
      text-decoration-color: ${T.vermilionText};
      text-underline-offset: 4px;
      &:hover {
        color: ${T.vermilionText};
      }
    }
    svg {
      width: 16px;
      height: 16px;
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
              why
              figure {
                publicURL
              }
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

  const cases = data.featured.edges.map(e => e.node);
  let n = 1;

  return (
    <Page id="projects">
      <div className="wrap">
        <SectionHead
          label="Selected work"
          aside="2023 — 2026"
          title="Selected work"
          standfirst="Four studies — the question, the evidence, and the code to rerun it yourself."
        />

        {cases.map(({ frontmatter: f, html }) => {
          const study = STUDIES[f.slug] || { layout: 'wide', figs: [] };
          return (
            <Article key={f.slug} id={`case-${f.slug}`} aria-labelledby={`case-${f.slug}-title`}>
              <div className="kicker">
                <span>{f.overline}</span>
                <span>{f.package}</span>
              </div>
              <h3 id={`case-${f.slug}-title`}>{f.title}</h3>
              <p className="deck">
                <small>The question</small>
                {f.question}
              </p>

              <Body className={study.layout}>
                {study.figs.map(({ C, area, caption, source }) => {
                  n += 1;
                  return (
                    <Figure key={area} className={area} n={n} caption={caption} source={source}>
                      <C />
                    </Figure>
                  );
                })}

                <Text className="text">
                  {f.why && (
                    <>
                      <h4>Why it matters</h4>
                      <p className="why">{f.why}</p>
                    </>
                  )}
                  <h4>Method and what I built</h4>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </Text>

                <Evidence className="evidence">
                  <h4>Evidence</h4>
                  <div className="results">
                    {(f.results || []).map(r => (
                      <div className="result" key={r.value}>
                        <span className="value">{r.value}</span>
                        <p className="label">{r.label}</p>
                      </div>
                    ))}
                  </div>
                  {f.tech && f.tech.length > 0 && <p className="built">{f.tech.join(' · ')}</p>}
                  <div className="links">
                    {f.github && (
                      <a href={f.github}>
                        <Icon name="GitHub" /> Code on GitHub
                      </a>
                    )}
                    {f.external && (
                      <a href={f.external}>
                        <Icon name="External" /> Live demo
                      </a>
                    )}
                    {f.figure && (
                      <a href={f.figure.publicURL}>
                        <Icon name="External" /> Original figure
                      </a>
                    )}
                  </div>
                </Evidence>
              </Body>
            </Article>
          );
        })}
      </div>
    </Page>
  );
};

export default Featured;
