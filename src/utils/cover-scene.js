/*
 * The cover drawing: Montréal from the river, cut like a three-colour print — navy, two slates and
 * gold on bare paper. Mont Royal and its cross, the towers of the centre drawn one by one, the
 * Old Port with its clock tower and grain silos, and the Jacques-Cartier bridge.
 * Returned as SVG markup for a 1440 × 620 view (y from 280 to 900). Nothing here is random.
 */
export const COVER = {
  cream: '#f6f0e4',
  navy: '#14213a',
  slate: '#4a6a82',
  haze: '#a9b9c3',
  vermilion: '#c8431f',
  gold: '#d9a441',
};

const GROUND = 742;

// [x, width, height, kind] — kind: slab | step | point | mast | cross (Place Ville Marie)
const TOWERS = [
  [596, 30, 58, 'slab'],
  [634, 24, 84, 'step'],
  [666, 34, 66, 'slab'],
  [708, 26, 118, 'mast'],
  [742, 40, 92, 'slab'],
  [790, 28, 150, 'step'],
  [826, 36, 108, 'slab'],
  [870, 30, 186, 'point'],
  [908, 44, 132, 'cross'],
  [960, 26, 168, 'mast'],
  [994, 38, 114, 'step'],
  [1040, 30, 142, 'slab'],
  [1078, 34, 96, 'slab'],
  [1120, 24, 124, 'step'],
  [1152, 40, 78, 'slab'],
  [1200, 28, 102, 'slab'],
  [1236, 36, 64, 'step'],
  [1280, 30, 84, 'slab'],
  [1318, 42, 52, 'slab'],
  [1368, 28, 70, 'slab'],
  [1404, 36, 44, 'slab'],
];

export const coverScene = () => {
  const C = COVER;
  let o = '';

  // a low wash of dusk on the horizon
  o += `<defs><linearGradient id="cvsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0c9a4" stop-opacity="0"/><stop offset="1" stop-color="#f0c9a4"/></linearGradient></defs><rect x="0" y="430" width="1440" height="${GROUND - 430}" fill="url(#cvsky)"/>`;
  // far shore and the mountain
  o += `<path d="M0 716 C200 700 380 704 560 690 C720 678 800 640 900 604 C1000 570 1080 548 1160 548 C1260 548 1350 580 1440 596 V${GROUND} H0Z" fill="${C.haze}"/>`;
  o += `<path d="M640 ${GROUND} C740 716 800 668 870 624 C912 598 944 568 990 556 C1030 545 1056 560 1090 540 C1124 520 1150 498 1190 496 C1232 494 1256 520 1290 530 C1330 542 1352 536 1380 556 C1404 573 1424 590 1440 600 V${GROUND}Z" fill="${C.slate}"/>`;
  o += `<path d="M1190 494V458M1179 470H1201" stroke="${C.gold}" stroke-width="2.6"/>`;

  // Old Port: grain silos, sheds and the clock tower
  let port = '';
  for (let i = 0; i < 9; i++) port += `M${150 + i * 17} ${GROUND}V686a8.5 8.5 0 0 1 17 0V${GROUND}Z`;
  port += `M303 ${GROUND}V664h34V${GROUND}Z M337 ${GROUND}V700h70V${GROUND}Z`;
  port += `M60 ${GROUND}V718h76V${GROUND}Z M430 ${GROUND}V722h96V${GROUND}Z`;
  port += `M468 ${GROUND}V664h-3v-6h3V640h3l5-12 5 12h3v18h3v6h-3V${GROUND}Z`;
  o += `<path d="${port}" fill="${C.navy}"/>`;
  o += `<circle cx="476" cy="650" r="3.2" fill="${C.gold}"/>`;

  // the towers
  let body = '';
  let lit = '';
  TOWERS.forEach(([x, w, h, kind], n) => {
    const top = GROUND - h;
    if (kind === 'step') {
      body += `M${x} ${GROUND}V${top + 22}h${w * 0.2}V${top + 9}h${w * 0.18}V${top}h${w * 0.24}V${top + 9}h${w * 0.18}V${top + 22}h${w * 0.2}V${GROUND}Z`;
    } else if (kind === 'point') {
      body += `M${x} ${GROUND}V${top + 30}L${x + w / 2} ${top}L${x + w} ${top + 30}V${GROUND}Z`;
    } else if (kind === 'cross') {
      body += `M${x} ${GROUND}V${top + 10}h${w * 0.3}V${top}h${w * 0.4}V${top + 10}h${w * 0.3}V${GROUND}Z`;
    } else {
      body += `M${x} ${GROUND}V${top}h${w}V${GROUND}Z`;
      if (kind === 'mast') body += `M${x + w / 2 - 1} ${top}v-26h2v26Z`;
    }
    // lit floors: short gold bars, on a fixed pattern
    const rows = Math.floor((h - 30) / 9);
    for (let r = 0; r < rows; r++) {
      const k = (n * 7 + r * 3) % 11;
      if (k < 3) {
        const len = 5 + ((n + r) % 3) * 4;
        const off = 4 + ((n * 5 + r * 2) % Math.max(1, Math.floor(w - len - 8)));
        lit += `M${(x + off).toFixed(1)} ${top + 26 + r * 9}h${len}`;
      }
    }
  });
  o += `<path d="${body}" fill="${C.navy}"/>`;
  o += `<path class="lit" d="${lit}" stroke="${C.gold}" stroke-width="2" fill="none"/>`;

  // the river
  o += `<rect x="0" y="${GROUND - 1}" width="1440" height="160" fill="${C.navy}"/>`;
  let water = '';
  [
    [40, 762, 210], [330, 762, 120], [520, 766, 60],
    [120, 778, 90], [270, 780, 260], [600, 782, 140],
    [30, 796, 160], [420, 798, 110], [1260, 800, 150],
  ].forEach(([x, y, l]) => {
    water += `M${x} ${y}h${l}`;
  });
  o += `<path d="${water}" stroke="${C.cream}" stroke-width="1" opacity=".38" fill="none"/>`;
  let glow = '';
  [884, 930, 973, 806, 1055].forEach((x, i) => {
    for (let k = 0; k < 4 - (i % 2); k++) glow += `M${x - 6 + k * 2} ${760 + k * 9}h${12 - k * 3}`;
  });
  o += `<path d="${glow}" stroke="${C.gold}" stroke-width="1.6" opacity=".8" fill="none"/>`;

  // Jacques-Cartier bridge
  let br = 'M700 752H1440M700 736H1440';
  for (let bx = 700; bx < 1440; bx += 16) br += `M${bx} 752l8-16l8 16`;
  br += 'M900 736Q1020 640 1140 736';
  for (let bx = 916; bx < 1140; bx += 16) {
    const t = (bx - 900) / 240;
    br += `M${bx} ${(736 - 4 * 48 * t * (1 - t)).toFixed(1)}V736`;
  }
  o += `<path d="${br}" fill="none" stroke="${C.gold}" stroke-width="1.4"/>`;
  [780, 900, 1140, 1300].forEach(px => {
    o += `<path d="M${px} 752V806" stroke="${C.gold}" stroke-width="2.4"/>`;
  });
  return o;
};
