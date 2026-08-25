# Calculator Frontend Modules

The calculator controller remains in `main.js`, while focused modules isolate browser persistence, history rendering and copying, and mobile tactile feedback. This keeps shared behaviors reusable without separating the calculation state from the actions that coordinate it.

| Module | Responsibility |
| --- | --- |
| `storage.js` | Safe local persistence for calculator settings, registers, history, and statistics. |
| `history.js` | History drawer rows, result-copy feedback, and empty-state rendering. |
| `tactile.js` | Press state, touch-position ripple, optional vibration, and synthesized tap sound. |

The accompanying `styles/` directory separates theme tokens, button and motion rules, scientific-workspace styles, and responsive layouts. The modular stylesheet has been visually checked in compact mobile and desktop scientific-workspace views.
