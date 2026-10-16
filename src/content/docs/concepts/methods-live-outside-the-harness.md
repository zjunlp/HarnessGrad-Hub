---
title: Methods live outside the harness
description: A method is handed a pristine copy of a base harness and returns candidates; the platform measures those candidates itself.
---

**A method is external to the harness.** It is handed a pristine copy of a base harness
and produces candidate harnesses; the platform then measures those candidates itself, on
its own fixed task set, with its own scorer.

```
        base harness (yours, or ours)
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
   method A   method B   control      ← all outside the platform's harness
     └───────────┼───────────┘
                 ▼
      candidate harnesses
                 │
                 ▼
     platform measures every one      ← same tasks, same scorer, for all methods
```

The first design put the method *inside* the harness. That made it inseparable from one
artifact: it could only ever improve the harness it shipped with, and two methods could
not be compared because each faced a different starting point. Keeping methods external is
what makes "the same method applied to any base harness" possible at all — and it is why a
method can no longer be part of what is being measured.

## Why subprocesses, never imports

The old in-harness design had the method implement two entrypoints the harness declares in
`harness.json`:

```json
"improve_entrypoint": ["python", "-m", "method.improve"],
"accept_entrypoint":  ["python", "-m", "method.accept"]
```

The platform invoked them as **subprocesses**. That is not a style choice: an imported
module is frozen at load time, and the thing this platform exists to measure is a harness
that **rewrites its own improvement mechanism**. Importing does not complicate that case,
it makes it unrepresentable.

## The boundary becomes measurable, not declarable

Because the method lived inside the artifact under evolution, every curve point could
record `editable_surface_touched`, read from `git diff`:

```
control method (returns the base)      touched: []                score 0.00
a real method  (edits the harness)     touched: ['agent.py']      score 1.00
```

`"method/accept.py"` appearing there would mean the method rewrote its **own acceptance
rule** — the line most published systems state they do not cross. So the platform has no
"real RSI" mode: a declared mode would be a self-report, and the genuine/pseudo
distinction is a reading, not a setting.

## Two execution modes

They differ only in who owns the schedule:

- **Mode A — platform-driven.** The platform owns the loop and calls the method once per
  round for one step. Maximum comparability.
- **Mode B — method-driven.** The method runs its own search loop in its own process and
  returns a whole trajectory — it writes a trajectory file, and the platform resolves and
  scores the states it names. For methods that already exist and must not be re-wired in
  order to be measured: an annealed fixed-round budget, or an archive.

Both write the same `curve.jsonl`, so curves from either land on one axis.
