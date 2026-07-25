import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-JS/TS project content that must never be linted: a Python
    // virtualenv (bundled JS assets inside site-packages crash ESLint's
    // formatter with huge minified files), vendored third-party source, and
    // build/tooling output.
    "node_modules/**",
    ".venv/**",
    ".vendor/**",
    ".wrangler/**",
    ".vinext/**",
    "dist/**",
  ]),
]);

export default eslintConfig;
