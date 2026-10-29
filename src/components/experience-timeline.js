import React from 'react';
import styled from 'styled-components';

/*
 * Experience at a glance: every role on one ruled time axis (2020 → today), grouped into the
 * three strands the work is built on. Bars are drawn like dimension lines with end ticks;
 * the current role carries a warm wash. Dates are month-exact so the years can be counted.
 */

const START = 2020;
const END = 2027;
const TODAY = 2026 + 9.9 / 12; // late October 2026

// [year, month (1–12)] → fractional year at the start of that month.
const t = (y, m) => y + (m - 1) / 12;

const STRANDS = [
  {
    key: 'stats',
    title: 'Statistics & research',
    roles: [
      { label: 'Research Intern · HSUHK, global supply chain', from: t(2022, 5), to: t(2022, 9), span: 'May — Aug 2022' },
      { label: 'Research Assistant · Sau Po Centre on Ageing', from: t(2022, 5), to: t(2022, 8), span: 'May — Jul 2022' },
      { label: 'Summer Research Fellow · HKU Statistics', from: t(2022, 5), to: t(2022, 9), span: 'May — Aug 2022' },
      { label: 'Research Assistant · HKU Social Work', from: t(2022, 8), to: t(2023, 1), span: 'Aug — Dec 2022' },
      { label: 'Research Assistant, epidemiology · HKU', from: t(2023, 9), to: t(2024, 7), span: 'Sep 2023 — Jun 2024' },
      { label: 'M.Sc. thesis research · McGill', from: t(2024, 9), to: t(2026, 9), span: 'Sep 2024 — 2026' },
    ],
  },
  {
    key: 'edu',
    title: 'Education data & teaching',
    roles: [
      { label: 'Intern, education statistics · UNESCO UIS', from: t(2026, 9), to: TODAY, span: 'Sep 2026 — present', now: true },
      { label: 'Person in Charge, voluntary teaching · Fujia', from: t(2020, 9), to: t(2023, 9), span: 'Sep 2020 — Aug 2023' },
      { label: 'Science Student Peer Advisor · HKU', from: t(2022, 8), to: t(2024, 7), span: 'Aug 2022 — Jun 2024' },
      { label: 'Tutorials, MATH1851 & MATH1853 · HKU', from: t(2023, 2), to: t(2023, 5), span: 'Feb — Apr 2023' },
      { label: 'Mathematics tutor · IB & university', from: t(2022, 1), to: TODAY, span: '2022 — present' },
    ],
  },
  {
    key: 'code',
    title: 'Programming & quantitative',
    roles: [
      { label: 'Quantitative Research Intern · Kubid Research', from: t(2023, 6), to: t(2023, 9), span: 'Jun — Aug 2023' },
      { label: 'Open-source statistical software · R & Python', from: t(2026, 1), to: TODAY, span: '2026 — present' },
    ],
  },
];

const pct = v => `${(((Math.min(v, END) - START) / (END - START)) * 100).toFixed(2)}%`;

const StyledTimeline = styled.figure`
  margin: 0 0 64px;
  padding: 28px 30px 22px;
  background: var(--light-navy);
  box-shadow: 0 0 0 0.75px var(--ink);
  outline: 0.75px solid var(--hairline);
  outline-offset: -7px;

  @media (max-width: 600px) {
    padding: 22px 16px 18px;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 6px 20px;
    margin-bottom: 18px;
  }

  .kicker {
    margin: 0;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .hand {
    margin: 0;
    color: var(--green);
    font-family: var(--font-hand);
    font-size: 16px;
  }

  .row {
    display: grid;
    grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
    gap: 4px 18px;
    align-items: center;
    padding: 5px 0;

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
      padding: 7px 0;
    }
  }

  .label {
    color: var(--light-slate);
    font-size: 13.5px;
    line-height: 1.35;

    .span {
      display: block;
      color: var(--dark-slate);
      font-family: var(--font-serif);
      font-size: 14px;
      font-style: italic;
    }
  }

  .track {
    position: relative;
    height: 14px;
    background-image: repeating-linear-gradient(
      90deg,
      var(--hairline) 0 0.75px,
      transparent 0.75px calc(100% / ${END - START})
    );
  }

  .bar {
    position: absolute;
    top: 6px;
    height: 0.75px;
    min-width: 6px;
    background: var(--ink);
    transform-origin: left;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: -4px;
      width: 0.75px;
      height: 9px;
      background: var(--ink);
      transform: skewX(-35deg);
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }

    i {
      position: absolute;
      left: 0;
      right: 0;
      top: -4px;
      height: 9px;
      background: rgba(224, 160, 70, 0.32);
    }

    &.now i {
      background: rgba(207, 96, 43, 0.38);
    }
  }

  .strand {
    margin: 18px 0 4px;
    padding-top: 12px;
    border-top: 0.75px solid var(--hairline);
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: 20px;
    font-weight: 600;

    &:first-of-type {
      margin-top: 0;
      border-top: 0;
      padding-top: 0;
    }
  }

  .axis {
    position: relative;
    height: 22px;
    margin-top: 10px;
    border-top: 0.75px solid var(--ink);

    span {
      position: absolute;
      top: 4px;
      transform: translateX(-50%);
      color: var(--dark-slate);
      font-family: var(--font-serif);
      font-size: 13px;
      font-weight: 600;
    }
  }

  .axis-row {
    display: grid;
    grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
    gap: 18px;

    @media (max-width: 760px) {
      grid-template-columns: 1fr;

      > :first-child {
        display: none;
      }
    }
  }

  .today {
    position: absolute;
    top: -6px;
    bottom: -6px;
    width: 0;
    border-left: 0.75px dashed var(--maple);
  }

  figcaption {
    margin-top: 12px;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 15px;
    font-style: italic;
  }

  /* Bars draw out from their start date when the figure scrolls in. */
  @media (prefers-reduced-motion: no-preference) {
    .bar {
      transform: scaleX(0);
      transition: transform 1.2s cubic-bezier(0.55, 0.05, 0.25, 1);
    }
    &.is-marked .bar {
      transform: none;
    }
  }
`;

const ExperienceTimeline = () => {
  const years = Array.from({ length: END - START + 1 }, (_, i) => START + i);
  let n = 0;
  return (
    <StyledTimeline className="mark-trigger" aria-label="Timeline of roles from 2020 to today">
      <div className="head">
        <p className="kicker">Experience at a glance · 2020 — today</p>
        <p className="hand">each bar to the month</p>
      </div>

      {STRANDS.map(s => (
        <div key={s.key}>
          <p className="strand">{s.title}</p>
          {s.roles.map(r => {
            n += 1;
            return (
              <div className="row" key={r.label}>
                <div className="label">
                  {r.label}
                  <span className="span">{r.span}</span>
                </div>
                <div className="track" aria-hidden="true">
                  <span
                    className={`bar${r.now ? ' now' : ''}`}
                    style={{ left: pct(r.from), width: `calc(${pct(r.to)} - ${pct(r.from)})`, transitionDelay: `${0.05 * n}s` }}>
                    <i />
                  </span>
                  <span className="today" style={{ left: pct(TODAY) }} />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="axis-row" aria-hidden="true">
        <div />
        <div className="axis">
          {years.map(y => (
            <span key={y} style={{ left: pct(y) }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      <figcaption>
        Research and teaching roles ran alongside the B.Sc. and M.Sc.; the dashed line marks today.
      </figcaption>
    </StyledTimeline>
  );
};

export default ExperienceTimeline;
