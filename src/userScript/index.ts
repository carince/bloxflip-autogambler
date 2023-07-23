import { Logger } from "./utils/logger.js";
import { connectServerWs } from "./utils/ws.js";

(async () => {
    Logger.log("AC", "Starting Bloxflip AutoCrash...");

    try {
        await connectServerWs();
    } catch (err) {
        Logger.error("BFAC", `Error occured, killing AutoCrash. \n${err}`);
    }
})();
