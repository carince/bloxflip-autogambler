import { rollup } from "rollup";
import typescript from '@rollup/plugin-typescript';

import { readFile, writeFile, readdir } from "fs/promises";

// UserScript
try {
    console.log(`[UserScript] Building...`)
    const userScript = await rollup({
        input: `./src/autoCrash/index.ts`,
        onwarn: () => { },
        plugins: [typescript()]
    })

    await userScript.write({
        file: `./dist/autoCrash.js`,
        format: `esm`,
        compact: true,
    })
    console.log(`[UserScript] Successfully built UserScript.`)
} catch (err) {
    console.error(`[UserScript] Failed to build. \n${err}`)
    process.exit(1)
}

// Backend
try {
    console.log(`[Backend] Building...`)
    const backEnd = await rollup({
        input: `./src/index.ts`,
        onwarn: () => { },
        plugins: [typescript()]
    })

    await backEnd.write({
        file: `./dist/index.js`,
        format: `esm`,
        compact: true,
    })
    console.log(`[Backend] Successfully built Backend.`)
} catch (err) {
    console.error(`[Backend] Failed to build. \n${err}`)
    process.exit(1)
}