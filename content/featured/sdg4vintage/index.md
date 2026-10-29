---
date: '2026-01-01'
slug: 'sdg'
title: 'SDG 4 Data Revision Tracker'
package: 'Python · Polars'
overline: 'Official statistics'
scene: 'vintage'
question: 'How much do education statistics change from one data release to the next?'
cover: './cover.jpg'
figure: './figure.png'
figureAlt: 'The same indicator as published in four successive releases: each release adds a year, fills in late data and revises the past; for reference year 2021 the number of countries with a value grows from 16 to 44 across releases.'
figureCaption: 'One indicator, published four times (synthetic data). Each release adds a year, fills in late data and revises the past.'
results:
  - value: '16 → 44'
    label: 'Countries with a 2021 value as successive releases backfill it, in the synthetic test data — why a trend read off one release can mislead.'
  - value: 'Exact match'
    label: 'Pipeline counts of backfilled, retracted and revised values equal a planted ground truth, for several random seeds.'
github: 'https://github.com/EllenSyuu/SDG'
external: 'https://ellensyuu.github.io/SDG/'
tech:
  - Python
  - Polars
  - mypy --strict
  - Hypothesis
  - GitHub Pages
---

Treats every release as a data vintage, the way macroeconomists treat GDP estimates: a typed CLI, a deterministic synthetic generator as ground truth, publication-ready figures and a static interactive explorer. 97% test coverage. An independent, open-source project on synthetic data only — not an official UNESCO product and no UNESCO data.
