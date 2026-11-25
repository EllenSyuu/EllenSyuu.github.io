import React from 'react';
import styled from 'styled-components';
import { Figure, T, SANS, cap } from '@components/editorial';

/*
 * Experience at a glance: every role on one time axis (2020 → today), grouped into three
 * strands. A plain range chart — hairline years, one ink rule per role, vermilion for the
 * roles still running. Dates are month-exact so the years can be counted.
 */

const START = 2020;
const END = 2027;
const TODAY = 2026 + 10.7 / 12; // late November 2026

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
      { label: 'M.Sc. thesis research · McGill', from: t(2024, 9), to: t(2026, 8), span: 'Sep 2024 — Jul 2026' },
    ],
  },
  {
    key: 'edu',
    title: 'Education data & teaching',
    roles: [
      { label: 'Data Innovation & AI Intern · UNESCO UIS', from: t(2026, 9), to: TODAY, span: 'Sep 2026 — present', now: true },
      { label: 'Person in Charge, voluntary teaching · Fujia', from: t(2020, 9), to: t(2023, 9), span: 'Sep 2020 — Aug 2023' },
      { label: 'Science Student Peer Advisor · HKU', from: t(2022, 8), to: t(2024, 7), span: 'Aug 2022 — Jun 2024' },
      { label: 'Head TA, MATH1851 & MATH1853 · HKU', from: t(2023, 2), to: t(2023, 5), span: 'Feb — Apr 2023' },
      { label: 'Teaching Assistant · McGill', from: t(2025, 1), to: t(2026, 5), span: 'Jan 2025 — Apr 2026' },
      { label: 'Math tutor · QEA', from: t(2025, 12), to: t(2026, 7), span: 'Dec 2025 — Jun 2026' },
      { label: 'Math & statistics tutor · Sinica', from: t(2026, 1), to: TODAY, span: 'Jan 2026 — present' },
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
const YEARS = Array.from({ length: END - START + 1 }, (_, k) => START + k);

const StyledChart = styled.div`
  font-family: ${SANS};

  .strand {
    display: grid;
    grid-template-columns: minmax(220px, 4fr) minmax(0, 8fr);
    column-gap: 24px;
    padding-top: 14px;
    border-top: 1px solid ${T.rule};
    & + .strand {
      margin-top: 22px;
    }
  }
  .strand h3 {
    grid-column: 1 / -1;
    margin: 0 0 8px;
    color: ${T.ink};
    ${cap};
  }
  .row {
    display: contents;
  }
  .label {
    padding: 7px 0;
    border-bottom: 1px solid ${T.hair};
    color: ${T.ink};
    font-size: 13.5px;
    line-height: 1.35;
  }
  .label small {
    display: block;
    color: ${T.muted};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .track {
    position: relative;
    background-image: linear-gradient(to right, rgba(20, 33, 58, 0.1) 1px, transparent 1px);
    background-size: calc(100% / ${END - START}) 100%;
  }
  .bar {
    position: absolute;
    top: 50%;
    height: 5px;
    margin-top: -2.5px;
    background: ${T.ink};
  }
  .bar.now {
    background: ${T.vermilion};
  }
  .today {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px dashed ${T.vermilion};
  }
  .axis {
    display: grid;
    grid-template-columns: minmax(220px, 4fr) minmax(0, 8fr);
    column-gap: 24px;
  }
  .axis .years {
    position: relative;
    height: 26px;
  }
  .axis span {
    position: absolute;
    top: 8px;
    transform: translateX(-50%);
    color: ${T.muted};
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .axis span:first-child {
    transform: none;
  }
  .axis span:last-child {
    transform: translateX(-100%);
  }

  @media (max-width: 700px) {
    .strand,
    .axis {
      grid-template-columns: 1fr;
    }
    .label {
      border-bottom: 0;
      padding-bottom: 2px;
    }
    .track {
      height: 14px;
      margin-bottom: 6px;
    }
    .axis > div:first-child {
      display: none;
    }
  }
`;

const ExperienceTimeline = () => (
  <Figure
    n={1}
    label="Timeline of roles from 2020 to today"
    caption="Every role since 2020, to the month. Research and teaching roles ran alongside the B.Sc. and M.Sc.; vermilion marks roles that continue today, and the dashed line marks today.">
    <StyledChart>
      {STRANDS.map(s => (
        <div className="strand" key={s.key}>
          <h3>{s.title}</h3>
          {s.roles.map(r => {
            const [role, org] = r.label.split(' · ');
            return (
              <div className="row" key={r.label}>
                <div className="label">
                  {role}
                  {org ? <span> · {org}</span> : null}
                  <small>{r.span.replace(' — ', '–')}</small>
                </div>
                <div className="track" aria-hidden="true">
                  <span
                    className={`bar${r.now || r.to >= TODAY ? ' now' : ''}`}
                    style={{ left: pct(r.from), width: `calc(${pct(r.to)} - ${pct(r.from)})` }}
                  />
                  <span className="today" style={{ left: pct(TODAY) }} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="axis" aria-hidden="true">
        <div />
        <div className="years">
          {YEARS.map(y => (
            <span key={y} style={{ left: pct(y) }}>
              {y}
            </span>
          ))}
        </div>
      </div>
    </StyledChart>
  </Figure>
);

export default ExperienceTimeline;
