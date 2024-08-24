import json from "json5";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";
import { Config } from "@types";

let config: Config;

async function fetchCfg() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    try {
        if (!existsSync(join(__dirname, "..", "config.json5"))) return Logger.error("CONFIG", "config.json not found.", { forceClose: true });
        config = await json.parse(readFileSync(join(__dirname, "..", "config.json5"), "utf-8"));
        Logger.info("CONFIG", "Fetched config.json.");

        if (config.auth.length === 0) {
            Logger.error("TOKEN", "Token is empty, please put a valid token.");
        }

        if (config.bet.tries < 10) {
            Logger.warn("CONFIG", "It is not recommended to set the tries below 10, exit the script with CTRL+C if you want to make changes.");
            await sleep(3000);
        }
    } catch (err) {
        Logger.error("CONFIG", "Unabled to read config.json.", { forceClose: true });
    }
}

export { fetchCfg, config };
