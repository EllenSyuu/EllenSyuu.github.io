import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { COVER } from '@utils/cover-scene';

/*
 * The editorial system below the cover. Everything here is taken from the cover itself:
 * its paper and ink, its vermilion, gold and river blues, its Bodoni masthead and the
 * double-ruled issue bar, and its page margins — so the sections read as pages of the
 * same publication rather than boxes stacked under it.
 */

export const T = {
  paper: '#ffffff', // the pages are white; the cream belongs to the cover
  paperDeep: '#f2f5f7', // a cool off-white for rhythm, from the cover's haze
  land: '#f3f4f2',
  ink: COVER.navy, // #14213a
  text: '#2b3852',
  muted: '#5d6880',
  hair: 'rgba(20, 33, 58, 0.2)',
  rule: COVER.navy,
  vermilion: COVER.vermilion, // #c8431f — rules, marks, data
  vermilionText: '#a3331a', // the same red, deep enough for small text (WCAG AA)
  gold: COVER.gold, // #e0ad4a
  river: COVER.river, // #3f6f96, the water
  deep: COVER.back, // #456a8e, the far towers
  steel: COVER.hill, // #7d9cb4, Mont Royal
  pale: COVER.haze, // #bccbd5, the haze
  mist: '#e4ebf0',
  water: '#cddbe5',
  dusk: '#f2c79c', // the cover's sky at the horizon
  rose: '#e8a184',
};

export const DISPLAY = '"Bodoni Moda Variable", "Bodoni Moda", Didot, "Bodoni MT", serif';
export const SANS =
  '"Inter Variable", "Inter Fallback", Inter, -apple-system, system-ui, "PingFang SC", sans-serif';

/* The page margin of the cover, so every column lines up with the masthead. */
export const MARGIN = 'clamp(22px, 5.5vw, 80px)';

export const cap = `
  font-family: ${SANS};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
`;

/* A full-bleed page. `tone` lets a section sit on the deeper paper for rhythm. */
export const Page = styled.section`
  && {
    position: relative;
    width: 100vw;
    max-width: none;
    margin: 0 calc(50% - 50vw);
    z-index: 1;
    padding: clamp(88px, 10vw, 150px) ${MARGIN} 0;
    background: transparent;
    color: ${T.text};
  }

  .wrap {
    max-width: 1280px;
    margin: 0 auto;
  }

  p {
    margin: 0 0 1em;
  }

  a.inline {
    color: ${T.ink};
    text-decoration: underline;
    text-decoration-color: ${T.vermilion};
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: ${T.vermilion};
    }
  }
`;

const StyledHead = styled.header`
  margin-bottom: clamp(44px, 5vw, 72px);

  .bar {
    display: flex;
    justify-content: space-between;
    gap: 16px;
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

  .kicker {
    margin: 0;
    color: ${T.vermilionText};
    ${cap};
    span {
      color: ${T.muted};
    }
  }
  &.head-open .row {
    display: block;
    margin-top: 18px;
    .standfirst {
      margin-top: 22px;
    }
  }
  &.head-split .row {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    .standfirst {
      justify-self: end;
    }
  }

  .row {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 24px clamp(32px, 5vw, 80px);
    align-items: end;
    margin-top: clamp(28px, 3.4vw, 48px);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    margin: 0;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: clamp(42px, 6vw, 88px);
    font-weight: 500;
    font-variation-settings: 'opsz' 60;
    line-height: 0.98;
    letter-spacing: -0.012em;
  }

  .standfirst {
    max-width: 440px;
    margin: 0 0 6px;
    color: ${T.text};
    font-family: ${DISPLAY};
    font-size: clamp(18px, 1.55vw, 21px);
    font-weight: 400;
    font-variation-settings: 'opsz' 12;
    line-height: 1.45;
  }
`;

export const SectionHead = ({ label, aside, title, standfirst, as = 'h2', layout = 'bar' }) => {
  const H = as;
  return (
    <StyledHead className={`head-${layout}`}>
      {layout === 'bar' ? (
        <div className="bar">
          <span>{label}</span>
          {aside && <span>{aside}</span>}
        </div>
      ) : (
        <p className="kicker">
          {label}
          {aside && <span> · {aside}</span>}
        </p>
      )}
      <div className="row">
        <H>{title}</H>
        {standfirst && <p className="standfirst">{standfirst}</p>}
      </div>
    </StyledHead>
  );
};

/* Figures: a numbered caption in the manner of a journal, with its source. */
const StyledFigure = styled.figure`
  margin: 0;

  .fig-head {
    margin-bottom: 16px;
    padding-top: 12px;
    border-top: 3px solid ${T.ink};
  }
  .fig-title {
    margin: 0;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 16px;
    font-weight: 600;
    line-height: 1.35;
  }
  .fig-sub {
    margin: 4px 0 0;
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 14px;
    line-height: 1.45;
  }

  figcaption {
    max-width: 760px;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid ${T.hair};
    color: ${T.muted};
    font-family: ${SANS};
    font-size: 13px;
    line-height: 1.55;

    b {
      margin-right: 8px;
      color: ${T.ink};
      font-weight: 600;
    }

    .src {
      display: block;
      margin-top: 4px;
      font-size: 12px;
    }
  }
`;

export const Figure = ({ n, title, subtitle, caption, source, children, className, label }) => (
  <StyledFigure className={className} aria-label={label}>
    {title && (
      <header className="fig-head">
        <p className="fig-title">{title}</p>
        {subtitle && <p className="fig-sub">{subtitle}</p>}
      </header>
    )}
    {children}
    {(caption || source) && (
      <figcaption>
        {n && <b>Figure {n}.</b>}
        {caption}
        {source && <span className="src">{source}</span>}
      </figcaption>
    )}
  </StyledFigure>
);

/* Width of an element, for charts that are drawn at their real size (so text stays legible
   on a phone). Server render uses `fallback`. */
export const useWidth = (fallback = 720) => {
  const ref = useRef(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const set = () => setW(Math.max(260, Math.round(el.getBoundingClientRect().width)));
    set();
    if (!('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

/* Shared chart text styles, used inside SVG. */
export const ChartSvg = styled.svg`
  && {
    width: ${({ width }) => (typeof width === 'number' ? `${width}px` : 'auto')};
    height: ${({ height }) => (typeof height === 'number' ? `${height}px` : 'auto')};
    max-width: 100%;
  }
  display: block;
  overflow: visible;
  font-family: ${SANS};
  font-variant-numeric: tabular-nums;

  .tick {
    fill: ${T.muted};
    font-size: 11px;
  }
  .axis-title {
    fill: ${T.muted};
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  .label {
    fill: ${T.ink};
    font-size: 12px;
  }
  .label-strong {
    fill: ${T.ink};
    font-size: 12px;
    font-weight: 600;
  }
  .note {
    fill: ${T.muted};
    font-size: 11px;
  }
  .serif {
    font-family: ${DISPLAY};
  }
  .grid {
    stroke: ${T.hair};
    stroke-width: 1;
    shape-rendering: crispEdges;
  }
  .axis {
    stroke: ${T.ink};
    stroke-width: 1;
    shape-rendering: crispEdges;
  }
`;

export const linear = ([d0, d1], [r0, r1]) => v => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
export const logScale = ([d0, d1], [r0, r1]) => v =>
  r0 + ((Math.log(v) - Math.log(d0)) / (Math.log(d1) - Math.log(d0))) * (r1 - r0);
export const f1 = n => n.toFixed(1);
