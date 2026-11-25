import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import ExperienceTimeline from '@components/experience-timeline';
import { Page, SectionHead, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * Experience — a chronology. The range chart gives every role at a glance; below it each
 * principal role is set as a dated entry: when and where in the margin, the role and the
 * institution, then what was done and what came of it.
 */

const Entries = styled.ol`
  margin: clamp(64px, 7vw, 104px) 0 0;
  padding: 0;
  list-style: none;
  counter-reset: none;

  li {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2.2vw, 32px);
    padding: 26px 0 30px;
    border-top: 1px solid ${T.hair};
  }
  li:first-child {
    border-top-color: ${T.rule};
  }

  .when {
    grid-column: 1 / span 3;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  }
  .when small {
    display: block;
    color: ${T.muted};
    ${cap};
    font-size: 10px;
    margin-top: 4px;
  }

  .what {
    grid-column: 4 / span 4;
    padding-right: 12px;
  }
  .what h3 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(21px, 1.9vw, 26px);
    font-weight: 500;
    font-variation-settings: 'opsz' 20;
    line-height: 1.18;
  }
  .what .org {
    display: block;
    margin-top: 6px;
    color: ${T.vermilionText};
    font-family: ${SANS};
    font-size: 14px;
  }
  .what a.org:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .detail {
    grid-column: 8 / span 5;
    color: ${T.text};
    font-family: ${SANS};
    font-size: 15px;
    line-height: 1.62;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: block;
      position: relative;
      padding: 0 0 0 16px;
      border: 0;
      & + li {
        margin-top: 10px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.72em;
        width: 7px;
        height: 1px;
        background: ${T.ink};
      }
    }
    a {
      color: ${T.ink};
      text-decoration: underline;
      text-decoration-color: ${T.vermilionText};
      text-underline-offset: 3px;
    }
    strong {
      color: ${T.ink};
      font-weight: 600;
    }
    em {
      font-style: italic;
    }
    code {
      font-size: 13px;
    }
  }

  @media (max-width: 900px) {
    .when {
      grid-column: 1 / -1;
      margin-bottom: 8px;
    }
    .when small {
      display: inline;
      margin-left: 10px;
    }
    .what {
      grid-column: 1 / -1;
      margin-bottom: 14px;
    }
    .detail {
      grid-column: 1 / -1;
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const jobs = data.jobs.edges.map(e => e.node);

  return (
    <Page id="jobs">
      <div className="wrap">
        <SectionHead
          label="Experience"
          aside="2020 — 2026"
          title="Chronology"
          standfirst="Research, data and teaching roles since 2020 — statistics and education data first, with programming and quantitative work throughout."
        />

        <ExperienceTimeline />

        <Entries aria-label="Roles in detail">
          {jobs.map(({ frontmatter: f, html }) => (
            <li key={`${f.company}-${f.range}`}>
              <p className="when">
                {f.range.replace(' — ', ' – ')}
                <small>{f.location}</small>
              </p>
              <div className="what">
                <h3>{f.title}</h3>
                {f.url ? (
                  <a className="org" href={f.url}>
                    {f.company.replace(' · 2022', '')}
                  </a>
                ) : (
                  <span className="org">{f.company.replace(' · 2022', '')}</span>
                )}
              </div>
              <div className="detail" dangerouslySetInnerHTML={{ __html: html }} />
            </li>
          ))}
        </Entries>
      </div>
    </Page>
  );
};

export default Jobs;
