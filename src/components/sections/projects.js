import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Page, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * Other projects — an index rather than a wall of cards: grouped by kind, one line each,
 * set like the contents page of a journal.
 */

const GROUPS = [
  { title: 'Research & methods', match: ['Self-Consistency Stopping', 'Bayesian Cohort Model (SDG 4.1.4)', 'Epidemiology Research, HKU'] },
  { title: 'Software & tools', match: ['NumPyro Checkpoint', 'JobVeyra · Job-Search Engine', 'HosiCite · Citation Atlas', 'IMMCA · Canadian Immigration Pathways', 'This Website'] },
  { title: 'Study notebooks', match: ['FM Notebook · SOA Exam FM', 'Derivatives Notebook'] },
];

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.rule};

  h2 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(30px, 3.2vw, 44px);
    font-weight: 500;
    font-variation-settings: 'opsz' 36;
    line-height: 1.05;
  }
  a {
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 14px;
    text-decoration: underline;
    text-decoration-color: ${T.vermilionText};
    text-underline-offset: 4px;
    &:hover {
      color: ${T.vermilionText};
    }
  }
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  padding-top: 26px;

  h3 {
    grid-column: 1 / span 3;
    margin: 4px 0 18px;
    color: ${T.vermilionText};
    ${cap};
  }
  ol {
    grid-column: 4 / span 9;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 6fr) 3.2em;
    gap: 6px clamp(16px, 2vw, 32px);
    padding: 16px 0 18px;
    border-bottom: 1px solid ${T.hair};
  }
  .title {
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 20px;
    font-variation-settings: 'opsz' 16;
    line-height: 1.25;
  }
  .title small {
    display: block;
    margin-top: 6px;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 12px;
    line-height: 1.5;
  }
  .desc {
    color: ${T.text};
    font-family: ${SANS};
    font-size: 14.5px;
    line-height: 1.6;
    p {
      margin: 0;
    }
    a {
      color: ${T.ink};
      text-decoration: underline;
      text-decoration-color: ${T.vermilionText};
      text-underline-offset: 3px;
    }
  }
  .links {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-family: ${SANS};
    font-size: 13px;
    white-space: nowrap;
    a {
      color: ${T.ink};
      text-decoration: underline;
      text-decoration-color: ${T.vermilionText};
      text-underline-offset: 3px;
      &:hover {
        color: ${T.vermilionText};
      }
    }
  }

  @media (max-width: 900px) {
    h3,
    ol {
      grid-column: 1 / -1;
    }
    li {
      grid-template-columns: 1fr;
    }
    .links {
      flex-direction: row;
      align-items: flex-start;
      gap: 18px;
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
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

  const projects = data.projects.edges.map(e => e.node);
  const used = new Set();
  const groups = GROUPS.map(g => {
    const items = g.match.map(t => projects.find(p => p.frontmatter.title === t)).filter(Boolean);
    items.forEach(p => used.add(p.frontmatter.title));
    return { ...g, items };
  });
  const rest = projects.filter(p => !used.has(p.frontmatter.title));
  if (rest.length) groups.push({ title: 'Other', items: rest });

  return (
    <Page id="more-projects" style={{ paddingTop: 'clamp(96px, 10vw, 150px)' }}>
      <div className="wrap">
        <Head>
          <h2>Other projects</h2>
          <Link to="/archive">The full archive</Link>
        </Head>
        {groups
          .filter(g => g.items.length)
          .map(g => (
            <Group key={g.title} role="group" aria-label={g.title}>
              <h3>{g.title}</h3>
              <ol>
                {g.items.map(({ frontmatter: f, html }) => (
                  <li key={f.title}>
                    <div className="title">
                      {f.title}
                      {f.tech && <small>{f.tech.join(' · ')}</small>}
                    </div>
                    <div className="desc" dangerouslySetInnerHTML={{ __html: html }} />
                    <div className="links">
                      {f.github && <a href={f.github}>Code</a>}
                      {f.external && <a href={f.external}>Open</a>}
                    </div>
                  </li>
                ))}
              </ol>
            </Group>
          ))}
      </div>
    </Page>
  );
};

export default Projects;
