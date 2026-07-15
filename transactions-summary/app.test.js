import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTransactionLine,
  stripListMarker,
  summarizeTransactions,
  formatCurrency,
} from './core.mjs';

describe('stripListMarker', () => {
  it('removes numbered list prefix', () => {
    assert.equal(stripListMarker('1. Swiggy - 291'), 'Swiggy - 291');
  });

  it('removes bullet prefix', () => {
    assert.equal(stripListMarker('- Coffee ₹450'), 'Coffee ₹450');
  });
});

describe('parseTransactionLine', () => {
  it('parses plain INR number', () => {
    const result = parseTransactionLine('1. 42.50');
    assert.equal(result.amount, 42.5);
    assert.equal(result.currency, 'INR');
  });

  it('parses negative amount', () => {
    const result = parseTransactionLine('2. -1500.00');
    assert.equal(result.amount, -1500);
    assert.equal(result.currency, 'INR');
  });

  it('parses INR rupee symbol', () => {
    const result = parseTransactionLine('- Coffee ₹450');
    assert.equal(result.amount, 450);
    assert.equal(result.currency, 'INR');
  });

  it('parses Rs. prefix with Indian grouping', () => {
    const result = parseTransactionLine('3) Rs. 1,23,456.78');
    assert.equal(result.amount, 123456.78);
    assert.equal(result.currency, 'INR');
  });

  it('parses explicit USD', () => {
    const result = parseTransactionLine('4. $50.00');
    assert.equal(result.amount, 50);
    assert.equal(result.currency, 'USD');
  });

  it('returns null amount for unparseable line', () => {
    const result = parseTransactionLine('5. no amount here');
    assert.equal(result.amount, null);
  });

  it('parses description dash amount format', () => {
    const result = parseTransactionLine('1. Swiggy - 291');
    assert.equal(result.amount, 291);
    assert.equal(result.currency, 'INR');
  });
});

describe('summarizeTransactions', () => {
  it('sums uniform INR input', () => {
    const text = '1. 100\n2. 200.50\n3. -50';
    const result = summarizeTransactions(text);
    assert.equal(result.count, 3);
    assert.equal(result.positiveTotal, 300.5);
    assert.equal(result.negativeTotal, -50);
    assert.equal(result.total, 250.5);
    assert.equal(result.currency, 'INR');
    assert.equal(result.warnings.length, 0);
  });

  it('skips blank lines', () => {
    const text = '1. 100\n\n2. 50';
    const result = summarizeTransactions(text);
    assert.equal(result.count, 2);
    assert.equal(result.total, 150);
  });

  it('warns on unparseable lines', () => {
    const text = '1. 100\n2. invalid line';
    const result = summarizeTransactions(text);
    assert.equal(result.count, 1);
    assert.equal(result.total, 100);
    assert.equal(result.warnings.length, 1);
    assert.match(result.warnings[0], /line 2/i);
  });

  it('warns on mixed currencies and omits total', () => {
    const text = '1. 100\n2. $50';
    const result = summarizeTransactions(text);
    assert.equal(result.count, 2);
    assert.equal(result.total, null);
    assert.equal(result.positiveTotal, null);
    assert.equal(result.negativeTotal, null);
    assert.equal(result.currency, null);
    assert.ok(result.warnings.some((w) => /mixed/i.test(w)));
  });

  it('sums real-world description dash amount list', () => {
    const text = `1. Swiggy - 291
2. Swiggy - 440
3. Dad SBI - 1421
4. Urban ladder - 12500
5. Gold - 150065`;
    const result = summarizeTransactions(text);
    assert.equal(result.count, 5);
    assert.equal(result.total, 164717);
    assert.equal(result.currency, 'INR');
    assert.equal(result.items[0].label, 'Swiggy - 291');
    assert.equal(result.items[4].label, 'Gold - 150065');
  });
});

describe('formatCurrency', () => {
  it('formats INR with rupee symbol', () => {
    const formatted = formatCurrency(123456.78, 'INR');
    assert.match(formatted, /₹/);
    assert.match(formatted, /1,23,456/);
  });

  it('formats USD', () => {
    const formatted = formatCurrency(50, 'USD');
    assert.match(formatted, /\$50/);
  });
});