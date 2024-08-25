import connectBloxflip from "./bloxflip/index.js";
import { updateWallet } from "./bloxflip/wallet.js";
import { fetchConfig } from "./utils/config.js";
import Logger from "./utils/logger.js";
import { connectServerWs } from "./utils/server.js";

(async () => {
    Logger.log("AC", "Starting Bloxflip AutoCrash...");

    try {
        await connectServerWs();
        await fetchConfig();
        await updateWallet();
        await connectBloxflip();
    } catch (err) {
        Logger.error("BFAC", `Error occured, killing AutoCrash. \n${err}`, { forceClose: true });
    }
})();
