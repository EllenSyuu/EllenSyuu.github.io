import React from 'react';
import { Link, withPrefix } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import styled, { keyframes } from 'styled-components';
import { showResume, socialMedia } from '@config';
import { Icon } from '@components/icons';

/*
 * The cover, laid out like the opening spread of a magazine feature: the name and the facts on
 * the left page, one photograph on the right, bled to the edge.
 */

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
`;

const StyledHero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
  width: 100vw;
  max-width: none;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 calc(50% - 50vw);
  padding: 0;
  background: var(--navy);
  color: var(--ink);

  .page {
    display: flex;
    flex-direction: column;
    padding: calc(var(--nav-height) + 8px) clamp(24px, 4.5vw, 72px) clamp(26px, 3vw, 44px)
      clamp(22px, 5.5vw, 80px);
    animation: ${rise} 0.9s 0.05s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .issue {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin: 0;
    padding: 9px 0;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    list-style: none;
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  h1 {
    margin: auto 0 0;
    padding-top: 40px;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(60px, 8.6vw, 132px);
    font-variation-settings: 'opsz' 40;
    line-height: 0.92;
    letter-spacing: -0.015em;
    color: var(--ink);
  }

  .also {
    margin: 18px 0 0;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--slate);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 24px;
    margin-top: clamp(24px, 2.6vw, 36px);
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 15px 22px;
    background: var(--ink);
    color: var(--navy);
    transition: background 0.3s ease;
    .arrow {
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    &:hover,
    &:focus-visible {
      background: var(--green);
      color: var(--navy);
      .arrow {
        transform: translateX(5px);
      }
    }
  }

  .secondary {
    padding-bottom: 6px;
    border-bottom: 1px solid var(--ink);
    color: var(--ink);
    &:hover,
    &:focus-visible {
      color: var(--green);
      border-color: var(--green);
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
      color: var(--ink);
      svg {
        width: 18px;
        height: 18px;
      }
      &:hover,
      &:focus-visible {
        color: var(--green);
      }
    }
  }

  .creds {
    display: flex;
    flex-wrap: wrap;
    gap: 14px clamp(20px, 3vw, 48px);
    margin: clamp(30px, 4vw, 56px) 0 0;
    padding-top: 18px;
    border-top: 1px solid var(--hairline);
    font-family: var(--font-sans);
    dt {
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--dark-slate);
    }
    dd {
      margin: 6px 0 0;
      font-size: 14px;
      color: var(--ink);
    }
  }

  .plate {
    position: relative;
    margin: 0;
    min-height: 100%;
    overflow: hidden;
    background: var(--dark-navy);

    .img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    figcaption {
      position: absolute;
      right: 18px;
      bottom: 16px;
      padding: 0;
      color: #fff;
      font-family: var(--font-sans);
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55);
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: 0;

    .page {
      padding-bottom: 30px;
    }
    h1 {
      margin-top: 0;
      font-size: clamp(56px, 17vw, 110px);
    }
    .issue {
      font-size: 9px;
      letter-spacing: 0.14em;
      li:first-child {
        display: none;
      }
    }
    .plate {
      min-height: 0;
      aspect-ratio: 4 / 4.4;
    }
  }
`;

const Hero = () => (
  <StyledHero id="top">
    <div className="page">
      <ul className="issue" aria-label="Role and city">
        <li>N° 01</li>
        <li>Statistician · Data engineer</li>
        <li>Montréal</li>
      </ul>

      <h1>
        Ziyi
        <br />
        Zhou
      </h1>
      <p className="also">Also Ellen</p>

      <div className="actions">
        <Link className="primary" to="/#projects">
          Selected work <span className="arrow">→</span>
        </Link>
        {showResume ? (
          <a className="secondary" href={withPrefix('/resume.pdf')} target="_blank" rel="noreferrer">
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
    </div>

    <figure className="plate">
      <StaticImage
        className="img"
        src="../../images/photos/cover.jpg"
        alt="Ziyi (Ellen) Zhou in a graduation gown at a whiteboard covered in copula formulas, looking back over her shoulder"
        loading="eager"
        quality={88}
        placeholder="blurred"
        objectFit="cover"
        objectPosition="50% 30%"
        formats={['AUTO', 'WEBP', 'AVIF']}
      />
      <figcaption>Archimax copulas, on the board</figcaption>
    </figure>
  </StyledHero>
);

export default Hero;
