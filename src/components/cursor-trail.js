import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { paintLeaf } from '@utils/maple';

/*
 * A companion for the mouse: one small maple leaf, drawn in ink and wash, follows the pointer
 * on a soft spring and tilts with its motion. Nothing is shed and nothing bursts. The normal cursor stays. It wakes on the first real mouse / trackpad /
 * TrackPoint movement (pointerType "mouse"), so touch-screen laptops work too; touch and pen
 * never trigger it. With reduced motion nothing is shed. The loop sleeps when idle.
 */

const StyledCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 50;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const LEAF_TONES = ['#cf602b', '#e0a046', '#a3432a', '#d9703a'];
const pick = a => a[Math.floor(Math.random() * a.length)];

const CursorTrail = () => {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let lastSpawn = 0;
    const mouse = { x: -100, y: -100, seen: false };
    const follower = { x: -100, y: -100, vx: 0, vy: 0, rot: 0 };
    const bits = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const spawn = (x, y, burst = false) => {
      const kind = Math.random() < 0.75 ? 'maple' : 'oak';
      const a = burst ? Math.random() * Math.PI * 2 : Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const sp = burst ? 120 + Math.random() * 180 : 20 + Math.random() * 40;
      bits.push({
        kind,
        x,
        y,
        vx: Math.cos(a) * sp * (burst ? 1 : 0.6),
        vy: burst ? Math.sin(a) * sp - 120 : Math.sin(a) * sp,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 6,
        size: 8 + Math.random() * 6,
        colour: pick(LEAF_TONES),
        life: 0,
        ttl: 1.6 + Math.random() * 1.2,
        phase: Math.random() * 6.28,
      });
      if (bits.length > 90) bits.shift();
    };

    const drawBit = b => {
      const fade = Math.min(1, (b.ttl - b.life) / 0.6) * Math.min(1, b.life / 0.12);
      ctx.save();
      ctx.globalAlpha = Math.max(0, fade);
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      const flip = Math.cos(b.life * 5 + b.phase);
      ctx.scale(b.size * (0.3 + 0.7 * Math.abs(flip)), b.size);
      ctx.restore();
    };

    const frame = now => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // The follower: a spring towards a point just below-right of the pointer.
      const tx = mouse.x + 22;
      const ty = mouse.y + 26;
      follower.vx += (tx - follower.x) * 140 * dt;
      follower.vy += (ty - follower.y) * 140 * dt;
      follower.vx *= Math.pow(0.0009, dt);
      follower.vy *= Math.pow(0.0009, dt);
      follower.x += follower.vx * dt;
      follower.y += follower.vy * dt;
      follower.rot += (Math.max(-0.9, Math.min(0.9, follower.vx * 0.004)) - follower.rot) * Math.min(1, dt * 8);

      bits.forEach(b => {
        b.life += dt;
        b.vy += 260 * dt;
        b.vx *= Math.pow(0.35, dt);
        b.x += (b.vx + Math.sin(b.life * 3 + b.phase) * 22) * dt;
        b.y += Math.min(b.vy, 140) * dt;
        b.rot += b.spin * dt;
      });
      for (let i = bits.length - 1; i >= 0; i -= 1) if (bits[i].life > bits[i].ttl) bits.splice(i, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      bits.forEach(drawBit);

      if (mouse.seen) {
        paintLeaf(ctx, {
          x: follower.x,
          y: follower.y,
          size: 10,
          rot: follower.rot + Math.sin(now / 900) * 0.1 + 0.5,
          rgb: [163, 67, 42],
          alpha: 0.9,
        });
      }

      const moving = Math.abs(follower.vx) + Math.abs(follower.vy) > 2;
      if (bits.length || moving) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (!mouse.seen) {
        follower.x = e.clientX + 16;
        follower.y = e.clientY + 18;
      }
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
      const now = performance.now();
      if (now - lastSpawn > 160 && dx * dx + dy * dy > 30) {
        lastSpawn = now;

      }
      wake();
    };
    const onDown = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      wake();
    };
    const onLeave = () => {
      mouse.seen = false;
      wake();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', wake);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <StyledCanvas ref={ref} aria-hidden="true" />;
};

export default CursorTrail;
