import { copyFile, readdir, mkdir, unlink, lstat, rmdir, writeFile, readFile } from "fs/promises";
import { existsSync as exists } from "fs";
import { execSync } from "child_process";
import json from "json5";
import { join } from "node:path";

import { rollup } from "rollup";
import ts from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import esbuild from "rollup-plugin-esbuild";
import cjs from "@rollup/plugin-commonjs"

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
await mkdir("./dist/nopecha");
await mkdir("./dist/pages");
await mkdir("./dist/pages/public");

// Copy static files for analytics page.
await copyFile("./src/pages/index.html", "./dist/pages/index.html");

if (exists("./src/pages/public")) {
    for (const file of await readdir("./src/pages/public")) {
        copyFile(`./src/pages/public/${file}`, `./dist/pages/public/${file}`);
    }
}

// Backend
console.log("Building Backend...");
try {
    const backend = await rollup({
        input: "./src/index.ts",
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

// Analytics Page
console.log("Building Analytics...");
try {
    plugins.unshift(cjs())
    const analytics = await rollup({
        input: "./src/pages/index.ts",
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

// NopeCHA Extension config
const configPath = "./config.json5"
if (!exists(configPath)) {
    console.error(`Config was not found. \nExpected config at path: ${configPath}`);
}

const config = await json.parse(await readFile(configPath, { encoding: "utf-8" }));
const nopechaPath = join("lib", "nopecha", "manifest.json");
const nopechaConfig = await json.parse(await readFile(nopechaPath, { encoding: "utf-8" }));
nopechaConfig.nopecha.key = config.rain.autojoin.key
await writeFile(nopechaPath, JSON.stringify(nopechaConfig, null, "\t"))

function startBFAG() {
    try {
        execSync("node .", { stdio: "inherit", windowsHide: true });
    } catch (err) {
        console.log(`bloxflip-autogambler closed! Error:\n${err}`)
    }

    if (process.argv.includes("--autorestart")) {
        console.log("Restarting bloxflip-autogambler...")
        startBFAG()
    }
}

if (process.argv.includes("--run")) {
    console.log("Running bloxflip-autogambler...");
    startBFAG()
}