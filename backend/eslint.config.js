import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base JS config
  js.configs.recommended,

  // TypeScript config
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        node: true,
        es2020: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-throw-literal": "error",

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-useless-path-segments": "error",

      // Security rules
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",

      // Best practices
      "no-console": "warn",
      "no-debugger": "error",
      "no-return-await": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "object-shorthand": "error",
      "no-else-return": "error",
      "no-useless-return": "error",
      "no-param-reassign": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",

      // Async/Await patterns
      "no-promise-executor-return": "error",
      "max-nested-callbacks": ["error", 3],

      // Code quality
      complexity: ["warn", 10],
      "max-depth": ["error", 4],
      "max-lines": ["warn", 300],
      "max-params": ["error", 4],

      // Prettier integration
      "prettier/prettier": "error",
    },
  },

  // Test files override
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "max-lines": "off",
      "max-nested-callbacks": "off",
    },
  },

  // Migration/seed files override
  {
    files: ["**/migrations/**/*.ts", "**/seeds/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "max-lines": "off",
    },
  },

  // Config files override
  {
    files: ["**/config/**/*.ts", "**/constants/**/*.ts"],
    rules: {
      "max-lines": "off",
    },
  },

  // Prettier config (must be last)
  prettier,
];
