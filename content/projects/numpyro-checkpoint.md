---
date: '2026-11-22'
title: 'NumPyro Checkpoint'
github: 'https://github.com/EllenSyuu/numpyro-checkpoint'
external: ''
tech:
  - NumPyro
  - JAX
  - pytest
company: 'Open source'
showInProjects: true
---

Resumable MCMC for long Bayesian fits: a run killed by a crash or a walltime limit picks up from its last saved chunk, and the final draws are bit-identical to an uninterrupted run. Refuses to resume on changed data, settings or library versions, and reuses compiled code so frequent checkpoints stay cheap.
