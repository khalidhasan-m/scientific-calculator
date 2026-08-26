// Conversion helpers: deterministic unit conversion plus a browser-native live currency rate request.
export const lengthFactors = Object.freeze({
  m: 1,
  km: 1000,
  cm: 0.01,
  mi: 1609.344,
  ft: 0.3048,
  in: 0.0254,
});

export function convertTemperature(value, from, to) {
  const celsius = from === 'F' ? (value - 32) * 5 / 9 : from === 'K' ? value - 273.15 : value;
  return to === 'F' ? celsius * 9 / 5 + 32 : to === 'K' ? celsius + 273.15 : celsius;
}

export function convertLength(value, from, to) {
  return value * lengthFactors[from] / lengthFactors[to];
}

export function formatConvertedValue(value, maximumFractionDigits = 6) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
}

export function formatCurrencyValue(value, currency) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 6 }).format(value);
}

export async function fetchCurrencyQuote(from, to) {
  if (from === to) return { from, to, rate: 1, date: new Date().toISOString().slice(0, 10) };
  const response = await fetch('https://open.er-api.com/v6/latest/USD', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Rate service returned ${response.status}`);
  const data = await response.json();
  const baseRate = Number(data.rates?.[from]);
  const targetRate = Number(data.rates?.[to]);
  const rate = targetRate / baseRate;
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('No live rate is available for this currency pair');
  const date = data.time_last_update_unix ? new Date(data.time_last_update_unix * 1000).toISOString().slice(0, 10) : 'latest';
  return { from, to, rate, date };
}
