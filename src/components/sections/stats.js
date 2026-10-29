import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

// "By the numbers" strip under the hero. Each figure counts up the first time it is seen.
const STATS = [
  { value: 5, suffix: '', label: 'working languages' },
  { value: 6, suffix: '', label: 'research and data roles, 2022–24, before the M.Sc.' },
  { value: 12, suffix: '', label: 'SDG 4 indicators tracked across releases' },
  { value: 88, suffix: ' yrs', label: 'of precipitation records modelled (1930–2017)' },
  { value: 97, suffix: '%', label: 'test coverage on the SDG 4 tracker' },
];

const StyledStats = styled.section`
  padding: 0 0 40px;

  ul {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-top: 1px solid var(--lightest-navy);
    border-bottom: 1px solid var(--lightest-navy);

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  li {
    padding: 28px 20px 26px;
    border-left: 1px solid var(--lightest-navy);

    &:first-child {
      border-left: 0;
      padding-left: 0;
    }

    @media (max-width: 900px) {
      padding-left: 0;
      border-left: 0;
      border-top: 1px solid var(--lightest-navy);

      &:nth-child(-n + 2) {
        border-top: 0;
      }
    }
  }

  .num {
    display: block;
    color: var(--lightest-slate);
    font-family: var(--font-display);
    font-size: clamp(34px, 4vw, 46px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums lining-nums;

    .suffix {
      color: var(--green);
      font-size: 0.55em;
      font-style: italic;
      margin-left: 2px;
    }
  }

  .label {
    display: block;
    margin-top: 10px;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.5;
  }
`;

const CountUp = ({ to, run }) => {
  const [n, setN] = useState(run ? 0 : to);

  useEffect(() => {
    if (!run) {
      setN(to);
      return;
    }
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);

  return <>{n}</>;
};

const Stats = () => {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // 'static' (server render / reduced motion) → 'armed' (waiting to be seen) → 'run'
  const [mode, setMode] = useState('static');

  useEffect(() => {
    if (prefersReducedMotion || !ref.current || !('IntersectionObserver' in window)) {
      return;
    }
    setMode('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode('run');
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  const show = s => {
    if (mode === 'armed') return 0;
    if (mode === 'run') return <CountUp to={s.value} run />;
    return s.value;
  };

  return (
    <StyledStats ref={ref} aria-label="By the numbers">
      <ul>
        {STATS.map(s => (
          <li key={s.label}>
            <span className="num">
              {show(s)}
              <span className="suffix">{s.suffix}</span>
            </span>
            <span className="label">{s.label}</span>
          </li>
        ))}
      </ul>
    </StyledStats>
  );
};

export default Stats;
