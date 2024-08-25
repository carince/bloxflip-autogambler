import { execSync } from "child_process";

import { rollup } from "rollup";
import ts from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import esbuild from "rollup-plugin-esbuild";
import cjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve"

const plugins = [
    ts(),
    swc(),
    esbuild({
        minify: false,
        treeShaking: false,
        format: "esm"
    })
];


// Backend
console.log("Building Backend...");
try {
    const backend = await rollup({
        input: "./src/backend/index.ts",
        onwarn: () => { return; },
        plugins
    });

    await backend.write({
        file: "./dist/index.js",
        format: "esm",
        compact: true
    });
    await backend.close();

    console.log("Successfully built Backend!");
} catch (err) {
    console.error(`Failed to build Backend:\n ${err}`);
    process.exit(1);
}

// UserScript 
console.log("Building UserScript...");
try {
    const userScript = await rollup({
        input: "./src/userscript/index.ts",
        plugins: [
            resolve(),
            cjs(),
            ts(),
            swc(),
            esbuild({
                minify: false,
                treeShaking: false,
                format: "esm",
            })
        ]
    });

    await userScript.write({
        file: "./dist/userscript.js",
        format: "esm",
        compact: true
    });
    await userScript.close();

    console.log("Successfully built UserScript!");
} catch (err) {
    console.error(`Failed to build UserScript:\n ${err}`);
}


if (process.argv.includes("--run")) {
    console.log("Running bloxflip-autocrash...");
    execSync("node .", { stdio: "inherit" });
}
