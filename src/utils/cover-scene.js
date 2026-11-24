/*
 * The cover painting: Montréal from the river at dusk on the first frost. Flat gouache shapes —
 * a low, broad Mont Royal with its cross, the lit skyline, the Jacques-Cartier truss in gold,
 * the river in ruled reflections and one winterberry branch in the foreground.
 * Returned as SVG markup for a 1440 × 620 view (y from 280 to 900); deterministic.
 */
export const COVER = {
  cream: '#f6f0e4',
  navy: '#14213a',
  vermilion: '#c8431f',
  gold: '#e0ad4a',
  blue: '#2c5d7c',
  pale: '#bcd3df',
  dusk: '#f2c79c',
  rose: '#eaa283',
};

export const coverScene = () => {
  const C = COVER;
  let seed = 11;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const f = n => n.toFixed(1);
  let o = '';

  o += `<defs><linearGradient id="cvsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.cream}" stop-opacity="0"/><stop offset=".5" stop-color="${C.dusk}"/><stop offset="1" stop-color="${C.rose}"/></linearGradient></defs>`;
  o += `<rect x="0" y="280" width="1440" height="480" fill="url(#cvsky)"/>`;
  // moon
  o += `<circle cx="1296" cy="392" r="30" fill="#fbf7ee"/><circle cx="1296" cy="392" r="42" fill="none" stroke="#fbf7ee" stroke-width="1"/>`;
  // far shore
  o += `<path d="M0 700 C180 672 330 684 500 664 C660 646 780 612 900 588 C1000 568 1080 548 1160 548 C1260 548 1350 580 1440 596 V900 H0Z" fill="#46708a"/>`;
  // Mont Royal: low and broad, three soft summits
  const ridge =
    'M560 742 C680 716 760 676 850 628 C900 602 940 570 990 556 C1030 545 1056 560 1090 540 C1124 520 1150 498 1190 496 C1232 494 1256 520 1290 530 C1330 542 1352 536 1380 556 C1404 573 1424 590 1440 600';
  o += `<path d="${ridge} V900 H560Z" fill="#1c3550"/>`;
  // frost along the crest
  o += `<path d="M1010 552 C1034 546 1056 560 1090 540 C1124 520 1150 498 1190 496 C1232 494 1256 520 1290 530 C1320 539 1340 538 1362 546 C1340 548 1330 556 1310 550 C1290 544 1282 556 1262 548 C1242 540 1234 552 1214 540 C1196 530 1186 534 1170 528 C1150 536 1138 552 1118 554 C1098 556 1090 568 1070 566 C1050 564 1036 558 1010 552Z" fill="#fbf7ee"/>`;
  o += `<path d="M1190 494V462M1180 473H1200" stroke="${C.gold}" stroke-width="2.6"/>`;
  // skyline
  let x = 40;
  while (x < 1400) {
    const t = x / 1440;
    const w = 16 + R() * 26;
    const h = 26 + Math.pow(R(), 1.7) * (40 + 140 * Math.exp(-Math.pow((t - 0.62) / 0.17, 2)));
    const y0 = 742;
    o += `<rect x="${f(x)}" y="${f(y0 - h)}" width="${f(w)}" height="${f(h)}" fill="#0f1a30"/>`;
    for (let k = 0; k < h / 10 - 1; k++)
      for (let j = 0; j < w / 7 - 1; j++)
        if (R() < 0.4)
          o += `<rect${R() < 0.12 ? ` class="win" style="animation-delay:-${f(R() * 9)}s"` : ''} x="${f(x + 4 + j * 7)}" y="${f(y0 - h + 6 + k * 10)}" width="2.6" height="4" fill="${C.gold}"/>`;
    if (R() < 0.15) o += `<path d="M${f(x + w / 2)} ${f(y0 - h)}v-20" stroke="#0f1a30" stroke-width="1.6"/>`;
    x += w + 3 + R() * 8;
  }
  // river: ruled water with broken reflections
  o += `<rect x="0" y="740" width="1440" height="160" fill="${C.blue}"/>`;
  for (let r = 0; r < 13; r++) {
    const y = 754 + r * 11.5;
    let d = '';
    let px = -20 + R() * 60;
    while (px < 1440) {
      const len = 30 + R() * 150;
      d += `M${f(px)} ${f(y)}h${f(len)}`;
      px += len + 16 + R() * 70;
    }
    o += `<path d="${d}" stroke="${r % 3 === 1 ? C.cream : C.pale}" stroke-width="1" opacity="${f(0.55 - r * 0.02)}" fill="none"/>`;
  }
  for (let i = 0; i < 90; i++) {
    const gx = 60 + R() * 1320;
    const gy = 748 + R() * 46;
    o += `<path d="M${f(gx)} ${f(gy)}v${f(3 + R() * 7)}" stroke="${C.gold}" stroke-width="1.6" opacity="${f(0.35 + R() * 0.4)}"/>`;
  }
  o += `<rect x="0" y="806" width="1440" height="94" fill="${C.navy}" opacity=".55"/>`;
  // bridge
  let br = 'M620 752H1440M620 736H1440';
  for (let bx = 620; bx < 1440; bx += 16) br += `M${bx} 752l8-16l8 16`;
  br += 'M900 736Q1020 640 1140 736';
  for (let bx = 916; bx < 1140; bx += 16) {
    const t = (bx - 900) / 240;
    br += `M${bx} ${f(736 - 4 * 48 * t * (1 - t))}V736`;
  }
  o += `<path d="${br}" fill="none" stroke="${C.gold}" stroke-width="1.4"/>`;
  for (const px of [760, 900, 1140, 1300]) o += `<path d="M${px} 752V800" stroke="${C.gold}" stroke-width="2.4"/>`;
  // winterberry
  const berry = (x0, y0, ang, len, cv) => {
    let s = '';
    let b = '';
    let bx0 = x0;
    let by0 = y0;
    let a = ang;
    const steps = Math.round(len / 11);
    for (let i = 0; i < steps; i++) {
      const nx = bx0 + Math.cos(a) * 11;
      const ny = by0 + Math.sin(a) * 11;
      s += `${i ? 'L' : `M${f(bx0)} ${f(by0)}L`}${f(nx)} ${f(ny)}`;
      if (i % 2 === 1) {
        const ca = a + (i % 4 === 1 ? 1 : -1) * 1.2;
        for (let k = 0; k < 3; k++) {
          const cx = nx + Math.cos(ca + k * 0.5 - 0.5) * (10 + k * 2.5);
          const cy = ny + Math.sin(ca + k * 0.5 - 0.5) * (10 + k * 2.5);
          b += `<circle cx="${f(cx)}" cy="${f(cy)}" r="5.2" fill="${C.vermilion}"/><circle cx="${f(cx - 1.5)}" cy="${f(cy - 1.7)}" r="1.3" fill="#f6c9a8"/>`;
        }
      }
      bx0 = nx;
      by0 = ny;
      a += cv;
    }
    return `<path d="${s}" stroke="#3a2618" stroke-width="2" fill="none"/>${b}`;
  };
  o += berry(1440, 716, -2.55, 200, -0.03) + berry(1440, 668, -2.2, 150, 0.04);
  return o;
};
