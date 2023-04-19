import { Logger } from "./logger.js";

interface configInt {
    auth: string;
    bet: {
        tries: number;
        custom: number;
    }
    rain: {
        enabled: boolean;
        minimum: number;
    }
}

let config: configInt = {
    auth: "",
    bet: {
        tries: 100,
        custom: 0
    },
    rain: {
        enabled: false,
        minimum: 0
    }
};

async function fetchCfg() {
    if (localStorage.getItem("BFAC_config")) {
        config = JSON.parse(localStorage.getItem("BFAC_config")!);
    } else {
        return Logger.error("CONFIG", "Unable to parse config.", true);
    }
}

export { fetchCfg, config };
