import { checkAuth } from "@bf/user.js";
import { Logger } from "@utils/logger.js";
import { startBrowser, page } from "@utils/browser.js";
import { startServer } from "@server/server.js";
import { readFileSync, existsSync } from "node:fs";
import { checkUpdates } from "@utils/updater.js";
import { sleep } from "@utils/sleep.js";
import { fetchConfig } from "@utils/config.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autocrash");

    await fetchConfig();
    await startServer();
    await startBrowser();
    await Logger.createLog();

    await checkUpdates();
    await checkAuth();

    await sleep(5000);
    if (existsSync("./dist/userscript.js")) {
        const autoCrash = readFileSync("./dist/userscript.js", "utf-8");
        page.evaluate(autoCrash);
    } else {
        Logger.error("BFAC", "Unable to read UserScript, make sure that UserScript is built.", { forceClose: true });
    }
})();

export { page };
