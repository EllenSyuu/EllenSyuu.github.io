---
date: '2026-01-02'
slug: 'covarchimax'
title: 'Covariate-dependent Archimax copulas'
package: 'covarchimax · R package'
overline: 'M.Sc. thesis · McGill 2026'
scene: 'quebec'
question: 'Does heavy rain hit several places at the same time — and is that changing?'
cover: './cover.jpg'
figure: './figure.png'
figureAlt: 'Two panels for southern Québec, 1930–2017. Left: mean monthly maximum precipitation by season, before and after 1975, higher after 1975 in Aug–Sep and Oct–Nov. Right: six-station extremal coefficient by season, near 6 (independence) in June–July and lowest in Oct–Nov.'
figureCaption: 'Southern Québec, 1930–2017. Magnitude (left) and spatial co-occurrence (right) of precipitation extremes respond to different covariates.'
results:
  - value: '3.90 vs 5.73'
    label: 'Six-station extremal coefficient: autumn storms strike together, early-summer extremes are close to independent (difference 1.83, 90% CI 1.24–2.28).'
  - value: '+3.2 mm'
    label: 'Rise in mean October–November monthly maxima, 1976–2017 vs 1930–75 (Welch t-test on station-months pooled over the six stations; p < 0.001, also after a Bonferroni correction over the four seasons). Magnitude and co-occurrence move separately.'
github: 'https://github.com/EllenSyuu/SAC-thesis-2026'
external: ''
tech:
  - R
  - Extreme value theory
  - Archimax copulas
  - Block bootstrap
  - GitHub Actions
---

A new maximum-likelihood estimator for a covariate-dependent Pickands dependence function, shipped as a tested R package and applied to 88 years of records from six ECCC stations. Every table and figure regenerates from raw data with one `make all`, each with an uncertainty statement.
