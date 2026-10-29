"""Compose the README images (docs/showcase.png, docs/sections.png) from captured screenshots.

Usage: python compose.py <screenshot_dir> <out_dir>
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
S, OUT = sys.argv[1], sys.argv[2]
mono = lambda n: ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", n)
sans = lambda n: ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", n)

def bg(w, h):
    y, x = np.mgrid[0:h, 0:w]
    a = np.array([251, 246, 236]); b = np.array([241, 222, 196])
    t = ((x / w) * 0.55 + (y / h) * 0.45)[..., None]
    return Image.fromarray((a * (1 - t) + b * t).astype('uint8'))

def shadow(base, box, radius, blur=40, offset=(0, 24), alpha=70):
    sh = Image.new('L', base.size, 0)
    d = ImageDraw.Draw(sh)
    x0, y0, x1, y1 = box
    d.rounded_rectangle((x0 + offset[0], y0 + offset[1], x1 + offset[0], y1 + offset[1]), radius, fill=alpha)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    base.paste(Image.new('RGB', base.size, (84, 52, 26)), (0, 0), sh)

def rounded(img, r):
    m = Image.new('L', img.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, *img.size), r, fill=255)
    out = Image.new('RGBA', img.size); out.paste(img, (0, 0), m); return out

def browser(shot, w, url):
    bar = 64
    s = shot.resize((w, int(shot.height * w / shot.width)), Image.LANCZOS)
    win = Image.new('RGB', (w, s.height + bar), (255, 255, 255))
    d = ImageDraw.Draw(win)
    d.rectangle((0, 0, w, bar), fill=(241, 242, 244))
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        d.ellipse((28 + i * 30, 24, 44 + i * 30, 40), fill=c)
    d.rounded_rectangle((w * 0.3, 14, w * 0.7, 50), 18, fill=(255, 255, 255))
    d.text((w / 2, 32), url, font=mono(22), fill=(75, 85, 101), anchor='mm')
    win.paste(s, (0, bar))
    return rounded(win, 22)

def phone(shot, w):
    s = shot.resize((w, int(shot.height * w / shot.width)), Image.LANCZOS)
    pad = 18
    body = Image.new('RGB', (w + 2 * pad, s.height + 2 * pad), (42, 28, 19))
    body.paste(rounded(s, 38), (pad, pad), rounded(s, 38))
    return rounded(body, 56)

# 1) hero showcase
W, H = 2400, 1350
can = bg(W, H)
desk = browser(Image.open(f'{S}/desktop-hero.png').convert('RGB'), 1780, 'ellensyuu.github.io')
dx, dy = 110, 120
shadow(can, (dx, dy, dx + desk.width, dy + desk.height), 22)
can.paste(desk, (dx, dy), desk)
ph = phone(Image.open(f'{S}/mobile-hero.png').convert('RGB'), 470)
px, py = W - ph.width - 110, H - ph.height - 70
shadow(can, (px, py, px + ph.width, py + ph.height), 56, alpha=110)
can.paste(ph, (px, py), ph)
can.save(f'{OUT}/showcase.png', optimize=True)

# 2) section gallery (2 x 2)
tiles = [('about', 'About'), ('focus', 'What I Do'), ('jobs', 'Experience'), ('impact', 'Beyond the Code')]
TW, TH, G, M = 1120, 720, 60, 90
gal = bg(2 * TW + G + 2 * M, 2 * TH + G + 2 * M + 80)
for i, (name, label) in enumerate(tiles):
    src = Image.open(f'{S}/' + (f'section-{name}.png' if name != 'archive' else 'archive.png')).convert('RGB')
    pad = 0 if name == 'archive' else 56
    inner = TW - 2 * pad
    sc = inner / src.width
    src = src.resize((inner, int(src.height * sc)), Image.LANCZOS)
    card = Image.new('RGB', (TW, TH), (251, 246, 236))
    card.paste(src.crop((0, 0, inner, min(TH - pad, src.height))), (pad, pad // 2))
    card = rounded(card, 18)
    x = M + (i % 2) * (TW + G); y = M + 80 + (i // 2) * (TH + G)
    shadow(gal, (x, y, x + TW, y + TH), 18, blur=30, offset=(0, 16), alpha=55)
    gal.paste(card, (x, y), card)
    ImageDraw.Draw(gal).text((x, y - 50), f'0{i+1}  {label}', font=mono(28), fill=(168, 61, 27))
gal = gal.resize((gal.width * 2 // 3, gal.height * 2 // 3), Image.LANCZOS)
gal.save(f'{OUT}/sections.png', optimize=True)
print(can.size, gal.size)
