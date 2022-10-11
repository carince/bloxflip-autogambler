import { Page } from "puppeteer";
import { startCrash } from "./bloxflip/crash";
import { Logger } from "./utils/logger";
import { sleep } from "./utils/sleep";
import { initialize } from "./utils/browser";
import { updater } from "./utils/updater";
export let page: Page;
export const branch = "stable";

(async (): Promise<void> => {
    await updater();

    Logger.log("STARTUP", `Starting bloxflip-autocrash (${branch})`);
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");

    await sleep(1000);

    page = await initialize();

    await startCrash();
})();
