import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import ImpactCard, { StyledImpactGrid } from '@components/impact/card';

// Leadership and community roles, kept as a ledger under the three stories.
const ROLES = [
  {
    years: '2023 — 24',
    role: 'Student Ambassador',
    org: 'The University of Hong Kong',
    note: 'Represented HKU at official outreach events and campaigns.',
  },
  {
    years: '2022 — 24',
    role: 'Science Student Peer Advisor',
    org: 'HKU Faculty of Science',
    note: 'Advised first-year students through the move from school to university; named Outstanding Science Student Peer Advisor, 2022–23.',
  },
  {
    years: '2024 —',
    role: 'Alumni Connector',
    org: 'HKU Class of 2024',
    note: '',
  },
  {
    years: '2020 — 23',
    role: 'Person in Charge, voluntary teaching',
    org: 'Fujia',
    note: 'Created the Zhanjiang project — two teaching sessions with 24 volunteers from four universities — and led the Shenzhen project before it.',
  },
  {
    years: '2022',
    role: 'Project Coordinator',
    org: 'Millennium Fellowship · UN Academic Impact',
    note: 'Led voluntary teaching and support for children from minority groups in China during Covid-19.',
  },
  {
    years: '2020 — 24',
    role: 'Soprano',
    org: 'HKUSU Union Choir',
    note: 'Concerts including the HKUCO × HKUC joint concert and the choir’s anniversary concert.',
  },
  {
    years: '2020 — 21',
    role: 'Student Representative',
    org: 'HKU Staff–Student Consultative Committee',
    note: '',
  },
];

const StyledLedger = styled.div`
  margin-top: 70px;

  h3 {
    margin: 0 0 6px;
    font-size: clamp(26px, 3vw, 32px);
  }

  .sub {
    margin: 0 0 26px;
    color: var(--dark-slate);
    font-family: var(--font-hand);
    font-size: 17px;
  }

  ol {
    ${({ theme }) => theme.mixins.resetList};
    border-top: 0.75px solid var(--ink);
  }

  li {
    display: grid;
    grid-template-columns: 130px minmax(0, 1fr) minmax(0, 1.25fr);
    gap: 6px 28px;
    align-items: baseline;
    padding: 16px 0 15px;
    border-bottom: 0.75px solid var(--hairline);

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
      gap: 2px;
    }
  }

  .years {
    color: var(--green);
    font-family: var(--font-serif);
    font-size: 17px;
    font-style: italic;
    font-weight: 500;
    white-space: nowrap;
  }

  .role {
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: 21px;
    font-weight: 600;
    line-height: 1.2;

    small {
      display: block;
      margin-top: 3px;
      color: var(--dark-slate);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
  }

  .note {
    margin: 0;
    color: var(--slate);
    font-size: 15.5px;
    line-height: 1.6;
  }
`;

const StyledImpactSection = styled.section`
  .more {
    ${({ theme }) => theme.mixins.smallButton};
    display: table;
    margin: 60px auto 0;
  }
`;

const Impact = () => {
  const data = useStaticQuery(graphql`
    {
      stories: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/impact/" }
          frontmatter: { draft: { ne: true } }
        }
        sort: { frontmatter: { order: ASC } }
        limit: 3
      ) {
        nodes {
          id
          frontmatter {
            title
            slug
            overline
            description
            coverAlt
            cover {
              childImageSharp {
                gatsbyImageData(width: 640, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
              }
            }
          }
        }
      }
    }
  `);

  const stories = data.stories.nodes;
  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, i) => ref && sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  return (
    <StyledImpactSection id="impact">
      <div ref={revealTitle}>
        <h2 className="numbered-heading">Beyond the Code</h2>
        <p className="lede">
          Statistics matters most when it reaches people. Some of the work I’m proudest of happens
          outside a repository — in classrooms, communities and public data.
        </p>
      </div>

      <StyledImpactGrid>
        {stories.map((node, i) => (
          <ImpactCard key={node.id} node={node} innerRef={el => (revealCards.current[i] = el)} />
        ))}
      </StyledImpactGrid>

      <StyledLedger>
        <h3>
          <span className="mark">Leadership &amp; community</span>
        </h3>
        <p className="sub">roles alongside the degrees</p>
        <ol>
          {ROLES.map(r => (
            <li key={r.role}>
              <span className="years">{r.years}</span>
              <span className="role">
                {r.role}
                <small>{r.org}</small>
              </span>
              <p className="note">{r.note}</p>
            </li>
          ))}
        </ol>
      </StyledLedger>

      <Link className="more" to="/impact">
        All stories
      </Link>
    </StyledImpactSection>
  );
};

export default Impact;
