import { useStaticQuery, graphql } from 'gatsby';

/*
 * Shared, factual content for the phase-1 prototypes. Every line here is taken from the
 * live site's About section and from content/jobs; the three prototypes differ only in
 * composition, scale and the material they put at the centre of each screen.
 */

export const QUESTION = 'How sure can we be about things that almost never happen?';

export const BIO = {
  lead: 'My work starts with a simple question: how sure can we be about things that almost never happen?',
  craft:
    'Answering it well takes two skills I try to hold to the same standard — careful statistics, and engineering that lets anyone rerun the result.',
  path: 'I trained in statistics at HKU and McGill, and today I apply it to education data for SDG 4 at the UNESCO Institute for Statistics. Next, I want to keep building on official statistics and education data, and to bring the same rigour to quantitative research.',
};

export const PATH = [
  {
    key: 'hku',
    place: 'Hong Kong',
    title: 'B.Sc. Statistics, University of Hong Kong',
    note: 'Dean’s Honours List; exchange semester at McGill (2022). Research assistant in epidemiology (co-author in Vaccines); final-year project on Omicron hybrid immunity.',
  },
  {
    key: 'mcgill',
    place: 'Montréal',
    title: 'M.Sc. Mathematics & Statistics, McGill',
    note: 'CGPA 3.88; NSERC research grant and Graduate Excellence Award. Thesis on covariate-dependent Archimax copulas for rainfall extremes in Québec.',
  },
  {
    key: 'uis',
    place: 'Montréal, now',
    title: 'UNESCO Institute for Statistics',
    note: 'Data Innovation and AI Intern: SDG 4 data pipelines and dashboards across 200+ countries.',
  },
];

export const LANGUAGES = ['English', 'Français', '普通话', '廣東話', '日本語'];

export const EXPERIENCE = {
  label: 'Experience',
  span: '2020 — 2026',
  title: 'Chronology',
  standfirst:
    'Research, data and teaching roles since 2020 — statistics and education data first, with programming and quantitative work throughout.',
};

export const useJobs = (limit = 2) => {
  const data = useStaticQuery(graphql`
    query {
      phaseJobs: allMarkdownRemark(
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
  return data.phaseJobs.edges.slice(0, limit).map(({ node }) => ({
    ...node.frontmatter,
    company: node.frontmatter.company.replace(' · 2022', ''),
    range: node.frontmatter.range.replace(' — ', ' – '),
    html: node.html,
  }));
};
