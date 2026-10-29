import { maplePath, oakPath, almondPath } from '@utils/leaves';

/*
 * A blanket of fallen leaves resting on the scatter plot.
 *
 * At first the leaves half-cover the plot (heavier over the upper-right tail, so the
 * interesting part is the reveal). A breeze then sweeps from left to right: each leaf lifts
 * as the wind front reaches it. Most are carried off the frame; about a quarter tumble down
 * and settle into a small pile under the plot, where the cursor can stir them.
 *
 * Positions are stored relative to the plot box so the cover survives resizes.
 */

// Soft, slightly desaturated autumn tones (rgb).
const COLOURS = [
  [214, 122, 70], // persimmon
  [226, 160, 88], // apricot
  [200, 98, 60], // maple
  [182, 82, 52], // rust
  [233, 189, 112], // honey
  [190, 140, 92], // tan
  [168, 150, 104], // dry sage
];

const rnd = (r, a, b) => a + r() * (b - a);

export const createCover = ({ count, rand, gustDelay = 2300, gustDuration = 2400 }) => {
  const shapes = [maplePath(), maplePath(), oakPath(), almondPath()];
  const leaves = Array.from({ length: count }, () => {
    const a = rand();
    const b = rand();
    return {
      // Bias towards the right and the top: the joint upper tail is under the thickest cover.
      fx: 1.06 - Math.pow(a, 1.35) * 1.12,
      fy: Math.pow(b, 1.35) * 1.12 - 0.06,
      size: rnd(rand, 9, 19),
      rot: rnd(rand, 0, Math.PI * 2),
      shape: shapes[Math.floor(rand() * shapes.length)],
      colour: COLOURS[Math.floor(rand() * COLOURS.length)],
      settle: rand() < 0.26,
      delay: rnd(rand, 0, 380),
      phase: rnd(rand, 0, Math.PI * 2),
      state: 'rest', // rest → flying → gone | settled
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      spin: 0,
      alpha: 0.94,
      pileX: rand(),
      pileY: rand(),
    };
  });

  let startedAt = null;
  let lastNow = null;

  const pilePos = (l, box, height) => {
    const floorTop = box.y0 + box.size + 12;
    const floorBottom = Math.max(floorTop + 6, height - 10);
    return {
      x: box.x0 + 8 + l.pileX * (box.size - 16),
      y: floorTop + l.pileY * (floorBottom - floorTop),
    };
  };

  const drawLeaf = (ctx, l, x, y, flip = 1) => {
    if (!l.shape) return;
    const [r, g, b] = l.colour;
    const shade = flip < 0 ? 0.82 : 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(l.rot);
    ctx.scale(l.size * (0.3 + 0.7 * Math.abs(flip)), l.size);
    ctx.fillStyle = `rgba(${Math.round(r * shade)},${Math.round(g * shade)},${Math.round(
      b * shade,
    )},${l.alpha})`;
    ctx.fill(l.shape);
    ctx.strokeStyle = `rgba(255,244,228,${0.4 * l.alpha})`;
    ctx.lineWidth = 0.05;
    ctx.beginPath();
    ctx.moveTo(0, -0.7);
    ctx.lineTo(0, 0.92);
    ctx.stroke();
    ctx.restore();
  };

  return {
    // Draw the final, revealed state (reduced motion, or after a resize without animation).
    drawSettled(ctx, box, height) {
      leaves.forEach(l => {
        if (!l.settle) return;
        const p = pilePos(l, box, height);
        drawLeaf(ctx, l, p.x, p.y);
      });
    },

    get done() {
      return leaves.every(l => l.state === 'gone' || l.state === 'settled');
    },

    // Advance and draw one frame. `mouse` is in canvas coordinates (or null).
    step(ctx, now, box, width, height, mouse) {
      if (startedAt === null) startedAt = now;
      const dt = lastNow === null ? 0 : Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const t = now - startedAt;
      const front = (t - gustDelay) / gustDuration; // 0 → 1 as the wind crosses the plot

      leaves.forEach(l => {
        if (l.state === 'rest') {
          l.x = box.x0 + l.fx * box.size;
          l.y = box.y0 + l.fy * box.size;
          const launchAt = gustDelay + l.fx * gustDuration + l.delay;
          if (t >= launchAt) {
            l.state = 'flying';
            l.vx = l.settle ? rnd(Math.random, 25, 70) : rnd(Math.random, 120, 230);
            l.vy = rnd(Math.random, -90, -25);
            l.spin = rnd(Math.random, 1.4, 4) * (Math.random() < 0.5 ? -1 : 1);
          } else {
            // A tiny rustle as the wind approaches.
            const near = Math.max(0, 1 - Math.abs(front - l.fx) * 6);
            const wobble = Math.sin(t / 140 + l.phase) * 0.06 * near;
            drawLeaf(ctx, { ...l, rot: l.rot + wobble }, l.x, l.y);
            return;
          }
        }

        if (l.state === 'flying') {
          if (l.settle) {
            const target = pilePos(l, box, height);
            l.vy += 260 * dt;
            l.vx *= 0.985;
            l.x += l.vx * dt + Math.sin(t / 220 + l.phase) * 0.6;
            l.y += l.vy * dt;
            l.rot += l.spin * dt;
            if (l.vy > 0 && l.y >= target.y) {
              l.state = 'settled';
              l.y = target.y;
              l.x = Math.min(box.x0 + box.size - 6, Math.max(box.x0 + 6, l.x));
              l.restRot = l.rot;
            }
            drawLeaf(ctx, l, l.x, l.y, Math.cos(t / 160 + l.phase));
          } else {
            l.vx += 60 * dt;
            l.vy += 18 * dt;
            l.x += l.vx * dt;
            l.y += l.vy * dt + Math.sin(t / 180 + l.phase) * 0.8;
            l.rot += l.spin * dt;
            if (l.x > width + 30 || l.y < -30 || l.y > height + 30) l.state = 'gone';
            else drawLeaf(ctx, l, l.x, l.y, Math.cos(t / 130 + l.phase));
          }
          return;
        }

        if (l.state === 'settled') {
          // The cursor stirs the pile: nearby leaves hop and land again.
          if (mouse) {
            const dx = l.x - mouse.x;
            const dy = l.y - mouse.y;
            if (dx * dx + dy * dy < 900 && !l.hop) {
              l.hop = { vy: -rnd(Math.random, 50, 90), y: l.y, vx: dx * 0.8 };
            }
          }
          let y = l.y;
          if (l.hop) {
            l.hop.vy += 300 * dt;
            l.hop.y += l.hop.vy * dt;
            l.x = Math.min(box.x0 + box.size - 6, Math.max(box.x0 + 6, l.x + l.hop.vx * dt));
            l.rot += l.hop.vx * 0.01 * dt * 10;
            if (l.hop.y >= l.y) l.hop = null;
            else y = l.hop.y;
          }
          const rock = Math.sin(t / 900 + l.phase) * 0.05;
          drawLeaf(ctx, { ...l, rot: l.rot + rock }, l.x, y);
        }
      });
    },
  };
};
