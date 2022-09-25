import { Page } from "puppeteer";
import { Logger } from "./utils/logger";
import { initialize } from "./utils/browser";
import { startCrash } from "./bloxflip/crash";
import { startRain } from "./bloxflip/rain";

let page: Page;

(async () => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");

    page = await initialize();

    await Promise.all([startCrash(), startRain()]);
})();

export { page };
