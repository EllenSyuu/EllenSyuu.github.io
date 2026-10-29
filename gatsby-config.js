const config = require('./src/config');

module.exports = {
  // Set by the deploy workflow: '' for EllenSyuu.github.io, '/<repo>' for any other repo name.
  pathPrefix: process.env.GATSBY_PATH_PREFIX || '',
  siteMetadata: {
    title: config.name,
    description: config.description,
    siteUrl: config.siteUrl, // No trailing slash allowed!
    image: '/og.png', // Path to your image you placed in the 'static' folder
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.name,
        short_name: config.shortName,
        start_url: '/',
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: 'minimal-ui',
        icon: 'src/images/logo.png',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `images`, path: `${__dirname}/src/images` },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/content/` },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: { maxWidth: 700, linkImagesToOriginal: true, quality: 90 },
          },
          // LaTeX in Markdown: $inline$ and $$display$$
          { resolve: `gatsby-remark-katex`, options: { strict: `ignore` } },
          {
            resolve: `gatsby-remark-prismjs`,
            options: { classPrefix: 'language-', inlineCodeMarker: null, aliases: {} },
          },
        ],
      },
    },
  ],
};
