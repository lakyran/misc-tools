# Transaction Summary

A single-page web tool for quickly reconciling transaction lists. Paste one transaction per line, click **Summarize**, and get a report with totals, per-line amounts, and warnings for anything that could not be parsed.

All processing runs in the browser. No install, no file upload, and no network requests.

## Quick start

Open `index.html` in any modern browser:

```bash
open index.html
```

Paste your transactions into the text area and click **Summarize**.

## Example input

```
1. 42.50
2. -1500.00
- Coffee ₹450
3) Rs. 1,23,456.78
4. $50.00
```

Blank lines are ignored. List markers (`1.`, `1)`, `-`, `*`, `•`) are stripped automatically.

## What you get

The summary report includes:

- **Transaction count** — number of successfully parsed lines
- **Total (Positive)** and **Total (Negative)** — subtotals when all lines share one currency
- **Grand total** — sum of all parsed amounts (only when currencies are uniform)
- **Parsed amounts table** — line number, original text, and formatted amount
- **Warnings** — unparseable lines and mixed-currency notices

## Currency handling

Amounts default to **Indian Rupees (INR)** unless a line explicitly indicates another currency.

| Input | Currency |
|-------|----------|
| Bare numbers (`42.50`, `1,234.56`) | INR |
| `₹`, `Rs.`, `Rs`, `INR` | INR |
| `$`, `USD` | US Dollars |
| `€`, `EUR` | Euros |
| `£`, `GBP` | British Pounds |

INR amounts use Indian digit grouping (e.g. `₹1,23,456.78`). Foreign currencies use their standard locale formatting.

**Mixed currencies:** If a list contains more than one currency, per-line amounts are still shown, but the grand total is omitted and a warning is displayed. There is no exchange-rate conversion.

## Parsing rules

1. Strip list markers and surrounding whitespace.
2. Detect an optional currency marker; otherwise assume INR.
3. Extract the first numeric amount (supports commas and a leading `-` for debits).
4. Lines with no parseable amount produce a warning and are excluded from totals.

## Development

The app has no npm dependencies. Node.js is only needed for the build step and tests.

### Build

Source logic lives in `core.mjs` (parsing) and `ui.js` (DOM). `build.js` concatenates them into `app.js`, which the browser loads:

```bash
npm run build
```

Edit `core.mjs` or `ui.js`, then rebuild before testing in the browser.

### Test

```bash
npm test
```

This runs the build and then executes unit tests with Node's built-in test runner. Tests import directly from `core.mjs`.

## Project structure

```
transactions-summary/
├── README.md        # This file
├── SPEC.md          # Full specification
├── index.html       # Page structure
├── styles.css       # Styling
├── core.mjs         # Parsing and formatting logic
├── ui.js            # DOM rendering and event handlers
├── build.js         # Bundles core.mjs + ui.js → app.js
├── app.js           # Generated bundle (do not edit by hand)
└── app.test.js      # Unit tests
```

## Non-goals

- Category or date grouping
- File upload or persistence
- Live currency conversion
- Backend API or server

See [SPEC.md](SPEC.md) for the complete specification and acceptance criteria.