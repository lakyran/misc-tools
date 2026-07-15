function renderSummary(result, containerEl) {
  containerEl.innerHTML = '';
  containerEl.hidden = false;

  if (result.count === 0 && result.warnings.length === 0) {
    containerEl.hidden = true;
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = 'Summary Report';
  containerEl.appendChild(heading);

  const stats = document.createElement('div');
  stats.className = 'summary-stats';

  const countEl = document.createElement('p');
  countEl.innerHTML = `<strong>Transactions:</strong> ${result.count}`;
  stats.appendChild(countEl);

  if (result.total !== null && result.currency) {
    const positiveEl = document.createElement('p');
    positiveEl.className = 'subtotal subtotal--positive';
    positiveEl.innerHTML = `<strong>Total (Positive):</strong> <span class="${amountClassName(result.positiveTotal, 'amount')}">${formatCurrency(result.positiveTotal, result.currency)}</span>`;
    stats.appendChild(positiveEl);

    const negativeEl = document.createElement('p');
    negativeEl.className = 'subtotal subtotal--negative';
    negativeEl.innerHTML = `<strong>Total (Negative):</strong> <span class="${amountClassName(result.negativeTotal, 'amount')}">${formatCurrency(result.negativeTotal, result.currency)}</span>`;
    stats.appendChild(negativeEl);

    const totalEl = document.createElement('p');
    totalEl.className = amountClassName(result.total, 'grand-total');
    totalEl.innerHTML = `<strong>Grand Total:</strong> <span class="${amountClassName(result.total, 'amount')}">${formatCurrency(result.total, result.currency)}</span>`;
    stats.appendChild(totalEl);
  }

  containerEl.appendChild(stats);

  if (result.warnings.length > 0) {
    const warnSection = document.createElement('div');
    warnSection.className = 'warnings';
    const warnTitle = document.createElement('h3');
    warnTitle.textContent = 'Warnings';
    warnSection.appendChild(warnTitle);
    const warnList = document.createElement('ul');
    for (const warning of result.warnings) {
      const li = document.createElement('li');
      li.textContent = warning;
      warnList.appendChild(li);
    }
    warnSection.appendChild(warnList);
    containerEl.appendChild(warnSection);
  }

  if (result.items.length > 0) {
    const tableSection = document.createElement('div');
    tableSection.className = 'parsed-table';
    const tableTitle = document.createElement('h3');
    tableTitle.textContent = 'Parsed Amounts';
    tableSection.appendChild(tableTitle);

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Line</th>
          <th>Original</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    for (const item of result.items) {
      const tr = document.createElement('tr');
      const amountClass = amountClassName(item.amount, 'amount');
      tr.innerHTML = `
        <td>${item.lineNumber}</td>
        <td>${escapeHtml(item.label)}</td>
        <td><span class="${amountClass}">${formatCurrency(item.amount, item.currency)}</span></td>
      `;
      tbody.appendChild(tr);
    }
    tableSection.appendChild(table);
    containerEl.appendChild(tableSection);
  }
}

function amountClassName(amount, baseClass) {
  if (amount < 0) return `${baseClass} ${baseClass}--negative`;
  if (amount > 0) return `${baseClass} ${baseClass}--positive`;
  return baseClass;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function init() {
  const textarea = document.getElementById('transactions-input');
  const summarizeBtn = document.getElementById('summarize-btn');
  const clearBtn = document.getElementById('clear-btn');
  const summaryEl = document.getElementById('summary');
  const emptyMsg = document.getElementById('empty-message');

  summarizeBtn.addEventListener('click', () => {
    const text = textarea.value;
    if (!text.trim()) {
      summaryEl.hidden = true;
      emptyMsg.hidden = false;
      return;
    }

    emptyMsg.hidden = true;
    const result = summarizeTransactions(text);
    renderSummary(result, summaryEl);
  });

  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    summaryEl.hidden = true;
    summaryEl.innerHTML = '';
    emptyMsg.hidden = true;
  });
}

document.addEventListener('DOMContentLoaded', init);