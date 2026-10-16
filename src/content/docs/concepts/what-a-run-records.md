---
title: What a run records
description: The curve point, the two halves of a run on disk, and the isolation label that keeps incomparable numbers apart.
---

A curve point is the unit the whole platform is built to produce. It records the harness
state, the two models involved, the score with an interval, and the compute spent to get
there. The point is not any single number — it is that the number arrives with what it was
produced by.

## The curve point

Every round appends one point to `curve.jsonl`:

| Recorded | Why it is there |
| --- | --- |
| the harness state (a commit sha) | so a score can be traced to the exact artifact that produced it |
| both models involved | the agent under test and the improvement model are separate roles |
| the score **with an interval** | a bare delta hides its own resolution |
| the compute spent | a curve that cannot be costed cannot be compared to another method's |
| `generation_tokens` | a declared field, never hardcoded — a zero here is a claim, so it has to be a real one |
| `editable_surface_touched` | read from `git diff`, so the boundary between method and harness is measured rather than asserted |
| `env.harness_runtime` | which interpreter ran the harness, and where its dependencies came from |

Because the interval is part of the point, the platform states the step size a score can
actually move in. A run scored on four tasks says so:

```
! this run scores 4 tasks — the score moves in steps of 0.250
```

## Two halves on disk, deliberately not in the same place

| | where | why |
| --- | --- | --- |
| the **record** | `runs/<run-id>/` | `curve.jsonl` and `run_meta.json`; what happened, kept with the platform |
| the **working tree** | `../harnessgrad_work/<run-id>/workspace/` | the harness copy and every checkpoint commit; outside the platform, so a harness cannot reach the driver or `.env` by `..` |

The working tree holds the git history of every checkpoint, so it is not disposable until
the run is exported. `--work-root` moves it, and the driver refuses to start if it would
land inside the platform.

## Isolation is part of the result

Each task's harness runs inside a mount namespace, where the platform is not present at
all: the path is an empty mount point, not a refused read. `--no-sandbox` turns that off
for debugging, and `run_meta.json` records which mode a run used.

`tools/plot_curve.py` labels each run's isolation and **refuses to silently mix them**.
Runs made under different sandbox plans, or before the sandbox existed, would put numbers
on the same axis that were produced under different rules; the tool says so and exits
non-zero instead.
