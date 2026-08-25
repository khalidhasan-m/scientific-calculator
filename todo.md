# Glass Calculator Refresh

- [x] Replace the instrument-panel framing with a dark, atmospheric glass interface.
- [x] Restyle the display and keypad with iPhone-inspired hierarchy, spacing, and circular controls.
- [x] Keep calculator math, keyboard controls, and error handling intact.
- [x] Build and visually verify the refreshed calculator before delivery.

## Calculator Extensions

- [x] Add a restrained press animation and browser-synthesized tap sound to all calculator controls.
- [x] Add a compact control bar with History and Scientific mode actions.
- [x] Add a keyboard-accessible slide-out history panel with clear and reuse controls.
- [x] Record completed equations and results in the history panel.
- [x] Add a scientific keypad with trigonometric, logarithmic, power, square-root, constant, and sign functions.
- [x] Add percentage calculation support and a visible percentage control.
- [x] Add a light/dark theme switch with an equally polished glass treatment in both appearances.
- [x] Verify the new flows at desktop and mobile widths before delivery.

## History Copy Control

- [x] Add a visible, accessible copy button to every calculation history result.
- [x] Copy the selected result through the Clipboard API with a graceful fallback and clear confirmation state.
- [x] Build and visually verify the history copy controls before delivery.

## Equation and Trigonometry Corrections

- [x] Correct chained equation evaluation and the resulting expression history.
- [x] Add cotangent and make sin, cos, tan, and cot use an explicit angle mode.
- [x] Verify standard and scientific equations before delivery.

## Keyboard Support

- [x] Add complete keyboard mappings for standard calculator actions and clear focus behavior.
- [x] Add keyboard shortcuts for scientific functions and the DEG/RAD selector.
- [x] Verify keyboard operations with source-level interaction tests before delivery.

## History Equation Insertion

- [x] Make selected history entries load their complete previous equation into the current calculator input.
- [x] Preserve history copy controls and make the insertion feedback explicit.
- [x] Verify equation insertion before delivery.

## Comprehensive Scientific Calculator

- [x] Integrate a robust JavaScript expression engine with parentheses, fractions, powers, and scientific notation support.
- [x] Implement extended arithmetic, roots, logarithms, exponentials, trigonometric, inverse, and hyperbolic functions.
- [x] Add answer memory, memory registers, named variables, constants, and variable storage controls.
- [x] Add probability, statistics, random-number, calculus, coordinate, base-N, complex, matrix, and vector tools.
- [x] Build an organized scientific workspace that keeps advanced features usable on desktop and mobile.
- [x] Add focused tests for representative operations across every calculator toolset.

## Visual Matrix and Vector Editor

- [x] Add an accessible editor for 2×2 and 3×3 matrices with size switching and editable cells.
- [x] Add a visual 2D/3D vector editor with component inputs and operation presets.
- [x] Insert formatted matrix/vector expressions into the active calculation and evaluate them through the existing engine.
- [x] Verify the editor interactions and responsive layout before delivery.

## Persistent Scientific Mobile Layout

- [x] Remove the basic-only mode and keep the advanced scientific workspace visible by default.
- [x] Resize the mobile scientific workspace so controls remain usable without excessive scrolling.
- [x] Verify the full scientific layout at mobile and desktop sizes before delivery.

## Mobile Visibility Correction

- [x] Rework the scientific workspace height so it does not hide the primary keypad on phone screens.
- [x] Keep advanced scientific controls available through a compact, separately scrollable region.
- [x] Verify every essential mobile control is visible and reachable before delivery.

## Scroll Affordance and Landscape Layout

- [x] Add a subtle visible cue that the scientific function panel scrolls for more tools.
- [x] Create a compact landscape-phone arrangement that uses horizontal space for controls and keypad.
- [x] Verify portrait and landscape mobile presentation before delivery.

## Top Bar and Touch Ripple

- [x] Remove the SCI text badge and More functions scroll label from the calculator interface.
- [x] Add a subtle, touch-position-aware button ripple that respects reduced-motion preferences.
- [x] Verify the top bar and touch interaction refinement before delivery.

## Scientific Panel Show and Hide

- [x] Remove scroll-only access from the scientific function panel.
- [x] Add an accessible Show functions / Hide functions toggle with persistent state.
- [x] Verify the expanded and collapsed mobile layouts before delivery.

## Clear State and Responsive Workspace

- [x] Make AC reset the expression, result, active answer state, and saved calculation history.
- [x] Hide the mobile keypad initially and reveal it through an accessible display-focused control.
- [x] Keep the full scientific function workspace expanded on tablet and desktop without a show/hide control.
- [x] Expand desktop keyboard mappings and provide a visible desktop shortcut reference.
- [x] Verify clearing, mobile reveal, desktop layout, and keyboard behaviors before delivery.

## Frontend Module Refactor

- [x] Split calculator JavaScript into focused modules for state, UI rendering, history, scientific tools, and input handling.
- [x] Split CSS into focused modules for theme, controls, scientific workspace, responsive layout, and motion.
- [x] Preserve the existing calculator behavior through the refactor and verify the module boundaries with a production build.

## Project Documentation

- [x] Document features, calculator modes, keyboard shortcuts, responsive behaviors, and browser persistence.
- [x] Document the JavaScript and CSS module structure with development and build commands.
- [x] Review the README for completeness and accuracy before delivery.

## Mobile System Keyboard Focus

- [x] Prevent calculator button taps from retaining focus in the mobile expression field.
- [x] Preserve explicit system keyboard access through the display and expression field only.
- [x] Verify mobile button interaction does not request the system keyboard before delivery.

## Calculator Controls and History Gestures

- [x] Restore the visible plus operator in the primary keypad.
- [x] Move parentheses, fraction display, and sign-toggle controls into the scientific function tools.
- [x] Make one tap on a history item paste its expression into the main display and press-and-hold copy its result.
- [x] Verify controls and history gestures on mobile and desktop before delivery.

## Post-Clear Input Correction

- [x] Ensure the first digit after AC replaces the zero placeholder rather than appending to it.
- [x] Verify clear-and-enter behavior for keypad and physical keyboard input before delivery.

## Zero-Key After Clear

- [x] Preserve the `0` placeholder when zero is the first digit entered after AC.
- [x] Verify that digits one through nine still replace the cleared placeholder before delivery.

## History Panel Visibility Repair

- [x] Identify why the history trigger or drawer is not visible in the current responsive layout.
- [x] Restore a consistently visible history control and working slide-out drawer.
- [x] Verify history visibility and interaction on mobile and desktop before delivery.

## History Persistence After AC

- [x] Confirm why AC deletes the saved calculation history.
- [x] Keep AC limited to resetting the active calculation while reserving history deletion for the drawer’s Clear button.
- [x] Verify saved entries remain available after AC and a page refresh.
