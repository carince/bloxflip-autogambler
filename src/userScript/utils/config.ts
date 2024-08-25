import { Config } from "@utils/types.js";

import Logger from "./logger.js";
import { serverWs } from "./server.js";

let config: Config;

async function fetchConfig(): Promise<void> {
    try {
        if (config?.auth) return await Logger.info("CONFIG", "Already fetched config, returning...");
        serverWs.emit("get-config", (data: any) => {
            config = data as Config;
        });
        return await Logger.info("CONFIG", "Successfully fetched config.");
    } catch (err) {
        return Logger.error("CONFIG", `Unable to fetch config from server.\n${err}`, { forceClose: true });
    }
}

export { config, fetchConfig };
