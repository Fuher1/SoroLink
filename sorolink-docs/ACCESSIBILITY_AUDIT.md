# Dashboard accessibility audit (WCAG 2.1 AA)

Issue #30. Scope: `sorolink-frontend/src` (dashboard, error pages, layout).

## Method

- Manual review of all JSX against the `eslint-plugin-jsx-a11y` recommended
  rule set and the axe-core rules exercised by `e2e/accessibility.spec.ts`.
- `npm run lint:a11y` (isolated toolchain in `sorolink-frontend/tools/a11y-lint`)
  now enforces every jsx-a11y recommended rule as an error; the
  `Frontend accessibility lint` CI job fails on any new violation.

## Level A violations fixed in this change

| # | Location | Rule / criterion | Fix |
|---|----------|------------------|-----|
| 1 | Scenario card | axe `nested-interactive`, WCAG 4.1.2 | Card is no longer `role="button"` wrapping the favourite/preview buttons. A real `<button class="scenario-select">` carries the scenario name. |
| 2 | Scenario card | WCAG 4.1.2 (state not exposed) | The select button exposes `aria-pressed` for the selected scenario and is described by the scenario description. |
| 3 | Offline import and compare file pickers | WCAG 2.1.1 Keyboard | Inputs used `display:none`, so keyboard users couldn't reach them. Now visually hidden (`sr-only`) with a `:focus-within` outline on the label. |
| 4 | Decorative SVG icons | WCAG 1.1.1 | Marked `aria-hidden="true"` / `focusable="false"`. |
| 5 | Card index numbers | WCAG 1.3.1 | Decorative `01/02/…` counters hidden from assistive tech. |

## Remaining AA / follow-up items (to file as separate issues)

1. **Colour contrast (1.4.3, AA):** verify `--muted` text on the cream
   background and `#b8c5bc` on the selected card with axe in a real browser.
2. **Result mode tabs:** the Report/Compare `role="tab"` buttons have no
   `aria-controls`, no `tabpanel`, and no arrow-key navigation. Either complete
   the tabs pattern or switch to `aria-pressed` toggle buttons.
3. **Status vs alert roles:** some containers combine `role="alert"` with
   `aria-live="polite"`; align them on one politeness level.
4. **External links:** links with `target="_blank"` don't say they open a
   new tab.
5. **e2e audit coverage:** `e2e/accessibility.spec.ts` imports
   `axe-playwright`, which isn't in `package.json`; add it so the automated
   axe audit runs in CI.
