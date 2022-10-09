import { Page } from "puppeteer";
import { startCrash } from "./bloxflip/crash";
import { Logger } from "./utils/logger";
import { sleep } from "./utils/sleep";
import { initialize } from "./utils/browser";
let page: Page;

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");

    await sleep(1000);

    page = await initialize();

    await startCrash();
})();

export { page };
