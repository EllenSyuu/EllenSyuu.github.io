/*
 * The cover drawing: Montréal from the river, cut like a three-colour print — blues and gold over a
 * wash of dusk. Mont Royal and its cross, the towers of the centre drawn one by one, the
 * Old Port with its clock tower and grain silos, and the Jacques-Cartier bridge.
 * Returned as SVG markup for a 1440 × 620 view (y from 280 to 900). Nothing here is random.
 */
export const COVER = {
  cream: '#f6f0e4',
  navy: '#14213a',
  ink: '#1d3557',
  back: '#456a8e',
  hill: '#7d9cb4',
  haze: '#bccbd5',
  river: '#3f6f96',
  vermilion: '#c8431f',
  gold: '#e0ad4a',
};

export const GROUND = 742;

// [x, width, height, kind] — kind: slab | step | point | mast | cross (Place Ville Marie)
export const TOWERS = [
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

// a second, paler row of towers behind the first
export const BACK = [
  [580, 36, 70],
  [650, 30, 104],
  [730, 34, 130],
  [812, 30, 96],
  [850, 28, 160],
  [936, 34, 150],
  [1012, 30, 128],
  [1064, 36, 110],
  [1136, 30, 96],
  [1182, 34, 118],
  [1262, 30, 74],
  [1340, 36, 60],
];

export const coverScene = () => {
  const C = COVER;
  const K = 1.38; // everything standing on the shore is drawn tall
  let o = '';

  // dusk
  o += `<defs><linearGradient id="cvsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3cda6" stop-opacity="0"/><stop offset=".55" stop-color="#f3cda6"/><stop offset="1" stop-color="#eeae8f"/></linearGradient><linearGradient id="cvriver" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.river}"/><stop offset=".45" stop-color="${C.river}"/><stop offset="1" stop-color="${C.ink}"/></linearGradient></defs>`;
  o += `<rect x="0" y="300" width="1440" height="${GROUND - 300}" fill="url(#cvsky)"/>`;
  // long clouds, cut flat
  const cloud = (x, y, w, h, c) =>
    `<path class="cv-cloud" style="animation-duration:${14 + (x % 7) * 2}s" d="M${x} ${y}h${w}a${
      h / 2
    } ${h / 2} 0 0 1 0 ${h}h${-w * 0.62}a${h / 2} ${h / 2} 0 0 0 0 ${h}h${-w * 0.5}a${h / 2} ${
      h / 2
    } 0 0 1 0 ${-h}h${w * 0.12}a${h / 2} ${h / 2} 0 0 0 0 ${-h}Z" fill="${c}"/>`;
  o +=
    cloud(120, 470, 330, 13, '#fbe9d4') +
    cloud(520, 418, 260, 11, '#fbe9d4') +
    cloud(40, 560, 220, 11, '#f9dcc2') +
    cloud(700, 500, 190, 10, '#f9dcc2') +
    cloud(1230, 384, 170, 10, '#fbe9d4');
  // gulls
  let gulls = '';
  [
    [392, 520, 9],
    [424, 506, 7],
    [452, 528, 6],
    [640, 462, 7],
    [300, 606, 6],
  ].forEach(([x, y, r]) => {
    gulls += `M${x - r} ${y}q${r / 2} ${-r * 0.7} ${r} 0q${r / 2} ${-r * 0.7} ${r} 0`;
  });
  o += `<path class="cv-gull" d="${gulls}" stroke="${C.ink}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;

  o += `<g transform="translate(0 ${GROUND}) scale(1 ${K}) translate(0 ${-GROUND})">`;
  // far shore and the mountain
  o += `<path d="M0 716 C200 700 380 704 560 690 C720 678 800 640 900 604 C1000 570 1080 548 1160 548 C1260 548 1350 580 1440 596 V${GROUND} H0Z" fill="${C.haze}"/>`;
  o += `<path d="M640 ${GROUND} C740 716 800 668 870 624 C912 598 944 568 990 556 C1030 545 1056 560 1090 540 C1124 520 1150 498 1190 496 C1232 494 1256 520 1290 530 C1330 542 1352 536 1380 556 C1404 573 1424 590 1440 600 V${GROUND}Z" fill="${C.hill}"/>`;
  let back = '';
  BACK.forEach(([x, w, h]) => {
    back += `M${x} ${GROUND}V${GROUND - h}h${w}V${GROUND}Z`;
  });
  o += `<path d="${back}" fill="${C.back}"/>`;

  // Old Port: grain silos, sheds and the clock tower
  let port = '';
  for (let i = 0; i < 9; i++)
    port += `M${150 + i * 17} ${GROUND}V686a8.5 8.5 0 0 1 17 0V${GROUND}Z`;
  port += `M303 ${GROUND}V664h34V${GROUND}Z M337 ${GROUND}V700h70V${GROUND}Z`;
  port += `M60 ${GROUND}V718h76V${GROUND}Z M430 ${GROUND}V722h96V${GROUND}Z`;
  port += `M468 ${GROUND}V664h-3v-6h3V640h3l5-12 5 12h3v18h3v6h-3V${GROUND}Z`;
  o += `<path d="${port}" fill="${C.ink}"/>`;
  o += `<circle cx="476" cy="650" r="3.2" fill="${C.gold}"/>`;
  let portlit = '';
  for (let i = 0; i < 6; i++) portlit += `M${346 + i * 10} 714h5`;
  for (let i = 0; i < 8; i++) portlit += `M${438 + i * 11} 731h5`;
  for (let i = 0; i < 6; i++) portlit += `M${68 + i * 11} 728h5`;
  o += `<path d="${portlit}" stroke="${C.gold}" stroke-width="2" fill="none"/>`;

  // the towers
  let body = '';
  let lit = '';
  let litB = '';
  TOWERS.forEach(([x, w, h, kind], n) => {
    const top = GROUND - h;
    if (kind === 'step') {
      body += `M${x} ${GROUND}V${top + 22}h${w * 0.2}V${top + 9}h${w * 0.18}V${top}h${w * 0.24}V${
        top + 9
      }h${w * 0.18}V${top + 22}h${w * 0.2}V${GROUND}Z`;
    } else if (kind === 'point') {
      body += `M${x} ${GROUND}V${top + 30}L${x + w / 2} ${top}L${x + w} ${top + 30}V${GROUND}Z`;
    } else if (kind === 'cross') {
      body += `M${x} ${GROUND}V${top + 10}h${w * 0.3}V${top}h${w * 0.4}V${top + 10}h${
        w * 0.3
      }V${GROUND}Z`;
    } else {
      body += `M${x} ${GROUND}V${top}h${w}V${GROUND}Z`;
      if (kind === 'mast') body += `M${x + w / 2 - 1} ${top}v-26h2v26Z`;
    }
    const rows = Math.floor((h - 30) / 7);
    for (let r = 0; r < rows; r++) {
      const k = (n * 7 + r * 3) % 11;
      if (k < 5) {
        const len = 5 + ((n + r) % 3) * 4;
        const off = 4 + ((n * 5 + r * 2) % Math.max(1, Math.floor(w - len - 8)));
        if ((n + r) % 3 === 0) litB += `M${(x + off).toFixed(1)} ${top + 26 + r * 7}h${len}`;
        else lit += `M${(x + off).toFixed(1)} ${top + 26 + r * 7}h${len}`;
      }
    }
  });
  o += `<path d="${body}" fill="${C.ink}"/>`;
  o += `<path d="${lit}" stroke="${C.gold}" stroke-width="1.6" fill="none"/>`;
  o += `<path class="cv-tw" d="${litB}" stroke="${C.gold}" stroke-width="1.6" fill="none"/>`;
  o += `</g>`;
  const summit = GROUND - (GROUND - 496) * K;
  o += `<path d="M1190 ${summit}v-38M1179 ${summit - 26}h22" stroke="${
    C.gold
  }" stroke-width="2.6"/>`;

  // the river
  o += `<rect x="0" y="${GROUND - 1}" width="1440" height="160" fill="url(#cvriver)"/>`;
  let water = '';
  [
    [40, 760, 210],
    [330, 760, 120],
    [520, 764, 70],
    [1180, 762, 200],
    [120, 774, 90],
    [270, 776, 260],
    [600, 778, 140],
    [1000, 776, 120],
    [30, 790, 160],
    [420, 792, 110],
    [760, 792, 200],
    [1260, 794, 150],
    [200, 808, 240],
    [560, 810, 90],
    [900, 808, 160],
    [1120, 812, 220],
    [60, 826, 120],
    [380, 828, 300],
    [820, 828, 110],
  ].forEach(([x, y, l]) => {
    water += `M${x} ${y}h${l}`;
  });
  o += `<path class="cv-water" d="${water}" stroke="${C.cream}" stroke-width="1" opacity=".5" fill="none"/>`;
  let glow = '';
  [884, 930, 973, 806, 1055, 722, 1134, 476].forEach((x, i) => {
    for (let k = 0; k < 5 - (i % 2); k++)
      glow += `M${x - 7 + k * 1.5} ${760 + k * 8}h${14 - k * 3}`;
  });
  o += `<path class="cv-tw" d="${glow}" stroke="${C.gold}" stroke-width="1.6" opacity=".9" fill="none"/>`;
  // the river ferry
  o += `<g class="cv-ferry"><path d="M236 786h96l-10 12h-78Z" fill="${C.navy}"/><path d="M256 786v-9h52v9Z M270 777v-6h22v6Z" fill="${C.cream}"/><path d="M262 781h4m6 0h4m6 0h4m6 0h4m6 0h4" stroke="${C.gold}" stroke-width="2"/><path d="M281 771v-12" stroke="${C.navy}" stroke-width="1.4"/></g>`;

  // Jacques-Cartier bridge
  let br = 'M700 752H1440M700 736H1440';
  for (let bx = 700; bx < 1440; bx += 16) br += `M${bx} 752l8-16l8 16`;
  br += 'M900 736Q1020 640 1140 736';
  for (let bx = 916; bx < 1140; bx += 16) {
    const t = (bx - 900) / 240;
    br += `M${bx} ${(736 - 4 * 48 * t * (1 - t)).toFixed(1)}V736`;
  }
  o += `<path d="${br}" fill="none" stroke="${C.gold}" stroke-width="1.5"/>`;
  [780, 900, 1140, 1300].forEach(px => {
    o += `<path d="M${px} 752V806" stroke="${C.gold}" stroke-width="2.4"/>`;
  });
  return o;
};
