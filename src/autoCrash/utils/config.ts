interface configInt {
    auth: string;
    tries: number;
}

const config: configInt = {
    auth: "",
    tries: 100
};

async function fetchCfg() {
    if (localStorage.getItem("BFAC_auth")) {
        config.auth = localStorage.getItem("BFAC_auth")!;
    } else {
        return console.error("[CONFIG] Authentication token not found.");
    }

    if (localStorage.getItem("BFAC_tries")) {
        config.tries = parseFloat(localStorage.getItem("BFAC_tries")!);
    } else {
        return console.error("[CONFIG] Tries not found.");
    }
}

export { fetchCfg, config};
