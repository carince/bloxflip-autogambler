import { __dirname } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { Config, configSchema } from "@utils/types.js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";

let config: Config;
const cliConfig = {
    paused: false,
};

async function fetchConfig(): Promise<void> {
    try {
        const configPath = join(__dirname, "..", "..", "config.yaml");

        if (!existsSync(configPath)) {
            throw new Error(`Configuration file not found at path: ${configPath}`);
        }

        const file = readFileSync(configPath, "utf8");
        const parsed = parse(file);
        const result = await configSchema.spa(parsed);

        if (!result.success) throw new Error(`Invalid configuration: ${JSON.stringify(result.error.errors, null, 2)}`);

        Logger.info("CONFIG", "Successfully fetched config.");
        config = result.data;
    } catch (e) {
        Logger.error("CONFIG", e instanceof Error ? e.message : "Unknown Error.", { forceClose: true });
        throw e;
    }
}

export { cliConfig, config, fetchConfig };
