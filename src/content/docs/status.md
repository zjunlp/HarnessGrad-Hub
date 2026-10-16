---
title: Status and limits
description: What the platform has decided, what it has not, and what a local number may not be used to claim.
---

Read this before quoting any number this platform produces.

## Limits of the current implementation

- **The mount namespace constrains the filesystem and nothing else.** A harness keeps the
  network and the agent's API key — it cannot run without them — so it could exfiltrate
  that key. Closing this needs egress filtering; see `INTERFACE.md` §4.8.
- **`--no-sandbox` is a debugging decision, never an automatic fallback.** Runs with and
  without it are **not comparable**, and `tools/plot_curve.py` refuses to silently mix runs
  made under different isolations.
- **Contamination is not detectable from inside the framework.** Whether the agent model
  has seen the benchmark tasks is the largest known threat to the validity of any curve
  this produces.
- **Per-dataset enforcement gaps are tracked rather than hidden.** Missing runtime, quota,
  snapshot and cleanup evidence is recorded per dataset, with a disposition, in the
  repository's dataset-blocker registry. Such a gap is never an ordinary zero score.

## Not yet decided

- which dataset;
- the metric definition beyond "defined on a task set and pairable";
- whether improvers get a budget for cheap pre-validation.

## What a local run does not claim

A local demo or diagnostic run grants **no production or H0 authorization**, and is not
evidence that runtime, quota, snapshot or cleanup gates have passed. The CLI default is
staged `diagnostic`, which requires `--policy-evidence`, one task, one trial, one job and
zero improvement rounds; the demo paths that use general sampling are explicitly not
production authorization. Source review and mocked tests establish neither effective
sandbox nor quota enforcement, nor production readiness.

The staged pilot policy and the evidence requirements live in the repository, in
[`AGENTS.md`](https://github.com/zjunlp/HarnessGrad/blob/main/AGENTS.md).
