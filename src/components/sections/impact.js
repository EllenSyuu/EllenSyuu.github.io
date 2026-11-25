import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Page, SectionHead, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * Beyond the code — documentary rather than decorative: three short stories set as
 * newspaper columns (no stock drawings), then a plain ledger of leadership and community
 * roles with dates.
 */

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
    years: '2024 — now',
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
    note: 'Led voluntary teaching and support for children from minority groups in China during Covid-19 — the Fujia Zhanjiang project, recognised by the fellowship.',
  },
  {
    years: '2024 — 26',
    role: 'Soprano',
    org: 'McGill Choral Society',
    note: '',
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

const Stories = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${T.rule};

  li {
    padding: 22px clamp(18px, 2.4vw, 34px) 26px;
    border-left: 1px solid ${T.hair};
  }
  li:first-child {
    padding-left: 0;
    border-left: 0;
  }
  li:last-child {
    padding-right: 0;
  }

  .over {
    margin: 0 0 14px;
    color: ${T.vermilionText};
    ${cap};
    font-size: 10px;
  }
  h3 {
    margin: 0 0 12px;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(24px, 2.2vw, 31px);
    font-weight: 500;
    font-variation-settings: 'opsz' 26;
    line-height: 1.12;
  }
  h3 a:hover {
    color: ${T.vermilionText};
  }
  p {
    margin: 0 0 16px;
    color: ${T.text};
    font-family: ${SANS};
    font-size: 15px;
    line-height: 1.65;
  }
  .more {
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 13.5px;
    text-decoration: underline;
    text-decoration-color: ${T.vermilionText};
    text-underline-offset: 4px;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    li,
    li:first-child,
    li:last-child {
      padding: 20px 0 24px;
      border-left: 0;
      border-top: 1px solid ${T.hair};
    }
    li:first-child {
      border-top: 0;
    }
  }
`;

const Ledger = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  margin-top: clamp(80px, 9vw, 128px);

  h3 {
    grid-column: 1 / span 3;
    margin: 0;
    padding-top: 14px;
    border-top: 1px solid ${T.rule};
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(24px, 2.2vw, 30px);
    font-weight: 500;
    line-height: 1.15;
  }
  h3 small {
    display: block;
    margin-top: 8px;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 13px;
    font-weight: 400;
  }
  ol {
    grid-column: 4 / span 9;
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid ${T.rule};
  }
  li {
    display: grid;
    grid-template-columns: 7.5em minmax(0, 4fr) minmax(0, 5fr);
    gap: 4px 24px;
    padding: 14px 0 15px;
    border-bottom: 1px solid ${T.hair};
    font-family: ${SANS};
  }
  .years {
    color: ${T.muted};
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    padding-top: 3px;
  }
  .role {
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 18px;
    font-variation-settings: 'opsz' 14;
    line-height: 1.3;
  }
  .role small {
    display: block;
    margin-top: 3px;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 12.5px;
  }
  .note {
    margin: 0;
    color: ${T.text};
    font-size: 14px;
    line-height: 1.55;
  }

  @media (max-width: 900px) {
    h3,
    ol {
      grid-column: 1 / -1;
    }
    h3 {
      margin-bottom: 18px;
    }
    li {
      grid-template-columns: 6.5em minmax(0, 1fr);
    }
    .note {
      grid-column: 2;
    }
    .note:empty {
      display: none;
    }
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
          }
        }
      }
    }
  `);

  const stories = data.stories.nodes;

  return (
    <Page id="impact">
      <div className="wrap">
        <SectionHead
          layout="split"
          label="Beyond the code"
          aside="Classrooms · communities · public data"
          title="Beyond the code"
          standfirst="Statistics matters most when it reaches people. Some of the work I’m proudest of happens outside a repository — in classrooms, communities and public data."
        />

        <Stories>
          {stories.map(({ id, frontmatter: f }) => (
            <li key={id}>
              <p className="over">{f.overline}</p>
              <h3>
                <Link to={f.slug}>{f.title}</Link>
              </h3>
              <p>{f.description}</p>
              <Link className="more" to={f.slug} aria-label={`Read: ${f.title}`}>
                Read the story
              </Link>
            </li>
          ))}
        </Stories>

        <Ledger>
          <h3>
            Leadership &amp; community
            <small>Roles alongside the degrees</small>
          </h3>
          <ol>
            {ROLES.map(r => (
              <li key={`${r.role}-${r.org}`}>
                <span className="years">{r.years.replace(' — ', '–')}</span>
                <span className="role">
                  {r.role}
                  <small>{r.org}</small>
                </span>
                <p className="note">{r.note}</p>
              </li>
            ))}
          </ol>
        </Ledger>
      </div>
    </Page>
  );
};

export default Impact;
