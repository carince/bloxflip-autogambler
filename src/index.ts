import { Page } from "puppeteer";
import { Logger } from "./utils/logger";
import { initialize } from "./utils/browser";
import { startCrash } from "./bloxflip/crash";
let page: Page;

(async () => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");

    await sleep(1000);

    page = await initialize();

    await startCrash();
})();

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { page };
