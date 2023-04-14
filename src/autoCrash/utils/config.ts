interface configInt {
    auth: string;
    tries: number;
    rain: {
        enabled: boolean;
        minimum: number;
    }
}

let config: configInt = {
    auth: "",
    tries: 100,
    rain: {
        enabled: false,
        minimum: 0
    }
};

async function fetchCfg() {
    if (localStorage.getItem("BFAC_config")) {
        config = JSON.parse(localStorage.getItem("BFAC_config")!)
    } else {
        return console.error(`[CONFIG] Unable to parse config.`)
    }
}

export { fetchCfg, config};
