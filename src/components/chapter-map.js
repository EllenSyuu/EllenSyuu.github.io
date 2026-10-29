import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { navLinks } from '@config';

/*
 * Chapter map — a fixed index on the left of the home page that shows the storyline
 * (About → What I do → Work → Experience → Impact → Contact) and highlights the chapter
 * currently on screen. A thin rail fills as the reader moves through the page.
 */

const StyledMap = styled.nav`
  position: fixed;
  top: 50%;
  left: 34px;
  z-index: 10;
  transform: translateY(-50%);

  @media (max-width: 1279px) {
    display: none;
  }

  ol {
    position: relative;
    margin: 0;
    padding: 0 0 0 18px;
    list-style: none;
  }

  /* Rail and its fill. */
  ol:before,
  .fill {
    content: '';
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 0;
    width: 1px;
    background: var(--lightest-navy);
  }

  .fill {
    background: var(--green);
    transform-origin: top;
    transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  li {
    position: relative;
    margin: 0 0 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: color 0.25s ease;

    &:before {
      content: '';
      position: absolute;
      left: -21px;
      top: 6px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--navy);
      border: 1px solid var(--lightest-navy);
      transition: all 0.25s ease;
    }

    .num {
      color: inherit;
      opacity: 0.8;
    }

    .label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: max-width 0.35s ease;
    }
  }

  &:hover a .label,
  a.active .label {
    max-width: 120px;
  }

  a:hover,
  a:focus-visible,
  a.active {
    color: var(--green);
  }

  a.done:before,
  a.active:before {
    background: var(--green);
    border-color: var(--green);
  }

  a.active:before {
    box-shadow: 0 0 0 4px var(--green-tint);
  }
`;

const chapters = navLinks
  .filter(l => l.url.startsWith('/#'))
  .map((l, i) => ({ id: l.url.slice(2), name: l.name, num: `0${i + 1}` }));

const ChapterMap = () => {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // The map is only shown on wide screens (see CSS); don't track scroll elsewhere.
    if (!window.matchMedia('(min-width: 1280px)').matches) return undefined;
    const sections = chapters.map(c => document.getElementById(c.id)).filter(Boolean);
    if (!sections.length) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = window.innerHeight * 0.35;
      let idx = -1;
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= probe) idx = i;
      });
      setActive(idx);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <StyledMap aria-label="Page chapters">
      <ol>
        <span className="fill" style={{ transform: `scaleY(${progress})` }} aria-hidden="true" />
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={i === active ? 'active' : i < active ? 'done' : ''}
              aria-current={i === active ? 'true' : undefined}>
              <span className="num">{c.num}</span>
              <span className="label">{c.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </StyledMap>
  );
};

export default ChapterMap;
