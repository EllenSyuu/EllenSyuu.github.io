import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

/*
 * "What I Do" — the three threads that run through the work. Each pillar names the
 * question it answers, the methods it uses, and links to the projects that prove it,
 * so the page reads as an argument: focus → evidence → experience.
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

const StyledFocus = styled.section`
  ol {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    counter-reset: none;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  li {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 34px 30px 26px;
    border: 0.75px solid var(--hairline);
    border-radius: 0;
    background: var(--light-navy);
    outline: 0.75px solid transparent;
    outline-offset: -7px;
    transition: border-color 0.4s ease, outline-color 0.4s ease, box-shadow 0.4s ease;

    &:hover {
      border-color: var(--ink);
      outline-color: var(--hairline);
      box-shadow: 0 26px 44px -34px var(--navy-shadow);
    }
  }

  .key {
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 19px;
    font-style: italic;
    font-weight: 500;
  }

  h3 {
    margin: 6px 0 12px;
    font-size: 27px;
  }

  .question {
    margin: 0 0 14px;
    color: var(--light-slate);
    font-family: var(--font-hand);
    font-size: 17px;
    line-height: 1.55;
  }

  .body {
    margin: 0 0 18px;
    color: var(--slate);
    font-size: var(--fz-md);
    line-height: 1.6;
  }

  .methods {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 20px;
    padding: 0;
    list-style: none;

    li {
      display: block;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: none;
      color: var(--dark-slate);
      font-family: var(--font-serif);
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      outline: 0;

      & + li:before {
        content: '·';
        display: inline;
        position: static;
        margin: 0 8px 0 2px;
        color: var(--green);
      }

      &:hover {
        box-shadow: none;
        border: 0;
      }
    }
  }

  .evidence {
    margin-top: auto;
    padding-top: 16px;
    border-top: 0.75px solid var(--hairline);
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      margin-left: 0;
      font-size: 17px;
      font-style: italic;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: none;
    }

    a + a:before {
      content: '·';
      margin: 0 8px;
      color: var(--dark-slate);
    }
  }
`;

const Focus = () => {
  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, i) => ref && sr.reveal(ref, srConfig(i * 110)));
  }, [prefersReducedMotion]);

  return (
    <StyledFocus id="focus">
      <div ref={revealTitle}>
        <h2 className="numbered-heading">What I Do</h2>
        <p className="lede">
          Three threads run through everything I build. Each one links to the work that proves it.
        </p>
      </div>

      <ol>
        {PILLARS.map((p, i) => (
          <li key={p.key} ref={el => (revealCards.current[i] = el)}>
            <span className="key">Thread {p.key}</span>
            <h3>
              <span className="mark">{p.title}</span>
            </h3>
            <p className="question">{p.question}</p>
            <p className="body">{p.body}</p>
            <ul className="methods">
              {p.methods.map(m => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="evidence">
              <span style={{ display: 'block', marginBottom: 4 }}>Evidence</span>
              {p.evidence.map(e => (
                <Link key={e.label} to={e.to}>
                  {e.label}
                </Link>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </StyledFocus>
  );
};

export default Focus;
