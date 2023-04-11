import { connectWs } from "./utils/ws.js";
import { fetchCfg } from "./utils/config.js";
import { startCrash } from "./bloxflip/crash.js";
import { keepAlive } from "./utils/keepAlive.js";

async function autoCrash() {
    try {
        console.log("[BFAC] Running autocrash...");

        await fetchCfg();
        await connectWs();

        Promise.all([startCrash(), keepAlive()]);

    } catch (err) {
        console.error(`[BFAC] Error occured, killing AutoCrash. \n${err}`);
    }
} autoCrash();
