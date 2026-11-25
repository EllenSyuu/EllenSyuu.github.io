import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { sceneA } from './scene-a';
import { sceneB } from './scene-b';
import { sceneC } from './scene-c';

/*
 * The background art layer: one continuous drawing behind the whole page below the cover,
 * independent of the sections. It is measured against the content (where each heading,
 * figure and list actually sits) and redrawn when the page reflows, so shapes can run
 * across chapter boundaries and still land where the reading needs calm.
 */

export const VARIANT = (process.env.GATSBY_VARIANT || 'A').toUpperCase();
const SCENES = { A: sceneA, B: sceneB, C: sceneC };

const ANCHORS = {
  about: '#about',
  aboutHead: '#about header',
  aboutGrid: '#about header + div',
  jobs: '#jobs',
  jobsHead: '#jobs header',
  jobsChart: '#jobs figure',
  jobsList: '#jobs ol',
  focus: '#focus',
  focusHead: '#focus header',
  focusList: '#focus ol',
  projects: '#projects',
  projectsHead: '#projects header',
  more: '#more-projects',
  impact: '#impact',
  impactHead: '#impact header',
  contact: '#contact',
  contactHead: '#contact header',
  footer: '#content > footer',
};

const StyledLayer = styled.div`
  position: absolute;
  left: calc(50% - 50vw);
  width: 100vw;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* the cover's paper grain, carried over the whole drawing */
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.35;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC45JyBudW1PY3RhdmVzPScyJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPScwIDAgMCAwIDAuNDIgMCAwIDAgMCAwLjMgMCAwIDAgMCAwLjIgMCAwIDAgMC4wOSAwJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI24pJy8+PC9zdmc+");
  }
`;

const measure = () => {
  const hero = document.getElementById('top');
  if (!hero) return null;
  const base = hero.getBoundingClientRect().bottom + window.scrollY;
  const main = document.querySelector('main');
  const mainTop = main ? main.getBoundingClientRect().top + window.scrollY : 0;
  const W = document.documentElement.clientWidth;
  const H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - base;
  const a = {};
  Object.entries(ANCHORS).forEach(([k, sel]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    a[k] = { top: r.top + window.scrollY - base, bottom: r.bottom + window.scrollY - base };
  });
  a.text = [
    ...document.querySelectorAll(
      '#about header, #about figure, #about .col, #jobs header, #jobs figure, #jobs ol > li, #focus header, #focus ol > li, #projects header, #projects article > *, #projects article [class*="Body"] > *, #more-projects h2, #more-projects [role="group"], #impact header, #impact ol, #impact [class*="Ledger"], #contact header, #contact form, #contact figure, #contact aside',
    ),
  ].map(el => {
    const r = el.getBoundingClientRect();
    return [Math.round(r.left), Math.round(r.top + window.scrollY - base), Math.round(r.width), Math.round(r.height)];
  });
  a.articles = [...document.querySelectorAll('#projects article')].map(el => {
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY - base, bottom: r.bottom + window.scrollY - base };
  });
  return { W, H: Math.round(H), top: Math.round(base - mainTop), a, hero: hero.getBoundingClientRect().height };
};

const ArtLayer = () => {
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    let raf = 0;
    let last = '';
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const g = measure();
        if (!g) return;
        const key = JSON.stringify([g.W, g.H, g.a]);
        if (key !== last) {
          last = key;
          setGeo(g);
        }
      });
    };
    update();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(update) : null;
    if (ro) ro.observe(document.body);
    window.addEventListener('load', update);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('load', update);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!geo) return null;
  const draw = SCENES[VARIANT] || sceneA;
  // The layer stops short of the page end by the grain-free remainder; it is sized to the
  // measured content, so it never adds height of its own.
  const H = geo.H;
  return (
    <StyledLayer aria-hidden="true" style={{ top: geo.top, height: H }}>
      <svg
        viewBox={`0 0 ${geo.W} ${H}`}
        preserveAspectRatio="none"
        dangerouslySetInnerHTML={{ __html: draw({ ...geo, H }) }}
      />
    </StyledLayer>
  );
};

export default ArtLayer;
