import startWebsocket from "@bf/index.js";
import { login } from "@bf/user.js";
import { startBrowser } from "@utils/browser.js";
import { startCli } from "@utils/cli.js";
import { fetchConfig } from "@utils/config.js";
import Logger from "@utils/logger.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autogambler");

    await fetchConfig();
    await login();
    await startBrowser();
    await startWebsocket();
    await startCli();
})();
