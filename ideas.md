# Calculator Design Direction

## Three Explorations

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Instrument Panel | A precise, tactile calculator inspired by well-made technical instruments and stationery. It feels calm rather than flashy. | 0.06 |
| Pocket Play | A cheerful, rounded keypad with bright fruit accents and friendly visual energy. | 0.03 |
| Monochrome Ledger | An editorial, black-and-paper interface that treats each calculation as a small written note. | 0.08 |

## Chosen Direction: Glass Calculator

**Design Movement:** Contemporary mobile glassmorphism inspired by premium smartphone utility interfaces.

**Core Principles:** The interface is purposefully spare; circular touch targets are immediate and forgiving; luminous depth comes from frosted layers, not borders; the display and orange operation controls remain instantly recognizable.

**Color Philosophy:** A near-black indigo environment creates depth and lets the glass surface read clearly. Frosted charcoal keys form the quiet base layer; cool-white utility keys and a saturated orange operation set the mobile-calculator hierarchy.

**Layout Paradigm:** A phone-like floating panel occupies the lower visual center, with generous breathing room above the large calculation output and no supporting dashboard structure.

**Signature Elements:** Circular controls, a translucent black glass body, and a subtle ambient blue-purple glow give the interface its identity.

**Interaction Philosophy:** Inputs are tactile and unambiguous. Each round key compresses slightly on press; keyboard input has no delay; errors state the problem plainly and reset on the next number entry.

**Animation:** Key presses scale to 0.94 over 120 ms with a crisp ease-out. The display settles in through a 140 ms opacity transition only when the result changes. All nonessential animation is disabled for reduced-motion preferences.

**Typography System:** Use `SF Pro Display` with a system fallback for a native utility feeling. The display is oversized, light-weight, tabular, and right-aligned; controls use medium weight for clear touch readability.

**Brand Essence:** A tactile glass calculator for people who want familiar controls with a refined depth. **Direct, polished, tactile.**

**Brand Voice:** Nearly silent, direct, and functional. The interface relies on the display rather than product language; generic welcome language is excluded.

**Wordmark & Logo:** No visible wordmark. The calculator stands on its control system and material treatment.

**Signature Brand Color:** Calculator Orange — `#FF9F0A`.

## Style Decisions

- The glass panel uses dark translucent material and a cool, restrained ambient glow rather than decorative imagery.
- Every keypad action is a circular touch target; orange identifies all mathematical operations consistently.
- A compact control bar exposes only the necessary extensions: history, scientific mode, and appearance.
- Scientific functions expand as a concise companion row so the primary calculator remains familiar.
- History is a slide-out private workspace: entries are readable, reusable, and never overwhelm the calculator surface.
- Scientific mode uses an explicit DEG/RAD selector so trigonometric results are predictable; cotangent joins sine, cosine, and tangent as a first-class control.
- The scientific upgrade follows a workspace model: a direct expression editor remains primary while a tabbed advanced-math deck reveals dense capabilities without turning the standard calculator into an overwhelming control wall.
- The scientific workspace is now the persistent calculator face: mobile users work inside a bounded viewport with a compact internal tool deck, and matrices/vectors gain dedicated visual entry surfaces rather than opaque text templates.
