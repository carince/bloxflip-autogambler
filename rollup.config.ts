import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { typescriptPaths as paths } from "rollup-plugin-typescript-paths";

const plugins = [
    paths({ preserveExtensions: true, nonRelative: true }),
    esbuild(
        {
            minify: true,
            treeShaking: true,
            target: "esnext",
            format: "esm"
        }
    )
];

export default defineConfig([
    {
        input: "src/backend/index.ts",
        treeshake: true,
        cache: true,
        external: ["json5", "chalk", "puppeteer", "puppeteer-extra", "puppeteer-extra-plugin-stealth", "node-notifier", "express", "node:fs", "node:path", "node:url", "node:child_process"],
        output: {
            file: "dist/index.js",
            compact: true,
            format: "esm",
            strict: true,
            sourcemap: false
        },
        plugins: plugins
    },
    {
        input: "src/userScript/index.ts",
        treeshake: true,
        cache: true,
        output: {
            file: "dist/userScript.js",
            compact: true,
            format: "cjs",
            strict: true,
            sourcemap: false
        },
        plugins: plugins
    }
]);
