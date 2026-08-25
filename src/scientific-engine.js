/* Scientific engine: Math.js-backed safe expression evaluation with angle-aware functions and numerical helpers. */
import { all, create } from 'https://cdn.jsdelivr.net/npm/mathjs@15.2.0/+esm';

export const math = create(all, { number: 'number', precision: 14, predictable: true });

export function normalizeExpression(expression) {
  return String(expression || '0')
    .replaceAll('×', '*')
    .replaceAll('÷', '/')
    .replaceAll('−', '-')
    .replaceAll('π', 'pi')
    .replaceAll('√', 'sqrt');
}

export function toRadians(value, angleMode) {
  if (angleMode === 'DEG') return value * Math.PI / 180;
  if (angleMode === 'GRAD') return value * Math.PI / 200;
  return value;
}

export function fromRadians(value, angleMode) {
  if (angleMode === 'DEG') return value * 180 / Math.PI;
  if (angleMode === 'GRAD') return value * 200 / Math.PI;
  return value;
}

function numericValue(value) {
  if (typeof value === 'number') return value;
  return math.number(value);
}

function scopedFormula(formula, x, context) {
  return math.evaluate(normalizeExpression(formula), createScientificScope({
    ...context,
    variables: { ...context.variables, x },
  }));
}

export function numericalDerivative(formula, x, context) {
  const point = numericValue(x);
  const step = Math.max(1e-6, Math.abs(point) * 1e-6);
  return (numericValue(scopedFormula(formula, point + step, context)) - numericValue(scopedFormula(formula, point - step, context))) / (2 * step);
}

export function numericalIntegral(formula, a, b, context) {
  const start = numericValue(a);
  const end = numericValue(b);
  const steps = 400;
  const width = (end - start) / steps;
  let sum = numericValue(scopedFormula(formula, start, context)) + numericValue(scopedFormula(formula, end, context));
  for (let index = 1; index < steps; index += 1) {
    const x = start + index * width;
    sum += (index % 2 === 0 ? 2 : 4) * numericValue(scopedFormula(formula, x, context));
  }
  return sum * width / 3;
}

export function createScientificScope(context = {}) {
  const angleMode = context.angleMode || 'DEG';
  const variables = context.variables || {};
  const sourceContext = { ...context, angleMode, variables };
  const trigInput = (x) => toRadians(numericValue(x), angleMode);
  const inverseOutput = (x) => fromRadians(numericValue(x), angleMode);
  const cot = (x) => {
    const sine = Math.sin(trigInput(x));
    if (Math.abs(sine) < 1e-12) throw new Error('cot undefined at this angle');
    return 1 / Math.tan(trigInput(x));
  };

  return {
    ...variables,
    Ans: context.answer ?? 0,
    ans: context.answer ?? 0,
    M: context.memory ?? 0,
    pi: Math.PI,
    e: Math.E,
    i: math.complex(0, 1),
    c0: 299792458,
    h: 6.62607015e-34,
    G: 6.67430e-11,
    sin: (x) => Math.sin(trigInput(x)),
    cos: (x) => Math.cos(trigInput(x)),
    tan: (x) => {
      if (Math.abs(Math.cos(trigInput(x))) < 1e-12) throw new Error('tan undefined at this angle');
      return Math.tan(trigInput(x));
    },
    cot,
    asin: (x) => inverseOutput(Math.asin(numericValue(x))),
    acos: (x) => inverseOutput(Math.acos(numericValue(x))),
    atan: (x) => inverseOutput(Math.atan(numericValue(x))),
    acot: (x) => inverseOutput(Math.atan(1 / numericValue(x))),
    sinh: (x) => Math.sinh(numericValue(x)),
    cosh: (x) => Math.cosh(numericValue(x)),
    tanh: (x) => Math.tanh(numericValue(x)),
    asinh: (x) => Math.asinh(numericValue(x)),
    acosh: (x) => Math.acosh(numericValue(x)),
    atanh: (x) => Math.atanh(numericValue(x)),
    nPr: (n, r) => math.permutations(numericValue(n), numericValue(r)),
    nCr: (n, r) => math.combinations(numericValue(n), numericValue(r)),
    nthRoot: (x, n) => math.pow(x, 1 / numericValue(n)),
    logBase: (base, value) => Math.log(numericValue(value)) / Math.log(numericValue(base)),
    polar: (x, y) => [Math.hypot(numericValue(x), numericValue(y)), fromRadians(Math.atan2(numericValue(y), numericValue(x)), angleMode)],
    rect: (radius, theta) => [numericValue(radius) * Math.cos(trigInput(theta)), numericValue(radius) * Math.sin(trigInput(theta))],
    randInt: (minimum, maximum) => math.randomInt(numericValue(minimum), numericValue(maximum)),
    integral: (formula, a, b) => numericalIntegral(String(formula), a, b, sourceContext),
    diff: (formula, x) => numericalDerivative(String(formula), x, sourceContext),
  };
}

export function evaluateScientific(expression, context = {}) {
  return math.evaluate(normalizeExpression(expression), createScientificScope(context));
}

export function toFractionString(value, maxDenominator = 100000) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const sign = value < 0 ? '-' : '';
  const target = Math.abs(value);
  if (Number.isInteger(target)) return `${sign}${target}`;
  let previousNumerator = 0;
  let numerator = 1;
  let previousDenominator = 1;
  let denominator = 0;
  let remainder = target;
  while (denominator <= maxDenominator) {
    const integer = Math.floor(remainder);
    const nextNumerator = integer * numerator + previousNumerator;
    const nextDenominator = integer * denominator + previousDenominator;
    if (nextDenominator > maxDenominator) break;
    previousNumerator = numerator;
    numerator = nextNumerator;
    previousDenominator = denominator;
    denominator = nextDenominator;
    const fractional = remainder - integer;
    if (fractional < 1e-12) break;
    remainder = 1 / fractional;
  }
  return `${sign}${numerator}/${denominator}`;
}

export function convertBase(value, base) {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) return null;
  const baseMap = { BIN: 2, OCT: 8, DEC: 10, HEX: 16 };
  const radix = baseMap[base] || 10;
  return value.toString(radix).toUpperCase();
}

export function formatScientificResult(value, { displayMode = 'AUTO', baseMode = 'DEC' } = {}) {
  const baseValue = convertBase(value, baseMode);
  if (baseMode !== 'DEC' && baseValue !== null) return `${baseMode} ${baseValue}`;
  if (displayMode === 'FRAC') return toFractionString(value) || math.format(value, { precision: 12 });
  if (displayMode === 'ENG' && typeof value === 'number') return math.format(value, { notation: 'engineering', precision: 12 });
  return math.format(value, { precision: 12, lowerExp: -9, upperExp: 12 });
}
