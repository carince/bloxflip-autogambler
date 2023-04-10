import { Page } from "puppeteer";
import { checkAuth } from "./bloxflip/user.js";
import { getInfo } from "./bloxflip/data.js";
import { fetchCfg } from "./utils/config.js";
import { Logger } from "./utils/logger.js";
import { initialize } from "./utils/browser.js";
let page: Page;

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");
    
    await fetchCfg();
    page = await initialize();

    await checkAuth();
    await getInfo();
    
})();

export { page };
