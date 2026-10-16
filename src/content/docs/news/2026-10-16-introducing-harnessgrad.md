---
title: Introducing HarnessGrad
date: 2026-10-16
---

HarnessGrad is a platform for running and comparing harness self-improvement methods, and
this site is its new front page.

## The problem it exists for

Every harness-evolution method reports a final score delta. None of them can say what that
delta is *made of*, and none report it on a curve a reader can compare against another
method's. The field has no shared training signal.

HarnessGrad defines one: a base harness, a fixed task set, a sampling loop, and a curve
point that records the harness state, the two models involved, the score with an interval,
and the compute spent to get there. The repository does not propose an RSI method — it
builds the instrument that makes such methods comparable.

## What is usable today

- **The local demo runs end to end** with zero network and zero cost, exercising the loop,
  the curve points, the checkpoints and the cost accounting. See
  [Getting started](/HarnessGrad/getting-started/).
- **The measurement contract is written down** in the repository's `INTERFACE.md`: what a
  harness may declare, and what the platform guarantees.
- **Isolation and comparability are enforced rather than promised.** A harness cannot see
  the platform while it runs, and the plotting tool refuses to put runs made under
  different isolation rules on one axis.
- **The tests are runnable per dataset**, so a contributor does not have to run the whole
  suite to check one change.

## What is deliberately not claimed

Local results are not production evidence. A demo or diagnostic run grants no production
or H0 authorization, and per-dataset gaps in runtime, quota, snapshot and cleanup
enforcement are recorded with a disposition rather than smoothed over.

No dataset has been chosen yet, and the metric is defined no further than "defined on a
task set and pairable". Contamination — whether the agent model has seen the benchmark
tasks — is not detectable from inside the framework, and is the largest known threat to
the validity of any curve.

## Where to start

Read [Getting started](/HarnessGrad/getting-started/) to run the demo, then
[Status and limits](/HarnessGrad/status/) before quoting any number.
