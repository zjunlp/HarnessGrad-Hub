---
title: Getting started
description: Install HarnessGrad and run the local demo end to end, with no network and no cost.
---

## Requirements

`bubblewrap`, `git` and `python3 >= 3.10`. The platform itself has **no third-party
Python packages** — everything it uses is in the standard library.

```bash
./install.sh --check      # verify only; change nothing (also useful in CI)
./install.sh              # optionally install missing dependencies, then verify
```

The script does not stop at "bwrap is installed", because that is not the same as the
sandbox working: a kernel with unprivileged user namespaces disabled, or an AppArmor
policy restricting them (the default on newer Ubuntu), leaves `bwrap` present and failing
at runtime. So it finishes by asking the platform to build a real namespace and look for
itself inside it, and refuses to call the machine ready if that fails — rather than
letting a run fall back to `--no-sandbox` and produce numbers that mean something other
than what they say.

Ordinary local use needs no `sudo`, no dedicated storage volume and no root Docker
access. Quota and evidence backends are optional infrastructure for stronger formal
claims; ordinary runs cannot claim those guarantees.

## Run the local demo

Zero network, zero cost — the loop, the curve points, the checkpoints and the cost
accounting exercised end to end.

```bash
export HG_AGENT_BACKEND=mock
M="python $PWD/methods/echo_base/run.py"

python3 driver.py --dataset demo --sampling all --harness loop --mode A --rounds 2 --run-id control \
    --method-entrypoint "python $PWD/methods/noop/run.py"
python3 driver.py --dataset demo --sampling all --harness loop --mode A --rounds 2 --run-id treat-A \
    --method-entrypoint "$M"
python3 driver.py --dataset demo --sampling all --harness loop --mode B --rounds 2 --run-id treat-B \
    --method-entrypoint "$M"

python3 tools/plot_curve.py runs/control runs/treat-A runs/treat-B
```

```
run                            policy     conditions                         curve (one glyph per round)
----------------------------------------------------------------------------------------------------
control                        all        sandboxed v4 / files / training / default protocol ▁▁  0.00..0.00
                                                                             rounds=2 tasks=4 trials=8
treat-A                        all        sandboxed v4 / files / training / default protocol ▁██  0.00..1.00
                                                                             rounds=3 tasks=4 trials=12
treat-B                        all        sandboxed v4 / files / training / default protocol ▁██  0.00..1.00
                                                                             rounds=3 tasks=4 trials=12
```

The point is not the scores. `--sampling all` explicitly selects the ordinary demo path;
the CLI default is staged `diagnostic`, which requires `--policy-evidence`, one task, one
trial, one job and zero improvement rounds. **The demo grants no production/H0
authorization** and is not evidence that runtime, quota, snapshot or cleanup gates have
passed.

## Test the part you changed

The full suite is large, so run the tests for the dataset you are editing:

```bash
python3 tools/run_tests.py --dataset gsm8k
```

It runs that dataset's tests plus the core platform tests, and skips every other
dataset's. If you pass `--basetemp`, it must be **outside the platform tree** — the
runner refuses a harness work root inside it, and a suite writes thousands of small files.

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONDONTWRITEBYTECODE=1 python3 -m pytest -q \
    -p no:cacheprovider --basetemp=/tmp/harnessgrad-pytest-quality tests/quality
```

## Next

- [Status and limits](/HarnessGrad/status/) — read this before quoting any number.
- [`docs/writing_a_harness.md`](https://github.com/zjunlp/HarnessGrad/blob/main/docs/writing_a_harness.md)
  — the harness contribution contract.
- [`docs/architecture.md`](https://github.com/zjunlp/HarnessGrad/blob/main/docs/architecture.md)
  — the repository map.
