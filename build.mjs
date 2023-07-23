import { copyFile, readdir, mkdir, unlink, lstat, rmdir } from "fs/promises";
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
await mkdir("./dist/pages");
await mkdir("./dist/pages/public");

// Copy static files for analytics page.
await copyFile("./src/analytics/index.html", "./dist/pages/index.html");
await copyFile("./node_modules/socket.io/client-dist/socket.io.js", "./dist/pages/public/socket.io.js");

if (exists("./src/analytics/public")) {
    for (const file of await readdir("./src/analytics/public")) {
        copyFile(`./src/analytics/public/${file}`, `./dist/pages/public/${file}`);
    }
}

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

// Analytics Page
console.log("Building Analytics...");
try {
    const analytics = await rollup({
        input: "./src/analytics/index.ts",
        onwarn: () => { return; },
        plugins
    });

    await analytics.write({
        file: "./dist/pages/public/index.js",
        format: "cjs",
        compact: true
    });
    await analytics.close();

    console.log("Successfully built Analytics!");
} catch (err) {
    console.error(`Failed to build Analytics:\n ${err}`);
    process.exit(1);
}

if (process.argv.includes("--run")) {
    console.log("Running bloxflip-autocrash...");
    execSync("node .", { stdio: "inherit" });
}
