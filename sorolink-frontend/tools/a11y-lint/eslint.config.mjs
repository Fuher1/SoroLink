// Issue #30: accessibility lint for the dashboard.
// Every jsx-a11y "recommended" rule is an error, so CI fails on any new
// critical (WCAG level A) violation. Run from sorolink-frontend with:
//   npm run lint:a11y
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  { ignores: [".next/**", "node_modules/**", "tools/**", "e2e/**"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    linterOptions: { reportUnusedDisableDirectives: "off" },
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];
