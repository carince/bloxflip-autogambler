import { parse } from "json5";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "./logger";
import { sleep } from "./sleep";

interface configInt {
    auth: string;
    tries: number;
    webhook: {
        enabled: boolean;
        link: string;
        modules: {
            rain: {
                enabled: boolean;
                minimum: number;
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

try {
    (async (): Promise<void> => {
        config = await parse(readFileSync(join(__dirname, "..", "..", "config.json"), "utf-8"));
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

export { config };
