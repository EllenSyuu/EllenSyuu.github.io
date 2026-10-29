---
date: '2026-01-03'
slug: 'vvi'
title: 'VVI · Hybrid immunity in calendar time'
package: 'Python package · from my HKU final-year project'
overline: 'Biostatistics · public health'
scene: 'immunity'
question: 'Does a booster before your first Omicron infection protect you — or imprint you?'
figure: './figure.png'
figureAlt: 'Synthetic validation: estimated hazard ratios for each vaccination–infection profile sit on top of the true values planted in the simulation.'
figureCaption: 'Synthetic validation: the fitted hazard ratios recover the values planted in a simulated cohort.'
results:
  - value: '5×10⁸ → 17,520'
    label: 'Person-days collapsed into sufficient statistics (people at risk and events per covariate cell × calendar day) — same MLE, same standard errors, no sub-sampling.'
  - value: '1M people · 13 s'
    label: 'A million-person synthetic cohort fits in 13 s and 0.3 GB; the person-day route runs out of memory beyond about 5,000 people on the same machine.'
github: ''
external: ''
tech:
  - Python
  - cloglog GLM
  - B-splines
  - pytest
  - Synthetic data only
---

My final-year project at HKU (STAT4799, 2023–24, supervised by Dr. Eddy K. F. Lam) compared protection against Omicron reinfection across vaccination–infection histories — Comirnaty (B) and CoronaVac (S), two to four doses, before a first infection (I) — in territory-wide linked records. Those records are licensed and never leave their environment, so VVI is a clean-room re-implementation: a tested package for grouped-time proportional-hazards models in calendar time, validated on simulated cohorts with known truth.
