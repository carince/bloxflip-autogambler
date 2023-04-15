import { checkAuth } from "./bloxflip/user.js";
import { getInfo } from "./bloxflip/data.js";
import { fetchCfg } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { startBrowser, page } from "@utils/browser.js";
import { sleep } from "@utils/sleep.js";
import { readFileSync, existsSync } from "node:fs";
import { startApi } from "@api/server.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");
    
    await fetchCfg();
    await startApi();
    await startBrowser();

    await checkAuth();
    await getInfo();
    
    await sleep(5000);
    if (existsSync("./dist/autoCrash.js")) {
        const autoCrash = readFileSync("./dist/autoCrash.js", "utf-8");
        Logger.info("BFAC", "Injecting UserScript...");
        page.evaluate(autoCrash);
    } else {
        Logger.error("BFAC", "Unable to read UserScript, make sure that UserScript is built.", true);
    }
})();

export { page };
