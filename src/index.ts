import startWebsocket from "@bf/index.js";
import { login } from "@bf/user.js";
import { startBrowser } from "@utils/browser.js";
import { config, fetchConfig } from "@utils/config.js";
import Logger from "@utils/logger.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-crash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autogambler");

    await fetchConfig();
    await login();
    if (config.rain.autojoin.enabled) await startBrowser();
    await startWebsocket();
})();
