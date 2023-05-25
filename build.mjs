import { copyFile, readdir, mkdir, unlink, lstat, rmdir } from "fs/promises";
import { existsSync as exists } from "fs";

import { rollup } from "rollup";
import ts from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import esbuild from "rollup-plugin-esbuild";

const plugins = [
    ts(),
    swc(),
    esbuild({
        minify: true,
        treeShaking: true,
        target: "esnext",
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
copyFile("./src/backend/pages/index.html", "./dist/pages/index.html");
for (const file of await readdir("./src/backend/pages/public")) {
    copyFile(`./src/backend/pages/public/${file}`, `./dist/pages/public/${file}`);
}

// Backend
console.log("Building backend...");
try {
    const backend = await rollup({
        input: "./src/backend/index.ts",
        onwarn: () => {},
        plugins
    });

    await backend.write({
        file: "./dist/index.js",
        format: "esm",
        compact: true
    }); 
    await backend.close();

    console.log("Successfully built backend!");
} catch (err) {
    console.error(`Failed to build backend:\n ${err}`);
    process.exit(1);
}

// UserScript 
console.log("Building userScript");
try {
    const userScript = await rollup({
        input: "./src/userScript/index.ts",
        onwarn: () => {},
        plugins
    });

    await userScript.write({
        file: "./dist/userScript.js",
        format: "cjs",
        compact: true
    }); 
    await userScript.close();

    console.log("Successfully built UserScript!");
} catch (err) {
    console.error(`Failed to build UserScript:\n ${err}`);
    process.exit(1);
}

// Analytics Page
console.log("Building Analytics");
try {
    const userScript = await rollup({
        input: "./src/backend/pages/index.ts",
        onwarn: () => {},
        plugins
    });

    await userScript.write({
        file: "./dist/pages/public/index.js",
        format: "cjs",
        compact: true
    }); 
    await userScript.close();

    console.log("Successfully built Analytics!");
} catch (err) {
    console.error(`Failed to build Analytics:\n ${err}`);
    process.exit(1);
}
