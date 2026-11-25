import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Page, SectionHead, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * What I do — an overview written as three questions, each answered in a paragraph and
 * pointed at the work that tests it. No cards: rows on a ruled page.
 */

const PILLARS = [
  {
    key: 'A',
    title: 'Extremes & tail risk',
    question: 'How large can it get — and does it happen everywhere at once?',
    body: 'Extreme value theory and copulas for events that averages hide: non-stationary GEV margins, tail dependence, and estimators with honest uncertainty.',
    methods: ['Extreme value theory', 'Copulas', 'Bootstrap'],
    evidence: [
      { label: 'covarchimax', to: '/#case-covarchimax' },
      { label: 'TailFM', to: '/#case-tailfm' },
    ],
  },
  {
    key: 'B',
    title: 'Trustworthy modelling software',
    question: 'Can someone else rerun it and get the same answer?',
    body: 'Bayesian and machine-learning models built like products: typed configs, tests, locked environments, CI, and reports generated straight from evidence.',
    methods: ['Stan · NumPyro', 'PyTorch', 'Testing & CI'],
    evidence: [
      { label: 'VVI', to: '/#case-vvi' },
      { label: 'Bayesian Cohort Model', to: '/#more-projects' },
    ],
  },
  {
    key: 'C',
    title: 'Statistics for the public good',
    question: 'Which numbers can a policy-maker actually rely on?',
    body: 'Official statistics and public health: tracking how SDG 4 indicators change between releases at UNESCO, and measuring vaccine and hybrid-immunity protection from Hong Kong’s Omicron waves.',
    methods: ['SDG 4 indicators', 'Survival analysis', 'Data vintages'],
    evidence: [
      { label: 'SDG 4 Data Revision Tracker', to: '/#case-sdg' },
      { label: 'Hybrid immunity (VVI)', to: '/#case-vvi' },
      { label: 'Beyond the Code', to: '/#impact' },
    ],
  },
];

const Rows = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    padding: clamp(28px, 3vw, 40px) 0;
    border-top: 1px solid ${T.hair};
  }
  li:first-child {
    border-top-color: ${T.rule};
  }
  @media (min-width: 901px) {
    li:nth-child(2) {
      .q {
        grid-column: 6 / span 7;
        grid-row: 1;
      }
      .a {
        grid-column: 1 / span 4;
        grid-row: 1;
      }
    }
  }

  .q {
    grid-column: 1 / span 6;
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(26px, 2.7vw, 38px);
    font-weight: 400;
    font-variation-settings: 'opsz' 28;
    line-height: 1.16;
    letter-spacing: -0.005em;
  }

  .a {
    grid-column: 8 / span 5;
    font-family: ${SANS};
  }
  .a h3 {
    margin: 0 0 10px;
    color: ${T.vermilionText};
    ${cap};
  }
  .a p {
    margin: 0 0 14px;
    color: ${T.text};
    font-size: 15.5px;
    line-height: 1.65;
  }
  .meta {
    color: ${T.muted};
    font-size: 13px;
    line-height: 1.6;
  }
  .meta a {
    color: ${T.ink};
    text-decoration: underline;
    text-decoration-color: ${T.vermilionText};
    text-underline-offset: 3px;
    &:hover {
      color: ${T.vermilionText};
    }
  }

  @media (max-width: 900px) {
    .q,
    .a {
      grid-column: 1 / -1;
    }
    .q {
      margin-bottom: 18px;
    }
  }
`;

const Focus = () => (
  <Page id="focus">
    <div className="wrap">
      <SectionHead
        layout="open"
        label="What I do"
        aside="Three questions"
        title="The work, in three questions"
        standfirst="Three threads run through everything I build. Each one links to the work that tests it."
      />
      <Rows>
        {PILLARS.map(p => (
          <li key={p.key}>
            <p className="q">{p.question}</p>
            <div className="a">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <p className="meta">
                {p.methods.join(' · ')}
                <br />
                See{' '}
                {p.evidence.map((e, k) => (
                  <React.Fragment key={e.label}>
                    {k > 0 && (k === p.evidence.length - 1 ? ' and ' : ', ')}
                    <Link to={e.to}>{e.label}</Link>
                  </React.Fragment>
                ))}
                .
              </p>
            </div>
          </li>
        ))}
      </Rows>
    </div>
  </Page>
);

export default Focus;
