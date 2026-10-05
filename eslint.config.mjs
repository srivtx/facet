import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",
    
    // React rules
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    
    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    
    // General JavaScript rules
    "prefer-const": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  // Vendored third-party primitives. Synced from upstream rather than
  // hand-authored, so the React Compiler-era rules that upstream code predates
  // are scoped off here instead of patched into files a re-sync would overwrite.
  // Everything else — including type-aware and correctness rules — still applies.
  files: [
    "src/components/facet/aceternity/**/*.{ts,tsx}",
    "src/components/facet/canvas/**/*.{ts,tsx}",
    "src/components/facet/bits/**/*.{ts,tsx}",
  ],
  rules: {
    "react-hooks/immutability": "off",
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/refs": "off",
    "react-hooks/preserve-manual-memoization": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "react-hooks/unsupported-syntax": "off",
    // NOT disabled: rules-of-hooks. Scoping this off is what let
    // rb-counter (early return above useSpring) and rb-model-viewer
    // (useGLTF/useLoader inside a useMemo callback) reach main. It is a
    // correctness rule, not a style preference — keep it on everywhere.
  }
}, {
  // public/** is served verbatim and never enters the module graph, but it does
  // hold vendored third-party runtime code (three's Draco WASM decoder).
  // Linting it flags minified upstream we are not allowed to edit.
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "public/**", "next-env.d.ts", "examples/**", "skills", "scripts/**"]
}];

export default eslintConfig;
