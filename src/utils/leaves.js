/*
 * Leaf shapes for canvas drawing, defined on a unit box centred at (0, 0) and pointing up.
 * Built once as Path2D objects and reused for every frame.
 */

// Maple leaf: five pointed lobes plus a stem. Coordinates in [-1, 1].
const MAPLE = [
  [0, -1.0], [0.12, -0.62], [0.32, -0.74], [0.27, -0.42], [0.62, -0.5], [0.52, -0.3],
  [0.95, -0.12], [0.62, 0.04], [0.74, 0.3], [0.38, 0.22], [0.32, 0.46], [0.08, 0.32],
  [0.04, 0.62], [0.03, 0.98], [-0.03, 0.98], [-0.04, 0.62], [-0.08, 0.32], [-0.32, 0.46],
  [-0.38, 0.22], [-0.74, 0.3], [-0.62, 0.04], [-0.95, -0.12], [-0.52, -0.3], [-0.62, -0.5],
  [-0.27, -0.42], [-0.32, -0.74], [-0.12, -0.62],
];

const build = draw => {
  if (typeof Path2D === 'undefined') return null;
  const p = new Path2D();
  draw(p);
  return p;
};

export const maplePath = () =>
  build(p => {
    MAPLE.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
    p.closePath();
  });

// Simple almond-shaped leaf (birch / willow).
export const almondPath = () =>
  build(p => {
    p.moveTo(0, -1);
    p.bezierCurveTo(0.62, -0.55, 0.62, 0.45, 0, 0.92);
    p.bezierCurveTo(-0.62, 0.45, -0.62, -0.55, 0, -1);
    p.closePath();
  });

// Rounded oak-like leaf with three soft lobes per side.
export const oakPath = () =>
  build(p => {
    p.moveTo(0, -1);
    const lobes = [
      [0.42, -0.62], [0.28, -0.4], [0.6, -0.15], [0.34, 0.08], [0.55, 0.36], [0.16, 0.62],
    ];
    let prev = [0, -1];
    lobes.forEach(([x, y]) => {
      p.quadraticCurveTo(prev[0] + 0.25, (prev[1] + y) / 2, x, y);
      prev = [x, y];
    });
    p.lineTo(0.03, 0.98);
    p.lineTo(-0.03, 0.98);
    lobes
      .slice()
      .reverse()
      .forEach(([x, y]) => {
        p.quadraticCurveTo(-x - 0.18, y + 0.08, -x, y);
      });
    p.quadraticCurveTo(-0.25, -0.85, 0, -1);
    p.closePath();
  });

// Autumn palette used by every leaf (rgb triples).
export const LEAF_COLOURS = [
  [196, 80, 31], // maple
  [168, 61, 27], // rust
  [143, 42, 28], // cranberry
  [201, 131, 31], // amber
  [226, 176, 74], // gold
  [178, 112, 46], // tawny
  [124, 138, 92], // sage (a few still green)
];

export const pick = (arr, r) => arr[Math.floor(r * arr.length) % arr.length];
