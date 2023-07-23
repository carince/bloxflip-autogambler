import json from "json5";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "@utils/logger.js";
import { Config } from "@types";
import { __dirname } from "@utils/constants.js";

let config: Config;

async function fetchConfig(): Promise<void> {
    const configPath = join(__dirname, "..", "config.json5");

    if (!existsSync(configPath)) {
        Logger.error("CONFIG", `Config was not found. \nExpected config at path: ${configPath}`);
    }

    config = await json.parse<Config>(readFileSync(configPath, "utf-8"));
    Logger.info("CONFIG", "Successfully fetched config.");
}

export { fetchConfig, config };
