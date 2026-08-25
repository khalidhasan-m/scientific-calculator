// Calculator history view: tap-to-insert entries and press-and-hold clipboard feedback.
export function renderHistory(historyList, history) {
  historyList.replaceChildren();

  if (!history.length) {
    const empty = document.createElement('p');
    empty.className = 'px-2 py-10 text-center text-sm muted-text';
    empty.textContent = 'No calculations yet';
    historyList.append(empty);
    return;
  }

  history.forEach((entry, index) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'history-row w-full rounded-2xl px-4 py-3 text-right';
    row.dataset.historyIndex = String(index);
    row.setAttribute('aria-label', `Insert ${entry.expression} into the current input. Press and hold to copy result ${entry.result}`);
    row.title = 'Tap to insert · press and hold to copy the result';
    row.innerHTML = '<span class="block truncate text-xs muted-text"></span><span class="mt-1 block text-xl font-medium tracking-[-0.03em]"></span>';
    row.firstChild.textContent = entry.expression;
    row.lastChild.textContent = entry.result;

    historyList.append(row);
  });
}

export async function copyHistoryResult(button, entry, setStatus) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(entry.result);
    button.classList.add('is-copied');
    button.setAttribute('aria-label', `Copied result ${entry.result}`);
    setStatus('Result copied to clipboard');
  } catch {
    setStatus('Clipboard access unavailable');
  }

  window.setTimeout(() => {
    button.classList.remove('is-copied');
    button.setAttribute('aria-label', `Insert ${entry.expression} into the current input. Press and hold to copy result ${entry.result}`);
  }, 1200);
}
