---
date: '2026-01-04'
slug: 'tailfm'
title: 'TailFM'
package: 'PyTorch · amortized inference'
overline: 'Deep learning for extremes'
scene: 'tail'
question: 'Can a neural network learn how heavy a tail is — and how often extremes arrive together?'
cover: './cover.jpg'
figure: './figure.png'
figureAlt: 'Held-out evaluation across three training seeds and three copula families: the paired neural minus Hill tail-index error is positive everywhere, and neural asymptotic dependence errors are shown alongside.'
figureCaption: 'Held-out evaluation: three fitted models, 64 shared simulated worlds per copula family. Positive values favour the classical Hill estimator.'
results:
  - value: 'Identifiability'
    label: 'An audit showed the original rank-only design could not recover tail shape; I rebuilt it as a two-pathway magnitude / copula model.'
  - value: '9 of 9'
    label: 'Seed × family comparisons where Hill still wins on ξ (+0.06 to +0.12 MAE) — reported as found, not tuned away.'
github: ''
external: ''
tech:
  - PyTorch
  - DeepSets
  - Simulation design
  - pytest
---

An auditable experimental system: simulated worlds with known truth, explicit statistical targets, classical baselines on the same held-out data, configured RNG streams, versioned checkpoints and generated reports, with a coverage gate in CI.
