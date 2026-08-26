/* Scientific Workspace design: a keyboard-friendly Math.js calculator with a compact glass instrument surface. */
import { evaluateScientific, formatScientificResult, math } from './scientific-engine.js';
import { convertLength, convertTemperature, fetchCurrencyQuote, formatConvertedValue, formatCurrencyValue } from './modules/conversions.js';
import { copyHistoryResult, renderHistory } from './modules/history.js';
import { load, save } from './modules/storage.js';
import { addTactileFeedback } from './modules/tactile.js';

const calculator = document.querySelector('#calculator');
const expressionInput = document.querySelector('#expression-input');
const display = document.querySelector('#display');
const status = document.querySelector('#status');
const scientificWorkbench = document.querySelector('#scientific-workbench');
const angleToggle = document.querySelector('#angle-toggle');
const themeToggle = document.querySelector('#theme-toggle');
const themeToggleIcon = document.querySelector('#theme-toggle-icon');
const keypadToggle = document.querySelector('#keypad-toggle');
const historyToggle = document.querySelector('#history-toggle');
const historyDrawer = document.querySelector('#history-drawer');
const historyBackdrop = document.querySelector('#history-backdrop');
const historyClose = document.querySelector('#history-close');
const historyClear = document.querySelector('#history-clear');
const historyList = document.querySelector('#history-list');
const variableSelect = document.querySelector('#variable-select');
const statReadout = document.querySelector('#stat-readout');
const tabButtons = [...document.querySelectorAll('[data-tool-tab]')];
const toolPanels = [...document.querySelectorAll('[data-tool-panel]')];
const functionsToggle = document.querySelector('#functions-toggle');
const functionsToggleLabel = document.querySelector('#functions-toggle-label');
const functionsToggleIcon = document.querySelector('#functions-toggle-icon');
const matrixEditor = document.querySelector('#matrix-editor');
const vectorEditor = document.querySelector('#vector-editor');
const matrixEditorToggle = document.querySelector('#matrix-editor-toggle');
const vectorEditorToggle = document.querySelector('#vector-editor-toggle');
const matrixSize = document.querySelector('#matrix-size');
const vectorSize = document.querySelector('#vector-size');
const matrixGrid = document.querySelector('#matrix-grid');
const vectorGrid = document.querySelector('#vector-grid');
const matrixPreview = document.querySelector('#matrix-preview');
const vectorPreview = document.querySelector('#vector-preview');
const temperatureValue = document.querySelector('#temperature-value');
const temperatureFrom = document.querySelector('#temperature-from');
const temperatureTo = document.querySelector('#temperature-to');
const temperatureResult = document.querySelector('#temperature-result');
const lengthValue = document.querySelector('#length-value');
const lengthFrom = document.querySelector('#length-from');
const lengthTo = document.querySelector('#length-to');
const lengthResult = document.querySelector('#length-result');
const currencyValue = document.querySelector('#currency-value');
const currencyFrom = document.querySelector('#currency-from');
const currencyTo = document.querySelector('#currency-to');
const currencyResult = document.querySelector('#currency-result');
const currencyRateStatus = document.querySelector('#currency-rate-status');
const currencyRefresh = document.querySelector('#currency-refresh');

const registerNames = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y'];
let answer = 0;
let memory = 0;
let variables = Object.fromEntries(registerNames.map((name) => [name, 0]));
let history = [];
let statsData = [];
let scientificMode = true;
let angleMode = 'DEG';
let displayMode = 'AUTO';
let baseMode = 'DEC';
let activeTab = 'functions';
let lastValue = 0;
let matrixDimension = 2;
let vectorDimension = 3;
let editorMode = 'matrix';
let functionsVisible = false;
let currencyQuote;
let historyHoldTimer;
let historyHoldTriggered = false;
const compactViewport = window.matchMedia('(max-width: 640px)');
let keypadVisible = !compactViewport.matches;

function context() {
  return { angleMode, answer, memory, variables };
}

function valueAsNumber() {
  const value = evaluateScientific(expressionInput.value || '0', context());
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('A real number is required for this control');
  return value;
}

function expressionForHistory() {
  return expressionInput.value.trim() || '0';
}

function setStatus(message) {
  status.textContent = message;
}

function renderResult(value = lastValue) {
  display.textContent = formatScientificResult(value, { displayMode, baseMode });
  display.classList.toggle('display-small', display.textContent.length > 14);
}

function renderStats() {
  if (!statsData.length) {
    statReadout.textContent = 'No data';
    return;
  }
  const mean = math.mean(statsData);
  const deviation = statsData.length > 1 ? math.std(statsData) : 0;
  statReadout.textContent = `n=${statsData.length} · x̄=${math.format(mean, { precision: 7 })} · σ=${math.format(deviation, { precision: 7 })}`;
}

function converterNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function renderTemperatureConversion() {
  const result = convertTemperature(converterNumber(temperatureValue), temperatureFrom.value, temperatureTo.value);
  temperatureResult.textContent = `${formatConvertedValue(result)} ${temperatureTo.options[temperatureTo.selectedIndex].text}`;
}

function renderLengthConversion() {
  const result = convertLength(converterNumber(lengthValue), lengthFrom.value, lengthTo.value);
  lengthResult.textContent = `${formatConvertedValue(result)} ${lengthTo.value}`;
}

function renderCurrencyConversion() {
  if (!currencyQuote || currencyQuote.from !== currencyFrom.value || currencyQuote.to !== currencyTo.value) return;
  const result = converterNumber(currencyValue) * currencyQuote.rate;
  currencyResult.textContent = formatCurrencyValue(result, currencyQuote.to);
  currencyRateStatus.textContent = `${formatConvertedValue(currencyQuote.rate, 8)} ${currencyQuote.to} per ${currencyQuote.from} · ${currencyQuote.date}`;
}

async function refreshCurrencyQuote() {
  const from = currencyFrom.value;
  const to = currencyTo.value;
  currencyRefresh.disabled = true;
  currencyRateStatus.textContent = 'Refreshing live rate…';
  try {
    const quote = await fetchCurrencyQuote(from, to);
    currencyQuote = quote;
    try { sessionStorage.setItem('scientific-currency-quote', JSON.stringify(quote)); } catch {}
    renderCurrencyConversion();
    setStatus(`Live ${from} to ${to} rate updated`);
  } catch (error) {
    const cached = currencyQuote && currencyQuote.from === from && currencyQuote.to === to ? currencyQuote : null;
    if (cached) {
      renderCurrencyConversion();
      currencyRateStatus.textContent = `Using cached rate · ${cached.date}`;
      setStatus('Live rate unavailable; cached rate shown');
    } else {
      currencyResult.textContent = 'Unavailable';
      currencyRateStatus.textContent = 'Unable to refresh live rate. Check your connection.';
      setStatus(error.message || 'Currency rate unavailable');
    }
  } finally {
    currencyRefresh.disabled = false;
  }
}

function addHistory(expression, result) {
  const entry = { expression, rawExpression: expression, result };
  if (history[0]?.rawExpression === entry.rawExpression && history[0]?.result === entry.result) return;
  history.unshift(entry);
  history = history.slice(0, 40);
  save('scientific-history', history);
  renderHistory(historyList, history);
}

function evaluateCurrent({ record = true } = {}) {
  const expression = expressionForHistory();
  try {
    const result = evaluateScientific(expression, context());
    answer = result;
    lastValue = result;
    renderResult(result);
    const formatted = formatScientificResult(result, { displayMode: 'AUTO', baseMode: 'DEC' });
    if (record) addHistory(expression, formatted);
    setStatus('Calculation complete');
    return result;
  } catch (error) {
    display.textContent = 'Error';
    setStatus(error.message || 'Unable to evaluate expression');
    return null;
  }
}

function clearAll() {
  answer = 0;
  lastValue = 0;
  displayMode = 'AUTO';
  baseMode = 'DEC';
  replaceExpression('0');
  renderResult(0);
  setStatus('Calculation cleared; saved history preserved');
}

function replaceExpression(nextExpression, caret = nextExpression.length, { focus = !compactViewport.matches } = {}) {
  expressionInput.value = nextExpression;
  if (focus) {
    expressionInput.focus();
    expressionInput.setSelectionRange(caret, caret);
  } else if (document.activeElement === expressionInput) {
    expressionInput.blur();
  }
}

function insertToken(token) {
  const current = expressionInput.value;
  const start = expressionInput.selectionStart ?? current.length;
  const end = expressionInput.selectionEnd ?? current.length;
  if (current === '0' && token === '0') {
    replaceExpression('0', 1);
    setStatus('Expression updated');
    return;
  }
  const replacesZeroPlaceholder = current === '0' && (/^\d$/.test(token) || !['.', ')', '^', '+', '-', '*', '/', '%', '!'].includes(token));
  const shouldReplaceZero = replacesZeroPlaceholder || (current === '0' && start === 0 && end === 1 && !['.', ')', '^'].includes(token));
  const next = shouldReplaceZero
    ? token
    : `${current.slice(0, start)}${token}${current.slice(end)}`;
  replaceExpression(next, shouldReplaceZero ? token.length : start + token.length);
  setStatus('Expression updated');
}

function deleteToken() {
  const current = expressionInput.value;
  const start = expressionInput.selectionStart ?? current.length;
  const end = expressionInput.selectionEnd ?? current.length;
  if (start !== end) {
    replaceExpression(`${current.slice(0, start)}${current.slice(end)}`, start);
  } else if (start > 0) {
    replaceExpression(`${current.slice(0, start - 1)}${current.slice(end)}`, start - 1);
  }
}

function toggleSign() {
  const source = expressionInput.value || '0';
  replaceExpression(`-(${source})`);
}

function toggleHistory(force) {
  const open = typeof force === 'boolean' ? force : !historyDrawer.classList.contains('is-open');
  historyDrawer.classList.toggle('is-open', open);
  historyBackdrop.classList.toggle('is-open', open);
  historyToggle.setAttribute('aria-expanded', String(open));
  historyDrawer.setAttribute('aria-hidden', String(!open));
}

function updateMode() {
  scientificMode = true;
  scientificWorkbench.hidden = false;
}

function updateAngle() {
  angleToggle.textContent = angleMode;
  angleToggle.setAttribute('aria-label', `Angle mode ${angleMode}; switch angle mode`);
  save('scientific-angle', angleMode);
}

function updateTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggleIcon.textContent = theme === 'dark' ? '☼' : '☾';
  save('scientific-theme', theme);
}

function setTab(tab, reveal = false) {
  activeTab = tab;
  tabButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.toolTab === tab));
  toolPanels.forEach((panel) => { panel.hidden = panel.dataset.toolPanel !== tab; });
  if (reveal) setFunctionsVisibility(true);
}

function setFunctionsVisibility(visible) {
  functionsVisible = visible;
  scientificWorkbench.classList.toggle('functions-collapsed', !visible);
  functionsToggleLabel.textContent = visible ? 'Hide functions' : 'Show functions';
  functionsToggleIcon.textContent = visible ? '⌃' : '⌄';
  functionsToggle.setAttribute('aria-expanded', String(visible));
  save('scientific-functions-visible', visible);
}

function setKeypadVisibility(visible) {
  keypadVisible = visible;
  calculator.classList.toggle('mobile-keypad-hidden', compactViewport.matches && !visible);
  keypadToggle.setAttribute('aria-pressed', String(visible));
  keypadToggle.textContent = visible ? 'Hide keypad' : 'Show keypad';
}

function revealMobileKeypad() {
  if (compactViewport.matches) setKeypadVisibility(true);
}

function focusExpressionFromDisplay() {
  revealMobileKeypad();
  if (!compactViewport.matches) return;
  requestAnimationFrame(() => {
    expressionInput.focus();
    expressionInput.setSelectionRange(expressionInput.value.length, expressionInput.value.length);
  });
}

function editorInputValue(selector, fallback = '0') {
  return document.querySelector(selector)?.value?.trim() || fallback;
}

function matrixExpression() {
  const rows = Array.from({ length: matrixDimension }, (_, row) => {
    const values = Array.from({ length: matrixDimension }, (_, column) => editorInputValue(`[data-matrix-cell="${row}-${column}"]`));
    return `[${values.join(',')}]`;
  });
  return `[${rows.join(',')}]`;
}

function vectorExpression(name) {
  const values = Array.from({ length: vectorDimension }, (_, index) => editorInputValue(`[data-vector-cell="${name}-${index}"]`));
  return `[${values.join(',')}]`;
}

function updateEditorPreviews() {
  matrixPreview.textContent = `M = ${matrixExpression()}`;
  vectorPreview.textContent = `u = ${vectorExpression('u')}   ·   v = ${vectorExpression('v')}`;
}

function renderMatrixEditor() {
  const previous = new Map([...matrixGrid.querySelectorAll('[data-matrix-cell]')].map((input) => [input.dataset.matrixCell, input.value]));
  matrixGrid.replaceChildren();
  matrixGrid.style.gridTemplateColumns = `repeat(${matrixDimension}, minmax(0, 1fr))`;
  for (let row = 0; row < matrixDimension; row += 1) {
    for (let column = 0; column < matrixDimension; column += 1) {
      const input = document.createElement('input');
      const key = `${row}-${column}`;
      input.type = 'text';
      input.inputMode = 'decimal';
      input.className = 'matrix-cell';
      input.dataset.matrixCell = key;
      input.value = previous.get(key) ?? (row === column ? '1' : '0');
      input.setAttribute('aria-label', `Matrix row ${row + 1}, column ${column + 1}`);
      input.addEventListener('input', updateEditorPreviews);
      matrixGrid.append(input);
    }
  }
  updateEditorPreviews();
}

function renderVectorEditor() {
  const previous = new Map([...vectorGrid.querySelectorAll('[data-vector-cell]')].map((input) => [input.dataset.vectorCell, input.value]));
  vectorGrid.replaceChildren();
  for (const name of ['u', 'v']) {
    const row = document.createElement('div');
    row.className = 'vector-row';
    const label = document.createElement('span');
    label.className = 'vector-label';
    label.textContent = name;
    row.append(label);
    for (let index = 0; index < vectorDimension; index += 1) {
      const input = document.createElement('input');
      const key = `${name}-${index}`;
      input.type = 'text';
      input.inputMode = 'decimal';
      input.className = 'matrix-cell';
      input.dataset.vectorCell = key;
      input.value = previous.get(key) ?? (name === 'u' && index === 0 ? '1' : name === 'v' && index === 1 ? '1' : '0');
      input.setAttribute('aria-label', `Vector ${name} component ${index + 1}`);
      input.addEventListener('input', updateEditorPreviews);
      row.append(input);
    }
    vectorGrid.append(row);
  }
  updateEditorPreviews();
}

function setEditorMode(mode) {
  editorMode = mode;
  matrixEditor.hidden = mode !== 'matrix';
  vectorEditor.hidden = mode !== 'vector';
  matrixEditorToggle.classList.toggle('is-active', mode === 'matrix');
  vectorEditorToggle.classList.toggle('is-active', mode === 'vector');
}

function insertMatrix(operation = 'raw') {
  const matrix = matrixExpression();
  const expression = operation === 'det' ? `det(${matrix})` : operation === 'inv' ? `inv(${matrix})` : matrix;
  insertToken(expression);
  setStatus(operation === 'raw' ? 'Matrix inserted into expression' : `${operation} operation inserted`);
}

function insertVector() {
  const u = vectorExpression('u');
  const v = vectorExpression('v');
  const operation = document.querySelector('#vector-operation').value;
  if (operation === 'cross' && vectorDimension !== 3) return setStatus('Cross product requires 3D vectors');
  const expression = operation === 'dot' ? `dot(${u},${v})`
    : operation === 'cross' ? `cross(${u},${v})`
      : operation === 'add' ? `(${u})+(${v})`
        : `(${u})-(${v})`;
  insertToken(expression);
  setStatus('Vector expression inserted');
}

function persistRegisters() {
  save('scientific-memory', memory);
  save('scientific-variables', variables);
}

function activeRegister() {
  return variableSelect.value;
}

function performAction(action) {
  try {
    if (action === 'equals') return evaluateCurrent();
    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteToken();
    if (action === 'sign') return toggleSign();
    if (action === 'percent') return insertToken('/100');
    if (action === 'fraction') {
      displayMode = displayMode === 'FRAC' ? 'AUTO' : 'FRAC';
      renderResult();
      return setStatus(displayMode === 'FRAC' ? 'Fraction display active' : 'Decimal display active');
    }
    if (action === 'engineering') {
      displayMode = displayMode === 'ENG' ? 'AUTO' : 'ENG';
      renderResult();
      return setStatus(displayMode === 'ENG' ? 'Engineering notation active' : 'Automatic notation active');
    }
    if (action === 'ans') return insertToken('Ans');
    if (action === 'recall-memory') return insertToken('M');
    if (action === 'memory-add') { memory += valueAsNumber(); persistRegisters(); return setStatus('Added to memory'); }
    if (action === 'memory-subtract') { memory -= valueAsNumber(); persistRegisters(); return setStatus('Subtracted from memory'); }
    if (action === 'store-variable') { variables[activeRegister()] = valueAsNumber(); persistRegisters(); return setStatus(`Stored in ${activeRegister()}`); }
    if (action === 'recall-variable') return insertToken(activeRegister());
    if (action === 'random') { lastValue = Math.random(); answer = lastValue; renderResult(); return setStatus('Random number generated'); }
    if (action === 'random-int') { lastValue = math.randomInt(0, 100); answer = lastValue; renderResult(); return setStatus('Random integer generated'); }
    if (action === 'add-stat') { statsData.push(valueAsNumber()); save('scientific-stats', statsData); renderStats(); return setStatus('Value added to statistics'); }
    if (action === 'clear-stat') { statsData = []; save('scientific-stats', statsData); renderStats(); return setStatus('Statistics cleared'); }
    if (action === 'stat-mean') { lastValue = math.mean(statsData); answer = lastValue; renderResult(); return setStatus('Mean calculated'); }
    if (action === 'stat-std') { lastValue = statsData.length > 1 ? math.std(statsData) : 0; answer = lastValue; renderResult(); return setStatus('Standard deviation calculated'); }
    if (action === 'stat-sum') { lastValue = math.sum(statsData); answer = lastValue; renderResult(); return setStatus('Sum calculated'); }
    if (action.startsWith('base-')) { baseMode = action.slice(5); renderResult(); return setStatus(`Base ${baseMode} display active`); }
    if (action === 'mode') return updateMode();
    if (action === 'angle') {
      angleMode = angleMode === 'DEG' ? 'RAD' : angleMode === 'RAD' ? 'GRAD' : 'DEG';
      return updateAngle();
    }
    if (action === 'history') return toggleHistory();
    if (action === 'theme') return updateTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    if (action.startsWith('tab-')) return setTab(action.slice(4), true);
    if (action === 'toggle-functions') return setFunctionsVisibility(!functionsVisible);
    if (action === 'toggle-keypad') return setKeypadVisibility(!keypadVisible);
    if (action.startsWith('constant-')) return insertToken(action.slice(9));
    if (action === 'editor-matrix') return setEditorMode('matrix');
    if (action === 'editor-vector') return setEditorMode('vector');
    if (action === 'matrix-insert') return insertMatrix();
    if (action === 'matrix-det') return insertMatrix('det');
    if (action === 'matrix-inv') return insertMatrix('inv');
    if (action === 'vector-insert') return insertVector();
    if (action === 'currency-refresh') return refreshCurrencyQuote();
  } catch (error) {
    setStatus(error.message || 'This action needs a real numeric value');
  }
}

function insertHistory(entry) {
  replaceExpression(entry.rawExpression || entry.expression.replace(/\s*=\s*$/, ''));
  setStatus('Previous expression inserted');
  toggleHistory(false);
}

calculator.addEventListener('pointerdown', (event) => {
  const control = event.target.closest('button, select');
  if (!control) return;
  if (compactViewport.matches && document.activeElement === expressionInput) expressionInput.blur();
  addTactileFeedback(control, event);
});

calculator.addEventListener('click', (event) => {
  const insert = event.target.closest('[data-insert]');
  if (insert) return insertToken(insert.dataset.insert);
  const action = event.target.closest('[data-action]');
  if (action) performAction(action.dataset.action);
});

historyClose.addEventListener('click', () => toggleHistory(false));
historyBackdrop.addEventListener('click', () => toggleHistory(false));
historyClear.addEventListener('click', () => { history = []; save('scientific-history', history); renderHistory(historyList, history); });

function cancelHistoryHold() {
  if (historyHoldTimer) window.clearTimeout(historyHoldTimer);
  historyHoldTimer = undefined;
}

historyList.addEventListener('pointerdown', (event) => {
  const row = event.target.closest('[data-history-index]');
  if (!row) return;
  const entry = history[Number(row.dataset.historyIndex)];
  if (!entry) return;
  historyHoldTriggered = false;
  cancelHistoryHold();
  historyHoldTimer = window.setTimeout(() => {
    historyHoldTriggered = true;
    copyHistoryResult(row, entry, setStatus);
    if (navigator.vibrate) navigator.vibrate([7, 30, 7]);
  }, 550);
});

['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
  historyList.addEventListener(eventName, cancelHistoryHold);
});

historyList.addEventListener('click', (event) => {
  const row = event.target.closest('[data-history-index]');
  if (!row) return;
  if (historyHoldTriggered) {
    historyHoldTriggered = false;
    return;
  }
  insertHistory(history[Number(row.dataset.historyIndex)]);
});

expressionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') { event.preventDefault(); evaluateCurrent(); }
  if (!event.altKey && event.key === 'x') { event.preventDefault(); insertToken('*'); }
  if (!event.altKey && event.key === '÷') { event.preventDefault(); insertToken('/'); }
});
expressionInput.addEventListener('focus', revealMobileKeypad);
display.addEventListener('click', focusExpressionFromDisplay);
display.addEventListener('keydown', (event) => {
  if (['Enter', ' '].includes(event.key)) { event.preventDefault(); focusExpressionFromDisplay(); }
});

document.addEventListener('keydown', (event) => {
  const editableControl = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
  if (editableControl && event.target !== expressionInput) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    expressionInput.focus();
    expressionInput.select();
    return;
  }
  if (event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape' && historyDrawer.classList.contains('is-open')) { event.preventDefault(); return toggleHistory(false); }
  if (event.altKey) {
    const shortcuts = { KeyS: 'sin(', KeyC: 'cos(', KeyT: 'tan(', KeyO: 'cot(', KeyH: null, KeyM: null, KeyG: null, Digit1: null, Digit2: null, Digit3: null, Digit4: null };
    if (Object.hasOwn(shortcuts, event.code)) {
      event.preventDefault();
      if (event.code === 'KeyH') return toggleHistory();
      if (event.code === 'KeyM') return performAction('mode');
      if (event.code === 'KeyG') return performAction('angle');
      if (event.code.startsWith('Digit')) return setTab(['functions', 'memory', 'data', 'algebra', 'convert'][Number(event.code.at(-1)) - 1], true);
      return insertToken(shortcuts[event.code]);
    }
  }
  if (event.target === expressionInput) return;
  const map = { NumpadAdd: '+', NumpadSubtract: '-', NumpadMultiply: '*', NumpadDivide: '/', NumpadDecimal: '.', NumpadEnter: 'Enter' };
  const normalizedKey = event.key === '[' ? '(' : event.key === ']' ? ')' : ['x', 'X', '×'].includes(event.key) ? '*' : event.key === '÷' ? '/' : event.key;
  const input = map[event.code] || (['+', '-', '*', '/', '.', '%', '(', ')', '^'].includes(normalizedKey) ? normalizedKey : /^\d$/.test(normalizedKey) ? normalizedKey : null);
  if (event.key === 'Enter' || input === 'Enter' || event.key === '=') { event.preventDefault(); return evaluateCurrent(); }
  if (event.key === 'Backspace') { event.preventDefault(); return deleteToken(); }
  if (event.key === 'Delete' || event.key === 'Escape') { event.preventDefault(); return replaceExpression('0'); }
  if (input) { event.preventDefault(); insertToken(input); }
});

history = load('scientific-history', []);
statsData = load('scientific-stats', []);
memory = load('scientific-memory', 0);
variables = { ...variables, ...load('scientific-variables', {}) };
angleMode = load('scientific-angle', 'DEG');
functionsVisible = load('scientific-functions-visible', !window.matchMedia('(max-width: 640px)').matches);
try { currencyQuote = JSON.parse(sessionStorage.getItem('scientific-currency-quote')) || undefined; } catch { currencyQuote = undefined; }
matrixDimension = Number(matrixSize.value);
vectorDimension = Number(vectorSize.value);
updateTheme(load('scientific-theme', 'dark'));
updateAngle();
renderHistory(historyList, history);
renderStats();
setTab(activeTab);
updateMode();
setFunctionsVisibility(functionsVisible);
setKeypadVisibility(keypadVisible);
renderMatrixEditor();
renderVectorEditor();
setEditorMode(editorMode);
renderResult(0);
renderTemperatureConversion();
renderLengthConversion();
if (currencyQuote && currencyQuote.from === currencyFrom.value && currencyQuote.to === currencyTo.value) renderCurrencyConversion();
else refreshCurrencyQuote();

matrixSize.addEventListener('change', () => { matrixDimension = Number(matrixSize.value); renderMatrixEditor(); });
vectorSize.addEventListener('change', () => { vectorDimension = Number(vectorSize.value); renderVectorEditor(); });
[[temperatureValue, temperatureFrom, temperatureTo], [lengthValue, lengthFrom, lengthTo]].forEach((controls, index) => controls.forEach((control) => {
  control.addEventListener('input', index === 0 ? renderTemperatureConversion : renderLengthConversion);
  control.addEventListener('change', index === 0 ? renderTemperatureConversion : renderLengthConversion);
}));
currencyValue.addEventListener('input', renderCurrencyConversion);
[currencyFrom, currencyTo].forEach((control) => control.addEventListener('change', refreshCurrencyQuote));
compactViewport.addEventListener('change', (event) => setKeypadVisibility(!event.matches));
