---
title: Why scoring is not delegable
description: The platform owns every score and every curve point; a subject that scores itself makes cross-method comparison meaningless.
---

## The division of labour

| Platform owns | The harness (and its method) owns |
| --- | --- |
| which tasks, how many rounds | reading whatever it wants from the traces |
| running the harness, collecting traces | deciding how to modify the harness |
| **all scoring** | — |
| every curve point, ckpt and token | — |

Scoring is not delegable. A subject that scores itself makes every cross-method comparison
meaningless, so the platform measures every candidate itself, on its own fixed task set,
with its own scorer — the same tasks and the same scorer for every method and every
control.

That is the whole reason the platform exists as a separate artifact. If the harness under
evaluation could score its own output, the reported delta would be a self-report, and two
methods could not be placed on one axis.

## What follows from it

- **The method is external to the harness.** It cannot be part of what is being measured,
  because it cannot own the measurement. See
  [Methods live outside the harness](/HarnessGrad/concepts/methods-live-outside-the-harness/).
- **The method is invoked as a subprocess, never imported.** An imported module is frozen
  at load time, and the case this platform exists to measure is a harness that rewrites
  its own improvement mechanism.
- **The platform hashes its own files around every method call.** A method that edits its
  own scorer fails the run: `FAILING RUN`, the paths named, no `curve.jsonl`, exit `3`.

The full contract is
[`INTERFACE.md`](https://github.com/zjunlp/HarnessGrad/blob/main/INTERFACE.md).
