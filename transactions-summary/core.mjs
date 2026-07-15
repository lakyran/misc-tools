const CURRENCY_MARKERS = [
  { pattern: /\bINR\b/i, currency: 'INR' },
  { pattern: /₹/, currency: 'INR' },
  { pattern: /Rs\.?/i, currency: 'INR' },
  { pattern: /\bUSD\b/i, currency: 'USD' },
  { pattern: /\$/, currency: 'USD' },
  { pattern: /\bEUR\b/i, currency: 'EUR' },
  { pattern: /€/, currency: 'EUR' },
  { pattern: /\bGBP\b/i, currency: 'GBP' },
  { pattern: /£/, currency: 'GBP' },
];

const LOCALE_BY_CURRENCY = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

const LIST_MARKER_PATTERN = /^\s*(?:\d+[.)]\s*|[-*•]\s*)/;

export function stripListMarker(line) {
  return line.trim().replace(LIST_MARKER_PATTERN, '').trim();
}

export function parseTransactionLine(line) {
  const original = line;
  let text = line.trim();
  text = text.replace(LIST_MARKER_PATTERN, '');

  let currency = 'INR';
  for (const { pattern, currency: detected } of CURRENCY_MARKERS) {
    if (pattern.test(text)) {
      currency = detected;
      text = text.replace(pattern, ' ');
      break;
    }
  }

  const amountMatch = text.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!amountMatch) {
    return { amount: null, currency, original };
  }

  const amount = parseFloat(amountMatch[0].replace(/,/g, ''));
  if (Number.isNaN(amount)) {
    return { amount: null, currency, original };
  }

  return { amount, currency, original };
}

export function summarizeTransactions(text) {
  const lines = text.split('\n');
  const items = [];
  const warnings = [];
  let lineNumber = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    lineNumber++;

    const parsed = parseTransactionLine(line);
    if (parsed.amount === null) {
      warnings.push(`Line ${lineNumber}: could not parse amount — "${line.trim()}"`);
      continue;
    }

    items.push({
      lineNumber,
      original: parsed.original.trim(),
      label: stripListMarker(parsed.original),
      amount: parsed.amount,
      currency: parsed.currency,
    });
  }

  const currencies = [...new Set(items.map((item) => item.currency))];
  let total = null;
  let positiveTotal = null;
  let negativeTotal = null;
  let currency = null;

  if (items.length > 0) {
    if (currencies.length === 1) {
      currency = currencies[0];
      total = items.reduce((sum, item) => sum + item.amount, 0);
      positiveTotal = items
        .filter((item) => item.amount > 0)
        .reduce((sum, item) => sum + item.amount, 0);
      negativeTotal = items
        .filter((item) => item.amount < 0)
        .reduce((sum, item) => sum + item.amount, 0);
    } else {
      warnings.push(
        'Mixed currencies detected — grand total omitted. Review per-line amounts below.'
      );
    }
  }

  return {
    total,
    positiveTotal,
    negativeTotal,
    currency,
    count: items.length,
    items,
    warnings,
  };
}

export function formatCurrency(amount, currency = 'INR') {
  const locale = LOCALE_BY_CURRENCY[currency] || 'en-IN';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}