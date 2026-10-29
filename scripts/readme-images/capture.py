"""Capture high-resolution screenshots of a running build (desktop 1440px @2x, mobile 390px @3x).

Usage: python capture.py <out_dir> [base_url]   # base_url defaults to http://localhost:9000
"""
import asyncio, sys
from playwright.async_api import async_playwright
OUT=sys.argv[1]; B=sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:9000'
async def settle(pg):
    await pg.wait_for_timeout(3300)
    h=await pg.evaluate('document.body.scrollHeight')
    for y in range(0,h,350):
        await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(110)
    await pg.wait_for_timeout(900)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        c=await b.new_context(viewport={'width':1440,'height':900},device_scale_factor=2); pg=await c.new_page()
        await pg.goto(B+'/',wait_until='load'); await settle(pg)
        await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'{OUT}/desktop-hero.png')
        # Hide fixed chrome (nav, progress bar, spotlight) so section crops are clean.
        await pg.add_style_tag(content='header, .progress-bar, .spotlight { display: none !important; }')
        for sid in ['about','focus','jobs','projects','impact']:
            el=pg.locator(f'section#{sid}').first
            await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(500)
            await el.screenshot(path=f'{OUT}/section-{sid}.png')
        await pg.goto(B+'/archive/',wait_until='load'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{OUT}/archive.png')
        m=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True); mp=await m.new_page()
        await mp.goto(B+'/',wait_until='load'); await settle(mp)
        await mp.evaluate('window.scrollTo(0,0)'); await mp.wait_for_timeout(700)
        await mp.screenshot(path=f'{OUT}/mobile-hero.png')
        await b.close()
asyncio.run(main())
