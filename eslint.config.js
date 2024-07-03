import globals from "globals";
import pluginJs from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules as fix } from "@eslint/compat";
import sis from "eslint-plugin-simple-import-sort";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  { 
    files: ["src/**/*.ts"],
    ignores: ["eslint.config.js"]
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json"
      }
    }
  },
  pluginJs.configs.recommended,
  ...fix(compat.extends("airbnb-base")),
  ...fix(compat.extends("airbnb-typescript/base")),
  {
    "rules": {
      "indent": "off",
      "quotes": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-mutable-exports": "off",
      "@typescript-eslint/indent": ["error", 4],
      "@typescript-eslint/quotes": ["error", "double"],
      "@typescript-eslint/naming-convention": "off",
      "no-underscore-dangle": "off"
    }
  }, 
  {
    plugins: {
      "simple-import-sort": sis,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];