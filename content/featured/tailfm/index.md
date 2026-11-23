---
date: '2026-01-04'
slug: 'tailfm'
title: 'Selection-valid tail-index inference'
package: 'Python · preprint, 2026'
overline: 'Extreme value theory · Independent'
scene: 'tail'
question: 'Can an interval for how heavy a tail is stay honest after you pick the threshold by looking at the data?'
cover: './cover.jpg'
figure: './figure.png'
figureAlt: 'Danish fire-insurance losses: at thresholds k = 19, 39, 79, 158 and 317, the union band, a generalised-Pareto band and the first-order band for the tail index; a shaded stripe marks where all union bands overlap, from 0.52 to 0.84.'
figureCaption: 'From the preprint: Danish fire-insurance losses (n = 2,167), bands for the tail index at five thresholds. The shaded stripe is the intersection of the union bands.'
results:
  - value: '16 of 16'
    label: 'Pre-registered settings where the band kept coverage after four rules for choosing k; the usual interval at a chosen k fell below 80% in 12 of them, as low as 3%.'
  - value: 'Preprint'
    label: 'Proves a Bernstein–von Mises theorem at a misspecified working ρ′ and a coverage bound over the whole ρ range, with width shrinking like 1/√k. Code and every reported number archived on Zenodo (DOI 10.5281/zenodo.24022373).'
github: 'https://github.com/EllenSyuu/tailfm-union-band'
external: ''
tech:
  - Python
  - NumPy · SciPy · SymPy
  - Pre-registered simulation
  - pytest
---

The tail index of a heavy-tailed distribution is estimated from the k largest observations, and k is chosen after looking at the data — yet the interval reported is the one at the chosen k, as if it had been fixed. Under second-order bias its coverage can collapse. The preprint builds intervals that stay valid after any data-driven choice of k from a grid, without estimating the second-order parameter ρ: the hull, over a range of working ρ′, of simultaneous bands from an extended-Pareto posterior. The benchmark was pre-registered and run once on frozen code; a failure for very slow second-order decay is reported, not hidden. It grew out of TailFM, a neural estimator that an honest audit showed the classical Hill estimator still beat.
