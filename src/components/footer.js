import React from 'react';
import styled from 'styled-components';
import { T, SANS, MARGIN, cap } from '@components/editorial';

/*
 * The colophon closes the publication with the same double-ruled bar that opens it on the
 * cover. The site's code started from Brittany Chiang's open-source v4 (MIT); the credit
 * stays here and in LICENSE.
 */

const StyledFooter = styled.footer`
  padding: 0 ${MARGIN} 28px;
  font-family: ${SANS};

  .bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 9px 0;
    border-top: 1px solid ${T.rule};
    border-bottom: 1px solid ${T.rule};
    color: ${T.ink};
    ${cap};

    @media (max-width: 600px) {
      font-size: 9.5px;
      letter-spacing: 0.16em;
    }
  }

  .credit {
    max-width: 1280px;
    margin: 12px auto 0;
    color: ${T.muted};
    font-size: 12px;

    a {
      color: ${T.muted};
      text-decoration: underline;
      text-decoration-color: ${T.hair};
      text-underline-offset: 3px;
      &:hover {
        color: ${T.vermilionText};
      }
    }
  }
`;

const Footer = () => (
  <StyledFooter>
    <div className="bar">
      <span>Ziyi (Ellen) Zhou</span>
      <span>Montréal · Hiver 2026</span>
    </div>
    <p className="credit">
      <a href="https://github.com/EllenSyuu/EllenSyuu.github.io">Source on GitHub</a> · code first
      built on <a href="https://github.com/bchiang7/v4">Brittany Chiang’s v4</a> (MIT) · base
      map data from <a href="https://www.naturalearthdata.com/">Natural Earth</a>.
    </p>
  </StyledFooter>
);

export default Footer;
