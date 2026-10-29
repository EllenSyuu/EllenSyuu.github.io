import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';
import TransitionStyles from './TransitionStyles';
import PrismStyles from './PrismStyles';

const GlobalStyle = createGlobalStyle`
  ${fonts};
  ${variables};

  html {
    box-sizing: border-box;
    width: 100%;
    scroll-behavior: smooth;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  ::selection {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
  }

  /* Provide basic, default focus styles.*/
  :focus {
    outline: 1.5px dashed var(--green);
    outline-offset: 3px;
  }

  /*
    Remove default focus styles for mouse users ONLY if
    :focus-visible is supported on this platform.
  */
  :focus:not(:focus-visible) {
    outline: none;
    outline-offset: 0px;
  }

  /*
    Optionally: If :focus-visible is supported on this
    platform, provide enhanced focus styles for keyboard
    focus.
  */
  :focus-visible {
    outline: 1.5px dashed var(--green);
    outline-offset: 3px;
  }

  /* Scrollbar Styles */
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--dark-slate) var(--navy);
  }
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: var(--navy);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--dark-slate);
    border: 3px solid var(--navy);
    border-radius: 10px;
  }

  /* Fine paper grain over everything (pointer-events off, very low contrast). */
  body:after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0.35;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC45JyBudW1PY3RhdmVzPScyJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPScwIDAgMCAwIDAuNDIgMCAwIDAgMCAwLjMgMCAwIDAgMCAwLjIgMCAwIDAgMC4wOSAwJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI24pJy8+PC9zdmc+");
  }

  ::selection {
    background-color: rgba(207, 96, 43, 0.18);
    color: var(--lightest-slate);
  }

  html {
    font-synthesis: none;
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: var(--navy);
    color: var(--slate);
    font-family: var(--font-sans);
    font-size: var(--fz-lg);
    line-height: 1.7;
    font-feature-settings: 'ss01', 'cv11';
    text-rendering: optimizeLegibility;

    @media (max-width: 480px) {
      font-size: var(--fz-lg);
    }

    &.hidden {
      overflow: hidden;
    }

    &.blur {
      overflow: hidden;

      header {
        background-color: transparent;
      }

      #content > * {
        filter: blur(5px) brightness(0.7);
        transition: var(--transition);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  #root {
    min-height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
  }

  main {
    margin: 0 auto;
    width: 100%;
    max-width: 1600px;
    min-height: 100vh;
    padding: 200px 150px;

    @media (max-width: 1080px) {
      padding: 200px 100px;
    }
    @media (max-width: 768px) {
      padding: 150px 50px;
    }
    @media (max-width: 480px) {
      padding: 125px 25px;
    }

    &.fillHeight {
      padding: 0 150px;

      @media (max-width: 1080px) {
        padding: 0 100px;
      }
      @media (max-width: 768px) {
        padding: 0 50px;
      }
      @media (max-width: 480px) {
        padding: 0 25px;
      }
    }
  }

  section {
    margin: 0 auto;
    padding: 84px 0;
    max-width: 1080px;

    @media (max-width: 768px) {
      padding: 64px 0;
    }

    @media (max-width: 480px) {
      padding: 60px 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 10px 0;
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--lightest-slate);
    line-height: 1.08;
  }

  em.accent,
  .accent-italic {
    font-style: italic;
    font-weight: 500;
    color: var(--green);
  }

  .big-heading {
    margin: 0;
    font-size: clamp(44px, 7vw, 80px);
    letter-spacing: -0.02em;
    line-height: 1.04;
  }

  .medium-heading {
    margin: 0;
    font-size: clamp(34px, 6vw, 56px);
    letter-spacing: -0.015em;
  }

  /* Added by the motion layer: heading rules start collapsed and draw in when seen. */
  body.motion .numbered-heading:not(.is-in):after {
    transform: scaleX(0);
  }

  /* One-line introduction under a chapter heading: links the chapter to the storyline. */
  .chapter-lede,
  section .lede {
    max-width: 620px;
    margin: -14px 0 44px;
    color: var(--slate);
  }

  .numbered-heading {
    display: flex;
    align-items: center;
    position: relative;
    margin: 10px 0 40px;
    width: 100%;
    font-size: clamp(26px, 5vw, var(--fz-heading));
    white-space: nowrap;

    &:before {
      position: relative;
      bottom: 2px;
      counter-increment: section;
      content: '0' counter(section) '.';
      margin-right: 14px;
      color: var(--green);
      font-family: var(--font-serif);
      font-size: clamp(20px, 3vw, 26px);
      font-style: italic;
      font-weight: 500;

      @media (max-width: 480px) {
        margin-bottom: -3px;
        margin-right: 5px;
      }
    }

    &:after {
      content: '';
      display: block;
      position: relative;
      top: -5px;
      width: 300px;
      height: 0.75px;
      margin-left: 22px;
      transform-origin: left;
      transition: transform 1.4s 0.15s cubic-bezier(0.55, 0.05, 0.25, 1);
      background: linear-gradient(90deg, var(--ink), rgba(34, 49, 74, 0.25) 70%, transparent);

      @media (max-width: 1080px) {
        width: 200px;
      }
      @media (max-width: 768px) {
        width: 100%;
      }
      @media (max-width: 600px) {
        margin-left: 10px;
      }
    }
  }

  img,
  svg,
  .gatsby-image-wrapper {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  img[alt=""],
  img:not([alt]) {
    filter: blur(5px);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    vertical-align: middle;

    &.feather {
      fill: none;
    }
  }

  /* Links in running text stay inline so following punctuation never wraps on its own;
     their hover underline is taken out of the flow. */
  p a {
    display: inline !important;

    &:after {
      position: absolute !important;
      left: 0;
      bottom: 0.08em;
    }
  }

  a {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--green);
    }

    &.inline-link {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }

  input, textarea {
    border-radius: 0;
    outline: 0;

    &:focus {
      outline: 0;
    }
    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  p {
    margin: 0 0 15px 0;

    &:last-child,
    &:last-of-type {
      margin: 0;
    }

    & > a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    & > code {
      background-color: var(--light-navy);
      color: var(--white);
      font-size: var(--fz-sm);
      border-radius: var(--border-radius);
      padding: 0.3em 0.5em;
    }
  }

  ul {
    &.fancy-list {
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: var(--fz-lg);
      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 10px;
        &:before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--green);
        }
      }
    }
  }

  blockquote {
    border-left-color: var(--green);
    border-left-style: solid;
    border-left-width: 1px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 1.5rem;

    p {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 26px;
    }
  }

  hr {
    background-color: var(--lightest-navy);
    height: 1px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 1rem;
  }

  code {
    font-family: var(--font-code);
    font-size: var(--fz-md);
  }

  .skip-to-content {
    ${({ theme }) => theme.mixins.button};
    position: absolute;
    top: auto;
    left: -999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -99;

    &:hover,
    &:focus {
      background-color: var(--green);
      color: var(--navy);
      top: 0;
      left: 0;
      width: auto;
      height: auto;
      overflow: auto;
      z-index: 99;
      box-shadow: none;
      transform: none;
    }
  }

  #logo {
    color: var(--green);
  }

  .overline {
    color: var(--green);
    font-family: var(--font-serif);
    font-size: var(--fz-sm);
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* Highlighter: a watercolour brush stroke with a pencil underline, swept in behind a
     subtitle when it scrolls into view (see components/mark-observer). */
  .mark {
    padding: 0 0.06em;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M3 8.5 C 28 4.5 62 6.5 101 5 S 168 3.2 197 6.6 L 196.4 14.6 C 158 17.2 121 13.8 80 16.2 S 22 17.6 4 15.4 Z' fill='%23e0a046' fill-opacity='.46'/%3E%3Cpath d='M8 10.5 C 52 8 120 9.8 192 8.6 L 191 12.8 C 130 14.6 60 12.6 9 14 Z' fill='%23cf602b' fill-opacity='.16'/%3E%3Cpath d='M5 15.2 C 60 13.2 132 15.4 195 13.4' stroke='%2322314a' stroke-opacity='.28' stroke-width='.7' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 0 92%;
    background-size: 0% 0.64em;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition: background-size 1.15s cubic-bezier(0.55, 0.05, 0.25, 1) 0.1s;
  }
  .mark.is-marked {
    background-size: 100% 0.64em;
  }

  /* Watercolour edges (SVG turbulence filters) are costly to paint on phones: there the
     washes keep their colour but lose the ragged edge. */
  @media (max-width: 900px), (pointer: coarse) {
    svg [filter] {
      filter: none !important;
    }

    /* The full-page grain is blended over everything; skip it on phones. */
    body:after {
      display: none;
    }
  }

  /* Hand-lettered marginal notes. */
  .hand {
    font-family: var(--font-hand);
    font-weight: 400;
  }

  .subtitle {
    color: var(--green);
    margin: 0 0 20px 0;
    font-size: var(--fz-md);
    font-family: var(--font-mono);
    font-weight: 400;
    line-height: 1.5;
    @media (max-width: 1080px) {
      font-size: var(--fz-sm);
    }
    @media (max-width: 768px) {
      font-size: var(--fz-xs);
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      line-height: 1.5;
    }
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--green);

    .arrow {
      display: block;
      margin-right: 10px;
      padding-top: 4px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 600;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .gatsby-image-outer-wrapper {
    height: 100%;
  }

  ${TransitionStyles};

  ${PrismStyles};
`;

export default GlobalStyle;
