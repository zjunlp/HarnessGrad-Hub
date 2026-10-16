---
title: Why the method must live outside the harness
date: 2026-10-16
---

The first design of this platform put the method *inside* the harness. The method
implemented two entrypoints that the harness declared in `harness.json`, and the platform
invoked them as subprocesses:

```json
"improve_entrypoint": ["python", "-m", "method.improve"],
"accept_entrypoint":  ["python", "-m", "method.accept"]
```

It seemed natural: the method improves *this* harness, so it lives with *this* harness. It
turned out to make the central measurement impossible, and the reason is worth writing
down, because the fix looks like a refactor and is actually the whole point.

## The problem with a method that ships inside the artifact

If the method lives inside the harness repository, it is inseparable from one artifact. It
can only ever improve the harness it shipped with. Two methods cannot be compared, because
each faces a different starting point — and "the same method applied to a different base
harness" becomes unrepresentable rather than merely untested.

So the method moved out. A method is now handed a pristine copy of a base harness and
returns candidate harnesses; the platform measures those candidates itself, on its own
fixed task set, with its own scorer. That is what makes a shared axis possible at all.

## Why subprocesses and not imports

Even in the old design the entrypoints were invoked as subprocesses, never imported, and
that was not a style preference. An imported module is frozen at load time. The case this
platform exists to measure is a harness that **rewrites its own improvement mechanism**.
Importing does not complicate that case — it makes it unrepresentable.

## Keeping the boundary measurable

There is a real cost to moving the method out: the line between "the method" and "the
harness" stops being obvious from the file layout. The platform's answer is to measure it
rather than assert it. Because the method and the harness both live in the candidate tree,
every curve point records `editable_surface_touched`, read from `git diff`:

```
control method (returns the base)      touched: []                score 0.00
a real method  (edits the harness)     touched: ['agent.py']      score 1.00
```

`"method/accept.py"` appearing in that list would mean the method rewrote its **own
acceptance rule** — the line most published systems state they do not cross. This is also
why the platform has no "real RSI" mode. A declared mode would be a self-report; the
genuine/pseudo distinction is a reading of the diff, not a setting.

## The same axis for both execution styles

Some methods already exist and cannot be re-wired just to be measured — one owns an
annealed fixed-round budget, another an archive. So there are two modes, differing only in
who owns the schedule. In **Mode A** the platform owns the loop and calls the method once
per round for one step; in **Mode B** the method runs its own search and returns a whole
trajectory, and the platform resolves and scores the states it names.

Both write the same `curve.jsonl`. That is the point: a method's internal schedule is its
own business, and the curve is the platform's.

## The general lesson

The instrument and the thing it measures have to be separable *by construction*, not by
convention. Every design choice above — external methods, subprocess invocation, a measured
editable surface, one curve format for both modes — follows from taking that seriously.
