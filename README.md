# misc-tools

A collection of small, self-contained utility tools. Each tool lives in its own folder with its own README, tests, and source.

Most tools are static web apps that run entirely in the browser — no install, no backend, and no data sent over the network.

## Tools

| Tool | Description |
|------|-------------|
| [Transaction Summary](transactions-summary/) | Paste a list of transactions and get totals, per-line amounts, and parse warnings. Defaults to INR; supports USD, EUR, and GBP. |

## Quick start

Clone the repo and open a tool locally:

```bash
git clone https://github.com/YOUR_USERNAME/misc-tools.git
cd misc-tools/transactions-summary
open index.html
```

For development on a tool that has tests, `cd` into its folder and run:

```bash
npm test
```

## Hosting on GitHub Pages

These tools can be served as static sites via [GitHub Pages](https://docs.github.com/en/pages).

1. Push this repo to GitHub as `misc-tools`.
2. Go to **Settings → Pages** and deploy from the `master` branch (root).
3. Tools are available under their folder path, for example:

   `https://YOUR_USERNAME.github.io/misc-tools/transactions-summary/`

Replace `YOUR_USERNAME` with your GitHub username.

## Repository structure

```
misc-tools/
├── README.md                 # This file
└── transactions-summary/   # Transaction list parser and summarizer
    ├── README.md
    ├── index.html
    ├── core.mjs
    ├── ui.js
    └── ...
```

New tools are added as sibling directories under the repo root.