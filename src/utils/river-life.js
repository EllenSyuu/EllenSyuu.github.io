/*
 * The river on the cover, kept moving.
 *
 * Works directly on the cover's own drawing — the currents (.cv-current), the gold
 * reflections of the lit windows (.cv-glow) and the ferry (.cv-ferry) — with one
 * requestAnimationFrame loop and no React state:
 *
 *   - each current wanders slowly about its place and breathes in length, at its own pace;
 *   - scrolling adds energy that speeds the currents up and dies away when the reader stops;
 *   - a pointer or a finger moving over the water disturbs only the currents near it: they lift,
 *     shift and settle again, like a hand trailed in water;
 *   - the reflections shiver a little more when the water is disturbed;
 *   - the ferry rides a gentle swell and leaves a short wake that lengthens with its speed;
 *   - during the cover transition (--p from the page) the currents stretch and slow.
 *
 * The loop runs only while the cover's water is on screen and the tab is visible.
 * Nothing runs under prefers-reduced-motion.
 */

const TAU = Math.PI * 2;
const rnd = i => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export default function riverLife(scene, stage) {
  if (typeof window === 'undefined' || !scene) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const svg = scene.querySelector('.layer-water svg');
  if (!svg) return () => {};
  scene.classList.add('river-live');

  const currents = [...svg.querySelectorAll('.cv-current')].map((el, i) => ({
    el,
    x: +el.dataset.x,
    y: +el.dataset.y,
    l: +el.dataset.l,
    wander: (22 + rnd(i) * 26) * (+el.dataset.y > 815 ? 0.45 : 1), // how far it drifts; less near the captions
    period: 26 + rnd(i + 5) * 22, // seconds per slow drift
    breathe: 7 + rnd(i + 9) * 7, // seconds per swell
    phase: rnd(i + 3) * TAU,
    off: 0,
    clock: 0,
    lift: 0, // vertical disturbance from the pointer
    push: 0, // horizontal disturbance from the pointer
    v: 0,
  }));
  const glows = [...svg.querySelectorAll('.cv-glow')].map((el, i) => ({
    el,
    phase: rnd(i + 21) * TAU,
  }));
  const ferry = svg.querySelector('.cv-ferry');
  const wake = svg.querySelector('.cv-wake');

  let energy = 0; // from scrolling
  let stir = 0; // from the pointer, for the reflections
  let lastY = window.scrollY;
  let last = performance.now();
  let t0 = last;
  let raf = 0;
  let visible = true;
  let pointer = null; // { x, y, vx, vy } in viewBox units

  const toView = (cx, cy) => {
    const m = svg.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const q = pt.matrixTransform(m.inverse());
    return { x: q.x, y: q.y };
  };

  const onPointer = e => {
    const q = toView(e.clientX, e.clientY);
    if (!q) return;
    if (q.y < 735 || q.y > 905) {
      pointer = null;
      return;
    }
    const prev = pointer;
    pointer = { x: q.x, y: q.y, vx: prev ? q.x - prev.x : 0, vy: prev ? q.y - prev.y : 0 };
    const sp = Math.min(40, Math.hypot(pointer.vx, pointer.vy));
    currents.forEach(c => {
      const cx = c.x + c.off + c.l / 2;
      const dx = Math.max(0, Math.abs(pointer.x - cx) - c.l / 2);
      const w =
        Math.exp(-((pointer.y - c.y) ** 2) / (2 * 14 * 14)) * Math.exp(-(dx * dx) / (2 * 90 * 90));
      if (w < 0.02) return;
      c.v += w * sp * 0.05; // energy of the swell under the hand
      c.push += w * pointer.vx * 0.35;
    });
    stir = Math.min(1, stir + sp * 0.01);
  };
  const onTouch = e => {
    const tp = e.touches && e.touches[0];
    if (tp) onPointer({ clientX: tp.clientX, clientY: tp.clientY });
  };
  const onLeave = () => {
    pointer = null;
  };

  const tick = now => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;

    const y = window.scrollY;
    energy = Math.min(
      3,
      energy * Math.pow(0.12, dt) + (Math.abs(y - lastY) / Math.max(1, window.innerHeight)) * 6,
    );
    lastY = y;
    stir *= Math.pow(0.25, dt);
    const p = stage ? parseFloat(stage.style.getPropertyValue('--p')) || 0 : 0;
    const stretch = 1 + 0.35 * p;
    const calm = 1 - 0.5 * p;

    currents.forEach(c => {
      // a slow wander that never carries a current away from its place in the drawing;
      // scrolling makes the water hurry, and it calms down again
      c.clock += dt * (1 + energy * 3) * calm;
      c.off =
        c.wander * Math.sin((c.clock / c.period) * TAU + c.phase) +
        c.wander * 0.35 * Math.sin((c.clock / (c.period * 0.43)) * TAU + c.phase * 2);
      // the pointer's swell rings down
      c.lift = c.lift * Math.pow(0.02, dt) + c.v * dt * 60;
      c.v *= Math.pow(0.05, dt);
      c.push *= Math.pow(0.08, dt);
      const swell = Math.sin((t / c.breathe) * TAU + c.phase);
      const s = (1 + 0.07 * swell) * stretch;
      const dy = Math.sin(t * 7 + c.phase) * Math.min(5, c.lift) + swell * 0.6;
      const cx = c.x + c.l / 2;
      c.el.setAttribute(
        'transform',
        `translate(${(c.off + c.push).toFixed(1)} ${dy.toFixed(2)}) translate(${cx} ${
          c.y
        }) scale(${s.toFixed(3)} 1) translate(${-cx} ${-c.y})`,
      );
    });

    const shiver = 0.6 + stir * 2.5 + energy * 0.6;
    glows.forEach(g => {
      g.el.setAttribute(
        'transform',
        `translate(${(Math.sin(t * 2.3 + g.phase) * shiver).toFixed(2)} 0)`,
      );
    });

    if (ferry) {
      // crosses slowly, turns back at the ends; rides the swell
      const period = 140;
      const u = (t / period) % 1;
      const tri = u < 0.5 ? u * 2 : 2 - u * 2;
      const ease = tri * tri * (3 - 2 * tri);
      const fx = -140 + ease * 440;
      const vel = u < 0.5 ? 1 : -1; // heading east in the first half
      const speed = Math.abs(Math.sin(tri * Math.PI)) * (1 + energy * 0.5);
      const bob = Math.sin(t * 1.3) * 1.2 + Math.sin(t * 0.7 + 1) * 0.6;
      const tilt = Math.sin(t * 1.3 + 0.6) * 0.35;
      ferry.setAttribute(
        'transform',
        `translate(${fx.toFixed(1)} ${bob.toFixed(2)}) rotate(${tilt.toFixed(2)} 284 792)`,
      );
      if (wake) {
        const len = 10 + speed * 34;
        const stern = vel > 0 ? 240 : 328;
        const d = vel > 0 ? -1 : 1;
        wake.setAttribute(
          'd',
          `M${stern} 797q${(d * len) / 2} 2 ${d * len} 5M${stern + d * 4} 794q${
            (d * len * 0.6) / 2
          } -1 ${d * len * 0.6} -2`,
        );
      }
    }

    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible) start();
          else stop();
        })
      : null;
  if (io) io.observe(svg);
  const onVis = () => (document.hidden ? stop() : visible && start());
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchstart', onTouch, { passive: true });
  t0 = performance.now();
  start();

  return () => {
    stop();
    if (io) io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('touchmove', onTouch);
    window.removeEventListener('touchstart', onTouch);
    scene.classList.remove('river-live');
  };
}
