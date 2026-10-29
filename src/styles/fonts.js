import { css } from 'styled-components';

// The web fonts themselves are imported as plain CSS in gatsby-browser.js. Only the metric-
// matched fallback for Inter lives here, so body text does not reflow when Inter arrives.
const Fonts = css`
  @font-face {
    font-family: 'Inter Fallback';
    src: local('Arial'), local('Helvetica'), local('Liberation Sans');
    size-adjust: 107.4%;
    ascent-override: 90.2%;
    descent-override: 22.48%;
    line-gap-override: 0%;
  }
`;

export default Fonts;
