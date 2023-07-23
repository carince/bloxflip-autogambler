import { Logger } from "./logger.js";
import { serverWs } from "./ws.js";

type Config = {
    auth: string,
    bet: {
        tries: number,
        startingBet: number,
        autoCashout: number
    }
    rain: {
        enabled: boolean;
        minimum: number;
    }
}

let config: Config;

async function fetchConfig() {
    try {
        if (config?.auth) return Logger.info("CONFIG", "Already fetched config, returning...");
        const fetchedConfig = await serverWs.emitWithAck("get-config");
        config = fetchedConfig as Config;
        Logger.info("CONFIG", "Successfully fetched config.");
    } catch (err) {
        Logger.error("CONFIG", `Unable to fetch config from server.\n${err}`);
    }
}

export { fetchConfig, config };
