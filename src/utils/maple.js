/*
 * One maple leaf, drawn once and used everywhere (cover plate, case plates, falling leaves,
 * the cursor companion). Unit box, tip up, stem down. The outline is built from tips and
 * notches joined by inward-bowed curves, so the lobes taper the way a pressed leaf does;
 * the veins run from the leaf base to each lobe tip.
 */

// Right half, from the top tip clockwise to the stem. [x, y, bow] — bow pulls the edge
// arriving at this point towards the leaf's centre (0 = straight).
const HALF = [
  [0.0, -1.0, 0],
  [0.085, -0.7, 0.1],
  [0.225, -0.77, 0.04],
  [0.165, -0.5, 0.1],
  [0.15, -0.26, 0.02],
  [0.4, -0.55, 0.12],
  [0.41, -0.41, 0.03],
  [0.8, -0.52, 0.1],
  [0.655, -0.29, 0.1],
  [0.93, -0.2, 0.05],
  [0.63, -0.07, 0.12],
  [0.39, 0.0, 0.03],
  [0.7, 0.21, 0.12],
  [0.47, 0.235, 0.05],
  [0.5, 0.4, 0.04],
  [0.1, 0.3, 0.14],
  [0.022, 0.34, 0],
  [0.009, 0.86, 0],
];
const C = [0, 0.05]; // the point the edges bow towards

const f = v => (Math.abs(v) < 0.0005 ? '0' : v.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''));
const seg = (a, b) => {
  const bow = b[2];
  if (!bow) return `L${f(b[0])} ${f(b[1])}`;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  return `Q${f(mx + (C[0] - mx) * bow * 2)} ${f(my + (C[1] - my) * bow * 2)} ${f(b[0])} ${f(b[1])}`;
};

const right = HALF;
const left = HALF.slice()
  .reverse()
  .map(([x, y], i, arr) => {
    // the bow belongs to the edge arriving at a point; mirrored, edges are walked backwards
    const prev = arr[i - 1];
    return [-x, y, prev ? prev[2] : 0];
  });

export const MAPLE_D = (() => {
  let d = `M${f(right[0][0])} ${f(right[0][1])}`;
  for (let i = 1; i < right.length; i += 1) d += seg(right[i - 1], right[i]);
  for (let i = 0; i < left.length; i += 1) d += seg(i ? left[i - 1] : right[right.length - 1], left[i]);
  return `${d}Z`;
})();

// Veins: midrib, two to the side lobes, two to the basal lobes, and short ones to the teeth.
const B = '0 0.3';
export const VEINS_D = [
  `M${B} L0 -0.9`,
  `M${B} Q0.2 -0.1 0.72 -0.47`,
  `M${B} Q-0.2 -0.1 -0.72 -0.47`,
  `M${B} Q0.3 0.2 0.62 0.2`,
  `M${B} Q-0.3 0.2 -0.62 0.2`,
  'M0 -0.42 L0.17 -0.68 M0 -0.42 L-0.17 -0.68',
  'M0.42 -0.25 L0.8 -0.2 M-0.42 -0.25 L-0.8 -0.2',
  'M0.34 -0.19 L0.38 -0.47 M-0.34 -0.19 L-0.38 -0.47',
].join(' ');

let cache = null;
const paths = () => {
  if (typeof Path2D === 'undefined') return null;
  if (!cache) cache = { leaf: new Path2D(MAPLE_D), veins: new Path2D(VEINS_D) };
  return cache;
};

/*
 * Paint the leaf on a canvas as ink and wash: a soft two-tone wash that pools towards the
 * edge, a hairline ink outline set slightly off-register, and fine veins.
 * `flip` (−1…1) fakes the leaf turning in the air.
 */
export const paintLeaf = (ctx, { x, y, size, rot = 0, flip = 1, rgb, alpha = 1 }) => {
  const p = paths();
  if (!p) return;
  const [r, g, b] = rgb;
  const k = flip < 0 ? 0.82 : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(size * (0.22 + 0.78 * Math.abs(flip)), size);
  const wash = ctx.createRadialGradient(-0.1, -0.15, 0.05, 0, 0, 1.05);
  wash.addColorStop(0, `rgba(${Math.round(r * k + 26)},${Math.round(g * k + 22)},${Math.round(b * k + 14)},${0.5 * alpha})`);
  wash.addColorStop(0.7, `rgba(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)},${0.72 * alpha})`);
  wash.addColorStop(1, `rgba(${Math.round(r * k * 0.8)},${Math.round(g * k * 0.72)},${Math.round(b * k * 0.7)},${0.86 * alpha})`);
  ctx.fillStyle = wash;
  ctx.fill(p.leaf);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.translate(0.025, -0.02);
  ctx.strokeStyle = `rgba(34,49,74,${0.75 * alpha})`;
  ctx.lineWidth = Math.max(0.035, 0.75 / size);
  ctx.stroke(p.leaf);
  ctx.strokeStyle = `rgba(34,49,74,${0.42 * alpha})`;
  ctx.lineWidth = Math.max(0.022, 0.5 / size);
  ctx.stroke(p.veins);
  ctx.restore();
};
