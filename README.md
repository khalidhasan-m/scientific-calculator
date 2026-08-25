# Scientific Calculator

A responsive browser-based **scientific calculator** with a glass-inspired interface, a direct expression editor, a persistent calculation history, visual matrix and vector inputs, and desktop keyboard controls. It is built with HTML, Tailwind CSS, and modular JavaScript; expression evaluation is powered by [Math.js][1].

## Screenshots

### Desktop scientific workspace

![Desktop scientific calculator showing the full functions panel beside the primary keypad.](https://raw.githubusercontent.com/khalidhasan-m/scientific-calculator/main/docs/images/desktop-workspace.png)

The desktop workspace keeps the expression display, the full scientific-function panel, and the primary keypad visible together.

### Compact mobile workspace

![Compact mobile calculator showing the History control, result display, Show keypad button, and Show functions control.](https://raw.githubusercontent.com/khalidhasan-m/scientific-calculator/main/docs/images/mobile-workspace.png)

On compact screens, the keypad remains hidden until the result display or **Show keypad** control is used. This leaves the scientific workspace reachable without crowding the initial view.

## Highlights

| Area | Included capability |
| --- | --- |
| Expression editor | Direct entry of arithmetic and supported Math.js expressions with normal operator precedence. |
| Scientific tools | Trigonometric, inverse, hyperbolic, logarithmic, exponential, probability, calculus, and coordinate operations. |
| Memory and constants | `Ans`, memory register `M`, named registers `A`–`F`, `X`, `Y`, and physical constants. |
| Data and bases | Mean, standard deviation, summation, plus DEC, BIN, OCT, and HEX output modes. |
| Algebra | Complex values and visual 2×2 / 3×3 matrix and 2D / 3D vector editors. |
| History | Browser-persisted calculation tape; tap an entry to restore its expression or press and hold to copy its result. |
| Responsive interaction | Display-triggered mobile keypad, a compact scientific toggle, desktop keyboard shortcuts, and light/dark themes. |

## Installation

Use a current Node.js release and npm.

```bash
git clone https://github.com/khalidhasan-m/scientific-calculator.git
cd scientific-calculator
npm install
```

Start the local development server:

```bash
npm run dev
```

Vite prints the local URL after startup. Open that address in a modern browser to use the calculator.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server on all local interfaces. |
| `npm run build` | Creates an optimized production client bundle in `dist/`. |
| `npm run preview` | Opens a local Vite preview of the production client build. |

For a production-style local run:

```bash
npm run build
npm run preview
```

## Using the calculator

Enter an expression with the keypad or the expression editor, then press **=** or `Enter`. The calculator preserves normal arithmetic precedence and supports parentheses. The **AC** key resets the active calculation without deleting saved history. Use the **Clear** action inside the History drawer only when you intend to remove stored history entries.

> **History gestures:** Tap a history row to restore the original expression. Press and hold the same row to copy only its result.

## Supported scientific functions

The table below documents the built-in controls and expression helpers available from the calculator interface. Standard Math.js functions that are compatible with the active expression scope are also evaluated by the underlying engine.[1]

### Arithmetic, powers, roots, and display modes

| Category | Supported controls and expressions | Notes |
| --- | --- | --- |
| Core arithmetic | `+`, `-`, `*`, `/`, `%`, `(`, `)`, `±`, `Ans` | Supports precedence, nested parentheses, percent insertion, and answer recall. |
| Powers | `x²`, `x³`, `xʸ`, `10ˣ`, `eˣ` | Inserted as `^2`, `^3`, `^`, `10^`, and `exp(`. |
| Roots and reciprocal | `√`, `ⁿ√`, `x⁻¹` | Uses `sqrt(`, `nthRoot(`, and inverse-power entry. |
| Logs | `log`, `ln`, `logₐ` | Uses `log(`, `ln(`, and `logBase(`. |
| Result formats | `a/b`, `ENG`, DEC / BIN / OCT / HEX | Switches result presentation; base conversion applies to finite integer results. |

### Trigonometric and hyperbolic functions

| Category | Supported functions | Angle behavior |
| --- | --- | --- |
| Trigonometric | `sin`, `cos`, `tan`, `cot` | Uses the active **DEG**, **RAD**, or **GRAD** mode. |
| Inverse trigonometric | `asin`, `acos`, `atan`, `acot` | Returns values using the active angle mode. |
| Hyperbolic | `sinh`, `cosh`, `tanh` | Evaluated as real-valued hyperbolic functions. |
| Inverse hyperbolic | `asinh`, `acosh`, `atanh` | Available from the Functions panel. |

### Probability, statistics, and numerical tools

| Category | Supported functions and controls | Example |
| --- | --- | --- |
| Combinatorics | `nPr(n, r)`, `nCr(n, r)`, `n!` | `nCr(8, 2)` |
| Random values | `Ran#`, `RanInt` | Generates a random decimal or an integer from `0` to `99`. |
| Absolute value | `abs(` | `abs(-42)` |
| Single-variable statistics | Add data, Mean, `σ`, `Σ` | Store data values, then calculate mean, standard deviation, or sum. |
| Numerical calculus | `integral("formula", a, b)`, `diff("formula", x)` | `integral("x^2", 0, 1)` or `diff("x^2", 2)` |
| Coordinate conversion | `polar(x, y)`, `rect(radius, theta)` | Uses the active angle mode for the angle component. |

### Memory, constants, complex values, matrices, and vectors

| Category | Supported feature | Notes |
| --- | --- | --- |
| Memory and registers | `M+`, `M−`, `RCL M`, `STO`, `RCL`, `A`–`F`, `X`, `Y` | Memory and named registers persist locally when browser storage is available. |
| Constants | `π`, `e`, `c`, `h` | The expression scope also exposes `G` for the gravitational constant. |
| Complex values | `i`, real/imaginary helpers | Math.js complex-number syntax is supported. |
| Matrices | Visual 2×2 / 3×3 insertion, `det`, `inv` | The visual editor inserts Math.js-ready matrix expressions. |
| Vectors | 2D / 3D insertion, `dot`, `cross`, addition, subtraction | Cross product is available for 3D vectors. |

## Keyboard controls

| Input | Action |
| --- | --- |
| `0`–`9`, `.`, `+`, `-`, `*`, `/`, `%`, `(`, `)`, `^` | Inserts an expression token. |
| `x` or `×` | Inserts multiplication. |
| `÷` | Inserts division. |
| `Enter` or numpad Enter | Evaluates the expression. |
| `Backspace` | Deletes the previous character or selection. |
| `Delete` or `Escape` | Resets the current expression to `0`; Escape closes history first when it is open. |
| `Ctrl`/`Cmd` + `L` | Focuses and selects the expression editor. |
| `Alt` + `S`, `C`, `T`, `O` | Inserts sine, cosine, tangent, or cotangent. |
| `Alt` + `G` | Cycles the angle mode. |
| `Alt` + `H` | Opens or closes history. |
| `Alt` + `1`–`4` | Switches to Functions, Memory, Data, or Algebra. |

## Persistence and privacy

When browser local storage is available, the calculator stores its history, statistics data, memory, named variables, theme preference, angle mode, and function-panel visibility locally in the browser. No account or remote data service is required for calculator use.

## Project structure

```text
scientific-calculator/
├── client/
│   ├── index.html                  # Calculator markup and accessible controls
│   └── src/
│       ├── main.js                 # State, actions, and user-interaction wiring
│       ├── scientific-engine.js    # Math.js scope and scientific helpers
│       ├── modules/                # Storage, history rendering, tactile feedback
│       └── styles/                 # Theme, controls, workspace, responsive CSS
├── server/                         # Production-serving compatibility layer
├── package.json                    # Scripts and dependencies
└── README.md                       # Project documentation
```

## Contributing locally

Keep calculator functions in `client/src/scientific-engine.js`, live UI state and action routing in `client/src/main.js`, reusable browser-only behavior in `client/src/modules/`, and focused styling in `client/src/styles/`. Before sharing a change, verify both compact mobile and desktop layouts and run:

```bash
npm run build
```

## References

[1]: https://mathjs.org/ "Math.js documentation"
