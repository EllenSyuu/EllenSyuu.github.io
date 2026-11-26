import React, { useEffect, useMemo, useRef } from 'react';
import riverLife from '@utils/river-life';
import { Link, withPrefix } from 'gatsby';
import styled, { keyframes } from 'styled-components';
import { showResume, socialMedia } from '@config';
import { Icon } from '@components/icons';
import { COVER, COVER_LAYERS, coverLayers } from '@utils/cover-scene';

/*
 * The cover, set like a magazine: an issue bar, the name as a masthead across the page, and one
 * drawing — Montréal from the river at dusk — running the full width beneath it.
 */

const DISPLAY = '"Bodoni Moda Variable", "Bodoni Moda", Didot, "Cormorant Garamond", serif';

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`;

const drift = keyframes`
  from { transform: translateX(-26px); }
  to   { transform: translateX(26px); }
`;
const glide = keyframes`
  0%   { transform: translate(-30px, 8px); }
  50%  { transform: translate(40px, -10px); }
  100% { transform: translate(110px, 4px); }
`;
const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
`;
const sail = keyframes`
  from { transform: translateX(-140px); }
  to   { transform: translateX(300px); }
`;

const StyledHero = styled.section`
  position: relative;
  width: 100vw;
  max-width: none;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 calc(50% - 50vw);
  padding: calc(var(--nav-height) + 4px) clamp(22px, 5.5vw, 80px) 24vw;
  overflow: hidden;
  isolation: isolate;
  background: ${COVER.cream};
  color: ${COVER.navy};

  .scene {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    height: max(43.06vw, 300px);
    animation: ${rise} 1.4s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    /* depth layers: still on the cover; the page transition (index.js) sets --cam and --p */
    .layer {
      position: absolute;
      inset: 0;
      transform: translate3d(0, calc(var(--cam, 0px) * var(--d) * -1), 0);
      will-change: transform;
    }
    .layer-sky {
      --d: 0.32;
      opacity: var(--fade-far, 1);
    }
    .layer-far {
      --d: 0.48;
      opacity: var(--fade-far, 1);
    }
    .layer-back {
      --d: 0.62;
      opacity: var(--fade-mid, 1);
    }
    .layer-city {
      --d: 0.72;
      opacity: var(--fade-mid, 1);
    }
    .layer-water {
      --d: 0.76;
      opacity: var(--fade-water, 1);
    }
    /* the river continues below the drawing, lightening into the paper of the next page */
    .cv-haze {
      opacity: var(--haze, 0);
    }
    .cv-bridge {
      opacity: var(--fade-mid, 1);
    }
    .deep:after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, ${COVER.haze} 0%, #d6d8d2 40%, ${COVER.cream} 90%);
      opacity: var(--haze, 0);
    }
    .deep {
      position: absolute;
      top: calc(100% - 1px);
      left: 0;
      right: 0;
      height: 110svh;
      background: linear-gradient(
        180deg,
        ${COVER.ink} 0%,
        ${COVER.river} 12%,
        #7d9cb4 34%,
        #bccbd5 54%,
        #e4e2da 74%,
        ${COVER.cream} 90%
      );
    }
    .cv-cloud {
      animation: ${drift} 16s ease-in-out infinite alternate;
    }
    .cv-gull {
      animation: ${glide} 22s ease-in-out infinite alternate;
    }
    .cv-tw {
      animation: ${twinkle} 6s ease-in-out infinite;
    }
    .cv-water {
      animation: ${drift} 9s ease-in-out infinite alternate;
    }
    .cv-ferry {
      animation: ${sail} 70s linear infinite alternate;
    }
    /* when the river is driven by utils/river-life.js, it replaces these loops */
    &.river-live .cv-water,
    &.river-live .cv-ferry {
      animation: none;
    }
    @media (prefers-reduced-motion: reduce) {
      animation: none;
      .cv-cloud,
      .cv-gull,
      .cv-tw,
      .cv-water,
      .cv-ferry {
        animation: none;
      }
    }
  }

  .issue {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin: 0;
    padding: 9px 0;
    border-top: 1px solid ${COVER.navy};
    border-bottom: 1px solid ${COVER.navy};
    list-style: none;
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    white-space: nowrap;

    @media (max-width: 600px) {
      font-size: 9px;
      letter-spacing: 0.14em;
      li:first-child {
        display: none;
      }
    }
  }

  h1 {
    margin: clamp(14px, 1.8vw, 28px) 0 0 -0.03em;
    font-family: ${DISPLAY};
    font-weight: 600;
    font-size: min(15.6vw, 236px);
    font-variation-settings: 'opsz' 22;
    line-height: 0.86;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    white-space: nowrap;
    color: ${COVER.navy};
    animation: ${rise} 1s 0.05s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  }

  .copy {
    max-width: 520px;
    margin-top: clamp(20px, 2vw, 28px);
    animation: ${rise} 1s 0.25s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  }

  .tagline {
    margin: 0;
    font-family: ${DISPLAY};
    font-weight: 500;
    font-size: clamp(24px, 2.2vw, 31px);
    font-variation-settings: 'opsz' 18;
    line-height: 1.15;
    color: ${COVER.vermilion};
  }

  .positioning {
    max-width: 460px;
    margin: 14px 0 0;
    font-family: ${DISPLAY};
    font-weight: 500;
    font-size: clamp(17px, 1.4vw, 20px);
    font-variation-settings: 'opsz' 10;
    line-height: 1.5;
    color: ${COVER.navy};
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 24px;
    margin-top: 0;
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: ${COVER.navy};
    color: ${COVER.cream};
    transition: background 0.3s ease;

    .arrow {
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    &:hover,
    &:focus-visible {
      background: ${COVER.vermilion};
      color: ${COVER.cream};
      .arrow {
        transform: translateX(5px);
      }
    }
  }

  .secondary {
    padding-bottom: 6px;
    border-bottom: 1px solid ${COVER.navy};
    color: ${COVER.navy};
    &:hover,
    &:focus-visible {
      color: ${COVER.vermilion};
      border-color: ${COVER.vermilion};
    }
  }

  .quick {
    display: flex;
    align-items: center;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      color: ${COVER.navy};
      transition: color 0.25s ease;
      svg {
        width: 18px;
        height: 18px;
      }
      &:hover,
      &:focus-visible {
        color: ${COVER.vermilion};
      }
    }
  }

  .issue,
  h1,
  .copy,
  .creds {
    opacity: var(--text-o, 1);
    translate: 0 var(--text-y, 0px);
  }

  .creds {
    position: absolute;
    left: clamp(22px, 5.5vw, 80px);
    right: clamp(22px, 5.5vw, 80px);
    bottom: clamp(14px, 2.2vw, 34px);
    display: flex;
    gap: clamp(20px, 4.4vw, 64px);
    margin: 0;
    color: ${COVER.cream};
    font-family: var(--font-sans);

    dt {
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      opacity: 0.72;
    }
    dd {
      margin: 6px 0 0;
      font-size: 14px;
    }
  }

  @media (max-width: 900px) {
    padding-bottom: max(47vw, 320px);

    .creds {
      position: static;
      flex-wrap: wrap;
      gap: 14px 28px;
      margin-top: 28px;
      color: ${COVER.navy};
      dd {
        font-size: 13.5px;
      }
    }
  }
`;

const Hero = () => {
  const layers = useMemo(() => coverLayers(), []);
  const sceneRef = useRef(null);
  useEffect(() => {
    const scene = sceneRef.current;
    const pin = scene && scene.closest('.pin');
    return riverLife(scene, pin ? pin.parentElement : null);
  }, []);

  return (
    <StyledHero id="top">
      <div className="scene" aria-hidden="true" ref={sceneRef}>
        {COVER_LAYERS.map(k => (
          <div key={k} className={`layer layer-${k}`}>
            <svg
              viewBox="0 280 1440 620"
              preserveAspectRatio="xMaxYMax slice"
              dangerouslySetInnerHTML={{ __html: layers[k] }}
            />
            {k === 'water' && <div className="deep" />}
          </div>
        ))}
      </div>

      <ul className="issue" aria-label="Role and city">
        <li>N° 01</li>
        <li>Statistician · Data engineer</li>
        <li>Montréal · Hiver 2026</li>
      </ul>

      <h1 aria-label="Ziyi (Ellen) Zhou">
        <span aria-hidden="true">Ziyi Zhou</span>
      </h1>

      <div className="copy">
        <div className="actions">
          <Link className="primary" to="/#projects">
            See selected work <span className="arrow">→</span>
          </Link>
          {showResume ? (
            <a
              className="secondary"
              href={withPrefix('/resume.pdf')}
              target="_blank"
              rel="noreferrer">
              Résumé ↗
            </a>
          ) : (
            <Link className="secondary" to="/#jobs">
              Experience
            </Link>
          )}
          <ul className="quick" aria-label="Find me">
            {socialMedia.map(s => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name === 'Linkedin' ? 'LinkedIn' : s.name}
                  title={s.name === 'Linkedin' ? 'LinkedIn' : s.name}>
                  <Icon name={s.name} />
                </a>
              </li>
            ))}
            <li>
              <Link to="/#contact" aria-label="Write to me" title="Write to me">
                <Icon name="Mail" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <dl className="creds">
        <div>
          <dt>Now</dt>
          <dd>UNESCO Institute for Statistics</dd>
        </div>
        <div>
          <dt>M.Sc.</dt>
          <dd>Statistics, McGill</dd>
        </div>
        <div>
          <dt>B.Sc.</dt>
          <dd>Statistics, HKU</dd>
        </div>
      </dl>
    </StyledHero>
  );
};

export default Hero;
