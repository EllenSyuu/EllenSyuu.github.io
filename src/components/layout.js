import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Nav, Social, Email, Footer, Ambient, ChapterMap } from '@components';
import FallingLeaves from '@components/falling-leaves';
import CursorTrail from '@components/cursor-trail';
import BirdFlyover from '@components/bird-flyover';
import useMarks from '@components/mark-observer';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/' || location.pathname === withPrefix('/');
  // The v4 logo intro screen is removed; content renders straight away.
  const isLoading = false;

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useMarks([location.pathname]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading]);

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          {
            <StyledContent>
              <Ambient />
              <FallingLeaves />
              <CursorTrail />
              <BirdFlyover />
              <a className="skip-to-content" href="#content">
                Skip to Content
              </a>
              <Nav isHome={isHome} />
              {isHome ? <ChapterMap /> : <Social isHome={isHome} />}
              <Email isHome={isHome} />

              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>
          }
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
