import { createGlobalStyle, css } from 'styled-components';
import { VARIANT } from './layer';

/*
 * Per-variant adjustments of the content layer: where text sits on dark water it turns to
 * the cover's cream, and chapters get the breathing room the drawing needs at their joins.
 */

const CREAM = '#f6f0e4';
const GOLD = '#e0ad4a';

const onDark = sel => css`
  ${sel} {
    h2,
    h3,
    .q,
    .standfirst,
    p,
    dd,
    span,
    a {
      color: ${CREAM} !important;
    }
    .kicker,
    .kicker span,
    .a h3 {
      color: ${GOLD} !important;
    }
    a {
      text-decoration-color: ${GOLD} !important;
    }
    li,
    ol,
    .bar {
      border-color: rgba(246, 240, 228, 0.3) !important;
    }
    .meta {
      color: rgba(246, 240, 228, 0.78) !important;
    }
  }
`;

const A = css`
  body {
    background: #e6ecef;
  }
  ${onDark('#about header')}
  #about header + div {
    margin-top: 320px;
  }
  #jobs header {
    margin-bottom: 220px;
  }
  #focus {
    padding-top: 640px !important;
    padding-bottom: 120px !important;
  }
  ${onDark('#focus')}
  #projects {
    padding-top: 620px !important;
  }
  #impact {
    padding-top: 260px !important;
  }
  #contact {
    padding-bottom: 420px !important;
  }
  #content > footer {
    position: relative;
    z-index: 1;
    margin-top: -150px;
    .bar,
    .credit,
    .credit a {
      color: ${CREAM} !important;
      border-color: rgba(246, 240, 228, 0.55) !important;
    }
  }
`;

const B = css`
  body {
    background: #edf0f2;
  }
  #jobs header {
    margin-bottom: 90px;
  }
  #focus {
    padding-top: 420px !important;
  }
  #projects {
    padding-top: 300px !important;
  }
  #impact {
    padding-top: 240px !important;
  }
  #contact {
    padding-bottom: 300px !important;
  }
  #content > footer {
    position: relative;
    z-index: 1;
    margin-top: -130px;
    .bar,
    .credit,
    .credit a {
      color: ${CREAM} !important;
      border-color: rgba(246, 240, 228, 0.55) !important;
    }
  }
`;
const C = css`
  body {
    background: #eef0ee;
  }
  #about {
    padding-top: 380px !important;
  }
  #content > footer {
    position: relative;
    z-index: 1;
  }
`;

const VariantStyle = createGlobalStyle`
  main {
    position: relative;
  }
  ${{ A, B, C }[VARIANT] || A}
`;

export default VariantStyle;
