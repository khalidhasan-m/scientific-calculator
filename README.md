# Scientific Calculator

A responsive, browser-based scientific calculator with an expression editor, advanced mathematical tools, calculation history, memory registers, visual matrix/vector input, desktop keyboard support, and a glass-inspired interface.

The application is implemented with **HTML, Tailwind CSS, and modular JavaScript**. Mathematical expression parsing and advanced numerical operations are provided by **Math.js**.

## Overview

The calculator is designed to work in three complementary contexts. On compact phones, the keypad remains hidden until the result display is tapped, keeping the scientific workspace uncluttered. On tablets and desktop screens, the full scientific workspace is expanded beside the utility controls and keypad. Calculation history, settings, variables, and user interface preferences persist locally in the browser when storage is available.

| Area | What it provides |
| --- | --- |
| Expression editor | Direct entry of arithmetic and supported Math.js expressions. Press **Enter** to evaluate. |
| Scientific workspace | Tabbed functions, memory, data/statistics, and algebra/matrix tools. |
| Keypad | Number entry, operators, parenthesis, sign toggle, fraction-display toggle, delete, and active-calculation reset controls. |
| History drawer | Previous expressions and results, reusable expressions, press-and-hold result copying, and complete history clearing. |
| Responsive behavior | Compact display-triggered keypad on phones; full, non-collapsed scientific layout on tablets and desktops. |

## Features

### Core calculation

The expression editor accepts standard arithmetic, parentheses, powers, decimal values, percentages, scientific notation, and supported Math.js functions. The calculator follows normal arithmetic precedence and displays errors for invalid or undefined operations.

The **AC** control resets the expression to `0`, clears the displayed answer, and resets active output formatting to automatic decimal mode. It intentionally preserves saved calculation history, memory, and named variable registers.

| Control | Behavior |
| --- | --- |
| `AC` | Clears the active expression, result, answer value, and output mode while preserving saved history. |
| `DEL` | Deletes the selected content or the character before the caret. |
| `±` | Wraps the active expression as a negated value. |
| `a/b` | Toggles fraction-oriented result display when available. |
| `ENG` | Toggles engineering notation for the result display. |
| `Ans` | Inserts the most recently calculated answer. |

### Scientific functions

The **Functions** tab covers trigonometric, inverse trigonometric, hyperbolic, inverse hyperbolic, exponent, root, logarithmic, probability, random, numerical calculus, and coordinate-conversion tools.

| Category | Included operations |
| --- | --- |
| Trigonometry | `sin`, `cos`, `tan`, `cot`, inverse functions, and DEG/RAD/GRAD angle modes. |
| Hyperbolics | `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, and `atanh`. |
| Powers and roots | Square, cube, arbitrary power, reciprocal, square root, and n-th root. |
| Logarithms and exponentials | Base-10 log, natural log, arbitrary-base log, `10^x`, and `e^x`. |
| Probability | Factorial, permutations, combinations, absolute value, random decimal, and random integer generation. |
| Numerical tools | Definite integration and numerical differentiation expressions. |
| Coordinate tools | Polar-to-rectangular and rectangular-to-polar conversion expressions. |

### Memory, registers, constants, and statistics

The **Memory** tab supports `M+`, `M−`, memory recall, answer insertion, and named registers: `A`, `B`, `C`, `D`, `E`, `F`, `X`, and `Y`. It also exposes common constants including `π`, `e`, the speed of light constant, and Planck’s constant.

The **Data** tab stores single-variable data points and provides mean, standard deviation, summation, and display-base controls for decimal, binary, octal, and hexadecimal output.

### Algebra, complex numbers, matrices, and vectors

The **Algebra** tab provides complex-number entry and real/imaginary-part helpers. It also includes two visual editors:

| Editor | Capabilities |
| --- | --- |
| Matrix editor | 2×2 or 3×3 matrix entry with insertion, determinant, and inverse actions. |
| Vector editor | 2D or 3D vector components with dot product, cross product, addition, and subtraction actions. |

Each visual editor creates a valid calculator expression and inserts it at the active expression cursor, ready for inspection or evaluation.

## History and persistence

The History button opens a slide-out calculation tape. Tap a row to restore its earlier expression in the editor, or press and hold it to copy its result while preserving the active expression. The **Clear** button inside the history drawer is the only control that deletes saved history; **AC** resets only the active calculation state.

The application uses browser local storage when available for history, statistics, memory, named variables, angle mode, theme preference, and scientific-panel visibility. If storage is unavailable, the calculator remains usable for the current browser session without persistence.

## Responsive interaction model

### Mobile

On narrow screens, the keypad begins hidden. Tap or keyboard-activate the large result display to reveal it, or use the explicit **Show keypad** control. Once displayed, the same control can hide the keypad again. The scientific workspace uses an explicit **Show functions / Hide functions** control instead of an internally scrolling tool list.

### Tablet and desktop

At tablet and desktop widths, all scientific functions remain expanded and the show/hide control is removed. The workspace occupies the left side of the layout, while the utility strip and keypad remain available at the right. This keeps the scientific functions, primary operations, and result display visible together.

### Touch feedback and accessibility

Calculator buttons provide a short press state, a subtle ripple originating from the touch position, optional vibration on supported devices, and a lightweight synthesized tap sound. Non-essential motion is disabled when the browser requests reduced motion. Buttons and the result display retain keyboard focus behavior and accessible labels.

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
| `Alt` + `G` | Cycles angle mode. |
| `Alt` + `H` | Opens or closes history. |
| `Alt` + `1`–`4` | Switches to Functions, Memory, Data, or Algebra. |

## Project structure

```text
simple-calculator/
├── client/
│   ├── index.html                  # Calculator markup and accessible control labels
│   └── src/
│       ├── main.js                 # Application controller, state, actions, and event wiring
│       ├── scientific-engine.js    # Math.js expression configuration and scientific helpers
│       ├── styles.css              # CSS composition entrypoint
│       ├── modules/
│       │   ├── storage.js          # Safe local-storage helpers
│       │   ├── history.js          # History rendering and result-copy handling
│       │   ├── tactile.js          # Ripple, press, vibration, and tap-sound feedback
│       │   └── README.md           # Short module-boundary reference
│       └── styles/
│           ├── theme.css           # Theme tokens, shell, typography, and display surfaces
│           ├── controls.css        # Buttons, keypad states, focus, and ripple motion
│           ├── workspace.css       # Scientific tabs, editors, history drawer, and workbench
│           └── responsive.css      # Phone, landscape, tablet, desktop, and reduced-motion rules
├── server/                         # Static production-serving compatibility layer
├── package.json                    # Scripts and dependencies
└── README.md                       # This project documentation
```

## Module responsibilities

The project deliberately keeps feature-specific code in small modules while leaving `main.js` as the orchestration layer that owns live calculator state and routes interface actions.

| File | Responsibility |
| --- | --- |
| `main.js` | Coordinates state, Math.js evaluation, calculator actions, editor insertion, responsive visibility, and event listeners. |
| `scientific-engine.js` | Defines the supported expression scope and scientific helper functions. |
| `modules/storage.js` | Serializes and restores local preferences and calculator data safely. |
| `modules/history.js` | Renders history rows and provides copy-result feedback. |
| `modules/tactile.js` | Encapsulates press animation, ripple, vibration, and optional sound feedback. |
| `styles/*.css` | Separates visual concerns by theme, controls, workspace elements, and responsive behavior. |

## Development

Install dependencies and start the local development server:

```bash
pnpm install
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Run the static production server after building:

```bash
pnpm start
```

## Maintenance guidelines

Add new calculation functions to `scientific-engine.js` first, then expose them through the relevant scientific tab in `client/index.html`. Keep state-changing UI actions in `main.js`, and place reusable browser-only behavior in `client/src/modules/`. New styles should be added to the most focused file under `client/src/styles/` rather than returning to the CSS entrypoint.

When changing a user-facing flow, verify both compact mobile and desktop layouts. Build the project with `pnpm build` before publishing a revision.
