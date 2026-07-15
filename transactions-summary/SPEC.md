# Transaction Summary Tool — Specification

## 1. Overview

A single-page web tool that lets users paste a list of transactions, parses monetary amounts from each line, and displays a summary report with a grand total on the same page.

**Target user:** Someone reconciling or reviewing a list of transactions quickly, without installing software or uploading files.

**Currency default:** All amounts are treated as **Indian Rupees (INR)** unless a line explicitly indicates another currency.

---

## 2. Currency Assumptions

### Default: Indian Rupees (INR)

| Input pattern | Interpretation |
|---------------|----------------|
| Bare numbers (`42.50`, `1,234.56`) | INR |
| `₹`, `Rs.`, `Rs`, `INR` | INR (explicit) |

### Otherwise mentioned (explicit foreign currency)

| Marker | Currency |
|--------|----------|
| `$`, `USD` | US Dollars (USD) |
| `€`, `EUR` | Euros (EUR) |
| `£`, `GBP` | British Pounds (GBP) |

### Display rules

- Amounts formatted with `Intl.NumberFormat` using locale `en-IN` for INR (Indian digit grouping, e.g. `₹1,23,456.78`).
- Foreign currencies use their standard locale (`en-US` for USD, etc.).
- **Grand total:** Computed only when all parsed lines share the same currency. If mixed currencies are detected, the total is omitted and a warning is shown. Per-line amounts are always displayed.

---

## 3. User Interface

Single-page layout with two regions:

### Input section

- A `<textarea>` for pasting the transaction list.
- Placeholder showing INR example format.
- **Summarize** button — parses input and updates the summary.
- **Clear** button — resets the textarea and hides/clears the summary.

### Summary section

Hidden until the first successful parse. Displays:

- Transaction count (successfully parsed lines)
- Grand total with currency label (when computable)
- Table of parsed amounts (line number, original text, extracted amount)
- Warnings (unparseable lines, mixed currencies)

### Constraints

- Responsive, readable layout.
- No external frameworks or build step.
- No network requests; all processing is client-side.

---

## 4. Input Format

One transaction per line. Blank lines are ignored.

### Supported examples

```
1. 42.50
2. -1500.00
- Coffee ₹450
3) Rs. 1,23,456.78
4. $50.00
```

### Parsing rules

1. Strip list markers: `1.`, `1)`, `-`, `*`, `•`, and leading/trailing whitespace.
2. Detect optional currency marker (see section 2). If none found, assume **INR**.
3. Extract numeric amount from the remainder:
   - Supports commas as thousand separators.
   - Supports leading `-` for debits/negative amounts.
4. If no parseable amount is found, add a warning for that line and exclude it from the total.

---

## 5. Summary Report

Displayed in-page after clicking **Summarize**:

| Field | Description |
|-------|-------------|
| Transaction count | Number of successfully parsed lines |
| Grand total | Sum of parsed amounts with currency label (omitted if mixed currencies) |
| Parsed amounts | Line number, original text, formatted amount with currency |
| Warnings | Unparseable lines; mixed-currency notice |

---

## 6. Behavior

| Action | Result |
|--------|--------|
| Summarize | Parse textarea content, update summary section |
| Clear | Reset textarea, hide and clear summary |
| Empty input | Show friendly message; do not display summary |
| Unparseable line | Warning shown; line excluded from count and total |

---

## 7. File Structure

```
transactions-list-reconcile/
├── SPEC.md          # This document
├── index.html       # Page structure
├── styles.css       # Styling
├── app.js           # Parsing + summary logic (exported for tests)
└── app.test.js      # Node unit tests
```

---

## 8. Core Functions

### `parseTransactionLine(line: string)`

Returns:

```js
{ amount: number | null, currency: 'INR' | 'USD' | 'EUR' | 'GBP', original: string }
```

### `summarizeTransactions(text: string)`

Returns:

```js
{
  total: number | null,       // null when mixed currencies
  currency: string | null,    // null when mixed currencies
  count: number,
  items: Array<{ lineNumber, original, amount, currency }>,
  warnings: string[]
}
```

### `formatCurrency(amount: number, currency = 'INR')`

Returns a locale-formatted currency string.

### `renderSummary(result, containerEl)`

Updates the DOM summary section. Browser-only; not tested in Node.

---

## 9. Testing

Run with Node built-in test runner (no npm dependencies):

```bash
node --test app.test.js
```

### Required test cases

- Plain INR numbers (`42.50` → INR)
- INR markers (`₹450`, `Rs. 1000`)
- Indian comma grouping (`1,23,456.78`)
- Negative amounts (`-1500.00`)
- Bulleted lines (`- Coffee ₹450`)
- Explicit USD line (`$50.00` → USD)
- Mixed currency warning when INR + USD lines are present
- Blank lines skipped
- Unparseable lines produce warnings
- Grand total correctness for uniform INR input

---

## 10. Non-Goals

- Category or date grouping
- File upload or persistence (localStorage)
- Live exchange-rate conversion between currencies
- Backend API or server

---

## 11. Acceptance Criteria

- [x] SPEC.md documents INR-default currency rules
- [x] Opening `index.html` in a browser shows input and summary sections
- [x] Pasting a numbered INR list and clicking Summarize shows the correct ₹ grand total
- [x] Foreign currency on a line is detected and labeled
- [x] Mixed-currency input shows a warning and omits the grand total
- [x] All unit tests pass