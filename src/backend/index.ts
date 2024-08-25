import { existsSync, readFileSync } from "node:fs";

import login from "@bf/user.js";
import { startServer } from "@server/index.js";
import { browser, startBrowser } from "@utils/browser.js";
import { fetchConfig } from "@utils/config.js";
import Logger from "@utils/logger.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autogambler");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autogambler");

    await fetchConfig();
    await startServer();
    await startBrowser();
    await login();

    if (existsSync("./dist/userscript.js")) {
        const autoCrash = readFileSync("./dist/userscript.js", "utf-8");
        const [page] = await browser.pages();
        page.evaluate(autoCrash);
    } else {
        Logger.error("BFAC", "Unable to read UserScript, make sure that UserScript is built.", { forceClose: true });
    }
})();
