# Redesign record — the editorial scientific atlas

Branch `redesign/editorial-atlas`. Not merged into `main`; the live site is unchanged until it is.

Before/after screenshots are in this folder: `compare-1440-<section>.jpg` (desktop, at half size) and `compare-390-<section>.jpg` (phone), plus `compare-*-hero.jpg`.

## 1. Visual audit of the previous site (below the cover)

| Section | Problem | Files | Replacement |
| --- | --- | --- | --- |
| By the numbers | Five boxed statistics in a SaaS-style strip; the first figure was clipped at the left edge; "97% test coverage" read as marketing | `sections/stats.js` | Removed. The numbers live in the case studies, next to their evidence |
| About | Polaroids with tape and tilt; a dot-and-line "path" widget; languages as five bordered pills; content column 180 px in from the cover's margin | `sections/about.js` | Magazine opening: the full-frame whiteboard photograph, a profile column of plain facts, a lede in Bodoni, the second photograph offset in the margin |
| Experience | Peach hatched bars with drawn end ticks; a hand-lettered note; details hidden behind seven tabs | `experience-timeline.js`, `sections/jobs.js` | Figure 1, a plain range chart (ink rules, vermilion for current roles, hairline years); every principal role shown as a dated entry |
| What I do | Three identical cards ("Thread A/B/C") | `sections/focus.js` | Three rows: the question large on the left, the answer, methods and evidence links on the right |
| Selected work | Hand-assembled SVG metaphors: a city skyline standing in for epidemic curves (VVI), stacked paper sheets (SDG), an axonometric terrain with rain clouds (Québec); peach glow blobs; floating "choose a…" control cards; fat pill-shaped bars (TailFM) | `cases/*` (≈2,000 lines) | Eight journal-style figures drawn from each project's own published numbers (see §3) |
| Other projects | Six identical cards with "N° 01…06"; a Show more button | `sections/projects.js` | A grouped index: research & methods, software & tools, study notebooks |
| Beyond the code | Clip-art globe, open book and blackboard on peach gradients — also on `/impact` and on each story page | `sections/impact.js`, `impact/card.js`, `templates/post.js` | Three stories as newspaper columns, no images; the ledger kept and refined. Placeholder covers ("Photo placeholder") can no longer appear on story pages |
| Contact | Centred form under a numbered heading | `sections/contact.js` | Same Web3Forms form, set as the closing page with an "Elsewhere" column |
| Site-wide | Section numbers 01–06 and a numbered chapter rail that overlapped content once columns aligned with the cover; brush-stroke highlighter on titles; cursor spotlight and reading-progress bar; maple leaf following the cursor; footer crediting the design to Brittany Chiang although the design is no longer hers | `ambient.js`, `chapter-map.js`, `mark-observer.js`, `cursor-trail.js`, `footer.js` | Removed from the home page; the footer is a colophon in the cover's issue-bar style with an accurate code credit (MIT) |

## 2. Art direction

Everything is derived from the cover (`src/components/sections/hero.js`, `src/utils/cover-scene.js`, untouched):

- **Margins.** Sections use the cover's own page margin, `clamp(22px, 5.5vw, 80px)`, so every column lines up with the masthead. A 12-column grid allows deliberate asymmetry.
- **Section openings.** The cover's double-ruled issue bar (11 px Inter, 0.22 em tracking) opens every section, with a Bodoni Moda headline and a Bodoni standfirst. No numbers.
- **Palette.** `COVER` constants only: paper `#f6f0e4`, ink `#14213a`, vermilion `#c8431f` (with `#a3331a` for small text, to pass WCAG AA), gold `#e0ad4a`, and the cover's river `#3f6f96`, hill `#7d9cb4` and haze `#bccbd5` for data. No gradients, glows or shadows.
- **Type.** Bodoni Moda (upright only) for headlines, decks and figures of note; Inter for text, captions and chart labels with tabular figures.
- **Rhythm.** One section sits on a deeper paper (`#efe6d3`) to vary the pace; case studies use four different layouts (wide figure, map plus side figure, text beside figures, figure pair).
- **Motion.** Kept to the cover (its snow, birds and boat). Sections below do not animate.

Shared pieces: `src/components/editorial.js` (tokens, `Page`, `SectionHead`, `Figure`, chart helpers). Figures: `src/components/figures/`.

## 3. Illustration inventory

| Item | Status | Source of every number / asset |
| --- | --- | --- |
| Cover painting, masthead, cover motion | **Retained, unchanged** | — |
| Whiteboard photograph | **Retained**, now full-frame (3:2) from the original in the project files, EXIF stripped | Ellen's own photograph |
| Autumn photograph | **Retained** | Ellen's own photograph |
| Fig. 1 — roles since 2020 | **Replaced** (range chart) | Existing month-exact role data |
| Fig. 2 — SDG 4.c.1 in four releases | **Replaced** (was stacked-sheets drawing) | `EllenSyuu/SDG` synthetic generator, seed 42 (values already on the site; match the repo's `figure.png`) |
| Fig. 3 — Québec dependence maps | **Replaced** (was terrain/cloud drawing) | Station coordinates: `SAC-thesis-2026/data/processed/stations.csv`; λ_U: `results/tables/tab_07_tail_dependence_empirical.csv`; base map: Natural Earth 10 m land, lakes, rivers, boundaries |
| Fig. 4 — extremal coefficient by season | **New** | `SAC-thesis-2026/results/tables/tab_20_bootstrap_theta_eta.csv` |
| Fig. 5 — VVI recovered vs planted hazard ratios | **Replaced** (was harbour skyline) | `EllenSyuu/VVI` README, "Validated against a planted ground truth" |
| Fig. 6 — VVI build-and-fit time | **Replaced** | `EllenSyuu/VVI/docs/benchmark.md` |
| Fig. 7 — Danish fire losses, bands at five k | **Replaced** (was pill bars) | `tailfm-union-band/paper/preprint/generated/tab_danish.tex`, `reports/phase3/danish.json` |
| Fig. 8 — pre-registered coverage benchmark | **Replaced**, now includes the four out-of-range failures | `tailfm-union-band/paper/preprint/generated/tab_bench.tex` |
| Case-study scenes (`cases/*`), story vignettes (`impact/vignette.js`) | **Removed from all pages** (files left in the repo, unused) | — |
| `content/impact/*/cover.jpg`, `content/featured/*/cover.jpg` | Not displayed anywhere (they are placeholders / generated charts) | — |

Synthetic and real data are labelled in every caption: SDG and VVI figures are synthetic; the Québec and Danish figures are real public data; the benchmark is simulation.

## 4. Assets and licensing

- **Natural Earth** 10 m vectors (land, lakes, North-America rivers and lakes, admin-0/admin-1 boundaries), public domain — <https://www.naturalearthdata.com/about/terms-of-use/>. Credited in the figure caption and the footer. Extract: `src/components/figures/quebec-geo.json` (23 KB).
- **Photographs**: Ellen's own.
- **Fonts**: Bodoni Moda, Inter (SIL OFL), already self-hosted via Fontsource.
- No stock images, no generated illustrations, no third-party figures.

## 5. Verification

- `npx gatsby build` passes (the `ERROR UNKNOWN` and tag-template warnings are pre-existing on `main`).
- Screenshots at 1440, 1280, 768 and 390 px: no horizontal scrolling, no console or page errors, no clipped or overlapping text found on inspection.
- Cover: pixel comparison before/after differs only where the animated birds, boat and snow are mid-flight (0.2% of pixels).
- Links: all 20 internal links and anchors resolve; every external repository link answers.
- Accessibility (axe-core, WCAG 2 A/AA) on the home page: 0 violations (previously 17 contrast failures). Form fields now have explicit `for`/`id` labels; every chart has a text alternative.
- Weight: about 1.1 MB transferred on first load at 1440 px (1.0 MB before); the larger About photograph accounts for the difference. The ambient canvas, cursor trail and scroll observers no longer run.

## 6. Unresolved items for Ellen

1. **VVI claim.** The case-study evidence line "the person-day route runs out of memory beyond about 5,000 people" (in `content/featured/vvi/index.md`) is not in the VVI repository, whose benchmark stops at 5,000 people. The new Fig. 6 shows only what was measured. Keep the sentence only if you ran it beyond 5,000.
2. **Secondary pages.** `/impact`, story pages and `/archive` keep their older layout (now without clip art). Their small red labels still miss AA contrast — a quick follow-up if you want them restyled too.
3. **JobVeyra.** "Claude Code plugin" was removed from its tech list, following your rule that the site never names an AI tool. Put it back if you want it shown.
4. **FM Notebook** says 108 drill types; an earlier build had 125. Check which number is current.
5. **Story photographs.** None of the three stories has a real photograph yet. When you have one, adding `cover:` back to the story will show it.
