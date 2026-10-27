# HarnessGrad-Hub

The public site of HarnessGrad: <https://zjunlp.github.io/HarnessGrad-Hub/>

What is here:

- **Home** — what the project claims, in one page
- **Getting started** — install, then the local demo
- **Benchmarks** — AppWorld and ALFWorld: score per split, cost, charts
- **Methods** — the eight methods, each with its rule and its results
- **News / Blog** — announcements and posts
- **Contribute** — how to submit results

The platform is [zjunlp/HarnessGrad](https://github.com/zjunlp/HarnessGrad). This repository
only presents it: nothing here runs an experiment or changes a measurement. The benchmark and
method pages are generated from run receipts by `scripts/export/` — do not edit them by hand.

```bash
pnpm install
pnpm dev      # http://localhost:4321/HarnessGrad-Hub/
pnpm build    # dist/, then scripts/check-links.mjs
```
