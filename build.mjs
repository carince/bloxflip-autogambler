/* eslint-disable no-console */
import { execSync } from "child_process";
import * as esbuild from "esbuild";

// Backend
function buildBackend() {
    try {
        console.log("Building Backend...");

        esbuild.build({
            entryPoints: ["src/backend/index.ts"],
            target: "node22",
            bundle: true,
            format: "esm",
            packages: "external",
            minify: true,
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true,
            treeShaking: true,
            outfile: "dist/index.js",
        });

        console.log("Successfully built Backend!");
    } catch (err) {
        console.error(`Failed to build Backend:\n ${err}`);
        process.exit(1);
    }
}

// UserScript
function buildUserscript() {
    try {
        console.log("Building Userscript...");

        esbuild.build({
            entryPoints: ["src/userscript/index.ts"],
            target: "chrome127",
            bundle: true,
            format: "esm",
            packages: "bundle",
            treeShaking: true,
            outfile: "dist/userscript.js",
        });

        console.log("Successfully built Userscript!");
    } catch (err) {
        console.error(`Failed to build Userscript:\n ${err}`);
        process.exit(1);
    }
}

await Promise.all([
    buildBackend(),
    buildUserscript(),
]);

if (process.argv.includes("--run")) {
    console.log("Running bloxflip-autogambler...");
    try {
        execSync("node .", { stdio: "inherit" });
    } catch (_x) {
        console.log("bloxlfip-autogambler closed.");
    }
}
