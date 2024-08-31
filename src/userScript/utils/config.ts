import sleep from "@utils/sleep.js";

import Logger from "./logger.js";
import { serverWs } from "./server.js";

type Config = {
    auth: string;
    tries: number;
    starting_bet: number;
    autocashout: number;
    rain: {
        enabled: boolean;
        minimum: number;
        autojoin: {
            enabled: boolean;
        };
        notifications: {
            enabled: boolean;
            link: string;
            ping_id: string;
        };
    };
    debugging: {
        verbose: boolean;
        rain_only: boolean;
        headless: boolean;
        chrome_options: string[];
    };
};

let config: configInt = {
    auth: "",
    bet: {
        tries: 100,
        custom: 0,
        multiplier: 2
    },
    rain: {
        enabled: false,
        minimum: 0
    }
};

async function fetchConfig(): Promise<void> {
    try {
        if (config?.auth) return await Logger.info("CONFIG", "Already fetched config, returning...");
        serverWs.emit("get-config", async (data: any) => {
            config = data as Config;
        });
        await sleep(1000);
        return await Logger.info("CONFIG", "Successfully fetched config.");
    } catch (err) {
        return Logger.error("CONFIG", `Unable to fetch config from server.\n${err}`, { forceClose: true });
    }
}

export { config, fetchConfig };
