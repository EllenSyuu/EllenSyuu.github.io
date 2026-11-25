/*
 * Shared drawing vocabulary for the art layer, taken from the cover: flat cut shapes in the
 * cover's inks, long clouds with rounded ends, gulls as two strokes, water as short cream
 * rules, light as gold dashes. Everything is deterministic.
 */
import { COVER } from '@utils/cover-scene';

export const P = {
  ...COVER,
  peach: '#f3cda6',
  coral: '#eeae8f',
  cloud: '#fbe9d4',
  cloud2: '#f9dcc2',
  mist: '#e6ecef',
  morning: '#edf1f3',
  lake: '#dfe7ec',
  night: '#172b47',
};

export const rng = (seed = 7) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const f = n => (Math.round(n * 10) / 10).toString();

/* The cover's long cloud: a flat strip with rounded ends and a stepped underside. */
export const cloud = (x, y, w, h, c, op = 1) =>
  `<path d="M${f(x)} ${f(y)}h${f(w)}a${h / 2} ${h / 2} 0 0 1 0 ${h}h${f(-w * 0.62)}a${h / 2} ${
    h / 2
  } 0 0 0 0 ${h}h${f(-w * 0.5)}a${h / 2} ${h / 2} 0 0 1 0 ${-h}h${f(w * 0.12)}a${h / 2} ${
    h / 2
  } 0 0 0 0 ${-h}Z" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''}/>`;

export const gulls = (list, c = COVER.ink, sw = 1.4) => {
  let d = '';
  list.forEach(([x, y, r]) => {
    d += `M${f(x - r)} ${f(y)}q${f(r / 2)} ${f(-r * 0.7)} ${f(r)} 0q${f(r / 2)} ${f(-r * 0.7)} ${f(r)} 0`;
  });
  return `<path d="${d}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
};

/* A full-width band whose top edge is a soft, low-amplitude line (like the cover's far shore),
   filled down to y1. `waves` is a list of [amplitude, wavelength, phase]. */
export const band = (W, y0, y1, color, waves = [[10, 900, 0]], op = 1) => {
  const step = 40;
  const pts = [];
  for (let x = -step; x <= W + step; x += step) {
    let y = y0;
    waves.forEach(([a, l, ph]) => {
      y += a * Math.sin((x / l) * Math.PI * 2 + ph);
    });
    pts.push([x, y]);
  }
  let d = `M${pts[0][0]} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, ya] = pts[i - 1];
    const [x1, yb] = pts[i];
    d += `C${f(x0 + step / 2)} ${f(ya)} ${f(x1 - step / 2)} ${f(yb)} ${x1} ${f(yb)}`;
  }
  d += `V${f(y1)}H${pts[0][0]}Z`;
  return `<path d="${d}" fill="${color}"${op < 1 ? ` opacity="${op}"` : ''}/>`;
};

/* Water: short cream rules whose spacing widens towards the viewer. */
export const waterLines = (W, y0, y1, color, op, seed = 3, density = 1) => {
  const R = rng(seed);
  let d = '';
  let y = y0 + 8;
  let k = 0;
  while (y < y1) {
    const n = Math.max(1, Math.round((W / 260) * density));
    for (let i = 0; i < n; i++) {
      const x = R() * W;
      const l = 40 + R() * (90 + k * 4);
      d += `M${f(x)} ${f(y)}h${f(l)}`;
    }
    k += 1;
    y += 10 + k * 1.6;
  }
  return `<path d="${d}" stroke="${color}" stroke-width="1" opacity="${op}" fill="none"/>`;
};

/* The cover's skyline geometry, mapped to page coordinates the way the hero's SVG is
   (viewBox 1440 wide, aligned to the right edge, scaled to the page width). */
export const coverMap = W => {
  const k = Math.max(W / 1440, 300 / 620);
  return { k, x: x => W - (1440 - x) * k };
};
