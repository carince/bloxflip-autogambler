import { readdir, mkdir, unlink, lstat, rmdir } from "fs/promises";
import { existsSync as exists } from "fs";
import { execSync } from "child_process";

import { rollup } from "rollup";
import ts from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import esbuild from "rollup-plugin-esbuild";

const plugins = [
    ts(),
    swc(),
    esbuild({
        minify: false,
        treeShaking: false,
        format: "esm"
    })
];

// Clear and make paths
async function delDirRecursively(path) {
    if (!exists(path)) return;

    for (const file of await readdir(path)) {
        const filePath = `${path}/${file}`;
        if ((await lstat(filePath)).isDirectory()) {
            await delDirRecursively(filePath);
        } else {
            console.log(`Deleting file: ${filePath}`);
            await unlink(filePath);
        }
    }

    console.log(`Deleting folder: ${path}`);
    await rmdir(path);
}
await delDirRecursively("./dist");

await mkdir("./dist");

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
        input: "./src/userScript/index.ts",
        onwarn: () => { return; },
        plugins
    });

    await userScript.write({
        file: "./dist/userscript.js",
        format: "cjs",
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
