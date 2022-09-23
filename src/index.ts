import { Page } from "puppeteer";
import { initialize } from "./utils/browser";
import { startCrash } from "./bloxflip/crash";
import { startRain } from "./bloxflip/rain";
import { Logger } from "./utils/logger";

let page: Page;

(async () => {
    Logger.log("STARTUP", "Starting bloxflip-farmer");

    page = await initialize();

    await Promise.all([startCrash(), startRain()]);
})();

export { page };
