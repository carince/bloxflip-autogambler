import json from "json5";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Logger } from "./logger.js";
import { sleep } from "./sleep.js";

interface configInt {
    auth: string;
    tries: number;
    webhook: {
        enabled: boolean;
        link: string;
        modules: {
            rain: {
                enabled: boolean;
                os_notifs: boolean;
                minimum: number;
                ping_id: number;
            };
            analytics: boolean;
        }
    };
    debugging: {
        headless: boolean,
        verbose: boolean,
        exitOnError: boolean
        ssOnError: boolean;
    }
}

let config: configInt;

async function fetchCfg() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    try {
        (async (): Promise<void> => {
            config = await json.parse(readFileSync(join(__dirname, "..", "..", "config.json"), "utf-8"));
            Logger.info("CONFIG", "Fetched config.json.");

            if (config.auth.length < 1000) {
                Logger.error("TOKEN", "Token length is less than 1000, please put a valid token.");
            }

            if (config.tries < 10) {
                Logger.warn("CONFIG", "It is not recommended to set the tries below 10, exit the script with CTRL+C if you want to make changes.");
                await sleep(3000);
            }
        })();
    } catch (err) {
        Logger.error("CONFIG", `Unable to read config.json\n${err}`, true);
    }
}

export { fetchCfg, config };
