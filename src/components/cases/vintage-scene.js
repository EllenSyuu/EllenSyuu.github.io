import React, { useEffect, useRef, useState } from 'react';
import { isFrost, FROST_LIGHT } from '@utils/season';
import styled from 'styled-components';
import { PrintVintage } from './print-art';
import {
  Scene,
  useScene,
  useCountUp,
  drawCss,
  drawClass,
  delay as d,
  INK,
  GRAPH,
  FAINT,
  PAPER,
  FACE,
  ORANGE,
  AMBER,
  RUST,
  SERIF,
  HAND,
} from './kit';

/*
 * SDG 4 Data Revision Tracker as an archivist's drafting plate. Four release sheets lie
 * stacked on the desk, each with a hand-lettered index tab; the front sheet carries the
 * chart. Release curves (countries with a value, by reference year, indicator 4.c.1) are
 * inked one after another — earlier releases in graphite, the selected one in warm ink —
 * and a dimension line on reference year 2021 measures how far later releases revised it.
 * Data: the repository's deterministic synthetic generator (seed 42) — no real data.
 */

const RELEASES = [
  { year: 2022, values: [42, 37, 36, 38, 40, 34, 39, 30, 38, 30, 39, 39, 25, 16] },
  { year: 2023, values: [42, 37, 36, 37, 38, 34, 38, 29, 37, 29, 38, 37, 33, 32, 13] },
  { year: 2024, values: [42, 36, 34, 36, 37, 34, 38, 29, 36, 28, 38, 37, 34, 41, 25, 10] },
  { year: 2025, values: [41, 35, 34, 36, 37, 31, 36, 29, 36, 27, 38, 36, 33, 44, 32, 22, 10] },
];
const AT2021 = [16, 32, 41, 44];

// Plot area on the front sheet.
const X0 = 104;
const X1 = 462;
const Y0 = 398;
const Y1 = 178;
const px = i => X0 + (i / 16) * (X1 - X0);
const py = v => Y0 - (v / 48) * (Y0 - Y1);
const curve = vals => vals.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');

// Front sheet and the stack behind it.
const SX = 56;
const SY = 104;
const SW = 470;
const SH = 344;
const OFF = [14, -11];

const Art = styled.svg`
  ${drawCss}
  .curve {
    transition: stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, stroke-width 0.6s ease,
      stroke 0.6s ease;
  }
  .dot {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 1s, opacity 0.4s, fill 0.4s;
  }
  .tab {
    transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .tabwash {
    transition: opacity 0.6s ease;
  }
  .dim {
    transition: d 0.9s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.5s ease;
  }
  .dimtext {
    transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.5s ease;
  }
`;

const Bars = ({ sel, run }) => {
  const shown = useCountUp(AT2021[sel], { decimals: 0, duration: 900, run });
  return (
    <div>
      <span className="big">
        {shown}
        <small style={{ marginLeft: 10, fontFamily: HAND, fontSize: 15, fontWeight: 400, color: GRAPH }}>
          countries, {RELEASES[sel].year} release
        </small>
      </span>
      <svg viewBox="0 -16 280 128" width="100%" aria-hidden="true" style={{ marginTop: 8 }}>
        <defs>
          <pattern id="sv-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.55" />
          </pattern>
        </defs>
        <line x1="4" x2="276" y1="92" y2="92" stroke={INK} strokeWidth="0.8" />
        {AT2021.map((v, i) => {
          const h = (v / 48) * 84;
          const on = i <= sel;
          const cur = i === sel;
          return (
            <g key={v} transform={`translate(${16 + i * 66} 0)`} style={{ opacity: cur ? 1 : on ? 0.75 : 0.25, transition: 'opacity .5s' }}>
              <rect
                x="0"
                y={92 - h}
                width="42"
                height={h}
                fill={cur ? ORANGE : 'url(#sv-hatch)'}
                fillOpacity={cur ? 0.85 : 1}
                stroke={cur ? 'none' : INK}
                strokeWidth="0.7"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '50% 100%',
                  transform: on ? 'scaleY(1)' : 'scaleY(0.05)',
                  transition: 'transform .8s cubic-bezier(.22,.8,.3,1), fill .4s',
                }}
              />
              <text x="21" y={86 - h} textAnchor="middle" fontSize="15" fill={INK} fontFamily={SERIF} fontWeight="600" style={{ opacity: on ? 1 : 0, transition: 'opacity .4s' }}>
                {v}
              </text>
              {i > 0 && (
                <text x="21" y={70 - h} textAnchor="middle" fontSize="13" fill={ORANGE} fontFamily={HAND} style={{ opacity: on ? 1 : 0, transition: 'opacity .4s' }}>
                  +{v - AT2021[i - 1]}
                </text>
              )}
              <text x="21" y="108" textAnchor="middle" fontSize="13" fill={GRAPH} fontFamily={HAND}>
                {RELEASES[i].year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// A loose inked paper clip.
const CLIP = 'M0 0 V46 C0 56 16 56 16 46 V6 C16 -2 6 -2 6 6 V40';

const VintageScene = () => {
  const scene = useScene();
  const [sel, setSel] = useState(3);
  const [manual, setManual] = useState(false);
  const [lens, setLens] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const paths = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);

  // Measure each curve so it can be drawn in with a dash offset (works in every browser).
  useEffect(() => {
    if (!scene.near) return;
    setLens(paths.current.map(p => (p && p.getTotalLength ? Math.ceil(p.getTotalLength()) + 2 : 0)));
  }, [scene.near]);

  // Autoplay: releases appear one by one, hold, then start again.
  useEffect(() => {
    if (!scene.live || manual) return undefined;
    const id = setTimeout(() => setSel(v => (v + 1) % 4), sel === 3 ? 4600 : 2600);
    return () => clearTimeout(id);
  }, [scene.live, manual, sel]);

  useEffect(() => {
    if (scene.live && !manual) setSel(0);
  }, [scene.seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const cls = drawClass(scene);
  const x21 = px(13);
  const sel21 = AT2021[sel];
  const last = RELEASES[sel].values;
  const endX = px(last.length - 1);
  const endY = py(last[last.length - 1]);

  // Construction lines overshooting the plot frame.
  const over = 16;
  const sheet = (k, i) => {
    const dx = OFF[0] * k;
    const dy = OFF[1] * k;
    return { x: SX + dx, y: SY + dy, i };
  };

  const card = (
    <div className="card" style={{ right: 18, top: 18 }}>
      <p className="tabs-hint">
        <i /> {manual ? 'release' : 'choose a release'}
      </p>
      <div className="tabs" role="group" aria-label="Data release">
        {RELEASES.map((r, i) => (
          <button
            key={r.year}
            type="button"
            aria-pressed={i === sel}
            onClick={() => {
              setManual(true);
              setSel(i);
            }}>
            {r.year}
          </button>
        ))}
      </div>
      <p className="kicker">Reference year 2021, as each release saw it</p>
      <Bars sel={sel} run={scene.live} />
      <p className="note">
        Late data keep arriving for years after a release — a trend read off one release mixes
        that in with real change.
      </p>
    </div>
  );

  return (
    <Scene
      scene={scene}
      card={card}
      label="Four stacked data-release sheets with a chart on the front sheet: four successive releases are inked one after another, each extending a year further and revising earlier years."
      caption="Countries with a value for indicator 4.c.1, by reference year, in four releases. Synthetic data from the repository's generator.">
      <PrintVintage cls={cls} releases={RELEASES} at2021={AT2021} sel={sel} />
    </Scene>
  );
};

export default VintageScene;
